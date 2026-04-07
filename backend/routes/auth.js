const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');
const { sendEmail } = require('../config/mailer');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_dev';

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash it for security before storing
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otpCode, salt);

    // Save to DB (overwrites any existing old OTPs for this email by deleting them first)
    await Otp.deleteMany({ email });
    await new Otp({ email, otp: hashedOtp }).save();

    console.log(`\n============================\n[OTP SIMULATION DEPLOYED]\nEmail: ${email}\nOTP: ${otpCode}\n============================\n`);

    // Use consolidated mailer
    await sendEmail({
      to: email,
      subject: 'Verify Your Ceylon Wonders Account',
      title: 'Verify Your Account',
      content: 'Welcome! We are thrilled to have you join us. Enter the code below to complete your registration.',
      highlight: otpCode,
      footer: 'This code expires in 10 minutes. Do not share this code with anyone.'
    });
    
    res.json({ message: 'OTP dispatched successfully' });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ error: 'Failed to generate OTP' });
  }
});

// Register
router.post('/signup', async (req, res) => {
  try {
    const { name, username, email, password, otp, isLocal } = req.body;
    
    if (!otp) return res.status(400).json({ error: 'OTP is required' });

    // Validate OTP
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) return res.status(400).json({ error: 'OTP expired or not requested' });

    const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValidOtp) return res.status(400).json({ error: 'Invalid OTP code' });

    // Check existing
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'Email already exists' });
    
    user = await User.findOne({ username });
    if (user) return res.status(400).json({ error: 'Username already taken' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save
    user = new User({ name, username, email, password: hashedPassword, isLocal });
    await user.save();

    // Clear OTP record
    await Otp.deleteMany({ email });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        username: user.username,
        isAdmin: user.isAdmin,
        isLocal: user.isLocal
      } 
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

module.exports = router;

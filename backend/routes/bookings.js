const express = require('express');
const Booking = require('../models/Booking');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../config/mailer');

const router = express.Router();

// Send OTP for Booking Verification
router.post('/send-otp-booking', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash it for security 
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otpCode, salt);

    // Save to DB
    await Otp.deleteMany({ email });
    await new Otp({ email, otp: hashedOtp }).save();

    console.log(`\n============================\n[BOOKING OTP SIMULATION DEPLOYED]\nEmail: ${email}\nOTP: ${otpCode}\n============================\n`);

    await sendEmail({
      to: email,
      subject: 'Verify Your Hotel Booking Code',
      title: 'Booking Verification',
      content: 'You are one step away from your dream stay. Enter the code below to verify your email and proceed to payment.',
      highlight: otpCode,
      footer: 'Valid for 10 minutes. If you did not request this, please ignore this email.'
    });
    
    res.json({ message: 'Booking OTP dispatched' });
  } catch (error) {
    console.error('Booking OTP Error:', error);
    res.status(500).json({ error: 'Failed to generate code' });
  }
});


// Generate a random Reference ID
const generateRef = () => {
  return 'CW-' + Math.floor(100000 + Math.random() * 900000);
};

// Create new Booking
router.post('/', async (req, res) => {
  try {
    const bookingData = req.body;
    const { otp } = bookingData;
    if (!otp) return res.status(400).json({ error: 'Verification code is required' });

    // Validate OTP
    const otpRecord = await Otp.findOne({ email: bookingData.email });
    if (!otpRecord) return res.status(400).json({ error: 'Verification code expired or not requested' });

    const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValidOtp) return res.status(400).json({ error: 'Invalid verification code' });

    let ref = generateRef();
    
    // Ensure ref is unique just in case
    let exists = await Booking.findOne({ bookingRef: ref });
    while (exists) {
      ref = generateRef();
      exists = await Booking.findOne({ bookingRef: ref });
    }

    bookingData.bookingRef = ref;

    const newBooking = new Booking(bookingData);
    await newBooking.save();

    // Clear OTP
    await Otp.deleteMany({ email: bookingData.email });

    const { email, firstName, hotelName, destination, checkin, checkout, totalPrice } = bookingData;
    let nights = 0;
    if (checkin && checkout) {
      nights = Math.ceil(Math.abs(new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
    }

    console.log(`\n=========================================\n📧 EMAIL DISPATCH SIMULATOR\nTo: ${email}\nSubject: Booking Confirmation: ${hotelName}\nBooking Reference: ${ref}\nTotal Paid: $${totalPrice}\n=========================================\n`);

    await sendEmail({
      to: email,
      subject: `Booking Confirmed: ${hotelName}`,
      title: 'Booking Confirmed',
      content: `Hello ${firstName}, your reservation has been fully secured! Details: Hotel ${hotelName}, Duration ${nights || '?'} Nights, Destination ${destination}.`,
      highlight: `$${totalPrice}`,
      footer: `Your Reference ID: ${ref}. We look forward to hosting you!`
    });

    res.status(201).json({ message: 'Booking confirmed!', bookingRef: ref, booking: newBooking });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get user's bookings (mock authentication, just fetch all for now or filter by email)
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email) {
      query.email = email;
    }
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel Booking
router.put('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'Cancelled' }, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Contact Trip Planner - Custom Inquiry
router.post('/contact-planner', async (req, res) => {
  try {
    const { 
      name, email, phone, 
      arrivalDate, duration, 
      travelers, interests, 
      budget, requirements 
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required' });
    }

    console.log(`\n=========================================\n📬 NEW TRIP PLANNER INQUIRY\nFrom: ${name} (${email})\nInterests: ${interests}\n=========================================\n`);

    // Send notification to Admin
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `New Trip Inquiry from ${name}`,
      title: 'New Trip Planner Inquiry',
      content: `A new custom itinerary request has been received from ${name}. 
                Travelers: ${travelers}, Arrival: ${arrivalDate}, Duration: ${duration} Days.
                Interests: ${interests}.
                Budget: ${budget || 'Not specified'}.
                Special Requirements: ${requirements || 'None'}.`,
      highlight: `REPLY TO: ${email}`,
      footer: 'Please respond within 24 hours to secure the lead.'
    });

    res.json({ message: 'Inquiry sent successfully! Our experts will contact you soon.' });
  } catch (error) {
    console.error('Planner Error:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

module.exports = router;

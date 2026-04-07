const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');

// Dummy auth middleware for now
const mockAdminAuth = (req, res, next) => next();

router.get('/stats', mockAdminAuth, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const allBookings = await Booking.find();
    const revenue = allBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const activeUsers = await User.countDocuments();
    
    // Recent 5
    const recent = await Booking.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      revenue,
      totalBookings,
      activeUsers,
      recent
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

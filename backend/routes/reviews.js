const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// @route   GET /api/reviews
// @desc    Get all APPROVED reviews for public display
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/reviews/admin
// @desc    Get all reviews for moderation (Admin only)
router.get('/admin', async (req, res) => {
  try {
    // In a real app, verify admin role here
    const reviews = await Review.find().sort({ createdAt: -1 }).populate('user', 'name email');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/reviews
// @desc    Submit a new review (Status: pending by default)
router.post('/', async (req, res) => {
  try {
    const { user, name, rating, comment } = req.body;
    
    if (!user || !rating || !comment) {
      return res.status(400).json({ error: 'Please provide all details' });
    }

    const newReview = new Review({ user, name, rating, comment });
    await newReview.save();
    
    res.status(201).json({ message: 'Review submitted! It will appear after admin approval.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// @route   PUT /api/reviews/:id/approve
// @desc    Approve a review (Admin only)
router.put('/:id/approve', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review approved successfully', review });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Reject/Delete a review (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

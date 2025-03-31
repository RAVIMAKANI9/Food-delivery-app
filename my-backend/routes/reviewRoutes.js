const express = require('express');
const Review = require('../models/Review');
const router = express.Router();

// Create a new review
router.post('/', async (req, res) => {
    const { productId, userId, rating, comment } = req.body;
    try {
        const newReview = new Review({ productId, userId, rating, comment });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get reviews for a product
router.get('/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId }).populate('userId');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
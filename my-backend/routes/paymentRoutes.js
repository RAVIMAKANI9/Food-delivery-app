const express = require('express');
const Payment = require('../models/Payment');
const router = express.Router();

// Create a new payment
router.post('/', async (req, res) => {
    const { orderId, amount, method } = req.body;
    try {
        const newPayment = new Payment({ orderId, amount, method });
        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get payment details by order ID
router.get('/:orderId', async (req, res) => {
    try {
        const payment = await Payment.findOne({ orderId: req.params.orderId });
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
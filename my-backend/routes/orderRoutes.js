const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
    const { userId, items, total, deliveryAddress } = req.body;
    try {
        const newOrder = new Order({ userId, items, total, deliveryAddress });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all orders for a user
router.get('/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).populate('items.productId');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status
router.put('/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
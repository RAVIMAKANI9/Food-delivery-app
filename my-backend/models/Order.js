const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true },
        },
    ],
    total: { type: Number, required: true },
    deliveryAddress: String,
    status: { type: String, default: 'Pending' }, // e.g., Pending, Completed, Cancelled
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true }, // e.g., Credit Card, PayPal
    status: { type: String, default: 'Pending' }, // e.g., Pending, Completed
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
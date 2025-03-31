const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        phone: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('User ', userSchema);
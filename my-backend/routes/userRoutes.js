const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { fullName, email, password } = req.body;

    const existingUser  = await User.findOne({ email });
    if (existingUser ) {
        return res.status(400).json({ message: 'User  already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser  = new User({ fullName, email, password: hashedPassword });

    try {
        await newUser .save();
        res.status(201).json({ message: 'User  registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, password }); // Log the incoming data

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User  not found');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email } });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
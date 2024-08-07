// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log('Received username:', username);
    console.log('Received password:', password);

    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user._id, permission: user.permission }, process.env.SECRET, { expiresIn: '1h' });

        console.log('Login successful, sending token');
        res.json({ token, permission: user.permission });
    } catch (err) {
        console.error('Error in login:', err.message);
        res.status(500).json({ message: err.message });
    }
});

router.post('/register', async (req, res) => {
    const { username, password, permission } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            password: hashedPassword,
            permission
        });
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

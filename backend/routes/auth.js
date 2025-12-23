const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Basic unique check
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists' });

        // Default role is 'user'. Admin role creation should be restricted or handled via seed/direct DB access for safety, 
        // but for this demo, we can allow first user or manual role handling if needed. 
        // Logic stays: default 'user'.
        user = new User({ name, email, password, role: 'user' });
        await user.save();

        req.session.userId = user._id;
        req.session.role = user.role;
        res.status(201).json({ message: 'Registered successfully', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (user.isActive === false) {
            return res.status(403).json({ error: 'Your account has been blocked. Contact admin.' });
        }

        req.session.userId = user._id;
        req.session.role = user.role;
        res.json({ message: 'Logged in', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: 'Could not log out' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
    });
});

// Me (Check Session)
router.get('/me', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    try {
        const user = await User.findById(req.session.userId).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

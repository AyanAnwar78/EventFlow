const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const EventRequest = require('../models/EventRequest');

// Middleware: Verify Admin
const verifyAdmin = (req, res, next) => {
    if (req.session.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    next();
};

// Apply to all routes in this file
router.use(verifyAdmin);

// Get All Users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Manage User (Activate/Block/Change Role)
// In this basic version, we can just edit the user
router.put('/users/:id', async (req, res) => {
    try {
        const { role, name, email, isActive } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (role) user.role = role;
        if (name) user.name = name;
        if (typeof isActive !== 'undefined') user.isActive = isActive;
        // email change might need uniqueness check, skipping for simplicity

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Platform Stats
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalEvents = await Event.countDocuments();
        const totalRequests = await EventRequest.countDocuments();
        const pendingRequests = await EventRequest.countDocuments({ status: 'pending' });

        res.json({
            totalUsers,
            totalEvents,
            totalRequests,
            pendingRequests
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

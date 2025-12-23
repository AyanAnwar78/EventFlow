const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) return next();
    res.status(401).json({ error: 'Unauthorized' });
};

// GET /api/feedback - Public (Get all feedback)
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('user', 'name').sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/feedback - Private (Submit feedback)
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { comment, rating } = req.body;
        const User = require('../models/User');
        const user = await User.findById(req.session.userId);

        if (!user) return res.status(404).json({ error: 'User not found' });

        const feedback = new Feedback({
            user: user._id,
            name: user.name,
            comment,
            rating
        });

        await feedback.save();
        res.status(201).json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

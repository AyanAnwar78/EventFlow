const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const Event = require('../models/Event');

const isAuthenticated = (req, res, next) => {
    if (req.session.userId) return next();
    res.status(401).json({ error: 'Unauthorized' });
};

// Get Schedule for Event
router.get('/events/:id', async (req, res) => {
    try {
        const schedule = await Schedule.find({ event_id: req.params.id });
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Schedule Item
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { event_id, time, activity } = req.body;

        // Authorization Check
        const event = await Event.findById(event_id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        const isOwner = event.organizer.toString() === req.session.userId;
        const isAdmin = req.session.role === 'admin';

        if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Unauthorized' });

        const schedule = new Schedule({ event_id, time, activity });
        await schedule.save();
        res.status(201).json(schedule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

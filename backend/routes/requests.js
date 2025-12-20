const express = require('express');
const router = express.Router();
const EventRequest = require('../models/EventRequest');
const Event = require('../models/Event');
const User = require('../models/User');

const isAuthenticated = (req, res, next) => {
    if (req.session.userId) return next();
    res.status(401).json({ error: 'Unauthorized' });
};

// Create Request (User)
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { name, eventType, date, budget, requirements } = req.body;
        const request = new EventRequest({
            user_id: req.session.userId,
            name, eventType, date, budget, requirements,
            status: 'pending'
        });
        await request.save();
        res.status(201).json(request);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get My Requests (User)
router.get('/my', isAuthenticated, async (req, res) => {
    try {
        const requests = await EventRequest.find({ user_id: req.session.userId }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Requests (Admin)
router.get('/', isAuthenticated, async (req, res) => {
    if (req.session.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
        const requests = await EventRequest.find().populate('user_id', 'name email').sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Approve Request (Admin) -> Creates Event
router.post('/:id/approve', isAuthenticated, async (req, res) => {
    if (req.session.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

    try {
        const request = await EventRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ error: 'Request not found' });

        if (request.status !== 'pending') return res.status(400).json({ error: 'Request already processed' });

        // Create the event
        const event = new Event({
            name: request.name,
            date: request.date,
            location: 'To be decided', // Default, or ask admin to fill in
            description: `Event type: ${request.eventType}. Requirements: ${request.requirements}`,
            organizer: request.user_id // Assign requester as organizer
        });
        await event.save();

        // Auto-promote User to Organizer
        await User.findByIdAndUpdate(request.user_id, { role: 'organizer' });

        request.status = 'approved';
        await request.save();

        res.json({ message: 'Request approved, event created, and user promoted to organizer.', event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reject Request (Admin)
router.post('/:id/reject', isAuthenticated, async (req, res) => {
    if (req.session.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

    try {
        const request = await EventRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ error: 'Request not found' });

        request.status = 'rejected';
        await request.save();

        res.json({ message: 'Request rejected' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

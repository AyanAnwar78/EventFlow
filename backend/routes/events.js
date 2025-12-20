const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Guest = require('../models/Guest');
const Schedule = require('../models/Schedule');

// Get All Events (Public/Filtered)
router.get('/', async (req, res) => {
    try {
        const { type } = req.query; // type can be 'upcoming' or 'past'
        let filter = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (type === 'upcoming') {
            filter.date = { $gte: today };
        } else if (type === 'past') {
            filter.date = { $lt: today };
        }

        const events = await Event.find(filter).populate('organizer', 'name').sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Single Event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'name');
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Middleware for modification
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) return next();
    res.status(401).json({ error: 'Unauthorized' });
};

// Create Event (Admin Only or Special Permission?) 
// Req says: "User cannot Create events directly (without admin approval)"
// So ONLY Admin creates events. Admin can create on behalf of user.
router.post('/', isAuthenticated, async (req, res) => {
    if (req.session.role !== 'admin') {
        return res.status(403).json({ error: 'Only admins can create events directly.' });
    }

    try {
        const { name, date, location, description, owner_id } = req.body;
        // Admin creates, assigns owner_id (User) as organizer. Returns User context.
        const organizerId = owner_id || req.session.userId;

        const event = new Event({
            name, date, location, description,
            organizer: organizerId
        });
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Event (Organizer (Owner) or Admin)
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        const isOwner = event.organizer.toString() === req.session.userId;
        const isAdmin = req.session.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: 'Unauthorized to edit this event' });
        }

        // Admin can override everything. Organizer can edit their event.
        const { name, date, location, description } = req.body;
        event.name = name || event.name;
        event.date = date || event.date;
        event.location = location || event.location;
        event.description = description || event.description;

        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Event (Admin Only)
// Req says: "Admin can delete any event". Users cannot.
router.delete('/:id', isAuthenticated, async (req, res) => {
    if (req.session.role !== 'admin') {
        return res.status(403).json({ error: 'Only Admins can delete events' });
    }

    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        // Cleanup
        await Guest.deleteMany({ event_id: event._id });
        await Schedule.deleteMany({ event_id: event._id });

        await event.deleteOne();
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

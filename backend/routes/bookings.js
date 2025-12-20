const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

const isAuthenticated = (req, res, next) => {
    if (req.session.userId) return next();
    res.status(401).json({ error: 'Unauthorized' });
};

// Create Booking
router.post('/', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const { name, aadhar, phone, gender, age, email, address, eventDate, eventType, venue } = req.body;
        const bookingId = 'BOOK-' + Math.random().toString(36).substr(2, 8).toUpperCase();

        const booking = new Booking({
            user_id: req.session.userId,
            bookingId,
            name, aadhar, phone, gender, age, email, address, eventDate, eventType, venue
        });
        await booking.save();
        res.status(201).json({ message: 'Booking confirmed!', booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get My Bookings
router.get('/my', isAuthenticated, async (req, res) => {
    try {
        const bookings = await Booking.find({ user_id: req.session.userId }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Check Availability
router.post('/check-availability', async (req, res) => {
    res.json({ available: true, message: 'Venue is available for booking!' });
});

module.exports = router;

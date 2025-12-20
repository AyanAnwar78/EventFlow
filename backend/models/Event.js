const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    guests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest' // Or User if guests are registered users, but keeping generic Guest model for now based on previous code
    }]
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);

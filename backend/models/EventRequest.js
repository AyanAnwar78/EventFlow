const mongoose = require('mongoose');

const EventRequestSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    eventType: { type: String, required: true },
    date: { type: Date, required: true },
    budget: { type: Number },
    requirements: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    admin_notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EventRequest', EventRequestSchema);

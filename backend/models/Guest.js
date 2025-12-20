const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // If the guest is a registered user
        default: null
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false // Email not required
    },
    rsvp_status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    }
}, { timestamps: true });

// Prevent duplicate RSVP for same user per event (only if user_id exists)
GuestSchema.index({ event_id: 1, user_id: 1 }, { unique: true, partialFilterExpression: { user_id: { $type: "objectId" } } });

// Prevent duplicate invitations for same email per event
GuestSchema.index({ event_id: 1, email: 1 }, { unique: true, partialFilterExpression: { email: { $type: "string" } } });

module.exports = mongoose.model('Guest', GuestSchema);

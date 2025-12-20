const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    aadhar: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventType: { type: String, required: true }, // e.g., Wedding, Birthday
    venue: { type: String, required: true },
    status: { type: String, default: 'Confirmed' } // Confirmed by default for this flow
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);

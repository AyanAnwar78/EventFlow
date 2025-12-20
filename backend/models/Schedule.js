const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    time: {
        type: String,
        required: true
    },
    activity: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Schedule', ScheduleSchema);

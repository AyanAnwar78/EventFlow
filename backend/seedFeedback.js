const mongoose = require('mongoose');
const Feedback = require('./models/Feedback');
const User = require('./models/User');
require('dotenv').config();

const seedFeedback = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event_management');

        // Find an existing user to associate feedback with
        const user = await User.findOne();
        if (!user) {
            console.log('No users found. Please register a user first.');
            process.exit(1);
        }

        const sampleFeedbacks = [
            {
                user: user._id,
                name: "Sarah Johnson",
                comment: "EventFlow turned my chaotic wedding planning into a dream experience! Highly recommended.",
                rating: 5
            },
            {
                user: user._id,
                name: "Michael Chen",
                comment: "The dashboard is so intuitive. Managing our corporate gala has never been easier.",
                rating: 5
            },
            {
                user: user._id,
                name: "Aman Gupta",
                comment: "Great platform, though I'd love more customization for the invites. Still, a solid 4 stars!",
                rating: 4
            }
        ];

        await Feedback.deleteMany({}); // Optional: clear existing
        await Feedback.insertMany(sampleFeedbacks);

        console.log('Sample feedback seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding feedback:', err);
        process.exit(1);
    }
};

seedFeedback();

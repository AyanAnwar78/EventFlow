const mongoose = require('mongoose');
require('dotenv').config();
const Event = require('./models/Event');
const User = require('./models/User');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event_management');
        console.log('Connected to DB');

        // Check for an organizer
        let organizer = await User.findOne({ role: 'organizer' });
        if (!organizer) {
            console.log('Creating demo organizer...');
            organizer = new User({
                name: 'Demo Organizer',
                email: 'org@demo.com',
                password: 'password',
                role: 'organizer'
            });
            await organizer.save();
        }

        // Create Past Event
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 5);

        await Event.create({
            name: 'Retro Coding Night',
            date: pastDate,
            location: 'Virtual Hall',
            description: 'A look back at old tech.',
            organizer: organizer._id
        });

        console.log('Past event seeded.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();

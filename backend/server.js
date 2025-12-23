const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./database');
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB().then(async () => {
    // Seed Admin
    const User = require('./models/User');
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
        const admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            console.log('Seeding Admin User from .env...');
            await User.create({
                name: 'Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            console.log('Admin User created.');
        } else {
            console.log('Admin User already exists.');
        }
    }
});

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true // Important for sessions
}));
app.use(express.json());

// Session Setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/event_management' }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: false
    }
}));

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/events', require('./routes/events'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/guests', require('./routes/guests'));
app.use('/api/feedback', require('./routes/feedback'));
// Bookings & Schedules removed as requested in previous flow refinements
// app.use('/api/bookings', require('./routes/bookings'));
// app.use('/api/schedules', require('./routes/schedules'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

# EventFlow - Event Management System

EventFlow is a comprehensive platform for event organizers to streamline guest RSVP tracking, schedule management, and event logistics coordination. The system simplifies event planning through intuitive tools for filtering guest responses, tracking invitation statuses, and ensuring seamless event execution.

## ✨ Features

### 📋 Guest Management
- **RSVP Tracking**: Monitor guest responses (Yes, No, Maybe) in real-time
- **Guest Filtering**: Filter responses by status, category, or custom tags
- **Invitation Tracking**: Track sent invitations, reminders, and follow-ups
- **Guest Profiles**: Store contact details, dietary restrictions, and preferences

### 🗓️ Schedule Management
- **Event Timeline**: Create and visualize event schedules
- **Session Planning**: Organize breakout sessions and activities
- **Resource Allocation**: Assign resources to different event segments
- **Calendar Integration**: Sync with popular calendar applications

### 📦 Logistics Coordination
- **Vendor Management**: Track vendor contacts and contracts
- **Inventory Tracking**: Monitor event supplies and equipment
- **Seating Arrangements**: Design and manage seating charts
- **Check-in System**: Streamline on-site guest registration

### 📊 Analytics & Reporting
- **Response Analytics**: Visualize RSVP trends and attendance rates
- **Event Insights**: Generate post-event reports and summaries
- **Export Capabilities**: Export guest lists and reports in multiple formats

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- PostgreSQL 12+ or MySQL 8+
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/eventflow.git
cd eventflow
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Initialize the database**
```bash
npm run db:migrate
npm run db:seed
```

5. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 🏗️ System Architecture

### Tech Stack
- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.io for live updates
- **Email**: Nodemailer for invitation management
- **Storage**: AWS S3 for file uploads (optional)

### Directory Structure
```
eventflow/
├── client/                 # Frontend application
├── server/                 # Backend API
│   ├── controllers/       # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API endpoints
│   └── middleware/       # Authentication & validation
├── shared/               # Shared utilities
└── docs/                # Documentation
```

## 📖 Usage Guide

### For Event Organizers

1. **Create an Event**
   - Set event details (name, date, venue)
   - Configure RSVP options
   - Design invitation templates

2. **Manage Guests**
   - Import guest lists via CSV or manual entry
   - Send bulk or individual invitations
   - Track response status with color-coded indicators

3. **Monitor Responses**
   - Use filters to view specific guest segments
   - Send automated reminders to pending RSVPs
   - Generate attendance forecasts

4. **Coordinate Logistics**
   - Assign tasks to team members
   - Schedule vendor deliveries
   - Print check-in materials

### For Team Members
- Collaborate on event planning
- Receive task assignments and notifications
- Access real-time guest updates

## 🔧 API Documentation

The system provides RESTful APIs for integration:

### Key Endpoints
- `GET /api/events` - List all events
- `POST /api/events` - Create new event
- `GET /api/events/:id/guests` - Get event guests
- `PUT /api/guests/:id/rsvp` - Update guest RSVP
- `GET /api/events/:id/analytics` - Get event analytics

For complete API documentation, visit `/api-docs` when running the application.

## 🔐 Security Features

- **Authentication**: JWT-based secure login
- **Authorization**: Role-based access control (Organizer, Staff, Guest)
- **Data Encryption**: Sensitive data encrypted at rest
- **Rate Limiting**: API request throttling
- **Audit Logs**: Track all system changes

## 📱 Mobile Responsive

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
```

## 🚢 Deployment

### Docker Deployment
```bash
docker build -t eventflow .
docker run -p 3000:3000 eventflow
```

### Environment Variables
Required environment variables:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/eventflow
JWT_SECRET=your_jwt_secret_here
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📚 [Documentation Wiki](https://github.com/yourusername/eventflow/wiki)
- 🐛 [Issue Tracker](https://github.com/yourusername/eventflow/issues)
- 💬 [Discussion Forum](https://github.com/yourusername/eventflow/discussions)
- 📧 Email: support@eventflow.example.com

## 🙏 Acknowledgments

- Icons provided by [React Icons](https://react-icons.github.io/react-icons/)
- UI components from [Material-UI](https://mui.com/)
- Chart visualizations with [Recharts](https://recharts.org/)

---

**EventFlow** –

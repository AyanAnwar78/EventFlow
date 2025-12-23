import React from 'react';
import { useAuth } from '../context/AuthContext';
import OrganizerDashboard from './OrganizerDashboard';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

const RoleDashboard = () => {
    const { user } = useAuth();
    if (!user) return null;
    switch (user.role) {
        case 'admin':
            return <AdminDashboard />;
        case 'organizer':
            return <OrganizerDashboard />;
        default:
            return <UserDashboard />;
    }
};

export default RoleDashboard;

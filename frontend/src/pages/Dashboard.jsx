import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Clock, Users, Mail, PieChart, BarChart3, Check, X, Search, Shield, ShieldOff, Send } from 'lucide-react';
import ImageScroller from '../components/ImageScroller';

// Categories with images for "Plan Your Event"
const categories = [
    { id: 'wedding', name: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 'birthday', name: 'Birthday', image: 'https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 'corporate', name: 'Corporate', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 'concert', name: 'Other', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 'anniversary', name: 'Anniversary', image: 'https://images.unsplash.com/photo-1561489413-985b06da5bee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
];

const Dashboard = () => {
    const { user } = useAuth();
    if (!user) return null;
    if (user.role === 'admin') return <AdminDashboard />;
    if (user.role === 'organizer') return <OrganizerDashboard />;
    return <UserDashboard />;
};

// --- ADMIN DASHBOARD ---
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [events, setEvents] = useState([]);

    // Invite State
    const [inviteData, setInviteData] = useState({ event_id: '', name: '', email: '' });
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedEventGuests, setSelectedEventGuests] = useState(null); // array of guests for specific event
    const [loadedGuests, setLoadedGuests] = useState(false); // trigger to reload

    // Fetch Data
    useEffect(() => {
        if (activeTab === 'overview') fetchStats();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'requests') fetchRequests();
        if (activeTab === 'events') fetchEvents();
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/stats', { credentials: 'include' });
            if (res.ok) setStats(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/users', { credentials: 'include' });
            if (res.ok) setUsers(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchRequests = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/requests', { credentials: 'include' });
            if (res.ok) setRequests(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchEvents = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/events?type=upcoming');
            if (res.ok) setEvents(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchGuestsForEvent = async (eventId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/guests/event/${eventId}`, { credentials: 'include' });
            if (res.ok) setSelectedEventGuests(await res.json());
        } catch (err) { console.error(err); }
    };

    const handleApproveRequest = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/requests/${id}/approve`, { method: 'POST', credentials: 'include' });
            if (res.ok) {
                alert('Request Approved & Event Created');
                fetchRequests();
            }
        } catch (err) { alert(err.message); }
    };

    const handleRejectRequest = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/requests/${id}/reject`, { method: 'POST', credentials: 'include' });
            if (res.ok) fetchRequests();
        } catch (err) { alert(err.message); }
    };

    const handleDeleteEvent = async (id) => {
        if (!confirm('Delete this event?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/events/${id}`, { method: 'DELETE', credentials: 'include' });
            if (res.ok) fetchEvents();
        } catch (err) { alert(err.message); }
    };

    // User Management
    const toggleUserStatus = async (user) => {
        const newStatus = !user.isActive; // if undefined assumes false, but db default is true. 
        // Safer: if user.isActive === false then true, else false.
        const isActive = user.isActive === false;

        if (!confirm(`Are you sure you want to ${!user.isActive === false ? 'BLOCK' : 'ACTIVATE'} ${user.name}?`)) return;

        try {
            const res = await fetch(`http://localhost:5000/api/admin/users/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !user.isActive }), // Toggle
                credentials: 'include'
            });
            if (res.ok) fetchUsers();
        } catch (err) { alert(err.message); }
    };

    const changeUserRole = async (user) => {
        const roles = ['user', 'organizer', 'admin'];
        const currentIndex = roles.indexOf(user.role);
        const nextRole = roles[(currentIndex + 1) % roles.length];

        if (!confirm(`Change role of ${user.name} to ${nextRole.toUpperCase()}?`)) return;
        try {
            const res = await fetch(`http://localhost:5000/api/admin/users/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: nextRole }),
                credentials: 'include'
            });
            if (res.ok) fetchUsers();
        } catch (err) { alert(err.message); }
    };

    // Invite Logic
    const openInvite = (event) => {
        setInviteData({ ...inviteData, event_id: event._id });
        fetchGuestsForEvent(event._id);
        setShowInviteModal(true);
    };

    const sendInvite = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/guests/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inviteData),
                credentials: 'include'
            });
            if (res.ok) {
                alert('Invitation Sent');
                setInviteData({ ...inviteData, name: '', email: '' });
                fetchGuestsForEvent(inviteData.event_id); // refresh list
            } else alert('Error sending invite');
        } catch (err) { alert(err.message); }
    };

    return (
        <div style={{ color: 'white' }}>
            <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<PieChart size={18} />}>Overview</TabButton>
                <TabButton active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} icon={<Mail size={18} />}>Requests ({requests.filter(r => r.status === 'pending').length})</TabButton>
                <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18} />}>Users</TabButton>
                <TabButton active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar size={18} />}>Events</TabButton>
            </div>

            {/* Content */}
            {activeTab === 'overview' && stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <StatCard title="Total Users" value={stats.totalUsers} icon={<Users color="#60a5fa" />} />
                    <StatCard title="Total Events" value={stats.totalEvents} icon={<Calendar color="#a78bfa" />} />
                    <StatCard title="Pending Requests" value={stats.pendingRequests} icon={<Mail color="#f472b6" />} />
                </div>
            )}

            {activeTab === 'requests' && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {requests.length === 0 && <p>No requests found.</p>}
                    {requests.map(req => (
                        <div key={req._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>{req.name} <span style={{ fontSize: '0.8rem', opacity: 0.7, background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{req.status}</span></h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Type: {req.eventType} | Date: {new Date(req.date).toLocaleDateString()}</p>
                                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>User: {req.user_id?.name} ({req.user_id?.email})</p>
                                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', fontStyle: 'italic' }}>"{req.requirements}"</p>
                            </div>
                            {req.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={() => handleApproveRequest(req._id)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Check size={16} /> Approve</button>
                                    <button onClick={() => handleRejectRequest(req._id)} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><X size={16} /> Reject</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'users' && (
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Email</th>
                            <th style={{ padding: '1rem' }}>Role</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>{u.name}</td>
                                <td style={{ padding: '1rem' }}>{u.email}</td>
                                <td style={{ padding: '1rem' }}>{u.role}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ color: u.isActive !== false ? '#4caf50' : '#f44336' }}>
                                        {u.isActive !== false ? 'Active' : 'Blocked'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '10px' }}>
                                    <button onClick={() => toggleUserStatus(u)} style={{
                                        background: u.isActive !== false ? 'rgba(244, 67, 54, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                                        color: u.isActive !== false ? '#f44336' : '#4caf50',
                                        border: '1px solid currentColor', borderRadius: '4px', padding: '0.2rem 0.6rem', cursor: 'pointer'
                                    }}>
                                        {u.isActive !== false ? 'Block' : 'Activate'}
                                    </button>
                                    <button onClick={() => changeUserRole(u)} style={{ background: 'transparent', border: '1px solid gray', color: 'gray', borderRadius: '4px', padding: '0.2rem 0.6rem', cursor: 'pointer' }}>
                                        Change Role
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {activeTab === 'events' && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {events.map(ev => (
                        <div key={ev._id} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <h4>{ev.name}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{new Date(ev.date).toLocaleString()} @ {ev.location}</p>
                                <p style={{ fontSize: '0.8rem' }}>Organizer: {ev.organizer?.name || 'Unknown'}</p>
                                <button onClick={() => openInvite(ev)} className="btn btn-secondary" style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
                                    <Mail size={14} style={{ marginRight: '5px' }} /> Invite / Track Guests
                                </button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <button onClick={() => handleDeleteEvent(ev._id)} className="btn btn-danger">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="glass-panel" style={{ width: '500px', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setShowInviteModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                        <h2>Manage Guests</h2>
                        <div style={{ margin: '1rem 0', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <h3>Send Invitation</h3>
                            <form onSubmit={sendInvite} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <input type="text" placeholder="Name" value={inviteData.name} onChange={e => setInviteData({ ...inviteData, name: e.target.value })} required style={{ padding: '0.5rem', flex: 1, borderRadius: '4px', border: 'none' }} />
                                <input type="email" placeholder="Email" value={inviteData.email} onChange={e => setInviteData({ ...inviteData, email: e.target.value })} required style={{ padding: '0.5rem', flex: 1, borderRadius: '4px', border: 'none' }} />
                                <button className="btn btn-primary"><Send size={16} /></button>
                            </form>
                        </div>
                        <h3>Guest List</h3>
                        {!selectedEventGuests || selectedEventGuests.length === 0 ? <p>No guests found.</p> : (
                            <table style={{ width: '100%', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left' }}>
                                        <th>Name</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedEventGuests.map(g => (
                                        <tr key={g._id}>
                                            <td>{g.name} <br /><span style={{ fontSize: '0.8rem', color: 'gray' }}>{g.email}</span></td>
                                            <td style={{ color: g.rsvp_status === 'accepted' ? '#4caf50' : g.rsvp_status === 'declined' ? '#f44336' : 'orange' }}>
                                                {g.rsvp_status.toUpperCase()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- USER DASHBOARD ---
const UserDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('explore');
    const [upcoming, setUpcoming] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [hostedEvents, setHostedEvents] = useState([]);
    const [myRsvps, setMyRsvps] = useState([]);
    const [requestForm, setRequestForm] = useState({ name: '', eventType: 'Birthday', date: '', budget: '', requirements: '' });

    useEffect(() => {
        if (activeTab === 'explore') { fetchExplore(); fetchMyRsvps(); }
        if (activeTab === 'requests') fetchMyRequests();
        if (activeTab === 'hosted') fetchHosted();
    }, [activeTab]);

    const fetchExplore = async () => {
        const res = await fetch('http://localhost:5000/api/events?type=upcoming');
        setUpcoming(await res.json());
    };

    const fetchMyRsvps = async () => {
        const res = await fetch('http://localhost:5000/api/guests/my', { credentials: 'include' });
        if (res.ok) setMyRsvps(await res.json());
    };

    const fetchMyRequests = async () => {
        const res = await fetch('http://localhost:5000/api/requests/my', { credentials: 'include' });
        setMyRequests(await res.json());
    };

    const fetchHosted = async () => {
        const res = await fetch('http://localhost:5000/api/events?type=upcoming');
        const all = await res.json();
        const myHosted = all.filter(e => e.organizer && (e.organizer._id === user.id || e.organizer === user.id));
        setHostedEvents(myHosted);
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestForm),
                credentials: 'include'
            });
            if (res.ok) {
                alert('Request Submitted!');
                setRequestForm({ name: '', eventType: 'Birthday', date: '', budget: '', requirements: '' });
                fetchMyRequests();
            } else alert('Error submitting request');
        } catch (err) { alert(err.message); }
    };

    const handleJoinEvent = async (eventId) => {
        try {
            const res = await fetch('http://localhost:5000/api/guests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event_id: eventId, rsvp_status: 'accepted' }),
                credentials: 'include'
            });
            if (res.ok) {
                alert('Joined event successfully!');
                fetchMyRsvps(); // refresh status
            } else alert('Error joining event');
        } catch (err) { alert(err.message); }
    };

    const handleLeaveEvent = async (eventId) => {
        if (!confirm('Are you sure you want to cancel your RSVP?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/guests/${eventId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                alert('RSVP Cancelled');
                fetchMyRsvps(); // refresh status
            } else alert('Error cancelling RSVP');
        } catch (err) { alert(err.message); }
    };

    // Helper to check if already joined
    const getRsvpStatus = (eventId) => {
        const rsvp = myRsvps.find(r => r.event_id._id === eventId || r.event_id === eventId);
        return rsvp ? rsvp.rsvp_status : null;
    };

    return (
        <div style={{ color: 'white' }}>
            {/* User Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Welcome, {user.name}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>What would you like to do today?</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <TabButton active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} icon={<Search size={18} />}>Explore Events</TabButton>
                <TabButton active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} icon={<Mail size={18} />}>My Requests</TabButton>
            </div>

            {activeTab === 'explore' && (
                <div>
                    <ImageScroller />

                    {/* Event Categories - Triggers Request Tab */}
                    <div style={{ marginBottom: '3rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Plan Your Event</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            {categories.map(cat => (
                                <div key={cat.id} className="glass-panel"
                                    style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                                    onClick={() => {
                                        setRequestForm(prev => ({ ...prev, eventType: cat.name }));
                                        setActiveTab('requests');
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div style={{ height: '120px' }}>
                                        <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: '0.8rem', textAlign: 'center' }}>
                                        <h4 style={{ margin: 0 }}>{cat.name}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calendar className="text-accent" /> Upcoming Events
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {upcoming.map(event => {
                            const status = getRsvpStatus(event._id);
                            return (
                                <div key={event._id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{
                                        height: '140px',
                                        background: 'linear-gradient(45deg, var(--accent), #a855f7)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                                    }}>
                                        <Calendar size={48} color="rgba(255,255,255,0.3)" />
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                                            <h3 style={{ margin: 0, color: 'white' }}>{event.name}</h3>
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <p style={{ color: 'var(--text-secondary)' }}>{new Date(event.date).toLocaleDateString()}</p>
                                        <p style={{ margin: '0.5rem 0' }}>{event.location}</p>
                                        <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', gap: '10px' }}>
                                            {status ? (
                                                <>
                                                    <button disabled className="btn" style={{ flex: 1, background: status === 'accepted' ? '#4caf50' : 'gray', cursor: 'default' }}>
                                                        {status.toUpperCase()}
                                                    </button>
                                                    <button onClick={() => handleLeaveEvent(event._id)} className="btn btn-danger" style={{ padding: '0.5rem' }} title="Cancel / Leave">
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button onClick={() => handleJoinEvent(event._id)} className="btn btn-primary" style={{ width: '100%' }}>Join Event</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {upcoming.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No upcoming events.</p>}
                    </div>
                </div>
            )}

            {activeTab === 'requests' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                    {/* List */}
                    <div>
                        <h3>My Requests Status</h3>
                        {myRequests.length === 0 && <p style={{ color: 'gray' }}>No requests yet.</p>}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            {myRequests.map(req => (
                                <div key={req._id} className="glass-panel" style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <strong>{req.name}</strong>
                                        <span style={{
                                            color: req.status === 'approved' ? '#4caf50' : req.status === 'rejected' ? '#f44336' : '#ffb74d',
                                            fontWeight: 'bold'
                                        }}>{req.status.toUpperCase()}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'gray' }}>{new Date(req.date).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3>Request New Event</h3>
                        <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <input type="text" placeholder="Event Name" value={requestForm.name} onChange={e => setRequestForm({ ...requestForm, name: e.target.value })} required className="input-field" style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }} />
                            <select value={requestForm.eventType} onChange={e => setRequestForm({ ...requestForm, eventType: e.target.value })} style={{ padding: '0.8rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }}>
                                <option>Birthday</option>
                                <option>Anniversary</option>
                                <option>Wedding</option>
                                <option>Corporate</option>
                                <option>Other</option>
                            </select>
                            <input type="datetime-local" value={requestForm.date} onChange={e => setRequestForm({ ...requestForm, date: e.target.value })} required style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }} />
                            <input type="number" placeholder="Budget ($)" value={requestForm.budget} onChange={e => setRequestForm({ ...requestForm, budget: e.target.value })} style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }} />
                            <textarea placeholder="Requirements / Details" value={requestForm.requirements} onChange={e => setRequestForm({ ...requestForm, requirements: e.target.value })} rows="3" style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }}></textarea>
                            <button className="btn btn-primary">Submit Request</button>
                        </form>
                    </div>
                </div>
            )}


        </div>
    );
};


// --- ORGANIZER DASHBOARD ---
const OrganizerDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [hostedEvents, setHostedEvents] = useState([]);

    // Invite State
    const [inviteData, setInviteData] = useState({ event_id: '', name: '', email: '' });
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedEventGuests, setSelectedEventGuests] = useState(null);

    useEffect(() => {
        if (activeTab === 'overview' || activeTab === 'tracking') fetchHosted();
    }, [activeTab]);

    const fetchHosted = async () => {
        const res = await fetch('http://localhost:5000/api/events?type=upcoming');
        const all = await res.json();
        // Filter: events where I am organizer
        const myHosted = all.filter(e => e.organizer && (e.organizer._id === user.id || e.organizer === user.id));
        setHostedEvents(myHosted);
    };

    const fetchGuestsForEvent = async (eventId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/guests/event/${eventId}`, { credentials: 'include' });
            if (res.ok) setSelectedEventGuests(await res.json());
        } catch (err) { console.error(err); }
    };

    // Invite Logic
    const openInvite = (event) => {
        setInviteData({ ...inviteData, event_id: event._id });
        fetchGuestsForEvent(event._id);
        setShowInviteModal(true);
    };

    const sendInvite = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/guests/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inviteData),
                credentials: 'include'
            });
            if (res.ok) {
                alert('Invitation Sent');
                setInviteData({ ...inviteData, name: '', email: '' });
                fetchGuestsForEvent(inviteData.event_id);
            } else alert('Error sending invite');
        } catch (err) { alert(err.message); }
    };

    // Simple stats for Overview
    const totalEvents = hostedEvents.length;

    return (
        <div style={{ color: 'white' }}>
            <h1 style={{ marginBottom: '2rem' }}>Organizer Dashboard</h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<PieChart size={18} />}>Overview</TabButton>
                <TabButton active={activeTab === 'tracking'} onClick={() => setActiveTab('tracking')} icon={<Users size={18} />}>Tracking & Invites</TabButton>
            </div>

            {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <StatCard title="Using Dashboard As" value="Organizer" icon={<Shield size={24} color="#60a5fa" />} />
                    <StatCard title="My Hosted Events" value={totalEvents} icon={<Calendar size={24} color="#a78bfa" />} />
                </div>
            )}

            {activeTab === 'tracking' && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {hostedEvents.map(ev => (
                        <div key={ev._id} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4>{ev.name}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{new Date(ev.date).toLocaleString()} @ {ev.location}</p>
                            </div>
                            <div>
                                <button onClick={() => openInvite(ev)} className="btn btn-secondary" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Mail size={16} /> Track / Invite
                                </button>
                            </div>
                        </div>
                    ))}
                    {hostedEvents.length === 0 && <p>No events found. Ask Admin to approve your requests.</p>}
                </div>
            )}

            {/* Reuse Invite Modal */}
            {showInviteModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="glass-panel" style={{ width: '500px', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setShowInviteModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                        <h2>Manage Guests</h2>
                        <div style={{ margin: '1rem 0', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <h3>Send Invitation</h3>
                            <form onSubmit={sendInvite} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <input type="text" placeholder="Name" value={inviteData.name} onChange={e => setInviteData({ ...inviteData, name: e.target.value })} required style={{ padding: '0.5rem', flex: 1, borderRadius: '4px', border: 'none' }} />
                                <input type="email" placeholder="Email" value={inviteData.email} onChange={e => setInviteData({ ...inviteData, email: e.target.value })} required style={{ padding: '0.5rem', flex: 1, borderRadius: '4px', border: 'none' }} />
                                <button className="btn btn-primary"><Send size={16} /></button>
                            </form>
                        </div>
                        <h3>Guest List</h3>
                        {!selectedEventGuests || selectedEventGuests.length === 0 ? <p>No guests found.</p> : (
                            <table style={{ width: '100%', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left' }}>
                                        <th>Name</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedEventGuests.map(g => (
                                        <tr key={g._id}>
                                            <td>{g.name} <br /><span style={{ fontSize: '0.8rem', color: 'gray' }}>{g.email}</span></td>
                                            <td style={{ color: g.rsvp_status === 'accepted' ? '#4caf50' : g.rsvp_status === 'declined' ? '#f44336' : 'orange' }}>
                                                {g.rsvp_status.toUpperCase()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- HELPERS ---
const TabButton = ({ children, active, onClick, icon }) => (
    <button onClick={onClick} style={{
        background: active ? 'var(--accent)' : 'transparent',
        border: active ? 'none' : '1px solid rgba(255,255,255,0.2)',
        color: 'white',
        padding: '0.6rem 1.2rem',
        borderRadius: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: 500,
        transition: 'all 0.3s'
    }}>
        {icon} {children}
    </button>
);

const StatCard = ({ title, value, icon }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            {icon}
        </div>
        <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{title}</p>
            <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{value}</h3>
        </div>
    </div>
);

export default Dashboard;

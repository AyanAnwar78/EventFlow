import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Mail, PieChart, BarChart3, Check, X, Search, Shield, ShieldOff, Send, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [events, setEvents] = useState([]);

    // Invite State
    const [inviteData, setInviteData] = useState({ event_id: '', name: '', email: '' });
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedEventGuests, setSelectedEventGuests] = useState(null);

    // Create Event State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newEventData, setNewEventData] = useState({ name: '', date: '', location: '', description: '', owner_email: '' });

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    // Fetch Data
    useEffect(() => {
        if (activeTab === 'overview') fetchStats();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'requests') fetchRequests();
        if (activeTab === 'events') fetchEvents();
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/stats`, { credentials: 'include' });
            if (res.ok) setStats(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/users`, { credentials: 'include' });
            if (res.ok) setUsers(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchRequests = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/requests`, { credentials: 'include' });
            if (res.ok) setRequests(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/events?type=upcoming`);
            if (res.ok) setEvents(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchGuestsForEvent = async (eventId) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/guests/event/${eventId}`, { credentials: 'include' });
            if (res.ok) setSelectedEventGuests(await res.json());
        } catch (err) { console.error(err); }
    };

    const handleApproveRequest = async (id) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/requests/${id}/approve`, { method: 'POST', credentials: 'include' });
            if (res.ok) {
                alert('Request Approved & Event Created');
                fetchRequests();
            }
        } catch (err) { alert(err.message); }
    };

    const handleRejectRequest = async (id) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/requests/${id}/reject`, { method: 'POST', credentials: 'include' });
            if (res.ok) fetchRequests();
        } catch (err) { alert(err.message); }
    };

    const handleDeleteEvent = async (id) => {
        if (!confirm('Delete this event?')) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/events/${id}`, { method: 'DELETE', credentials: 'include' });
            if (res.ok) fetchEvents();
        } catch (err) { alert(err.message); }
    };

    const toggleUserStatus = async (user) => {
        if (!confirm(`Are you sure you want to ${user.isActive === false ? 'ACTIVATE' : 'BLOCK'} ${user.name}?`)) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/users/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !user.isActive }),
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
            const res = await fetch(`${BACKEND_URL}/api/admin/users/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: nextRole }),
                credentials: 'include'
            });
            if (res.ok) fetchUsers();
        } catch (err) { alert(err.message); }
    };

    const openInvite = (event) => {
        setInviteData({ ...inviteData, event_id: event._id });
        fetchGuestsForEvent(event._id);
        setShowInviteModal(true);
    };

    const sendInvite = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BACKEND_URL}/api/guests/invite`, {
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

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BACKEND_URL}/api/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEventData),
                credentials: 'include'
            });
            if (res.ok) {
                alert('Event Created Successfully');
                setShowCreateModal(false);
                setNewEventData({ name: '', date: '', location: '', description: '', owner_email: '' });
                fetchEvents();
            } else {
                const data = await res.json();
                alert(data.error || 'Error creating event');
            }
        } catch (err) { alert(err.message); }
    };

    return (
        <div className="text-black min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black tracking-tight uppercase">Admin <span className="text-pink-600 italic">Dashboard</span></h1>
                <button onClick={() => setShowCreateModal(true)} className="bg-pink-600 hover:bg-pink-700 text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-pink-600/20 transition-all active:scale-95 flex items-center gap-2">
                    <Calendar size={18} /> Create New Event
                </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-3 mb-8 border-b border-pink-100 pb-4">
                <TabButton
                    active={activeTab === 'overview'}
                    onClick={() => setActiveTab('overview')}
                    icon={<PieChart size={18} />}
                    label="Overview"
                />
                <TabButton
                    active={activeTab === 'requests'}
                    onClick={() => setActiveTab('requests')}
                    icon={<Mail size={18} />}
                    label={`Requests (${requests.filter(r => r.status === 'pending').length})`}
                />
                <TabButton
                    active={activeTab === 'users'}
                    onClick={() => setActiveTab('users')}
                    icon={<Users size={18} />}
                    label="Users"
                />
                <TabButton
                    active={activeTab === 'events'}
                    onClick={() => setActiveTab('events')}
                    icon={<Calendar size={18} />}
                    label="Events"
                />
            </div>

            {/* Content */}
            {activeTab === 'overview' && stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                    <StatCard title="Total Users" value={stats.totalUsers} icon={<Users className="text-blue-600" />} color="bg-blue-50" />
                    <StatCard title="Total Events" value={stats.totalEvents} icon={<Calendar className="text-purple-600" />} color="bg-purple-50" />
                    <StatCard title="Pending Requests" value={stats.pendingRequests} icon={<Mail className="text-pink-600" />} color="bg-pink-50" />
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="space-y-4 animate-fadeIn">
                    {requests.length === 0 && <p className="text-gray-400 font-medium italic text-center py-10">No requests found.</p>}
                    {requests.map(req => (
                        <div key={req._id} className="bg-white/80 backdrop-blur-md border border-pink-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex-1">
                                <h3 className="text-xl font-black flex items-center gap-3">
                                    {req.name}
                                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold border ${req.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                        req.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                                        }`}>
                                        {req.status}
                                    </span>
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                                    <DetailItem label="Type" value={req.eventType} />
                                    <DetailItem label="Date" value={new Date(req.date).toLocaleDateString()} />
                                    <DetailItem label="Budget" value={`$${req.budget || '0'}`} />
                                    <DetailItem label="User" value={req.user_id?.name || 'Unknown'} />
                                </div>
                                {req.requirements && (
                                    <p className="mt-3 text-sm text-gray-500 font-medium italic bg-pink-50/50 p-2 rounded-lg border border-pink-100/50">
                                        "{req.requirements}"
                                    </p>
                                )}
                            </div>
                            {req.status === 'pending' && (
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => handleApproveRequest(req._id)} className="bg-green-600 hover:bg-green-700 text-black px-4 py-2.5 rounded-xl flex items-center gap-2 transition font-bold text-sm shadow-lg shadow-green-600/20 active:scale-95">
                                        <Check size={16} /> Approve
                                    </button>
                                    <button onClick={() => handleRejectRequest(req._id)} className="bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl flex items-center gap-2 transition font-bold text-sm active:scale-95">
                                        <X size={16} /> Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'users' && (
                <div className="overflow-x-auto bg-white/80 backdrop-blur-md border border-pink-100 rounded-3xl shadow-sm animate-fadeIn">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-pink-50/50 text-gray-600 border-b border-pink-50">
                                <th className="p-5 font-black uppercase text-xs tracking-widest">User Details</th>
                                <th className="p-5 font-black uppercase text-xs tracking-widest">Role</th>
                                <th className="p-5 font-black uppercase text-xs tracking-widest">Status</th>
                                <th className="p-5 font-black uppercase text-xs tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pink-50">
                            {users.map(u => (
                                <tr key={u._id} className="hover:bg-white transition group">
                                    <td className="p-5">
                                        <div className="font-bold text-black">{u.name}</div>
                                        <div className="text-xs text-gray-400 font-medium">{u.email}</div>
                                    </td>
                                    <td className="p-5 capitalize font-bold text-sm">
                                        <span className={`px-2 py-1 rounded-lg ${u.role === 'admin' ? 'bg-purple-100 text-purple-600 border border-purple-200' : u.role === 'organizer' ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <span className={`flex items-center gap-2 text-sm font-black ${u.isActive !== false ? 'text-green-600' : 'text-red-600'}`}>
                                            <div className={`w-2 h-2 rounded-full ${u.isActive !== false ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                            {u.isActive !== false ? 'ACTIVE' : 'BLOCKED'}
                                        </span>
                                    </td>
                                    <td className="p-5 flex gap-2 justify-end">
                                        <button onClick={() => toggleUserStatus(u)} className={`p-2 rounded-xl transition-all border-2 ${u.isActive !== false ? 'border-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600' : 'border-green-50 text-green-600 hover:bg-green-600 hover:text-white hover:border-green-600 shadow-lg shadow-green-600/10'}`}>
                                            {u.isActive !== false ? <ShieldOff size={18} /> : <Shield size={18} />}
                                        </button>
                                        <button onClick={() => changeUserRole(u)} className="p-2 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white transition-all shadow-sm border border-pink-100">
                                            <Users size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'events' && (
                <div className="grid gap-4 animate-fadeIn">
                    {events.map(ev => (
                        <div key={ev._id} className="bg-white/80 backdrop-blur-md border border-pink-100 rounded-3xl p-6 flex justify-between items-center transition hover:bg-white group shadow-sm">
                            <div className="flex gap-6 items-center">
                                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 shadow-inner">
                                    <Calendar size={32} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-black group-hover:text-pink-600 transition-colors uppercase tracking-tight">{ev.name}</h4>
                                    <div className="flex gap-4 mt-2">
                                        <p className="text-gray-500 text-xs font-bold uppercase flex items-center gap-1"><DetailItem value={new Date(ev.date).toLocaleString()} /></p>
                                        <p className="text-gray-500 text-xs font-bold uppercase flex items-center gap-1 border-l border-pink-100 pl-4">{ev.location}</p>
                                    </div>
                                    <p className="text-[10px] text-pink-500 font-black mt-2 tracking-widest">ORGANIZER: {ev.organizer?.name || 'UNASSIGNED'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <button onClick={() => openInvite(ev)} className="bg-white border-2 border-pink-100 text-pink-600 px-5 py-2.5 rounded-2xl hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all font-bold text-sm shadow-sm flex items-center gap-2 active:scale-95">
                                    <Mail size={16} /> Track
                                </button>
                                <button onClick={() => handleDeleteEvent(ev._id)} className="p-3 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl transition-all border border-red-100">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 animate-fadeIn">
                    <div className="bg-white border-4 border-pink-100 rounded-[40px] w-full max-w-xl max-h-[90vh] overflow-hidden relative shadow-2xl">
                        <button onClick={() => setShowInviteModal(false)} className="absolute top-8 right-8 p-2 bg-pink-50 hover:bg-pink-600 text-pink-600 hover:text-white rounded-2xl transition-all">
                            <X size={24} />
                        </button>
                        <div className="p-10">
                            <h2 className="text-3xl font-black mb-8 tracking-tight uppercase">Manage <span className="text-pink-600">Guests</span></h2>

                            <div className="bg-pink-50/50 rounded-3xl p-8 mb-8 border border-pink-100">
                                <h3 className="text-lg font-black mb-6 uppercase tracking-wider text-gray-800">Send Invitation</h3>
                                <form onSubmit={sendInvite} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Full Name" value={inviteData.name} onChange={e => setInviteData({ ...inviteData, name: e.target.value })} required className="bg-white border border-rose-100 p-4 rounded-2xl focus:outline-none focus:border-pink-500 text-sm font-medium shadow-sm transition-all" />
                                    <input type="email" placeholder="Email Address" value={inviteData.email} onChange={e => setInviteData({ ...inviteData, email: e.target.value })} required className="bg-white border border-rose-100 p-4 rounded-2xl focus:outline-none focus:border-pink-500 text-sm font-medium shadow-sm transition-all" />
                                    <button className="sm:col-span-2 bg-pink-600 hover:bg-pink-700 p-4 rounded-2xl flex justify-center items-center gap-2 transition font-black text-black shadow-lg shadow-pink-600/20 uppercase tracking-widest text-xs">
                                        <Send size={18} /> Send Digital Invite
                                    </button>
                                </form>
                            </div>

                            <h3 className="text-lg font-black mb-4 uppercase tracking-wider text-gray-800">Confirmed Guests</h3>
                            <div className="overflow-y-auto max-h-48 rounded-3xl border border-pink-100 divide-y divide-pink-50 bg-white">
                                {!selectedEventGuests || selectedEventGuests.length === 0 ? <p className="p-10 text-center text-gray-400 font-medium italic">No guests on the list yet.</p> : (
                                    selectedEventGuests.map(g => (
                                        <div key={g._id} className="p-5 flex justify-between items-center hover:bg-pink-50/30 transition-all group">
                                            <div>
                                                <p className="font-bold text-black group-hover:text-pink-600 transition-colors uppercase tracking-tight text-sm">{g.name}</p>
                                                <p className="text-[10px] text-gray-400 font-black">{g.email}</p>
                                            </div>
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full border tracking-widest ${g.rsvp_status === 'accepted' ? 'bg-green-50 text-green-600 border-green-100' :
                                                g.rsvp_status === 'declined' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                                }`}>
                                                {g.rsvp_status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Event Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 animate-fadeIn">
                    <div className="bg-white border-4 border-pink-100 rounded-[40px] w-full max-w-xl max-h-[90vh] overflow-hidden relative shadow-2xl">
                        <button onClick={() => setShowCreateModal(false)} className="absolute top-8 right-8 p-2 bg-pink-50 hover:bg-pink-600 text-pink-600 hover:text-white rounded-2xl transition-all">
                            <X size={24} />
                        </button>
                        <div className="p-10 overflow-y-auto max-h-[85vh]">
                            <h2 className="text-3xl font-black mb-8 tracking-tight uppercase">Create <span className="text-pink-600">Event</span></h2>
                            <form onSubmit={handleCreateEvent} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-2">Event Name</label>
                                    <input type="text" placeholder="Gala Dinner 2024" value={newEventData.name} onChange={e => setNewEventData({ ...newEventData, name: e.target.value })} required className="w-full bg-pink-50/50 border border-pink-100 p-4 rounded-2xl focus:outline-none focus:border-pink-500 text-sm font-bold text-black transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-2">Date & Time</label>
                                        <input type="datetime-local" value={newEventData.date} onChange={e => setNewEventData({ ...newEventData, date: e.target.value })} required className="w-full bg-pink-50/50 border border-pink-100 p-4 rounded-2xl focus:outline-none focus:border-pink-500 text-sm font-bold text-black transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-2">Location</label>
                                        <input type="text" placeholder="Grand Ballroom" value={newEventData.location} onChange={e => setNewEventData({ ...newEventData, location: e.target.value })} required className="w-full bg-pink-50/50 border border-pink-100 p-4 rounded-2xl focus:outline-none focus:border-pink-500 text-sm font-bold text-black transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-2">Assigned Organizer Email (Optional)</label>
                                    <input type="email" placeholder="organizer@example.com" value={newEventData.owner_email} onChange={e => setNewEventData({ ...newEventData, owner_email: e.target.value })} className="w-full bg-pink-50/50 border border-pink-100 p-4 rounded-2xl focus:outline-none focus:border-pink-500 text-sm font-bold text-black transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-2">Description</label>
                                    <textarea placeholder="Tell us more about the event vision..." value={newEventData.description} onChange={e => setNewEventData({ ...newEventData, description: e.target.value })} rows={4} className="w-full bg-pink-50/50 border border-pink-100 p-4 rounded-3xl focus:outline-none focus:border-pink-500 text-sm font-bold text-black transition-all resize-none"></textarea>
                                </div>
                                <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-black font-black py-5 rounded-[24px] shadow-xl shadow-pink-600/20 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs mt-4">
                                    Launch Experience
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all font-black text-xs uppercase tracking-widest active:scale-95 ${active ? 'bg-pink-600 text-black shadow-lg shadow-pink-600/20' : 'bg-white/60 text-black hover:bg-pink-50 hover:text-pink-600'
            }`}
    >
        {icon} {label}
    </button>
);

const DetailItem = ({ label, value }) => (
    <div>
        {label && <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest leading-none mb-1">{label}</p>}
        <p className="text-sm font-bold text-black">{value || 'N/A'}</p>
    </div>
);

const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white/80 backdrop-blur-md border border-pink-100 p-8 rounded-[32px] flex items-center gap-6 shadow-sm hover:shadow-md transition-all`}>
        <div className={`p-5 rounded-2xl ${color} shadow-inner`}>
            {React.cloneElement(icon, { size: 32 })}
        </div>
        <div>
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{title}</p>
            <h3 className="text-4xl font-black mt-1 text-black tracking-tighter">{value}</h3>
        </div>
    </div>
);

export default AdminDashboard;

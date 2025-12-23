import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Mail, Users, Check, X, PieChart, BarChart3, Shield, ShieldOff, Send } from 'lucide-react';

const OrganizerDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [hostedEvents, setHostedEvents] = useState([]);
    const [inviteData, setInviteData] = useState({ event_id: '', name: '', email: '' });
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedEventGuests, setSelectedEventGuests] = useState(null);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    // Fetch hosted events
    useEffect(() => {
        if (activeTab === 'overview' || activeTab === 'tracking') fetchHosted();
    }, [activeTab]);

    const fetchHosted = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/events?type=upcoming`);
            const all = await res.json();
            const myHosted = all.filter(e => e.organizer && (e.organizer._id === user.id || e.organizer === user.id));
            setHostedEvents(myHosted);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchGuestsForEvent = async (eventId) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/guests/event/${eventId}`, { credentials: 'include' });
            if (res.ok) setSelectedEventGuests(await res.json());
        } catch (err) {
            console.error(err);
        }
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
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="text-black min-h-screen">
            <h1 className="text-3xl font-black mb-8 tracking-tight uppercase">Organizer <span className="text-pink-600 italic">Dashboard</span></h1>

            {/* Tabs */}
            <div className="flex flex-wrap gap-3 mb-10 border-b border-pink-100 pb-4">
                <TabButton
                    active={activeTab === 'overview'}
                    onClick={() => setActiveTab('overview')}
                    icon={<PieChart size={18} />}
                    label="Overview"
                />
                <TabButton
                    active={activeTab === 'upcoming'}
                    onClick={() => setActiveTab('upcoming')}
                    icon={<Calendar size={18} />}
                    label="Upcoming Events"
                />
                <TabButton
                    active={activeTab === 'tracking'}
                    onClick={() => setActiveTab('tracking')}
                    icon={<Users size={18} />}
                    label="Guest Management"
                />
            </div>

            <div className="animate-fadeIn">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            title="Active Events"
                            value={hostedEvents.length}
                            icon={<Calendar className="text-pink-600" />}
                            color="bg-pink-50"
                        />
                        <div className="md:col-span-2 bg-white/40 border border-dashed border-pink-200 p-8 rounded-[32px] flex items-center justify-center">
                            <p className="text-gray-500 font-medium italic text-center">
                                Welcome back, {user?.name}. You have {hostedEvents.length} active events to manage.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'upcoming' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                        {hostedEvents.length === 0 && <p className="col-span-full text-gray-500 font-medium italic text-center py-20 bg-white/40 rounded-3xl border border-dashed border-pink-200">No upcoming events scheduled.</p>}
                        {hostedEvents.map(ev => (
                            <div key={ev._id} className="bg-white/80 backdrop-blur-md border border-pink-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                                <div className="w-full h-40 bg-pink-50 rounded-2xl mb-4 overflow-hidden flex items-center justify-center text-pink-200">
                                    <Calendar size={64} />
                                </div>
                                <h4 className="text-xl font-black text-black group-hover:text-pink-600 transition-colors uppercase tracking-tight">{ev.name}</h4>
                                <div className="mt-4 space-y-2 flex-grow">
                                    <div className="flex items-center gap-2 text-gray-600 text-xs font-bold uppercase">
                                        <Calendar size={14} className="text-pink-500" />
                                        <span>{new Date(ev.date).toLocaleDateString()} at {new Date(ev.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-xs font-bold uppercase">
                                        <Users size={14} className="text-pink-500" />
                                        <span>Location: {ev.location}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setActiveTab('tracking'); }}
                                    className="mt-6 w-full bg-pink-50 hover:bg-pink-100 text-pink-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'tracking' && (
                    <div className="grid gap-6 animate-fadeIn">
                        {hostedEvents.length === 0 && <p className="text-gray-400 font-medium italic text-center py-20 bg-white/40 rounded-3xl border border-dashed border-pink-200">No events found under your management.</p>}
                        {hostedEvents.map(ev => (
                            <div key={ev._id} className="bg-white/80 backdrop-blur-md border border-pink-100 rounded-[32px] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-xl transition-all group">
                                <div className="flex gap-6 items-center">
                                    <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 shadow-inner group-hover:scale-110 transition-transform">
                                        <Calendar size={32} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-black group-hover:text-pink-600 transition-colors uppercase tracking-tight">{ev.name}</h4>
                                        <div className="flex gap-4 mt-2">
                                            <p className="text-gray-500 text-xs font-bold uppercase flex items-center gap-1 border-r border-pink-50 pr-4">{new Date(ev.date).toLocaleString()}</p>
                                            <p className="text-gray-500 text-xs font-bold uppercase flex items-center gap-1">{ev.location}</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => openInvite(ev)}
                                    className="bg-pink-600 hover:bg-pink-700 text-black px-6 py-3 rounded-2xl flex items-center gap-2 transition font-black text-xs uppercase tracking-widest shadow-lg shadow-pink-600/20 active:scale-95"
                                >
                                    <Mail size={16} /> Manage Guests
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 animate-fadeIn">
                    <div className="bg-white border-4 border-pink-100 rounded-[40px] w-full max-w-xl max-h-[90vh] overflow-hidden relative shadow-2xl">
                        <button onClick={() => setShowInviteModal(false)} className="absolute top-8 right-8 p-2 bg-pink-50 hover:bg-pink-600 text-pink-600 hover:text-white rounded-2xl transition-all">
                            <X size={24} />
                        </button>
                        <div className="p-10">
                            <h2 className="text-3xl font-black mb-8 tracking-tight uppercase">Event <span className="text-pink-600">Access</span></h2>

                            <div className="bg-pink-50/50 rounded-3xl p-8 mb-8 border border-pink-100 shadow-inner">
                                <h3 className="text-lg font-black mb-6 uppercase tracking-wider text-gray-800">Dispatch Invitation</h3>
                                <form onSubmit={sendInvite} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Full Name" value={inviteData.name} onChange={e => setInviteData({ ...inviteData, name: e.target.value })} required className="bg-white border border-rose-100 p-4 rounded-2xl focus:outline-none focus:border-pink-500 text-sm font-medium shadow-sm transition-all" />
                                    <input type="email" placeholder="Email Address" value={inviteData.email} onChange={e => setInviteData({ ...inviteData, email: e.target.value })} required className="bg-white border border-rose-100 p-4 rounded-2xl focus:outline-none focus:border-pink-500 text-sm font-medium shadow-sm transition-all" />
                                    <button type="submit" className="sm:col-span-2 bg-pink-600 hover:bg-pink-700 p-4 rounded-2xl flex justify-center items-center gap-2 transition font-black text-black shadow-lg shadow-pink-600/20 uppercase tracking-widest text-xs">
                                        <Send size={18} /> Send Digital Pass
                                    </button>
                                </form>
                            </div>

                            <h3 className="text-lg font-black mb-4 uppercase tracking-wider text-gray-800">Confirmed Attendee List</h3>
                            <div className="overflow-y-auto max-h-48 rounded-3xl border border-pink-100 divide-y divide-pink-50 bg-white shadow-sm">
                                {(!selectedEventGuests || selectedEventGuests.length === 0) ? (
                                    <p className="p-10 text-center text-gray-400 font-medium italic">No attendees registered yet.</p>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left bg-pink-50/30">
                                                <th className="p-4 font-black text-[10px] uppercase tracking-widest opacity-50">Guest Detail</th>
                                                <th className="p-4 font-black text-[10px] uppercase tracking-widest opacity-50">RSVP Priority</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-pink-50">
                                            {selectedEventGuests.map(g => (
                                                <tr key={g._id} className="hover:bg-pink-50/30 transition-all group">
                                                    <td className="p-4">
                                                        <div className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors uppercase tracking-tight text-xs">{g.name}</div>
                                                        <div className="text-[10px] text-gray-400 font-black">{g.email}</div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full border tracking-widest ${g.rsvp_status === 'accepted' ? 'bg-green-50 text-green-600 border-green-100' :
                                                            g.rsvp_status === 'declined' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                                            }`}>
                                                            {g.rsvp_status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
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
        className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all font-black text-xs uppercase tracking-widest active:scale-95 ${active ? 'bg-pink-600 text-black shadow-lg shadow-pink-600/20' : 'bg-white/60 text-gray-900 hover:bg-pink-50 hover:text-pink-600 border border-pink-50 shadow-sm'
            }`}
    >
        {icon} {label}
    </button>
);

const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white/80 backdrop-blur-md border border-pink-100 p-8 rounded-[32px] flex items-center gap-6 shadow-sm hover:shadow-lg transition-all`}>
        <div className={`p-5 rounded-2xl ${color} shadow-inner`}>
            {React.cloneElement(icon, { size: 32 })}
        </div>
        <div>
            <p className="text-xs text-black font-black uppercase tracking-widest">{title}</p>
            <h3 className="text-4xl font-black mt-1 text-black tracking-tighter">{value}</h3>
        </div>
    </div>
);

export default OrganizerDashboard;

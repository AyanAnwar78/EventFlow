import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Search, Mail, Users, Check, X, PieChart, BarChart3, Shield, ShieldOff, Send, MessageSquare, Star } from 'lucide-react';
import ImageScroller from '../components/ImageScroller';

const UserDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('explore');
    const [upcoming, setUpcoming] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [hostedEvents, setHostedEvents] = useState([]);
    const [myRsvps, setMyRsvps] = useState([]);
    const [requestForm, setRequestForm] = useState({ name: '', eventType: 'Birthday', date: '', budget: '', requirements: '' });

    // Feedback State
    const [feedbackForm, setFeedbackForm] = useState({ comment: '', rating: 5 });
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    useEffect(() => {
        if (activeTab === 'explore') { fetchExplore(); fetchMyRsvps(); }
        if (activeTab === 'requests') fetchMyRequests();
        if (activeTab === 'hosted') fetchHosted();
    }, [activeTab]);

    const fetchExplore = async () => {
        const res = await fetch(`${BACKEND_URL}/api/events?type=upcoming`);
        setUpcoming(await res.json());
    };

    const fetchMyRsvps = async () => {
        const res = await fetch(`${BACKEND_URL}/api/guests/my`, { credentials: 'include' });
        if (res.ok) setMyRsvps(await res.json());
    };

    const fetchMyRequests = async () => {
        const res = await fetch(`${BACKEND_URL}/api/requests/my`, { credentials: 'include' });
        setMyRequests(await res.json());
    };

    const fetchHosted = async () => {
        const res = await fetch(`${BACKEND_URL}/api/events?type=upcoming`);
        const all = await res.json();
        const myHosted = all.filter(e => e.organizer && (e.organizer._id === user.id || e.organizer === user.id));
        setHostedEvents(myHosted);
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BACKEND_URL}/api/requests`, {
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
            const res = await fetch(`${BACKEND_URL}/api/guests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event_id: eventId, rsvp_status: 'accepted' }),
                credentials: 'include'
            });
            if (res.ok) {
                alert('Joined event successfully!');
                fetchMyRsvps();
            } else alert('Error joining event');
        } catch (err) { alert(err.message); }
    };

    const handleLeaveEvent = async (eventId) => {
        if (!confirm('Are you sure you want to cancel your RSVP?')) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/guests/${eventId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) { alert('RSVP Cancelled'); fetchMyRsvps(); } else alert('Error cancelling RSVP');
        } catch (err) { alert(err.message); }
    };

    const getRsvpStatus = (eventId) => {
        const rsvp = myRsvps.find(r => r.event_id?._id === eventId || r.event_id === eventId);
        return rsvp ? rsvp.rsvp_status : null;
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingFeedback(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedbackForm),
                credentials: 'include'
            });
            if (res.ok) {
                alert('Thank you for your feedback!');
                setFeedbackForm({ comment: '', rating: 5 });
                setActiveTab('explore'); // Optional: redirect back to explore or stay
            } else {
                alert('Error submitting feedback');
            }
        } catch (err) { alert(err.message); }
        finally { setIsSubmittingFeedback(false); }
    };

    return (
        <div className="text-black min-h-screen">
            {/* Header */}
            <div className="text-left mb-12 animate-fadeIn">
                <h1 className="text-4xl font-black tracking-tight uppercase">Welcome back, <span className="text-pink-600 italic">{user.name}</span></h1>
                <p className="text-gray-500 font-medium italic mt-2">Ready to create some magic today?</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-3 mb-10 border-b border-pink-100 pb-4">
                <TabButton
                    active={activeTab === 'explore'}
                    onClick={() => setActiveTab('explore')}
                    icon={<PieChart size={18} />}
                    label="Explore Events"
                />
                <TabButton
                    active={activeTab === 'requests'}
                    onClick={() => setActiveTab('requests')}
                    icon={<Mail size={18} />}
                    label="My Requests"
                />
                <TabButton
                    active={activeTab === 'hosted'}
                    onClick={() => setActiveTab('hosted')}
                    icon={<Users size={18} />}
                    label="Hosted Events"
                />
                <TabButton
                    active={activeTab === 'feedback'}
                    onClick={() => setActiveTab('feedback')}
                    icon={<MessageSquare size={18} />}
                    label="Give Feedback"
                />
            </div>

            <div className="animate-fadeIn">
                {activeTab === 'explore' && (
                    <div className="space-y-12">
                        <div className="relative rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                            <ImageScroller />
                            <div className="absolute bottom-10 left-10 z-10">
                                <h2 className="text-4xl font-black text-white drop-shadow-lg uppercase tracking-widest">Plan Your <span className="text-pink-400">Dream</span> Event</h2>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <CategoryCard title="Wedding" icon="💍" />
                            <CategoryCard title="Birthday" icon="🎂" />
                            <CategoryCard title="Corporate" icon="💼" />
                            <CategoryCard title="Others" icon="✨" />
                        </div>

                        <section>
                            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-tight">
                                <Calendar className="text-pink-600" /> Upcoming Global Events
                            </h2>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {upcoming.map(event => {
                                    const status = getRsvpStatus(event._id);
                                    return (
                                        <div key={event._id} className="bg-white/80 backdrop-blur-md border border-pink-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                                            <div className="h-48 bg-pink-100 flex items-center justify-center relative shadow-inner">
                                                <Calendar size={64} className="text-pink-200" />
                                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-pink-600 shadow-sm border border-pink-50">
                                                    {new Date(event.date).toLocaleDateString()}
                                                </div>
                                                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white/80 to-transparent">
                                                    <h3 className="text-xl font-black text-black group-hover:text-pink-600 transition-colors">{event.name}</h3>
                                                </div>
                                            </div>
                                            <div className="p-6 pt-0 flex flex-col">
                                                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                                                    {event.location}
                                                </p>
                                                <div className="mt-auto flex gap-2">
                                                    {status ? (
                                                        <>
                                                            <div className="flex-1 bg-green-50 text-green-600 border border-green-100 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                                                                <Check size={14} /> RSVP {status}
                                                            </div>
                                                            <button onClick={() => handleLeaveEvent(event._id)} className="p-3 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl transition-all border border-red-50">
                                                                <X size={20} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button onClick={() => handleJoinEvent(event._id)} className="w-full bg-pink-600 hover:bg-pink-700 text-black font-black py-4 rounded-2xl shadow-lg shadow-pink-600/20 transform active:scale-[0.98] transition-all uppercase tracking-widest text-xs">
                                                            Register Now
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {upcoming.length === 0 && <p className="text-gray-400 font-medium italic col-span-full text-center py-20 bg-white/40 rounded-3xl border border-dashed border-pink-200">No events found in the catalogue.</p>}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="grid gap-10 md:grid-cols-2">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black uppercase tracking-tight">Active <span className="text-pink-600">Requests</span></h3>
                            {myRequests.length === 0 ? (
                                <div className="bg-white/40 border border-dashed border-pink-200 p-10 rounded-3xl text-center">
                                    <p className="text-gray-400 font-medium italic">You haven't requested any events yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {myRequests.map(req => (
                                        <div key={req._id} className="bg-white/80 backdrop-blur-md border border-pink-100 p-6 rounded-2xl shadow-sm flex justify-between items-center group hover:border-pink-300 transition-colors">
                                            <div>
                                                <div className="font-black text-black uppercase tracking-tight group-hover:text-pink-600 transition-colors">{req.name}</div>
                                                <div className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">{new Date(req.date).toLocaleDateString()} • {req.eventType}</div>
                                            </div>
                                            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border tracking-widest ${req.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                                req.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                                }`}>
                                                {req.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="bg-white/90 backdrop-blur-md border-[6px] border-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 blur-3xl -z-10 rounded-full opacity-50" />
                            <h3 className="text-2xl font-black mb-8 uppercase tracking-tight">Request <span className="text-pink-600 text-sm block tracking-[0.3em] font-black opacity-50">Custom Experience</span></h3>
                            <form onSubmit={handleRequestSubmit} className="space-y-4">
                                <FormInput
                                    placeholder="Unique Event Name"
                                    value={requestForm.name}
                                    onChange={e => setRequestForm({ ...requestForm, name: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={requestForm.eventType}
                                        onChange={e => setRequestForm({ ...requestForm, eventType: e.target.value })}
                                        className="w-full bg-pink-50/50 border border-pink-100 p-4 rounded-2xl focus:outline-none focus:border-pink-500 text-sm font-bold text-gray-700 transition-all appearance-none cursor-pointer"
                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                                    >
                                        <option className="text-black">Birthday</option>
                                        <option className="text-black">Anniversary</option>
                                        <option className="text-black">Wedding</option>
                                        <option className="text-black">Corporate</option>
                                        <option className="text-black">Other</option>
                                    </select>
                                    <input type="datetime-local" value={requestForm.date} onChange={e => setRequestForm({ ...requestForm, date: e.target.value })} required className="w-full bg-pink-50/50 border border-pink-100 p-4 rounded-2xl focus:outline-none focus:border-pink-500 text-sm font-bold text-black transition-all" />
                                </div>
                                <input type="number" placeholder="Estimated Budget ($)" value={requestForm.budget} onChange={e => setRequestForm({ ...requestForm, budget: e.target.value })} className="w-full bg-pink-50/50 border border-pink-100 p-4 rounded-2xl focus:outline-none focus:border-pink-500 text-sm font-bold text-black transition-all" />
                                <textarea placeholder="Describe your vision / Special requirements..." value={requestForm.requirements} onChange={e => setRequestForm({ ...requestForm, requirements: e.target.value })} rows={4} className="w-full bg-pink-50/50 border border-pink-100 p-4 rounded-3xl focus:outline-none focus:border-pink-500 text-sm font-bold text-black transition-all resize-none"></textarea>
                                <button className="w-full bg-pink-600 hover:bg-pink-700 text-black font-black py-5 rounded-3xl shadow-xl shadow-pink-600/20 transform active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs">
                                    Project Proposal
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {activeTab === 'hosted' && (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black uppercase tracking-tight">Events I'm <span className="text-pink-600">Hosting</span></h3>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {hostedEvents.map(ev => (
                                <div key={ev._id} className="bg-white/80 backdrop-blur-md border border-pink-100 p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center">
                                    <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center text-pink-600 mb-6 shadow-inner group-hover:scale-110 transition-transform">
                                        <Calendar size={40} />
                                    </div>
                                    <h4 className="text-xl font-black text-black group-hover:text-pink-600 transition-colors uppercase tracking-tight mb-2">{ev.name}</h4>
                                    <div className="text-xs text-gray-400 font-black uppercase tracking-widest mb-6">
                                        {new Date(ev.date).toLocaleString()} • {ev.location}
                                    </div>
                                    <button className="w-full py-3 bg-white border-2 border-pink-100 text-pink-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all">
                                        Manage Dashboard
                                    </button>
                                </div>
                            ))}
                        </div>
                        {hostedEvents.length === 0 && (
                            <div className="bg-white/40 border border-dashed border-pink-200 p-20 rounded-[40px] text-center">
                                <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-sm mb-4">No Control Access</p>
                                <p className="text-gray-400 font-medium italic">You haven't been assigned as an organizer for any events yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'feedback' && (
                    <div className="max-w-2xl mx-auto animate-fadeIn">
                        <div className="bg-white/90 backdrop-blur-md border-[6px] border-white p-10 md:p-14 rounded-[48px] shadow-2xl relative overflow-hidden text-center">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 blur-[100px] -z-10 rounded-full opacity-30" />

                            <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center text-pink-600 mx-auto mb-8 shadow-inner">
                                <MessageSquare size={40} />
                            </div>

                            <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">Share Your <span className="text-pink-600 text-sm block tracking-[0.3em] font-black mt-2 opacity-50 uppercase">Global Experience</span></h3>
                            <p className="text-gray-500 font-medium italic mb-10">Your feedback helps us evolve and build better moments for everyone.</p>

                            <form onSubmit={handleFeedbackSubmit} className="space-y-8">
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                                            className="transition-transform active:scale-90"
                                        >
                                            <Star
                                                size={40}
                                                className={`${star <= feedbackForm.rating ? "fill-pink-600 text-pink-600" : "text-gray-200"} hover:scale-110 transition-all`}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    placeholder="Tell us about your experience with EventFlow..."
                                    value={feedbackForm.comment}
                                    onChange={e => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                                    required
                                    rows={5}
                                    className="w-full bg-pink-50/50 border border-pink-100 p-6 rounded-[32px] focus:outline-none focus:border-pink-500 text-lg font-bold text-black transition-all resize-none shadow-inner placeholder:text-gray-300"
                                ></textarea>

                                <button
                                    disabled={isSubmittingFeedback}
                                    className="w-full bg-pink-600 hover:bg-pink-700 text-black font-black py-6 rounded-3xl shadow-xl shadow-pink-600/20 transform active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-sm disabled:opacity-50"
                                >
                                    {isSubmittingFeedback ? 'Transmitting...' : 'Submit Testimony'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all font-black text-xs uppercase tracking-widest active:scale-95 ${active ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20' : 'bg-white/60 text-black hover:bg-pink-50 hover:text-pink-600 border border-pink-50'
            }`}
    >
        {icon} {label}
    </button>
);

const CategoryCard = ({ title, icon }) => (
    <div className="bg-white/80 backdrop-blur-md border border-pink-100 p-8 rounded-[32px] cursor-pointer hover:shadow-xl hover:shadow-pink-600/5 hover:-translate-y-2 transition-all group text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-sm font-black text-black uppercase tracking-widest">{title}</h3>
        <div className="w-8 h-1 bg-pink-100 mt-3 group-hover:w-16 transition-all rounded-full" />
    </div>
);

const FormInput = (props) => (
    <input
        required
        {...props}
        className="w-full bg-pink-50/50 border border-pink-100 p-4 rounded-2xl focus:outline-none focus:border-pink-500 text-sm font-bold text-black transition-all shadow-sm placeholder:text-gray-400"
    />
);

export default UserDashboard;

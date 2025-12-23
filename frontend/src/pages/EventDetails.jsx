import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Calendar, Clock, CheckCircle, XCircle, Users, MapPin, Info } from 'lucide-react';
import { useRSVP } from '../hooks/useRSVP';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [loadingEvent, setLoadingEvent] = useState(true);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    // Use custom hook for guests
    const { guests, loading: loadingGuests, addGuest, updateRSVPStatus } = useRSVP(id);

    // Forms
    const [guestForm, setGuestForm] = useState({ name: '', email: '' });
    const [scheduleForm, setScheduleForm] = useState({ time: '', activity: '' });

    useEffect(() => {
        fetchEventData();
    }, [id]);

    const fetchEventData = async () => {
        try {
            const [eventRes, scheduleRes] = await Promise.all([
                fetch(`${BACKEND_URL}/api/events/${id}`),
                fetch(`${BACKEND_URL}/api/events/${id}/schedule`)
            ]);

            setEvent(await eventRes.json());
            setSchedule(await scheduleRes.json());
            setLoadingEvent(false);
        } catch (error) {
            console.error(error);
            setLoadingEvent(false);
        }
    };

    const handleAddGuest = async (e) => {
        e.preventDefault();
        const success = await addGuest(guestForm.name, guestForm.email);
        if (success) {
            setGuestForm({ name: '', email: '' });
        }
    };

    const addScheduleItem = async (e) => {
        e.preventDefault();
        await fetch(`${BACKEND_URL}/api/schedules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event_id: id, ...scheduleForm })
        });
        setScheduleForm({ time: '', activity: '' });
        fetchEventData(); // Refresh schedule
    };

    if (loadingEvent || loadingGuests) return (
        <div className="flex items-center justify-center min-h-screen bg-[#FFF5F5]">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-pink-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-pink-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
        </div>
    );

    if (!event) return (
        <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center p-6 text-black">
            <div className="text-center py-20 bg-white/80 backdrop-blur-xl border-4 border-white rounded-[40px] shadow-2xl max-w-lg w-full">
                <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center text-pink-600 mx-auto mb-6 shadow-inner">
                    <XCircle size={40} />
                </div>
                <h2 className="text-3xl font-black text-black mb-4 uppercase tracking-tight">Event Not Found</h2>
                <p className="text-gray-500 font-medium italic mb-8">The experience you're looking for doesn't exist.</p>
                <Link to="/dashboard" className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-black font-black px-8 py-4 rounded-2xl transition-all shadow-lg shadow-pink-600/20 uppercase tracking-widest text-xs">
                    <ArrowLeft size={16} /> Return to Portal
                </Link>
            </div>
        </div>
    );

    return (
        <div className="animate-fadeIn space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen text-black">
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white/80 border border-pink-100 text-pink-600 font-black text-xs uppercase tracking-widest hover:bg-pink-600 hover:text-white transition-all shadow-sm active:scale-95">
                <ArrowLeft size={18} />
                <span>Portal Exit</span>
            </Link>

            <div className="bg-white/90 backdrop-blur-xl border-4 border-white p-10 md:p-14 rounded-[48px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-pink-50 blur-[120px] rounded-full -z-10 opacity-60" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-50 blur-[120px] rounded-full -z-10 opacity-60" />

                <div className="relative">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="bg-pink-50 text-pink-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-pink-100">Live Experience</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-10 text-black tracking-tight uppercase leading-[0.9]">
                        {event.name}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4 bg-white/50 p-6 rounded-[32px] border border-pink-50 shadow-sm hover:border-pink-200 transition-colors group">
                            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 shadow-inner group-hover:scale-110 transition-transform">
                                <Calendar size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Temporal Detail</p>
                                <span className="text-lg font-black text-gray-900 tracking-tight">{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/50 p-6 rounded-[32px] border border-pink-50 shadow-sm hover:border-pink-200 transition-colors group">
                            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 shadow-inner group-hover:scale-110 transition-transform">
                                <MapPin size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Spatial Location</p>
                                <span className="text-lg font-black text-black tracking-tight">{event.location}</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 bg-white/50 p-6 rounded-[32px] border border-pink-50 shadow-sm hover:border-pink-200 transition-colors col-span-1 md:col-span-2 lg:col-span-1 group">
                            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                                <Info size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contextual Data</p>
                                <p className="text-gray-500 font-bold text-xs mt-1 leading-relaxed italic line-clamp-2 md:line-clamp-none">
                                    "{event.description}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Guests Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-pink-100 pb-4">
                        <h2 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tight">
                            <Users className="text-pink-600" size={28} /> Attendee <span className="text-pink-600">Registry</span>
                        </h2>
                        <span className="px-4 py-1.5 bg-pink-50 text-pink-600 border border-pink-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {guests.length} Registered
                        </span>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md border-4 border-white p-8 rounded-[40px] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 blur-2xl -z-10 rounded-full opacity-50" />
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-1">Add New Entry</h3>
                        <form onSubmit={handleAddGuest} className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    placeholder="Full Identity Name"
                                    value={guestForm.name}
                                    onChange={e => setGuestForm({ ...guestForm, name: e.target.value })}
                                    required
                                    className="w-full bg-pink-50/50 border border-pink-100 p-5 rounded-[24px] focus:outline-none focus:border-pink-500 transition-all text-black font-bold placeholder:text-gray-300"
                                />
                                <input
                                    placeholder="Electronic Mail (Optional)"
                                    value={guestForm.email}
                                    onChange={e => setGuestForm({ ...guestForm, email: e.target.value })}
                                    className="w-full bg-pink-50/50 border border-pink-100 p-5 rounded-[24px] focus:outline-none focus:border-pink-500 transition-all text-gray-900 font-bold placeholder:text-gray-300"
                                />
                            </div>
                            <button className="w-full bg-pink-600 hover:bg-pink-700 text-black font-black py-5 rounded-[24px] shadow-xl shadow-pink-600/20 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs">
                                Admit Guest
                            </button>
                        </form>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar">
                        {guests.length === 0 && (
                            <div className="text-center py-20 bg-white/40 border-4 border-dashed border-pink-100 rounded-[40px]">
                                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Registry Empty</p>
                            </div>
                        )}
                        {guests.map(guest => (
                            <div key={guest.id} className="bg-white/80 backdrop-blur-md border border-pink-100 p-6 rounded-[32px] flex flex-wrap justify-between items-center gap-6 hover:shadow-xl hover:shadow-pink-600/5 transition-all group">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 shadow-inner group-hover:scale-110 transition-transform">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-black uppercase tracking-tight group-hover:text-pink-600 transition-colors">{guest.name}</h4>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{guest.email || 'Anonymous Access'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-sm ${guest.rsvp_status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' :
                                        guest.rsvp_status === 'declined' ? 'bg-red-50 text-red-600 border-red-100' :
                                            'bg-orange-50 text-orange-600 border-orange-100'
                                        }`}>
                                        {guest.rsvp_status}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateRSVPStatus(guest.id, 'confirmed')}
                                            className={`p-3 rounded-2xl transition-all shadow-sm ${guest.rsvp_status === 'confirmed' ? 'bg-green-600 text-white shadow-green-600/20' : 'bg-white border border-pink-50 text-gray-300 hover:text-green-600 hover:border-green-100'}`}
                                            title="Confirm Access"
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                        <button
                                            onClick={() => updateRSVPStatus(guest.id, 'declined')}
                                            className={`p-3 rounded-2xl transition-all shadow-sm ${guest.rsvp_status === 'declined' ? 'bg-red-600 text-white shadow-red-600/20' : 'bg-white border border-pink-50 text-gray-300 hover:text-red-500 hover:border-red-100'}`}
                                            title="Deny Access"
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logistics / Schedule Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-pink-100 pb-4">
                        <h2 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tight">
                            <Clock className="text-pink-600" size={28} /> Logistic <span className="text-pink-600">Timeline</span>
                        </h2>
                        <span className="px-4 py-1.5 bg-pink-50 text-pink-600 border border-pink-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {schedule.length} Milestones
                        </span>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md border-4 border-white p-8 rounded-[40px] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 blur-2xl -z-10 rounded-full opacity-50" />
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-1">New Event Milestone</h3>
                        <form onSubmit={addScheduleItem} className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="time"
                                value={scheduleForm.time}
                                onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                                required
                                className="bg-pink-50/50 border border-pink-100 p-5 rounded-[24px] focus:outline-none focus:border-pink-500 transition-all text-gray-900 font-black w-full sm:w-40"
                            />
                            <input
                                placeholder="Activity Description / Milestone Detail"
                                value={scheduleForm.activity}
                                onChange={e => setScheduleForm({ ...scheduleForm, activity: e.target.value })}
                                required
                                className="flex-1 bg-pink-50/50 border border-pink-100 p-5 rounded-[24px] focus:outline-none focus:border-pink-500 transition-all text-black font-bold placeholder:text-gray-300"
                            />
                            <button className="bg-pink-600 hover:bg-pink-700 text-black font-black px-10 py-5 rounded-[24px] transition-all active:scale-[0.98] shadow-xl shadow-pink-600/20 uppercase tracking-[0.2em] text-xs">
                                Log
                            </button>
                        </form>
                    </div>

                    <div className="space-y-4 relative">
                        {schedule.map((item, index) => (
                            <div key={item.id} className="flex gap-8 group relative lg:hover:translate-x-2 transition-transform">
                                <div className="relative flex flex-col items-center">
                                    <div className="bg-pink-600 text-white px-6 py-3 rounded-[20px] font-black text-lg shadow-xl shadow-pink-600/10 min-w-[120px] text-center z-10">
                                        {item.time}
                                    </div>
                                    {index !== schedule.length - 1 && (
                                        <div className="w-1 h-full bg-pink-100 absolute top-full -mt-2 -z-10" />
                                    )}
                                </div>
                                <div className="bg-white/80 backdrop-blur-md border border-pink-50 p-6 rounded-[32px] flex-1 shadow-sm group-hover:shadow-md transition-all">
                                    <h4 className="font-black text-lg text-black uppercase tracking-tight group-hover:text-pink-600 transition-colors">{item.activity}</h4>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Confirmed Milestone</p>
                                </div>
                            </div>
                        ))}
                        {schedule.length === 0 && (
                            <div className="text-center py-20 bg-white/40 border-4 border-dashed border-pink-100 rounded-[40px]">
                                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Timeline Undefined</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;

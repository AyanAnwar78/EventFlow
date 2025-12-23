import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Clock, Award } from 'lucide-react';

const PastEvents = () => {
    const [events, setEvents] = useState([]);
    const { user } = useAuth();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchPastEvents = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/events?type=past`);
                const data = await res.json();
                setEvents(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPastEvents();
    }, []);

    return (
        <div className="space-y-12 animate-fadeIn min-h-screen text-black">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pink-100 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-black tracking-tight uppercase">
                        Past Events <span className="text-pink-600 italic">Gallery</span>
                    </h1>
                    <p className="text-gray-500 font-medium italic mt-2">Relive the moments and explore our history of successful experiences.</p>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-24 bg-white/40 border-4 border-dashed border-pink-200 rounded-[40px]">
                    <p className="text-gray-400 text-lg font-black uppercase tracking-[0.2em]">Archive Empty</p>
                    <p className="text-gray-400 font-medium italic mt-2">No past events found in the archives.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {events.map(event => (
                        <div key={event._id} className="group relative bg-white/80 backdrop-blur-md border border-pink-100 rounded-[32px] p-8 transition-all hover:bg-white hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-600/5">
                            <div className="absolute top-6 right-6 bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 shadow-sm">
                                Completed
                            </div>

                            <div className="mb-6">
                                <h3 className="text-2xl font-black text-black mb-4 group-hover:text-pink-600 transition-colors uppercase tracking-tight">{event.name}</h3>
                                <div className="space-y-3 mt-4">
                                    <div className="flex items-center gap-3 text-gray-500 group-hover:text-gray-800 transition-colors">
                                        <div className="p-2 bg-pink-50 rounded-lg text-pink-600"><Calendar size={14} /></div>
                                        <span className="text-xs font-black uppercase tracking-widest">{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-500 group-hover:text-gray-800 transition-colors">
                                        <div className="p-2 bg-pink-50 rounded-lg text-pink-600"><MapPin size={14} /></div>
                                        <span className="text-xs font-black uppercase tracking-widest">{event.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/50 rounded-2xl p-6 mb-6 border border-pink-50/50">
                                <p className="text-gray-500 text-xs font-bold leading-relaxed line-clamp-3 font-medium italic">
                                    "{event.description}"
                                </p>
                            </div>

                            <div className="pt-6 border-t border-pink-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <span className="flex items-center gap-2">
                                    <Award size={14} className="text-amber-500" /> Success
                                </span>
                                <span className="opacity-50 tracking-[0.2em]">Ref ID #{event._id.slice(-4)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PastEvents;

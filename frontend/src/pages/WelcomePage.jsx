import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Quote, Calendar, MapPin, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


import ImageScroller from '../components/ImageScroller';

const WelcomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [feedbackRes, eventsRes] = await Promise.all([
                    fetch(`${BACKEND_URL}/api/feedback`),
                    fetch(`${BACKEND_URL}/api/events?type=upcoming`)
                ]);
                if (feedbackRes.ok) setFeedbacks(await feedbackRes.json());
                if (eventsRes.ok) setUpcomingEvents(await eventsRes.json());
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, []);

    const handleEventAction = (eventId) => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-6 md:p-12 relative bg-[#FFF5F5] overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-300/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
            </div>

            <ImageScroller />

            {/* Hero Section */}
            <div className="relative text-center max-w-4xl w-full mt-12 mb-12 animate-fadeIn">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 border border-pink-200 text-pink-600 font-bold text-xs md:text-sm mb-8 tracking-wide shadow-sm">
                    ✨ The Future of Event Management
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 text-black tracking-tight">
                    Seamless Events,<br />Unforgettable <span className="text-pink-600">Moments.</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-700 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                    Plan, track, and celebrate with EventFlow. The all-in-one platform designed to make your event planning effortless and elegant.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/login" className="w-full sm:w-auto px-10 py-4 bg-pink-600 hover:bg-pink-700 text-black font-black rounded-2xl shadow-xl shadow-pink-600/20 transform active:scale-95 transition-all flex items-center justify-center gap-2 text-lg">
                        Get Started <ArrowRight size={20} />
                    </Link>
                    <Link to="/about" className="w-full sm:w-auto px-10 py-4 bg-white/60 hover:bg-white text-black font-black rounded-2xl border border-pink-100 transition-all text-lg backdrop-blur-md shadow-sm">
                        Learn More
                    </Link>
                </div>

                <div className="mt-12">
                    <Link to="/contact" className="text-gray-500 hover:text-pink-600 transition-colors text-sm font-bold border-b border-gray-200 hover:border-pink-600/30 pb-1">
                        Contact Us
                    </Link>
                </div>
            </div>

            {/* Upcoming Events Section */}
            {upcomingEvents.length > 0 && (
                <div className="relative w-full max-w-6xl mt-12 mb-24 animate-fadeIn">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 px-4">
                        <div className="text-left">
                            <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight uppercase">Upcoming <span className="text-pink-600">Global Events</span></h2>
                            <p className="text-gray-500 font-medium italic mt-2">Join the world's most exclusive celebrations.</p>
                        </div>
                        <Link to="/login" className="px-6 py-3 bg-white border-2 border-pink-100 text-pink-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all shadow-sm">
                            View All Events
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                        {upcomingEvents.slice(0, 3).map((event) => (
                            <div key={event._id} className="bg-white/80 backdrop-blur-md border border-pink-100 rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full">
                                <div className="h-56 bg-pink-100 flex items-center justify-center relative shadow-inner overflow-hidden">
                                    <div className="absolute inset-0 bg-pink-600/5 group-hover:bg-transparent transition-colors z-10" />
                                    <Calendar size={80} className="text-pink-200 group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black text-pink-600 shadow-sm border border-pink-50 z-20 uppercase tracking-widest">
                                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-white via-white/80 to-transparent z-20">
                                        <h3 className="text-2xl font-black text-black group-hover:text-pink-600 transition-colors uppercase tracking-tight leading-none">{event.name}</h3>
                                    </div>
                                </div>
                                <div className="p-8 pt-2 flex flex-col flex-grow">
                                    <div className="space-y-3 mb-8">
                                        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                            <MapPin size={14} className="text-pink-500" />
                                            {event.location}
                                        </p>
                                        <p className="text-gray-400 text-sm font-medium line-clamp-2 italic">
                                            "{event.description || 'An exclusive gathering managed by EventFlow'}"
                                        </p>
                                    </div>
                                    <div className="mt-auto">
                                        <button
                                            onClick={() => handleEventAction(event._id)}
                                            className="w-full bg-pink-600 hover:bg-pink-700 text-black font-black py-5 rounded-[24px] shadow-xl shadow-pink-600/20 transform active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-[10px]"
                                        >
                                            Register Membership
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Feedback Section */}
            {feedbacks.length > 0 && (
                <div className="relative w-full max-w-6xl mt-24 mb-24 animate-fadeInDelay">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight uppercase">What Our <span className="text-pink-600">Users Say</span></h2>
                        <p className="text-gray-500 font-medium italic mt-4">Real experiences from our community members.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {feedbacks.slice(0, 6).map((f) => (
                            <div key={f._id} className="bg-white/90 backdrop-blur-xl border-4 border-white p-8 rounded-[40px] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group relative overflow-hidden">
                                <Quote className="absolute top-6 right-6 text-pink-50 opacity-10 group-hover:opacity-20 transition-opacity" size={80} />
                                <div className="relative">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} className={i < f.rating ? "fill-pink-600 text-pink-600" : "text-gray-200"} />
                                        ))}
                                    </div>
                                    <p className="text-black font-bold italic leading-relaxed mb-6">"{f.comment}"</p>
                                    <div className="flex items-center gap-4 border-t border-pink-50 pt-6">
                                        <div className="w-10 h-10 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 font-black text-xs">
                                            {f.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-black uppercase tracking-tight text-sm">{f.name}</h4>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Verified Member</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};





export default WelcomePage;

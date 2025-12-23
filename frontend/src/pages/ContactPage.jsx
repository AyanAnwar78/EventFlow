import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});

    const images = [
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1470229722913-7ea5676bb7ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!formState.name.trim()) newErrors.name = 'Name is required';
        if (!formState.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formState.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formState.message.length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }
        return newErrors;
    };

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        try {
            const res = await fetch(`${BACKEND_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState)
            });

            if (res.ok) {
                alert('Message sent successfully!');
                setFormState({ name: '', email: '', message: '' });
            } else {
                alert('Error sending message');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-6 md:p-12 relative bg-[#FFF5F5] overflow-hidden text-black">
            {/* Background Carousel */}
            {images.map((img, index) => (
                <div key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 -z-10 ${currentImageIndex === index ? 'opacity-5' : 'opacity-0'}`}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}

            {/* Background Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200/20 blur-[120px] rounded-full animate-pulse -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/30 blur-[120px] rounded-full animate-pulse delay-700 -z-10" />

            <div className="w-full max-w-6xl relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white/80 border border-pink-100 text-pink-600 font-black text-xs uppercase tracking-widest hover:bg-pink-600 hover:text-white transition-all mb-12 shadow-sm active:scale-95">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <div className="text-center mb-16 animate-fadeIn">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 text-black tracking-tight uppercase">
                        Get in <span className="text-pink-600 italic">Touch</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium italic">
                        Have questions about EventFlow? We're here to help you create amazing experiences.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <ContactCard
                            icon={<Mail size={24} className="text-pink-600" />}
                            title="Email Us"
                            content="support@eventflow.com"
                        />
                        <ContactCard
                            icon={<Phone size={24} className="text-pink-600" />}
                            title="Call Us"
                            content="+1 (555) 123-4567"
                        />
                        <ContactCard
                            icon={<MapPin size={24} className="text-pink-600" />}
                            title="Visit Us"
                            content="123 Event Street, Tech Valley, CA 94000"
                        />
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white/90 backdrop-blur-xl border-4 border-white rounded-[40px] p-8 md:p-12 shadow-2xl animate-fadeInDelay relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 blur-3xl -z-10 rounded-full opacity-50" />
                        <h2 className="text-3xl font-black mb-10 text-black uppercase tracking-tight">Send a <span className="text-pink-600 font-medium italic">Message</span></h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Identity Name</label>
                                <input
                                    type="text"
                                    value={formState.name}
                                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                                    required
                                    className="w-full bg-pink-50/50 border border-pink-100 p-5 rounded-3xl focus:outline-none focus:border-pink-500 transition-all text-black font-bold placeholder:text-gray-300"
                                    placeholder="Your full name"
                                />
                                {errors.name && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 block ml-1">{errors.name}</span>}
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Electronic Mail</label>
                                <input
                                    type="email"
                                    value={formState.email}
                                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                                    required
                                    className="w-full bg-pink-50/50 border border-pink-100 p-5 rounded-3xl focus:outline-none focus:border-pink-500 transition-all text-black font-bold placeholder:text-gray-300"
                                    placeholder="name@example.com"
                                />
                                {errors.email && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 block ml-1">{errors.email}</span>}
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Your Discourse</label>
                                <textarea
                                    rows={5}
                                    value={formState.message}
                                    onChange={e => setFormState({ ...formState, message: e.target.value })}
                                    required
                                    className="w-full bg-pink-50/50 border border-pink-100 p-5 rounded-[32px] focus:outline-none focus:border-pink-500 transition-all text-black font-bold placeholder:text-gray-300 resize-none"
                                    placeholder="How can we help?"
                                />
                                {errors.message && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 block ml-1">{errors.message}</span>}
                            </div>
                            <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-black py-5 rounded-[24px] shadow-xl shadow-pink-600/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-4 mt-8 uppercase tracking-[0.2em] text-xs">
                                <Send size={20} /> Transmit Request
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactCard = ({ icon, title, content }) => (
    <div className="flex items-center gap-6 bg-white/80 backdrop-blur-md border border-pink-100 p-8 rounded-[32px] group hover:bg-white hover:shadow-xl hover:shadow-pink-600/5 transition-all animate-fadeIn">
        <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner">
            {icon}
        </div>
        <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-pink-600 transition-colors">{title}</h3>
            <p className="text-lg font-black text-black tracking-tight">{content}</p>
        </div>
    </div>
);

export default ContactPage;

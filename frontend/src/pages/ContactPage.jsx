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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({}); // Clear errors if valid

        try {
            const res = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState)
            });

            if (res.ok) {
                alert('Message sent! We will get back to you soon.');
                setFormState({ name: '', email: '', message: '' });
            } else {
                alert('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="animate-fade-in" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 'clamp(2rem, 5vw, 4rem)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Carousel */}
            {images.map((img, index) => (
                <div key={index} style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: currentImageIndex === index ? 1 : 0,
                    transition: 'opacity 1s ease-in-out',
                    zIndex: -1
                }} />
            ))}
            {/* Dark Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.6)',
                zIndex: -1
            }} />

            <div style={{ width: '100%', maxWidth: '1200px', position: 'relative', zIndex: 1 }}>
                <Link to="/" className="btn-secondary" style={{
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '3rem',
                    padding: '0.6rem 1rem',
                    borderRadius: '12px',
                    borderColor: 'var(--glass-border)',
                    color: 'var(--text-secondary)'
                }}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
                        marginBottom: '1rem',
                        background: 'linear-gradient(to right, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Get in Touch
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        Have questions about EventFlow? We're here to help you create amazing experiences.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '3rem',
                    alignItems: 'start'
                }}>
                    {/* Contact Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <ContactCard
                            icon={<Mail size={24} color="#38bdf8" />}
                            title="Email Us"
                            content="support@eventflow.com"
                        />
                        <ContactCard
                            icon={<Phone size={24} color="#10b981" />}
                            title="Call Us"
                            content="+1 (555) 123-4567"
                        />
                        <ContactCard
                            icon={<MapPin size={24} color="#f472b6" />}
                            title="Visit Us"
                            content="123 Event Street, Tech Valley, CA 94000"
                        />
                    </div>

                    {/* Contact Form */}
                    <div className="glass-panel" style={{ padding: '2.5rem' }}>
                        <h2 style={{ marginBottom: '2rem' }}>Send a Message</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Name</label>
                                <input
                                    type="text"
                                    value={formState.name}
                                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                                    required
                                    style={{ background: 'rgba(255,255,255,0.03)' }}
                                />
                                {errors.name && <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
                                <input
                                    type="email"
                                    value={formState.email}
                                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                                    required
                                    style={{ background: 'rgba(255,255,255,0.03)' }}
                                />
                                {errors.email && <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Message</label>
                                <textarea
                                    rows={5}
                                    value={formState.message}
                                    onChange={e => setFormState({ ...formState, message: e.target.value })}
                                    required
                                    style={{ background: 'rgba(255,255,255,0.03)' }}
                                />
                                {errors.message && <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{errors.message}</span>}
                            </div>
                            <button className="btn" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                <Send size={18} /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactCard = ({ icon, title, content }) => (
    <div className="glass-panel" style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        background: 'rgba(30, 41, 59, 0.4)'
    }}>
        <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {icon}
        </div>
        <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{title}</h3>
            <p style={{ margin: 0, color: 'var(--text-primary)' }}>{content}</p>
        </div>
    </div>
);

export default ContactPage;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Calendar, Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { useRSVP } from '../hooks/useRSVP';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [loadingEvent, setLoadingEvent] = useState(true);

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
                fetch(`http://localhost:5000/api/events/${id}`),
                fetch(`http://localhost:5000/api/events/${id}/schedule`)
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
        await fetch('http://localhost:5000/api/schedules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event_id: id, ...scheduleForm })
        });
        setScheduleForm({ time: '', activity: '' });
        fetchEventData(); // Refresh schedule
    };

    if (loadingEvent || loadingGuests) return <p>Loading...</p>;
    if (!event) return <p>Event not found</p>;

    return (
        <div className="animate-fade-in">
            <Link to="/dashboard" className="btn-secondary" style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1.5rem',
                padding: '0.8rem 1.2rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(5px)'
            }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
            >
                <ArrowLeft size={18} />
                <span style={{ fontWeight: 500 }}>Back to Dashboard</span>
            </Link>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem', color: 'var(--accent)' }}>{event.name}</h1>
                <p style={{ fontSize: '1.2rem' }}>{event.date} • {event.location}</p>
                <p>{event.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Guests Section */}
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Users size={24} /> Guest List
                    </h2>
                    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                        <form onSubmit={handleAddGuest} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                placeholder="Guest Name"
                                value={guestForm.name}
                                onChange={e => setGuestForm({ ...guestForm, name: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Email (Optional)"
                                value={guestForm.email}
                                onChange={e => setGuestForm({ ...guestForm, email: e.target.value })}
                            />
                            <button className="btn" style={{ whiteSpace: 'nowrap' }}>Admit</button>
                        </form>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {guests.map(guest => (
                            <div key={guest.id} className="glass-panel" style={{ padding: '1rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>{guest.name}</h4>
                                    <small style={{ color: 'var(--text-secondary)' }}>{guest.email}</small>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{
                                        textTransform: 'uppercase',
                                        fontSize: '0.8rem',
                                        color: guest.rsvp_status === 'confirmed' ? 'springgreen' : guest.rsvp_status === 'declined' ? 'tomato' : 'orange'
                                    }}>
                                        {guest.rsvp_status}
                                    </span>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button onClick={() => updateRSVPStatus(guest.id, 'confirmed')} style={{ background: 'none', border: 'none', color: 'springgreen', cursor: 'pointer' }}><CheckCircle size={20} /></button>
                                        <button onClick={() => updateRSVPStatus(guest.id, 'declined')} style={{ background: 'none', border: 'none', color: 'tomato', cursor: 'pointer' }}><XCircle size={20} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logistics / Schedule Section */}
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Clock size={24} /> Schedule & Logistics
                    </h2>
                    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                        <form onSubmit={addScheduleItem} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="time"
                                value={scheduleForm.time}
                                onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                                required
                                style={{ width: '120px' }}
                            />
                            <input
                                placeholder="Activity / Logistic Item"
                                value={scheduleForm.activity}
                                onChange={e => setScheduleForm({ ...scheduleForm, activity: e.target.value })}
                                required
                            />
                            <button className="btn">Add</button>
                        </form>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {schedule.map(item => (
                            <div key={item.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{
                                    background: 'var(--accent)', color: 'white', padding: '0.5rem', borderRadius: '8px', fontWeight: 'bold'
                                }}>
                                    {item.time}
                                </div>
                                <div>
                                    <h4 style={{ margin: 0 }}>{item.activity}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;

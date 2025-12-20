import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Clock } from 'lucide-react';

const PastEvents = () => {
    const [events, setEvents] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPastEvents = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/events?type=past');
                const data = await res.json();
                setEvents(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPastEvents();
    }, []);

    return (
        <div style={{ color: 'white' }}>
            <h1 style={{ marginBottom: '2rem' }}>Past Events Gallery</h1>

            {events.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No past events.</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {events.map(event => (
                        <div key={event._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.8 }}>
                            <h3 style={{ fontSize: '1.3rem', margin: 0 }}>{event.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                <Calendar size={16} /> {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                <MapPin size={16} /> {event.location}
                            </div>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4', color: 'rgba(255,255,255,0.8)' }}>
                                {event.description}
                            </p>
                            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                Event Completed
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PastEvents;

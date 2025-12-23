import { useState, useEffect, useCallback } from 'react';

export const useRSVP = (eventId) => {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const fetchGuests = useCallback(async () => {
        if (!eventId) return;
        try {
            setLoading(true);
            const res = await fetch(`${BACKEND_URL}/api/events/${eventId}/guests`);
            if (!res.ok) throw new Error('Failed to fetch guests');
            const data = await res.json();
            setGuests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [eventId, BACKEND_URL]);

    useEffect(() => {
        fetchGuests();
    }, [fetchGuests]);

    const addGuest = async (name, email) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/guests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event_id: eventId, name, email })
            });
            if (!res.ok) throw new Error('Failed to add guest');
            await fetchGuests();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const updateRSVPStatus = async (guestId, status) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/guests/${guestId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rsvp_status: status })
            });
            if (!res.ok) throw new Error('Failed to update RSVP');
            await fetchGuests();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    return {
        guests,
        loading,
        error,
        addGuest,
        updateRSVPStatus,
        refreshGuests: fetchGuests
    };
};

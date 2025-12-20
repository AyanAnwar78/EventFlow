import { useState, useEffect, useCallback } from 'react';

export const useRSVP = (eventId) => {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGuests = useCallback(async () => {
        if (!eventId) return;
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:5000/api/events/${eventId}/guests`);
            if (!res.ok) throw new Error('Failed to fetch guests');
            const data = await res.json();
            setGuests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        fetchGuests();
    }, [fetchGuests]);

    const addGuest = async (name, email) => {
        try {
            const res = await fetch('http://localhost:5000/api/guests', {
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
            const res = await fetch(`http://localhost:5000/api/guests/${guestId}`, {
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

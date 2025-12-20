import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Download, Calendar, MapPin } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/bookings/my', {
                    credentials: 'include'
                });
                const data = await res.json();
                if (res.ok) setBookings(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const downloadReceipt = (booking) => {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text("Booking Receipt", 105, 20, { align: 'center' });
        doc.setFontSize(14);
        doc.text("Copy", 105, 30, { align: 'center' });

        const tableBody = [
            ["Name", booking.name],
            ["Booking ID", booking.bookingId],
            ["Event Type", booking.eventType],
            ["Date", new Date(booking.eventDate).toLocaleDateString()],
            ["Venue", booking.venue],
            ["Phone", booking.phone],
            ["Email", booking.email],
            ["Address", booking.address],
        ];

        doc.autoTable({
            startY: 40,
            head: [['Field', 'Details']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [56, 189, 248] }, // Blue header
            styles: { fontSize: 12, cellPadding: 5 }
        });

        doc.save(`Receipt-${booking.bookingId}.pdf`);
    };

    if (loading) return <div style={{ color: 'var(--text-primary)', textAlign: 'center', marginTop: '4rem' }}>Loading bookings...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>You haven't booked any events yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {bookings.map(booking => (
                        <div key={booking._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent)' }}>{booking.eventType}</h3>
                                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={16} /> {new Date(booking.eventDate).toLocaleDateString()}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={16} /> {booking.venue}
                                    </div>
                                </div>
                                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.7 }}>ID: {booking.bookingId}</p>
                            </div>
                            <button onClick={() => downloadReceipt(booking)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem' }}>
                                <Download size={16} /> Receipt
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;

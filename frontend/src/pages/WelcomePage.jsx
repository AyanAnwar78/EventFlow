import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';


import ImageScroller from '../components/ImageScroller';

const WelcomePage = () => {
    // Simplified Welcome Page

    return (
        <div className="animate-fade-in" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'clamp(1rem, 5vw, 2rem)',
            position: 'relative',
            background: 'linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%)'
        }}>
            <ImageScroller />
            {/* Hero Section */}
            <div style={{ textAlign: 'center', maxWidth: '800px', marginBottom: 'clamp(2rem, 8vw, 4rem)', width: '100%' }}>
                <div style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--accent)',
                    color: 'var(--accent)',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    marginBottom: '1.5rem'
                }}>
                    ✨ The Future of Event Management
                </div>
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                    lineHeight: '1.1',
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Seamless Events,<br />Unforgettable Moments.
                </h1>
                <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.8' }}>
                    Plan, track, and celebrate with EventFlow. The all-in-one platform designed to make your event planning effortless and elegant.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/login" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Get Started <ArrowRight size={20} />
                    </Link>
                    <Link to="/about" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', textDecoration: 'none' }}>
                        Learn More
                    </Link>
                </div>
                <div style={{ marginTop: '2rem' }}>
                    <Link to="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', borderBottom: '1px solid var(--text-secondary)', paddingBottom: '2px' }}>
                        Contact Us
                    </Link>
                </div>
            </div>



        </div>
    );
};





export default WelcomePage;

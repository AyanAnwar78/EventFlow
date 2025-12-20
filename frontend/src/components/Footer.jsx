import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Linkedin, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="glass-panel" style={{
            marginTop: 'auto',
            padding: '1.5rem 1rem',
            borderTop: '1px solid var(--glass-border)',
            background: 'var(--bg-card)',
            backdropFilter: 'blur(10px)',
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: 'none',
            borderRadius: '0'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '2rem'
            }}>
                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                    <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)' }}>EventFlow</span>
                </div>

                {/* Quick Links - Horizontal for compact look */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/" className="footer-link">Home</Link>
                    <Link to="/about" className="footer-link">About</Link>
                    <Link to="/past-events" className="footer-link">Past Events</Link>
                    <Link to="/contact" className="footer-link">Contact</Link>
                </div>

                {/* Socials */}
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <SocialIcon icon={<Instagram size={18} />} />
                    <SocialIcon icon={<Twitter size={18} />} />
                    <SocialIcon icon={<Facebook size={18} />} />
                </div>
            </div>

            <div style={{
                textAlign: 'center',
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem'
            }}>
                &copy; {new Date().getFullYear()} EventFlow. All rights reserved.
            </div>

            <style>{`
                .footer-link {
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: color 0.2s;
                    font-size: 0.9rem;
                }
                .footer-link:hover {
                    color: var(--accent);
                }
            `}</style>
        </footer>
    );
};

const SocialIcon = ({ icon }) => (
    <a href="#" style={{
        color: 'var(--text-secondary)',
        padding: '6px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '6px',
        transition: 'all 0.2s',
        display: 'flex'
    }}
        onMouseEnter={e => {
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.background = 'var(--accent)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        }}
    >
        {icon}
    </a>
);

export default Footer;

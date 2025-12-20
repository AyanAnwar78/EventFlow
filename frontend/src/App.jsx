import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PastEvents from './pages/PastEvents';
import MyBookings from './pages/MyBookings';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';

import { LayoutDashboard, LogOut, Camera } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    // Hide sidebar on these pages
    if (['/login', '/register', '/', '/about', '/contact'].includes(location.pathname)) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

                <div style={{ flex: 1 }}>
                    {children}
                </div>
                <Footer />
            </div>
        );
    }

    // Protected Route Check (Simple redirect if not logged in for other pages)
    if (!user && !['/login', '/register', '/', '/about', '/contact'].includes(location.pathname)) {
        return <Navigate to="/login" replace />;
    }

    const isAdmin = user?.role === 'admin';

    return (
        <div className="app-container">

            {isAdmin ? (
                <nav className="glass-panel" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    width: '250px',
                    padding: '2rem',
                    zIndex: 100
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                        <img src="/logo.png" alt="Logo" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                        <h2 style={{ color: 'var(--accent)', margin: 0, fontSize: '1.5rem' }}>EventFlow</h2>
                    </div>

                    <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Welcome, {user?.name} <br />
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>({user?.role})</span>
                    </div>

                    <ul style={{ listStyle: 'none' }}>
                        <li style={{ marginBottom: '1rem' }}>
                            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                                <Link to="/dashboard" style={{ color: 'var(--text-primary)', textDecoration: 'none', padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--glass-border)' }}>
                                    <LayoutDashboard size={20} /> Dashboard
                                </Link>
                                <Link to="/past-events" style={{ color: 'var(--text-primary)', textDecoration: 'none', padding: '0.8rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.3s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Camera size={20} /> Past Events
                                </Link>
                            </nav>
                        </li>
                    </ul>
                    <div style={{ position: 'absolute', bottom: '2rem', width: 'calc(100% - 4rem)' }}>
                        <button onClick={logout} style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '1rem'
                        }}>
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </nav>
            ) : (
                /* User Top Navigation */
                <nav className="glass-panel" style={{
                    position: 'sticky',
                    top: 0,
                    width: '100%',
                    padding: '1rem 2rem',
                    zIndex: 100,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    borderRadius: '0 0 20px 20px',
                    background: 'var(--bg-card)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="/logo.png" alt="Logo" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                        <h2 style={{ color: 'var(--accent)', margin: 0, fontSize: '1.5rem' }}>EventFlow</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <Link to="/dashboard" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
                        <Link to="/my-bookings" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>My Bookings</Link>
                        <Link to="/past-events" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>Past Events</Link>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.name}</span>
                            <button onClick={logout} style={{
                                background: 'var(--bg-card)',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    </div>
                </nav>
            )}

            <main style={{
                marginLeft: isAdmin ? '250px' : '0',
                padding: '2rem',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                marginTop: isAdmin ? '0' : '0'
            }}>
                <div style={{ flex: 1, maxWidth: isAdmin ? '100%' : '1200px', margin: isAdmin ? '0' : '0 auto', width: '100%' }}>
                    {children}
                </div>
                <div style={{ marginTop: '3rem' }}>
                    <Footer />
                </div>
            </main>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/" element={<WelcomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/past-events" element={<PastEvents />} />
                        <Route path="/events/:id" element={<EventDetails />} />
                        <Route path="/my-bookings" element={<MyBookings />} />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    );
}

export default App;

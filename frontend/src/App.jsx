import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import RoleDashboard from './pages/RoleDashboard';
import EventDetails from './pages/EventDetails';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PastEvents from './pages/PastEvents';

import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';

import { LayoutDashboard, LogOut, Camera, Shield, Users, Calendar, Settings } from 'lucide-react';

const Layout = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    // Protected Route Check
    if (!user && !['/login', '/register', '/', '/about', '/contact'].includes(location.pathname)) {
        return <Navigate to="/login" replace />;
    }

    const isAdmin = user?.role === 'admin';

    // Simplified layout for auth and landing pages
    if (['/login', '/register', '/', '/about', '/contact'].includes(location.pathname)) {
        return (
            <div className="flex flex-col min-h-screen bg-[#FFF5F5] text-black font-['Outfit']">
                <main className="flex-1">
                    <Outlet />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#FFF5F5] text-black font-['Outfit']">
            {/* Sidebar for Admin */}
            {isAdmin && (
                <div className="w-64 bg-white/80 backdrop-blur-xl border-r border-pink-100 flex flex-col p-6 shadow-xl z-20 sticky top-0 h-screen">
                    <div className="mb-10 px-2">
                        <div className="w-12 h-12 bg-pink-600 rounded-2xl flex items-center justify-center font-bold text-2xl text-black shadow-lg shadow-pink-600/20 mb-4">E</div>
                        <h1 className="text-xl font-black tracking-tight text-gray-900 text-left">EventFlow <span className="text-pink-600 text-xs block uppercase tracking-widest">Admin Panel</span></h1>
                    </div>

                    <nav className="space-y-2 flex-grow">
                        <NavLink to="/dashboard" icon={<Shield size={20} />} label="Overview" />
                        <NavLink to="/dashboard" icon={<Calendar size={20} />} label="Events" />
                        <NavLink to="/dashboard" icon={<Users size={20} />} label="Users" />
                    </nav>

                    <button onClick={logout} className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-black hover:text-red-600 hover:bg-red-50 transition-all font-semibold">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            )}

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Nav for Users/Guests/Organizers */}
                {!isAdmin && (
                    <nav className="h-20 bg-white/60 backdrop-blur-md border-b border-pink-100 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm text-left">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center font-bold text-xl text-black shadow-lg shadow-pink-600/20 transition-transform group-hover:scale-105">E</div>
                            <span className="text-xl font-black tracking-tighter text-black">EVENT<span className="text-pink-600">FLOW</span></span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/about" className="text-sm font-bold text-black hover:text-pink-600 transition-colors">ABOUT</Link>
                            <Link to="/past-events" className="text-sm font-bold text-black hover:text-pink-600 transition-colors">ARCHIVE</Link>
                            <Link to="/contact" className="text-sm font-bold text-black hover:text-pink-600 transition-colors">CONTACT</Link>
                            {user ? (
                                <div className="relative group/profile">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white/80 border border-pink-100 rounded-full hover:border-pink-300 transition-all shadow-sm">
                                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-black text-xs">
                                            {user.email?.[0].toUpperCase() || 'U'}
                                        </div>
                                        <span className="text-xs font-bold text-black uppercase tracking-widest">{user.name || 'Profile'}</span>
                                    </button>

                                    {/* Dropdown */}
                                    <div className="absolute right-0 mt-2 w-64 bg-white border border-pink-100 rounded-2xl shadow-xl opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 z-50 p-2">
                                        <div className="p-4 border-b border-pink-50">
                                            <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest mb-1">Signed in as</p>
                                            <p className="text-sm font-bold text-black truncate">{user.email}</p>
                                        </div>
                                        <div className="p-2 space-y-1">
                                            <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pink-50 text-black transition-colors text-sm font-bold">
                                                <LayoutDashboard size={18} className="text-pink-600" />
                                                <span>Dashboard</span>
                                            </Link>
                                            <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pink-50 text-black transition-colors text-sm font-bold">
                                                <Settings size={18} className="text-pink-600" />
                                                <span>Edit Profile</span>
                                            </Link>
                                            <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-sm font-bold text-left">
                                                <LogOut size={18} />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-black text-xs font-black uppercase tracking-widest rounded-full transition-all shadow-lg shadow-pink-600/20 active:scale-95">Get Started</Link>
                            )}
                        </div>
                    </nav>
                )}

                <main className="flex-grow p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const NavLink = ({ to, icon, label }) => (
    <Link to={to} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-gray-900 hover:text-pink-600 hover:bg-pink-50 transition-all font-bold text-left">
        {icon}
        <span>{label}</span>
    </Link>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<WelcomePage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="contact" element={<ContactPage />} />
                        <Route path="dashboard" element={<RoleDashboard />} />
                        <Route path="past-events" element={<PastEvents />} />
                        <Route path="events/:id" element={<EventDetails />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

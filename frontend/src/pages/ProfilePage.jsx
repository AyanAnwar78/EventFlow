import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [message, setMessage] = useState('');

    const handleSave = (e) => {
        e.preventDefault();
        // Mock save functionality
        setMessage('Profile updated successfully (Mock)');
        setTimeout(() => setMessage(''), 3000);
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 animate-fadeIn text-black">
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white/80 border border-pink-100 text-pink-600 font-black text-xs uppercase tracking-widest hover:bg-pink-600 hover:text-white transition-all shadow-sm active:scale-95 mb-8">
                <ArrowLeft size={18} />
                <span>Back to Dashboard</span>
            </Link>

            <div className="bg-white/90 backdrop-blur-xl border-4 border-white p-10 md:p-14 rounded-[48px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-pink-50 blur-[120px] rounded-full -z-10 opacity-60" />

                <h1 className="text-4xl font-black mb-10 tracking-tight uppercase">User <span className="text-pink-600 italic">Profile</span></h1>

                {message && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl font-bold text-sm text-center animate-bounce">
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-40 h-40 bg-pink-100 rounded-[40px] flex items-center justify-center text-pink-600 text-6xl font-black shadow-inner border-4 border-white">
                            {user.name?.[0].toUpperCase() || user.email?.[0].toUpperCase()}
                        </div>
                        <div className="text-center">
                            <span className="px-4 py-1.5 bg-pink-50 text-pink-600 border border-pink-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                                {user.role || 'Member'}
                            </span>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSave} className="md:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity</label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-600" size={20} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-pink-50/50 border border-pink-100 pl-14 pr-6 py-5 rounded-[24px] focus:outline-none focus:border-pink-500 transition-all text-black font-bold"
                                    placeholder="Your Name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 opacity-60">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Electronic Mail (Verified)</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full bg-gray-50 border border-gray-100 pl-14 pr-6 py-5 rounded-[24px] text-gray-500 font-bold cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 opacity-60">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Access Protocol</label>
                            <div className="relative">
                                <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={user.role?.toUpperCase()}
                                    disabled
                                    className="w-full bg-gray-50 border border-gray-100 pl-14 pr-6 py-5 rounded-[24px] text-gray-500 font-black tracking-widest text-xs cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-black py-5 rounded-[24px] shadow-xl shadow-pink-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs mt-4"
                        >
                            <Save size={18} /> Update credentials
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

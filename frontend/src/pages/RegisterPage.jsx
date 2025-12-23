import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Briefcase } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user' // Default to user
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${BACKEND_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                login(data.user);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Something went wrong');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-8 bg-[#FFF5F5]">
            <div className="bg-white/90 backdrop-blur-xl border border-pink-100 p-10 rounded-3xl w-full max-w-sm shadow-xl relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-100/50 blur-3xl -z-10 rounded-full" />

                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-lg shadow-pink-600/20 text-white">E</div>
                </div>
                <h2 className="text-3xl font-black text-center mb-2 tracking-tight text-black">Create <span className="text-pink-600">Account</span></h2>
                <p className="text-black text-center mb-8 text-sm font-bold italic opacity-80">Join EventFlow today</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm text-center font-bold animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-600 transition-colors">
                            <User size={18} />
                        </div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-white border border-pink-100 pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/5 transition-all placeholder:text-gray-400 text-sm font-bold text-black shadow-sm"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-600 transition-colors">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-white border border-pink-100 pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/5 transition-all placeholder:text-gray-400 text-sm font-bold text-black shadow-sm"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-600 transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-white border border-pink-100 pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/5 transition-all placeholder:text-gray-400 text-sm font-bold text-black shadow-sm"
                        />
                    </div>

                    <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-black font-black py-4 rounded-xl shadow-lg shadow-pink-600/20 transform active:scale-[0.98] transition-all mt-4 uppercase tracking-widest text-xs">
                        Sign Up
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600 font-bold">
                    Already have an account? <Link to="/login" className="text-pink-600 font-black hover:underline transition-all hover:text-pink-700">Go to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;

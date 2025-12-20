import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                login(data.user);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Is backend running?');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '2rem'
        }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
                {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="input-group">
                        <Mail size={20} color="var(--text-secondary)" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock size={20} color="var(--text-secondary)" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                        Login
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent)' }}>Register</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

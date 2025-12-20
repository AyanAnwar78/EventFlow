import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Heart, Award } from 'lucide-react';

const AboutPage = () => {
    const images = [
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1470229722913-7ea5676bb7ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    ];

    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="animate-fade-in" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 'clamp(2rem, 5vw, 4rem)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Carousel */}
            {images.map((img, index) => (
                <div key={index} style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: currentImageIndex === index ? 1 : 0,
                    transition: 'opacity 1s ease-in-out',
                    zIndex: -1
                }} />
            ))}
            {/* Dark Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.6)',
                zIndex: -1
            }} />
            <div style={{ width: '100%', maxWidth: '1000px' }}>
                <Link to="/" className="btn-secondary" style={{
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '3rem',
                    padding: '0.6rem 1rem',
                    borderRadius: '12px',
                    borderColor: 'var(--glass-border)',
                    color: 'var(--text-secondary)'
                }}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
                        marginBottom: '1rem',
                        background: 'linear-gradient(to right, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        About EventFlow
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        Empowering creators to build unforgettable experiences through seamless technology and intuitive design.
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '3rem', marginBottom: '3rem' }}>
                    <h2 style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>Our Mission</h2>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                        At EventFlow, we believe that planning an event should be as enjoyable as attending one.
                        We started with a simple idea: to remove the friction from event management.
                        Whether you're organizing a small family gathering or a large corporate conference,
                        our tools are designed to streamline logistics so you can focus on what matters most—connecting with people.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    <ValueCard
                        icon={<Target size={32} color="#38bdf8" />}
                        title="Simplicity First"
                        description="We obsess over every pixel to ensure our platform is powerful yet incredibly easy to use."
                    />
                    <ValueCard
                        icon={<Heart size={32} color="#f472b6" />}
                        title="User Centric"
                        description="We build features based on real feedback from our community of passionate event planners."
                    />
                    <ValueCard
                        icon={<Award size={32} color="#fbbf24" />}
                        title="Excellence"
                        description="Reliability and performance are at the core of everything we build."
                    />
                </div>
            </div>
        </div>
    );
};

const ValueCard = ({ icon, title, description }) => (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.5rem'
        }}>
            {icon}
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

export default AboutPage;

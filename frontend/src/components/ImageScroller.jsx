import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageScroller = () => {
    const images = [
        "https://images.unsplash.com/photo-1530103862676-de3c9da59af7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Party/Birthday
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Music/DJ
        "https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Dance/Club
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",  // Event/Crowd
        "https://images.unsplash.com/photo-1514525253440-b393452e8d26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Club/Lights
        "https://images.unsplash.com/photo-1519671482538-5810a98f7009?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Formal/Table
        "https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Concert
        "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"  // Confetti
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="glass-panel" style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto 4rem auto',
            borderRadius: '20px',
            overflow: 'hidden',
            aspectRatio: '16/9',
            maxHeight: '600px'
        }}>
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
                    opacity: currentIndex === index ? 1 : 0,
                    transition: 'opacity 0.8s ease-in-out',
                }} />
            ))}

            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                padding: '2rem',
                color: 'white'
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Experience the Magic</h2>
                <p style={{ opacity: 0.8 }}>Curated venues and unforgettable moments.</p>
            </div>

            <button onClick={prev} style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                color: 'white',
                padding: '10px',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'background 0.3s'
            }}>
                <ChevronLeft size={24} />
            </button>
            <button onClick={next} style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                color: 'white',
                padding: '10px',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'background 0.3s'
            }}>
                <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '10px'
            }}>
                {images.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: currentIndex === index ? 'var(--accent)' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageScroller;

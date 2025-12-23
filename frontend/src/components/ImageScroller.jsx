import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const ImageScroller = () => {
    const images = [
        "https://images.unsplash.com/photo-1530103862676-de3c9da59af7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1514525253440-b393452e8d26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1519671482538-5810a98f7009?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="relative w-full max-w-7xl mx-auto mb-20 rounded-[3rem] overflow-hidden group shadow-[0_32px_64px_-16px_rgba(219,39,119,0.1)] border-8 border-white aspect-[16/9] md:aspect-[21/9]">
            {/* Images */}
            {images.map((img, index) => (
                <div key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform ${currentIndex === index ? 'opacity-100 scale-100 active' : 'opacity-0 scale-110 pointer-events-none'}`}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}

            {/* Content Overlay */}
            <div className="absolute inset-x-0 bottom-0 py-16 px-10 md:px-20 bg-gradient-to-t from-white via-white/40 to-transparent flex flex-col justify-end h-[60%] backdrop-blur-[2px]">
                <div className="flex items-center gap-3 mb-6 animate-fadeIn">
                    <div className="p-2 bg-pink-600 rounded-xl shadow-lg shadow-pink-600/20">
                        <Sparkles size={18} className="text-white" />
                    </div>
                    <span className="text-pink-600 font-black text-xs uppercase tracking-[0.4em] mb-0.5">Premier Selection</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter uppercase leading-[0.9]">
                    Elevate the <span className="text-pink-600 italic">Ordinary</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl font-bold leading-relaxed italic">
                    Curated venues, seamless planning, and unforgettable moments captured in the flow of time.
                </p>
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-700 z-30">
                <button onClick={prev} className="p-6 rounded-[2rem] bg-white/80 backdrop-blur-xl border border-pink-100 text-pink-600 hover:bg-pink-600 hover:text-white transition-all shadow-2xl active:scale-90 group/btn">
                    <ChevronLeft size={32} className="group-hover/btn:-translate-x-1 transition-transform" />
                </button>
                <button onClick={next} className="p-6 rounded-[2rem] bg-white/80 backdrop-blur-xl border border-pink-100 text-pink-600 hover:bg-pink-600 hover:text-white transition-all shadow-2xl active:scale-90 group/btn">
                    <ChevronRight size={32} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Progress Bars */}
            <div className="absolute top-10 left-10 right-10 flex gap-4 z-40">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className="flex-1 h-1.5 rounded-full overflow-hidden bg-pink-900/10 transition-all relative group/btn"
                    >
                        <div
                            className={`absolute inset-0 bg-pink-600 transition-all duration-300 ${currentIndex === index ? 'w-full' : 'w-0 group-hover/btn:w-full group-hover/btn:bg-pink-600/30'}`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImageScroller;

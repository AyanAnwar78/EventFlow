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
        <div className="flex flex-col items-center min-h-screen p-6 md:p-12 relative bg-[#FFF5F5] overflow-hidden text-black">
            {/* Background Carousel */}
            {images.map((img, index) => (
                <div key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 -z-10 ${currentImageIndex === index ? 'opacity-5' : 'opacity-0'}`}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}

            {/* Background Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200/20 blur-[120px] rounded-full animate-pulse -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/30 blur-[120px] rounded-full animate-pulse delay-700 -z-10" />

            <div className="w-full max-w-5xl relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white/80 border border-pink-100 text-pink-600 font-black text-xs uppercase tracking-widest hover:bg-pink-600 hover:text-white transition-all mb-12 shadow-sm active:scale-95">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <div className="text-center mb-16 animate-fadeIn">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 text-black tracking-tight uppercase">
                        About <span className="text-pink-600 italic">EventFlow</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium italic">
                        Empowering creators to build unforgettable experiences through seamless technology and intuitive design.
                    </p>
                </div>

                <div className="bg-white/90 backdrop-blur-xl border-4 border-white rounded-[40px] p-8 md:p-16 mb-16 shadow-2xl animate-fadeInDelay relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 blur-3xl -z-10 rounded-full opacity-50" />
                    <h2 className="text-3xl md:text-4xl font-black text-pink-600 mb-8 uppercase tracking-tight">Our <span className="text-black">Mission</span></h2>
                    <p className="text-lg md:text-2xl text-black leading-relaxed font-bold">
                        At EventFlow, we believe that planning an event should be as enjoyable as attending one.
                        We started with a simple idea: to remove the friction from event management.
                        Whether you're organizing a small family gathering or a large corporate conference,
                        our tools are designed to streamline logistics so you can focus on what matters most—connecting with people.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ValueCard
                        icon={<Target size={32} className="text-pink-600" />}
                        title="Simplicity First"
                        description="We obsess over every pixel to ensure our platform is powerful yet incredibly easy to use."
                    />
                    <ValueCard
                        icon={<Heart size={32} className="text-pink-600" />}
                        title="User Centric"
                        description="We build features based on real feedback from our community of passionate event planners."
                    />
                    <ValueCard
                        icon={<Award size={32} className="text-pink-600" />}
                        title="Excellence"
                        description="Reliability and performance are at the core of everything we build."
                    />
                </div>
            </div>
        </div>
    );
};

const ValueCard = ({ icon, title, description }) => (
    <div className="bg-white/80 backdrop-blur-md border border-pink-100 p-10 rounded-[32px] flex flex-col gap-6 hover:shadow-xl hover:shadow-pink-600/5 hover:-translate-y-2 transition-all group animate-fadeIn">
        <div className="w-20 h-20 bg-pink-50 rounded-2xl flex items-center justify-center transition-colors shadow-inner group-hover:scale-110">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-black mb-3 text-black uppercase tracking-tight group-hover:text-pink-600 transition-colors">{title}</h3>
            <p className="text-gray-500 text-sm font-bold leading-relaxed">{description}</p>
        </div>
    </div>
);

export default AboutPage;

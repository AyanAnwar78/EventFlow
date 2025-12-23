import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Linkedin, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full bg-white/60 backdrop-blur-xl border-t border-pink-100 py-16 px-6 mt-32 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-100/30 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16 text-center md:text-left relative z-10">
                {/* Brand */}
                <div className="space-y-6 max-w-sm">
                    <div className="flex items-center justify-center md:justify-start gap-4 group cursor-pointer">
                        <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center font-bold text-xl text-black shadow-lg shadow-pink-600/20 transition-transform group-hover:rotate-6">E</div>
                        <span className="text-3xl font-black text-black tracking-tight uppercase italic">Event<span className="text-pink-600">Flow</span></span>
                    </div>
                    <p className="text-sm text-gray-500 font-bold leading-relaxed italic">
                        The modern standard for event management and seamless experiences. Designed for those who seek excellence in every detail.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                    <FooterLink to="/" label="Portal" />
                    <FooterLink to="/about" label="Manifesto" />
                    <FooterLink to="/past-events" label="Archives" />
                    <FooterLink to="/contact" label="Inquiries" />
                </div>

                {/* Socials */}
                <div className="flex items-center gap-5">
                    <SocialIcon icon={<Instagram size={20} />} href="#" />
                    <SocialIcon icon={<Twitter size={20} />} href="#" />
                    <SocialIcon icon={<Facebook size={20} />} href="#" />
                    <SocialIcon icon={<Linkedin size={20} />} href="#" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-10 border-t border-pink-50 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                <p>&copy; {new Date().getFullYear()} EventFlow Systems & Logic</p>
                <div className="flex gap-10">
                    <a href="#" className="hover:text-pink-600 transition-colors">Privacy Protocal</a>
                    <a href="#" className="hover:text-pink-600 transition-colors">Terms of Operations</a>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, label }) => (
    <Link
        to={to}
        className="text-xs font-black text-gray-400 hover:text-pink-600 transition-all uppercase tracking-widest hover:translate-x-1 block"
    >
        {label}
    </Link>
);

const SocialIcon = ({ icon, href }) => (
    <a
        href={href}
        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-pink-50 text-gray-400 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all transform hover:-translate-y-1 active:scale-90 shadow-sm shadow-pink-100"
    >
        {icon}
    </a>
);

export default Footer;

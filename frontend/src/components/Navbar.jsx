import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../utils/api';

export default function Navbar({ onLoginClick, isAuthenticated, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const res = await api.get("/messages/unreadCount");
        setUnreadCount(res.data.count);
      } catch (err) {
        console.error("Error fetching unread count", err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Posts', path: '/posts' },
    { name: 'Messages', path: '/messages' },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] px-6 sm:px-12 py-3 sm:py-5 flex justify-between items-center pointer-events-auto backdrop-blur-xl bg-white/[0.03] border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        {/* Left Links - Desktop */}
        <div className="hidden md:flex gap-8 w-1/3 justify-start font-syne text-[10px] font-bold tracking-[0.2em] uppercase items-center">
          <Link to="/" className={`transition-colors cursor-none ${location.pathname === '/' ? 'text-found-gold' : 'text-white/60 hover:text-white'}`}>Home</Link>
          <Link to="/posts" className={`transition-colors cursor-none ${location.pathname === '/posts' ? 'text-found-gold' : 'text-white/60 hover:text-white'}`}>Posts</Link>
          <Link to="/messages" className={`transition-colors cursor-none relative ${location.pathname === '/messages' ? 'text-found-gold' : 'text-white/60 hover:text-white'}`}>
            Messages
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></span>
            )}
          </Link>
        </div>

        {/* Center Logo */}
        <div className="md:w-1/3 flex justify-start md:justify-center items-center">
          <Link to="/" className="font-syne font-extrabold text-lg sm:text-2xl lg:text-3xl tracking-[0.15em] sm:tracking-[0.2em] select-none hover:scale-105 transition-transform">
            <span className="text-white drop-shadow-[0_0_12px_rgba(124,92,191,0.6)]">LOST</span>
            <span className="text-found-gold mx-0.5 sm:mx-1 drop-shadow-[0_0_10px_rgba(200,147,58,0.8)]">N</span>
            <span className="text-found-ink drop-shadow-[0_0_12px_rgba(240,192,112,0.8)]">FOUND</span>
          </Link>
        </div>

        {/* Right Links - Desktop */}
        <div className="flex gap-4 sm:gap-8 md:w-1/3 justify-end items-center font-syne text-[10px] font-bold tracking-[0.2em] uppercase">
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <div className="flex gap-6 items-center">
                <span className="text-found-ink tracking-widest">{user?.name}</span>
                <button onClick={onLogout} className="px-6 py-2 border-2 border-found-gold text-found-ink rounded-full hover:bg-found-gold hover:text-white transition-all shadow-md active:scale-95 cursor-none">
                  Log Out
                </button>
              </div>
            ) : (
              <button onClick={onLoginClick} className="px-6 py-2 border-2 border-found-gold text-found-ink rounded-full hover:bg-found-gold hover:text-white transition-all shadow-md active:scale-95 cursor-none">
                Sign In
              </button>
            )}
          </div>

          {/* Hamburger Menu Button - Mobile only */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden text-white p-2 focus:outline-none z-[110] relative"
            aria-label="Toggle Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between items-center transition-all">
              <span className={`w-full h-0.5 bg-found-gold transition-all origin-left ${isMenuOpen ? 'rotate-45 translate-x-1' : ''}`}></span>
              <span className={`w-full h-0.5 bg-found-gold transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-full h-0.5 bg-found-gold transition-all origin-left ${isMenuOpen ? '-rotate-45 translate-x-1' : ''}`}></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Slide-down Menu */}
      <div className={`fixed inset-0 z-[90] md:hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-full'}`}>
        {/* Transparent Overlay to close menu */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        
        {/* Menu Content */}
        <div className="absolute top-0 w-full pt-24 pb-12 px-8 bg-lost-bg/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={() => setIsMenuOpen(false)}
              className={`font-syne font-extrabold text-2xl tracking-widest uppercase transition-all ${location.pathname === link.path ? 'text-found-gold scale-110' : 'text-white hover:text-found-gold'}`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="w-full border-t border-white/10 pt-8 flex flex-col items-center gap-6">
            {isAuthenticated ? (
              <>
                <span className="font-syne font-bold text-found-ink tracking-widest uppercase text-sm">{user?.name}</span>
                <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full max-w-xs py-4 border-2 border-found-gold text-found-gold rounded-full font-syne font-bold uppercase tracking-[0.2em] text-xs hover:bg-found-gold hover:text-white transition-all">
                  Log Out
                </button>
              </>
            ) : (
              <button onClick={() => { onLoginClick(); setIsMenuOpen(false); }} className="w-full max-w-xs py-4 bg-found-gold text-white rounded-full font-syne font-bold uppercase tracking-[0.2em] text-xs hover:shadow-[0_0_20px_rgba(200,147,58,0.4)] transition-all">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

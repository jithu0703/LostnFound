import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ onLoginClick, isAuthenticated, user, onLogout }) {
  return (
    <nav className="fixed top-0 w-full z-50 px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center pointer-events-auto">
      {/* Left Links - hidden on mobile */}
      <div className="hidden md:flex gap-8 w-1/3 justify-start font-syne text-xs font-bold tracking-[0.2em] uppercase">
      </div>

      {/* Center Logo */}
      <div className="md:w-1/3 flex justify-start md:justify-center items-center">
        <Link to="/" className="font-syne font-extrabold text-lg sm:text-2xl lg:text-3xl tracking-[0.15em] sm:tracking-[0.2em] select-none hover:scale-105 transition-transform">
          <span className="text-white drop-shadow-[0_0_12px_rgba(124,92,191,0.6)]">LOST</span>
          <span className="text-found-gold mx-0.5 sm:mx-1 drop-shadow-[0_0_10px_rgba(200,147,58,0.8)]">N</span>
          <span className="text-found-ink drop-shadow-[0_0_12px_rgba(240,192,112,0.8)]">FOUND</span>
        </Link>
      </div>

      {/* Right Links */}
      <div className="flex gap-4 sm:gap-8 md:w-1/3 justify-end items-center font-syne text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase">
        {isAuthenticated ? (
           <div className="flex gap-3 sm:gap-6 items-center">
             <span className="text-found-ink tracking-widest hidden sm:inline">{user?.name}</span>
             <button onClick={onLogout} className="px-4 py-1.5 sm:px-6 sm:py-2 border-2 border-found-gold text-found-ink rounded-full hover:bg-found-gold hover:text-white transition-all shadow-md active:scale-95 cursor-none text-[10px] sm:text-xs">
               Log Out
             </button>
           </div>
        ) : (
           <button onClick={onLoginClick} className="px-4 py-1.5 sm:px-6 sm:py-2 border-2 border-found-gold text-found-ink rounded-full hover:bg-found-gold hover:text-white transition-all shadow-md active:scale-95 cursor-none text-[10px] sm:text-xs">
             Sign In
           </button>
        )}
      </div>
    </nav>
  );
}

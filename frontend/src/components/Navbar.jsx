import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ onLoginClick, isAuthenticated, user, onLogout }) {
  return (
    <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center pointer-events-auto">
      {/* Left Links - Blank for now as requested */}
      <div className="flex gap-8 w-1/3 justify-start font-syne text-xs font-bold tracking-[0.2em] uppercase">
      </div>

      {/* Center Logo - Positioned directly over the Rift */}
      <div className="w-1/3 flex justify-center items-center">
        <Link to="/" className="font-syne font-extrabold text-2xl lg:text-3xl tracking-[0.2em] select-none hover:scale-105 transition-transform">
          <span className="text-white drop-shadow-[0_0_12px_rgba(124,92,191,0.6)]">LOST</span>
          <span className="text-found-gold mx-1 drop-shadow-[0_0_10px_rgba(200,147,58,0.8)]">N</span>
          <span className="text-found-ink drop-shadow-[0_0_12px_rgba(240,192,112,0.8)]">FOUND</span>
        </Link>
      </div>

      {/* Right Links - Found Theme */}
      <div className="flex gap-8 w-1/3 justify-end items-center font-syne text-xs font-bold tracking-[0.2em] uppercase">
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
    </nav>
  );
}

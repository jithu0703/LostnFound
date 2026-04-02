import React from 'react';
import Navbar from '../components/Navbar';
import ShadowCursor from '../components/ShadowCursor';
import './LandingPage.css';

export default function MessagesPage() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="landing-wrapper min-h-screen bg-lost-bg text-white">
      <ShadowCursor />
      <Navbar 
        onLoginClick={() => window.location.href = "/"} 
        isAuthenticated={!!user} 
        user={user} 
        onLogout={handleLogout} 
      />

      <div className="pt-40 pb-20 px-8 flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl bg-lost-mid/50 p-12 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl">
          <span className="text-6xl mb-6 block">📩</span>
          <h1 className="font-syne font-extrabold text-4xl mb-4 tracking-tight">The <span className="text-found-gold">Whispers</span></h1>
          <p className="font-crimson italic text-lost-muted text-xl mb-8 leading-relaxed">
            Direct connections between finders and seekers are currently being forged in the void.
          </p>
          <div className="inline-block px-6 py-2 border border-found-gold/30 text-found-gold font-syne font-bold text-xs uppercase tracking-[0.2em] rounded-full">
            Coming Soon to the Network
          </div>
        </div>
      </div>
    </div>
  );
}

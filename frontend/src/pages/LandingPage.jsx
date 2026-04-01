import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoginModal from '../components/LoginModal';
import ReportLostForm from '../components/ReportLostForm';
import PostFoundForm from '../components/PostFoundForm';
import './LandingPage.css';

export default function LandingPage() {
  const canvasRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorSpotRef = useRef(null);

  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [heroMode, setHeroMode] = useState('split');

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const requireAuth = (action) => {
    if (!isAuthenticated) return setShowLogin(true);
    action();
  };

  // Spotlight Cursor Logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const isRightSide = clientX > window.innerWidth / 2;
      
      if (cursorDotRef.current && cursorSpotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
        cursorSpotRef.current.style.transform = `translate3d(${clientX - 160}px, ${clientY - 160}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Canvas Rift Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Resize canvas to parent
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particles system for the Rift
    const particles = Array.from({ length: 38 }).map(() => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 20,
      y: canvas.height * Math.random(),
      vy: -1 - Math.random() * 2,
      life: Math.random() * 100,
      maxLife: 50 + Math.random() * 100,
      color: Math.random() > 0.5 ? '#c8933a' : '#7c5cbf',
      size: Math.random() * 2 + 1,
      phase: Math.random() * Math.PI * 2
    }));

    let time = 0;

    const render = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw the core seam line
      for(let i = 0; i < canvas.height; i += 5) {
        const drift = Math.sin(time * 0.02 + i * 0.01) * 3;
        const gradient = ctx.createLinearGradient(cx - 10, 0, cx + 10, 0);
        gradient.addColorStop(0, '#7c5cbf'); // purple
        gradient.addColorStop(0.5, '#ffffff'); // white core
        gradient.addColorStop(1, '#c8933a'); // gold

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#c8933a';
        ctx.fillRect(cx + drift - 1.5, i, 3, 5);
      }

      // Draw glowing orb in the middle
      const orbDriftY = Math.sin(time * 0.03) * 10;
      ctx.beginPath();
      ctx.arc(cx, cy + orbDriftY, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#f0c070';
      ctx.shadowBlur = 30;
      ctx.shadowColor = '#d4773a';
      ctx.fill();

      // Draw particles
      particles.forEach(p => {
        p.y += p.vy;
        p.x += Math.sin(time * 0.05 + p.phase) * 1;
        p.life++;

        if (p.life > p.maxLife || p.y < 0) {
          p.y = cy + orbDriftY; // reset to orb
          p.x = cx + (Math.random() - 0.5) * 10;
          p.life = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        const opacity = 1 - (p.life / p.maxLife);
        ctx.globalAlpha = opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Intersection Observer for Scroll Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const timeoutId = setTimeout(() => {
      document.querySelectorAll('.scroll-reveal').forEach((el) => {
        observer.observe(el);
      });
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [heroMode]);

  return (
    <div className="landing-wrapper relative min-h-screen bg-lost-bg">
      {/* Custom Cursor */}
      <div ref={cursorSpotRef} className="cursor-spotlight bg-[radial-gradient(circle,rgba(240,192,112,0.15)_0%,transparent_70%)]"></div>
      <div ref={cursorDotRef} className="cursor-dot bg-found-candle"></div>

      <div className={`transition-all duration-700 ease-in-out ${showLogin ? 'blur-sm brightness-75 pointer-events-none select-none' : ''}`}>
        <Navbar 
          onLoginClick={() => setShowLogin(true)} 
          isAuthenticated={isAuthenticated} 
          user={user} 
          onLogout={handleLogout} 
        />

      {/* Hero Section */}
      <section className={`hero-section relative min-h-screen w-full flex bg-lost-bg ${heroMode === 'split' ? 'overflow-hidden' : 'overflow-visible'}`}>
        
        {/* Left: Lost World */}
        <div className={`hero-half min-h-full flex flex-col justify-center relative z-10 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden whitespace-nowrap ${heroMode === 'lost' ? 'w-full' : heroMode === 'found' ? 'w-0 opacity-0' : 'w-1/2'}`}>
          {/* Drifting background items */}
          <div className="floating-item item-1">🔑</div>
          <div className="floating-item item-2">💳</div>
          <div className="floating-item item-3">🎒</div>
          <div className="floating-item item-4">👓</div>
          <div className="floating-item item-5">📱</div>
          <div className="floating-item item-6">⌚</div>
          <div className="floating-item item-7">🎧</div>
          <div className="floating-item item-8">🌂</div>
          
          {/* Old Elements (Intro Text) */}
          <div className={`w-[50vw] h-full flex flex-col justify-center px-8 sm:px-16 2xl:px-32 transition-all duration-[800ms] ease-in-out absolute top-0 right-0 ${heroMode === 'split' ? 'opacity-100 translate-x-0 pointer-events-auto delay-500' : 'opacity-0 -translate-x-16 pointer-events-none'}`}>
            <div className="text-right whitespace-normal max-w-xl self-end">
              <p className="font-syne font-bold text-lost-accent uppercase tracking-[0.2em] text-sm mb-4">Lost Something?</p>
              <h1 className="font-syne font-extrabold text-lost-text text-5xl lg:text-7xl leading-tight tracking-tight mb-8">
                Something slipped<br />into the dark
              </h1>
              <p className="font-crimson italic text-lost-muted text-xl lg:text-2xl max-w-md mb-10 border-r-2 border-lost-accent pr-6 py-2 leading-relaxed text-right ms-auto ">
                When the shadows deepen and what was yours goes astray, let our network locate the trace.
              </p>
              <button onClick={() => requireAuth(() => setHeroMode('lost'))} className="ghost-btn inline-block border-2 border-lost-accent text-lost-accent font-syne font-bold py-4 px-10 rounded-full transition-all hover:bg-lost-accent hover:text-white uppercase tracking-wider text-sm cursor-none">
                Report Lost Item
              </button>
            </div>
          </div>

          {/* New Elements (Form) */}
          {heroMode === 'lost' && (
            <div className="w-full flex items-start justify-center whitespace-normal pt-32 pb-16 animate-fade-in-right z-20">
              <ReportLostForm onCancel={() => setHeroMode('split')} />
            </div>
          )}

        </div>

        {/* Right: Found World */}
        <div className={`hero-half min-h-full bg-found-bg flex flex-col justify-center relative z-10 border-found-gold/10 overflow-hidden whitespace-nowrap transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${heroMode === 'found' ? 'w-full' : heroMode === 'lost' ? 'w-0 opacity-0 border-l-0' : 'w-1/2 border-l'}`}>
          {/* Amber wash from the seam */}
          <div className={`absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-found-ember/20 to-transparent pointer-events-none transition-opacity duration-1000 ${heroMode === 'split' ? 'opacity-100' : 'opacity-0'}`}></div>
          
          {/* Old Elements (Intro Text) */}
          <div className={`w-[50vw] h-full flex flex-col justify-center px-8 sm:px-16 2xl:px-32 transition-all duration-[800ms] ease-in-out absolute top-0 left-0 ${heroMode === 'split' ? 'opacity-100 translate-x-0 pointer-events-auto delay-500' : 'opacity-0 translate-x-16 pointer-events-none'}`}>
            <div className="whitespace-normal max-w-xl self-start">
              <p className="font-syne font-bold text-found-ink uppercase tracking-[0.2em] text-sm mb-4">Found Something?</p>
              <h1 className="font-syne font-extrabold text-found-text text-5xl lg:text-7xl leading-tight tracking-tight mb-8">
                Carry the light<br />someone needs
              </h1>
              <p className="font-crimson italic text-found-ink text-xl lg:text-2xl max-w-md mb-10 border-l-2 border-found-gold pl-6 py-2 leading-relaxed">
                A spark of kindness returning what was lost. "Carry the light" and guide it back home.
              </p>
              <button onClick={() => requireAuth(() => setHeroMode('found'))} className="solid-gold-btn inline-block bg-found-gold text-white shadow-[0_4px_14px_rgba(200,147,58,0.4)] font-syne font-bold py-4 px-10 rounded-full transition-all hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(200,147,58,0.6)] uppercase tracking-wider text-sm cursor-none">
                Post Found Item
              </button>
            </div>
          </div>

          {/* New Elements (Form) */}
          {heroMode === 'found' && (
            <div className="w-full flex items-start justify-center whitespace-normal pt-32 pb-16 animate-fade-in-left z-20">
              <PostFoundForm onCancel={() => setHeroMode('split')} />
            </div>
          )}
        </div>

        {/* The Seam / Rift */}
        <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-64 z-20 pointer-events-none flex justify-center mix-blend-screen transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${heroMode === 'lost' ? 'left-full translate-x-1/2 opacity-0' : heroMode === 'found' ? 'left-0 -translate-x-[150%] opacity-0' : 'left-1/2 -translate-x-1/2 opacity-100'}`}>
          <canvas ref={canvasRef} className="h-full w-full"></canvas>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="stats-strip w-full bg-lost-mid border-y border-white/5 py-12 px-8 z-30 relative scroll-reveal slide-up">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center text-center gap-8">
          <div className="stat-item flex-1 min-w-[200px]">
            <div className="font-syne font-bold text-4xl text-found-gold mb-2">340+</div>
            <div className="font-syne text-xs uppercase tracking-[0.15em] text-lost-muted font-semibold">Items Reunited</div>
          </div>
          <div className="stat-item flex-1 min-w-[200px]">
            <div className="font-syne font-bold text-4xl text-found-gold mb-2">1.2k</div>
            <div className="font-syne text-xs uppercase tracking-[0.15em] text-lost-muted font-semibold">Active Students</div>
          </div>
          <div className="stat-item flex-1 min-w-[200px]">
            <div className="font-syne font-bold text-4xl text-found-gold mb-2">94%</div>
            <div className="font-syne text-xs uppercase tracking-[0.15em] text-lost-muted font-semibold">Match Rate</div>
          </div>
          <div className="stat-item flex-1 min-w-[200px]">
            <div className="font-syne font-bold text-4xl text-found-gold mb-2">48h</div>
            <div className="font-syne text-xs uppercase tracking-[0.15em] text-lost-muted font-semibold">Avg. Recovery</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-lost-bg px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-syne font-extrabold text-4xl lg:text-5xl text-white text-center mb-24 scroll-reveal slide-up">The Path Back</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Step 1 */}
            <div className="step-card group relative bg-lost-mid p-10 rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-lost-accent/50 scroll-reveal slide-up">
              <div className="absolute -top-8 -right-0 font-crimson italic text-[140px] leading-none text-white/5 group-hover:text-lost-accent/10 transition-colors">1</div>
              <h3 className="font-syne font-bold text-2xl text-lost-text mb-4 relative z-10">Report Lost</h3>
              <p className="font-crimson text-lost-muted text-lg relative z-10">Describe what slipped away. Upload photos, drop a pin, let the search begin.</p>
            </div>
            
            {/* Step 2 */}
            <div className="step-card group relative bg-lost-mid p-10 rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-found-gold/50 scroll-reveal slide-up delay-100">
              <div className="absolute -top-8 -right-0 font-crimson italic text-[140px] leading-none text-white/5 group-hover:text-found-gold/10 transition-colors">2</div>
              <h3 className="font-syne font-bold text-2xl text-[var(--c-found-candle)] mb-4 relative z-10">Post Found</h3>
              <p className="font-crimson text-lost-muted text-lg relative z-10">Secure the item. Our AI will automatically generate clear tags and descriptions.</p>
            </div>
            
            {/* Step 3 */}
            <div className="step-card group relative bg-lost-mid p-10 rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-found-gold/50 scroll-reveal slide-up">
              <div className="absolute -top-8 -right-0 font-crimson italic text-[140px] leading-none text-white/5 group-hover:text-lost-accent/10 transition-colors">3</div>
              <h3 className="font-syne font-bold text-2xl text-lost-text mb-4 relative z-10">AI Matches</h3>
              <p className="font-crimson text-lost-muted text-lg relative z-10">The system algorithmically aligns the dark with the light, finding the 94% match instantaneously.</p>
            </div>
            
            {/* Step 4 */}
            <div className="step-card group relative bg-lost-mid p-10 rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-lost-accent/50 scroll-reveal slide-up delay-100">
              <div className="absolute -top-8 -right-0 font-crimson italic text-[140px] leading-none text-white/5 group-hover:text-found-gold/10 transition-colors">4</div>
              <h3 className="font-syne font-bold text-2xl text-[var(--c-found-candle)] mb-4 relative z-10">Reunite</h3>
              <p className="font-crimson text-lost-muted text-lg relative z-10">Connect via encrypted direct messaging. Hand over the item. The cycle completes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-lost-mid px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-lost-bg p-8 rounded-xl border border-white/5 scroll-reveal slide-up">
              <span className="inline-block px-3 py-1 bg-found-gold/10 text-found-gold text-xs font-syne font-bold tracking-widest rounded mb-6">CORE</span>
              <h4 className="font-syne font-bold text-xl text-white mb-3">Campus-Only Access</h4>
              <p className="font-crimson text-lost-muted">Walled garden for verified student domains only. Trust forms the foundation.</p>
            </div>

            <div className="bg-lost-bg p-8 rounded-xl border border-white/5 scroll-reveal slide-up delay-100">
              <span className="inline-block px-3 py-1 bg-lost-accent/10 text-lost-accent text-xs font-syne font-bold tracking-widest rounded mb-6">AI</span>
              <h4 className="font-syne font-bold text-xl text-white mb-3">Instant Match Engine</h4>
              <p className="font-crimson text-lost-muted">Neural embeddings compare lost reports against found inventory in milliseconds.</p>
            </div>
            
            <div className="bg-lost-bg p-8 rounded-xl border border-white/5 scroll-reveal slide-up delay-200">
              <span className="inline-block px-3 py-1 bg-found-gold/10 text-found-gold text-xs font-syne font-bold tracking-widest rounded mb-6">CORE</span>
              <h4 className="font-syne font-bold text-xl text-white mb-3">Location Tagging</h4>
              <p className="font-crimson text-lost-muted">Interactive campus map plotting where items slipped away or were discovered.</p>
            </div>

            <div className="bg-lost-bg p-8 rounded-xl border border-white/5 scroll-reveal slide-up">
              <span className="inline-block px-3 py-1 bg-lost-accent/10 text-lost-accent text-xs font-syne font-bold tracking-widest rounded mb-6">AI</span>
              <h4 className="font-syne font-bold text-xl text-white mb-3">Image-to-Description</h4>
              <p className="font-crimson text-lost-muted">Upload a photo. The AI drafts the dimensions, brand, color, and features.</p>
            </div>

            <div className="bg-lost-bg p-8 rounded-xl border border-white/5 scroll-reveal slide-up delay-100">
              <span className="inline-block px-3 py-1 bg-found-gold/10 text-found-gold text-xs font-syne font-bold tracking-widest rounded mb-6">CORE</span>
              <h4 className="font-syne font-bold text-xl text-white mb-3">Direct Messaging</h4>
              <p className="font-crimson text-lost-muted">Secure, anonymous pinging. Only reveal your contact details when ready.</p>
            </div>

            <div className="bg-lost-bg p-8 rounded-xl border border-white/5 scroll-reveal slide-up delay-200">
              <span className="inline-block px-3 py-1 bg-lost-accent/10 text-lost-accent text-xs font-syne font-bold tracking-widest rounded mb-6">AI</span>
              <h4 className="font-syne font-bold text-xl text-white mb-3">Semantic Search</h4>
              <p className="font-crimson text-lost-muted">Don't remember the brand? Search 'black thermal flask' to find it immediately.</p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-lost-bg px-8 overflow-hidden relative border-t-2 border-found-ember/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(200,147,58,0.05),transparent_50%)] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          <div className="flex-1 text-center lg:text-left scroll-reveal slide-up">
            <h2 className="font-syne font-extrabold text-5xl text-white mb-8 leading-tight">
              Something's waiting<br/>
              <span className="text-found-gold">to find its way</span><br/>
              back home.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => requireAuth(() => console.log('Browse global'))} className="bg-white text-black font-syne font-bold py-4 px-10 rounded-full transition-all hover:bg-gray-200 uppercase tracking-wider text-sm shadow-xl cursor-none">
                Browse Global Listings
              </button>
              <button onClick={() => requireAuth(() => console.log('Login portal'))} className="border-2 border-white text-white font-syne font-bold py-4 px-10 rounded-full transition-all hover:bg-white/10 uppercase tracking-wider text-sm cursor-none">
                Login via Portal
              </button>
            </div>
          </div>

          <div className="flex-1 relative h-[400px] w-full max-w-md mx-auto scroll-reveal slide-up delay-200 perspective">
            <div className="mock-card lost-mock absolute top-10 left-0 bg-lost-mid p-6 rounded-2xl border border-white/10 w-full shadow-2xl transition-transform duration-500 hover:rotate-0 hover:translate-y-[-10px] -rotate-6 transform-gpu origin-bottom-left cursor-none z-0">
              <div className="w-16 h-16 bg-white/5 rounded-lg mb-4 flex items-center justify-center text-2xl">🎒</div>
              <h5 className="font-syne font-bold text-white mb-1">Black NorthFace Backpack</h5>
              <p className="font-crimson text-lost-muted text-sm border-l-2 border-lost-accent pl-2 mb-4">Lost near Library, 3rd Floor</p>
              <div className="h-2 w-1/3 bg-white/10 rounded"></div>
            </div>

            <div className="mock-card found-mock absolute top-24 left-10 bg-found-bg p-6 rounded-2xl border border-found-gold/20 w-full shadow-2xl transition-transform duration-500 hover:rotate-0 hover:translate-y-[-10px] hover:z-20 rotate-3 transform-gpu origin-bottom-right cursor-none z-10">
              <div className="absolute -top-4 -right-4 bg-found-gold text-white font-syne font-bold text-xs uppercase px-3 py-1 rounded-full shadow-lg floating-badge">
                96% Match Found
              </div>
              <div className="w-16 h-16 bg-black/5 rounded-lg mb-4 flex items-center justify-center text-2xl">🎒</div>
              <h5 className="font-syne font-bold text-found-ink mb-1">Found: Black Backpack</h5>
              <p className="font-crimson text-found-ink/70 text-sm border-l-2 border-found-gold pl-2 mb-4">Left at Study Room B</p>
              <div className="h-2 w-1/3 bg-black/10 rounded"></div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#040308] border-t border-white/5 py-12 px-8 text-center scroll-reveal slide-up">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-syne font-extrabold text-2xl text-white tracking-widest">
            LOST<span className="text-found-gold">N</span>FOUND
          </div>
          <p className="font-crimson italic text-lost-muted">Bridging the gap between missing and homeward.</p>
          <div className="flex gap-6 font-syne text-xs text-lost-muted font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
      </div> {/* End Blur Wrapper */}

      {/* Login Modal Overlay */}
      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)} 
          onLoginSuccess={(userData) => {
            setUser(userData);
            setIsAuthenticated(true);
            setShowLogin(false);
          }} 
        />
      )}

    </div>
  );
}

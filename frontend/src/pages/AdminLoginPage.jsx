import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShadowCursor from '../components/ShadowCursor';
import './LandingPage.css';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      navigate('/admin/posts');
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-wrapper min-h-screen bg-lost-bg text-white flex items-center justify-center px-6">
      <ShadowCursor />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-syne font-extrabold text-3xl tracking-[0.2em] mb-2">
            <span className="text-white">LOST</span>
            <span className="text-found-gold mx-1">N</span>
            <span className="text-found-ink">FOUND</span>
          </h1>
          <p className="font-syne text-[10px] uppercase tracking-[0.3em] text-white/30 mt-2">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-lost-mid/60 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <h2 className="font-syne font-extrabold text-2xl text-white mb-1 tracking-tight">Admin Login</h2>
          <p className="font-crimson italic text-lost-muted text-base mb-8">Access restricted to administrators only.</p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-syne text-xs uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="font-syne text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@psgtech.ac.in"
                className="w-full bg-black/30 border border-white/10 text-white px-5 py-4 rounded-2xl outline-none focus:border-found-gold/50 transition-all font-syne text-sm placeholder:text-white/20"
              />
            </div>

            <div>
              <label className="font-syne text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-black/30 border border-white/10 text-white px-5 py-4 rounded-2xl outline-none focus:border-found-gold/50 transition-all font-syne text-sm placeholder:text-white/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-4 bg-found-gold text-white rounded-2xl font-syne font-bold uppercase tracking-[0.2em] text-xs hover:shadow-[0_0_30px_rgba(200,147,58,0.4)] transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="mt-6 w-full text-center font-syne text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors cursor-none"
          >
            ← Back to site
          </button>
        </div>
      </div>
    </div>
  );
}
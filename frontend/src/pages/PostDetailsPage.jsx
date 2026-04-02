import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ShadowCursor from '../components/ShadowCursor';
import './LandingPage.css';

export default function PostDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.response?.data?.message || "Trace lost in the void. Post not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  const handleResolve = async () => {
    if (!window.confirm("Mark this trace as resolved? This post will be permanently removed from the ledger.")) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/posts');
    } catch (err) {
      alert(err.response?.data?.message || "Error resolving trace.");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="landing-wrapper min-h-screen bg-lost-bg text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-found-gold mb-4"></div>
          <p className="font-crimson italic text-lost-muted text-xl">Sifting through the archive...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="landing-wrapper min-h-screen bg-lost-bg text-white flex items-center justify-center text-center px-8">
        <div>
          <h1 className="font-syne font-extrabold text-5xl mb-6">404</h1>
          <p className="font-crimson italic text-lost-muted text-2xl mb-8">{error}</p>
          <button onClick={() => navigate('/posts')} className="px-10 py-4 bg-found-gold text-white font-syne font-bold rounded-full uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
            Return to Inventory
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && post && (user._id === post.userId?._id || user.id === post.userId?._id);
  const typeCol = post.type === 'lost' ? 'lost' : 'found';

  return (
    <div className={`landing-wrapper min-h-screen ${post.type === 'lost' ? 'bg-lost-bg' : 'bg-found-bg'} transition-colors duration-1000`}>
      <ShadowCursor />
      <Navbar 
        onLoginClick={() => window.location.href = "/"} 
        isAuthenticated={isAuthenticated} 
        user={user} 
        onLogout={handleLogout} 
      />

      <div className="pt-32 pb-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Link */}
          <button onClick={() => navigate('/posts')} className={`flex items-center gap-2 mb-8 font-syne font-bold uppercase tracking-widest text-[10px] transition-all hover:-translate-x-2 ${post.type === 'lost' ? 'text-lost-accent' : 'text-found-gold'}`}>
             ← Back to Inventory
          </button>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            
            {/* Image Section */}
            <div className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-2xl relative group bg-black/20 aspect-[4/5]">
              {post.imageUrl ? (
                <img 
                  src={`http://localhost:5000${post.imageUrl}`} 
                  alt={post.itemName} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                  <span className="text-9xl mb-4">{post.type === 'lost' ? '🔍' : '✨'}</span>
                  <p className="font-syne font-bold uppercase tracking-tighter text-xl">Image Unavailable</p>
                </div>
              )}
              
              <div className={`absolute top-8 left-8 px-6 py-2 rounded-full text-xs font-syne font-bold uppercase tracking-widest shadow-2xl ${
                post.type === 'lost' ? 'bg-lost-accent text-white' : 'bg-found-gold text-white'
              }`}>
                Recording #{post._id.slice(-6).toUpperCase()} • {post.type}
              </div>
            </div>

            {/* Info Section */}
            <div className="w-full lg:w-1/2 py-2">
              <div className="mb-10">
                <p className={`font-syne font-bold uppercase tracking-[0.3em] mb-4 text-xs ${post.type === 'lost' ? 'text-lost-accent' : 'text-found-gold'}`}>Item Identity</p>
                <h1 className={`font-syne font-extrabold text-5xl sm:text-6xl mb-6 tracking-tight ${post.type === 'lost' ? 'text-white' : 'text-found-text'}`}>
                  {post.itemName}
                </h1>
                <div className={`flex items-center gap-3 text-sm font-syne font-bold uppercase tracking-widest ${post.type === 'lost' ? 'text-lost-muted' : 'text-found-ink'}`}>
                  <span>📅 Recorded on {new Date(post.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="mb-10">
                 <p className={`font-syne font-bold uppercase tracking-[0.3em] mb-4 text-xs ${post.type === 'lost' ? 'text-lost-accent' : 'text-found-gold'}`}>The Narrative</p>
                 <p className={`font-crimson italic text-xl sm:text-2xl leading-relaxed ${post.type === 'lost' ? 'text-lost-text/80' : 'text-found-ink'}`}>
                   "{post.description}"
                 </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                <div className={`p-6 rounded-2xl border ${post.type === 'lost' ? 'bg-lost-mid/40 border-white/5' : 'bg-white/40 border-black/5'}`}>
                   <p className={`font-syne font-bold uppercase tracking-widest text-[10px] mb-3 opacity-60 ${post.type === 'lost' ? 'text-white' : 'text-black'}`}>Discovery Location</p>
                   <p className={`font-syne font-bold text-lg ${post.type === 'lost' ? 'text-white' : 'text-found-text'}`}>
                     Block {post.location?.block} • Floor {post.location?.floor}
                   </p>
                   <p className={`font-crimson italic text-lg ${post.type === 'lost' ? 'text-lost-muted' : 'text-found-ink'}`}>
                     {post.location?.room || "Common Ground"}
                   </p>
                </div>
                
                <div className={`p-6 rounded-2xl border ${post.type === 'lost' ? 'bg-lost-accent/10 border-lost-accent/20' : 'bg-found-gold/10 border-found-gold/20'}`}>
                   <p className={`font-syne font-bold uppercase tracking-widest text-[10px] mb-3 ${post.type === 'lost' ? 'text-lost-accent' : 'text-found-gold'}`}>Contact Status</p>
                   <p className={`font-syne font-bold text-lg ${post.type === 'lost' ? 'text-white' : 'text-found-text'}`}>
                     {post.userId?.name}
                   </p>
                   <p className={`font-crimson italic text-lg ${post.type === 'lost' ? 'text-lost-muted' : 'text-found-ink'}`}>
                     {isOwner ? (post.userId?.phone || "No phone listed") : "🔒 Private (Use Message/Email)"}
                   </p>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex flex-wrap gap-4 pt-8 border-t border-white/5">
                {isOwner ? (
                  <button 
                    onClick={handleResolve}
                    disabled={isDeleting}
                    className={`px-10 py-5 rounded-xl font-syne font-bold uppercase tracking-[0.2em] text-xs transition-all hover:-translate-y-1 ${
                      post.type === 'lost' 
                        ? 'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white' 
                        : 'bg-found-ember/20 text-found-ember border border-found-ember/30 hover:bg-found-ember hover:text-white'
                    } disabled:opacity-50`}
                  >
                    {isDeleting ? "Processing..." : "Mark as Resolved"}
                  </button>
                ) : (
                  <Link 
                    to="/messages"
                    className={`px-10 py-5 rounded-xl font-syne font-bold uppercase tracking-[0.2em] text-xs transition-all hover:-translate-y-1 flex items-center gap-3 ${
                      post.type === 'lost' 
                        ? 'bg-lost-accent text-white hover:shadow-[0_8px_20px_rgba(124,92,191,0.5)]' 
                        : 'bg-found-gold text-white hover:shadow-[0_8px_20px_rgba(200,147,58,0.5)] shadow-lg'
                    }`}
                  >
                    Send Direct Message 📩
                  </Link>
                )}
                
                <a 
                  href={`mailto:${post.userId?.email}`}
                  className={`px-10 py-5 rounded-xl font-syne font-bold uppercase tracking-[0.2em] text-xs transition-all hover:bg-white/10 border ${
                    post.type === 'lost' ? 'border-white/20 text-white' : 'border-black/20 text-found-text'
                  }`}
                >
                  Email Trace Reporter
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

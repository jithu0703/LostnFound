import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ShadowCursor from '../components/ShadowCursor';
import './LandingPage.css'; // Reuse common styles

export default function PostsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Debouncing Search Term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('type', filter);
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await axios.get(`http://localhost:5000/api/posts?${params.toString()}`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [debouncedSearch, filter]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  // Note: Backend handles filtering now.
  const filteredPosts = posts;

  return (
    <div className="landing-wrapper min-h-screen bg-lost-bg text-white">
      <ShadowCursor />
      <Navbar
        onLoginClick={() => window.location.href = "/"}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="font-syne font-extrabold text-6xl sm:text-7xl lg:text-8xl text-white mb-6 tracking-tighter leading-none">
              The <span className="text-found-gold">Great Inventory</span>
            </h1>
            <p className="font-crimson italic text-lost-muted text-2xl max-w-2xl leading-relaxed">
              Every object tells a story of being missing, or the hope of being found.
            </p>
          </div>

          {/* Controls Section - Dedicated Row */}
          <div className="flex flex-col lg:flex-row items-center gap-6 mb-16 pt-10 border-t border-white/5">
            {/* Search Bar - Massive Expansion */}
            <div className="relative w-full lg:flex-1 group ">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Scan the ledger for an item name..."
                className="w-full bg-lost-mid/40 border border-white/10 text-white pl-16 pr-16 py-5.5 rounded-2xl outline-none focus:border-found-gold/50 focus:bg-lost-mid/60 transition-all font-syne text-sm md:text-base uppercase tracking-widest backdrop-blur-xl shadow-2xl placeholder:text-lost-muted/40 "
                style={{height:55}}
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl grayscale opacity-30 group-focus-within:grayscale-0 group-focus-within:opacity-100 transition-all">🔍</span>

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-none text-xl"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <div className="flex bg-lost-mid/80 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md self-stretch lg:self-auto min-w-[320px] shadow-xl">
              {['all', 'lost', 'found'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`flex-1 px-8 py-3.5 rounded-xl font-syne font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all cursor-none ${filter === t ? 'bg-found-gold text-white shadow-lg scale-[1.02]' : 'text-lost-muted hover:text-white'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-32">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-found-gold"></div>
              <p className="mt-4 font-crimson italic text-lost-muted text-lg">Sifting through the void...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-32 bg-lost-mid/30 rounded-3xl border border-white/5 backdrop-blur-sm">
              <p className="font-crimson italic text-2xl text-lost-muted">
                {filter === 'all' ? "The ledger is currently empty. Balance has been restored." : `No ${filter} items have been recorded in this sector yet.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className={`group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-2xl ${post.type === 'lost'
                      ? 'bg-lost-mid/60 border border-lost-accent/20 hover:border-lost-accent/60'
                      : 'bg-found-bg border border-found-gold/20 hover:border-found-gold/60'
                    }`}
                >
                  {/* Image Container */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-black/40 flex items-center justify-center relative">
                    {post.imageUrl ? (
                      <img
                        src={`http://localhost:5000${post.imageUrl}`}
                        alt={post.itemName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    ) : (
                      <div className="flex flex-col items-center opacity-20 group-hover:opacity-40 transition-opacity">
                        <span className="text-7xl mb-2">{post.type === 'lost' ? '🔍' : '✨'}</span>
                        <span className="font-syne font-bold text-xs uppercase tracking-tighter">Image Vanished</span>
                      </div>
                    )}

                    {/* Badge */}
                    <div className={`absolute top-5 left-5 px-4 py-1.5 rounded-full text-[10px] font-syne font-bold uppercase tracking-widest shadow-xl ${post.type === 'lost' ? 'bg-lost-accent text-white' : 'bg-found-gold text-white'
                      }`}>
                      {post.type}
                    </div>

                    {/* Date Overlay */}
                    <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                      <div className="flex items-center gap-2 text-[10px] font-syne text-white uppercase tracking-widest font-bold">
                        <span className="opacity-70">📅</span>
                        <span>{new Date(post.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className={`font-syne font-extrabold text-2xl mb-3 tracking-tight ${post.type === 'lost' ? 'text-white' : 'text-found-text'
                      }`}>{post.itemName}</h3>

                    <p className={`font-crimson text-lg line-clamp-3 mb-6 leading-relaxed italic ${post.type === 'lost' ? 'text-lost-muted' : 'text-found-ink'
                      }`}>
                      "{post.description}"
                    </p>

                    <div className={`flex flex-col gap-3 pt-6 border-t ${post.type === 'lost' ? 'border-white/5' : 'border-black/5'
                      }`}>
                      <div className={`flex items-center gap-3 text-xs font-syne uppercase tracking-wider font-bold ${post.type === 'lost' ? 'text-lost-accent' : 'text-found-gold'
                        }`}>
                        <span className="text-base">📍</span>
                        <span>{post.location?.block} Block • Floor {post.location?.floor} • {post.location?.room || "General Area"}</span>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-syne font-bold text-[10px] ${post.type === 'lost' ? 'bg-lost-accent/20 text-lost-accent' : 'bg-found-gold/20 text-found-gold'
                          }`}>
                          {post.userId?.name?.charAt(0).toUpperCase()}
                        </div>
                        <p className={`text-[10px] font-syne uppercase tracking-widest font-bold ${post.type === 'lost' ? 'text-lost-muted' : 'text-found-ink/60'
                          }`}>{post.userId?.name}</p>
                      </div>

                      <button
                        onClick={() => navigate(`/posts/${post._id}`)}
                        className={`text-[10px] font-syne font-extrabold uppercase tracking-[0.2em] transition-all hover:translate-x-1 cursor-none ${post.type === 'lost' ? 'text-lost-accent hover:text-white' : 'text-found-gold hover:text-found-ember'
                          }`}>
                        Trace Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

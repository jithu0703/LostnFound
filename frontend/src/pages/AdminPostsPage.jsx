import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShadowCursor from '../components/ShadowCursor';
import './LandingPage.css';

export default function AdminPostsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  // Check admin auth
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    if (!token || !adminUser) {
      navigate('/admin/login');
      return;
    }
    setAdmin(JSON.parse(adminUser));
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('type', filter);
      if (debouncedSearch) params.append('search', debouncedSearch);

      const res = await fetch(`http://localhost:5000/api/admin/posts?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [debouncedSearch, filter]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeletingId(postId);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:5000/api/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      alert('Server error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div className="landing-wrapper min-h-screen bg-lost-bg text-white">
      <ShadowCursor />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-[100] px-6 sm:px-12 py-3 sm:py-5 flex justify-between items-center backdrop-blur-xl bg-white/[0.03] border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="font-syne font-extrabold text-lg sm:text-2xl tracking-[0.15em]">
          <span className="text-white">LOST</span>
          <span className="text-found-gold mx-1">N</span>
          <span className="text-found-ink">FOUND</span>
          <span className="ml-3 font-syne text-[9px] uppercase tracking-[0.3em] text-red-400 border border-red-400/40 px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block font-syne text-[10px] uppercase tracking-widest text-white/40">{admin?.name}</span>
          <button
            onClick={handleLogout}
            className="px-5 py-2 border-2 border-white/20 text-white/60 rounded-full font-syne font-bold uppercase tracking-[0.2em] text-[10px] hover:border-red-400 hover:text-red-400 transition-all cursor-none"
          >
            Log Out
          </button>
        </div>
      </nav>

      <div className="pt-24 sm:pt-32 pb-20 px-6 sm:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="font-syne font-extrabold text-4xl sm:text-7xl lg:text-8xl text-white mb-4 tracking-tighter leading-none">
              Admin <span className="text-red-400">Control</span>
            </h1>
            <p className="font-crimson italic text-lost-muted text-lg sm:text-2xl max-w-2xl leading-relaxed">
              Manage all posts. Delete anything that violates guidelines.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 mb-12 pt-8 border-t border-white/5">
            <div className="relative w-full lg:flex-1 group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts..."
                className="w-full bg-lost-mid/40 border border-white/10 text-white pl-12 pr-12 py-4 rounded-2xl outline-none focus:border-found-gold/50 transition-all font-syne text-xs uppercase tracking-widest backdrop-blur-xl shadow-2xl placeholder:text-lost-muted/40"
                style={{ height: 55 }}
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl grayscale opacity-30 group-focus-within:grayscale-0 group-focus-within:opacity-100 transition-all">🔍</span>
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-none text-lg">✕</button>
              )}
            </div>

            <div className="flex w-full lg:w-auto bg-lost-mid/80 p-1 rounded-2xl border border-white/5 backdrop-blur-md lg:min-w-[280px] shadow-xl">
              {['all', 'lost', 'found'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`flex-1 px-6 py-3 rounded-xl font-syne font-bold text-[9px] uppercase tracking-[0.3em] transition-all cursor-none ${filter === t ? 'bg-found-gold text-white shadow-lg' : 'text-lost-muted hover:text-white'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Total count */}
          <p className="font-syne text-[10px] uppercase tracking-widest text-white/30 mb-8">
            {posts.length} post{posts.length !== 1 ? 's' : ''} found
          </p>

          {/* Posts Grid */}
          {loading ? (
            <div className="text-center py-32">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-found-gold"></div>
              <p className="mt-4 font-crimson italic text-lost-muted text-lg">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-32 bg-lost-mid/30 rounded-3xl border border-white/5">
              <p className="font-crimson italic text-2xl text-lost-muted">No posts found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className={`group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-2xl ${
                    post.type === 'lost'
                      ? 'bg-lost-mid/60 border border-lost-accent/20 hover:border-lost-accent/60'
                      : 'bg-found-bg border border-found-gold/20 hover:border-found-gold/60'
                  }`}
                >
                  {/* Image */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-black/40 flex items-center justify-center relative">
                    {post.imageUrl ? (
                      <img
                        src={`http://localhost:5000${post.imageUrl}`}
                        alt={post.itemName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    ) : (
                      <div className="flex flex-col items-center opacity-20">
                        <span className="text-7xl mb-2">{post.type === 'lost' ? '🔍' : '✨'}</span>
                      </div>
                    )}
                    <div className={`absolute top-5 left-5 px-4 py-1.5 rounded-full text-[10px] font-syne font-bold uppercase tracking-widest shadow-xl ${post.type === 'lost' ? 'bg-lost-accent text-white' : 'bg-found-gold text-white'}`}>
                      {post.type}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                      <span className="text-[10px] font-syne text-white uppercase tracking-widest font-bold opacity-70">
                        📅 {new Date(post.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className={`font-syne font-extrabold text-2xl mb-3 tracking-tight ${post.type === 'lost' ? 'text-white' : 'text-found-text'}`}>
                      {post.itemName}
                    </h3>
                    <p className={`font-crimson text-lg line-clamp-3 mb-4 leading-relaxed italic ${post.type === 'lost' ? 'text-lost-muted' : 'text-found-ink'}`}>
                      "{post.description}"
                    </p>

                    <div className={`flex flex-col gap-3 pt-4 border-t ${post.type === 'lost' ? 'border-white/5' : 'border-black/5'}`}>
                      <div className={`flex items-center gap-3 text-xs font-syne uppercase tracking-wider font-bold ${post.type === 'lost' ? 'text-lost-accent' : 'text-found-gold'}`}>
                        <span>📍</span>
                        <span>{post.location?.block} Block • Floor {post.location?.floor} • {post.location?.room || 'General Area'}</span>
                      </div>
                    </div>

                    {/* Posted by + Delete */}
                    <div className="mt-6 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-syne font-bold text-[10px] ${post.type === 'lost' ? 'bg-lost-accent/20 text-lost-accent' : 'bg-found-gold/20 text-found-gold'}`}>
                          {post.userId?.name?.charAt(0).toUpperCase()}
                        </div>
                        <p className={`text-[10px] font-syne uppercase tracking-widest font-bold ${post.type === 'lost' ? 'text-lost-muted' : 'text-found-ink/60'}`}>
                          {post.userId?.name}
                        </p>
                      </div>

                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => handleDelete(post._id)}
                        disabled={deletingId === post._id}
                        className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-syne font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-none active:scale-95 disabled:opacity-40"
                      >
                        {deletingId === post._id ? 'Deleting...' : '🗑 Delete'}
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
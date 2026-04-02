import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ShadowCursor from '../components/ShadowCursor';
import './LandingPage.css'; // Reuse common styles

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  };

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
          <h1 className="font-syne font-extrabold text-5xl text-white mb-12 tracking-tight">
            The <span className="text-found-gold">Great Inventory</span>
          </h1>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-found-gold"></div>
              <p className="mt-4 font-crimson italic text-lost-muted">Sifting through the void...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-lost-mid/30 rounded-3xl border border-white/5">
              <p className="font-crimson italic text-xl text-lost-muted">The ledger is currently empty. Balance has been restored.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div key={post._id} className={`group relative bg-lost-mid/50 rounded-2xl border border-white/5 overflow-hidden transition-all hover:scale-[1.02] hover:border-${post.type === 'lost' ? 'lost-accent' : 'found-gold'}/50 shadow-2xl`}>
                  {/* Image Container */}
                  <div className="aspect-video w-full overflow-hidden bg-black/20 flex items-center justify-center relative">
                    {post.imageUrl ? (
                      <img src={`http://localhost:5000${post.imageUrl}`} alt={post.itemName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <span className="text-6xl opacity-20">{post.type === 'lost' ? '🔍' : '✨'}</span>
                    )}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-syne font-bold uppercase tracking-widest ${post.type === 'lost' ? 'bg-lost-accent text-white' : 'bg-found-gold text-white'}`}>
                      {post.type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-syne font-bold text-xl text-white mb-2">{post.itemName}</h3>
                    <p className="font-crimson text-lost-muted text-sm line-clamp-2 mb-4 leading-relaxed">
                      {post.description}
                    </p>
                    
                    <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                      <div className="flex items-center gap-2 text-xs font-syne text-lost-muted uppercase tracking-wider">
                        <span className="opacity-50">📍</span>
                        <span>{post.location?.block} Block, Floor {post.location?.floor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-syne text-lost-muted uppercase tracking-wider">
                        <span className="opacity-50">📅</span>
                        <span>{new Date(post.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                       <p className="text-[10px] font-syne text-lost-muted/50 uppercase tracking-widest">Post by {post.userId?.name}</p>
                       <button className="text-[10px] font-syne font-bold text-found-gold uppercase tracking-widest hover:text-white transition-colors cursor-pointer">View Details →</button>
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

import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
import ShadowCursor from '../components/ShadowCursor';
import './LandingPage.css';

export default function MessagesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("currentUser") || "null"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // { postId, otherUser }
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [messageCache, setMessageCache] = useState({}); // { 'postId-userId': [messages] }
  const CACHE_LIMIT = 10;

  // Initialize Socket.io
  useEffect(() => {
    if (!user) return;

    const newSocket = io(api.defaults.baseURL.replace(/\/api\/?$/, ""), {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    setSocket(newSocket);

    newSocket.emit("joinRoom", { userId: user._id || user.id });

    newSocket.on("receiveMessage", (message) => {
      const cacheKey = `${message.postId}-${message.senderId === (user._id || user.id) ? message.receiverId : message.senderId}`;

      // 1. Update active chat if currently viewing it
      setActiveChat(prevActive => {
        if (prevActive && 
            message.postId === prevActive.postId && 
            (message.senderId === prevActive.otherUser._id || message.receiverId === prevActive.otherUser._id)) {
          setMessages(prevMsgs => [...prevMsgs, message]);
        }
        return prevActive;
      });

      // 2. Sync with cache for future visits
      setMessageCache(prev => {
        const existing = prev[cacheKey] || [];
        // Only append if not already in cache (to prevent duplicates if fetch/socket sync)
        if (existing.some(m => m._id === message._id)) return prev;
        
        return {
          ...prev,
          [cacheKey]: [...existing, message]
        };
      });

      // 3. Refresh archive summary
      fetchConversations();
    });

    return () => newSocket.disconnect();
  }, [user]);

  // Fetch conversations on mount
  const fetchConversations = async () => {
    try {
      const res = await api.get("/messages/conversations");
      setConversations(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching conversations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchConversations();
  }, [isAuthenticated]);

  // Handle URL query parameters for starting a chat
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryPostId = params.get('post');
    const queryUserId = params.get('to');

    if (queryPostId && queryUserId && conversations.length >= 0) {
      // Check if conversation already exists in list
      const existing = conversations.find(c => c.postId === queryPostId && c.otherUser._id === queryUserId);
      
      if (existing) {
        setActiveChat({ postId: queryPostId, otherUser: existing.otherUser, postTitle: existing.postTitle });
      } else if (!loading) {
        // If not found in archive, create a temporary context for new chat
        // We'll need to fetch post title for the UI
        const fetchPostTitle = async () => {
           try {
             const res = await api.get(`/posts/${queryPostId}`);
             setActiveChat({ 
               postId: queryPostId, 
               otherUser: { _id: queryUserId, name: "New Contact" }, 
               postTitle: res.data.itemName,
               isNew: true 
             });
           } catch(e) { console.error(e) }
        }
        fetchPostTitle();
      }
    }
  }, [location.search, conversations, loading]);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (!activeChat) return;

    const cacheKey = `${activeChat.postId}-${activeChat.otherUser._id}`;
    const cachedData = messageCache[cacheKey];

    const fetchMessages = async (silent = false) => {
      if (!silent) {
        setMessages([]); // Clear for fresh context only on first load
        setMessagesLoading(true);
      }

      try {
        const res = await api.get(`/messages/${activeChat.postId}/${activeChat.otherUser._id}`);
        const freshMessages = res.data;
        
        setMessages(freshMessages);
        
        // Update Cache with Limit Management
        setMessageCache(prev => {
          const newCache = { ...prev, [cacheKey]: freshMessages };
          const keys = Object.keys(newCache);
          
          if (keys.length > CACHE_LIMIT) {
            // Remove oldest key (simple FIFO)
            delete newCache[keys[0]];
          }
          return newCache;
        });

      } catch (err) {
        console.error("Error fetching messages", err);
      } finally {
        if (!silent) setMessagesLoading(false);
      }
    };

    if (cachedData) {
      // Instant Load from Cache
      setMessages(cachedData);
      // Silent background sync
      fetchMessages(true);
    } else {
      // Full Initial Fetch
      fetchMessages(false);
    }
  }, [activeChat]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeChat || !socket) return;

    const messageData = {
      senderId: user._id || user.id,
      receiverId: activeChat.otherUser._id,
      postId: activeChat.postId,
      messageText: newMessageText
    };

    // Emit via socket for real-time
    socket.emit("sendMessage", messageData);
    
    setNewMessageText("");
  };

  if (!isAuthenticated) {
     return <div className="min-h-screen bg-lost-bg flex items-center justify-center font-syne">Redirection required...</div>;
  }

  return (
    <div className="landing-wrapper min-h-screen bg-lost-bg text-white font-syne">
      <ShadowCursor />
      <Navbar 
        onLoginClick={() => window.location.href = "/"} 
        isAuthenticated={isAuthenticated} 
        user={user} 
        onLogout={handleLogout} 
      />

      <div className="pt-24 h-[calc(100vh)] flex overflow-hidden">
        
        {/* Left Sidebar: The Archive */}
        <div className={`w-full md:w-1/3 lg:w-1/4 bg-lost-mid/40 border-r border-white/5 flex-col backdrop-blur-xl ${isMobileChatOpen ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-8 border-b border-white/5">
            <h2 className="text-2xl font-extrabold tracking-tighter uppercase mb-1">The Archive</h2>
            <p className="text-[10px] text-lost-muted font-bold tracking-[0.2em] uppercase">Active Whispers</p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-10 flex flex-col items-center gap-6 animate-pulse opacity-20">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-full flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white"></div>
                    <div className="flex-1">
                      <div className="h-2 w-24 bg-white rounded mb-2"></div>
                      <div className="h-2 w-16 bg-white rounded opacity-50"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 && !loading ? (
              <div className="p-10 text-center opacity-40 italic font-crimson text-lg">
                The ledger is silent. No active whispers yet.
              </div>
            ) : null}

            {conversations.map((conv, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  setActiveChat({ postId: conv.postId, otherUser: conv.otherUser, postTitle: conv.postTitle });
                  setIsMobileChatOpen(true);
                  // Clean URL if we were on a specific chat
                  if (location.search) navigate('/messages', { replace: true });
                }}
                className={`conversation-card p-6 flex items-center gap-4 cursor-none border-b border-white/5 ${
                  activeChat?.postId === conv.postId && activeChat?.otherUser._id === conv.otherUser._id ? 'active' : ''
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-lost-accent/20 flex items-center justify-center font-bold text-lost-accent overflow-hidden">
                    {conv.postImage ? (
                      <img src={conv.postImage} className="w-full h-full object-cover" alt="" />
                    ) : (
                      conv.otherUser.name.charAt(0)
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 unread-indicator"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-xs uppercase tracking-widest truncate">{conv.otherUser.name}</h3>
                    <span className="text-[9px] text-lost-muted font-bold whitespace-nowrap">
                      {new Date(conv.lastMessageDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-[10px] text-found-gold font-bold uppercase tracking-tighter truncate mb-1">{conv.postTitle}</p>
                  <p className="text-xs text-lost-muted font-crimson italic truncate">"{conv.lastMessageText}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: The Whisper */}
        <div className={`${isMobileChatOpen ? 'flex' : 'hidden md:flex'} flex-1 flex-col relative bg-gradient-to-b from-lost-bg to-black/40`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 sm:p-6 border-b border-white/5 backdrop-blur-xl bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Exit Mobile Chat */}
                  <button 
                    onClick={() => setIsMobileChatOpen(false)}
                    className="md:hidden p-2 -ml-2 text-found-gold hover:text-white transition-colors"
                  >
                    ←
                  </button>
                  <div>
                    <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-found-gold mb-1">
                      Discussion: {activeChat.postTitle}
                    </h2>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                      Connection: {activeChat.otherUser.name}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-1.5 rounded-full border border-found-gold/30 text-[9px] font-bold uppercase tracking-widest text-found-gold animate-pulse">
                  Active Link Established
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar">
                {messagesLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-found-gold"></div>
                    <p className="mt-4 font-crimson italic text-lost-muted text-lg">Fetching whispers...</p>
                  </div>
                ) : messages.length === 0 ? (
                   <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center max-w-sm mx-auto">
                     <span className="text-4xl mb-4">✨</span>
                     <p className="font-crimson italic text-xl">The air is thin here. Start a whisper to bridge the divide.</p>
                   </div>
                ) : null}
                
                {messages.map((msg, idx) => {
                  const isMine = (msg.senderId === user._id || msg.senderId === user.id);
                  return (
                    <div 
                      key={idx} 
                      className={`message-bubble ${isMine ? 'message-sent' : 'message-received'}`}
                    >
                      {msg.messageText}
                      <span className={`block text-[8px] mt-2 font-syne font-bold uppercase tracking-widest opacity-40 text-right`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-8 chat-input-container">
                <div className="relative group">
                  <input 
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Whisper your message..."
                    className="w-full bg-lost-mid border border-white/10 text-white pl-6 sm:pl-8 pr-16 sm:pr-32 py-4 sm:py-5 rounded-2xl outline-none focus:border-found-gold/50 transition-all font-syne text-sm uppercase tracking-widest placeholder:text-lost-muted/30"
                  />
                  <button 
                    type="submit"
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-found-gold text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 cursor-none"
                  >
                    <span className="hidden sm:inline text-[10px]">Transmit</span>
                    <span className="sm:hidden text-base">➤</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-40">
              <span className="text-8xl mb-8 grayscale">📨</span>
              <h2 className="font-syne font-extrabold text-3xl uppercase tracking-tighter mb-4">Select a Whisper</h2>
              <p className="font-crimson italic text-xl max-w-md mx-auto">
                Select a trace from the archive to begin bridge-building, or return to the inventory to find a new connection.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

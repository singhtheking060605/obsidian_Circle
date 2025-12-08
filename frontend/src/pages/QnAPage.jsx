import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

// Initialize socket
const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000');

const QnAPage = () => {
  const { user } = useAuth();
  
  // UI States
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'requests', 'search'
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [sessions, setSessions] = useState([]); // Active chats
  const [requests, setRequests] = useState([]); // Pending requests
  const [searchResults, setSearchResults] = useState([]);
  
  // Chat States
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  
  // Search/Request Form States
  const [searchQuery, setSearchQuery] = useState("");
  const [requestTopic, setRequestTopic] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const messagesEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- 1. SOCKETS & INITIAL DATA SETUP ---
  useEffect(() => {
    if (!user) return;

    // Connect to personal room (allows receiving private notifications)
    socket.emit("setup", user._id);

    // Initial Fetch
    fetchMyChats();
    fetchRequests();

    // Listener: Receive Message
    socket.on("receive_message", (data) => {
      if (selectedSession && data.sessionId === selectedSession._id) {
        setMessages((prev) => [...prev, data]);
      }
    });

    // Listener: Request Received
    socket.on("request_received", (data) => {
      // STRICT FILTER: Only refresh if it's NOT a generic connection request
      // This prevents the QnA page from refreshing when someone just wants to 'Connect' (handled by AlumniPage)
      if (data.topic !== 'Connection Request') {
          fetchRequests();
      }
    });

    // Listener: Request Accepted
    socket.on("request_accepted", () => {
      fetchMyChats(); // Refresh active chats list
    });

    return () => {
      socket.off("receive_message");
      socket.off("request_received");
      socket.off("request_accepted");
    };
  }, [user, selectedSession]); // Dependencies ensuring socket updates correctly

  // --- 2. LIVE SEARCH LOGIC (Debounced) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setLoading(true);
        try {
          const { data } = await axios.get(`${API_URL}/chat/search?query=${searchQuery}`, { withCredentials: true });
          if (data.success) {
            setSearchResults(data.users);
          }
        } catch (err) {
          console.error("Search failed", err);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 400); // 400ms delay to prevent spamming while typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // --- 3. API CALLS ---

  const fetchMyChats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/chat/my-chats`, { withCredentials: true });
      if (data.success) setSessions(data.sessions);
    } catch (err) { console.error(err); }
  };

  const fetchRequests = async () => {
    try {
      // Use the specific endpoint for incoming requests which excludes connection requests
      const { data } = await axios.get(`${API_URL}/chat/requests/incoming`, { withCredentials: true });
      if (data.success) setRequests(data.requests);
    } catch (err) { console.error(err); }
  };

  const sendChatRequest = async () => {
    if (!selectedUser || !requestTopic.trim()) {
        return alert("Please select a user and enter a topic");
    }

    try {
        const { data } = await axios.post(`${API_URL}/chat/request`, 
            { receiverId: selectedUser._id, topic: requestTopic },
            { withCredentials: true }
        );

        if (data.success) {
            // PASS TOPIC TO SOCKET so receiver knows this is a MESSAGE request
            socket.emit("send_request", {
                receiverId: selectedUser._id,
                senderName: user.name,
                topic: requestTopic 
            });

            alert(`Request sent to ${selectedUser.name}!`);
            setSelectedUser(null);
            setRequestTopic("");
            setSearchQuery("");
            setSearchResults([]);
            setActiveTab('active');
        }
    } catch (err) {
        alert(err.response?.data?.message || "Failed to send request");
    }
  };

  const handleAcceptRequest = async (sessionId) => {
    try {
      const { data } = await axios.put(`${API_URL}/chat/accept`, { sessionId }, { withCredentials: true });
      if (data.success) {
        // Notify Sender via Socket
        if (data.session.sender) {
            socket.emit("accept_request", { 
                senderId: data.session.sender._id 
            });
        }

        fetchRequests();
        fetchMyChats();
        setActiveTab('active');
        joinSession(data.session);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to accept request");
    }
  };

  const joinSession = async (session) => {
    setSelectedSession(session);
    socket.emit("join_room", session._id);
    try {
      const { data } = await axios.get(`${API_URL}/chat/messages/${session._id}`, { withCredentials: true });
      if (data.success) setMessages(data.messages);
      scrollToBottom();
    } catch (err) { console.error(err); }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSession) return;

    const messageData = {
      sessionId: selectedSession._id,
      senderId: user._id,
      senderName: user.name,
      content: newMessage,
      createdAt: new Date().toISOString()
    };

    socket.emit("send_message", messageData);
    setNewMessage("");
  };

  // Helper to determine who you are chatting with
  const getChatPartner = (session) => {
    return session.sender._id === user._id ? session.receiver : session.sender;
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-black text-white p-4 gap-4 animate-fade-in font-sans">
      
      {/* --- LEFT SIDEBAR --- */}
      <div className="w-full md:w-1/3 bg-gray-900/50 border border-red-900/30 rounded-xl flex flex-col overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-red-900/30 bg-black/40">
            <button 
                onClick={() => setActiveTab('active')} 
                className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'active' ? 'bg-red-600/20 text-red-500 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-300'}`}
            >
                Chats
            </button>
            <button 
                onClick={() => setActiveTab('requests')} 
                className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'requests' ? 'bg-red-600/20 text-red-500 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-300'}`}
            >
                Requests {requests.length > 0 && <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{requests.length}</span>}
            </button>
            <button 
                onClick={() => setActiveTab('search')} 
                className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'search' ? 'bg-red-600/20 text-red-500 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-300'}`}
            >
                Find User
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-800">
            
            {/* 1. ACTIVE CHATS */}
            {activeTab === 'active' && (
                sessions.length > 0 ? (
                    sessions.map(session => {
                        const partner = getChatPartner(session);
                        return (
                            <div key={session._id} onClick={() => joinSession(session)} className={`p-4 rounded-lg cursor-pointer border transition-all ${selectedSession?._id === session._id ? 'border-red-500 bg-red-900/10' : 'border-gray-800 hover:border-gray-600 bg-black/20'}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-gray-200">{partner.name}</h4>
                                    <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-400">{session.topic}</span>
                                </div>
                                <p className="text-xs text-gray-500">{partner.roles?.join(', ')}</p>
                            </div>
                        );
                    })
                ) : <p className="text-center text-gray-500 mt-4">No active chats.</p>
            )}

            {/* 2. REQUESTS */}
            {activeTab === 'requests' && (
                requests.length > 0 ? (
                    requests.map(req => (
                        <div key={req._id} className="p-4 bg-gray-800/40 border border-gray-700 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-white">{req.sender.name}</span>
                            </div>
                            <p className="text-xs text-gray-400 mb-3 bg-black/30 p-2 rounded">Topic: <span className="text-gray-300">{req.topic}</span></p>
                            <button onClick={() => handleAcceptRequest(req._id)} className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded transition-colors shadow-lg shadow-green-900/20">
                                Accept Request
                            </button>
                        </div>
                    ))
                ) : <p className="text-center text-gray-500 mt-4">No pending requests.</p>
            )}

            {/* 3. SEARCH & ADD */}
            {activeTab === 'search' && (
                <div className="space-y-4">
                    <div className="relative">
                      <input 
                          type="text" 
                          placeholder="Type Name or Email..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-red-500 outline-none pl-10 transition-colors"
                      />
                      <span className="absolute left-3 top-3 text-gray-500">🔍</span>
                      {loading && <span className="absolute right-3 top-3 text-red-500 text-xs animate-pulse">Searching...</span>}
                    </div>

                    <div className="space-y-2">
                        {searchResults.map(u => (
                            <div key={u._id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-800 hover:border-red-500/30 transition-colors group">
                                <div>
                                    <p className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">{u.name}</p>
                                    <p className="text-[10px] text-gray-400">{u.roles.join(', ')} • {u.email}</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedUser(u)}
                                    className="bg-red-600/10 border border-red-600/30 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded text-xs transition-colors"
                                >
                                    Request
                                </button>
                            </div>
                        ))}
                        {searchQuery && !loading && searchResults.length === 0 && (
                            <p className="text-center text-gray-500 text-xs mt-2">No agents found with that name.</p>
                        )}
                    </div>

                    {/* Send Request Form */}
                    {selectedUser && (
                        <div className="mt-4 p-4 bg-red-900/10 border border-red-500/30 rounded-lg animate-fade-in shadow-xl shadow-red-900/10">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs text-red-400 font-bold uppercase tracking-wider">Requesting: {selectedUser.name}</p>
                                <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-white text-xs">✕</button>
                            </div>
                            <input 
                                value={requestTopic}
                                onChange={(e) => setRequestTopic(e.target.value)}
                                placeholder="Enter topic (e.g. Project Help)..."
                                className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-red-500 outline-none mb-3 placeholder-gray-600"
                            />
                            <button onClick={sendChatRequest} className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded transition-colors shadow-lg shadow-red-900/20">
                                Send Request
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* --- RIGHT SIDE: CHAT WINDOW --- */}
      <div className="hidden md:flex flex-1 bg-gray-900/50 border border-red-900/30 rounded-xl flex-col overflow-hidden relative">
        {selectedSession ? (
            <>
                <div className="p-4 bg-black/60 border-b border-red-900/30 backdrop-blur-sm flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 border border-red-500/30 overflow-hidden p-0.5">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${getChatPartner(selectedSession).name}`} alt="Partner" className="w-full h-full rounded-full" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">{getChatPartner(selectedSession).name}</h3>
                            <p className="text-xs text-gray-400">{selectedSession.topic}</p>
                        </div>
                    </div>
                    <span className="flex items-center gap-2 text-xs text-green-400 border border-green-900/50 px-2 py-1 rounded-full bg-green-900/10">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Secure Connection
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
                    {messages.map((msg, idx) => {
                        const isMe = (msg.sender?._id || msg.senderId || msg.sender) === user._id;
                        const senderName = msg.sender?.name || msg.senderName || 'Unknown';
                        
                        return (
                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] p-3 rounded-2xl ${isMe ? 'bg-red-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                                    {!isMe && <p className="text-[10px] text-gray-400 mb-1 font-bold">{senderName}</p>}
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                    <p className="text-[9px] opacity-60 text-right mt-1">
                                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-black/60 border-t border-red-900/30 backdrop-blur-md">
                    <div className="flex gap-2">
                        <input 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-red-500 outline-none text-white placeholder-gray-600"
                            placeholder="Type transmission..."
                        />
                        <button onClick={sendMessage} className="bg-red-600 hover:bg-red-700 text-white px-6 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                            Send
                        </button>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center border border-gray-800 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <p className="text-sm uppercase tracking-widest text-gray-600">Secure Channel Offline</p>
                <p className="text-xs text-gray-700">Select an operative to begin transmission.</p>
            </div>
        )}
      </div>

    </div>
  );
};

export default QnAPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';

const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000');

const AlumniPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Data States
  const [invitations, setInvitations] = useState([]); // Requests received
  const [sentRequests, setSentRequests] = useState(new Set()); // Requests I sent
  const [connections, setConnections] = useState(new Set()); // My active connections
  const [users, setUsers] = useState([]); // Suggested users / Search results
  
  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    fetchData();

    // Socket: Real-time updates
    if (user) {
        socket.emit("setup", user._id);
        socket.on("request_received", () => fetchNetworkStatus()); // Someone requested me
        socket.on("request_accepted", () => fetchNetworkStatus()); // Someone accepted my request
    }
    return () => {
        socket.off("request_received");
        socket.off("request_accepted");
    };
  }, [user]);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) handleSearch();
      else fetchSuggestions();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- FETCHING ---
  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchNetworkStatus(), fetchSuggestions()]);
    setLoading(false);
  };

  const fetchNetworkStatus = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/chat/network-status`, { withCredentials: true });
      if (data.success) {
        setInvitations(data.incoming);
        setSentRequests(new Set(data.sent));
        setConnections(new Set(data.connected));
      }
    } catch (err) { console.error("Network status error", err); }
  };

  const fetchSuggestions = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/auth/alumni`, { withCredentials: true });
      if (data.success) setUsers(data.alumni);
    } catch (err) { console.error(err); }
  };

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/chat/search?query=${searchQuery}`, { withCredentials: true });
      if (data.success) setUsers(data.users);
    } catch (err) { console.error("Search failed"); }
  };

  // --- ACTIONS ---

  const sendConnectRequest = async (targetUser) => {
    setActionLoading(targetUser._id);
    try {
      const { data } = await axios.post(`${API_URL}/chat/request`, 
        { receiverId: targetUser._id, topic: "Connection Request" }, 
        { withCredentials: true }
      );

      if (data.success) {
        socket.emit("send_request", { receiverId: targetUser._id, senderName: user.name });
        // Optimistic Update
        setSentRequests(prev => new Set(prev).add(targetUser._id));
      }
    } catch (error) {
      alert(error.response?.data?.message || "Connection failed");
    } finally {
      setActionLoading(null);
    }
  };

  const acceptInvitation = async (req) => {
    setActionLoading(req._id);
    try {
      const { data } = await axios.put(`${API_URL}/chat/accept`, { sessionId: req._id }, { withCredentials: true });
      if (data.success) {
        socket.emit("accept_request", { senderId: req.sender._id });
        alert(`Connected with ${req.sender.name}!`);
        fetchNetworkStatus(); // Refresh all lists
      }
    } catch (error) {
      alert("Failed to accept");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in font-sans text-gray-200 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-red-900/30 pb-6">
        <div>
          <h2 className="text-4xl font-bold text-white glow-text font-creepster tracking-wider mb-2">My Network</h2>
          <p className="text-gray-400">Manage your connections and discover new mentors.</p>
        </div>
        <div className="relative w-full md:w-72">
           <input 
              type="text" 
              placeholder="Search people..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-red-900/50 rounded-lg px-4 py-2 pl-10 text-white focus:border-red-500 outline-none transition-all"
           />
           <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
        </div>
      </div>

      {/* 1. INVITATIONS (ACCEPT REQUESTS) */}
      {invitations.length > 0 && (
        <div className="bg-gray-900/40 border border-red-900/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-red-600 w-2 h-2 rounded-full animate-pulse"></span>
                Invitations ({invitations.length})
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {invitations.map(req => (
                    <div key={req._id} className="flex flex-col bg-black/40 p-4 rounded-lg border border-gray-800 hover:border-red-500/30 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden border border-gray-600">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.sender.name}`} alt="avatar" className="w-full h-full object-cover"/>
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="font-bold text-white truncate">{req.sender.name}</h4>
                                <p className="text-xs text-gray-400 truncate">{req.sender.roleTitle || req.sender.roles[0]}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-auto">
                            <button 
                                onClick={() => acceptInvitation(req)}
                                disabled={actionLoading === req._id}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-xs font-bold transition-colors"
                            >
                                {actionLoading === req._id ? '...' : 'Accept'}
                            </button>
                            <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-1.5 rounded text-xs font-bold transition-colors">
                                Ignore
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* 2. DISCOVER PEOPLE */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">
            {searchQuery ? "Search Results" : "Suggested for you"}
        </h3>

        {loading && <div className="text-center py-10 text-red-500 animate-pulse">Scanning database...</div>}

        {!loading && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {users.map(u => {
                    if (u._id === user._id) return null; // Don't show self
                    
                    const isConnected = connections.has(u._id);
                    const isPending = sentRequests.has(u._id);
                    
                    return (
                        <div key={u._id} className="relative p-6 bg-gray-900/30 border border-red-900/10 rounded-xl hover:border-red-500/40 transition-all group hover:bg-black/50 backdrop-blur-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-full bg-black border-2 border-gray-800 p-1 mb-3 group-hover:border-red-500 transition-colors shadow-lg">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt="avatar" className="w-full h-full rounded-full object-cover"/>
                                </div>
                                <h3 className="font-bold text-lg text-white">{u.name}</h3>
                                <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-2">{u.roles.includes('Mentor') ? 'Mentor' : 'Student'}</p>
                                <p className="text-sm text-gray-400 mb-4 h-5 overflow-hidden">{u.roleTitle || u.company || 'Ready to connect'}</p>
                                
                                {isConnected ? (
                                    <button
                                        onClick={() => navigate('/qna')}
                                        className="w-full py-2 rounded-lg text-sm font-bold bg-green-900/20 text-green-400 border border-green-500/30 hover:bg-green-900/40 transition-all"
                                    >
                                        Message
                                    </button>
                                ) : isPending ? (
                                    <button
                                        disabled
                                        className="w-full py-2 rounded-lg text-sm font-bold bg-gray-800 text-gray-400 border border-gray-700 cursor-default"
                                    >
                                        Pending
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => sendConnectRequest(u)}
                                        disabled={actionLoading === u._id}
                                        className="w-full py-2 rounded-lg text-sm font-bold bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 transition-all"
                                    >
                                        {actionLoading === u._id ? 'Sending...' : 'Connect'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
        
        {!loading && users.length === 0 && (
            <div className="text-center py-10 text-gray-500">No agents found in this sector.</div>
        )}
      </div>

    </div>
  );
};

export default AlumniPage;
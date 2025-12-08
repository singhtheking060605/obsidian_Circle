import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

// Initialize socket connection
const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000');

const QnAPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  const [sessions, setSessions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  
  // Request Form State
  const [topic, setTopic] = useState("");
  const [mentorEmail, setMentorEmail] = useState("");

  const messagesEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  const isMentor = user?.roles?.includes('Mentor') || user?.roles?.includes('Admin');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchMyChats();
    if (isMentor) fetchRequests();

    // Socket listener
    socket.on("receive_message", (data) => {
      // FIX: Ensure we only add messages for the currently open session
      if (selectedSession && data.sessionId === selectedSession._id) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => socket.off("receive_message");
  }, [selectedSession, isMentor]);

  const fetchMyChats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/chat/my-chats`, { withCredentials: true });
      if (data.success) setSessions(data.sessions);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/chat/requests/all`, { withCredentials: true });
      if (data.success) setRequests(data.requests);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!mentorEmail.trim()) return alert("Please enter the mentor's email.");
    if (!topic.trim()) return alert("Please enter a topic.");

    try {
      const teamRes = await axios.get(`${API_URL}/team/me`, { withCredentials: true });
      if (!teamRes.data.team) return alert("You need a team to start a chat.");

      const { data } = await axios.post(`${API_URL}/chat/request`, 
        { 
          teamId: teamRes.data.team._id, 
          topic,
          mentorEmail 
        }, 
        { withCredentials: true }
      );
      
      if (data.success) {
        setTopic("");
        setMentorEmail("");
        fetchMyChats();
        alert("Request sent successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  const handleAcceptRequest = async (sessionId) => {
    try {
      const { data } = await axios.put(`${API_URL}/chat/accept`, { sessionId }, { withCredentials: true });
      if (data.success) {
        fetchRequests();
        fetchMyChats();
        setActiveTab('active');
        joinSession(data.session);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept request");
    }
  };

  const joinSession = async (session) => {
    setSelectedSession(session);
    socket.emit("join_room", session._id);
    
    try {
      const { data } = await axios.get(`${API_URL}/chat/messages/${session._id}`, { withCredentials: true });
      if (data.success) setMessages(data.messages);
    } catch (err) {
      console.error("Error loading messages", err);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "" || !selectedSession) return;

    const messageData = {
      sessionId: selectedSession._id,
      senderId: user._id, // Send ID for backend/socket logic
      senderName: user.name, // Send Name for immediate display
      content: newMessage,
      createdAt: new Date().toISOString()
    };

    // Emit to socket
    socket.emit("send_message", messageData);
    
    // Clear input
    setNewMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-black text-white p-4 gap-4 animate-fade-in">
      
      {/* LEFT SIDEBAR */}
      <div className="w-full md:w-1/3 bg-gray-900/50 border border-red-900/30 rounded-xl p-4 flex flex-col">
        {isMentor && (
          <div className="flex gap-2 mb-4">
            <button onClick={() => setActiveTab('active')} className={`flex-1 py-2 text-sm font-bold rounded ${activeTab === 'active' ? 'bg-red-600' : 'bg-gray-800'}`}>Chats</button>
            <button onClick={() => setActiveTab('requests')} className={`flex-1 py-2 text-sm font-bold rounded ${activeTab === 'requests' ? 'bg-red-600' : 'bg-gray-800'}`}>Requests ({requests.length})</button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3">
          {!isMentor && (
            <div className="mb-6 p-4 border border-red-900/50 rounded-lg bg-red-900/10">
              <h3 className="text-red-400 font-bold mb-3">Contact Mentor</h3>
              <div className="space-y-3">
                <input value={mentorEmail} onChange={(e) => setMentorEmail(e.target.value)} placeholder="Mentor Email" className="w-full bg-black border border-gray-700 rounded p-2 text-sm focus:border-red-500 outline-none" />
                <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" className="w-full bg-black border border-gray-700 rounded p-2 text-sm focus:border-red-500 outline-none" />
                <button onClick={handleCreateRequest} disabled={!topic || !mentorEmail} className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-sm font-bold disabled:opacity-50 mt-2">Send Request</button>
              </div>
            </div>
          )}

          {activeTab === 'active' && sessions.map(session => (
            <div key={session._id} onClick={() => joinSession(session)} className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedSession?._id === session._id ? 'border-red-500 bg-red-900/20' : 'border-gray-800 hover:border-gray-600 bg-black/40'}`}>
              <h4 className="font-bold text-sm text-white">{session.topic}</h4>
              <p className="text-xs text-gray-400 mt-1">{isMentor ? session.student?.name : (session.mentor?.name || 'Pending Approval')}</p>
            </div>
          ))}

          {activeTab === 'requests' && requests.map(req => (
            <div key={req._id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <h4 className="font-bold text-white text-sm">{req.topic}</h4>
              <p className="text-xs text-gray-400 mb-2">From: {req.student?.name}</p>
              <button onClick={() => handleAcceptRequest(req._id)} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-xs font-bold">Accept</button>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div className="hidden md:flex flex-1 bg-gray-900/50 border border-red-900/30 rounded-xl flex-col relative overflow-hidden">
        {selectedSession ? (
          <>
            <div className="p-4 border-b border-red-900/30 bg-black/60 flex justify-between items-center">
              <h3 className="font-bold text-lg text-red-500">{selectedSession.topic}</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => {
                // FIX: SAFELY DETERMINE SENDER
                // Check if msg.sender is an object (DB) or if msg.senderId exists (Socket)
                const senderId = msg.sender?._id || msg.sender || msg.senderId;
                const isMe = senderId === user._id;
                
                // Safe name access
                const senderName = msg.sender?.name || msg.senderName || 'Unknown';

                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 rounded-2xl ${isMe ? 'bg-red-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                      {!isMe && <p className="text-[10px] text-gray-400 mb-1 font-bold">{senderName}</p>}
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-[9px] opacity-60 text-right mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-red-900/30 bg-black/60">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={selectedSession.status === 'active' ? "Type message..." : "Waiting for mentor..."}
                  disabled={selectedSession.status !== 'active'}
                  className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-red-500 outline-none text-sm"
                />
                <button 
                  onClick={sendMessage}
                  disabled={selectedSession.status !== 'active'}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 flex-col">
            <p>Select a chat session.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QnAPage;
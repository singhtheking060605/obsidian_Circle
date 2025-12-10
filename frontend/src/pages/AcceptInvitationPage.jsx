import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AcceptInvitationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [invitationData, setInvitationData] = useState(null);
  const [error, setError] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);
  
  // Form data for new users
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    branch: '',
    rollNumber: ''
  });

  // ✅ FIXED: Properly construct the invitation API URL
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/team';
  
  // Method 1: Extract everything before /team and add /invitation
  const baseApiUrl = BASE_URL.substring(0, BASE_URL.lastIndexOf('/team'));
  const INVITATION_API_URL = `${baseApiUrl}/invitation`;
  
  // If BASE_URL doesn't contain /team, use this fallback
  const FINAL_API_URL = INVITATION_API_URL.includes('/api') 
    ? INVITATION_API_URL 
    : 'http://localhost:4000/api/invitation';
  
  console.log('🔍 BASE_URL:', BASE_URL);
  console.log('🔍 FINAL Invitation API URL:', FINAL_API_URL);

  // Fetch invitation details
  useEffect(() => {
    const fetchInvitationDetails = async () => {
      try {
        const fetchUrl = `${FINAL_API_URL}/token/${token}`;
        console.log('🔍 Fetching invitation from:', fetchUrl); // Debug log
        console.log('🎫 Token:', token); // Debug log
        
        const { data } = await axios.get(fetchUrl);
        
        if (data.success) {
          setInvitationData(data.invitation);
          setFormData(prev => ({ ...prev, email: data.invitation.email }));
        }
      } catch (err) {
        console.error('❌ Fetch error:', err);
        console.error('❌ Error response:', err.response?.data);
        setError(err.response?.data?.message || 'Invalid or expired invitation link');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInvitationDetails();
    } else {
      setError('No invitation token provided');
      setLoading(false);
    }
  }, [token, FINAL_API_URL]);

  // Check if user already exists
  const checkExistingUser = async () => {
    try {
      const { data } = await axios.post(
        `${API_URL.replace(/\/team$/, '/auth')}/check-email`,
        { email: formData.email },
        { withCredentials: true }
      );
      
      setIsExistingUser(data.exists);
    } catch (err) {
      console.log('User check failed:', err);
    }
  };

  useEffect(() => {
    if (formData.email) {
      checkExistingUser();
    }
  }, [formData.email]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAcceptInvitation = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!isExistingUser) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${FINAL_API_URL}/accept/${token}`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          branch: formData.branch,
          rollNumber: formData.rollNumber
        },
        { withCredentials: true }
      );

      if (data.success) {
        alert(`Successfully joined ${data.team.name}!`);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept invitation');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-2xl font-creepster animate-pulse">
          Decoding transmission...
        </div>
      </div>
    );
  }

  if (error && !invitationData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 border-2 border-red-900 rounded-xl p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-500 mb-4">Invalid Invitation</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-creepster text-red-500 glow-text mb-2">
            THE OBSIDIAN CIRCLE
          </h1>
          <p className="text-gray-400">Team Invitation</p>
        </div>

        {/* Invitation Details Card */}
        <div className="bg-gray-900 border-2 border-red-900/50 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-red-500">{invitationData?.teamName}</h2>
              <p className="text-gray-400 text-sm">Invited by: {invitationData?.invitedBy}</p>
            </div>
          </div>
          
          {invitationData?.teamDescription && (
            <p className="text-gray-300 text-sm bg-black/30 p-3 rounded-lg">
              {invitationData.teamDescription}
            </p>
          )}
        </div>

        {/* Accept Invitation Form */}
        <div className="bg-gray-900 border-2 border-red-900/50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-red-500 mb-6">
            {isExistingUser ? 'Confirm & Join Team' : 'Complete Your Profile'}
          </h3>

          <form onSubmit={handleAcceptInvitation} className="space-y-4">
            {/* Email (read-only) */}
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
              />
            </div>

            {!isExistingUser && (
              <>
                {/* Name */}
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                    placeholder="+91 9876543210"
                  />
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                    placeholder="Computer Science"
                  />
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Roll Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                    placeholder="CS2021001"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                    placeholder="Minimum 6 characters"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                    placeholder="Re-enter password"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all glow-button disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {loading ? 'Processing...' : isExistingUser ? 'Join Team' : 'Accept Invitation & Join'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitationPage;
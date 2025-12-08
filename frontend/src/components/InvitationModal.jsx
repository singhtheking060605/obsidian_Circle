import React, { useState } from 'react';
import axios from 'axios';

const InvitationModal = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ FIXED: Build the correct invitation API URL from VITE_API_URL
  // VITE_API_URL = "http://localhost:4000/api/team"
  // We need: "http://localhost:4000/api/invitation/send"
  const getInvitationUrl = () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/team';
    // Remove everything after '/api' and add '/invitation/send'
    const apiBase = baseUrl.substring(0, baseUrl.indexOf('/api') + 4); // Gets "http://localhost:4000/api"
    return `${apiBase}/invitation/send`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const invitationUrl = getInvitationUrl();
    
    try {
      console.log('📧 Sending invitation to URL:', invitationUrl);
      console.log('📧 Email:', email);
      console.log('📧 Cookies:', document.cookie); // Check if token exists
      
      const { data } = await axios.post(
        invitationUrl,
        { email },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Response:', data);

      if (data.success) {
        alert(`Invitation sent successfully to ${email}!`);
        setEmail('');
        onSuccess();
        onClose();
      } else {
        setError(data.message || 'Failed to send invitation');
      }
    } catch (err) {
      console.error('❌ Invitation error:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Status code:', err.response?.status);
      
      setError(err.response?.data?.message || 'Failed to send invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-red-900/50 rounded-xl max-w-md w-full p-6 relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-red-500 glow-text mb-2 font-creepster">
            Invite Team Member
          </h3>
          <p className="text-gray-400 text-sm">
            Send an invitation to join your party
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800/50 border border-red-900/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              placeholder="agent@example.com"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              An invitation link will be sent to this email (expires in 7 days)
            </p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-semibold glow-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sending...
                </span>
              ) : (
                'Send Invitation'
              )}
            </button>
          </div>
        </form>

        {/* Debug info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-800/50 rounded text-xs text-gray-500 font-mono">
            API: {getInvitationUrl()}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationModal;
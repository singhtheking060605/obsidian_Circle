import React, { useState, useEffect } from 'react';

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:4000/api/auth';

  useEffect(() => {
    // Extract token from URL path: /password/reset/:token
    const pathname = window.location.pathname;
    const tokenFromUrl = pathname.split('/').pop();
    console.log('🔑 Token from URL:', tokenFromUrl);
    setToken(tokenFromUrl);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      console.log('📤 Sending reset password request');
      
      const response = await fetch(`${API_URL}/password/reset/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();
      console.log('📥 Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      alert('Password reset successfully!');
      window.location.href = '/login';
    } catch (err) {
      console.error('❌ Reset password error:', err);
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-800/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-500 mb-2 glow-text">
            The Obsidian Circle
          </h1>
          <p className="text-gray-400">Create New Password</p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-red-900/30 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4 text-center glow-text">
            Reset Password
          </h2>
          
          <p className="text-gray-400 text-center mb-6">
            Enter your new password below
          </p>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* New Password Field */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-red-900/30 rounded-lg text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="••••••••"
              />
              <p className="text-gray-500 text-xs mt-1">Minimum 8 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-red-900/30 rounded-lg text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none glow-button"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = '/login'}
              className="text-gray-400 hover:text-red-400 text-sm transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .glow-text {
          text-shadow: 0 0 10px rgba(239, 68, 68, 0.5),
                       0 0 20px rgba(239, 68, 68, 0.3),
                       0 0 30px rgba(239, 68, 68, 0.2);
        }
        
        .glow-button {
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
        }
        
        .glow-button:hover:not(:disabled) {
          box-shadow: 0 0 30px rgba(239, 68, 68, 0.8);
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordPage;
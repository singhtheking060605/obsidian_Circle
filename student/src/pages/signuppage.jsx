import React, { useState } from 'react';

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+91',
    password: '',
    confirmPassword: '',
    role: '', 
    verificationMethod: 'email'
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // FIXED: Changed port from 5000 to 4000 to match your backend .env
  const API_URL = 'http://localhost:4000/api/auth'; 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRoleSelect = (selectedRole) => {
    // FIX: If user selects "Mentor", we set the internal role to "Alumni"
    // This matches what the Backend and Login logic expects.
    const backendValue = selectedRole === 'Mentor' ? 'Alumni' : 'Student';
    
    setFormData(prev => ({
      ...prev,
      role: backendValue
    }));
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.role) {
      setError('Please select a role (Student or Mentor)');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Invalid phone number. Format: +91XXXXXXXXXX');
      setLoading(false);
      return;
    }

    try {
      console.log('📤 Sending registration request to:', `${API_URL}/register`);
      
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role, // This will now send 'Alumni' or 'Student'
          verificationMethod: formData.verificationMethod
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      alert(data.message || 'Verification code sent successfully!');
      setStep(2);
    } catch (err) {
      console.error('❌ Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (otp.length !== 5) {
      setError('Please enter a valid 5-digit OTP');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          otp: otp
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      alert('Account verified successfully!');
      window.location.href = '/login'; // Send to Login Page after verification
    } catch (err) {
      console.error('❌ Verification error:', err);
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if "Mentor" card should appear selected
  const isMentorSelected = formData.role === 'Alumni';

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-red-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-800/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-500 mb-2 glow-text">
            The Obsidian Circle
          </h1>
          <p className="text-gray-400">Join the Dark Side</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-red-900/30 rounded-2xl p-8 shadow-2xl">
          {step === 1 ? (
            <>
              <h2 className="text-3xl font-bold text-white mb-6 text-center glow-text">
                Create Account
              </h2>

              {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-red-900/30 rounded-lg text-white outline-none focus:border-red-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-red-900/30 rounded-lg text-white outline-none focus:border-red-500 transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-red-900/30 rounded-lg text-white outline-none focus:border-red-500 transition-all"
                    placeholder="+919876543210"
                  />
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-gray-300 mb-3 font-medium">
                    Select Your Role <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Student Role Card */}
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('Student')}
                      className={`relative p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                        formData.role === 'Student'
                          ? 'bg-red-900/30 border-red-500 shadow-lg'
                          : 'bg-gray-800/30 border-red-900/30 hover:border-red-700/50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">🎓</div>
                        <div className="text-white font-semibold">Student</div>
                      </div>
                    </button>

                    {/* Mentor Role Card */}
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('Mentor')}
                      className={`relative p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                        isMentorSelected
                          ? 'bg-red-900/30 border-red-500 shadow-lg'
                          : 'bg-gray-800/30 border-red-900/30 hover:border-red-700/50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">🧑‍🏫</div>
                        <div className="text-white font-semibold">Mentor</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-red-900/30 rounded-lg text-white outline-none focus:border-red-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-red-900/30 rounded-lg text-white outline-none focus:border-red-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 glow-button"
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => window.location.href = '/login'}
                  className="text-gray-400 hover:text-red-400 text-sm"
                >
                  Already have an account? Login
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-white mb-6 text-center glow-text">
                Verify OTP
              </h2>
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-red-900/30 rounded-lg text-white text-center text-2xl"
                    placeholder="Enter Code"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <style>{`
        .glow-text { text-shadow: 0 0 10px rgba(239, 68, 68, 0.5); }
        .glow-button { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
      `}</style>
    </div>
  );
};

export default SignupPage;
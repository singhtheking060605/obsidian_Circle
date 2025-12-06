import React, { useState } from 'react';

const SignupPage = () => {
  const [step, setStep] = useState(1); // 1: Registration, 2: OTP Verification
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+91',
    password: '',
    confirmPassword: '',
    role: '', // Single role selection
    verificationMethod: 'email'
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      role: role
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
      // Add your API call here
      console.log('Registration data:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep(2);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Add your API call here
      console.log('OTP verification:', { email: formData.email, phone: formData.phone, otp });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Account verified successfully!');
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-red-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-800/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-500 mb-2 glow-text">
            The Obsidian Circle
          </h1>
          <p className="text-gray-400">Join the Dark Side</p>
        </div>

        {/* Signup Card */}
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

              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-red-900/30 rounded-lg text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-red-900/30 rounded-lg text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-red-900/30 rounded-lg text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                    placeholder="+919876543210"
                  />
                  <p className="text-gray-500 text-xs mt-1">Format: +91XXXXXXXXXX</p>
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
                          ? 'bg-red-900/30 border-red-500 shadow-lg shadow-red-500/20'
                          : 'bg-gray-800/30 border-red-900/30 hover:border-red-700/50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">🎓</div>
                        <div className="text-white font-semibold">Student</div>
                        <div className="text-gray-400 text-xs mt-1">Learn & Grow</div>
                      </div>
                      {formData.role === 'Student' && (
                        <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>

                    {/* Mentor Role Card */}
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('Mentor')}
                      className={`relative p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                        formData.role === 'Mentor'
                          ? 'bg-red-900/30 border-red-500 shadow-lg shadow-red-500/20'
                          : 'bg-gray-800/30 border-red-900/30 hover:border-red-700/50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">🧑‍🏫</div>
                        <div className="text-white font-semibold">Mentor</div>
                        <div className="text-gray-400 text-xs mt-1">Guide Others</div>
                      </div>
                      {formData.role === 'Mentor' && (
                        <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">Choose one role to get started</p>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Password
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
                    Confirm Password
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

                {/* Verification Method */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Verification Method
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="verificationMethod"
                        value="email"
                        checked={formData.verificationMethod === 'email'}
                        onChange={handleChange}
                        className="mr-2 accent-red-500"
                      />
                      <span className="text-gray-300">Email</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="verificationMethod"
                        value="phone"
                        checked={formData.verificationMethod === 'phone'}
                        onChange={handleChange}
                        className="mr-2 accent-red-500"
                      />
                      <span className="text-gray-300">Phone</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none glow-button"
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-red-900/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900/50 text-gray-400">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Login Link */}
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-gray-800/50 hover:bg-gray-800 border border-red-900/30 hover:border-red-500/50 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Login
              </button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-white mb-6 text-center glow-text">
                Verify Your Account
              </h2>

              <p className="text-gray-400 text-center mb-6">
                We've sent a verification code to your {formData.verificationMethod === 'email' ? 'email' : 'phone'}
              </p>

              {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* OTP Field */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium text-center">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength="5"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-red-900/30 rounded-lg text-white text-center text-2xl tracking-widest placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                    placeholder="12345"
                  />
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 5}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none glow-button"
                >
                  {loading ? 'Verifying...' : 'Verify Account'}
                </button>

                {/* Resend Code */}
                <div className="text-center">
                  <button className="text-red-400 hover:text-red-300 text-sm transition-colors">
                    Resend Code
                  </button>
                </div>

                {/* Back Button */}
                <button
                  onClick={() => setStep(1)}
                  className="w-full bg-gray-800/50 hover:bg-gray-800 border border-red-900/30 hover:border-red-500/50 text-white py-3 rounded-lg font-semibold transition-all"
                >
                  ← Back to Registration
                </button>
              </div>
            </>
          )}

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="text-gray-400 hover:text-red-400 text-sm transition-colors"
            >
              ← Back to Home
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

export default SignupPage;
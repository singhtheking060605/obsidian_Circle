import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onToggleSidebar, isDashboard = false }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-sm border-b border-red-900/30 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* LEFT SIDE: Toggle & Logo */}
          <div className="flex items-center gap-4">
            {isDashboard && (
              <button 
                onClick={onToggleSidebar}
                className="p-2 text-red-600 hover:text-red-400 hover:bg-red-900/20 rounded-full transition-all duration-300 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            )}

            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 hidden sm:block">
                  <div className="absolute inset-0 bg-red-600 rounded-full animate-pulse blur-sm opacity-75"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-red-500 to-black rounded-full border border-red-400"></div>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-red-500 glow-text tracking-widest font-creepster group-hover:text-red-400 transition-colors">
                THE OBSIDIAN CIRCLE
              </h1>
            </Link>
          </div>

          {/* CENTER: Public Links (Only if not dashboard) */}
          {!isDashboard && (
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-red-500 transition-colors font-medium text-sm tracking-wider uppercase">Features</a>
              <a href="#mentors" className="text-gray-300 hover:text-red-500 transition-colors font-medium text-sm tracking-wider uppercase">Mentors</a>
              <a href="#about" className="text-gray-300 hover:text-red-500 transition-colors font-medium text-sm tracking-wider uppercase">About</a>
            </div>
          )}

          {/* RIGHT SIDE: Dynamic Auth Buttons */}
          <div className="flex items-center gap-4">
            
            {user ? (
              /* --- LOGGED IN VIEW --- */
              <>
                {!isDashboard && (
                  <Link 
                    to="/dashboard" 
                    className="hidden md:block text-red-400 hover:text-white font-medium transition-colors mr-2 text-sm tracking-wide"
                  >
                    ENTER PORTAL
                  </Link>
                )}

                <div className="flex items-center gap-3">
                    {/* User Greeting (Hidden on mobile) */}
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-bold text-gray-200">{user.name}</span>
                        <span className="text-xs text-red-500">{user.roles?.[0] || 'Member'}</span>
                    </div>

                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gray-900 border border-red-500/50 overflow-hidden shadow-[0_0_10px_rgba(220,38,38,0.2)]">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                          alt="User" 
                          className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Logout Button */}
                    <button 
                        onClick={logout}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Sign Out"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    </button>
                </div>
              </>
            ) : (
              /* --- GUEST VIEW --- */
              <>
                <Link to="/login" className="hidden md:block text-gray-300 hover:text-white transition-colors font-medium">
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="hidden md:block px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 glow-button text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button 
                className="md:hidden p-2 text-gray-300 hover:text-red-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                    <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/>
                )}
                </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-t border-red-900/30 absolute w-full shadow-2xl">
          <div className="px-4 py-4 space-y-3">
            {!isDashboard && (
                <>
                <a href="#features" className="block text-gray-300 hover:text-red-500 py-2">Features</a>
                <a href="#mentors" className="block text-gray-300 hover:text-red-500 py-2">Mentors</a>
                </>
            )}
            
            <div className="pt-4 border-t border-red-900/30 flex flex-col gap-3">
              {user ? (
                 <>
                    <div className="flex items-center gap-3 pb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="User" />
                        </div>
                        <span className="text-white font-bold">{user.name}</span>
                    </div>
                    <Link to="/dashboard" className="block w-full text-center bg-red-900/20 border border-red-500/50 text-red-500 py-2 rounded">
                        Go to Dashboard
                    </Link>
                    <button onClick={logout} className="block w-full text-center text-gray-400 hover:text-white py-2">
                        Logout
                    </button>
                 </>
              ) : (
                 <>
                    <Link to="/login" className="block w-full text-center text-gray-300 hover:text-white py-2">
                        Login
                    </Link>
                    <Link to="/signup" className="block w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold text-center glow-button">
                        Sign Up
                    </Link>
                 </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
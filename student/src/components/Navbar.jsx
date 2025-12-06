import React from 'react';

const Navbar = ({ onToggleSidebar }) => {
  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-sm border-b border-red-900/30 z-50 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left Side: Toggle & Logo */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Button */}
        <button 
          onClick={onToggleSidebar}
          className="p-2 text-red-600 hover:text-red-400 hover:bg-red-900/20 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          aria-label="Toggle Sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 hidden sm:block">
              <div className="absolute inset-0 bg-red-600 rounded-full animate-pulse blur-sm opacity-75"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-red-500 to-black rounded-full border border-red-400"></div>
          </div>
          <h1 className="text-2xl font-bold text-red-500 glow-text">
                The Obsidian Circle
          </h1>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-400 hover:text-red-500 transition-colors duration-300 group">
          <div className="absolute top-1 right-2 w-2 h-2 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
            <span className="hidden md:block text-sm text-gray-300 group-hover:text-red-400 transition-colors">Explorer</span>
            <div className="w-9 h-9 rounded-full bg-gray-900 border border-red-900/50 overflow-hidden group-hover:border-red-500 transition-all shadow-[0_0_10px_rgba(220,38,38,0.2)] group-hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="User" 
                className="w-full h-full object-cover"
            />
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
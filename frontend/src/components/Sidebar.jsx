import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // --- 1. STUDENT MENU ITEMS ---
  const studentItems = [
    { 
      id: 'dashboard', 
      label: 'Personal Dashboard', 
      path: '/dashboard', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
    },
    { 
      id: 'my-team', 
      label: 'My Team', 
      path: '/team/me', 
      icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8 z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' 
    },
    { 
      id: 'all-tasks', 
      label: 'All Missions', 
      path: '/missions', 
      icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' 
    },

    // NEW: Student QnA Link
    { 
      id: 'qna', 
      label: 'Mentor Q&A', 
      path: '/qna', 
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' 
    },

    { 
      id: 'alumni', 
      label: 'Alumni Network', 
      path: '/alumni', 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.257M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' 
    }
  ];

  // --- 2. MENTOR / ADMIN MENU ITEMS ---
  const mentorItems = [
    { 
      id: 'mentor-dash', 
      label: 'Mentor Dashboard', 
      path: '/mentor/dashboard',
      icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' 
    },
    { 
      id: 'manage-tasks', 
      label: 'Manage Tasks', 
      path: '/mentor/tasks',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' 
    },
    { 
      id: 'manage-teams', 
      label: 'Manage Teams', 
      path: '/mentor/teams',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' 
    },
    // NEW: Mentor Chat/Requests Link
    { 
      id: 'qna', 
      label: 'Chat Requests', 
      path: '/mentor/qna', 
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' 

    // --- NEW: EVALUATION BUTTON ---
    { 
      id: 'evaluate', 
      label: 'Evaluate Intel', 
      path: '/mentor/evaluate',
      // Clipboard check icon
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' 
    },
    { 
      id: 'referral', 
      label: 'Issue Referral', 
      path: '/mentor/referral',
      // Star/Award icon path
      icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' 
    }
    ,
    { 
      id: 'students', 
      label: 'Operative Rankings', 
      path: '/mentor/students',
      // Users/Group icon
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.257M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'

    }
  ];

  // Check role
  const isMentor = user?.roles?.some(r => ['Mentor', 'Admin', 'Alumni'].includes(r));
  
  const menuItems = isMentor ? mentorItems : studentItems;

  return (
    <aside 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-black border-r border-red-900/30 overflow-y-auto z-40 transition-transform duration-300 ease-in-out scrollbar-hide ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="pt-8">
        <div className="px-3 mb-8">
          <p className="px-4 text-xs font-bold text-red-600/80 uppercase tracking-widest mb-4 font-creepster">
            {isMentor ? 'Command Center' : 'Operations'}
          </p>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 border border-transparent whitespace-nowrap ${
                    isActive(item.path)
                      ? 'bg-red-900/10 text-red-500 border-red-900/30 shadow-[0_0_10px_rgba(220,38,38,0.1)]' 
                      : 'text-gray-400 hover:text-red-400 hover:bg-red-900/5'
                  }`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={`min-w-[18px] transition-all duration-300 ${isActive(item.path) ? 'drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : ''}`}
                  >
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-red-900/10 to-transparent">
          <div className="border-t border-red-900/30 pt-4">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-red-500 transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
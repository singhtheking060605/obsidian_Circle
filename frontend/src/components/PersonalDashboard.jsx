import React from 'react';
import { useAuth } from '../context/AuthContext';

const PersonalDashboard = () => {
  const { user } = useAuth();

  // Mock data for visualization - connect to backend later
  const stats = [
    { label: 'Missions Completed', value: '0', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Current Rank', value: 'Novice', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { label: 'XP Gained', value: '0 XP', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
  ];

  const recentActivity = [
    { id: 1, text: "System initialized.", time: "Just now", type: "system" },
    { id: 2, text: "Joined The Obsidian Circle.", time: "2 days ago", type: "success" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-end justify-between border-b border-red-900/30 pb-4">
        <div>
          <h2 className="text-4xl font-bold text-white glow-text font-creepster tracking-wider mb-2">
            Personal Dashboard
          </h2>
          <p className="text-gray-400 text-sm">
            Welcome back, Agent <span className="text-red-500 font-bold">{user?.name || 'Unknown'}</span>.
          </p>
        </div>
        <div className="hidden md:block text-right">
           <div className="text-xs text-red-500/60 font-mono mb-1">CLEARANCE LEVEL 1</div>
           <div className="h-1 w-32 bg-gray-900 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 w-1/4 animate-pulse"></div>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-black/60 border border-red-900/30 p-6 rounded-xl glow-box hover:border-red-500/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-900/10 rounded-lg text-red-500 group-hover:text-white group-hover:bg-red-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <span className="text-xs font-mono text-gray-500 group-hover:text-red-400">UPDATED</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1 font-mono">{stat.value}</h3>
            <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile & Status */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-gray-900/40 border border-red-900/30 p-6 rounded-xl text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>
             <div className="w-24 h-24 mx-auto bg-black rounded-full border-2 border-red-600/50 p-1 mb-4 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
             </div>
             <h3 className="text-xl font-bold text-white">{user?.name}</h3>
             <p className="text-red-500 text-sm mb-6">{user?.email}</p>
             
             <div className="text-left space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                   <span>Profile Completion</span>
                   <span>40%</span>
                </div>
                <div className="w-full bg-black rounded-full h-1.5">
                   <div className="bg-red-600 h-1.5 rounded-full w-2/5 shadow-[0_0_5px_red]"></div>
                </div>
             </div>
          </div>

          {/* Badges Section */}
          <div className="bg-black/40 border border-gray-800 p-6 rounded-xl">
             <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-red-600 rounded"></span>
                Badges
             </h4>
             <div className="flex gap-2">
                <div className="w-10 h-10 bg-red-900/20 border border-red-500/30 rounded-full flex items-center justify-center text-red-500" title="Early Adopter">
                   ★
                </div>
                <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center text-gray-700 border-dashed">
                   +
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="lg:col-span-2 bg-black/60 border border-red-900/30 rounded-xl p-6 glow-box">
          <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-2">Live Feed</h3>
          <div className="space-y-0 relative">
            {/* Vertical Line */}
            <div className="absolute left-2.5 top-0 bottom-0 w-px bg-gray-800"></div>
            
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4 items-start relative pb-8 last:pb-0">
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 z-10 bg-black ${activity.type === 'success' ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}></div>
                <div className="flex-1">
                   <p className="text-gray-300 text-sm">{activity.text}</p>
                   <span className="text-xs text-gray-600 font-mono">{activity.time}</span>
                </div>
              </div>
            ))}
             <div className="flex gap-4 items-start relative pt-8">
                <div className="w-5 h-5 rounded-full border-2 border-gray-700 bg-black z-10 flex-shrink-0 animate-pulse"></div>
                <div className="flex-1">
                   <p className="text-gray-600 text-sm italic">Awaiting further signals...</p>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDashboard;
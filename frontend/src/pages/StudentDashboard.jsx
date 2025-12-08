import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TeamManagement from '../components/TeamManagement';
import PersonalDashboard from '../components/PersonalDashboard';
import AvailableMissions from '../components/AvailableMissions'; // <--- Ensure this component is created
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal-dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'personal-dashboard':
        return <PersonalDashboard />;
      case 'team':
      case 'my-team': // Handle both keys if Sidebar uses different IDs
        return <TeamManagement />;
      case 'all-tasks':
      case 'missions': // Handle both keys
        // ✅ Renders the component that fetches from backend
        return <AvailableMissions />;
      case 'assigned':
        return (
          <div className="text-xl text-red-400 font-medium">
            No active missions assigned. Stay alert.
          </div>
        );
      case 'assignments':
        return (
          <div className="text-xl text-red-400 font-medium">
            Mission history log is empty.
          </div>
        );
      case 'alumni-connect':
      case 'network':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4 border-l-4 border-red-600 pl-4">
              Alumni Network
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-black/60 border border-red-900/30 rounded-lg hover:border-red-500 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Alumni${i}`}
                      alt="Alumni"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Senior Agent {i}</h4>
                    <p className="text-xs text-gray-400">
                      Software Engineer at Google
                    </p>
                    <button className="text-xs text-red-500 hover:text-red-400 mt-1">
                      Connect &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div className="text-xl text-red-500">Select an option from the left.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-red-900 selection:text-white overflow-x-hidden">
      <Navbar
        isDashboard={true}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex pt-16 relative">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
        />

        <main
          className={`flex-1 p-4 md:p-8 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900/20 to-black relative transition-[margin] duration-300 ease-in-out will-change-[margin] ${
            isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'
          }`}
        >
          {/* Background Atmospheric Fog/Noise */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
            }}
          ></div>

          <div className="w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto relative z-10 transition-all duration-300 ease-in-out">
            {/* Header for current section */}
            <div className="mb-10 pb-4 border-b border-red-900/30 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 glow-text tracking-wide font-creepster">
                  {(activeTab || '').replace(/-/g, ' ')}
                </h2>
                <p className="text-gray-400 text-sm md:text-base max-w-2xl">
                  Welcome back, Agent {user?.name || 'Unknown'}. Status: Online.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-red-500/70 border border-red-900/30 px-3 py-1 rounded bg-black/50">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                SYSTEM ONLINE
              </div>
            </div>

            {/* Content Container */}
            <div
              className={`rounded-xl transition-all duration-300 ${
                activeTab !== 'team' && activeTab !== 'my-team'
                  ? 'bg-black/40 border border-red-900/20 p-6 md:p-8 min-h-[400px] backdrop-blur-sm shadow-2xl shadow-red-900/5'
                  : ''
              }`}
            >
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
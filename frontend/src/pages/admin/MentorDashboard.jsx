import React from 'react';
import Sidebar from '../../components/Sidebar'; // Assuming you reuse the sidebar
import { useAuth } from '../../context/AuthContext';

const MentorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('personal-dashboard');

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={true} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 border-b border-red-900/30 pb-4">
          <h1 className="text-3xl font-bold text-red-500 font-creepster tracking-wider">
            Mentor Command Center
          </h1>
          <p className="text-gray-400 mt-2">Welcome back, {user?.name}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats or Mentor Specific Widgets */}
          <div className="bg-gray-900/50 border border-red-900/30 p-6 rounded-lg">
            <h3 className="text-xl text-red-400 mb-2">Pending Reviews</h3>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-gray-900/50 border border-red-900/30 p-6 rounded-lg">
            <h3 className="text-xl text-red-400 mb-2">Active Teams</h3>
            <p className="text-3xl font-bold">5</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MentorDashboard;

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* FIX 1: Pass 'isDashboard={true}' so Navbar shows the toggle button 
          FIX 2: Match the prop name 'onToggleSidebar' expected by Navbar 
      */}
      <Navbar 
        isDashboard={true} 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      /> 
      
      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} />
        
        {/* FIX 3: Helper class to handle the margin transition smoothly.
            We ONLY control margin here. Pages should NOT have 'ml-64'.
        */}
        <main 
          className={`flex-1 transition-all duration-300 min-h-[calc(100vh-4rem)] bg-black ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
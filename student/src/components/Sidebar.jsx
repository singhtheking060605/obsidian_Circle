import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, isOpen }) => {
  const menuItems = [
    { id: 'team', label: 'Manage Your Team', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8 z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' },
    { id: 'all-tasks', label: 'View All Tasks', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
    { id: 'assigned', label: 'View Assigned Tasks', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
    { id: 'assignments', label: 'All Assignments', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' }
  ];

  return (
    <aside 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-black border-r border-red-900/30 overflow-y-auto z-40 transition-transform duration-300 ease-in-out scrollbar-hide ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="pt-8">
        <div className="px-3 mb-8">
          <p className="px-4 text-xs font-bold text-red-600/80 uppercase tracking-widest mb-4 font-creepster">Operations</p>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 border border-transparent whitespace-nowrap ${
                    activeTab === item.id 
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
                    className={`min-w-[18px] transition-all duration-300 ${activeTab === item.id ? 'drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : ''}`}
                  >
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Bottom Decoration */}
        <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-red-900/10 to-transparent">
          <div className="border-t border-red-900/30 pt-4 text-center">
            <p className="text-xl text-red-700 font-creepster opacity-60">The Upside Down</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
import React, { useState } from 'react';

const TeamManagement = () => {
  const [teamData, setTeamData] = useState({
    name: "The Hellfire Club",
    repoLink: "https://github.com/singhtheking060605/obsidian_circle",
    description: "We are building a portal to track anomalies in the Hawkins energy grid. Our project uses React for the dashboard and Node.js for the sensor array backend.",
    members: [
      { id: 1, name: "Mike Wheeler", role: "Team Lead", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
      { id: 2, name: "Dustin Henderson", role: "Tech Wizard", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dustin" },
      { id: 3, name: "Lucas Sinclair", role: "Strategist", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas" },
      { id: 4, name: "Will Byers", role: "Scout", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Will" }
    ]
  });

  return (
    <div className="space-y-8 animate-fade-in w-full">
      
      {/* Top Section: Team Info & Repo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
        {/* Team Identity Card */}
        <div className="lg:col-span-2 p-6 bg-black/60 border border-red-900/30 rounded-xl glow-box relative overflow-hidden group transition-all duration-300 ease-in-out">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-red-600">
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2-5-2 5zm0 0l-2-5 2 5zm0 0L2 17l10 5 10-5-10-5z"></path>
            </svg>
          </div>
          
          <div className="relative z-10">
            <label className="text-xs text-red-500 uppercase tracking-widest font-bold mb-2 block">Team Name</label>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-4xl font-bold text-white glow-text font-creepster tracking-wider break-words">
                {teamData.name}
              </h2>
              <button className="text-xs border border-red-900/50 text-red-400 px-3 py-1 rounded hover:bg-red-900/20 transition-colors shrink-0 ml-4">
                Edit Details
              </button>
            </div>

            <label className="text-xs text-red-500 uppercase tracking-widest font-bold mb-2 block">GitHub Repository</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-900/80 border border-red-900/30 rounded-lg flex items-center px-4 py-3 text-gray-300 font-mono text-sm overflow-hidden transition-all duration-300">
                <svg className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span className="truncate">{teamData.repoLink}</span>
              </div>
              <a 
                href={teamData.repoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors font-bold flex items-center justify-center whitespace-nowrap"
              >
                Link
              </a>
            </div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="bg-black/60 border border-red-900/30 rounded-xl p-6 glow-box overflow-y-auto max-h-[300px] xl:max-h-[350px] transition-all duration-300 ease-in-out">
          <label className="text-xs text-red-500 uppercase tracking-widest font-bold mb-4 block sticky top-0 bg-black/90 pb-2 z-10 backdrop-blur-sm">Party Members</label>
          <div className="space-y-4">
            {teamData.members.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-red-900/10 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-red-900/30">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 group-hover:border-red-500 transition-colors">
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full"></div>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm group-hover:text-red-400 transition-colors truncate">{member.name}</p>
                  <p className="text-gray-500 text-xs truncate">{member.role}</p>
                </div>
              </div>
            ))}
            <button className="w-full py-2 border border-dashed border-gray-700 text-gray-500 rounded-lg hover:border-red-500 hover:text-red-500 text-xs uppercase tracking-wider transition-all">
              + Add Member
            </button>
          </div>
        </div>
      </div>

      {/* Middle Section: Project Media */}
      <div className="bg-black/60 border border-red-900/30 rounded-xl p-6 glow-box transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-6">
          <label className="text-xs text-red-500 uppercase tracking-widest font-bold">Project Media / Evidence</label>
          <button className="text-xs bg-red-900/20 text-red-400 px-3 py-1 rounded border border-red-900/50 hover:bg-red-900/40 transition-all">
            Upload Media
          </button>
        </div>
        
        {/* Media Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="aspect-video bg-gray-900/50 rounded-lg border border-gray-800 hover:border-red-500/50 relative group overflow-hidden cursor-pointer transition-all duration-300">
              <img 
                src={`https://images.unsplash.com/photo-1614726365723-49cfae967a35?w=400&fit=crop&q=60`} 
                alt="Project Screenshot" 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs text-white">evidence_00{item}.jpg</span>
              </div>
            </div>
          ))}
          {/* Add New Placeholder */}
          <div className="aspect-video bg-black border-2 border-dashed border-gray-800 rounded-lg flex flex-col items-center justify-center text-gray-600 hover:text-red-500 hover:border-red-500/50 transition-all duration-300 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span className="text-xs uppercase font-bold">Add Media</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Writing/Description Area */}
      <div className="bg-black/60 border border-red-900/30 rounded-xl p-6 glow-box transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs text-red-500 uppercase tracking-widest font-bold">
            Project Log / Description
          </label>
          <span className="text-xs text-gray-600">Markdown Supported</span>
        </div>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-black rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <textarea 
            className="relative w-full h-40 xl:h-64 bg-gray-900/80 border border-gray-800 rounded-lg p-4 text-gray-300 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-900 transition-all font-mono text-sm resize-none"
            placeholder="Describe your project, paste updates, or log anomalies here..."
            value={teamData.description}
            onChange={(e) => setTeamData({...teamData, description: e.target.value})}
          ></textarea>
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-red-600/10 border border-red-600/50 text-red-500 hover:bg-red-600 hover:text-white px-6 py-2 rounded transition-all text-sm font-bold uppercase tracking-wider glow-button">
            Save Log
          </button>
        </div>
      </div>

    </div>
  );
};

export default TeamManagement;
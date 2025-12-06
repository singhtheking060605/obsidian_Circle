import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamManagement = () => {
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    repoLink: '',
    description: ''
  });
  
  // Create Team Form State
  const [createForm, setCreateForm] = useState({ name: '', repoLink: '', description: '' });

  // API Base URL
  const API_URL = 'http://localhost:4000/api/team';

  // Fetch Team Data
  const fetchTeam = async () => {
    try {
      setLoading(true);
      // Need to ensure credentials are sent for authentication
      const { data } = await axios.get(`${API_URL}/me`, { withCredentials: true });
      
      if (data.success && data.team) {
        setTeamData(data.team);
        setFormData({
          repoLink: data.team.repoLink || '',
          description: data.team.description || ''
        });
      } else {
        setTeamData(null);
      }
    } catch (err) {
      console.error("Error fetching team:", err);
      setError("Could not establish connection to the Upside Down.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  // Handle Team Creation
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/create`, createForm, { withCredentials: true });
      if (data.success) {
        fetchTeam(); // Refresh data
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create party.");
    }
  };

  // Handle Team Updates
  const handleUpdate = async () => {
    try {
      const { data } = await axios.put(`${API_URL}/update`, formData, { withCredentials: true });
      if (data.success) {
        setTeamData(data.team);
        setEditMode(false);
      }
    } catch (err) {
      alert("Failed to update details.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 animate-pulse">
        <div className="text-red-500 glow-text font-creepster text-2xl">Connecting...</div>
      </div>
    );
  }

  // View: Create Team (If no team found)
  if (!teamData) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-black/60 border border-red-900/30 rounded-xl glow-box text-center animate-fade-in">
        <h2 className="text-3xl text-red-500 glow-text font-creepster mb-6">No Party Found</h2>
        <p className="text-gray-400 mb-8">It's dangerous to go alone. Form a party to enter the Upside Down.</p>
        
        <form onSubmit={handleCreateTeam} className="space-y-4 text-left">
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2">Party Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-gray-900/50 border border-red-900/30 rounded p-3 text-white focus:border-red-500 outline-none"
              placeholder="e.g. The Hellfire Club"
              value={createForm.name}
              onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2">Repo Link (Optional)</label>
            <input 
              type="text" 
              className="w-full bg-gray-900/50 border border-red-900/30 rounded p-3 text-white focus:border-red-500 outline-none"
              placeholder="https://github.com/..."
              value={createForm.repoLink}
              onChange={(e) => setCreateForm({...createForm, repoLink: e.target.value})}
            />
          </div>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold glow-button transition-all">
            Create Party
          </button>
        </form>
      </div>
    );
  }

  // View: Team Management Dashboard
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
              <button 
                onClick={() => setEditMode(!editMode)}
                className="text-xs border border-red-900/50 text-red-400 px-3 py-1 rounded hover:bg-red-900/20 transition-colors shrink-0 ml-4"
              >
                {editMode ? 'Cancel' : 'Edit Details'}
              </button>
            </div>

            <label className="text-xs text-red-500 uppercase tracking-widest font-bold mb-2 block">GitHub Repository</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-900/80 border border-red-900/30 rounded-lg flex items-center px-4 py-3 text-gray-300 font-mono text-sm overflow-hidden transition-all duration-300">
                <svg className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                {editMode ? (
                  <input 
                    type="text" 
                    className="bg-transparent border-none w-full text-white focus:outline-none"
                    value={formData.repoLink}
                    placeholder="Update Git Link..."
                    onChange={(e) => setFormData({...formData, repoLink: e.target.value})}
                  />
                ) : (
                  <span className="truncate">{teamData.repoLink || "No repo linked"}</span>
                )}
              </div>
              {teamData.repoLink && (
                <a 
                  href={teamData.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors font-bold flex items-center justify-center whitespace-nowrap"
                >
                  Link
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="bg-black/60 border border-red-900/30 rounded-xl p-6 glow-box overflow-y-auto max-h-[300px] xl:max-h-[350px] transition-all duration-300 ease-in-out">
          <label className="text-xs text-red-500 uppercase tracking-widest font-bold mb-4 block sticky top-0 bg-black/90 pb-2 z-10 backdrop-blur-sm">Party Members</label>
          <div className="space-y-4">
            {teamData.members.map((memberObj, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 hover:bg-red-900/10 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-red-900/30">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 group-hover:border-red-500 transition-colors">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${memberObj.user?.name || 'Unknown'}`} 
                      alt="Member" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full"></div>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm group-hover:text-red-400 transition-colors truncate">
                    {memberObj.user?.name || "Unknown User"}
                  </p>
                  <p className="text-gray-500 text-xs truncate">{memberObj.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Project Log */}
      <div className="bg-black/60 border border-red-900/30 rounded-xl p-6 glow-box transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs text-red-500 uppercase tracking-widest font-bold">
            Project Log / Description
          </label>
          <span className="text-xs text-gray-600">Markdown Supported</span>
        </div>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-black rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          {editMode ? (
            <textarea 
              className="relative w-full h-40 xl:h-64 bg-gray-900/80 border border-gray-800 rounded-lg p-4 text-gray-300 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-900 transition-all font-mono text-sm resize-none"
              placeholder="Describe your project, paste updates, or log anomalies here..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          ) : (
             <div className="relative w-full h-40 xl:h-64 bg-gray-900/40 border border-gray-800/50 rounded-lg p-4 text-gray-300 font-mono text-sm overflow-y-auto whitespace-pre-wrap">
               {teamData.description || "No log entries found in the archives."}
             </div>
          )}
        </div>
        
        {editMode && (
          <div className="flex justify-end mt-4">
            <button 
              onClick={handleUpdate}
              className="bg-red-600/10 border border-red-600/50 text-red-500 hover:bg-red-600 hover:text-white px-6 py-2 rounded transition-all text-sm font-bold uppercase tracking-wider glow-button"
            >
              Save Log
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default TeamManagement;
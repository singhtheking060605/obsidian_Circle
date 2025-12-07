import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminTeamsPage = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'assign'
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Assignment Form State
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedTask, setSelectedTask] = useState('');

  // ENV Config
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  // --- DATA FETCHING ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch All Teams
      const teamsRes = await axios.get(`${API_URL}/team/all`, { withCredentials: true });
      if (teamsRes.data.success) setTeams(teamsRes.data.teams);

      // 2. Fetch All Tasks (Missions)
      const tasksRes = await axios.get(`${API_URL}/v1/task/all`, { withCredentials: true });
      if (tasksRes.data.success) setTasks(tasksRes.data.tasks);

      // 3. Fetch Current Assignments
      const assignRes = await axios.get(`${API_URL}/v1/task/assignments/all`, { withCredentials: true });
      if (assignRes.data.success) setAssignments(assignRes.data.assignments);

    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLE ASSIGNMENT ---
  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedTeam || !selectedTask) {
        alert("Please select both a squad and a mission.");
        return;
    }

    try {
        const { data } = await axios.post(`${API_URL}/v1/task/assign`, {
            teamId: selectedTeam,
            taskId: selectedTask
        }, { withCredentials: true });

        if (data.success) {
            alert("Squad deployed successfully!");
            setSelectedTeam('');
            setSelectedTask('');
            fetchData(); // Refresh list
        }
    } catch (error) {
        alert(error.response?.data?.message || "Deployment failed.");
    }
  };

  // Helper to get status color
  const getStatusColor = (status) => {
    switch(status) {
        case 'Assigned': return 'text-blue-400 border-blue-900/50 bg-blue-900/20';
        case 'In Progress': return 'text-yellow-400 border-yellow-900/50 bg-yellow-900/20';
        case 'Submitted': return 'text-green-400 border-green-900/50 bg-green-900/20';
        default: return 'text-gray-400 border-gray-800 bg-gray-900';
    }
  };

  if (loading) {
    return (
        <div className="p-8 min-h-screen bg-black w-full ml-64 flex items-center justify-center">
            <div className="text-red-600 font-creepster text-3xl animate-pulse">Accessing Hawkins Lab Records...</div>
        </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-black text-gray-200 w-full ml-64 font-sans animate-fade-in">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b border-red-900/30 pb-4">
        <h1 className="text-4xl font-creepster text-red-600 tracking-wider glow-text">Squad Oversight</h1>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'border border-gray-700 hover:text-red-400'}`}>
            Active Deployments
          </button>
          <button onClick={() => setActiveTab('assign')} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'assign' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'border border-gray-700 hover:text-red-400'}`}>
            Deploy Squad
          </button>
        </div>
      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900/40 p-4 rounded-xl border border-red-900/20">
                    <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-1">Total Squads</h3>
                    <p className="text-3xl font-bold text-white">{teams.length}</p>
                </div>
                <div className="bg-gray-900/40 p-4 rounded-xl border border-red-900/20">
                    <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-1">Active Deployments</h3>
                    <p className="text-3xl font-bold text-white">{assignments.length}</p>
                </div>
                <div className="bg-gray-900/40 p-4 rounded-xl border border-red-900/20">
                    <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-1">Pending Submissions</h3>
                    <p className="text-3xl font-bold text-white">{assignments.filter(a => a.status === 'Assigned').length}</p>
                </div>
            </div>

            {/* Assignments Table */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-800 bg-gray-900/80">
                            <th className="p-4 text-xs text-gray-400 uppercase tracking-wider">Squad Name</th>
                            <th className="p-4 text-xs text-gray-400 uppercase tracking-wider">Mission</th>
                            <th className="p-4 text-xs text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs text-gray-400 uppercase tracking-wider">Deployed</th>
                            <th className="p-4 text-xs text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {assignments.map((assign) => (
                            <tr key={assign._id} className="hover:bg-red-900/5 transition-colors">
                                <td className="p-4 font-bold text-white">{assign.team?.name || 'Unknown Team'}</td>
                                <td className="p-4 text-gray-300">{assign.task?.title || 'Unknown Task'}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getStatusColor(assign.status)}`}>
                                        {assign.status}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 text-sm font-mono">
                                    {new Date(assign.assignedAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <button className="text-xs text-red-400 hover:text-white underline">Review</button>
                                </td>
                            </tr>
                        ))}
                        {assignments.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500 italic">No squads currently deployed.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* --- DEPLOY TAB --- */}
      {activeTab === 'assign' && (
        <div className="max-w-2xl mx-auto bg-gray-900/30 p-8 rounded-2xl border border-red-900/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-2">Deploy Squad to Mission</h2>
            
            <form onSubmit={handleAssign} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Select Squad</label>
                    <select 
                        className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                    >
                        <option value="">-- Choose a Squad --</option>
                        {teams.map(team => (
                            <option key={team._id} value={team._id}>
                                {team.name} (Lead: {team.leader?.name})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Select Mission</label>
                    <select 
                        className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                        value={selectedTask}
                        onChange={(e) => setSelectedTask(e.target.value)}
                    >
                        <option value="">-- Choose a Mission --</option>
                        {tasks.map(task => (
                            <option key={task._id} value={task._id}>
                                {task.title} (Due: {new Date(task.deadline).toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="pt-4">
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all">
                        Execute Deployment
                    </button>
                </div>
            </form>
        </div>
      )}

    </div>
  );
};

export default AdminTeamsPage;
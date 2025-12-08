import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Import Auth

const AdminTaskPage = () => {
  const { user } = useAuth(); // Get current user info
  const [activeTab, setActiveTab] = useState('view');
  const [tasks, setTasks] = useState([]);
  const [rubrics, setRubrics] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedTo: 'All',
    deliverables: '',
    expectedSkills: '',
    rubric: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const tasksRes = await axios.get(`${API_URL}/task/all`, { withCredentials: true });
      if (tasksRes.data.success) setTasks(tasksRes.data.tasks);

      try {
        const rubricsRes = await axios.get(`${API_URL}/rubric/all`, { withCredentials: true });
        if (rubricsRes.data.success) setRubrics(rubricsRes.data.rubrics);
      } catch (err) {
        console.warn("Rubric fetch failed", err);
      }

    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'view' || activeTab === 'create') {
      fetchData();
    }
  }, [activeTab]);

  // --- CREATE TASK ---
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newTask,
        deliverables: newTask.deliverables.split(',').map(item => item.trim()).filter(i => i),
        expectedSkills: newTask.expectedSkills.split(',').map(item => item.trim()).filter(i => i),
      };

      const { data } = await axios.post(`${API_URL}/task/new`, payload, { withCredentials: true });
      if (data.success) {
        alert("Mission Initiated Successfully!");
        setNewTask({ title: '', description: '', deadline: '', assignedTo: 'All', deliverables: '', expectedSkills: '', rubric: '' });
        setActiveTab('view');
        fetchData();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Scrub this mission? This action cannot be undone.")) return;
    try {
      await axios.delete(`${API_URL}/task/${id}`, { withCredentials: true });
      setTasks(tasks.filter(t => t._id !== id));
      alert("Mission deleted successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete task.");
    }
  };

  return (
    <div className="p-8 text-gray-200 font-sans animate-fade-in">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b border-red-900/30 pb-4">
        <h1 className="text-4xl font-creepster text-red-600 tracking-wider glow-text">Mission Control</h1>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('view')} className={`px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'view' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'border border-gray-700 text-gray-500 hover:text-red-400'}`}>Archives</button>
          <button onClick={() => setActiveTab('create')} className={`px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'create' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'border border-gray-700 text-gray-500 hover:text-red-400'}`}>+ Initiate</button>
        </div>
      </div>

      {/* --- VIEW MODE --- */}
      {activeTab === 'view' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {loading ? <p className="text-red-500 animate-pulse font-creepster">Scanning...</p> : tasks.map(task => {
            // Logic: Check if task creator ID matches current user ID
            // Handle both populated object and direct ID string
            const creatorId = task.createdBy?._id || task.createdBy;
            const isCreator = creatorId === user?._id;

            return (
              <div key={task._id} className="bg-gray-900/40 border border-red-900/20 p-6 rounded-xl hover:border-red-600/50 transition-all group relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">{task.title}</h3>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Issued by: {task.createdBy?.name || 'Unknown'}
                      </p>
                    </div>
                    
                    {/* ONLY SHOW DELETE BUTTON IF USER IS CREATOR */}
                    {isCreator && (
                      <button 
                        onClick={() => handleDelete(task._id)} 
                        className="text-gray-600 hover:text-red-500 p-2 rounded-full hover:bg-red-900/20 transition-all"
                        title="Delete Mission"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{task.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {task.expectedSkills?.slice(0,3).map(skill => (
                      <span key={skill} className="text-[10px] bg-red-900/20 text-red-300 px-2 py-1 rounded border border-red-900/30">{skill}</span>
                    ))}
                    {task.rubric && (
                      <span className="text-[10px] bg-purple-900/20 text-purple-300 px-2 py-1 rounded border border-purple-900/30">Rubric Attached</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono text-gray-600 border-t border-gray-800 pt-3 mt-2">
                    <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                    <span>To: {task.assignedTo}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- CREATE MODE (Unchanged) --- */}
      {activeTab === 'create' && (
        <div className="max-w-4xl mx-auto bg-gray-900/30 p-8 rounded-2xl border border-red-900/30 backdrop-blur-sm">
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full">
                <label className="block text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Mission Title</label>
                <input type="text" required className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none placeholder-gray-700" placeholder="e.g. Operation: Mind Flayer" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
              </div>
              
              <div className="col-span-full">
                <label className="block text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Briefing</label>
                <textarea required className="w-full h-32 bg-black/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none placeholder-gray-700 resize-none" placeholder="Mission details..." value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
              </div>

              <div>
                <label className="block text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Deliverables (comma separated)</label>
                <input type="text" className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none placeholder-gray-700 text-sm" placeholder="e.g. Source Code, Demo Video, PDF Report" value={newTask.deliverables} onChange={(e) => setNewTask({...newTask, deliverables: e.target.value})} />
              </div>

              <div>
                <label className="block text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Expected Skills (comma separated)</label>
                <input type="text" className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none placeholder-gray-700 text-sm" placeholder="e.g. React, Node.js, Espionage" value={newTask.expectedSkills} onChange={(e) => setNewTask({...newTask, expectedSkills: e.target.value})} />
              </div>

              <div>
                <label className="block text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Deadline</label>
                <input type="date" required className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none [color-scheme:dark]" value={newTask.deadline} onChange={(e) => setNewTask({...newTask, deadline: e.target.value})} />
              </div>

              <div>
                <label className="block text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Grading Rubric</label>
                <select className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none" value={newTask.rubric} onChange={(e) => setNewTask({...newTask, rubric: e.target.value})}>
                  <option value="">No Rubric Selected</option>
                  {rubrics.map(r => (
                    <option key={r._id} value={r._id}>{r.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all mt-4">Initiate Mission</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminTaskPage;
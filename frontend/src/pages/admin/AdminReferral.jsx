import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Award, Link as LinkIcon, User, Plus, Trash2 } from 'lucide-react';

const AdminReferral = () => {
  const [teams, setTeams] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [referrals, setReferrals] = useState([]);
  
  // Form State
  const [reason, setReason] = useState('');
  const [context, setContext] = useState('');
  const [links, setLinks] = useState(['']);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  // 1. Fetch Teams (to get students) and Past Referrals
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsRes, referralsRes] = await Promise.all([
            axios.get(`${API_URL}/team/all`, { withCredentials: true }),
            axios.get(`${API_URL}/referral/my-issued`, { withCredentials: true })
        ]);
        
        if (teamsRes.data.success) setTeams(teamsRes.data.teams);
        if (referralsRes.data.success) setReferrals(referralsRes.data.referrals);
      } catch (error) {
        console.error("Error loading referral data", error);
      }
    };
    fetchData();
  }, []);

  // 2. Handle Pre-selection from Student Directory
  useEffect(() => {
    if (location.state?.preSelectedStudentId) {
      setSelectedStudent(location.state.preSelectedStudentId);
    }
  }, [location.state]);

  // Evidence Link Handlers
  const handleLinkChange = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addLinkField = () => setLinks([...links, '']);
  
  const removeLinkField = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !reason) return alert("Select a student and provide a reason.");

    setLoading(true);
    try {
      const validLinks = links.filter(l => l.trim() !== '');
      
      const { data } = await axios.post(`${API_URL}/referral/new`, {
        studentId: selectedStudent,
        reason,
        context,
        evidenceLinks: validLinks
      }, { withCredentials: true });

      if (data.success) {
        alert("Referral created successfully!");
        setReferrals([data.referral, ...referrals]); // Update UI
        // Reset Form
        setReason('');
        setContext('');
        setLinks(['']);
        // Don't reset selected student if it came from navigation, or do? 
        // Usually better to reset to allow new entry
        setSelectedStudent(''); 
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to issue referral");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen text-gray-200 font-sans animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8 border-b border-red-900/30 pb-4">
        <div>
          <h1 className="text-4xl font-creepster text-red-600 tracking-wider glow-text">
            Issue Referral
          </h1>
          <p className="text-gray-400 mt-2 text-sm font-mono">
            Officially endorse field agents for external assignment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Referral Form */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900/50 border border-red-900/30 rounded-xl p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                
              {/* Student Selector */}
              <div>
                <label className="block text-red-500 font-bold uppercase tracking-widest text-xs mb-2">
                  Select Agent
                </label>
                <select 
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-red-500 outline-none"
                >
                  <option value="">-- Choose Target --</option>
                  {teams.map(team => (
                    <optgroup key={team._id} label={team.name}>
                      <option value={team.leader?._id}>{team.leader?.name} (Leader)</option>
                      {team.members.map(member => (
                         member.user && <option key={member.user._id} value={member.user._id}>{member.user.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Context */}
              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">
                  Mission Context (Optional)
                </label>
                <input 
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. Lead Developer for Project Demogorgon"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-red-500 outline-none"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">
                  Endorsement Details
                </label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why are you referring this student? Be specific about their skills and contributions..."
                  className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white h-32 focus:border-red-500 outline-none"
                />
              </div>

              {/* Evidence Links */}
              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">
                  Evidence Records
                </label>
                {links.map((link, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                      <LinkIcon size={14} className="absolute left-3 top-3.5 text-gray-500" />
                      <input 
                        type="text"
                        value={link}
                        onChange={(e) => handleLinkChange(idx, e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full bg-black/50 border border-gray-700 rounded-lg pl-9 p-3 text-white text-sm focus:border-red-500 outline-none"
                      />
                    </div>
                    {links.length > 1 && (
                      <button type="button" onClick={() => removeLinkField(idx)} className="text-red-500 hover:text-red-400">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addLinkField} className="text-xs text-red-500 hover:text-white flex items-center gap-1 mt-2">
                  <Plus size={14} /> Add Another Link
                </button>
              </div>

              {/* Submit */}
              <button 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex justify-center items-center gap-2"
              >
                {loading ? 'Processing...' : <><Award size={18} /> Generate Official Referral</>}
              </button>

            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: History */}
        <div className="lg:col-span-1">
          <h3 className="text-red-500 font-bold uppercase tracking-widest text-xs border-b border-gray-800 pb-2 mb-4">
            Issued Referrals ({referrals.length})
          </h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {referrals.map((ref) => (
              <div key={ref._id} className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 hover:border-red-900/50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-red-900/20 p-2 rounded-full">
                    <User size={16} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{ref.student?.name || 'Unknown Agent'}</h4>
                    <p className="text-xs text-gray-500">{new Date(ref.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs italic mb-3 line-clamp-3">"{ref.reason}"</p>
                {ref.evidenceLinks.length > 0 && (
                  <div className="text-[10px] text-red-400 flex items-center gap-1">
                    <LinkIcon size={10} /> {ref.evidenceLinks.length} evidence record(s) attached
                  </div>
                )}
              </div>
            ))}
            {referrals.length === 0 && (
                <div className="text-gray-600 text-sm text-center py-8">No referrals issued yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminReferral;
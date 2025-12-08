import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Trophy, User, ChevronRight, ChevronLeft, Eye, Award } from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null); // For Modal

  const ITEMS_PER_PAGE = 10;
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  // Fetch Students
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/auth/students`, { withCredentials: true });
        if (data.success) {
          // Mocking scores for ranking demonstration since backend doesn't aggregate yet
          const rankedData = data.students.map(s => ({
            ...s,
            score: Math.floor(Math.random() * 2000) + 500 // Mock score between 500-2500
          })).sort((a, b) => b.score - a.score); // Sort by score descending
          
          setStudents(rankedData);
          setFilteredStudents(rankedData);
        }
      } catch (error) {
        console.error("Failed to load agents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Handle Search
  useEffect(() => {
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(search.toLowerCase()) || 
      student.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredStudents(filtered);
    setPage(1); // Reset to page 1 on search
  }, [search, students]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedData = filteredStudents.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleGiveReferral = (student) => {
    // Navigate to referral page with student ID pre-selected
    navigate('/mentor/referral', { state: { preSelectedStudentId: student._id } });
  };

  return (
    <div className="p-4 md:p-8 min-h-screen text-gray-200 font-sans animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8 border-b border-red-900/30 pb-4">
        <div>
          <h1 className="text-4xl font-creepster text-red-600 tracking-wider glow-text">
            Agent Rankings
          </h1>
          <p className="text-gray-400 mt-2 text-sm font-mono">
            Global leaderboard and operative profiles.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative max-w-md">
        <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
        <input 
          type="text" 
          placeholder="Search agent by name or email..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black/40 border border-gray-700 rounded-lg pl-12 py-3 text-white focus:border-red-500 outline-none transition-all shadow-[0_0_10px_rgba(239,68,68,0.1)]"
        />
      </div>

      {/* Ranking Table */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/60 border-b border-red-900/30 text-xs text-red-500 uppercase tracking-widest">
              <th className="p-4 w-20 text-center">Rank</th>
              <th className="p-4">Agent</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Score</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {paginatedData.map((student, index) => {
              const globalRank = (page - 1) * ITEMS_PER_PAGE + index + 1;
              return (
                <tr key={student._id} className="hover:bg-red-900/5 transition-colors group">
                  <td className="p-4 text-center font-mono text-gray-500">
                    {globalRank <= 3 ? (
                      <Trophy size={18} className={
                        globalRank === 1 ? 'text-yellow-500 mx-auto' : 
                        globalRank === 2 ? 'text-gray-400 mx-auto' : 
                        'text-orange-700 mx-auto'
                      } />
                    ) : `#${globalRank}`}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                        <span className="font-bold text-xs">{student.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-bold text-white">{student.name}</div>
                        <div className="text-xs text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${
                         student.isAlumnus ? 'border-purple-500 text-purple-500' : 'border-green-500 text-green-500'
                     }`}>
                         {student.isAlumnus ? 'Alumni' : 'Active'}
                     </span>
                  </td>
                  <td className="p-4 text-right font-mono text-red-400">
                    {student.score.toLocaleString()} XP
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button 
                      onClick={() => setSelectedProfile(student)}
                      className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                      title="View Profile"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleGiveReferral(student)}
                      className="p-2 hover:bg-red-900/30 rounded-lg text-red-500 hover:text-red-400 transition-colors"
                      title="Give Referral"
                    >
                      <Award size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Pagination */}
        {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t border-gray-800 bg-black/20">
                <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-xs text-gray-500 font-mono">Page {page} of {totalPages}</span>
                <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    Next <ChevronRight size={16} />
                </button>
            </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedProfile(null)}>
          <div className="bg-gray-900 border border-red-900 rounded-xl w-full max-w-md p-6 relative shadow-[0_0_50px_rgba(220,38,38,0.2)]" onClick={e => e.stopPropagation()}>
            <button 
                onClick={() => setSelectedProfile(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
                ✕
            </button>
            
            <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-black border-2 border-red-600 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                    <User size={48} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedProfile.name}</h2>
                <p className="text-gray-400">{selectedProfile.email}</p>
                <div className="mt-2 text-red-500 font-mono text-sm">Rank Score: {selectedProfile.score}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/40 p-3 rounded border border-gray-800 text-center">
                    <span className="block text-xs text-gray-500 uppercase">Missions</span>
                    <span className="text-lg font-bold text-white">12</span>
                </div>
                <div className="bg-black/40 p-3 rounded border border-gray-800 text-center">
                    <span className="block text-xs text-gray-500 uppercase">Teams</span>
                    <span className="text-lg font-bold text-white">3</span>
                </div>
            </div>

            <button 
                onClick={() => handleGiveReferral(selectedProfile)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex justify-center items-center gap-2"
            >
                <Award size={18} /> Give Official Referral
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminStudents;
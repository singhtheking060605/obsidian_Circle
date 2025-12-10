// frontend/src/pages/admin/MissionRequestsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MissionRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/task/requests`, { withCredentials: true });
      if (data.success) setRequests(data.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (requestId, decision) => {
    if(!window.confirm(`Are you sure you want to ${decision} this team?`)) return;
    
    try {
      const { data } = await axios.put(
        `${API_URL}/task/request/${requestId}/decide`, 
        { decision }, 
        { withCredentials: true }
      );
      if (data.success) {
        alert(data.message);
        fetchRequests(); // Refresh list
      }
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  if (loading) return <div className="p-8 text-white">Loading incoming signals...</div>;

  return (
    <div className="p-8 min-h-screen text-gray-200">
      <h1 className="text-3xl font-creepster text-red-600 mb-8 border-b border-red-900/30 pb-4">
        Incoming Squad Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">No pending requests at this time.</p>
      ) : (
        <div className="grid gap-6">
          {requests.map(req => (
            <div key={req._id} className="bg-gray-900/40 border border-gray-700 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Mission Info */}
              <div className="flex-1">
                <span className="text-xs text-red-500 uppercase tracking-widest font-bold">Mission Target</span>
                <h3 className="text-xl text-white font-bold mb-1">{req.task?.title}</h3>
                <p className="text-sm text-gray-400">Due: {new Date(req.task?.deadline).toLocaleDateString()}</p>
              </div>

              {/* Team Info */}
              <div className="flex-1 border-l border-gray-700 pl-6">
                <span className="text-xs text-blue-400 uppercase tracking-widest font-bold">Applicant Squad</span>
                <h3 className="text-xl text-white font-bold mb-1">{req.team?.name}</h3>
                <p className="text-sm text-gray-400">Leader: {req.team?.leader?.name}</p>
                {req.team?.repoLink && (
                    <a href={req.team.repoLink} target="_blank" className="text-xs text-red-400 hover:underline">View Repo</a>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button 
                    onClick={() => handleDecision(req._id, 'approve')}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold transition-all"
                >
                    Approve
                </button>
                <button 
                    onClick={() => handleDecision(req._id, 'reject')}
                    className="bg-red-900/20 border border-red-600 text-red-500 hover:bg-red-600 hover:text-white px-6 py-2 rounded font-bold transition-all"
                >
                    Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MissionRequestsPage;
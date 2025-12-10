import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MissionCard from './MissionCard';

const AvailableMissions = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasTeam, setHasTeam] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        // We use the team route because it also returns 'hasTeam' status
        const { data } = await axios.get(`${API_URL}/team/available-tasks`, {
          withCredentials: true,
        });

        if (data.success) {
          setTasks(data.tasks);
          setHasTeam(data.hasTeam);
        }
      } catch (err) {
        console.error("Failed to fetch missions:", err);
        setError("Failed to retrieve mission protocols from the mainframe.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [API_URL]);

  const handleAcceptMission = (task) => {
    if (!hasTeam) {
      if(window.confirm("You need to be in a team to accept missions. Go to Team Management?")) {
        navigate('/team/me'); 
      }
      return;
    }
    // Redirect to Team Management with the mission object in state
    navigate('/team/me', { state: { missionToApply: task } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 animate-pulse font-creepster text-xl">Scanning for Active Operations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border border-red-500/50 bg-red-900/10 rounded-lg text-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-2xl font-bold text-white mb-4 border-l-4 border-red-600 pl-4 font-creepster tracking-wider">
        Available Missions
      </h3>
      
      {!hasTeam && (
        <div className="bg-yellow-900/20 border border-yellow-600/50 p-4 rounded-lg mb-6 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="text-yellow-200 text-sm">
            <strong>Clearance Restriction:</strong> You must assemble or join a squad (Team) before you can accept these operations.
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-gray-500 text-center py-12 border-2 border-dashed border-gray-800 rounded-lg">
          No active missions found at this clearance level.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <MissionCard 
              key={task._id} 
              task={task} 
              onAccept={() => handleAcceptMission(task)} 
              hasTeam={hasTeam}
              level={task.index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableMissions;
// frontend/src/pages/student/MissionsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AcceptMission from '../../components/acceptmission.jsx'; 

const MissionsPage = () => {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMissions = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch all available missions for the student
            const { data } = await axios.get('/api/v1/missions/active', {
                withCredentials: true 
            }); 
            setMissions(data.missions);
        } catch (err) {
            console.error('Failed to fetch missions:', err);
            setError(err.response?.data?.message || 'Failed to load missions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMissions();
    }, []);

    // Helper to format the date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="space-y-6 p-4 md:p-8 animate-fade-in min-h-screen">
                <h2 className="text-4xl font-bold text-white glow-text font-creepster tracking-wider mb-2">
                    Active Operations
                </h2>
                <p className="text-gray-400">Loading missions...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="space-y-6 p-4 md:p-8 animate-fade-in min-h-screen">
                <h2 className="text-4xl font-bold text-red-500 glow-text font-creepster tracking-wider mb-2">
                    ERROR
                </h2>
                <p className="text-red-400">Failed to load missions: {error}</p>
            </div>
        );
    }
    
    if (missions.length === 0) {
        return (
            <div className="space-y-6 p-4 md:p-8 animate-fade-in min-h-screen">
                <div className="mb-8 border-b border-red-900/30 pb-4">
                    <h2 className="text-4xl font-bold text-white glow-text font-creepster tracking-wider mb-2">
                        Active Operations
                    </h2>
                    <p className="text-gray-400">Select a mission to begin your training.</p>
                </div>
                <p className="text-gray-400 text-lg">
                    No available missions at this time. Check back later!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-8 animate-fade-in">
            <div className="mb-8 border-b border-red-900/30 pb-4">
                <h2 className="text-4xl font-bold text-white glow-text font-creepster tracking-wider mb-2">
                    Active Operations
                </h2>
                <p className="text-gray-400">Select a mission to begin your training.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {missions.map((mission) => (
                    <div key={mission._id} className="p-6 bg-gray-900/40 border border-red-900/20 rounded-lg hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(220,38,38,0.1)] group flex flex-col h-full backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-red-500 text-xs font-bold tracking-widest uppercase border border-red-900/50 px-2 py-1 rounded bg-black">
                                Level {mission.level || 'N/A'}
                            </span>
                            <span className="text-gray-500 text-xs flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                Active
                            </span>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                            {mission.title}
                        </h4>
                        <p className="text-gray-400 text-sm mb-4">
                            Deadline: {formatDate(mission.deadline)}
                        </p>
                        <p className="text-gray-400 text-sm mb-6 flex-1">
                            {mission.briefing || mission.description || 'No detailed briefing provided.'}
                        </p>
                        
                        <AcceptMission 
                            missionId={mission._id} 
                            onMissionAccepted={fetchMissions} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MissionsPage;
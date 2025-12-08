import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewAllTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasTeam, setHasTeam] = useState(false); // Used to control button state
    const navigate = useNavigate();

    useEffect(() => {
        fetchAvailableTasks();
    }, []);

    const fetchAvailableTasks = async () => {
        try {
            // Correct path, expecting successful retrieval from server
            const { data } = await axios.get('/api/team/available-tasks', {
                withCredentials: true,
            });
            
            setTasks(data.tasks);
            setHasTeam(data.hasTeam); // Expecting hasTeam from server response
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setTasks([]); 
            setLoading(false);
        }
    };

    const handleAcceptMission = (taskId) => {
        if (!hasTeam) {
            alert('You need to create or join a team first!');
            navigate('/my-team');
            return;
        }
        // Navigate to the dedicated acceptance page
        navigate(`/accept-mission/${taskId}`);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-red-500 text-2xl">Loading missions...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-red-500 mb-2" 
                        style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}>
                        ACTIVE OPERATIONS
                    </h1>
                    <p className="text-gray-400">
                        Select a mission to begin your training.
                    </p>
                    {!hasTeam && (
                        <div className="mt-4 bg-red-900/20 border border-red-500 rounded-lg p-4">
                            <p className="text-red-400">
                                ⚠️ You need to create or join a team before accepting missions.
                            </p>
                        </div>
                    )}
                </div>

                {/* Tasks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(!tasks || tasks.length === 0) ? ( 
                        <div className="col-span-full text-center text-gray-500 py-12">
                            No available missions at this time.
                        </div>
                    ) : (
                        tasks.map((task, index) => (
                            <div
                                key={task._id}
                                className="bg-zinc-900 border border-red-900/30 rounded-lg p-6 hover:border-red-500 transition-all duration-300"
                            >
                                {/* Level Badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-red-500 text-sm font-semibold tracking-wider">
                                        LEVEL {index + 1}
                                    </span>
                                    <span className="flex items-center gap-1 text-green-500 text-xs">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        Active
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-white mb-3">
                                    {task.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                    {task.description}
                                </p>

                                {/* Deadline */}
                                <div className="mb-4 text-xs text-gray-500">
                                    <span className="text-red-400">Deadline:</span> {formatDate(task.deadline)}
                                </div>

                                {/* Expected Skills */}
                                {task.expectedSkills && task.expectedSkills.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 mb-2">Required Skills:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {task.expectedSkills.slice(0, 3).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs bg-red-900/20 text-red-400 px-2 py-1 rounded"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {task.expectedSkills.length > 3 && (
                                                <span className="text-xs text-gray-500">
                                                    +{task.expectedSkills.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Accept Button */}
                                <button
                                    onClick={() => handleAcceptMission(task._id)}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 uppercase tracking-wider text-sm"
                                    disabled={!hasTeam}
                                >
                                    {hasTeam ? 'Accept Mission' : 'Join Team First'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewAllTasks;
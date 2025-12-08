import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// NOTE: You need to ensure getMyMissions is correctly implemented or replace it
// with a direct axios call if necessary. Assuming correct imports for now.

const ManageTeam = () => {
    const [team, setTeam] = useState(null);
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview, missions, members
    const navigate = useNavigate();

    useEffect(() => {
        fetchTeamData();
        fetchMissions();
    }, []);

    const fetchTeamData = async () => {
        try {
            // FIX 1: Removed /v1 prefix from team route
            const { data } = await axios.get('/api/team/my-team', {
                withCredentials: true,
            });
            setTeam(data.team);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching team:', error);
            setLoading(false);
        }
    };

    const fetchMissions = async () => {
        try {
            // FIX 2: Removed /v1 prefix from missions route
            const { data } = await axios.get('/api/team/my-missions', {
                withCredentials: true,
            });
            setMissions(data.missions);
        } catch (error) {
            console.error('Error fetching missions:', error);
        }
    };

    const handleInviteMember = () => {
        const teamName = prompt('Share this team name with your teammate:', team.name);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-red-500 text-2xl">Loading...</div>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl text-white mb-4">No Team Found</h2>
                    <button
                        onClick={() => navigate('/create-team')}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
                    >
                        Create Team
                    </button>
                </div>
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
                        TEAM: {team.name}
                    </h1>
                    <p className="text-gray-400">Manage your team and track mission progress</p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-4 mb-6 border-b border-red-900/30">
                    {['overview', 'missions', 'members'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-semibold uppercase tracking-wider transition-all ${
                                activeTab === tab
                                    ? 'text-red-500 border-b-2 border-red-500'
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Team Info Card */}
                        <div className="bg-zinc-900 border border-red-900/30 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-red-500 mb-4">Team Information</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-sm">Team Name</p>
                                    <p className="text-white font-semibold">{team.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Member Count</p>
                                    <p className="text-white font-semibold">{team.members.length} / 3</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Repository</p>
                                    {team.repoLink ? (
                                        <a
                                            href={team.repoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-red-400 hover:text-red-300 break-all"
                                        >
                                            {team.repoLink}
                                        </a>
                                    ) : (
                                        <p className="text-gray-600">Not set</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Active Missions</p>
                                    <p className="text-white font-semibold">{missions.length}</p>
                                </div>
                            </div>

                            {team.description && (
                                <div className="mt-4">
                                    <p className="text-gray-500 text-sm mb-2">Description</p>
                                    <p className="text-gray-300">{team.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={handleInviteMember}
                                className="bg-zinc-900 border border-red-900/30 hover:border-red-500 rounded-lg p-6 transition-all"
                            >
                                <div className="text-3xl mb-2">👥</div>
                                <h3 className="font-bold text-white mb-1">Invite Member</h3>
                                <p className="text-sm text-gray-500">Add teammates</p>
                            </button>

                            <button
                                onClick={() => navigate('/all-missions')}
                                className="bg-zinc-900 border border-red-900/30 hover:border-red-500 rounded-lg p-6 transition-all"
                            >
                                <div className="text-3xl mb-2">🎯</div>
                                <h3 className="font-bold text-white mb-1">Browse Missions</h3>
                                <p className="text-sm text-gray-500">Find new operations</p>
                            </button>

                            <button
                                onClick={() => navigate('/edit-team')}
                                className="bg-zinc-900 border border-red-900/30 hover:border-red-500 rounded-lg p-6 transition-all"
                            >
                                <div className="text-3xl mb-2">⚙️</div>
                                <h3 className="font-bold text-white mb-1">Edit Team</h3>
                                <p className="text-sm text-gray-500">Update details</p>
                            </button>
                        </div>
                    </div>
                )}

                {/* Missions Tab */}
                {activeTab === 'missions' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-red-500">Active Missions</h2>
                            <button
                                onClick={() => navigate('/all-missions')}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                            >
                                + Accept New Mission
                            </button>
                        </div>

                        {missions.length === 0 ? (
                            <div className="bg-zinc-900 border border-red-900/30 rounded-lg p-12 text-center">
                                <div className="text-6xl mb-4">🎯</div>
                                <h3 className="text-xl text-white mb-2">No Active Missions</h3>
                                <p className="text-gray-500 mb-6">Start by accepting a mission from the operations board</p>
                                <button
                                    onClick={() => navigate('/all-missions')}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded"
                                >
                                    Browse Missions
                                </button>
                            </div>
                        ) : (
                            missions.map((mission) => (
                                <div
                                    key={mission._id}
                                    className="bg-zinc-900 border border-red-900/30 rounded-lg p-6 hover:border-red-500 transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                {mission.task.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-4">
                                                {mission.task.description}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded text-xs font-semibold ${
                                            mission.status === 'In Progress' ? 'bg-yellow-900/30 text-yellow-400' :
                                            mission.status === 'Submitted' ? 'bg-blue-900/30 text-blue-400' :
                                            mission.status === 'Completed' ? 'bg-green-900/30 text-green-400' :
                                            'bg-gray-900/30 text-gray-400'
                                        }`}>
                                            {mission.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                        <div>
                                            <span className="text-gray-500">Deadline:</span>
                                            <span className="text-white ml-2">
                                                {new Date(mission.task.deadline).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Accepted:</span>
                                            <span className="text-white ml-2">
                                                {new Date(mission.acceptedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {mission.task.expectedSkills && mission.task.expectedSkills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {mission.task.expectedSkills.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs bg-red-900/20 text-red-400 px-2 py-1 rounded"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/mission/${mission._id}`)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                                        >
                                            View Details
                                        </button>
                                        {mission.status === 'In Progress' && (
                                            <button
                                                onClick={() => navigate(`/submit-mission/${mission._id}`)}
                                                className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded text-sm"
                                            >
                                                Submit Progress
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Members Tab */}
                {activeTab === 'members' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-red-500">
                                Team Members ({team.members.length})
                            </h2>
                            {team.members.length < 3 && (
                                <button
                                    onClick={handleInviteMember}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                                >
                                    + Invite Member
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {team.members.map((member) => (
                                <div
                                    key={member.user._id}
                                    className="bg-zinc-900 border border-red-900/30 rounded-lg p-6"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                            {member.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-white">{member.user.name}</h3>
                                                {member.role === 'Team Lead' && (
                                                    <span className="text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded">
                                                        Leader
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mb-3">{member.user.email}</p>

                                            {member.expertise && (
                                                <p className="text-sm text-gray-400 mb-2">
                                                    <span className="text-red-400">Expertise:</span> {member.expertise}
                                                </p>
                                            )}

                                            <div className="flex gap-2 mt-3">
                                                {member.github && (
                                                    <a
                                                        href={`https://github.com/${member.github}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-gray-300 px-3 py-1 rounded"
                                                    >
                                                        GitHub
                                                    </a>
                                                )}
                                                {member.linkedin && (
                                                    <a
                                                        href={member.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-gray-300 px-3 py-1 rounded"
                                                    >
                                                        LinkedIn
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageTeam;
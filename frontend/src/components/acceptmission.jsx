import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AcceptMission = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    
    const [task, setTask] = useState(null);
    const [team, setTeam] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTaskAndTeam();
    }, [taskId]);

    const fetchTaskAndTeam = async () => {
        try {
            // FIX 1: Removed /v1 prefix from task route
            const taskRes = await axios.get(`/api/task/single/${taskId}`, {
                withCredentials: true,
            });
            setTask(taskRes.data.task);

            // FIX 2: Removed /v1 prefix from team route
            const teamRes = await axios.get('/api/team/my-team', {
                withCredentials: true,
            });
            
            if (!teamRes.data.team) {
                alert('You need to create or join a team first!');
                navigate('/my-team');
                return;
            }

            setTeam(teamRes.data.team);
            
            // Initialize team members form
            const membersData = teamRes.data.team.members.map(member => ({
                userId: member.user._id,
                name: member.user.name,
                email: member.user.email,
                expertise: member.expertise || '',
                github: member.github || '',
                linkedin: member.linkedin || '',
            }));
            
            setTeamMembers(membersData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to load mission details');
            navigate('/all-missions');
        }
    };

    const handleMemberChange = (index, field, value) => {
        const updated = [...teamMembers];
        updated[index][field] = value;
        setTeamMembers(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate that all members have filled required fields
        const incomplete = teamMembers.some(
            member => !member.expertise.trim()
        );
        
        if (incomplete) {
            alert('Please fill in expertise for all team members');
            return;
        }

        setSubmitting(true);
        
        try {
            // FIX 3: Removed /v1 prefix from acceptance route
            const response = await axios.post(
                '/api/team/accept-mission',
                {
                    taskId,
                    teamMembers,
                },
                { withCredentials: true }
            );

            alert(response.data.message);
            navigate('/manage-team');
        } catch (error) {
            console.error('Error accepting mission:', error);
            alert(error.response?.data?.message || 'Failed to accept mission');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-red-500 text-2xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-red-500 mb-2"
                        style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}>
                        ACCEPT MISSION
                    </h1>
                    <p className="text-gray-400">
                        Configure your team before deployment
                    </p>
                </div>

                {/* Mission Details */}
                {task && (
                    <div className="bg-zinc-900 border border-red-900/30 rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">
                            {task.title}
                        </h2>
                        <p className="text-gray-300 mb-4">{task.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Deadline:</span>
                                <span className="text-white ml-2">
                                    {new Date(task.deadline).toLocaleDateString()}
                                </span>
                            </div>
                            
                            {task.expectedSkills && task.expectedSkills.length > 0 && (
                                <div>
                                    <span className="text-gray-500">Skills Required:</span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {task.expectedSkills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs bg-red-900/20 text-red-400 px-2 py-1 rounded"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Team Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-zinc-900 border border-red-900/30 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-bold text-red-500 mb-4">
                            TEAM: {team?.name}
                        </h3>
                        
                        <div className="space-y-6">
                            {teamMembers.map((member, index) => (
                                <div
                                    key={member.userId}
                                    className="bg-black/50 border border-red-900/20 rounded-lg p-4"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white">{member.name}</h4>
                                            <p className="text-xs text-gray-500">{member.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {/* Expertise */}
                                        <div>
                                            <label className="block text-sm text-red-400 mb-2">
                                                Expertise / Role *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Frontend Developer, UI/UX Designer"
                                                value={member.expertise}
                                                onChange={(e) => handleMemberChange(index, 'expertise', e.target.value)}
                                                className="w-full bg-zinc-800 border border-red-900/30 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                                                required
                                            />
                                        </div>

                                        {/* GitHub */}
                                        <div>
                                            <label className="block text-sm text-red-400 mb-2">
                                                GitHub Username
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="username"
                                                value={member.github}
                                                onChange={(e) => handleMemberChange(index, 'github', e.target.value)}
                                                className="w-full bg-zinc-800 border border-red-900/30 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                                            />
                                        </div>

                                        {/* LinkedIn */}
                                        <div>
                                            <label className="block text-sm text-red-400 mb-2">
                                                LinkedIn Profile URL
                                            </label>
                                            <input
                                                type="url"
                                                placeholder="https://linkedin.com/in/username"
                                                value={member.linkedin}
                                                onChange={(e) => handleMemberChange(index, 'linkedin', e.target.value)}
                                                className="w-full bg-zinc-800 border border-red-900/30 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/all-missions')}
                            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded transition-colors duration-300"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'DEPLOYING...' : 'ACCEPT & DEPLOY'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AcceptMission;
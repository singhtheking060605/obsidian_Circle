// frontend/src/pages/mentor/MentorSubmissionsList.jsx

import React, { useState, useEffect } from 'react';
import { authenticatedAxios } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MentorSubmissionsList = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                // Fetch the list of all assignments (submissions)
                // This uses the existing backend route: GET /api/task/assignments/all
                const response = await authenticatedAxios.get('/task/assignments/all');
                
                // Filter submissions that are 'Assigned' or 'Draft' and require review
                const submissionsToReview = response.data.assignments.filter(
                    assignment => assignment.status === 'Assigned' || assignment.status === 'Draft'
                );

                setAssignments(submissionsToReview);
            } catch (err) {
                console.error("Error fetching submissions:", err);
                setError(err.response?.data?.message || 'Failed to load submissions for review.');
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading submissions...</div>;
    if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Submissions Awaiting Review ({assignments.length})</h1>
            
            {assignments.length === 0 ? (
                <div className="p-6 text-center bg-gray-100 rounded-lg">
                    <p className="text-gray-600">No tasks currently awaiting review.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {assignments.map(assignment => (
                        <div 
                            key={assignment._id} 
                            className="p-4 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition duration-200 cursor-pointer"
                            onClick={() => navigate(`/admin/evaluate/${assignment.task._id}`)} // Navigate to your AdminEvaluate page
                        >
                            <h2 className="text-xl font-semibold text-blue-700">{assignment.task.title}</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Team: {assignment.team.name} | Status: {assignment.status}
                            </p>
                            <p className="text-xs text-gray-500">
                                Deadline: {new Date(assignment.task.deadline).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MentorSubmissionsList;
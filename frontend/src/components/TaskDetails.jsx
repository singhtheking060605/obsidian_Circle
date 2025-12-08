import React from 'react';

/**
 * Displays key task details, the submission content, and the current plagiarism status.
 * @param {object} props.task - The full task object.
 */
const TaskDetails = ({ task }) => {
    if (!task) {
        return <div className="text-gray-500">Loading task details...</div>;
    }
    
    // Safety checks for submission content
    const submissionContent = task.submission || 'No submission content provided for review.';
    const plagiarismStatus = task.plagiarismReport?.status || 'none';

    // Helper for status styling
    const getStatusClass = (status) => {
        switch (status) {
            case 'flagged': return 'bg-red-200 text-red-800';
            case 'safe': return 'bg-green-200 text-green-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <section className="mb-6 p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Task and Submission Overview</h2>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <p><strong>Task ID:</strong> {task._id}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <p>
                    <strong>Plagiarism Status:</strong> 
                    <span className={`inline-block px-3 py-1 ml-2 text-xs font-semibold rounded-full ${getStatusClass(plagiarismStatus)}`}>
                        {plagiarismStatus.toUpperCase()}
                    </span>
                </p>
                {/* Assuming student info is nested or linked */}
                <p><strong>Submitted by:</strong> {task.userName || 'Unknown Student'}</p> 
            </div>

            <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Submission Content</h3>
                <div className="p-4 bg-gray-50 border rounded-md h-64 overflow-y-auto whitespace-pre-wrap text-sm font-mono">
                    {submissionContent}
                </div>
                {submissionContent === 'No submission content provided for review.' && (
                    <p className="text-red-500 text-sm mt-1">
                        Cannot run AI Draft or Plagiarism check without submission content.
                    </p>
                )}
            </div>
        </section>
    );
};

export default TaskDetails;
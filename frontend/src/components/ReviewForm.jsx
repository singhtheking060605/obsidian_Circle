import React, { useState, useEffect } from 'react';
import { authenticatedAxios } from '../context/AuthContext.jsx'; // Use the configured client

/**
 * Mentor review form, managing state for scores and feedback.
 * @param {object} props.task - The task context.
 * @param {object} props.rubric - The rubric definition (criteria).
 * @param {object} props.initialReview - The current review state (may contain AI draft data).
 * @param {function} props.setReviewData - Setter function provided by AdminEvaluate to update review state.
 */
const ReviewForm = ({ task, rubric, initialReview, setReviewData }) => {
    // Local state to manage form inputs, initialized from initialReview
    const [formState, setFormState] = useState({
        scores: initialReview?.scores || {},
        feedback: initialReview?.feedback || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    // Update local form state when initialReview prop changes (e.g., when AI Draft is applied)
    useEffect(() => {
        setFormState({
            scores: initialReview?.scores || {},
            feedback: initialReview?.feedback || ''
        });
    }, [initialReview]);

    // Handle score changes in the rubric
    const handleScoreChange = (criterion, score) => {
        const newScores = { ...formState.scores, [criterion]: Number(score) };
        setFormState({ ...formState, scores: newScores });
        // Also update the parent state immediately for consistency (e.g., total score calculations)
        setReviewData(prev => ({ ...prev, scores: newScores }));
    };

    // Handle feedback text changes
    const handleFeedbackChange = (e) => {
        const newFeedback = e.target.value;
        setFormState({ ...formState, feedback: newFeedback });
        // Also update the parent state immediately
        setReviewData(prev => ({ ...prev, feedback: newFeedback }));
    };

    // Handle form submission (Final Mentor Action)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage('');

        if (Object.keys(formState.scores).length !== rubric.criteria.length) {
            setStatusMessage('Error: Please score all rubric criteria.');
            setIsSubmitting(false);
            return;
        }

        try {
            const reviewPayload = {
                taskId: task._id,
                // The reviewerId is set on the backend via req.user
                scores: formState.scores,
                feedback: formState.feedback,
                status: 'submitted' 
            };

            // Assuming a PUT route for submitting/updating a review
            const response = await authenticatedAxios.put(`/review/${initialReview?._id || 'new'}`, reviewPayload);

            setStatusMessage(`Review submitted successfully!`);
            setReviewData(response.data.review); // Update parent state with the final review object
            
        } catch (err) {
            console.error('Submission Error:', err);
            setStatusMessage(`Submission failed: ${err.response?.data?.message || err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
            
            {/* Rubric Scoring Section */}
            <h3 className="text-xl font-semibold mb-3">Rubric Criteria</h3>
            <div className="space-y-4 mb-6">
                {rubric?.criteria?.map((criterion, index) => (
                    <div key={index} className="border p-3 rounded-md">
                        <label className="block text-md font-medium text-gray-700 mb-2">
                            {criterion.name} (Max: {criterion.maxScore})
                        </label>
                        <p className="text-sm text-gray-500 mb-2">{criterion.description}</p>
                        
                        <input
                            type="number"
                            min="0"
                            max={criterion.maxScore}
                            value={formState.scores[criterion.name] || 0}
                            onChange={(e) => handleScoreChange(criterion.name, e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-lg"
                            required
                        />
                    </div>
                ))}
            </div>

            {/* Overall Feedback Section */}
            <div className="mb-6">
                <label htmlFor="feedback" className="block text-xl font-semibold text-gray-900 mb-2">
                    Overall Feedback
                </label>
                <textarea
                    id="feedback"
                    rows="8"
                    value={formState.feedback}
                    onChange={handleFeedbackChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 resize-y"
                    placeholder="Provide constructive feedback for the student..."
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition duration-200 disabled:opacity-50"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Final Review'}
            </button>
            
            {statusMessage && (
                <p className={`mt-3 text-center text-sm ${statusMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                    {statusMessage}
                </p>
            )}
        </form>
    );
};

export default ReviewForm;
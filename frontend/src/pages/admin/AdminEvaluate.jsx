// frontend/src/pages/admin/AdminEvaluate.jsx (FINAL INTEGRATED CODE)

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; 
import remarkGfm from 'remark-gfm'; 

import { useAuth, authenticatedAxios } from '../../context/AuthContext.jsx'; 
import TaskDetails from '../../components/TaskDetails.jsx'; 
import ReviewForm from '../../components/ReviewForm.jsx'; 

const AdminEvaluate = () => {
    const { taskId } = useParams();
    const { user } = useAuth();
    
    // Core data states
    const [taskData, setTaskData] = useState(null);
    const [rubricData, setRubricData] = useState(null); 
    const [reviewData, setReviewData] = useState(null); 
    
    // UI states 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDrafting, setIsDrafting] = useState(false); 
    const [isCheckingPlagiarism, setIsCheckingPlagiarism] = useState(false); 
    const [aiDraft, setAiDraft] = useState(null); 
    

    // --- Data Fetching Logic ---
    const fetchEvaluationData = async () => {
        setLoading(true);
        setError(null);
        if (!user || !user.id) {
            setLoading(false);
            return;
        }

        try {
            // 1. Fetch Task Data 
            const taskRes = await authenticatedAxios.get(`/task/${taskId}`);
            const task = taskRes.data.task;
            setTaskData(task);

            // 2. Fetch Rubric Data (Using Task ID to get rubric ID)
            if (task.rubric) {
                // Assuming task.rubric is the ID of the rubric document
                const rubricRes = await authenticatedAxios.get(`/rubric/${task.rubric}`); 
                setRubricData(rubricRes.data.rubric);
            }

            // 3. Fetch Existing Review Data (Assuming a route exists to fetch mentor's current review/draft)
            // NOTE: This endpoint may need to be implemented on the backend if it doesn't exist.
            const reviewRes = await authenticatedAxios.get(`/review/task/${taskId}/mentor/${user.id}`);
            const fetchedReview = reviewRes.data.review;
            setReviewData(fetchedReview);
            
            // Set initial AI Draft if it exists
            if (fetchedReview && fetchedReview.aiDraftGeneratedAt) {
                setAiDraft({
                    scores: fetchedReview.aiDraftScores,
                    feedback: fetchedReview.aiDraftFeedback,
                    generatedAt: fetchedReview.aiDraftGeneratedAt
                });
            }
            
        } catch (err) {
            console.error("Error fetching evaluation data:", err);
            // Handle expected 404 for missing review gracefully
            if (err.response?.status !== 404) {
                 setError(err.response?.data?.message || 'Failed to load evaluation data.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvaluationData();
    }, [taskId, user?.id]);


    // --- FEATURE 1 Handler (AI Review Draft) ---

    const handleGenerateAiDraft = async () => {
        setIsDrafting(true);
        setError(null);
        
        // Ensure submission content exists before calling AI
        if (!taskData?.submission || taskData.submission.trim() === '') {
            setError('Cannot run AI Draft: No submission content found.');
            setIsDrafting(false);
            return;
        }

        try {
            // BACKEND CALL: POST /api/rubric/task/:taskId/review/draft/ai
            const { data } = await authenticatedAxios.post(`/rubric/task/${taskId}/review/draft/ai`);
            
            setAiDraft(data.aiDraft);
            alert('AI draft generated successfully!');
            
        } catch (err) {
            console.error('Error generating AI draft:', err);
            setError(err.response?.data?.message || 'Failed to generate AI draft review.');
        } finally {
            setIsDrafting(false);
        }
    };
    
    const handleApplyDraft = () => {
        if (aiDraft) {
            // Apply draft scores/feedback to the actual mentor review form state (which is passed to ReviewForm)
            setReviewData(prev => ({
                ...prev,
                scores: aiDraft.scores,
                feedback: aiDraft.feedback,
            }));
            alert('AI draft applied to review form fields.');
        }
    };

    // --- FEATURE 2 Handler (Plagiarism Check) ---

    const handleRunPlagiarismCheck = async () => {
        setIsCheckingPlagiarism(true);
        setError(null);

        // Ensure submission content exists before calling AI
        if (!taskData?.submission || taskData.submission.trim() === '') {
            setError('Cannot run Plagiarism check: No submission content found.');
            setIsCheckingPlagiarism(false);
            return;
        }

        try {
            // BACKEND CALL: POST /api/task/admin/task/:taskId/check/plagiarism
            const { data } = await authenticatedAxios.post(`/task/admin/task/${taskId}/check/plagiarism`);
            
            // Update local taskData state with the new report
            setTaskData(prev => ({
                ...prev,
                plagiarismReport: data.report
            }));
            
            alert(data.message);
            
        } catch (err) {
            console.error('Error running plagiarism check:', err);
            setError(err.response?.data?.message || 'Failed to run plagiarism check.');
        } finally {
            setIsCheckingPlagiarism(false);
        }
    };
    
    // --- Render ---

    if (loading) return <div className="text-center mt-10">Loading evaluation data...</div>;
    if (error && !loading) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
    if (!taskData) return <div className="text-center mt-10">Task details not found.</div>;
    
    const plagiarismReport = taskData.plagiarismReport;
    const isFlagged = plagiarismReport?.status === 'flagged';

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Evaluate Task Submission</h1>

            <TaskDetails task={taskData} /> 

            {/* --- FEATURE 2: Plagiarism Check UI --- */}
            <section className="mt-6 p-4 border rounded-lg shadow-md bg-white">
                <h2 className="text-2xl font-semibold mb-3">Plagiarism & Similarity Check</h2>
                <div className="flex items-center space-x-4 mb-4">
                    <button
                        onClick={handleRunPlagiarismCheck}
                        disabled={isCheckingPlagiarism}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                        {isCheckingPlagiarism ? 'Checking Similarity...' : 'Run Plagiarism Check'}
                    </button>
                    {isCheckingPlagiarism && <span className="text-sm text-gray-500">Processing...</span>}
                </div>
                
                {plagiarismReport?.status !== 'none' && (
                    <div className={`p-4 rounded-md border-2 ${isFlagged ? 'bg-red-100 border-red-500' : 'bg-green-100 border-green-500'}`}>
                        <p className="font-semibold text-lg">
                            Status: <span className={isFlagged ? 'text-red-700' : 'text-green-700'}>
                                {plagiarismReport.status.toUpperCase()}
                            </span>
                        </p>
                        <p className="text-sm text-gray-700">Max Similarity Found: **{(plagiarismReport.maxSimilarity * 100).toFixed(2)}%**</p>
                        <p className="text-xs text-gray-500">Last Checked: {new Date(plagiarismReport.lastChecked).toLocaleString()}</p>
                        
                        {isFlagged && plagiarismReport.matchedSubmissions.length > 0 && (
                            <div className="mt-3">
                                <p className="font-medium text-red-600">Details of Matches:</p>
                                <ul className="list-disc list-inside ml-4 text-sm text-red-700">
                                    {plagiarismReport.matchedSubmissions.map((match, index) => (
                                        <li key={index} className="mt-1">
                                            {match.snippet}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </section>


            {/* --- FEATURE 1: AI Auto-Review Draft UI --- */}
            <section className="mt-6 p-4 border rounded-lg shadow-md bg-white">
                <h2 className="text-2xl font-semibold mb-3">AI Review Draft</h2>

                <button
                    onClick={handleGenerateAiDraft}
                    disabled={isDrafting}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                    {isDrafting ? 'Generating Draft...' : 'Generate AI Draft'}
                </button>
                
                {aiDraft && (
                    <div className="mt-4 p-4 border border-dashed border-blue-500 bg-blue-50 rounded-md">
                        <h3 className="text-lg font-bold mb-2">AI Draft Results</h3>
                        <p className="text-sm text-gray-600 mb-2">Generated at: {new Date(aiDraft.generatedAt).toLocaleString()}</p>
                        
                        {/* Display AI Scores */}
                        <div className="mb-3">
                            <p className="font-medium">Draft Scores:</p>
                            <ul className="list-disc list-inside ml-4 text-sm">
                                {/* Use Object.entries to safely iterate over the scores object */}
                                {Object.entries(aiDraft.scores || {}).map(([key, value]) => (
                                    <li key={key}>
                                        <strong>{key}:</strong> {value}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Display AI Feedback using ReactMarkdown */}
                        <p className="font-medium mt-2">Draft Feedback:</p>
                        <div className="prose max-w-none text-sm p-2 border rounded bg-white">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {aiDraft.feedback}
                            </ReactMarkdown>
                        </div>
                        
                        <button
                            onClick={handleApplyDraft}
                            className="mt-4 bg-green-500 hover:bg-green-700 text-white text-sm py-2 px-4 rounded transition duration-200"
                        >
                            Apply AI Draft to Review Form
                        </button>
                    </div>
                )}
            </section>

            {/* Final Mentor Review Form */}
            {rubricData && (
                 <section className="mt-6">
                    <h2 className="text-2xl font-semibold mb-3">Final Mentor Review</h2>
                    <ReviewForm 
                        task={taskData} 
                        rubric={rubricData} 
                        initialReview={reviewData} 
                        setReviewData={setReviewData} 
                    />
                </section>
            )}
           

        </div>
    );
};

export default AdminEvaluate;
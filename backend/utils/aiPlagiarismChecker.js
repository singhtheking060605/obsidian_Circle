// backend/utils/aiPlagiarismChecker.js (Fixed Imports)

import Task from '../models/TaskModel.js'; // CORRECT: Default import
import { findBestMatchSnippet } from './similarityService.js';
// Removed: import { getGeminiModel } from '../config/gemini.js'; // Commented out in original, leave commented
// ... rest of the file ...

const SIMILARITY_THRESHOLD = 0.7; // 70% threshold for flagging

/**
 * Runs a plagiarism and similarity check for a new submission.
 */
export const runPlagiarismCheck = async (taskId) => {
    const currentTask = await Task.findById(taskId); // Correct Task usage
    // ... rest of the function logic ...

    const currentSubmissionContent = currentTask.submission;
    
    const pastSubmissions = await Task.find({
        _id: { $ne: taskId }, 
        mission: currentTask.mission,
        status: { $in: ['submitted', 'completed'] } 
    }, 'submission name').lean();
    
    let maxSimilarity = 0;
    let matchedSubmissions = [];

    for (const pastSubmission of pastSubmissions) {
        if (!pastSubmission.submission) continue;

        const { score, snippet } = findBestMatchSnippet(
            currentSubmissionContent, 
            pastSubmission.submission
        );

        if (score > maxSimilarity) {
            maxSimilarity = score;
        }

        if (score >= SIMILARITY_THRESHOLD) {
            matchedSubmissions.push({
                taskId: pastSubmission._id,
                score: parseFloat(score.toFixed(4)),
                snippet: `Similarity ${score.toFixed(2)}% in submission: ${snippet}`
            });
        }
    }

    const finalStatus = maxSimilarity >= SIMILARITY_THRESHOLD ? 'flagged' : 'safe';
    
    const report = {
        status: finalStatus,
        maxSimilarity: parseFloat(maxSimilarity.toFixed(4)),
        matchedSubmissions: matchedSubmissions,
        lastChecked: Date.now()
    };

    currentTask.plagiarismReport = report;
    await currentTask.save();

    return report;
};
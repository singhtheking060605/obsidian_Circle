import Task from '../models/TaskModel.js';
import Rubric from '../models/RubricModel.js';
import Review from '../models/review.js';
import { User } from '../models/userModel.js';
import ErrorHandler from '../middlewares/error.js'; 
import { catchAsyncError } from '../middlewares/catchAsyncError.js'; 
import { draftReview } from '../utils/aiReviewService.js';

// --- Existing Controller Functions ---

export const getRubricDetails = catchAsyncError(async (req, res, next) => {
    // Logic to fetch a specific rubric
    const rubric = await Rubric.findById(req.params.id);
    if (!rubric) {
        return next(new ErrorHandler("Rubric not found", 404));
    }
    res.status(200).json({ success: true, rubric });
});

export const createRubric = catchAsyncError(async (req, res, next) => {
    // Logic to create a new rubric
    const rubric = await Rubric.create(req.body);
    res.status(201).json({ success: true, rubric });
});

export const updateRubric = catchAsyncError(async (req, res, next) => {
    // Placeholder logic for updating a rubric
    const rubric = await Rubric.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    if (!rubric) {
        return next(new ErrorHandler("Rubric not found", 404));
    }
    res.status(200).json({ success: true, rubric });
});

export const deleteRubric = catchAsyncError(async (req, res, next) => {
    // Placeholder logic for deleting a rubric
    const rubric = await Rubric.findById(req.params.id);
    if (!rubric) {
        return next(new ErrorHandler("Rubric not found", 404));
    }
    // Using deleteOne is the modern Mongoose practice
    await rubric.deleteOne(); 
    res.status(200).json({ success: true, message: "Rubric deleted successfully." });
});


// --- FEATURE 1: AI AUTO-REVIEW DRAFT ---

/**
 * Endpoint for a Mentor to trigger an AI review draft for a task submission.
 */
export const aiDraftReview = catchAsyncError(async (req, res, next) => {
    const { taskId } = req.params;
    // req.user.id is populated by your isAuthenticatedUser middleware
    const reviewerId = req.user.id; 

    // 1. Fetch Task and Rubric
    const task = await Task.findById(taskId);
    if (!task) {
        return next(new ErrorHandler("Task not found", 404));
    }

    // Assumes the Task Model has a 'mission' field for finding the Rubric
    const rubric = await Rubric.findOne({ mission: task.mission }); 
    
    // NOTE: Based on your TaskModel and RubricModel, it seems Task links to Rubric by ID,
    // not by a 'mission' field. I'm keeping the original logic but this might need review:
    // const rubric = await Rubric.findById(task.rubric); 

    if (!rubric) {
        return next(new ErrorHandler("Rubric not found for this mission", 404));
    }
    
    // Determine the name of the student for better AI context/feedback
    let userName = 'Student'; 
    try {
        if (task.userId) { 
            const user = await User.findById(task.userId);
            userName = user ? user.name : 'Student';
        } else if (task.name) {
            userName = task.name;
        }
    } catch (err) {
        console.warn(`Could not fetch user name for task ${taskId}: ${err.message}`);
    }

    // 2. Get the Submission Content and prepare payload for AI Service
    const submissionContent = task.submission || 'No submission content was provided in the task submission document.';
    
    // 3. Call AI Service (draftReview is imported from ../utils/aiReviewService)
    let aiDraft;
    try {
        aiDraft = await draftReview(
            submissionContent, 
            rubric.criteria, 
            userName
        );
    } catch (aiError) {
        return next(new ErrorHandler(`AI drafting failed: ${aiError.message}`, 500));
    }

    // 4. Update or Create Review Document with AI Draft
    let review = await Review.findOne({ taskId, reviewerId });

    if (!review) {
        review = await Review.create({
            taskId,
            reviewerId,
            status: 'draft',
            aiDraftScores: aiDraft.scores,
            aiDraftFeedback: aiDraft.feedback,
            aiDraftGeneratedAt: Date.now()
        });
    } else {
        // Update existing review document
        review.aiDraftScores = aiDraft.scores;
        review.aiDraftFeedback = aiDraft.feedback;
        review.aiDraftGeneratedAt = Date.now();
        await review.save({ validateBeforeSave: false }); 
    }

    res.status(200).json({
        success: true,
        message: 'AI draft review generated successfully.',
        aiDraft: { 
            scores: aiDraft.scores, 
            feedback: aiDraft.feedback, 
            generatedAt: review.aiDraftGeneratedAt 
        }
    });
});
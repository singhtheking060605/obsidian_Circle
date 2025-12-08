import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    // Core References 
    taskId: { type: mongoose.Schema.ObjectId, ref: 'Task', required: true },
    reviewerId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },

    // --- Final Mentor Review Fields (Existing) ---
    scores: { type: mongoose.Schema.Types.Mixed, default: null },
    feedback: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'draft', 'submitted', 're-review'], default: 'pending' },
    submittedAt: { type: Date, default: null },

    // --- AI Auto-Review Draft Fields (Feature 1) ---
    aiDraftScores: { type: mongoose.Schema.Types.Mixed, default: {} },
    aiDraftFeedback: { type: String, default: '' },
    aiDraftGeneratedAt: { type: Date, default: null },

    createdAt: { type: Date, default: Date.now },
});

reviewSchema.index({ taskId: 1, reviewerId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
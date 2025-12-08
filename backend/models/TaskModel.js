import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter a mission title"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please enter the mission briefing"],
    },
    // New: List of specific items to submit
    deliverables: [{
        type: String,
        trim: true
    }],
    // New: Skills required for the mission
    expectedSkills: [{
        type: String,
        trim: true
    }],
    deadline: {
        type: Date,
        required: [true, "Please set a deadline"],
    },
    rubric: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rubric",
        required: false
    },
    assignedTo: {
        type: String,
        default: 'All'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'archived', 'completed'],
        default: 'draft',
    },
    // FEATURE 1 & 2: Submission Content
    submission: {
        type: String, // PR Description or Report Content
        default: ''
    },

    // FEATURE 2: Plagiarism Check Report
    plagiarismReport: {
        status: {
            type: String,
            enum: ['none', 'pending', 'safe', 'flagged'],
            default: 'none'
        },
        maxSimilarity: {
            type: Number, // Highest similarity score found (0 to 1)
            default: 0
        },
        matchedSubmissions: [{ // Array of matches against internal data
            taskId: { type: mongoose.Schema.ObjectId, ref: 'Task' },
            score: Number, // Similarity score for this match
            snippet: String // Contextual snippet of the match
        }],
        lastChecked: {
            type: Date,
            default: null
        }
    },
    
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

export default Task; // Exporting the model using default
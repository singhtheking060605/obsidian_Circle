// These models manage Assign/Review Teams and Lightweight Contribution Analytics (from the first query).import mongoose from "mongoose";

const teamProgressSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  // Tracks the lifecycle of the mission
  status: {
    type: String,
    enum: ["Pending", "Assigned", "In Progress", "Submitted", "Graded"],
    default: "Assigned",
  },
  submissionLink: {
    type: String,
    trim: true,
  },
  // For grading later
  score: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String,
    default: ""
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Prevent assigning the same task to the same team twice
teamProgressSchema.index({ team: 1, task: 1 }, { unique: true });

export const TeamProgress = mongoose.model("TeamProgress", teamProgressSchema);
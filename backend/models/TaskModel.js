// backend/models/TaskModel.js
import mongoose from "mongoose";
// These models handle the Post Tasks & Rubrics and Task Moderation features.import mongoose from "mongoose";

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
  // New: Link to a specific grading rubric
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
  // ADDED: Mission status field to determine availability
  status: {
    type: String,
    enum: ['draft', 'active', 'archived', 'completed'],
    default: 'draft',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Task = mongoose.model("Task", taskSchema);
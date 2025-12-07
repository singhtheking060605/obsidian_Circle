import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter task title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter task description"],
  },
  deadline: {
    type: Date,
    required: [true, "Please select a deadline"],
  },
  assignedTo: {
    type: String, // Can be Team ID or 'All'
    required: false,
    default: 'All'
  },
  rubric_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rubric",
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Task = mongoose.model("Task", taskSchema);
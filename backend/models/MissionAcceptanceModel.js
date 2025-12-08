import mongoose from "mongoose";

const missionAcceptanceSchema = new mongoose.Schema({
  // Link to the Task model, which represents the mission document
  mission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task", 
    required: true,
  },
  // Link to the User model, representing the student who accepted
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  // Status to track if the mission is accepted/in-progress/submitted
  status: {
    type: String,
    enum: ["accepted", "in-progress", "submitted", "completed", "rejected"],
    default: "accepted",
  },
  acceptedAt: {
    type: Date,
    default: Date.now,
  },
});

// Enforce unique acceptance: one student can accept a mission only once
missionAcceptanceSchema.index({ mission: 1, student: 1 }, { unique: true });

export const MissionAcceptance = mongoose.model("MissionAcceptance", missionAcceptanceSchema);
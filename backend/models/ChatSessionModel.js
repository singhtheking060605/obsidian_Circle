import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null // Null until a mentor accepts
  },
  status: {
    type: String,
    enum: ["pending", "active", "closed"],
    default: "pending"
  },
  topic: {
    type: String,
    default: "General Inquiry"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const ChatSession = mongoose.model("ChatSession", chatSessionSchema);
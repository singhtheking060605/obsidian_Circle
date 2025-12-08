import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema({
  // The user who initiated the request
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  // The user receiving the request
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  // Optional: Context for the chat (if applicable)
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: false
  },
  status: {
    type: String,
    enum: ["pending", "active", "rejected", "closed"],
    default: "pending"
  },
  topic: {
    type: String,
    default: "General Discussion"
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
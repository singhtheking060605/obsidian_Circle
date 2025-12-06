import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a team name"],
    trim: true,
    unique: true,
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        default: "Member",
      },
    },
  ],
  repoLink: {
    type: String,
    trim: true,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  // Updated to store list of image URLs
  mediaLinks: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Team = mongoose.model("Team", teamSchema);
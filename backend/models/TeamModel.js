// import mongoose from "mongoose";

// const teamSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please enter a team name"],
//     trim: true,
//     unique: true,
//   },
//   leader: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   members: [
//     {
//       user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//       role: {
//         type: String,
//         default: "Member",
//       },
//     },
//   ],
//   repoLink: {
//     type: String,
//     trim: true,
//     default: "",
//   },
//   description: {
//     type: String,
//     default: "",
//   },
//   // Updated to store list of image URLs
//   mediaLinks: {
//     type: [String],
//     default: []
//   },

//   // Add this field to your existing Team schema
// invitations: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'TeamInvitation'
// },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export const Team = mongoose.model("Team", teamSchema);



import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      role: {
        type: String,
        enum: ["Team Lead", "Member"],
        default: "Member"
      },
      joinedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  repoLink: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  mediaLinks: [{
    type: String,
    trim: true
  }],
  invitations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeamInvitation"
  }],
  // ✅ NEW: Approval fields
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'not_submitted'],
    default: 'not_submitted'
  },
  approvalRequestedAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const Team = mongoose.model("Team", teamSchema);
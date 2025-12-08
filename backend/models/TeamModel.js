// // import mongoose from "mongoose";

// // const teamSchema = new mongoose.Schema({
// //   name: {
// //     type: String,
// //     required: [true, "Please enter a team name"],
// //     trim: true,
// //     unique: true,
// //   },
// //   leader: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "User",
// //     required: true,
// //   },
// //   members: [
// //     {
// //       user: {
// //         type: mongoose.Schema.Types.ObjectId,
// //         ref: "User",
// //       },
// //       role: {
// //         type: String,
// //         default: "Member",
// //       },
// //     },
// //   ],
// //   repoLink: {
// //     type: String,
// //     trim: true,
// //     default: "",
// //   },
// //   description: {
// //     type: String,
// //     default: "",
// //   },
// //   // Updated to store list of image URLs
// //   mediaLinks: {
// //     type: [String],
// //     default: []
// //   },

// //   // Add this field to your existing Team schema
// // invitations: {
// //   type: mongoose.Schema.Types.ObjectId,
// //   ref: 'TeamInvitation'
// // },
// //   createdAt: {
// //     type: Date,
// //     default: Date.now,
// //   },
// // });

// // export const Team = mongoose.model("Team", teamSchema);



// import mongoose from "mongoose";

// const teamSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   leader: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   members: [
//     {
//       user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//       },
//       role: {
//         type: String,
//         enum: ["Team Lead", "Member"],
//         default: "Member"
//       },
//       joinedAt: {
//         type: Date,
//         default: Date.now
//       }
//     }
//   ],
//   repoLink: {
//     type: String,
//     trim: true
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   mediaLinks: [{
//     type: String,
//     trim: true
//   }],
//   invitations: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "TeamInvitation"
//   }],
//   // ✅ NEW: Approval fields
//   approvalStatus: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected', 'not_submitted'],
//     default: 'not_submitted'
//   },
//   approvalRequestedAt: {
//     type: Date
//   },
//   approvedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },
//   approvedAt: {
//     type: Date
//   },
//   rejectionReason: {
//     type: String
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// export const Team = mongoose.model("Team", teamSchema);



// models/TeamModel.js - UPDATED VERSION

import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      unique: true,
      trim: true,
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
          required: true,
        },
        role: {
          type: String,
          default: "Member",
        },
        // NEW FIELDS for team member details
        expertise: {
          type: String,
          default: "",
        },
        github: {
          type: String,
          default: "",
        },
        linkedin: {
          type: String,
          default: "",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    repoLink: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    mediaLinks: [{
      type: String,
    }],
    approvalStatus: {
      type: String,
      enum: ['not_submitted', 'pending', 'approved', 'rejected'],
      default: 'not_submitted',
    },
    approvalRequestedAt: Date,
    approvedAt: Date,
    rejectionReason: String,
  },
  { timestamps: true }
);

export const Team = mongoose.model("Team", teamSchema);
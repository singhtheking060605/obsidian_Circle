// import mongoose from 'mongoose';

// // Mission Schema (Predefined missions/tasks)
// const missionSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   level: {
//     type: Number,
//     required: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   requirements: {
//     type: String
//   },
//   difficulty: {
//     type: String,
//     enum: ['Easy', 'Medium', 'Hard', 'Expert'],
//     default: 'Medium'
//   },
//   points: {
//     type: Number,
//     default: 100
//   },
//   deadline: {
//     type: Number, // Days to complete
//     default: 7
//   },
//   minTeamSize: {
//     type: Number,
//     default: 1
//   },
//   maxTeamSize: {
//     type: Number,
//     default: 5
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Team Mission Schema (When a team accepts a mission)
// const teamMissionSchema = new mongoose.Schema({
//   mission: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Mission',
//     required: true
//   },
//   teamLeader: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   teamName: {
//     type: String,
//     default: 'Unnamed Team'
//   },
//   githubRepo: {
//     type: String,
//     trim: true
//   },
//   members: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     email: {
//       type: String
//     },
//     status: {
//       type: String,
//       enum: ['Pending', 'Accepted', 'Rejected'],
//       default: 'Pending'
//     },
//     invitedAt: {
//       type: Date,
//       default: Date.now
//     },
//     respondedAt: {
//       type: Date
//     }
//   }],
//   status: {
//     type: String,
//     enum: ['Pending', 'Active', 'Submitted', 'Completed', 'Failed'],
//     default: 'Pending'
//   },
//   // Pending = waiting for all members to accept
//   // Active = all accepted, working on it
//   // Submitted = submitted for review
//   // Completed = approved by admin
//   // Failed = missed deadline or rejected
  
//   submissionUrl: {
//     type: String
//   },
//   submissionDescription: {
//     type: String
//   },
//   media: [{
//     type: String // URLs to screenshots/videos
//   }],
//   score: {
//     type: Number,
//     default: 0
//   },
//   feedback: {
//     type: String
//   },
//   acceptedAt: {
//     type: Date
//   },
//   deadline: {
//     type: Date
//   },
//   submittedAt: {
//     type: Date
//   },
//   completedAt: {
//     type: Date
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Check if all members accepted
// teamMissionSchema.methods.checkAllAccepted = function() {
//   const allAccepted = this.members.every(m => m.status === 'Accepted');
//   if (allAccepted && this.status === 'Pending') {
//     this.status = 'Active';
//     this.acceptedAt = Date.now();
//     // Set deadline based on mission
//     return true;
//   }
//   return false;
// };

// // Check if any member rejected
// teamMissionSchema.methods.checkAnyRejected = function() {
//   return this.members.some(m => m.status === 'Rejected');
// };

// const Mission = mongoose.models.Mission || mongoose.model('Mission', missionSchema);
// const TeamMission = mongoose.models.TeamMission || mongoose.model('TeamMission', teamMissionSchema);

// export { Mission, TeamMission };
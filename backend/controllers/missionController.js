// import { Mission, TeamMission } from '../models/missionModel.js';
// import { User } from '../models/userModel.js';
// import { sendEmail } from '../utils/sendEmail.js';
// import { catchAsyncError } from '../middlewares/catchAsyncError.js';
// import ErrorHandler from '../middlewares/error.js';

// // Get all available missions
// export const getAllMissions = catchAsyncError(async (req, res, next) => {
//   const missions = await Mission.find({ isActive: true }).sort({ level: 1 });
  
//   res.status(200).json({
//     success: true,
//     missions
//   });
// });

// // Accept a mission and invite team members
// export const acceptMission = catchAsyncError(async (req, res, next) => {
//   const { missionId, teamName, githubRepo, memberEmails } = req.body;
//   const teamLeader = req.user._id;

//   if (!missionId || !memberEmails || memberEmails.length === 0) {
//     return next(new ErrorHandler('Please provide mission ID and team members', 400));
//   }

//   // Find the mission
//   const mission = await Mission.findById(missionId);
//   if (!mission) {
//     return next(new ErrorHandler('Mission not found', 404));
//   }

//   // Validate team size
//   const totalMembers = memberEmails.length + 1; // +1 for team leader
//   if (totalMembers < mission.minTeamSize || totalMembers > mission.maxTeamSize) {
//     return next(new ErrorHandler(
//       `Team size must be between ${mission.minTeamSize} and ${mission.maxTeamSize}`,
//       400
//     ));
//   }

//   // Check if leader already accepted this mission
//   const existingTeamMission = await TeamMission.findOne({
//     mission: missionId,
//     teamLeader: teamLeader,
//     status: { $in: ['Pending', 'Active', 'Submitted'] }
//   });

//   if (existingTeamMission) {
//     return next(new ErrorHandler('You have already accepted this mission', 400));
//   }

//   // Prepare members array
//   const members = memberEmails.map(email => ({
//     email: email.toLowerCase().trim(),
//     status: 'Pending'
//   }));

//   // Create team mission
//   const teamMission = await TeamMission.create({
//     mission: missionId,
//     teamLeader,
//     teamName: teamName || `Team ${mission.title}`,
//     githubRepo,
//     members,
//     status: 'Pending',
//     deadline: new Date(Date.now() + mission.deadline * 24 * 60 * 60 * 1000)
//   });

//   // Populate mission and leader details
//   await teamMission.populate('mission');
//   await teamMission.populate('teamLeader', 'name email');

//   // Send invitation emails
//   const invitationPromises = members.map(async (member) => {
//     const invitationLink = `${process.env.FRONTEND_URL}/invitation/${teamMission._id}/${member.email}`;
    
//     const emailContent = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; color: #ffffff; border-radius: 10px;">
//         <h1 style="color: #ef4444; text-align: center; text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);">
//           The Obsidian Circle
//         </h1>
        
//         <h2 style="color: #ffffff; margin-top: 30px;">Mission Invitation!</h2>
        
//         <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6;">
//           <strong>${teamMission.teamLeader.name}</strong> has invited you to join their team for a new mission:
//         </p>
        
//         <div style="background-color: #2a2a2a; padding: 20px; border-left: 4px solid #ef4444; margin: 20px 0;">
//           <h3 style="color: #ef4444; margin: 0 0 10px 0;">${teamMission.mission.title}</h3>
//           <p style="color: #9ca3af; margin: 0;">${teamMission.mission.description}</p>
//           <p style="color: #9ca3af; margin-top: 10px; font-size: 14px;">
//             <strong>Level:</strong> ${teamMission.mission.level} | 
//             <strong>Difficulty:</strong> ${teamMission.mission.difficulty}
//           </p>
//         </div>
        
//         <div style="background-color: #2a2a2a; padding: 15px; border-radius: 8px; margin: 20px 0;">
//           <p style="color: #9ca3af; margin: 0; font-size: 14px;">
//             <strong>Team:</strong> ${teamMission.teamName}<br>
//             <strong>Team Leader:</strong> ${teamMission.teamLeader.name}<br>
//             ${githubRepo ? `<strong>GitHub Repo:</strong> ${githubRepo}<br>` : ''}
//             <strong>Deadline:</strong> ${new Date(teamMission.deadline).toLocaleDateString()}
//           </p>
//         </div>
        
//         <div style="text-align: center; margin: 30px 0;">
//           <a href="${invitationLink}" 
//              style="display: inline-block; padding: 15px 40px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);">
//             ACCEPT MISSION
//           </a>
//         </div>
        
//         <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 20px;">
//           Click the button above to review and accept the invitation.<br>
//           This invitation will expire once the mission starts or is canceled.
//         </p>
        
//         <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151; text-align: center;">
//           <p style="color: #6b7280; font-size: 12px; margin: 0;">
//             The Obsidian Circle - Where darkness meets code<br>
//             This is an automated message. Please do not reply.
//           </p>
//         </div>
//       </div>
//     `;

//     return sendEmail({
//       email: member.email,
//       subject: `Mission Invitation: ${teamMission.mission.title}`,
//       message: emailContent
//     });
//   });

//   try {
//     await Promise.all(invitationPromises);
//   } catch (error) {
//     console.error('Error sending invitations:', error);
//     // Don't fail the whole operation if emails fail
//   }

//   res.status(201).json({
//     success: true,
//     message: 'Mission accepted! Invitations sent to team members.',
//     teamMission
//   });
// });

// // Get invitation details (for the invitation page)
// export const getInvitation = catchAsyncError(async (req, res, next) => {
//   const { teamMissionId, email } = req.params;

//   const teamMission = await TeamMission.findById(teamMissionId)
//     .populate('mission')
//     .populate('teamLeader', 'name email');

//   if (!teamMission) {
//     return next(new ErrorHandler('Invitation not found', 404));
//   }

//   // Find member in the team
//   const member = teamMission.members.find(m => m.email === email.toLowerCase());
//   if (!member) {
//     return next(new ErrorHandler('You are not invited to this mission', 403));
//   }

//   if (member.status !== 'Pending') {
//     return next(new ErrorHandler(`You have already ${member.status.toLowerCase()} this invitation`, 400));
//   }

//   // Check if mission is still pending
//   if (teamMission.status !== 'Pending') {
//     return next(new ErrorHandler('This mission has already started', 400));
//   }

//   res.status(200).json({
//     success: true,
//     teamMission,
//     memberEmail: email
//   });
// });

// // Accept or reject invitation
// export const respondToInvitation = catchAsyncError(async (req, res, next) => {
//   const { teamMissionId, email, response } = req.body; // response: 'accept' or 'reject'

//   if (!['accept', 'reject'].includes(response)) {
//     return next(new ErrorHandler('Invalid response', 400));
//   }

//   const teamMission = await TeamMission.findById(teamMissionId)
//     .populate('mission')
//     .populate('teamLeader', 'name email');

//   if (!teamMission) {
//     return next(new ErrorHandler('Invitation not found', 404));
//   }

//   // Find member
//   const memberIndex = teamMission.members.findIndex(m => m.email === email.toLowerCase());
//   if (memberIndex === -1) {
//     return next(new ErrorHandler('You are not invited to this mission', 403));
//   }

//   const member = teamMission.members[memberIndex];
//   if (member.status !== 'Pending') {
//     return next(new ErrorHandler(`You have already ${member.status.toLowerCase()} this invitation`, 400));
//   }

//   // Update member status
//   teamMission.members[memberIndex].status = response === 'accept' ? 'Accepted' : 'Rejected';
//   teamMission.members[memberIndex].respondedAt = Date.now();

//   // If user is logged in, link their user ID
//   if (req.user) {
//     teamMission.members[memberIndex].user = req.user._id;
//   }

//   await teamMission.save();

//   // Check if anyone rejected - cancel mission
//   if (teamMission.checkAnyRejected()) {
//     teamMission.status = 'Failed';
//     await teamMission.save();

//     // Notify team leader
//     await sendEmail({
//       email: teamMission.teamLeader.email,
//       subject: `Mission Cancelled: ${teamMission.mission.title}`,
//       message: `Unfortunately, ${email} has rejected the invitation. The mission has been cancelled.`
//     });

//     return res.status(200).json({
//       success: true,
//       message: 'Invitation rejected. Mission cancelled.',
//       status: 'rejected'
//     });
//   }

//   // Check if all accepted - activate mission
//   if (teamMission.checkAllAccepted()) {
//     await teamMission.save();

//     // Notify all team members
//     const allEmails = [teamMission.teamLeader.email, ...teamMission.members.map(m => m.email)];
    
//     await Promise.all(allEmails.map(email => 
//       sendEmail({
//         email,
//         subject: `Mission Active: ${teamMission.mission.title}`,
//         message: `All team members have accepted! The mission is now active. Good luck!`
//       })
//     ));

//     return res.status(200).json({
//       success: true,
//       message: 'All members accepted! Mission is now active.',
//       status: 'active',
//       teamMission
//     });
//   }

//   res.status(200).json({
//     success: true,
//     message: response === 'accept' ? 'Invitation accepted! Waiting for other members.' : 'Invitation rejected.',
//     status: response === 'accept' ? 'accepted' : 'rejected'
//   });
// });

// // Get user's team missions
// export const getMyTeamMissions = catchAsyncError(async (req, res, next) => {
//   const userId = req.user._id;
//   const userEmail = req.user.email;

//   // Find missions where user is leader OR member
//   const teamMissions = await TeamMission.find({
//     $or: [
//       { teamLeader: userId },
//       { 'members.user': userId },
//       { 'members.email': userEmail }
//     ],
//     status: { $in: ['Pending', 'Active', 'Submitted'] }
//   })
//     .populate('mission')
//     .populate('teamLeader', 'name email')
//     .populate('members.user', 'name email')
//     .sort({ createdAt: -1 });

//   res.status(200).json({
//     success: true,
//     teamMissions
//   });
// });

// // Get all assigned tasks (where user is a member and mission is active)
// export const getAssignedTasks = catchAsyncError(async (req, res, next) => {
//   const userId = req.user._id;
//   const userEmail = req.user.email;

//   const assignedMissions = await TeamMission.find({
//     $or: [
//       { 'members.user': userId },
//       { 'members.email': userEmail }
//     ],
//     status: 'Active'
//   })
//     .populate('mission')
//     .populate('teamLeader', 'name email')
//     .sort({ deadline: 1 });

//   res.status(200).json({
//     success: true,
//     assignedMissions
//   });
// });
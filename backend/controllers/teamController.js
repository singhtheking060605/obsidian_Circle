// // controllers/teamController.js - COMPLETE VERSION

// import { Team } from "../models/TeamModel.js";
// import { Task } from "../models/TaskModel.js";
// import { TeamProgress } from "../models/TeamProgressModel.js";
// import ErrorHandler from "../middlewares/error.js";
// import { catchAsyncError } from "../middlewares/catchAsyncError.js";
// import main from "../config/gemini.js"; 
// import { sendEmail } from "../utils/sendEmail.js";

// // ============= APPROVAL FUNCTIONS =============

// export const requestApproval = catchAsyncError(async (req, res, next) => {
//   const userId = req.user._id;

//   const team = await Team.findOne({
//     $or: [
//       { leader: userId },
//       {
//         'members': {
//           $elemMatch: {
//             user: userId,
//             role: 'Team Lead'
//           }
//         }
//       }
//     ]
//   }).populate('members.user', 'name email');

//   if (!team) {
//     return next(new ErrorHandler("Only team leaders can request approval", 403));
//   }

//   if (team.members.length < 2) {
//     return next(new ErrorHandler("Team must have at least 2 members", 400));
//   }

//   if (team.members.length > 3) {
//     return next(new ErrorHandler("Team cannot have more than 3 members", 400));
//   }

//   if (team.approvalStatus === 'pending') {
//     return next(new ErrorHandler("Approval request already submitted", 400));
//   }

//   if (team.approvalStatus === 'approved') {
//     return next(new ErrorHandler("Team is already approved", 400));
//   }

//   team.approvalStatus = 'pending';
//   team.approvalRequestedAt = new Date();
//   await team.save();

//   const adminEmail = process.env.ADMIN_EMAIL || 'admin@obsidiancircle.com';
  
//   const membersList = team.members.map(m => 
//     `<li style="color: #e5e5e5;">${m.user.name} (${m.user.email})</li>`
//   ).join('');

//   const emailTemplate = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; border: 2px solid #ef4444; border-radius: 12px;">
//       <h1 style="color: #ef4444;">New Team Approval Request</h1>
//       <h2>Team: ${team.name}</h2>
//       <ul>${membersList}</ul>
//     </div>
//   `;

//   try {
//     await sendEmail({
//       email: adminEmail,
//       subject: `New Team Approval Request: ${team.name}`,
//       message: emailTemplate
//     });
//   } catch (error) {
//     console.error('Failed to send admin email:', error);
//   }

//   res.status(200).json({
//     success: true,
//     message: 'Approval request submitted successfully!',
//     team: {
//       id: team._id,
//       name: team.name,
//       approvalStatus: team.approvalStatus,
//       approvalRequestedAt: team.approvalRequestedAt
//     }
//   });
// });

// export const getApprovalStatus = catchAsyncError(async (req, res, next) => {
//   const userId = req.user._id;

//   const team = await Team.findOne({
//     $or: [
//       { leader: userId },
//       { "members.user": userId }
//     ]
//   }).select('name approvalStatus approvalRequestedAt approvedAt rejectionReason');

//   if (!team) {
//     return next(new ErrorHandler("Team not found", 404));
//   }

//   res.status(200).json({
//     success: true,
//     approval: {
//       status: team.approvalStatus,
//       requestedAt: team.approvalRequestedAt,
//       approvedAt: team.approvedAt,
//       rejectionReason: team.rejectionReason
//     }
//   });
// });

// export const cancelApprovalRequest = catchAsyncError(async (req, res, next) => {
//   const userId = req.user._id;

//   const team = await Team.findOne({
//     $or: [
//       { leader: userId },
//       {
//         'members': {
//           $elemMatch: {
//             user: userId,
//             role: 'Team Lead'
//           }
//         }
//       }
//     ]
//   });

//   if (!team) {
//     return next(new ErrorHandler("Only team leaders can cancel approval requests", 403));
//   }

//   if (team.approvalStatus !== 'pending') {
//     return next(new ErrorHandler("No pending approval request to cancel", 400));
//   }

//   team.approvalStatus = 'not_submitted';
//   team.approvalRequestedAt = undefined;
//   await team.save();

//   res.status(200).json({
//     success: true,
//     message: 'Approval request cancelled'
//   });
// });

// // ============= AI CONTENT GENERATION =============

// export const generateContent = async (req, res) => {
//     try {
//         const { prompt, length } = req.body; 
        
//         if (!prompt) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: "A topic/title is required to generate content." 
//             });
//         }

//         const content = await main(prompt, length);
        
//         res.json({ success: true, content });

//     } catch (error) {
//         console.error("Gemini content generation failed:", error);
        
//         if (error.message && (error.message.includes("quota") || error.message.includes("429"))) {
//             return res.status(429).json({ 
//                 success: false, 
//                 message: "API quota exceeded. You have reached your daily or rate limit." 
//             });
//         }
//         res.status(500).json({ 
//             success: false, 
//             message: error.message || "Failed to generate content." 
//         });
//     }
// };

// // ============= TEAM MANAGEMENT =============

// export const getMyTeam = catchAsyncError(async (req, res, next) => {
//     const team = await Team.findOne({
//         $or: [{ leader: req.user._id }, { "members.user": req.user._id }],
//     })
//         .populate("leader", "name email avatar")
//         .populate("members.user", "name email avatar");

//     res.status(200).json({ success: true, team });
// });

// export const createTeam = catchAsyncError(async (req, res, next) => {
//     const { name, repoLink, description } = req.body;

//     const existingTeam = await Team.findOne({
//         $or: [{ leader: req.user._id }, { "members.user": req.user._id }],
//     });
//     if (existingTeam) return next(new ErrorHandler("You are already part of a team", 400));
    
//     const nameTaken = await Team.findOne({ name });
//     if (nameTaken) return next(new ErrorHandler("Team name taken", 400));

//     const team = await Team.create({
//         name,
//         repoLink,
//         description,
//         leader: req.user._id,
//         members: [{ user: req.user._id, role: "Team Lead" }], 
//     });

//     res.status(201).json({ success: true, message: "Team created", team });
// });

// export const joinTeam = catchAsyncError(async (req, res, next) => {
//     const { teamName } = req.body;
//     if (!teamName) return next(new ErrorHandler("Provide a team name", 400));

//     const userInTeam = await Team.findOne({
//         $or: [{ leader: req.user._id }, { "members.user": req.user._id }]
//     });
//     if (userInTeam) return next(new ErrorHandler("You are already in a team", 400));

//     const team = await Team.findOne({ name: teamName });
//     if (!team) return next(new ErrorHandler("Team not found", 404));

//     team.members.push({ user: req.user._id, role: "Member" });
//     await team.save();
//     await team.populate("leader members.user", "name email avatar");

//     res.status(200).json({ success: true, message: "Joined team", team });
// });

// export const updateTeam = catchAsyncError(async (req, res, next) => {
//     const { repoLink, description, mediaLink } = req.body;

//     const existingTeam = await Team.findOne({ leader: req.user._id });
//     if (!existingTeam) return next(new ErrorHandler("Not authorized or team not found", 404));

//     const updateFields = {};
    
//     if (description !== undefined) { 
//         updateFields.description = description; 
//     }
    
//     if (repoLink !== undefined) {
//         updateFields.repoLink = repoLink;
//     }

//     let updatedTeam = await Team.findByIdAndUpdate(
//         existingTeam._id,
//         { 
//             $set: updateFields, 
//             ...(mediaLink && { $push: { mediaLinks: mediaLink } }) 
//         },
//         { 
//             new: true,
//             runValidators: true 
//         }
//     )
//         .populate("leader", "name email avatar")
//         .populate("members.user", "name email avatar");

//     if (!updatedTeam) {
//         return next(new ErrorHandler("Team update failed on the server side.", 500));
//     }
    
//     res.status(200).json({ success: true, message: "Updated", team: updatedTeam });
// });

// export const getAllTeams = catchAsyncError(async (req, res, next) => {
//     const teams = await Team.find()
//         .populate("leader", "name email")
//         .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, teams });
// });

// // ============= NEW MISSION FUNCTIONS =============

// export const getAvailableTasks = catchAsyncError(async (req, res, next) => {
//   const userId = req.user._id;

//   const allTasks = await Task.find()
//     .populate('rubric', 'title')
//     .sort({ deadline: 1, createdAt: -1 });

//   const team = await Team.findOne({
//     $or: [{ leader: userId }, { "members.user": userId }],
//   });

//   if (!team) {
//     return res.status(200).json({
//       success: true,
//       tasks: allTasks,
//       hasTeam: false,
//     });
//   }

//   const acceptedTasks = await TeamProgress.find({ team: team._id }).select('task');
//   const acceptedTaskIds = acceptedTasks.map(tp => tp.task.toString());

//   const availableTasks = allTasks.filter(
//     task => !acceptedTaskIds.includes(task._id.toString())
//   );

//   res.status(200).json({
//     success: true,
//     tasks: availableTasks,
//     hasTeam: true,
//     teamId: team._id,
//   });
// });

// export const acceptMission = catchAsyncError(async (req, res, next) => {
//   const { taskId, teamMembers } = req.body;
//   const userId = req.user._id;

//   if (!taskId) {
//     return next(new ErrorHandler("Task ID is required", 400));
//   }

//   if (!teamMembers || !Array.isArray(teamMembers) || teamMembers.length === 0) {
//     return next(new ErrorHandler("Team members information is required", 400));
//   }

//   const task = await Task.findById(taskId);
//   if (!task) {
//     return next(new ErrorHandler("Task not found", 404));
//   }

//   let team = await Team.findOne({
//     $or: [{ leader: userId }, { "members.user": userId }],
//   });

//   if (!team) {
//     return next(new ErrorHandler("You must create or join a team first", 400));
//   }

//   const isLeader = team.leader.toString() === userId.toString() || 
//     team.members.some(m => m.user.toString() === userId.toString() && m.role === "Team Lead");
  
//   if (!isLeader) {
//     return next(new ErrorHandler("Only team leaders can accept missions", 403));
//   }

//   const existingProgress = await TeamProgress.findOne({ 
//     team: team._id, 
//     task: taskId 
//   });

//   if (existingProgress) {
//     return next(new ErrorHandler("Your team has already accepted this mission", 400));
//   }

//   for (const memberInfo of teamMembers) {
//     const memberIndex = team.members.findIndex(
//       m => m.user.toString() === memberInfo.userId
//     );
    
//     if (memberIndex !== -1) {
//       team.members[memberIndex].expertise = memberInfo.expertise;
//       team.members[memberIndex].github = memberInfo.github;
//       team.members[memberIndex].linkedin = memberInfo.linkedin;
//     }
//   }

//   await team.save();

//   const teamProgress = await TeamProgress.create({
//     team: team._id,
//     task: taskId,
//     status: 'In Progress',
//     acceptedAt: new Date(),
//   });

//   await teamProgress.populate([
//     { path: 'team', populate: { path: 'leader members.user', select: 'name email avatar' } },
//     { path: 'task', select: 'title description deadline deliverables expectedSkills' }
//   ]);

//   res.status(201).json({
//     success: true,
//     message: "Mission accepted successfully!",
//     teamProgress,
//   });
// });

// export const getMyTeamMissions = catchAsyncError(async (req, res, next) => {
//   const userId = req.user._id;

//   const team = await Team.findOne({
//     $or: [{ leader: userId }, { "members.user": userId }],
//   });

//   if (!team) {
//     return res.status(200).json({
//       success: true,
//       missions: [],
//       message: "You are not part of any team yet"
//     });
//   }

//   const missions = await TeamProgress.find({ team: team._id })
//     .populate({
//       path: 'task',
//       select: 'title description deadline deliverables expectedSkills rubric'
//     })
//     .populate({
//       path: 'team',
//       select: 'name leader members',
//       populate: { path: 'leader members.user', select: 'name email avatar' }
//     })
//     .sort({ acceptedAt: -1 });

//   res.status(200).json({
//     success: true,
//     missions,
//     team: {
//       id: team._id,
//       name: team.name,
//       memberCount: team.members.length
//     }
//   });
// });

// export const updateTeamMember = catchAsyncError(async (req, res, next) => {
//   const { memberId, expertise, github, linkedin } = req.body;
//   const userId = req.user._id;

//   const team = await Team.findOne({ leader: userId });
  
//   if (!team) {
//     return next(new ErrorHandler("Only team leaders can update member details", 403));
//   }

//   const memberIndex = team.members.findIndex(
//     m => m.user.toString() === memberId
//   );

//   if (memberIndex === -1) {
//     return next(new ErrorHandler("Member not found in your team", 404));
//   }

//   if (expertise !== undefined) team.members[memberIndex].expertise = expertise;
//   if (github !== undefined) team.members[memberIndex].github = github;
//   if (linkedin !== undefined) team.members[memberIndex].linkedin = linkedin;

//   await team.save();
//   await team.populate("leader members.user", "name email avatar");

//   res.status(200).json({
//     success: true,
//     message: "Member details updated",
//     team,
//   });
// });

// export const submitMissionProgress = catchAsyncError(async (req, res, next) => {
//   const { missionId, submissionLink, notes } = req.body;
//   const userId = req.user._id;

//   const team = await Team.findOne({
//     $or: [{ leader: userId }, { "members.user": userId }],
//   });

//   if (!team) {
//     return next(new ErrorHandler("Team not found", 404));
//   }

//   const mission = await TeamProgress.findOne({
//     _id: missionId,
//     team: team._id,
//   });

//   if (!mission) {
//     return next(new ErrorHandler("Mission not found or not assigned to your team", 404));
//   }

//   mission.submissionLink = submissionLink;
//   mission.submissionNotes = notes;
//   mission.status = 'Submitted';
//   mission.submittedAt = new Date();

//   await mission.save();
//   await mission.populate('task team');

//   res.status(200).json({
//     success: true,
//     message: "Progress submitted successfully",
//     mission,
//   });
// });


import { Team } from "../models/TeamModel.js"; 
import { User } from "../models/userModel.js"; // CRITICAL FIX: Use exact casing of the imported file name ('userModel.js')
import  Task  from "../models/TaskModel.js"; // CRITICAL: Ensure Task model is correctly imported
import { TeamProgress } from "../models/TeamProgressModel.js"; 
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
// import main from "../config/gemini.js"; 
// import { sendEmail } from "../utils/sendEmail.js"; 

// =========================================================
// TEAM CRUD OPERATIONS
// =========================================================

// @desc    Get current user's team details
// @route   GET /api/team/me
// @access  Private
export const getMyTeam = catchAsyncError(async (req, res, next) => {
    // FIX: Standardized user ID access
    const userId = req.user.id; 
    
    const team = await Team.findOne({ 'members.user': userId })
        .populate('members.user', 'name email'); 

    if (!team) {
        return res.status(200).json({
            success: true,
            team: null,
            message: "User is not currently in a team."
        });
    }
    team.currentUserId = userId; 

    res.status(200).json({
        success: true,
        team: team,
    });
});

// @desc    Create a new team (The user becomes the leader)
// @route   POST /api/team/create
// @access  Private
export const createTeam = catchAsyncError(async (req, res, next) => {
    const { name, repoLink, description } = req.body;

    const existingTeam = await Team.findOne({ 'members.user': req.user.id });
    if (existingTeam) {
        return next(new ErrorHandler("You are already a member of a team.", 400));
    }

    const team = await Team.create({
        name,
        leader: req.user.id,
        members: [{ user: req.user.id, role: 'Team Lead' }],
        repoLink,
        description,
    });

    res.status(201).json({
        success: true,
        message: "Team assembled successfully!",
        team,
    });
});

// @desc    User joins an existing team by name
// @route   PUT /api/team/join
// @access  Private
export const joinTeam = catchAsyncError(async (req, res, next) => {
    const { teamName } = req.body;

    const existingTeam = await Team.findOne({ 'members.user': req.user.id });
    if (existingTeam) {
        return next(new ErrorHandler("You are already a member of a team.", 400));
    }

    const team = await Team.findOne({ name: teamName });
    if (!team) {
        return next(new ErrorHandler("Team not found with that name.", 404));
    }

    if (team.members.length >= 3) {
        return next(new ErrorHandler("This team is already full (Max 3 members).", 400));
    }

    team.members.push({ user: req.user.id, role: 'Member' });
    await team.save();

    res.status(200).json({
        success: true,
        message: `Successfully joined team ${team.name}!`,
        team,
    });
});

// @desc    Update team metadata (repoLink, description, mediaLinks)
// @route   PUT /api/team/update
// @access  Private (Team Leader or Member)
export const updateTeam = catchAsyncError(async (req, res, next) => {
    const team = await Team.findOne({ 'members.user': req.user.id });

    if (!team) {
        return next(new ErrorHandler("You must be part of a team to update details.", 403));
    }

    const updatedTeam = await Team.findByIdAndUpdate(team._id, req.body, {
        new: true,
        runValidators: true,
    }).populate('members.user', 'name email');

    res.status(200).json({
        success: true,
        message: "Team details updated successfully.",
        team: updatedTeam,
    });
});

// @desc    Get all teams (Admin route)
// @route   GET /api/team/all
// @access  Private (Admin, Alumni)
export const getAllTeams = catchAsyncError(async (req, res, next) => {
    const teams = await Team.find()
        .populate('leader', 'name email')
        .populate('members.user', 'name email');

    res.status(200).json({
        success: true,
        teams,
        count: teams.length,
    });
});


// =========================================================
// AI CONTENT GENERATION (Placeholder)
// =========================================================

// @desc    Generate project description using AI
// @route   POST /api/team/generate-description
// @access  Private
export const generateContent = catchAsyncError(async (req, res, next) => {
    const { prompt, length } = req.body;
    
    if (!prompt) {
        return next(new ErrorHandler("A prompt (project title) is required for AI generation.", 400));
    }
    
    const generatedContent = `[AI Generated Content for "${prompt}" - Length: ${length}] This is where the Gemini model summary would go.`;

    res.status(200).json({
        success: true,
        message: "Content generated.",
        content: generatedContent,
    });
});


// =========================================================
// TEAM APPROVAL LOGIC
// =========================================================

// @desc    Request admin approval for team registration
// @route   POST /api/team/request-approval
// @access  Private (Team Leader)
export const requestApproval = catchAsyncError(async (req, res, next) => {
    const team = await Team.findOne({ 'members.user': req.user.id });

    if (!team) {
        return next(new ErrorHandler("You must be part of a team to request approval.", 403));
    }
    
    if (team.members.length < 2 || team.members.length > 3) {
         return next(new ErrorHandler("Team must have between 2 and 3 members to submit for approval.", 400));
    }
    
    if (team.approvalStatus !== 'not_submitted' && team.approvalStatus !== 'rejected') {
        return next(new ErrorHandler(`Team approval is already ${team.approvalStatus}.`, 400));
    }

    team.approvalStatus = 'pending';
    team.approvalRequestedAt = Date.now();
    await team.save();

    res.status(200).json({
        success: true,
        message: "Approval request submitted successfully.",
        team,
    });
});

// @desc    Get team approval status
// @route   GET /api/team/approval-status
// @access  Private
export const getApprovalStatus = catchAsyncError(async (req, res, next) => {
    const team = await Team.findOne({ 'members.user': req.user.id });
    
    if (!team) {
        return res.status(200).json({ success: true, approval: { status: 'not_submitted' } });
    }

    res.status(200).json({
        success: true,
        approval: {
            status: team.approvalStatus,
            reason: team.rejectionReason,
            requestedAt: team.approvalRequestedAt
        }
    });
});

// @desc    Cancel an approval request
// @route   POST /api/team/cancel-approval
// @access  Private (Team Leader)
export const cancelApprovalRequest = catchAsyncError(async (req, res, next) => {
    const team = await Team.findOne({ 'members.user': req.user.id });
    
    if (!team) {
        return next(new ErrorHandler("Team not found.", 404));
    }
    
    team.approvalStatus = 'not_submitted';
    team.approvalRequestedAt = null;
    await team.save();
    
    res.status(200).json({
        success: true,
        message: "Approval request cancelled.",
    });
});


// =========================================================
// MISSION MANAGEMENT (STUDENT SIDE)
// =========================================================

// @desc    Get all available tasks for students to view/accept
// @route   GET /api/team/available-tasks
// @access  Private (Authenticated users)
export const getAvailableTasks = catchAsyncError(async (req, res, next) => {
    // FIX: Using Task.find({}) to ensure the broadest possible query. 
    const tasks = await Task.find({}); 

    // 2. Check if the current user has a team (for button logic)
    const team = await Team.findOne({ 'members.user': req.user.id });
    const hasTeam = !!team;
    
    res.status(200).json({
        success: true,
        tasks: tasks, // Returns the full array of tasks fetched from DB
        hasTeam: hasTeam
    });
});

// @desc    Team accepts a mission and configures member details
// @route   POST /api/team/accept-mission
// @access  Private (Authenticated user)
export const acceptMission = catchAsyncError(async (req, res, next) => {
    const { taskId, teamMembers } = req.body;
    const currentUserId = req.user.id; 

    const team = await Team.findOne({ 'members.user': currentUserId });

    if (!team) {
        return next(new ErrorHandler("You must create or join a team first.", 400));
    }

    const existingProgress = await TeamProgress.findOne({ team: team._id, task: taskId });
    if (existingProgress) {
        return next(new ErrorHandler("This team has already accepted this mission.", 400));
    }
    
    for (const member of teamMembers) {
        const memberIndex = team.members.findIndex(m => m.user.toString() === member.userId);

        if (memberIndex !== -1) {
            team.members[memberIndex].expertise = member.expertise;
            team.members[memberIndex].github = member.github;
            team.members[memberIndex].linkedin = member.linkedin;
        }
    }
    await team.save();

    const missionProgress = await TeamProgress.create({
        team: team._id,
        task: taskId,
        status: 'In Progress', 
        acceptedAt: Date.now()
    });

    res.status(200).json({
        success: true,
        message: "Mission accepted and team details updated successfully. Check 'My Team' tab.",
        progress: missionProgress
    });
});

// @desc    Get missions accepted by the user's team
// @route   GET /api/team/my-missions
// @access  Private
export const getMyTeamMissions = catchAsyncError(async (req, res, next) => {
    const team = await Team.findOne({ 'members.user': req.user.id });

    if (!team) {
        return res.status(200).json({ success: true, missions: [] });
    }

    const missions = await TeamProgress.find({ team: team._id })
        .populate('task', 'title description deadline expectedSkills') 
        .sort({ acceptedAt: -1 });

    res.status(200).json({
        success: true,
        missions: missions,
    });
});

// @desc    Update a specific team member's details within the team
// @route   PUT /api/team/update-member
// @access  Private
export const updateTeamMember = catchAsyncError(async (req, res, next) => {
    const { expertise, github, linkedin } = req.body;
    const userId = req.user.id;

    const team = await Team.findOne({ 'members.user': userId });

    if (!team) {
        return next(new ErrorHandler("You are not part of a team.", 400));
    }
    
    const memberIndex = team.members.findIndex(m => m.user.toString() === userId);
    
    if (memberIndex !== -1) {
        team.members[memberIndex].expertise = expertise || team.members[memberIndex].expertise;
        team.members[memberIndex].github = github || team.members[memberIndex].github;
        team.members[memberIndex].linkedin = linkedin || team.members[memberIndex].linkedin;
        await team.save();
    }

    res.status(200).json({
        success: true,
        message: "Member details updated.",
        team: await team.populate('members.user', 'name email'),
    });
});

// @desc    Submit progress for a specific mission
// @route   POST /api/team/submit-progress
// @access  Private
export const submitMissionProgress = catchAsyncError(async (req, res, next) => {
    const { missionId, submissionLink, submissionNotes } = req.body;
    const userId = req.user.id;

    const progress = await TeamProgress.findById(missionId).populate('team');
    
    if (!progress) {
        return next(new ErrorHandler("Mission progress entry not found.", 404));
    }
    
    const isTeamMember = progress.team.members.some(m => m.user.toString() === userId);
    if (!isTeamMember) {
        return next(new ErrorHandler("You are not authorized to submit progress for this team.", 403));
    }

    progress.status = 'Submitted';
    progress.submissionLink = submissionLink;
    progress.submissionNotes = submissionNotes;
    progress.submittedAt = Date.now();
    await progress.save();

    res.status(200).json({
        success: true,
        message: "Mission submitted for review.",
        progress,
    });
});
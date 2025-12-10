import { Team } from "../models/TeamModel.js"; 
import { User } from "../models/userModel.js"; // CRITICAL FIX: Use exact casing of the imported file name ('userModel.js')
import { Task } from "../models/TaskModel.js"; // CRITICAL: Ensure Task model is correctly imported
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

// @desc    Team Leader applies for a mission
// @route   POST /api/team/apply-mission
// @access  Private (Team Leader)
export const applyForMission = catchAsyncError(async (req, res, next) => {
  const { taskId } = req.body;
  const userId = req.user.id;

  // 1. Verify User is a Team Leader
  const team = await Team.findOne({ 
    'members': { 
      $elemMatch: { user: userId, role: 'Team Lead' } 
    } 
  });

  if (!team) {
    return next(new ErrorHandler("Only Team Leaders can apply for missions.", 403));
  }

  // 2. Check if already applied
  const existingApplication = await TeamProgress.findOne({
    team: team._id,
    task: taskId
  });

  if (existingApplication) {
    return next(new ErrorHandler("Your team has already applied or is assigned to this mission.", 400));
  }

  // 3. Create Application (Status: Pending)
  const application = await TeamProgress.create({
    team: team._id,
    task: taskId,
    status: 'Pending', // <--- Important: This signifies an application request
    assignedAt: Date.now()
  });

  res.status(201).json({
    success: true,
    message: `Application submitted for mission. Awaiting mentor approval.`,
    application
  });
});
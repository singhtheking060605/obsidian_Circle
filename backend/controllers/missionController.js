import { Mission, MissionAcceptance } from '../models/Mission.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';

// ============================================
// STUDENT CONTROLLERS
// ============================================

// @desc    Get all active missions that student can accept
// @route   GET /api/missions/active
// @access  Private (Student)
export const getActiveMissions = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  // Get all active missions
  const allMissions = await Mission.find({ 
    status: 'active',
    deadline: { $gte: new Date() }
  })
  .populate('createdBy', 'name email')
  .sort({ createdAt: -1 });

  // Get student's acceptances to check status
  const acceptances = await MissionAcceptance.find({ 
    student: userId 
  }).select('mission adminApproval status');

  // Create a map of mission statuses
  const acceptanceMap = {};
  acceptances.forEach(acc => {
    acceptanceMap[acc.mission.toString()] = {
      status: acc.status,
      adminApproval: acc.adminApproval.status,
      acceptanceId: acc._id
    };
  });

  // Add acceptance status to missions
  const missionsWithStatus = allMissions.map(mission => {
    const missionObj = mission.toObject();
    if (acceptanceMap[mission._id.toString()]) {
      missionObj.acceptanceStatus = acceptanceMap[mission._id.toString()];
    }
    return missionObj;
  });

  res.status(200).json({
    success: true,
    count: missionsWithStatus.length,
    missions: missionsWithStatus
  });
});

// @desc    Accept a mission with team details
// @route   POST /api/missions/:missionId/accept
// @access  Private (Student)
export const acceptMission = catchAsyncError(async (req, res, next) => {
  const { missionId } = req.params;
  const { teamName, githubRepository, teamMembers } = req.body;
  const userId = req.user._id;

  // Validate required fields
  if (!teamName) {
    return next(new ErrorHandler('Team name is required', 400));
  }

  if (!teamMembers || !Array.isArray(teamMembers) || teamMembers.length < 2) {
    return next(new ErrorHandler('At least 2 team members are required', 400));
  }

  // Check if mission exists and is active
  const mission = await Mission.findById(missionId);
  if (!mission) {
    return next(new ErrorHandler('Mission not found', 404));
  }

  if (mission.status !== 'active') {
    return next(new ErrorHandler('This mission is not active', 400));
  }

  // Check if deadline has passed
  if (new Date(mission.deadline) < new Date()) {
    return next(new ErrorHandler('Mission deadline has passed', 400));
  }

  // Check if student already accepted this mission
  const existingAcceptance = await MissionAcceptance.findOne({
    mission: missionId,
    student: userId
  });

  if (existingAcceptance) {
    return next(new ErrorHandler('You have already accepted this mission', 400));
  }

  // Validate team size
  const minTeamSize = mission.requirements?.minTeamSize || 2;
  const maxTeamSize = mission.requirements?.maxTeamSize || 3;

  if (teamMembers.length < minTeamSize) {
    return next(new ErrorHandler(`Team must have at least ${minTeamSize} members`, 400));
  }

  if (teamMembers.length > maxTeamSize) {
    return next(new ErrorHandler(`Team cannot exceed ${maxTeamSize} members`, 400));
  }

  // Validate each team member has required fields
  for (let i = 0; i < teamMembers.length; i++) {
    const member = teamMembers[i];
    if (!member.name || !member.rollNumber || !member.branch || !member.githubId) {
      return next(new ErrorHandler(`Team member ${i + 1} is missing required information`, 400));
    }
  }

  // Create mission acceptance
  const acceptance = await MissionAcceptance.create({
    mission: missionId,
    student: userId,
    teamName,
    githubRepository: githubRepository || '',
    teamMembers,
    status: 'pending',
    adminApproval: {
      status: 'pending'
    }
  });

  // Populate the mission details
  await acceptance.populate('mission', 'title briefing level deadline expectedSkills');
  await acceptance.populate('student', 'name email');

  res.status(201).json({
    success: true,
    message: 'Mission accepted successfully! Waiting for admin approval.',
    acceptance
  });
});

// @desc    Get student's accepted missions (for "Manage Teams" section)
// @route   GET /api/missions/my-missions
// @access  Private (Student)
export const getMyMissions = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const acceptances = await MissionAcceptance.find({ 
    student: userId 
  })
  .populate('mission', 'title briefing description level deadline expectedSkills deliverables')
  .populate('student', 'name email')
  .populate('adminApproval.approvedBy', 'name')
  .sort({ acceptedAt: -1 });

  res.status(200).json({
    success: true,
    count: acceptances.length,
    acceptances
  });
});

// @desc    Update team details (before admin approval)
// @route   PUT /api/missions/acceptance/:acceptanceId/team
// @access  Private (Student)
export const updateTeamDetails = catchAsyncError(async (req, res, next) => {
  const { acceptanceId } = req.params;
  const { teamName, githubRepository, teamMembers } = req.body;
  const userId = req.user._id;

  const acceptance = await MissionAcceptance.findById(acceptanceId)
    .populate('mission');

  if (!acceptance) {
    return next(new ErrorHandler('Mission acceptance not found', 404));
  }

  // Check ownership
  if (acceptance.student.toString() !== userId.toString()) {
    return next(new ErrorHandler('Not authorized to update this team', 403));
  }

  // Don't allow updates if already approved
  if (acceptance.adminApproval.status === 'approved') {
    return next(new ErrorHandler('Cannot update team details after admin approval', 400));
  }

  // Validate team members if provided
  if (teamMembers) {
    const minTeamSize = acceptance.mission.requirements?.minTeamSize || 2;
    const maxTeamSize = acceptance.mission.requirements?.maxTeamSize || 3;

    if (teamMembers.length < minTeamSize || teamMembers.length > maxTeamSize) {
      return next(new ErrorHandler(`Team must have ${minTeamSize}-${maxTeamSize} members`, 400));
    }

    acceptance.teamMembers = teamMembers;
  }

  // Update fields
  if (teamName) acceptance.teamName = teamName;
  if (githubRepository !== undefined) acceptance.githubRepository = githubRepository;

  await acceptance.save();
  await acceptance.populate('mission', 'title briefing level deadline');

  res.status(200).json({
    success: true,
    message: 'Team details updated successfully',
    acceptance
  });
});

// @desc    Submit mission for admin approval
// @route   POST /api/missions/acceptance/:acceptanceId/submit-approval
// @access  Private (Student)
export const submitForApproval = catchAsyncError(async (req, res, next) => {
  const { acceptanceId } = req.params;
  const userId = req.user._id;

  const acceptance = await MissionAcceptance.findById(acceptanceId)
    .populate('mission', 'requirements');

  if (!acceptance) {
    return next(new ErrorHandler('Mission acceptance not found', 404));
  }

  // Check ownership
  if (acceptance.student.toString() !== userId.toString()) {
    return next(new ErrorHandler('Not authorized', 403));
  }

  // Check if already submitted or approved
  if (acceptance.adminApproval.status === 'approved') {
    return next(new ErrorHandler('This mission has already been approved', 400));
  }

  // Update to in-progress after admin approval
  acceptance.status = 'pending'; // Stays pending until admin approves
  await acceptance.save();

  res.status(200).json({
    success: true,
    message: 'Mission is pending admin approval',
    acceptance
  });
});

// @desc    Upload evidence/media for mission
// @route   POST /api/missions/acceptance/:acceptanceId/upload
// @access  Private (Student)
export const uploadEvidence = catchAsyncError(async (req, res, next) => {
  const { acceptanceId } = req.params;
  const { evidenceUrl } = req.body;
  const userId = req.user._id;

  if (!evidenceUrl) {
    return next(new ErrorHandler('Evidence URL is required', 400));
  }

  const acceptance = await MissionAcceptance.findById(acceptanceId);

  if (!acceptance) {
    return next(new ErrorHandler('Mission acceptance not found', 404));
  }

  // Check ownership
  if (acceptance.student.toString() !== userId.toString()) {
    return next(new ErrorHandler('Not authorized', 403));
  }

  // Can only upload if approved
  if (acceptance.adminApproval.status !== 'approved') {
    return next(new ErrorHandler('Can only upload evidence after admin approval', 400));
  }

  // Add evidence URL
  acceptance.submission.evidence.push(evidenceUrl);
  await acceptance.save();

  res.status(200).json({
    success: true,
    message: 'Evidence uploaded successfully',
    acceptance
  });
});

// ============================================
// ADMIN/MENTOR CONTROLLERS
// ============================================

// @desc    Create new mission
// @route   POST /api/missions
// @access  Private (Admin/Mentor)
export const createMission = catchAsyncError(async (req, res, next) => {
  const { 
    title, 
    briefing, 
    description, 
    level, 
    deadline, 
    expectedSkills, 
    requirements, 
    deliverables, 
    gradingRubric 
  } = req.body;
  const userId = req.user._id;

  // Validate required fields
  if (!title || !briefing || !level || !deadline) {
    return next(new ErrorHandler('Please provide all required fields', 400));
  }

  const mission = await Mission.create({
    title,
    briefing,
    description: description || '',
    level,
    deadline,
    expectedSkills: expectedSkills || [],
    requirements: requirements || { minTeamSize: 2, maxTeamSize: 3 },
    deliverables: deliverables || [],
    gradingRubric: gradingRubric || '',
    createdBy: userId,
    status: 'active'
  });

  await mission.populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Mission created successfully',
    mission
  });
});

// @desc    Get all missions (admin view)
// @route   GET /api/missions/all
// @access  Private (Admin/Mentor)
export const getAllMissions = catchAsyncError(async (req, res, next) => {
  const missions = await Mission.find()
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  // Get acceptance counts for each mission
  const missionIds = missions.map(m => m._id);
  const acceptanceCounts = await MissionAcceptance.aggregate([
    { $match: { mission: { $in: missionIds } } },
    { $group: { _id: '$mission', count: { $sum: 1 } } }
  ]);

  const countMap = {};
  acceptanceCounts.forEach(item => {
    countMap[item._id.toString()] = item.count;
  });

  const missionsWithCounts = missions.map(mission => {
    const missionObj = mission.toObject();
    missionObj.acceptanceCount = countMap[mission._id.toString()] || 0;
    return missionObj;
  });

  res.status(200).json({
    success: true,
    count: missionsWithCounts.length,
    missions: missionsWithCounts
  });
});

// @desc    Get all mission acceptances
// @route   GET /api/missions/acceptances
// @access  Private (Admin/Mentor)
export const getAllAcceptances = catchAsyncError(async (req, res, next) => {
  const acceptances = await MissionAcceptance.find()
    .populate('mission', 'title level deadline')
    .populate('student', 'name email rollNumber')
    .populate('adminApproval.approvedBy', 'name')
    .sort({ acceptedAt: -1 });

  res.status(200).json({
    success: true,
    count: acceptances.length,
    acceptances
  });
});

// @desc    Approve or reject mission acceptance
// @route   POST /api/missions/acceptance/:acceptanceId/approve
// @access  Private (Admin/Mentor)
export const approveMissionAcceptance = catchAsyncError(async (req, res, next) => {
  const { acceptanceId } = req.params;
  const { approved, rejectionReason } = req.body;
  const userId = req.user._id;

  const acceptance = await MissionAcceptance.findById(acceptanceId)
    .populate('mission', 'title')
    .populate('student', 'name email');

  if (!acceptance) {
    return next(new ErrorHandler('Mission acceptance not found', 404));
  }

  if (acceptance.adminApproval.status !== 'pending') {
    return next(new ErrorHandler('This acceptance has already been processed', 400));
  }

  if (approved) {
    acceptance.adminApproval.status = 'approved';
    acceptance.adminApproval.approvedBy = userId;
    acceptance.adminApproval.approvedAt = Date.now();
    acceptance.status = 'in-progress';
  } else {
    acceptance.adminApproval.status = 'rejected';
    acceptance.adminApproval.approvedBy = userId;
    acceptance.adminApproval.approvedAt = Date.now();
    acceptance.adminApproval.rejectionReason = rejectionReason || 'No reason provided';
    acceptance.status = 'rejected';
  }

  await acceptance.save();

  res.status(200).json({
    success: true,
    message: approved ? 'Mission approved successfully' : 'Mission rejected',
    acceptance
  });
});

// @desc    Delete a mission
// @route   DELETE /api/missions/:missionId
// @access  Private (Admin/Mentor)
export const deleteMission = catchAsyncError(async (req, res, next) => {
  const { missionId } = req.params;

  const mission = await Mission.findById(missionId);

  if (!mission) {
    return next(new ErrorHandler('Mission not found', 404));
  }

  // Check if there are acceptances
  const acceptanceCount = await MissionAcceptance.countDocuments({ mission: missionId });

  if (acceptanceCount > 0) {
    return next(new ErrorHandler(`Cannot delete mission. ${acceptanceCount} team(s) have accepted this mission.`, 400));
  }

  await mission.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Mission deleted successfully'
  });
});
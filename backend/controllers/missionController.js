// backend/controllers/missionController.js
import { Task } from '../models/TaskModel.js'; // Use Task model
import { MissionAcceptance } from '../models/MissionAcceptanceModel.js'; // New model import
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';

// ============================================
// STUDENT CONTROLLERS
// ============================================

// @desc    Get all active missions that student can accept (UPDATED LOGIC)
// @route   GET /api/missions/active
// @access  Private (Student)
export const getActiveMissions = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  // 1. Find all missions the current user (student) has already accepted
  const acceptedMissionIds = await MissionAcceptance.find({ 
    student: userId 
  }).distinct('mission');

  // 2. Find all tasks not yet accepted by the user, that are explicitly 'active', and deadline has not passed.
  const activeMissions = await Task.find({ 
    _id: { $nin: acceptedMissionIds },
    status: 'active', // <--- CRITICAL FILTER ADDED
    deadline: { $gte: new Date() } 
  })
  .select('-description -deliverables') 
  .populate('createdBy', 'name email')
  .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: activeMissions.length,
    missions: activeMissions
  });
});

// @desc    Accept a mission (SIMPLIFIED LOGIC for individual acceptance)
// @route   POST /api/missions/:missionId/accept
// @access  Private (Student)
export const acceptMission = catchAsyncError(async (req, res, next) => {
  const { missionId } = req.params;
  const userId = req.user._id;

  // 1. Check if mission exists
  const mission = await Task.findById(missionId);
  if (!mission) {
    return next(new ErrorHandler('Mission not found', 404));
  }
  
  // New check: Mission must be active before acceptance
  if (mission.status !== 'active') {
    return next(new ErrorHandler('This mission is no longer active and cannot be accepted.', 400));
  }

  // 2. Check if deadline has passed
  if (new Date(mission.deadline) < new Date()) {
    return next(new ErrorHandler('Mission deadline has passed', 400));
  }
  
  // 3. Check if student already accepted this mission
  const existingAcceptance = await MissionAcceptance.findOne({
    mission: missionId,
    student: userId
  });

  if (existingAcceptance) {
    return next(new ErrorHandler('You have already accepted this mission', 400));
  }

  // 4. Create mission acceptance document
  const acceptance = await MissionAcceptance.create({
    mission: missionId,
    student: userId,
    status: 'accepted',
  });

  res.status(201).json({
    success: true,
    message: 'Mission accepted successfully!',
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
  .populate('mission') // Populate the full task details
  .populate('student', 'name email')
  // .populate('adminApproval.approvedBy', 'name') // Removed: simplicity first
  .sort({ acceptedAt: -1 });

  res.status(200).json({
    success: true,
    count: acceptances.length,
    acceptances
  });
});

// --- STUBBED CONTROLLERS (Temporarily return error until fully implemented with new models) ---

export const updateTeamDetails = catchAsyncError(async (req, res, next) => {
  return next(new ErrorHandler('Feature temporarily disabled or requires re-implementation with new models.', 501));
});

export const submitForApproval = catchAsyncError(async (req, res, next) => {
  return next(new ErrorHandler('Feature temporarily disabled or requires re-implementation with new models.', 501));
});

export const uploadEvidence = catchAsyncError(async (req, res, next) => {
  return next(new ErrorHandler('Feature temporarily disabled or requires re-implementation with new models.', 501));
});

// ---------------------------------------------------------------------------------------------


// ============================================
// ADMIN/MENTOR CONTROLLERS (Updated to use correct Task/MissionAcceptance models)
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

  const mission = await Task.create({ // Use Task model for creation
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
    status: 'active' // Ensure new missions are set to active by default
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
  const missions = await Task.find() // Use Task model for admin view
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  // Get acceptance counts for each mission
  const missionIds = missions.map(m => m._id);
  const acceptanceCounts = await MissionAcceptance.aggregate([ // Use new model
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
  const acceptances = await MissionAcceptance.find() // Use new model
    .populate('mission', 'title level deadline')
    .populate('student', 'name email rollNumber')
    // .populate('adminApproval.approvedBy', 'name') // Removed: simplicity first
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
  const { approved, rejectionReason } = req.body; // Can ignore rejectionReason for simplicity
  const userId = req.user._id;

  const acceptance = await MissionAcceptance.findById(acceptanceId) // Use new model
    .populate('mission', 'title')
    .populate('student', 'name email');

  if (!acceptance) {
    return next(new ErrorHandler('Mission acceptance not found', 404));
  }

  // Simplified approval logic
  if (approved) {
    acceptance.status = 'in-progress';
  } else {
    acceptance.status = 'rejected';
  }

  await acceptance.save();

  res.status(200).json({
    success: true,
    message: approved ? 'Mission status updated to In-Progress' : 'Mission status updated to Rejected',
    acceptance
  });
});

// @desc    Delete a mission
// @route   DELETE /api/missions/:missionId
// @access  Private (Admin/Mentor)
export const deleteMission = catchAsyncError(async (req, res, next) => {
  const { missionId } = req.params;

  const mission = await Task.findById(missionId); // Use Task model

  if (!mission) {
    return next(new ErrorHandler('Mission not found', 404));
  }

  // Check if there are acceptances
  const acceptanceCount = await MissionAcceptance.countDocuments({ mission: missionId }); // Use new model

  if (acceptanceCount > 0) {
    return next(new ErrorHandler(`Cannot delete mission. ${acceptanceCount} student(s) have accepted this mission.`, 400));
  }

  await mission.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Mission deleted successfully'
  });
});
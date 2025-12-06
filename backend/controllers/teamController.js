import { Team } from "../models/TeamModel.js";
import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";

// Get My Team Details
export const getMyTeam = catchAsyncError(async (req, res, next) => {
  const team = await Team.findOne({
    $or: [{ leader: req.user._id }, { "members.user": req.user._id }],
  })
    .populate("leader", "name email avatar")
    .populate("members.user", "name email avatar");

  if (!team) {
    return res.status(200).json({
      success: true,
      team: null, 
    });
  }

  res.status(200).json({
    success: true,
    team,
  });
});

// Create a New Team
export const createTeam = catchAsyncError(async (req, res, next) => {
  const { name, repoLink, description } = req.body;

  const existingTeam = await Team.findOne({
    $or: [{ leader: req.user._id }, { "members.user": req.user._id }],
  });

  if (existingTeam) {
    return next(new ErrorHandler("You are already part of a team", 400));
  }

  const team = await Team.create({
    name,
    repoLink,
    description,
    leader: req.user._id,
    members: [{ user: req.user._id, role: "Team Lead" }], 
  });

  res.status(201).json({
    success: true,
    message: "Team created successfully",
    team,
  });
});

// Update Team Details
export const updateTeam = catchAsyncError(async (req, res, next) => {
  const { repoLink, description } = req.body;

  let team = await Team.findOne({ leader: req.user._id });

  if (!team) {
    return next(new ErrorHandler("Team not found or you are not the leader", 404));
  }

  if (repoLink !== undefined) team.repoLink = repoLink;
  if (description !== undefined) team.description = description;

  await team.save();

  res.status(200).json({
    success: true,
    message: "Team updated successfully",
    team,
  });
});
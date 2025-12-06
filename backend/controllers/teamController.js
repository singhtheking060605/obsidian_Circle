import { Team } from "../models/TeamModel.js";
import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";

// Get My Team
export const getMyTeam = catchAsyncError(async (req, res, next) => {
  const team = await Team.findOne({
    $or: [{ leader: req.user._id }, { "members.user": req.user._id }],
  })
    .populate("leader", "name email avatar")
    .populate("members.user", "name email avatar");

  res.status(200).json({ success: true, team });
});

// Create Team
export const createTeam = catchAsyncError(async (req, res, next) => {
  const { name, repoLink, description } = req.body;

  const existingTeam = await Team.findOne({
    $or: [{ leader: req.user._id }, { "members.user": req.user._id }],
  });
  if (existingTeam) return next(new ErrorHandler("You are already part of a team", 400));
  
  const nameTaken = await Team.findOne({ name });
  if (nameTaken) return next(new ErrorHandler("Team name taken", 400));

  const team = await Team.create({
    name,
    repoLink,
    description,
    leader: req.user._id,
    members: [{ user: req.user._id, role: "Team Lead" }], 
  });

  res.status(201).json({ success: true, message: "Team created", team });
});

// Join Team
export const joinTeam = catchAsyncError(async (req, res, next) => {
  const { teamName } = req.body;
  if (!teamName) return next(new ErrorHandler("Provide a team name", 400));

  const userInTeam = await Team.findOne({
    $or: [{ leader: req.user._id }, { "members.user": req.user._id }]
  });
  if (userInTeam) return next(new ErrorHandler("You are already in a team", 400));

  const team = await Team.findOne({ name: teamName });
  if (!team) return next(new ErrorHandler("Team not found", 404));

  team.members.push({ user: req.user._id, role: "Member" });
  await team.save();
  await team.populate("leader members.user", "name email avatar");

  res.status(200).json({ success: true, message: "Joined team", team });
});

// Update Team (Repo, Description, Media)
export const updateTeam = catchAsyncError(async (req, res, next) => {
  const { repoLink, description, mediaLink } = req.body;

  let team = await Team.findOne({ leader: req.user._id });
  if (!team) return next(new ErrorHandler("Not authorized", 404));

  if (repoLink !== undefined) team.repoLink = repoLink;
  if (description !== undefined) team.description = description;
  
  // Add new media URL if provided
  if (mediaLink) team.mediaLinks.push(mediaLink);

  await team.save();
  await team.populate("leader members.user", "name email avatar");

  res.status(200).json({ success: true, message: "Updated", team });
});
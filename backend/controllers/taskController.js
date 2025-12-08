import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/TaskModel.js";
import { TeamProgress } from "../models/TeamProgressModel.js"; 

// @desc    Create a new Task (Mission)
export const createTask = catchAsyncError(async (req, res, next) => {
  const { 
    title, 
    description, 
    deadline, 
    assignedTo, 
    deliverables, 
    expectedSkills, 
    rubric 
  } = req.body;

  if (!title || !description || !deadline) {
    return next(new ErrorHandler("Please include title, description, and deadline.", 400));
  }

  const createdBy = req.user.id;

  const task = await Task.create({
    title,
    description,
    deadline,
    assignedTo,
    deliverables, 
    expectedSkills,
    rubric: rubric || null,
    createdBy,
  });

  res.status(201).json({
    success: true,
    message: "Mission initiated successfully.",
    task,
  });
});

// @desc    Get All Tasks (Visible to all Mentors)
export const getAllTasks = catchAsyncError(async (req, res, next) => {
  const tasks = await Task.find()
    .populate('rubric', 'title')
    .populate('createdBy', 'name') // Populate creator name for display
    .sort({ deadline: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    tasks,
    count: tasks.length,
  });
});

// @desc    Get Single Task
export const getSingleTask = catchAsyncError(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate('rubric');

  if (!task) {
    return next(new ErrorHandler("Task not found.", 404));
  }

  res.status(200).json({
    success: true,
    task,
  });
});

// @desc    Update Task (Only Creator can update)
export const updateTask = catchAsyncError(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorHandler("Task not found.", 404));
  }

  // Permission Check
  if (task.createdBy.toString() !== req.user.id) {
    return next(new ErrorHandler("You are not authorized to update this task.", 403));
  }
  
  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Task updated successfully.",
    task,
  });
});

// @desc    Delete Task (Only Creator can delete)
export const deleteTask = catchAsyncError(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorHandler("Task not found.", 404));
  }
  
  // --- NEW PERMISSION LOGIC ---
  if (task.createdBy.toString() !== req.user.id) {
    return next(new ErrorHandler("You can only delete missions you created.", 403));
  }
  
  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task deleted successfully.",
  });
});

// ---------------- ASSIGNMENT LOGIC ----------------

export const assignTeamToTask = catchAsyncError(async (req, res, next) => {
  const { teamId, taskId } = req.body;

  if (!teamId || !taskId) {
    return next(new ErrorHandler("Team ID and Task ID are required.", 400));
  }

  const existingAssignment = await TeamProgress.findOne({ team: teamId, task: taskId });
  if (existingAssignment) {
    return next(new ErrorHandler("This squad is already assigned to this mission.", 400));
  }

  const assignment = await TeamProgress.create({
    team: teamId,
    task: taskId,
    status: 'Assigned'
  });

  res.status(201).json({
    success: true,
    message: "Squad deployed successfully.",
    assignment
  });
});

export const getAllAssignments = catchAsyncError(async (req, res, next) => {
  const assignments = await TeamProgress.find()
    .populate("team", "name leader repoLink")
    .populate("task", "title deadline")
    .sort({ assignedAt: -1 });

  res.status(200).json({
    success: true,
    assignments
  });
});

export const evaluateSubmission = catchAsyncError(async (req, res, next) => {
  const { score, feedback, status } = req.body;
  const progressId = req.params.id;

  let assignment = await TeamProgress.findById(progressId);

  if (!assignment) {
    return next(new ErrorHandler("Submission record not found.", 404));
  }

  if (score !== undefined) assignment.score = score;
  if (feedback !== undefined) assignment.feedback = feedback;
  if (status !== undefined) assignment.status = status;
  
  assignment.lastUpdated = Date.now();

  await assignment.save();

  res.status(200).json({
    success: true,
    message: "Evaluation submitted successfully.",
    assignment
  });
});
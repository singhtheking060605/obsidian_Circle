import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/TaskModel.js";

// @desc    Create a new Task (Mission)
// @route   POST /api/v1/task/new
// @access  Private (Admin, Alumni)
export const createTask = catchAsyncError(async (req, res, next) => {
  // Destructure all new fields from the request body
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
    // Store arrays directly (frontend should send them as arrays)
    deliverables, 
    expectedSkills,
    rubric: rubric || null, // Optional rubric
    createdBy,
  });

  res.status(201).json({
    success: true,
    message: "Mission initiated successfully.",
    task,
  });
});

// ... (Keep getAllTasks, getSingleTask, updateTask, deleteTask as they were) ...
// Ensure updateTask also allows updating these new fields if passed in req.body
export const getAllTasks = catchAsyncError(async (req, res, next) => {
  const tasks = await Task.find()
    .populate('rubric', 'title') // Populate rubric title for display
    .sort({ deadline: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    tasks,
    count: tasks.length,
  });
});

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

export const updateTask = catchAsyncError(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorHandler("Task not found.", 404));
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

export const deleteTask = catchAsyncError(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorHandler("Task not found.", 404));
  }
  
  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task deleted successfully.",
  });
});
import { TeamProgress } from "../models/TeamProgressModel.js"; 
// ... existing imports

// ---------------- ASSIGNMENT LOGIC ----------------

// @desc    Assign a Team to a Task
// @route   POST /api/v1/task/assign
// @access  Private (Admin, Alumni)
export const assignTeamToTask = catchAsyncError(async (req, res, next) => {
  const { teamId, taskId } = req.body;

  if (!teamId || !taskId) {
    return next(new ErrorHandler("Team ID and Task ID are required.", 400));
  }

  // Check if assignment already exists
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

// @desc    Get All Mission Assignments
// @route   GET /api/v1/task/assignments/all
// @access  Private (Admin, Alumni)
export const getAllAssignments = catchAsyncError(async (req, res, next) => {
  const assignments = await TeamProgress.find()
    .populate("team", "name leader repoLink") // Get team details
    .populate("task", "title deadline")       // Get task details
    .sort({ assignedAt: -1 });

  res.status(200).json({
    success: true,
    assignments
  });
});
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/TaskModel.js";
import { TeamProgress } from "../models/TeamProgressModel.js"; 

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

// @desc    Get All Tasks
// @route   GET /api/v1/task/all
// @access  Public (Authenticated)
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

// @desc    Get Single Task
// @route   GET /api/v1/task/:id
// @access  Public (Authenticated)
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

// @desc    Update Task
// @route   PUT /api/v1/task/:id
// @access  Private (Admin, Alumni)
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

// @desc    Delete Task
// @route   DELETE /api/v1/task/:id
// @access  Private (Admin, Alumni)
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

// ---------------- EVALUATION LOGIC (NEW) ----------------

// @desc    Evaluate a submission (Score & Feedback)
// @route   PUT /api/task/evaluate/:id
// @access  Private (Admin, Alumni)
export const evaluateSubmission = catchAsyncError(async (req, res, next) => {
  const { score, feedback, status } = req.body;
  const progressId = req.params.id; // This is the ID of the TeamProgress document

  let assignment = await TeamProgress.findById(progressId);

  if (!assignment) {
    return next(new ErrorHandler("Submission record not found.", 404));
  }

  // Update fields if provided
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
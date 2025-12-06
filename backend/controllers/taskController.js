import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/TaskModel.js";

// @desc    Create a new Task
// @route   POST /api/v1/task/new
// @access  Private (Admin, Alumni)
export const createTask = catchAsyncError(async (req, res, next) => {
  const { title, description, deadline, assignedTo } = req.body;

  if (!title || !description || !deadline) {
    return next(new ErrorHandler("Please include title, description, and deadline.", 400));
  }

  // The creator is available via req.user due to isAuthenticated middleware
  const createdBy = req.user.id;

  const task = await Task.create({
    title,
    description,
    deadline,
    assignedTo, 
    createdBy,
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully.",
    task,
  });
});

// @desc    Get All Tasks
// @route   GET /api/v1/task/all
// @access  Private (All authenticated users)
export const getAllTasks = catchAsyncError(async (req, res, next) => {
  // Fetch all tasks for administrative overview/student consumption
  const tasks = await Task.find().sort({ deadline: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    tasks,
    count: tasks.length,
  });
});


// ---------------- NEW FUNCTIONS ----------------

// @desc    Get a Single Task by ID
// @route   GET /api/v1/task/:id
// @access  Private (Admin, Alumni) - Restricted for detailed view
export const getSingleTask = catchAsyncError(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorHandler("Task not found.", 404));
  }

  res.status(200).json({
    success: true,
    task,
  });
});


// @desc    Update an existing Task
// @route   PUT /api/v1/task/:id
// @access  Private (Admin, Alumni)
export const updateTask = catchAsyncError(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorHandler("Task not found.", 404));
  }
  
  // Note: Only updating the fields provided in req.body
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

// @desc    Delete a Task
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
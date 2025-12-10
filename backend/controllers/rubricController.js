import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Rubric } from "../models/RubricModel.js";

// @desc    Create a new Rubric
// @route   POST /api/v1/rubric/new
// @access  Private (Admin, Alumni)
export const createRubric = catchAsyncError(async (req, res, next) => {
  const { title, description, criteria } = req.body;

  // Basic validation
  if (!title || !criteria || criteria.length === 0) {
    return next(new ErrorHandler("Please include a title and at least one criterion for the rubric.", 400));
  }

  // The creator is fetched from the token via isAuthenticated middleware
  const createdBy = req.user.id;

  const rubric = await Rubric.create({
    title,
    description,
    criteria,
    createdBy,
  });

  res.status(201).json({
    success: true,
    message: "Rubric created successfully.",
    rubric,
  });
});

// @desc    Get All Rubrics
// @route   GET /api/v1/rubric/all
// @access  Private (Admin, Alumni)
export const getAllRubrics = catchAsyncError(async (req, res, next) => {
  const rubrics = await Rubric.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    rubrics,
    count: rubrics.length,
  });
});


// ---------------- NEW FUNCTIONS ----------------

// @desc    Get a Single Rubric by ID
// @route   GET /api/v1/rubric/:id
// @access  Private (Admin, Alumni)
export const getSingleRubric = catchAsyncError(async (req, res, next) => {
  const rubric = await Rubric.findById(req.params.id);

  if (!rubric) {
    return next(new ErrorHandler("Rubric not found.", 404));
  }

  res.status(200).json({
    success: true,
    rubric,
  });
});


// @desc    Update an existing Rubric
// @route   PUT /api/v1/rubric/:id
// @access  Private (Admin, Alumni)
export const updateRubric = catchAsyncError(async (req, res, next) => {
  let rubric = await Rubric.findById(req.params.id);

  if (!rubric) {
    return next(new ErrorHandler("Rubric not found.", 404));
  }
  
  rubric = await Rubric.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Rubric updated successfully.",
    rubric,
  });
});

// @desc    Delete a Rubric
// @route   DELETE /api/v1/rubric/:id
// @access  Private (Admin, Alumni)
export const deleteRubric = catchAsyncError(async (req, res, next) => {
  const rubric = await Rubric.findById(req.params.id);

  if (!rubric) {
    return next(new ErrorHandler("Rubric not found.", 404));
  }
  
  await rubric.deleteOne();

  res.status(200).json({
    success: true,
    message: "Rubric deleted successfully.",
  });
});
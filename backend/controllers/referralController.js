import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Referral } from "../models/ReferralModel.js";
import { User } from "../models/userModel.js";

// @desc    Create a new Referral
// @route   POST /api/referral/new
// @access  Private (Mentor/Alumni)
export const createReferral = catchAsyncError(async (req, res, next) => {
  const { studentId, reason, evidenceLinks, context } = req.body;

  if (!studentId || !reason) {
    return next(new ErrorHandler("Student ID and Reason are required.", 400));
  }

  const student = await User.findById(studentId);
  if (!student) {
    return next(new ErrorHandler("Student not found.", 404));
  }

  const referral = await Referral.create({
    student: studentId,
    referredBy: req.user._id,
    reason,
    evidenceLinks: evidenceLinks || [],
    context
  });

  res.status(201).json({
    success: true,
    message: "Referral generated successfully.",
    referral
  });
});

// @desc    Get All Referrals created by the logged-in Mentor
// @route   GET /api/referral/my-issued
export const getMyIssuedReferrals = catchAsyncError(async (req, res, next) => {
  const referrals = await Referral.find({ referredBy: req.user._id })
    .populate('student', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    referrals
  });
});
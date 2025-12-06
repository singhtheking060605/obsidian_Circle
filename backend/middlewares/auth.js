import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);

  if (!req.user) {
    return next(new ErrorHandler("User not found", 404));
  }

  next();
});

// Middleware to check if user has required role
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user.roles.some(role => roles.includes(role))) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.roles.join(', ')} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

// ============================================
// ORIGINAL AUTHENTICATION MIDDLEWARE
// ============================================

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

// ============================================
// ADDITIONAL MIDDLEWARE FOR MISSION ROUTES
// ============================================

// Alternative authentication that checks both cookies and Authorization header
export const protect = catchAsyncError(async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);

  if (!req.user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if user is active
  if (req.user.status === 'Banned' || req.user.status === 'Restricted') {
    return next(new ErrorHandler(`Your account has been ${req.user.status.toLowerCase()}`, 403));
  }

  next();
});

// Alternative role authorization (alias for authorizeRoles)
export const authorize = (...roles) => {
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
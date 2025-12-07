import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  let token;

  // 1. Check Cookies
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Check Authorization Header (Bearer token)
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid Token", 401));
  }
});

// Middleware to check if user has required role
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Ensure req.user.roles is treated as an array even if it's a single string
    const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.roles];
    
    // Check if any of the user's roles matches the allowed roles
    const hasRole = userRoles.some(role => roles.includes(role));

    if (!hasRole) {
      return next(
        new ErrorHandler(
          `Role: ${userRoles.join(', ')} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
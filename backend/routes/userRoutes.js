import express from "express";

import {
  register,
  verifyOTP,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUser,
  getAllStudents,
  googleLogin,
  getAllAlumni,
  searchUsers
} from "../controllers/usercontroller.js";

import { updateProfile } from "../controllers/updateprofilecontroller.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Auth Routes
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/logout", logout);

// Password Routes
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

// User Info
router.get("/me", isAuthenticated, getUser);

// Google Login
router.post("/google", googleLogin);

// Student Directory (Protected + Role-Based)
router.get(
  "/students",
  isAuthenticated,
  authorizeRoles("Admin", "Mentor", "Alumni"),
  getAllStudents
);

// Alumni Network
router.get("/alumni", isAuthenticated, getAllAlumni);

// Search Users
router.get("/search", isAuthenticated, searchUsers);

// Update Profile (with file upload)
router.put(
  "/update-me",
  isAuthenticated,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  updateProfile
);

export default router;

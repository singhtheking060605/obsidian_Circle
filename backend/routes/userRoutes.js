import express from "express";
import {
  register,
  verifyOTP,
  login,
  logout,
  forgotPassword,
  resetPassword,  
  getUser,
} from "../controllers/usercontroller.js";
import { updateProfile } from "../controllers/updateprofilecontroller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js"; // <-- This imports the 

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/password/reset/:token", resetPassword);

// Protected routes
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);

// Update Profile route using the imported 'upload' middleware
router.put(
  "/update-me",
  isAuthenticated,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateProfile
);

export default router;

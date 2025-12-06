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
import { isAuthenticated } from "../middlewares/auth.js";

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

export default router;
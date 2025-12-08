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
  googleLogin// <--- Import this
} from "../controllers/usercontroller.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/logout", logout);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/me", isAuthenticated, getUser);
router.post("/google", googleLogin); // <--- Add this route

// New Route for Student Directory
router.get("/students", isAuthenticated, authorizeRoles("Admin", "Mentor", "Alumni"), getAllStudents);

export default router;
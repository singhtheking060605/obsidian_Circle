// routes/teamRoutes.js - FINAL CORRECTED VERSION

import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import {
  generateContent,
  getMyTeam, // This is the controller function
  createTeam,
  joinTeam,
  updateTeam,
  getAllTeams,
  requestApproval,
  getApprovalStatus,
  cancelApprovalRequest,
  
  acceptMission,
  getMyTeamMissions,
  getAvailableTasks,
  updateTeamMember,
  submitMissionProgress,
} from "../controllers/teamController.js";

const router = express.Router();

// ===== EXISTING ROUTES (FIXED /me ENDPOINT) =====

router.post("/generate-content", isAuthenticated, generateContent);
// 💡 FIX: Change /my-team back to /me to match the frontend request:
router.get("/me", isAuthenticated, getMyTeam); 
router.post("/create", isAuthenticated, createTeam);
router.post("/join", isAuthenticated, joinTeam);
router.put("/update", isAuthenticated, updateTeam);
router.get("/all", isAuthenticated, getAllTeams);

// Approval routes
router.post("/request-approval", isAuthenticated, requestApproval);
router.get("/approval-status", isAuthenticated, getApprovalStatus);
router.post("/cancel-approval", isAuthenticated, cancelApprovalRequest);

// ===== NEW ROUTES =====

router.get("/available-tasks", isAuthenticated, getAvailableTasks);
router.post("/accept-mission", isAuthenticated, acceptMission);
router.get("/my-missions", isAuthenticated, getMyTeamMissions);
router.put("/update-member", isAuthenticated, updateTeamMember);
router.post("/submit-progress", isAuthenticated, submitMissionProgress);

export default router;
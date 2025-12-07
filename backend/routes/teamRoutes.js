
// ADD THESE ROUTES TO YOUR EXISTING teamRoutes.js

import express from 'express';
import { 
  createTeam, 
  joinTeam, 
  getMyTeam, 
  updateTeam, 
  generateContent,
  requestApproval,        // ✅ NEW
  getApprovalStatus,      // ✅ NEW
  cancelApprovalRequest ,
   getAllTeams  // ✅ NEW
} from '../controllers/teamController.js';
// import { isAuthenticated } from '../middlewares/auth.js';

import express from "express";
// import { getMyTeam, createTeam, updateTeam, joinTeam, generateContent } from "../controllers/teamController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js"; // Ensure authorizeRoles is imported


const router = express.Router();

// Existing routes
router.post('/create', isAuthenticated, createTeam);
router.put('/join', isAuthenticated, joinTeam);
router.get('/me', isAuthenticated, getMyTeam);
router.put('/update', isAuthenticated, updateTeam);
router.post('/generate-description', isAuthenticated, generateContent);


// ✅ NEW: Approval routes
router.post('/request-approval', isAuthenticated, requestApproval);
router.get('/approval-status', isAuthenticated, getApprovalStatus);
router.delete('/cancel-approval', isAuthenticated, cancelApprovalRequest);

// Admin Route
router.get("/all", isAuthenticated, authorizeRoles("Admin", "Alumni"), getAllTeams);


export default router;
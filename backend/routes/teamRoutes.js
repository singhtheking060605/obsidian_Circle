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
  cancelApprovalRequest   // ✅ NEW
} from '../controllers/teamController.js';
import { isAuthenticated } from '../middlewares/auth.js';

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

export default router;
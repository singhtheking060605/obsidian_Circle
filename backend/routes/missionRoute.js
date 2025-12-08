// backend/routes/missionRoute.js
import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middlewares/auth.js';
import {
  createMission,
  getAllMissions,
  getActiveMissions,
  acceptMission,
  getMyMissions,
  updateTeamDetails, // These three functions now return a 501 error in the controller
  submitForApproval, // until further implementation is done
  uploadEvidence,
  getAllAcceptances,
  approveMissionAcceptance,
  deleteMission
} from '../controllers/missionController.js';

// STUDENT ROUTES
router.get('/active', protect, getActiveMissions);
router.post('/:missionId/accept', protect, acceptMission);
router.get('/my-missions', protect, getMyMissions);
router.put('/acceptance/:acceptanceId/team', protect, updateTeamDetails); // Stubbed
router.post('/acceptance/:acceptanceId/submit-approval', protect, submitForApproval); // Stubbed
router.post('/acceptance/:acceptanceId/upload', protect, uploadEvidence); // Stubbed

// ADMIN/MENTOR ROUTES
router.post('/', protect, authorize('Mentor'), createMission);
router.get('/all', protect, authorize('Mentor'), getAllMissions);
router.get('/acceptances', protect, authorize('Mentor'), getAllAcceptances);
router.post('/acceptance/:acceptanceId/approve', protect, authorize('Mentor'), approveMissionAcceptance);
router.delete('/:missionId', protect, authorize('Mentor'), deleteMission);

export default router;
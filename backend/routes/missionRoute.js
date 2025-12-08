import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middlewares/auth.js';
import {
  createMission,
  getAllMissions,
  getActiveMissions,
  acceptMission,
  getMyMissions,
  updateTeamDetails,
  submitForApproval,
  uploadEvidence,
  getAllAcceptances,
  approveMissionAcceptance,
  deleteMission
} from '../controllers/missionController.js';

// STUDENT ROUTES
router.get('/active', protect, getActiveMissions);
router.post('/:missionId/accept', protect, acceptMission);
router.get('/my-missions', protect, getMyMissions);
router.put('/acceptance/:acceptanceId/team', protect, updateTeamDetails);
router.post('/acceptance/:acceptanceId/submit-approval', protect, submitForApproval);
router.post('/acceptance/:acceptanceId/upload', protect, uploadEvidence);

// ADMIN/MENTOR ROUTES
router.post('/', protect, authorize('Mentor'), createMission);
router.get('/all', protect, authorize('Mentor'), getAllMissions);
router.get('/acceptances', protect, authorize('Mentor'), getAllAcceptances);
router.post('/acceptance/:acceptanceId/approve', protect, authorize('Mentor'), approveMissionAcceptance);
router.delete('/:missionId', protect, authorize('Mentor'), deleteMission);

export default router;
// import express from 'express';
// import {
//   getAllMissions,
//   acceptMission,
//   getInvitation,
//   respondToInvitation,
//   getMyTeamMissions,
//   getAssignedTasks
// } from '../controllers/missionController.js';
// import { isAuthenticated } from '../middlewares/auth.js';

// const router = express.Router();

// // Public routes
// router.get('/invitation/:teamMissionId/:email', getInvitation);

// // Protected routes
// router.get('/all', isAuthenticated, getAllMissions);
// router.post('/accept', isAuthenticated, acceptMission);
// router.post('/invitation/respond', respondToInvitation); // Can work without auth
// router.get('/my-missions', isAuthenticated, getMyTeamMissions);
// router.get('/assigned', isAuthenticated, getAssignedTasks);

// export default router;
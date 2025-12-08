// routes/invitationRoutes.js
import express from 'express';
import { 
  sendInvitation, 
  getInvitationByToken, 
  acceptInvitation,
  getTeamInvitations,
  cancelInvitation 
} from '../controllers/invitationcontroller.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post('/send', isAuthenticated, sendInvitation);
router.get('/token/:token', getInvitationByToken);
router.post('/accept/:token', acceptInvitation);
router.get('/team', isAuthenticated, getTeamInvitations);
router.delete('/:invitationId', isAuthenticated, cancelInvitation);

export default router;
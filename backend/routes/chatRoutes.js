import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { 
  createRequest, 
  acceptRequest, 
  getAllRequests, 
  getMyChats, 
  getMessages 
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/request", isAuthenticated, createRequest);
router.get("/my-chats", isAuthenticated, getMyChats);
router.get("/messages/:sessionId", isAuthenticated, getMessages);

// Mentor specific routes
router.get("/requests/all", isAuthenticated, authorizeRoles("Mentor", "Admin"), getAllRequests);
router.put("/accept", isAuthenticated, authorizeRoles("Mentor", "Admin"), acceptRequest);

export default router;
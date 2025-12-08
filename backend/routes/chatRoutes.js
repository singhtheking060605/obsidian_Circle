import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { 
  searchUsers,
  createRequest, 
  acceptRequest, 
  getIncomingRequests, 
  getMyChats, 
  getMessages 
} from "../controllers/chatController.js";

const router = express.Router();

// Public-ish routes (Authenticated users)
router.get("/search", isAuthenticated, searchUsers); // <--- NEW
router.post("/request", isAuthenticated, createRequest);
router.put("/accept", isAuthenticated, acceptRequest);
router.get("/requests/incoming", isAuthenticated, getIncomingRequests);
router.get("/my-chats", isAuthenticated, getMyChats);
router.get("/messages/:sessionId", isAuthenticated, getMessages);

export default router;
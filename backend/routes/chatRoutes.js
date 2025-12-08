import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { 
  searchUsers,
  createRequest, 
  acceptRequest, 
  getNetworkStatus, 
  getIncomingRequests, // <--- Import new controller
  getMyChats, 
  getMessages 
} from "../controllers/chatController.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/search", searchUsers);
router.post("/request", createRequest);
router.put("/accept", acceptRequest);

// Network/Alumni Page Data
router.get("/network-status", getNetworkStatus); 

// QnA Page Data (New Route)
router.get("/requests/incoming", getIncomingRequests); 

router.get("/my-chats", getMyChats);
router.get("/messages/:sessionId", getMessages);

export default router;
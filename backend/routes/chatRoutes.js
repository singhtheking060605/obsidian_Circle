import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { 
  searchUsers,
  createRequest, 
  acceptRequest, 
  getNetworkStatus, // <--- Import this
  getMyChats, 
  getMessages 
} from "../controllers/chatController.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/search", searchUsers);
router.post("/request", createRequest);
router.put("/accept", acceptRequest);
router.get("/network-status", getNetworkStatus); // <--- Register this
router.get("/my-chats", getMyChats);
router.get("/messages/:sessionId", getMessages);

export default router;
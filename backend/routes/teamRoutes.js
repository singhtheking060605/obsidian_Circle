import express from "express";
import { getMyTeam, createTeam, updateTeam, joinTeam, generateContent, getAllTeams } from "../controllers/teamController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js"; // Ensure authorizeRoles is imported

const router = express.Router();

router.get("/me", isAuthenticated, getMyTeam);
router.post("/create", isAuthenticated, createTeam);
router.put("/join", isAuthenticated, joinTeam);
router.put("/update", isAuthenticated, updateTeam);
router.post('/generate-description', isAuthenticated, generateContent);

// Admin Route
router.get("/all", isAuthenticated, authorizeRoles("Admin", "Alumni"), getAllTeams);

export default router;
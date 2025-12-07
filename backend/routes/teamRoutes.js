import express from "express";
import { getMyTeam, createTeam, updateTeam } from "../controllers/teamController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/me", isAuthenticated, getMyTeam);
router.post("/create", isAuthenticated, createTeam);
router.put("/update", isAuthenticated, updateTeam);

export default router;
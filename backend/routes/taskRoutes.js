import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { 
    createTask, 
    getAllTasks, 
    getSingleTask, 
    updateTask, 
    deleteTask,
    assignTeamToTask,
    getAllAssignments,
    evaluateSubmission // <--- ADDED THIS IMPORT
} from "../controllers/taskController.js";

import { getMissionRequests, decideMissionRequest } from "../controllers/missionController.js";

const router = express.Router();

// --- Public Routes (Accessible to logged in users) ---
router.route("/all").get(isAuthenticated, getAllTasks);

// --- Admin/Alumni/Mentor Routes ---
router.route("/new").post(isAuthenticated, authorizeRoles("Admin", "Alumni", "Mentor"), createTask);

router.get("/requests", isAuthenticated, authorizeRoles("Mentor", "Admin"), getMissionRequests);
router.put("/request/:requestId/decide", isAuthenticated, authorizeRoles("Mentor", "Admin"), decideMissionRequest);

// Specific Task Operations
router
  .route("/:id")
  .get(isAuthenticated, authorizeRoles("Admin", "Alumni", "Mentor"), getSingleTask)
  .put(isAuthenticated, authorizeRoles("Admin", "Alumni", "Mentor"), updateTask)
  .delete(isAuthenticated, authorizeRoles("Admin", "Alumni", "Mentor"), deleteTask);

// Assignment Routes
router.route("/assign").post(isAuthenticated, authorizeRoles("Admin", "Alumni", "Mentor"), assignTeamToTask);
router.route("/assignments/all").get(isAuthenticated, authorizeRoles("Admin", "Alumni", "Mentor"), getAllAssignments);

// Evaluation Route (NEW)
router.route("/evaluate/:id").put(
    isAuthenticated, 
    authorizeRoles("Admin", "Alumni", "Mentor"), 
    evaluateSubmission
);

export default router;
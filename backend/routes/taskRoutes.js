import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { 
    createTask, 
    getAllTasks, 
    getSingleTask, 
    updateTask, 
    deleteTask,
    assignTeamToTask,
    getAllAssignments
} from "../controllers/taskController.js";

const router = express.Router();

// --- Public Routes (Accessible to logged in users) ---
router.route("/all").get(isAuthenticated, getAllTasks);

// --- Admin/Alumni/Mentor Routes ---
router.route("/new").post(isAuthenticated, authorizeRoles("Admin", "Alumni", "Mentor"), createTask);

// Specific Task Operations
router
  .route("/:id")
  .get(isAuthenticated, authorizeRoles("Admin", "Alumni", "Mentor"), getSingleTask)
  .put(isAuthenticated, authorizeRoles("Admin", "Alumni", "Mentor"), updateTask)
  .delete(isAuthenticated, authorizeRoles("Admin", "Alumni", "Mentor"), deleteTask);

// Assignment Routes
router.route("/assign").post(isAuthenticated, authorizeRoles("Admin", "Alumni", "Mentor"), assignTeamToTask);
router.route("/assignments/all").get(isAuthenticated, authorizeRoles("Admin", "Alumni", "Mentor"), getAllAssignments);

export default router;
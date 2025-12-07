import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { 
    createTask, 
    getAllTasks, 
    getSingleTask, 
    updateTask, 
    deleteTask 
} from "../controllers/taskController.js";

const router = express.Router();

// Public Routes (Accessible to all logged-in users, frontend handles filtering for students)
router.route("/all").get(isAuthenticated, getAllTasks);

// Administrative Routes (Restricted to Admin/Alumni)
router.route("/new").post(isAuthenticated, authorizeRoles("Admin", "Alumni"), createTask);

// Routes for specific Task operations by ID
router
  .route("/:id")
  .get(isAuthenticated, authorizeRoles("Admin", "Alumni"), getSingleTask)
  .put(isAuthenticated, authorizeRoles("Admin", "Alumni"), updateTask)
  .delete(isAuthenticated, authorizeRoles("Admin", "Alumni"), deleteTask);


  // ... existing imports
import { 
    createTask, 
    getAllTasks, 
    getSingleTask, 
    updateTask, 
    deleteTask,
    assignTeamToTask,   // Import this
    getAllAssignments   // Import this
} from "../controllers/taskController.js";

// ... existing routes

// Assignment Routes
router.route("/assign").post(isAuthenticated, authorizeRoles("Admin", "Alumni"), assignTeamToTask);
router.route("/assignments/all").get(isAuthenticated, authorizeRoles("Admin", "Alumni"), getAllAssignments);

export default router;
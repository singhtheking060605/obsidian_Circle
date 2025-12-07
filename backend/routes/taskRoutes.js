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

// Public Routes (Accessible to all logged-in users)
router.route("/all").get(isAuthenticated, getAllTasks);

// Administrative Routes (Restricted to Admin and Alumni)
router.route("/new").post(isAuthenticated, authorizeRoles("Admin", "Alumni"), createTask);

// Routes for specific Task operations by ID
router
  .route("/:id")
  .get(isAuthenticated, authorizeRoles("Admin", "Alumni"), getSingleTask)
  .put(isAuthenticated, authorizeRoles("Admin", "Alumni"), updateTask)
  .delete(isAuthenticated, authorizeRoles("Admin", "Alumni"), deleteTask);

export default router;
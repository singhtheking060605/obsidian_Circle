import express from "express";
import { 
    isAuthenticated, // <-- CORRECTED: Changed isAuthenticatedUser to isAuthenticated
    authorizeRoles 
} from "../middlewares/auth.js"; 
import { 
    createTask, 
    getAllTasks, 
    getSingleTask, 
    updateTask, 
    deleteTask,
    assignTeamToTask,
    getAllAssignments,
    runPlagiarismCheckController,
    evaluateSubmission 
} from "../controllers/taskController.js";

const router = express.Router();

// I will use isAuthenticated for consistency since it is exported in auth.js
const authMiddleware = isAuthenticated; 

// --- Public Routes (Accessible to logged in users) ---
router.route("/all").get(authMiddleware, getAllTasks);

// --- Admin/Alumni/Mentor Routes ---
router.route("/new").post(authMiddleware, authorizeRoles("Admin", "Alumni", "Mentor"), createTask);

// Specific Task Operations
router
    .route("/:id")
    .get(authMiddleware, authorizeRoles("Admin", "Alumni", "Mentor"), getSingleTask)
    .put(authMiddleware, authorizeRoles("Admin", "Alumni", "Mentor"), updateTask)
    .delete(authMiddleware, authorizeRoles("Admin", "Alumni", "Mentor"), deleteTask);

// Assignment Routes
router.route("/assign").post(authMiddleware, authorizeRoles("Admin", "Alumni", "Mentor"), assignTeamToTask);
router.route("/assignments/all").get(authMiddleware, authorizeRoles("Admin", "Alumni", "Mentor"), getAllAssignments);

// Evaluation Route (NEW)
router.route("/evaluate/:id").put(
    authMiddleware, 
    authorizeRoles("Admin", "Alumni", "Mentor"), 
    evaluateSubmission
);

// Plagiarism Check Route 
router
    .route('/admin/task/:taskId/check/plagiarism')
    .post(authMiddleware, authorizeRoles('mentor', 'admin'), runPlagiarismCheckController);

export default router;
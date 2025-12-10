import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { 
    createRubric, 
    getAllRubrics,
    getSingleRubric,
    updateRubric,
    deleteRubric
} from "../controllers/rubricController.js";

const router = express.Router();

// Route for creating a new rubric
router.route("/new").post(isAuthenticated, authorizeRoles("Admin", "Alumni"), createRubric);

// Route for fetching all rubrics
router.route("/all").get(isAuthenticated, authorizeRoles("Admin", "Alumni"), getAllRubrics);

// Routes for specific Rubric operations by ID
router
    .route("/:id")
    .get(isAuthenticated, authorizeRoles("Admin", "Alumni"), getSingleRubric)
    .put(isAuthenticated, authorizeRoles("Admin", "Alumni"), updateRubric)
    .delete(isAuthenticated, authorizeRoles("Admin", "Alumni"), deleteRubric);

export default router;
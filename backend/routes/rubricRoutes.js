import express from 'express';
import { 
    aiDraftReview,
    createRubric,
    getRubricDetails,
    updateRubric, 
    deleteRubric 
} from '../controllers/rubricController.js'; 
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js'; // Assuming isAuthenticatedUser is imported here

const router = express.Router();

// --- Existing Routes ---
router.route('/rubric/:id').get(getRubricDetails);

router
    .route('/admin/rubric/new')
    .post(isAuthenticatedUser, authorizeRoles('admin'), createRubric);

router
    .route('/admin/rubric/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin', 'mentor'), updateRubric)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteRubric);


// --- FEATURE 1: AI AUTO-REVIEW DRAFT Route ---
router
    .route('/task/:taskId/review/draft/ai')
    .post(isAuthenticatedUser, authorizeRoles('mentor', 'admin'), aiDraftReview);


export default router;
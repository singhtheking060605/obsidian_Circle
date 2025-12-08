import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { createReferral, getMyIssuedReferrals } from "../controllers/referralController.js";

const router = express.Router();

router.route("/new").post(isAuthenticated, authorizeRoles("Admin", "Alumni", "Mentor"), createReferral);
router.route("/my-issued").get(isAuthenticated, authorizeRoles("Admin", "Alumni", "Mentor"), getMyIssuedReferrals);

export default router;
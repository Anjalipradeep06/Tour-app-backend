import express from "express";

import {
  getAllUsers,
  softDeleteUser,
  restoreUser,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Apply middleware to all admin user-management routes
router.use(protect, adminOnly);

router.get("/", getAllUsers);

router.patch("/:id/delete", softDeleteUser);

router.patch("/:id/restore", restoreUser);

export default router;
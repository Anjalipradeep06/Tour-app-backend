import express from "express";
import {
  getNotifications,getUnreadCount,markAllAsRead,markAsRead
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.patch("/:id/read", protect, markAsRead);
router.patch("/read-all", protect, markAllAsRead);
export default router;
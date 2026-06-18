import express from "express";

import {
  getDashboardStats,
  getAllBookings,
  getPendingBookings,
  approveBooking,
  rejectBooking,
} from "../controllers/adminController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  adminOnly,
} from "../middleware/adminMiddleware.js";

const router = express.Router();

// Apply middleware to all admin routes
router.use(protect, adminOnly);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Booking management
router.get("/bookings", getAllBookings);

router.get(
  "/bookings/pending",
  getPendingBookings
);

router.patch(
  "/bookings/:id/approve",
  approveBooking
);

router.patch(
  "/bookings/:id/reject",
  rejectBooking
);

export default router;
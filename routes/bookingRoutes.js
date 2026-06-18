import express from "express";

import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  markCODPaid,
  completeBooking,
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* -------------------------
   User Routes
-------------------------- */

// Create booking request
router.post("/", protect, createBooking);

// Get logged-in user's bookings
router.get("/", protect, getUserBookings);

// Get booking details
router.get("/:id", protect, getBookingById);

// Update booking request
router.put("/:id", protect, updateBooking);

// Cancel booking
router.patch("/:id/cancel", protect, cancelBooking);

/* -------------------------
   Admin Routes
-------------------------- */

// Mark COD payment as paid
router.patch(
  "/:id/pay",
  protect,
  adminOnly,
  markCODPaid
);

// Mark booking as completed
router.patch(
  "/:id/complete",
  protect,
  adminOnly,
  completeBooking
);

export default router;
import express from "express";

import {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
} from "../controllers/tourController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Get all tours & Create tour
router
  .route("/")
  .get(getAllTours)
  .post(protect, adminOnly, createTour);

// Get single tour, Update tour, Delete tour
router
  .route("/:id")
  .get(getTourById)
  .put(protect, adminOnly, updateTour)
  .delete(protect, adminOnly, deleteTour);

export default router;
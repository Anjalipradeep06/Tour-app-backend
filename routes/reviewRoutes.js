import express from "express";

import {
  addReview,
  getTourReviews,
  deleteReview,
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addReview);

router.get("/:tourId", getTourReviews);

router.delete("/:id", protect, deleteReview);

export default router;
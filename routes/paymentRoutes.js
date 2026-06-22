import express from "express";
import {
  verifyStripePayment,
  createStripeSession,
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/create-session/:bookingId",
  protect,
  createStripeSession
);

router.patch(
  "/verify/:bookingId",
  protect,
  verifyStripePayment
);

export default router;
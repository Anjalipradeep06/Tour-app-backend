import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  createDestination,
  getFeaturedDestinations,
  getDestinationsByContinent,
  getPopularDestinations,
} from "../controllers/destinationController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([
    {
      name: "bannerImage",
      maxCount: 1,
    },
    {
      name: "galleryImages",
      maxCount: 10,
    },
  ]),
  createDestination
);

router.get(
  "/featured",
  getFeaturedDestinations
);

router.get(
  "/:continent",
  getDestinationsByContinent
);

router.get(
  "/:continent/popular",
  getPopularDestinations
);

export default router;
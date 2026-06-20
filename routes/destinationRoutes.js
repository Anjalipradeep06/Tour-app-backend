import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  createDestination,
  getAllDestinations,
  getFeaturedDestinations,
  getDestinationsByContinent,
  getPopularDestinations,
  getDestinationById,
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

// Admin-only list-all. Must come BEFORE "/:continent" below —
// otherwise Express matches "/all" as a continent param instead
// of hitting this route.
router.get(
  "/all",
  protect,
  adminOnly,
  getAllDestinations
);

router.get(
  "/featured",
  getFeaturedDestinations
);

router.get(
  "/popular",
  getPopularDestinations
);

router.get(
  "/:continent/popular",
  getPopularDestinations
);
router.get(
  "/details/:id",
  getDestinationById
);
router.get(
  "/:continent",
  getDestinationsByContinent
);

export default router;
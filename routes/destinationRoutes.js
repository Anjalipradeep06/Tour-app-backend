import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

import {
  createDestination,
  updateDestination,
  getAllDestinations,
  getFeaturedDestinations,
  getDestinationsByContinent,
  getPopularDestinations,
  getDestinationById,
} from "../controllers/destinationController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

/* -----------------------------
   Create Destination
------------------------------*/
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

/* -----------------------------
   Update Destination
------------------------------*/
router.put(
  "/:id",
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
  updateDestination
);

/* -----------------------------
   Admin Get All Destinations
------------------------------*/
router.get(
  "/all",
  protect,
  adminOnly,
  getAllDestinations
);

/* -----------------------------
   Featured Destinations
------------------------------*/
router.get(
  "/featured",
  getFeaturedDestinations
);

/* -----------------------------
   Popular Destinations
------------------------------*/
router.get(
  "/popular",
  getPopularDestinations
);

router.get(
  "/:continent/popular",
  getPopularDestinations
);

/* -----------------------------
   Single Destination
------------------------------*/
router.get(
  "/details/:id",
  getDestinationById
);

/* -----------------------------
   Destinations By Continent
------------------------------*/
router.get(
  "/:continent",
  getDestinationsByContinent
);

export default router;
import express from "express";
import { checkAvailability } from "../controllers/availabilityController.js";

console.log("✅ Availability routes loaded");

const router = express.Router();

router.get("/check", checkAvailability);

export default router;
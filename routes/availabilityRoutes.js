import express from "express";
import { checkAvailability } from "../controllers/availabilityController.js";

const router = express.Router();

// PUBLIC or PROTECTED (your choice)
router.get("/check", checkAvailability);

export default router;
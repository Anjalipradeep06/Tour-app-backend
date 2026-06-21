import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { sendEmail } from "./services/emailService.js";
import authRoutes from "./routes/authRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js"
import adminUserRoutes from "./routes/adminUserRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";

const app = express();

// Middleware
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(process.cwd(), "public")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use(
  "/api/destinations",
  destinationRoutes
);
app.use("/api/availability", availabilityRoutes);
app.use("/api/admin/users", adminUserRoutes);
// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tour Booking API Running",
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

export default app;
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
      index: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    participants: {
      type: Number,
      required: true,
      min: 1,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      index: true,
    },

    specialRequirements: {
      type: String,
      default: "",
      trim: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "stripe"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed", "refunded"],
      default: "unpaid",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* -----------------------------
   Indexes for faster queries
------------------------------*/
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ tour: 1, status: 1 });

export default mongoose.model("Booking", bookingSchema);
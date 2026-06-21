import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["stripe", "cod"],
      required: true,
      default: "stripe",
    },

    transactionId: {
      type: String,
      default: null,
      index: true,
    },

    stripeSessionId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

/* -----------------------------
   Indexes for performance
------------------------------*/
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ booking: 1 });

export default mongoose.model("Payment", paymentSchema);
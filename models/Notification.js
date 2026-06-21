import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "booking",
        "payment",
        "system",
        "admin",
        "review",
        "promotion",
      ],
      default: "system",
      index: true,
    },
  },
  { timestamps: true }
);

/* -----------------------------
   Indexes for performance
------------------------------*/
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });

export default mongoose.model("Notification", notificationSchema);
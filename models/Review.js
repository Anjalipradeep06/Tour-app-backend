import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
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

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

/* -----------------------------
   Prevent duplicate reviews
   (one user per tour)
------------------------------*/
reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

/* -----------------------------
   Performance indexes
------------------------------*/
reviewSchema.index({ tour: 1, createdAt: -1 });

export default mongoose.model("Review", reviewSchema);
import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    continent: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    bannerImage: {
      type: String,
      required: true,
    },

    galleryImages: {
      type: [String],
      default: [],
    },

    activities: {
      type: [String],
      default: [],
      index: true,
    },

    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },

    isPopular: {
      type: Boolean,
      default: false,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

/* -----------------------------
   Indexes for performance
------------------------------*/
destinationSchema.index({ continent: 1, country: 1 });
destinationSchema.index({ isPopular: 1, isFeatured: 1 });

/* -----------------------------
   Geo index (for future location-based search)
------------------------------*/
destinationSchema.index({ latitude: 1, longitude: 1 });

export default mongoose.model("Destination", destinationSchema);
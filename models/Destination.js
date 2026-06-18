import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    continent: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
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
    },

     latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
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

export default mongoose.model("Destination", destinationSchema);
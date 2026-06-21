import mongoose from "mongoose";

/* -----------------------------
   Sub Schemas
------------------------------*/
const itinerarySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const meetingPointSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      default: "",
      trim: true,
    },

    latitude: Number,
    longitude: Number,
  },
  { _id: false }
);

/* -----------------------------
   Main Schema
------------------------------*/
const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
      index: true,
    },

    country: {
      type: String,
      index: true,
      trim: true,
    },

    continent: {
      type: String,
      index: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },

    activities: {
      type: [String],
      default: [],
      index: true,
    },

    highlights: {
      type: [String],
      default: [],
    },

    itinerary: {
      type: [itinerarySchema],
      default: [],
    },

    inclusions: {
      type: [String],
      default: [],
    },

    exclusions: {
      type: [String],
      default: [],
    },

    meetingPoint: {
      type: meetingPointSchema,
      default: {},
    },

    availableSlots: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "availableSlots must be an integer",
      },
    },

    startDates: {
      type: [Date],
      default: [],
      index: true,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      index: true,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* -----------------------------
   TEXT SEARCH INDEX
------------------------------*/
tourSchema.index({
  title: "text",
  description: "text",
  activities: "text",
});

/* -----------------------------
   COMPOUND INDEXES (VERY IMPORTANT)
------------------------------*/
tourSchema.index({ country: 1, price: 1 });
tourSchema.index({ continent: 1, price: 1 });
tourSchema.index({ price: 1, averageRating: -1 });
tourSchema.index({ createdAt: -1 });

export default mongoose.model("Tour", tourSchema);
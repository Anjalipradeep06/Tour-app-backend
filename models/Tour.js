import mongoose from "mongoose";

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
    },

    latitude: Number,

    longitude: Number,
  },
  { _id: false }
);

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
    },
country: {
  type: String,
  index: true,
},

continent: {
  type: String,
  index: true,
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
    },

    activities: {
      type: [String],
      default: [],
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
    },

    startDates: {
      type: [Date],
      default: [],
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },


    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Tour", tourSchema);
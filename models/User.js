import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // prevents accidental exposure
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    isVerified: {
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
   Performance Indexes
------------------------------*/
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isDeleted: 1 });

export default mongoose.model("User", userSchema);
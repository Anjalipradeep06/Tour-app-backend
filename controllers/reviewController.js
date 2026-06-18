import Review from "../models/Review.js";
import Tour from "../models/Tour.js";
import Booking from "../models/Booking.js";

/* ---------------------------------
   Helper: Update Tour Ratings
---------------------------------- */
const updateTourRatings = async (tourId) => {
  const reviews = await Review.find({ tour: tourId });

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / totalReviews
        ).toFixed(1)
      : 0;

  await Tour.findByIdAndUpdate(tourId, {
    averageRating: Number(averageRating),
    totalReviews,
  });
};

/* ---------------------------------
   Add Review
---------------------------------- */
const addReview = async (req, res) => {
  try {
    const { tour, rating, comment } = req.body;

    if (!tour || !rating) {
      return res.status(400).json({
        success: false,
        message: "Tour and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const existingTour = await Tour.findById(tour);

    if (!existingTour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    const booking = await Booking.findOne({
      user: req.user._id,
      tour,
      status: "completed",
    });

    if (!booking) {
      return res.status(403).json({
        success: false,
        message:
          "You can review only after completing the tour",
      });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      tour,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message:
          "You have already reviewed this tour",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      tour,
      rating,
      comment,
    });

    await updateTourRatings(tour);

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ---------------------------------
   Get Tour Reviews
---------------------------------- */
const getTourReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      tour: req.params.tourId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ---------------------------------
   Delete Review
---------------------------------- */
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(
      req.params.id
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const isOwner =
      review.user.toString() ===
      req.user._id.toString();

    const isAdmin =
      req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "Not authorized to delete this review",
      });
    }

    const tourId = review.tour;

    await review.deleteOne();

    await updateTourRatings(tourId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  addReview,
  getTourReviews,
  deleteReview,
};
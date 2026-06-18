import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";
import { sendEmail } from "../services/emailService.js";
import {
  bookingConfirmedEmail,
  bookingUpdatedEmail,
  bookingCancelledEmail,
  paymentCompletedEmail,
  bookingCompletedEmail,
} from "../services/emailTemplates.js";
import { createNotification } from "../utils/notificationHelper.js";

/* -----------------------------
   Helper: check modifiable
------------------------------*/
const isModifiable = (booking) => booking.status === "confirmed";

/* -----------------------------
   Create Booking
------------------------------*/
const createBooking = async (req, res) => {
  try {
    const {
      tourId,
      bookingDate,
      participants,
      paymentMethod = "cod",
    } = req.body;

    if (!tourId || !bookingDate || !participants) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    if (new Date(bookingDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Booking date cannot be in the past",
      });
    }

    if (tour.availableSlots < participants) {
      return res.status(400).json({
        success: false,
        message: "Not enough slots available",
      });
    }

    const totalAmount = tour.price * participants;

    const booking = await Booking.create({
      user: req.user._id,
      tour: tourId,
      bookingDate,
      participants,
      paymentMethod,
      totalAmount,
      status: "pending",
    });

    sendEmail({
      to: req.user.email,
      ...bookingConfirmedEmail(tour, booking),
    }).catch((err) => console.error("Email error:", err.message));

    await createNotification(
      req.user._id,
      "Booking Confirmed 🎉",
      `Your booking for ${tour.title} is confirmed on ${new Date(
        bookingDate
      ).toLocaleDateString()}.`
    );

    return res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -----------------------------
   Get User Bookings
------------------------------*/
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate({
        path: "tour",
        populate: { path: "destination" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -----------------------------
   Get Booking By ID
------------------------------*/
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate({
      path: "tour",
      populate: { path: "destination" },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -----------------------------
   Update Booking
------------------------------*/
const updateBooking = async (req, res) => {
  try {
    const { bookingDate, participants } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (!isModifiable(booking)) {
      return res.status(400).json({
        success: false,
        message: "Only confirmed bookings can be updated",
      });
    }

    const tour = await Tour.findById(booking.tour);

    tour.availableSlots += booking.participants;

    const newParticipants = participants || booking.participants;

    if (tour.availableSlots < newParticipants) {
      tour.availableSlots -= booking.participants;

      return res.status(400).json({
        success: false,
        message: "Not enough slots available for update",
      });
    }

    if (bookingDate && new Date(bookingDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Booking date cannot be in the past",
      });
    }

    if (bookingDate) booking.bookingDate = bookingDate;

    booking.participants = newParticipants;
    booking.totalAmount = tour.price * newParticipants;

    tour.availableSlots -= newParticipants;

    await booking.save();
    await tour.save();

    sendEmail({
      to: req.user.email,
      ...bookingUpdatedEmail(tour, booking),
    }).catch((err) => console.error("Email error:", err.message));

    await createNotification(
      req.user._id,
      "Booking Updated",
      `Your booking for ${tour.title} has been updated.`
    );

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -----------------------------
   Cancel Booking
------------------------------*/
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("tour")
      .populate("user");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed bookings cannot be cancelled",
      });
    }

    const hoursLeft =
      (new Date(booking.bookingDate) - new Date()) /
      (1000 * 60 * 60);

    if (hoursLeft < 24) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel within 24 hours",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    await Tour.findByIdAndUpdate(booking.tour._id, {
      $inc: { availableSlots: booking.participants },
    });

    sendEmail({
      to: booking.user.email,
      ...bookingCancelledEmail(booking.tour, booking),
    }).catch((err) => console.error("Email error:", err.message));

    await createNotification(
      booking.user._id,
      "Booking Cancelled ❌",
      "Your booking has been cancelled successfully."
    );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -----------------------------
   Mark COD Paid
------------------------------*/
const markCODPaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("tour")
      .populate("user");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.paymentMethod !== "cod") {
      return res.status(400).json({
        success: false,
        message: "Not a COD booking",
      });
    }

    booking.paymentStatus = "paid";
    await booking.save();

    sendEmail({
      to: booking.user.email,
      ...paymentCompletedEmail(booking.tour, booking),
    }).catch((err) => console.error("Email error:", err.message));

    await createNotification(
      booking.user._id,
      "Payment Received 💳",
      "Your COD payment has been marked as paid."
    );

    return res.status(200).json({
      success: true,
      message: "COD marked as paid",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -----------------------------
   Complete Booking
------------------------------*/
const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("tour")
      .populate("user");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Already completed",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled booking cannot be completed",
      });
    }

    booking.status = "completed";
    await booking.save();

    sendEmail({
      to: booking.user.email,
      ...bookingCompletedEmail(booking.tour),
    }).catch((err) => console.error("Email error:", err.message));

    await createNotification(
      booking.user._id,
      "Trip Completed 🎉",
      "Hope you enjoyed your trip!"
    );

    return res.status(200).json({
      success: true,
      message: "Booking marked as completed",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  markCODPaid,
  completeBooking,
};
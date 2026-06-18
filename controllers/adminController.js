import User from "../models/User.js";
import Tour from "../models/Tour.js";
import Booking from "../models/Booking.js";
import { sendEmail } from "../services/emailService.js";

/* ---------------------------------
   Dashboard Statistics
---------------------------------- */
const getDashboardStats = async (req, res) => {
  try {
    const [
      users,
      tours,
      bookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      revenue,
    ] = await Promise.all([
      User.countDocuments(),
      Tour.countDocuments(),
      Booking.countDocuments(),

      Booking.countDocuments({
        status: "pending",
      }),

      Booking.countDocuments({
        status: "confirmed",
      }),

      Booking.countDocuments({
        status: "completed",
      }),

      Booking.countDocuments({
        status: "cancelled",
      }),

      Booking.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,

      stats: {
        users,
        tours,
        bookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue:
          revenue[0]?.totalRevenue || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("tour", "title price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getPendingBookings = async (
  req,
  res
) => {
  try {
    const bookings = await Booking.find({
      status: "pending",
    })
      .populate("user", "name email")
      .populate("tour", "title price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const approveBooking = async (
  req,
  res
) => {
  try {
    const booking =
      await Booking.findById(
        req.params.id
      )
        .populate("user")
        .populate("tour");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending bookings can be approved",
      });
    }

    const tour = await Tour.findById(
      booking.tour._id
    );

    if (
      tour.availableSlots <
      booking.participants
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Not enough slots available",
      });
    }

    tour.availableSlots -=
      booking.participants;

    await tour.save();

    booking.status = "confirmed";
    booking.approvedBy = req.user._id;
    booking.approvedAt = new Date();

    await booking.save();

    await sendEmail({
      to: booking.user.email,
      subject: "Booking Approved 🎉",
      text: `Your booking for "${booking.tour.title}" has been approved.`,
    });

    res.status(200).json({
      success: true,
      message:
        "Booking approved successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const rejectBooking = async (
  req,
  res
) => {
  try {
    const booking =
      await Booking.findById(
        req.params.id
      )
        .populate("user")
        .populate("tour");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending bookings can be rejected",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    await sendEmail({
      to: booking.user.email,
      subject: "Booking Rejected",
      text: `Unfortunately, your booking for "${booking.tour.title}" could not be approved.`,
    });

    res.status(200).json({
      success: true,
      message:
        "Booking rejected successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getDashboardStats,
  getAllBookings,
  getPendingBookings,
  approveBooking,
  rejectBooking,
};
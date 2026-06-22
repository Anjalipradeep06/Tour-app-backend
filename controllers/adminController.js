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
      message: "Dashboard statistics fetched successfully",
      stats: {
        users,
        tours,
        bookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue: revenue[0]?.totalRevenue || 0,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard statistics",
    });
  }
};

/* ---------------------------------
   Get All Bookings
---------------------------------- */
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("tour", "title price")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bookings",
    });
  }
};

/* ---------------------------------
   Get Pending Bookings
---------------------------------- */
const getPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: "pending",
    })
      .populate("user", "name email")
      .populate("tour", "title price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Pending bookings fetched successfully",
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch pending bookings",
    });
  }
};

/* ---------------------------------
   Approve Booking
---------------------------------- */
const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
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

    if (
      booking.tour.availableSlots <
      booking.participants
    ) {
      return res.status(400).json({
        success: false,
        message: "Not enough slots available",
      });
    }

    booking.tour.availableSlots -=
      booking.participants;

    booking.status = "confirmed";
    booking.approvedBy = req.user._id;
    booking.approvedAt = new Date();

    await Promise.all([
      booking.save(),
      booking.tour.save(),
    ]);

    // Respond immediately
    res.status(200).json({
      success: true,
      message: "Booking approved successfully",
      booking,
    });

    // Send email in background
    sendEmail({
      to: booking.user.email,
      subject: "Booking Approved 🎉",
      text: `Your booking for "${booking.tour.title}" has been approved.`,
    }).catch((error) => {
      console.error(
        "Email Error:",
        error.message
      );
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to approve booking",
    });
  }
};

/* ---------------------------------
   Reject Booking
---------------------------------- */
const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    )
      .populate("user", "email")
      .populate("tour", "title");

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

    // Respond immediately
    res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      booking,
    });

    // Send email in background
    sendEmail({
      to: booking.user.email,
      subject: "Booking Rejected",
      text: `Unfortunately, your booking for "${booking.tour.title}" could not be approved.`,
    }).catch((error) => {
      console.error(
        "Email Error:",
        error.message
      );
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to reject booking",
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
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

      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "completed" }),
      Booking.countDocuments({ status: "cancelled" }),

      Booking.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

    return res.status(200).json({
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
    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to fetch dashboard statistics",
    });
  }
};

/* ---------------------------------
   GET ALL BOOKINGS (PAGINATED)
---------------------------------- */
const getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [bookings, totalBookings] = await Promise.all([
      Booking.find()
        .populate("user", "name email")
        .populate("tour", "title price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Booking.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBookings / limit),
        totalItems: totalBookings,
        limit,
        hasNextPage: page < Math.ceil(totalBookings / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bookings",
    });
  }
};

/* ---------------------------------
   GET PENDING BOOKINGS (OPTIONAL PAGINATED)
---------------------------------- */
const getPendingBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find({ status: "pending" })
        .populate("user", "name email")
        .populate("tour", "title price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Booking.countDocuments({ status: "pending" }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Pending bookings fetched successfully",
      bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch pending bookings",
    });
  }
};

/* ---------------------------------
   APPROVE BOOKING
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
        message: "Only pending bookings can be approved",
      });
    }

    if (booking.tour.availableSlots < booking.participants) {
      return res.status(400).json({
        success: false,
        message: "Not enough slots available",
      });
    }

    booking.tour.availableSlots -= booking.participants;

    booking.status = "confirmed";
    booking.approvedBy = req.user._id;
    booking.approvedAt = new Date();

    await Promise.all([booking.save(), booking.tour.save()]);

    return res.status(200).json({
      success: true,
      message: "Booking approved successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to approve booking",
    });
  }
};

/* ---------------------------------
   REJECT BOOKING
---------------------------------- */
const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
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
        message: "Only pending bookings can be rejected",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to reject booking",
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
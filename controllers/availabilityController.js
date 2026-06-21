import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";

export const checkAvailability = async (req, res) => {
  try {
    const { tourId, date, participants } = req.query;

    if (!tourId || !date || !participants) {
      return res.status(400).json({
        success: false,
        message: "tourId, date, and participants are required",
      });
    }

    const requestDate = new Date(date);

    if (isNaN(requestDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    const bookings = await Booking.find({
      tour: tourId,
      bookingDate: {
        $gte: new Date(requestDate.setHours(0, 0, 0, 0)),
        $lte: new Date(requestDate.setHours(23, 59, 59, 999)),
      },
      status: { $in: ["pending", "confirmed"] },
    });

    const bookedSlots = bookings.reduce(
      (sum, booking) => sum + booking.participants,
      0
    );

    const remainingSlots = tour.availableSlots - bookedSlots;

    const requested = Number(participants);

    const isAvailable = remainingSlots >= requested;

    return res.status(200).json({
      success: true,
      message: isAvailable
        ? "Tour is available"
        : "Not enough slots available",
      data: {
        tourId,
        date: requestDate,
        totalSlots: tour.availableSlots,
        bookedSlots,
        remainingSlots,
        requested,
        isAvailable,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
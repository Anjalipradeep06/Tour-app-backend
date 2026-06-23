import Tour from "../models/Tour.js";
import Destination from "../models/Destination.js";

/* ==============================
   CREATE TOUR
============================== */
export const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    const populatedTour = await Tour.findById(tour._id).populate(
      "destination",
      "name country continent bannerImage galleryImages rating"
    );

    return res.status(201).json({
      success: true,
      message: "Tour created successfully",
      tour: populatedTour,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create tour",
    });
  }
};

/* ==============================
   GET ALL TOURS (WITH PAGINATION)
============================== */
export const getAllTours = async (req, res) => {
  try {
    const {
      search,
      country,
      continent,
      activity,
      minPrice,
      maxPrice,
      duration,
      minRating,
      startDate,
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    // ---------------- SEARCH ----------------
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // ---------------- DESTINATION FILTER ----------------
    if (country || continent) {
      const destinationFilter = {};

      if (country) destinationFilter.country = country;
      if (continent) destinationFilter.continent = continent;

      const destinations = await Destination.find(destinationFilter).select("_id");

      filter.destination = {
        $in: destinations.map((d) => d._id),
      };
    }

    // ---------------- PRICE FILTER ----------------
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // ---------------- DURATION ----------------
    if (duration) {
      filter.duration = { $lte: Number(duration) };
    }

    // ---------------- ACTIVITY ----------------
    if (activity) {
      filter.activities = {
        $regex: activity,
        $options: "i",
      };
    }

    // ---------------- RATING ----------------
    if (minRating) {
      filter.averageRating = {
        $gte: Number(minRating),
      };
    }

    // ---------------- START DATE ----------------
    if (startDate) {
      filter.startDates = {
        $elemMatch: { $gte: new Date(startDate) },
      };
    }

    // ---------------- SORT ----------------
    let sortOption = { createdAt: -1 };

    switch (sort) {
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "rating_desc":
        sortOption = { averageRating: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // ---------------- PAGINATION ----------------
    const pageNumber = Math.max(1, parseInt(page) || 1);
    const limitNumber = Math.max(1, parseInt(limit) || 12);
    const skip = (pageNumber - 1) * limitNumber;

    // ---------------- DB CALLS ----------------
    const [tours, total] = await Promise.all([
      Tour.find(filter)
        .populate(
          "destination",
          "name country continent bannerImage galleryImages rating"
        )
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber),

      Tour.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      success: true,
      message: "Tours fetched successfully",
      tours,

      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tours",
    });
  }
};

/* ==============================
   GET TOUR BY ID
============================== */
export const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate(
      "destination",
      "name country continent bannerImage galleryImages rating"
    );

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tour fetched successfully",
      tour,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tour",
    });
  }
};

/* ==============================
   UPDATE TOUR
============================== */
export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate(
      "destination",
      "name country continent bannerImage galleryImages rating"
    );

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tour updated successfully",
      tour,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update tour",
    });
  }
};

/* ==============================
   DELETE TOUR
============================== */
export const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tour deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete tour",
    });
  }
};
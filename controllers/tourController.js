import Tour from "../models/Tour.js";
import Destination from "../models/Destination.js";

/* -----------------------------
   Create Tour
------------------------------*/
export const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    const populatedTour = await Tour.findById(
      tour._id
    ).populate(
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
      message:
        error.message || "Failed to create tour",
    });
  }
};

/* -----------------------------
   Get All Tours
------------------------------*/
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

    // Search
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Destination filters
    if (country || continent) {
      const destinationFilter = {};

      if (country) {
        destinationFilter.country = country;
      }

      if (continent) {
        destinationFilter.continent = continent;
      }

      const destinations =
        await Destination.find(
          destinationFilter
        ).select("_id");

      filter.destination = {
        $in: destinations.map((d) => d._id),
      };
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Duration filter
    if (duration) {
      filter.duration = {
        $lte: Number(duration),
      };
    }

    // Activity filter
    if (activity) {
      filter.activities = {
        $regex: activity,
        $options: "i",
      };
    }

    // Rating filter
    if (minRating) {
      filter.averageRating = {
        $gte: Number(minRating),
      };
    }

    // Start date filter
    if (startDate) {
      filter.startDates = {
        $elemMatch: {
          $gte: new Date(startDate),
        },
      };
    }

    // Sorting
    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "price_asc":
        sortOption = { price: 1 };
        break;

      case "price_desc":
        sortOption = { price: -1 };
        break;

      case "rating_desc":
        sortOption = {
          averageRating: -1,
        };
        break;

      case "newest":
      default:
        sortOption = {
          createdAt: -1,
        };
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip =
      (pageNumber - 1) * limitNumber;

    const tours = await Tour.find(filter)
      .populate(
        "destination",
        "name country continent bannerImage galleryImages rating"
      )
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const total = await Tour.countDocuments(
      filter
    );

    return res.status(200).json({
      success: true,
      message: "Tours fetched successfully",
      tours,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      count: tours.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to fetch tours",
    });
  }
};

/* -----------------------------
   Get Tour By ID
------------------------------*/
export const getTourById = async (
  req,
  res
) => {
  try {
    const tour = await Tour.findById(
      req.params.id
    ).populate(
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
      message:
        error.message || "Failed to fetch tour",
    });
  }
};

/* -----------------------------
   Update Tour
------------------------------*/
export const updateTour = async (
  req,
  res
) => {
  try {
    const tour =
      await Tour.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).populate(
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
      message:
        error.message || "Failed to update tour",
    });
  }
};

/* -----------------------------
   Delete Tour
------------------------------*/
export const deleteTour = async (
  req,
  res
) => {
  try {
    const tour =
      await Tour.findByIdAndDelete(
        req.params.id
      );

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
      message:
        error.message || "Failed to delete tour",
    });
  }
};
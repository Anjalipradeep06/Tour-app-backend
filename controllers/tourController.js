import Tour from "../models/Tour.js";

const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    const populatedTour = await Tour.findById(tour._id).populate(
      "destination",
      "name country continent bannerImage galleryImages rating"
    );

    res.status(201).json({
      message: "Tour created successfully",
      tour: populatedTour,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllTours = async (req, res) => {
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
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    let filter = {};

    // 🔎 SEARCH (title, description)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 🌍 DESTINATION FILTER
    if (country || continent) {
      filter["destination"] = {};
    }

    // 💰 PRICE RANGE
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // ⏱ DURATION
    if (duration) {
      filter.duration = Number(duration);
    }

    // 🎯 ACTIVITY FILTER (array contains)
    if (activity) {
      filter.activities = { $in: [activity] };
    }

    // ⭐ RATING FILTER
    if (minRating) {
      filter.averageRating = { $gte: Number(minRating) };
    }

    // 📅 START DATE FILTER
    if (startDate) {
      filter.startDates = {
        $elemMatch: {
          $gte: new Date(startDate),
        },
      };
    }

    // 🔃 SORTING
    let sortOption = {};

    if (sort) {
      if (sort === "price_asc") sortOption.price = 1;
      if (sort === "price_desc") sortOption.price = -1;
      if (sort === "rating_desc") sortOption.averageRating = -1;
      if (sort === "newest") sortOption.createdAt = -1;
    } else {
      sortOption.createdAt = -1; // default
    }

    // 📄 PAGINATION
    const skip = (page - 1) * limit;

    const tours = await Tour.find(filter)
      .populate(
        "destination",
        "name country continent bannerImage galleryImages rating"
      )
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Tour.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      count: tours.length,
      tours,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate(
      "destination",
      "name country continent bannerImage galleryImages rating"
    );

    if (!tour) {
      return res.status(404).json({
        message: "Tour not found",
      });
    }

    res.status(200).json(tour);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!tour) {
      return res.status(404).json({
        message: "Tour not found",
      });
    }

    res.status(200).json({
      message: "Tour updated successfully",
      tour,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(
      req.params.id
    );

    if (!tour) {
      return res.status(404).json({
        message: "Tour not found",
      });
    }

    res.status(200).json({
      message: "Tour deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
};
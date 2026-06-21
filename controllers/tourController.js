import Tour from "../models/Tour.js";

/* -----------------------------
   Create Tour
------------------------------*/
const createTour = async (req, res) => {
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

/* -----------------------------
   Get All Tours (Filters + Pagination)
------------------------------*/
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

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (country) filter.country = country;
    if (continent) filter.continent = continent;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (duration) filter.duration = Number(duration);

    if (activity) {
      filter.activities = { $in: [activity] };
    }

    if (minRating) {
      filter.averageRating = { $gte: Number(minRating) };
    }

    if (startDate) {
      filter.startDates = {
        $elemMatch: { $gte: new Date(startDate) },
      };
    }

    let sortOption = {};

    if (sort) {
      if (sort === "price_asc") sortOption.price = 1;
      if (sort === "price_desc") sortOption.price = -1;
      if (sort === "rating_desc") sortOption.averageRating = -1;
      if (sort === "newest") sortOption.createdAt = -1;
    } else {
      sortOption.createdAt = -1;
    }

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

    return res.status(200).json({
      success: true,
      message: "Tours fetched successfully",
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      count: tours.length,
      tours,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tours",
    });
  }
};

/* -----------------------------
   Get Tour By ID
------------------------------*/
const getTourById = async (req, res) => {
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

/* -----------------------------
   Update Tour
------------------------------*/
const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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

/* -----------------------------
   Delete Tour
------------------------------*/
const deleteTour = async (req, res) => {
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

export {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
};
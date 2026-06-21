import Destination from "../models/Destination.js";
import Tour from "../models/Tour.js";

/* -----------------------------
   Create Destination
------------------------------*/
const createDestination = async (req, res) => {
  try {
    const destination = await Destination.create({
      ...req.body,
      bannerImage: req.files?.bannerImage?.[0]?.path || "",
      galleryImages: req.files?.galleryImages?.map((img) => img.path) || [],
    });

    return res.status(201).json({
      success: true,
      message: "Destination created successfully",
      destination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -----------------------------
   Get All Destinations
------------------------------*/
const getAllDestinations = async (req, res) => {
  try {
    const { search, continent, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ];
    }

    if (continent) {
      filter.continent = continent;
    }

    const skip = (page - 1) * limit;

    const destinations = await Destination.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Destination.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Destinations fetched successfully",
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      count: destinations.length,
      destinations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -----------------------------
   Featured Destinations
------------------------------*/
const getFeaturedDestinations = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;

    const destinations = await Destination.find({
      isFeatured: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Featured destinations fetched successfully",
      destinations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -----------------------------
   By Continent
------------------------------*/
const getDestinationsByContinent = async (req, res) => {
  try {
    const destinations = await Destination.find({
      continent: req.params.continent,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Destinations fetched successfully",
      destinations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -----------------------------
   Popular Destinations
------------------------------*/
const getPopularDestinations = async (req, res) => {
  try {
    const query = { isPopular: true };

    if (req.params.continent) {
      query.continent = req.params.continent;
    }

    const limit = Number(req.query.limit) || 6;

    const destinations = await Destination.find(query)
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Popular destinations fetched successfully",
      destinations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -----------------------------
   Get Destination By ID
------------------------------*/
const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    const tours = await Tour.find({
      destination: destination._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Destination details fetched successfully",
      destination,
      tours,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createDestination,
  getAllDestinations,
  getFeaturedDestinations,
  getDestinationsByContinent,
  getPopularDestinations,
  getDestinationById,
};
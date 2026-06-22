import Tour from "../models/Tour.js";
import Destination from "../models/Destination.js";

/* -----------------------------
   Get All Tours (Search + Filters + Pagination)
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
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    /* -----------------------------
       Search
    ------------------------------*/
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

    /* -----------------------------
       Destination Filters
    ------------------------------*/
    if (country || continent) {
      const destinationFilter = {};

      if (country) {
        destinationFilter.country = country;
      }

      if (continent) {
        destinationFilter.continent = continent;
      }

      const destinations =
        await Destination.find(destinationFilter)
          .select("_id");

      filter.destination = {
        $in: destinations.map((d) => d._id),
      };
    }

    /* -----------------------------
       Price Filter
    ------------------------------*/
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    /* -----------------------------
       Duration Filter
    ------------------------------*/
    if (duration) {
      filter.duration = {
        $lte: Number(duration),
      };
    }

    /* -----------------------------
       Activity Filter
    ------------------------------*/
    if (activity) {
      filter.activities = {
        $regex: activity,
        $options: "i",
      };
    }

    /* -----------------------------
       Rating Filter
    ------------------------------*/
    if (minRating) {
      filter.averageRating = {
        $gte: Number(minRating),
      };
    }

    /* -----------------------------
       Start Date Filter
    ------------------------------*/
    if (startDate) {
      filter.startDates = {
        $elemMatch: {
          $gte: new Date(startDate),
        },
      };
    }

    /* -----------------------------
       Sorting
    ------------------------------*/
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
        break;
    }

    /* -----------------------------
       Pagination
    ------------------------------*/
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const tours = await Tour.find(filter)
      .populate(
        "destination",
        "name country continent bannerImage galleryImages rating"
      )
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const total = await Tour.countDocuments(filter);

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
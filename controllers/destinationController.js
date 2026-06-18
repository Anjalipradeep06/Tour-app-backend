import Destination from "../models/Destination.js";

const createDestination = async (
  req,
  res
) => {
  try {
    const destination =
      await Destination.create({
        ...req.body,

        bannerImage:
          req.files.bannerImage?.[0]
            ?.path,

        galleryImages:
          req.files.galleryImages?.map(
            (img) => img.path
          ),
      });

    res.status(201).json(
      destination
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getFeaturedDestinations =
  async (req, res) => {
    try {
      const data =
        await Destination.aggregate([
          {
            $group: {
              _id: "$continent",

              bannerImage: {
                $first:
                  "$bannerImage",
              },

              totalDestinations:
                {
                  $sum: 1,
                },
            },
          },
        ]);

      res.status(200).json(
        data
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  const getDestinationsByContinent =
  async (req, res) => {
    try {
      const destinations =
        await Destination.find({
          continent:
            req.params.continent,
        });

      res.status(200).json(
        destinations
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  const getPopularDestinations =
  async (req, res) => {
    try {
      const destinations =
        await Destination.find({
          continent:
            req.params.continent,

          isPopular: true,
        });

      res.status(200).json(
        destinations
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  export {
  createDestination,
  getFeaturedDestinations,
  getDestinationsByContinent,
  getPopularDestinations,
};
const Rating = require("../../models/ratingModel");
const asyncHandler = require("express-async-handler");

const getallRating = asyncHandler(async (req, res) => {
  try {
    // Only get active ratings, sorted by order
    const ratings = await Rating.find({ status: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json(ratings);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getallRating,
};


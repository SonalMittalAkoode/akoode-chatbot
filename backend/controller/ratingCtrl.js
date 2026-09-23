const Rating = require("../models/ratingModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createRating = asyncHandler(async (req, res) => {
  try {
    const newRating = await Rating.create(req.body);
    const message = {
      status: "success",
      message: "Rating Added successfully",
      data: newRating,
    };
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});

const updateRating = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedRating = await Rating.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const message = {
      status: "success",
      message: "Rating updated successfully",
      data: updatedRating,
    };
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteRating = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedRating = await Rating.findByIdAndDelete(id);
    const message = {
      status: "success",
      message: "Rating Deleted successfully",
      data: deletedRating,
    };
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});

const getRating = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const rating = await Rating.findById(id);
    const message = {
      status: "success",
      message: "Rating fetched successfully",
      data: rating,
    };
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});

const getallRating = asyncHandler(async (req, res) => {
  try {
    const ratings = await Rating.find().sort({ order: 1, createdAt: -1 });
    res.json(ratings);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createRating,
  updateRating,
  deleteRating,
  getRating,
  getallRating,
};


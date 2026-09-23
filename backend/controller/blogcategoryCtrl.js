const Blogcategory = require("../models/blogcategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createBlogcategory = asyncHandler(async (req, res) => {
  try {
    const newBlogcategory = await Blogcategory.create(req.body);
    const message={
      "status":"success",
      "message":"Data Add sucessfully",
      "data":newBlogcategory
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const updateBlogcategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedBlogcategory = await Blogcategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
     const message={
      "status":"success",
      "message":"Data updated sucessfully",
      "data":updatedBlogcategory
    }
    res.json(message);
    // res.json(updatedBlogcategory);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteBlogcategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedBlogcategory = await Blogcategory.findByIdAndDelete(id);
    if (!deletedBlogcategory) {
      return res.status(404).json({ status: "error", message: "Blog category not found", data: null });
    }

    const message={
      "status":"success",
      "message":"Data deleted successfully",
      "data":deletedBlogcategory
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getBlogcategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaBlogcategory = await Blogcategory.findById(id);
    if (!getaBlogcategory) {
      return res.status(404).json({ status: "error", message: "Blog category not found", data: null });
    }
    const message={
      "status":"success",
      "message":"Data fetched successfully",
      "data":getaBlogcategory
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getallBlogcategory= asyncHandler(async (req, res) => {
  try {
    const getallBlogcategory= await Blogcategory.find();
    res.json(getallBlogcategory);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createBlogcategory,
  updateBlogcategory,
  deleteBlogcategory,
  getBlogcategory,
  getallBlogcategory,
};

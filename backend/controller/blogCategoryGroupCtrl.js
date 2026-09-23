const BlogCategoryGroup = require("../models/blogCategoryGroupModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createBlogCategoryGroup = asyncHandler(async (req, res) => {
  try {
    const newGroup = await BlogCategoryGroup.create(req.body);
    const message = {
      status: "success",
      message: "Data Add sucessfully",
      data: newGroup,
    };
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlogCategoryGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedGroup = await BlogCategoryGroup.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const message = {
      status: "success",
      message: "Data updated sucessfully",
      data: updatedGroup,
    };
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlogCategoryGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedGroup = await BlogCategoryGroup.findByIdAndDelete(id);
    if (!deletedGroup) {
      return res.status(404).json({ status: "error", message: "Category group not found", data: null });
    }
    const message = {
      status: "success",
      message: "Data deleted successfully",
      data: deletedGroup,
    };
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});

const getBlogCategoryGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const group = await BlogCategoryGroup.findById(id).populate("categoryIds");
    if (!group) {
      return res.status(404).json({ status: "error", message: "Category group not found", data: null });
    }
    const message = {
      status: "success",
      message: "Data fetched successfully",
      data: group,
    };
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});

const getallBlogCategoryGroup = asyncHandler(async (req, res) => {
  try {
    const groups = await BlogCategoryGroup.find()
      .populate("categoryIds")
      .sort({ order: 1, createdAt: 1 });
    res.json(groups);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlogCategoryGroup,
  updateBlogCategoryGroup,
  deleteBlogCategoryGroup,
  getBlogCategoryGroup,
  getallBlogCategoryGroup,
};

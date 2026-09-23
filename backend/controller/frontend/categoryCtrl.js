const Category = require("../../models/categoryModel.js");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId.js");


const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaCategory = await Category.findById(id).lean();
    res.json(getaCategory);
  } catch (error) {
    throw new Error(error);
  }
});
const getallCategory = asyncHandler(async (req, res) => {
  try {
    const getallCategory = await Category.find({"status":true}).lean();
    res.json(getallCategory);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  getCategory,
  getallCategory,
};

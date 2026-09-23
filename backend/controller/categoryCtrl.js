const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId.js");
const slugify = require("slugify");
const { uploadPhoto, categoryImgResize } = require("../middlewares/uploadImage");

const createCategory = asyncHandler(async (req, res) => {
  try {
   if(req.files){
      const processedImages  =await categoryImgResize(req);
      // console.log("newBuilderimage")
      // console.log(processedImages)
      if (processedImages.length > 0) {
        // ✅ Append logo filename to req.body
        req.body.logoimage = "public/images/category/"+processedImages[0];
      }
    }
    req.body.slug  = slugify(req.body.slug.toLowerCase());
    const newCategory = await Category.create(req.body);
    const message={
      "status":"success",
      "message":"Data Add sucessfully",
      "data":newCategory
    }
    res.json(message);
    // const newCategory = await Category.create(req.body);
    // res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    if(req.files){
      const processedImages  =await categoryImgResize(req);
      if (processedImages.length > 0) {
        req.body.logoimage = "public/images/category/"+processedImages[0];
      }
    }
    req.body.slug  = slugify(req.body.slug.toLowerCase());
    
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // res.json(updatedCategory);
     const message={
      "status":"success",
      "message":"Data updated sucessfully",
      "data":updatedCategory
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ status: "error", message: "Category not found", data: null });
    }
    const message={
      "status":"success",
      "message":"Data deleted successfully",
      "data":deletedCategory
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaCategory = await Category.findById(id);
    if (!getaCategory) {
      return res.status(404).json({ status: "error", message: "Category not found", data: null });
    }
    const message={
      "status":"success",
      "message":"Data fetched successfully",
      "data":getaCategory
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getallCategory = asyncHandler(async (req, res) => {
  try {
    let limit=100;
    let skip=1;
    

    if (req.query.limit ) {
      limit=req.query.limit;
      skip=req.query.skip;     
  }
    
    const [getallCategory, totalCount] = await Promise.all([
            Category.find()
              .sort({ _id: -1})
              .skip((skip - 1) * limit)
              .limit(limit)
              .lean(),
          
            Category.countDocuments() // total matching without skip/limit
          ]);
            res.status(200).json({
          items: getallCategory,
          totalCount: totalCount,
          currentPage: skip,
          totalPages: Math.ceil(totalCount / limit)
        });
    // const getallCategory = await Category.find();
    // res.json(getallCategory);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,
};

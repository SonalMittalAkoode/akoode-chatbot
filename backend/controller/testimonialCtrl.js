const Testimonial = require("../models/testimonialModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { uploadPhoto, testimonialImgResize } = require("../middlewares/uploadImage");

const createTestimonial = asyncHandler(async (req, res) => {
  try {
    if(req.files){
      const processedImages  =await testimonialImgResize(req);
      if (processedImages.length > 0) {
        // ✅ Append logo filename to req.body
        req.body.logoimage = "public/images/testimonial/"+processedImages[0];
      }
    }
    const newTestimonial = await Testimonial.create(req.body);
    const message={
      "status":"success",
      "message":"Data Add sucessfully",
      "data":newTestimonial
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    
    if(req.files){
        const processedImages  =await testimonialImgResize(req);
        console.log("newTestimonialimage")
        console.log(processedImages)
        if (processedImages.length > 0) {
          // ✅ Append logo filename to req.body
          req.body.logoimage = "public/images/testimonial/"+processedImages[0];
        }
      }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const message={
      "status":"success",
      "message":"Data updated sucessfully",
      "data":updatedTestimonial
    }
    res.json(message);
    // res.json(updatedTestimonial);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
    if (!deletedTestimonial) {
      return res.status(404).json({ status: "error", message: "Testimonial not found", data: null });
    }

    const message={
      "status":"success",
      "message":"Data deleted successfully",
      "data":deletedTestimonial
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaTestimonial = await Testimonial.findById(id);
    if (!getaTestimonial) {
      return res.status(404).json({ status: "error", message: "Testimonial not found", data: null });
    }
    const message={
      "status":"success",
      "message":"Data fetched successfully",
      "data":getaTestimonial
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getallTestimonial = asyncHandler(async (req, res) => {
  try {
    const getallTestimonial = await Testimonial.find();
    res.json(getallTestimonial);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonial,
  getallTestimonial,
};

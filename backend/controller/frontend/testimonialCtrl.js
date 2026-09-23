const Testimonial = require("../../models/testimonialModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId");

const getTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaTestimonial = await Testimonial.findById(id).lean();
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
    const getallTestimonial = await Testimonial.find({"status":true}).lean();
    res.json(getallTestimonial);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  getTestimonial,
  getallTestimonial,
};

const EnquiryBrochure = require("../../models/enqjobModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId");
const { enqueryBrochureMail } = require("../../middlewares/enqueryMail");


const createEnquiryBrochure = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await EnquiryBrochure.create(req.body);
    const getProperty = await Property.findById(req.body.propertyid)
    req.body.propertyname=getProperty.title
    const emailsend  =await enqueryBrochureMail(req, res);
    const message={
      "status":"success",
      "message":"Thank you for your message. It has been sent.",
      "data":newEnquiry
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const updateEnquiryBrochure = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedEnquiryBrochure = await EnquiryBrochure.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedEnquiryBrochure);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteEnquiryBrochure = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedEnquiryBrochure = await EnquiryBrochure.findByIdAndDelete(id);
    res.json(deletedEnquiryBrochure);
  } catch (error) {
    throw new Error(error);
  }
});
const getEnquiryBrochure = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaEnquiryBrochure = await EnquiryBrochure.findById(id);
    res.json(getaEnquiryBrochure);
  } catch (error) {
    throw new Error(error);
  }
});
const getallEnquiryBrochure = asyncHandler(async (req, res) => {
  try {
    const getallEnquiryBrochure = await EnquiryBrochure.find();
    res.json(getallEnquiryBrochure);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createEnquiryBrochure,
  updateEnquiryBrochure,
  deleteEnquiryBrochure,
  getEnquiryBrochure,
  getallEnquiryBrochure,
};

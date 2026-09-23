const Enquiry = require("../../models/enqModelProperty");
const Seller = require("../../models/sellerModel");
const Property = require("../../models/propertyModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId");
const { enqueryPropertyMail,enqueryPropertyMailSeller } = require("../../middlewares/enqueryMail");


const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    //  console.log(req.body.propertyid)
    // console.log(req.body.sellerid)
const getProperty = await Property.findById(req.body.propertyid)
const getaBuilder = await Seller.findById(req.body.sellerid);
// console.log(getProperty.title)
// console.log(getaBuilder)
// console.log(getaBuilder.title)

req.body.propertyname=getProperty.title
req.body.buildername=getaBuilder.title
req.body.builderemail=getaBuilder.email


    const emailsend  =await enqueryPropertyMail(req, res);
    const emailsendseller  =await enqueryPropertyMailSeller(req, res);
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
const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
    res.json(deletedEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});
const getEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaEnquiry = await Enquiry.findById(id);
    res.json(getaEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});
const getallEnquiry = asyncHandler(async (req, res) => {
  try {
    const getallEnquiry = await Enquiry.find();
    res.json(getallEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
};

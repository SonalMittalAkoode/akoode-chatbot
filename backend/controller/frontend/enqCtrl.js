const Enquiry = require("../../models/enqModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId");

const { enqueryContactMail } = require("../../middlewares/enqueryMail");

const createEnquiry = asyncHandler(async (req, res) => {
  try {
    // 1️⃣ Save enquiry to DB (core business logic – untouched)
    const newEnquiry = await Enquiry.create(req.body);

    // 2️⃣ Trigger email notification

    const emailResult = await enqueryContactMail(req);

    if (!emailResult.success) {
      console.error(
        "Enquiry saved but email sending failed:",
        emailResult.error
      );
    }

    const message = {
      status: "success",
      message: "Thank you for your message. It has been sent.",
      data: newEnquiry,
    };

    return res.status(200).json(message);

  } catch (error) {
    console.error("❌ Create Enquiry Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to create enquiry. Please try again later.",
      error: error.message,
    });
  }
});

const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

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

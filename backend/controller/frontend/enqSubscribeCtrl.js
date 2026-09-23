const EnquirySubscribe = require("../../models/enqSubscribeModel");
const asyncHandler = require("express-async-handler");
const {
  enqueryWelcomeSubscriberMail,
} = require("../../middlewares/enqueryMail");

const createEnquirySubscribe = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").toLowerCase().trim();

  if (!email) {
    return res.status(400).json({
      status: "fail",
      message: "Email is required",
    });
  }

  const existingSubscriber = await EnquirySubscribe.findOne({ email });
  if (existingSubscriber) {
    return res.status(409).json({
      status: "fail",
      message: "This email is already subscribed",
    });
  }

  const subscriber = await EnquirySubscribe.create({ email });

  try {
    await enqueryWelcomeSubscriberMail(req);
  } catch (mailError) {
    console.error("Welcome subscriber email failed (subscription still saved):", mailError);
  }

  res.status(201).json({
    status: "success",
    message: "Subscription successful",
    data: subscriber,
  });
});

module.exports = {
  createEnquirySubscribe,
};
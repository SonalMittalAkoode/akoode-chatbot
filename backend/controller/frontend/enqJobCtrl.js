// controllers/generalEnquiry.controller.js
const GeneralEnquiry = require('../../models/enqjobModel');
const { generalEnquiryMail } = require('../../middlewares/enqueryMail');

const createEnquiry = async (req, res) => {
  try {
    const data = {
      ...req.body,
      resume: req.file?.path || ""
    };


    const enquiry = await GeneralEnquiry.create(data);
    const emailResult = await generalEnquiryMail(req, res);
    if (!emailResult.success) {
      console.error("Email sending failed, but enquiry saved:", emailResult.error || emailResult.message);
    }
    res.status(201).json({ success: true, message: "Application submitted successfully", enquiry });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { createEnquiry };

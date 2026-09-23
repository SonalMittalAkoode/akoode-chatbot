// controllers/generalEnquiryAdmin.controller.js
const path = require("path");
const GeneralEnquiry = require("../models/enqjobModel");

// Get All Enquiries with simple pagination
const getAllEnquiries = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const enquiries = await GeneralEnquiry.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await GeneralEnquiry.countDocuments();

    res.json({
      enquiries,
      page,
      totalPages: Math.ceil(total / limit),
      totalCount: total
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete enquiry
const deleteEnquiry = async (req, res) => {
  try {
    const deleted = await GeneralEnquiry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.json({ status: "success", message: "Enquiry deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Download resume
const downloadResume = async (req, res) => {
  try {
    const enquiry = await GeneralEnquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ error: "Not found" });

    const resumePath = path.join(process.cwd(), enquiry.resume);
    return res.download(resumePath);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllEnquiries,
  downloadResume,
  deleteEnquiry,
};

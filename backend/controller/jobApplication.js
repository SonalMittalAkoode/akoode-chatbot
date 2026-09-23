const path = require("path");
const JobApplication = require("../models/jobApplication");

// GET all applications (admin) with simple pagination
const getAllApplications = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      JobApplication.find()
        .populate("jobId", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      JobApplication.countDocuments()
    ]);

    res.json({
      applications,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single application (admin)
const getApplicationById = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ error: "Not found" });

    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DOWNLOAD resume file (admin)
const downloadResume = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application || !application.resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const filePath = path.join(process.cwd(), application.resume);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// OPTIONAL: delete application (admin)
const deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ error: "Not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  downloadResume,
  deleteApplication,
};

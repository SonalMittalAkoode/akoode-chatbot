const express = require("express");
const router = express.Router();
const { authMiddleware, canAccessEnquiry } = require("../middlewares/authMiddleware");
const {
  getAllApplications,
  getApplicationById,
  downloadResume,
  deleteApplication,
} = require("../controller/jobApplication");

// ?page=1&limit=10
router.get("/applications", authMiddleware, canAccessEnquiry, getAllApplications);
router.get("/applications/:id", authMiddleware, canAccessEnquiry, getApplicationById);
router.get("/applications/:id/resume", authMiddleware, canAccessEnquiry, downloadResume);
router.delete("/applications/:id", authMiddleware, canAccessEnquiry, deleteApplication);

module.exports = router;

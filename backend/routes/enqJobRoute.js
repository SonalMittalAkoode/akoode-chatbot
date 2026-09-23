const express = require("express");
const router = express.Router();
const { authMiddleware, canAccessEnquiry } = require("../middlewares/authMiddleware");
const {
  getAllEnquiries,
  downloadResume,
  deleteEnquiry,
} = require("../controller/enqJobCtrl");

router.get("/enquiries", authMiddleware, canAccessEnquiry, getAllEnquiries);
router.get("/enquiries/:id/resume", authMiddleware, canAccessEnquiry, downloadResume);
router.delete("/enquiries/:id", authMiddleware, canAccessEnquiry, deleteEnquiry);

module.exports = router;

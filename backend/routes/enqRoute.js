const express = require("express");
const {
  // createEnquiry,
  // updateEnquiry,
  deleteEnquiry,
  getDashboardEnquiryStats,
  // getEnquiry,
  getallEnquiry,
} = require("../controller/enqCtrl.js");
const { authMiddleware, isAdmin, canAccessEnquiry, canAccessDashboardStats } = require("../middlewares/authMiddleware");
const router = express.Router();

// router.post("/", createEnquiry);
// router.put("/:id", authMiddleware, isAdmin, updateEnquiry);
router.get("/stats", authMiddleware, canAccessDashboardStats, getDashboardEnquiryStats);
router.delete("/:id", authMiddleware, canAccessEnquiry, deleteEnquiry);
// router.get("/:id", getEnquiry);
router.get("/", authMiddleware, canAccessEnquiry, getallEnquiry);

module.exports = router;

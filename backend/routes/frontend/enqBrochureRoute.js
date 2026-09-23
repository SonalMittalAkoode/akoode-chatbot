const express = require("express");
const {
  createEnquiryBrochure,
  updateEnquiryBrochure,
  deleteEnquiryBrochure,
  getEnquiryBrochure,
  getallEnquiryBrochure,
} = require("../../controller/frontend/enqBrochureCtrl.js");
const { authMiddleware, isSuperAdmin } = require("../../middlewares/authMiddleware");
const router = express.Router();

router.post("/", createEnquiryBrochure);
router.put("/:id", authMiddleware, isSuperAdmin, updateEnquiryBrochure);
router.delete("/:id", authMiddleware, isSuperAdmin, deleteEnquiryBrochure);
router.get("/:id", getEnquiryBrochure);
router.get("/", getallEnquiryBrochure);

module.exports = router;

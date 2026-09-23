const express = require("express");
const {
  createEnquiryProperty,
  updateEnquiryProperty,
  deleteEnquiryProperty,
  getEnquiryProperty,
  getallEnquiryProperty,
} = require("../controller/enqCtrlProperty.js");
const { authMiddleware, isSuperAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", createEnquiryProperty);
router.put("/:id", authMiddleware, isSuperAdmin, updateEnquiryProperty);
router.delete("/:id", authMiddleware, isSuperAdmin, deleteEnquiryProperty);
router.get("/:id", getEnquiryProperty);
router.get("/", getallEnquiryProperty);

module.exports = router;

const express = require("express");
const {
  createEnquiryLanding,
  updateEnquiryLanding,
  deleteEnquiryLanding,
  getEnquiryLanding,
  getallEnquiryLanding,
} = require("../controller/enqCtrlLanding");
const { authMiddleware, isSuperAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", createEnquiryLanding);
router.put("/:id", authMiddleware, isSuperAdmin, updateEnquiryLanding);
router.delete("/:id", authMiddleware, isSuperAdmin, deleteEnquiryLanding);
router.get("/:id", getEnquiryLanding);
router.get("/", getallEnquiryLanding);

module.exports = router;

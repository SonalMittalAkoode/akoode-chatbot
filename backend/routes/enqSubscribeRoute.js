const express = require("express");
const {
  createEnquirySubscribe,
  updateEnquirySubscribe,
  deleteEnquirySubscribe,
  getEnquirySubscribe,
  getallEnquirySubscribe,
} = require("../controller/enqSubscribeCtrl.js");
const { authMiddleware, isSuperAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isSuperAdmin, createEnquirySubscribe);
router.put("/:id", authMiddleware, isSuperAdmin, updateEnquirySubscribe);
router.delete("/:id", authMiddleware, isSuperAdmin, deleteEnquirySubscribe);
router.get("/:id", getEnquirySubscribe);
router.get("/", authMiddleware, isSuperAdmin, getallEnquirySubscribe);

module.exports = router;

const express = require("express");
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
} = require("../../controller/frontend/enqCtrlProperty");
const { authMiddleware, isSuperAdmin } = require("../../middlewares/authMiddleware");
const router = express.Router();

router.post("/", createEnquiry);
router.put("/:id", authMiddleware, isSuperAdmin, updateEnquiry);
router.delete("/:id", authMiddleware, isSuperAdmin, deleteEnquiry);
router.get("/:id", getEnquiry);
router.get("/", getallEnquiry);

module.exports = router;

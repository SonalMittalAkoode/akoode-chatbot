const express = require("express");
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
} = require("../../controller/frontend/enqCtrl");
const { authMiddleware, isSuperAdmin } = require("../../middlewares/authMiddleware");
const router = express.Router();

router.post("/", createEnquiry);
router.put("/:id", authMiddleware, isSuperAdmin, updateEnquiry);
router.delete("/:id", authMiddleware, isSuperAdmin, deleteEnquiry);
router.get("/:id", authMiddleware, isSuperAdmin, getEnquiry);
router.get("/", authMiddleware, isSuperAdmin, getallEnquiry);

module.exports = router;

const express = require("express");

const { uploadPhoto, photoUploadMiddleware1 } = require("../middlewares/uploadImage");
const {
  createServices,
  updateServices,
  deleteServices,
  getServices,
  getallServices,
} = require("../controller/servicesCtrl.js");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, photoUploadMiddleware1, createServices);
router.put("/:id", authMiddleware, isAdmin, photoUploadMiddleware1, updateServices);
router.delete("/:id", authMiddleware, isAdmin, deleteServices);
router.get("/:id", getServices);
router.get("/", getallServices);

module.exports = router;

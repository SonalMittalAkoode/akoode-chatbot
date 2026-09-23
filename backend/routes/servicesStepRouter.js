const express = require("express");

const { uploadPhoto, photoUploadMiddleware1 } = require("../middlewares/uploadImage");
const {
  createServicesStep,
  updateServicesStep,
  deleteServicesStep,
  getServicesStep,
  getallServicesStep,
} = require("../controller/servicesstepCtrl.js");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, photoUploadMiddleware1, createServicesStep);
router.put("/:id", authMiddleware, isAdmin, photoUploadMiddleware1, updateServicesStep);
router.delete("/:id", authMiddleware, isAdmin, deleteServicesStep);
router.get("/:id", getServicesStep);
router.get("/", getallServicesStep);

module.exports = router;

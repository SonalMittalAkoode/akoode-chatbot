const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { photoUploadMiddleware1 } = require("../middlewares/uploadImage");
const {
  createServiceByCountry,
  updateServiceByCountry,
  deleteServiceByCountry,
  getServiceByCountry,
  getAllServiceByCountry,
} = require("../controller/serviceByCountryCtrl");

router.post("/", authMiddleware, isAdmin, photoUploadMiddleware1, createServiceByCountry);
router.put("/:id", authMiddleware, isAdmin, photoUploadMiddleware1, updateServiceByCountry);
router.delete("/:id", authMiddleware, isAdmin, deleteServiceByCountry);
router.get("/:id", getServiceByCountry);
router.get("/", getAllServiceByCountry);

module.exports = router;

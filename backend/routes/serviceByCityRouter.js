const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { photoUploadMiddleware1 } = require("../middlewares/uploadImage");
const {
  createServiceByCity,
  updateServiceByCity,
  deleteServiceByCity,
  getServiceByCity,
  getAllServiceByCity,
} = require("../controller/serviceByCityCtrl");

router.post("/", authMiddleware, isAdmin, photoUploadMiddleware1, createServiceByCity);
router.put("/:id", authMiddleware, isAdmin, photoUploadMiddleware1, updateServiceByCity);
router.delete("/:id", authMiddleware, isAdmin, deleteServiceByCity);
router.get("/:id", getServiceByCity);
router.get("/", getAllServiceByCity);

module.exports = router;

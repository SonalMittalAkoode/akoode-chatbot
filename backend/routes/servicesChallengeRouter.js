const express = require("express");
const { uploadPhoto ,photoUploadMiddleware1} = require("../middlewares/uploadImage.js");
const {
  createServiceschallenge,
  updateServiceschallenge,
  deleteServiceschallenge,
  getServiceschallenge,
  getallServiceschallenge,
} = require("../controller/serviceschallengeCtrl.js");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.post("/", authMiddleware,  isAdmin, photoUploadMiddleware1,createServiceschallenge);
router.put("/:id", authMiddleware, isAdmin, updateServiceschallenge);
router.delete("/:id", authMiddleware, isAdmin, deleteServiceschallenge);
router.get("/:id", getServiceschallenge);
router.get("/", getallServiceschallenge);

module.exports = router;

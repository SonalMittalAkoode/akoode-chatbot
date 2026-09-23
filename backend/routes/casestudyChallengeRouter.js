const express = require("express");
const { uploadPhoto ,photoUploadMiddleware1} = require("../middlewares/uploadImage.js");
const {
  createCasestudychallenge,
  updateCasestudychallenge,
  deleteCasestudychallenge,
  getCasestudychallenge,
  getallCasestudychallenge,
} = require("../controller/casestudychallengeCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.post("/", authMiddleware,  isAdmin, photoUploadMiddleware1,createCasestudychallenge);
router.put("/:id", authMiddleware, isAdmin, updateCasestudychallenge);
router.delete("/:id", authMiddleware, isAdmin, deleteCasestudychallenge);
router.get("/:id", getCasestudychallenge);
router.get("/", getallCasestudychallenge);

module.exports = router;

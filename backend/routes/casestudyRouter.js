const express = require("express");

// const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });
const { uploadPhoto } = require("../middlewares/uploadImage");

const {
  createCasestudy,
  updateCasestudy,
  deleteCasestudy,
  getCasestudy,
  getallCasestudy,
} = require("../controller/casestudyCtrl.js");
const { photoUploadMiddleware1} = require("../middlewares/uploadImage");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin,photoUploadMiddleware1,
 createCasestudy);
router.put("/:id", authMiddleware, isAdmin,photoUploadMiddleware1, updateCasestudy);
router.delete("/:id", authMiddleware, isAdmin, deleteCasestudy);
router.get("/:id", getCasestudy);
router.get("/", getallCasestudy);

module.exports = router;

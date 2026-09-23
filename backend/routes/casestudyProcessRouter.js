const express = require("express");
const { uploadPhoto ,photoUploadMiddleware1} = require("../middlewares/uploadImage.js");
const {
  createCasestudyprocess,
  updateCasestudyprocess,
  deleteCasestudyprocess,
  getCasestudyprocess,
  getallCasestudyprocess,
} = require("../controller/casestudyprocessCtrl.js");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.post("/", authMiddleware,  isAdmin, photoUploadMiddleware1,createCasestudyprocess);
router.put("/:id", authMiddleware, isAdmin, updateCasestudyprocess);
router.delete("/:id", authMiddleware, isAdmin, deleteCasestudyprocess);
router.get("/:id", getCasestudyprocess);
router.get("/", getallCasestudyprocess);

module.exports = router;

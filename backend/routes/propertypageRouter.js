const express = require("express");
// const { uploadPhoto ,photoUploadMiddleware} = require("../middlewares/uploadImage");
const {
  createPropertypage,
  updatePropertypage,
  deletePropertypage,
  getPropertypage,
  getallPropertypage,
} = require("../controller/propertypageCtrl.js");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.post("/", authMiddleware,  isAdmin,createPropertypage);
router.put("/:id", authMiddleware, isAdmin, updatePropertypage);
router.delete("/:id", authMiddleware, isAdmin, deletePropertypage);
router.get("/:id", getPropertypage);
router.get("/", getallPropertypage);

module.exports = router;

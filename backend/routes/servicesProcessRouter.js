const express = require("express");
const { uploadPhoto ,photoUploadMiddleware1} = require("../middlewares/uploadImage.js");
const {
  createServicesprocess,
  updateServicesprocess,
  deleteServicesprocess,
  getServicesprocess,
  getallServicesprocess,
} = require("../controller/servicesprocessCtrl.js");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.post("/", authMiddleware,  isAdmin, photoUploadMiddleware1,createServicesprocess);
router.put("/:id", authMiddleware, isAdmin, updateServicesprocess);
router.delete("/:id", authMiddleware, isAdmin, deleteServicesprocess);
router.get("/:id", getServicesprocess);
router.get("/", getallServicesprocess);

module.exports = router;

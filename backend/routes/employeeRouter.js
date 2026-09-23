const express = require("express");
const {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
  getallEmployee,
} = require("../controller/employeeCtrl.js");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");
const { uploadPhoto } = require("../middlewares/uploadImage.js");
const revalidateOnWrite = require("../utils/revalidateOnWrite");
const router = express.Router();

// Purge the frontend cache tag for this content type after any successful write.
router.use(revalidateOnWrite("employee"));

router.post("/", authMiddleware, isAdmin, uploadPhoto.array("image", 1), createEmployee);
router.put("/:id", authMiddleware, isAdmin, uploadPhoto.array("image", 1), updateEmployee);
router.delete("/:id", authMiddleware, isAdmin, deleteEmployee);
router.get("/:id", getEmployee);
router.get("/", getallEmployee);

module.exports = router;

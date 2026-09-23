const express = require("express");

// const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });
const { uploadPhoto } = require("../middlewares/uploadImage");

const {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getallBlog,
} = require("../controller/blogCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, uploadPhoto.array("logo", 10),
 createBlog);
router.put("/:id", authMiddleware, isAdmin,uploadPhoto.array("logo", 10), updateBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);
router.get("/:id", getBlog);
router.get("/", getallBlog);

module.exports = router;

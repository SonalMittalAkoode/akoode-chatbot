const express = require("express");
const {
  createBlogcategory,
  updateBlogcategory,
  deleteBlogcategory,
  getBlogcategory,
  getallBlogcategory,
} = require("../controller/blogcategoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const revalidateOnWrite = require("../utils/revalidateOnWrite");
const router = express.Router();

// Purge the frontend cache tag for this content type after any successful write.
router.use(revalidateOnWrite("blog-category"));

router.post("/", authMiddleware, isAdmin, createBlogcategory);
router.put("/:id", authMiddleware, isAdmin, updateBlogcategory);
router.delete("/:id", authMiddleware, isAdmin, deleteBlogcategory);
router.get("/:id", getBlogcategory);
router.get("/", getallBlogcategory);

module.exports = router;

const express = require("express");
const {
  createBlogCategoryGroup,
  updateBlogCategoryGroup,
  deleteBlogCategoryGroup,
  getBlogCategoryGroup,
  getallBlogCategoryGroup,
} = require("../controller/blogCategoryGroupCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const revalidateOnWrite = require("../utils/revalidateOnWrite");
const router = express.Router();

// Purge the frontend cache tag for this content type after any successful write.
router.use(revalidateOnWrite("blog-category"));

router.post("/", authMiddleware, isAdmin, createBlogCategoryGroup);
router.put("/:id", authMiddleware, isAdmin, updateBlogCategoryGroup);
router.delete("/:id", authMiddleware, isAdmin, deleteBlogCategoryGroup);
router.get("/:id", getBlogCategoryGroup);
router.get("/", getallBlogCategoryGroup);

module.exports = router;

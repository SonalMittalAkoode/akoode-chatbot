const express = require("express");

const {
  getBlog,
  getallBlog,
  getBlogSlug,
  getRelatedBlogs,
  incrementBlogView,
  getTrendingBlogs,
  searchBlogs,
} = require("../../controller/frontend/blogCtrl");
const router = express.Router();
router.get("/byid/:id", getBlog);
router.get("/list", getallBlog);
router.get("/search", searchBlogs);
router.get("/trending", getTrendingBlogs);
router.get("/slug/:slug", getBlogSlug);
router.get("/related/:id", getRelatedBlogs);
router.post("/slug/:slug/view", incrementBlogView);

module.exports = router;

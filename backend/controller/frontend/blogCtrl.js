const mongoose = require("mongoose");
const Blog = require("../../models/blogModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId");

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaBlog = await Blog.findById(id).populate("blogcategory").lean();
    if (!getaBlog) {
      return res.status(404).json({ status: "error", message: "Blog not found", data: null });
    }
    const message={
      "status":"success",
      "message":"Data fetched successfully",
      "data":getaBlog
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getallBlog = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const filter = { status: true };
    const { category } = req.query;
    if (category) {
      const ids = String(category)
        .split(",")
        .map((id) => id.trim())
        .filter((id) => mongoose.Types.ObjectId.isValid(id));
      if (ids.length === 1) {
        filter.blogcategory = ids[0];
      } else if (ids.length > 1) {
        filter.blogcategory = { $in: ids };
      }
    }

    const totalBlogs = await Blog.countDocuments(filter);
    const totalPages = Math.ceil(totalBlogs / limit);

    const getallBlog = await Blog.find(filter)
      .populate("blogcategory")
      .lean()
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      blogs: getallBlog,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalBlogs: totalBlogs,
        limit: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
});
const getBlogSlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  // validateMongoDbId(id);
  try {
    // Preview bypass: when a valid preview secret is supplied, drafts
    // (status: false) are also returned so admins can preview unpublished posts.
    const previewSecret = process.env.PREVIEW_SECRET || process.env.NEXT_PUBLIC_PREVIEW_SECRET;
    const isPreview = previewSecret && req.query?.preview === previewSecret;
    const query = isPreview ? { slug } : { slug, status: true };
    const getaBlog = await Blog.findOne(query).populate("blogcategory").populate("author").lean();
    if (!getaBlog) {
      return res.status(404).json({
        status: "error",
        message: "Blog not found",
        data: null,
      });
    }
    res.json({
      status: "success",
      message: "Data fetched successfully",
      data: getaBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const getRelatedBlogs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const limit = Number(req.query.limit) || 6;

  // Get base blog (only need its category)
  const base = await Blog.findById(id).select("blogcategory").lean();
  if (!base) return res.status(404).json({ status: "fail", message: "Blog not found" });

  // Fetch related (same category, exclude current)
  const related = await Blog.find({
    status: true,
    blogcategory: base.blogcategory,
    _id: { $ne: id },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.json({ status: "success", data: related });
});

// Fire-and-forget view counter, called once per detail-page load from the client
// (not tied to the SSR/ISR fetch, so cached page hits still count real visits).
const incrementBlogView = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  await Blog.updateOne({ slug, status: true }, { $inc: { views: 1 } });
  res.json({ status: "success" });
});

// Top N most-viewed published posts — powers /blog-new's live "Trending" section.
const getTrendingBlogs = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const trending = await Blog.find({ status: true })
    .populate("blogcategory")
    .sort({ views: -1, createdAt: -1 })
    .limit(limit)
    .lean();
  res.json({ status: "success", data: trending });
});

// Lightweight global search over ACTIVE blogs — powers the /blog search bar
// type-ahead. Matches title, meta description, and body; returns slim fields
// only so the payload stays a few KB (the full list endpoint ships entire
// rich-text bodies and is far too heavy for per-keystroke search).
const searchBlogs = asyncHandler(async (req, res) => {
  const q = String(req.query.q || "").trim();
  const limit = Math.min(Number(req.query.limit) || 8, 20);
  if (!q) {
    return res.json({ status: "success", data: [] });
  }
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");
  const results = await Blog.find({
    status: true,
    $or: [{ title: regex }, { metadescription: regex }, { description: regex }],
  })
    .select("title slug blogcategory publishedAt createdAt")
    .populate("blogcategory", "title")
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(limit)
    .lean();
  res.json({ status: "success", data: results });
});

module.exports = {
  getBlog,
  getallBlog,
  getBlogSlug,
  getRelatedBlogs,
  incrementBlogView,
  getTrendingBlogs,
  searchBlogs,
};

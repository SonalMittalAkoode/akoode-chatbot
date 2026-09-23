const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { blogImgResize } = require("../middlewares/uploadImage");
const EnquirySubscribe = require("../models/enqSubscribeModel");
const { blogNotificationSubscriberMail } = require("../middlewares/enqueryMail");
const slugify = require("slugify");
const revalidateFrontend = require("../utils/revalidateFrontend");

/**
 * Emails active subscribers about a blog — but only once per blog, ever.
 * Sends only when the blog is published (status !== false) and it hasn't been
 * notified before. On a successful send it flips `notifiedSubscribers` so future
 * edits (or draft→publish→draft→publish toggles) never re-notify the list.
 */
const notifySubscribersOnce = async (blogDoc, req) => {
  if (!blogDoc || blogDoc.status === false || blogDoc.notifiedSubscribers === true) {
    return;
  }
  try {
    const activeSubscribers = await EnquirySubscribe.find({ active: true }).lean();
    if (activeSubscribers.length === 0) return;

    const result = await blogNotificationSubscriberMail({
      blog: blogDoc,
      subscribers: activeSubscribers,
      req,
    });

    if (result?.success) {
      await Blog.findByIdAndUpdate(blogDoc._id, { notifiedSubscribers: true });
    }
  } catch (mailError) {
    console.error("Failed to notify subscribers:", mailError);
  }
};

const createBlog = asyncHandler(async (req, res) => {
  try {

    if (req.files) {
      const processedImages = await blogImgResize(req);
      if (processedImages.length > 0) {
        // ✅ Append logo filename to req.body
        req.body.logoimage = "public/images/blogs/" + processedImages[0];
      }
    }
    req.body.slug = slugify(req.body.slug.toLowerCase());
    if (typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    }
    // Created already-published (status defaults to true) → publishedAt starts now.
    if (req.body.status !== false && req.body.status !== "false") {
      req.body.publishedAt = new Date();
    }
    const newBlog = await Blog.create(req.body);

    revalidateFrontend({ slug: newBlog.slug, type: "blog" }).catch(() => {});

    // Notify subscribers once, only if this blog is created already published.
    await notifySubscribersOnce(newBlog, req);

    const message = {
      "status": "success",
      "message": "Data Add sucessfully",
      "data": newBlog
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const existingBlog = await Blog.findById(id).lean();
    if (!existingBlog) {
      return res.status(404).json({ status: "fail", message: "Blog not found" });
    }

    if (req.files) {
      const processedImages = await blogImgResize(req);
      console.log("newBlogimage")
      console.log(processedImages)
      if (processedImages.length > 0) {
        req.body.logoimage = "public/images/blogs/" + processedImages[0];
      }
    }
    req.body.slug = slugify(req.body.slug.toLowerCase());
    if (typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    }

    const updateData = { ...req.body };
    const unset = {};

    const incomingAuthorName =
      typeof req.body.authorName === "string" ? req.body.authorName.trim() : "";
    const hasCustomAuthor = incomingAuthorName.length > 0;
    const hasEmployeeAuthor =
      typeof req.body.author === "string" && req.body.author.trim().length > 0;

    // If custom author ("Other") is used, drop employee author reference.
    if (hasCustomAuthor) {
      updateData.authorName = incomingAuthorName;
      delete updateData.author;
      unset.author = 1;
    } else if (hasEmployeeAuthor) {
      // If employee author is used, drop any stale custom author name.
      delete updateData.authorName;
      unset.authorName = 1;
    }

    // A genuine draft → published transition: this must sort as a fresh post
    // (publishedAt = now), regardless of how old the document's createdAt is.
    const becamePublished =
      existingBlog.status === false &&
      updateData.status !== false && updateData.status !== "false";
    if (becamePublished && !existingBlog.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updateOps = { $set: updateData };
    if (Object.keys(unset).length > 0) updateOps.$unset = unset;

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateOps, { new: true });

    // oldSlug purges the previous URL when the slug was renamed.
    revalidateFrontend({
      slug: updatedBlog.slug,
      oldSlug: existingBlog.slug,
      type: "blog",
    }).catch(() => {});

    // Notify subscribers only on a genuine draft → published transition, and only
    // once ever (guarded by `notifiedSubscribers`). Editing an already-published
    // post (status stays true) is NOT a transition, so minor edits never re-email
    // the list — and old posts published before this feature are safe too.
    if (becamePublished) {
      await notifySubscribersOnce(updatedBlog, req);
    }

    const message = {
      "status": "success",
      "message": "Data updated sucessfully",
      "data": updatedBlog
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ID
  validateMongoDbId(id);

  // Check if blog exists before attempting to delete
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({
      status: "fail",
      message: "Blog not found"
    });
  }

  // Delete the blog
  const deletedBlog = await Blog.findByIdAndDelete(id);

  if (!deletedBlog) {
    return res.status(404).json({
      status: "fail",
      message: "Blog not found or already deleted"
    });
  }

  revalidateFrontend({ slug: deletedBlog.slug, type: "blog" }).catch(() => {});

  const message = {
    status: "success",
    message: "Blog deleted successfully",
    data: deletedBlog
  };

  res.json(message);
});
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaBlog = await Blog.findById(id).populate("author").populate("blogcategory");
    if (!getaBlog) {
      return res.status(404).json({ status: "error", message: "Blog not found", data: null });
    }
    const message = {
      "status": "success",
      "message": "Data fetched successfully",
      "data": getaBlog
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getallBlog = asyncHandler(async (req, res) => {
  try {
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const skip = (page - 1) * limit;
    const query = String(req.query.q || "").trim();
    const match = query ? { title: { $regex: query, $options: "i" } } : {};

    const [items, totalCount] = await Promise.all([
      Blog.find(match).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(match),
    ]);

    res.json({
      items,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit) || 1,
    });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getallBlog,
};

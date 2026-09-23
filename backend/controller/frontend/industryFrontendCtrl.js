const Industry = require("../../models/industryModel");
const asyncHandler = require("express-async-handler");

const getPublishedBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { preview } = req.query;
  const previewSecret = process.env.PREVIEW_SECRET || process.env.NEXT_PUBLIC_PREVIEW_SECRET;
  const isPreview = preview && previewSecret && preview === previewSecret;
  const query = isPreview ? { slug } : { slug, status: "active" };
  const doc = await Industry.findOne(query).lean();
  if (!doc) {
    return res.status(404).json({ status: "error", message: "Not found" });
  }
  res.json({ status: "success", message: "Fetched successfully", data: doc });
});

const listPublished = asyncHandler(async (req, res) => {
  const { limit = 100, page = 1, q } = req.query;
  const query = { status: "active" };
  if (q) query.name = { $regex: q, $options: "i" };
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, totalCount] = await Promise.all([
    Industry.find(query)
      .select("_id name slug metaTitle metaDescription hero updatedAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Industry.countDocuments(query),
  ]);
  res.json({ status: "success", items, totalCount });
});

module.exports = { getPublishedBySlug, listPublished };

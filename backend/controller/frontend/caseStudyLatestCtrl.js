const CaseStudyLatest = require("../../models/caseStudyLatestModel");
const asyncHandler = require("express-async-handler");

const getAllCaseStudyLatest = asyncHandler(async (req, res) => {
  const { limit = 50, page = 1, q } = req.query;
  const query = { status: true };
  if (q) query.title = { $regex: q, $options: "i" };
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, totalCount] = await Promise.all([
    CaseStudyLatest.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
    CaseStudyLatest.countDocuments(query),
  ]);
  res.json({ status: "success", items, totalCount });
});

const getCaseStudyLatestBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { preview } = req.query;
  const slugRegex = new RegExp(`^${slug}$`, "i");
  const baseQuery = { slug: slugRegex };
  // allow draft/inactive access only with a valid preview token
  if (!preview) {
    baseQuery.status = true;
  } else if (preview !== process.env.PREVIEW_SECRET) {
    return res.status(403).json({ status: "error", message: "Invalid preview token" });
  }
  const doc = await CaseStudyLatest.findOne(baseQuery).lean();
  if (!doc) {
    return res.status(404).json({ status: "error", message: "Not found" });
  }
  res.json({ status: "success", message: "Fetched successfully", data: doc });
});

module.exports = { getAllCaseStudyLatest, getCaseStudyLatestBySlug };

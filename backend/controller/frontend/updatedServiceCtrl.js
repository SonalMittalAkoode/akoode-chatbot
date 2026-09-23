const UpdatedService = require("../../models/updatedServiceModel");
const asyncHandler = require("express-async-handler");

// Public list — active records only.
const getAllUpdatedService = asyncHandler(async (req, res) => {
  const { limit = 50, page = 1, q, template } = req.query;
  const query = { status: true };
  if (q) query.title = { $regex: q, $options: "i" };
  if (template) query.template = template;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, totalCount] = await Promise.all([
    UpdatedService.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
    UpdatedService.countDocuments(query),
  ]);
  res.json({ status: "success", items, totalCount });
});

// Public fetch by slug. Draft/inactive records are only reachable with a valid
// preview token, so crawlers can never reach a shadowed/unpublished record.
const getUpdatedServiceBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { preview } = req.query;
  const slugRegex = new RegExp(`^${slug}$`, "i");
  const baseQuery = { slug: slugRegex };
  if (!preview) {
    baseQuery.status = true;
  } else if (preview !== process.env.PREVIEW_SECRET) {
    return res.status(403).json({ status: "error", message: "Invalid preview token" });
  }
  const doc = await UpdatedService.findOne(baseQuery).lean();
  if (!doc) {
    return res.status(404).json({ status: "error", message: "Not found" });
  }
  res.json({ status: "success", message: "Fetched successfully", data: doc });
});

module.exports = { getAllUpdatedService, getUpdatedServiceBySlug };

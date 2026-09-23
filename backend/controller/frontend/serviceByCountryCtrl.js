const ServiceByCountry = require("../../models/serviceByCountryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId");

const getServiceByCountry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const doc = await ServiceByCountry.findById(id).lean();
  res.json({ status: "success", message: "Fetched successfully", data: doc });
});

const getAllServiceByCountry = asyncHandler(async (req, res) => {
  const { limit = 20, page = 1, q } = req.query;
  const query = { status: true };
  if (q) query.title = { $regex: q, $options: "i" };
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, totalCount] = await Promise.all([
    ServiceByCountry.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
    ServiceByCountry.countDocuments(query),
  ]);
  res.json({ status: "success", items, totalCount });
});

const toMarketSlug = (v) =>
  (v || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const { resolveCaseStudySelection } = require("../../utils/resolveCaseStudySelection");

const getServiceByCountrySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { preview, market } = req.query;
  if (preview && preview !== process.env.PREVIEW_SECRET) {
    return res.status(403).json({ status: "error", message: "Invalid preview token" });
  }
  const slugRegex = new RegExp(`^${slug}$`, "i");
  // When a market is supplied, scope the lookup to that market so a slug shared
  // across multiple country docs resolves to the correct one. Match either the
  // stored `market` field or a country-derived market slug.
  const baseQuery = market
    ? {
        slug: slugRegex,
        $or: [
          { market: market },
          { market: { $in: [null, ""] }, country: new RegExp(`^${market}$`, "i") },
        ],
      }
    : { slug: slugRegex };
  // allow draft/inactive access when a valid preview token is supplied
  if (!preview) {
    baseQuery.status = true;
  }
  const doc = await ServiceByCountry.findOne(baseQuery).lean();
  if (!doc) {
    return res.status(404).json({ status: "error", message: "Not found" });
  }
  if (doc.blog) {
    const Blog = require("../../models/blogModel");
    doc.blog.selectedBlogs = await Blog.find({ status: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
  }
  doc.caseStudies = await resolveCaseStudySelection(doc.caseStudies);
  // Belt-and-suspenders market validation for legacy docs the $or didn't catch.
  if (market) {
    const effectiveMarket = doc.market || toMarketSlug(doc.country);
    if (!effectiveMarket || market !== effectiveMarket) {
      return res.status(404).json({ status: "error", message: "Not found" });
    }
  }
  res.json({ status: "success", message: "Fetched successfully", data: doc });
});

module.exports = { getServiceByCountry, getAllServiceByCountry, getServiceByCountrySlug };

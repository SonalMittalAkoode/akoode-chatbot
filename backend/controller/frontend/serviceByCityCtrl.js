const ServiceByCity = require("../../models/serviceByCityModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId");

const getServiceByCity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const doc = await ServiceByCity.findById(id).lean();
  res.json({ status: "success", message: "Fetched successfully", data: doc });
});

const getAllServiceByCity = asyncHandler(async (req, res) => {
  const { limit = 20, page = 1, q } = req.query;
  const query = { status: true };
  if (q) query.title = { $regex: q, $options: "i" };
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, totalCount] = await Promise.all([
    ServiceByCity.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
    ServiceByCity.countDocuments(query),
  ]);
  res.json({ status: "success", items, totalCount });
});

const toMarketSlug = (v) =>
  (v || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const { resolveCaseStudySelection } = require("../../utils/resolveCaseStudySelection");

const getServiceByCitySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { preview, market, city } = req.query;
  if (preview && preview !== process.env.PREVIEW_SECRET) {
    return res.status(403).json({ status: "error", message: "Invalid preview token" });
  }
  const slugRegex = new RegExp(`^${slug}$`, "i");
  // Scope the lookup by market + city when supplied so a slug shared across
  // multiple city docs resolves to the correct one. Allow legacy docs whose
  // market/citySlug aren't stored but are derivable from country/city.
  const andClauses = [{ slug: slugRegex }];
  if (market) {
    andClauses.push({
      $or: [
        { market: market },
        { market: { $in: [null, ""] }, country: new RegExp(`^${market}$`, "i") },
      ],
    });
  }
  if (city) {
    andClauses.push({
      $or: [
        { citySlug: city },
        { citySlug: { $in: [null, ""] }, city: new RegExp(`^${city}$`, "i") },
      ],
    });
  }
  const baseQuery = { $and: andClauses };
  // allow draft/inactive access when a valid preview token is supplied
  if (!preview) {
    baseQuery.status = true;
  }
  const doc = await ServiceByCity.findOne(baseQuery).lean();
  if (!doc) {
    return res.status(404).json({ status: "error", message: "Not found" });
  }
  if (doc.blog) {
    // Admin-picked blogs win; empty/hidden slots fall back to latest active.
    const { resolveBlogSelection } = require("../../utils/resolveBlogSelection");
    doc.blog = await resolveBlogSelection(doc.blog);
  }
  doc.caseStudies = await resolveCaseStudySelection(doc.caseStudies);
  // Belt-and-suspenders validation for legacy docs.
  if (market) {
    const effectiveMarket = doc.market || toMarketSlug(doc.country);
    if (!effectiveMarket || market !== effectiveMarket) {
      return res.status(404).json({ status: "error", message: "Not found" });
    }
  }
  if (city) {
    const effectiveCitySlug = doc.citySlug || toMarketSlug(doc.city);
    if (!effectiveCitySlug || city !== effectiveCitySlug) {
      return res.status(404).json({ status: "error", message: "Not found" });
    }
  }
  res.json({ status: "success", message: "Fetched successfully", data: doc });
});

module.exports = { getServiceByCity, getAllServiceByCity, getServiceByCitySlug };

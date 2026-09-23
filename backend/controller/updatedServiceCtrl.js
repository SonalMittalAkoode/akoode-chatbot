const UpdatedService = require("../models/updatedServiceModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const slugify = require("slugify");
const revalidateFrontend = require("../utils/revalidateFrontend");

// ── helpers ───────────────────────────────────────────────────────────────────
const bool = (v) => v === true || v === "true";
const str = (v) => (v == null ? "" : String(v));

// Build the persisted document from the JSON body. The client sends section
// objects already shaped like the schema, so we pass them through — Mongoose
// strict mode drops any keys not defined in the schema. Only the core scalar
// fields are normalised explicitly.
function buildDoc(body) {
  const b = body || {};
  return {
    title: str(b.title).trim(),
    slug: slugify(str(b.slug || b.title), { lower: true, strict: true }),
    template: str(b.template).trim() || "software-development",
    keywords: str(b.keywords),
    status: bool(b.status),
    isDraft: bool(b.isDraft),

    hero: b.hero || {},
    whyCustom: b.whyCustom || {},
    services: b.services || {},
    solutions: b.solutions || {},
    ai: b.ai || {},
    industries: b.industries || {},
    process: b.process || {},
    caseStudies: b.caseStudies || {},
    testimonials: b.testimonials || {},
    whyAkoode: b.whyAkoode || {},
    blogs: b.blogs || {},
    faq: b.faq || {},
    finalCta: b.finalCta || {},

    // Tech Stack + Mobile App Development template sections
    techStack: b.techStack || {},
    intro: b.intro || {},
    technologies: b.technologies || {},
    whyChoose: b.whyChoose || {},
    engagement: b.engagement || {},

    // AI Development template sections
    gap: b.gap || {},
    capabilities: b.capabilities || {},
    trends: b.trends || {},

    // Ecommerce Development template sections
    platformProblem: b.platformProblem || {},
    ecommerceServices: b.ecommerceServices || {},
    commerceEngineering: b.commerceEngineering || {},
    ecommercePlatforms: b.ecommercePlatforms || {},
    ecommerceProcess: b.ecommerceProcess || {},

    // Web Development template sections
    whyNow: b.whyNow || {},

    // Staff Augmentation template sections
    hiringGap: b.hiringGap || {},
    staffServices: b.staffServices || {},
    vendorCapabilities: b.vendorCapabilities || {},
    modelFit: b.modelFit || {},

    // Cloud & DevOps template sections
    devopsBottleneck: b.devopsBottleneck || {},
    devopsServices: b.devopsServices || {},
    devopsCapabilities: b.devopsCapabilities || {},
    devopsEngagementFit: b.devopsEngagementFit || {},
    devopsCost: b.devopsCost || {},
    devopsOutlook: b.devopsOutlook || {},

    // Digital Transformation template sections. This list is a whitelist —
    // a key missing here is dropped before it ever reaches Mongoose, so any
    // new section has to be added in both places.
    dtProblem: b.dtProblem || {},
    dtServices: b.dtServices || {},
    dtCapabilities: b.dtCapabilities || {},
    dtScope: b.dtScope || {},
    dtCost: b.dtCost || {},
    dtTrends: b.dtTrends || {},
    dtIndustries: b.dtIndustries || {},
    dtProcess: b.dtProcess || {},

    meta: b.meta || {},
  };
}

// ── CRUD controllers ────────────────────────────────────────────────────────────

const createUpdatedService = asyncHandler(async (req, res) => {
  const doc = buildDoc(req.body);
  if (!doc.title) {
    res.status(400);
    throw new Error("Title is required.");
  }
  if (!doc.slug) {
    res.status(400);
    throw new Error("Slug is required.");
  }
  const conflict = await UpdatedService.findOne({ slug: doc.slug }).lean();
  if (conflict) {
    res.status(409);
    throw new Error(`A service with slug "${doc.slug}" already exists. The slug must be unique.`);
  }
  const created = await UpdatedService.create(doc);
  // Purge the new page's ISR cache so it serves the new design immediately
  // (these render at /services/<slug>, same as legacy services). Fire-and-forget.
  revalidateFrontend({ slug: created.slug, type: "service" }).catch(() => {});
  res.json({ status: "success", message: "Created successfully", data: created });
});

const updateUpdatedService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const doc = buildDoc(req.body);
  if (!doc.title) {
    res.status(400);
    throw new Error("Title is required.");
  }
  if (!doc.slug) {
    res.status(400);
    throw new Error("Slug is required.");
  }
  const conflict = await UpdatedService.findOne({ slug: doc.slug, _id: { $ne: id } }).lean();
  if (conflict) {
    res.status(409);
    throw new Error(`A service with slug "${doc.slug}" already exists. The slug must be unique.`);
  }
  // Capture the previous slug so a rename also purges the old URL's cache.
  const before = await UpdatedService.findById(id).select("slug").lean();
  const updated = await UpdatedService.findByIdAndUpdate(
    id,
    { $set: doc },
    { new: true, runValidators: false }
  );
  if (!updated) {
    res.status(404);
    throw new Error("Entry not found.");
  }
  // Purge the page's ISR cache so the edit reflects immediately (not after the
  // 1h baseline). Includes the old slug's path on a rename. Fire-and-forget.
  revalidateFrontend({ slug: updated.slug, oldSlug: before?.slug, type: "service" }).catch(() => {});
  res.json({ status: "success", message: "Updated successfully", data: updated });
});

const deleteUpdatedService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const deleted = await UpdatedService.findByIdAndDelete(id);
  // Purge the removed page's cache so it stops serving stale content immediately.
  if (deleted?.slug) revalidateFrontend({ slug: deleted.slug, type: "service" }).catch(() => {});
  res.json({ status: "success", message: "Deleted successfully" });
});

const getUpdatedService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const doc = await UpdatedService.findById(id).lean();
  res.json({ status: "success", message: "Fetched successfully", data: doc });
});

const getAllUpdatedService = asyncHandler(async (req, res) => {
  const { limit = 20, page = 1, q } = req.query;
  const query = {};
  if (q) query.title = { $regex: q, $options: "i" };
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, totalCount] = await Promise.all([
    UpdatedService.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
    UpdatedService.countDocuments(query),
  ]);
  res.json({ status: "success", items, totalCount });
});

module.exports = {
  createUpdatedService,
  updateUpdatedService,
  deleteUpdatedService,
  getUpdatedService,
  getAllUpdatedService,
};

const Industry = require("../models/industryModel");
const revalidateFrontend = require("../utils/revalidateFrontend");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const slugify = require("slugify");

const SECTION_KEYS = [
  "hero",
  "why",
  "akoodeAdvantage",
  "whatWeBuild",
  "experties",
  "capabilities",
  "caseStudy",
  "testimonial",
  "advantage",
  "techStack",
  "industries",
  "whatsChanging",
  "whyChooseAkoode",
  "howWeWork",
  "faq",
  "finalCta",
];

const SECTION_FIELDS = [
  "eyebrow",
  "heading",
  "subtitle",
  "cta1Label",
  "cta1Link",
  "cta2Label",
  "cta2Link",
];

// Build a clean document from request body. Accepts JSON.
function buildDoc(body) {
  const doc = {
    name: (body.name || "").trim(),
    slug: slugify(body.slug || body.name || "", { lower: true, strict: true }),
    status: ["active", "draft", "inactive"].includes(body.status) ? body.status : "draft",
    metaTitle: body.metaTitle || "",
    metaDescription: body.metaDescription || "",
    metaKeywords: body.metaKeywords || "",
  };

  for (const key of SECTION_KEYS) {
    const src = body[key] || {};
    const section = {};
    for (const f of SECTION_FIELDS) {
      section[f] = src[f] || "";
    }
    // enabled defaults to true if undefined/null; explicit false hides the section
    section.enabled = src.enabled === false || src.enabled === "false" ? false : true;
    // featuredId — soft pointer to a related record (case study / testimonial).
    // Coerce empty-string/invalid to null so the slug page can fall back cleanly.
    const fid = src.featuredId;
    section.featuredId =
      fid && typeof fid === "string" && mongoose.Types.ObjectId.isValid(fid)
        ? new mongoose.Types.ObjectId(fid)
        : null;
    // Ordered list of featured record ids (used by Testimonials section).
    const fids = Array.isArray(src.featuredIds) ? src.featuredIds : [];
    section.featuredIds = fids
      .filter((v) => typeof v === "string" && mongoose.Types.ObjectId.isValid(v))
      .map((v) => new mongoose.Types.ObjectId(v));
    // Dynamic content items (pain points, service cards, FAQ Q&As, process steps, etc.)
    section.items = Array.isArray(src.items) ? src.items.filter(Boolean) : [];
    // Optional section-level image URL and alt text
    section.image = typeof src.image === "string" ? src.image : "";
    section.imageAlt = typeof src.imageAlt === "string" ? src.imageAlt : "";
    // Floating overlay cards (WhySection building image overlay)
    section.floatingCards = Array.isArray(src.floatingCards) ? src.floatingCards.filter(Boolean) : [];
    doc[key] = section;
  }

  return doc;
}

const createIndustry = asyncHandler(async (req, res) => {
  const doc = buildDoc(req.body);
  if (!doc.name) {
    return res.status(400).json({ status: "error", message: "Name is required" });
  }
  if (!doc.slug) {
    return res.status(400).json({ status: "error", message: "Slug is required" });
  }
  const existing = await Industry.findOne({ slug: doc.slug }).lean();
  if (existing) {
    return res.status(409).json({ status: "error", message: "Slug already exists" });
  }
  const created = await Industry.create(doc);
  revalidateFrontend({ slug: created.slug, type: "industry" }).catch(() => {});
  res.json({ status: "success", message: "Created successfully", data: created });
});

const updateIndustry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const doc = buildDoc(req.body);
  if (!doc.slug) {
    return res.status(400).json({ status: "error", message: "Slug is required" });
  }
  const conflict = await Industry.findOne({ slug: doc.slug, _id: { $ne: id } }).lean();
  if (conflict) {
    return res.status(409).json({ status: "error", message: "Slug already exists" });
  }
  const updated = await Industry.findByIdAndUpdate(
    id,
    { $set: doc },
    { new: true, runValidators: false }
  );
  revalidateFrontend({ slug: updated.slug, type: "industry" }).catch(() => {});
  res.json({ status: "success", message: "Updated successfully", data: updated });
});

const deleteIndustry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const deleted = await Industry.findByIdAndDelete(id);
  if (deleted?.slug) {
    revalidateFrontend({ slug: deleted.slug, type: "industry" }).catch(() => {});
  }
  res.json({ status: "success", message: "Deleted successfully" });
});

const togglePublishIndustry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const doc = await Industry.findById(id);
  if (!doc) {
    return res.status(404).json({ status: "error", message: "Not found" });
  }
  doc.status = doc.status === "active" ? "inactive" : "active";
  await doc.save();
  revalidateFrontend({ slug: doc.slug, type: "industry" }).catch(() => {});
  res.json({ status: "success", message: "Status updated", data: doc });
});

const getIndustry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const doc = await Industry.findById(id).lean();
  res.json({ status: "success", message: "Fetched successfully", data: doc });
});

const getIndustryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const doc = await Industry.findOne({ slug }).lean();
  if (!doc) {
    return res.status(404).json({ status: "error", message: "Not found" });
  }
  res.json({ status: "success", message: "Fetched successfully", data: doc });
});

const getAllIndustries = asyncHandler(async (req, res) => {
  const { limit = 20, page = 1, q } = req.query;
  const query = {};
  if (q) query.name = { $regex: q, $options: "i" };
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, totalCount] = await Promise.all([
    Industry.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
    Industry.countDocuments(query),
  ]);
  res.json({ status: "success", items, totalCount });
});

module.exports = {
  createIndustry,
  updateIndustry,
  deleteIndustry,
  togglePublishIndustry,
  getIndustry,
  getIndustryBySlug,
  getAllIndustries,
};

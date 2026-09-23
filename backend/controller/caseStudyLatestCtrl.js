const CaseStudyLatest = require("../models/caseStudyLatestModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const {
  caseStudyLatestImgResize,
  caseStudyLatestMoveRaw,
} = require("../middlewares/uploadImage");
const slugify = require("slugify");
const revalidateFrontend = require("../utils/revalidateFrontend");

// ─── FormData array parsers ───────────────────────────────────────────────────

// Handles  name[i]               -> string array
//          name[i][field]        -> object array
//          name[i][nested][j]    -> object array w/ nested string array
function collectArray(body, name) {
  if (Array.isArray(body[name])) return body[name];
  const items = [];
  for (const [key, val] of Object.entries(body)) {
    if (!key.startsWith(name)) continue;
    const parts = key.split(/[\[\]\.]+/).filter(Boolean);
    if (parts[0] !== name || parts.length < 2) continue;
    const i = parseInt(parts[1], 10);
    if (isNaN(i)) continue;
    if (!items[i]) items[i] = {};
    if (parts.length === 3) {
      items[i][parts[2]] = val;
    } else if (parts.length === 4) {
      const field = parts[2];
      const j = parseInt(parts[3], 10);
      if (!isNaN(j)) {
        if (!items[i][field]) items[i][field] = [];
        items[i][field][j] = val;
      }
    } else if (parts.length === 2) {
      items[i] = val;
    }
  }
  return items.filter(Boolean);
}

// Four-level objects:  name[i][sub][j][field]  (e.g. techCats[i][pills][j][label])
function collectNestedObjects(body, name, subKey) {
  const items = collectArray(body, name);
  const re = new RegExp(`^${name}\\[(\\d+)\\]\\[${subKey}\\]\\[(\\d+)\\]\\[(\\w+)\\]$`);
  for (const [key, val] of Object.entries(body)) {
    const m = key.match(re);
    if (m) {
      const i = +m[1], j = +m[2], field = m[3];
      if (!items[i]) items[i] = {};
      if (!items[i][subKey]) items[i][subKey] = [];
      if (!items[i][subKey][j]) items[i][subKey][j] = {};
      items[i][subKey][j][field] = val;
    }
  }
  // compact the nested arrays
  items.forEach((it) => {
    if (it && Array.isArray(it[subKey])) it[subKey] = it[subKey].filter(Boolean);
  });
  return items;
}

const bool = (v) => v === "true" || v === true;

// ─── Single image processing ──────────────────────────────────────────────────
async function processImg(files, fieldname) {
  const matched = (files || []).filter((f) => f.fieldname === fieldname);
  if (!matched.length) return null;
  const results = await caseStudyLatestImgResize(matched);
  return results.length ? `public/images/case-study-latest/${results[0]}` : null;
}

const stripHost = (v = "") => String(v || "").replace(/^https?:\/\/[^/]+/, "");

// Per-feature media (image OR video) keyed by feature index.
// Images are converted to webp; videos are stored as-is.
async function processFeatureMedia(files) {
  const map = {};
  const re = /^featureMedia\[(\d+)\]$/;
  for (const f of files || []) {
    const m = f.fieldname.match(re);
    if (!m) continue;
    const i = +m[1];
    const isVideo = (f.mimetype || "").startsWith("video");
    if (isVideo) {
      const name = caseStudyLatestMoveRaw(f);
      map[i] = { media: `public/images/case-study-latest/${name}`, mediaType: "video" };
    } else {
      const results = await caseStudyLatestImgResize([f]);
      if (results.length) {
        map[i] = { media: `public/images/case-study-latest/${results[0]}`, mediaType: "image" };
      }
    }
  }
  return map;
}

// ─── Build document from parsed FormData ─────────────────────────────────────
async function buildDoc(body, files) {
  const heroImg = await processImg(files, "heroImage");
  const listingImg = await processImg(files, "listingImage");
  const hubImg = await processImg(files, "hubImage");
  const featureMedia = await processFeatureMedia(files);

  // features: attach uploaded media (new upload wins, else keep existing path)
  const features = collectArray(body, "features").map((ft, i) => {
    const out = { ...ft };
    if (featureMedia[i]) {
      out.media = featureMedia[i].media;
      out.mediaType = featureMedia[i].mediaType;
    } else {
      out.media = stripHost(ft.media || "");
      out.mediaType = ft.mediaType || "image";
    }
    out.mediaAlt = ft.mediaAlt || "";
    return out;
  });

  return {
    title: body.title,
    slug: slugify(body.slug || body.title || "", { lower: true, strict: true }),
    keywords: body.keywords || "",
    status: bool(body.status),
    isDraft: bool(body.isDraft),

    hero: {
      show: bool(body.heroShow),
      heading: body.heroHeading || "",
      headingAccent: body.heroHeadingAccent || "",
      body: body.heroBody || "",
      metaChips: collectNestedObjects(body, "metaChips", "services"),
      cta1: body.heroCta1 || "",
      cta1Link: body.heroCta1Link || "",
      cta2: body.heroCta2 || "",
      cta2Link: body.heroCta2Link || "",
      heroImage: heroImg || stripHost(body.heroImageExisting),
      heroImageAlt: body.heroImageAlt || "",
      listingImage: listingImg || stripHost(body.listingImageExisting),
      listingImageAlt: body.listingImageAlt || "",
      floatingCards: collectArray(body, "heroFloatingCards"),
    },

    rethinking: {
      show: bool(body.rethinkingShow),
      heading: body.rethinkingHeading || "",
      headingAccent: body.rethinkingHeadingAccent || "",
      body: body.rethinkingBody || "",
      ctaText: body.rethinkingCtaText || "",
      ctaLink: body.rethinkingCtaLink || "",
      stats: collectArray(body, "stats"),
      projectInfoTitle: body.projectInfoTitle || "Project Info",
      projectInfo: collectArray(body, "projectInfo"),
    },

    challenges: {
      show: bool(body.challengesShow),
      heading: body.challengesHeading || "",
      headingAccent: body.challengesHeadingAccent || "",
      intro: body.challengesIntro || "",
      cards: collectArray(body, "challengeCards"),
      quote: body.challengesQuote || "",
    },

    build: {
      show: bool(body.buildShow),
      heading: body.buildHeading || "",
      headingAccent: body.buildHeadingAccent || "",
      intro: body.buildIntro || "",
      cards: collectArray(body, "buildCards"),
    },

    pipeline: {
      show: bool(body.pipelineShow),
      heading: body.pipelineHeading || "",
      headingAccent: body.pipelineHeadingAccent || "",
      intro: body.pipelineIntro || "",
      steps: collectArray(body, "pipelineSteps"),
    },

    powerful: {
      show: bool(body.powerfulShow),
      heading: body.powerfulHeading || "",
      headingAccent: body.powerfulHeadingAccent || "",
      features,
    },

    techStack: {
      show: bool(body.techStackShow),
      heading: body.techStackHeading || "",
      headingAccent: body.techStackHeadingAccent || "",
      intro: body.techStackIntro || "",
      cats: collectNestedObjects(body, "techCats", "pills"),
      ctaText: body.techStackCtaText || "",
      ctaLink: body.techStackCtaLink || "",
    },

    keyChallenges: {
      show: bool(body.keyChallengesShow),
      heading: body.keyChallengesHeading || "",
      headingAccent: body.keyChallengesHeadingAccent || "",
      intro: body.keyChallengesIntro || "",
      hubImage: hubImg || stripHost(body.hubImageExisting),
      hubImageAlt: body.hubImageAlt || "",
      hubBadge: body.hubBadge || "AI-Powered System",
      cards: collectArray(body, "keyCards"),
      steps: collectArray(body, "keySteps"),
      ctaText: body.keyChallengesCtaText || "",
      ctaLink: body.keyChallengesCtaLink || "",
    },

    whatChanged: {
      show: bool(body.whatChangedShow),
      heading: body.whatChangedHeading || "",
      headingAccent: body.whatChangedHeadingAccent || "",
      intro: body.whatChangedIntro || "",
      columns: collectNestedObjects(body, "changeColumns", "cards"),
      resultStats: collectArray(body, "resultStats"),
    },

    analytics: {
      show: bool(body.analyticsShow),
      heading: body.analyticsHeading || "",
      headingAccent: body.analyticsHeadingAccent || "",
      intro: body.analyticsIntro || "",
      items: collectArray(body, "analyticsItems"),
      ctaText: body.analyticsCtaText || "",
      ctaLink: body.analyticsCtaLink || "",
      ctaNote: body.analyticsCtaNote || "",
    },

    whyChoose: {
      show: bool(body.whyChooseShow),
      heading: body.whyChooseHeading || "",
      headingAccent: body.whyChooseHeadingAccent || "",
      intro: body.whyChooseIntro || "",
      cards: collectArray(body, "whyChooseCards"),
    },

    moreCaseStudies: {
      show: bool(body.moreCaseStudiesShow),
      heading: body.moreCaseStudiesHeading || "",
      headingAccent: body.moreCaseStudiesHeadingAccent || "",
      viewAllLink: body.moreCaseStudiesViewAllLink || "/case-study",
    },

    finalCta: {
      show: bool(body.finalCtaShow),
      eyebrow: body.finalCtaEyebrow || "",
      heading: body.finalCtaHeading || "",
      subtitle: body.finalCtaSubtitle || "",
    },

    meta: {
      title: body.metaTitle || "",
      description: body.metaDescription || "",
    },
  };
}

// ─── CRUD controllers ─────────────────────────────────────────────────────────

const createCaseStudyLatest = asyncHandler(async (req, res) => {
  const doc = await buildDoc(req.body, req.files || []);
  const conflict = await CaseStudyLatest.findOne({ slug: doc.slug }).lean();
  if (conflict) {
    res.status(409);
    throw new Error(`A case study with slug "${doc.slug}" already exists. The slug must be unique.`);
  }
  const created = await CaseStudyLatest.create(doc);
  revalidateFrontend({ slug: created.slug, type: "case-study-latest" }).catch(() => {});
  res.json({ status: "success", message: "Created successfully", data: created });
});

const updateCaseStudyLatest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const doc = await buildDoc(req.body, req.files || []);
  const conflict = await CaseStudyLatest.findOne({ slug: doc.slug, _id: { $ne: id } }).lean();
  if (conflict) {
    res.status(409);
    throw new Error(`A case study with slug "${doc.slug}" already exists. The slug must be unique.`);
  }
  // Read the previous slug before the write so a rename can purge the old URL.
  const before = await CaseStudyLatest.findById(id).select("slug").lean();
  const updated = await CaseStudyLatest.findByIdAndUpdate(
    id,
    { $set: doc },
    { new: true, runValidators: false }
  );
  revalidateFrontend({
    slug: updated.slug,
    oldSlug: before?.slug,
    type: "case-study-latest",
  }).catch(() => {});
  res.json({ status: "success", message: "Updated successfully", data: updated });
});

const deleteCaseStudyLatest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const deleted = await CaseStudyLatest.findByIdAndDelete(id);
  if (deleted?.slug) {
    revalidateFrontend({ slug: deleted.slug, type: "case-study-latest" }).catch(() => {});
  }
  res.json({ status: "success", message: "Deleted successfully" });
});

const getCaseStudyLatest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const doc = await CaseStudyLatest.findById(id).lean();
  res.json({ status: "success", message: "Fetched successfully", data: doc });
});

const getAllCaseStudyLatest = asyncHandler(async (req, res) => {
  const { limit = 20, page = 1, q } = req.query;
  const query = {};
  if (q) query.title = { $regex: q, $options: "i" };
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, totalCount] = await Promise.all([
    CaseStudyLatest.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
    CaseStudyLatest.countDocuments(query),
  ]);
  res.json({ status: "success", items, totalCount });
});

module.exports = {
  createCaseStudyLatest,
  updateCaseStudyLatest,
  deleteCaseStudyLatest,
  getCaseStudyLatest,
  getAllCaseStudyLatest,
};

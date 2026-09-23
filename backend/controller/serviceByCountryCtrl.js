const ServiceByCountry = require("../models/serviceByCountryModel");
const revalidateFrontend = require("../utils/revalidateFrontend");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { sbcImgResize } = require("../middlewares/uploadImage");
const slugify = require("slugify");
const localSbcStore = require("../utils/localSbcStore");
const { normalizeTemplate } = require("../utils/pageTemplates");
const { normalizeCountryLabel } = require("../utils/normalizeCountryLabel");

// ─── FormData array parsers ───────────────────────────────────────────────────

function collectArray(body, name) {
  // If already an array (parsed by another middleware like multer-body-parser), return it
  if (Array.isArray(body[name])) return body[name];

  const items = [];
  for (const [key, val] of Object.entries(body)) {
    if (!key.startsWith(name)) continue;
    
    const parts = key.split(/[\[\]\.]+/).filter(Boolean);
    
    // Safety check: must start with the correct name and have at least an index and a field
    if (parts[0] !== name || parts.length < 2) continue;
    
    const i = parseInt(parts[1], 10);
    if (isNaN(i)) continue;
    
    if (!items[i]) items[i] = {};
    
    if (parts.length === 3) {
      // name[i][field]
      const field = parts[2];
      items[i][field] = val;
    } else if (parts.length === 4) {
      // name[i][nested][j]
      const field = parts[2];
      const j = parseInt(parts[3], 10);
      if (!isNaN(j)) {
        if (!items[i][field]) items[i][field] = [];
        items[i][field][j] = val;
      }
    } else if (parts.length === 2) {
      // name[i] (for simple string arrays)
      items[i] = val;
    }
  }
  return items.filter(Boolean);
}

function collectTechCats(body) {
  const cats = collectArray(body, "techCats");
  for (const [key, val] of Object.entries(body)) {
    // Four-level: techCats[i][pills][j][field]
    const m = key.match(/^techCats\[(\d+)\]\[pills\]\[(\d+)\]\[(\w+)\]$/);
    if (m) {
      const i = +m[1], j = +m[2], field = m[3];
      if (!cats[i]) cats[i] = {};
      if (!cats[i].pills) cats[i].pills = [];
      if (!cats[i].pills[j]) cats[i].pills[j] = {};
      cats[i].pills[j][field] = val;
    }
  }
  return cats;
}

// ─── Image processing helper ──────────────────────────────────────────────────

async function processImg(files, fieldname) {
  const matched = files.filter(f => f.fieldname === fieldname);
  if (!matched.length) return null;
  const results = await sbcImgResize(matched);
  return results.length ? `public/images/sbc/${results[0]}` : null;
}

async function processIndexedImg(files, prefix) {
  const map = {};
  const re = new RegExp(`^${prefix}\\[(\\d+)\\]$`);
  const byIndex = {};
  for (const f of files) {
    const m = f.fieldname.match(re);
    if (m) { const i = +m[1]; if (!byIndex[i]) byIndex[i] = []; byIndex[i].push(f); }
  }
  for (const [i, arr] of Object.entries(byIndex)) {
    const results = await sbcImgResize(arr);
    if (results.length) map[i] = `public/images/sbc/${results[0]}`;
  }
  return map;
}

async function processPillImgs(files) {
  const map = {};
  const re = /^techCatPillImg\[(\d+)\]\[(\d+)\]$/;
  for (const f of files) {
    const m = f.fieldname.match(re);
    if (m) {
      const key = `${m[1]}_${m[2]}`;
      const results = await sbcImgResize([f]);
      if (results.length) map[key] = `public/images/sbc/${results[0]}`;
    }
  }
  return map;
}

// ─── Build document from parsed FormData ─────────────────────────────────────

async function buildDoc(body, files) {
  const f = files || [];

  // ── DEBUG: log all received file fieldnames ──
  console.log("[buildDoc] files received:", f.map(x => `${x.fieldname}(${x.originalname})`));
  console.log("[buildDoc] whyImageExisting from body:", body.whyImageExisting);

  const heroImg        = await processImg(f, "heroImage");
  const whyImg         = await processImg(f, "whyImage");
  console.log("[buildDoc] whyImg processed:", whyImg);

  const platformImgs  = await processIndexedImg(f, "platformRatingImg");
  const techCatImgs   = await processIndexedImg(f, "techCatIcon");
  const industryImgs  = await processIndexedImg(f, "industryIcon");
  const testimonialImgs = await processIndexedImg(f, "testimonialImg");
  const pillImgs      = await processPillImgs(f);

  const chooseUsFeatures = collectArray(body, "chooseUsFeatures");
  const platformRatings  = collectArray(body, "platformRatings");
  const clientLove       = collectArray(body, "clientLove");
  const whyFeatures      = collectArray(body, "whyFeatures");
  const processServices  = collectArray(body, "processServices").filter(s => (s.title || s.t || '').trim() || (s.para || '').trim() || (s.n || '').trim());
  const whatWeDoSteps    = collectArray(body, "whatWeDoSteps");
  const techCats         = collectTechCats(body);
  const industries       = collectArray(body, "industries");
  const engagementModels = collectArray(body, "engagementModels");
  const faqs             = collectArray(body, "faqs");
  const whyChooseCards   = collectArray(body, "whyChooseCards");
  const heroStats        = collectArray(body, "heroStats");
  const testimonials     = collectArray(body, "testimonials");

  // Attach platform rating images (new upload takes priority, fallback to existing)
  platformRatings.forEach((r, i) => {
    r.img = platformImgs[i] || r.imgExisting || r.img || "";
    delete r.imgExisting;
  });

  // Attach tech cat images and pill images
  techCats.forEach((cat, i) => {
    cat.iconImg = techCatImgs[i] || cat.iconImgExisting || cat.iconImg || "";
    delete cat.iconImgExisting;
    if (Array.isArray(cat.pills)) {
      cat.pills.forEach((pill, j) => {
        const key = `${i}_${j}`;
        pill.img = pillImgs[key] || pill.imgExisting || pill.img || "";
        delete pill.imgExisting;
      });
    }
  });

  // Attach industry images
  testimonials.forEach((t, i) => {
    t.image = testimonialImgs[i] || t.imageExisting || t.image || "";
    delete t.imageExisting;
  });

  industries.forEach((ind, i) => {
    ind.iconImg = industryImgs[i] || ind.iconImgExisting || ind.iconImg || "";
    delete ind.iconImgExisting;
  });

  return {
    title: body.title,
    slug: slugify(body.slug, { lower: true, strict: true }),
    country: normalizeCountryLabel(body.country),
    market: (body.market || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9/]+/g, "-")
      .replace(/\/+/g, "/")
      .replace(/^-|-$/g, "")
      .replace(/^\/|\/$/g, ""),
    keywords: body.keywords || "",
    status: body.status === "true" || body.status === true,
    isDraft: body.isDraft === "true" || body.isDraft === true,
    template: normalizeTemplate(body.template),

    hero: {
      show: body.heroShow === "true" || body.heroShow === true,
      heading: body.heroHeading || "",
      body: body.heroBody || "",
      heroImage: heroImg || (body.heroImageExisting || "").replace(/^https?:\/\/[^\/]+/, ""),
      heroImageAlt: body.heroImageAlt || "",
      cta1Text: body.heroCta1Text || "",
      cta1Link: body.heroCta1Link || "",
      cta2Text: body.heroCta2Text || "",
      cta2Link: body.heroCta2Link || "",
      stats: heroStats,
      projectProgress: {
        title: body.projectProgressTitle ?? "Project Progress",
        body: body.projectProgressBody ?? "Delivering scalable software solutions on time, sprint after sprint.",
        value: body.projectProgressValue ?? "+ 51%",
      },
    },

    whyChoose: {
      show: body.whyChooseShow === "true" || body.whyChooseShow === true,
      heading: body.whyChooseHeading || "",
      subtitle: body.whyChooseSubtitle || "",
      cards: whyChooseCards,
      ctaHeading: body.whyChooseCtaHeading || "",
      ctaBody: body.whyChooseCtaBody || "",
      ctaText: body.whyChooseCtaText || "",
      ctaLink: body.whyChooseCtaLink || "",
    },

    chooseUs: {
      show: body.chooseUsShow === "true" || body.chooseUsShow === true,
      heading: body.chooseUsHeading || "",
      intro: body.chooseUsIntro || "",
      features: chooseUsFeatures,
      platformRatings,
      clientLove,
    },

    whyLocation: {
      show: body.whyShow === "true" || body.whyShow === true,
      heading: body.whyHeading || "",
      para1: body.whyPara1 || "",
      para2: body.whyPara2 || "",
      para3: body.whyPara3 || "",
      features: whyFeatures,
      image: whyImg || (body.whyImageExisting || "").replace(/^https?:\/\/[^\/]+/, ""),
      imageAlt: body.whyImageAlt || "",
      cardLocation: body.whyCardLocation || "",
      cardHeading: body.whyCardHeading || "",
      cardBody: body.whyCardBody || "",
    },

    process: {
      show: body.processShow === "true" || body.processShow === true,
      heading: body.processHeading || "",
      intro: body.processIntro || "",
      services: processServices,
    },

    whatWeDo: {
      show: body.whatWeDoShow === "true" || body.whatWeDoShow === true,
      heading: body.whatWeDoHeading || "",
      subtitle: body.whatWeDoSubtitle || "",
      steps: whatWeDoSteps,
    },

    techStack: {
      show: body.techStackShow === "true" || body.techStackShow === true,
      heading: body.techStackHeading || "",
      subtitle: body.techStackSubtitle || "",
      cats: techCats,
    },

    industries: {
      show: body.industriesShow === "true" || body.industriesShow === true,
      heading: body.industriesHeading || "",
      headingAccent: body.industriesHeadingAccent || "",
      subtitle: body.industriesSubtitle || "",
      items: industries,
    },

    engagement: {
      show: body.engagementShow === "true" || body.engagementShow === true,
      heading: body.engagementHeading || "",
      subtitle: body.engagementSubtitle || "",
      models: engagementModels,
    },

    faq: {
      show: body.faqShow === "true" || body.faqShow === true,
      heading: body.faqHeading || "",
      subtitle: body.faqSubtitle || "",
      items: faqs,
    },

    caseStudies: {
      heading: body.caseStudiesHeading || "",
      subtitle: body.caseStudiesSubtitle || "",
      featuredCase: body.featuredCase || null,
      otherCases: collectArray(body, "otherCases"),
    },
    caseStudiesShow: body.caseStudiesShow === "true" || body.caseStudiesShow === true,
    
    testimonials: {
      heading: body.testimonialsHeading || "",
      items: testimonials,
    },
    testimonialsShow: body.testimonialsShow === "true" || body.testimonialsShow === true,
    
    blog: {
      heading: body.blogHeading || "",
      subtitle: body.blogSubtitle || "",
    },
    blogShow: body.blogShow === "true" || body.blogShow === true,

    finalCta: {
      show: body.finalCtaShow === "true" || body.finalCtaShow === true,
      heading: body.finalCtaHeading || "",
      body: body.finalCtaBody || "",
      replyTime: body.finalCtaReplyTime || "",
      nda: body.finalCtaNda || "",
    },

    meta: {
      title: body.metaTitle || "",
      description: body.metaDescription || "",
    },
  };
}

// ─── CRUD controllers ─────────────────────────────────────────────────────────

const createServiceByCountry = asyncHandler(async (req, res) => {
  const doc = await buildDoc(req.body, req.files || []);
  if (localSbcStore.enabled()) {
    const created = localSbcStore.create(doc);
    return res.json({ status: "success", message: "Created successfully", data: created });
  }
  const conflict = await ServiceByCountry.findOne({ market: doc.market, slug: doc.slug }).lean();
  if (conflict) {
    res.status(409);
    throw new Error(`A page with slug "${doc.slug}" already exists for market "${doc.market}". The URL /${doc.market}/${doc.slug} must be unique.`);
  }
  const created = await ServiceByCountry.create(doc);
  revalidateFrontend({ slug: created.slug, type: "sbc", market: created.market }).catch(() => {});
  res.json({ status: "success", message: "Created successfully", data: created });
});

const updateServiceByCountry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const doc = await buildDoc(req.body, req.files || []);
  if (localSbcStore.enabled()) {
    const updated = localSbcStore.update(id, doc);
    return res.json({ status: "success", message: "Updated successfully", data: updated });
  }
  const conflict = await ServiceByCountry.findOne({ market: doc.market, slug: doc.slug, _id: { $ne: id } }).lean();
  if (conflict) {
    res.status(409);
    throw new Error(`A page with slug "${doc.slug}" already exists for market "${doc.market}". The URL /${doc.market}/${doc.slug} must be unique.`);
  }
  // Read the previous slug/market before the write so a rename purges the old URL.
  const before = await ServiceByCountry.findById(id).select("slug market").lean();
  const updated = await ServiceByCountry.findByIdAndUpdate(
    id,
    { $set: doc },
    { new: true, runValidators: false }
  );
  revalidateFrontend({
    slug: updated.slug,
    oldSlug: before?.slug,
    type: "sbc",
    market: updated.market,
    oldMarket: before?.market,
  }).catch(() => {});
  res.json({ status: "success", message: "Updated successfully", data: updated });
});

const deleteServiceByCountry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  if (localSbcStore.enabled()) {
    localSbcStore.remove(id);
    return res.json({ status: "success", message: "Deleted successfully" });
  }
  const deleted = await ServiceByCountry.findByIdAndDelete(id);
  if (deleted?.slug) {
    revalidateFrontend({
      slug: deleted.slug,
      type: "sbc",
      market: deleted.market,
    }).catch(() => {});
  }
  res.json({ status: "success", message: "Deleted successfully" });
});

const getServiceByCountry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  if (localSbcStore.enabled()) {
    const doc = localSbcStore.get(id);
    return res.json({ status: "success", message: "Fetched successfully", data: doc });
  }
  const doc = await ServiceByCountry.findById(id)
    .populate("caseStudies.featuredCase")
    .populate("caseStudies.otherCases")
    .lean();
  if (doc && doc.blog) {
    const Blog = require("../models/blogModel");
    doc.blog.selectedBlogs = await Blog.find({ status: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
  }
  res.json({ status: "success", message: "Fetched successfully", data: doc });
});

const getAllServiceByCountry = asyncHandler(async (req, res) => {
  const { limit = 20, page = 1, q } = req.query;
  if (localSbcStore.enabled()) {
    return res.json({ status: "success", ...localSbcStore.list({ q, limit, page }) });
  }
  const query = {};
  if (q) query.title = { $regex: q, $options: "i" };
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, totalCount] = await Promise.all([
    ServiceByCountry.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
    ServiceByCountry.countDocuments(query),
  ]);
  res.json({ status: "success", items, totalCount });
});

module.exports = {
  createServiceByCountry,
  updateServiceByCountry,
  deleteServiceByCountry,
  getServiceByCountry,
  getAllServiceByCountry,
};

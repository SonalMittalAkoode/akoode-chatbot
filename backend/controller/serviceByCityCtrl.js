const ServiceByCity = require("../models/serviceByCityModel");
const revalidateFrontend = require("../utils/revalidateFrontend");
const ServiceByCountry = require("../models/serviceByCountryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { sbcCityImgResize } = require("../middlewares/uploadImage");
const slugify = require("slugify");
const { normalizeTemplate } = require("../utils/pageTemplates");
const { normalizeCountryLabel } = require("../utils/normalizeCountryLabel");

// ─── FormData array parsers ───────────────────────────────────────────────────

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
      const field = parts[2];
      items[i][field] = val;
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

function collectTechCats(body) {
  const cats = collectArray(body, "techCats");
  for (const [key, val] of Object.entries(body)) {
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
  const results = await sbcCityImgResize(matched);
  return results.length ? `public/images/sbc-city/${results[0]}` : null;
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
    const results = await sbcCityImgResize(arr);
    if (results.length) map[i] = `public/images/sbc-city/${results[0]}`;
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
      const results = await sbcCityImgResize([f]);
      if (results.length) map[key] = `public/images/sbc-city/${results[0]}`;
    }
  }
  return map;
}

// ─── Build document from parsed FormData ─────────────────────────────────────

async function buildDoc(body, files) {
  const f = files || [];

  const heroImg        = await processImg(f, "heroImage");
  const whyImg         = await processImg(f, "whyImage");

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

  platformRatings.forEach((r, i) => {
    r.img = platformImgs[i] || r.imgExisting || r.img || "";
    delete r.imgExisting;
  });

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

  testimonials.forEach((t, i) => {
    t.image = testimonialImgs[i] || t.imageExisting || t.image || "";
    delete t.imageExisting;
  });

  industries.forEach((ind, i) => {
    ind.iconImg = industryImgs[i] || ind.iconImgExisting || ind.iconImg || "";
    delete ind.iconImgExisting;
  });

  const countryRef = body.countryRef || null;
  let country = normalizeCountryLabel(body.country);
  let market = (body.market || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (countryRef) {
    try {
      const parentSBC = await ServiceByCountry.findById(countryRef).select("country market").lean();
      if (parentSBC) {
        country = normalizeCountryLabel(parentSBC.country) || country;
        market = parentSBC.market || market;
      }
    } catch (_) {}
  }

  return {
    title: body.title,
    slug: slugify(body.slug, { lower: true, strict: true }),
    countryRef,
    country,
    market,
    city: body.city || "",
    citySlug: slugify(body.citySlug || body.city || "", { lower: true, strict: true }),
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
      selectedBlogs: collectArray(body, "selectedBlogs").filter(Boolean),
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

const createServiceByCity = asyncHandler(async (req, res) => {
  const doc = await buildDoc(req.body, req.files || []);
  const conflict = await ServiceByCity.findOne({ citySlug: doc.citySlug, slug: doc.slug }).lean();
  if (conflict) {
    res.status(409);
    throw new Error(`A page with slug "${doc.slug}" already exists for city "${doc.citySlug}". The URL /${doc.market}/${doc.citySlug}/${doc.slug} must be unique.`);
  }
  const created = await ServiceByCity.create(doc);
  revalidateFrontend({ slug: created.slug, type: "city", market: created.market, city: created.citySlug }).catch(() => {});
  res.json({ status: "success", message: "Created successfully", data: created });
});

const updateServiceByCity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const doc = await buildDoc(req.body, req.files || []);
  const conflict = await ServiceByCity.findOne({ citySlug: doc.citySlug, slug: doc.slug, _id: { $ne: id } }).lean();
  if (conflict) {
    res.status(409);
    throw new Error(`A page with slug "${doc.slug}" already exists for city "${doc.citySlug}". The URL /${doc.market}/${doc.citySlug}/${doc.slug} must be unique.`);
  }
  // Read the previous slug/market/city before the write so a rename purges the old URL.
  const before = await ServiceByCity.findById(id).select("slug market citySlug").lean();
  const updated = await ServiceByCity.findByIdAndUpdate(
    id,
    { $set: doc },
    { new: true, runValidators: false }
  );
  revalidateFrontend({
    slug: updated.slug,
    oldSlug: before?.slug,
    type: "city",
    market: updated.market,
    oldMarket: before?.market,
    city: updated.citySlug,
    oldCity: before?.citySlug,
  }).catch(() => {});
  res.json({ status: "success", message: "Updated successfully", data: updated });
});

const deleteServiceByCity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const deleted = await ServiceByCity.findByIdAndDelete(id);
  if (deleted?.slug) {
    revalidateFrontend({
      slug: deleted.slug,
      type: "city",
      market: deleted.market,
      city: deleted.citySlug,
    }).catch(() => {});
  }
  res.json({ status: "success", message: "Deleted successfully" });
});

const getServiceByCity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const doc = await ServiceByCity.findById(id)
    .populate("countryRef", "_id title country market")
    .populate("caseStudies.featuredCase")
    .populate("caseStudies.otherCases")
    .lean();
  res.json({ status: "success", message: "Fetched successfully", data: doc });
});

const getAllServiceByCity = asyncHandler(async (req, res) => {
  const { limit = 20, page = 1, q } = req.query;
  const query = {};
  if (q) query.title = { $regex: q, $options: "i" };
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, totalCount] = await Promise.all([
    ServiceByCity.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))
      .populate("countryRef", "_id title country market").lean(),
    ServiceByCity.countDocuments(query),
  ]);
  res.json({ status: "success", items, totalCount });
});

module.exports = {
  createServiceByCity,
  updateServiceByCity,
  deleteServiceByCity,
  getServiceByCity,
  getAllServiceByCity,
};

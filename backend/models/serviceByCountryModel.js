const mongoose = require("mongoose");
const { PAGE_TEMPLATES, DEFAULT_PAGE_TEMPLATE } = require("../utils/pageTemplates");

const featureSchema = new mongoose.Schema({ icon: String, title: String, body: String }, { _id: false });
const pillSchema = new mongoose.Schema({ e: String, label: String, img: String }, { _id: false });

const serviceByCountrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, index: true },
    country: { type: String, default: "" },
    market: { type: String, default: "" },
    keywords: { type: String, default: "" },
    status: { type: Boolean, default: true },
    isDraft: { type: Boolean, default: false },

    // Selects which front-end template renders this page. See utils/pageTemplates.js.
    template: { type: String, enum: PAGE_TEMPLATES, default: DEFAULT_PAGE_TEMPLATE },

    hero: {
      show: { type: Boolean, default: true },
      heading: String,
      body: String,
      heroImage: String,
      heroImageAlt: String,
      cta1Text: String,
      cta1Link: String,
      cta2Text: String,
      cta2Link: String,
      stats: [{ icon: { type: String, default: "BriefcaseStatIcon" }, value: String, label: String, sub: String }],
      projectProgress: {
        title: { type: String, default: "Project Progress" },
        body: { type: String, default: "Delivering scalable software solutions on time, sprint after sprint." },
        value: { type: String, default: "+ 51%" },
      },
    },

    whyChoose: {
      show: { type: Boolean, default: false },
      heading: String,
      subtitle: String,
      cards: [{ icon: String, title: String, desc: String }],
      ctaHeading: String,
      ctaBody: String,
      ctaText: String,
      ctaLink: String,
    },

    chooseUs: {
      show: { type: Boolean, default: false },
      heading: String,
      intro: String,
      features: [featureSchema],
      platformRatings: [{ name: String, rating: String, img: String, imgAlt: String }],
      clientLove: [featureSchema],
    },

    whyLocation: {
      show: { type: Boolean, default: false },
      heading: String,
      para1: String,
      para2: String,
      para3: String,
      features: [featureSchema],
      image: String,
      imageAlt: String,
      cardLocation: String,
      cardHeading: String,
      cardBody: String,
    },

    process: {
      show: { type: Boolean, default: false },
      heading: String,
      intro: String,
      services: [{
        n: String,
        title: String,
        subtitle: String,
        para: String,
        points: [String],
        tags: [String],
        ctaText: String,
        ctaLink: String,
      }],
    },

    whatWeDo: {
      show: { type: Boolean, default: false },
      heading: String,
      subtitle: String,
      steps: [{
        shortTitle: String,
        title: String,
        body: String,
        timeline: String,
        timelineNote: String,
        deliverables: [String],
      }],
    },

    techStack: {
      show: { type: Boolean, default: false },
      heading: String,
      subtitle: String,
      cats: [{
        icon: String,
        iconImg: String,
        title: String,
        desc: String,
        pills: [pillSchema],
      }],
    },

    citiesMap: {
      show: { type: Boolean, default: false },
      variant: { type: String, enum: ["us", "uk", ""], default: "" },
      heading: String,
      body: String,
      mapImage: String,
      mapImageAlt: String,
      cities: [{ name: String, slug: String, href: String }],
    },

    industries: {
      show: { type: Boolean, default: false },
      heading: String,
      // `headingAccent` and item `icon` are used by the v2 section family only
      // (MadIndustries); the default IndustriesSection ignores both.
      headingAccent: String,
      subtitle: String,
      items: [{ icon: String, iconImg: String, iconAlt: String, name: String, sub: String, points: [String], ctaLink: String }],
    },

    engagement: {
      show: { type: Boolean, default: false },
      heading: String,
      subtitle: String,
      models: [{
        badge: String,
        title: String,
        best: String,
        body: String,
        perks: [String],
        ctaText: String,
        ctaLink: String,
      }],
    },

    faq: {
      show: { type: Boolean, default: false },
      heading: String,
      subtitle: String,
      items: [{ question: String, answer: String }],
    },

    caseStudies: {
      heading: String,
      subtitle: String,
      featuredCase: { type: mongoose.Schema.Types.ObjectId, ref: "CaseStudyLatest" },
      otherCases: [{ type: mongoose.Schema.Types.ObjectId, ref: "CaseStudyLatest" }],
    },
    caseStudiesShow: { type: Boolean, default: false },

    // Read only by templates that render the services-v2 TestimonialsSection
    // (see frontend/src/config/pageTemplates.js -> usesV2Sections). The default
    // template pulls testimonials from the global section and ignores these.
    testimonials: {
      heading: String,
      items: [{
        quote: String,
        name: String,
        designation: String,
        company: String,
        mediaType: { type: String, default: "none" },
        image: String,
      }],
    },
    testimonialsShow: { type: Boolean, default: false },

    blog: {
      heading: String,
      subtitle: String,
    },
    blogShow: { type: Boolean, default: false },

    finalCta: {
      show: { type: Boolean, default: false },
      heading: String,
      body: String,
      replyTime: String,
      nda: String,
    },

    meta: {
      title: String,
      description: String,
    },
  },
  { timestamps: true }
);

// Unique per market+slug combination — same service slug can exist in different markets
serviceByCountrySchema.index({ market: 1, slug: 1 }, { unique: true });

module.exports = mongoose.models.ServiceByCountry || mongoose.model("ServiceByCountry", serviceByCountrySchema);

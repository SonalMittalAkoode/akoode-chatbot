const mongoose = require("mongoose");

/* ------------------------------------------------------------------ *
 *  Case Study Latest — dynamic content model for the redesigned case
 *  study detail page (/case-study-v2). Sections are named exactly like
 *  the frontend section components under
 *  frontend/src/app/case-study-v2/_components.
 *  Each section carries its own `show` toggle (per-section on/off).
 * ------------------------------------------------------------------ */

const iconCardSchema = new mongoose.Schema(
  { icon: String, title: String, desc: String },
  { _id: false }
);

const caseStudyLatestSchema = new mongoose.Schema(
  {
    // ── Core ────────────────────────────────────────────────────────
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    keywords: { type: String, default: "" },
    status: { type: Boolean, default: true },
    isDraft: { type: Boolean, default: false },

    // ── HeroSection ─────────────────────────────────────────────────
    hero: {
      show: { type: Boolean, default: true },
      heading: String,
      headingAccent: String,
      body: String,
      metaChips: [
        {
          label: String,
          value: String,
          link: String,
          // multi-select services (when label = "Services"): each links to its page
          services: [{ name: String, link: String }],
        },
      ],
      cta1: String,
      cta1Link: { type: String, default: "" },
      cta2: String,
      cta2Link: { type: String, default: "" },
      heroImage: String,
      heroImageAlt: String,
      listingImage: String,
      listingImageAlt: String,
      // floating metric cards over the hero image (Top Speed / Distance / Possession Time)
      floatingCards: [{ label: String, value: String, unit: String }],
    },

    // ── RethinkingSection ───────────────────────────────────────────
    rethinking: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      body: String, // HtmlEditor — the multi-paragraph copy
      ctaText: String,
      ctaLink: { type: String, default: "" },
      stats: [{ value: String, title: String, sub: String }],
      projectInfoTitle: { type: String, default: "Project Info" },
      projectInfo: [{ icon: String, label: String, value: String }],
    },

    // ── ChallengesSection ───────────────────────────────────────────
    challenges: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      cards: [iconCardSchema],
      quote: String,
    },

    // ── BuildSection (What We Set Out To Build) ─────────────────────
    build: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      cards: [{ n: String, title: String, desc: String }],
    },

    // ── PipelineSection ─────────────────────────────────────────────
    pipeline: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      steps: [{ n: String, title: String, desc: String }],
    },

    // ── PowerfulSection (What Makes This System Powerful) ───────────
    powerful: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      features: [
        {
          tag: String,
          title: String,
          desc: String,
          bullets: [String],
          media: String, // uploaded image or video path
          mediaAlt: { type: String, default: "" }, // alt text for the uploaded image
          mediaType: { type: String, enum: ["image", "video", "embed"], default: "image" },
          embedCode: String, // raw embed/iframe markup or video URL (when mediaType = embed)
        },
      ],
    },

    // ── TechStackSection (Built With Advanced AI Technologies) ──────
    techStack: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      cats: [
        {
          icon: String,
          title: String,
          desc: String,
          pills: [{ label: String, img: String }],
        },
      ],
      ctaText: String,
      ctaLink: { type: String, default: "" },
    },

    // ── KeyChallengesSection ────────────────────────────────────────
    keyChallenges: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      hubImage: String,
      hubImageAlt: String,
      hubBadge: { type: String, default: "AI-Powered System" },
      cards: [
        { icon: String, title: String, problem: String, approach: String, stat: String },
      ],
      steps: [{ icon: String, label: String }],
      ctaText: String,
      ctaLink: { type: String, default: "" },
    },

    // ── WhatChangedSection ──────────────────────────────────────────
    whatChanged: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      columns: [
        {
          label: String, // BEFORE / OUR SOLUTION / AFTER
          cards: [iconCardSchema],
        },
      ],
      resultStats: [{ icon: String, value: String, label: String, desc: String }],
    },

    // ── AnalyticsSection (Performance Analytics) ────────────────────
    analytics: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      items: [iconCardSchema],
      ctaText: String,
      ctaLink: { type: String, default: "" },
      ctaNote: String,
    },

    // ── WhyChooseSection ────────────────────────────────────────────
    whyChoose: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      cards: [iconCardSchema],
    },

    // ── MoreCaseStudies ─────────────────────────────────────────────
    moreCaseStudies: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      viewAllLink: { type: String, default: "/case-study" },
    },

    // ── FinalCTA (reused from services) ─────────────────────────────
    finalCta: {
      show: { type: Boolean, default: false },
      eyebrow: String,
      heading: String,
      subtitle: String,
    },

    // ── Meta ────────────────────────────────────────────────────────
    meta: {
      title: String,
      description: String,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.CaseStudyLatest ||
  mongoose.model("CaseStudyLatest", caseStudyLatestSchema);

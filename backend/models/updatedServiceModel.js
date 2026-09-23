const mongoose = require("mongoose");

/* ------------------------------------------------------------------ *
 *  Updated Service — dynamic content model for the redesigned service
 *  detail pages rendered at /services/:slug.
 *
 *  A `template` field selects which front-end layout renders the record
 *  (software-development | mobile-development | ai | common). Sections
 *  are named exactly like the front-end section components and each
 *  carries its own `show` toggle for per-section on/off.
 *
 *  Images stay as static front-end assets — the admin only edits text,
 *  icons (icon-name strings from IconPicker), and selections. Case
 *  studies are chosen by reference (slug); only their title + description
 *  are overridable here, the rest is fetched live at render time.
 * ------------------------------------------------------------------ */

const iconCardSchema = new mongoose.Schema(
  { icon: String, title: String, desc: String },
  { _id: false }
);

// Service card — software-development uses icon/title/desc; the Mobile App
// Development template additionally uses num, tag (pill) and link.
//
// NOTE: on the Mobile template the `services` and `process` sections are
// swapped (snake design ↔ process key, timeline design ↔ services key), so
// `services.items` may instead hold timeline stages. Both schemas below are
// therefore supersets of each other's fields — nothing is dropped whichever
// content type a section holds. Software-development records use only their
// own subset, so they are unaffected.
const serviceItemSchema = new mongoose.Schema(
  {
    icon: String,
    title: String,
    desc: String,
    num: String,
    tag: String,
    link: String,
    // timeline-stage fields (Mobile `services` section)
    label: String,
    stageTitle: String,
    intro: String,
    points: [String],
    outcome: String,
    image: String,
    imageAlt: String,
    // Web Development template only — per-card "Learn More" CTA
    ctaText: String,
    ctaLink: String,
  },
  { _id: false }
);

// Process step — software-development uses icon/title/desc; the Mobile App
// Development template uses the richer stage fields (and, when holding snake
// cards, the num/tag/link fields too — see serviceItemSchema note).
const processStepSchema = new mongoose.Schema(
  {
    icon: String,
    title: String,
    desc: String,
    label: String,
    stageTitle: String,
    intro: String,
    points: [String],
    outcome: String,
    image: String,
    imageAlt: String,
    // snake-card fields (Mobile `process` section)
    num: String,
    tag: String,
    link: String,
  },
  { _id: false }
);

// A single client testimonial. `mediaType` drives the front-end layout:
//   "none"      → text-only quote card
//   "portrait"  → tall (9:16-ish) video/image thumbnail beside the quote
//   "landscape" → wide (3:2-ish) video/image thumbnail beside the quote
const testimonialItemSchema = new mongoose.Schema(
  {
    quote: String,
    name: String,
    designation: String,
    company: String,
    mediaType: { type: String, enum: ["none", "portrait", "landscape"], default: "none" },
    image: String,
    imageAlt: String,
    embedCode: String,
  },
  { _id: false }
);

const updatedServiceSchema = new mongoose.Schema(
  {
    // ── Core ────────────────────────────────────────────────────────
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    template: { type: String, default: "software-development", index: true },
    keywords: { type: String, default: "" },
    status: { type: Boolean, default: true },
    isDraft: { type: Boolean, default: false },

    // ── Hero (SdHero) ───────────────────────────────────────────────
    hero: {
      show: { type: Boolean, default: true },
      heading: String,
      headingAccent: String,
      // Digital Transformation splits its headline three ways — coloured lead,
      // white middle, coloured tail — so it needs a third part. Other
      // templates leave it blank and are unaffected.
      headingTail: String,
      paragraphs: [String],
      cta1Text: String,
      cta1Link: { type: String, default: "" },
      cta2Text: String,
      cta2Link: { type: String, default: "" },
      stats: [{ icon: String, value: String, label: String }],
      // AI template hero uses trust badges (icon + title + optional subtitle)
      badges: [{ icon: String, title: String, subtitle: String }],
      heroImage: String,
      heroImageAlt: String,
    },

    // ── Why Custom (SdWhyCustom) ────────────────────────────────────
    whyCustom: {
      show: { type: Boolean, default: true },
      heading: String,
      headingAccent: String,
      paragraphs: [String],
      rightTitle: String,
      features: [{ icon: String, title: String, desc: String }],
      miniNote: String,
      miniSteps: [{ icon: String, label: String }],
    },

    // ── Services (SdServices) ───────────────────────────────────────
    services: {
      show: { type: Boolean, default: true },
      heading: String,
      headingAccent: String,
      intro: String,
      items: [serviceItemSchema],
    },

    // ── Solutions (SdSolutions) ─────────────────────────────────────
    solutions: {
      show: { type: Boolean, default: true },
      heading: String,
      headingAccent: String,
      items: [iconCardSchema],
    },

    // ── AI Integration (SdAI) ───────────────────────────────────────
    ai: {
      show: { type: Boolean, default: true },
      heading: String,
      headingAccent: String,
      headingTail: String,
      paragraphs: [String],
      items: [iconCardSchema],
    },

    // ── Industries (SdIndustries) — images stay static ──────────────
    industries: {
      show: { type: Boolean, default: true },
      heading: String,
      headingAccent: String,
      intro: String,
      items: [{ icon: String, name: String, desc: String, image: String, href: String }],
    },

    // ── Process (SdProcess) ─────────────────────────────────────────
    process: {
      show: { type: Boolean, default: true },
      heading: String,
      headingAccent: String,
      intro: String,
      steps: [processStepSchema],
    },

    // ── Case Studies (SdCaseStudies) — admin selects existing ones ──
    //   `ref` = case study slug; title/description override the fetched
    //   record, everything else is fetched live at render time.
    caseStudies: {
      show: { type: Boolean, default: true },
      heading: String,
      headingAccent: String,
      intro: String,
      items: [{ ref: String, title: String, description: String }],
    },

    // ── Blogs (SdBlogs) — admin selects up to 3 blog slugs ────────────
    blogs: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      items: [{ ref: String }],
    },

    // ── Why Akoode (SdWhyAkoode) — award logos stay static ──────────
    whyAkoode: {
      show: { type: Boolean, default: true },
      heading: String,
      headingAccent: String,
      subtitle: String,
      cards: [iconCardSchema],
      awardsTitle: String,
      awardsSubtitle: String,
    },

    // ── Tech Stack (TechStack) ──────────────────────────────────────
    techStack: {
      show: { type: Boolean, default: true },
      heading: String,
      subtitle: String,
    },

    // ════════════════════════════════════════════════════════════════
    //  Mobile App Development template sections (MadIntro / MadTechnologies
    //  / MadWhyChoose / MadEngagement). Software-dev records simply leave
    //  these empty.
    // ════════════════════════════════════════════════════════════════

    // ── Intro / "Company" (MadIntro) ────────────────────────────────
    intro: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      paragraphs: [String],
      pills: [{ icon: String, label: String }],
      statCards: [{ icon: String, value: String, label: String, desc: String }],
      closingParagraphs: [String],
    },

    // ── Technologies (MadTechnologies) ──────────────────────────────
    technologies: {
      show: { type: Boolean, default: false },
      heading: String,
      // Ecommerce template only — optional two-tone heading split (gradient
      // lead word + dark rest). Mobile/AI leave these empty and keep using
      // the single `heading` field's built-in default rendering.
      headingLead: String,
      headingRest: String,
      intro: String,
      tabs: [{ label: String, logos: [{ label: String, img: String }] }],
    },

    // ── Why Choose (MadWhyChoose) ───────────────────────────────────
    whyChoose: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      headingTail: String,
      subtitle: String,
      cards: [iconCardSchema],
    },

    // ── Engagement Models (MadEngagement) — plans are fixed in the UI;
    //   only heading/subtitle are edited, but plans are stored if sent. ──
    engagement: {
      show: { type: Boolean, default: false },
      heading: String,
      headingTail: String,
      subtitle: String,
      plans: [
        {
          title: String,
          bestFor: String,
          points: [String],
          ctaText: String,
          ctaLink: String,
          popular: Boolean,
        },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    //  AI Development template sections (AiGap / AiCapabilities / AiTrends).
    //  Other templates simply leave these empty.
    // ════════════════════════════════════════════════════════════════

    // ── Gap / Intro (AiGap) ─────────────────────────────────────────
    gap: {
      show: { type: Boolean, default: false },
      heading: String,
      quote: String,
      featureTitle: String,
      featureBody: String,
      paragraphs: [String],
      shiftsHeading: String,
      shifts: [{ num: String, icon: String, title: String, desc: String }],
    },

    // ── Capabilities (AiCapabilities) ───────────────────────────────
    capabilities: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      quote: String,
      paragraph: String,
      items: [iconCardSchema],
    },

    // ── Trends (AiTrends) ───────────────────────────────────────────
    trends: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      items: [iconCardSchema],
      // Ecommerce template only — the sticky image beside the trend list
      // (rendered by WhatsChanging). AI's own AiTrends component ignores these.
      image: String,
      imageAlt: String,
    },

    // ════════════════════════════════════════════════════════════════
    //  Ecommerce Development template sections — mirrors the bespoke
    //  Figma-built sections on /services-v2/ecommerce-development.
    //  Other templates leave these empty. Hero's stats bar and its three
    //  floating metric cards, plus the Engagement plans, are deliberately
    //  NOT modelled here — they stay fixed design elements on that
    //  template regardless of admin input (see EcommerceDevelopmentHeroSection
    //  and MadEngagement).
    // ════════════════════════════════════════════════════════════════

    // ── Platform Problem (PlatformBottleneckSection) ────────────────
    platformProblem: {
      show: { type: Boolean, default: false },
      heading: String, // gradient part of the H2
      headingAccent: String, // white part of the H2
      intro: String, // paragraph under the heading
      points: [{ icon: String, text: String }], // right-column icon+text rows
      cardTitle: String, // glowing card heading
      cardBody: String, // glowing card paragraph
      quote: String, // accent-bar quote at the bottom
    },

    // ── Ecommerce Services (EcommerceServicesSection — numbered cards) ──
    ecommerceServices: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      items: [{ title: String, desc: String }],
    },

    // ── Commerce Engineering (CommerceEngineeringSection — columns) ──
    commerceEngineering: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      columns: [{ title: String, desc: String }],
    },

    // ── Ecommerce Platforms (EcommercePlatformsSection — gradient rows) ──
    ecommercePlatforms: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      rows: [{ title: String, desc: String, ctaText: String, ctaLink: String }],
    },

    // ── Ecommerce Process (MadProcess timeline reused — 6 stages) ────
    ecommerceProcess: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      steps: [processStepSchema],
    },

    // ════════════════════════════════════════════════════════════════
    //  Web Development template sections — mirrors the bespoke Figma-built
    //  sections on /services-v2/web-development. Other templates leave this
    //  empty. Trust Bar and the Founder CTA strip are deliberately NOT
    //  modelled here — they stay fixed design elements on that template
    //  regardless of admin input (see WebDevelopmentTrustBarSection and
    //  FounderCtaStrip). Services/Commerce Engineering/Trends/Process/
    //  Industries/Technologies/Engagement/Case Studies/Testimonials/Why
    //  Choose all reuse the section schemas already defined above.
    // ════════════════════════════════════════════════════════════════

    // ════════════════════════════════════════════════════════════════
    //  Staff Augmentation template sections — mirrors the bespoke Figma
    //  frames behind /services-v2/staff-augmentation (nodes 1046:4166 and
    //  1066:1746). Other templates leave these empty. The hero trust bar and
    //  the Founder CTA strip are deliberately NOT modelled, exactly as on the
    //  Web Development template — they stay fixed design elements. Trends /
    //  Industries / Technologies / Process / Engagement / Case Studies /
    //  Testimonials / Blogs / FAQ all reuse the section schemas above.
    // ════════════════════════════════════════════════════════════════

    // ── Hiring Gap capsule row (StaffAugHiringGapSection) ───────────
    hiringGap: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      // icon is a key of the ICONS map in StaffAugHiringGapSection:
      // Clock | FastForward | Users | TrendingUp | Shield.
      // Capsule height and the centre item's extra width are derived from
      // position, and the filled treatment is hover-only, so neither is stored.
      points: [{ icon: String, text: String }],
    },

    // ── Capabilities grid (StaffAugCapabilitiesSection) ─────────────
    vendorCapabilities: {
      show: { type: Boolean, default: false },
      heading: String,
      intro: String,
      items: [{ title: String, desc: String }],
    },

    // ── Which model fits (StaffAugModelFitSection) ──────────────────
    // question icon: Users | TrendingUp | Target
    // model icon:    User  | Users      | FileText
    modelFit: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      questions: [{ icon: String, text: String }],
      models: [
        {
          icon: String,
          name: String,
          fit: String,
          directs: String,
          duration: String,
        },
      ],
      quotes: [String],
      warningTitle: String,
      warningParagraphs: [String],
    },

    // ── Services accordion (StaffAugServicesSection) ────────────────
    // Kept separate from `services` because the rows carry a duration, a
    // price and their own definition blocks + delivery timeline, none of
    // which the shared service item schema models.
    staffServices: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      items: [
        {
          title: String,
          duration: String,
          price: String,
          blocks: [{ label: String, body: String }],
          steps: [String],
        },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    //  Cloud & DevOps template sections — mirrors the bespoke Figma frames
    //  behind /services-v2/devops (nodes 1115:480, 1120:1062, 1133:489,
    //  1329:501, 1365:1363, 1379:535, 1410:2121). Other templates leave
    //  these empty. The hero stats bar and the Founder CTA strip are
    //  deliberately NOT modelled, exactly as on the Web Development and
    //  Staff Augmentation templates — they stay fixed design elements.
    //  Industries / Technologies / Process / Engagement / Case Studies /
    //  Blogs / FAQ / Why Choose all reuse the section schemas above.
    // ════════════════════════════════════════════════════════════════

    // ── Bottleneck split (DevopsBottleneck) ─────────────────────────
    //  `points` are the numbered rail entries on the right column.
    devopsBottleneck: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      cardTitle: String,
      cardBody: String,
      points: [String],
    },

    // ── Services grid (DevopsServices) ──────────────────────────────
    //  Kept separate from `services` because the heading splits three ways
    //  and every card shares one CTA, which the shared schema doesn't model.
    devopsServices: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      headingTail: String,
      intro: String,
      // Section-level CTA — every card uses it unless the card overrides it.
      ctaText: String,
      ctaLink: String,
      // Per-card CTA overrides; blank falls back to the section values above,
      // which in turn fall back to the component's coded default.
      items: [{ title: String, desc: String, ctaText: String, ctaLink: String }],
    },

    // ── Capabilities timeline (DevopsCapabilities) ──────────────────
    devopsCapabilities: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      items: [{ title: String, desc: String }],
    },

    // ── Engagement fit comparison (DevopsEngagementFit) ─────────────
    //  `icon` on both options and callouts is an IconPicker key resolved
    //  through utils/adminIconMap; blank falls back to the coded default.
    devopsEngagementFit: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      options: [
        {
          icon: String,
          title: String,
          desc: String,
          rows: [{ label: String, value: String }],
        },
      ],
      callouts: [{ icon: String, text: String }],
    },

    // ── Cost & timeline blocks (DevopsCostTimeline) ─────────────────
    //  Three numbered blocks: cost drivers, delivery ranges, estimate steps.
    devopsCost: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      note: String,
      drivers: [{ icon: String, title: String, desc: String }],
      timelines: [{ icon: String, title: String, range: String, unit: String }],
      steps: [{ icon: String, title: String, desc: String }],
    },

    // ── 2026 outlook cards (DevopsOutlook) ──────────────────────────
    devopsOutlook: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      note: String,
      cards: [{ icon: String, question: String, answer: String }],
    },

    /* ── Digital Transformation template ──────────────────────────────
     *  Sections are prefixed `dt` and kept separate from the shared keys
     *  because each one is a bespoke Figma layout whose fields do not map
     *  onto the generic heading/intro/items shape. The shared sections this
     *  template also renders — technologies, engagement, caseStudies,
     *  whyChoose, blogs, faq, finalCta, meta — reuse the keys already
     *  defined above, so nothing is duplicated.
     *
     *  Every field is optional. The front-end components fall back to their
     *  coded Figma copy when a field is blank, so a half-filled record still
     *  renders a complete page.
     * ---------------------------------------------------------------- */

    // ── The problem / positioning split (DtProblem) ─────────────────
    dtProblem: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      cardEyebrow: String,
      cardTitle: String,
      cardBody: String,
      // Stacked words on the card's right-hand rail, one per line.
      railWords: [String],
      items: [{ eyebrow: String, heading: String, body: String }],
    },

    // ── Service rows with the hover treatment (DtServices) ──────────
    dtServices: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      ctaText: String,
      ctaLink: String,
      items: [{ n: String, eyebrow: String, title: String, desc: String, link: String }],
    },

    // ── Staircase capability cards (DtCapabilities) ─────────────────
    //  Exactly six read; the staircase offsets are coded per position.
    dtCapabilities: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      items: [{ n: String, title: String, body: String }],
    },

    // ── Scope comparison table (DtScopeTable) ───────────────────────
    dtScope: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      columns: [String],
      rows: [{ n: String, approach: String, bestFit: String, duration: String, risk: String }],
      noteBody: String,
      calloutTitle: String,
      calloutBody: String,
    },

    // ── Cost drivers + delivery timeline (DtCostTimeline) ───────────
    dtCost: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      costHeading: String,
      circleEyebrow: String,
      circleTitle: String,
      factors: [{ n: String, title: String, body: String }],
      timelineHeading: String,
      // No `fill`: the progress bar width is a fixed design element set per
      // position in DtCostTimeline, not authored content.
      timelines: [{ title: String, body: String, value: String, unit: String }],
      bannerLead: String,
      bannerHighlight: String,
      bannerTail: String,
      bannerBody: String,
    },

    // ── Scattered 2026 trends canvas (DtTrends) ─────────────────────
    //  Exactly five read; positions on the canvas are coded per index.
    dtTrends: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      orbEyebrow: String,
      orbTitle: String,
      orbTitleAccent: String,
      items: [{ n: String, heading: String, body: String }],
    },

    // ── Industry explorer (DtIndustries) ────────────────────────────
    //  Rows without a body render as inert labels; add copy to make one
    //  selectable on desktop and expandable in the mobile accordion.
    dtIndustries: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      listTitle: String,
      items: [
        {
          n: String,
          label: String,
          bullets: [String],
          body: String,
          image: String,
          imageAlt: String,
          // Industry page this row links to. Same key as the shared
          // `industries` section so both use one convention.
          href: String,
          stats: [{ value: String, label: String }],
        },
      ],
    },

    // ── Six-stage process timeline (DtProcess) ──────────────────────
    //  Exactly six read, laid out 01-03 then 06-04 with the connectors.
    dtProcess: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      steps: [{ n: String, eyebrow: String, title: String, body: String, quote: String }],
    },

    // ── Why Now (WebDevelopmentWhyNowSection) ───────────────────────
    whyNow: {
      show: { type: Boolean, default: false },
      heading: String,
      headingAccent: String,
      intro: String,
      cardTitle: String,
      cardBody: String,
      cards: [{ number: String, text: String }],
    },

    // ── FAQ (SdFAQ) ─────────────────────────────────────────────────
    faq: {
      show: { type: Boolean, default: true },
      heading: String,
      headingAccent: String,
      intro: String,
      items: [{ q: String, a: String }],
    },

    // ── Testimonials (TestimonialsSection) ──────────────────────────
    testimonials: {
      show: { type: Boolean, default: false },
      heading: { type: String, default: "What Our Client Says" },
      items: [testimonialItemSchema],
    },

    // ── Final CTA (SdCTA) ───────────────────────────────────────────
    finalCta: {
      show: { type: Boolean, default: true },
      eyebrow: String,
      heading: String,
      headingAccent: String,
      subtitle: String,
    },

    // ── Meta (SEO) ──────────────────────────────────────────────────
    meta: {
      title: String,
      description: String,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.UpdatedService ||
  mongoose.model("UpdatedService", updatedServiceSchema);

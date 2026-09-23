const mongoose = require("mongoose");

// Each section block is the editable surface:
//   eyebrow / heading / subtitle / CTA labels & links / items array.
const sectionSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, default: "" },
    heading: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    cta1Label: { type: String, default: "" },
    cta1Link: { type: String, default: "" },
    cta2Label: { type: String, default: "" },
    cta2Link: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
    // Soft pointer to a featured record (e.g. Casestudy._id, Testimonial._id).
    // No ref — the slug page resolves the related record itself.
    featuredId: { type: mongoose.Schema.Types.ObjectId, default: null },
    // Array of selected record ids (used by Testimonials section for ordering).
    featuredIds: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    // Dynamic content items: pain points, service cards, FAQ Q&As, process steps, etc.
    items: { type: [mongoose.Schema.Types.Mixed], default: [] },
    // Optional section-level image URL and alt text.
    image: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    // Floating overlay cards (used by WhySection building image overlay).
    floatingCards: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { _id: false }
);

const industrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true },
    status: { type: String, enum: ["active", "draft", "inactive"], default: "draft", index: true },

    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: String, default: "" },

    hero: { type: sectionSchema, default: () => ({}) },
    why: { type: sectionSchema, default: () => ({}) },
    akoodeAdvantage: { type: sectionSchema, default: () => ({}) },
    whatWeBuild: { type: sectionSchema, default: () => ({}) },
    experties: { type: sectionSchema, default: () => ({}) },
    capabilities: { type: sectionSchema, default: () => ({}) },
    caseStudy: { type: sectionSchema, default: () => ({}) },
    testimonial: { type: sectionSchema, default: () => ({}) },
    advantage: { type: sectionSchema, default: () => ({}) },
    techStack: { type: sectionSchema, default: () => ({}) },
    industries: { type: sectionSchema, default: () => ({}) },
    whatsChanging: { type: sectionSchema, default: () => ({}) },
    whyChooseAkoode: { type: sectionSchema, default: () => ({}) },
    howWeWork: { type: sectionSchema, default: () => ({}) },
    faq: { type: sectionSchema, default: () => ({}) },
    finalCta: { type: sectionSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Industry || mongoose.model("Industry", industrySchema);

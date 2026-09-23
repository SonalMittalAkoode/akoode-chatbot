const or = (value, fallback) => value || fallback;

/* ── Per-entity tags (pre-existing names — do not rename) ─────────────────── */

export const serviceTag = (slug) => `service-${slug}`;
export const updatedServiceTag = (slug) => `updated-service-${slug}`;
export const industryTag = (slug) => `industry-${slug}`;
export const blogTag = (idOrSlug) => `blog-${idOrSlug}`;
export const blogRelatedTag = (id) => `blog-related-${id}`;
export const authorTag = (slug) => `author-${slug}`;
export const casestudyTag = (slug) => `casestudy-${slug}`;
export const caseStudyLatestTag = (slug) => `case-study-latest-${slug}`;
export const jobTag = (slug) => `job-${slug}`;

export const sbcTag = (market, slug) => `sbc-${or(market, "default")}-${slug}`;
export const sbcCityTag = (market, city, slug) =>
  `sbc-city-${or(market, "default")}-${or(city, "default")}-${slug}`;

/* ── Shared-content list tags ─────────────────────────────────────────────── */
/* These render on many unrelated pages (navigation, homepage sections, service
   and location pages), so they are invalidated by tag rather than by path. */

export const LIST_CASE_STUDY_LATEST = "case-study-latest-list"; // pre-existing
export const LIST_TESTIMONIALS = "testimonial-list";
export const LIST_VIDEOS = "video-list";
export const LIST_RATINGS = "rating-list";
export const LIST_EMPLOYEES = "employee-list";
export const LIST_FAQS = "faq-list";
export const NAV_SERVICES = "nav-services";
export const NAV_INDUSTRIES = "nav-industries";

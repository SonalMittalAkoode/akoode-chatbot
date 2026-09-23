
export const PAGE_TEMPLATES = [
  { value: "default", label: "Default — generic service layout" },
  { value: "mobile-app-development", label: "Mobile App Development" },
  { value: "ecommerce-development", label: "E-commerce Development" },
  { value: "ai-development", label: "AI Development" },
];

export const DEFAULT_PAGE_TEMPLATE = "default";

export const normalizeTemplate = (value) =>
  PAGE_TEMPLATES.some((t) => t.value === value) ? value : DEFAULT_PAGE_TEMPLATE;

export const V2_SECTION_TEMPLATES = ["mobile-app-development", "ecommerce-development", "ai-development"];

export const usesV2Sections = (value) =>
  V2_SECTION_TEMPLATES.includes(normalizeTemplate(value));

export const HERO_STATS_TEMPLATES = ["mobile-app-development", "ecommerce-development"];

// AI Development renders the hero `stats` array as a five-slot trust bar
// (icon + bold line + muted line) instead of the four value/label stat cards.
export const HERO_BADGES_TEMPLATES = ["ai-development"];

export const usesHeroBadges = (value) =>
  HERO_BADGES_TEMPLATES.includes(normalizeTemplate(value));

export const usesHeroStats = (value) =>
  HERO_STATS_TEMPLATES.includes(normalizeTemplate(value));

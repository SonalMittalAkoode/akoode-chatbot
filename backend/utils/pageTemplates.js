
const PAGE_TEMPLATES = ["default", "mobile-app-development", "ecommerce-development", "ai-development"];

const DEFAULT_PAGE_TEMPLATE = "default";

const normalizeTemplate = (value) =>
  PAGE_TEMPLATES.includes(value) ? value : DEFAULT_PAGE_TEMPLATE;

module.exports = { PAGE_TEMPLATES, DEFAULT_PAGE_TEMPLATE, normalizeTemplate };

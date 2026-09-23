const { PAGE_TEMPLATES } = require("../../utils/pageTemplates");

const slugify = (val) =>
  String(val || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function resolveTemplate(raw) {
  if (!raw) return {};
  if (PAGE_TEMPLATES.includes(raw)) return { template: raw };

  const slug = slugify(raw);
  if (PAGE_TEMPLATES.includes(slug)) return { template: slug };

  const leading = slugify(String(raw).split(/[—–\-|(]/)[0]);
  if (PAGE_TEMPLATES.includes(leading)) return { template: leading };

  return { warning: `Unknown page template "${raw}". Please select a valid template.` };
}

module.exports = { resolveTemplate };

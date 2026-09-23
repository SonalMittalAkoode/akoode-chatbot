const toSlug = (val) =>
  String(val || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const segmentsOf = (value) =>
  String(value || "")
    .trim()
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);

function splitCountrySlug(rawSlug) {
  const parts = segmentsOf(rawSlug);
  if (parts.length < 2) return { slug: parts[0] || "", market: "" };
  return { slug: parts[parts.length - 1], market: parts[0] };
}

function splitCitySlug(rawSlug) {
  const parts = segmentsOf(rawSlug);
  if (parts.length < 2) return { slug: parts[0] || "", market: "", citySlug: "" };
  if (parts.length === 2) return { slug: parts[1], market: "", citySlug: parts[0] };
  return { slug: parts[parts.length - 1], market: parts[0], citySlug: parts[1] };
}

module.exports = { toSlug, splitCountrySlug, splitCitySlug };

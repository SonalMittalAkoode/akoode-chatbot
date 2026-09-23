const MAX_COUNTRY_LABEL = 56;

function normalizeCountryLabel(value = "") {
  const cleaned = String(value || "")
    .split("|")[0]
    .replace(/\s+/g, " ")
    .replace(/^[\s\-–—,;:]+|[\s\-–—,;:]+$/g, "")
    .trim();

  if (!cleaned) return "";
  if (cleaned.length > MAX_COUNTRY_LABEL) return "";
  if (/[:;]/.test(cleaned)) return "";
  return cleaned;
}

module.exports = { normalizeCountryLabel, MAX_COUNTRY_LABEL };

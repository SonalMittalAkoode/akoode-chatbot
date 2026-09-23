// Geo-normalized phrase-overlap measurement between SBC page documents.
// Productionised from the diagnosis prototype (scratchpad/overlap.js) that proved
// Manchester/London city pages shared 42.8% of their 8-word shingles once city and
// country names were normalized to a GEO token. Exported for both the city and
// country generation paths, but currently wired into the CITY path only (the
// country generator already produces divergent copy and must not change behavior).

// Prose-bearing keys inside an SBC document. Structural/locked fields (slugs,
// icons, CTAs, stats) are deliberately excluded — only editable copy is compared.
const TEXT_KEYS = [
  "body", "intro", "para", "para1", "para2", "para3", "answer", "subtitle",
  "desc", "question", "title", "heading", "cardBody", "timelineNote",
];

// Depth-first collection of prose fields (>= 4 words) from a page document.
function extractTextFields(node, out = []) {
  if (Array.isArray(node)) {
    node.forEach((item) => extractTextFields(item, out));
    return out;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === "string" && TEXT_KEYS.includes(key) && value.trim().split(/\s+/).length >= 4) {
        out.push(value);
      } else if (value && typeof value === "object") {
        extractTextFields(value, out);
      }
    }
  }
  return out;
}

// Replace every geo term (city/country names) with a single GEO token so
// "for Manchester startups" and "for London startups" compare as identical.
function normalizeGeoText(text, geoTerms = []) {
  let normalized = String(text || "");
  const terms = [...new Set(geoTerms.filter(Boolean).map(String))]
    .sort((a, b) => b.length - a.length); // longest first so "United Kingdom" wins over "UK"
  for (const term of terms) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    normalized = normalized.replace(new RegExp(`\\b${escaped}\\b`, "gi"), "GEO");
  }
  return normalized.toLowerCase().replace(/[^a-z ]+/g, " ").replace(/\s+/g, " ").trim();
}

function ngramSet(text, n = 8) {
  const words = String(text || "").split(" ").filter(Boolean);
  const set = new Set();
  for (let i = 0; i + n <= words.length; i += 1) {
    set.add(words.slice(i, i + n).join(" "));
  }
  return set;
}

// Overlap between two bodies of text (string, array of strings, or page document).
// Returns:
//   pct       — shared shingles / smaller set (symmetric; matches the diagnosis metric)
//   pctOfA    — shared shingles / A's set (how much of A already exists in B; use
//               this when A is one generated section and B is a full sibling page)
//   sharedSamples — up to `sampleLimit` shared shingles for prompt feedback/logging
function computeGeoNormalizedOverlap(textA, textB, geoTerms = [], { n = 8, sampleLimit = 25 } = {}) {
  const toText = (input) => {
    if (typeof input === "string") return input;
    if (Array.isArray(input)) return input.join(" . ");
    return extractTextFields(input).join(" . ");
  };
  const gramsA = ngramSet(normalizeGeoText(toText(textA), geoTerms), n);
  const gramsB = ngramSet(normalizeGeoText(toText(textB), geoTerms), n);
  const sharedSamples = [];
  let shared = 0;
  for (const gram of gramsA) {
    if (gramsB.has(gram)) {
      shared += 1;
      if (sharedSamples.length < sampleLimit) sharedSamples.push(gram);
    }
  }
  const minSize = Math.min(gramsA.size, gramsB.size);
  return {
    shared,
    aSize: gramsA.size,
    bSize: gramsB.size,
    pct: minSize ? (shared / minSize) * 100 : 0,
    pctOfA: gramsA.size ? (shared / gramsA.size) * 100 : 0,
    sharedSamples,
  };
}

module.exports = {
  TEXT_KEYS,
  extractTextFields,
  normalizeGeoText,
  ngramSet,
  computeGeoNormalizedOverlap,
};

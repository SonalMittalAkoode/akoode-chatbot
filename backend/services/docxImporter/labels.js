
function normalizeLabel(raw) {
  return String(raw || "")
    .toLowerCase()
    .replace(/[:\s]+$/, "")       
    .replace(/\([^)]*\)/g, " ")     
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^section\s+/, "")    
    .trim();
}


const LABEL_CANONICAL = {
  // ── core ────────────────────────────────────────────────────────────────
  "page title": "title",
  "title": "title",
  "slug": "slug",
  "url slug": "slug",
  "market url segment": "market",
  "market": "market",
  "country": "country",
  "country name": "country",
  "country page": "countryPage",
  "country slug": "countrySlug",
  "city": "city",
  "city name": "city",
  "city slug": "citySlug",
  "page template": "template",
  "template": "template",
  "keywords": "keywords",

  // ── generic section fields ──────────────────────────────────────────────
  "heading": "heading",
  "main heading": "heading",
  // Documents write the on-page headline as "H1", "H1 (on-page)" or
  // "Hero H1" instead of "Heading". normalizeLabel drops the parenthetical,
  // so only the bare forms need listing.
  "h1": "heading",
  "h2": "heading",
  "h3": "heading",
  "h1 on page": "heading",
  "on page h1": "heading",
  "hero h1": "heading",
  "hero heading": "heading",
  "hero body": "body",
  "hero paragraph": "body",
  "heading lead": "heading",
  "lead heading": "heading",
  "heading accent": "headingAccent",
  "accent": "headingAccent",
  "subtitle": "subtitle",
  "sub heading": "subtitle",
  "subheading": "subtitle",
  "intro": "intro",
  "intro paragraph": "intro",
  "introduction": "intro",
  "body": "body",
  "body text": "body",
  "paragraph": "body",
  "description": "body",
  "desc": "body",

  // ── why-location paragraphs ─────────────────────────────────────────────
  "paragraph 1": "para1",
  "para 1": "para1",
  "paragraph 2": "para2",
  "para 2": "para2",
  "paragraph 3": "para3",
  "para 3": "para3",

  // ── images / cards ──────────────────────────────────────────────────────
  "image alt": "imageAlt",
  "image alt text": "imageAlt",
  "image - alt text": "imageAlt",
  "image / alt text": "imageAlt",
  "alt text": "imageAlt",
  "hero image alt": "imageAlt",
  "industry image alt text": "iconAlt",
  "icon alt": "iconAlt",
  "card footer - location label": "cardLocation",
  "location label": "cardLocation",
  "image caption": "cardLocation",
  "card footer": "cardLocation",
  "card footer - heading": "cardHeading",
  "future tagline": "cardHeading",
  "card footer - body": "cardBody",
  "future body": "cardBody",

  // ── repeatable-entry fields ─────────────────────────────────────────────
  "number": "n",
  "n": "n",
  "name": "name",
  "icon": "icon",
  "value": "value",
  "label": "label",
  "sub": "sub",
  "subtext": "sub",
  "short title": "shortTitle",
  "short title nav": "shortTitle",
  "full title": "title",
  "bullet points": "points",
  "bullets": "points",
  "points": "points",
  "pointers": "points",
  "tags": "tags",
  "technologies": "tags",
  "pills": "tags",
  "deliverables": "deliverables",
  "you receive": "deliverables",
  "what you receive": "deliverables",
  "timeline": "timeline",
  "timeline note": "timelineNote",
  "perks": "perks",
  "badge": "badge",
  "best for": "best",
  "best": "best",
  "question": "question",
  "answer": "answer",

  // ── CTAs ────────────────────────────────────────────────────────────────
  "cta": "ctaText",
  "cta text": "ctaText",
  "cta button text": "ctaText",
  "cta link": "ctaLink",
  "cta button link": "ctaLink",
  "explore service details cta": "ctaLink",
  "cta button label": "ctaText",
  "button text": "ctaText",
  "button label": "ctaText",
  "cta heading": "ctaHeading",
  "cta body": "ctaBody",
  "reply time": "replyTime",
  "nda": "nda",

  // ── meta ────────────────────────────────────────────────────────────────
  "meta title": "metaTitle",
  "meta description": "metaDescription",
};

const GROUP_HEADER_PATTERNS = [
  { re: /^hero stat cards?$/, group: "stats" },
  { re: /^stat cards?$/, group: "stats" },
  { re: /^features?$/, group: "features" },
  { re: /^feature cards?$/, group: "features" },
  { re: /^stat features?$/, group: "features" },
  { re: /^client love items?$/, group: "clientLove" },
  { re: /^what clients love$/, group: "clientLove" },
  { re: /^proof cards?$/, group: "cards" },
  { re: /^platform ratings?$/, group: "platformRatings" },
  { re: /^paragraphs$/, group: "" },
  { re: /^sub points?$/, group: "" },
];

const groupHeaderKind = (normalized) => {
  const bare = normalized.replace(/\s*[-–]\s*\d+\s*items?$/, "").trim();
  const hit = GROUP_HEADER_PATTERNS.find(({ re }) => re.test(bare));
  return hit ? hit.group : null;
};

const isGroupHeader = (normalized) => groupHeaderKind(normalized) !== null;

const IGNORED_LABELS = new Set([
  "breadcrumb", "toggle", "note", "notes", "trust line", "ai tagline",
  "cta buttons", "project progress card", "founder cta", "word count",
]);

const isIgnoredLabel = (normalized) => IGNORED_LABELS.has(normalized);

// normalizeLabel throws parentheticals away, which is right for editorial
// asides ("Section Heading (matches actual content)") but wrong when the
// parentheses carry the distinction itself — "Heading (lead)" and
// "Heading (accent)" both collapse to "heading" and the accent half is lost.
// So the parenthesised words are folded into the label FIRST and only the
// stripped form is used as a fallback.
const inlineParens = (raw) =>
  normalizeLabel(String(raw || "").replace(/[()]/g, " "));

function lookup(norm) {
  if (!norm) return null;
  if (LABEL_CANONICAL[norm]) return LABEL_CANONICAL[norm];
  const withoutCount = norm.replace(/\s*[-–]\s*\d+\s*items?$/, "").trim();
  return LABEL_CANONICAL[withoutCount] || null;
}

function canonicalKey(raw) {
  return lookup(inlineParens(raw)) || lookup(normalizeLabel(raw));
}

module.exports = {
  normalizeLabel,
  canonicalKey,
  isGroupHeader,
  groupHeaderKind,
  isIgnoredLabel,
  LABEL_CANONICAL,
};

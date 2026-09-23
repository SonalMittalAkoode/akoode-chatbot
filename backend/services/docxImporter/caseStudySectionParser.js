// backend/services/docxImporter/caseStudySectionParser.js
//
// Section/entry parser for CASE STUDY LATEST documents only.
//
// This is deliberately a SEPARATE parser from sectionParser.js rather than an
// extension of it. The services documents (service-by-country /
// service-by-city) and the case study documents share almost no vocabulary,
// and several tokens mean different things in each — "Features" is the
// Choose Us feature list in a services document but the Core Features section
// in a case study, "Solution" is a project-info label in one and a section in
// the other. Threading both vocabularies through one parser would make every
// future case-study label a regression risk for the country and city imports,
// which are already live. Nothing in this file is imported by sectionParser.js
// and nothing in sectionParser.js is imported here.
//
// Input is the same flat block list produced by parser.js.
// Output shape:
//   { <sectionKey>: { fields: {...}, groups: { <group>: [entry, ...] } } }
//   entry = { keyword, index, fields: {...}, children: [entry, ...] }
//
// The documents these are written in are Word files, so the shapes handled
// below are what authors actually produce rather than an idealised grammar:
//   * almost every field is a BULLET, so list items are parsed as field lines
//     rather than treated as one opaque value
//   * fields are separated by "·" as often as by "|"
//   * entries are frequently unnumbered — a run of bullets under a "Cards"
//     header with no "Card 1" line anywhere — so a repeated leading field
//     ("Icon", "Value", "Tag", "Number") is what opens the next entry
//   * image guidance ("Image Note", "Media", "Hero Image (right side)") is
//     interleaved with real fields and must not land in the body copy

// ── sections ───────────────────────────────────────────────────────────────
// Exact-match only. The services parser also does a loose leading/trailing
// qualifier match; that is omitted here on purpose, because "Meta Chips" would
// otherwise be swallowed by the "Meta" section alias.
const SECTION_ALIASES = {
  "core information": "core",
  "core info": "core",
  "core": "core",

  "hero": "hero",

  "about the client": "rethinking",
  "about client": "rethinking",
  "the client": "rethinking",
  "rethinking": "rethinking",

  "the problem": "challenges",
  "problem": "challenges",
  "challenges": "challenges",

  "project objectives": "build",
  "objectives": "build",
  "what we set out to build": "build",
  "build": "build",

  "the solution": "pipeline",
  "solution": "pipeline",
  "how we built it": "pipeline",
  "pipeline": "pipeline",

  "core features": "powerful",
  "what makes this system powerful": "powerful",
  "what makes this powerful": "powerful",
  "powerful": "powerful",

  "tech stack": "techStack",
  "technology stack": "techStack",

  "engineering challenges": "keyChallenges",
  "key challenges": "keyChallenges",

  "results & impact": "whatChanged",
  "results and impact": "whatChanged",
  "results": "whatChanged",
  "what changed": "whatChanged",

  "use cases": "analytics",
  "use case": "analytics",
  "analytics": "analytics",
  "performance analytics": "analytics",

  "why akoode": "whyChoose",
  "why choose akoode": "whyChoose",
  "why choose us": "whyChoose",
  "why choose": "whyChoose",

  "more case studies": "moreCaseStudies",

  "final cta": "finalCta",
  "cta": "finalCta",

  "meta": "meta",
  "meta information": "meta",
  "seo meta": "meta",
};

// ── field labels ───────────────────────────────────────────────────────────
const LABEL_CANONICAL = {
  // core
  "title": "title",
  "page title": "title",
  "slug": "slug",
  "url slug": "slug",
  "keywords": "keywords",

  // section level
  "heading": "heading",
  "heading lead": "heading",
  "lead heading": "heading",
  "main heading": "heading",
  "heading accent": "headingAccent",
  "accent": "headingAccent",
  "accent heading": "headingAccent",
  "intro": "intro",
  "introduction": "intro",
  "body": "body",
  "body copy": "body",
  "body / subtitle": "body",
  "body subtitle": "body",
  "subtitle": "subtitle",
  "sub title": "subtitle",
  "quote": "quote",
  "quote strip": "quote",

  // entry level
  "number": "n",
  "n": "n",
  "icon": "icon",
  "label": "label",
  "column label": "label",
  "value": "value",
  "sub": "sub",
  "subtext": "sub",
  "text": "sub",
  "tag": "tag",
  "description": "desc",
  "desc": "desc",
  "bullets": "bullets",
  "bullet points": "bullets",
  "pills": "pills",
  "technologies": "pills",
  "tech": "pills",
  "problem": "problem",
  "approach": "approach",
  "stat": "stat",
  "stat pill": "stat",
  "stat pill text": "stat",

  // images — alt text only, the files are uploaded by hand.
  // A bare "Alt Text" is resolved against the image above it; see resolveKey.
  "alt text": "altText",
  "alt": "altText",
  "image alt": "altText",
  "hero image alt": "heroImageAlt",
  "listing image alt": "listingImageAlt",
  "hub image alt": "hubImageAlt",
  "media alt": "mediaAlt",

  // misc
  "hub badge": "hubBadge",
  "hub badge text": "hubBadge",
  "project info title": "projectInfoTitle",
  "project info card title": "projectInfoTitle",
  "cta text": "ctaText",
  "cta button text": "ctaText",
  "cta link": "ctaLink",
  "cta button link": "ctaLink",
  "cta note": "ctaNote",

  // meta
  "meta title": "metaTitle",
  "meta description": "metaDescription",
};

// Labels that carry production guidance rather than page content. They are
// listed so they can be DROPPED — left unrecognised, a line like
// "Image Note: Show the storefront on three device frames..." reads as prose
// and is appended to the body copy above it.
const IGNORED_LABELS = new Set([
  "image note", "note", "notes", "image", "media", "hero image",
  "listing image", "hub image", "hub centre image", "hub center image",
  "word count", "image size", "min size",
  // Authoring guidance written as a labelled line. Left unrecognised these
  // are appended to the last long-form field — a "Word-budget note" lands
  // inside the Approach copy of the card above it.
  "word-budget note", "word budget note", "content quality target",
  "status", "word budget",
]);

// Everything from a heading like "Fill gaps" onward is a checklist for the
// editor, not page content.
const STOP_HEADING_RE = /(fill gaps|gaps to fill|do not paste|do not import|internal notes?|notes? (?:for|to) )/i;

// Seeing one of these switches which image a following bare "Alt Text" belongs
// to. It is how a document written as
//     Hero Image (right side):
//       Alt Text: ...
//     Listing Image (Case studies page):
//       Alt Text: ...
// keeps the two apart.
const IMAGE_CONTEXT_LABELS = {
  "hero image": "heroImageAlt",
  "listing image": "listingImageAlt",
  "hub image": "hubImageAlt",
  "hub centre image": "hubImageAlt",
  "hub center image": "hubImageAlt",
  "media": "mediaAlt",
  "image": "mediaAlt",
};

// Fallback when "Alt Text" appears with no image named above it.
const DEFAULT_ALT_KEY = {
  hero: "heroImageAlt",
  keyChallenges: "hubImageAlt",
  powerful: "mediaAlt",
};

// ── group headers ──────────────────────────────────────────────────────────
// A bare line naming a run of entries. Needed wherever one section holds two
// different runs — About the Client has both Stats and Project Info, Results &
// Impact has both Columns and Result Stats.
const GROUP_HEADERS = {
  "meta chips": "metaChips",
  "chips": "metaChips",
  "floating cards": "floatingCards",
  "floating insight cards": "floatingCards",
  "stats": "stats",
  "project info": "projectInfo",
  "project info items": "projectInfo",
  "result stats": "resultStats",
  "result stats strip": "resultStats",
  "results stats strip": "resultStats",
  "cards": "cards",
  "challenge cards": "cards",
  "steps": "steps",
  "features": "features",
  "categories": "categories",
  "columns": "columns",
  "items": "items",
};

// Which group an entry keyword belongs to when no group header preceded it.
// The inverse of KEYWORD_GROUPS: which keyword an entry opened by a group
// header alone should carry, so nesting and mapping behave as if the document
// had numbered it ("Column"/"Card" drive the Results & Impact nesting).
const KEYWORD_FOR_GROUP = {
  metaChips: "chip",
  floatingCards: "floating card",
  stats: "stat",
  projectInfo: "project info",
  resultStats: "result stat",
  cards: "card",
  steps: "step",
  features: "feature",
  categories: "category",
  columns: "column",
  items: "item",
};

// An entry that already carries copy in one of these is finished taking
// titles; a plain list under it is its bullet list, not more entries.
const ENTRY_COPY_KEYS = ["desc", "problem", "approach", "body"];

const KEYWORD_GROUPS = {
  "chip": "metaChips",
  "floating card": "floatingCards",
  "result stat": "resultStats",
  "project info": "projectInfo",
  "stat": "stats",
  "card": "cards",
  "step": "steps",
  "feature": "features",
  "highlight": "features",
  "category": "categories",
  "column": "columns",
  "item": "items",
};

// Longest keyword first so "Result Stat 1" never matches the "stat" branch and
// "Project Info 2" never matches nothing. The trailing \d+ is required, which
// is what keeps the inline label "Stat: one refresh per expiry" out of here.
// The separator class carries every dash Word produces, em dash included
// ("Column 1 — Label: BEFORE").
const ENTRY_RE = new RegExp(
  "^(result stat|floating card|project info|category|highlight|feature|column|chip|card|step|stat|item)" +
    "\\s*#?\\s*(\\d{1,3})\\s*[:.\\-–—·|]?\\s*(.*)$",
  "i"
);

// "Label: value". The label side excludes ':' and '|' so a compound line
// splits correctly.
const INLINE_LABEL_RE = /^([A-Za-z][A-Za-z0-9 /&'".+()-]{0,60}):\s*(.*)$/;

// Separates the fields of a compound line. Both "|" and "·" are used in the
// wild; requiring whitespace on both sides keeps a mid-word character safe.
// The separator is captured so a segment that turns out NOT to be a field can
// be glued back onto the value it came from — "Meta Title: Gold Invest OpenCart
// Development | Akoode" is one field whose value contains a pipe, not two.
const FIELD_SPLIT_RE = /(\s+[|·]\s+)/;

/** Splits a line on the field separator, then re-joins any segment that is not
 *  itself a "Label: value" back onto the preceding segment. */
function splitFieldSegments(text) {
  const tokens = String(text).split(FIELD_SPLIT_RE);
  const segments = [];
  for (let i = 0; i < tokens.length; i += 2) {
    const segment = tokens[i];
    const separator = i > 0 ? tokens[i - 1] : "";
    if (segments.length && !INLINE_LABEL_RE.test(segment.trim())) {
      segments[segments.length - 1] += `${separator}${segment}`;
    } else {
      segments.push(segment);
    }
  }
  return segments;
}

const LEADING_NUMBER_RE = /^\s*\d{1,2}\s*[.)]\s+/;

// A react-icons style token — "FiTag", "FiShoppingCart", "MdHome". The
// lowercase run after the first capital is what keeps "BEFORE" and "OUR" out.
const ICON_TOKEN_RE = /^[A-Z][a-z]{1,3}[A-Z][A-Za-z0-9]*$/;

// Longest a leading segment can be and still be a stat figure rather than a
// title — "2", "0", "Live", "2-Step".
const MAX_STAT_VALUE = 14;

/**
 * An entry written positionally instead of with labels:
 *   "FiTag · QR-Linked Profiles · Every garment carries a digital identity"
 *   "2 · Claim Steps · Order ID and a six-digit OTP verify ownership"
 *   "FiMusic · Artist and Creator Merch"
 * The leading segment must be an icon token or a short figure — that is what
 * separates an entry line from an ordinary sentence containing a separator.
 * Returns null for anything else, including labelled compound lines, which
 * parseFieldLine already handles.
 */
function parsePositionalEntry(text) {
  const numbered = LEADING_NUMBER_RE.exec(text);
  const body = numbered ? text.slice(numbered[0].length) : text;
  const segments = body.split(/\s+[·|]\s+/).map((x) => x.trim()).filter(Boolean);
  if (segments.length < 2 || segments.length > 4) return null;
  if (segments.some((x) => INLINE_LABEL_RE.test(x))) return null;

  const fields = {};
  let at = 0;
  if (ICON_TOKEN_RE.test(segments[0])) fields.icon = segments[at++];

  // A short leading segment takes the value slot only when a title AND its
  // sub-line still follow it — "FiLayers · 3 · Surfaces on one API · App,
  // owner portal and admin console...". Without that rule
  // "FiUser · Client · Confidential" reads "Client" as a figure and the
  // label is lost. With no icon and no figure the line is ordinary prose.
  const remaining = segments.length - at;
  const takesValue = fields.icon ? remaining >= 3 : remaining === 3;
  if (takesValue && segments[at].length <= MAX_STAT_VALUE) fields.value = segments[at++];
  else if (!fields.icon) return null;

  const rest = segments.slice(at);
  if (!rest.length) return null;
  fields.title = rest[0];
  if (rest.length > 1) fields.sub = rest.slice(1).join(" · ");
  if (numbered) fields.n = numbered[0].trim().replace(/[.)]\s*$/, "");
  return fields;
}

// "Garments Carry a Live Identity — Each piece links to a profile the owner
// can update." A results column's cards are written as one line each.
const TITLE_DESC_RE = /^(.{3,70}?)\s+[-–—]\s+(\S.*)$/;

function splitTitleDesc(text) {
  const match = TITLE_DESC_RE.exec(String(text || "").trim());
  return match ? { title: match[1].trim(), desc: match[2].trim() } : { title: String(text).trim(), desc: "" };
}
const LEADING_BULLET_RE = /^\s*[•▪◦‣·*]\s+/;

// "________________" / "-----" separators between sections. Left alone they
// are appended to whichever long-form field was open.
const DECORATIVE_RE = /^[\s_\-–—=*·•.]{3,}$/;

// Fields whose value can run across several paragraphs. A plain paragraph that
// is not a label, entry or heading is appended to the last one of these set in
// the current scope — this is what turns the three paragraphs of "About the
// Client" into one body value.
const LONG_FORM_KEYS = new Set(["body", "intro", "desc", "problem", "approach", "quote"]);

// Fields that only ever exist at section level. A section-level label written
// AFTER a run of entries — "Quote strip" under The Problem sits below the last
// card — would otherwise be absorbed by that entry, so seeing one closes the
// entry. "heading" and "title" are deliberately NOT here: floating cards carry
// their own "Heading:" and every entry carries "Title:".
const SECTION_ONLY_KEYS = new Set([
  "headingAccent", "intro", "body", "quote", "subtitle",
  "ctaText", "ctaLink", "ctaNote",
  "hubBadge", "hubImageAlt", "heroImageAlt", "listingImageAlt",
  "projectInfoTitle", "slug", "keywords", "metaTitle", "metaDescription",
]);

// Multi-value single-line fields. Authors write these slash-separated as often
// as comma-separated ("Pills: OpenCart / Product Catalogue / Shopping Cart").
const LIST_KEYS = new Set(["bullets", "pills"]);

const splitList = (value) => {
  const text = String(value || "").trim();
  if (!text) return [];
  const parts = text.includes("/") ? text.split(/\s*\/\s*/) : text.split(/\s*[,•]\s*/);
  return parts.map((v) => v.trim()).filter(Boolean);
};

function normalize(raw) {
  return String(raw || "")
    .toLowerCase()
    .replace(/ /g, " ")
    .replace(LEADING_BULLET_RE, "")
    .replace(/[:\s]+$/, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(LEADING_NUMBER_RE, "")
    .replace(/^section\s+/, "")
    .replace(/\s+section$/, "")
    .replace(/\s*[-–—]\s*\d+\s*items?$/, "")
    .trim();
}

function canonicalKey(raw) {
  const norm = normalize(raw);
  if (!norm) return null;
  return LABEL_CANONICAL[norm] || null;
}

function resolveSectionKey(text) {
  const norm = normalize(text);
  if (!norm) return null;
  return SECTION_ALIASES[norm] || null;
}

function groupHeaderKey(text) {
  const norm = normalize(text);
  if (!norm) return null;
  return GROUP_HEADERS[norm] || null;
}

/**
 * Splits a line into its labelled fields.
 *   "Icon: FiGrid · Title: Cart · Description: Review before checkout"
 *     -> [{ key: "icon", value }, { key: "title", value }, { key: "desc", value }]
 * Returns null when the line does not begin with a "Label:" at all, so ordinary
 * prose falls through to the paragraph handling untouched.
 */
function parseFieldLine(text) {
  const parts = splitFieldSegments(text);
  if (!INLINE_LABEL_RE.test(parts[0].trim())) return null;

  const fields = [];
  let recognised = false;

  for (const part of parts) {
    const match = INLINE_LABEL_RE.exec(part.trim());
    if (!match) continue;
    const norm = normalize(match[1]);
    const value = match[2].trim();

    if (IMAGE_CONTEXT_LABELS[norm]) {
      fields.push({ key: null, imageContext: IMAGE_CONTEXT_LABELS[norm] });
      recognised = true;
      continue;
    }
    if (IGNORED_LABELS.has(norm)) {
      fields.push({ key: null });
      recognised = true;
      continue;
    }
    const key = LABEL_CANONICAL[norm];
    if (key) {
      fields.push({ key, value });
      recognised = true;
    }
  }

  return recognised ? fields : null;
}

/**
 * Parses the tail of a numbered entry line into inline fields.
 *   "Icon: FiLayers | Title: Map Search"
 *     -> { fields: { icon: "FiLayers", title: "Map Search" }, hint: "" }
 *   "Ecommerce Platforms" -> { fields: {}, hint: "Ecommerce Platforms" }
 */
function parseEntryTail(tail) {
  const fields = {};
  let hint = "";
  const trimmed = String(tail || "").trim();
  if (!trimmed) return { fields, hint };
  if (!trimmed.includes(":")) return { fields, hint: trimmed };

  for (const part of splitFieldSegments(trimmed)) {
    const match = INLINE_LABEL_RE.exec(part.trim());
    if (match) {
      const key = canonicalKey(match[1]);
      if (key && match[2].trim()) fields[key] = match[2].trim();
    } else if (!hint) {
      hint = part.trim();
    }
  }
  return { fields, hint };
}

const newSection = () => ({ fields: {}, groups: {} });
const newEntry = (keyword, index, fields) => ({
  keyword,
  index,
  fields: fields || {},
  children: [],
});

function parseCaseStudySections(blocks) {
  const sections = { core: newSection() };
  let sectionKey = "core";
  let group = null;         // group header currently in force, if any
  let entry = null;         // entry receiving fields right now
  let column = null;        // open "Column N" entry, for Card nesting
  let pendingKey = null;    // bare label awaiting its value on the next line
  let longKey = null;       // last long-form key set in the current scope
  let imageContext = null;  // which image a bare "Alt Text" belongs to

  const section = () => sections[sectionKey];
  const bucket = () => (entry ? entry.fields : section().fields);

  const setField = (key, value) => {
    if (!key || value === undefined || value === "") return;
    const target = bucket();
    if (Array.isArray(value)) {
      target[key] = Array.isArray(target[key]) ? target[key].concat(value) : value.slice();
    } else if (target[key] === undefined) {
      target[key] = value;
    } else if (LONG_FORM_KEYS.has(key) && typeof target[key] === "string") {
      target[key] = `${target[key]}\n\n${value}`;
    }
    if (LONG_FORM_KEYS.has(key)) longKey = key;
  };

  // "Alt Text" means a different field depending on which image it sits under.
  const resolveKey = (key) =>
    key === "altText" ? imageContext || DEFAULT_ALT_KEY[sectionKey] || "mediaAlt" : key;

  const pushEntry = (keyword, index, fields) => {
    const created = newEntry(keyword, index, fields);
    // "Card N" inside Results & Impact belongs to the open column, not to the
    // section — that is the only nesting in the whole document.
    if (keyword === "card" && sectionKey === "whatChanged" && column) {
      column.children.push(created);
    } else {
      const name = group || KEYWORD_GROUPS[keyword] || "items";
      const groups = section().groups;
      if (!groups[name]) groups[name] = [];
      groups[name].push(created);
      if (keyword === "column") column = created;
      // Any entry that is neither a column nor one of its cards closes the open
      // column, so Result Stats written after the columns can never nest.
      else if (keyword !== "card") column = null;
    }
    entry = created;
    pendingKey = null;
    longKey = null;
  };

  const enterSection = (key) => {
    sectionKey = key;
    if (!sections[key]) sections[key] = newSection();
    entry = null;
    column = null;
    group = null;
    pendingKey = null;
    longKey = null;
    imageContext = null;
  };

  // A run of unnumbered bullets under a group header is still a list of
  // entries. The signal that the next one has started is the reappearance of
  // the field that opened the current one — a second "Icon:" means a second
  // card. Long-form fields are excluded, because a second "Description:" is a
  // continuation rather than a new entry.
  const opensNewEntry = (keys) => {
    if (!keys.length) return false;
    if (!group && !entry) return false;
    if (!entry) return true;
    const first = keys[0];
    // A "Column N" entry owns nothing but its own label — everything else under
    // it is a card. Without this the first card of every column is written onto
    // the column itself and only the second one opens a nested entry.
    if (entry.keyword === "column") return first !== "label" && first !== "title";
    if (LONG_FORM_KEYS.has(first)) return false;
    return entry.fields[first] !== undefined;
  };

  const startAnonymousEntry = () => {
    const nested = sectionKey === "whatChanged" && column && group === "columns";
    pushEntry(nested ? "card" : "item", 0, {});
  };

  const handleText = (rawText, isHeading, isBold) => {
    let text = String(rawText || "").trim();
    if (!text) return;
    text = text.replace(LEADING_BULLET_RE, "").trim();
    if (!text || DECORATIVE_RE.test(text)) return;

    // 1. numbered entry line
    const entryMatch = ENTRY_RE.exec(text);
    if (entryMatch) {
      const keyword = entryMatch[1].toLowerCase().replace(/\s+/g, " ");
      const { fields, hint } = parseEntryTail(entryMatch[3] || "");
      if (hint && !fields.title) fields.title = hint;
      pushEntry(keyword, Number(entryMatch[2]), fields);
      return;
    }

    // 1b. positional entry line — "FiTag · QR-Linked Profiles · ...". Only
    // inside a run of entries, so a stray separator in prose is never an entry.
    if (group) {
      const positional = parsePositionalEntry(text);
      if (positional) {
        pushEntry(KEYWORD_FOR_GROUP[group] || "item", Number(positional.n) || 0, positional);
        return;
      }
    }

    // 2. section heading
    const nextSection = resolveSectionKey(text);
    if (nextSection && (isHeading || !text.includes(":"))) {
      enterSection(nextSection);
      return;
    }

    // 3. labelled field line — one "Label: value", or several split by · or |
    const parsed = parseFieldLine(text);
    if (parsed) {
      parsed.forEach((f) => {
        if (f.imageContext) imageContext = f.imageContext;
      });

      const applied = parsed
        .filter((f) => f.key)
        .map((f) => ({ key: resolveKey(f.key), value: f.value }));

      // Guidance-only line ("Image Note: ...", "Media (image only): upload").
      // It moves the image context along but writes nothing.
      if (!applied.length) return;

      const keys = applied.map((f) => f.key);
      if (keys.every((k) => SECTION_ONLY_KEYS.has(k))) {
        entry = null;
        longKey = null;
      } else if (opensNewEntry(keys)) {
        startAnonymousEntry();
      }

      applied.forEach(({ key, value }) => {
        if (value) setField(key, LIST_KEYS.has(key) ? splitList(value) : value);
        else pendingKey = key; // "Bullets:" with the list on the following lines
      });
      return;
    }

    // 3b. A meta chip IS a label/value pair, and the labels are the document's
    // own vocabulary ("Services", "Industry", "Client", "Type") rather than
    // this parser's — so inside that group an unrecognised label is the chip.
    if (group === "metaChips") {
      const chip = INLINE_LABEL_RE.exec(text);
      if (chip && chip[2].trim()) {
        pushEntry("chip", 0, { label: chip[1].trim(), value: chip[2].trim() });
        return;
      }
    }

    // 4. group header
    const nextGroup = groupHeaderKey(text);
    if (nextGroup) {
      group = nextGroup;
      entry = null;
      column = null;
      pendingKey = null;
      longKey = null;
      return;
    }

    // 4b. Results & Impact names its columns with a bold line of its own
    // ("BEFORE", "OUR SOLUTION", "AFTER") instead of "Column 1 - Label: ...".
    if (isBold && sectionKey === "whatChanged" && group !== "resultStats" && !canonicalKey(text)) {
      group = "columns";
      pushEntry("column", 0, { label: text });
      return;
    }

    // 4c. A bold line inside a run of entries that is not a label is the next
    // entry's title — "1. Storefront and Catalog", "Highlight 04 — ...",
    // "FiShield · Verifying Ownership Without Overcomplicating It".
    if (isBold && group && !canonicalKey(text)) {
      const numbered = LEADING_NUMBER_RE.exec(text);
      const fields = { title: numbered ? text.slice(numbered[0].length).trim() : text };
      if (numbered) fields.n = numbered[0].trim().replace(/[.)]\s*$/, "");
      pushEntry(KEYWORD_FOR_GROUP[group] || "item", Number(fields.n) || 0, fields);
      return;
    }

    // 5. bare label, value on the following line(s)
    const bare = canonicalKey(text);
    if (bare) {
      const key = resolveKey(bare);
      if (SECTION_ONLY_KEYS.has(key)) {
        entry = null;
        longKey = null;
      }
      pendingKey = key;
      return;
    }

    // 6. value for a bare label
    if (pendingKey) {
      const key = pendingKey;
      pendingKey = null;
      setField(key, LIST_KEYS.has(key) ? splitList(text) : text);
      return;
    }

    // 7. continuation of the last long-form field
    if (longKey) {
      setField(longKey, text);
      return;
    }

    // 8. first loose paragraph in an entry is its description
    if (entry && !entry.fields.desc) {
      setField("desc", text);
    }
  };

  for (const block of blocks) {
    if (block.type === "heading") {
      if (STOP_HEADING_RE.test(block.text)) break;
      handleText(block.text, true, false);
      continue;
    }
    if (block.type === "paragraph") {
      handleText(block.text, false, block.bold === true);
      continue;
    }
    if (block.type === "list") {
      const items = block.items.filter(Boolean);
      if (!items.length) continue;
      // A list directly under a bare "Bullets:" IS the value.
      if (pendingKey) {
        const key = pendingKey;
        pendingKey = null;
        setField(key, items.slice());
        continue;
      }
      // The cards of an open results column, one per line.
      if (column && group === "columns") {
        items.forEach((item) => pushEntry("card", 0, splitTitleDesc(item)));
        entry = null;
        continue;
      }
      // A plain list under an entry that already has its copy is that entry's
      // bullet list — "Highlight 01" in Core Features is written this way.
      if (entry && ENTRY_COPY_KEYS.some((k) => entry.fields[k]) &&
          items.every((item) => !parsePositionalEntry(item) && !parseFieldLine(item))) {
        setField("bullets", items.slice());
        continue;
      }
      // Otherwise the bullets are ordinary field lines. Word documents put
      // nearly every field in a bullet, so this is the common path rather than
      // the exception — treating the whole list as one opaque value here is
      // what made these documents import as two sections out of fourteen.
      items.forEach((item) => handleText(item, false));
      continue;
    }
    // tables carry no case-study fields — ignored
  }

  return sections;
}

module.exports = {
  parseCaseStudySections,
  SECTION_ALIASES,
  LABEL_CANONICAL,
  GROUP_HEADERS,
  resolveSectionKey,
  canonicalKey,
  parseEntryTail,
  parseFieldLine,
};

// backend/services/docxImporter/sectionParser.js
//
// Structure-first grouping: turns the flat block list from parser.js into a
// map keyed by the existing CMS section names (see cityMapper.js /
// countryMapper.js for the canonical list). This file understands the
// document's SHAPE — section headings, field labels, repeatable entries
// ("Service 1", "Stage 3", "Feature 2 - Icon: X | Title: Y") and lists — but
// never inspects the actual authored content. See STRUCTURE.md.
//
// Three label forms are supported, because the real source documents use all
// three interchangeably:
//   1. bare label on its own line, value on the following line(s)
//        Section Heading
//        Reliability Engineering for a Market...
//   2. inline "Label: value"
//        Heading (H2): Custom Ecommerce Development
//   3. compound entry line with pipe-separated inline fields
//        Feature 1 - Icon: FiLayers | Title: Built for a Market...
// Form 1 is only accepted for labels in the curated vocabulary (labels.js),
// so ordinary prose is never mistaken for a field label.

const { normalizeLabel, canonicalKey, groupHeaderKind, isIgnoredLabel } = require("./labels");

// Heading text (normalized) -> canonical section key.
//
// NOTE on "process": in this CMS `process` is the SERVICES OFFERED section
// (schema: process.services[]) while `whatWeDo` is the delivery-stage
// section (schema: whatWeDo.steps[]). The source documents label the
// delivery stages "Process Section", so "process" must resolve to whatWeDo —
// mapping it to `process` silently overwrites Services Offered and leaves
// What We Do empty.
const SECTION_ALIASES = {
  "core information": "core",
  "core info": "core",
  "hero": "hero",
  "trust": "chooseUs",
  "trust section": "chooseUs",
  "choose us": "chooseUs",
  "choose us trust": "chooseUs",
  "why location": "whyLocation",
  "services offered": "process",
  "services we offer": "process",
  "services": "process",
  "what we do": "whatWeDo",
  "what we do process": "whatWeDo",
  "delivery process": "whatWeDo",
  "how we deliver": "whatWeDo",
  "how we work": "whatWeDo",
  "process": "whatWeDo",
  "tech stack": "techStack",
  "technology stack": "techStack",
  "industries": "industries",
  "industries we serve": "industries",
  "engagement": "engagement",
  "engagement models": "engagement",
  "faq": "faq",
  "faqs": "faq",
  "case studies": "caseStudies",
  "testimonials": "testimonials",
  "blog": "blog",
  "blog insights": "blog",
  // "why choose us" MUST win over the "choose us" alias above — matching is
  // longest-alias-first for exactly this reason. Getting it wrong silently
  // merges the Why Choose cards into the Choose Us section.
  "why choose": "whyChoose",
  "why choose us": "whyChoose",
  "why choose akoode": "whyChoose",
  "why choose us akoode": "whyChoose",
  "what sets us apart": "whyChoose",
  "final cta": "finalCta",
  "cta": "finalCta",
  "meta": "meta",
  "meta information": "meta",
  "seo meta": "meta",
  "cities map": "citiesMap",
};

// Longest first, so a specific alias always beats a shorter one it contains
// ("why choose us" before "choose us").
const SECTION_ALIAS_ENTRIES = Object.entries(SECTION_ALIASES).sort(
  (a, b) => b[0].length - a[0].length
);

// "Why Canada", "Why the UK", "Why Toronto" — the Why Location section is
// named after the page's location, which is different in every document, so
// it cannot be alias-listed. Matched only AFTER every explicit alias, so
// "Why Choose Us" is never caught by it.
const WHY_LOCATION_RE = /^why\s+(?:the\s+)?[a-z][a-z\s]*$/;

// The only thing allowed either side of a section alias in the loose match:
// one or two plain words ("Core Info & Meta", "Why Location Overview"). Any
// digit, dash or colon means the line is content, not a section heading.
const QUALIFIER_RE = /^[a-z&]+(?:\s+[a-z&]+)?$/;

// A repeatable-entry line: "Service 1", "Stage 3", "Feature 2 - Icon: ...",
// "Tab 1 - Ecommerce Platforms", "Card 1 - Value: 4.9 | Label: ...".
// Group 3 (everything after the number) is parsed for inline fields — it is
// never trusted as a literal value (rule #28: no content-specific hardcoding).
const ENTRY_HEADING_RE =
  /^((?:service|stage|step|tab|item|card|feature|proof|faq(?:\s*item)?|case\s*study|testimonial|blog(?:\s*item)?|industry|model|category|stat|hero|platform\s*rating|pill|client\s*love)(?:\s*cards?)?)\s*#?\s*(\d+)\s*[:.\-–|]?\s*(.*)$/i;

// "01 / 06  The Product People Actually Carry With Them" — a numbered service
// entry that names its position in the set instead of using a keyword.
const COUNTER_ENTRY_RE = /^(\d{1,2})\s*\/\s*\d{1,2}\s+(.*)$/;

// "Q1: How much does it cost?" / "A1: It depends on scope."
const FAQ_QUESTION_RE = /^Q\s*(\d{1,2})\s*[:.)]\s*(.*)$/i;
const FAQ_ANSWER_RE = /^A\s*(\d{1,2})\s*[:.)]\s*(.*)$/i;

// "01 - iOS App Development" — a numbered entry that uses a dash instead of
// a full stop. Same role as NUMBERED_ENTRY_RE below and the same guards.
const DASH_NUMBER_ENTRY_RE = /^(\d{1,2})\s*[-–—]\s*(.+)$/;

// "1. Healthcare" — a plainly numbered item. Only treated as an entry inside
// sections that actually hold repeatable items, and only when the text isn't
// a section name, so numbered SECTION headings ("1. Core Info") are unaffected.
const NUMBERED_ENTRY_RE = /^(\d{1,2})\s*[.)]\s+(.+)$/;
// Bare labels ("Bullet Points" on its own line) are used at BOTH levels:
// inside a repeatable entry ("Heading", "Paragraph", "Tags") and back at
// section level after the entries have ended ("Section Image / Alt Text",
// "Card Footer"). Only the keys below stay attached to the open entry; any
// other label ends it and writes to the section, which is what keeps a
// section's trailing fields out of its last entry.
const ENTRY_FIELD_KEYS = new Set([
  "heading", "title", "shortTitle", "name", "subtitle", "body", "points",
  "tags", "deliverables", "perks", "badge", "best", "timeline", "timelineNote",
  "ctaText", "ctaLink", "icon", "iconAlt", "value", "label", "sub", "n",
  "question", "answer",
]);

const ENTRY_BEARING_SECTIONS = new Set([
  "process", "whatWeDo", "industries", "engagement", "faq",
  "chooseUs", "whyLocation", "techStack", "whyChoose", "hero",
]);

// "Label: value" — the label side deliberately excludes ':' and '|' so a
// compound line splits correctly.
const INLINE_LABEL_RE = /^([A-Za-z][A-Za-z0-9 /&'".+()-]{0,60}):\s*(.*)$/;

// Documents number their sections ("1. Core Info", "16. Meta"). The numbering
// is presentation, not content, so it is stripped before matching.
const LEADING_NUMBER_RE = /^\s*\d{1,2}\s*[.)]\s+/;

const stripSectionSuffix = (text) =>
  normalizeLabel(text)
    .replace(LEADING_NUMBER_RE, "")
    .replace(/\s+section$/, "")
    .replace(/\s*[-–]\s*\d+\s*items?$/, "")
    .trim();

function resolveSectionKey(headingText) {
  const norm = stripSectionSuffix(headingText);
  if (!norm) return null;
  if (SECTION_ALIASES[norm]) return SECTION_ALIASES[norm];
  // Loose match ONLY for a leading/trailing qualifier word, e.g.
  // "Why Location Overview" -> "why location". Deliberately NOT a substring
  // match — that would misfire on entry lines that legitimately contain a
  // section name (those are caught by ENTRY_HEADING_RE first anyway).
  for (const [alias, key] of SECTION_ALIAS_ENTRIES) {
    const extra = norm.startsWith(`${alias} `)
      ? norm.slice(alias.length)
      : norm.endsWith(` ${alias}`)
        ? norm.slice(0, -alias.length)
        : null;
    // The qualifier must be a word or two of plain text. Without this an
    // entry line like "Industries Served - 15" (a hero stat card) reads as
    // the Industries section heading and hijacks everything after it.
    if (extra !== null && QUALIFIER_RE.test(extra.trim())) return key;
  }
  // Location-named Why section, last so explicit aliases always win.
  if (WHY_LOCATION_RE.test(norm)) return "whyLocation";
  return null;
}

/**
 * Parses the tail of an entry line into inline fields.
 *   "Icon: FiLayers | Title: Built for a Market"
 *     -> { fields: { icon: "FiLayers", title: "Built for a Market" }, hint: "" }
 *   "Ecommerce Platforms"
 *     -> { fields: {}, hint: "Ecommerce Platforms" }
 */
function parseEntryTail(tail) {
  const fields = {};
  let hint = "";
  const trimmed = String(tail || "").trim();
  if (!trimmed) return { fields, hint };

  if (!trimmed.includes(":")) return { fields, hint: trimmed };

  for (const part of trimmed.split("|")) {
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

const MAX_LIST_ITEM_NAME = 60;

function splitListItem(text) {
  const trimmed = String(text || "").trim();
  if (trimmed.length <= MAX_LIST_ITEM_NAME) return { name: trimmed, body: "" };
  const breakAt = trimmed.search(/[.\n:–—]/);
  if (breakAt > 0 && breakAt <= MAX_LIST_ITEM_NAME) {
    return {
      name: trimmed.slice(0, breakAt).trim(),
      body: trimmed.slice(breakAt + 1).trim(),
    };
  }
  return { name: trimmed, body: "" };
}

// "Title - body sentence." — documents write a card's title and its body as
// one paragraph. Split only on a spaced dash after a short, non-sentence
// opening, so ordinary prose containing a dash is left alone.
const TITLE_BODY_RE = /^([^.!?]{3,70}?)\s+[-–—]\s+(\S.*)$/;

function splitTitleBody(text) {
  const match = TITLE_BODY_RE.exec(String(text || "").trim());
  if (!match) return null;
  return { title: match[1].trim(), body: match[2].trim() };
}

// Everything from this heading on is authoring notes, not page content.
const STOP_HEADING_RE = /(do not paste|do not import|do not publish|internal notes?|notes? (?:for|to) )/i;

const newSection = () => ({ fields: {}, entries: [], found: true });
const newEntry = (keyword, hint, fields, group) => ({
  keyword: keyword || "",
  hint: hint || "",
  group: group || "",
  fields: fields || {},
});

function parseSections(blocks) {
  const sections = { core: newSection() };
  let currentSectionKey = "core";
  let currentEntry = null;
  let pendingKey = null; 
  let currentGroup = ""; 

  const target = () => (currentEntry ? currentEntry.fields : sections[currentSectionKey].fields);

  const LONG_FORM_KEYS = new Set([
    "body", "para1", "para2", "para3", "cardBody", "answer", "ctaBody",
  ]);

  // Bullet lists are not always real <ul> lists — many documents write
  // "Bullet Points" and then one plain paragraph per bullet. These keys
  // therefore keep collecting paragraphs (into an array) until the next
  // label, entry or section, instead of taking only the first one.
  const LIST_KEYS = new Set(["points", "deliverables", "perks"]);

  const setField = (key, value) => {
    if (!key || value === undefined || value === "") return;
    const bucket = target();
    if (LIST_KEYS.has(key) && typeof value === "string") {
      if (Array.isArray(bucket[key])) bucket[key].push(value);
      else if (bucket[key] === undefined) bucket[key] = [value];
      return;
    }
    if (bucket[key] === undefined) bucket[key] = value;
    else if (Array.isArray(bucket[key]) && Array.isArray(value)) bucket[key] = bucket[key].concat(value);
    else if (LONG_FORM_KEYS.has(key) && typeof bucket[key] === "string" && typeof value === "string") {
      bucket[key] = `${bucket[key]}\n\n${value}`;
    }
  };

  const startEntry = (keyword, tail) => {
    const { fields, hint } = parseEntryTail(tail);
    currentEntry = newEntry(keyword, hint, fields, currentGroup);
    sections[currentSectionKey].entries.push(currentEntry);
    pendingKey = null;
  };

  const enterSection = (key) => {
    currentSectionKey = key;
    if (!sections[key]) sections[key] = newSection();
    currentEntry = null;
    pendingKey = null;
    currentGroup = "";
  };

  const handleTextBlock = (rawText, isHeading, isBold) => {
    const text = rawText.trim();
    if (!text) return;

    const entryMatch = ENTRY_HEADING_RE.exec(text);
    if (entryMatch) {
      const tail = entryMatch[3] || "";
      if (tail.length < 60 || tail.includes(":")) {
        startEntry(entryMatch[1], tail);
        return;
      }
    }
    const counterMatch = COUNTER_ENTRY_RE.exec(text);
    if (counterMatch) {
      startEntry("Service", counterMatch[2]);
      setField("n", counterMatch[1]);
      return;
    }
    const questionMatch = FAQ_QUESTION_RE.exec(text);
    if (questionMatch) {
      startEntry("FAQ", "");
      setField("question", questionMatch[2].trim());
      return;
    }
    const answerMatch = FAQ_ANSWER_RE.exec(text);
    if (answerMatch && currentEntry) {
      setField("answer", answerMatch[2].trim());
      return;
    }
    if (isHeading) {
      const sectionKey = resolveSectionKey(text);
      if (sectionKey) {
        enterSection(sectionKey);
        return;
      }
    }

    const inline = INLINE_LABEL_RE.exec(text);
    if (inline) {
      const key = canonicalKey(inline[1]);
      if (key) {
        if (inline[2].trim()) {
          setField(key, inline[2].trim());
          pendingKey = null;
        } else {
          pendingKey = key; 
        }
        return;
      }
    }

    const normalized = normalizeLabel(text);
    // A line that is a known field label is a label first — group headers are
    // only for lines that name a set of entries and nothing else.
    const group = canonicalKey(text) ? null : groupHeaderKind(normalized);
    if (group !== null) {
      pendingKey = null;
      currentEntry = null;
      currentGroup = group;
      return;
    }

    if (isIgnoredLabel(normalized)) {
      pendingKey = null;
      return;
    }
    const bareKey = canonicalKey(text);
    if (bareKey) {
      if (!currentEntry || !ENTRY_FIELD_KEYS.has(bareKey)) currentEntry = null;
      pendingKey = bareKey;
      return;
    }

    const numbered =
      NUMBERED_ENTRY_RE.exec(text) || DASH_NUMBER_ENTRY_RE.exec(text);
    if (numbered && ENTRY_BEARING_SECTIONS.has(currentSectionKey)) {
      const title = numbered[2].trim();
      if (!resolveSectionKey(title)) {
        startEntry("Item", title);
        setField("n", numbered[1]);
        return;
      }
    }

    // A fully bold line that is not a known label is an entry title —
    // "Real Estate" above its description. Documents rely on weight alone
    // for these, with no number or keyword to match on, so without this the
    // whole Industries-style list is read as loose prose and dropped.
    // ALL-CAPS bold ("BRIDGE PARAGRAPH (WITH INLINE LINK)", "STAT FEATURES")
    // is how these documents write structural labels TO THE EDITOR; entry
    // titles are written in ordinary title case. An unrecognised label ends
    // the open entry rather than starting a new one.
    if (isBold && !/[a-z]/.test(text)) {
      currentEntry = null;
      pendingKey = null;
      return;
    }

    if (isBold && ENTRY_BEARING_SECTIONS.has(currentSectionKey) && !resolveSectionKey(text)) {
      startEntry("Item", text);
      return;
    }

    if (pendingKey) {
      const key = pendingKey;
      if (!LONG_FORM_KEYS.has(key) && !LIST_KEYS.has(key)) pendingKey = null;
      setField(key, text);
      return;
    }

    if (!isHeading) {
      const sectionKey = resolveSectionKey(text);
      if (sectionKey) {
        enterSection(sectionKey);
        return;
      }
    }

    if (currentEntry && !currentEntry.fields.body) {
      // "Feature Card 1" / "Proof Card 2" name the slot but not the card, so
      // the paragraph underneath carries both title and body.
      // Only for card entries, whose slot line ("Feature Card 1") names no
      // card. Q/A and other entries keep their paragraph intact — an answer
      // that happens to contain a dash is not a title.
      const isCard = /card|feature|proof/i.test(currentEntry.keyword || "");
      const needsTitle =
        isCard && !currentEntry.hint && !currentEntry.fields.title && !currentEntry.fields.heading;
      const split = needsTitle ? splitTitleBody(text) : null;
      if (split) {
        currentEntry.hint = split.title;
        currentEntry.fields.body = split.body;
        return;
      }
      currentEntry.fields.body = text;
      return;
    }

  };

  for (const block of blocks) {
    if (block.type === "heading") {
      // Working notes to the editor are written under their own heading at
      // the end of the document and are explicitly not page content.
      if (STOP_HEADING_RE.test(block.text)) break;
      handleTextBlock(block.text, true, false);
      continue;
    }
    if (block.type === "paragraph") {
      handleTextBlock(block.text, false, block.bold === true);
      continue;
    }
    if (block.type === "list") {
      if (pendingKey) {
        setField(pendingKey, block.items.slice());
        pendingKey = null;
        continue;
      }
      if (ENTRY_BEARING_SECTIONS.has(currentSectionKey)) {
        block.items.forEach((item, index) => {
          const { name, body } = splitListItem(item);
          startEntry("Item", name);
          setField("n", String(index + 1));
          if (body) setField("body", body);
        });
      }
      continue;
    }
    if (block.type === "table") {
      if (pendingKey) setField(pendingKey, block.rows);
      continue;
    }
  }

  return sections;
}

module.exports = { parseSections, SECTION_ALIASES, resolveSectionKey, parseEntryTail };

// backend/services/docxImporter/caseStudyMapper.js
//
// Turns the output of caseStudySectionParser into the CaseStudyLatest shape
// consumed by the admin form. Nothing here is shared with cityMapper /
// countryMapper — see the header of caseStudySectionParser.js for why.
//
// Images are never imported. Only the *Alt fields are filled; the admin
// uploads the files by hand afterwards, exactly as before.

const { parseCaseStudySections } = require("./caseStudySectionParser");

const toSlug = (val) =>
  String(val || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// Fields backed by HtmlEditor in the admin form. The parser hands back plain
// text with "\n\n" between paragraphs, so each paragraph becomes its own <p> —
// otherwise the three paragraphs of "About the Client" collapse into one.
const rich = (value) => {
  const text = String(value ?? "").trim();
  if (!text) return "";
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br />")}</p>`)
    .join("");
};

// Fields backed by a plain <input> / <textarea>.
const plain = (value) => {
  if (Array.isArray(value)) return value.join(", ");
  return String(value ?? "").trim().replace(/\s*\n+\s*/g, " ");
};

const asList = (value) => {
  if (Array.isArray(value)) return value.map((v) => plain(v)).filter(Boolean);
  const text = plain(value);
  if (!text) return [];
  return text.split(",").map((v) => v.trim()).filter(Boolean);
};

const sec = (sections, key) => sections[key] || { fields: {}, groups: {} };
const grp = (section, name) => (section.groups && section.groups[name]) || [];

// An entry's title: an explicit "Title:" wins, otherwise the text that
// followed the entry number ("Card 1 - Availability Was Guesswork").
const entryTitle = (f) => plain(f.title || f.heading || "");

// Drops objects where every value is empty, so a stray "Card 4" heading with
// nothing under it does not add a blank row to the form.
const compact = (rows) =>
  rows.filter((row) =>
    Object.values(row).some((v) => (Array.isArray(v) ? v.length > 0 : String(v || "").trim() !== ""))
  );

const hasContent = (obj) =>
  Object.entries(obj).some(([key, value]) => {
    if (key === "show") return false;
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === "object") return hasContent(value);
    return String(value || "").trim() !== "";
  });

// Attaches the per-section `show` toggle: a section is switched on only if the
// document actually gave it something.
const withShow = (value, defaultOn = false) => ({
  ...value,
  show: hasContent(value) ? true : defaultOn,
});

function mapCaseStudyDocument(blocks) {
  const sections = parseCaseStudySections(blocks);
  const warnings = [];
  const sectionsFound = [];

  const core = sec(sections, "core").fields;
  const title = plain(core.title);
  const slug = toSlug(plain(core.slug) || title);
  const keywords = plain(core.keywords);

  // ── hero ────────────────────────────────────────────────────────────────
  const heroSec = sec(sections, "hero");
  const h = heroSec.fields;
  const hero = withShow(
    {
      heading: plain(h.heading),
      headingAccent: plain(h.headingAccent),
      body: rich(h.body),
      heroImageAlt: plain(h.heroImageAlt || h.mediaAlt),
      listingImageAlt: plain(h.listingImageAlt),
      metaChips: compact(
        grp(heroSec, "metaChips").map((e) => ({
          label: plain(e.fields.label),
          value: plain(e.fields.value),
          link: "",
          services: [],
        }))
      ),
      // Stored as { label, value, unit } where unit is the icon name, label is
      // the card heading and value is its subtitle (CaseStudyForm.jsx).
      floatingCards: compact(
        grp(heroSec, "floatingCards").map((e) => ({
          unit: plain(e.fields.icon),
          label: plain(e.fields.heading || e.fields.title || e.fields.label),
          value: plain(e.fields.sub || e.fields.desc || e.fields.value),
        }))
      ),
    },
    true
  );

  // ── about the client ────────────────────────────────────────────────────
  const rSec = sec(sections, "rethinking");
  const r = rSec.fields;
  const rethinking = withShow({
    heading: plain(r.heading),
    headingAccent: plain(r.headingAccent),
    body: rich(r.body || r.intro),
    ctaText: plain(r.ctaText),
    ctaLink: plain(r.ctaLink),
    projectInfoTitle: plain(r.projectInfoTitle) || "Project Info",
    stats: compact(
      grp(rSec, "stats").map((e) => ({
        value: plain(e.fields.value),
        title: entryTitle(e.fields),
        sub: plain(e.fields.sub || e.fields.desc),
      }))
    ),
    projectInfo: compact(
      // Written either as "Label: Client · Value: Confidential" or
      // positionally as "FiUser · Client · Confidential", which lands the
      // label in `title` and the value in `sub`.
      grp(rSec, "projectInfo").map((e) => ({
        icon: plain(e.fields.icon),
        label: plain(e.fields.label || e.fields.title),
        value: plain(e.fields.value || e.fields.desc || e.fields.sub),
      }))
    ),
  });
  // projectInfoTitle always has a default, so it must not count as content.
  rethinking.show =
    hasContent({ ...rethinking, projectInfoTitle: "" }) ? true : false;

  // ── the problem ─────────────────────────────────────────────────────────
  const cSec = sec(sections, "challenges");
  const c = cSec.fields;
  const challenges = withShow({
    heading: plain(c.heading),
    headingAccent: plain(c.headingAccent),
    intro: rich(c.intro || c.body),
    cards: compact(
      grp(cSec, "cards").map((e) => ({
        icon: plain(e.fields.icon),
        title: entryTitle(e.fields),
        desc: rich(e.fields.desc),
      }))
    ),
    quote: rich(c.quote),
  });

  // ── project objectives ──────────────────────────────────────────────────
  const bSec = sec(sections, "build");
  const b = bSec.fields;
  const build = withShow({
    heading: plain(b.heading),
    headingAccent: plain(b.headingAccent),
    intro: rich(b.intro || b.body),
    cards: compact(
      grp(bSec, "cards").map((e, i) => ({
        n: plain(e.fields.n) || String(i + 1).padStart(2, "0"),
        title: entryTitle(e.fields),
        desc: rich(e.fields.desc),
      }))
    ),
  });

  // ── the solution ────────────────────────────────────────────────────────
  const pSec = sec(sections, "pipeline");
  const p = pSec.fields;
  const pipeline = withShow({
    heading: plain(p.heading),
    headingAccent: plain(p.headingAccent),
    intro: rich(p.intro || p.body),
    steps: compact(
      grp(pSec, "steps").map((e, i) => ({
        n: plain(e.fields.n) || String(i + 1).padStart(2, "0"),
        title: entryTitle(e.fields),
        desc: rich(e.fields.desc),
      }))
    ),
  });

  // ── core features ───────────────────────────────────────────────────────
  const pwSec = sec(sections, "powerful");
  const pw = pwSec.fields;
  const powerful = withShow({
    heading: plain(pw.heading),
    headingAccent: plain(pw.headingAccent),
    features: compact(
      grp(pwSec, "features").map((e) => ({
        tag: plain(e.fields.tag),
        title: entryTitle(e.fields),
        desc: rich(e.fields.desc),
        bullets: asList(e.fields.bullets),
        media: "",
        mediaAlt: plain(e.fields.mediaAlt),
        mediaType: "image",
        embedCode: "",
      }))
    ),
  });

  // ── tech stack ──────────────────────────────────────────────────────────
  const tsSec = sec(sections, "techStack");
  const ts = tsSec.fields;
  const techStack = withShow({
    heading: plain(ts.heading),
    headingAccent: plain(ts.headingAccent),
    intro: rich(ts.intro || ts.body),
    ctaText: plain(ts.ctaText),
    ctaLink: plain(ts.ctaLink),
    cats: compact(
      grp(tsSec, "categories").map((e) => ({
        icon: plain(e.fields.icon),
        title: entryTitle(e.fields),
        desc: rich(e.fields.desc),
        // The logo image is picked from the dropdown in the admin — the
        // document only supplies the label.
        pills: asList(e.fields.pills).map((label) => ({ label, img: "" })),
      }))
    ),
  });

  // ── engineering challenges ──────────────────────────────────────────────
  const kcSec = sec(sections, "keyChallenges");
  const kc = kcSec.fields;
  const keyChallenges = withShow({
    heading: plain(kc.heading),
    headingAccent: plain(kc.headingAccent),
    intro: rich(kc.intro || kc.body),
    hubBadge: plain(kc.hubBadge),
    hubImageAlt: plain(kc.hubImageAlt),
    ctaText: plain(kc.ctaText),
    ctaLink: plain(kc.ctaLink),
    cards: compact(
      grp(kcSec, "cards").map((e) => ({
        icon: plain(e.fields.icon),
        title: entryTitle(e.fields),
        problem: rich(e.fields.problem),
        approach: rich(e.fields.approach),
        stat: plain(e.fields.stat),
      }))
    ),
  });

  // ── results & impact ────────────────────────────────────────────────────
  const wcSec = sec(sections, "whatChanged");
  const wc = wcSec.fields;
  const whatChanged = withShow({
    heading: plain(wc.heading),
    headingAccent: plain(wc.headingAccent),
    intro: rich(wc.intro || wc.body),
    columns: grp(wcSec, "columns")
      .map((col) => ({
        label: plain(col.fields.label || col.fields.title),
        cards: compact(
          col.children.map((e) => ({
            icon: plain(e.fields.icon),
            title: entryTitle(e.fields),
            desc: rich(e.fields.desc),
          }))
        ),
      }))
      .filter((col) => col.label || col.cards.length),
    resultStats: compact(
      grp(wcSec, "resultStats").map((e) => ({
        icon: plain(e.fields.icon),
        value: plain(e.fields.value),
        label: plain(e.fields.label || e.fields.title),
        // plain <input> in the admin, so no <p> wrapper here
        desc: plain(e.fields.desc || e.fields.sub),
      }))
    ),
  });

  // ── use cases ───────────────────────────────────────────────────────────
  const anSec = sec(sections, "analytics");
  const an = anSec.fields;
  const analytics = withShow({
    heading: plain(an.heading),
    headingAccent: plain(an.headingAccent),
    intro: rich(an.intro || an.body),
    ctaText: plain(an.ctaText),
    ctaLink: plain(an.ctaLink),
    ctaNote: plain(an.ctaNote),
    items: compact(
      // "Item N" is the documented keyword; "Card N" is accepted too so a
      // writer who reuses the Card wording still lands here.
      grp(anSec, "items")
        .concat(grp(anSec, "cards"))
        .map((e) => ({
          icon: plain(e.fields.icon),
          title: entryTitle(e.fields),
          desc: rich(e.fields.desc),
        }))
    ),
  });

  // ── why akoode ──────────────────────────────────────────────────────────
  const wchSec = sec(sections, "whyChoose");
  const wch = wchSec.fields;
  const whyChoose = withShow({
    heading: plain(wch.heading),
    headingAccent: plain(wch.headingAccent),
    intro: rich(wch.intro || wch.body),
    cards: compact(
      grp(wchSec, "cards")
        .concat(grp(wchSec, "items"))
        .map((e) => ({
          icon: plain(e.fields.icon),
          title: entryTitle(e.fields),
          desc: rich(e.fields.desc),
        }))
    ),
  });

  // ── final cta ───────────────────────────────────────────────────────────
  const fc = sec(sections, "finalCta").fields;
  const finalCta = {
    heading: plain(fc.heading),
    // "Subtext" is the label most documents use here; it canonicalises to `sub`.
    subtitle: plain(fc.subtitle || fc.sub || fc.body || fc.intro),
  };

  // ── meta ────────────────────────────────────────────────────────────────
  const m = sec(sections, "meta").fields;
  const meta = {
    title: plain(m.metaTitle || m.title),
    description: plain(m.metaDescription || m.body || m.desc),
  };

  const SECTION_VALUES = {
    hero, rethinking, challenges, build, pipeline, powerful, techStack,
    keyChallenges, whatChanged, analytics, whyChoose, finalCta, meta,
  };
  Object.entries(SECTION_VALUES).forEach(([key, value]) => {
    if (hasContent(value)) sectionsFound.push(key);
  });

  // ── warnings the admin should act on before saving ──────────────────────
  if (!plain(core.slug) && title) {
    warnings.push(`No "Slug" field in the document — "${slug}" was derived from the title. Check it before saving.`);
  }
  if (hero.metaChips.length === 0) {
    warnings.push("No Meta Chips found in the Hero section.");
  }
  const servicesChip = hero.metaChips.find(
    (chip) => chip.label.trim().toLowerCase() === "services"
  );
  if (servicesChip) {
    warnings.push(
      'The "Services" chip is imported as plain text. Tick the matching services in the chip so each one links to its service page.'
    );
  }
  if (hero.metaChips.some((chip) => chip.label.trim().toLowerCase() === "industry")) {
    warnings.push(
      'The "Industry" chip is imported as plain text. Re-select it from the Industry dropdown so the industry link is set.'
    );
  }
  if (powerful.features.some((f) => f.mediaAlt) || hero.heroImageAlt || keyChallenges.hubImageAlt) {
    warnings.push("Alt text was imported, but images are never imported — upload the hero, listing, hub and feature images by hand.");
  }
  const emptyIconSections = [];
  if (challenges.cards.some((x) => !x.icon)) emptyIconSections.push("The Problem");
  if (keyChallenges.cards.some((x) => !x.icon)) emptyIconSections.push("Engineering Challenges");
  if (whyChoose.cards.some((x) => !x.icon)) emptyIconSections.push("Why Akoode");
  if (emptyIconSections.length) {
    warnings.push(`Some cards have no icon (${emptyIconSections.join(", ")}). Pick one in the icon picker.`);
  }

  const data = {
    title,
    slug,
    keywords,
    hero,
    rethinking,
    challenges,
    build,
    pipeline,
    powerful,
    techStack,
    keyChallenges,
    whatChanged,
    analytics,
    whyChoose,
    finalCta,
    meta,
  };

  return { data, warnings, sectionsFound };
}

module.exports = { mapCaseStudyDocument };

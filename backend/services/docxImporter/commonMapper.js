const { sanitizeRichText, pickText, pickList, joinHeadingAccent } = require("./fieldUtils");

const rich = (fields, key) => sanitizeRichText(pickText(fields, [key]));

// A stat card written as one line — "Google Rating - 4.9 (91 reviews)" —
// instead of "Card 1 - Value: 4.9 | Label: Google Rating". The label is the
// side without the figure; a leading number on the other side is the value
// and whatever trails it is the sub-line.
const STAT_VALUE_RE = /^([\d][\d.,]*\s*[%+kmbKMB]?\+?)\s*[\s(\-–—:]*\s*(.*?)\)?$/;
const MAX_STAT_VALUE = 24;

function splitStatLine(text) {
  const line = String(text || "").trim();
  if (!line) return null;
  const match = /^(.{2,60}?)\s*[-–—:]\s+(\S.*)$/.exec(line);
  if (!match) return null;
  const label = match[1].trim();
  const rest = match[2].trim();
  const numeric = STAT_VALUE_RE.exec(rest);
  if (numeric) return { label, value: numeric[1].trim(), sub: numeric[2].trim() };
  // No figure to show: keep the text as the sub-line rather than stuffing a
  // sentence into the card's value slot.
  return rest.length <= MAX_STAT_VALUE
    ? { label, value: rest, sub: "" }
    : { label, value: "", sub: rest };
}

const entryTitle = (entry) =>
  pickText(entry.fields, ["title"]) || pickText(entry.fields, ["heading"]) || entry.hint;

function mapHero(section) {
  if (!section) return { present: false, value: {} };
  const f = section.fields;
  const stats = section.entries
    .map((e) => {
      const fromLine = pickText(e.fields, ["value"]) ? null : splitStatLine(e.hint);
      return {
        icon: pickText(e.fields, ["icon"], "BriefcaseStatIcon") || "BriefcaseStatIcon",
        value: pickText(e.fields, ["value"]) || (fromLine ? fromLine.value : ""),
        label: pickText(e.fields, ["label"]) || (fromLine ? fromLine.label : ""),
        sub: pickText(e.fields, ["sub"]) || (fromLine ? fromLine.sub : ""),
      };
    })
    .filter((stat) => stat.value || stat.label);
  return {
    present: true,
    value: {
      heading: rich(f, "heading"),
      body: rich(f, "body"),
      heroImageAlt: pickText(f, ["imageAlt"]),
      cta1: pickText(f, ["ctaText"]),
      cta1Link: pickText(f, ["ctaLink"]),
      cta2: "",
      cta2Link: "",
      stats,
    },
  };
}

function mapChooseUs(section) {
  if (!section) return { present: false, value: {} };
  const f = section.fields;
  const isClientLove = (e) =>
    e.group === "clientLove" ||
    /client\s*love/i.test(e.keyword || "") ||
    /client\s*love/i.test(e.hint || "");
  const toFeature = (e) => ({
    icon: pickText(e.fields, ["icon"]),
    title: entryTitle(e),
    body: rich(e.fields, "body"),
  });
  return {
    present: true,
    value: {
      heading: rich(f, "heading"),
      intro: rich(f, "intro") || rich(f, "subtitle") || rich(f, "body"),
      features: section.entries.filter((e) => !isClientLove(e)).map(toFeature),
      clientLove: section.entries.filter(isClientLove).map(toFeature),
    },
  };
}

function mapWhyLocation(section) {
  if (!section) return { present: false, value: {} };
  const f = section.fields;
  return {
    present: true,
    value: {
      heading: rich(f, "heading"),
      para1: rich(f, "para1") || rich(f, "body"),
      para2: rich(f, "para2"),
      para3: rich(f, "para3"),
      imageAlt: pickText(f, ["imageAlt"]),
      cardLocation: pickText(f, ["cardLocation"]),
      cardHeading: pickText(f, ["cardHeading"]),
      cardBody: rich(f, "cardBody"),
      features: section.entries.map((e) => ({
        icon: pickText(e.fields, ["icon"]),
        title: entryTitle(e),
        body: rich(e.fields, "body"),
      })),
    },
  };
}

function mapProcess(section) {
  if (!section) return { present: false, value: {} };
  const f = section.fields;
  const services = section.entries.map((e, index) => ({
    n: pickText(e.fields, ["n"]) || String(index + 1).padStart(2, "0"),
    title: entryTitle(e),
    subtitle: pickText(e.fields, ["subtitle"]),
    para: rich(e.fields, "body"),
    points: pickList(e.fields, ["points"]),
    tags: pickList(e.fields, ["tags"]),
    ctaText: pickText(e.fields, ["ctaText"]),
    ctaLink: pickText(e.fields, ["ctaLink"]),
  }));
  return {
    present: true,
    value: {
      heading: rich(f, "heading"),
      intro: rich(f, "intro") || rich(f, "subtitle") || rich(f, "body"),
      services,
    },
  };
}

function mapWhatWeDo(section) {
  if (!section) return { present: false, value: {} };
  const f = section.fields;
  const steps = section.entries.map((e) => ({
    shortTitle: pickText(e.fields, ["shortTitle"]) || entryTitle(e),
    title: entryTitle(e) || pickText(e.fields, ["shortTitle"]),
    body: rich(e.fields, "body"),
    timeline: pickText(e.fields, ["timeline"]),
    timelineNote: pickText(e.fields, ["timelineNote"]),
    deliverables: pickList(e.fields, ["deliverables"]),
  }));
  return {
    present: true,
    value: { heading: rich(f, "heading"), subtitle: rich(f, "subtitle") || rich(f, "intro") || rich(f, "body"), steps },
  };
}

function mapTechStack(section) {
  if (!section) return { present: false, value: {} };
  const f = section.fields;
  const cats = section.entries.map((e) => {
    const inlinePills = pickList(e.fields, ["tags"]);
    const bodyAsPills = inlinePills.length ? [] : pickList(e.fields, ["body"]);
    return {
      title: entryTitle(e),
      icon: pickText(e.fields, ["icon"]),
      desc: inlinePills.length ? rich(e.fields, "body") : "",
      pills: (inlinePills.length ? inlinePills : bodyAsPills).map((label) => ({ e: "", label })),
    };
  });
  return {
    present: true,
    value: { heading: rich(f, "heading"), subtitle: rich(f, "subtitle") || rich(f, "intro") || rich(f, "body"), cats },
  };
}

function mapIndustries(section) {
  if (!section) return { present: false, value: {} };
  const f = section.fields;
  const items = section.entries.map((e) => ({
    name: pickText(e.fields, ["name"]) || entryTitle(e),
    sub: rich(e.fields, "body"),
    iconAlt: pickText(e.fields, ["iconAlt"]),
    points: pickList(e.fields, ["points"]),
    ctaLink: pickText(e.fields, ["ctaLink"]),
  }));
  const heading = joinHeadingAccent(rich(f, "heading"), pickText(f, ["headingAccent"]));

  return {
    present: true,
    value: {
      heading,
      headingAccent: "",
      subtitle: rich(f, "subtitle") || rich(f, "intro") || rich(f, "body"),
      items,
    },
  };
}

function mapEngagement(section) {
  if (!section) return { present: false, value: {} };
  const f = section.fields;
  const models = section.entries.map((e) => ({
    badge: pickText(e.fields, ["badge"]),
    title: entryTitle(e),
    best: pickText(e.fields, ["best"]),
    body: rich(e.fields, "body"),
    perks: pickList(e.fields, ["perks"]).length ? pickList(e.fields, ["perks"]) : pickList(e.fields, ["points"]),
    ctaText: pickText(e.fields, ["ctaText"]),
    ctaLink: pickText(e.fields, ["ctaLink"]),
  }));
  return {
    present: true,
    value: { heading: rich(f, "heading"), subtitle: rich(f, "subtitle") || rich(f, "intro") || rich(f, "body"), models },
  };
}

function mapFaq(section) {
  if (!section) return { present: false, value: {} };
  const f = section.fields;
  const items = section.entries.map((e) => ({
    question: pickText(e.fields, ["question"]) || e.hint,
    answer: rich(e.fields, "answer") || rich(e.fields, "body"),
  }));
  return {
    present: true,
    value: { heading: rich(f, "heading"), subtitle: rich(f, "subtitle") || rich(f, "intro") || rich(f, "body"), items },
  };
}

function mapWhyChoose(section) {
  if (!section) return { present: false, value: {} };
  const f = section.fields;
  const cards = section.entries.map((e) => ({
    icon: pickText(e.fields, ["icon"]),
    title: entryTitle(e),
    desc: rich(e.fields, "body"),
  }));
  return {
    present: true,
    value: {
      heading: rich(f, "heading"),
      subtitle: rich(f, "subtitle") || rich(f, "intro") || rich(f, "body"),
      cards,
      ctaHeading: rich(f, "ctaHeading"),
      ctaBody: rich(f, "ctaBody"),
      ctaText: pickText(f, ["ctaText"]),
      ctaLink: pickText(f, ["ctaLink"]),
    },
  };
}

function mapFinalCta(section) {
  if (!section) return { present: false, value: {} };
  const f = section.fields;
  return {
    present: true,
    value: {
      heading: rich(f, "heading"),
      body: rich(f, "body"),
      replyTime: pickText(f, ["replyTime"]),
      nda: pickText(f, ["nda"]),
    },
  };
}

function mapMeta(section, coreFields = {}) {
  const f = section ? section.fields : {};
  const title = pickText(f, ["metaTitle"]) || (section ? pickText(f, ["title"]) : "") ||
    pickText(coreFields, ["metaTitle"]);
  const description = pickText(f, ["metaDescription"]) || (section ? pickText(f, ["body"]) : "") ||
    pickText(coreFields, ["metaDescription"]);
  if (!section && !title && !description) return { present: false, value: {} };
  return { present: true, value: { title, description } };
}

function mapHeadingSubtitleOnly(section) {
  if (!section) return { present: false, value: {} };
  const f = section.fields;
  return {
    present: true,
    value: { heading: rich(f, "heading"), subtitle: rich(f, "subtitle") || rich(f, "intro") || rich(f, "body") },
  };
}

module.exports = {
  mapHero,
  mapChooseUs,
  mapWhyLocation,
  mapProcess,
  mapWhatWeDo,
  mapTechStack,
  mapIndustries,
  mapEngagement,
  mapFaq,
  mapWhyChoose,
  mapFinalCta,
  mapMeta,
  mapHeadingSubtitleOnly,
};

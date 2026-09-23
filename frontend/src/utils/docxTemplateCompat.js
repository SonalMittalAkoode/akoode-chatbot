import { PAGE_TEMPLATES, normalizeTemplate, usesHeroBadges, usesHeroStats, usesV2Sections } from "@/config/pageTemplates";

export const templateLabel = (value) => {
  const hit = PAGE_TEMPLATES.find((t) => t.value === normalizeTemplate(value));
  return hit ? hit.label.split(/\s+[—–-]\s+/)[0] : value;
};

export const industriesAreFreeForm = (template) => usesV2Sections(template);

export function mergeFixedTaxonomyIndustries(existingRows, importedItems) {
  const sanitize = (s) => String(s || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "");
  const byName = new Map(
    (importedItems || []).filter((i) => i.name).map((i) => [sanitize(i.name), i])
  );
  return existingRows.map((row) => {
    const match = byName.get(sanitize(row.name));
    if (!match) return row;
    const points = Array.isArray(match.points) && match.points.length
      ? match.points
      : row.points;
    return { ...row, points };
  });
}

/**
 * Merges imported "What We Do" stages onto the CMS's FIXED stage list.
 *
 * The stage names (Discovery, Architecture, UX Design, Development,
 * QA & Security, Launch) are fixed CMS values — the add form says so, and the
 * edit form re-matches saved steps against that list BY shortTitle when it
 * loads a page. Writing a document's own stage titles into shortTitle/title
 * therefore looks fine on the first save but makes the edit page match
 * nothing: it rebuilds every stage empty and the next save wipes the whole
 * section. So only the editable content (body, timeline, timeline note,
 * deliverables) is imported; the names always stay as the CMS defines them.
 *
 * Stages are matched by name first (documents that supply "Short Title (nav):
 * Discovery" line up exactly), then positionally for documents that just
 * number their stages in the standard order.
 */
export function mergeFixedStageSteps(existingSteps, importedSteps) {
  const imported = Array.isArray(importedSteps) ? importedSteps : [];
  if (!imported.length) return existingSteps;

  const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const used = new Set();

  // Pass 1 — match on the stage's own name.
  const matchedIndex = existingSteps.map((step) => {
    const idx = imported.findIndex(
      (x, i) =>
        !used.has(i) &&
        (norm(x.shortTitle) === norm(step.shortTitle) || norm(x.title) === norm(step.title))
    );
    if (idx >= 0) used.add(idx);
    return idx;
  });

  // Pass 2 — whatever did not match by name is assigned in document order.
  const leftovers = imported.map((_, i) => i).filter((i) => !used.has(i));
  let cursor = 0;

  return existingSteps.map((step, i) => {
    const src =
      matchedIndex[i] >= 0
        ? imported[matchedIndex[i]]
        : cursor < leftovers.length
          ? imported[leftovers[cursor++]]
          : null;
    if (!src) return step;
    return {
      ...step, // keeps id, shortTitle and title — never taken from the document
      body: src.body || step.body || "",
      timeline: src.timeline || step.timeline || "",
      timelineNote: src.timelineNote || step.timelineNote || "",
      deliverables:
        Array.isArray(src.deliverables) && src.deliverables.length
          ? src.deliverables
          : step.deliverables || [""],
    };
  });
}

export function unusedSectionsFor(template) {
  const target = normalizeTemplate(template);
  const unused = [];
  if (!usesV2Sections(target)) {
    unused.push("techStack", "testimonials");
  }
  return unused;
}

export function buildTemplateWarnings(data, currentTemplate) {
  const warnings = [];
  const target = normalizeTemplate(data?.template || currentTemplate);

  if (data?.template && normalizeTemplate(data.template) !== normalizeTemplate(currentTemplate)) {
    warnings.push(
      `Page Template will be switched to "${templateLabel(target)}" to match the document ` +
        `(currently "${templateLabel(currentTemplate)}").`
    );
  }

  const has = (v) => Array.isArray(v) ? v.length > 0 : Boolean(v);

  // AI Development also consumes hero.stats (as its trust badges), so it is
  // not a "this template ignores them" case.
  if (has(data?.hero?.stats) && !usesHeroStats(target) && !usesHeroBadges(target)) {
    warnings.push(
      `The "${templateLabel(target)}" template does not render hero stat cards — ` +
        `the ${data.hero.stats.length} card(s) in this document will be ignored.`
    );
  }

  if (has(data?.techStack?.cats) && !usesV2Sections(target)) {
    warnings.push(
      `The "${templateLabel(target)}" template does not render the Tech Stack section — ` +
        `its content will be imported but stays hidden.`
    );
  }

  if (has(data?.industries?.items) && !industriesAreFreeForm(target)) {
    warnings.push(
      `The "${templateLabel(target)}" template uses a fixed Industries taxonomy — ` +
        `industry names, icons and images from the document are ignored; only the ` +
        `bullet points are merged into the matching industries.`
    );
  }

  return warnings;
}

export function analyzeForTemplate(data, currentTemplate) {
  const target = normalizeTemplate(data?.template || currentTemplate);
  return {
    warnings: buildTemplateWarnings(data, currentTemplate),
    unusedSections: unusedSectionsFor(target),
  };
}

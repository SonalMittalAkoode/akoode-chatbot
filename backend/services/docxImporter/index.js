const { parseDocxToBlocks } = require("./parser");
const { parseSections } = require("./sectionParser");
const { mapCityDocument } = require("./cityMapper");
const { mapCountryDocument } = require("./countryMapper");
const { mapCaseStudyDocument } = require("./caseStudyMapper");
const {
  validateCityDocument,
  validateCountryDocument,
  validateCaseStudyDocument,
} = require("./validator");

const ALL_SECTIONS = [
  "hero", "chooseUs", "whyLocation", "process", "whatWeDo", "techStack",
  "industries", "engagement", "faq", "whyChoose", "finalCta", "meta",
  "caseStudies", "testimonials", "blog",
];

async function importCityDocx(buffer) {
  const blocks = await parseDocxToBlocks(buffer);
  const sections = parseSections(blocks);
  const { data, warnings, sectionsFound } = await mapCityDocument(sections);
  const errors = validateCityDocument(data);
  return {
    data,
    errors,
    warnings,
    sectionsFound,
    sectionsMissing: ALL_SECTIONS.filter((s) => !sectionsFound.includes(s)),
  };
}

async function importCountryDocx(buffer) {
  const blocks = await parseDocxToBlocks(buffer);
  const sections = parseSections(blocks);
  const { data, warnings, sectionsFound } = await mapCountryDocument(sections);
  const errors = validateCountryDocument(data);
  return {
    data,
    errors,
    warnings,
    sectionsFound,
    sectionsMissing: ALL_SECTIONS.filter((s) => !sectionsFound.includes(s)),
  };
}

// Case study documents share the DOCX->blocks step and nothing else: their
// own parser, mapper and section list. See caseStudySectionParser.js.
const CASE_STUDY_SECTIONS = [
  "hero", "rethinking", "challenges", "build", "pipeline", "powerful",
  "techStack", "keyChallenges", "whatChanged", "analytics", "whyChoose",
  "finalCta", "meta",
];

async function importCaseStudyDocx(buffer) {
  const blocks = await parseDocxToBlocks(buffer);
  const { data, warnings, sectionsFound } = mapCaseStudyDocument(blocks);
  const errors = validateCaseStudyDocument(data);
  return {
    data,
    errors,
    warnings,
    sectionsFound,
    sectionsMissing: CASE_STUDY_SECTIONS.filter((s) => !sectionsFound.includes(s)),
  };
}

module.exports = {
  importCityDocx,
  importCountryDocx,
  importCaseStudyDocx,
  ALL_SECTIONS,
  CASE_STUDY_SECTIONS,
};

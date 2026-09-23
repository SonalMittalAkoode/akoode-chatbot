const ServiceByCountry = require("../../models/serviceByCountryModel");
const { resolveTemplate } = require("./templateResolver");
const { pickText } = require("./fieldUtils");
const { normalizeCountryLabel } = require("../../utils/normalizeCountryLabel");
const { toSlug, splitCitySlug } = require("./slugUtils");
const common = require("./commonMapper");

async function resolveCountryRef(coreFields) {
  const countryHint = normalizeCountryLabel(
    pickText(coreFields, ["countryPage"]) || pickText(coreFields, ["country"])
  );
  const marketHint = pickText(coreFields, ["market"]);
  const slugHint = pickText(coreFields, ["countrySlug"]);

  if (!countryHint && !marketHint && !slugHint) {
    return { countryRef: null, country: "", market: "", warning: null };
  }

  const or = [];
  if (slugHint) or.push({ slug: slugHint });
  if (marketHint) or.push({ market: marketHint });
  if (countryHint) {
    or.push({ country: new RegExp(`^${escapeRegex(countryHint)}$`, "i") });
    or.push({ title: new RegExp(`^${escapeRegex(countryHint)}$`, "i") });
  }

  let matches = [];
  try {
    matches = or.length ? await ServiceByCountry.find({ $or: or }).limit(2).lean() : [];
  } catch (err) {
    return {
      countryRef: null,
      country: "",
      market: "",
      warning: "Country page lookup failed. Please select the Country Page manually.",
    };
  }

  if (matches.length === 1) {
    const match = matches[0];
    return {
      countryRef: String(match._id),
      country: normalizeCountryLabel(match.country),
      market: match.market || "",
      warning: null,
    };
  }

  return {
    countryRef: null,
    country: "",
    market: "",
    warning: matches.length > 1
      ? `Multiple country pages matched "${countryHint || marketHint}". Please select the Country Page manually.`
      : "Country relationship could not be resolved. Please select the Country Page manually.",
  };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function mapCityDocument(sections) {
  const warnings = [];
  const core = sections.core ? sections.core.fields : {};

  const title = pickText(core, ["title"]);

  const fromPath = splitCitySlug(pickText(core, ["slug"]));
  const slug = fromPath.slug || (title ? toSlug(title) : "");
  const citySlug =
    pickText(core, ["citySlug"]) || fromPath.citySlug ||
    (pickText(core, ["city"]) ? toSlug(pickText(core, ["city"])) : "");

  let city = pickText(core, ["city"]);
  if (!city && citySlug) {
    city = citySlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    warnings.push(
      `No "City Name" field in the document — "${city}" was taken from the URL. Correct it on the form if the city's name is spelled differently.`
    );
  }

  const rawTemplate = pickText(core, ["template"]);
  const { template, warning: templateWarning } = resolveTemplate(rawTemplate);
  if (templateWarning) warnings.push(templateWarning);
  if (!rawTemplate) {
    warnings.push(
      'No "Page Template" field found in the document — the template currently selected on the form is kept. Check it matches the page this document was written for.'
    );
  }

  const { countryRef, country, market, warning: countryWarning } = await resolveCountryRef(
    fromPath.market ? { ...core, market: core.market || fromPath.market } : core
  );
  if (countryWarning) warnings.push(countryWarning);

  const hero = common.mapHero(sections.hero);
  const chooseUs = common.mapChooseUs(sections.chooseUs);
  const whyLocation = common.mapWhyLocation(sections.whyLocation);
  const process = common.mapProcess(sections.process);
  const whatWeDo = common.mapWhatWeDo(sections.whatWeDo);
  const techStack = common.mapTechStack(sections.techStack);
  const industries = common.mapIndustries(sections.industries);
  const engagement = common.mapEngagement(sections.engagement);
  const faq = common.mapFaq(sections.faq);
  const whyChoose = common.mapWhyChoose(sections.whyChoose);
  const finalCta = common.mapFinalCta(sections.finalCta);
  const meta = common.mapMeta(sections.meta, core);
  const caseStudies = common.mapHeadingSubtitleOnly(sections.caseStudies);
  const testimonials = common.mapHeadingSubtitleOnly(sections.testimonials);
  const blog = common.mapHeadingSubtitleOnly(sections.blog);

  const SECTION_LABELS = {
    hero, chooseUs, whyLocation, process, whatWeDo, techStack, industries,
    engagement, faq, whyChoose, finalCta, meta, caseStudies, testimonials, blog,
  };

  const sectionsFound = Object.entries(SECTION_LABELS)
    .filter(([, v]) => v.present)
    .map(([k]) => k);

  const data = {
    title,
    slug,
    city,
    citySlug,
    countryRef,
    country,
    market,
    ...(template ? { template } : {}),
    hero: hero.value,
    chooseUs: chooseUs.value,
    whyLocation: whyLocation.value,
    process: process.value,
    whatWeDo: whatWeDo.value,
    techStack: techStack.value,
    industries: industries.value,
    engagement: engagement.value,
    faq: faq.value,
    whyChoose: whyChoose.value,
    finalCta: finalCta.value,
    meta: meta.value,
    caseStudies: caseStudies.value,
    blog: blog.value,
  };

  return { data, warnings, sectionsFound };
}

module.exports = { mapCityDocument };

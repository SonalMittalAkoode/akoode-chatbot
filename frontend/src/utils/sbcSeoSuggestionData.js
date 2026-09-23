export const SBC_KEYWORD_BRIEFS = [
  {
    label: "UK software development company",
    targetCity: "",
    targetCountry: "UK",
    primaryKeyword: "software development company uk",
    secondaryKeywords: [
      "software development company in uk",
      "custom software development uk",
      "software companies in uk",
      "ai software development company uk",
    ],
    competitorUrls: [],
  },
  {
    label: "Cambridge software development company",
    targetCity: "Cambridge",
    targetCountry: "UK",
    primaryKeyword: "software development company cambridge",
    secondaryKeywords: [
      "software company cambridge",
      "top software company cambridge",
      "ai software development firm",
    ],
    competitorUrls: ["https://www.coderus.com/contact/cambridge/", "https://www.cambseng.co.uk/"],
  },
  {
    label: "Manchester software development company",
    targetCity: "Manchester",
    targetCountry: "UK",
    primaryKeyword: "software development company manchester",
    secondaryKeywords: [
      "software development manchester",
      "software development companies manchester",
      "software companies in manchester uk",
      "software companies in manchester",
      "software development solutions",
    ],
    competitorUrls: [
      "https://devoxsoftware.com/custom-software-development-in-manchester/",
      "https://spyro-soft.com/software-development-manchester/",
    ],
  },
  {
    label: "Birmingham software company",
    targetCity: "Birmingham",
    targetCountry: "UK",
    primaryKeyword: "software company birmingham",
    secondaryKeywords: [
      "it company in birmingham",
      "software company in birmingham",
      "software birmingham",
      "birmingham software companies",
    ],
    competitorUrls: ["https://sdssoftwares.co.uk/", "https://orbititech.com/software-development/", "https://www.codevate.com/"],
  },
  {
    label: "Leeds software development",
    targetCity: "Leeds",
    targetCountry: "UK",
    primaryKeyword: "software development leeds",
    secondaryKeywords: [
      "software development in leeds",
      "software developer leeds",
      "software development company leeds",
      "leeds software companies",
      "software development companies in leeds",
      "web development company in leeds",
    ],
    competitorUrls: [
      "https://devoxsoftware.com/custom-software-development-in-leeds/",
      "https://www.vegait.co.uk/software-development-leeds/",
    ],
  },
];

export const inferKeywordBrief = (title = "", slug = "", market = "") => {
  const haystack = `${title} ${slug} ${market}`.toLowerCase();
  const cityBrief = SBC_KEYWORD_BRIEFS.find((brief) => brief.targetCity && haystack.includes(brief.targetCity.toLowerCase()));
  if (cityBrief) return cityBrief;
  const normalizedMarket = String(market || "").toLowerCase().replace(/^\/+|\/+$/g, "");
  const countryBrief = SBC_KEYWORD_BRIEFS.find((brief) => !brief.targetCity && normalizedMarket === String(brief.targetCountry || "").toLowerCase());
  return countryBrief || SBC_KEYWORD_BRIEFS[0];
};

const titleCaseLocation = (value = "") =>
  String(value)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .replace(/\bUk\b/g, "UK")
    .replace(/\bUsa\b/g, "USA")
    .replace(/\bAi\b/g, "AI");

const countryFromSegment = (segment = "") => {
  const normalized = String(segment || "").toLowerCase();
  if (normalized === "uk") return "UK";
  if (normalized === "usa" || normalized === "us") return "USA";
  if (normalized === "uae") return "UAE";
  return titleCaseLocation(segment || "UK");
};

const normalizeKeywordText = (value = "") =>
  String(value || "")
    .toLowerCase()
    .replace(/akoode technologies?/g, " ")
    .replace(/akoode/g, " ")
    .replace(/[:|–—]/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(in|for|at|by|with|near)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const removeLocationWords = (value = "", targetCity = "", targetCountry = "") => {
  let text = normalizeKeywordText(value);
  [targetCity, targetCountry, "united kingdom", "uk", "united states", "usa", "us", "uae"]
    .filter(Boolean)
    .forEach((part) => {
      text = text.replace(new RegExp(`\\b${normalizeKeywordText(part).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g"), " ");
    });
  return text.replace(/\s+/g, " ").trim();
};

const serviceIntentFromCore = ({ title = "", slug = "", selectedBrief = {}, targetCity = "", targetCountry = "" }) => {
  const titleIntent = removeLocationWords(title, targetCity, targetCountry);
  const slugIntent = removeLocationWords(String(slug || "").replace(/-/g, " "), targetCity, targetCountry);
  const briefIntent = removeLocationWords(selectedBrief.primaryKeyword || "", targetCity, targetCountry);
  const rawIntent = titleIntent || slugIntent || briefIntent || "software development company";
  const cleaned = rawIntent
    .replace(/\bcompany company\b/g, "company")
    .replace(/\bsoftware development software development\b/g, "software development")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || "software development company";
};

const primaryKeywordFromForm = ({ title = "", slug = "", market = "", selectedBrief = {}, targetCity = "", targetCountry = "" }) => {
  const marketParts = String(market || "").toLowerCase().replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  const city = targetCity || (marketParts[1] ? titleCaseLocation(marketParts[1]) : selectedBrief.targetCity || "");
  const country = targetCountry || countryFromSegment(marketParts[0] || selectedBrief.targetCountry || "UK");
  const serviceIntent = serviceIntentFromCore({ title, slug, selectedBrief, targetCity: city, targetCountry: country });
  return `${serviceIntent} ${city || country}`.replace(/\s+/g, " ").trim().toLowerCase();
};

const splitKeywords = (value = "") =>
  String(value || "")
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

export const buildFormAwareKeywordBrief = ({ title = "", slug = "", country = "", market = "", keywords = "", city = "", citySlug = "", selectedBrief = null } = {}) => {
  const fallbackBrief = selectedBrief || inferKeywordBrief(title, slug, market);
  const normalizedMarket = String(market || "").toLowerCase().replace(/^\/+|\/+$/g, "");
  const marketParts = normalizedMarket.split("/").filter(Boolean);
  const marketCountry = marketParts[0] ? countryFromSegment(marketParts[0]) : "";
  const marketCity = marketParts[1] ? titleCaseLocation(marketParts[1]) : "";
  const explicitCity = city ? titleCaseLocation(city) : (citySlug ? titleCaseLocation(citySlug) : "");
  const inferredBrief = inferKeywordBrief(title, slug, market);
  const targetCity = explicitCity || marketCity || inferredBrief.targetCity || fallbackBrief.targetCity || "";
  const targetCountry = marketCountry || country || fallbackBrief.targetCountry || "UK";
  const matchingCityBrief = targetCity
    ? SBC_KEYWORD_BRIEFS.find((brief) => brief.targetCity?.toLowerCase() === targetCity.toLowerCase())
    : null;
  const keywordSource = matchingCityBrief || fallbackBrief;

  const manualKeywords = splitKeywords(keywords);
  const secondaryKeywords = [...new Set([...(keywordSource.secondaryKeywords || []), ...manualKeywords])];

  return {
    ...keywordSource,
    targetCity,
    targetCountry,
    primaryKeyword: primaryKeywordFromForm({ title, slug, market, selectedBrief: keywordSource, targetCity, targetCountry }),
    secondaryKeywords,
    competitorUrls: keywordSource.competitorUrls || [],
    serviceType: serviceIntentFromCore({ title, slug, selectedBrief: keywordSource, targetCity, targetCountry }),
    manualKeywords,
  };
};

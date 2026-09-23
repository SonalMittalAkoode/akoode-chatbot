export const INDUSTRY_IMAGE_KEYWORDS = [
  { keywords: ["agriculture", "agri", "farming", "crop"], img: "/software_development/agriculture.png" },
  { keywords: ["automotive", "automobile", "car", "vehicle", "mobility"], img: "/software_development/automobility.png" },
  { keywords: ["retail", "ecommerce", "e-commerce", "commerce", "shopping", "store"], img: "/software_development/ecommerce.png" },
  { keywords: ["education", "elearning", "e-learning", "edtech", "school", "university", "learning"], img: "/software_development/education.png" },
  { keywords: ["energy", "utilities", "utility", "power", "solar", "gas", "oil"], img: "/software_development/energy.png" },
  { keywords: ["finance", "banking", "fintech", "payment", "bank", "wealth"], img: "/software_development/finance.png" },
  { keywords: ["healthcare", "health", "medical", "clinic", "hospital", "pharma", "wellness"], img: "/software_development/healthcare.png" },
  { keywords: ["hospitality", "hotel", "travel", "tourism", "leisure"], img: "/software_development/hospitality.png" },
  { keywords: ["insurance", "insurtech"], img: "/software_development/insurance.png" },
  { keywords: ["manufacturing", "factory", "production", "industrial"], img: "/software_development/manufacturing.png" },
  { keywords: ["media", "entertainment", "music", "video", "streaming", "broadcasting"], img: "/software_development/media.png" },
  { keywords: ["public sector", "public-sector", "government", "govt", "municipal"], img: "/software_development/publicSector.png" },
  { keywords: ["real estate", "real-estate", "property", "housing", "proptech"], img: "/software_development/real-estate.png" },
  { keywords: ["supply chain", "supply-chain", "logistics", "warehouse", "distribution", "shipping"], img: "/software_development/supply_chain.png" },
  { keywords: ["telecom", "telecommunication", "network", "communication"], img: "/software_development/telecommunication.png" },
];

export const INDUSTRY_ICON_KEYWORDS = [
  { keywords: ["healthcare", "health", "medical", "clinic", "hospital", "pharma", "wellness"], icon: "FiHeart" },
  { keywords: ["retail", "ecommerce", "e-commerce", "commerce", "shopping", "store"], icon: "FiShoppingBag" },
  { keywords: ["media", "entertainment", "music", "video", "streaming"], icon: "FiVideo" },
  { keywords: ["finance", "banking", "fintech", "payment", "bank", "wealth"], icon: "FiCreditCard" },
  { keywords: ["automotive", "automobile", "car", "vehicle", "mobility"], icon: "FiActivity" },
  { keywords: ["agriculture", "agri", "farming", "crop"], icon: "FiGlobe" },
  { keywords: ["telecom", "telecommunication", "network", "communication"], icon: "FiRadio" },
  { keywords: ["manufacturing", "factory", "production", "industrial"], icon: "FiSettings" },
  { keywords: ["public sector", "public-sector", "government", "govt"], icon: "FiFlag" },
  { keywords: ["real estate", "real-estate", "property", "housing", "proptech"], icon: "FiHome" },
  { keywords: ["energy", "utilities", "utility", "power", "solar", "gas", "oil"], icon: "FiZap" },
  { keywords: ["travel", "hospitality", "tourism", "hotel", "leisure"], icon: "FiCompass" },
  { keywords: ["education", "elearning", "e-learning", "edtech", "school", "university", "learning"], icon: "FiBookOpen" },
  { keywords: ["insurance", "insurtech"], icon: "FiShield" },
  { keywords: ["supply chain", "supply-chain", "logistics", "warehouse", "distribution", "shipping"], icon: "FiTruck" },
];

export function joinHeadingAccent(lead, accent) {
  const leadText = String(lead || "").trim();
  const accentText = String(accent || "").trim();
  if (!accentText) return leadText;
  if (!leadText) return accentText;

  const leadWords = new Set(leadText.toLowerCase().match(/[a-z0-9]+/g) || []);
  const accentWords = (accentText.toLowerCase().match(/[a-z0-9]+/g) || []).filter((w) => w.length > 3);
  const addsSomething = accentWords.length > 0 && accentWords.some((w) => !leadWords.has(w));

  return addsSomething ? `${leadText} ${accentText}` : leadText;
}

export const sanitizeIndustryName = (str) =>
  String(str || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");

const MIN_CONTAINMENT_LENGTH = 5;

const EXACT_MATCH_SCORE = 1000;

const keywordScore = (cleanTyped, keyword) => {
  const cleanK = sanitizeIndustryName(keyword);
  if (!cleanTyped || !cleanK) return 0;
  if (cleanTyped === cleanK) return EXACT_MATCH_SCORE;
  if (cleanK.length >= MIN_CONTAINMENT_LENGTH && cleanTyped.includes(cleanK)) return cleanK.length;
  if (cleanTyped.length >= MIN_CONTAINMENT_LENGTH && cleanK.includes(cleanTyped)) return cleanTyped.length;
  return 0;
};

const bestMatch = (name, rules, keywordsOf) => {
  const cleanTyped = sanitizeIndustryName(name);
  let best = null;
  let bestScore = 0;
  for (const rule of rules) {
    const score = keywordsOf(rule).reduce((max, k) => Math.max(max, keywordScore(cleanTyped, k)), 0);
    if (score > bestScore) {
      bestScore = score;
      best = rule;
    }
  }
  return best;
};

export const findIndustryImage = (name) => {
  const hit = bestMatch(name, INDUSTRY_IMAGE_KEYWORDS, (r) => r.keywords);
  return hit ? hit.img : "";
};

export const findIndustryIcon = (name) => {
  const hit = bestMatch(name, INDUSTRY_ICON_KEYWORDS, (r) => r.keywords);
  return hit ? hit.icon : "";
};

export const findIndustryLink = (name, industryOptions = []) => {
  const hit = bestMatch(name, industryOptions, (o) => [o.name]);
  return hit ? `/industries/${hit.slug}` : "";
};

export function applyIndustryAutofill(row, industryOptions = []) {
  const name = row.name || "";
  if (!name) return row;
  const currentImg = typeof row.iconImg === "string" && row.iconImg ? row.iconImg : row.iconImgExisting || "";
  return {
    ...row,
    icon: row.icon || findIndustryIcon(name),
    iconImg: currentImg || findIndustryImage(name) || row.iconImg || null,
    ctaLink: row.ctaLink || findIndustryLink(name, industryOptions),
    iconAlt: row.iconAlt || name,
  };
}

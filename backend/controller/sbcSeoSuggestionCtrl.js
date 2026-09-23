const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { buildSbcSeoSuggestionPrompt } = require("../utils/sbcSeoSuggestionPrompt");
const { buildGroupPrompts, mergeGroupResults } = require("../utils/sbcSeoSuggestionPromptGroups");
const { computeGeoNormalizedOverlap, extractTextFields } = require("../utils/phraseOverlap");
const ServiceByCountry = require("../models/serviceByCountryModel");
const ServiceByCity = require("../models/serviceByCityModel");

const TEMPERATURE_DEPRECATED_MODELS = /^(claude-sonnet-5|claude-opus-4-[7-9]|claude-fable-5|claude-mythos-5)/;

function extractJson(text = "") {
  const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  try {
    return JSON.parse(trimmed);
  } catch (_) {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("AI provider did not return valid JSON");
  }
}

async function requestAnthropicJson({ prompt, staticPrefix, dynamicSuffix, maxTokens = 12000, temperature = 0.45, timeoutMs = 90000 }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
  const content = staticPrefix
    ? [
      {
        type: "text",
        text: staticPrefix,
        // Explicit 1-hour TTL — bare { type: "ephemeral" } would default to 5 minutes.
        cache_control: { type: "ephemeral", ttl: "1h" },
      },
      { type: "text", text: dynamicSuffix || "" },
    ]
    : prompt;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": process.env.ANTHROPIC_VERSION || "2023-06-01",
      },
      body: (() => {
        const requestBody = {
          model,
          max_tokens: maxTokens,
          messages: [{ role: "user", content }],
        };
        if (!TEMPERATURE_DEPRECATED_MODELS.test(model)) {
          requestBody.temperature = temperature;
        }
        // claude-sonnet-5 runs ADAPTIVE THINKING by default when `thinking` is
        // omitted. Thinking tokens count against max_tokens and the org's
        // output-tokens-per-minute limit, and our extractJson only reads visible
        // text — so a long think leaves the JSON truncated ("Expected ','...")
        // or entirely empty. This endpoint needs raw JSON only: disable it.
        // (Only on sonnet-5: Opus 4.7+ already defaults to no-thinking when the
        // field is omitted, and claude-fable-5 REJECTS an explicit "disabled".)
        if (/^claude-sonnet-5/.test(model)) {
          requestBody.thinking = { type: "disabled" };
        }
        return JSON.stringify(requestBody);
      })(),
    });
  } catch (error) {
    throw new Error(error.name === "AbortError" ? "Anthropic request timed out. Please try again." : error.message || "Anthropic request failed");
  } finally {
    clearTimeout(timeout);
  }

  const raw = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(raw?.error?.message || "Anthropic request failed");
    // Preserve the Anthropic error type (e.g. "rate_limit_error",
    // "invalid_request_error") so callers can distinguish rate-limit
    // failures from validation or auth errors and back off accordingly.
    err.errorType = raw?.error?.type || "unknown";
    throw err;
  }
  if (staticPrefix) {
    // write > 0 on the first call of a batch (cache written); read > 0 on the rest.
    // read staying 0 across repeated calls means the prefix is not byte-stable (or
    // is below the model's minimum cacheable length) — investigate, don't ignore.
    console.log(`[sbcSeoSuggestion] cache: read=${raw.usage?.cache_read_input_tokens ?? 0} write=${raw.usage?.cache_creation_input_tokens ?? 0} input=${raw.usage?.input_tokens ?? 0}`);
  }
  const text = Array.isArray(raw?.content)
    ? raw.content.map((part) => part?.text || "").join("\n")
    : "";
  if (!text.trim()) throw new Error("Anthropic returned an empty response");
  try {
    return extractJson(text);
  } catch (err) {
    // Truncation is the usual cause of unparseable JSON — surface it explicitly so
    // the logs say "raise the budget" instead of a cryptic JSON.parse position.
    if (raw?.stop_reason === "max_tokens") {
      throw new Error(`Output truncated at max_tokens=${maxTokens} (stop_reason=max_tokens) — this group's token budget is too small for its output`);
    }
    throw err;
  }
}

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const titleCase = (value = "") =>
  String(value)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .replace(/\bUk\b/g, "UK")
    .replace(/\bUsa\b/g, "USA")
    .replace(/\bAi\b/g, "AI")
    .replace(/\bApi\b/g, "API")
    .replace(/\bSaas\b/g, "SaaS");

const wordCount = (value = "") => String(value).trim().split(/\s+/).filter(Boolean).length;
const capWords = (value = "", max = 90) => {
  const words = String(value || "").trim().split(/\s+/).filter(Boolean);
  return words.length > max ? `${words.slice(0, max).join(" ").replace(/[,. ]+$/g, "")}.` : String(value || "").trim();
};
const fitWords = (value = "", min = 8, max = 14, fallback = "") => {
  const clean = String(value || "").replace(/\s+/g, " ").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length > max) return words.slice(0, max).join(" ").replace(/[,. ]+$/g, "");
  if (words.length >= min) return clean;
  return fallback || clean;
};

const DEFAULT_SERVICE_POINTS = [
  "Architecture planned around scale, security, and maintainable release cycles",
  "API integrations designed for reliable product and operations workflows",
  "User journeys mapped before engineering begins to reduce rebuild risk",
  "Cloud-ready delivery with monitoring, access control, and handover notes",
  "Sprint reviews that keep scope, blockers, and priorities visible",
  "Production support prepared for launch, QA, and future iteration",
];

const SERVICE_POINT_SETS = {
  ai: [
    "Workflow-aware AI assistants connected to real business operations",
    "LLM integrations with guardrails, monitoring, and secure data access",
    "Model evaluation loops for accuracy, safety, and production reliability",
    "Vector search and knowledge retrieval tuned for business context",
    "Automation workflows designed around measurable team productivity gains",
    "AI APIs prepared for scaling, logging, and future feature expansion",
  ],
  saas: [
    "Multi-tenant architecture planned for accounts, roles, and permissions",
    "Subscription workflows connected with billing, access, and usage logic",
    "Product dashboards designed around customer activity and retention signals",
    "Secure onboarding flows for teams, admins, and enterprise buyers",
    "Scalable backend services prepared for release cycles and growth",
    "Analytics foundations that support pricing, adoption, and roadmap decisions",
  ],
  mobile: [
    "Native and cross-platform builds aligned with product roadmap priorities",
    "Secure authentication flows for customers, staff, and partner users",
    "Offline-ready interactions where field teams need dependable access",
    "Push notification workflows designed around retention and timely actions",
    "API-first mobile architecture with clear versioning and release control",
    "Store submission support with testing, metadata, and launch checks",
  ],
  web: [
    "Responsive product interfaces designed for clarity, speed, and accessibility",
    "Server-rendered pages structured for performance and search visibility",
    "Admin dashboards connected to reliable APIs and permission models",
    "Frontend components mapped to real user journeys before development",
    "Integration-ready architecture for payments, CRM, analytics, and support tools",
    "Performance checks covering Core Web Vitals and production usability",
  ],
  cloud: [
    "Cloud deployment pipelines designed for safe and repeatable releases",
    "Infrastructure automation that keeps environments consistent and auditable",
    "Monitoring dashboards covering uptime, errors, latency, and usage patterns",
    "Secure environment separation for staging, production, and testing workflows",
    "Cost-aware scaling plans aligned with traffic and product growth",
    "Rollback and recovery planning prepared before critical production launches",
  ],
  enterprise: [
    "System integrations mapped across departments, data flows, and approvals",
    "Role-based workflows designed for governance and operational control",
    "Legacy modernization plans that reduce risk during phased migration",
    "Reporting layers shaped around leadership, compliance, and team visibility",
    "Secure API foundations for internal tools and partner ecosystems",
    "Documentation prepared for handover, training, and future enhancements",
  ],
};

// Distinct fallback points per industry. The old fallback gave ALL 15 industries the
// SAME four points, which read as duplicated boilerplate across the page and spiked
// AI/plagiarism detectors. Each set stays within the 8-14 word guideline.
const FALLBACK_INDUSTRY_POINTS = {
  "Healthcare": [
    "Secure patient records with consent, access, and audit controls",
    "HL7 and FHIR integrations for clinical data exchange",
    "Appointment, telehealth, and care-workflow platforms built for scale",
    "Role-based access aligned with health data governance rules",
  ],
  "Retail and E-Commerce": [
    "Headless storefronts with fast checkout and inventory sync",
    "Payment gateway, tax, and fraud-check integrations built in",
    "Order, returns, and fulfilment dashboards for operations teams",
    "Personalisation and search tuned for conversion and retention",
  ],
  "Media and Entertainment": [
    "Streaming and content platforms with detailed usage analytics",
    "DRM, CDN, and adaptive delivery for large media libraries",
    "Subscription, paywall, and ad-supported monetisation workflows",
    "Recommendation engines tuned for engagement and watch time",
  ],
  "Finance and Banking": [
    "Strong authentication and audit logging for regulated workflows",
    "Payments, ledgers, and reconciliation engineered for accuracy",
    "KYC, AML, and fraud-detection integrations for onboarding",
    "Secure APIs and open-banking connections with access controls",
  ],
  "Automotive": [
    "Connected-vehicle dashboards ingesting telematics and sensor data",
    "Dealer, service, and parts-management platforms with integrations",
    "Fleet tracking, diagnostics, and maintenance-scheduling systems",
    "Secure APIs linking hardware, mobile, and cloud services",
  ],
  "Agriculture": [
    "IoT sensor pipelines for crop, soil, and weather monitoring",
    "Supply-chain traceability from field through to distribution",
    "Yield analytics dashboards supporting planning and forecasting",
    "Offline-ready mobile tools for field teams and cooperatives",
  ],
  "Telecommunication": [
    "OSS and BSS integrations for provisioning and billing",
    "Network monitoring dashboards with alerting and usage analytics",
    "Self-service portals for plans, payments, and support tickets",
    "High-throughput APIs engineered for reliability and scale",
  ],
  "Manufacturing": [
    "MES and ERP integrations across production and inventory",
    "IoT machine-data pipelines for uptime and quality tracking",
    "Shop-floor dashboards for scheduling, output, and defect rates",
    "Supplier and procurement workflows with approval controls",
  ],
  "Public Sector and Government": [
    "Accessible services meeting WCAG and public-sector standards",
    "Secure identity, permissions, and audit-ready record keeping",
    "Case-management and citizen-portal platforms with clear workflows",
    "Data governance aligned with procurement and residency rules",
  ],
  "Real Estate": [
    "Listing, CRM, and lead-management platforms with integrations",
    "Document, contract, and e-signature workflows for transactions",
    "Property dashboards covering maintenance and tenant management",
    "Map, search, and valuation features tuned for usability",
  ],
  "Energy and Utilities": [
    "Smart-meter data ingestion with billing and usage analytics",
    "Grid and asset-monitoring dashboards with real-time alerting",
    "Outage, maintenance, and field-service scheduling systems",
    "Secure APIs and compliance-aware data handling controls",
  ],
  "Travel and Hospitality": [
    "Booking, availability, and payment engines built for scale",
    "Channel-manager and property-management system integrations",
    "Loyalty, personalisation, and itinerary-management workflows",
    "Real-time inventory sync across partners and platforms",
  ],
  "Education": [
    "LMS platforms with courses, assessments, and progress tracking",
    "Secure student data handling with role-based access",
    "Video, live-class, and content-delivery integrations",
    "Analytics dashboards for outcomes, engagement, and retention",
  ],
  "Insurance": [
    "Policy, claims, and underwriting workflows with audit trails",
    "Document processing and automated fraud-check integrations",
    "Customer portals for quotes, renewals, and claims tracking",
    "Data governance aligned with regulatory reporting needs",
  ],
  "Logistics and Supply Chain": [
    "Real-time tracking with route, fleet, and delivery visibility",
    "Warehouse, inventory, and order-management system integrations",
    "Demand-forecasting and reporting dashboards for planning",
    "APIs connecting carriers, partners, and operations systems",
  ],
};

function servicePointDefaultsFor(item = {}) {
  const label = `${item.title || ""} ${item.subtitle || ""}`.toLowerCase();
  if (/ai|machine|intelligent|llm|automation/.test(label)) return SERVICE_POINT_SETS.ai;
  if (/saas|subscription|platform/.test(label)) return SERVICE_POINT_SETS.saas;
  if (/web|frontend|portal|website/.test(label)) return SERVICE_POINT_SETS.web;
  if (/mobile|ios|android|react native|flutter/.test(label)) return SERVICE_POINT_SETS.mobile;
  if (/cloud|devops|infrastructure|deployment/.test(label)) return SERVICE_POINT_SETS.cloud;
  if (/enterprise|crm|erp|workflow/.test(label)) return SERVICE_POINT_SETS.enterprise;
  return DEFAULT_SERVICE_POINTS;
}

// Rotating closers so under-length service cards are not padded with one identical
// sentence repeated down the page (a strong duplicate-content / AI-detection signal).
const SERVICE_PARA_CLOSERS = [
  "Akoode shapes the work around business goals, user journeys, data flows, and the systems your team already runs. Delivery spans planning, UX alignment, engineering, QA, deployment, and post-launch iteration so the result reflects real execution depth.",
  "The build stays tied to product outcomes, integration points, security needs, and maintainability. Our engineers move from discovery through architecture, sprints, testing, release, and handover documentation so decisions are recorded and your team keeps control.",
  "We plan around scope, technical risk, and how the product will grow after launch. Work covers UX, engineering, QA coverage, deployment, and support, with clear checkpoints so priorities and blockers stay visible throughout the engagement.",
  "Every stage connects back to measurable business value rather than a thin service label. That means architecture decisions, secure integrations, testing, deployment, and post-launch tuning are handled by senior engineers who stay accountable end to end.",
];

function serviceCardParagraph(item = {}, locationLabel = "your market", servicePhrase = "software development", index = 0) {
  const existing = String(item.para || "").replace(/\s+/g, " ").trim();
  if (wordCount(existing) >= 70) return capWords(existing, 92);

  const title = item.title || `${titleCase(servicePhrase)} in ${locationLabel}`;
  const topic = String(item.subtitle || title).replace(/\s+in\s+.+$/i, "").trim();
  const base = existing || `${topic} supports teams that need dependable product delivery, clear architecture, secure integrations, and practical release planning.`;
  const closer = SERVICE_PARA_CLOSERS[index % SERVICE_PARA_CLOSERS.length];
  return capWords(`${base} ${closer}`, 90);
}

// `usedSet` (optional) carries lowercased points already placed on OTHER cards so the
// same bullet never appears on two service cards — the old version padded every short
// card from the same shared default list, producing duplicated bullets down the page.
function normalizeServicePoints(points = [], item = {}, usedSet = null) {
  const defaults = servicePointDefaultsFor(item);
  const cleanPoints = Array.isArray(points)
    ? points.map((point) => String(point || "").trim()).filter(Boolean)
    : [];
  const pool = [
    ...cleanPoints,
    ...defaults,
    ...Object.values(SERVICE_POINT_SETS).flat(),
    ...DEFAULT_SERVICE_POINTS,
  ];
  const pick = (respectUsed) => {
    const out = [];
    const seen = new Set();
    for (const raw of pool) {
      const point = fitWords(raw, 8, 14, raw);
      const key = point.toLowerCase();
      if (seen.has(key)) continue;
      if (respectUsed && usedSet && usedSet.has(key)) continue;
      seen.add(key);
      out.push(point);
      if (out.length === 6) break;
    }
    return out;
  };
  let result = pick(true);
  if (result.length < 6) result = pick(false);
  if (usedSet) result.forEach((point) => usedSet.add(point.toLowerCase()));
  return result;
}

function normalizeServiceCards(services = [], fallbackServices = [], locationLabel = "your market", servicePhrase = "software development") {
  const source = Array.isArray(services) && services.length >= 5 ? services.slice(0, 6) : fallbackServices;
  const usedPoints = new Set();
  return source.map((item = {}, index) => ({
    ...item,
    n: item.n || String(index + 1).padStart(2, "0"),
    para: serviceCardParagraph(item, locationLabel, servicePhrase, index),
    points: normalizeServicePoints(item.points, item, usedPoints),
    tags: Array.isArray(item.tags) ? item.tags.slice(0, 7) : [],
  }));
}

function normalizeCaptionCards(cards = [], fallbackCards = [], minWords = 20, maxWords = 45) {
  // Always render the full count from the fallback list (UI expects an exact number per section).
  // Overlay AI-returned cards by index; if the AI value is too short, swap to the curated fallback
  // body instead of appending boilerplate filler.
  const incoming = Array.isArray(cards) ? cards : [];
  const total = Math.max(fallbackCards.length, incoming.length);
  const out = [];
  for (let index = 0; index < total; index += 1) {
    const card = incoming[index] || {};
    const fallback = fallbackCards[index] || {};
    const bodyKey = Object.prototype.hasOwnProperty.call(card, "desc") || Object.prototype.hasOwnProperty.call(fallback, "desc") ? "desc" : "body";
    const aiValue = card[bodyKey] || "";
    const fallbackValue = fallback[bodyKey] || "";
    const useAi = aiValue && wordCount(aiValue) >= minWords;
    const finalValue = useAi ? aiValue : fallbackValue;
    out.push({
      ...fallback,
      ...card,
      [bodyKey]: capWords(finalValue.trim(), maxWords),
    });
  }
  return out;
}

function normalizeGeneratedFieldValue(value = "", context = {}) {
  const {
    fieldLabel = "Field",
    sectionLabel = "Service By Country",
    location = "the target market",
    serviceType = "software development",
    primaryKeyword = "software development company",
  } = context;
  const fieldText = `${fieldLabel} ${sectionLabel}`;
  const isMetaTitle = /meta title/i.test(fieldText);
  const isMetaDescription = /meta description/i.test(fieldText);
  const isBulletField = /bullet|pointer|point|perk|deliverable/i.test(fieldText);
  const isHeadingField = /heading|title|h1|label/i.test(fieldText);
  const isHeroH1Field = /h1|main heading|hero.*heading/i.test(fieldText);
  const isServiceParagraph = /service/i.test(sectionLabel) && /paragraph|body|description/i.test(fieldText);
  const isLongField = /paragraph|body|description|answer|subtitle|intro|subtext/i.test(fieldText);
  let text = cleanupGeneratedText(scrubSuggestionText(value || ""));

  if (isMetaTitle) return capWords(text || `${titleCase(primaryKeyword)} | Akoode`, 8).slice(0, 55).replace(/[,. ]+$/g, "");
  if (isMetaDescription) return fitMetaDescription(text || `Hire Akoode for ${serviceType} in ${location}. Senior engineers build secure SaaS, web, mobile, cloud and AI systems with clear delivery and QA.`);
  if (isBulletField) return fitWords(text, 8, 14, DEFAULT_SERVICE_POINTS[0]);
  if (isHeroH1Field) return titleCase(primaryKeyword).replace(/[.]+$/g, "");
  if (isHeadingField) return capWords(text, 12).replace(/[.]+$/g, "");

  if ((isServiceParagraph || isLongField) && wordCount(text) < 55) {
    text = `${text.replace(/[. ]+$/g, "")}. Akoode connects the recommendation to ${location} buyers, technical risk, delivery planning, compliance needs, integration points, QA coverage, documentation, and post-launch improvement so the field carries practical business detail.`;
  }

  return capWords(text, isServiceParagraph ? 90 : 80);
}

const BAD_CONTEXT_PATTERNS = [
  /build property suggestion workflow/gi,
  /property suggestion workflow/gi,
  /\bcutting-edge\b/gi,
  /\brevolutionary\b/gi,
  /\bgame-changing\b/gi,
  /\btruly transformative\b/gi,
  /\btransformative\b/gi,
  /\bin today's digital world\b/gi,
  /\bwhether you are\b/gi,
  /\bat akoode, we understand\b/gi,
  /\bat akoode we understand\b/gi,
  /\bunparalleled\b/gi,
  /\blatest technologies\b/gi,
  /\binnovation driven\b/gi,
  /\btransform your business\b/gi,
  /\bleverage\b/gi,
  /\butilize\b/gi,
  /\brobust\b/gi,
  /\bseamless\b/gi,
  /\bunlock\b/gi,
  /\bdelve\b/gi,
  /\bHIPAA\b/g,
];
const CITY_EXAMPLE_PATTERN = /\b(London|Manchester|Cambridge|Birmingham|Leeds)\b/gi;

function fitMetaDescription(value = "") {
  let text = String(value).replace(/\s+/g, " ").trim();
  if (text.length >= 150 && text.length <= 155) return text;
  if (text.length < 150) {
    const base = text.replace(/[. ]+$/g, "");
    const endings = [" QA included.", " NDA ready.", " Clear QA.", " Safe launch.", " Secure build."];
    const ending = endings.find((item) => base.length + item.length >= 150 && base.length + item.length <= 155);
    text = ending ? `${base}${ending}` : `${base}. Secure handover.`;
  }
  if (text.length > 155) {
    text = text.slice(0, 155).replace(/\s+\S*$/g, "").replace(/[,. ]+$/g, "");
    if (!/[.!?]$/.test(text)) text = `${text}.`;
  }
  if (text.length < 150) {
    const base = text.replace(/[. ]+$/g, "");
    const endings = [" QA included.", " NDA ready.", " Clear QA.", " Safe launch.", " Secure build."];
    const ending = endings.find((item) => base.length + item.length >= 150 && base.length + item.length <= 155);
    text = ending ? `${base}${ending}` : `${base}. Clear delivery.`;
  }
  text = text.slice(0, 155).replace(/\s+\S*$/g, "").replace(/[,. ]+$/g, ".").replace(/\.\.$/, ".");
  return text.slice(0, 155).replace(/[,. ]+$/g, ".").replace(/\.\.$/, ".");
}

function scrubBadContextPhrases(value = "") {
  return BAD_CONTEXT_PATTERNS.reduce((text, pattern) => {
    if (String(pattern).includes("cutting-edge")) return text.replace(pattern, "well-tested");
    if (String(pattern).includes("revolutionary")) return text.replace(pattern, "practical");
    if (String(pattern).includes("transformative")) return text.replace(pattern, "commercially useful");
    if (String(pattern).includes("today")) return text.replace(pattern, "For growing software teams");
    if (String(pattern).includes("whether")) return text.replace(pattern, "For teams that are");
    if (String(pattern).includes("akoode")) return text.replace(pattern, "Akoode focuses on");
    if (String(pattern).includes("unparalleled")) return text.replace(pattern, "senior");
    if (String(pattern).includes("latest")) return text.replace(pattern, "well-matched technologies");
    if (String(pattern).includes("innovation")) return text.replace(pattern, "outcome focused");
    if (String(pattern).includes("transform")) return text.replace(pattern, "improve your business systems");
    if (String(pattern).includes("leverage")) return text.replace(pattern, "use");
    if (String(pattern).includes("utilize")) return text.replace(pattern, "use");
    if (String(pattern).includes("robust")) return text.replace(pattern, "reliable");
    if (String(pattern).includes("seamless")) return text.replace(pattern, "well-connected");
    if (String(pattern).includes("unlock")) return text.replace(pattern, "create");
    if (String(pattern).includes("delve")) return text.replace(pattern, "review");
    if (String(pattern).includes("HIPAA")) return text.replace(pattern, "UK GDPR and NHS DSPT");
    return text.replace(pattern, "software development workflow");
  }, String(value || ""));
}

function scrubSuggestionText(value) {
  if (typeof value === "string") return scrubBadContextPhrases(value);
  if (Array.isArray(value)) return value.map(scrubSuggestionText);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, scrubSuggestionText(item)]));
  }
  return value;
}

function cleanupGeneratedText(value) {
  if (typeof value === "string") {
    return value
      .replace(/[—–]/g, "|")
      .replace(/\bour your\b/gi, "our")
      .replace(/\byour your\b/gi, "your")
      .replace(/\byour software development company\b/gi, "our software development team")
      .replace(/\bFor teams that are a local\b/gi, "For local")
      .replace(/\bFor teams that are an established\b/gi, "For established")
      .replace(/\bFor teams that are established\b/gi, "For established")
      .replace(/\. our\b/g, ". Our")
      .replace(/\s+/g, " ")
      .trim();
  }
  if (Array.isArray(value)) return value.map(cleanupGeneratedText);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cleanupGeneratedText(item)]));
  }
  return value;
}

function scrubCityExamples(value) {
  if (typeof value === "string") return value.replace(CITY_EXAMPLE_PATTERN, "UK").replace(/\bUK and UK\b/g, "UK").replace(/\bUK, UK\b/g, "UK");
  if (Array.isArray(value)) return value.map(scrubCityExamples);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, scrubCityExamples(item)]));
  }
  return value;
}

function softenCityMentions(value, targetCity = "") {
  if (!targetCity) return value;
  const cityPattern = new RegExp(`\\b${String(targetCity).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:-based)?\\b`, "gi");
  const ourCityTeamPattern = new RegExp(`\\bour\\s+${String(targetCity).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:-based)?\\s+team\\b`, "gi");
  const cityBusinessPattern = new RegExp(`\\b${String(targetCity).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:-based)?\\s+(business|businesses|team|teams)\\b`, "gi");
  if (typeof value === "string") {
    return value
      .replace(ourCityTeamPattern, "our team")
      .replace(cityBusinessPattern, "your $1")
      .replace(/\bour your team\b/gi, "our team")
      .replace(/\bour your teams\b/gi, "our teams")
      .replace(/\bour your\b/gi, "our")
      .replace(/\byour your\b/gi, "your")
      .replace(/\byour software development company\b/gi, "our software development team")
      .replace(/\. our\b/g, ". Our")
      .replace(/\byour startups\b/gi, "startups")
      .replace(/\byour businesses\b/gi, "businesses")
      .replace(/\byour business\b/gi, "your business")
      .replace(/\byour teams\b/gi, "your teams")
      .replace(/\byour area\b/gi, "your market")
      .replace(/\bin your and\b/gi, "in your market and")
      .replace(/\bin your\b/gi, "in your market")
      .replace(/\boutside of your\b/gi, "outside your market")
      .replace(/\s+/g, " ")
      .trim();
  }
  if (Array.isArray(value)) return value.map((item) => softenCityMentions(item, targetCity));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, softenCityMentions(item, targetCity)]));
  }
  return value;
}

function getBriefInput(input = {}) {
  const brief = input.keywordBrief || {};
  const manualKeywords = String(input.keywords || "")
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  return {
    targetCity: brief.targetCity || brief.city || input.targetCity || "",
    // Derive from the page's own market before falling back — a blank Country
    // field must never turn a USA page into a UK one.
    targetCountry:
      brief.targetCountry || brief.country || input.targetCountry || input.country ||
      countryFromMarket(input.market) || "UK",
    primaryKeyword: brief.primaryKeyword || input.primaryKeyword || "software development company",
    secondaryKeywords: [...new Set([...(brief.secondaryKeywords || input.secondaryKeywords || []), ...manualKeywords])],
    competitorUrls: brief.competitorUrls || input.competitorUrls || [],
    internalLinks: input.internalLinks || ["/post-requirement", "/case-study"],
    serviceType: input.serviceType || "Software Development",
  };
}

// Market segment ("usa/austin", "uk", "de/berlin") → country name. Used when the
// admin's Country field is blank at generation time. Previously every such case
// silently fell back to the literal "UK", which is how a USA city page ended up
// asking "How do you handle UK compliance and data regulations?" — the page was
// generated before the Country field was filled in, and the UK text was then
// baked into the saved document.
const MARKET_COUNTRY = {
  uk: "UK", gb: "UK",
  us: "USA", usa: "USA",
  au: "Australia", australia: "Australia",
  ca: "Canada", canada: "Canada",
  ae: "UAE", uae: "UAE", dubai: "UAE",
  sg: "Singapore", singapore: "Singapore",
  de: "Germany", germany: "Germany",
  fr: "France", france: "France",
  nl: "Netherlands", netherlands: "Netherlands",
  nz: "New Zealand", newzealand: "New Zealand",
  ie: "Ireland", ireland: "Ireland",
  in: "India", india: "India",
};
// Country segment of a market string ("usa/austin" → "usa"), mapped to a country
// name. Returns "" when the market is unknown so callers can decide — never
// guesses a country the page isn't for.
const countryFromMarket = (market = "") => {
  const segment = String(market || "").replace(/^\/+/, "").split("/")[0].trim().toLowerCase();
  return MARKET_COUNTRY[segment] || "";
};

// Data-protection regimes named in the static FAQ's compliance answer. The answer
// used to hardcode "UK GDPR" for every market, so USA pages told visitors we build
// to UK law. Unknown markets get a neutral phrase rather than a wrong statute.
const COMPLIANCE_FRAMEWORKS = {
  UK: "UK GDPR",
  USA: "SOC 2, CCPA, and HIPAA where healthcare data is involved",
  Canada: "PIPEDA",
  Australia: "the Australian Privacy Principles",
  "New Zealand": "the New Zealand Privacy Act",
  Ireland: "EU GDPR",
  Germany: "EU GDPR and BDSG",
  France: "EU GDPR",
  Netherlands: "EU GDPR",
  UAE: "the UAE Data Protection Law",
  Singapore: "Singapore's PDPA",
  India: "India's DPDP Act",
};
const complianceFrameworksFor = (targetCountry = "") =>
  COMPLIANCE_FRAMEWORKS[targetCountry] ||
  COMPLIANCE_FRAMEWORKS[countryFromMarket(targetCountry)] ||
  "the applicable local data protection regulations";

const countrySlugFor = (targetCountry = "") => {
  const normalized = String(targetCountry || "").trim().toLowerCase();
  if (["united kingdom", "uk", "gb", "great britain"].includes(normalized)) return "uk";
  // Use the alpha-2 code "us" (not alpha-3 "usa") so the market segment matches the
  // route the frontend serves — akoode.com/us/... . "usa" produced 404s.
  if (["united states", "united states of america", "usa", "us", "america"].includes(normalized)) return "us";
  return slugify(targetCountry || "uk");
};

function stripLocationFromSlug(primaryKeyword = "", targetCity = "", targetCountry = "") {
  let service = String(primaryKeyword || "software development company").toLowerCase();
  [targetCity, targetCountry, "united kingdom", "uk", "united states of america", "united states", "usa", "us", "america"].filter(Boolean).forEach((part) => {
    service = service.replace(new RegExp(`\\b${String(part).toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g"), " ");
  });
  return slugify(service) || "software-development-company";
}

function serviceLabelFromSlug(serviceSlug = "software-development-company") {
  return titleCase(String(serviceSlug || "software-development-company").replace(/-/g, " "));
}

function servicePhraseForCopy(serviceSlug = "software-development-company") {
  const service = String(serviceSlug || "software-development-company").replace(/-/g, " ");
  const phrase = /^software development company$/i.test(service)
    ? "software development"
    : service.replace(/\s+company$/i, "");
  return phrase
    .replace(/\bai\b/gi, "AI")
    .replace(/\bsaas\b/gi, "SaaS")
    .replace(/\bapi\b/gi, "API")
    .replace(/\bapis\b/gi, "APIs");
}

// Whitespace-only tidy: trim, collapse runs of spaces/tabs to one, strip trailing
// spaces before newlines. This is the ONLY post-processing applied to AI copy — it
// never changes wording, punctuation, or word order.
function tidyWhitespace(value) {
  if (typeof value === "string") return value.replace(/[ \t ]+/g, " ").replace(/ +\n/g, "\n").trim();
  if (Array.isArray(value)) return value.map(tidyWhitespace);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, tidyWhitespace(item)]));
  }
  return value;
}

function normalizeSbcSeoSuggestion(suggestion = {}, input = {}) {
  // ASSEMBLY ONLY. This no longer writes, pads, rewrites, or merges AI prose. It
  // (a) locks the deterministic structural fields the frontend/CMS require and
  // (b) passes every AI-authored field through untouched. `fallback` is used only
  // as the source of LOCKED structural scaffolding (fixed stats, tech stack,
  // industry names/icons, engagement badges/CTAs, stage titles) — never to pad AI
  // copy. On the fallback code path `suggestion` already IS the fallback, so the
  // structural overlays below are no-ops.
  const s = JSON.parse(JSON.stringify(suggestion || {}));
  const fallback = buildLocalSeoSuggestion(input);
  const brief = getBriefInput(input);
  const hasExplicitCity = Object.prototype.hasOwnProperty.call(input, "targetCity") || Object.prototype.hasOwnProperty.call(input.keywordBrief || {}, "targetCity");
  const targetCity = hasExplicitCity ? (brief.targetCity || "") : "";
  const targetCountry = brief.targetCountry || s.country || countryFromMarket(input.market) || "UK";
  const primaryKeyword = brief.primaryKeyword || "software development company";
  const countryDisplay = String(targetCountry).toLowerCase() === "uk" ? "the UK" : targetCountry;
  const locationLabel = targetCity || countryDisplay;
  const countrySlug = countrySlugFor(targetCountry);
  const citySlug = slugify(targetCity);
  const serviceSlug = stripLocationFromSlug(primaryKeyword, targetCity, targetCountry);
  const serviceLabel = serviceLabelFromSlug(serviceSlug);
  const primaryTitle = titleCase(primaryKeyword);

  // Identity + URL locks (unchanged logic — canonical/slug/market must stay stable).
  s.title = `Akoode Technologies: ${primaryTitle}`;
  s.slug = serviceSlug;
  s.country = targetCountry;
  s.market = citySlug ? `${countrySlug}/${citySlug}` : countrySlug;

  // Hero: H1, CTA buttons/links, and the 4-item stats bar are locked; body and
  // heroImageAlt are AI-authored, left untouched. CTAs are set here because the
  // grouped prompts no longer ask the model to generate them (wasted output tokens).
  s.hero = s.hero || {};
  s.hero.heading = primaryTitle;
  s.hero.cta1 = "Start your project";
  s.hero.cta1Link = "/post-requirement";
  s.hero.cta2 = "See our work";
  s.hero.cta2Link = "/case-study";
  s.hero.stats = [
    { icon: "BriefcaseStatIcon", value: "180+", label: "Projects Delivered", sub: "Across global markets" },
    { icon: "RetentionStatIcon", value: "97%", label: "Client Retention", sub: "Long-term technology partnerships" },
    { icon: "AiStatIcon", value: "30+", label: "AI-Powered Solutions Built", sub: "Scalable AI systems for modern businesses" },
    { icon: "IndustryStatIcon", value: "15+", label: "Industries Served", sub: "From FinTech to HealthTech and SaaS" },
  ];

  // Locked section H2; AI writes intro / features / clientLove.
  s.chooseUs = s.chooseUs || {};
  s.chooseUs.heading = "Built with Precision. Validated by Results.";

  // Locked geo heading + card labels; AI writes para1/para2/para3, features, cardBody.
  s.whyLocation = s.whyLocation || {};
  s.whyLocation.heading = targetCity
    ? `Why ${targetCity} Businesses Demand More From Software Development Partners`
    : `Why ${targetCountry} Businesses Expect More From Software Development Partners`;
  s.whyLocation.cardLocation = targetCity
    ? `${targetCity}, ${targetCountry}`.toUpperCase()
    : String(targetCountry).toUpperCase();
  s.whyLocation.cardHeading = `The Future of Software Development in ${targetCity || targetCountry}`;
  if (!targetCity && String(targetCountry).toLowerCase() === "uk") {
    s.whyLocation.heading = "Why UK Businesses Expect More From Software Development Partners";
    s.whyLocation.cardLocation = "UK";
  }

  // Locked section H2; AI writes intro + the service cards. Only the display index
  // `n` is (re)stamped for stable numbering — no prose is generated or padded.
  s.process = s.process || {};
  s.process.heading = `Custom Software Development Services in ${locationLabel}`;
  if (Array.isArray(s.process.services)) {
    s.process.services = s.process.services.map((it, i) => ({ ...it, n: it?.n || String(i + 1).padStart(2, "0") }));
  }

  s.whatWeDo = s.whatWeDo || {};
  s.whatWeDo.heading = `How Akoode Delivers Software Development Projects in ${locationLabel}`;
  const stepScaffold = fallback.whatWeDo.steps || [];
  const aiSteps = Array.isArray(s.whatWeDo.steps) ? s.whatWeDo.steps : [];
  s.whatWeDo.steps = stepScaffold.map((fb, i) => {
    const ai = aiSteps[i] || {};
    return {
      ...fb,
      title: fb.title,            // locked
      shortTitle: fb.shortTitle,  // locked
      // AI content passed through untouched; empty structure (never injected copy)
      // if absent — validation already guarantees these on the AI path.
      body: ai.body ?? "",
      timeline: ai.timeline || fb.timeline, // short structural label, not prose
      timelineNote: ai.timelineNote ?? "",
      deliverables: Array.isArray(ai.deliverables) ? ai.deliverables : [],
    };
  });

  // Tech Stack is a fully static section (frontend renders it hard-coded and the
  // prompt tells the model to skip it). Lock it to the canonical set.
  s.techStack = fallback.techStack;

  // Industries: the 15 names + icons + order are locked; AI writes the 4 points each.
  s.industries = s.industries || {};
  s.industries.heading = s.industries.heading || fallback.industries.heading;
  const industryScaffold = fallback.industries.items || [];
  const aiIndustries = Array.isArray(s.industries.items) ? s.industries.items : [];
  s.industries.items = industryScaffold.map((fb, i) => {
    const ai = aiIndustries.find((x) => x?.name === fb.name) || aiIndustries[i] || {};
    return {
      icon: fb.icon || "FiCheckCircle",  // locked
      name: fb.name,                      // locked
      points: Array.isArray(ai.points) ? ai.points : [],  // AI content; empty if absent
    };
  });

  // whyChoose: heading / subtitle / cards are AI-authored; the founder CTA card is static.
  s.whyChoose = s.whyChoose || {};
  s.whyChoose.ctaHeading = fallback.whyChoose.ctaHeading;
  s.whyChoose.ctaBody = fallback.whyChoose.ctaBody;
  s.whyChoose.ctaText = fallback.whyChoose.ctaText;
  s.whyChoose.ctaLink = fallback.whyChoose.ctaLink;

  // Engagement: model names, order, badges, "best for", and CTAs are locked; AI writes
  // body + perks. Match AI models to slots by title so response order never matters.
  s.engagement = s.engagement || {};
  s.engagement.heading = `Flexible Engagement Models for ${locationLabel} ${serviceLabel} Projects`;
  const aiModels = Array.isArray(s.engagement.models) ? s.engagement.models : [];
  const findAiModel = (title) => aiModels.find((m) => String(m?.title || "").trim().toLowerCase() === String(title).toLowerCase()) || {};
  s.engagement.models = (fallback.engagement.models || []).map((fb) => {
    const ai = findAiModel(fb.title);
    return {
      ...fb,                     // badge, best, title, ctaText, ctaLink (locked)
      body: ai.body ?? "",       // AI content; empty if absent (never injected)
      perks: Array.isArray(ai.perks) ? ai.perks : [],
    };
  });
  // FAQ: heading locked; items are AI-authored and passed through untouched (capped at 12).
  s.faq = s.faq || {};
  s.faq.heading = "Frequently Asked Questions";
  if (Array.isArray(s.faq.items)) s.faq.items = s.faq.items.slice(0, 12);

  // Locked structural headings for the manually-curated sections. The AI never
  // generates these sections; subtitles come from the static template (location-
  // aware wording) so the admin form isn't left blank.
  s.caseStudies = s.caseStudies || {};
  s.caseStudies.heading = "Outcomes You Can Take to Your Board Meeting";
  s.caseStudies.subtitle = s.caseStudies.subtitle || (fallback.caseStudies && fallback.caseStudies.subtitle) || "Real delivery examples should show measurable product progress, commercial outcomes, and technical decisions leaders can report internally.";
  s.testimonials = s.testimonials || {};
  s.testimonials.heading = s.testimonials.heading || `What ${locationLabel} Clients Say About Working With Akoode`;
  s.testimonials.subtitle = s.testimonials.subtitle || "Founder, CTO, and product leader feedback is inserted manually from approved client content.";
  s.blog = s.blog || {};
  s.blog.heading = "Reading from the Studio";
  s.blog.subtitle = "Notes, engineering decisions, and field lessons from the products we build every week.";
  s.finalCta = s.finalCta || {};
  s.finalCta.heading = "Start Your Software Project with Akoode";
  s.finalCta.replyTime = "Response within 30 min";
  s.finalCta.nda = "NDA signed on request";

  // Meta: title pattern is locked; description is AI-authored and left untouched.
  s.meta = s.meta || {};
  s.meta.title = `${primaryTitle} | Akoode`.slice(0, 55);

  s.implementationNotes = [
    `Canonical URL: https://www.akoode.com/${s.market}/${s.slug}`,
    `Full slug path: ${s.market}/${s.slug}`,
    "Add FAQ schema markup for the generated FAQ items on this page.",
  ];
  return tidyWhitespace(s);
}

// SUPERSEDED by the 4 group validators below (validateGroup1..validateGroup4) —
// the main handlers now generate the page as 4 independent grouped calls and
// validate each group separately. Kept intact for rollback to the single-call flow.
//
// Validate the RAW parsed AI output against the required structure, EXACT array
// counts, and the prompt's word/character ranges BEFORE any assembly. Returns a
// list of descriptive errors ([] means valid). Only AI-authored fields are checked;
// locked structural fields (hero stats, section headings, industry/engagement/stage
// names, and the STATIC tech stack) are set by the server during assembly and are
// therefore server-guaranteed — the tech stack is intentionally NOT validated here
// because the AI never generates it. Counts are exact (===); word/char bounds match
// the master prompt so a spec-compliant response passes on the first attempt.
function validateAiSuggestion(suggestion = {}) {
  const s = suggestion || {};
  const errors = [];
  const arr = (v) => (Array.isArray(v) ? v : []);
  const words = (v) => wordCount(v || "");
  const chars = (v) => String(v || "").trim().length;
  const hasText = (v) => typeof v === "string" && v.trim().length > 0;
  const wr = (v, min, max) => { const w = words(v); return w >= min && w <= max; };

  // Hero — body is AI-authored (heading + stats are server-locked): 30-35 words.
  if (!wr(s.hero && s.hero.body, 30, 35)) errors.push(`hero.body must contain 30-35 words (got ${words(s.hero && s.hero.body)})`);

  // Choose Us — intro 40-50 words; exactly 4 trust cards + exactly 4 client-love cards, each 25-35 words.
  if (!wr(s.chooseUs && s.chooseUs.intro, 40, 50)) errors.push(`chooseUs.intro must contain 40-50 words (got ${words(s.chooseUs && s.chooseUs.intro)})`);
  const features = arr(s.chooseUs && s.chooseUs.features);
  if (features.length !== 4) errors.push(`chooseUs.features must contain exactly 4 objects (got ${features.length})`);
  else features.forEach((f, i) => { if (!wr(f && f.body, 25, 35)) errors.push(`chooseUs.features[${i}].body must contain 25-35 words`); });
  const clientLove = arr(s.chooseUs && s.chooseUs.clientLove);
  if (clientLove.length !== 4) errors.push(`chooseUs.clientLove must contain exactly 4 objects (got ${clientLove.length})`);
  else clientLove.forEach((c, i) => { if (!wr(c && c.body, 25, 35)) errors.push(`chooseUs.clientLove[${i}].body must contain 25-35 words`); });

  // Why Location — 3 body paragraphs 40-45 words; exactly 4 insight cards 14-18 words; cardBody 12-15 words.
  ["para1", "para2", "para3"].forEach((k) => { if (!wr(s.whyLocation && s.whyLocation[k], 40, 45)) errors.push(`whyLocation.${k} must contain 40-45 words`); });
  const wlFeatures = arr(s.whyLocation && s.whyLocation.features);
  if (wlFeatures.length !== 4) errors.push(`whyLocation.features must contain exactly 4 objects (got ${wlFeatures.length})`);
  else wlFeatures.forEach((f, i) => { if (!wr(f && f.body, 14, 18)) errors.push(`whyLocation.features[${i}].body must contain 14-18 words`); });
  if (!wr(s.whyLocation && s.whyLocation.cardBody, 12, 15)) errors.push("whyLocation.cardBody must contain 12-15 words");

  // Process — intro 35-45 words; exactly 6 service cards (para 75-90 words, 5-6 points of 8-14 words, 6-7 tags).
  if (!wr(s.process && s.process.intro, 35, 45)) errors.push("process.intro must contain 35-45 words");
  const services = arr(s.process && s.process.services);
  if (services.length !== 6) errors.push(`process.services must contain exactly 6 objects (got ${services.length})`);
  else services.forEach((sv, i) => {
    if (!wr(sv && sv.para, 75, 90)) errors.push(`process.services[${i}].para must contain 75-90 words (got ${words(sv && sv.para)})`);
    const pts = arr(sv && sv.points);
    if (pts.length < 5 || pts.length > 6) errors.push(`process.services[${i}].points must contain 5-6 items (got ${pts.length})`);
    else pts.forEach((p, j) => { if (!wr(p, 8, 14)) errors.push(`process.services[${i}].points[${j}] must contain 8-14 words`); });
    const tags = arr(sv && sv.tags);
    if (tags.length < 6 || tags.length > 7) errors.push(`process.services[${i}].tags must contain 6-7 items (got ${tags.length})`);
  });

  // What We Do — subtitle 30-40 words; exactly 6 stages (body 45-70 words, timelineNote 20-25 words, exactly 4 deliverables of 6-12 words).
  if (!wr(s.whatWeDo && s.whatWeDo.subtitle, 30, 40)) errors.push("whatWeDo.subtitle must contain 30-40 words");
  const steps = arr(s.whatWeDo && s.whatWeDo.steps);
  if (steps.length !== 6) errors.push(`whatWeDo.steps must contain exactly 6 objects (got ${steps.length})`);
  else steps.forEach((st, i) => {
    if (!wr(st && st.body, 45, 70)) errors.push(`whatWeDo.steps[${i}].body must contain 45-70 words (got ${words(st && st.body)})`);
    if (!wr(st && st.timelineNote, 20, 25)) errors.push(`whatWeDo.steps[${i}].timelineNote must contain 20-25 words`);
    const del = arr(st && st.deliverables);
    if (del.length !== 4) errors.push(`whatWeDo.steps[${i}].deliverables must contain exactly 4 items (got ${del.length})`);
    else del.forEach((d, j) => { if (!wr(d, 6, 12)) errors.push(`whatWeDo.steps[${i}].deliverables[${j}] must contain 6-12 words`); });
  });

  // Industries — exactly 15 items, each with exactly 4 points of 8-12 words (names/icons are server-locked).
  const industries = arr(s.industries && s.industries.items);
  if (industries.length !== 15) errors.push(`industries.items must contain exactly 15 objects (got ${industries.length})`);
  else industries.forEach((it, i) => {
    const pts = arr(it && it.points);
    if (pts.length !== 4) errors.push(`industries.items[${i}].points must contain exactly 4 items (got ${pts.length})`);
    else pts.forEach((p, j) => { if (!wr(p, 8, 12)) errors.push(`industries.items[${i}].points[${j}] must contain 8-12 words`); });
  });

  // Why Choose — subtitle 30-40 words; exactly 4 cards 35-45 words.
  if (!wr(s.whyChoose && s.whyChoose.subtitle, 30, 40)) errors.push("whyChoose.subtitle must contain 30-40 words");
  const wcCards = arr(s.whyChoose && s.whyChoose.cards);
  if (wcCards.length !== 4) errors.push(`whyChoose.cards must contain exactly 4 objects (got ${wcCards.length})`);
  else wcCards.forEach((c, i) => { if (!wr(c && c.desc, 35, 45)) errors.push(`whyChoose.cards[${i}].desc must contain 35-45 words`); });

  // Engagement — subtitle 30-40 words; exactly 3 models (names/badges/CTAs locked), each a non-empty body + 3-4 perks.
  if (!wr(s.engagement && s.engagement.subtitle, 30, 40)) errors.push("engagement.subtitle must contain 30-40 words");
  const models = arr(s.engagement && s.engagement.models);
  if (models.length !== 3) errors.push(`engagement.models must contain exactly 3 objects (got ${models.length})`);
  else models.forEach((m, i) => {
    if (!hasText(m && m.body)) errors.push(`engagement.models[${i}].body must not be empty`);
    const perks = arr(m && m.perks);
    if (perks.length < 3 || perks.length > 4) errors.push(`engagement.models[${i}].perks must contain 3-4 items (got ${perks.length})`);
  });

  // FAQ — exactly 12 items, each with a non-empty question and a 50-80 word answer.
  const faqs = arr(s.faq && s.faq.items);
  if (faqs.length !== 12) errors.push(`faq.items must contain exactly 12 objects (got ${faqs.length})`);
  else faqs.forEach((f, i) => {
    if (!hasText(f && f.question)) errors.push(`faq.items[${i}].question must not be empty`);
    if (!wr(f && f.answer, 50, 80)) errors.push(`faq.items[${i}].answer must contain 50-80 words (got ${words(f && f.answer)})`);
  });

  // Final CTA + Meta description.
  if (!wr(s.finalCta && s.finalCta.body, 30, 40)) errors.push("finalCta.body must contain 30-40 words");
  const metaDesc = s.meta && s.meta.description;
  if (!hasText(metaDesc)) errors.push("meta.description must not be empty");
  else if (chars(metaDesc) < 150 || chars(metaDesc) > 155) errors.push(`meta.description must contain 150-155 characters (got ${chars(metaDesc)})`);

  return errors;
}

// Generate → extract JSON → validate; regenerate the WHOLE response on failure, up
// to ANTHROPIC_MAX_ATTEMPTS (default 3). Never partially repairs the AI output.
// Returns { ok, parsed, attempts, errors }.
async function generateValidatedSuggestion({ prompt, maxTokens, temperature, timeoutMs }) {
  const maxAttempts = Math.max(1, Number(process.env.ANTHROPIC_MAX_ATTEMPTS || 3));
  let errors = ["No generation attempted"];
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    let parsed;
    try {
      parsed = await requestAnthropicJson({ prompt, maxTokens, temperature, timeoutMs });
    } catch (err) {
      errors = [err.message || "Anthropic request failed"];
      continue; // retry request/JSON failures too
    }
    errors = validateAiSuggestion(parsed);
    if (errors.length === 0) return { ok: true, parsed, attempts: attempt, errors: [] };
  }
  return { ok: false, parsed: null, attempts: maxAttempts, errors };
}

// ---------------------------------------------------------------------------
// GROUPED GENERATION — 6 scoped calls, validated and retried independently.
// Group 1:  hero + chooseUs + whyLocation
// Group 2:  process (service cards)
// Group 2b: whatWeDo (delivery stages)
// Group 3:  industries
// Group 3b: engagement + whyChoose
// Group 4:  faq + finalCta + meta
// Six groups (not four) so every call's output fits under the org's 4,000
// output-tokens-per-minute rate limit without truncating mid-JSON.
// A group that exhausts its retries falls back to ONLY its own slice of the
// static template (buildFallbackGroup) — never the whole page.
// ---------------------------------------------------------------------------

// Shared helpers for the group validators (same style as validateAiSuggestion).
const vArr = (v) => (Array.isArray(v) ? v : []);
const vWords = (v) => wordCount(v || "");
const vChars = (v) => String(v || "").trim().length;
const vHasText = (v) => typeof v === "string" && v.trim().length > 0;
// Word-range check with tolerance. The prompt still asks for the exact range, but
// the model (especially with thinking disabled) frequently lands 1-3 words outside
// it — rejecting a 28-word hero body against a 30-35 rule wastes a whole retry (and
// eventually a whole group) over copy that renders fine. Tolerance widens each
// bound by SBC_WORDCOUNT_TOLERANCE (default 20%); the field must still be present.
// Structural counts (exactly 4 cards, 15 industries, 12 FAQs) remain strict.
const WORD_TOLERANCE = Math.max(0, Number(process.env.SBC_WORDCOUNT_TOLERANCE ?? 0.2));
const vWr = (v, min, max) => {
  const w = vWords(v);
  return w >= Math.floor(min * (1 - WORD_TOLERANCE)) && w <= Math.ceil(max * (1 + WORD_TOLERANCE));
};

// ── Error severity ─────────────────────────────────────────────────────────
// STRUCTURAL errors (wrong array length, missing/empty required field) genuinely
// break a section: normalizeSbcSeoSuggestion matches industries by position and
// engagement models by title, so a short array silently drops content. Those
// still force the section onto the static fallback.
//
// STYLE errors (a paragraph landing outside its word band, a meta description a
// few characters long) do not break anything — the copy renders fine. They are
// tagged so the orchestrator can KEEP the generated copy when a section is
// structurally complete but stylistically off.
//
// This distinction is the fix for duplicated city pages: a group like group2
// carries ~90 independent checks, so the odds of every word band landing inside
// range in one generation are low. Treating one 74-word paragraph as fatal threw
// away an entire section of genuine, city-specific copy and substituted the
// static template — whose bodies contain no city interpolation at all and are
// therefore byte-identical on every city page.
const STYLE_PREFIX = "[style] ";
const styleErr = (msg) => `${STYLE_PREFIX}${msg}`;
const isStyleErr = (e) => typeof e === "string" && e.startsWith(STYLE_PREFIX);
const cleanErr = (e) => (isStyleErr(e) ? e.slice(STYLE_PREFIX.length) : e);
const hardErrors = (errs) => (Array.isArray(errs) ? errs : []).filter((e) => !isStyleErr(e));
// Presence is structural (a missing paragraph leaves a visible hole in the page);
// length is style. Used for every AI-authored prose field below.
const vText = (errors, value, label, min, max) => {
  if (!vHasText(value)) {
    errors.push(`${label} must not be empty`);
    return;
  }
  if (!vWr(value, min, max)) {
    errors.push(styleErr(`${label} must contain ${min}-${max} words (got ${vWords(value)})`));
  }
};

// Group 1 — hero.body, chooseUs (intro/features/clientLove), whyLocation (paras/features/cardBody).
function validateGroup1(parsed = {}) {
  const s = parsed || {};
  const errors = [];
  // Overlong H1s wrap and squeeze the hero layout on the shared SBC template.
  // Flag only — never auto-truncate: cutting an AI-written title mid-clause
  // breaks grammar and meaning, so an outlier gets reviewed by a human instead.
  // styleErr keeps the copy publishable (see STYLE_PREFIX note above).
  const h1 = s.hero && s.hero.heading;
  if (vHasText(h1) && vChars(h1) > 70) {
    console.warn(`[sbc-seo] hero.heading is ${vChars(h1)} chars (>70) — review: ${String(h1).trim()}`);
    errors.push(styleErr(`hero.heading exceeds 70 characters (got ${vChars(h1)}) — review for hero layout wrapping`));
  }
  vText(errors, s.hero && s.hero.body, "hero.body", 30, 35);
  vText(errors, s.chooseUs && s.chooseUs.intro, "chooseUs.intro", 40, 50);
  const features = vArr(s.chooseUs && s.chooseUs.features);
  if (features.length !== 4) errors.push(`chooseUs.features must contain exactly 4 objects (got ${features.length})`);
  else features.forEach((f, i) => vText(errors, f && f.body, `chooseUs.features[${i}].body`, 25, 35));
  const clientLove = vArr(s.chooseUs && s.chooseUs.clientLove);
  if (clientLove.length !== 4) errors.push(`chooseUs.clientLove must contain exactly 4 objects (got ${clientLove.length})`);
  else clientLove.forEach((c, i) => vText(errors, c && c.body, `chooseUs.clientLove[${i}].body`, 25, 35));
  ["para1", "para2", "para3"].forEach((k) => vText(errors, s.whyLocation && s.whyLocation[k], `whyLocation.${k}`, 40, 45));
  const wlFeatures = vArr(s.whyLocation && s.whyLocation.features);
  if (wlFeatures.length !== 4) errors.push(`whyLocation.features must contain exactly 4 objects (got ${wlFeatures.length})`);
  else wlFeatures.forEach((f, i) => vText(errors, f && f.body, `whyLocation.features[${i}].body`, 14, 18));
  vText(errors, s.whyLocation && s.whyLocation.cardBody, "whyLocation.cardBody", 12, 15);
  return errors;
}

// Group 2 — process (intro + 6 service cards) + whatWeDo (subtitle + 6 delivery stages).
// Split into per-subsection validators (validateProcess/validateWhatWeDo,
// validateIndustries/validateEngagementWhyChoose) so a failure in one half of a
// merged group doesn't force the OTHER half — which may have generated fine —
// onto static fallback too. validateGroup2/validateGroup3 (below) combine them
// only to decide whether the whole call needs a retry; the orchestrator scores
// each subsection independently against the last attempt before falling back.
function validateProcess(parsed = {}) {
  const s = parsed || {};
  const errors = [];
  vText(errors, s.process && s.process.intro, "process.intro", 35, 45);
  const services = vArr(s.process && s.process.services);
  if (services.length !== 6) errors.push(`process.services must contain exactly 6 objects (got ${services.length})`);
  else services.forEach((sv, i) => {
    vText(errors, sv && sv.para, `process.services[${i}].para`, 75, 90);
    const pts = vArr(sv && sv.points);
    if (pts.length < 5 || pts.length > 6) errors.push(`process.services[${i}].points must contain 5-6 items (got ${pts.length})`);
    else pts.forEach((p, j) => vText(errors, p, `process.services[${i}].points[${j}]`, 8, 14));
    const tags = vArr(sv && sv.tags);
    if (tags.length < 6 || tags.length > 7) errors.push(`process.services[${i}].tags must contain 6-7 items (got ${tags.length})`);
  });
  return errors;
}

function validateWhatWeDo(parsed = {}) {
  const s = parsed || {};
  const errors = [];
  vText(errors, s.whatWeDo && s.whatWeDo.subtitle, "whatWeDo.subtitle", 30, 40);
  const steps = vArr(s.whatWeDo && s.whatWeDo.steps);
  if (steps.length !== 6) errors.push(`whatWeDo.steps must contain exactly 6 objects (got ${steps.length})`);
  else steps.forEach((st, i) => {
    vText(errors, st && st.body, `whatWeDo.steps[${i}].body`, 45, 70);
    vText(errors, st && st.timelineNote, `whatWeDo.steps[${i}].timelineNote`, 20, 25);
    const del = vArr(st && st.deliverables);
    if (del.length !== 4) errors.push(`whatWeDo.steps[${i}].deliverables must contain exactly 4 items (got ${del.length})`);
    else del.forEach((d, j) => vText(errors, d, `whatWeDo.steps[${i}].deliverables[${j}]`, 6, 12));
  });
  return errors;
}

// Group 2 — process + whatWeDo combined, used only to decide whether the call needs a retry.
function validateGroup2(parsed = {}) {
  return [...validateProcess(parsed), ...validateWhatWeDo(parsed)];
}

function validateIndustries(parsed = {}) {
  const s = parsed || {};
  const errors = [];
  vText(errors, s.industries && s.industries.subtitle, "industries.subtitle", 30, 40);
  const industries = vArr(s.industries && s.industries.items);
  if (industries.length !== 15) errors.push(`industries.items must contain exactly 15 objects (got ${industries.length})`);
  else industries.forEach((it, i) => {
    // Industry names are no longer generated (server re-attaches the locked names
    // by position) — only the 4 points per item are AI-authored.
    const pts = vArr(it && it.points);
    if (pts.length !== 4) errors.push(`industries.items[${i}].points must contain exactly 4 items (got ${pts.length})`);
    else pts.forEach((p, j) => vText(errors, p, `industries.items[${i}].points[${j}]`, 8, 12));
  });
  return errors;
}

function validateEngagementWhyChoose(parsed = {}) {
  const s = parsed || {};
  const errors = [];
  vText(errors, s.engagement && s.engagement.subtitle, "engagement.subtitle", 30, 40);
  const models = vArr(s.engagement && s.engagement.models);
  if (models.length !== 3) errors.push(`engagement.models must contain exactly 3 objects (got ${models.length})`);
  else models.forEach((m, i) => {
    // title is required because normalizeSbcSeoSuggestion matches AI content to the
    // locked model slots by title — a missing title would silently drop the body.
    if (!vHasText(m && m.title)) errors.push(`engagement.models[${i}].title must not be empty`);
    if (!vHasText(m && m.body)) errors.push(`engagement.models[${i}].body must not be empty`);
    const perks = vArr(m && m.perks);
    if (perks.length < 3 || perks.length > 4) errors.push(`engagement.models[${i}].perks must contain 3-4 items (got ${perks.length})`);
  });
  vText(errors, s.whyChoose && s.whyChoose.subtitle, "whyChoose.subtitle", 30, 40);
  const wcCards = vArr(s.whyChoose && s.whyChoose.cards);
  if (wcCards.length !== 4) errors.push(`whyChoose.cards must contain exactly 4 objects (got ${wcCards.length})`);
  else wcCards.forEach((c, i) => vText(errors, c && c.desc, `whyChoose.cards[${i}].desc`, 35, 45));
  return errors;
}

// Group 3 — industries + engagement/whyChoose combined, used only to decide whether the call needs a retry.
function validateGroup3(parsed = {}) {
  return [...validateIndustries(parsed), ...validateEngagementWhyChoose(parsed)];
}

// Group 4 — faq (subtitle + 12 items), finalCta.body, meta.description.
function validateGroup4(parsed = {}) {
  const s = parsed || {};
  const errors = [];
  vText(errors, s.faq && s.faq.subtitle, "faq.subtitle", 20, 30);
  const faqs = vArr(s.faq && s.faq.items);
  if (faqs.length !== 12) errors.push(`faq.items must contain exactly 12 objects (got ${faqs.length})`);
  else faqs.forEach((f, i) => {
    if (!vHasText(f && f.question)) errors.push(`faq.items[${i}].question must not be empty`);
    vText(errors, f && f.answer, `faq.items[${i}].answer`, 50, 80);
  });
  vText(errors, s.finalCta && s.finalCta.body, "finalCta.body", 30, 40);
  const metaDesc = s.meta && s.meta.description;
  // 150-155 is a 6-character window — the model lands outside it constantly, and
  // a 148-char description is a perfectly good meta tag. Style, not structure.
  if (!vHasText(metaDesc)) errors.push("meta.description must not be empty");
  else if (vChars(metaDesc) < 150 || vChars(metaDesc) > 155) errors.push(styleErr(`meta.description must contain 150-155 characters (got ${vChars(metaDesc)})`));
  return errors;
}

// Generate → extract JSON → validate ONE group; regenerate this group only on
// failure, up to ANTHROPIC_MAX_ATTEMPTS (default 3). Modeled on
// generateValidatedSuggestion but scoped to a single group's validator.
// staticPrefix/dynamicSuffix pass straight through on every attempt — retries send
// the identical staticPrefix, so they read the prompt cache written by attempt 1.
//
// Rate-limit aware: if the API returns a rate_limit_error the retry waits
// ANTHROPIC_RATE_LIMIT_BACKOFF_MS (default 20 000 ms) before re-submitting so the
// org's per-minute token window has time to refill.
async function generateValidatedGroup({ staticPrefix, dynamicSuffix, validator, maxTokens, temperature, timeoutMs, groupLabel, maxAttempts: maxAttemptsOverride }) {
  // maxAttemptsOverride is used only by the city similarity gate's rewrite passes;
  // normal generation (city and country) keeps the env-driven default unchanged.
  const maxAttempts = Math.max(1, Number(maxAttemptsOverride || process.env.ANTHROPIC_MAX_ATTEMPTS || 3));
  const rateLimitBackoffMs = Number(process.env.ANTHROPIC_RATE_LIMIT_BACKOFF_MS || 20000);
  let errors = ["No generation attempted"];
  let lastErrorType = "none";
  // Kept across attempts (not reset to null on failure) so that if every attempt
  // fails overall validation, the orchestrator can still salvage whichever
  // subsections individually validate, instead of discarding an entire
  // multi-section group over one bad subsection.
  //
  // We keep the BEST attempt rather than the last: structurally complete output
  // always beats structurally broken output, and among structurally complete
  // drafts the one with fewest style deviations wins. Previously the last attempt
  // was kept even when an earlier one was closer, which could push a salvageable
  // section onto the static fallback purely by ordering.
  let bestParsed = null;
  let bestErrors = null;
  const rank = (errs) => hardErrors(errs).length * 1000 + errs.length;
  // EARLY ACCEPT — token control. A retry re-sends the whole group (group2 alone
  // is up to 5 800 output tokens), so retrying to nudge a paragraph from 72 words
  // into a 45-70 band costs a full group's output for copy that renders identically.
  // Previously group2 spent every one of its 3 attempts and then discarded all of
  // them for the static template: three groups' worth of tokens bought nothing.
  // Now, once a draft is structurally complete and only trivially outside its word
  // bands, we take it and stop. Retries are reserved for drafts that are actually
  // broken, or so far off that the model likely misread the brief.
  const styleAcceptMax = Math.max(0, Number(process.env.SBC_STYLE_ACCEPT_MAX ?? 8));
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    let parsed;
    try {
      parsed = await requestAnthropicJson({ staticPrefix, dynamicSuffix, maxTokens, temperature, timeoutMs });
    } catch (err) {
      const errType = err.errorType || "unknown";
      lastErrorType = errType;
      errors = [err.message || "Anthropic request failed"];
      if (errType === "rate_limit_error" && attempt < maxAttempts) {
        console.warn(`[sbcSeoSuggestion] ${groupLabel}: rate_limit_error on attempt ${attempt}/${maxAttempts}, backing off ${rateLimitBackoffMs}ms before retry`);
        await new Promise((resolve) => setTimeout(resolve, rateLimitBackoffMs));
      } else if (attempt < maxAttempts) {
        console.warn(`[sbcSeoSuggestion] ${groupLabel}: ${errType} error on attempt ${attempt}/${maxAttempts}: ${err.message}`);
      }
      continue; // retry request/JSON failures too
    }
    lastErrorType = "validation";
    errors = validator(parsed);
    if (errors.length === 0) return { ok: true, parsed, attempts: attempt, errors: [], groupLabel };
    if (hardErrors(errors).length === 0 && errors.length <= styleAcceptMax) {
      return { ok: true, parsed, attempts: attempt, errors, groupLabel, styleOnly: true };
    }
    if (bestErrors === null || rank(errors) < rank(bestErrors)) {
      bestParsed = parsed;
      bestErrors = errors;
    }
  }
  return { ok: false, parsed: bestParsed, attempts: maxAttempts, errors: bestErrors || errors, groupLabel, lastErrorType };
}

// Last-resort fallback for ONE group only: the matching slice of the static
// template. Groups that generated successfully are never replaced.
function buildFallbackGroup(groupLabel, input = {}) {
  const fallback = buildLocalSeoSuggestion(input);
  switch (groupLabel) {
    case "group1": return { hero: fallback.hero, chooseUs: fallback.chooseUs, whyLocation: fallback.whyLocation };
    case "group2": return { process: fallback.process, whatWeDo: fallback.whatWeDo };
    case "group3": return { industries: fallback.industries, engagement: fallback.engagement, whyChoose: fallback.whyChoose };
    case "group4": return { faq: fallback.faq, finalCta: fallback.finalCta, meta: fallback.meta };
    default: return {};
  }
}

// Human-readable section names per group, used in the response message/source so
// admins can see exactly WHICH sections fell back to static copy.
const GROUP_SECTION_LABELS = {
  group1: "hero/chooseUs/whyLocation",
  group2: "services/delivery process",
  group3: "industries/engagement/whyChoose",
  group4: "faq/finalCta/meta",
};

// Per-subsection breakdown of each group, used to salvage a group's valid half
// instead of discarding the whole thing when only one subsection fails
// validation. Groups 1 and 4 were never split, so each has a single subsection
// covering the whole group (behavior for them is unchanged: all-or-nothing).
const GROUP_SUBSECTIONS = {
  group1: [
    { label: GROUP_SECTION_LABELS.group1, validate: validateGroup1, pick: (p) => ({ hero: p.hero, chooseUs: p.chooseUs, whyLocation: p.whyLocation }) },
  ],
  group2: [
    { label: "services", validate: validateProcess, pick: (p) => ({ process: p.process }) },
    { label: "delivery process", validate: validateWhatWeDo, pick: (p) => ({ whatWeDo: p.whatWeDo }) },
  ],
  group3: [
    { label: "industries", validate: validateIndustries, pick: (p) => ({ industries: p.industries }) },
    { label: "engagement/whyChoose", validate: validateEngagementWhyChoose, pick: (p) => ({ engagement: p.engagement, whyChoose: p.whyChoose }) },
  ],
  group4: [
    { label: GROUP_SECTION_LABELS.group4, validate: validateGroup4, pick: (p) => ({ faq: p.faq, finalCta: p.finalCta, meta: p.meta }) },
  ],
};

// Cross-page repetition guard: pull short phrases (FAQ questions, hero openings,
// service card titles) from the most recently published SBC pages so the prompts
// can tell the model not to reuse them. Best-effort — returns [] on any DB issue
// (the app supports ALLOW_DB_FAILURE mode where mongoose may not be connected).
async function getRecentPhrasesForAvoidance(limit = 5) {
  try {
    if (mongoose.connection.readyState !== 1) return [];
    const projection = { "faq.items.question": 1, "hero.body": 1, "process.services.title": 1 };
    const [countryDocs, cityDocs] = await Promise.all([
      ServiceByCountry.find({ status: true }).sort({ updatedAt: -1 }).limit(limit).select(projection).lean(),
      ServiceByCity.find({ status: true }).sort({ updatedAt: -1 }).limit(limit).select(projection).lean(),
    ]);
    const phrases = [];
    for (const doc of [...countryDocs, ...cityDocs]) {
      const heroOpening = String(doc?.hero?.body || "").split(/\s+/).slice(0, 8).join(" ").trim();
      if (heroOpening) phrases.push(heroOpening);
      (doc?.faq?.items || []).slice(0, 3).forEach((item) => { if (item?.question) phrases.push(String(item.question).trim()); });
      (doc?.process?.services || []).slice(0, 3).forEach((sv) => { if (sv?.title) phrases.push(String(sv.title).trim()); });
    }
    return [...new Set(phrases.filter(Boolean))].slice(0, 20);
  } catch (err) {
    console.warn(`[sbcSeoSuggestion] avoid-phrases lookup skipped: ${err.message}`);
    return [];
  }
}

// CITY PATH ONLY — sibling-page context for phrase-level divergence. Unlike
// getRecentPhrasesForAvoidance (shared with the country path and deliberately left
// untouched), this fetches the OTHER city pages under the same country + service
// slug — INCLUDING drafts and unpublished docs, so two pages generated in the same
// admin session still see each other — and returns:
//   phrases  — sentence openers from every prose section (not just hero/FAQ/titles),
//              merged ahead of the generic avoid-list
//   excerpts — a representative chunk of each sibling's full body copy, rendered
//              into the prompt as an explicit "do not reuse this phrasing" block
//   siblings — the raw docs, reused by the post-generation similarity gate
//   geoTerms — every city/country name involved, for geo-normalized comparison
async function getCitySiblingContext(input = {}) {
  const empty = { siblings: [], phrases: [], excerpts: [], geoTerms: [] };
  try {
    if (mongoose.connection.readyState !== 1) return empty;
    const brief = getBriefInput(input);
    const targetCity = brief.targetCity || input.targetCity || "";
    const targetCountry = brief.targetCountry || input.targetCountry || input.country || countryFromMarket(input.market) || "UK";
    const currentCitySlug = slugify(input.citySlug || targetCity);
    const serviceSlug = String(input.slug || "").trim() || stripLocationFromSlug(brief.primaryKeyword, targetCity, targetCountry);
    const query = { slug: serviceSlug };
    if (input.countryRef) {
      query.countryRef = input.countryRef;
    } else {
      const marketCountry = String(input.market || "").replace(/^\/+/, "").split("/")[0] || countrySlugFor(targetCountry);
      if (marketCountry) query.market = new RegExp(`^${marketCountry}(/|$)`);
    }
    const docs = await ServiceByCity.find(query).sort({ updatedAt: -1 }).limit(6).lean();
    const siblings = docs
      .filter((doc) => slugify(doc.citySlug || doc.city || "") !== currentCitySlug)
      .map((doc) => ({ city: doc.city || doc.citySlug || "another city", doc }));
    if (!siblings.length) return empty;

    const phrases = [];
    for (const sib of siblings) {
      for (const field of extractTextFields(sib.doc)) {
        for (const sentence of String(field).split(/(?<=[.!?])\s+/)) {
          const opener = sentence.trim().split(/\s+/).slice(0, 8).join(" ");
          if (opener && opener.split(/\s+/).length >= 5) phrases.push(opener);
        }
      }
    }
    const excerpts = siblings.slice(0, 2).map((sib) => ({
      city: sib.city,
      text: extractTextFields(sib.doc).join(" "),
    }));
    const geoTerms = [
      targetCity, targetCountry, "United Kingdom", "UK", "United States", "USA",
      ...siblings.map((sib) => sib.city),
    ];
    return { siblings, phrases: [...new Set(phrases)].slice(0, 40), excerpts, geoTerms };
  } catch (err) {
    console.warn(`[sbcSeoSuggestion] city sibling context skipped: ${err.message}`);
    return empty;
  }
}

// Orchestrates the 4 grouped calls IN PARALLEL and merges the results.
// Previously these ran sequentially with a 60-second delay between each call,
// to keep the combined input/output tokens of all groups from landing in the
// same 60-second window and blowing past a 4,000-output-tokens-per-minute org
// cap. That cap no longer applies at the account's current tier, so the
// groups now fire together — wall-clock time is roughly the slowest single
// group's latency instead of the sum of all 4 (plus the removed delays).
// Returns { merged, fallbackGroups, failures } where fallbackGroups lists the
// section labels that used static fallback and failures carries the errors.
// Does NOT apply fallback substitution decisions about ANTHROPIC_FALLBACK_ON_ERROR
// — the caller decides whether failures become a 502 or per-group fallback.
//
// `groups` scopes the run to a subset (phase-by-phase generation from the admin
// UI, e.g. ["group2"] to regenerate only the services + delivery sections).
// Omitted / empty = all four, which is the original whole-page behaviour.
async function runGroupedSbcGeneration(promptInput, { cityGuard = false, siblingContext = null, groups = null } = {}) {
  const recentPhrases = await getRecentPhrasesForAvoidance();
  // City path: sibling openers go FIRST so they survive the avoid-block's 20-item
  // cap; the deep sibling phrasing travels separately via siblingExcerpts. Country
  // path: siblingContext is null, so avoidPhrases === recentPhrases exactly as before.
  const avoidPhrases = siblingContext && siblingContext.phrases && siblingContext.phrases.length
    ? [...new Set([...siblingContext.phrases, ...recentPhrases])]
    : recentPhrases;
  const promptOptions = {
    avoidPhrases,
    cityGuard,
    siblingExcerpts: (siblingContext && siblingContext.excerpts) || [],
  };
  const prompts = buildGroupPrompts(promptInput, promptOptions);
  const temperature = Number(process.env.ANTHROPIC_TEMPERATURE || 0.8);
  const timeoutMs = Number(process.env.ANTHROPIC_FULL_TIMEOUT_MS || 90000);
  // Per-group max_tokens sized to each group's real (slimmed) output.
  // ANTHROPIC_GROUP_MAX_TOKENS still overrides all four if set.
  // Group 2 and Group 3 budgets are the sum of their former split-out
  // sub-groups (2+2b, 3+3b) now that they're generated in a single call again.
  const globalMax = Number(process.env.ANTHROPIC_GROUP_MAX_TOKENS || 0);
  const GROUP_MAX_TOKENS = {
    group1: globalMax || 2600, // hero body/alt + 8 short cards + 3 paras + 4 insights
    group2: globalMax || 5800, // 6 service cards (paras + points + tags) + 6 delivery stages
    group3: globalMax || 4000, // 60 industry points + 3 model bodies/perks + 4 whyChoose cards
    group4: globalMax || 2600, // 12 FAQ answers + final CTA + meta description
  };
  // Prompt caching needs a minimum prefix length to engage (model-dependent:
  // ~1,024 tokens on Sonnet-4.5-class, ~2,048 on Sonnet-4.6/Fable-class, ~4,096 on
  // Opus/Haiku-4.5-class; below it the block SILENTLY doesn't cache). The shared
  // preamble is ~11-14KB (~3k tokens) today — warn if it ever shrinks toward that
  // floor so the caching benefit isn't lost without anyone noticing.
  if (prompts.group1.static.length < 9000) {
    console.warn(`[sbcSeoSuggestion] static preamble is only ${prompts.group1.static.length} chars — may be below the model's minimum cacheable prefix; prompt caching may silently stop working`);
  }
  const allGroupDefs = [
    { groupLabel: "group1", staticPrefix: prompts.group1.static, dynamicSuffix: prompts.group1.dynamic, validator: validateGroup1 },
    { groupLabel: "group2", staticPrefix: prompts.group2.static, dynamicSuffix: prompts.group2.dynamic, validator: validateGroup2 },
    { groupLabel: "group3", staticPrefix: prompts.group3.static, dynamicSuffix: prompts.group3.dynamic, validator: validateGroup3 },
    { groupLabel: "group4", staticPrefix: prompts.group4.static, dynamicSuffix: prompts.group4.dynamic, validator: validateGroup4 },
  ];
  // Phase-by-phase: run only the requested groups. An unknown label is ignored
  // rather than silently producing an empty page — if the filter matches nothing
  // we fall back to all four.
  const wanted = Array.isArray(groups) ? groups.filter((g) => GROUP_RESULT_KEYS[g]) : [];
  const groupDefs = wanted.length ? allGroupDefs.filter((d) => wanted.includes(d.groupLabel)) : allGroupDefs;

  console.log(`[sbcSeoSuggestion] starting ${groupDefs.length} group(s) [${groupDefs.map((d) => d.groupLabel).join(", ")}] in parallel at ${new Date().toISOString()}`);
  const results = await Promise.all(
    groupDefs.map((def) => generateValidatedGroup({ ...def, maxTokens: GROUP_MAX_TOKENS[def.groupLabel], temperature, timeoutMs }))
  );

  const parsedByGroup = {};
  const fallbackGroups = [];
  const styleOnlySections = [];
  const failures = [];
  for (const result of results) {
    if (result.ok) {
      parsedByGroup[result.groupLabel] = result.parsed;
      if (result.styleOnly) {
        const label = GROUP_SECTION_LABELS[result.groupLabel] || result.groupLabel;
        styleOnlySections.push(label);
        console.warn(`[sbcSeoSuggestion] ${label}: accepted on attempt ${result.attempts} with ${result.errors.length} style deviation(s), no retry spent: ${result.errors.map(cleanErr).join("; ")}`);
      }
      continue;
    }
    // The call didn't pass validation on any attempt — but for multi-section
    // groups (2 and 3), the LAST attempt's content may still be fully valid for
    // one of its subsections even though the other failed. Score each
    // subsection independently against its own validator so a failing FAQ
    // (say) doesn't throw away a perfectly good set of service cards from the
    // same call.
    const subsections = GROUP_SUBSECTIONS[result.groupLabel] || [];
    const fallbackWhole = buildFallbackGroup(result.groupLabel, promptInput);
    let salvaged = {};
    const fellBackLabels = [];
    for (const sub of subsections) {
      const subErrors = result.parsed ? sub.validate(result.parsed) : ["No parsed output"];
      const structural = hardErrors(subErrors);
      if (result.parsed && structural.length === 0) {
        // Structurally complete — only word/character bands are off. Keep the
        // generated, location-specific copy. Substituting the static template
        // here is precisely what made every city page identical, because the
        // template's bodies carry no city interpolation.
        salvaged = { ...salvaged, ...sub.pick(result.parsed) };
        if (subErrors.length) {
          styleOnlySections.push(sub.label);
          console.warn(`[sbcSeoSuggestion] ${sub.label}: kept generated copy after ${result.attempts} attempt(s) with ${subErrors.length} style deviation(s): ${subErrors.map(cleanErr).join("; ")}`);
        }
      } else {
        salvaged = { ...salvaged, ...sub.pick(fallbackWhole) };
        fellBackLabels.push(sub.label);
        console.warn(`[sbcSeoSuggestion] ${sub.label} STRUCTURALLY failed (type=${result.lastErrorType || "validation"}) after ${result.attempts} attempt(s): ${structural.map(cleanErr).join("; ")}`);
      }
    }
    parsedByGroup[result.groupLabel] = salvaged;
    if (fellBackLabels.length) {
      const sections = fellBackLabels.join(" + ");
      failures.push({ groupLabel: result.groupLabel, sections, attempts: result.attempts, errors: hardErrors(result.errors).map(cleanErr), lastErrorType: result.lastErrorType });
      fallbackGroups.push(sections);
    }
  }

  return {
    merged: mergeGroupResults(parsedByGroup),
    // Which groups actually ran — the similarity gate and the response contract
    // must both scope to these, not to all four.
    generatedGroups: groupDefs.map((d) => d.groupLabel),
    fallbackGroups,
    // Sections whose generated copy was kept despite landing outside a word/char
    // band. Surfaced in the response so an editor can tighten them by hand — they
    // are real, page-specific copy, not the duplicated static template.
    styleOnlySections,
    failures,
    // Consumed only by the city similarity gate (to rebuild byte-identical cached
    // prompts for rewrite passes); country callers ignore these.
    promptOptions,
    generationConfig: { temperature, timeoutMs, groupMaxTokens: GROUP_MAX_TOKENS },
  };
}

// Top-level result keys owned by each group (mirrors mergeGroupResults).
const GROUP_RESULT_KEYS = {
  group1: ["hero", "chooseUs", "whyLocation"],
  group2: ["process", "whatWeDo"],
  group3: ["industries", "engagement", "whyChoose"],
  group4: ["faq", "finalCta", "meta"],
};

const GROUP_VALIDATORS = {
  group1: validateGroup1,
  group2: validateGroup2,
  group3: validateGroup3,
  group4: validateGroup4,
};

// CITY PATH ONLY — post-generation similarity gate. Measures each group's
// geo-normalized 8-gram overlap against every sibling city page; any group above
// the threshold is regenerated (same prompts, same word budgets, plus explicit
// shared-phrase feedback) up to `maxRewritePasses` times. A rewrite is adopted
// only if it validates AND reduces that group's overlap. Groups still above the
// threshold after the final pass are flagged for manual review — never silently
// published. The country path does not call this.
async function enforceCitySiblingDivergence({ merged, promptInput, promptOptions, siblings, geoTerms, temperature, timeoutMs, groupMaxTokens, generatedGroups = null }) {
  const threshold = Number(process.env.SBC_SIBLING_OVERLAP_MAX_PCT || 15);
  const maxRewritePasses = 2;
  // Phase-by-phase: only measure/rewrite the groups this run actually produced.
  // Scoring a group that wasn't generated would compare `undefined` slices against
  // the siblings and report meaningless overlap.
  const scopedGroups = Array.isArray(generatedGroups) && generatedGroups.length
    ? generatedGroups.filter((g) => GROUP_RESULT_KEYS[g])
    : Object.keys(GROUP_RESULT_KEYS);

  const worstOverlapFor = (slice) => {
    let worst = { pctOfA: 0, sharedSamples: [], city: "" };
    for (const sib of siblings) {
      const result = computeGeoNormalizedOverlap(slice, sib.doc, geoTerms);
      if (result.pctOfA > worst.pctOfA) worst = { ...result, city: sib.city };
    }
    return worst;
  };
  const sliceFor = (source, groupLabel) => {
    const slice = {};
    for (const key of GROUP_RESULT_KEYS[groupLabel]) slice[key] = source[key];
    return slice;
  };

  const current = { ...merged };
  const overlapReport = {};
  for (let pass = 0; pass <= maxRewritePasses; pass += 1) {
    const offending = [];
    for (const groupLabel of scopedGroups) {
      const worst = worstOverlapFor(sliceFor(current, groupLabel));
      overlapReport[groupLabel] = { pct: Number(worst.pctOfA.toFixed(1)), against: worst.city };
      if (worst.pctOfA > threshold) offending.push({ groupLabel, worst });
    }
    if (!offending.length || pass === maxRewritePasses) {
      return { merged: current, overlapReport, needsReview: offending.length > 0, threshold };
    }

    console.warn(`[sbcSeoSuggestion] sibling-overlap gate pass ${pass + 1}: rewriting ${offending.map((o) => `${o.groupLabel} (${o.worst.pctOfA.toFixed(1)}% vs ${o.worst.city})`).join(", ")}`);
    const prompts = buildGroupPrompts(promptInput, promptOptions);
    await Promise.all(offending.map(async ({ groupLabel, worst }) => {
      const rewriteNote = `

REWRITE PASS — SIBLING PHRASE OVERLAP DETECTED (this group only)
Your previous draft of these sections shared ${worst.pctOfA.toFixed(0)}% of its 8-word phrase sequences with Akoode's existing ${worst.city} city page (city names normalized). That is a hard failure. Regenerate the SAME sections with the SAME meaning, the SAME word counts, and the SAME structure, but completely different sentence construction. None of the following phrase sequences may reappear in any form (they are lowercased, with locations shown as "geo"):
${worst.sharedSamples.slice(0, 25).map((g) => `- ${g}`).join("\n")}`;
      const result = await generateValidatedGroup({
        groupLabel,
        staticPrefix: prompts[groupLabel].static,
        dynamicSuffix: prompts[groupLabel].dynamic + rewriteNote,
        validator: GROUP_VALIDATORS[groupLabel],
        maxTokens: groupMaxTokens[groupLabel],
        temperature,
        timeoutMs,
        maxAttempts: 1,
      });
      // A rewrite is usable when it is structurally complete; word bands are
      // advisory here as everywhere else. Requiring result.ok (zero errors of any
      // kind) would reject nearly every rewrite and leave the higher-overlap
      // draft in place, defeating the divergence gate.
      if (!result.parsed || hardErrors(result.errors).length) {
        console.warn(`[sbcSeoSuggestion] sibling-overlap rewrite for ${groupLabel} failed validation — keeping previous draft: ${(result.errors || []).map(cleanErr).join("; ")}`);
        return;
      }
      const rewritten = sliceFor(result.parsed, groupLabel);
      const newWorst = worstOverlapFor(rewritten);
      if (newWorst.pctOfA < worst.pctOfA) {
        for (const key of GROUP_RESULT_KEYS[groupLabel]) {
          if (result.parsed[key] !== undefined) current[key] = result.parsed[key];
        }
      } else {
        console.warn(`[sbcSeoSuggestion] sibling-overlap rewrite for ${groupLabel} did not improve (${newWorst.pctOfA.toFixed(1)}% vs ${worst.pctOfA.toFixed(1)}%) — keeping previous draft`);
      }
    }));
  }
  return { merged: current, overlapReport, needsReview: true, threshold };
}

function buildLocalSeoSuggestion(input = {}) {
  const brief = input.keywordBrief || {};
  const targetCity = brief.targetCity ?? input.targetCity ?? "";
  const targetCountry = brief.targetCountry || input.targetCountry || input.country || countryFromMarket(input.market) || "UK";
  const primaryKeyword = brief.primaryKeyword || input.primaryKeyword || "software development company uk";
  const cityCountry = targetCity ? targetCity : targetCountry;
  const countrySlug = countrySlugFor(targetCountry);
  const citySlug = String(targetCity).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const serviceSlug = stripLocationFromSlug(primaryKeyword, targetCity, targetCountry);
  const locationSlug = citySlug ? `${countrySlug}/${citySlug}` : countrySlug;
  const titleCaseKeyword = primaryKeyword.replace(/\b\w/g, (match) => match.toUpperCase());
  const keywordList = [...new Set([
    ...String(input.keywords || "").split(/[\n,]+/).map((item) => item.trim()).filter(Boolean),
    ...((brief.secondaryKeywords || input.secondaryKeywords || []).filter(Boolean)),
  ])];
  const keywordFocus = keywordList.length ? ` Keyword focus includes ${keywordList.slice(0, 4).join(", ")}.` : "";

  return {
    title: `${titleCaseKeyword} | Akoode Technologies`,
    slug: serviceSlug,
    country: targetCountry,
    market: locationSlug,
    hero: {
      heading: titleCaseKeyword,
      body: `Full-stack, AI-powered software development for ${targetCity} startups, scale-ups, and enterprises building scalable web platforms, SaaS products, mobile apps, cloud platforms, APIs, and AI systems engineered for performance, compliance, and long-term growth.`,
      heroImageAlt: `${targetCity} software development team building AI platforms`,
      stats: [
        { icon: "BriefcaseStatIcon", value: "180+", label: "Projects Delivered", sub: "Across global markets" },
        { icon: "RetentionStatIcon", value: "97%", label: "Client Retention", sub: "Long-term technology partnerships" },
        { icon: "AiStatIcon", value: "30+", label: "AI-Powered Solutions Built", sub: "Scalable AI systems for modern businesses" },
        { icon: "IndustryStatIcon", value: "15+", label: "Industries Served", sub: "From FinTech to HealthTech and SaaS" },
      ],
    },
    chooseUs: {
      heading: "Built with Precision. Validated by Results.",
      intro: `Akoode combines senior engineering direction, accountable delivery, and in-house execution for ${targetCity} teams that need software built carefully, tested properly, and ready for commercial pressure.`,
      features: [
        { icon: "FiClock", title: "On-time delivery", body: "Clear milestones, structured sprint planning, and active risk management keep projects moving without last-minute surprises. We flag blockers early, communicate scope shifts transparently, and protect launch dates so commercial teams and stakeholders stay confident in every release cycle." },
        { icon: "FiMessageSquare", title: "Clear communication", body: "You work with senior engineers who explain tradeoffs, technical decisions, scope changes, and sprint progress in plain business language. Architecture choices, API contracts, and delivery risks are discussed openly so product owners can make informed calls at every stage." },
        { icon: "FiShield", title: "Quality and reliability", body: "Architecture reviews, code reviews, automated testing, QA discipline, and deployment standards are built into every software delivery cycle. Performance, accessibility, and security are validated continuously, not bolted on at the end, so each release reaches production with auditable quality." },
        { icon: "FiUsers", title: "Long-term partnership", body: "We support product growth, platform stability, performance tuning, and technical evolution well beyond the first release. Continuous improvements, dependency upgrades, observability work, and roadmap iteration are part of how we keep your software healthy and competitive over years, not weeks." },
      ],
      clientLove: [
        { icon: "FiCheckCircle", title: "Project progress", body: "Weekly planning, visible priorities, accountable sprint outcomes, and clear delivery checkpoints keep every product release on track." },
        { icon: "FiCpu", title: "AI-powered solutions", body: "Practical AI features designed around product value, measurable workflows, secure data handling, and outcomes that matter to operating teams." },
        { icon: "FiSmile", title: "Happy clients", body: "Senior-led collaboration that keeps founders, product managers, and engineering leads confident throughout discovery, build, and release stages." },
        { icon: "FiShield", title: "Reliable delivery", body: "Architecture decisions, QA discipline, code reviews, and deployment standards make every release predictable, auditable, and ready for production scale." },
      ],
    },
    whyLocation: {
      heading: `Why ${targetCity} Businesses Need Strong Software Engineering Partners`,
      para1: `${targetCity} has a practical digital economy shaped by SaaS, professional services, healthcare, finance, education, and operations-heavy businesses. Teams need reliable software delivery that supports commercial growth, not short-term code that becomes expensive to maintain.`,
      para2: `Buyers in ${targetCountry} expect secure platforms, clear data handling, accessibility awareness, and scalable cloud foundations. Strong engineering partners help product teams make architecture decisions that support compliance, performance, integrations, and future AI use cases.`,
      para3: `For founders, CTOs, and operations leaders, the right development team reduces delivery risk. Akoode brings product thinking, engineering depth, and accountable execution so software initiatives move from idea to release with fewer gaps.`,
      features: [
        { icon: "FiTrendingUp", title: "Market scale", body: `${targetCity} teams need products that can serve local customers and scale to global users without rework.` },
        { icon: "FiClock", title: "Timezone overlap", body: `Practical collaboration windows support faster code reviews, decision making, and product sprints across distributed teams.` },
        { icon: "FiShield", title: "Regulatory experience", body: `Delivery considers GDPR, data residency, security, accessibility, audit trails, and sector-specific governance from the design phase.` },
        { icon: "FiLayers", title: "Sector depth", body: `Hands-on engineering experience across SaaS, finance, healthcare, logistics, retail, education, and operations-heavy digital businesses building modern platforms.` },
      ],
      imageAlt: `${targetCity} software development market and engineering planning`,
      cardLocation: targetCity,
      cardHeading: "Local context, global execution",
      cardBody: "Akoode blends local market relevance with distributed engineering practices built for modern product teams.",
    },
    process: {
      heading: `Custom Software Development Services in ${cityCountry}`,
      intro: `From AI software and SaaS platforms to mobile apps, APIs, and cloud systems, Akoode helps ${targetCity} teams design, build, and improve software with senior engineering discipline.${keywordFocus}`,
      services: [
        {
          n: "01",
          title: `AI Software Development in ${targetCity}`,
          subtitle: "AI Software Development",
          para: `We build AI-powered product features, automation workflows, and intelligent systems that connect with your existing software. The focus is practical business value, secure data handling, measurable outputs, and scalable architecture rather than experimental demos that never reach production.`,
          points: SERVICE_POINT_SETS.ai.slice(0, 5),
          tags: ["Gemini", "OpenAI", "Python", "LangChain", "Node.js", "Vector DB", "PostgreSQL"],
        },
        {
          n: "02",
          title: `SaaS Development in ${targetCity}`,
          subtitle: "SaaS Development",
          para: `Akoode designs and builds SaaS products with multi-tenant architecture, subscription logic, secure user management, dashboards, and scalable backend services. We help teams move from MVP to dependable platform without rebuilding core systems every release cycle.`,
          points: SERVICE_POINT_SETS.saas.slice(0, 5),
          tags: ["Next.js", "React", "Node.js", "MongoDB", "PostgreSQL", "Stripe", "AWS"],
        },
        {
          n: "03",
          title: `Mobile App Development in ${targetCity}`,
          subtitle: "Mobile App Development",
          para: `We create mobile applications for customer portals, internal operations, marketplace workflows, and product-led businesses. Our team focuses on clean user journeys, API reliability, secure authentication, performance, and long-term maintainability across iOS and Android.`,
          points: SERVICE_POINT_SETS.mobile.slice(0, 5),
          tags: ["React Native", "Flutter", "Firebase", "Node.js", "REST", "GraphQL", "AWS"],
        },
        {
          n: "04",
          title: `Web App Development in ${targetCity}`,
          subtitle: "Web App Development",
          para: `Akoode builds web applications for SaaS, enterprise workflows, customer portals, internal tools, and digital products. We combine front-end clarity with backend reliability so teams can launch fast, collect feedback, and scale without sacrificing quality.`,
          points: SERVICE_POINT_SETS.web.slice(0, 5),
          tags: ["Next.js", "React", "TypeScript", "Tailwind", "Node.js", "MongoDB", "Vercel"],
        },
        {
          n: "05",
          title: `Cloud Engineering in ${targetCity}`,
          subtitle: "Cloud and DevOps",
          para: `We help businesses design cloud foundations, CI/CD pipelines, infrastructure automation, observability, and secure deployment workflows. The goal is simple: make software easier to release, monitor, recover, and scale as usage grows.`,
          points: SERVICE_POINT_SETS.cloud.slice(0, 5),
          tags: ["AWS", "Docker", "Kubernetes", "GitHub Actions", "Terraform", "Vercel", "Cloudflare"],
        },
      ],
    },
    whatWeDo: {
      heading: `How Akoode Delivers Software Development Projects in ${cityCountry}`,
      subtitle: `Akoode runs six structured delivery stages with full transparency, technical accountability, and clear ownership from the first conversation through production launch and post-release support.`,
      steps: [
        {
          shortTitle: "Discovery",
          title: "Discovery and Strategy",
          body: `We clarify business goals, user journeys, technical constraints, compliance needs, success metrics, and delivery risks before any code is written. The team interviews stakeholders, audits existing systems, and surfaces hidden assumptions that often derail later phases. This stage creates a shared project direction so engineering decisions stay aligned with commercial outcomes throughout the entire build cycle.`,
          timeline: "1 to 2 weeks",
          timelineNote: `Discovery timelines stay short, focused, and visible to your team so ${cityCountry} stakeholders see priorities and risks before any code begins.`,
          deliverables: [
            "Documented product goals and success metrics",
            "Technical discovery notes and architecture observations",
            "Risk register with dependencies and mitigation paths",
            "Delivery roadmap with priorities and resourcing plan",
          ],
        },
        {
          shortTitle: "Architecture",
          title: "Architecture and Technical Design",
          body: `Senior engineers define the system architecture, data models, integrations, API contracts, cloud foundation, and quality gates that will support the product after launch. Decisions are documented so product, security, and business stakeholders can review tradeoffs before implementation begins. Strong architecture work prevents expensive rewrites and keeps the build aligned with scalability, compliance, and long-term operational responsibilities.`,
          timeline: "1 to 2 weeks",
          timelineNote: `Architecture milestones, decision records, and review sessions keep ${cityCountry} teams informed about key technical decisions and the engineering tradeoffs behind them throughout planning.`,
          deliverables: [
            "System architecture overview and component map",
            "API contracts and data model documentation",
            "Security considerations and threat model summary",
            "Refined backlog with sequenced sprint plan",
          ],
        },
        {
          shortTitle: "UX Design",
          title: "UX Design and Prototyping",
          body: `Product designers translate discovery insights into wireframes, user flows, and interactive prototypes that validate ideas with real users before engineering investment. The team explores edge cases, accessibility requirements, and journey friction points that often cause launch delays. Prototyping early surfaces usability risks while changes remain cheap, then gives engineering reference screens that guide implementation accurately and reduce back-and-forth.`,
          timeline: "2 to 3 weeks",
          timelineNote: `Design reviews run on a fixed cadence with shared Figma access so ${cityCountry} product teams approve flows and visual decisions without delay.`,
          deliverables: [
            "Wireframes covering all core user journeys",
            "Interactive prototype linked from Figma workspace",
            "Accessibility notes and component state documentation",
            "Approved design system tokens and visual styles",
          ],
        },
        {
          shortTitle: "Development",
          title: "Agile Development and Engineering",
          body: `Development runs in two-week sprints with working software demoed at the end of every cycle. Engineers write production-grade code following peer review, automated linting, type-safe interfaces, and continuous integration pipelines that catch regressions early. Product owners see real progress instead of status updates, while engineering decisions stay visible through pull requests, demo recordings, and sprint planning notes.`,
          timeline: "4 to 12 weeks",
          timelineNote: `Sprint demos, weekly check-ins, and shared Jira boards keep ${cityCountry} stakeholders close to progress, blockers, and the next set of priorities throughout build.`,
          deliverables: [
            "Working feature increments demoed every sprint",
            "Code review feedback and merge history",
            "Sprint demo recordings with release notes",
            "Production-ready code on the main branch",
          ],
        },
        {
          shortTitle: "QA & Security",
          title: "QA, Testing, and Security Review",
          body: `Quality engineers test workflows, edge cases, API behavior, responsive layouts, error states, data handling, performance under load, and security exposure before any release reaches production. Test coverage is documented so internal teams understand exactly what was validated and where manual checks are still required. Security reviews catch authentication, authorization, and data leakage risks while remediation costs remain manageable.`,
          timeline: "Ongoing",
          timelineNote: `QA runs in parallel with development so ${cityCountry} teams receive defect reports, regression results, and release-readiness summaries before launch pressure rises every cycle.`,
          deliverables: [
            "Test coverage report with prioritized risk areas",
            "Bug tracker with severity and reproduction steps",
            "Regression results across browsers and devices",
            "Security review notes and fix recommendations",
          ],
        },
        {
          shortTitle: "Launch",
          title: "Deployment, Launch, and Post-Launch Support",
          body: `Akoode handles production deployment, environment setup, monitoring configuration, error tracking, runbook documentation, and the structured handover that lets your operations team confidently own the system. Post-launch support covers bug triage, performance tuning, incident response, and follow-on enhancements so the product continues improving after release. Knowledge transfer is built in, not treated as an afterthought when teams change later.`,
          timeline: "1 to 2 weeks",
          timelineNote: `Launch coordination, monitoring dashboards, and a defined incident channel keep ${cityCountry} operations leads aware of system health from the moment production traffic begins.`,
          deliverables: [
            "Production deployment plan with rollback procedure",
            "Monitoring dashboards and on-call runbook documents",
            "Access handover with documented credentials and roles",
            "Launch checklist signed off by stakeholders",
          ],
        },
      ],
    },
    techStack: {
      heading: `Technologies Used by Our ${cityCountry} Software Development Team`,
      subtitle: "We select technology around product goals, scalability, security, maintainability, and the engineering skills your team needs after launch.",
      cats: [
        { title: "Mobile Development", icon: "FiSmartphone", desc: "Cross-platform mobile foundations.", pills: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "Expo"].map((label) => ({ e: label, label })) },
        { title: "Frontend Development", icon: "FiLayout", desc: "Fast, accessible product interfaces.", pills: ["React", "Next.js", "TypeScript", "Tailwind", "Redux", "SWR"].map((label) => ({ e: label, label })) },
        { title: "Backend and APIs", icon: "FiServer", desc: "Secure backend services and integrations.", pills: ["Node.js", "Express", "NestJS", "REST", "GraphQL", "JWT"].map((label) => ({ e: label, label })) },
        { title: "AI and Machine Learning", icon: "FiCpu", desc: "Production-ready AI workflows.", pills: ["Gemini", "OpenAI", "Python", "LangChain", "TensorFlow", "Vector DB"].map((label) => ({ e: label, label })) },
        { title: "Cloud and DevOps", icon: "FiCloud", desc: "Reliable deployment infrastructure.", pills: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Vercel"].map((label) => ({ e: label, label })) },
        { title: "Database", icon: "FiDatabase", desc: "Data models built for product growth.", pills: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "DynamoDB", "Elastic"].map((label) => ({ e: label, label })) },
      ],
    },
    industries: {
      heading: `Software Built for ${cityCountry}'s Most Demanding Sectors`,
      subtitle: `Akoode supports software delivery across regulated, operational, and growth-focused sectors where reliability, data quality, and user experience matter.`,
      items: [
        "Healthcare", "Retail and E-Commerce", "Media and Entertainment", "Finance and Banking", "Automotive", "Agriculture", "Telecommunication", "Manufacturing", "Public Sector and Government", "Real Estate", "Energy and Utilities", "Travel and Hospitality", "Education", "Insurance", "Logistics and Supply Chain",
      ].map((name) => ({
        icon: "FiCheckCircle",
        name,
        points: FALLBACK_INDUSTRY_POINTS[name] || [
          "Secure user, role, and data handling across workflows",
          "Scalable dashboards and reporting for operations teams",
          "Integration-ready architecture for existing business systems",
          "Compliance-aware design with audit trails and access control",
        ],
      })),
    },
    whyChoose: {
      heading: "Senior Engineers Building Practical Business Software",
      subtitle: `Akoode gives ${targetCity} teams direct engineering ownership, clear communication, and architecture decisions designed for long-term product value.`,
      cards: [
        { icon: "FiUsers", title: "No subcontracting", desc: "Your project is handled by Akoode's in-house team, so engineering context, quality expectations, and delivery accountability remain clear from start to finish." },
        { icon: "FiCpu", title: "AI-first engineering", desc: "We design AI features around real product workflows, secure data access, measurable outcomes, and the operational controls needed for production use." },
        { icon: "FiAward", title: "Senior-led delivery", desc: "Experienced engineers guide architecture, sprint planning, code review, technical tradeoffs, and release readiness instead of leaving key decisions unmanaged." },
        { icon: "FiShield", title: "Compliance-first architecture", desc: "We consider security, privacy, auditability, access controls, and data governance early so compliance needs are not retrofitted later." },
      ],
      ctaHeading: "Plan a software project with senior engineers.",
      ctaBody: "Share your product goals and we will help shape a practical build path.",
      ctaText: "Talk to Akoode",
      ctaLink: "/post-requirement",
    },
    engagement: {
      heading: `Flexible Engagement Models for ${cityCountry} Software Development Projects`,
      subtitle: "Choose a delivery model that fits your scope, budget clarity, team capacity, and product stage without locking into the wrong operating rhythm.",
      models: [
        { badge: "Most Popular", title: "Dedicated Team", best: "Best for projects requiring continuous development and long-term product evolution", body: "A focused Akoode team works with your roadmap, sprint rhythm, and release priorities over a longer period. We provide product engineers, QA, and delivery leadership who plug into your existing tools, ceremonies, and product strategy so feature velocity stays high without losing engineering discipline.", perks: ["Flexible backlog", "Long-term velocity", "Direct collaboration", "Full IP ownership"], ctaText: "Post Your Requirement", ctaLink: "/post-requirement" },
        { badge: "Defined scope", title: "Fixed Cost", best: "Best for projects with well-defined scope and clear deliverables", body: "A structured engagement model for projects with agreed requirements, defined milestones, and acceptance criteria. Akoode plans the delivery roadmap up front, then runs sprints with budget visibility, scheduled reviews, and stage gates so product owners stay in control from kickoff to launch.", perks: ["Clear budget", "Defined timeline", "Milestone delivery"], ctaText: "Get a Quote", ctaLink: "/post-requirement" },
        { badge: "Capacity support", title: "Staff Augmentation", best: "Best for filling skill gaps or accelerating development velocity", body: "Add senior engineering capacity for specific skills, features, integrations, or delivery pressure. Akoode engineers join your existing team, follow your code standards, contribute through your sprint workflow, and ramp quickly without rewriting how your in-house team already plans and ships product work.", perks: ["Fast onboarding", "Skill coverage", "Team extension"], ctaText: "Hire Team", ctaLink: "/post-requirement" },
      ],
    },
    faq: {
      heading: "Frequently Asked Questions",
      subtitle: `Straight answers on process, pricing, timelines, compliance, and what working with Akoode actually looks like for ${cityCountry} businesses.`,
      items: [
        { question: `How much does software development cost in ${cityCountry}?`, answer: `Cost depends on product complexity, integrations, compliance needs, design depth, and the number of platforms involved. A small MVP may need a focused build plan, while SaaS or AI-powered systems require deeper architecture, QA, and deployment work. Akoode usually starts with discovery so the estimate reflects real scope rather than a generic rate card.` },
        { question: `Can Akoode build AI features for an existing ${targetCountry} software product?`, answer: `Yes. We can assess your current architecture, data sources, workflows, and user journeys before recommending AI features. That may include assistants, search, summarisation, automation, analytics, or decision-support tools. We also define guardrails, evaluation methods, and production monitoring so AI improves the product without creating operational risk.` },
        { question: "Do you sign NDAs before technical discussions?", answer: "Yes. Akoode can sign an NDA before detailed technical or commercial discussions begin. That helps founders, CTOs, and enterprise buyers share product ideas, architecture concerns, integration details, or confidential operational workflows with more confidence during discovery." },
        { question: "Can you take over an existing software project?", answer: "Yes. We start with a technical audit covering code quality, architecture, deployment setup, security issues, documentation, dependencies, and active bugs. From there, we create a stabilisation plan before adding new features, because inheriting a project safely requires understanding the current risks first." },
        { question: `Do you build mobile apps and SaaS platforms for ${cityCountry} businesses?`, answer: `Yes. Akoode builds mobile apps, SaaS products, web platforms, APIs, cloud systems, and AI-powered software for businesses serving local and global users. The delivery approach depends on product stage, regulatory needs, user volume, monetisation model, and the internal team that will manage the platform after launch.` },
        { question: `How long does a software project take in ${cityCountry}?`, answer: `Timelines depend on the scope, design maturity, integrations, compliance checks, and release plan. A focused MVP may move faster than a multi-system enterprise build. Akoode defines delivery stages during discovery, then uses sprint reviews and milestone tracking so your team can see progress before launch pressure builds.` },
        { question: "Do you work with startups or only enterprise teams?", answer: `Akoode works with startups, scale-ups, and enterprise buyers. Early teams often need MVP planning, product strategy, and fast validation. Larger organisations usually need architecture, data controls, integrations, governance, and long-term maintainability. The delivery model changes around your team size, risk profile, and internal decision process.` },
        { question: `How do you handle ${targetCountry} compliance and data regulations?`, answer: `For ${targetCountry} projects, we consider ${complianceFrameworksFor(targetCountry)}, data access, audit trails, security controls, accessibility, and sector-specific expectations early in the design phase. Regulated workflows need clear architecture decisions, not late-stage fixes. Compliance notes, permissions, and data handling choices are documented alongside technical deliverables.` },
        { question: `Do your developers work during ${targetCity || targetCountry} business hours?`, answer: `Yes. Delivery is planned around practical overlap between ${targetCity || targetCountry} teams and Akoode's engineering team. We use Slack, Jira, GitHub, sprint reports, and scheduled reviews so product questions, blockers, code reviews, and release decisions do not wait for long handoff cycles.` },
        { question: "What is the difference between dedicated team and staff augmentation?", answer: "A dedicated team gives you a focused Akoode unit responsible for product delivery, sprint planning, architecture, and velocity over time. Staff augmentation adds specific engineers into your existing workflow when you need extra capacity or specialist skills. Both models provide direct access to the people building the product." },
        { question: `Which industries does Akoode support in ${cityCountry}?`, answer: `Akoode supports software delivery across healthcare, finance, SaaS, retail, education, logistics, real estate, public sector, manufacturing, and service-led companies. The technical focus changes by industry. Some teams need secure data handling and compliance records, while others need marketplace flows, operational dashboards, mobile apps, or AI-supported workflows.` },
        // 12th slot — the validator requires exactly 12 FAQ items. This previously
        // held an internal engineering note ("Will FAQ schema be implemented for
        // this page?"), which shipped to visitors on every page that used the
        // static FAQ. Implementation notes belong in `implementationNotes`, which
        // is not rendered; never pad this array with them.
        { question: `What happens after the software is launched in ${cityCountry}?`, answer: `Launch is a checkpoint, not the end of the engagement. We handle deployment, monitoring, and handover documentation, then stay available for bug triage, performance tuning, and the next round of features. Your team gets the access, runbooks, and context needed to operate the platform independently, whether or not you continue with us.` },
      ],
    },
    caseStudies: {
      heading: "Outcomes You Can Take to Your Board Meeting",
      subtitle: "Real delivery examples should show measurable product progress, commercial outcomes, and technical decisions leaders can report internally.",
    },
    blog: {
      heading: "Reading from the Studio",
      subtitle: "Notes, engineering decisions, and field lessons from the products we build every week.",
    },
    finalCta: {
      heading: "Start Your Software Project with Akoode",
      body: `Speak with Akoode about your ${targetCity} software project, AI product idea, SaaS platform, or mobile app. We will review your goals and suggest a practical next step.`,
      replyTime: "Response within 30 min",
      nda: "NDA signed on request",
    },
    meta: {
      title: `${titleCaseKeyword} | Akoode`,
      description: `Hire Akoode for AI, SaaS, web and mobile software development in ${targetCity}. Senior engineers, clear delivery and scalable systems.`,
    },
  };
}

// Sections that are FIXED in the frontend — admin overrides + AI output are ignored at render time.
// Tell the AI to skip them so it focuses tokens on the editable sections.
const STATIC_SECTIONS_GUARD = `\n\nSTATIC SECTIONS — DO NOT GENERATE (controlled by the frontend, not by this prompt)\nThe following sections, fields, and values are HARD-CODED in the frontend renderer and any output you produce for them will be discarded. Skip them entirely to focus on the editable sections:\n- hero.cta1, hero.cta1Link, hero.cta2, hero.cta2Link — static buttons.\n- hero.stats (the 4-item stats bar: Projects Delivered / Client Retention / AI-Powered Solutions Built / Industries Served) — fixed values.\n- hero.projectProgress (Project Progress card title/body/value) — admin-only, not AI.\n- techStack (heading, subtitle, cats, pills, logos) — the entire Tech Stack section is static.\n- chooseUs.platformRatings (Google / Clutch / GoodFirms with their ratings + logos) — static.\n- engagement.models — names and order are LOCKED to: Dedicated Team (Most Popular), Fixed Cost, Staff Augmentation. You may still write the BODY for each model, but never rename, reorder, or add models.\n- industries.items — names are LOCKED to the prompt's industry list and rendered with fixed images. You may still write the 4 \`points\` per industry, but never rename or reorder.\n- whatWeDo.steps[].title and whatWeDo.steps[].shortTitle — LOCKED to: Discovery and Strategy, Architecture and Technical Design, UX Design and Prototyping, Agile Development and Engineering, QA Testing and Security Review, Deployment Launch and Post-Launch Support. You may still write the body / timeline / timelineNote / deliverables per stage.\n- whyChoose.ctaHeading, whyChoose.ctaBody, whyChoose.ctaText, whyChoose.ctaLink (founder CTA card) — fully static, ignored.\n- finalCta.replyTime and finalCta.nda (Reply Time / NDA labels) — fixed, ignored.\n\nFor these static sections, return either omitted keys or empty strings — do not waste tokens writing copy that will be discarded. Focus your effort on hero (heading/body/imageAlt), chooseUs (heading/intro/features/clientLove), whyLocation, process, whatWeDo (body/timeline/timelineNote/deliverables per stage), industries (points per industry), engagement (body per model), faq, whyChoose (heading/subtitle/cards), finalCta (heading/body), and meta.`;

function applyCityUrlPreservation(suggestion, input = {}) {
  if (!suggestion) return suggestion;
  const market = String(input.market || "").replace(/^\/+|\/+$/g, "");
  const citySlug = String(input.citySlug || "").trim();
  const originalSlug = String(input.slug || "").trim();
  if (originalSlug) suggestion.slug = originalSlug;
  if (market) {
    const trimmedMarket = market.replace(/\/+$/, "");
    if (!citySlug || trimmedMarket.endsWith(`/${citySlug}`) || trimmedMarket === citySlug) {
      suggestion.market = trimmedMarket;
    } else {
      suggestion.market = `${trimmedMarket}/${citySlug}`;
    }
  } else if (citySlug && suggestion.market && !suggestion.market.endsWith(`/${citySlug}`)) {
    suggestion.market = `${suggestion.market.replace(/\/+$/, "")}/${citySlug}`;
  }
  suggestion.city = input.city || suggestion.city || "";
  suggestion.citySlug = citySlug || suggestion.citySlug || "";
  if (input.countryRef) suggestion.countryRef = input.countryRef;
  const finalSlug = suggestion.slug || "software-development-company";
  const finalMarket = suggestion.market || market || "uk";
  suggestion.implementationNotes = [
    `Canonical URL: https://www.akoode.com/${finalMarket}/${finalSlug}`,
    `Full slug path: ${finalMarket}/${finalSlug}`,
    "Add FAQ schema markup for the generated FAQ items on this page.",
    "City-level page: localize stats, examples, neighborhood references, and FAQ to the city while keeping the master prompt structure.",
  ];
  return suggestion;
}

function buildCityInput(body = {}) {
  const market = String(body.market || "").replace(/^\/+|\/+$/g, "");
  const marketParts = market.split("/").filter(Boolean);
  const inferredCountryCode = marketParts[0] || "";
  const inferredCity = body.city || (marketParts[1] ? titleCase(marketParts[1].replace(/-/g, " ")) : "");
  const country = body.country || (inferredCountryCode ? (inferredCountryCode.toLowerCase() === "uk" ? "UK" : titleCase(inferredCountryCode)) : "UK");
  const targetCity = body.targetCity || inferredCity;

  // Rewrite incoming title/primaryKeyword so the AI is not biased by country-named context.
  // The user often types titles like "Akoode Technologies: Software Development Company UK"
  // even on a city page; we replace the country with the city for prompt purposes only
  // (the form value the user typed is preserved separately by URL preservation logic).
  // Strip trailing "company" from serviceType so we don't end up with "...Company Company City".
  const rawServiceType = (body.serviceType || "Software Development").trim();
  const serviceTypeNoCompany = rawServiceType.replace(/\s+company$/i, "").trim() || "Software Development";
  const cityTitle = targetCity ? `${titleCase(serviceTypeNoCompany)} Company ${titleCase(targetCity)}` : (body.title || "");
  const cityPrimaryKeyword = targetCity ? `${serviceTypeNoCompany.toLowerCase()} company ${String(targetCity).toLowerCase()}` : (body.primaryKeyword || "");

  return {
    ...body,
    title: cityTitle || body.title,
    country,
    targetCity,
    targetCountry: body.targetCountry || country,
    primaryKeyword: cityPrimaryKeyword || body.primaryKeyword || "",
    pageType: "city page",
    keywordBrief: {
      ...(body.keywordBrief || {}),
      targetCity,
      targetCountry: body.targetCountry || country,
      city: targetCity,
      primaryKeyword: cityPrimaryKeyword || body.keywordBrief?.primaryKeyword || "",
    },
  };
}

// GROUP-RETRY FLOW (see runGroupedSbcGeneration): the page is generated as 4
// independent Anthropic calls run in parallel — (1) hero/chooseUs/whyLocation,
// (2) services/process stages, (3) industries/engagement/whyChoose, (4) faq/
// finalCta/meta. Each group is validated against its own word-count/array-count
// rules and retried alone up to ANTHROPIC_MAX_ATTEMPTS. Only a group that
// exhausts its retries falls back to its slice of the static template (or the
// whole request 502s when ANTHROPIC_FALLBACK_ON_ERROR=false) — a bad FAQ no
// longer wipes out successfully generated hero/services/industries copy. The
// merged result goes through the same normalizeSbcSeoSuggestion assembly and the
// response contract ({ status, message, source, data }) is unchanged: the admin
// UI still makes ONE request and receives ONE fully assembled page.
const generateServiceByCitySeoSuggestion = asyncHandler(async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const body = req.body || {};
  const cityInput = buildCityInput(body);

  if (process.env.LOCAL_AI_SUGGESTION_MOCK === "true" || apiKey === "local-mock") {
    const suggestion = applyCityUrlPreservation(
      normalizeSbcSeoSuggestion(buildLocalSeoSuggestion(cityInput), cityInput),
      body
    );
    return res.json({
      status: "success",
      message: "City SEO suggestions generated in local test mode",
      data: suggestion,
    });
  }

  if (!apiKey) {
    return res.status(500).json({ status: "error", message: "ANTHROPIC_API_KEY is not configured" });
  }

  const siblingContext = await getCitySiblingContext(cityInput);
  const { merged, generatedGroups, fallbackGroups, styleOnlySections, failures, promptOptions, generationConfig } =
    await runGroupedSbcGeneration(cityInput, { cityGuard: true, siblingContext, groups: body.groups });

  if (failures.length && process.env.ANTHROPIC_FALLBACK_ON_ERROR === "false") {
    const detail = failures
      .map((f) => `${f.sections} failed validation after ${f.attempts} attempt(s): ${f.errors.join("; ")}`)
      .join(" | ");
    return res.status(502).json({ status: "error", message: `AI generation failed: ${detail}` });
  }

  // Similarity gate: only meaningful when sibling city pages exist to diverge from.
  let gate = { merged, overlapReport: null, needsReview: false, threshold: 0 };
  if (siblingContext.siblings.length) {
    gate = await enforceCitySiblingDivergence({
      merged,
      promptInput: cityInput,
      promptOptions,
      siblings: siblingContext.siblings,
      geoTerms: siblingContext.geoTerms,
      generatedGroups,
      ...generationConfig,
    });
  }

  let suggestion = normalizeSbcSeoSuggestion(gate.merged, cityInput);
  // "fallback" means every group that RAN fell back — not every group that exists,
  // which would never be true in a single-phase run.
  const allFellBack = fallbackGroups.length > 0 && fallbackGroups.length === generatedGroups.length;
  const source = allFellBack
    ? "fallback"
    : fallbackGroups.length
      ? `anthropic (${fallbackGroups.join(", ")} fallback used)`
      : "anthropic";
  let message = fallbackGroups.length
    ? `City SEO suggestions generated; static fallback used for: ${fallbackGroups.join(", ")}`
    : "City SEO suggestions generated";
  if (styleOnlySections.length) {
    message += `; generated copy kept (length outside target band, review recommended) for: ${[...new Set(styleOnlySections)].join(", ")}`;
  }
  if (gate.overlapReport) {
    const worstPct = Math.max(...Object.values(gate.overlapReport).map((r) => r.pct));
    message += `; sibling phrase overlap max ${worstPct}% per section (threshold ${gate.threshold}%)`;
    if (gate.needsReview) {
      message = `NEEDS REVIEW — sibling-page phrase overlap still above ${gate.threshold}% after rewrite passes. ${message}. Regenerate or hand-edit the flagged sections before publishing.`;
    }
  }

  suggestion = applyCityUrlPreservation(suggestion, body);

  res.json({
    status: "success",
    message,
    source,
    // Tells the admin UI which sections this response is authoritative for, so a
    // single-phase run only overwrites its own sections.
    generatedGroups,
    needsReview: gate.needsReview,
    overlapReport: gate.overlapReport,
    data: suggestion,
  });
});

const generateServiceByCityFieldSuggestion = asyncHandler(async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ status: "error", message: "ANTHROPIC_API_KEY is not configured" });
  }

  const body = req.body || {};
  const {
    fieldLabel = "Field",
    sectionLabel = "Service By City",
    currentValue = "",
    title = "",
    slug = "",
    country = "",
    market = "",
    city = "",
    citySlug = "",
    existingContentContext = {},
  } = body;
  const cityInput = buildCityInput(body);
  const brief = getBriefInput(cityInput);
  const location = brief.targetCity || city || brief.targetCountry || country || market || "the target city";
  const serviceType = brief.serviceType || "software development";
  const isLongField = /paragraph|body|description|answer|subtitle|intro|subtext|meta description/i.test(`${fieldLabel} ${sectionLabel}`);
  const isBulletField = /bullet|pointer|point|perk|deliverable/i.test(`${fieldLabel} ${sectionLabel}`);
  const isHeadingField = /heading|title|h1|label/i.test(`${fieldLabel} ${sectionLabel}`);

  const prompt = `You are upgrading one individual field inside an Akoode Technologies service-by-city SEO landing page.
Return ONLY valid JSON in this exact shape: {"value":"..."}.

Context:
- Field label: ${fieldLabel}
- Section: ${sectionLabel}
- Current value: ${currentValue}
- Page title: ${title}
- Slug: ${slug}
- Country: ${country}
- Market: ${market}
- City: ${city}
- City slug: ${citySlug}
- Target city: ${brief.targetCity || city}
- Target country: ${brief.targetCountry || country}
- Primary keyword: ${brief.primaryKeyword}
- Service type: ${serviceType}
- Existing page context: ${JSON.stringify(existingContentContext).slice(0, 6000)}

Rules:
- This is a CITY-LEVEL landing page. The primary geographical target is the CITY: ${brief.targetCity || city || location}. The country (${brief.targetCountry || country}) is background only.
- In headings, titles, meta, hero copy, and section H2s use the CITY name — NOT the country name. Never produce "...Company ${brief.targetCountry || country}" when the target city is set.
- The country may only be mentioned in WhyLocation paragraph 3 (parent-page link context) or for required regulatory references. Otherwise stick to the city.
- Do NOT change the city name, city slug, market segment, or service slug in this value.
- Keep the value suitable for this exact field only.
- No em dashes.
- Do not use: In today's digital world, Whether you are, At Akoode we understand, revolutionary, cutting-edge, game-changing, transformative, leverage, utilize, robust, seamless, unlock, delve.
- No property or real estate wording unless the field explicitly asks for real estate.
- For UK pages, use UK GDPR, NHS DSPT, FCA-style governance, accessibility, auditability, security, procurement, or data residency where relevant. Do not mention HIPAA.
- ${isHeadingField ? "If this is a heading/title, keep it concise, professional, and SEO-aware with city relevance." : ""}
- ${isBulletField ? "If this is a bullet/pointer/perk, write one specific capability or outcome in 8 to 14 words." : ""}
- ${isLongField ? "If this is paragraph/body/description/answer text, write 55 to 90 words with practical business and engineering detail." : ""}
- If this is a service card paragraph, make it 75 to 90 words and useful enough to fill 4 to 5 visual lines.
- If this is meta title, keep it 50 to 55 characters maximum.
- If this is meta description, keep it 150 to 155 characters maximum.
- Keep the tone senior, product-led, commercial, and technically credible.`;

  try {
    const parsed = await requestAnthropicJson({
      prompt,
      maxTokens: Number(process.env.ANTHROPIC_FIELD_MAX_TOKENS || 1200),
      temperature: Number(process.env.ANTHROPIC_FIELD_TEMPERATURE || 0.65),
      timeoutMs: 45000,
    });
    const value = normalizeGeneratedFieldValue(parsed.value || "", {
      fieldLabel,
      sectionLabel,
      location,
      serviceType,
      primaryKeyword: brief.primaryKeyword,
    });
    return res.json({ status: "success", message: "Field regenerated", data: { value } });
  } catch (error) {
    return res.status(502).json({ status: "error", message: error.message || "Anthropic returned invalid field JSON" });
  }
});

// GROUP-RETRY FLOW: same 4-group parallel generation as the city handler above —
// each group validated and retried independently, per-group static fallback only
// for a group that exhausts its retries (or a 502 when
// ANTHROPIC_FALLBACK_ON_ERROR=false). Response contract unchanged.
const generateServiceByCountrySeoSuggestion = asyncHandler(async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (process.env.LOCAL_AI_SUGGESTION_MOCK === "true" || apiKey === "local-mock") {
    return res.json({
      status: "success",
      message: "SEO suggestions generated in local test mode",
      data: normalizeSbcSeoSuggestion(buildLocalSeoSuggestion(req.body || {}), req.body || {}),
    });
  }

  if (!apiKey) {
    return res.status(500).json({ status: "error", message: "ANTHROPIC_API_KEY is not configured" });
  }

  const input = req.body || {};
  const { merged, generatedGroups, fallbackGroups, styleOnlySections, failures } =
    await runGroupedSbcGeneration(input, { cityGuard: false, groups: input.groups });

  if (failures.length && process.env.ANTHROPIC_FALLBACK_ON_ERROR === "false") {
    const detail = failures
      .map((f) => `${f.sections} failed validation after ${f.attempts} attempt(s): ${f.errors.join("; ")}`)
      .join(" | ");
    return res.status(502).json({ status: "error", message: `AI generation failed: ${detail}` });
  }

  const allFellBack = fallbackGroups.length > 0 && fallbackGroups.length === generatedGroups.length;
  const source = allFellBack
    ? "fallback"
    : fallbackGroups.length
      ? `anthropic (${fallbackGroups.join(", ")} fallback used)`
      : "anthropic";
  let message = fallbackGroups.length
    ? `SEO suggestions generated; static fallback used for: ${fallbackGroups.join(", ")}`
    : "SEO suggestions generated";
  if (styleOnlySections.length) {
    message += `; generated copy kept (length outside target band, review recommended) for: ${[...new Set(styleOnlySections)].join(", ")}`;
  }

  res.json({
    status: "success",
    message,
    source,
    generatedGroups,
    data: normalizeSbcSeoSuggestion(merged, input),
  });
});

const generateServiceByCountryFieldSuggestion = asyncHandler(async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ status: "error", message: "ANTHROPIC_API_KEY is not configured" });
  }

  const {
    fieldLabel = "Field",
    sectionLabel = "Service By Country",
    currentValue = "",
    title = "",
    slug = "",
    country = "",
    market = "",
    keywordBrief = {},
    existingContentContext = {},
  } = req.body || {};
  const brief = getBriefInput(req.body || {});
  const location = brief.targetCity || brief.targetCountry || country || market || "the target market";
  const serviceType = brief.serviceType || "software development";
  const isLongField = /paragraph|body|description|answer|subtitle|intro|subtext|meta description/i.test(`${fieldLabel} ${sectionLabel}`);
  const isBulletField = /bullet|pointer|point|perk|deliverable/i.test(`${fieldLabel} ${sectionLabel}`);
  const isHeadingField = /heading|title|h1|label/i.test(`${fieldLabel} ${sectionLabel}`);

  const prompt = `You are upgrading one individual field inside an Akoode Technologies service-by-country SEO landing page.
Return ONLY valid JSON in this exact shape: {"value":"..."}.

Context:
- Field label: ${fieldLabel}
- Section: ${sectionLabel}
- Current value: ${currentValue}
- Page title: ${title}
- Slug: ${slug}
- Country: ${country}
- Market: ${market}
- Target location: ${location}
- Primary keyword: ${brief.primaryKeyword}
- Service type: ${serviceType}
- Existing page context: ${JSON.stringify(existingContentContext).slice(0, 6000)}

Rules:
- Keep the value suitable for this exact field only.
- Use the current Core Information and target market.
- No em dashes.
- Do not use: In today's digital world, Whether you are, At Akoode we understand, revolutionary, cutting-edge, game-changing, transformative, leverage, utilize, robust, seamless, unlock, delve.
- No property or real estate wording unless the field explicitly asks for real estate.
- For UK pages, use UK GDPR, NHS DSPT, FCA-style governance, accessibility, auditability, security, procurement, or data residency where relevant. Do not mention HIPAA.
- ${isHeadingField ? "If this is a heading/title, keep it concise, professional, and SEO-aware." : ""}
- ${isBulletField ? "If this is a bullet/pointer/perk, write one specific capability or outcome in 8 to 14 words." : ""}
- ${isLongField ? "If this is paragraph/body/description/answer text, write 55 to 90 words with practical business and engineering detail." : ""}
- If this is a service card paragraph, make it 75 to 90 words and useful enough to fill 4 to 5 visual lines.
- If this is meta title, keep it 50 to 55 characters maximum.
- If this is meta description, keep it 150 to 155 characters maximum.
- Keep the tone senior, product-led, commercial, and technically credible.`;

  try {
    const parsed = await requestAnthropicJson({
      prompt,
      maxTokens: Number(process.env.ANTHROPIC_FIELD_MAX_TOKENS || 1200),
      temperature: Number(process.env.ANTHROPIC_FIELD_TEMPERATURE || 0.65),
      timeoutMs: 45000,
    });
    const value = normalizeGeneratedFieldValue(parsed.value || "", {
      fieldLabel,
      sectionLabel,
      location,
      serviceType,
      primaryKeyword: brief.primaryKeyword,
    });
    return res.json({ status: "success", message: "Field regenerated", data: { value } });
  } catch (error) {
    return res.status(502).json({ status: "error", message: error.message || "Anthropic returned invalid field JSON" });
  }
});

module.exports = {
  generateServiceByCountrySeoSuggestion,
  generateServiceByCountryFieldSuggestion,
  generateServiceByCitySeoSuggestion,
  generateServiceByCityFieldSuggestion,
};

// Grouped SBC SEO prompts — splits the single master prompt (sbcSeoSuggestionPrompt.js)
// into 4 smaller scoped generation calls so each group can be validated and retried
// INDEPENDENTLY. A failed FAQ no longer forces the whole page onto static fallback.
//
// Group 1: Hero + ChooseUs (trust) + WhyLocation
// Group 2: Process (service cards) + WhatWeDo (delivery stages)
// Group 3: Industries + Engagement + WhyChoose
// Group 4: FAQ + FinalCta + Meta
//
// (Group 2 and Group 3 were previously split further, into 2/2b and 3/3b, to fit under
// a 4,000 output-tokens-per-minute org rate limit that no longer applies at the
// account's current tier — merged back to cut the call count and the per-call fixed
// overhead of re-sending each call's instructions.)
//
// Word counts, tone rules, and section briefs are copied from the master prompt so the
// controller's group validators (validateGroup1..validateGroup4) match what is asked for.
// mergeGroupResults() reassembles the 4 parsed responses into the flat page shape that
// normalizeSbcSeoSuggestion() already consumes — the normalizer keeps locking the static
// structural fields (hero stats, industry names/icons, engagement titles, stage titles).

const { FIXED_INDUSTRIES, APPROVED_SERVICE_URLS, KEYWORD_REFERENCES } = require("./sbcSeoSuggestionPrompt");

function safeInputFor(input = {}) {
  return {
    title: input.title || "",
    slug: input.slug || "",
    country: input.country || "",
    market: input.market || "",
    keywords: input.keywords || "",
    targetCity: input.targetCity || "",
    targetCountry: input.targetCountry || input.country || "",
    pageType: input.targetCity ? "city page" : "country page",
    primaryKeyword: input.primaryKeyword || "",
    secondaryKeywords: Array.isArray(input.secondaryKeywords) ? input.secondaryKeywords : [],
    parentPageUrl: input.parentPageUrl || "",
    internalLinks: Array.isArray(input.internalLinks) ? input.internalLinks : [],
    competitorUrls: Array.isArray(input.competitorUrls) ? input.competitorUrls : [],
    serviceType: input.serviceType || "Software Development",
    existingContentContext: input.existingContentContext || {},
  };
}

function locationLabelFor(input = {}) {
  const safe = safeInputFor(input);
  return safe.targetCity || safe.targetCountry || "the target market";
}

// City-first geo-targeting constraints, ported from the old inline `cityGuard` string in
// the city route handler. REQUEST-INDEPENDENT on purpose: it refers to "the target city
// in PAGE INPUTS (targetCity)" instead of interpolating the actual city/country values,
// so it can live inside the CACHED static preamble and stay byte-identical across every
// city page. The concrete city/country binding is emitted separately in
// buildDynamicPageInputs (the uncached suffix).
const CITY_GUARD_STATIC = `

CITY PAGE MODE — ADDITIONAL CONSTRAINTS (OVERRIDES ANY EARLIER COUNTRY-LEVEL EXAMPLES)
This is a CITY-FIRST landing page. The primary geographical target is the CITY given as targetCity in the PAGE INPUTS below. The country (targetCountry in PAGE INPUTS) is only background context.

GEO TARGETING RULES — STRICT
1. Use the CITY name (PAGE INPUTS targetCity) — NOT the country (PAGE INPUTS targetCountry) — in every heading, H2, subtext, card, FAQ question/answer, and meta field you generate. Whenever a section brief says "[CITY/COUNTRY]" or "city/country", you MUST output the city name, not the country name.
2. Hero H1 pattern: "Software Development Company [CITY]" (or the equivalent for the supplied serviceType). NEVER produce "Software Development Company [COUNTRY]" or similar country-titled headings.
3. Meta title and meta description must include the city name. Do not substitute the country for the city in meta.
4. cardLocation: output "[CITY], [COUNTRY]" in uppercase (city first).
5. Body copy, industry copy, and FAQ answers must reference [CITY] businesses / [CITY] startups / [CITY] enterprises — NOT [COUNTRY] businesses, unless explicitly comparing the city to the wider country market.
6. Mention the country ONLY in WhyLocation paragraph 3 (parent-page link context: "the wider [COUNTRY] software development market") and where regulatory frameworks require it (e.g. "UK GDPR" on UK city pages). Otherwise, the country must not appear in headings or subheads.
7. If the user-supplied Page Title field contains the country name (e.g. "...Company UK") IGNORE it — write city-named copy. The supplied title is suggestive only when the geo matches; it must not override the city target.

URL PRESERVATION
Do NOT change the city name, citySlug, market segment, slug, or countryRef in your response — those are controlled by the CMS URL structure and will be reapplied by the server.

SIBLING CITY PAGES — PHRASE-LEVEL ORIGINALITY (CRITICAL)
Akoode publishes one page per city for the same service. Convey the same core services and value proposition as every other city page for this business — that story is a brand requirement and must not drift. But detectors and search engines compare sibling city pages sentence by sentence, so phrasing must NOT be shared. Do not reuse sentence structures, sentence openers, clause order, or phrasing from sibling city pages (their excerpts appear in a SIBLING CITY PAGE EXCERPTS block below when available) — rewrite each idea in fresh wording and varied syntax while keeping the exact same meaning, the same word counts, and the same section structure. If a sentence you are about to write would read as a sibling page's sentence with only the city name swapped, rewrite it before returning. Word counts, section structure, and item counts stay exactly as specified — only the sentence-level wording must diverge.`;

function buildAvoidPhrasesBlock(avoidPhrases = []) {
  const list = (Array.isArray(avoidPhrases) ? avoidPhrases : [])
    .map((item) => String(item || "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 20);
  if (!list.length) return "";
  return `

CROSS-PAGE REPETITION GUARD — CRITICAL
The following phrases, headings, and question wordings already appear on other published Akoode landing pages. Do NOT reuse, closely paraphrase, or lightly reword any of them. Write genuinely different phrasing, angles, and sentence structures:
${list.map((item) => `- ${item}`).join("\n")}`;
}

// CITY PATH ONLY. Renders full sibling-page prose (capped) so the model can see —
// and avoid — the exact phrasing already published for other cities of the same
// country + service. Deterministic for a given excerpts array, so it is safe inside
// the cached static preamble (same trade-off as the avoid-phrases block: a changed
// sibling set forces one fresh cache write per generation batch).
function buildSiblingExcerptsBlock(siblingExcerpts = []) {
  const list = (Array.isArray(siblingExcerpts) ? siblingExcerpts : [])
    .filter((item) => item && item.text)
    .slice(0, 2);
  if (!list.length) return "";
  const rendered = list
    .map((item) => `--- SIBLING PAGE (${item.city || "another city"}) ---\n${String(item.text).slice(0, 6000)}`)
    .join("\n\n");
  return `

SIBLING CITY PAGE EXCERPTS — DO NOT REUSE THIS PHRASING (CRITICAL)
The excerpts below are from Akoode's already-written city pages for the SAME country and service. They exist so you can see exactly which phrasing is taken. Keep the same meaning, services, and section structure as these pages, but every sentence you write must use different wording, different sentence openers, and different syntax. Do not copy, lightly reword, or geo-swap any sentence that appears here.

${rendered}`;
}

// STATIC preamble — the CACHED prompt prefix. Sent as the first content block of
// every group call with cache_control {type: "ephemeral", ttl: "1h"}, so its output
// MUST be byte-identical for any two calls with the same options.avoidPhrases array
// and the same options.cityGuard boolean. Never put anything from `input`,
// Date.now(), random IDs, or other non-deterministic content in here — a single
// changed byte invalidates the cache for every call that follows.
//
// NOTE on avoidPhrases: the avoid-list is part of this cached block, so a CHANGED
// avoid-list (e.g. a new page was published between generations) forces a fresh
// cache write, trading cache-hit-rate for cross-page repetition-avoidance. Within
// one page generation (4 parallel group calls + retries) the list is computed once,
// so all calls share the same prefix regardless.
function buildStaticPreamble(options = {}) {
  const cityGuard = options.cityGuard ? CITY_GUARD_STATIC : "";
  const avoidBlock = buildAvoidPhrasesBlock(options.avoidPhrases);
  // City path only — country runs pass no siblingExcerpts, so their preamble is
  // byte-identical to the pre-sibling-guard build.
  const siblingBlock = options.cityGuard ? buildSiblingExcerptsBlock(options.siblingExcerpts) : "";

  return `AKOODE TECHNOLOGIES — SEO LANDING PAGE SECTION GENERATOR

ROLE
Act as the world's top international SEO strategist, content marketer, and conversion copywriter with proven experience ranking country and city landing pages that generate 10,000+ organic visitors per month.
You are also an expert B2B SaaS SEO copywriter, conversion strategist, and technical content writer with deep experience writing for software engineering companies.
You are generating ONE GROUP OF SECTIONS of a larger landing page for Akoode Technologies. Other sections are generated separately — write ONLY the sections requested below, but keep tone and keyword strategy consistent with a complete page.
Every section must follow the exact word counts, exact structure, and exact tone specified below. No shortcuts. No placeholders except where explicitly instructed. No generic AI writing patterns.

WRITING RULES — NON-NEGOTIABLE
DO NOT use em dashes anywhere in the content.
DO NOT use these phrases or words: "In today's digital world", "Whether you are", "At Akoode we understand", "At Akoode, we understand", "revolutionary", "cutting-edge", "game-changing", "transformative", "leverage", "utilize", "robust", "seamless", "unlock", "delve".
DO NOT fabricate case study content or testimonial quotes.
DO NOT use bullet points in paragraphs. Bullets only appear where the brief explicitly asks for pointers, points, deliverables, or perks.
DO NOT keyword stuff.
WRITE like a senior content strategist inside a software engineering company.
WRITE short to medium sentences at Grade 7 to 9 readability.
MAINTAIN strong topical depth and semantic SEO relevance throughout.
FEEL locally relevant to the target city and target country.
Never output unrelated admin/task phrases such as "Build property suggestion workflow".

HUMAN-WRITTEN AND AI-DETECTION-RESISTANT — CRITICAL
The output must read as if written by an experienced human strategist and must pass AI-detection tools (target: low AI-probability, high human score). Follow these rules:
Vary sentence length and rhythm deliberately (high burstiness): mix short punchy sentences with longer ones. Never produce a run of sentences with the same length or structure.
Vary paragraph openings. Do not start consecutive sentences or paragraphs with the same word or the same grammatical pattern.
Avoid formulaic AI scaffolding: no "Furthermore", "Moreover", "Additionally", "In conclusion", "It is important to note", "When it comes to", "That said", "Ultimately", "Overall", "Firstly/Secondly/Finally" as section glue.
Do not use the listing-of-three cliche ("fast, reliable, and scalable") repeatedly. Break predictable triplets.
Prefer concrete specifics (real workflows, decisions, tradeoffs, roles, artefacts) over vague abstractions and marketing filler.
Use natural contractions where a human would (we're, you'll, it's) so the tone is not stiff.
Do not hedge with "can help", "may be able to", "designed to" as filler. State things directly.
Never repeat the same phrase, sentence opener, or stat wording across sections.

BANNED RHETORICAL CRUTCH — THE "X, NOT Y" CONTRAST
The single most common AI-detector trigger in this content type is the negated-contrast construction: "day one, not retrofitted after an audit", "milestone checkpoints, not vague timelines", "standard, not optional add-ons", "a template stack", "before submission day arrives, not after a rejection", "not just wireframes and promises". Any sentence shaped as "[positive claim], not [negated alternative]" falls into this pattern, including variants using "instead of", "rather than", or "not just". Use this construction AT MOST ONCE across the entire page, in any section. Every other time you are tempted to state a claim by contrasting it against a rejected alternative, delete the negation and state the positive claim directly on its own. This is a hard cap, not a per-section budget — count it across hero, chooseUs, whyLocation, process, whatWeDo, industries, engagement, whyChoose, faq, and finalCta combined.

STRUCTURAL SYMMETRY IS THE BIGGEST AI TELL — BREAK IT DELIBERATELY
Word-count targets below are per-item budgets, not a license to make every item in a list read the same way. Detectors flag parallel items far more reliably than word choice, because default LLM output makes every card, bullet block, or FAQ answer follow the identical internal shape (claim sentence, then a mechanism sentence, then a reassurance sentence, each about the same length). Do the opposite:
Inside any set of parallel items (chooseUs.features, clientLove cards, whyLocation.features, industries.items, engagement.models, whyChoose.cards, FAQ answers, service paragraphs), no two items may share the same internal sentence pattern. If item 1 opens with a flat statement, item 2 should open with a scenario, a specific number, a named example, or a short fragment — not another flat statement.
Vary how many sentences each item uses to reach its word budget. One item can be a single dense sentence; the next can be three short ones. Do not let every item in a set land on the same sentence count.
Only some items need a "why it matters" clause. Others should just state the fact and stop. Constantly justifying every claim in the same explain-then-reassure shape is what reads as machine-generated.
Drop in one small, specific, slightly asymmetric detail per list (a tool name, a number, a role title, a blunt aside) that would not survive a template — something a person writing from memory would include and a generator filling a slot would not.
Read back the set of items mentally: if you could swap two items' word count and nobody would notice a seam, the phrasing is too uniform. Rewrite so the items are visibly unequal in shape even where the word count rule keeps them close in length.

ORIGINAL AND PLAGIARISM-FREE — CRITICAL
Every sentence must be original. Do not copy, closely paraphrase, or reassemble sentences from the existing CMS values, competitor pages, or common boilerplate found on other software-company websites.
Do not reuse stock marketing sentences that appear on thousands of agency sites. Write fresh phrasing specific to Akoode and the target location.
Two Akoode pages for different locations must not share identical sentences; localise the wording, examples, and framing so each page is genuinely distinct.
For UK pages, use UK GDPR, NHS DSPT, FCA-style governance, accessibility, auditability, security, procurement, or data residency where relevant. Do not mention HIPAA on UK pages.

COMPANY CONTEXT
Company: Akoode Technologies.
Type: Software development company.
Locations: Gurgaon India, USA.
Global reach: Startups, scale-ups, and enterprise businesses worldwide.
Core services: AI development, AI-powered systems, custom software development, SaaS platform development, web application development, mobile app development, cloud and DevOps, enterprise software, data engineering, digital transformation.
Tone: Senior engineering authority, business-focused, product-led, trust-building, direct, modern B2B SaaS, no hype, no fake claims.
Audience: Founders, CTOs, product managers, enterprise buyers, operations leaders, startup and scale-up teams.

APPROVED SERVICES LIST
Only reference or link to these service URLs. No other service URLs may be used:
${APPROVED_SERVICE_URLS.join("\n")}

REFERENCE KEYWORDS FOR INITIAL PAGES
${JSON.stringify(KEYWORD_REFERENCES, null, 2)}

FIXED INDUSTRIES — CANONICAL NAMES AND ORDER
${FIXED_INDUSTRIES.join(" | ")}${cityGuard}${avoidBlock}${siblingBlock}

COMPLETENESS — STRICT
The response MUST be 100% complete for every requested section. Every required array MUST contain the exact number of objects specified. Never return partial JSON, placeholders, null, or [] for a required array. If you are running low on space, tighten prose but always finish every required item and close the JSON.
Before returning, silently validate every word-count rule and item count, and regenerate internally if any rule fails. Never mention this validation.

RETURN ONLY VALID JSON. No markdown. No commentary. No code fences.`;
}

// DYNAMIC page inputs — everything that legitimately varies per request. Sent as
// the second (uncached) content block, AFTER the cached static preamble, so per-page
// values never invalidate the shared prefix.
function buildDynamicPageInputs(input = {}) {
  const safe = safeInputFor(input);
  // Concrete geo binding for the generic CITY PAGE MODE rules in the static preamble.
  const cityBinding = safe.targetCity
    ? `\n\nCITY PAGE TARGET — BINDING FOR THE CITY PAGE MODE RULES ABOVE\nCITY = ${safe.targetCity}. COUNTRY = ${safe.targetCountry || "UK"}. Apply every CITY PAGE MODE rule with these values. cardLocation must be "${String(safe.targetCity).toUpperCase()}, ${String(safe.targetCountry || "UK").toUpperCase()}".`
    : "";

  return `PAGE INPUTS — REQUIRED BEFORE GENERATION
${JSON.stringify(safe, null, 2)}${cityBinding}

IMPORTANT ABOUT EXISTING CMS VALUES
Existing CMS values are context only. They may contain old copy, copied copy, partial admin test text, or unrelated phrases. Do not preserve, paraphrase, or copy existing section copy unless it is a fixed brand fact, URL, CTA link, or a fixed instruction from this prompt. If existing content conflicts with target city, target country, keyword, URL structure, stats, industries, metadata, or page structure, ignore it.
If the keywords field is provided, treat those keywords as additional commercial SEO targets. Use them naturally without stuffing.`;
}

// DEPRECATED single-string form, kept for rollback/compatibility. New code should
// use buildStaticPreamble + buildDynamicPageInputs so the static half can be cached.
function buildSharedContext(input = {}, options = {}) {
  return `${buildStaticPreamble(options)}\n\n${buildDynamicPageInputs(input)}`;
}

function buildGroup1Prompt(input = {}, options = {}) {
  const location = locationLabelFor(input);
  return {
    static: buildStaticPreamble(options),
    dynamic: `${buildDynamicPageInputs(input)}

==========================
SECTIONS TO GENERATE IN THIS CALL: HERO, TRUST AND SOCIAL PROOF (chooseUs), WHY CHOOSE ${String(location).toUpperCase()} (whyLocation)
==========================

SECTION: HERO
hero.body: Exactly 30 to 35 words. Never start with "Akoode Technologies". Lead with value proposition. Must mention software development, AI or intelligent systems, target city/country, and at least two service types. Use this pattern and adapt services to SERVICE TYPE: "Full-stack, AI-powered software development for [CITY/COUNTRY] startups, scale-ups, and enterprises building scalable [service 1], [service 2], [service 3], and [service 4] engineered for performance, compliance, and long-term growth."
hero.heroImageAlt: a natural descriptive alt text with the location and service.
DO NOT generate hero.heading (the H1), hero CTA buttons/links, or hero.stats — all fixed by the server and discarded if returned.

SECTION: TRUST AND SOCIAL PROOF (chooseUs)
The section H2 is fixed server-side — do not output a heading.
chooseUs.intro: exactly 40 to 50 words. Mention why target city/country businesses choose Akoode, deep engineering expertise, accountable delivery, in-house execution from architecture to deployment, and consistency vs other firms. Do not start with "Akoode Technologies".
chooseUs.features: exactly 4 pointer blocks. Each H3 title plus body. Body maximum 2 sentences. Total words per block body: 25 to 35 words.
Block 1 H3: Proven Delivery Track Record. Discuss structured roadmap delivery, milestone tracking, and sprint accountability for startups, enterprise, and SaaS businesses in target city/country.
Block 2 H3: Transparent Collaboration — ${location} Timezone (write without the em dash, use a hyphen or "in"). Discuss overlap hours, Slack, Jira, GitHub, and sprint reporting.
Block 3 H3: Long-Term Technology Partners. Discuss clients continuing beyond launch and maintainability from day one.
Block 4 H3: Recognised on Clutch and Google. Discuss platform ratings across FinTech, HealthTech, SaaS, enterprise technology, and engineering experience.
chooseUs.clientLove: exactly 4 cards, fixed topics in this order: On-Time Delivery, Clear Communication, Quality and Reliability, Long-Term Partnership. Each card title plus a 2 sentence body of 25 to 35 words total.
DO NOT generate chooseUs.platformRatings — static, discarded.

SECTION: WHY CHOOSE ${String(location).toUpperCase()} (whyLocation)
DO NOT generate the section H2, cardLocation, or cardHeading — all fixed by the server and discarded if returned.
whyLocation.cardBody: 12 to 15 words. AI-powered product engineering and scalable digital solutions for modern [City/Country] businesses (rewrite freshly, keep the meaning).
whyLocation.para1, para2, para3: 3 paragraphs, each exactly 40 to 45 words.
Paragraph 1: market demand and competitive landscape. Reference local tech hubs, industries, or market facts.
Paragraph 2: regulatory and compliance expectations. Reference actual local frameworks relevant to city/country.
Paragraph 3: why businesses need Akoode. For city pages, naturally include parent country page link context as plain text using the wording "the wider [COUNTRY] software development market".
whyLocation.features: exactly 4 insight cards in this order: Market Scale, Timezone Overlap, Regulatory Experience, Sector Depth. Each H3 title 3 to 5 words and body exactly 14 to 18 words so cards do not look empty.
whyLocation.imageAlt: a natural descriptive alt text.

Use this exact JSON shape (no extra keys — server-locked fields are set server-side):
{
  "hero": { "body": "", "heroImageAlt": "" },
  "chooseUs": { "intro": "", "features": [{ "icon": "FiTrendingUp", "title": "", "body": "" }], "clientLove": [{ "icon": "FiCheckCircle", "title": "", "body": "" }] },
  "whyLocation": { "para1": "", "para2": "", "para3": "", "features": [{ "icon": "FiTrendingUp", "title": "", "body": "" }], "imageAlt": "", "cardBody": "" }
}`,
  };
}

// SERVICES (process) + DELIVERY PROCESS (whatWeDo) — merged back into one call now
// that the account's per-minute output cap no longer forces a split.
function buildGroup2Prompt(input = {}, options = {}) {
  const location = locationLabelFor(input);
  return {
    static: buildStaticPreamble(options),
    dynamic: `${buildDynamicPageInputs(input)}

==========================
SECTIONS TO GENERATE IN THIS CALL: SERVICES (process), DELIVERY PROCESS (whatWeDo)
==========================

SECTION: SERVICES (process)
DO NOT generate the section H2 or per-card numbering ("n") — fixed by the server and discarded if returned.
process.intro: exactly 35 to 45 words. Mention full-cycle delivery, product strategy, UX, engineering, deployment, post-launch optimisation, and startups, scale-ups, enterprise.
process.services: write exactly 6 services selected from the approved services list. For each:
- title: [Service Name] in ${location}.
- subtitle: short service category label.
- para: exactly 75 to 90 words so it fills roughly 4 to 5 card lines on desktop. Locally contextualised, with use cases, Akoode's approach, delivery detail, and a scale or maintainability outcome. Every service paragraph must be clearly different in structure and opening from the others.
- points: 5 to 6 pointers, each exactly 8 to 14 words. Prefer 6 when the card needs more visual balance. Never fewer than 5. No pointer may repeat on another service card.
- tags: exactly 6 to 7 real tools.

SECTION: DELIVERY PROCESS (whatWeDo)
DO NOT generate the section H2 or the stage titles/shortTitles — they are fixed by the server. Return the 6 steps in EXACTLY this order (the server re-attaches each stage's locked title by position), writing content for:
1. Discovery and Strategy
2. Architecture and Technical Design
3. UX Design and Prototyping
4. Agile Development and Engineering
5. QA, Testing, and Security Review
6. Deployment, Launch, and Post-Launch Support
whatWeDo.subtitle: exactly 30 to 40 words. Reference six stages, transparency, accountability, first conversation to launch.
For each stage:
- body: exactly 45 to 70 words.
- timeline: a short label like "1 to 2 weeks" or "Ongoing".
- timelineNote: exactly 20 to 25 words.
- deliverables: exactly 4 items, each 6 to 12 words.

Use this exact JSON shape (no extra keys — server-locked fields are set server-side):
{
  "process": { "intro": "", "services": [{ "title": "", "subtitle": "", "para": "", "points": [""], "tags": [""] }] },
  "whatWeDo": { "subtitle": "", "steps": [{ "body": "", "timeline": "", "timelineNote": "", "deliverables": [""] }] }
}`,
  };
}

// INDUSTRIES + ENGAGEMENT MODELS + WHY CHOOSE AKOODE — merged back into one call
// now that the account's per-minute output cap no longer forces a split.
function buildGroup3Prompt(input = {}, options = {}) {
  return {
    static: buildStaticPreamble(options),
    dynamic: `${buildDynamicPageInputs(input)}

==========================
SECTIONS TO GENERATE IN THIS CALL: INDUSTRIES, ENGAGEMENT MODELS, WHY CHOOSE AKOODE
==========================

SECTION: INDUSTRIES
DO NOT generate the section H2, industry names, or icons — the server re-attaches the fixed name and icon to each item BY POSITION, so order is critical.
industries.subtitle: exactly 30 to 40 words. Reference industry-specific delivery, technical complexity, regulated markets, and range of sectors served.
industries.items: exactly 15 items, one per industry, in EXACTLY this order. Never reorder, add, or remove: ${FIXED_INDUSTRIES.join(" | ")}.
For each industry write exactly 4 points, each 8 to 12 words, with specific capabilities, integrations, or compliance requirements relevant to city/country. No generic "custom software solutions". No point may repeat across industries.

SECTION: ENGAGEMENT MODELS
engagement.subtitle: exactly 30 to 40 words. Mention choice of model, dedicated engineers, full IP ownership, transparent communication, direct access to team.
DO NOT generate the section H2, badges, best-for lines, or CTAs — fixed by the server. Return each model's title EXACTLY as given below (the server matches your content to the locked model by title).
engagement.models: exactly 3 models in this order, never renamed or reordered:
1. Dedicated Team
2. Fixed Cost
3. Staff Augmentation
For each model:
- body: 40 to 60 words describing how the model works with Akoode, written freshly for this location.
- perks: Dedicated Team gets 4 perks; Fixed Cost and Staff Augmentation get 3 perks each. Each perk 2 to 4 words.

SECTION: WHY CHOOSE AKOODE (whyChoose)
whyChoose.heading: 8 to 9 words. Must reference target city/country businesses and Akoode as engineering partner.
whyChoose.subtitle: exactly 30 to 40 words. Reference senior-led delivery, AI-first engineering, no subcontracting, and direct client access.
whyChoose.cards: exactly 4 cards in this order. Each desc exactly 35 to 45 words so every card has useful depth:
1. No Subcontracting — Your Project Stays In-House (write the title without an em dash).
2. AI-First Engineering — Live in Production (write the title without an em dash).
3. Senior Engineers Lead Every Engagement.
4. Compliance Designed In From the Start.
DO NOT generate whyChoose.ctaHeading / ctaBody / ctaText / ctaLink — static, discarded.

Use this exact JSON shape (no extra keys — server-locked fields are set server-side):
{
  "industries": { "subtitle": "", "items": [{ "points": ["", "", "", ""] }] },
  "engagement": { "subtitle": "", "models": [{ "title": "Dedicated Team", "body": "", "perks": [""] }] },
  "whyChoose": { "heading": "", "subtitle": "", "cards": [{ "icon": "FiUsers", "title": "", "desc": "" }] }
}`,
  };
}

function buildGroup4Prompt(input = {}, options = {}) {
  const location = locationLabelFor(input);
  return {
    static: buildStaticPreamble(options),
    dynamic: `${buildDynamicPageInputs(input)}

==========================
SECTIONS TO GENERATE IN THIS CALL: FAQ, FINAL CTA, METADATA
==========================

SECTION: FAQ
DO NOT generate the section H2 — fixed by the server.
faq.subtitle: exactly 20 to 30 words using this pattern: Straight answers on process, pricing, timelines, compliance, and what working with Akoode actually looks like for [CITY/COUNTRY] businesses (rewrite freshly, keep the meaning).
faq.items: write exactly 12 FAQs — this is mandatory. The array MUST contain 12 complete objects, each with a non-empty "question" and a non-empty "answer". Do not stop early, do not return fewer than 12, and never leave the FAQ array partial or truncated.
Each question is an H3-equivalent, phrased the way a real ${location} buyer would search. Each answer exactly 50 to 80 words. Include local context naturally in at least 6 answers.
Cover cost, timeline, startups vs enterprise, local compliance/data regulations, business-hour overlap, AI software, dedicated team vs staff augmentation, NDAs, taking over existing projects, industries, mobile apps, and getting started.
Every question wording must be original — never reuse question phrasings from other Akoode pages.

SECTION: FINAL CTA
finalCta.body: exactly 30 to 40 words. Reference sharing requirements, senior team review, one business day response time, and zero commitment on first contact.
DO NOT generate the section H2, finalCta.replyTime, or finalCta.nda — static, discarded.

SECTION: METADATA
DO NOT generate meta.title — the server builds it from the primary keyword.
meta.description: 150 to 155 characters. Include primary keyword, city/country, and one clear value statement. No em dashes. Count characters carefully — the description is INVALID below 150 or above 155 characters.

Use this exact JSON shape (no extra keys — server-locked fields are set server-side):
{
  "faq": { "subtitle": "", "items": [{ "question": "", "answer": "" }] },
  "finalCta": { "body": "" },
  "meta": { "description": "" }
}`,
  };
}

// Builds all 4 group prompts. options: { avoidPhrases?: string[], cityGuard?: boolean }
// Each group is { static, dynamic }: `static` is the cacheable shared preamble
// (byte-identical across all 4 groups for one options object — and across pages,
// given the same avoidPhrases/cityGuard), `dynamic` is the per-request page inputs
// plus that group's section brief and JSON shape.
function buildGroupPrompts(input = {}, options = {}) {
  return {
    group1: buildGroup1Prompt(input, options),
    group2: buildGroup2Prompt(input, options), // services + whatWeDo
    group3: buildGroup3Prompt(input, options), // industries + engagement + whyChoose
    group4: buildGroup4Prompt(input, options),
  };
}

// Reassembles the 4 parsed group responses into the single flat page object that
// normalizeSbcSeoSuggestion() expects. Later groups never overwrite earlier groups
// because each group owns disjoint top-level keys.
function mergeGroupResults({ group1 = {}, group2 = {}, group3 = {}, group4 = {} } = {}) {
  return {
    hero: group1.hero || {},
    chooseUs: group1.chooseUs || {},
    whyLocation: group1.whyLocation || {},
    process: group2.process || {},
    whatWeDo: group2.whatWeDo || {},
    industries: group3.industries || {},
    engagement: group3.engagement || {},
    whyChoose: group3.whyChoose || {},
    faq: group4.faq || {},
    finalCta: group4.finalCta || {},
    meta: group4.meta || {},
  };
}

module.exports = {
  buildSharedContext,
  buildStaticPreamble,
  buildSiblingExcerptsBlock,
  buildDynamicPageInputs,
  buildGroup1Prompt,
  buildGroup2Prompt,
  buildGroup3Prompt,
  buildGroup4Prompt,
  buildGroupPrompts,
  mergeGroupResults,
};

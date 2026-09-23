const FIXED_INDUSTRIES = [
  "Healthcare",
  "Retail and E-Commerce",
  "Media and Entertainment",
  "Finance and Banking",
  "Automotive",
  "Agriculture",
  "Telecommunication",
  "Manufacturing",
  "Public Sector and Government",
  "Real Estate",
  "Energy and Utilities",
  "Travel and Hospitality",
  "Education",
  "Insurance",
  "Logistics and Supply Chain",
];

const APPROVED_SERVICE_URLS = [
  "https://www.akoode.com/services/artificial-intelligence",
  "https://www.akoode.com/services/deep-learning-development",
  "https://www.akoode.com/services/integrated-intelligence",
  "https://www.akoode.com/services/computer-vision-technology",
  "https://www.akoode.com/services/3d-and-metaverse-based",
  "https://www.akoode.com/services/pioneering-generative-ai-integration",
  "https://www.akoode.com/services/digital-transformation",
  "https://www.akoode.com/services/software-development",
  "https://www.akoode.com/services/end-to-end-tailored-software-solutions",
  "https://www.akoode.com/services/enterprise-application-development",
  "https://www.akoode.com/services/saas-product-development",
  "https://www.akoode.com/services/mvp-development-for-startups",
  "https://www.akoode.com/services/cross-platform-software-solutions",
  "https://www.akoode.com/services/ios-app-development",
  "https://www.akoode.com/services/android-app-development",
  "https://www.akoode.com/services/native-app-development",
  "https://www.akoode.com/services/hybrid-app-development",
  "https://www.akoode.com/services/web-development-technology",
  "https://www.akoode.com/services/custom-website-development",
  "https://www.akoode.com/services/web-app-development",
  "https://www.akoode.com/services/website-design",
  "https://www.akoode.com/services/full-stack-website-development",
  "https://www.akoode.com/services/ai-powered-website-development",
  "https://www.akoode.com/services/magento-development",
  "https://www.akoode.com/services/opencart-development",
  "https://www.akoode.com/services/shopify-development",
  "https://www.akoode.com/services/woocommerce-development",
  "https://www.akoode.com/services/iot",
  "https://www.akoode.com/services/big-data",
  "https://www.akoode.com/services/cloud-and-devops-solutions",
  "https://www.akoode.com/services/blockchain-development",
  "https://www.akoode.com/services/staff-augmentation",
  "https://www.akoode.com/services/360-digital-marketing",
  "https://www.akoode.com/services/mobile-app-development",
  "https://www.akoode.com/services/web-development",
  "https://www.akoode.com/services/ecommerce-development",
  "https://www.akoode.com/services/react-native-app-development",
  "https://www.akoode.com/services/flutter-app-development",
  "https://www.akoode.com/services/data-science-company",
];

const KEYWORD_REFERENCES = [
  {
    city: "",
    country: "UK",
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
    city: "Cambridge",
    country: "UK",
    primaryKeyword: "software development company cambridge",
    secondaryKeywords: ["software company cambridge", "top software company cambridge", "ai software development firm"],
    competitorUrls: ["https://www.coderus.com/contact/cambridge/", "https://www.cambseng.co.uk/"],
  },
  {
    city: "Manchester",
    country: "UK",
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
    city: "Birmingham",
    country: "UK",
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
    city: "Leeds",
    country: "UK",
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

function buildSbcSeoSuggestionPrompt(input = {}) {
  const safeInput = {
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

  return `AKOODE TECHNOLOGIES — COMPLETE SEO LANDING PAGE MASTER PROMPT v2.0

ROLE
Act as the world's top international SEO strategist, content marketer, and conversion copywriter with proven experience ranking country landing pages that generate 10,000+ organic visitors per month.
You are also an expert B2B SaaS SEO copywriter, conversion strategist, and technical content writer with deep experience writing for software engineering companies.
Your job is to write a COMPLETE, FULLY DETAILED, SECTION-BY-SECTION SEO landing page for Akoode Technologies.
Every section must follow the exact word counts, exact structure, and exact tone specified below. No shortcuts. No placeholders except where explicitly instructed. No generic AI writing patterns.

PAGE INPUTS — REQUIRED BEFORE GENERATION
${JSON.stringify(safeInput, null, 2)}

IMPORTANT ABOUT EXISTING CMS VALUES
Existing CMS values are context only. They may contain old copy, copied copy, partial admin test text, or unrelated phrases. Do not preserve, paraphrase, or copy existing section copy unless it is a fixed brand fact, URL, CTA link, or a fixed instruction from this prompt. If existing content conflicts with target city, target country, keyword, URL structure, stats, industries, metadata, or page structure, ignore it.
If the keywords field is provided, treat those keywords as additional commercial SEO targets. Use them naturally across headings, service copy, FAQs, and metadata without stuffing.

WRITING RULES — NON-NEGOTIABLE
DO NOT start any sentence with "Akoode Technologies" in the hero subtext.
DO NOT use em dashes anywhere in the content.
DO NOT use these phrases or words: "In today's digital world", "Whether you are", "At Akoode we understand", "At Akoode, we understand", "revolutionary", "cutting-edge", "game-changing", "transformative", "leverage", "utilize", "robust", "seamless", "unlock", "delve".
DO NOT fabricate case study content or testimonial quotes.
DO NOT use bullet points in paragraphs. Bullets only appear in service pointers, industry cards, process deliverables, and engagement model perks.
DO NOT keyword stuff.
DO NOT write one-line FAQ answers.
DO NOT reference service URLs outside the approved services list.
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
Do not reuse stock marketing sentences that appear on thousands of agency sites. Write fresh phrasing specific to Akoode and the target country.
Two Akoode pages for different countries must not share identical sentences; localise the wording, examples, and framing so each page is genuinely distinct.
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

URL STRUCTURE — STRICT RULE
Country pages: akoode.com/[country-code]/[service-slug]. Example: akoode.com/uk/software-development-company.
City pages: akoode.com/[country-code]/[city]/[service-slug]. Example: akoode.com/uk/london/software-development-company.
Slug must be lowercase, hyphenated, matching primary keyword intent, and never longer than 5 words.
This CMS stores the country/city segment separately in market. Return slug as service-slug only. Return market as country-code or country-code/city.

METADATA — ALL FOUR ARE MANDATORY
Generate meta title, meta description, slug, and canonical URL in implementationNotes.
Meta Title: 50 to 55 characters maximum. Include primary keyword and city or country name.
Meta Description: 150 to 155 characters maximum. Include primary keyword, city/country, and one clear value statement. No em dashes.
Slug: follow URL structure strictly, but return only service-slug in the JSON slug field and full path in implementationNotes.
Canonical URL: https://www.akoode.com/[country-code-or-country-city]/[service-slug]. Include it in implementationNotes.

PAGE STRUCTURE — FULL SECTION-BY-SECTION BRIEF

SECTION 1: HERO
H1: Use PRIMARY KEYWORD naturally and exactly. One H1 per page. Never repeat H1 text anywhere else on the page.
Subtext: Exactly 30 to 35 words. Never start with "Akoode Technologies". Lead with value proposition. Must mention software development, AI or intelligent systems, target city/country, and at least two service types. Use this pattern and adapt services to SERVICE TYPE: "Full-stack, AI-powered software development for [CITY] startups, scale-ups, and enterprises building scalable [service 1], [service 2], [service 3], and [service 4] engineered for performance, compliance, and long-term growth."
Stats Strip — FIXED, NEVER CHANGE ANY WORD:
180+ Projects Delivered / Across global markets
97% Client Retention / Long-term technology partnerships
30+ AI-Powered Solutions Built / Scalable AI systems for modern businesses
15+ Industries Served / From FinTech to HealthTech and SaaS
Right Side Content is UI only. Do not generate separate content for project progress, AI-powered solutions counter, or happy clients counter.

SECTION 2: TRUST AND SOCIAL PROOF
H2 fixed: Built with Precision. Validated by Results.
Left body paragraph: exactly 40 to 50 words. Mention why target city/country businesses choose Akoode, deep engineering expertise, accountable delivery, in-house execution from architecture to deployment, and consistency vs other firms. Do not start with "Akoode Technologies".
Left side 4 pointer blocks. Each H3 plus body. Body maximum 2 sentences. Total words per block: 25 to 35 words.
Block 1 H3: Proven Delivery Track Record. Discuss structured roadmap delivery, milestone tracking, and sprint accountability for startups, enterprise, and SaaS businesses in target city/country.
Block 2 H3: Transparent Collaboration — [CITY/COUNTRY] Timezone. Discuss overlap hours, Slack, Jira, GitHub, and sprint reporting.
Block 3 H3: Long-Term Technology Partners. Discuss clients continuing beyond launch and maintainability from day one.
Block 4 H3: Recognised on Clutch and Google. Discuss platform ratings across FinTech, HealthTech, SaaS, enterprise technology, and engineering experience.
Client Love cards, fixed topics. Each card H3 plus 2 sentence caption, 25 to 35 words total:
On-Time Delivery, Clear Communication, Quality and Reliability, Long-Term Partnership.

SECTION 3: WHY CHOOSE [CITY/COUNTRY]
H2 pattern for city: Why [CITY] Businesses Demand More From Software Development Partners.
H2 pattern for country: Why [COUNTRY] Businesses Expect More From Software Development Partners.
Geo banner fields map to cardLocation, cardHeading, cardBody.
cardLocation: [CITY, COUNTRY] uppercase for city pages, or [COUNTRY] uppercase for country pages.
cardHeading: The Future of Software Development in [City/Country].
cardBody: 12 to 15 words. AI-powered product engineering and scalable digital solutions for modern [City/Country] businesses.
Body content: 3 paragraphs, each exactly 40 to 45 words.
Paragraph 1: market demand and competitive landscape. Reference local tech hubs, industries, or market facts.
Paragraph 2: regulatory and compliance expectations. Reference actual local frameworks relevant to city/country.
Paragraph 3: why businesses need Akoode. For city pages, naturally include parent country page link context as plain text because the CMS does not store inline links. Use the wording "the wider [COUNTRY] software development market".
4 insight cards. Each H3 3 to 5 words and exactly 14 to 18 word explanation so cards do not look empty:
Market Scale, Timezone Overlap, Regulatory Experience, Sector Depth.

SECTION 4: SERVICES
H2 fixed pattern: Custom Software Development Services in [CITY/COUNTRY].
Subtext exactly 35 to 45 words. Mention full-cycle delivery, product strategy, UX, engineering, deployment, post-launch optimisation, and startups, scale-ups, enterprise.
Write exactly 6 services selected from approved services. For each:
H3: [Service Name] in [CITY/COUNTRY].
Service Tag: short service category label in subtitle.
Description exactly 75 to 90 words so it fills roughly 4 to 5 card lines on desktop. Locally contextualised, with use cases, Akoode's approach, delivery detail, and a scale or maintainability outcome.
5 to 6 pointers, each exactly 8 to 14 words. Prefer 6 when the service card needs more visual balance. Never write fewer than 5.
Tech tags exactly 6 to 7 real tools.

SECTION 5: PROCESS
H2: How Akoode Delivers Software Development Projects in [CITY/COUNTRY].
Subtext exactly 30 to 40 words. Reference six stages, transparency, accountability, first conversation to launch.
Write exactly 6 stages in this order:
Discovery and Strategy
Architecture and Technical Design
UX Design and Prototyping
Agile Development and Engineering
QA, Testing, and Security Review
Deployment, Launch, and Post-Launch Support
For each: paragraph exactly 45 to 70 words, timeline, timeline note exactly 20 to 25 words, and exactly 4 deliverables each 6 to 12 words.

SECTION 6: TECHNOLOGY STACK
H2: Technologies Used by Our [CITY/COUNTRY] Software Development Team.
Subtext exactly 25 to 35 words. Reference proven technology choices selected by performance profile. State that nothing experimental is introduced mid-project.
Exactly 6 categories, each with exactly 6 to 7 real technologies:
Mobile Development
Frontend Development
Backend and APIs
AI and Machine Learning
Cloud and DevOps
Database

SECTION 7: CASE STUDIES
H2: Outcomes You Can Take to Your Board Meeting.
Subtext 25 to 35 words. Reference real projects, measurable results, and commercial impact that can be reported internally.
Do not fabricate case study content. CMS records are inserted manually.

SECTION 9: INDUSTRIES
H2: Software Built for [CITY/COUNTRY]'s Most Demanding Sectors.
Subtext exactly 30 to 40 words. Reference industry-specific delivery, technical complexity, regulated markets, and range of sectors served.
Use EXACTLY these 15 industries in EXACTLY this order. Never rename, reorder, add, or remove: ${FIXED_INDUSTRIES.join(" | ")}.
For each industry write exactly 4 points, each 8 to 12 words, with specific capabilities, integrations, or compliance requirements relevant to city/country. No generic "custom software solutions".

SECTION 10: WHY CHOOSE AKOODE
H2: 8 to 9 words. Must reference target city/country businesses and Akoode as engineering partner.
Subtext exactly 30 to 40 words. Reference senior-led delivery, AI-first engineering, no subcontracting, and direct client access.
4 cards exactly in this order. Each explanation exactly 35 to 45 words so every card has useful depth:
No Subcontracting — Your Project Stays In-House.
AI-First Engineering — Live in Production.
Senior Engineers Lead Every Engagement.
Compliance Designed In From the Start.

SECTION 11: ENGAGEMENT MODELS
H2: Flexible Engagement Models for [CITY/COUNTRY] Software Development Projects.
Subtext exactly 30 to 40 words. Mention choice of model, dedicated engineers, full IP ownership, transparent communication, direct access to team.
Exactly 3 models in this order:
Dedicated Team, badge Most Popular, best for Projects requiring continuous development and long-term product evolution, 4 perks, CTA Post Your Requirement.
Fixed Cost, best for Projects with well-defined scope and clear deliverables, 3 perks, CTA Get a Quote.
Staff Augmentation, best for Filling skill gaps or accelerating development velocity, 3 perks, CTA Hire Team.

SECTION 12: FAQ
H2 fixed: Frequently Asked Questions.
Subtext exactly 20 to 30 words using this pattern: Straight answers on process, pricing, timelines, compliance, and what working with Akoode actually looks like for [CITY/COUNTRY] businesses.
Write exactly 12 FAQs — this is mandatory. The "items" array MUST contain 12 complete objects, each with a non-empty "question" and a non-empty "answer". Do not stop early, do not return fewer than 12, and never leave the FAQ array partial or truncated. If you are running low on space, shorten other optional prose but always finish all 12 FAQs and close the JSON.
Each question is an H3-equivalent. Each answer exactly 50 to 80 words. Include local context naturally in at least 6 answers.
Cover cost, timeline, startups vs enterprise, local compliance/data regulations, business-hour overlap, AI software, dedicated team vs staff augmentation, NDAs, taking over existing projects, industries, mobile apps, and getting started.

SECTION 13: RELATED BLOGS
H2 fixed: Reading from the Studio.
Subtext fixed: Notes, engineering decisions, and field lessons from the products we build every week.
No blog content. Blog cards are inserted manually.

SECTION 14: FINAL CTA
H2 fixed: Start Your Software Project with Akoode.
Subtext exactly 30 to 40 words. Reference sharing requirements, senior team review, one business day response time, and zero commitment on first contact.
Two stat lines fixed:
REPLY TIME: Response within 30 min
NDA-FRIENDLY: NDA signed on request
Form fields are UI components and unchanged.

INTERNAL LINKING RULES
City pages must include one link recommendation to the parent country page in implementationNotes. Use contextual anchor text, never exact-match primary keyword. Only use URLs from APPROVED SERVICES LIST or provided internal links. Include a compact linking table in implementationNotes as text entries because this CMS has no table field.

GLOBAL RULES
Hero subtext never starts with Akoode Technologies.
Stats strip is fixed.
Section 2 H2 fixed.
Geo banner follows fixed pattern.
Industries exactly 15 in exact order.
Case studies are placeholders only.
Blog H2 and subtext fixed.
FAQ H2 fixed.
All metadata outputs mandatory.
FAQ schema markup note must be included in implementationNotes.
No em dashes anywhere.
No Taiwan-agent style generic output. Match or exceed London-page quality.

==========================
COMPLETENESS REQUIREMENTS
==========================

This is a STRICT requirement.
The response MUST be 100% complete.
DO NOT partially generate the page.
DO NOT skip any section.
DO NOT shorten later sections because of context limits.
DO NOT omit FAQs.
DO NOT omit service cards.
DO NOT omit industry cards.
DO NOT omit engagement models.
DO NOT omit implementation notes.
DO NOT leave any field empty.
DO NOT return placeholders.
DO NOT return null.
DO NOT return [] for any required array.
Every required section defined in this prompt MUST be fully generated.
Every required object MUST contain every required property.
Every array MUST contain the exact number of objects specified in this prompt.
If a section cannot be completed because of token limitations, DO NOT return partial JSON. Instead regenerate internally until the entire response is complete.
The response is considered INVALID unless every required field is present.

==========================
NO FALLBACKS
==========================

Never assume another system will repair, replace, or complete missing content.
Never rely on fallback templates.
Never rely on default values.
Never rely on placeholder content.
Never rely on previously stored examples.
Generate every field from scratch.
Every heading. Every paragraph. Every FAQ. Every service. Every industry capability. Every metadata field. Every implementation note. Every CTA.
Everything must be uniquely generated for this page.

==========================
ORIGINALITY
==========================

Do not reuse wording from previous sections.
Do not reuse wording from previous pages.
Do not reuse wording from common software agency websites.
Every paragraph should be freshly written.
Every section should feel independently authored.

==========================
FINAL VALIDATION
==========================

Before returning JSON, silently validate:
- Every section exists.
- Every required array contains the exact required number of items.
- Every word-count rule is satisfied.
- Every metadata field is generated.
- Every internal link is generated.
- Every FAQ answer exists.
- Every service card exists.
- Every industry card exists.
- No placeholder exists.
- No fallback text exists.
- No duplicated paragraph exists.
- No repeated sentence opening exists.
- JSON is valid.
If any validation fails, regenerate internally before producing the final response.
Never mention this validation process.

RETURN ONLY VALID JSON. No markdown. No commentary. No code fences.
Use this exact JSON shape:
{
  "title": "",
  "slug": "",
  "country": "",
  "market": "",
  "hero": { "heading": "", "body": "", "heroImageAlt": "", "stats": [{ "icon": "BriefcaseStatIcon", "value": "180+", "label": "Projects Delivered", "sub": "Across global markets" }] },
  "chooseUs": { "heading": "Built with Precision. Validated by Results.", "intro": "", "features": [{ "icon": "FiTrendingUp", "title": "", "body": "" }], "clientLove": [{ "icon": "FiCheckCircle", "title": "", "body": "" }] },
  "whyLocation": { "heading": "", "para1": "", "para2": "", "para3": "", "features": [{ "icon": "FiTrendingUp", "title": "", "body": "" }], "imageAlt": "", "cardLocation": "", "cardHeading": "", "cardBody": "" },
  "process": { "heading": "", "intro": "", "services": [{ "n": "01", "title": "", "subtitle": "", "para": "", "points": [""], "tags": [""] }] },
  "whatWeDo": { "heading": "", "subtitle": "", "steps": [{ "shortTitle": "", "title": "", "body": "", "timeline": "", "timelineNote": "", "deliverables": [""] }] },
  "techStack": { "heading": "", "subtitle": "", "cats": [{ "icon": "", "title": "", "desc": "", "pills": [{ "e": "", "label": "" }] }] },
  "industries": { "heading": "", "subtitle": "", "items": [{ "icon": "", "name": "Healthcare", "points": ["", "", "", ""] }] },
  "whyChoose": { "heading": "", "subtitle": "", "cards": [{ "icon": "", "title": "", "desc": "" }], "ctaHeading": "", "ctaBody": "", "ctaText": "Talk to Akoode", "ctaLink": "/post-requirement" },
  "engagement": { "heading": "", "subtitle": "", "models": [{ "badge": "", "title": "Dedicated Team", "best": "", "body": "", "perks": [""], "ctaText": "Post Your Requirement", "ctaLink": "/post-requirement" }] },
  "faq": { "heading": "Frequently Asked Questions", "subtitle": "", "items": [{ "question": "", "answer": "" }] },
  "caseStudies": { "heading": "Outcomes You Can Take to Your Board Meeting", "subtitle": "" },
  "blog": { "heading": "Reading from the Studio", "subtitle": "Notes, engineering decisions, and field lessons from the products we build every week." },
  "finalCta": { "heading": "Start Your Software Project with Akoode", "body": "", "replyTime": "Response within 30 min", "nda": "NDA signed on request" },
  "meta": { "title": "", "description": "" },
  "implementationNotes": ["Add FAQ schema markup for the generated FAQ items on this page."]
}`;
}

module.exports = { buildSbcSeoSuggestionPrompt, FIXED_INDUSTRIES, KEYWORD_REFERENCES, APPROVED_SERVICE_URLS };

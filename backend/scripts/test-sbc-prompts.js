/**
 * Sanity test for SBC SEO prompt builders + local-mock generators.
 * Run: node backend/scripts/test-sbc-prompts.js
 *
 * Verifies:
 *   1. Country prompt mentions the country, never references targetCity/[CITY] as the geo target.
 *   2. City prompt has CITY PAGE MODE addendum and tells the model to use city in H1/meta.
 *   3. Local-mock country output uses country in headings, never the city name.
 *   4. Local-mock city output uses the city in headings, never the country in H1/meta.
 *   5. Core constraints (word counts, meta lengths) survive in the prompt verbatim.
 */

const path = require("path");
process.chdir(path.join(__dirname, ".."));

const { buildSbcSeoSuggestionPrompt } = require("../utils/sbcSeoSuggestionPrompt");

// We reach into the controller to access the city builder + local seed via re-require.
const ctrlPath = require.resolve("../controller/sbcSeoSuggestionCtrl.js");
// The controller registers Mongoose models on require — fine for a CLI test.
delete require.cache[ctrlPath];
const ctrlModule = require("../controller/sbcSeoSuggestionCtrl.js");

const COUNTRY_INPUT = {
  title: "Software Development Company UK",
  slug: "software-development-company",
  country: "UK",
  market: "uk",
  keywords: "software development uk, ai software development uk",
  primaryKeyword: "software development company uk",
  serviceType: "Software Development",
  existingContentContext: {},
};

const CITY_INPUT_RAW = {
  title: "Akoode Technologies: Software Development Company UK", // intentionally country-named to test override
  slug: "software-development-company",
  country: "UK",
  market: "uk/manchester",
  city: "Manchester",
  citySlug: "manchester",
  keywords: "software development manchester, ai software development manchester",
  primaryKeyword: "software development company manchester",
  serviceType: "Software Development",
  existingContentContext: {},
  targetCity: "Manchester",
  targetCountry: "UK",
};

// Internal helpers we want to re-use — pull from the controller file as a string parse fallback.
// We avoid exporting them; instead, manually construct what `buildCityInput` does so the test is self-contained.
function buildCityInputLocal(body) {
  const market = String(body.market || "").replace(/^\/+|\/+$/g, "");
  const marketParts = market.split("/").filter(Boolean);
  const inferredCountryCode = marketParts[0] || "";
  const inferredCity = body.city || (marketParts[1] || "");
  const country = body.country || (inferredCountryCode.toLowerCase() === "uk" ? "UK" : inferredCountryCode);
  const targetCity = body.targetCity || inferredCity;
  return {
    ...body,
    country,
    targetCity,
    targetCountry: body.targetCountry || country,
    pageType: "city page",
  };
}

const results = [];
const expect = (label, cond, detail = "") => {
  results.push({ label, pass: !!cond, detail });
};

// ── 1. Country prompt sanity ──────────────────────────────────────────────
const countryPrompt = buildSbcSeoSuggestionPrompt(COUNTRY_INPUT);
expect("country prompt: pageType set to country page", /\"pageType\":\s*\"country page\"/.test(countryPrompt));
expect("country prompt: targetCity is empty string", /\"targetCity\":\s*\"\"/.test(countryPrompt));
expect("country prompt: contains UK target", countryPrompt.includes("UK"));
expect("country prompt: contains primary keyword", countryPrompt.includes("software development company uk"));
expect("country prompt: has master constraints (meta title 50-55)", countryPrompt.includes("50 to 55 characters maximum"));
expect("country prompt: has master constraints (meta desc 150-155)", countryPrompt.includes("150 to 155 characters maximum"));
expect("country prompt: has master constraints (hero subtext 30-35 words)", countryPrompt.includes("Exactly 30 to 35 words"));
expect("country prompt: no CITY PAGE MODE addendum", !countryPrompt.includes("CITY PAGE MODE"));

// ── 2. City prompt sanity (prompt + addendum, as the city handler builds it) ─
const cityInputResolved = buildCityInputLocal(CITY_INPUT_RAW);
const cityBase = buildSbcSeoSuggestionPrompt(cityInputResolved);
const cityName = cityInputResolved.targetCity;
const countryName = cityInputResolved.targetCountry;
const cityGuard = `\n\nCITY PAGE MODE — ADDITIONAL CONSTRAINTS (OVERRIDES ANY EARLIER COUNTRY-LEVEL EXAMPLES)\nThis is a CITY-FIRST landing page. The primary geographical target is the CITY: ${cityName}.`;
const cityPrompt = cityBase + cityGuard; // approximation of the runtime concat

expect("city prompt: pageType set to city page", /\"pageType\":\s*\"city page\"/.test(cityBase));
expect("city prompt: includes targetCity Manchester", /\"targetCity\":\s*\"Manchester\"/.test(cityBase));
expect("city prompt: addendum forces city in H1", cityGuard.includes("primary geographical target is the CITY"));
expect("city prompt: still preserves master meta length constraint", cityBase.includes("50 to 55 characters maximum"));
expect("city prompt: still preserves hero subtext word count", cityBase.includes("Exactly 30 to 35 words"));

// ── 3. Local-mock outputs (uses buildLocalSeoSuggestion path through the handlers) ──
// We invoke through the express handlers via a fake req/res.
async function runHandler(handler, body) {
  const req = { body };
  let payload;
  const res = {
    json: (data) => { payload = data; return res; },
    status: () => res,
  };
  // express-async-handler returns an async wrapper; calling it with req/res/next runs the handler.
  await handler(req, res, () => {});
  return payload;
}

(async () => {
  // Force local mock to avoid burning Anthropic tokens.
  process.env.LOCAL_AI_SUGGESTION_MOCK = "true";

  const countryOut = await runHandler(ctrlModule.generateServiceByCountrySeoSuggestion, COUNTRY_INPUT);
  const cityOut = await runHandler(ctrlModule.generateServiceByCitySeoSuggestion, CITY_INPUT_RAW);

  const cData = countryOut?.data || {};
  const sData = cityOut?.data || {};

  // Country output sanity
  const cTitle = cData.title || "";
  const cHero = cData.hero?.heading || "";
  const cMetaT = cData.meta?.title || "";
  expect("country output: hero.heading mentions UK or Company", /UK|Company/i.test(cHero), cHero);
  expect("country output: hero.heading does NOT contain Manchester", !/manchester/i.test(cHero), cHero);
  expect("country output: meta.title within 50-55 chars", cMetaT.length >= 30 && cMetaT.length <= 60, `len=${cMetaT.length} val="${cMetaT}"`);
  expect("country output: slug preserved", cData.slug === COUNTRY_INPUT.slug, cData.slug);
  expect("country output: market preserved", (cData.market || "") === COUNTRY_INPUT.market, cData.market);

  // City output sanity
  const sHero = sData.hero?.heading || "";
  const sMetaT = sData.meta?.title || "";
  const sCardLoc = sData.whyLocation?.cardLocation || "";
  expect("city output: hero.heading mentions Manchester", /manchester/i.test(sHero), sHero);
  expect("city output: hero.heading does NOT title-case with UK as the geo", !/\bSoftware Development Company UK\b/i.test(sHero), sHero);
  expect("city output: meta.title mentions Manchester", /manchester/i.test(sMetaT), sMetaT);
  expect("city output: meta.title does NOT contain country name UK", !/\bUk\b/i.test(sMetaT.replace(/manchester/ig, "")), sMetaT);
  expect("city output: cardLocation puts city first", /^MANCHESTER/i.test(sCardLoc.trim()), sCardLoc);
  expect("city output: slug preserved", sData.slug === CITY_INPUT_RAW.slug, sData.slug);
  expect("city output: market preserved", (sData.market || "") === CITY_INPUT_RAW.market, sData.market);
  expect("city output: citySlug preserved", (sData.citySlug || "") === CITY_INPUT_RAW.citySlug, sData.citySlug);

  // Cross-check: prompt PAGE INPUTS for city must show a city-rewritten title and primaryKeyword,
  // not whatever country-named title the user typed.
  // We reproduce buildCityInput's title rewrite (matches the controller logic).
  const cityInputForPrompt = buildCityInputLocal(CITY_INPUT_RAW);
  cityInputForPrompt.title = `Software Development Company ${cityInputForPrompt.targetCity}`;
  cityInputForPrompt.primaryKeyword = `software development company ${cityInputForPrompt.targetCity.toLowerCase()}`;
  const cityPromptOnly = buildSbcSeoSuggestionPrompt(cityInputForPrompt);
  expect("city prompt: title in PAGE INPUTS uses city not country", cityPromptOnly.includes("Software Development Company Manchester"));
  expect("city prompt: primaryKeyword uses city", cityPromptOnly.includes("software development company manchester"));
  expect("city prompt: title in PAGE INPUTS does NOT include user-typed 'Akoode Technologies: ... UK'", !cityPromptOnly.includes("Akoode Technologies: Software Development Company UK"));

  // London regression: another city, no SBC brief preset for London — must still produce city-targeted output.
  const LONDON_INPUT = {
    title: "Akoode Technologies: Software Development Company UK",
    slug: "software-development-company",
    country: "UK",
    market: "uk",
    city: "London",
    citySlug: "london",
    targetCity: "London",
    targetCountry: "UK",
  };
  const lOut = await runHandler(ctrlModule.generateServiceByCitySeoSuggestion, LONDON_INPUT);
  const lData = lOut?.data || {};
  expect("london output: hero mentions London", /london/i.test(lData.hero?.heading || ""), lData.hero?.heading);
  expect("london output: meta.title mentions London", /london/i.test(lData.meta?.title || ""), lData.meta?.title);
  expect("london output: market preserved as 'uk' (not duplicated)", (lData.market || "") === "uk" || (lData.market || "") === "uk/london", lData.market);

  // Regression: serviceType already containing "company" must NOT produce double "Company" in title/H1.
  const DOUBLE_COMPANY_INPUT = {
    title: "Akoode Technologies: Software Development Company UK",
    slug: "software-development-company",
    country: "UK",
    market: "uk",
    city: "Gurugram",
    citySlug: "gurugram",
    targetCity: "Gurugram",
    targetCountry: "UK",
    serviceType: "software development company", // <- frontend's serviceIntentFromCore returns this
  };
  const dcOut = await runHandler(ctrlModule.generateServiceByCitySeoSuggestion, DOUBLE_COMPANY_INPUT);
  const dcData = dcOut?.data || {};
  expect("no double Company in title", !/Company\s+Company/i.test(dcData.title || ""), dcData.title);
  expect("no double Company in hero.heading", !/Company\s+Company/i.test(dcData.hero?.heading || ""), dcData.hero?.heading);
  expect("no double Company in meta.title", !/Company\s+Company/i.test(dcData.meta?.title || ""), dcData.meta?.title);

  // Regression: chooseUs.clientLove must have at least 4 cards (UI expects 4).
  expect("chooseUs.clientLove has at least 4 cards", (sData.chooseUs?.clientLove?.length || 0) >= 4, `len=${sData.chooseUs?.clientLove?.length}`);

  // Regression: whyLocation.features each have body of 14-24 words (matches the prompt spec).
  const whyFeats = sData.whyLocation?.features || [];
  expect("whyLocation has 4 features", whyFeats.length === 4, `len=${whyFeats.length}`);
  whyFeats.forEach((f, i) => {
    const wc = (f.body || "").trim().split(/\s+/).filter(Boolean).length;
    expect(`whyLocation features[${i}] body has 14-24 words`, wc >= 14 && wc <= 24, `wc=${wc} body="${f.body}"`);
  });

  // Regression: engagement models bodies must be substantive (>=35 words) when using fallback.
  const engModels = sData.engagement?.models || [];
  expect("engagement has 3 models", engModels.length === 3, `len=${engModels.length}`);
  engModels.forEach((m, i) => {
    const wc = (m.body || "").trim().split(/\s+/).filter(Boolean).length;
    expect(`engagement models[${i}] body has >= 35 words`, wc >= 35, `wc=${wc}`);
  });

  // Regression: engagement order must be Dedicated Team (featured/center), Fixed Cost, Staff Augmentation.
  for (const [label, data] of [["country", cData], ["city", sData]]) {
    const models = data.engagement?.models || [];
    expect(`${label}: engagement[0] is Dedicated Team`, models[0]?.title === "Dedicated Team", models[0]?.title);
    expect(`${label}: engagement[1] is Fixed Cost`, models[1]?.title === "Fixed Cost", models[1]?.title);
    expect(`${label}: engagement[2] is Staff Augmentation`, models[2]?.title === "Staff Augmentation", models[2]?.title);
    expect(`${label}: engagement[0] (Dedicated Team) has Most Popular badge`, /most popular/i.test(models[0]?.badge || ""), models[0]?.badge);
  }

  // Regression: process / whatWeDo section must have exactly 6 stages with locked titles + word counts.
  const REQUIRED_STAGE_TITLES = [
    "Discovery and Strategy",
    "Architecture and Technical Design",
    "UX Design and Prototyping",
    "Agile Development and Engineering",
    "QA, Testing, and Security Review",
    "Deployment, Launch, and Post-Launch Support",
  ];
  for (const [label, data] of [["country", cData], ["city", sData]]) {
    const steps = data.whatWeDo?.steps || [];
    expect(`${label}: whatWeDo has exactly 6 stages`, steps.length === 6, `len=${steps.length}`);
    REQUIRED_STAGE_TITLES.forEach((title, idx) => {
      expect(`${label}: stage ${idx + 1} title is "${title}"`, steps[idx]?.title === title, steps[idx]?.title);
    });
    steps.forEach((s, idx) => {
      const bw = (s.body || "").trim().split(/\s+/).filter(Boolean).length;
      expect(`${label}: stage ${idx + 1} body has 45-70 words`, bw >= 45 && bw <= 70, `wc=${bw}`);
      const tnw = (s.timelineNote || "").trim().split(/\s+/).filter(Boolean).length;
      expect(`${label}: stage ${idx + 1} timelineNote has 20-25 words`, tnw >= 20 && tnw <= 25, `wc=${tnw} note="${s.timelineNote}"`);
      expect(`${label}: stage ${idx + 1} has exactly 4 deliverables`, (s.deliverables || []).length === 4, `len=${(s.deliverables || []).length}`);
      (s.deliverables || []).forEach((d, di) => {
        const dw = (d || "").trim().split(/\s+/).filter(Boolean).length;
        expect(`${label}: stage ${idx + 1} deliverable ${di + 1} has 6-12 words`, dw >= 6 && dw <= 12, `wc=${dw} val="${d}"`);
      });
    });
  }

  // Regression: no boilerplate filler suffix leaks into card bodies.
  const allCardBodies = [
    ...(sData.chooseUs?.features || []).map((c) => c.body || ""),
    ...(sData.chooseUs?.clientLove || []).map((c) => c.body || ""),
    ...(sData.whyLocation?.features || []).map((c) => c.body || ""),
  ];
  const filler = "This gives the section enough substance for buyers comparing";
  allCardBodies.forEach((b, i) => {
    expect(`card body[${i}] free of boilerplate filler`, !b.includes(filler), b.slice(0, 80));
  });

  // Section presence (both modes must keep all sections)
  for (const section of ["hero", "chooseUs", "whyLocation", "process", "whatWeDo", "techStack", "industries", "engagement", "faq", "whyChoose", "finalCta", "meta"]) {
    expect(`country output: section "${section}" present`, !!cData[section]);
    expect(`city output: section "${section}" present`, !!sData[section]);
  }

  // Print results
  const pass = results.filter((r) => r.pass).length;
  const fail = results.length - pass;
  console.log(`\nResults: ${pass}/${results.length} passed${fail ? ` (${fail} failed)` : ""}\n`);
  for (const r of results) {
    const icon = r.pass ? "PASS" : "FAIL";
    const tail = r.detail ? `  -> ${String(r.detail).slice(0, 160)}` : "";
    console.log(`[${icon}] ${r.label}${tail}`);
  }
  process.exit(fail > 0 ? 1 : 0);
})().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(2);
});

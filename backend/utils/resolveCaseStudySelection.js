const CaseStudyLatest = require("../models/caseStudyLatestModel");

// The old Casestudy model/collection is empty — case studies now live in
// CaseStudyLatest (powers /case-study-v2/[slug]). Remap its hero.* fields
// into the flat shape CaseStudies.jsx already expects (industry, country,
// shortdescription, casestudyimage, whychooseus pulse stats), so the
// country/city page card UI doesn't need to change.
const mapCaseStudyLatestToCard = (doc) => {
  const chips = doc?.hero?.metaChips || [];
  const industry = chips.find((c) => c.label === "Industry")?.value || "";
  const clientValue = chips.find((c) => c.label === "Client")?.value || "";
  const country = clientValue.includes(",") ? clientValue.split(",").pop().trim() : "";
  const cards = doc?.hero?.floatingCards || [];
  return {
    _id: doc._id,
    title: doc.title,
    slug: doc.slug,
    industry,
    country,
    shortdescription: doc?.hero?.body || "",
    description: doc?.hero?.body || "",
    casestudyimage: doc?.hero?.listingImage || doc?.hero?.heroImage || "",
    whychooseus: {
      pulseStat1Value: cards[0]?.value || "",
      pulseStat1Label: cards[0]?.label || "",
      pulseStat2Value: cards[1]?.value || "",
      pulseStat2Label: cards[1]?.label || "",
    },
    rethinking: doc.rethinking,
    challenges: doc.challenges,
    build: doc.build,
  };
};

// Resolve the three case-study cards for a country/city page.
// Slots picked in the admin form (featuredCase + otherCases) win; any slot
// left empty — or whose pick is unpublished/deleted — falls back to the most
// recently published case studies not already used in another slot.
const resolveCaseStudySelection = async (caseStudies) => {
  const selection = caseStudies || {};
  const featuredId = selection.featuredCase ? String(selection.featuredCase) : null;
  const otherIds = (selection.otherCases || []).filter(Boolean).map(String).slice(0, 2);
  const slots = [featuredId, otherIds[0] || null, otherIds[1] || null];

  const chosenIds = slots.filter(Boolean);
  const chosenDocs = chosenIds.length
    ? await CaseStudyLatest.find({ _id: { $in: chosenIds }, status: true }).lean()
    : [];
  const byId = new Map(chosenDocs.map((d) => [String(d._id), d]));

  const resolved = slots.map((id) => (id && byId.get(id)) || null);
  const missing = resolved.filter((d) => !d).length;
  if (missing > 0) {
    const fillers = await CaseStudyLatest.find({ status: true, _id: { $nin: chosenIds } })
      .sort({ createdAt: -1 })
      .limit(missing)
      .lean();
    for (let i = 0; i < resolved.length; i++) {
      if (!resolved[i]) resolved[i] = fillers.shift() || null;
    }
  }

  const mapped = resolved.filter(Boolean).map(mapCaseStudyLatestToCard);
  return {
    ...selection,
    featuredCase: mapped[0] || null,
    otherCases: mapped.slice(1, 3),
  };
};

module.exports = { resolveCaseStudySelection, mapCaseStudyLatestToCard };

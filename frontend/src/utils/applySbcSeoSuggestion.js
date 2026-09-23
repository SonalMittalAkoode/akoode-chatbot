const withIds = (items, uid, mapItem = (x) => x) =>
  Array.isArray(items) ? items.map((item, index) => ({ id: uid(), ...mapItem(item || {}, index) })) : [];

const asPills = (pills) =>
  Array.isArray(pills) ? pills.map((pill) => ({ e: pill.e || "", label: pill.label || "", img: null, imgPreview: "" })) : [];

/* Which page sections each backend generation group owns. Mirrors
   GROUP_RESULT_KEYS in backend/controller/sbcSeoSuggestionCtrl.js — keep the two
   in sync. Sections absent from every group (title/slug/market, techStack,
   caseStudies, blog) are not AI-authored per group, so a single-phase run must
   leave them untouched. */
export const GROUP_SECTIONS = {
  group1: ["hero", "chooseUs", "whyLocation"],
  group2: ["process", "whatWeDo"],
  group3: ["industries", "engagement", "whyChoose"],
  group4: ["faq", "finalCta", "meta"],
};

/* Labels for the admin UI's per-phase buttons. */
export const GROUP_LABELS = {
  group1: "Hero, Why Choose Us & Why Location",
  group2: "Services & Delivery Process",
  group3: "Industries, Engagement & Why Choose",
  group4: "FAQ, Final CTA & Meta",
};

/**
 * Writes a generation response into the admin form.
 *
 * @param groups  Optional array of group labels (e.g. ["group2"]). When given,
 *   ONLY that group's sections are written — everything else in the form is left
 *   exactly as the editor left it. Omit (or pass null/[]) for the original
 *   whole-page behaviour, which is unchanged.
 */
export function applySbcSeoSuggestion(suggestion, setters, uid, groups = null) {
  const s = suggestion || {};
  const hero = s.hero || {};
  const chooseUs = s.chooseUs || {};
  const whyLocation = s.whyLocation || {};
  const process = s.process || {};
  const whatWeDo = s.whatWeDo || {};
  const techStack = s.techStack || {};
  const industries = s.industries || {};
  const whyChoose = s.whyChoose || {};
  const engagement = s.engagement || {};
  const faq = s.faq || {};
  const finalCta = s.finalCta || {};
  const meta = s.meta || {};

  const scoped = Array.isArray(groups) && groups.length > 0;
  const allowed = scoped
    ? new Set(groups.flatMap((g) => GROUP_SECTIONS[g] || []))
    : null;
  // Sections outside every group ("core", techStack, caseStudies, blog) are
  // written only on a full run — `scoped` short-circuits them to false.
  const want = (section) => !scoped || allowed.has(section);

  if (want("core")) {
    if (s.title) setters.setTitle(s.title);
    if (s.slug) {
      setters.setSlug(s.slug);
      setters.setSlugEdited?.(true);
    }
    if (s.country !== undefined) setters.setCountry?.(s.country || "");
    if (s.market) {
      setters.setMarket(s.market.replace(/^\/+|\/+$/g, ""));
      setters.setMarketEdited?.(true);
    }
  }

  if (want("hero")) {
    setters.setHeroShow(true);
    setters.setHeroHeading(hero.heading || "");
    setters.setHeroBody(hero.body || "");
    setters.setHeroCta1(hero.cta1 || "Start your project");
    setters.setHeroCta1Link(hero.cta1Link || "/post-requirement");
    setters.setHeroCta2(hero.cta2 || "See our work");
    setters.setHeroCta2Link(hero.cta2Link || "/case-studies");
    setters.setHeroImageAlt(hero.heroImageAlt || "Akoode software development team workspace");
    setters.setHeroStats(withIds(hero.stats, uid, (item) => ({
      icon: item.icon || "BriefcaseStatIcon",
      value: item.value || "",
      label: item.label || "",
      sub: item.sub || "",
    })));
  }

  if (want("chooseUs")) {
    setters.setChooseUsShow(true);
    setters.setChooseUsHeading(chooseUs.heading || "Built with Precision. Validated by Results.");
    setters.setChooseUsIntro(chooseUs.intro || "");
    setters.setChooseUsFeatures(withIds(chooseUs.features, uid, (item) => ({ icon: item.icon || "FiTrendingUp", title: item.title || "", body: item.body || "" })));
    setters.setClientLove(withIds(chooseUs.clientLove, uid, (item) => ({ icon: item.icon || "FiCheckCircle", title: item.title || "", body: item.body || "" })));
  }

  if (want("whyLocation")) {
    setters.setWhyShow(true);
    setters.setWhyHeading(whyLocation.heading || "");
    setters.setWhyPara1(whyLocation.para1 || "");
    setters.setWhyPara2(whyLocation.para2 || "");
    setters.setWhyPara3(whyLocation.para3 || "");
    setters.setWhyFeatures(withIds(whyLocation.features, uid, (item) => ({ icon: item.icon || "FiTrendingUp", title: item.title || "", body: item.body || "" })));
    setters.setWhyImageAlt(whyLocation.imageAlt || "Local software development market context");
    setters.setWhyCardLocation(whyLocation.cardLocation || "");
    setters.setWhyCardHeading(whyLocation.cardHeading || "");
    setters.setWhyCardBody(whyLocation.cardBody || "");
  }

  if (want("process")) {
    setters.setProcessShow(true);
    setters.setProcessHeading(process.heading || "");
    setters.setProcessIntro(process.intro || "");
    setters.setProcessServices(withIds(process.services, uid, (item, index) => ({
      n: item.n || String(index + 1).padStart(2, "0"),
      title: item.title || "",
      subtitle: item.subtitle || "",
      para: item.para || "",
      points: Array.isArray(item.points) ? item.points : [],
      tags: Array.isArray(item.tags) ? item.tags : [],
      ctaText: item.ctaText || "Start your project",
      ctaLink: item.ctaLink || "/post-requirement",
    })));
  }

  if (want("whatWeDo")) {
    setters.setWhatWeDoShow(true);
    setters.setWhatWeDoHeading(whatWeDo.heading || "");
    setters.setWhatWeDoSubtitle(whatWeDo.subtitle || "");
    setters.setWhatWeDoSteps(withIds(whatWeDo.steps, uid, (item) => ({
      shortTitle: item.shortTitle || "",
      title: item.title || "",
      body: item.body || "",
      timeline: item.timeline || "",
      timelineNote: item.timelineNote || "",
      deliverables: Array.isArray(item.deliverables) ? item.deliverables : [],
    })));
  }

  if (want("techStack")) {
    setters.setTechStackShow(true);
    setters.setTechStackHeading(techStack.heading || "");
    setters.setTechStackSubtitle(techStack.subtitle || "");
    setters.setTechCats(withIds(techStack.cats, uid, (item) => ({
      title: item.title || "",
      icon: item.icon || "",
      iconImg: null,
      iconImgPreview: "",
      desc: item.desc || "",
      pills: asPills(item.pills),
    })));
  }

  if (want("industries")) {
    setters.setIndustriesShow(true);
    setters.setIndustriesHeading(industries.heading || "");
    setters.setIndustriesSubtitle(industries.subtitle || "");
    setters.setIndustries(withIds(industries.items, uid, (item) => ({
      iconImg: null,
      iconImgPreview: "",
      iconAlt: item.iconAlt || "",
      name: item.name || "",
      points: Array.isArray(item.points) ? item.points : [],
      ctaLink: item.ctaLink || "",
    })));
  }

  if (want("whyChoose")) {
    setters.setWhyChooseShow(true);
    setters.setWhyChooseHeading(whyChoose.heading || "");
    setters.setWhyChooseSubtitle(whyChoose.subtitle || "");
    setters.setWhyChooseCards(withIds(whyChoose.cards, uid, (item) => ({ icon: item.icon || "", title: item.title || "", desc: item.desc || "" })));
    setters.setWhyChooseCtaHeading(whyChoose.ctaHeading || "");
    setters.setWhyChooseCtaBody(whyChoose.ctaBody || "");
    setters.setWhyChooseCtaText(whyChoose.ctaText || "Talk to Akoode");
    setters.setWhyChooseCtaLink(whyChoose.ctaLink || "/post-requirement");
  }

  if (want("engagement")) {
    setters.setEngagementShow(true);
    setters.setEngagementHeading(engagement.heading || "");
    setters.setEngagementSubtitle(engagement.subtitle || "");
    setters.setEngagementModels?.(withIds(engagement.models, uid, (item) => ({
      badge: item.badge || "",
      title: item.title || "",
      best: item.best || "",
      body: item.body || "",
      perks: Array.isArray(item.perks) ? item.perks : [],
      ctaText: item.ctaText || "Discuss this model",
      ctaLink: item.ctaLink || "/post-requirement",
    })));
  }

  if (want("faq")) {
    setters.setFaqShow(true);
    setters.setFaqHeading(faq.heading || "");
    setters.setFaqSubtitle(faq.subtitle || "");
    setters.setFaqs(withIds(faq.items, uid, (item) => ({ question: item.question || "", answer: item.answer || "" })));
  }

  if (want("caseStudies")) {
    setters.setCaseStudiesShow(true);
    setters.setCaseStudiesHeading?.(s.caseStudies?.heading || "Outcome-focused software delivery examples.");
    setters.setCaseStudiesSubtitle?.(s.caseStudies?.subtitle || "Case studies can be selected manually from the CMS after the page copy is reviewed.");
    setters.setTestimonialsShow(true);
    setters.setBlogShow(true);
    setters.setBlogHeading?.(s.blog?.heading || "Software development insights from Akoode.");
    setters.setBlogSubtitle?.(s.blog?.subtitle || "Blogs can be selected manually from the CMS to support internal linking and topical relevance.");
  }

  if (want("finalCta")) {
    setters.setFinalCtaShow(true);
    setters.setFinalCtaHeading(finalCta.heading || "Start Your Software Project with Akoode");
    setters.setFinalCtaBody(finalCta.body || "");
    setters.setFinalCtaReplyTime(finalCta.replyTime || "We respond to all project enquiries within 1 business day");
    setters.setFinalCtaNda(finalCta.nda || "NDA signed before any technical or commercial discussion begins");
  }

  if (want("meta")) {
    setters.setMetaTitle(meta.title || "");
    setters.setMetaDescription(meta.description || "");
  }
}

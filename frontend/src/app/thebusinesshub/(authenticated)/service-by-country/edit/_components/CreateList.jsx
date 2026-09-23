"use client";

import { useState, useEffect, useRef } from "react";
import { Reorder } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { generateSBCSeoSuggestionsAPI, getSBCById, updateSBCAPI } from "@/api/serviceByCountry";
import { getBlogTableData } from "@/api/blog";
import SectionCard from "../../../services/_components/SectionCard";
import StepCard from "../../../services/_components/StepCard";
import UploadWithAlt from "@/components/admin/UploadWithAlt";
import HtmlEditor from "@/components/HtmlEditor";
import IconPicker from "@/components/admin/IconPicker";
import CaseStudyPicker from "@/components/admin/CaseStudyPicker";
import { useSbcFieldAiTools } from "@/components/admin/SbcFieldAiTools";
import { fileNameToAlt } from "@/utils/imageAlt";
import { applySbcSeoSuggestion } from "@/utils/applySbcSeoSuggestion";
import SbcPhaseGenerateButtons from "@/components/admin/SbcPhaseGenerateButtons";
import { buildFormAwareKeywordBrief, inferKeywordBrief, SBC_KEYWORD_BRIEFS } from "@/utils/sbcSeoSuggestionData";
import TemplatePicker from "@/components/admin/TemplatePicker";
import { V2HeroStatsFields, V2EcomHeroFields, V2AiHeroBadgeFields, seedHeroStats, V2IndustriesFields, V2TechnologiesFields, V2TestimonialsFields } from "@/components/admin/V2SectionFields";
import { DEFAULT_PAGE_TEMPLATE, normalizeTemplate, usesHeroBadges, usesHeroStats, usesV2Sections } from "@/config/pageTemplates";

// ─── helpers ────────────────────────────────────────────────────────────────
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const STATIC_INDUSTRIES = [
  'Healthcare', 'Retail and E-Commerce', 'Media and Entertainment',
  'Finance and Banking', 'Automotive', 'Agriculture', 'Telecommunication',
  'Manufacturing', 'Public Sector and Government', 'Real Estate',
  'Energy and Utilities', 'Travel and Hospitality', 'Education',
  'Insurance', 'Logistics and Supply Chain',
];
const mergeWithStaticIndustries = (saved) =>
  STATIC_INDUSTRIES.map(name => {
    const match = (saved || []).find(x => String(x.name || "").trim().toLowerCase() === name.toLowerCase());
    return match
      ? { ...match, name }
      : { id: uid(), name, points: [""] };
  });

const STATIC_STEPS = [
  { shortTitle: "Discovery", title: "Discovery and Strategy" },
  { shortTitle: "Architecture", title: "Architecture and Technical Design" },
  { shortTitle: "UX Design", title: "UX Design and Prototyping" },
  { shortTitle: "Development", title: "Agile Development and Engineering" },
  { shortTitle: "QA & Security", title: "QA, Testing, and Security Review" },
  { shortTitle: "Launch", title: "Deployment, Launch, and Post-Launch Support" },
];
const mergeWithStaticSteps = (saved) =>
  STATIC_STEPS.map(step => {
    const match = (saved || []).find(x => String(x.shortTitle || "").trim().toLowerCase() === step.shortTitle.toLowerCase());
    return match
      ? { ...match, shortTitle: step.shortTitle, title: step.title }
      : { id: uid(), shortTitle: step.shortTitle, title: step.title, body: "", timeline: "", timelineNote: "", deliverables: [""] };
  });

const buildAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL || ""}${path}`;
};
const toSlug = (val) =>
  val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const emptyFeature = () => ({ id: uid(), icon: "", title: "", body: "" });
const emptyIndustry = () => ({ id: uid(), iconImg: null, iconImgPreview: "", iconImgExisting: "", iconAlt: "", name: "", points: [""], ctaLink: "" });
const emptyFaq = () => ({ id: uid(), question: "", answer: "" });
const emptyPlatformRating = () => ({ id: uid(), name: "", img: null, imgPreview: "", imgExisting: "", imgAlt: "", rating: "" });
const emptyClientLove = () => ({ id: uid(), icon: "", title: "", body: "" });
const emptyProcessService = () => ({ id: uid(), n: "", title: "", subtitle: "", para: "", points: [""], tags: [""], ctaText: "", ctaLink: "" });
const emptyWhatWeDoStep = () => ({ id: uid(), shortTitle: "", title: "", body: "", timeline: "", timelineNote: "", deliverables: [""] });
const emptyTechCat = () => ({ id: uid(), title: "", icon: "", iconImg: null, iconImgPreview: "", iconImgExisting: "", desc: "", pills: [{ e: "", label: "", img: null, imgPreview: "", imgExisting: "" }] });
const emptyEngagementModel = () => ({ id: uid(), badge: "", title: "", best: "", body: "", perks: [""], ctaText: "", ctaLink: "" });
const cloneFormValue = (value) => {
  if (typeof File !== "undefined" && value instanceof File) return value;
  if (Array.isArray(value)) return value.map(cloneFormValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneFormValue(item)]));
  }
  return value;
};

const normalizePathPart = (value = "") => String(value || "").replace(/^\/+|\/+$/g, "");

const buildPreviewUrl = ({ market, slug, editPath }) => {
  // Preview must open the SAME origin the admin runs on, because that origin's backend
  // is where the draft was just saved. Using NEXT_PUBLIC_SITE_URL (production) made
  // local edits open akoode.com and render stale production data (e.g. an older doc
  // with no FAQ) instead of the draft you just saved.
  const siteUrl = (typeof window !== "undefined" && window.location.origin) || process.env.NEXT_PUBLIC_SITE_URL || "";
  const secret = process.env.NEXT_PUBLIC_PREVIEW_SECRET || "";
  const redirectTo = `/${normalizePathPart(market)}/${normalizePathPart(slug)}`;
  const params = new URLSearchParams({ secret, redirect: redirectTo });
  if (editPath) params.set("edit", editPath);
  return `${siteUrl}/api/preview/enable?${params.toString()}`;
};

const openPreviewUrl = (url, editPath = "") => {
  if (process.env.NEXT_PUBLIC_LOCAL_AI_SUGGESTION_TEST === "true") {
    if (editPath) window.history.replaceState(null, "", editPath);
    window.location.assign(url);
    return false;
  }
  const opened = window.open(url, "_blank");
  if (opened) {
    try { opened.opener = null; } catch {}
    return true;
  }
  // Popup was blocked — fall back to same-tab navigation.
  if (editPath) window.history.replaceState(null, "", editPath);
  window.location.assign(url);
  return false;
};

const SECTION_NAV = [
  { id: "sec-core",        label: "Core Info" },
  { id: "sec-hero",        label: "Hero" },
  { id: "sec-chooseus",    label: "Choose Us" },
  { id: "sec-whylocation", label: "Why Location" },
  { id: "sec-process",     label: "Process" },
  { id: "sec-whatwedo",    label: "What We Do" },
  { id: "sec-techstack",   label: "Tech Stack" }, // v2 templates only; hidden for default via usesV2Sections
  { id: "sec-industries",  label: "Industries" },
  { id: "sec-engagement",  label: "Engagement" },
  { id: "sec-faq",         label: "FAQ" },
  { id: "sec-casestudies", label: "Case Studies" },
  { id: "sec-testimonials",label: "Testimonials" },
  { id: "sec-blog",        label: "Blog" },
  { id: "sec-whychoose",   label: "Why Choose" },
  { id: "sec-finalcta",    label: "Final CTA" },
  { id: "sec-meta",        label: "Meta" },
];

function addToList(setter, emptyFn) { setter(p => [...p, emptyFn()]); }
function removeFromList(setter, id) { setter(p => p.filter(x => x.id !== id)); }
function updateListItem(setter, id, field, value) {
  setter(p => p.map(x => x.id === id ? { ...x, [field]: value } : x));
}
function addSubItem(setter, id, field, emptyVal) {
  setter(p => p.map(x => x.id === id ? { ...x, [field]: [...x[field], emptyVal] } : x));
}
function removeSubItem(setter, id, field, idx) {
  setter(p => p.map(x => x.id === id ? { ...x, [field]: x[field].filter((_, i) => i !== idx) } : x));
}
function updateSubItem(setter, id, field, idx, value) {
  setter(p => p.map(x => {
    if (x.id !== id) return x;
    const arr = [...x[field]];
    arr[idx] = value;
    return { ...x, [field]: arr };
  }));
}
function moveListItem(setter, idx, direction) {
  setter(p => {
    const arr = [...p];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= arr.length) return p;
    [arr[idx], arr[targetIdx]] = [arr[targetIdx], arr[idx]];
    return arr;
  });
}
const hydrateList = (arr, defaults = {}) =>
  Array.isArray(arr) ? arr.map(item => ({ id: uid(), ...defaults, ...item })) : [];

// ─── component ──────────────────────────────────────────────────────────────
const CreateList = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [generatingGroup, setGeneratingGroup] = useState(null);
  const [phaseLock, setPhaseLock] = useState(null);
  const [restoreSnapshot, setRestoreSnapshot] = useState(null);
  const [seoBriefKey, setSeoBriefKey] = useState("auto");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [slugEdited, setSlugEdited] = useState(false);

  // ── Core Info ──────────────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [country, setCountry] = useState("");
  const [market, setMarket] = useState("");
  const [keywords, setKeywords] = useState("");
  const coreInfoRef = useRef({ title: "", slug: "", country: "", market: "", keywords: "" });
  const titleInputRef = useRef(null);
  const slugInputRef = useRef(null);
  const marketInputRef = useRef(null);
  const keywordsInputRef = useRef(null);
  // Track the slug/market as loaded from DB so we can bust the old URL on save
  const initialSlugRef = useRef("");
  const initialMarketRef = useRef("");
  const [marketEdited, setMarketEdited] = useState(false);
  const [template, setTemplate] = useState(DEFAULT_PAGE_TEMPLATE);
  const [statusValue, setStatusValue] = useState("active"); // "active" | "draft" | "inactive"
  const [isPreviewing, setIsPreviewing] = useState(false);
  const previewSubmitRef = useRef(false);

  const setCoreTitle = (value = "") => {
    coreInfoRef.current.title = value;
    setTitle(value);
  };
  const setCoreSlug = (value = "") => {
    coreInfoRef.current.slug = value;
    setSlug(value);
  };
  const setCoreCountry = (value = "") => {
    coreInfoRef.current.country = value;
    setCountry(value);
  };
  const setCoreMarket = (value = "") => {
    coreInfoRef.current.market = value;
    setMarket(value);
  };
  const setCoreKeywords = (value = "") => {
    coreInfoRef.current.keywords = value;
    setKeywords(value);
  };
  const getCoreInfoValues = () => ({
    title: titleInputRef.current?.value ?? coreInfoRef.current.title ?? title,
    slug: slugInputRef.current?.value ?? coreInfoRef.current.slug ?? slug,
    country: coreInfoRef.current.country ?? country,
    market: marketInputRef.current?.value ?? coreInfoRef.current.market ?? market,
    keywords: keywordsInputRef.current?.value ?? coreInfoRef.current.keywords ?? keywords,
  });

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setCoreTitle(val);
    if (!slugEdited) setCoreSlug(toSlug(val));
  };
  const handleSlugChange = (e) => {
    setCoreSlug(e.target.value);
    setSlugEdited(true);
  };
  const handleCountryChange = (e) => {
    const val = e.target.value;
    setCoreCountry(val);
    if (!marketEdited) setCoreMarket(toSlug(val));
  };
  const handleMarketChange = (e) => {
    setCoreMarket(e.target.value);
    setMarketEdited(true);
  };
  const handleKeywordsChange = (e) => setCoreKeywords(e.target.value);

  // ── Hero ───────────────────────────────────────────────────────────────────
  const [heroShow, setHeroShow] = useState(true);
  const [heroHeading, setHeroHeading] = useState("");
  const [heroBody, setHeroBody] = useState("");
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState("");
  const [heroImageAlt, setHeroImageAlt] = useState("");
  const [heroImageExisting, setHeroImageExisting] = useState("");
  const uploadHeroImage = (e) => {
    const file = e.target.files[0];
    setHeroImageFile(file || null);
    setHeroImagePreview(file ? URL.createObjectURL(file) : heroImageExisting);
    if (file && !heroImageAlt) setHeroImageAlt(fileNameToAlt(file.name));
  };
  const emptyHeroStat = () => ({ id: uid(), icon: "BriefcaseStatIcon", value: "", label: "", sub: "" });
  const [heroStats, setHeroStats] = useState([]);
  const [heroCta1Text, setHeroCta1Text] = useState("Talk to an Expert");
  const [heroCta1Link, setHeroCta1Link] = useState("/post-requirement");
  const [heroCta2Text, setHeroCta2Text] = useState("View our work");
  const [heroCta2Link, setHeroCta2Link] = useState("/case-studies");
  // Project Progress card (admin-editable)
  const [projectProgressTitle, setProjectProgressTitle] = useState("Project Progress");
  const [projectProgressBody, setProjectProgressBody] = useState("Delivering scalable software solutions on time, sprint after sprint.");
  const [projectProgressValue, setProjectProgressValue] = useState("+ 51%");

  // ── Why Choose Akoode ─────────────────────────────────────────────────────
  const emptyWhyChooseCard = () => ({ id: uid(), icon: "", title: "", desc: "" });
  const [whyChooseShow, setWhyChooseShow] = useState(false);
  const [whyChooseHeading, setWhyChooseHeading] = useState("");
  const [whyChooseSubtitle, setWhyChooseSubtitle] = useState("");
  const [whyChooseCards, setWhyChooseCards] = useState([]);
  const [whyChooseCtaHeading, setWhyChooseCtaHeading] = useState("");
  const [whyChooseCtaBody, setWhyChooseCtaBody] = useState("");
  const [whyChooseCtaText, setWhyChooseCtaText] = useState("");
  const [whyChooseCtaLink, setWhyChooseCtaLink] = useState("");

  // ── Choose Us ──────────────────────────────────────────────────────────────
  const [chooseUsShow, setChooseUsShow] = useState(false);
  const [chooseUsHeading, setChooseUsHeading] = useState("");
  const [chooseUsIntro, setChooseUsIntro] = useState("");
  const [chooseUsFeatures, setChooseUsFeatures] = useState([]);
  const [platformRatings, setPlatformRatings] = useState([]);
  const [clientLove, setClientLove] = useState([]);
  const updatePlatformRatingImg = (id, file) => {
    setPlatformRatings(p => p.map(x => x.id === id ? {
      ...x,
      img: file || null,
      imgPreview: file ? URL.createObjectURL(file) : x.imgExisting,
      imgAlt: file && !x.imgAlt ? fileNameToAlt(file.name) : x.imgAlt,
    } : x));
  };

  // ── Why Location ───────────────────────────────────────────────────────────
  const [whyShow, setWhyShow] = useState(false);
  const [whyHeading, setWhyHeading] = useState("");
  const [whyPara1, setWhyPara1] = useState("");
  const [whyPara2, setWhyPara2] = useState("");
  const [whyPara3, setWhyPara3] = useState("");
  const [whyFeatures, setWhyFeatures] = useState([]);
  const [whyImage, setWhyImage] = useState(null);
  const [whyImagePreview, setWhyImagePreview] = useState("");
  const [whyImageAlt, setWhyImageAlt] = useState("");
  const [whyImageExisting, setWhyImageExisting] = useState("");
  const [whyCardLocation, setWhyCardLocation] = useState("");
  const [whyCardHeading, setWhyCardHeading] = useState("");
  const [whyCardBody, setWhyCardBody] = useState("");
  const uploadWhyImage = (e) => {
    const file = e.target.files?.[0] ?? null;
    console.log("[uploadWhyImage] file selected:", file?.name, file?.size);
    setWhyImage(file);
    setWhyImagePreview(file ? URL.createObjectURL(file) : whyImageExisting);
    if (file && !whyImageAlt) setWhyImageAlt(fileNameToAlt(file.name));
  };

  // ── Process ────────────────────────────────────────────────────────────────
  const [processShow, setProcessShow] = useState(false);
  const [processHeading, setProcessHeading] = useState("");
  const [processIntro, setProcessIntro] = useState("");
  const [processServices, setProcessServices] = useState([]);

  // ── What We Do ─────────────────────────────────────────────────────────────
  const [whatWeDoShow, setWhatWeDoShow] = useState(false);
  const [whatWeDoHeading, setWhatWeDoHeading] = useState("");
  const [whatWeDoSubtitle, setWhatWeDoSubtitle] = useState("");
  const [whatWeDoSteps, setWhatWeDoSteps] = useState([]);

  // ── Tech Stack ─────────────────────────────────────────────────────────────
  const [techStackShow, setTechStackShow] = useState(false);
  const [techStackHeading, setTechStackHeading] = useState("");
  const [techStackSubtitle, setTechStackSubtitle] = useState("");
  const [techCats, setTechCats] = useState([]);
  const updateTechCatPill = (catId, pillIdx, field, value) => {
    setTechCats(p => p.map(x => {
      if (x.id !== catId) return x;
      const pills = [...x.pills];
      pills[pillIdx] = { ...pills[pillIdx], [field]: value };
      return { ...x, pills };
    }));
  };
  const updateTechCatIconImg = (catId, file) => {
    setTechCats(p => p.map(x => x.id !== catId ? x : {
      ...x, iconImg: file || null, iconImgPreview: file ? URL.createObjectURL(file) : "",
    }));
  };
  const updateTechCatPillImg = (catId, pillIdx, file) => {
    setTechCats(p => p.map(x => {
      if (x.id !== catId) return x;
      const pills = [...x.pills];
      pills[pillIdx] = { ...pills[pillIdx], img: file || null, imgPreview: file ? URL.createObjectURL(file) : "" };
      return { ...x, pills };
    }));
  };
  const addTechCatPill = (catId) => {
    setTechCats(p => p.map(x => x.id === catId ? { ...x, pills: [...x.pills, { e: "", label: "", img: null, imgPreview: "", imgExisting: "" }] } : x));
  };
  const removeTechCatPill = (catId, pillIdx) => {
    setTechCats(p => p.map(x => x.id === catId ? { ...x, pills: x.pills.filter((_, i) => i !== pillIdx) } : x));
  };

  // ── Industries ─────────────────────────────────────────────────────────────
  const [industriesShow, setIndustriesShow] = useState(false);
  const [industriesHeading, setIndustriesHeading] = useState("");
  // v2 templates only — the default IndustriesSection has no accent word.
  const [industriesHeadingAccent, setIndustriesHeadingAccent] = useState("");
  const [industriesSubtitle, setIndustriesSubtitle] = useState("");
  const [industries, setIndustries] = useState([]);
  const updateIndustryIconImg = (id, file) => {
    setIndustries(p => p.map(x => {
      if (x.id !== id) return x;
      const newAlt = (file && !x.iconAlt) ? fileNameToAlt(file.name) : x.iconAlt;
      return {
        ...x, 
        iconImg: file || null, 
        iconImgPreview: file ? URL.createObjectURL(file) : "",
        iconAlt: newAlt
      };
    }));
  };

  /* Switching to a v2 template swaps which hero/industry fields exist, so seed
     and clear the shared state to match:
       · hero stats  — v2 renders four editable cards; seed the design defaults
                       so a new page starts populated rather than blank.
       · industries  — the default template pre-loads a fixed shared taxonomy;
                       v2 is free-form, so drop that prefill while it is still
                       untouched (no description / link / icon typed yet). */
  useEffect(() => {
    if (!usesV2Sections(template)) return;
    setHeroStats((prev) => seedHeroStats(prev, usesHeroBadges(template), uid));
    // Only drop the DEFAULT template's untouched prefill — every row still
    // carrying a stock taxonomy name and no authored content. Anything the
    // user (or a saved MAD page) actually put there is left alone.
    setIndustries((prev) => (
      prev.length &&
      prev.every((x) => STATIC_INDUSTRIES.includes(x.name) && !x.sub && !x.ctaLink && !x.icon)
        ? []
        : prev
    ));
  }, [template]);

  // ── Engagement ─────────────────────────────────────────────────────────────
  const [engagementShow, setEngagementShow] = useState(false);
  const [engagementHeading, setEngagementHeading] = useState("");
  const [engagementSubtitle, setEngagementSubtitle] = useState("");

  // ── FAQ ────────────────────────────────────────────────────────────────────
  const [faqShow, setFaqShow] = useState(false);
  const [faqHeading, setFaqHeading] = useState("");
  const [faqSubtitle, setFaqSubtitle] = useState("");
  const [faqs, setFaqs] = useState([]);

  // ── Toggles ────────────────────────────────────────────────────────────────
  const [caseStudiesShow, setCaseStudiesShow] = useState(false);
  const [testimonialsShow, setTestimonialsShow] = useState(false);
  // Per-page testimonials — v2 templates only (see config/pageTemplates.js).
  const emptyTestimonial = () => ({ id: uid(), quote: "", name: "", designation: "", company: "", mediaType: "none", image: null, imagePreview: "", imageExisting: "" });
  const [testimonialsHeading, setTestimonialsHeading] = useState("");
  const [testimonialItems, setTestimonialItems] = useState([]);
  const updateTestimonialImg = (id, file) => {
    setTestimonialItems(p => p.map(x => x.id !== id ? x : {
      ...x, image: file || null, imagePreview: file ? URL.createObjectURL(file) : "",
    }));
  };
  const [blogShow, setBlogShow] = useState(false);
  const [blogHeading, setBlogHeading] = useState("");
  const [blogSubtitle, setBlogSubtitle] = useState("");

  const [caseStudiesHeading, setCaseStudiesHeading] = useState("");
  const [caseStudiesSubtitle, setCaseStudiesSubtitle] = useState("");
  // Manual card picks — "" means the slot auto-fills with the latest published case study
  const [caseStudiesFeatured, setCaseStudiesFeatured] = useState("");
  const [caseStudiesOthers, setCaseStudiesOthers] = useState(["", ""]);

  // ── Final CTA ──────────────────────────────────────────────────────────────
  const [finalCtaShow, setFinalCtaShow] = useState(false);
  const [finalCtaHeading, setFinalCtaHeading] = useState("");
  const [finalCtaBody, setFinalCtaBody] = useState("");
  const [finalCtaReplyTime, setFinalCtaReplyTime] = useState("");
  const [finalCtaNda, setFinalCtaNda] = useState("");

  // ── Meta ───────────────────────────────────────────────────────────────────
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const buildSuggestionSetters = () => ({
    setTitle: setCoreTitle, setSlug: setCoreSlug, setSlugEdited, setCountry: setCoreCountry, setMarket: setCoreMarket, setMarketEdited,
    setHeroShow, setHeroHeading, setHeroBody, setHeroCta1: () => {}, setHeroCta1Link: () => {}, setHeroCta2: () => {}, setHeroCta2Link: () => {}, setHeroImageAlt, setHeroStats,
    setChooseUsShow, setChooseUsHeading, setChooseUsIntro, setChooseUsFeatures, setClientLove,
    setWhyShow, setWhyHeading, setWhyPara1, setWhyPara2, setWhyPara3, setWhyFeatures, setWhyImageAlt, setWhyCardLocation, setWhyCardHeading, setWhyCardBody,
    setProcessShow, setProcessHeading, setProcessIntro, setProcessServices,
    setWhatWeDoShow, setWhatWeDoHeading, setWhatWeDoSubtitle, setWhatWeDoSteps,
    setTechStackShow, setTechStackHeading, setTechStackSubtitle, setTechCats,
    setIndustriesShow, setIndustriesHeading, setIndustriesSubtitle, setIndustries,
    setWhyChooseShow, setWhyChooseHeading, setWhyChooseSubtitle, setWhyChooseCards, setWhyChooseCtaHeading, setWhyChooseCtaBody, setWhyChooseCtaText, setWhyChooseCtaLink,
    setEngagementShow, setEngagementHeading, setEngagementSubtitle,
    setFaqShow, setFaqHeading, setFaqSubtitle, setFaqs,
    setCaseStudiesShow, setCaseStudiesHeading, setCaseStudiesSubtitle, setTestimonialsShow,
    setBlogShow, setBlogHeading, setBlogSubtitle,
    setFinalCtaShow, setFinalCtaHeading, setFinalCtaBody, setFinalCtaReplyTime, setFinalCtaNda,
    setMetaTitle, setMetaDescription,
  });

  const buildExistingContentContext = () => ({
    ...getCoreInfoValues(),
    hero: { heading: heroHeading, body: heroBody, imageAlt: heroImageAlt },
    chooseUs: { heading: chooseUsHeading, intro: chooseUsIntro, features: chooseUsFeatures, clientLove },
    whyLocation: { heading: whyHeading, para1: whyPara1, para2: whyPara2, para3: whyPara3, cardLocation: whyCardLocation, cardHeading: whyCardHeading, cardBody: whyCardBody },
    services: { heading: processHeading, intro: processIntro, items: processServices },
    deliveryProcess: { heading: whatWeDoHeading, subtitle: whatWeDoSubtitle, steps: whatWeDoSteps },
    techStack: { heading: techStackHeading, subtitle: techStackSubtitle, categories: techCats },
    industries: { heading: industriesHeading, subtitle: industriesSubtitle, items: industries },
    engagement: { heading: engagementHeading, subtitle: engagementSubtitle },
    faq: { heading: faqHeading, subtitle: faqSubtitle, items: faqs },
    whyChoose: { heading: whyChooseHeading, subtitle: whyChooseSubtitle, cards: whyChooseCards, ctaHeading: whyChooseCtaHeading, ctaBody: whyChooseCtaBody },
    finalCta: { heading: finalCtaHeading, body: finalCtaBody, replyTime: finalCtaReplyTime, nda: finalCtaNda },
    meta: { title: metaTitle, description: metaDescription },
  });

  const buildRestoreSnapshot = () => cloneFormValue({
    title, slug, slugEdited, country, market, marketEdited, keywords,
    heroShow, heroHeading, heroBody, heroImageAlt, heroStats,
    projectProgressTitle, projectProgressBody, projectProgressValue,
    chooseUsShow, chooseUsHeading, chooseUsIntro, chooseUsFeatures, clientLove,
    whyShow, whyHeading, whyPara1, whyPara2, whyPara3, whyFeatures, whyImageAlt, whyCardLocation, whyCardHeading, whyCardBody,
    processShow, processHeading, processIntro, processServices,
    whatWeDoShow, whatWeDoHeading, whatWeDoSubtitle, whatWeDoSteps,
    techStackShow, techStackHeading, techStackSubtitle, techCats,
    industriesShow, industriesHeading, industriesHeadingAccent, industriesSubtitle, industries,
    whyChooseShow, whyChooseHeading, whyChooseSubtitle, whyChooseCards, whyChooseCtaHeading, whyChooseCtaBody, whyChooseCtaText, whyChooseCtaLink,
    engagementShow, engagementHeading, engagementSubtitle,
    faqShow, faqHeading, faqSubtitle, faqs,
    caseStudiesShow, caseStudiesHeading, caseStudiesSubtitle, caseStudiesFeatured, caseStudiesOthers, testimonialsShow,
    blogShow, blogHeading, blogSubtitle,
    finalCtaShow, finalCtaHeading, finalCtaBody, finalCtaReplyTime, finalCtaNda,
    metaTitle, metaDescription,
  });

  const applyRestoreSnapshot = (snapshot) => {
    if (!snapshot) return;
    setCoreTitle(snapshot.title || "");
    setCoreSlug(snapshot.slug || "");
    setSlugEdited(!!snapshot.slugEdited);
    setCoreCountry(snapshot.country || "");
    setCoreMarket(snapshot.market || "");
    setMarketEdited(!!snapshot.marketEdited);
    setCoreKeywords(snapshot.keywords || "");
    setHeroShow(!!snapshot.heroShow);
    setHeroHeading(snapshot.heroHeading || "");
    setHeroBody(snapshot.heroBody || "");
    setHeroImageAlt(snapshot.heroImageAlt || "");
    setHeroStats(snapshot.heroStats || []);
    setProjectProgressTitle(snapshot.projectProgressTitle || "Project Progress");
    setProjectProgressBody(snapshot.projectProgressBody || "Delivering scalable software solutions on time, sprint after sprint.");
    setProjectProgressValue(snapshot.projectProgressValue || "+ 51%");
    setChooseUsShow(!!snapshot.chooseUsShow);
    setChooseUsHeading(snapshot.chooseUsHeading || "");
    setChooseUsIntro(snapshot.chooseUsIntro || "");
    setChooseUsFeatures(snapshot.chooseUsFeatures || []);
    setClientLove(snapshot.clientLove || []);
    setWhyShow(!!snapshot.whyShow);
    setWhyHeading(snapshot.whyHeading || "");
    setWhyPara1(snapshot.whyPara1 || "");
    setWhyPara2(snapshot.whyPara2 || "");
    setWhyPara3(snapshot.whyPara3 || "");
    setWhyFeatures(snapshot.whyFeatures || []);
    setWhyImageAlt(snapshot.whyImageAlt || "");
    setWhyCardLocation(snapshot.whyCardLocation || "");
    setWhyCardHeading(snapshot.whyCardHeading || "");
    setWhyCardBody(snapshot.whyCardBody || "");
    setProcessShow(!!snapshot.processShow);
    setProcessHeading(snapshot.processHeading || "");
    setProcessIntro(snapshot.processIntro || "");
    setProcessServices(snapshot.processServices || []);
    setWhatWeDoShow(!!snapshot.whatWeDoShow);
    setWhatWeDoHeading(snapshot.whatWeDoHeading || "");
    setWhatWeDoSubtitle(snapshot.whatWeDoSubtitle || "");
    setWhatWeDoSteps(snapshot.whatWeDoSteps || []);
    setTechStackShow(!!snapshot.techStackShow);
    setTechStackHeading(snapshot.techStackHeading || "");
    setTechStackSubtitle(snapshot.techStackSubtitle || "");
    setTechCats(snapshot.techCats || []);
    setIndustriesShow(!!snapshot.industriesShow);
    setIndustriesHeading(snapshot.industriesHeading || "");
    setIndustriesHeadingAccent(snapshot.industriesHeadingAccent || "");
    setIndustriesSubtitle(snapshot.industriesSubtitle || "");
    setIndustries(snapshot.industries || []);
    setWhyChooseShow(!!snapshot.whyChooseShow);
    setWhyChooseHeading(snapshot.whyChooseHeading || "");
    setWhyChooseSubtitle(snapshot.whyChooseSubtitle || "");
    setWhyChooseCards(snapshot.whyChooseCards || []);
    setWhyChooseCtaHeading(snapshot.whyChooseCtaHeading || "");
    setWhyChooseCtaBody(snapshot.whyChooseCtaBody || "");
    setWhyChooseCtaText(snapshot.whyChooseCtaText || "");
    setWhyChooseCtaLink(snapshot.whyChooseCtaLink || "");
    setEngagementShow(!!snapshot.engagementShow);
    setEngagementHeading(snapshot.engagementHeading || "");
    setEngagementSubtitle(snapshot.engagementSubtitle || "");
    setFaqShow(!!snapshot.faqShow);
    setFaqHeading(snapshot.faqHeading || "");
    setFaqSubtitle(snapshot.faqSubtitle || "");
    setFaqs(snapshot.faqs || []);
    setCaseStudiesShow(!!snapshot.caseStudiesShow);
    setCaseStudiesHeading(snapshot.caseStudiesHeading || "");
    setCaseStudiesSubtitle(snapshot.caseStudiesSubtitle || "");
    setCaseStudiesFeatured(snapshot.caseStudiesFeatured || "");
    setCaseStudiesOthers(snapshot.caseStudiesOthers || ["", ""]);
    setTestimonialsShow(!!snapshot.testimonialsShow);
    setTestimonialsHeading(snapshot.testimonialsHeading || "");
    setTestimonialItems(snapshot.testimonialItems || []);
    setBlogShow(!!snapshot.blogShow);
    setBlogHeading(snapshot.blogHeading || "");
    setBlogSubtitle(snapshot.blogSubtitle || "");
    setFinalCtaShow(!!snapshot.finalCtaShow);
    setFinalCtaHeading(snapshot.finalCtaHeading || "");
    setFinalCtaBody(snapshot.finalCtaBody || "");
    setFinalCtaReplyTime(snapshot.finalCtaReplyTime || "");
    setFinalCtaNda(snapshot.finalCtaNda || "");
    setMetaTitle(snapshot.metaTitle || "");
    setMetaDescription(snapshot.metaDescription || "");
  };

  const handleRestoreAiSnapshot = () => {
    applyRestoreSnapshot(restoreSnapshot);
    toast.info("Restored the form to the values from before the last AI generation.");
  };

  // `group` scopes the run to one backend phase (e.g. "group2"); null = all four.
  // A scoped run writes ONLY that phase's sections, leaving the rest of the form
  // exactly as the editor left it.
  // Phase runs must all target the SAME page. If the editor changes the city,
  // slug or market between phases, later phases would generate for a different
  // location while earlier phases' copy stays put — producing a page that is half
  // Chicago and half New York. The page identity is captured on the first
  // generation and enforced on every later phase; a full run resets it.
  const getPageIdentity = () => {
    const c = getCoreInfoValues();
    const key = [c.market, c.slug, c.city, c.citySlug]
      .map((v) => String(v || "").trim().toLowerCase())
      .join("|");
    const label = String(c.city || c.slug || c.market || "this page").trim();
    return { key, label };
  };

  const handleGenerateSeoSuggestions = async (group = null) => {
    const groups = group ? [group] : null;
    const identity = getPageIdentity();
    if (group && phaseLock && phaseLock.key !== identity.key) {
      toast.error(
        `Phases are locked to "${phaseLock.label}", but the form now describes "${identity.label}". ` +
          `Use "Generate Everything with AI" to start a fresh set of phases for this page, or restore the original city, slug and market values first.`,
        { autoClose: false }
      );
      return;
    }
    setIsGeneratingSeo(true);
    setGeneratingGroup(group);
    try {
      setRestoreSnapshot(buildRestoreSnapshot());
      const core = getCoreInfoValues();
      const selectedBrief = seoBriefKey === "auto"
        ? inferKeywordBrief(core.title, core.slug, core.market)
        : SBC_KEYWORD_BRIEFS[Number(seoBriefKey)] || SBC_KEYWORD_BRIEFS[0];
      const formAwareBrief = buildFormAwareKeywordBrief({ ...core, selectedBrief });
      const data = await generateSBCSeoSuggestionsAPI({
        ...core,
        serviceType: "Software Development",
        internalLinks: ["/services/software-development", "/services/mobile-app-development", "/services/artificial-intelligence", "/case-study", "/blog", "/post-requirement"],
        existingContentContext: buildExistingContentContext(),
        ...formAwareBrief,
        ...(groups ? { groups } : {}),
      });
      applySbcSeoSuggestion(data.data, buildSuggestionSetters(), uid, data?.generatedGroups || groups);
      // Lock (or re-baseline) the page these phases belong to.
      setPhaseLock(identity);
      // Surface the backend's real message — it flags static-template fallback
      // (source !== "anthropic") that must not be silently published.
      const generatedMsg = data?.message || "AI SEO suggestions populated. Review and save when ready.";
      if (data?.needsReview || (data?.source && data.source !== "anthropic")) {
        toast.warn(generatedMsg, { autoClose: false });
      } else {
        toast.success(generatedMsg);
      }
    } catch (err) {
      toast.error(err.message || "Failed to generate SEO suggestions");
    } finally {
      setIsGeneratingSeo(false);
      setGeneratingGroup(null);
    }
  };

  const runButtonAction = (event, action) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    action();
  };

  const buildAiPayload = () => {
    const core = getCoreInfoValues();
    const selectedBrief = seoBriefKey === "auto"
      ? inferKeywordBrief(core.title, core.slug, core.market)
      : SBC_KEYWORD_BRIEFS[Number(seoBriefKey)] || SBC_KEYWORD_BRIEFS[0];
    const formAwareBrief = buildFormAwareKeywordBrief({ ...core, selectedBrief });
    return {
      ...core,
      serviceType: "Software Development",
      internalLinks: ["/services/software-development", "/services/mobile-app-development", "/services/artificial-intelligence", "/case-study", "/blog", "/post-requirement"],
      existingContentContext: buildExistingContentContext(),
      ...formAwareBrief,
    };
  };

  const fieldAiTools = useSbcFieldAiTools({
    disabled: isGeneratingSeo || isSubmitting,
    buildPayload: buildAiPayload,
  });

  // ── Load existing data ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await getSBCById(id);
        const d = data?.data ?? data;

        // Core
        setCoreTitle(d.title ?? "");
        setCoreSlug(d.slug ?? "");
        setSlugEdited(true);
        setCoreCountry(d.country ?? "");
        const loadedMarket = d.market ?? toSlug(d.country ?? "");
        setCoreMarket(loadedMarket);
        setMarketEdited(true);
        setCoreKeywords(d.keywords ?? "");
        initialSlugRef.current = d.slug ?? "";
        initialMarketRef.current = loadedMarket;
        setStatusValue(d.status === true ? "active" : d.isDraft ? "draft" : "inactive");
        setTemplate(normalizeTemplate(d.template));

        // Hero
        const hero = d.hero || {};
        setHeroShow(hero.show !== false);
        setHeroHeading(hero.heading ?? "");
        setHeroBody(hero.body ?? "");
        const existingHeroImg = buildAssetUrl(hero.heroImage ?? "");
        setHeroImageExisting(hero.heroImage ?? "");
        setHeroImagePreview(existingHeroImg);
        setHeroImageAlt(hero.heroImageAlt ?? "");
        setHeroCta1Text(hero.cta1Text ?? "Talk to an Expert");
        setHeroCta1Link(hero.cta1Link ?? "/post-requirement");
        setHeroCta2Text(hero.cta2Text ?? "View our work");
        setHeroCta2Link(hero.cta2Link ?? "/case-studies");

        // Hero stats
        setHeroStats(hydrateList(hero.stats || []));

        // Project Progress card
        const pp = hero.projectProgress || {};
        setProjectProgressTitle(pp.title ?? "Project Progress");
        setProjectProgressBody(pp.body ?? "Delivering scalable software solutions on time, sprint after sprint.");
        setProjectProgressValue(pp.value ?? "+ 51%");

        // Case Studies
        const cs = d.caseStudies || {};
        setCaseStudiesShow(d.caseStudiesShow !== false);
        setCaseStudiesHeading(cs.heading ?? "");
        setCaseStudiesSubtitle(cs.subtitle ?? "");
        // featuredCase/otherCases arrive populated (objects) or as raw ids
        setCaseStudiesFeatured(cs.featuredCase ? String(cs.featuredCase._id ?? cs.featuredCase) : "");
        const savedOthers = (cs.otherCases || []).filter(Boolean).map(x => String(x._id ?? x));
        setCaseStudiesOthers([savedOthers[0] || "", savedOthers[1] || ""]);

        // Why Choose
        const wc = d.whyChoose || {};
        setWhyChooseShow(!!wc.show);
        setWhyChooseHeading(wc.heading ?? "");
        setWhyChooseSubtitle(wc.subtitle ?? "");
        setWhyChooseCards(hydrateList(wc.cards));
        setWhyChooseCtaHeading(wc.ctaHeading ?? "");
        setWhyChooseCtaBody(wc.ctaBody ?? "");
        setWhyChooseCtaText(wc.ctaText ?? "");
        setWhyChooseCtaLink(wc.ctaLink ?? "");

        // Choose Us
        const cu = d.chooseUs || {};
        setChooseUsShow(!!cu.show);
        setChooseUsHeading(cu.heading ?? "");
        setChooseUsIntro(cu.intro ?? "");
        setChooseUsFeatures(hydrateList(cu.features));
        setPlatformRatings(hydrateList(cu.platformRatings).map(r => {
          const existing = buildAssetUrl(r.img ?? "");
          return { ...r, img: null, imgPreview: existing, imgExisting: r.img ?? "" };
        }));
        setClientLove(hydrateList(cu.clientLove));

        // Why Location
        const why = d.whyLocation || {};
        setWhyShow(!!why.show);
        setWhyHeading(why.heading ?? "");
        setWhyPara1(why.para1 ?? "");
        setWhyPara2(why.para2 ?? "");
        setWhyPara3(why.para3 ?? "");
        setWhyFeatures(hydrateList(why.features));
        const existingWhyImg = buildAssetUrl(why.image ?? "");
        // Always store the raw path (not the full URL) so FormData sends the correct value
        const rawWhyPath = (why.image ?? "").replace(/^https?:\/\/[^\/]+/, "");
        setWhyImageExisting(rawWhyPath);
        setWhyImagePreview(existingWhyImg);
        setWhyImageAlt(why.imageAlt ?? "");
        setWhyCardLocation(why.cardLocation ?? "");
        setWhyCardHeading(why.cardHeading ?? "");
        setWhyCardBody(why.cardBody ?? "");

        // Process
        const proc = d.process || {};
        setProcessShow(!!proc.show);
        setProcessHeading(proc.heading ?? "");
        setProcessIntro(proc.intro ?? "");
        setProcessServices(hydrateList(proc.services).map(s => ({
          ...s,
          points: Array.isArray(s.points) && s.points.length ? s.points : [""],
          tags: Array.isArray(s.tags) && s.tags.length ? s.tags : [""],
          ctaText: s.ctaText ?? "",
          ctaLink: s.ctaLink ?? "",
        })));

        // What We Do
        const wwd = d.whatWeDo || {};
        setWhatWeDoShow(!!wwd.show);
        setWhatWeDoHeading(wwd.heading ?? "");
        setWhatWeDoSubtitle(wwd.subtitle ?? "");
        setWhatWeDoSteps(mergeWithStaticSteps(hydrateList(wwd.steps)).map(s => ({
          ...s,
          deliverables: Array.isArray(s.deliverables) && s.deliverables.length ? s.deliverables : [""],
        })));

        // Tech Stack
        const tech = d.techStack || {};
        setTechStackShow(!!tech.show);
        setTechStackHeading(tech.heading ?? "");
        setTechStackSubtitle(tech.subtitle ?? "");
        setTechCats(hydrateList(tech.cats).map(c => {
          return {
            ...c,
            iconImg: null,
            iconImgPreview: "",
            iconImgExisting: c.iconImg ?? "",
            pills: (Array.isArray(c.pills) && c.pills.length ? c.pills : [{ e: "", label: "" }]).map(p => {
              const existingPillImg = buildAssetUrl(p.img ?? "");
              return { ...p, img: null, imgPreview: existingPillImg, imgExisting: p.img ?? "" };
            }),
          };
        }));

        // Industries
        const ind = d.industries || {};
        setIndustriesShow(!!ind.show);
        setIndustriesHeading(ind.heading ?? "");
        setIndustriesSubtitle(ind.subtitle ?? "");
        const hydrated = hydrateList(ind.items).map(x => {
          const existingIcon = buildAssetUrl(x.iconImg ?? "");
          return {
            ...x,
            points: Array.isArray(x.points) && x.points.length ? x.points : (x.sub ? [x.sub] : [""]),
            iconImg: null,
            iconImgPreview: existingIcon,
            iconImgExisting: x.iconImg ?? "",
            iconAlt: x.iconAlt ?? "",
            ctaLink: x.ctaLink ?? "",
          };
        });
        const currentTemplate = normalizeTemplate(d.template);
        setIndustries(usesV2Sections(currentTemplate) ? hydrated : mergeWithStaticIndustries(hydrated));

        // Engagement
        const eng = d.engagement || {};
        setEngagementShow(!!eng.show);
        setEngagementHeading(eng.heading ?? "");
        setEngagementSubtitle(eng.subtitle ?? "");

        // FAQ
        const fq = d.faq || {};
        setFaqShow(!!fq.show);
        setFaqHeading(fq.heading ?? "");
        setFaqSubtitle(fq.subtitle ?? "");
        setFaqs(hydrateList(fq.items));

        // Toggles
        setCaseStudiesShow(!!d.caseStudiesShow);
        setTestimonialsShow(!!d.testimonialsShow);
        const tst = d.testimonials || {};
        setTestimonialsHeading(tst.heading ?? "");
        setTestimonialItems(hydrateList(tst.items || []).map(x => ({
          ...x,
          image: null,
          imagePreview: buildAssetUrl(x.image ?? ""),
          imageExisting: x.image ?? "",
        })));
        setBlogShow(!!d.blogShow);

        // Blog Data
        const blog = d.blog || {};
        setBlogHeading(blog.heading ?? "");
        setBlogSubtitle(blog.subtitle ?? "");

        // Final CTA
        const cta = d.finalCta || {};
        setFinalCtaShow(!!cta.show);
        setFinalCtaHeading(cta.heading ?? "");
        setFinalCtaBody(cta.body ?? "");
        setFinalCtaReplyTime(cta.replyTime ?? "");
        setFinalCtaNda(cta.nda ?? "");

        // Meta
        const meta = d.meta || {};
        setMetaTitle(meta.title ?? "");
        setMetaDescription(meta.description ?? "");
      } catch (err) {
        toast.error("Failed to load entry: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const shouldPreview = previewSubmitRef.current || isPreviewing;
    const core = getCoreInfoValues();
    const newErrors = {};
    if (!core.title.trim()) newErrors.title = "Title is required";
    if (!core.slug.trim()) newErrors.slug = "Slug is required";
    if (!metaTitle.trim()) newErrors.metaTitle = "Meta title is required";
    if (!metaDescription.trim()) newErrors.metaDescription = "Meta description is required";
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      if (shouldPreview) {
        setIsPreviewing(false);
        previewSubmitRef.current = false;
      }
      setIsSubmitting(false);
      return;
    }

    try {
      const fd = new FormData();
      const status = statusValue === "active";
      const isDraft = statusValue === "draft";
      const plain = {
        ...core, status: shouldPreview ? false : status, isDraft: shouldPreview ? true : isDraft,
        template,
        heroShow, heroHeading, heroBody,
        heroCta1Text, heroCta1Link, heroCta2Text, heroCta2Link,
        heroImageAlt,
        projectProgressTitle, projectProgressBody, projectProgressValue,
        chooseUsShow, chooseUsHeading, chooseUsIntro,
        whyShow, whyHeading, whyPara1, whyPara2, whyPara3,
        whyImageAlt, whyCardLocation, whyCardHeading, whyCardBody,
        processShow, processHeading, processIntro,
        whatWeDoShow, whatWeDoHeading, whatWeDoSubtitle,
        techStackShow, techStackHeading, techStackSubtitle,
        industriesShow, industriesHeading, industriesHeadingAccent, industriesSubtitle,
        engagementShow, engagementHeading, engagementSubtitle,
        faqShow, faqHeading, faqSubtitle,
        caseStudiesShow, caseStudiesHeading, caseStudiesSubtitle, testimonialsShow, testimonialsHeading, blogShow,
        blogHeading, blogSubtitle,
        whyChooseShow, whyChooseHeading, whyChooseSubtitle, whyChooseCtaHeading, whyChooseCtaBody, whyChooseCtaText, whyChooseCtaLink,
        finalCtaShow, finalCtaHeading, finalCtaBody, finalCtaReplyTime, finalCtaNda,
        metaTitle, metaDescription,
      };
      for (const [k, v] of Object.entries(plain)) {
        if (v !== undefined && v !== null) fd.append(k, v);
      }

      // Hero image
      if (heroImageFile) {
        fd.append("heroImage", heroImageFile);
      } else if (heroImageExisting) {
        fd.append("heroImageExisting", heroImageExisting);
      }

      // Why location image
      console.log("[SBC submit] whyImage state:", whyImage, "| whyImageExisting:", whyImageExisting);
      if (whyImage) {
        fd.append("whyImage", whyImage);
        console.log("[SBC submit] appended whyImage file:", whyImage.name, whyImage.size, "bytes");
      } else if (whyImageExisting) {
        fd.append("whyImageExisting", whyImageExisting);
        console.log("[SBC submit] appended whyImageExisting:", whyImageExisting);
      } else {
        console.warn("[SBC submit] NO whyImage and NO whyImageExisting — image will be empty string!");
      }

      // Choose Us arrays
      chooseUsFeatures.forEach((f, i) => {
        fd.append(`chooseUsFeatures[${i}][icon]`, f.icon || "");
        fd.append(`chooseUsFeatures[${i}][title]`, f.title);
        fd.append(`chooseUsFeatures[${i}][body]`, f.body);
      });
      platformRatings.forEach((r, i) => {
        fd.append(`platformRatings[${i}][name]`, r.name);
        fd.append(`platformRatings[${i}][rating]`, r.rating);
        fd.append(`platformRatings[${i}][imgAlt]`, r.imgAlt);
        if (r.img) fd.append(`platformRatingImg[${i}]`, r.img);
        else if (r.imgExisting) fd.append(`platformRatings[${i}][imgExisting]`, r.imgExisting);
      });
      clientLove.forEach((c, i) => {
        fd.append(`clientLove[${i}][icon]`, c.icon || "");
        fd.append(`clientLove[${i}][title]`, c.title);
        fd.append(`clientLove[${i}][body]`, c.body);
      });

      // Why features
      whyFeatures.forEach((f, i) => {
        fd.append(`whyFeatures[${i}][icon]`, f.icon || "");
        fd.append(`whyFeatures[${i}][title]`, f.title);
        fd.append(`whyFeatures[${i}][body]`, f.body);
      });

      // Process services
      processServices.forEach((s, i) => {
        fd.append(`processServices[${i}][n]`, s.n);
        fd.append(`processServices[${i}][title]`, s.title);
        fd.append(`processServices[${i}][subtitle]`, s.subtitle);
        fd.append(`processServices[${i}][para]`, s.para);
        fd.append(`processServices[${i}][ctaText]`, s.ctaText || "");
        fd.append(`processServices[${i}][ctaLink]`, s.ctaLink || "");
        s.points.forEach((pt, j) => fd.append(`processServices[${i}][points][${j}]`, pt));
        s.tags.forEach((tg, j) => fd.append(`processServices[${i}][tags][${j}]`, tg));
      });

      // What We Do steps
      whatWeDoSteps.forEach((s, i) => {
        fd.append(`whatWeDoSteps[${i}][shortTitle]`, s.shortTitle);
        fd.append(`whatWeDoSteps[${i}][title]`, s.title);
        fd.append(`whatWeDoSteps[${i}][body]`, s.body);
        fd.append(`whatWeDoSteps[${i}][timeline]`, s.timeline);
        fd.append(`whatWeDoSteps[${i}][timelineNote]`, s.timelineNote);
        s.deliverables.forEach((d, j) => fd.append(`whatWeDoSteps[${i}][deliverables][${j}]`, d));
      });

      // Tech stack
      techCats.forEach((c, i) => {
        fd.append(`techCats[${i}][title]`, c.title);
        fd.append(`techCats[${i}][icon]`, c.icon);
        fd.append(`techCats[${i}][desc]`, c.desc);
        if (c.iconImg) fd.append(`techCatIcon[${i}]`, c.iconImg);
        else if (c.iconImgExisting) fd.append(`techCats[${i}][iconImgExisting]`, c.iconImgExisting);
        c.pills.forEach((p, j) => {
          fd.append(`techCats[${i}][pills][${j}][e]`, p.e || "");
          fd.append(`techCats[${i}][pills][${j}][label]`, p.label);
          fd.append(`techCats[${i}][pills][${j}][img]`, typeof p.img === "string" ? p.img : "");
          if (p.img instanceof File) fd.append(`techCatPillImg[${i}][${j}]`, p.img);
          else if (p.imgExisting) fd.append(`techCats[${i}][pills][${j}][imgExisting]`, p.imgExisting);
        });
      });

      // Industries
      industries.forEach((ind, i) => {
        fd.append(`industries[${i}][name]`, ind.name);
        fd.append(`industries[${i}][icon]`, ind.icon || "");
        fd.append(`industries[${i}][iconAlt]`, ind.iconAlt || "");
        fd.append(`industries[${i}][ctaLink]`, ind.ctaLink || "");
        fd.append(`industries[${i}][sub]`, ind.sub || "");
        ind.points.forEach((pt, j) => fd.append(`industries[${i}][points][${j}]`, pt));
        if (ind.iconImg instanceof File) fd.append(`industryIcon[${i}]`, ind.iconImg);
        else if (typeof ind.iconImg === "string" && ind.iconImg) fd.append(`industries[${i}][iconImgExisting]`, ind.iconImg);
        else if (ind.iconImgExisting) fd.append(`industries[${i}][iconImgExisting]`, ind.iconImgExisting);
      });

      // Per-page testimonials (v2 templates). Sent unconditionally: the
      // default template ignores them server-side, and keeping them in the
      // payload means switching template back and forth never drops content.
      testimonialItems.forEach((t, i) => {
        fd.append(`testimonials[${i}][quote]`, t.quote || "");
        fd.append(`testimonials[${i}][name]`, t.name || "");
        fd.append(`testimonials[${i}][designation]`, t.designation || "");
        fd.append(`testimonials[${i}][company]`, t.company || "");
        fd.append(`testimonials[${i}][mediaType]`, t.mediaType || "none");
        fd.append(`testimonials[${i}][imageExisting]`, t.imageExisting || "");
        if (t.image) fd.append(`testimonialImg[${i}]`, t.image);
      });

      // Engagement models

      // FAQs
      faqs.forEach((faq, i) => {
        fd.append(`faqs[${i}][question]`, faq.question);
        fd.append(`faqs[${i}][answer]`, faq.answer);
      });

      // Case study card picks (empty = auto-fill with latest published)
      fd.append("featuredCase", caseStudiesFeatured || "");
      caseStudiesOthers.filter(Boolean).forEach((csId, i) => fd.append(`otherCases[${i}]`, csId));

      // Why Choose Akoode cards
      whyChooseCards.forEach((c, i) => {
        fd.append(`whyChooseCards[${i}][icon]`, c.icon || "");
        fd.append(`whyChooseCards[${i}][title]`, c.title);
        fd.append(`whyChooseCards[${i}][desc]`, c.desc);
      });

      // Hero Stats
      heroStats.forEach((s, i) => {
        // FormData stringifies whatever it is handed, so an absent field is
        // persisted as the literal "undefined". That was harmless while only
        // MAD/Ecom read these (they use value + label, always seeded), but the
        // AI template renders `sub` — and a page switched over from another
        // template has no `sub` on its saved rows, which would print
        // "undefined" as the badge subtitle.
        fd.append(`heroStats[${i}][icon]`, s.icon || "BriefcaseStatIcon");
        fd.append(`heroStats[${i}][value]`, s.value ?? "");
        fd.append(`heroStats[${i}][label]`, s.label ?? "");
        fd.append(`heroStats[${i}][sub]`, s.sub ?? "");
      });




      const data = await updateSBCAPI(id, fd);
      toast.success(data.message || "Updated successfully");
      if (data.status === "success") {
        // Bust ISR cache for both the new slug path and the old slug path (if it changed)
        const secret = process.env.NEXT_PUBLIC_PREVIEW_SECRET || "";
        if (secret) {
          const newPath = core.market && core.slug ? `/${core.market}/${core.slug}` : null;
          const oldPath =
            initialSlugRef.current &&
            initialMarketRef.current &&
            (initialSlugRef.current !== core.slug || initialMarketRef.current !== core.market)
              ? `/${initialMarketRef.current}/${initialSlugRef.current}`
              : null;
          await fetch("/api/revalidate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: newPath, oldPath, secret }),
          }).catch(() => {});
          initialSlugRef.current = core.slug;
          initialMarketRef.current = core.market;
        }
        if (shouldPreview) {
          const editPath = `/thebusinesshub/service-by-country/edit/${id}`;
          openPreviewUrl(buildPreviewUrl({ market: core.market, slug: core.slug, editPath }), editPath);
        } else {
          setTimeout(() => router.push("/thebusinesshub/service-by-country"), 1500);
        }
      }
      setIsPreviewing(false);
      previewSubmitRef.current = false;
      setError({});
    } catch (err) {
      setError({ general: err.message || "Something went wrong" });
      toast.error(err.message || "Something went wrong");
    } finally {
      if (shouldPreview) {
        setIsPreviewing(false);
        previewSubmitRef.current = false;
      }
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center p-5">Loading entry...</div>;

  return (
    <>
      {/* ── Section Navigator — sticky below admin topbar ── */}
      <div style={{ position: "sticky", top: "60px", zIndex: 49, background: "#2c2e50", padding: "8px 16px", display: "flex", flexWrap: "wrap", gap: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
        {SECTION_NAV.filter((s) => {
          if (s.id === "sec-techstack" || s.id === "sec-testimonials") return usesV2Sections(template);
          return true;
        }).map((s) => (
          <a key={s.id} href={`#${s.id}`} style={{ background: "rgba(255,255,255,0.1)", color: "#e8ecf4", borderRadius: "4px", padding: "4px 10px", fontSize: "11px", fontWeight: 500, textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)", whiteSpace: "nowrap" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(163,177,138,0.35)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >{s.label}</a>
        ))}
      </div>

      <form onSubmit={handleSubmit} onFocusCapture={fieldAiTools.onFocusCapture} className="row">
        {fieldAiTools.toolbar}

        {/* ── Core Info ─────────────────────────────────────────────────────── */}
        <SectionCard id="sec-core" title="Core Information" accentColor="#4b4d7c">
          <div className="col-lg-12">
            <div className="d-flex flex-wrap align-items-end gap-2 mb20" style={{ border: "1px solid #dde2f3", borderRadius: 10, padding: 14, background: "#f8f9ff" }}>
              <div style={{ minWidth: 280, flex: "1 1 320px" }}>
                <label style={{ fontWeight: 600, color: "#2c2e50" }}>AI SEO suggestion brief</label>
                <select className="form-control" value={seoBriefKey} onChange={(e) => setSeoBriefKey(e.target.value)} disabled={isGeneratingSeo}>
                  <option value="auto">Auto-detect from title, slug, or market</option>
                  {SBC_KEYWORD_BRIEFS.map((brief, index) => (
                    <option key={brief.label} value={String(index)}>{brief.label}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="btn btn2"
                onMouseDown={(event) => runButtonAction(event, handleGenerateSeoSuggestions)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") runButtonAction(event, handleGenerateSeoSuggestions);
                }}
                disabled={isGeneratingSeo}
              >
                {isGeneratingSeo ? "Generating Everything..." : "Generate Everything with AI"}
              </button>
              <button
                type="button"
                className="btn btn1"
                onMouseDown={(event) => runButtonAction(event, handleRestoreAiSnapshot)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") runButtonAction(event, handleRestoreAiSnapshot);
                }}
                disabled={isGeneratingSeo || !restoreSnapshot}
              >
                Restore Previous Values
              </button>
              <span style={{ fontSize: 12, color: "#666", maxWidth: 520 }}>
                Uses the Akoode SEO landing page master prompt, treats existing fields as context only, and overwrites the form with fresh suggestions for manual review.
              </span>
            </div>
            <SbcPhaseGenerateButtons
              onGenerate={(group) => handleGenerateSeoSuggestions(group)}
              activeGroup={generatingGroup}
              lockedLabel={phaseLock?.label || null}
              disabled={isGeneratingSeo}
              runButtonAction={runButtonAction}
            />
          </div>
          <div className="col-lg-4">
            <div className="my_profile_setting_input form-group">
              <label>Page Title</label>
              <input ref={titleInputRef} type="text" className="form-control" value={title} onChange={handleTitleChange} placeholder="e.g. Software Development Company UK" />
              {error.title && <span className="text-danger">{error.title}</span>}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="my_profile_setting_input form-group">
              <label>Slug (URL) <span style={{ fontSize: 10, color: "#888", fontWeight: 400 }}>— auto-generated, editable</span></label>
              <input ref={slugInputRef} type="text" className="form-control" value={slug} onChange={handleSlugChange} placeholder="e.g. software-development-company-uk" />
              {error.slug && <span className="text-danger">{error.slug}</span>}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="my_profile_setting_input form-group">
              <label>Market URL Segment <span style={{ fontSize: 10, color: "#888", fontWeight: 400 }}>— auto-generated, editable</span></label>
              <input ref={marketInputRef} type="text" className="form-control" value={market} onChange={handleMarketChange} placeholder="e.g. uk" />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="my_profile_setting_input form-group">
              <label>Country / Market <span style={{ fontSize: 10, color: "#888", fontWeight: 400 }}>— breadcrumb label on city pages; blank falls back to the market segment</span></label>
              <input type="text" className="form-control" value={country} onChange={handleCountryChange} placeholder="e.g. UK" />
            </div>
          </div>
          <TemplatePicker value={template} onChange={setTemplate} />
          <div className="col-lg-12">
            <div className="my_profile_setting_input form-group">
              <label>Keywords <span style={{ fontSize: 10, color: "#888", fontWeight: 400 }}>— comma or line separated, used by AI suggestions</span></label>
              <textarea
                ref={keywordsInputRef}
                className="form-control"
                value={keywords}
                onChange={handleKeywordsChange}
                placeholder="e.g. software development company tokyo, ai software development tokyo, saas development tokyo"
                rows={3}
              />
            </div>
          </div>
        </SectionCard>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <SectionCard id="sec-hero" title="Hero Section" accentColor="#3c3e66" toggleId="heroShow" toggleName="heroShow" enabled={heroShow} onToggle={e => setHeroShow(e.target.checked)}>
          {heroShow && (
            <>
              <div className="col-lg-12">
                <div className="my_profile_setting_input form-group">
                  <label>Main Heading (H1)</label>
                  <input type="text" className="form-control" value={heroHeading} onChange={e => setHeroHeading(e.target.value)} placeholder="e.g. Software Development Company UK" />
                </div>
              </div>
              <div className="col-lg-12">
                <div className="my_profile_setting_input form-group">
                  <label>Body Text</label>
                  <textarea className="form-control" rows="3" value={heroBody} onChange={e => setHeroBody(e.target.value)} placeholder="Main hero body paragraph" />
                </div>
              </div>
              {usesV2Sections(template) ? (
                <>
                  {template !== "mobile-app-development" && (
                    <V2EcomHeroFields
                      cta1Text={heroCta1Text} onCta1Text={setHeroCta1Text}
                      cta1Link={heroCta1Link} onCta1Link={setHeroCta1Link}
                      cta2Text={heroCta2Text} onCta2Text={setHeroCta2Text}
                      cta2Link={heroCta2Link} onCta2Link={setHeroCta2Link}
                    />
                  )}
                  {usesHeroStats(template) && (
                    <V2HeroStatsFields
                      stats={heroStats}
                      updateStat={(idx, field, value) => setHeroStats((prev) => {
                        const next = [...prev];
                        while (next.length < 4) next.push({ id: uid(), icon: "BriefcaseStatIcon", value: "", label: "", sub: "" });
                        next[idx] = { ...next[idx], [field]: value };
                        return next;
                      })}
                    />
                  )}
                  {usesHeroBadges(template) && (
                    <V2AiHeroBadgeFields
                      stats={heroStats}
                      updateStat={(idx, field, value) => setHeroStats((prev) => {
                        const next = [...prev];
                        while (next.length < 5) next.push({ id: uid(), icon: "", value: "", label: "", sub: "" });
                        next[idx] = { ...next[idx], [field]: value };
                        return next;
                      })}
                    />
                  )}
                </>
              ) : (
                <>
              <div className="col-lg-4">
                <div style={{ fontWeight: 600, marginBottom: 6, color: "#484848" }}>Hero Image (Right Side)</div>
                <UploadWithAlt
                  stacked
                  altId="hero-img-alt"
                  altLabel="Alt Text"
                  altValue={heroImageAlt}
                  altOnChange={setHeroImageAlt}
                  altPlaceholder="Describe the hero image"
                  hasFile={!!heroImagePreview}
                  onRemove={() => { setHeroImageFile(null); setHeroImagePreview(heroImageExisting); }}
                >
                  <div className="wrap-custom-file height-150">
                    <input type="file" id="hero-img-main" accept="image/*" onChange={uploadHeroImage} />
                    <label style={heroImagePreview ? { backgroundImage: `url(${heroImagePreview})` } : {}} htmlFor="hero-img-main">
                      <span><i className="flaticon-download"></i> {heroImagePreview ? "Change" : "Upload"}</span>
                    </label>
                  </div>
                </UploadWithAlt>
              </div>

              {/* Hero Stats Bar is now STATIC — hard-coded in Hero.jsx. */}
              <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginTop: 12, marginBottom: 16, fontSize: 13, color: "#474972" }}>
                The hero Stats Bar (4 items: Projects Delivered, Client Retention, AI-Powered Solutions Built, Industries Served) is <strong>static</strong> and not editable here.
              </div>

              {/* Project Progress card — editable */}
              <div className="col-lg-12" style={{ marginTop: 4 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Project Progress Card</div>
              </div>
              <div className="col-lg-4">
                <div className="my_profile_setting_input form-group">
                  <label>Title</label>
                  <input type="text" className="form-control" value={projectProgressTitle} onChange={e => setProjectProgressTitle(e.target.value)} placeholder="Project Progress" />
                </div>
              </div>
              <div className="col-lg-2">
                <div className="my_profile_setting_input form-group">
                  <label>Value Badge</label>
                  <input type="text" className="form-control" value={projectProgressValue} onChange={e => setProjectProgressValue(e.target.value)} placeholder="+ 51%" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_textarea form-group">
                  <label>Body Text</label>
                  <textarea className="form-control" rows="2" value={projectProgressBody} onChange={e => setProjectProgressBody(e.target.value)} placeholder="Delivering scalable software solutions on time, sprint after sprint." />
                </div>
              </div>
                </>
              )}
            </>
          )}
        </SectionCard>

        {/* ── Choose Us ─────────────────────────────────────────────────────── */}
        <SectionCard id="sec-chooseus" title="Trust Section" accentColor="#2c2e50" toggleId="chooseUsShow" toggleName="chooseUsShow" enabled={chooseUsShow} onToggle={e => setChooseUsShow(e.target.checked)} badge={chooseUsFeatures.length + platformRatings.length}>
          {chooseUsShow && (
            <>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label>Section Heading</label>
                  <input type="text" className="form-control" value={chooseUsHeading} onChange={e => setChooseUsHeading(e.target.value)} />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label>Intro Paragraph</label>
                  <HtmlEditor value={chooseUsIntro} onChange={(v) => setChooseUsIntro(v)} />
                </div>
              </div>
              <div className="col-lg-12">
                <div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Features (Trust Section)</div>
                <button type="button" className="btn admore_btn mb20" onClick={() => addToList(setChooseUsFeatures, emptyFeature)}>+ Add Feature</button>
              </div>
              {chooseUsFeatures.map((f, i) => (
                <div className="col-12" key={f.id}>
                  <StepCard index={i} label="Feature" onRemove={() => removeFromList(setChooseUsFeatures, f.id)}>
                    <div className="col-xl-3"><IconPicker value={f.icon} onChange={v => updateListItem(setChooseUsFeatures, f.id, "icon", v)} /></div>
                    <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={f.title} onChange={e => updateListItem(setChooseUsFeatures, f.id, "title", e.target.value)} /></div></div>
                    <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Body</label><HtmlEditor value={f.body} onChange={(v) => updateListItem(setChooseUsFeatures, f.id, "body", v)} /></div></div>
                  </StepCard>
                </div>
              ))}
              {/* Platform Ratings are now STATIC — Google, Clutch, GoodFirms — hard-coded in TrustSection.jsx. */}
              <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#474972" }}>
                Platform Ratings (Google, Clutch, GoodFirms) are <strong>static</strong> and not editable here.
              </div>
              <div className="col-lg-12">
                <div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Client Love Items</div>
                <button type="button" className="btn admore_btn mb20" onClick={() => addToList(setClientLove, emptyClientLove)}>+ Add Item</button>
              </div>
              {clientLove.map((c, i) => (
                <div className="col-12" key={c.id}>
                  <StepCard index={i} label="Client Love" onRemove={() => removeFromList(setClientLove, c.id)}>
                    <div className="col-xl-3"><IconPicker value={c.icon} onChange={v => updateListItem(setClientLove, c.id, "icon", v)} /></div>
                    <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title} onChange={e => updateListItem(setClientLove, c.id, "title", e.target.value)} /></div></div>
                    <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Body</label><input type="text" className="form-control" value={c.body} onChange={e => updateListItem(setClientLove, c.id, "body", e.target.value)} /></div></div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* ── Why Location ──────────────────────────────────────────────────── */}
        <SectionCard id="sec-whylocation" title="Why Location Section" accentColor="#666894" toggleId="whyShow" toggleName="whyShow" enabled={whyShow} onToggle={e => setWhyShow(e.target.checked)} badge={whyFeatures.length}>
          {whyShow && (
            <>
              <div className="col-lg-12"><div className="my_profile_setting_input form-group"><label>Section Heading</label><input type="text" className="form-control" value={whyHeading} onChange={e => setWhyHeading(e.target.value)} /></div></div>
              <div className="col-lg-12"><div className="my_profile_setting_textarea form-group"><label>Paragraph 1</label><HtmlEditor value={whyPara1} onChange={(v) => setWhyPara1(v)} /></div></div>
              <div className="col-lg-12"><div className="my_profile_setting_textarea form-group"><label>Paragraph 2</label><HtmlEditor value={whyPara2} onChange={(v) => setWhyPara2(v)} /></div></div>
              <div className="col-lg-12"><div className="my_profile_setting_textarea form-group"><label>Paragraph 3</label><HtmlEditor value={whyPara3} onChange={(v) => setWhyPara3(v)} /></div></div>
              <div className="col-lg-12">
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Feature Cards</div>
                <button type="button" className="btn admore_btn mb20" onClick={() => addToList(setWhyFeatures, emptyFeature)}>+ Add Feature</button>
              </div>
              {whyFeatures.map((f, i) => (
                <div className="col-12" key={f.id}>
                  <StepCard index={i} label="Feature" onRemove={() => removeFromList(setWhyFeatures, f.id)}>
                    <div className="col-xl-3"><IconPicker value={f.icon} onChange={v => updateListItem(setWhyFeatures, f.id, "icon", v)} /></div>
                    <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={f.title} onChange={e => updateListItem(setWhyFeatures, f.id, "title", e.target.value)} /></div></div>
                    <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Body</label><HtmlEditor value={f.body} onChange={(v) => updateListItem(setWhyFeatures, f.id, "body", v)} /></div></div>
                  </StepCard>
                </div>
              ))}
              <div className="col-lg-6">
                <div style={{ fontWeight: 600, marginBottom: 6, color: "#484848" }}>Section Image</div>
                <UploadWithAlt altId="whyImageAlt" altLabel="Image Alt Text" altValue={whyImageAlt} altOnChange={setWhyImageAlt} altPlaceholder="Describe the location image" hasFile={!!whyImagePreview} onRemove={() => { setWhyImage(null); setWhyImagePreview(whyImageExisting); }}>
                  <div className="wrap-custom-file">
                    <input type="file" id="whyImage" accept="image/*" onChange={uploadWhyImage} />
                    <label style={whyImagePreview ? { backgroundImage: `url(${whyImagePreview})` } : {}} htmlFor="whyImage"><span><i className="flaticon-download"></i> {whyImagePreview ? "Change" : "Upload Image"}</span></label>
                  </div>
                </UploadWithAlt>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group"><label>Card Footer — Location Label</label><input type="text" className="form-control" value={whyCardLocation} onChange={e => setWhyCardLocation(e.target.value)} /></div>
                <div className="my_profile_setting_input form-group"><label>Card Footer — Heading</label><input type="text" className="form-control" value={whyCardHeading} onChange={e => setWhyCardHeading(e.target.value)} /></div>
                <div className="my_profile_setting_input form-group"><label>Card Footer — Body</label><HtmlEditor value={whyCardBody} onChange={(v) => setWhyCardBody(v)} /></div>
              </div>
            </>
          )}
        </SectionCard>

        {/* ── Process Section ───────────────────────────────────────────────── */}
        <SectionCard id="sec-process" title="Services Offered" accentColor="#4b4d7c" toggleId="processShow" toggleName="processShow" enabled={processShow} onToggle={e => setProcessShow(e.target.checked)} badge={processServices.length}>
          {processShow && (
            <>
              <div className="col-lg-8"><div className="my_profile_setting_input form-group"><label>Section Heading</label><input type="text" className="form-control" value={processHeading} onChange={e => setProcessHeading(e.target.value)} /></div></div>
              <div className="col-lg-12"><div className="my_profile_setting_textarea form-group"><label>Section Intro</label><HtmlEditor value={processIntro} onChange={(v) => setProcessIntro(v)} placeholder="Short paragraph below the section heading" /></div></div>
              <div className="col-lg-12"><button type="button" className="btn admore_btn mb20" onClick={() => addToList(setProcessServices, emptyProcessService)}>+ Add Service Card</button></div>
              
              <Reorder.Group axis="y" values={processServices} onReorder={setProcessServices} className="col-12 p-0">
                {processServices.map((s, i) => (
                  <Reorder.Item key={s.id} value={s} className="col-12 p-0" style={{ listStyle: "none" }}>
                    <StepCard 
                      index={i} 
                      label="Service" 
                      onRemove={() => removeFromList(setProcessServices, s.id)}
                    >
                      <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Number</label><input type="text" className="form-control" value={s.n} onChange={e => updateListItem(setProcessServices, s.id, "n", e.target.value)} placeholder="01" /></div></div>
                      {usesV2Sections(template) ? (
                      <div className="col-xl-10">
                        <div className="my_profile_setting_input form-group">
                          <label>Heading (H2)</label>
                          <input type="text" className="form-control" value={s.title} onChange={e => updateListItem(setProcessServices, s.id, "title", e.target.value)} placeholder="e.g. Custom Software Engineering" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="col-xl-4">
                          <div className="my_profile_setting_input form-group">
                            <label>Title</label>
                            <input type="text" className="form-control" value={s.title} onChange={e => updateListItem(setProcessServices, s.id, "title", e.target.value)} />
                          </div>
                        </div>
                        <div className="col-xl-6">
                          <div className="my_profile_setting_input form-group">
                            <label>Subtitle</label>
                            <input type="text" className="form-control" value={s.subtitle} onChange={e => updateListItem(setProcessServices, s.id, "subtitle", e.target.value)} />
                          </div>
                        </div>
                      </>
                    )}
                      <div className="col-xl-12"><div className="my_profile_setting_textarea form-group"><label>Paragraph</label><HtmlEditor value={s.para} onChange={(v) => updateListItem(setProcessServices, s.id, "para", v)} /></div></div>
                      <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>CTA Button Text</label><input type="text" className="form-control" value={s.ctaText} onChange={e => updateListItem(setProcessServices, s.id, "ctaText", e.target.value)} placeholder="e.g. Book a call" /></div></div>
                      <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>CTA Button Link</label><input type="text" className="form-control" value={s.ctaLink} onChange={e => updateListItem(setProcessServices, s.id, "ctaLink", e.target.value)} placeholder="e.g. /contact" /></div></div>
                      <div className="col-xl-6">
                        <label style={{ fontWeight: 600 }}>Bullet Points</label>
                        {s.points.map((pt, j) => (
                          <div key={j} className="d-flex gap-2 mb-2">
                            <input type="text" className="form-control" value={pt} onChange={e => updateSubItem(setProcessServices, s.id, "points", j, e.target.value)} />
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeSubItem(setProcessServices, s.id, "points", j)}>×</button>
                          </div>
                        ))}
                        <button type="button" className="btn admore_btn btn-sm mt-1" onClick={() => addSubItem(setProcessServices, s.id, "points", "")}>+ Point</button>
                      </div>
                      <div className="col-xl-6">
                        <label style={{ fontWeight: 600 }}>Tags</label>
                        {s.tags.map((tg, j) => (
                          <div key={j} className="d-flex gap-2 mb-2">
                            <input type="text" className="form-control" value={tg} onChange={e => updateSubItem(setProcessServices, s.id, "tags", j, e.target.value)} />
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeSubItem(setProcessServices, s.id, "tags", j)}>×</button>
                          </div>
                        ))}
                        <button type="button" className="btn admore_btn btn-sm mt-1" onClick={() => addSubItem(setProcessServices, s.id, "tags", "")}>+ Tag</button>
                      </div>
                    </StepCard>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </>
          )}
        </SectionCard>

        {/* ── What We Do ────────────────────────────────────────────────────── */}
        <SectionCard id="sec-whatwedo" title="Process Section" accentColor="#3c3e66" toggleId="whatWeDoShow" toggleName="whatWeDoShow" enabled={whatWeDoShow} onToggle={e => { setWhatWeDoShow(e.target.checked); if (e.target.checked && whatWeDoSteps.length === 0) setWhatWeDoSteps(mergeWithStaticSteps([])); }} badge={whatWeDoSteps.length}>
          {whatWeDoShow && (
            <>
              <div className="col-lg-12"><div className="my_profile_setting_input form-group"><label>Section Heading</label><input type="text" className="form-control" value={whatWeDoHeading} onChange={e => setWhatWeDoHeading(e.target.value)} /></div></div>
              <div className="col-lg-12"><div className="my_profile_setting_textarea form-group"><label>Section Subtitle</label><HtmlEditor value={whatWeDoSubtitle} onChange={(v) => setWhatWeDoSubtitle(v)} placeholder="Short paragraph below the section heading" /></div></div>
              <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#474972" }}>
                Stage names (left side: Discovery, Architecture, UX Design, Development, QA &amp; Security, Launch) are <strong>fixed</strong>. Only the right-side content (body, timeline, deliverables) is editable.
              </div>
              {whatWeDoSteps.map((s, i) => (
                <div className="col-12" key={s.id}>
                  <StepCard index={i} label="Step">
                    <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>Short Title</label><input type="text" className="form-control" value={s.shortTitle} readOnly disabled style={{ background: "#f4f5fa", cursor: "not-allowed" }} /></div></div>
                    <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Full Title</label><input type="text" className="form-control" value={s.title} readOnly disabled style={{ background: "#f4f5fa", cursor: "not-allowed" }} /></div></div>
                    <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Timeline</label><input type="text" className="form-control" value={s.timeline} onChange={e => updateListItem(setWhatWeDoSteps, s.id, "timeline", e.target.value)} /></div></div>
                    <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>Timeline Note</label><input type="text" className="form-control" value={s.timelineNote} onChange={e => updateListItem(setWhatWeDoSteps, s.id, "timelineNote", e.target.value)} /></div></div>
                    <div className="col-xl-12"><div className="my_profile_setting_textarea form-group"><label>Body</label><HtmlEditor value={s.body} onChange={(v) => updateListItem(setWhatWeDoSteps, s.id, "body", v)} /></div></div>
                    <div className="col-xl-12">
                      <label style={{ fontWeight: 600 }}>Deliverables</label>
                      {s.deliverables.map((d, j) => (
                        <div key={j} className="d-flex gap-2 mb-2">
                          <input type="text" className="form-control" value={d} onChange={e => updateSubItem(setWhatWeDoSteps, s.id, "deliverables", j, e.target.value)} />
                          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeSubItem(setWhatWeDoSteps, s.id, "deliverables", j)}>×</button>
                        </div>
                      ))}
                      <button type="button" className="btn admore_btn btn-sm mt-1" onClick={() => addSubItem(setWhatWeDoSteps, s.id, "deliverables", "")}>+ Deliverable</button>
                    </div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>
        {usesV2Sections(template) && (
        <SectionCard id="sec-techstack" title="Tech Stack Section" accentColor="#2c2e50" toggleId="techStackShow" toggleName="techStackShow" enabled={techStackShow} onToggle={e => setTechStackShow(e.target.checked)} badge={techCats.length}>
          {techStackShow && (
            <V2TechnologiesFields
              heading={techStackHeading} onHeading={setTechStackHeading}
              intro={techStackSubtitle} onIntro={setTechStackSubtitle}
              cats={techCats}
              addCat={() => addToList(setTechCats, emptyTechCat)}
              removeCat={(id) => removeFromList(setTechCats, id)}
              updateCat={(id, field, value) => updateListItem(setTechCats, id, field, value)}
              addLogo={(catId) => setTechCats(p => p.map(x => x.id === catId ? { ...x, pills: [...(x.pills || []), { e: "", label: "", img: "" }] } : x))}
              removeLogo={(catId, idx) => setTechCats(p => p.map(x => x.id === catId ? { ...x, pills: x.pills.filter((_, i) => i !== idx) } : x))}
              updateLogo={(catId, idx, patch) => setTechCats(p => p.map(x => x.id === catId ? { ...x, pills: x.pills.map((pl, i) => i === idx ? { ...pl, ...patch } : pl) } : x))}
            />
          )}
        </SectionCard>
        )}

        {/* ── Industries ────────────────────────────────────────────────────── */}
        <SectionCard id="sec-industries" title="Industries Section" accentColor="#4b4d7c" toggleId="industriesShow" toggleName="industriesShow" enabled={industriesShow} onToggle={e => { setIndustriesShow(e.target.checked); if (e.target.checked && industries.length === 0 && !usesV2Sections(template)) setIndustries(mergeWithStaticIndustries([])); }} badge={industries.length}>
          {industriesShow && (
            usesV2Sections(template) ? (
              <V2IndustriesFields
                heading={industriesHeading} onHeading={setIndustriesHeading}
                headingAccent={industriesHeadingAccent} onHeadingAccent={setIndustriesHeadingAccent}
                intro={industriesSubtitle} onIntro={setIndustriesSubtitle}
                industries={industries}
                addIndustry={() => addToList(setIndustries, emptyIndustry)}
                removeIndustry={(id) => removeFromList(setIndustries, id)}
                updateIndustry={(id, field, value) => updateListItem(setIndustries, id, field, value)}
              />
            ) : (
              <>
              <div className="col-lg-12"><div className="my_profile_setting_input form-group"><label>Section Heading</label><input type="text" className="form-control" value={industriesHeading} onChange={e => setIndustriesHeading(e.target.value)} /></div></div>
              <div className="col-lg-12"><div className="my_profile_setting_textarea form-group"><label>Section Subtitle</label><HtmlEditor value={industriesSubtitle} onChange={(v) => setIndustriesSubtitle(v)} placeholder="Short paragraph below the industries heading" /></div></div>

              <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#474972" }}>
                Industries are <strong>fixed</strong> across all SBC pages — name and image cannot be changed. Edit the bullet points (Key Pointers) for each industry below.
              </div>

              {industries.map((ind, i) => (
                <div className="col-12" key={ind.id}>
                  <StepCard index={i} label="Industry">
                    <div className="col-xl-4">
                      <div className="my_profile_setting_input form-group">
                        <label>Industry Name</label>
                        <input type="text" className="form-control" value={ind.name} readOnly disabled style={{ background: "#f4f5fa", cursor: "not-allowed" }} />
                      </div>
                    </div>
                    <div className="col-xl-8">
                      <label style={{ fontWeight: 600 }}>Key Pointers</label>
                      {ind.points.map((pt, j) => (
                        <div key={j} className="d-flex gap-2 mb-2">
                          <input type="text" className="form-control" value={pt} onChange={e => updateSubItem(setIndustries, ind.id, "points", j, e.target.value)} placeholder={`Pointer ${j + 1}`} />
                          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeSubItem(setIndustries, ind.id, "points", j)}>×</button>
                        </div>
                      ))}
                      <button type="button" className="btn admore_btn btn-sm mt-1" onClick={() => addSubItem(setIndustries, ind.id, "points", "")}>+ Add Pointer</button>
                    </div>
                  </StepCard>
                </div>
              ))}
              </>
            )
          )}
        </SectionCard>

        {/* ── Engagement ────────────────────────────────────────────────────── */}
        <SectionCard id="sec-engagement" title="Engagement Models Section" accentColor="#3c3e66" toggleId="engagementShow" toggleName="engagementShow" enabled={engagementShow} onToggle={e => setEngagementShow(e.target.checked)}>
          {engagementShow && (
            <>
              <div className="col-lg-12"><div className="my_profile_setting_input form-group"><label>Section Heading</label><input type="text" className="form-control" value={engagementHeading} onChange={e => setEngagementHeading(e.target.value)} /></div></div>
              <div className="col-lg-12"><div className="my_profile_setting_textarea form-group"><label>Section Subtitle</label><HtmlEditor value={engagementSubtitle} onChange={(v) => setEngagementSubtitle(v)} placeholder="Short paragraph below the engagement heading" /></div></div>
            </>
          )}
        </SectionCard>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <SectionCard id="sec-faq" title="FAQ Section" accentColor="#4b4d7c" toggleId="faqShow" toggleName="faqShow" enabled={faqShow} onToggle={e => setFaqShow(e.target.checked)} badge={faqs.length}>
          {faqShow && (
            <>
              <div className="col-lg-12"><div className="my_profile_setting_input form-group"><label>Section Heading</label><input type="text" className="form-control" value={faqHeading} onChange={e => setFaqHeading(e.target.value)} /></div></div>
              <div className="col-lg-12"><div className="my_profile_setting_textarea form-group"><label>Section Subtitle</label><HtmlEditor value={faqSubtitle} onChange={(v) => setFaqSubtitle(v)} placeholder="Short paragraph below the FAQ heading" /></div></div>
              <div className="col-lg-12"><button type="button" className="btn admore_btn mb20" onClick={() => addToList(setFaqs, emptyFaq)}>+ Add FAQ</button></div>
              {faqs.map((faq, i) => (
                <div className="col-12" key={faq.id}>
                  <StepCard index={i} label="FAQ" onRemove={() => removeFromList(setFaqs, faq.id)}>
                    <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Question</label><input type="text" className="form-control" value={faq.question} onChange={e => updateListItem(setFaqs, faq.id, "question", e.target.value)} /></div></div>
                    <div className="col-xl-7"><div className="my_profile_setting_textarea form-group"><label>Answer</label><textarea className="form-control" rows="3" value={faq.answer} onChange={e => updateListItem(setFaqs, faq.id, "answer", e.target.value)} /></div></div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* ── Toggle-only sections ──────────────────────────────────────────── */}
        <SectionCard id="sec-casestudies" title="Case Studies Section" accentColor="#666894" toggleId="caseStudiesShow" toggleName="caseStudiesShow" enabled={caseStudiesShow} onToggle={e => setCaseStudiesShow(e.target.checked)}>
          {caseStudiesShow && (
            <div className="row p-3">
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label>Section Heading</label>
                  <input type="text" className="form-control" value={caseStudiesHeading} onChange={e => setCaseStudiesHeading(e.target.value)} placeholder="e.g. Outcomes you can take to your board meeting." />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label>Section Subtitle</label>
                  <HtmlEditor value={caseStudiesSubtitle} onChange={(v) => setCaseStudiesSubtitle(v)} placeholder="Subtitle text..." />
                </div>
              </div>
              <div className="col-lg-12">
                <CaseStudyPicker
                  featured={caseStudiesFeatured}
                  others={caseStudiesOthers}
                  onFeaturedChange={setCaseStudiesFeatured}
                  onOthersChange={setCaseStudiesOthers}
                />
              </div>
            </div>
          )}
          <div className="col-lg-12"><p className="text-muted" style={{ fontSize: 13 }}>Toggle to show/hide the Case Studies section on this page. Pick the featured spotlight and the two supporting cards above — any slot left on Auto shows the latest published case study.</p></div>
        </SectionCard>

        <SectionCard id="sec-testimonials" title="Testimonials Section" accentColor="#666894" toggleId="testimonialsShow" toggleName="testimonialsShow" enabled={testimonialsShow} onToggle={e => setTestimonialsShow(e.target.checked)}>
          {testimonialsShow && (usesV2Sections(template) ? (
            <V2TestimonialsFields
              heading={testimonialsHeading}
              onHeading={setTestimonialsHeading}
              items={testimonialItems}
              addItem={() => setTestimonialItems(p => [...p, emptyTestimonial()])}
              removeItem={(id) => setTestimonialItems(p => p.filter(x => x.id !== id))}
              updateItem={(id, field, value) => setTestimonialItems(p => p.map(x => x.id === id ? { ...x, [field]: value } : x))}
            />
          ) : (
            <div className="col-lg-12"><p className="text-muted" style={{ fontSize: 13 }}>Content is pulled from existing testimonials.</p></div>
          ))}
        </SectionCard>

        <SectionCard id="sec-blog" title="Blog Section" accentColor="#666894" toggleId="blogShow" toggleName="blogShow" enabled={blogShow} onToggle={e => setBlogShow(e.target.checked)}>
          {blogShow && (
            <div className="row p-3">
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label>Section Heading</label>
                  <input type="text" className="form-control" value={blogHeading} onChange={e => setBlogHeading(e.target.value)} placeholder="e.g. Reading from the studio." />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label>Section Subtitle</label>
                  <HtmlEditor value={blogSubtitle} onChange={(v) => setBlogSubtitle(v)} placeholder="Subtitle text..." />
                </div>
              </div>
              <div className="col-lg-12">
                <p className="text-muted" style={{ fontSize: 13 }}>
                  Blog article cards are automatically populated with the latest active blog posts.
                </p>
              </div>
            </div>
          )}
        </SectionCard>

        {/* ── Why Choose Akoode ─────────────────────────────────────────────── */}
        <SectionCard id="sec-whychoose" title="Why Choose Akoode Section" accentColor="#3c3e66" toggleId="whyChooseShow" toggleName="whyChooseShow" enabled={whyChooseShow} onToggle={e => setWhyChooseShow(e.target.checked)} badge={whyChooseCards.length}>
          {whyChooseShow && (
            <>
              <div className="col-lg-12">
                <div className="my_profile_setting_input form-group">
                  <label>Section Heading</label>
                  <input type="text" className="form-control" value={whyChooseHeading} onChange={e => setWhyChooseHeading(e.target.value)} placeholder="e.g. Why UK Teams Choose Akoode" />
                </div>
              </div>
              <div className="col-lg-12"><div className="my_profile_setting_textarea form-group"><label>Section Subtitle</label><HtmlEditor value={whyChooseSubtitle} onChange={(v) => setWhyChooseSubtitle(v)} placeholder="Short paragraph below the section heading" /></div></div>
              <div className="col-lg-12">
                <div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Proof Cards</div>
                <button type="button" className="btn admore_btn mb20" onClick={() => addToList(setWhyChooseCards, emptyWhyChooseCard)}>+ Add Card</button>
              </div>
              {whyChooseCards.map((card, i) => (
                <div className="col-12" key={card.id}>
                  <StepCard index={i} label="Card" onRemove={() => removeFromList(setWhyChooseCards, card.id)}>
                    <div className="col-xl-3"><IconPicker value={card.icon} onChange={v => updateListItem(setWhyChooseCards, card.id, "icon", v)} label="Pick Icon" /></div>
                    <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={card.title} onChange={e => updateListItem(setWhyChooseCards, card.id, "title", e.target.value)} /></div></div>
                    <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Description</label><HtmlEditor value={card.desc} onChange={(v) => updateListItem(setWhyChooseCards, card.id, "desc", v)} /></div></div>
                  </StepCard>
                </div>
              ))}
              {/* Founder CTA card is now STATIC — fields hidden from admin. Heading/body/text/link are hard-coded in WhyChooseAkoode.jsx. */}
              <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginTop: 8, fontSize: 13, color: "#474972" }}>
                The founder CTA card (heading, body, button, link) is <strong>static</strong> and not editable here.
              </div>
            </>
          )}
        </SectionCard>

        {/* ── Final CTA ─────────────────────────────────────────────────────── */}
        <SectionCard id="sec-finalcta" title="Final CTA Section" accentColor="#2c2e50" toggleId="finalCtaShow" toggleName="finalCtaShow" enabled={finalCtaShow} onToggle={e => setFinalCtaShow(e.target.checked)}>
          {finalCtaShow && (
            <>
              <div className="col-lg-6"><div className="my_profile_setting_input form-group"><label>Heading</label><input type="text" className="form-control" value={finalCtaHeading} onChange={e => setFinalCtaHeading(e.target.value)} /></div></div>
              <div className="col-lg-6"><div className="my_profile_setting_textarea form-group"><label>Body Text</label><HtmlEditor value={finalCtaBody} onChange={(v) => setFinalCtaBody(v)} /></div></div>
              {/* Reply Time + NDA stats are STATIC — hard-coded in FinalCTA.jsx. */}
              <div className="col-lg-6" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#474972" }}>
                Reply Time and NDA labels are <strong>static</strong> (&quot;Response within 30 min&quot; / &quot;NDA signed on request&quot;) and not editable here.
              </div>
            </>
          )}
        </SectionCard>

        {/* ── Meta ──────────────────────────────────────────────────────────── */}
        <SectionCard id="sec-meta" title="Meta Information" accentColor="#A3B18A">
          <div className="col-lg-12">
            <div className="my_profile_setting_input form-group">
              <label>Meta Title</label>
              <input type="text" className="form-control" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} />
              {error.metaTitle && <span className="text-danger">{error.metaTitle}</span>}
            </div>
          </div>
          <div className="col-lg-12">
            <div className="my_profile_setting_textarea form-group">
              <label>Meta Description</label>
              <textarea className="form-control" rows="4" value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />
              {error.metaDescription && <span className="text-danger">{error.metaDescription}</span>}
            </div>
          </div>
        </SectionCard>

        {/* ── Sticky Submit Bar ──────────────────────────────────────────────── */}
        <div style={{ position: "sticky", bottom: 0, zIndex: 99, background: "#fff", borderTop: "1px solid #e4e4f0", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, boxShadow: "0 -2px 10px rgba(75,77,124,0.1)", marginTop: "8px", width: "100%" }}>
          <button type="button" className="btn btn1" onClick={() => window.location.href = "/thebusinesshub/service-by-country"}>← Back</button>
          {error.general && <span className="text-danger">{error.general}</span>}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <select
              className="form-control"
              style={{ width: 130, height: 40 }}
              value={statusValue}
              onChange={e => setStatusValue(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              type="button"
              className="btn btn1"
              disabled={isSubmitting}
              onClick={() => {
                if (statusValue !== "active") setStatusValue("draft");
                setIsPreviewing(false);
                document.querySelector("form")?.requestSubmit();
              }}
            >
              Save as Draft
            </button>
            <button
              type="button"
              className="btn btn1"
              disabled={isSubmitting}
              onClick={() => {
                previewSubmitRef.current = true;
                setIsPreviewing(true);
                setStatusValue("draft");
                document.querySelector("form")?.requestSubmit();
              }}
            >
              {isSubmitting && isPreviewing ? "Preparing Preview..." : "Preview"}
            </button>
            <button type="submit" className="btn btn2" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Update"}
            </button>
          </div>
        </div>

      </form>
    </>
  );
};

export default CreateList;

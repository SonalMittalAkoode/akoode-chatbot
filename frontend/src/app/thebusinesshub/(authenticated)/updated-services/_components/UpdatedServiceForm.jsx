"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  addUpdatedServiceAPI,
  updateUpdatedServiceAPI,
  getUpdatedServiceById,
} from "@/api/updatedService";
import { getIndustryTableData } from "@/api/industry";
import SectionCard from "../../services/_components/SectionCard";
import StepCard from "../../services/_components/StepCard";
import IconPicker from "@/components/admin/IconPicker";
import HtmlEditor from "@/components/HtmlEditor";
import TECH_LOGOS from "@/utils/techLogos";
import INDUSTRY_IMAGES from "@/utils/industryImages";

// ── Templates (layout selector — only software-development is built today) ──
const TEMPLATES = [
  { value: "software-development", label: "Software Development" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "ai", label: "AI" },
  { value: "ecommerce-development", label: "Ecommerce Development" },
  { value: "web-development", label: "Web Development" },
  { value: "staff-augmentation", label: "Staff Augmentation" },
  { value: "devops", label: "Cloud & DevOps" },
  { value: "digital-transformation", label: "Digital Transformation" },
  { value: "common", label: "Common (all other pages)" },
];

// ── Section navigator (anchors) — labels mirror the frontend components ──
const SECTION_NAV = [
  { id: "sec-core", label: "Core" },
  { id: "sec-hero", label: "Hero" },
  { id: "sec-whycustom", label: "Why Custom" },
  { id: "sec-services", label: "Services" },
  { id: "sec-solutions", label: "Solutions" },
  { id: "sec-ai", label: "AI" },
  { id: "sec-industries", label: "Industries" },
  { id: "sec-techstack", label: "Tech Stack" },
  { id: "sec-process", label: "Process" },
  { id: "sec-casestudies", label: "Case Studies" },
  { id: "sec-testimonials", label: "Testimonials" },
  { id: "sec-whyakoode", label: "Why Akoode" },
  { id: "sec-blogs", label: "Blogs" },
  { id: "sec-faq", label: "FAQ" },
  { id: "sec-finalcta", label: "Final CTA" },
  { id: "sec-meta", label: "Meta" },
];

// ── Section navigator for the Mobile App Development template ──
// On the Mobile template the section content is swapped vs. software-dev: the
// `process` key holds the dark-snake service cards and the `services` key holds
// the timeline stages. The tab labels, keys and designs all line up cleanly
// (Process tab → process key → snake; Services tab → services key → timeline).
const SECTION_NAV_MOBILE = [
  { id: "sec-core", label: "Core" },
  { id: "sec-hero", label: "Hero" },
  { id: "sec-intro", label: "Intro" },
  { id: "sec-services", label: "Services" },
  { id: "sec-technologies", label: "Technologies" },
  { id: "sec-whychoose", label: "Why Choose" },
  { id: "sec-process", label: "Process" },
  { id: "sec-engagement", label: "Engagement" },
  { id: "sec-casestudies", label: "Case Studies" },
  { id: "sec-testimonials", label: "Testimonials" },
  { id: "sec-industries", label: "Industries" },
  { id: "sec-blogs", label: "Blogs" },
  { id: "sec-faq", label: "FAQ" },
  { id: "sec-finalcta", label: "Final CTA" },
  { id: "sec-meta", label: "Meta" },
];

// ── Section navigator for the AI Development template ──
const SECTION_NAV_AI = [
  { id: "sec-core", label: "Core" },
  { id: "sec-hero", label: "Hero" },
  { id: "sec-gap", label: "Intro / Gap" },
  { id: "sec-services", label: "Services" },
  { id: "sec-capabilities", label: "Capabilities" },
  { id: "sec-trends", label: "AI Trends" },
  { id: "sec-industries", label: "Industries" },
  { id: "sec-technologies", label: "Tech Stack" },
  { id: "sec-process", label: "Process" },
  { id: "sec-engagement", label: "Engagement" },
  { id: "sec-casestudies", label: "Case Studies" },
  { id: "sec-whychoose", label: "Why Choose" },
  { id: "sec-testimonials", label: "Testimonials" },
  { id: "sec-blogs", label: "Blogs" },
  { id: "sec-faq", label: "FAQ" },
  { id: "sec-finalcta", label: "Final CTA" },
  { id: "sec-meta", label: "Meta" },
];

// ── Section navigator for the Ecommerce Development template ──
// Mirrors the live section order on /services-v2/ecommerce-development.
// Hero's stats bar + 3 floating metric cards, and the Engagement plans,
// are fixed design elements — no editors are shown for them.
const SECTION_NAV_ECOMMERCE = [
  { id: "sec-core", label: "Core" },
  { id: "sec-hero", label: "Hero" },
  { id: "sec-platformproblem", label: "Platform Problem" },
  { id: "sec-ecommerceservices", label: "Ecommerce Services" },
  { id: "sec-commerceengineering", label: "Commerce Engineering" },
  { id: "sec-trends", label: "Trends" },
  { id: "sec-ecommerceplatforms", label: "Ecommerce Platforms" },
  { id: "sec-industries", label: "Industries" },
  { id: "sec-technologies", label: "Tech Stack" },
  { id: "sec-ecommerceprocess", label: "Process" },
  { id: "sec-engagement", label: "Engagement" },
  { id: "sec-casestudies", label: "Case Studies" },
  { id: "sec-whychoose", label: "Why Choose" },
  { id: "sec-blogs", label: "Blogs" },
  { id: "sec-faq", label: "FAQ" },
  { id: "sec-finalcta", label: "Final CTA" },
  { id: "sec-meta", label: "Meta" },
];

// ── Section navigator for the Web Development template ──
// Mirrors the live section order on /services-v2/web-development.
const SECTION_NAV_WEBDEV = [
  { id: "sec-core", label: "Core" },
  { id: "sec-hero", label: "Hero" },
  { id: "sec-whynow", label: "Why Now" },
  { id: "sec-services", label: "Services" },
  { id: "sec-commerceengineering", label: "Engineering Depth" },
  { id: "sec-trends", label: "Trends" },
  { id: "sec-industries", label: "Industries" },
  { id: "sec-technologies", label: "Tech Stack" },
  { id: "sec-ecommerceprocess", label: "Process" },
  { id: "sec-engagement", label: "Engagement" },
  { id: "sec-casestudies", label: "Case Studies" },
  { id: "sec-whychoose", label: "Why Choose" },
  { id: "sec-testimonials", label: "Testimonials" },
  { id: "sec-blogs", label: "Blogs" },
  { id: "sec-faq", label: "FAQ" },
  { id: "sec-finalcta", label: "Final CTA" },
  { id: "sec-meta", label: "Meta" },
];

// ── Section navigator for the Staff Augmentation template ──
// Mirrors the live section order on /services-v2/staff-augmentation.
const SECTION_NAV_STAFFAUG = [
  { id: "sec-core", label: "Core" },
  { id: "sec-hero", label: "Hero" },
  { id: "sec-hiringgap", label: "Hiring Gap" },
  { id: "sec-staffservices", label: "Services" },
  { id: "sec-capabilities", label: "Capabilities" },
  { id: "sec-modelfit", label: "Model Fit" },
  { id: "sec-trends", label: "Trends" },
  { id: "sec-industries", label: "Industries" },
  { id: "sec-technologies", label: "Tech Stack" },
  { id: "sec-ecommerceprocess", label: "Process" },
  { id: "sec-engagement", label: "Engagement" },
  { id: "sec-casestudies", label: "Case Studies" },
  { id: "sec-testimonials", label: "Testimonials" },
  { id: "sec-whychoose", label: "Why Choose" },
  { id: "sec-blogs", label: "Blogs" },
  { id: "sec-faq", label: "FAQ" },
  { id: "sec-finalcta", label: "Final CTA" },
  { id: "sec-meta", label: "Meta" },
];

// ── Section navigator for the Cloud & DevOps template ──
// Mirrors the live section order on /services-v2/devops.
const SECTION_NAV_DEVOPS = [
  { id: "sec-core", label: "Core" },
  { id: "sec-hero", label: "Hero" },
  { id: "sec-devopsbottleneck", label: "Bottleneck" },
  { id: "sec-devopsservices", label: "Services" },
  { id: "sec-devopscapabilities", label: "Capabilities" },
  { id: "sec-devopsengagementfit", label: "Engagement Fit" },
  { id: "sec-devopscost", label: "Cost & Timeline" },
  { id: "sec-devopsoutlook", label: "2026 Outlook" },
  { id: "sec-industries", label: "Industries" },
  { id: "sec-technologies", label: "Tech Stack" },
  { id: "sec-ecommerceprocess", label: "Process" },
  { id: "sec-engagement", label: "Engagement" },
  { id: "sec-casestudies", label: "Case Studies" },
  { id: "sec-whychoose", label: "Why Choose" },
  { id: "sec-blogs", label: "Blogs" },
  { id: "sec-faq", label: "FAQ" },
  { id: "sec-finalcta", label: "Final CTA" },
  { id: "sec-meta", label: "Meta" },
];

// ── Section navigator for the Digital Transformation template ──
// Mirrors the live section order on /services-v2/digital-transformation.
const SECTION_NAV_DT = [
  { id: "sec-core", label: "Core" },
  { id: "sec-hero", label: "Hero" },
  { id: "sec-dtproblem", label: "The Problem" },
  { id: "sec-dtservices", label: "Services" },
  { id: "sec-dtcapabilities", label: "Capabilities" },
  { id: "sec-dtscope", label: "Scope Table" },
  { id: "sec-dtcost", label: "Cost & Timeline" },
  { id: "sec-dttrends", label: "2026 Trends" },
  { id: "sec-dtindustries", label: "Industries" },
  { id: "sec-dtprocess", label: "Process" },
  { id: "sec-technologies", label: "Tech Stack" },
  { id: "sec-engagement", label: "Engagement" },
  { id: "sec-casestudies", label: "Case Studies" },
  { id: "sec-whychoose", label: "Why Choose" },
  { id: "sec-blogs", label: "Blogs" },
  { id: "sec-faq", label: "FAQ" },
  { id: "sec-finalcta", label: "Final CTA" },
  { id: "sec-meta", label: "Meta" },
];

// ── empty item factories ──
const emptyStat = () => ({ icon: "", value: "", label: "" });
const emptyIconCard = () => ({ icon: "", title: "", desc: "" });
const emptyIndustry = () => ({ icon: "", name: "", desc: "", image: "", href: "" });
const emptyFaq = () => ({ q: "", a: "" });
// Staff Augmentation template item factories
const emptyGapPoint = () => ({ icon: "", text: "" });
const emptyStaffService = () => ({ title: "", duration: "", price: "", blocks: [], steps: [] });
const emptyServiceBlock = () => ({ label: "", body: "" });
const emptyCapability = () => ({ title: "", desc: "" });
const emptyFitQuestion = () => ({ icon: "", text: "" });
const emptyFitModel = () => ({ icon: "", name: "", fit: "", directs: "", duration: "" });
// Mobile App Development template item factories
const emptyPill = () => ({ icon: "", label: "" });
const emptyStatCard = () => ({ icon: "", value: "", label: "", desc: "" });
const emptyMobileService = () => ({ num: "", tag: "", title: "", desc: "" });
const emptyTab = () => ({ label: "", logos: [] });
// AI Development template item factories
const emptyShift = () => ({ num: "", icon: "", title: "", desc: "" });
const emptyBadge = () => ({ icon: "", title: "", subtitle: "" });
const emptyLogo = () => ({ label: "", img: "" });
const emptyProcessStep = () => ({ label: "", stageTitle: "", link: "", intro: "", outcome: "", image: "", imageAlt: "" });
const emptyTestimonial = () => ({ quote: "", name: "", designation: "", company: "", mediaType: "none", image: "", imageAlt: "", embedCode: "" });
// Ecommerce Development template item factories
const emptyPlatformPoint = () => ({ icon: "", text: "" });
const emptyTitleDesc = () => ({ title: "", desc: "" });
const emptyPlatformRow = () => ({ title: "", desc: "", ctaText: "", ctaLink: "" });
// Web Development template item factories
const emptyNumberedCard = () => ({ number: "", text: "" });
const emptyServiceItem = () => ({ title: "", desc: "", ctaText: "", ctaLink: "" });
// Cloud & DevOps template item factories
// ctaText/ctaLink are per-card overrides — blank falls back to the section CTA.
const emptyDevopsService = () => ({ title: "", desc: "", ctaText: "", ctaLink: "" });
const emptyFitOption = () => ({ icon: "", title: "", desc: "", rows: [] });
const emptyFitRow = () => ({ label: "", value: "" });
const emptyFitCallout = () => ({ icon: "", text: "" });
const emptyCostDriver = () => ({ icon: "", title: "", desc: "" });
const emptyCostTimeline = () => ({ icon: "", title: "", range: "", unit: "Weeks" });
const emptyOutlookCard = () => ({ icon: "", question: "", answer: "" });

// Digital Transformation hero stat strip. These mirror DtHero's coded
// fallbacks, so prefilling the form shows the values the page actually renders
// rather than a blank list. Keep the two in step if either changes.
const DT_HERO_STATS = [
  { icon: "", value: "4.9", label: "Google Rating" },
  { icon: "", value: "97%", label: "Client Retention" },
  { icon: "", value: "15+", label: "Industries Served" },
  { icon: "", value: "Global", label: "Delivery" },
];
// Digital Transformation template item factories
const emptyDtReality = () => ({ eyebrow: "", heading: "", body: "" });
const emptyDtService = () => ({ num: "", eyebrow: "", title: "", desc: "", link: "" });
const emptyDtCapability = () => ({ num: "", title: "", body: "" });
const emptyDtScopeRow = () => ({ num: "", approach: "", bestFit: "", duration: "", risk: "" });
const emptyDtFactor = () => ({ num: "", title: "", body: "" });
// No `fill`: the progress-bar width is a fixed design element, set per
// position in DtCostTimeline rather than authored.
const emptyDtTimeline = () => ({ title: "", body: "", value: "", unit: "" });
const emptyDtTrend = () => ({ num: "", heading: "", body: "" });
const emptyDtIndustry = () => ({ num: "", label: "", bullets: [], body: "", image: "", imageAlt: "", href: "", stats: [] });
const emptyDtStat = () => ({ value: "", label: "" });
const emptyDtStep = () => ({ num: "", eyebrow: "", title: "", body: "", quote: "" });

const INITIAL = {
  title: "",
  slug: "",
  template: "software-development",

  hero: {
    show: true,
    heading: "",
    headingAccent: "",
    paragraphs: [""],
    cta1Text: "",
    cta1Link: "",
    cta2Text: "",
    cta2Link: "",
    stats: [],
    badges: [],
  },
  whyCustom: {
    show: false,
    heading: "",
    headingAccent: "",
    paragraphs: [""],
    rightTitle: "",
    features: [],
  },
  services: { show: false, heading: "", headingAccent: "", intro: "", items: [] },
  solutions: { show: false, heading: "", headingAccent: "", items: [] },
  ai: { show: false, heading: "", headingAccent: "", headingTail: "", paragraphs: [""], items: [] },
  industries: { show: false, heading: "", headingAccent: "", intro: "", items: [] },
  techStack: { show: true, heading: "", subtitle: "" },
  // ── Mobile App Development template sections ──
  intro: { show: false, heading: "", headingAccent: "", paragraphs: [""], pills: [], statCards: [], closingParagraphs: [""] },
  // ── AI Development template sections ──
  gap: { show: false, heading: "", quote: "", featureTitle: "", featureBody: "", paragraphs: [""], shiftsHeading: "", shifts: [] },
  capabilities: { show: false, heading: "", headingAccent: "", quote: "", paragraph: "", items: [] },
  trends: { show: false, heading: "", headingAccent: "", intro: "", items: [], image: "", imageAlt: "" },
  technologies: { show: false, heading: "", headingLead: "", headingRest: "", intro: "", tabs: [] },
  whyChoose: { show: false, heading: "", headingAccent: "", headingTail: "", subtitle: "", cards: [] },
  engagement: { show: false, heading: "", headingTail: "", subtitle: "", plans: [] },
  process: { show: false, heading: "", headingAccent: "", intro: "", steps: [] },
  // ── Ecommerce Development template sections ──
  platformProblem: { show: false, heading: "", headingAccent: "", intro: "", points: [], cardTitle: "", cardBody: "", quote: "" },
  ecommerceServices: { show: false, heading: "", headingAccent: "", intro: "", items: [] },
  commerceEngineering: { show: false, heading: "", headingAccent: "", intro: "", columns: [] },
  ecommercePlatforms: { show: false, heading: "", headingAccent: "", intro: "", rows: [] },
  ecommerceProcess: { show: false, heading: "", headingAccent: "", intro: "", steps: [] },
  caseStudies: { show: false, heading: "", headingAccent: "", intro: "", items: [] },
  testimonials: { show: false, heading: "What Our Client Says", items: [] },
  whyAkoode: {
    show: false,
    heading: "",
    headingAccent: "",
    subtitle: "",
    cards: [],
  },
  blogs: { show: false, heading: "", headingAccent: "", intro: "", items: [] },
  faq: { show: false, heading: "", headingAccent: "", intro: "", items: [] },
  finalCta: { show: false, eyebrow: "", heading: "", headingAccent: "", subtitle: "" },
  meta: { title: "", description: "" },

  // ── Web Development template sections ──

  whyNow: { show: false, heading: "", headingAccent: "", intro: "", cardTitle: "", cardBody: "", cards: [] },

  // ── Staff Augmentation template sections ──
  hiringGap: { show: false, heading: "", headingAccent: "", points: [] },
  staffServices: { show: false, heading: "", headingAccent: "", intro: "", items: [] },
  vendorCapabilities: { show: false, heading: "", intro: "", items: [] },
  modelFit: {
    show: false, heading: "", headingAccent: "", intro: "",
    questions: [], models: [], quotes: ["", ""],
    warningTitle: "", warningParagraphs: ["", ""],
  },

  // ── Cloud & DevOps template sections ──
  devopsBottleneck: { show: false, heading: "", headingAccent: "", intro: "", cardTitle: "", cardBody: "", points: ["", "", ""] },
  devopsServices: { show: false, heading: "", headingAccent: "", headingTail: "", intro: "", ctaText: "", ctaLink: "", items: [] },
  devopsCapabilities: { show: false, heading: "", headingAccent: "", intro: "", items: [] },
  devopsEngagementFit: { show: false, heading: "", headingAccent: "", intro: "", options: [], callouts: [] },
  devopsCost: { show: false, heading: "", headingAccent: "", intro: "", note: "", drivers: [], timelines: [], steps: [] },
  devopsOutlook: { show: false, heading: "", headingAccent: "", intro: "", note: "", cards: [] },

  // ── Digital Transformation template sections ──
  dtProblem: { show: false, heading: "", headingAccent: "", intro: "", cardEyebrow: "", cardTitle: "", cardBody: "", railWords: [], items: [] },
  dtServices: { show: false, heading: "", headingAccent: "", intro: "", ctaText: "", ctaLink: "", items: [] },
  dtCapabilities: { show: false, heading: "", headingAccent: "", intro: "", items: [] },
  dtScope: { show: false, heading: "", headingAccent: "", intro: "", columns: [], rows: [], noteBody: "", calloutTitle: "", calloutBody: "" },
  dtCost: {
    show: false, heading: "", headingAccent: "", intro: "",
    costHeading: "", circleEyebrow: "", circleTitle: "", factors: [],
    timelineHeading: "", timelines: [],
    bannerLead: "", bannerHighlight: "", bannerTail: "", bannerBody: "",
  },
  dtTrends: { show: false, heading: "", headingAccent: "", intro: "", orbEyebrow: "", orbTitle: "", orbTitleAccent: "", items: [] },
  dtIndustries: { show: false, heading: "", headingAccent: "", intro: "", listTitle: "", items: [] },
  dtProcess: { show: false, heading: "", headingAccent: "", intro: "", steps: [] },

};

const SECTION_KEYS = [
  "hero", "whyCustom", "services", "solutions", "ai", "industries",
  "techStack", "process", "caseStudies", "testimonials", "whyAkoode", "blogs", "faq", "finalCta", "meta",
  // Mobile App Development template sections
  "intro", "technologies", "whyChoose", "engagement",
  // AI Development template sections
  "gap", "capabilities", "trends",
  // Ecommerce Development template sections
  "platformProblem", "ecommerceServices", "commerceEngineering", "ecommercePlatforms", "ecommerceProcess",
  // Web Development template sections
  "whyNow",
  // Staff Augmentation template sections
  "hiringGap", "staffServices", "vendorCapabilities", "modelFit",
  // Cloud & DevOps template sections
  "devopsBottleneck", "devopsServices", "devopsCapabilities",
  "devopsEngagementFit", "devopsCost", "devopsOutlook",
  // Digital Transformation template sections
  "dtProblem", "dtServices", "dtCapabilities", "dtScope",
  "dtCost", "dtTrends", "dtIndustries", "dtProcess",
];

const toSlug = (v) =>
  v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const clone = (obj) => JSON.parse(JSON.stringify(obj));

export default function UpdatedServiceForm() {
  const router = useRouter();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState(() => clone(INITIAL));
  const [statusValue, setStatusValue] = useState("draft");
  const [slugEdited, setSlugEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});
  const [caseStudyOptions, setCaseStudyOptions] = useState([]);
  const [blogOptions, setBlogOptions] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);

  // ── fetch case-study-latest entries for the selector (new design only) ──
  useEffect(() => {
    const BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "").replace(/\/$/, "");
    fetch(`${BASE}/api/case-study-latest?limit=200&page=1`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((data) => {
        if (!data) return;
        const arr = data?.items || data?.data || (Array.isArray(data) ? data : []);
        setCaseStudyOptions(
          arr
            .map((cs) => ({ slug: cs.slug, title: String(cs.title || cs.slug || "").replace(/<[^>]*>/g, "").trim() }))
            .filter((o) => o.slug)
        );
      });
  }, []);

  // ── fetch published blogs for the blog-slot selector ──
  useEffect(() => {
    const BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "").replace(/\/$/, "");
    fetch(`${BASE}/api/blog?limit=200&page=1`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((data) => {
        if (!data) return;
        const arr = data?.blogs || data?.items || data?.data || (Array.isArray(data) ? data : []);
        setBlogOptions(
          arr
            .map((b) => ({ slug: b.slug, title: String(b.title || b.slug || "").replace(/<[^>]*>/g, "").trim() }))
            .filter((o) => o.slug)
        );
      });
  }, []);

  // ── fetch published industry pages for the "Page link" selector ──
  useEffect(() => {
    getIndustryTableData({ limit: 200, page: 1 })
      .then(({ items }) => {
        setIndustryOptions(
          (items || [])
            .filter((i) => i.status === "active")
            .map((i) => ({ slug: i.slug, name: String(i.name || i.slug || "").trim() }))
            .filter((o) => o.slug)
        );
      })
      .catch(() => {});
  }, []);

  // ── load on edit ──
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getUpdatedServiceById(id);
        const d = res?.data ?? res;
        if (!d) return;
        const merged = clone(INITIAL);
        merged.title = d.title ?? "";
        merged.slug = d.slug ?? "";
        merged.template = d.template ?? "software-development";
        setSlugEdited(true);
        setStatusValue(d.status === true ? "active" : d.isDraft ? "draft" : "inactive");
        SECTION_KEYS.forEach((k) => {
          if (d[k] && typeof d[k] === "object") merged[k] = { ...merged[k], ...d[k] };
        });
        setForm(merged);
      } catch (err) {
        toast.error(err.message || "Failed to load entry");
      }
    })();
  }, [id]);

  // ── nested state helpers ──
  const setTop = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const setSec = (sec, field, v) =>
    setForm((p) => ({ ...p, [sec]: { ...p[sec], [field]: v } }));

  // object-array helpers (sec.arrKey is an array of objects)
  const addArr = (sec, arrKey, empty) =>
    setForm((p) => ({ ...p, [sec]: { ...p[sec], [arrKey]: [...(p[sec][arrKey] || []), empty()] } }));
  const removeArr = (sec, arrKey, i) =>
    setForm((p) => ({ ...p, [sec]: { ...p[sec], [arrKey]: p[sec][arrKey].filter((_, idx) => idx !== i) } }));
  const setArr = (sec, arrKey, i, field, v) =>
    setForm((p) => ({
      ...p,
      [sec]: { ...p[sec], [arrKey]: p[sec][arrKey].map((it, idx) => (idx === i ? { ...it, [field]: v } : it)) },
    }));

  // string-array helpers (sec.arrKey is an array of strings, e.g. paragraphs)
  const addStr = (sec, arrKey) =>
    setForm((p) => ({ ...p, [sec]: { ...p[sec], [arrKey]: [...(p[sec][arrKey] || []), ""] } }));
  const removeStr = (sec, arrKey, i) =>
    setForm((p) => ({ ...p, [sec]: { ...p[sec], [arrKey]: p[sec][arrKey].filter((_, idx) => idx !== i) } }));
  const setStr = (sec, arrKey, i, v) =>
    setForm((p) => ({
      ...p,
      [sec]: { ...p[sec], [arrKey]: p[sec][arrKey].map((s, idx) => (idx === i ? v : s)) },
    }));

  // ── nested-array helpers (an array living inside an object-array item) ──
  const setNested = (sec, arrKey, i, subKey, updater) =>
    setForm((p) => ({
      ...p,
      [sec]: {
        ...p[sec],
        [arrKey]: p[sec][arrKey].map((it, idx) => (idx === i ? { ...it, [subKey]: updater(it[subKey] || []) } : it)),
      },
    }));
  const addNestedStr = (sec, arrKey, i, subKey) => setNested(sec, arrKey, i, subKey, (a) => [...a, ""]);
  const setNestedStr = (sec, arrKey, i, subKey, j, v) => setNested(sec, arrKey, i, subKey, (a) => a.map((s, idx) => (idx === j ? v : s)));
  const removeNestedStr = (sec, arrKey, i, subKey, j) => setNested(sec, arrKey, i, subKey, (a) => a.filter((_, idx) => idx !== j));
  const addNestedObj = (sec, arrKey, i, subKey, empty) => setNested(sec, arrKey, i, subKey, (a) => [...a, empty()]);
  const setNestedObj = (sec, arrKey, i, subKey, j, field, v) => setNested(sec, arrKey, i, subKey, (a) => a.map((o, idx) => (idx === j ? { ...o, [field]: v } : o)));
  const removeNestedObj = (sec, arrKey, i, subKey, j) => setNested(sec, arrKey, i, subKey, (a) => a.filter((_, idx) => idx !== j));

  // Active template — drives which section set renders (software-dev stays untouched).
  const isMobile = form.template === "mobile-development";
  // The AI Development template shares the Mobile (Mad) section shapes: the
  // services ↔ process swap, technologies, whyChoose, engagement, industries,
  // etc. `isMad` = "uses the Mad-style editors"; `isAi` adds the 3 new sections.
  const isAi = form.template === "ai";
  // Ecommerce Development template — reuses the Mad-style two-tone hero heading,
  // Technologies/WhyChoose/Engagement/Industries editors, plus its own dedicated
  // sections (Platform Problem, Ecommerce Services, Commerce Engineering,
  // Ecommerce Platforms, Ecommerce Process).
  const isEcommerce = form.template === "ecommerce-development";
  // Web Development — reuses the Mad-style Technologies/Engagement editors
  // (isMad) plus Ecommerce's own Commerce Engineering/Trends/Ecommerce Process/
  // Why Choose sections (added individually below since those aren't gated by
  // isMad), and has three sections entirely of its own: Trust Bar, Why Now,
  // and a Services editor with no icon field (the orbit cards are title+desc
  // only) — that last one is why it's excluded from the shared Services block.
  const isWebDev = form.template === "web-development";
  const isStaffAug = form.template === "staff-augmentation";
  const isDevops = form.template === "devops";
  // Digital Transformation reuses the Mad-style hero (three-part heading,
  // editable stat strip) and the shared Tech Stack / Engagement / Why Choose
  // sections, so it joins the isMad union rather than re-gating each one.
  const isDt = form.template === "digital-transformation";
  const isMad = isMobile || isAi || isEcommerce || isWebDev || isStaffAug || isDevops || isDt;

  // The hero stat strip is prefilled with what the page already renders, so an
  // editor adjusts four visible rows instead of adding four empty ones and
  // retyping the defaults. Only fills when the list is empty — an existing
  // record's stats are never overwritten.
  //
  // This is not inventing content: with no stats saved, DtHero falls back to
  // exactly these four. Showing them makes the live values editable rather
  // than leaving the form blank while the page says otherwise.
  useEffect(() => {
    if (!isDt) return;
    if (form.hero?.stats?.length) return;
    setSec("hero", "stats", DT_HERO_STATS.map((s) => ({ ...s })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDt]);

  // ── drag-to-reorder (object arrays) ──
  const dragState = useRef({ sec: null, arrKey: null, from: null });
  const dnd = (sec, arrKey, index) => ({
    draggableHandle: true,
    onHandleDragStart: () => { dragState.current = { sec, arrKey, from: index }; },
    onCardDragOver: (e) => e.preventDefault(),
    onCardDrop: () => {
      const { sec: s, arrKey: a, from } = dragState.current;
      if (s !== sec || a !== arrKey || from === null || from === index) return;
      setForm((p) => {
        const arr = [...p[sec][arrKey]];
        const [moved] = arr.splice(from, 1);
        arr.splice(index, 0, moved);
        return { ...p, [sec]: { ...p[sec], [arrKey]: arr } };
      });
      dragState.current = { sec: null, arrKey: null, from: null };
    },
  });

  // ── hero image upload ──
  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const storedUser = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
      const token = storedUser ? JSON.parse(storedUser)?.token : "";
      const fd = new FormData();
      fd.append("images", file);
      const BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "").replace(/\/$/, "");
      const res = await fetch(`${BASE}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const urls = await res.json();
      if (Array.isArray(urls) && urls[0]) {
        const autoAlt = file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setForm((p) => ({
          ...p,
          hero: {
            ...p.hero,
            heroImage: urls[0],
            heroImageAlt: p.hero.heroImageAlt || autoAlt,
          },
        }));
      }
    } catch (err) {
      alert("Image upload failed: " + (err?.message || "Unknown error"));
    }
  };

  // ── Digital Transformation industry image upload ──
  // Same endpoint as the hero upload, but writes into one row of
  // dtIndustries.items, so the index has to be carried through.
  // A row's image is either an asset committed under /public (what the
  // template ships with) or a CMS upload served from the API origin. The
  // thumbnail has to resolve both, the same way the front end does.
  const dtIndustryPreview = (src) => {
    if (!src) return "";
    if (/^https?:\/\//i.test(src)) return src;
    if (src.startsWith("/digital-transformation/")) return src;
    return `${(process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")}/${src.replace(/^\//, "")}`;
  };

  const handleDtIndustryImageUpload = async (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const storedUser = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
      const token = storedUser ? JSON.parse(storedUser)?.token : "";
      const fd = new FormData();
      fd.append("images", file);
      const BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "").replace(/\/$/, "");
      const res = await fetch(`${BASE}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const urls = await res.json();
      if (Array.isArray(urls) && urls[0]) {
        const autoAlt = file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setForm((prev) => {
          const items = [...(prev.dtIndustries.items || [])];
          items[index] = { ...items[index], image: urls[0], imageAlt: items[index]?.imageAlt || autoAlt };
          return { ...prev, dtIndustries: { ...prev.dtIndustries, items } };
        });
      }
    } catch (err) {
      alert("Image upload failed: " + (err?.message || "Unknown error"));
    }
  };

  // ── industry image upload ──

  // ── trends section image upload (Ecommerce: trends.image) ──
  const handleTrendsImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const storedUser = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
      const token = storedUser ? JSON.parse(storedUser)?.token : "";
      const fd = new FormData();
      fd.append("images", file);
      const BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "").replace(/\/$/, "");
      const res = await fetch(`${BASE}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const urls = await res.json();
      if (Array.isArray(urls) && urls[0]) {
        const autoAlt = file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setForm((p) => ({
          ...p,
          trends: {
            ...p.trends,
            image: urls[0],
            imageAlt: p.trends.imageAlt || autoAlt,
          },
        }));
      }
    } catch (err) {
      alert("Image upload failed: " + (err?.message || "Unknown error"));
    }
  };

  // ── timeline stage image upload (Mobile: services.items[si]) ──
  const handleProcessImageUpload = async (e, stepIdx) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const storedUser = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
      const token = storedUser ? JSON.parse(storedUser)?.token : "";
      const fd = new FormData();
      fd.append("images", file);
      const BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "").replace(/\/$/, "");
      const res = await fetch(`${BASE}/api/upload`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const urls = await res.json();
      if (Array.isArray(urls) && urls[0]) {
        const autoAlt = file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setForm((p) => ({
          ...p,
          services: {
            ...p.services,
            items: p.services.items.map((s, si) => (si === stepIdx ? { ...s, image: urls[0], imageAlt: s.imageAlt || autoAlt } : s)),
          },
        }));
      }
    } catch (err) {
      alert("Image upload failed: " + (err?.message || "Unknown error"));
    }
  };

  // ── timeline stage image upload (Ecommerce: ecommerceProcess.steps[si]) ──
  const handleEcommerceProcessImageUpload = async (e, stepIdx) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const storedUser = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
      const token = storedUser ? JSON.parse(storedUser)?.token : "";
      const fd = new FormData();
      fd.append("images", file);
      const BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "").replace(/\/$/, "");
      const res = await fetch(`${BASE}/api/upload`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const urls = await res.json();
      if (Array.isArray(urls) && urls[0]) {
        const autoAlt = file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setForm((p) => ({
          ...p,
          ecommerceProcess: {
            ...p.ecommerceProcess,
            steps: p.ecommerceProcess.steps.map((s, si) => (si === stepIdx ? { ...s, image: urls[0], imageAlt: s.imageAlt || autoAlt } : s)),
          },
        }));
      }
    } catch (err) {
      alert("Image upload failed: " + (err?.message || "Unknown error"));
    }
  };

  // ── testimonial thumbnail upload (testimonials.items[ti]) ──
  const handleTestimonialImageUpload = async (e, idx) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const storedUser = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
      const token = storedUser ? JSON.parse(storedUser)?.token : "";
      const fd = new FormData();
      fd.append("images", file);
      const BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "").replace(/\/$/, "");
      const res = await fetch(`${BASE}/api/upload`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const urls = await res.json();
      if (Array.isArray(urls) && urls[0]) {
        const autoAlt = file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setForm((p) => ({
          ...p,
          testimonials: {
            ...p.testimonials,
            items: p.testimonials.items.map((t, ti) => (ti === idx ? { ...t, image: urls[0], imageAlt: t.imageAlt || autoAlt } : t)),
          },
        }));
      }
    } catch (err) {
      alert("Image upload failed: " + (err?.message || "Unknown error"));
    }
  };

  // ── core handlers ──
  const handleTitle = (e) => {
    const val = e.target.value;
    setTop("title", val);
    if (!slugEdited) setTop("slug", toSlug(val));
  };
  const handleSlug = (e) => { setTop("slug", e.target.value); setSlugEdited(true); };

  // section show toggle props for SectionCard
  const toggle = (sec) => ({
    toggleId: `${sec}Show`,
    toggleName: `${sec}Show`,
    enabled: form[sec].show,
    onToggle: (e) => setSec(sec, "show", e.target.checked),
  });

  // ── field render helpers ──
  const secText = (sec, field, label, placeholder = "", col = "col-lg-6") => (
    <div className={col}>
      <div className="my_profile_setting_input form-group">
        <label>{label}</label>
        <input
          type="text"
          className="form-control"
          value={form[sec][field] ?? ""}
          onChange={(e) => setSec(sec, field, e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  const secTextarea = (sec, field, label, placeholder = "", rows = 3, col = "col-lg-12") => (
    <div className={col}>
      <div className="my_profile_setting_input form-group">
        <label>{label}</label>
        <textarea
          className="form-control"
          rows={rows}
          value={form[sec][field] ?? ""}
          onChange={(e) => setSec(sec, field, e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  // editable string-array (paragraphs) block — each entry uses HtmlEditor
  const paragraphBlock = (sec, arrKey, label = "Paragraphs") => (
    <div className="col-lg-12">
      <div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>{label}</div>
      {(form[sec][arrKey] || []).map((p, i) => (
        <div key={i} className="mb-3">
          <div className="d-flex justify-content-end mb-1">
            <button
              type="button"
              className="btn"
              style={{ color: "#ff5a5f", border: "1px solid #ff5a5f", padding: "2px 10px", fontSize: 13 }}
              onClick={() => removeStr(sec, arrKey, i)}
            >
              × Remove
            </button>
          </div>
          <div className="tiptap-compact" style={{ border: "1px solid #e4e4f0", borderRadius: 6, overflow: "hidden" }}>
            <HtmlEditor value={p} onChange={(v) => setStr(sec, arrKey, i, v)} />
          </div>
        </div>
      ))}
      <button type="button" className="btn admore_btn" onClick={() => addStr(sec, arrKey)}>+ Add Paragraph</button>
    </div>
  );

  // generic icon-card list (icon + title + description) block
  const iconCardBlock = (sec, arrKey, itemLabel, addLabel, descIsHtml = true) => (
    <>
      <div className="col-lg-12">
        <div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>{addLabel.replace(/^\+ Add /, "")}s</div>
        <button type="button" className="btn admore_btn mb20" onClick={() => addArr(sec, arrKey, emptyIconCard)}>{addLabel}</button>
      </div>
      {(form[sec][arrKey] || []).map((c, i) => (
        <div className="col-12" key={i}>
          <StepCard index={i} label={itemLabel} {...dnd(sec, arrKey, i)} onRemove={() => removeArr(sec, arrKey, i)}>
            <div className="col-xl-3"><IconPicker value={c.icon} onChange={(v) => setArr(sec, arrKey, i, "icon", v)} /></div>
            <div className="col-xl-4">
              <div className="my_profile_setting_input form-group">
                <label>Title</label>
                <input type="text" className="form-control" value={c.title} onChange={(e) => setArr(sec, arrKey, i, "title", e.target.value)} />
              </div>
            </div>
            <div className="col-xl-5">
              <div className="my_profile_setting_input form-group">
                <label>Description</label>
                {descIsHtml ? (
                  <HtmlEditor value={c.desc} onChange={(v) => setArr(sec, arrKey, i, "desc", v)} />
                ) : (
                  <textarea className="form-control" rows={3} value={c.desc} onChange={(e) => setArr(sec, arrKey, i, "desc", e.target.value)} />
                )}
              </div>
            </div>
          </StepCard>
        </div>
      ))}
    </>
  );

  // editable string-list (e.g. checklist points) nested inside an object-array item
  const pointsBlock = (sec, arrKey, i, subKey, label = "Points") => (
    <div className="col-12">
      <div style={{ fontWeight: 600, marginBottom: 6, color: "#2c2e50", fontSize: 13 }}>{label}</div>
      {(form[sec][arrKey][i][subKey] || []).map((pt, j) => (
        <div key={j} className="d-flex" style={{ gap: 8, marginBottom: 6 }}>
          <input type="text" className="form-control" value={pt} onChange={(e) => setNestedStr(sec, arrKey, i, subKey, j, e.target.value)} />
          <button type="button" className="btn" style={{ color: "#ff5a5f", border: "1px solid #ff5a5f", padding: "2px 10px", fontSize: 13 }} onClick={() => removeNestedStr(sec, arrKey, i, subKey, j)}>×</button>
        </div>
      ))}
      <button type="button" className="btn admore_btn" onClick={() => addNestedStr(sec, arrKey, i, subKey)}>+ Add Point</button>
    </div>
  );

  // ── Mobile App Development section editors (rendered only when template = mobile) ──
  const renderIntro = () => (
    <SectionCard id="sec-intro" title="Intro (Company)" accentColor="#2c2e50" {...toggle("intro")}>
      {form.intro.show && (
        <>
          {secText("intro", "heading", "Heading (accent part)", "Mobile App Development")}
          {secText("intro", "headingAccent", "Heading tail", "Company")}
          {paragraphBlock("intro", "paragraphs", "Lead Paragraphs (left column)")}
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Feature pills</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("intro", "pills", emptyPill)}>+ Add Pill</button></div>
          {(form.intro.pills || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Pill" {...dnd("intro", "pills", i)} onRemove={() => removeArr("intro", "pills", i)}>
                <div className="col-xl-4"><IconPicker value={c.icon} onChange={(v) => setArr("intro", "pills", i, "icon", v)} /></div>
                <div className="col-xl-8"><div className="my_profile_setting_input form-group"><label>Label</label><input type="text" className="form-control" value={c.label} onChange={(e) => setArr("intro", "pills", i, "label", e.target.value)} placeholder="Build App" /></div></div>
              </StepCard>
            </div>
          ))}
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Stat cards</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("intro", "statCards", emptyStatCard)}>+ Add Stat Card</button></div>
          {(form.intro.statCards || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Stat Card" {...dnd("intro", "statCards", i)} onRemove={() => removeArr("intro", "statCards", i)}>
                <div className="col-xl-2"><IconPicker value={c.icon} onChange={(v) => setArr("intro", "statCards", i, "icon", v)} /></div>
                <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Value</label><input type="text" className="form-control" value={c.value} onChange={(e) => setArr("intro", "statCards", i, "value", e.target.value)} placeholder="18 Months" /></div></div>
                <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>Label</label><input type="text" className="form-control" value={c.label} onChange={(e) => setArr("intro", "statCards", i, "label", e.target.value)} placeholder="Rebuild Cycle" /></div></div>
                <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Description</label><textarea className="form-control" rows={2} value={c.desc} onChange={(e) => setArr("intro", "statCards", i, "desc", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
          {paragraphBlock("intro", "closingParagraphs", "Closing Paragraphs")}
        </>
      )}
    </SectionCard>
  );

  // Dark-snake service-card editor. On the Mobile template these cards live in
  // the `process` section (process.steps), so the Process tab edits the snake.
  const renderMobileServices = () => (
    <>
      <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Process cards</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("process", "steps", emptyMobileService)}>+ Add Process</button></div>
      {(form.process.steps || []).map((c, i) => (
        <div className="col-12" key={i}>
          <StepCard index={i} label="Process" {...dnd("process", "steps", i)} onRemove={() => removeArr("process", "steps", i)}>
            <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Number</label><input type="text" className="form-control" value={c.num || ""} onChange={(e) => setArr("process", "steps", i, "num", e.target.value)} placeholder="01" /></div></div>
            <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Pill tag</label><input type="text" className="form-control" value={c.tag || ""} onChange={(e) => setArr("process", "steps", i, "tag", e.target.value)} placeholder="iOS" /></div></div>
            <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title || ""} onChange={(e) => setArr("process", "steps", i, "title", e.target.value)} placeholder="iOS App Development" /></div></div>
            <div className="col-xl-12"><div className="my_profile_setting_textarea form-group"><label>Description</label><HtmlEditor value={c.desc || ""} onChange={(v) => setArr("process", "steps", i, "desc", v)} /></div></div>
          </StepCard>
        </div>
      ))}
    </>
  );

  const renderTechnologies = () => (
    <SectionCard id="sec-technologies" title="Technologies" accentColor="#3c3e66" {...toggle("technologies")} badge={form.technologies.tabs.length}>
      {form.technologies.show && (
        <>
          {isEcommerce ? (
            <>
              {secText("technologies", "headingLead", "Heading — gradient word", "Technologies", "col-lg-4")}
              {secText("technologies", "headingRest", "Heading — rest (dark text)", "We Use For Ecommerce Development", "col-lg-8")}
            </>
          ) : (
            secText("technologies", "heading", "Heading", "Technologies We Use For Mobile App Development", "col-lg-12")
          )}
          {secTextarea("technologies", "intro", "Intro", "Technology choices in mobile development have long-term consequences...", 2)}
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Category tabs</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("technologies", "tabs", emptyTab)}>+ Add Tab</button></div>
          {(form.technologies.tabs || []).map((t, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Tab" {...dnd("technologies", "tabs", i)} onRemove={() => removeArr("technologies", "tabs", i)}>
                <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Tab label</label><input type="text" className="form-control" value={t.label} onChange={(e) => setArr("technologies", "tabs", i, "label", e.target.value)} placeholder="Mobile Frameworks" /></div></div>
                <div className="col-12">
                  <div style={{ fontWeight: 600, marginBottom: 6, color: "#2c2e50", fontSize: 13 }}>Logos</div>
                  {(t.logos || []).map((lg, j) => (
                    <div key={j} className="row" style={{ marginBottom: 12, alignItems: "flex-end" }}>
                      <div className="col-xl-1" style={{ display: "flex", alignItems: "flex-end", paddingBottom: 6 }}>
                        {lg.img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={lg.img} alt={lg.label || "logo"} style={{ width: 34, height: 34, objectFit: "contain" }} />
                        ) : (
                          <span style={{ width: 34, height: 34, display: "inline-block" }} />
                        )}
                      </div>
                      <div className="col-xl-4">
                        <div className="my_profile_setting_input form-group">
                          <label style={{ fontSize: 13 }}>Logo</label>
                          <select
                            className="form-control"
                            value={lg.img || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              const opt = TECH_LOGOS.find((o) => o.img === val);
                              setNested("technologies", "tabs", i, "logos", (arr) =>
                                arr.map((l, k) => (k === j ? { ...l, img: val, label: opt?.label || l.label || "" } : l))
                              );
                            }}
                          >
                            <option value="">— Select a logo —</option>
                            {TECH_LOGOS.map((o) => (
                              <option key={o.img} value={o.img}>{o.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="my_profile_setting_input form-group">
                          <label style={{ fontSize: 13 }}>Display label <small style={{ color: "#888" }}>(shown next to the logo)</small></label>
                          <input type="text" className="form-control" value={lg.label} onChange={(e) => setNestedObj("technologies", "tabs", i, "logos", j, "label", e.target.value)} placeholder="Flutter" />
                        </div>
                      </div>
                      <div className="col-xl-1"><button type="button" className="btn" style={{ color: "#ff5a5f", border: "1px solid #ff5a5f", padding: "2px 10px", marginBottom: 6 }} onClick={() => removeNestedObj("technologies", "tabs", i, "logos", j)}>×</button></div>
                    </div>
                  ))}
                  <button type="button" className="btn admore_btn" onClick={() => addNestedObj("technologies", "tabs", i, "logos", emptyLogo)}>+ Add Logo</button>
                </div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  const renderWhyChoose = () => (
    <SectionCard id="sec-whychoose" title="Why Choose" accentColor="#3c3e66" {...toggle("whyChoose")} badge={form.whyChoose.cards.length}>
      {form.whyChoose.show && (
        <>
          {secText("whyChoose", "heading", "Heading (lead)", "Why Businesses Choose", "col-lg-4")}
          {secText("whyChoose", "headingAccent", "Heading accent", "Akoode Technologies", "col-lg-4")}
          {secText("whyChoose", "headingTail", "Heading tail", "As Their Mobile App Development Company", "col-lg-4")}
          {secTextarea("whyChoose", "subtitle", "Subtext (below the title)", "We engineer mobile products that become core business assets...", 2)}
          {iconCardBlock("whyChoose", "cards", "Card", "+ Add Card", true)}
        </>
      )}
    </SectionCard>
  );

  // Timeline-stage editor. On the Mobile template these stages live in the
  // `services` section (services.items), so the Services tab edits the timeline.
  const renderMobileProcess = () => (
    <>
      <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Stages</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("services", "items", emptyProcessStep)}>+ Add Stage</button></div>
      {(form.services.items || []).map((c, i) => (
        <div className="col-12" key={i}>
          <StepCard index={i} label="Stage" {...dnd("services", "items", i)} onRemove={() => removeArr("services", "items", i)}>
            <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Timeline label</label><input type="text" className="form-control" value={c.label || ""} onChange={(e) => setArr("services", "items", i, "label", e.target.value)} placeholder="Discovery" /></div></div>
            <div className="col-xl-8"><div className="my_profile_setting_input form-group"><label>Stage title</label><input type="text" className="form-control" value={c.stageTitle || ""} onChange={(e) => setArr("services", "items", i, "stageTitle", e.target.value)} placeholder="Discovery & Scoping" /></div></div>
            <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Stage title link <small style={{ color: "#888" }}>(optional · the stage title links here)</small></label><input type="text" className="form-control" value={c.link || ""} onChange={(e) => setArr("services", "items", i, "link", e.target.value)} placeholder="/services/ios-app-development" /></div></div>
            <div className="col-xl-12"><div className="my_profile_setting_textarea form-group"><label>Intro</label><HtmlEditor value={c.intro || ""} onChange={(v) => setArr("services", "items", i, "intro", v)} /></div></div>
            <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Outcome</label><textarea className="form-control" rows={2} value={c.outcome || ""} onChange={(e) => setArr("services", "items", i, "outcome", e.target.value)} /></div></div>
            <div className="col-xl-6">
              <div className="my_profile_setting_input form-group">
                <label>Stage Image <small style={{ color: "#888" }}>(optional · falls back to default illustration)</small></label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div className="wrap-custom-file" style={{ height: 140 }}>
                    <input type="file" id={`process-img-${i}`} accept="image/*" onChange={(e) => handleProcessImageUpload(e, i)} />
                    <label htmlFor={`process-img-${i}`} style={c.image ? { backgroundImage: `url(${(process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")}/${c.image.replace(/^\//, "")})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" } : {}}>
                      <span><i className="flaticon-download"></i> {c.image ? "Change Image" : "Upload Image"}</span>
                    </label>
                  </div>
                  {c.image && (
                    <button type="button" onClick={() => setArr("services", "items", i, "image", "")} style={{ border: "1px solid #f0c0c0", background: "#fff5f5", color: "#c44", padding: "3px 10px", borderRadius: 4, fontSize: 12, cursor: "pointer", alignSelf: "flex-start" }}>× Remove</button>
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Image Alt text <small style={{ color: "#888" }}>(auto-filled from filename)</small></label><input type="text" className="form-control" value={c.imageAlt || ""} onChange={(e) => setArr("services", "items", i, "imageAlt", e.target.value)} placeholder="Agile development illustration" /></div></div>
          </StepCard>
        </div>
      ))}
    </>
  );

  const renderEngagement = () => (
    <SectionCard id="sec-engagement" title="Engagement Models" accentColor="#2c2e50" {...toggle("engagement")}>
      {form.engagement.show && (
        <>
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            The three engagement models ({isStaffAug ? "Long-Term Dedicated Hire, Monthly & Hourly Billing, Quarterly Billing" : "Fixed Cost, Dedicated Team, Staff Augmentation"}) are fixed. Only the heading and subtitle are editable here.
          </div>
          {secText("engagement", "heading", "Heading (accent part)", "Flexible Engagement Models", "col-lg-6")}
          {secText("engagement", "headingTail", "Heading tail", "For Mobile App Development", "col-lg-6")}
          {secTextarea("engagement", "subtitle", "Subtitle", "Choose how you want to work with us...", 2)}
        </>
      )}
    </SectionCard>
  );

  // Testimonials editor — shared by both templates. Each item's `mediaType`
  // drives the live layout (none = text card, portrait/landscape = video thumb).
  const renderTestimonials = () => (
    <SectionCard id="sec-testimonials" title="Testimonials" accentColor="#2c2e50" {...toggle("testimonials")} badge={form.testimonials.items.length}>
      {form.testimonials.show && (
        <>
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Add client testimonials — name, designation, company, and the quote. They render in a carousel on the live page.
          </div>
          {secText("testimonials", "heading", "Section heading", "What Our Client Says", "col-lg-12")}
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Testimonials</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("testimonials", "items", emptyTestimonial)}>+ Add Testimonial</button></div>
          {(form.testimonials.items || []).map((c, i) => {
            // ── Video / media testimonials are disabled for now (text only). ──
            // const hasMedia = c.mediaType === "portrait" || c.mediaType === "landscape";
            // const preview = c.image
            //   ? (c.image.startsWith("/") && !c.image.startsWith("/uploads")
            //       ? c.image
            //       : `${(process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")}/${c.image.replace(/^\//, "")}`)
            //   : "";
            return (
              <div className="col-12" key={i}>
                <StepCard index={i} label="Testimonial" {...dnd("testimonials", "items", i)} onRemove={() => removeArr("testimonials", "items", i)}>
                  {/* ── Media type selector — disabled (video testimonials commented out) ──
                  <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Media type</label>
                    <select className="form-control" value={c.mediaType || "none"} onChange={(e) => setArr("testimonials", "items", i, "mediaType", e.target.value)}>
                      <option value="none">Text only</option>
                      <option value="portrait">Portrait video / image</option>
                      <option value="landscape">Landscape video / image</option>
                    </select>
                  </div></div> */}
                  <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Name</label><input type="text" className="form-control" value={c.name || ""} onChange={(e) => setArr("testimonials", "items", i, "name", e.target.value)} placeholder="Ankit Goyal" /></div></div>
                  <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Designation</label><input type="text" className="form-control" value={c.designation || ""} onChange={(e) => setArr("testimonials", "items", i, "designation", e.target.value)} placeholder="Founder & CEO" /></div></div>
                  <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Company</label><input type="text" className="form-control" value={c.company || ""} onChange={(e) => setArr("testimonials", "items", i, "company", e.target.value)} placeholder="WeGrow InfraVentures" /></div></div>
                  <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Quote</label><textarea className="form-control" rows={4} value={c.quote || ""} onChange={(e) => setArr("testimonials", "items", i, "quote", e.target.value)} placeholder="Akoode Technologies has done a fantastic job…" /></div></div>
                  {/* ── Video / media fields — disabled (text-only testimonials for now) ──
                  {hasMedia && (
                    <>
                      <div className="col-xl-6">
                        <div className="my_profile_setting_input form-group">
                          <label>Thumbnail <small style={{ color: "#888" }}>({c.mediaType === "portrait" ? "tall · ~9:14" : "wide · ~3:2"})</small></label>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <div className="wrap-custom-file" style={{ height: 140 }}>
                              <input type="file" id={`testimonial-img-${i}`} accept="image/*" onChange={(e) => handleTestimonialImageUpload(e, i)} />
                              <label htmlFor={`testimonial-img-${i}`} style={preview ? { backgroundImage: `url(${preview})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
                                <span><i className="flaticon-download"></i> {c.image ? "Change Thumbnail" : "Upload Thumbnail"}</span>
                              </label>
                            </div>
                            {c.image && (
                              <button type="button" onClick={() => setArr("testimonials", "items", i, "image", "")} style={{ border: "1px solid #f0c0c0", background: "#fff5f5", color: "#c44", padding: "3px 10px", borderRadius: 4, fontSize: 12, cursor: "pointer", alignSelf: "flex-start" }}>× Remove</button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="my_profile_setting_input form-group"><label>Embed code <small style={{ color: "#888" }}>(optional · iframe plays on click)</small></label><textarea className="form-control" rows={3} value={c.embedCode || ""} onChange={(e) => setArr("testimonials", "items", i, "embedCode", e.target.value)} placeholder='&lt;iframe …&gt;&lt;/iframe&gt;' /></div>
                      </div>
                      <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Image Alt text <small style={{ color: "#888" }}>(auto-filled from filename)</small></label><input type="text" className="form-control" value={c.imageAlt || ""} onChange={(e) => setArr("testimonials", "items", i, "imageAlt", e.target.value)} placeholder="Client testimonial thumbnail" /></div></div>
                    </>
                  )} */}
                </StepCard>
              </div>
            );
          })}
        </>
      )}
    </SectionCard>
  );

const IMAGE_KEYWORDS = [
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

const ICON_KEYWORDS = [
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

  const sanitize = (str) =>
    String(str || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]/g, "");

  const handleIndustryNameChange = (i, value) => {
    setArr("industries", "items", i, "name", value);
    const cleanTyped = sanitize(value);

    // 1. Link matching
    const linkMatch = industryOptions.find((o) => {
      const cleanOpt = sanitize(o.name);
      if (cleanOpt === cleanTyped) return true;
      if (cleanTyped.length >= 3) {
        return cleanTyped.includes(cleanOpt) || cleanOpt.includes(cleanTyped);
      }
      return false;
    });
    if (linkMatch && !form.industries.items[i]?.href) {
      setArr("industries", "items", i, "href", `/industries/${linkMatch.slug}`);
    }

    // 2. Illustration image matching
    const imageMatch = IMAGE_KEYWORDS.find(({ keywords }) =>
      keywords.some((k) => {
        const cleanK = sanitize(k);
        if (cleanTyped === cleanK) return true;
        if (cleanTyped.length >= 3) {
          return cleanTyped.includes(cleanK) || cleanK.includes(cleanTyped);
        }
        return false;
      })
    );
    if (imageMatch && !form.industries.items[i]?.image) {
      setArr("industries", "items", i, "image", imageMatch.img);
    }

    // 3. Icon matching
    const iconMatch = ICON_KEYWORDS.find(({ keywords }) =>
      keywords.some((k) => {
        const cleanK = sanitize(k);
        if (cleanTyped === cleanK) return true;
        if (cleanTyped.length >= 3) {
          return cleanTyped.includes(cleanK) || cleanK.includes(cleanTyped);
        }
        return false;
      })
    );
    if (iconMatch && !form.industries.items[i]?.icon) {
      setArr("industries", "items", i, "icon", iconMatch.icon);
    }
  };

  // Industries editor — shared; rendered in template-specific position (so the
  // admin section order matches the live page for each template).
  const renderIndustries = () => (
    <SectionCard id="sec-industries" title="Industries" accentColor="#2c2e50" {...toggle("industries")} badge={form.industries.items.length}>
      {form.industries.show && (
        <>
          {secText("industries", "heading", "Heading (lead)", isMobile ? "We Build Mobile Apps Across" : isEcommerce ? "We Build Ecommerce Stores Across" : "We Deliver Software Development Services Across")}
          {secText("industries", "headingAccent", "Heading accent", "15 Industries")}
          {secTextarea("industries", "intro", "Intro", "Our extensive experience spans across major industries...", 2)}
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Industries</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("industries", "items", emptyIndustry)}>+ Add Industry</button></div>
          {(form.industries.items || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Industry" {...dnd("industries", "items", i)} onRemove={() => removeArr("industries", "items", i)}>
                <div className="col-xl-3"><IconPicker value={c.icon} onChange={(v) => setArr("industries", "items", i, "icon", v)} /></div>
                <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Name <small style={{ color: "#888" }}>(matching a real name auto-fills the link and image)</small></label><input type="text" className="form-control" value={c.name} onChange={(e) => handleIndustryNameChange(i, e.target.value)} placeholder="Healthcare & HealthTech" /></div></div>
                <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Description</label><HtmlEditor value={c.desc || ""} onChange={(v) => setArr("industries", "items", i, "desc", v)} /></div></div>
                <div className="col-xl-6">
                  <div className="my_profile_setting_input form-group">
                    <label>Industry Image <small style={{ color: "#888" }}>(shown in detail panel · alt text auto-filled from name)</small></label>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {c.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.image.startsWith("/software_development/") ? c.image : `${(process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")}/${c.image.replace(/^\//, "")}`}
                          alt={c.name || "industry"}
                          style={{ width: 48, height: 48, objectFit: "contain", flexShrink: 0 }}
                        />
                      ) : (
                        <span style={{ width: 48, height: 48, display: "inline-block", flexShrink: 0 }} />
                      )}
                      <select
                        className="form-control"
                        value={INDUSTRY_IMAGES.some((o) => o.img === c.image) ? c.image : ""}
                        onChange={(e) => setArr("industries", "items", i, "image", e.target.value)}
                      >
                        <option value="">— Select an image —</option>
                        {INDUSTRY_IMAGES.map((o) => (
                          <option key={o.img} value={o.img}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="my_profile_setting_input form-group">
                    <label>Page link <small style={{ color: "#888" }}>(pick a real industry page, or leave blank to auto-generate from name)</small></label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <select
                        className="form-control"
                        value={industryOptions.some((o) => `/industries/${o.slug}` === c.href) ? c.href : ""}
                        onChange={(e) => setArr("industries", "items", i, "href", e.target.value)}
                      >
                        <option value="">— Select an industry page —</option>
                        {industryOptions.map((o) => (
                          <option key={o.slug} value={`/industries/${o.slug}`}>{o.name}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        className="form-control"
                        value={c.href || ""}
                        onChange={(e) => setArr("industries", "items", i, "href", e.target.value)}
                        placeholder="/industries/healthcare"
                        style={{ fontSize: 12 }}
                      />
                    </div>
                  </div>
                </div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  // ── Ecommerce Development section editors (rendered only when template = ecommerce-development) ──

  const renderPlatformProblem = () => (
    <SectionCard id="sec-platformproblem" title="Platform Problem" accentColor="#2c2e50" {...toggle("platformProblem")} badge={form.platformProblem.points.length}>
      {form.platformProblem.show && (
        <>
          {secText("platformProblem", "heading", "Heading (gradient part)", "When the Platform becomes the", "col-lg-6")}
          {secText("platformProblem", "headingAccent", "Heading accent (white part)", "Bottleneck, Revenue follows.", "col-lg-6")}
          {secTextarea("platformProblem", "intro", "Intro paragraph", "Most growing stores do not have a marketing problem...", 2)}

          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Right-column points</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("platformProblem", "points", emptyPlatformPoint)}>+ Add Point</button></div>
          {(form.platformProblem.points || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Point" {...dnd("platformProblem", "points", i)} onRemove={() => removeArr("platformProblem", "points", i)}>
                <div className="col-xl-3"><IconPicker value={c.icon} onChange={(v) => setArr("platformProblem", "points", i, "icon", v)} /></div>
                <div className="col-xl-9"><div className="my_profile_setting_input form-group"><label>Text</label><textarea className="form-control" rows={2} value={c.text || ""} onChange={(e) => setArr("platformProblem", "points", i, "text", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}

          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", margin: "14px 0", fontSize: 13, color: "#474972" }}>
            Glowing card (left column, below the intro)
          </div>
          {secText("platformProblem", "cardTitle", "Card title", "Akoode is not a Shopify agency. We do not sell themes, and we will not sell you one", "col-lg-12")}
          {secTextarea("platformProblem", "cardBody", "Card body", "What we build is the layer underneath...", 2)}
          {secTextarea("platformProblem", "quote", "Bottom accent quote", "A platform that cannot keep up is not standing still...", 2)}
        </>
      )}
    </SectionCard>
  );

  const renderEcommerceServices = () => (
    <SectionCard id="sec-ecommerceservices" title="Ecommerce Services" accentColor="#3c3e66" {...toggle("ecommerceServices")} badge={form.ecommerceServices.items.length}>
      {form.ecommerceServices.show && (
        <>
          {secText("ecommerceServices", "heading", "Heading (lead)", "Our Ecommerce", "col-lg-6")}
          {secText("ecommerceServices", "headingAccent", "Heading accent", "Development Services", "col-lg-6")}
          {secTextarea("ecommerceServices", "intro", "Intro", "Every engagement here is scoped against a commercial number...", 2)}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Cards are numbered automatically (01, 02, …) and laid out 4-per-row with the coloured number bar. Add as many as you like.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Cards</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("ecommerceServices", "items", emptyTitleDesc)}>+ Add Card</button></div>
          {(form.ecommerceServices.items || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label={`Card ${String(i + 1).padStart(2, "0")}`} {...dnd("ecommerceServices", "items", i)} onRemove={() => removeArr("ecommerceServices", "items", i)}>
                <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title || ""} onChange={(e) => setArr("ecommerceServices", "items", i, "title", e.target.value)} placeholder="Custom Ecommerce Development" /></div></div>
                <div className="col-xl-8"><div className="my_profile_setting_input form-group"><label>Description</label><textarea className="form-control" rows={3} value={c.desc || ""} onChange={(e) => setArr("ecommerceServices", "items", i, "desc", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  const renderCommerceEngineering = () => (
    <SectionCard id="sec-commerceengineering" title="Commerce Engineering" accentColor="#2c2e50" {...toggle("commerceEngineering")} badge={form.commerceEngineering.columns.length}>
      {form.commerceEngineering.show && (
        <>
          {secText("commerceEngineering", "heading", "Heading (white part)", "Commerce Engineering", "col-lg-6")}
          {secText("commerceEngineering", "headingAccent", "Heading accent (gradient part)", "Beyond the Storefront", "col-lg-6")}
          {secTextarea("commerceEngineering", "intro", "Intro", "A storefront is the baseline...", 2)}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Columns are numbered automatically (01, 02, …). The glow band and layout are fixed — best with 4–6 columns.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Columns</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("commerceEngineering", "columns", emptyTitleDesc)}>+ Add Column</button></div>
          {(form.commerceEngineering.columns || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label={`Column ${String(i + 1).padStart(2, "0")}`} {...dnd("commerceEngineering", "columns", i)} onRemove={() => removeArr("commerceEngineering", "columns", i)}>
                <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title || ""} onChange={(e) => setArr("commerceEngineering", "columns", i, "title", e.target.value)} placeholder="AI-Driven Personalisation" /></div></div>
                <div className="col-xl-8"><div className="my_profile_setting_input form-group"><label>Description</label><textarea className="form-control" rows={3} value={c.desc || ""} onChange={(e) => setArr("commerceEngineering", "columns", i, "desc", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  const renderEcommercePlatforms = () => (
    <SectionCard id="sec-ecommerceplatforms" title="Ecommerce Platforms" accentColor="#3c3e66" {...toggle("ecommercePlatforms")} badge={form.ecommercePlatforms.rows.length}>
      {form.ecommercePlatforms.show && (
        <>
          {secText("ecommercePlatforms", "heading", "Heading (white part)", "Ecommerce Platforms", "col-lg-6")}
          {secText("ecommercePlatforms", "headingAccent", "Heading accent (gradient part)", "we specialise in", "col-lg-6")}
          {secTextarea("ecommercePlatforms", "intro", "Intro", "Choosing the right platform decides how far a store scales...", 2)}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Rows are numbered automatically (01, 02, …) and rendered with the fixed gradient-card design.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Rows</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("ecommercePlatforms", "rows", emptyPlatformRow)}>+ Add Row</button></div>
          {(form.ecommercePlatforms.rows || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label={`Row ${String(i + 1).padStart(2, "0")}`} {...dnd("ecommercePlatforms", "rows", i)} onRemove={() => removeArr("ecommercePlatforms", "rows", i)}>
                <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title || ""} onChange={(e) => setArr("ecommercePlatforms", "rows", i, "title", e.target.value)} placeholder="Shopify Development Company" /></div></div>
                <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Description</label><textarea className="form-control" rows={3} value={c.desc || ""} onChange={(e) => setArr("ecommercePlatforms", "rows", i, "desc", e.target.value)} /></div></div>
                <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>CTA text</label><input type="text" className="form-control" value={c.ctaText || ""} onChange={(e) => setArr("ecommercePlatforms", "rows", i, "ctaText", e.target.value)} placeholder="Explore Shopify Development" /></div></div>
                <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>CTA link</label><input type="text" className="form-control" value={c.ctaLink || ""} onChange={(e) => setArr("ecommercePlatforms", "rows", i, "ctaLink", e.target.value)} placeholder="/contact-us" /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  // Timeline-stage editor for the Ecommerce Process (MadProcess) section — same
  // stage shape as the Mobile template's timeline (renderMobileProcess), just
  // bound to its own `ecommerceProcess.steps` key instead of `services.items`.
  const renderEcommerceProcess = () => (
    <SectionCard id="sec-ecommerceprocess" title="Process" accentColor="#3c3e66" {...toggle("ecommerceProcess")} badge={form.ecommerceProcess.steps.length}>
      {form.ecommerceProcess.show && (
        <>
          {secText("ecommerceProcess", "heading", "Heading (lead)", "Our Ecommerce Development", "col-lg-6")}
          {secText("ecommerceProcess", "headingAccent", "Heading accent", "Process", "col-lg-6")}
          {secTextarea("ecommerceProcess", "intro", "Intro", "A structured process is what separates predictable launches...", 2)}
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Stages</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("ecommerceProcess", "steps", emptyProcessStep)}>+ Add Stage</button></div>
          {(form.ecommerceProcess.steps || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Stage" {...dnd("ecommerceProcess", "steps", i)} onRemove={() => removeArr("ecommerceProcess", "steps", i)}>
                <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Timeline label</label><input type="text" className="form-control" value={c.label || ""} onChange={(e) => setArr("ecommerceProcess", "steps", i, "label", e.target.value)} placeholder="Discovery" /></div></div>
                <div className="col-xl-8"><div className="my_profile_setting_input form-group"><label>Stage title</label><input type="text" className="form-control" value={c.stageTitle || ""} onChange={(e) => setArr("ecommerceProcess", "steps", i, "stageTitle", e.target.value)} placeholder="Discovery & Scoping" /></div></div>
                <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Stage title link <small style={{ color: "#888" }}>(optional · the stage title links here)</small></label><input type="text" className="form-control" value={c.link || ""} onChange={(e) => setArr("ecommerceProcess", "steps", i, "link", e.target.value)} /></div></div>
                <div className="col-xl-12"><div className="my_profile_setting_textarea form-group"><label>Intro</label><HtmlEditor value={c.intro || ""} onChange={(v) => setArr("ecommerceProcess", "steps", i, "intro", v)} /></div></div>
                <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Outcome</label><textarea className="form-control" rows={2} value={c.outcome || ""} onChange={(e) => setArr("ecommerceProcess", "steps", i, "outcome", e.target.value)} /></div></div>
                <div className="col-xl-6">
                  <div className="my_profile_setting_input form-group">
                    <label>Stage Image <small style={{ color: "#888" }}>(optional · falls back to default illustration)</small></label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div className="wrap-custom-file" style={{ height: 140 }}>
                        <input type="file" id={`ecommerce-process-img-${i}`} accept="image/*" onChange={(e) => handleEcommerceProcessImageUpload(e, i)} />
                        <label htmlFor={`ecommerce-process-img-${i}`} style={c.image ? { backgroundImage: `url(${(process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")}/${c.image.replace(/^\//, "")})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" } : {}}>
                          <span><i className="flaticon-download"></i> {c.image ? "Change Image" : "Upload Image"}</span>
                        </label>
                      </div>
                      {c.image && (
                        <button type="button" onClick={() => setArr("ecommerceProcess", "steps", i, "image", "")} style={{ border: "1px solid #f0c0c0", background: "#fff5f5", color: "#c44", padding: "3px 10px", borderRadius: 4, fontSize: 12, cursor: "pointer", alignSelf: "flex-start" }}>× Remove</button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Image Alt text <small style={{ color: "#888" }}>(auto-filled from filename)</small></label><input type="text" className="form-control" value={c.imageAlt || ""} onChange={(e) => setArr("ecommerceProcess", "steps", i, "imageAlt", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  // ── submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.slug.trim()) errs.slug = "Slug is required";
    if (Object.keys(errs).length) { setError(errs); toast.error("Please fix the highlighted fields"); return; }

    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        status: statusValue === "active",
        isDraft: statusValue === "draft",
      };
      const res = isEdit ? await updateUpdatedServiceAPI(id, payload) : await addUpdatedServiceAPI(payload);
      toast.success(res.message || (isEdit ? "Updated successfully" : "Created successfully"));
      setError({});

      // Bust the ISR cache so production reflects the change immediately.
      try {
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "service",
            slug: form.slug,
            secret: process.env.NEXT_PUBLIC_PREVIEW_SECRET || "",
          }),
        });
      } catch { /* non-critical — page self-heals within the revalidate window */ }

      setTimeout(() => router.push("/thebusinesshub/updated-services"), 1200);
    } catch (err) {
      setError({ general: err.message || "Something went wrong" });
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── AI Development section editors (rendered only when template = ai) ──
  // Carousel service cards (AiServices · ServiceCarousel): number, icon, title,
  // description, and a "Learn More" link — stored in process.steps.
  const renderAiServiceCards = () => (
    <>
      <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Service cards</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("process", "steps", emptyMobileService)}>+ Add Service</button></div>
      {(form.process.steps || []).map((c, i) => (
        <div className="col-12" key={i}>
          <StepCard index={i} label="Service" {...dnd("process", "steps", i)} onRemove={() => removeArr("process", "steps", i)}>
            <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Number</label><input type="text" className="form-control" value={c.num || ""} onChange={(e) => setArr("process", "steps", i, "num", e.target.value)} placeholder="01" /></div></div>
            <div className="col-xl-2"><IconPicker value={c.icon} onChange={(v) => setArr("process", "steps", i, "icon", v)} /></div>
            <div className="col-xl-8"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title || ""} onChange={(e) => setArr("process", "steps", i, "title", e.target.value)} placeholder="AI Strategy & Consulting" /></div></div>
            <div className="col-xl-12"><div className="my_profile_setting_textarea form-group"><label>Description</label><HtmlEditor value={c.desc || ""} onChange={(v) => setArr("process", "steps", i, "desc", v)} /></div></div>
            <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>“Learn More” link <small style={{ color: "#888" }}>(optional)</small></label><input type="text" className="form-control" value={c.link || ""} onChange={(e) => setArr("process", "steps", i, "link", e.target.value)} placeholder="/services/ai-strategy-consulting" /></div></div>
          </StepCard>
        </div>
      ))}
    </>
  );

  // Services (carousel · AiServices) ← data.process (process.steps holds the cards).
  const renderAiServicesCard = () => (
    <SectionCard id="sec-services" title="Services (Carousel)" accentColor="#3c3e66" {...toggle("process")} badge={form.process.steps.length}>
      {form.process.show && (
        <>
          {secText("process", "heading", "Heading (gradient part)", "Our Artificial Intelligence", "col-lg-6")}
          {secText("process", "headingAccent", "Heading accent", "Development Services", "col-lg-6")}
          {secTextarea("process", "intro", "Intro", "We offer end-to-end AI development services...", 2)}
          {renderAiServiceCards()}
        </>
      )}
    </SectionCard>
  );

  // Snake process cards (AiProcess): number, pill tag, title, description, and an
  // optional link — stored in services.items.
  const renderAiProcessSteps = () => (
    <>
      <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Process cards</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("services", "items", emptyMobileService)}>+ Add Stage</button></div>
      {(form.services.items || []).map((c, i) => (
        <div className="col-12" key={i}>
          <StepCard index={i} label="Stage" {...dnd("services", "items", i)} onRemove={() => removeArr("services", "items", i)}>
            <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Number</label><input type="text" className="form-control" value={c.num || ""} onChange={(e) => setArr("services", "items", i, "num", e.target.value)} placeholder="01" /></div></div>
            <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Pill tag</label><input type="text" className="form-control" value={c.tag || ""} onChange={(e) => setArr("services", "items", i, "tag", e.target.value)} placeholder="Discovery" /></div></div>
            <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title || ""} onChange={(e) => setArr("services", "items", i, "title", e.target.value)} placeholder="Discovery & Use-Case Scoping" /></div></div>
            <div className="col-xl-12"><div className="my_profile_setting_textarea form-group"><label>Description</label><HtmlEditor value={c.desc || ""} onChange={(v) => setArr("services", "items", i, "desc", v)} /></div></div>
          </StepCard>
        </div>
      ))}
    </>
  );

  // Process (dark snake · AiProcess) ← data.services (services.items holds the stages).
  const renderAiProcessCard = () => (
    <SectionCard id="sec-process" title="Process (Snake)" accentColor="#3c3e66" {...toggle("services")} badge={form.services.items.length}>
      {form.services.show && (
        <>
          {secText("services", "heading", "Heading (gradient part)", "Our AI Development", "col-lg-6")}
          {secText("services", "headingAccent", "Heading accent", "Process", "col-lg-6")}
          {secTextarea("services", "intro", "Intro", "A structured process is what separates AI that reaches production...", 2)}
          {renderAiProcessSteps()}
        </>
      )}
    </SectionCard>
  );

  const renderGap = () => (
    <SectionCard id="sec-gap" title="Intro / The Gap" accentColor="#2c2e50" {...toggle("gap")} badge={form.gap.shifts.length}>
      {form.gap.show && (
        <>
          {secText("gap", "heading", "Heading", "The Gap Between Businesses That Use AI And Those That Have Integrated It", "col-lg-12")}
          {secTextarea("gap", "quote", "Quote (left rail)", "The challenge for most organisations is not a shortage of interest...", 2)}
          {secText("gap", "featureTitle", "Feature card title", "Akoode Technologies", "col-lg-4")}
          {secTextarea("gap", "featureBody", "Feature card body", "We combine strategy, data engineering, model development...", 2, "col-lg-8")}
          {paragraphBlock("gap", "paragraphs", "Right-column Paragraphs")}
          {secText("gap", "shiftsHeading", "Shifts heading", "What shifts when AI is built into your core systems", "col-lg-12")}
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Shift cards</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("gap", "shifts", emptyShift)}>+ Add Shift</button></div>
          {(form.gap.shifts || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Shift" {...dnd("gap", "shifts", i)} onRemove={() => removeArr("gap", "shifts", i)}>
                <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Number</label><input type="text" className="form-control" value={c.num} onChange={(e) => setArr("gap", "shifts", i, "num", e.target.value)} placeholder="01" /></div></div>
                <div className="col-xl-2"><IconPicker value={c.icon} onChange={(v) => setArr("gap", "shifts", i, "icon", v)} /></div>
                <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title} onChange={(e) => setArr("gap", "shifts", i, "title", e.target.value)} /></div></div>
                <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Description</label><HtmlEditor value={c.desc || ""} onChange={(v) => setArr("gap", "shifts", i, "desc", v)} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  const renderCapabilities = () => (
    <SectionCard id="sec-capabilities" title="Capabilities" accentColor="#3c3e66" {...toggle("capabilities")} badge={form.capabilities.items.length}>
      {form.capabilities.show && (
        <>
          {secText("capabilities", "heading", "Heading (dark part)", "Specialised AI", "col-lg-6")}
          {secText("capabilities", "headingAccent", "Heading accent", "Capabilities We Build", "col-lg-6")}
          {secTextarea("capabilities", "quote", "Quote (left rail)", "At Akoode, we go beyond conventional development...", 2)}
          {secTextarea("capabilities", "paragraph", "Paragraph", "Businesses that integrate AI into their core platforms gain a compounding advantage...", 3)}
          {iconCardBlock("capabilities", "items", "Capability", "+ Add Capability")}
        </>
      )}
    </SectionCard>
  );

  const renderTrends = () => (
    <SectionCard id="sec-trends" title={isEcommerce || isWebDev || isStaffAug ? "Trends" : "AI Trends"} accentColor="#2c2e50" {...toggle("trends")} badge={form.trends.items.length}>
      {form.trends.show && (
        <>
          {secText("trends", "heading", "Heading (dark part)", isEcommerce ? "Where Ecommerce Development Stands In 2026" : isWebDev ? "Why Web Development Is Changing Right Now" : isStaffAug ? "Why Staff Augmentation Is Growing Right Now" : "Where Enterprise AI Stands in 2026 and What It Means for", "col-lg-6")}
          {secText("trends", "headingAccent", "Heading accent", isEcommerce ? "Nothing Below Is A Forecast." : isWebDev || isStaffAug ? "" : "Your Business", "col-lg-6")}
          {secTextarea("trends", "intro", "Intro (subtitle)", isEcommerce ? "These are conditions already deciding budgets and replatforming approvals this year..." : isWebDev ? "What worked five years ago won't work today, and the next few years will be built by teams who adapt." : isStaffAug ? "Hiring has not got easier and roadmaps have not got shorter. These are the shifts pushing teams towards augmented capacity." : "The AI developments that were emerging twelve months ago are now production-reality...", 2)}
          {(isEcommerce || isWebDev || isStaffAug) && (
            <div className="col-lg-12">
              <div className="my_profile_setting_input form-group">
                <label>Sticky image <small style={{ color: "#888" }}>(shown beside the trend list · falls back to the default illustration if not set)</small></label>
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div className="wrap-custom-file" style={{ height: 200, width: 340, flexShrink: 0 }}>
                    <input type="file" id="trends-image-upload" accept="image/*" onChange={handleTrendsImageUpload} />
                    <label
                      htmlFor="trends-image-upload"
                      style={form.trends.image ? {
                        backgroundImage: `url(${(process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")}/${(form.trends.image || "").replace(/^\//, "")})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      } : {}}
                    >
                      <span><i className="flaticon-download"></i> {form.trends.image ? "Change Image" : "Upload Image"}</span>
                    </label>
                  </div>
                  <div style={{ width: 280 }}>
                    <div className="my_profile_setting_input form-group">
                      <label style={{ fontSize: 13 }}>Image Alt Text <small style={{ color: "#888" }}>(auto-filled from filename)</small></label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.trends.imageAlt || ""}
                        onChange={(e) => setSec("trends", "imageAlt", e.target.value)}
                        placeholder="e.g. Ecommerce skyline"
                      />
                    </div>
                    {form.trends.image && (
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, trends: { ...p.trends, image: "", imageAlt: "" } }))}
                        style={{ border: "1px solid #f0c0c0", background: "#fff5f5", color: "#c44", padding: "4px 12px", borderRadius: 4, fontSize: 12, cursor: "pointer" }}
                      >
                        × Remove image (revert to default)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {iconCardBlock("trends", "items", "Trend", "+ Add Trend")}
        </>
      )}
    </SectionCard>
  );

  // ── Web Development template sections ──
  // Trust Bar and the Founder CTA strip are fixed design elements — no editor
  // for them, same convention as the Ecommerce hero's stats bar.

  // Why Now — heading/intro, a single glowing quote card (title+body), and
  // 4 numbered problem cards.
  const renderWhyNow = () => (
    <SectionCard id="sec-whynow" title="Why Now" accentColor="#2c2e50" {...toggle("whyNow")} badge={form.whyNow.cards.length}>
      {form.whyNow.show && (
        <>
          {secText("whyNow", "heading", "Heading (white part)", "A Slow, Generic Website Is Quietly Taxing", "col-lg-6")}
          {secText("whyNow", "headingAccent", "Heading accent (gradient part)", "Everything Else You Spend On", "col-lg-6")}
          {secTextarea("whyNow", "intro", "Intro", "Your ads, your SEO, your sales team's follow-ups: all of it funnels into one place...", 2)}
          {secText("whyNow", "cardTitle", "Quote card title", "Akoode does not sell templates with your logo swapped in.", "col-lg-12")}
          {secTextarea("whyNow", "cardBody", "Quote card body", "We are a web development company that engineers websites the way product teams engineer software...", 2)}
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Numbered cards</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("whyNow", "cards", emptyNumberedCard)}>+ Add Card</button></div>
          {(form.whyNow.cards || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Card" {...dnd("whyNow", "cards", i)} onRemove={() => removeArr("whyNow", "cards", i)}>
                <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Number</label><input type="text" className="form-control" value={c.number || ""} onChange={(e) => setArr("whyNow", "cards", i, "number", e.target.value)} placeholder="01" /></div></div>
                <div className="col-xl-10"><div className="my_profile_setting_input form-group"><label>Text</label><textarea className="form-control" rows={3} value={c.text || ""} onChange={(e) => setArr("whyNow", "cards", i, "text", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  // Services (orbit) — numbered cards, title+desc only (no icon — the sphere/
  // ring/connector-line graphic and card numbering are the fixed design).
  // ── Staff Augmentation: hiring-gap capsule row ──
  // `icon` is a key of the ICONS map in StaffAugHiringGapSection, not an admin
  // IconPicker key, so it is a fixed select rather than the icon browser.
  const GAP_ICONS = ["Clock", "FastForward", "Users", "TrendingUp", "Shield"];
  const renderHiringGap = () => (
    <SectionCard id="sec-hiringgap" title="Hiring Gap" accentColor="#2c2e50" {...toggle("hiringGap")} badge={form.hiringGap.points.length}>
      {form.hiringGap.show && (
        <>
          {secText("hiringGap", "heading", "Heading (gradient part)", "The Hire You Need Takes Longer to Find Than", "col-lg-6")}
          {secText("hiringGap", "headingAccent", "Heading accent (white part)", "The Problem can wait", "col-lg-6")}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Best with 5 capsules. Height alternates automatically &mdash; the 1st, 3rd and 5th are tall, the 2nd and 4th shorter &mdash; and the filled gradient treatment appears on <strong>hover</strong> over any capsule, so neither needs setting here.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Capsules</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("hiringGap", "points", emptyGapPoint)}>+ Add Capsule</button></div>
          {(form.hiringGap.points || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Capsule" {...dnd("hiringGap", "points", i)} onRemove={() => removeArr("hiringGap", "points", i)}>
                <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>Icon</label>
                  <select className="form-control" value={c.icon || ""} onChange={(e) => setArr("hiringGap", "points", i, "icon", e.target.value)}>
                    <option value="">- select -</option>
                    {GAP_ICONS.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div></div>
                <div className="col-xl-9"><div className="my_profile_setting_input form-group"><label>Text</label><textarea className="form-control" rows={3} value={c.text || ""} onChange={(e) => setArr("hiringGap", "points", i, "text", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  // ── Staff Augmentation: capabilities grid ──
  const renderCapabilitiesGrid = () => (
    <SectionCard id="sec-capabilities" title="Capabilities" accentColor="#2c2e50" {...toggle("vendorCapabilities")} badge={form.vendorCapabilities.items.length}>
      {form.vendorCapabilities.show && (
        <>
          {secText("vendorCapabilities", "heading", "Heading", "Capabilities Most Staffing Vendors Do Not Carry", "col-lg-12")}
          {secTextarea("vendorCapabilities", "intro", "Intro", "Every placement gets scoped against a specific gap and a defined outcome...", 2)}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Numbered automatically (01, 02, ...) and laid out two per row. Best with an even count; the design uses six.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Capabilities</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("vendorCapabilities", "items", emptyCapability)}>+ Add Capability</button></div>
          {(form.vendorCapabilities.items || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Capability" {...dnd("vendorCapabilities", "items", i)} onRemove={() => removeArr("vendorCapabilities", "items", i)}>
                <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title || ""} onChange={(e) => setArr("vendorCapabilities", "items", i, "title", e.target.value)} placeholder="Rapid Technical Vetting" /></div></div>
                <div className="col-xl-8"><div className="my_profile_setting_input form-group"><label>Description</label><textarea className="form-control" rows={3} value={c.desc || ""} onChange={(e) => setArr("vendorCapabilities", "items", i, "desc", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  // ══ Cloud & DevOps template renderers ══════════════════════════════
  // Every `icon` below is an admin IconPicker key resolved through
  // utils/adminIconMap; leaving one blank keeps the component's coded default.

  const renderDevopsBottleneck = () => (
    <SectionCard id="sec-devopsbottleneck" title="Bottleneck" accentColor="#2c2e50" {...toggle("devopsBottleneck")} badge={form.devopsBottleneck.points.length}>
      {form.devopsBottleneck.show && (
        <>
          {secText("devopsBottleneck", "heading", "Heading (gradient part)", "Your Deploys Are Slow Because Nobody Ever Designed the Path,", "col-lg-6")}
          {secText("devopsBottleneck", "headingAccent", "Heading accent (white part)", "It Just Grew.", "col-lg-6")}
          {secTextarea("devopsBottleneck", "intro", "Intro", "Most teams do not have a tooling problem...", 2)}
          {secText("devopsBottleneck", "cardTitle", "Glass card title", "Akoode is not a tools vendor who installs Kubernetes and leaves.", "col-lg-12")}
          {secTextarea("devopsBottleneck", "cardBody", "Glass card body", "We are a cloud and DevOps company that owns the outcome...", 2)}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            The right column is a numbered rail &mdash; entries are labelled ( 01 ), ( 02 ) &hellip; automatically. The design uses three.
          </div>
          {paragraphBlock("devopsBottleneck", "points", "Rail entries")}
        </>
      )}
    </SectionCard>
  );

  const renderDevopsServices = () => (
    <SectionCard id="sec-devopsservices" title="Services" accentColor="#2c2e50" {...toggle("devopsServices")} badge={form.devopsServices.items.length}>
      {form.devopsServices.show && (
        <>
          {secText("devopsServices", "heading", "Heading (gradient lead)", "Our Cloud", "col-lg-4")}
          {secText("devopsServices", "headingAccent", "Heading accent (white middle)", "and", "col-lg-4")}
          {secText("devopsServices", "headingTail", "Heading tail (gradient)", "DevOps Services", "col-lg-4")}
          {secTextarea("devopsServices", "intro", "Intro", "Every engagement here is scoped against a measurable outcome...", 2)}
          {secText("devopsServices", "ctaText", "Default CTA label (all cards)", "Talk to Our Team", "col-lg-6")}
          {secText("devopsServices", "ctaLink", "Default CTA link (all cards)", "/contact-us", "col-lg-6")}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Numbered automatically (01, 02, &hellip;) and laid out four per row, so a multiple of four reads best &mdash; the design uses eight. Cards use the default CTA above unless you set one on the card itself; leave both blank anywhere and it falls back to <strong>Talk to Our Team</strong> &rarr; <strong>/contact-us</strong>.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Services</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("devopsServices", "items", emptyDevopsService)}>+ Add Service</button></div>
          {(form.devopsServices.items || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Service" {...dnd("devopsServices", "items", i)} onRemove={() => removeArr("devopsServices", "items", i)}>
                <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title || ""} onChange={(e) => setArr("devopsServices", "items", i, "title", e.target.value)} placeholder="CI/CD Pipeline Implementation" /></div></div>
                <div className="col-xl-8">
                  <div className="my_profile_setting_input form-group">
                    <label>Description <small style={{ color: "#888" }}>(rich text &mdash; select a label like &ldquo;What it is:&rdquo; and hit <strong>B</strong> to bold it)</small></label>
                    <div className="tiptap-compact" style={{ border: "1px solid #e4e4f0", borderRadius: 6, overflow: "hidden" }}>
                      <HtmlEditor value={c.desc || ""} onChange={(v) => setArr("devopsServices", "items", i, "desc", v)} />
                    </div>
                  </div>
                </div>
                <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>CTA label <small style={{ color: "#888" }}>(optional &middot; overrides the section default)</small></label><input type="text" className="form-control" value={c.ctaText || ""} onChange={(e) => setArr("devopsServices", "items", i, "ctaText", e.target.value)} placeholder={form.devopsServices.ctaText || "Talk to Our Team"} /></div></div>
                <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>CTA link <small style={{ color: "#888" }}>(optional &middot; overrides the section default)</small></label><input type="text" className="form-control" value={c.ctaLink || ""} onChange={(e) => setArr("devopsServices", "items", i, "ctaLink", e.target.value)} placeholder={form.devopsServices.ctaLink || "/contact-us"} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  const renderDevopsCapabilities = () => (
    <SectionCard id="sec-devopscapabilities" title="Capabilities" accentColor="#3c3e66" {...toggle("devopsCapabilities")} badge={form.devopsCapabilities.items.length}>
      {form.devopsCapabilities.show && (
        <>
          {secText("devopsCapabilities", "heading", "Heading (gradient part)", "Capabilities Most DevOps", "col-lg-6")}
          {secText("devopsCapabilities", "headingAccent", "Heading accent (white part)", "Vendors Treat as an Afterthought", "col-lg-6")}
          {secTextarea("devopsCapabilities", "intro", "Intro", "Setting up a pipeline is the easy part of this work...", 2)}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Rendered as a horizontal timeline of numbered spheres, alternating above and below the axis. Numbering is automatic. <strong>Best with exactly six</strong> &mdash; more will crowd the track on desktop.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Capabilities</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("devopsCapabilities", "items", emptyCapability)}>+ Add Capability</button></div>
          {(form.devopsCapabilities.items || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Capability" {...dnd("devopsCapabilities", "items", i)} onRemove={() => removeArr("devopsCapabilities", "items", i)}>
                <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title || ""} onChange={(e) => setArr("devopsCapabilities", "items", i, "title", e.target.value)} placeholder="DevSecOps and Compliance" /></div></div>
                <div className="col-xl-8"><div className="my_profile_setting_input form-group"><label>Description</label><textarea className="form-control" rows={3} value={c.desc || ""} onChange={(e) => setArr("devopsCapabilities", "items", i, "desc", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  const renderDevopsEngagementFit = () => (
    <SectionCard id="sec-devopsengagementfit" title="Engagement Fit" accentColor="#2c2e50" {...toggle("devopsEngagementFit")} badge={form.devopsEngagementFit.options.length}>
      {form.devopsEngagementFit.show && (
        <>
          {secText("devopsEngagementFit", "heading", "Heading (gradient part)", "DevOps Consulting, Managed Services,", "col-lg-6")}
          {secText("devopsEngagementFit", "headingAccent", "Heading accent (white part)", "or an Internal Hire: Which One Fits", "col-lg-6")}
          {secTextarea("devopsEngagementFit", "intro", "Intro", "These three get treated as interchangeable in sales conversations...", 2)}

          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Three comparison columns. Every column&apos;s rows share the same track height, so give each column the <strong>same number of rows in the same order</strong> (the design uses Best Fit / Who Owns It Long-Term / Typical Duration).
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Options <small style={{ color: "#888", fontWeight: 400 }}>(the design uses three)</small></div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("devopsEngagementFit", "options", emptyFitOption)}>+ Add Option</button></div>
          {(form.devopsEngagementFit.options || []).map((o, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Option" {...dnd("devopsEngagementFit", "options", i)} onRemove={() => removeArr("devopsEngagementFit", "options", i)}>
                <div className="col-xl-3"><IconPicker value={o.icon} onChange={(v) => setArr("devopsEngagementFit", "options", i, "icon", v)} /></div>
                <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={o.title || ""} onChange={(e) => setArr("devopsEngagementFit", "options", i, "title", e.target.value)} placeholder="DevOps Consulting" /></div></div>
                <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Description</label><textarea className="form-control" rows={2} value={o.desc || ""} onChange={(e) => setArr("devopsEngagementFit", "options", i, "desc", e.target.value)} /></div></div>
                <div className="col-lg-12">
                  <div style={{ fontWeight: 600, margin: "6px 0 8px", color: "#2c2e50" }}>Rows</div>
                  <button type="button" className="btn admore_btn mb20" onClick={() => setArr("devopsEngagementFit", "options", i, "rows", [...(o.rows || []), emptyFitRow()])}>+ Add Row</button>
                </div>
                {(o.rows || []).map((r, ri) => (
                  <div className="col-lg-12" key={ri}>
                    <div className="row" style={{ background: "#fafbff", border: "1px solid #eceefa", borderRadius: 8, padding: "10px 6px", marginBottom: 10 }}>
                      <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Row label</label><input type="text" className="form-control" value={r.label || ""} onChange={(e) => setArr("devopsEngagementFit", "options", i, "rows", (o.rows || []).map((x, xi) => (xi === ri ? { ...x, label: e.target.value } : x)))} placeholder="Best Fit" /></div></div>
                      <div className="col-xl-7"><div className="my_profile_setting_input form-group"><label>Row value</label><textarea className="form-control" rows={2} value={r.value || ""} onChange={(e) => setArr("devopsEngagementFit", "options", i, "rows", (o.rows || []).map((x, xi) => (xi === ri ? { ...x, value: e.target.value } : x)))} /></div></div>
                      <div className="col-xl-1 d-flex align-items-center"><button type="button" className="btn btn-link text-danger p-0" onClick={() => setArr("devopsEngagementFit", "options", i, "rows", (o.rows || []).filter((_, xi) => xi !== ri))}>Remove</button></div>
                    </div>
                  </div>
                ))}
              </StepCard>
            </div>
          ))}

          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Closing callouts <small style={{ color: "#888", fontWeight: 400 }}>(the design uses two, side by side)</small></div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("devopsEngagementFit", "callouts", emptyFitCallout)}>+ Add Callout</button></div>
          {(form.devopsEngagementFit.callouts || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Callout" {...dnd("devopsEngagementFit", "callouts", i)} onRemove={() => removeArr("devopsEngagementFit", "callouts", i)}>
                <div className="col-xl-3"><IconPicker value={c.icon} onChange={(v) => setArr("devopsEngagementFit", "callouts", i, "icon", v)} /></div>
                <div className="col-xl-9"><div className="my_profile_setting_input form-group"><label>Text</label><textarea className="form-control" rows={4} value={c.text || ""} onChange={(e) => setArr("devopsEngagementFit", "callouts", i, "text", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  const renderDevopsCost = () => (
    <SectionCard id="sec-devopscost" title="Cost & Timeline" accentColor="#3c3e66" {...toggle("devopsCost")} badge={form.devopsCost.drivers.length + form.devopsCost.timelines.length}>
      {form.devopsCost.show && (
        <>
          {secText("devopsCost", "heading", "Heading (gradient part)", "What Cloud and DevOps Work", "col-lg-6")}
          {secText("devopsCost", "headingAccent", "Heading accent (white part)", "Actually Costs and How Long It Takes", "col-lg-6")}
          {secTextarea("devopsCost", "intro", "Intro", "On the page deliberately, rather than left for a sales call...", 2)}
          {secTextarea("devopsCost", "note", "Note beside the heading (the “i” callout)", "A number quoted before we've seen your actual infrastructure is a guess, not a quote...", 2)}

          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Three numbered blocks, labelled 01 / 02 / 03 automatically. Cost drivers lay out two per row (the design uses four); delivery ranges stack full width (three); estimate steps sit five across.
          </div>

          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>01 &mdash; Cost drivers</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("devopsCost", "drivers", emptyCostDriver)}>+ Add Driver</button></div>
          {(form.devopsCost.drivers || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Driver" {...dnd("devopsCost", "drivers", i)} onRemove={() => removeArr("devopsCost", "drivers", i)}>
                <div className="col-xl-3"><IconPicker value={c.icon} onChange={(v) => setArr("devopsCost", "drivers", i, "icon", v)} /></div>
                <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title || ""} onChange={(e) => setArr("devopsCost", "drivers", i, "title", e.target.value)} placeholder="Current Infrastructure Complexity" /></div></div>
                <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Description</label><textarea className="form-control" rows={3} value={c.desc || ""} onChange={(e) => setArr("devopsCost", "drivers", i, "desc", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}

          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>02 &mdash; Delivery ranges</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("devopsCost", "timelines", emptyCostTimeline)}>+ Add Range</button></div>
          {(form.devopsCost.timelines || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Range" {...dnd("devopsCost", "timelines", i)} onRemove={() => removeArr("devopsCost", "timelines", i)}>
                <div className="col-xl-3"><IconPicker value={c.icon} onChange={(v) => setArr("devopsCost", "timelines", i, "icon", v)} /></div>
                <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title || ""} onChange={(e) => setArr("devopsCost", "timelines", i, "title", e.target.value)} placeholder="CI/CD Pipeline Implementation" /></div></div>
                <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Range</label><input type="text" className="form-control" value={c.range || ""} onChange={(e) => setArr("devopsCost", "timelines", i, "range", e.target.value)} placeholder="2–4" /></div></div>
                <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Unit</label><input type="text" className="form-control" value={c.unit || ""} onChange={(e) => setArr("devopsCost", "timelines", i, "unit", e.target.value)} placeholder="Weeks" /></div></div>
              </StepCard>
            </div>
          ))}

          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>03 &mdash; Estimate steps</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("devopsCost", "steps", emptyCostDriver)}>+ Add Step</button></div>
          {(form.devopsCost.steps || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Step" {...dnd("devopsCost", "steps", i)} onRemove={() => removeArr("devopsCost", "steps", i)}>
                <div className="col-xl-3"><IconPicker value={c.icon} onChange={(v) => setArr("devopsCost", "steps", i, "icon", v)} /></div>
                <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title || ""} onChange={(e) => setArr("devopsCost", "steps", i, "title", e.target.value)} placeholder="Technical Assessment" /></div></div>
                <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Description</label><textarea className="form-control" rows={2} value={c.desc || ""} onChange={(e) => setArr("devopsCost", "steps", i, "desc", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  const renderDevopsOutlook = () => (
    <SectionCard id="sec-devopsoutlook" title="2026 Outlook" accentColor="#2c2e50" {...toggle("devopsOutlook")} badge={form.devopsOutlook.cards.length}>
      {form.devopsOutlook.show && (
        <>
          {secText("devopsOutlook", "heading", "Heading (gradient part)", "What Cloud and DevOps", "col-lg-6")}
          {secText("devopsOutlook", "headingAccent", "Heading accent (white part)", "Work Stands in 2026", "col-lg-6")}
          {secTextarea("devopsOutlook", "intro", "Intro", "None of this is a forecast. These are the conditions already shaping...", 2)}
          {secTextarea("devopsOutlook", "note", "Note beside the heading (the “i” callout)", "A number quoted before we've seen your actual infrastructure is a guess...", 2)}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Outlined Q&amp;A cards, numbered 01, 02, &hellip; automatically. The design uses five. Leave an icon blank to keep the coded mark for that position.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Cards</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("devopsOutlook", "cards", emptyOutlookCard)}>+ Add Card</button></div>
          {(form.devopsOutlook.cards || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Card" {...dnd("devopsOutlook", "cards", i)} onRemove={() => removeArr("devopsOutlook", "cards", i)}>
                <div className="col-xl-3"><IconPicker value={c.icon} onChange={(v) => setArr("devopsOutlook", "cards", i, "icon", v)} /></div>
                <div className="col-xl-9"><div className="my_profile_setting_input form-group"><label>Question</label><input type="text" className="form-control" value={c.question || ""} onChange={(e) => setArr("devopsOutlook", "cards", i, "question", e.target.value)} placeholder="Why is platform engineering replacing traditional DevOps teams?" /></div></div>
                <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Answer</label><textarea className="form-control" rows={4} value={c.answer || ""} onChange={(e) => setArr("devopsOutlook", "cards", i, "answer", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  /* ── Digital Transformation template editors ───────────────────────────
   *  Every field is optional: the front-end components fall back to their
   *  Figma copy when one is blank, so a half-filled record still renders a
   *  complete page. Where a layout is built around a fixed count (six
   *  capabilities, five trend cards, six process steps) that is called out in
   *  the section's note rather than enforced here, so an editor can see why
   *  the extra row they added did not appear.
   * -------------------------------------------------------------------- */

  // Plain string lists (rail words, table column labels) — one per line.
  // paragraphBlock is rich text and too heavy for a single word.
  const dtLines = (sec, key, label, hint, placeholder) => (
    <div className="col-lg-12">
      <div className="my_profile_setting_input form-group">
        <label>{label} {hint && <small style={{ color: "#888" }}>({hint})</small>}</label>
        <textarea
          className="form-control"
          rows={4}
          value={(form[sec][key] || []).join("\n")}
          onChange={(e) => setSec(sec, key, e.target.value.split("\n"))}
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  const renderDtProblem = () => (
    <SectionCard id="sec-dtproblem" title="The Problem" accentColor="#3c3e66" {...toggle("dtProblem")} badge={form.dtProblem.items.length}>
      {form.dtProblem.show && (
        <>
          {secTextarea("dtProblem", "heading", "Heading (dark part)", "The Tools Aren’t the Problem,", 2)}
          {secTextarea("dtProblem", "headingAccent", "Heading accent (gradient part)", "the Systems Underneath Them Never Talked to Each Other", 2)}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Line breaks typed into either heading box are preserved on the page.
          </div>
          {secTextarea("dtProblem", "intro", "Intro", "A business can buy the best CRM…", 2)}
          {secText("dtProblem", "cardEyebrow", "Card eyebrow", "Our Positioning", "col-lg-4")}
          {secText("dtProblem", "cardTitle", "Card title", "Akoode is not a software vendor selling you a platform and walking away.", "col-lg-8")}
          {secTextarea("dtProblem", "cardBody", "Card body", "We are a digital transformation company that redesigns the operating model first…", 3)}
          {dtLines("dtProblem", "railWords", "Card rail words", "one per line, stacked down the card’s right edge", "Connected\nSystem\nReal\nOutcomes")}
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Right panel items</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("dtProblem", "items", emptyDtReality)}>+ Add Item</button></div>
          {(form.dtProblem.items || []).map((it, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Item" {...dnd("dtProblem", "items", i)} onRemove={() => removeArr("dtProblem", "items", i)}>
                <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Eyebrow</label><input type="text" className="form-control" value={it.eyebrow || ""} onChange={(e) => setArr("dtProblem", "items", i, "eyebrow", e.target.value)} placeholder="The Reality" /></div></div>
                <div className="col-xl-8"><div className="my_profile_setting_input form-group"><label>Heading</label><input type="text" className="form-control" value={it.heading || ""} onChange={(e) => setArr("dtProblem", "items", i, "heading", e.target.value)} /></div></div>
                <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Body</label><textarea className="form-control" rows={4} value={it.body || ""} onChange={(e) => setArr("dtProblem", "items", i, "body", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  const renderDtServices = () => (
    <SectionCard id="sec-dtservices" title="Services" accentColor="#2c2e50" {...toggle("dtServices")} badge={form.dtServices.items.length}>
      {form.dtServices.show && (
        <>
          {secTextarea("dtServices", "heading", "Heading (dark part)", "Our Digital\nTransformation,", 2)}
          {secText("dtServices", "headingAccent", "Heading accent (gradient part)", "Services", "col-lg-6")}
          {secTextarea("dtServices", "intro", "Intro", "Every engagement gets scoped against a measurable outcome…", 2)}
          {secText("dtServices", "ctaText", "CTA text", "Talk to Our Team", "col-lg-6")}
          {secText("dtServices", "ctaLink", "CTA link", "/contact-us", "col-lg-6")}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Each row is a numbered strip beside a card. The dark treatment is a <strong>hover state</strong> on whichever row the pointer is over, not a per-row setting.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Service rows</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("dtServices", "items", emptyDtService)}>+ Add Service</button></div>
          {(form.dtServices.items || []).map((it, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Service" {...dnd("dtServices", "items", i)} onRemove={() => removeArr("dtServices", "items", i)}>
                <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Number</label><input type="text" className="form-control" value={it.n || ""} onChange={(e) => setArr("dtServices", "items", i, "n", e.target.value)} placeholder="01" /></div></div>
                <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>Eyebrow</label><input type="text" className="form-control" value={it.eyebrow || ""} onChange={(e) => setArr("dtServices", "items", i, "eyebrow", e.target.value)} placeholder="Modernize" /></div></div>
                <div className="col-xl-7"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={it.title || ""} onChange={(e) => setArr("dtServices", "items", i, "title", e.target.value)} placeholder="Enterprise Application Modernization" /></div></div>
                <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Description</label><textarea className="form-control" rows={2} value={it.desc || ""} onChange={(e) => setArr("dtServices", "items", i, "desc", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  const renderDtCapabilities = () => (
    <SectionCard id="sec-dtcapabilities" title="Capabilities" accentColor="#3c3e66" {...toggle("dtCapabilities")} badge={form.dtCapabilities.items.length}>
      {form.dtCapabilities.show && (
        <>
          {secTextarea("dtCapabilities", "heading", "Heading (dark part)", "Capabilities Most Transformation\nvendors Treat as", 2)}
          {secText("dtCapabilities", "headingAccent", "Heading accent (gradient part)", "An Afterthought", "col-lg-6")}
          {secTextarea("dtCapabilities", "intro", "Intro", "Modernizing one system is straightforward…", 2)}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Rendered as a rising staircase of six cards. The step heights are fixed by position, so <strong>only the first six</strong> are laid out &mdash; a seventh will not appear.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Capabilities</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("dtCapabilities", "items", emptyDtCapability)}>+ Add Capability</button></div>
          {(form.dtCapabilities.items || []).map((it, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Capability" {...dnd("dtCapabilities", "items", i)} onRemove={() => removeArr("dtCapabilities", "items", i)}>
                <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Number</label><input type="text" className="form-control" value={it.n || ""} onChange={(e) => setArr("dtCapabilities", "items", i, "n", e.target.value)} placeholder="01" /></div></div>
                <div className="col-xl-10"><div className="my_profile_setting_input form-group"><label>Title <small style={{ color: "#888" }}>(line breaks preserved)</small></label><textarea className="form-control" rows={2} value={it.title || ""} onChange={(e) => setArr("dtCapabilities", "items", i, "title", e.target.value)} placeholder="Enterprise&#10;System Integration" /></div></div>
                <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Body</label><textarea className="form-control" rows={3} value={it.body || ""} onChange={(e) => setArr("dtCapabilities", "items", i, "body", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  const renderDtScope = () => (
    <SectionCard id="sec-dtscope" title="Scope Table" accentColor="#2c2e50" {...toggle("dtScope")} badge={form.dtScope.rows.length}>
      {form.dtScope.show && (
        <>
          {secTextarea("dtScope", "heading", "Heading (dark part)", "Full Transformation, a Single Modernization\nProject, or Point Automation:", 2)}
          {secText("dtScope", "headingAccent", "Heading accent (gradient part)", "Which One Fits", "col-lg-6")}
          {secTextarea("dtScope", "intro", "Intro", "These get treated as the same conversation and they’re not…", 2)}
          {dtLines("dtScope", "columns", "Column headings", "one per line, four in total", "Approach\nBest Fit\nTypical Duration\nRisk If Scoped Wrong")}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Row heights are fixed by position, so <strong>only the first three rows</strong> are laid out.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Rows</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("dtScope", "rows", emptyDtScopeRow)}>+ Add Row</button></div>
          {(form.dtScope.rows || []).map((r, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Row" {...dnd("dtScope", "rows", i)} onRemove={() => removeArr("dtScope", "rows", i)}>
                <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Number</label><input type="text" className="form-control" value={r.n || ""} onChange={(e) => setArr("dtScope", "rows", i, "n", e.target.value)} placeholder="01" /></div></div>
                <div className="col-xl-10"><div className="my_profile_setting_input form-group"><label>Approach</label><input type="text" className="form-control" value={r.approach || ""} onChange={(e) => setArr("dtScope", "rows", i, "approach", e.target.value)} placeholder="Full Digital Transformation" /></div></div>
                <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Best fit</label><textarea className="form-control" rows={3} value={r.bestFit || ""} onChange={(e) => setArr("dtScope", "rows", i, "bestFit", e.target.value)} /></div></div>
                <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Typical duration</label><textarea className="form-control" rows={3} value={r.duration || ""} onChange={(e) => setArr("dtScope", "rows", i, "duration", e.target.value)} /></div></div>
                <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Risk if scoped wrong</label><textarea className="form-control" rows={3} value={r.risk || ""} onChange={(e) => setArr("dtScope", "rows", i, "risk", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
          {secTextarea("dtScope", "noteBody", "Footnote (left, rule beside it)", "If the real problem is one legacy system nobody’s touched in years…", 4)}
          {secText("dtScope", "calloutTitle", "Callout title", "When You Don’t Need a Transformation Consultant at All", "col-lg-12")}
          {secTextarea("dtScope", "calloutBody", "Callout body", "Sometimes the honest answer is that you need one system fixed…", 4)}
        </>
      )}
    </SectionCard>
  );

  const renderDtCost = () => (
    <SectionCard id="sec-dtcost" title="Cost & Timeline" accentColor="#3c3e66" {...toggle("dtCost")} badge={form.dtCost.factors.length}>
      {form.dtCost.show && (
        <>
          {secTextarea("dtCost", "heading", "Heading (dark part)", "What Digital Transformation\nActually Costs", 2)}
          {secText("dtCost", "headingAccent", "Heading accent (gradient part)", "and How Long It Takes", "col-lg-6")}
          {secTextarea("dtCost", "intro", "Intro", "On the page directly, rather than left for a sales call…", 2)}

          <div className="col-lg-12"><div style={{ fontWeight: 700, margin: "6px 0 10px", color: "#2c2e50" }}>Left: what drives the cost</div></div>
          {secText("dtCost", "costHeading", "Column heading", "What Drives the cost", "col-lg-4")}
          {secText("dtCost", "circleEyebrow", "Circle eyebrow", "Cost is driven by", "col-lg-4")}
          {secText("dtCost", "circleTitle", "Circle title", "Four\nKey\nFactors", "col-lg-4")}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Card widths are fixed by position, so <strong>only the first four factors</strong> are laid out. The arc and circle behind them are fixed artwork.
          </div>
          <div className="col-lg-12"><button type="button" className="btn admore_btn mb20" onClick={() => addArr("dtCost", "factors", emptyDtFactor)}>+ Add Cost Factor</button></div>
          {(form.dtCost.factors || []).map((f, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Factor" {...dnd("dtCost", "factors", i)} onRemove={() => removeArr("dtCost", "factors", i)}>
                <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Number</label><input type="text" className="form-control" value={f.n || ""} onChange={(e) => setArr("dtCost", "factors", i, "n", e.target.value)} placeholder="01" /></div></div>
                <div className="col-xl-10"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={f.title || ""} onChange={(e) => setArr("dtCost", "factors", i, "title", e.target.value)} placeholder="Number of systems involved" /></div></div>
                <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Body</label><textarea className="form-control" rows={2} value={f.body || ""} onChange={(e) => setArr("dtCost", "factors", i, "body", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}

          <div className="col-lg-12"><div style={{ fontWeight: 700, margin: "18px 0 10px", color: "#2c2e50" }}>Right: how long it actually takes</div></div>
          {secText("dtCost", "timelineHeading", "Column heading", "How LOng it actually takes", "col-lg-6")}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Three rows on a rail. The dot size, rail colour and progress-bar width are all <strong>fixed design elements</strong> set by position, so <strong>only the first three</strong> rows are laid out and the bar is not editable here.
          </div>
          <div className="col-lg-12"><button type="button" className="btn admore_btn mb20" onClick={() => addArr("dtCost", "timelines", emptyDtTimeline)}>+ Add Timeline Row</button></div>
          {(form.dtCost.timelines || []).map((t, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Timeline" {...dnd("dtCost", "timelines", i)} onRemove={() => removeArr("dtCost", "timelines", i)}>
                <div className="col-xl-8"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={t.title || ""} onChange={(e) => setArr("dtCost", "timelines", i, "title", e.target.value)} placeholder="Single System Modernization" /></div></div>
                <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Value</label><input type="text" className="form-control" value={t.value || ""} onChange={(e) => setArr("dtCost", "timelines", i, "value", e.target.value)} placeholder="6–12" /></div></div>
                <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Unit</label><input type="text" className="form-control" value={t.unit || ""} onChange={(e) => setArr("dtCost", "timelines", i, "unit", e.target.value)} placeholder="Weeks" /></div></div>
                <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Body</label><textarea className="form-control" rows={2} value={t.body || ""} onChange={(e) => setArr("dtCost", "timelines", i, "body", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}

          <div className="col-lg-12"><div style={{ fontWeight: 700, margin: "18px 0 10px", color: "#2c2e50" }}>Footnote banner</div></div>
          {secText("dtCost", "bannerLead", "Lead text", "A number quoted before we’ve actually seen your systems is a guess", "col-lg-6")}
          {secText("dtCost", "bannerHighlight", "Highlighted words", "dressed up", "col-lg-3")}
          {secText("dtCost", "bannerTail", "Trailing text", "as a quote.", "col-lg-3")}
          {secTextarea("dtCost", "bannerBody", "Banner body", "We give a fixed estimate after a technical and operational assessment…", 2)}
        </>
      )}
    </SectionCard>
  );

  const renderDtTrends = () => (
    <SectionCard id="sec-dttrends" title="2026 Trends" accentColor="#2c2e50" {...toggle("dtTrends")} badge={form.dtTrends.items.length}>
      {form.dtTrends.show && (
        <>
          {secText("dtTrends", "heading", "Heading (dark part)", "Where Digital Transformation Stands", "col-lg-6")}
          {secText("dtTrends", "headingAccent", "Heading accent (gradient part)", "in 2026", "col-lg-6")}
          {secTextarea("dtTrends", "intro", "Intro", "None of this is a forecast…", 2)}
          {secText("dtTrends", "orbEyebrow", "Orb eyebrow", "Five Trends", "col-lg-4")}
          {secText("dtTrends", "orbTitle", "Orb title", "Shaping\nTransformation", "col-lg-4")}
          {secText("dtTrends", "orbTitleAccent", "Orb title accent", "in 2026", "col-lg-4")}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            The five cards sit at fixed points around the orb with the connector curves drawn to match, so <strong>only the first five</strong> are laid out and the order is positional. Below tablet they stack in the order listed here.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Trend cards</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("dtTrends", "items", emptyDtTrend)}>+ Add Trend</button></div>
          {(form.dtTrends.items || []).map((it, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Trend" {...dnd("dtTrends", "items", i)} onRemove={() => removeArr("dtTrends", "items", i)}>
                <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Number</label><input type="text" className="form-control" value={it.n || ""} onChange={(e) => setArr("dtTrends", "items", i, "n", e.target.value)} placeholder="01" /></div></div>
                <div className="col-xl-10"><div className="my_profile_setting_input form-group"><label>Question</label><input type="text" className="form-control" value={it.heading || ""} onChange={(e) => setArr("dtTrends", "items", i, "heading", e.target.value)} /></div></div>
                <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Answer</label><textarea className="form-control" rows={4} value={it.body || ""} onChange={(e) => setArr("dtTrends", "items", i, "body", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  const renderDtIndustries = () => (
    <SectionCard id="sec-dtindustries" title="Industries" accentColor="#3c3e66" {...toggle("dtIndustries")} badge={form.dtIndustries.items.length}>
      {form.dtIndustries.show && (
        <>
          {secTextarea("dtIndustries", "heading", "Heading (dark part)", "Industries We", 2)}
          {secText("dtIndustries", "headingAccent", "Heading accent (gradient part)", "Transform", "col-lg-6")}
          {secTextarea("dtIndustries", "intro", "Intro", "", 2)}
          {secText("dtIndustries", "listTitle", "List title", "Explore\nIndustries", "col-lg-6")}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Every industry appears in the list. A row is only <strong>selectable</strong> (and expandable in the mobile accordion) once it has <strong>body</strong> copy &mdash; rows without it render as plain labels, which is how the rest of the list stays visible while its content is still being written.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Industries</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("dtIndustries", "items", emptyDtIndustry)}>+ Add Industry</button></div>
          {(form.dtIndustries.items || []).map((it, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Industry" {...dnd("dtIndustries", "items", i)} onRemove={() => removeArr("dtIndustries", "items", i)}>
                <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Number</label><input type="text" className="form-control" value={it.n || ""} onChange={(e) => setArr("dtIndustries", "items", i, "n", e.target.value)} placeholder="01" /></div></div>
                <div className="col-xl-10"><div className="my_profile_setting_input form-group"><label>Label</label><input type="text" className="form-control" value={it.label || ""} onChange={(e) => setArr("dtIndustries", "items", i, "label", e.target.value)} placeholder="Real Estate" /></div></div>
                <div className="col-xl-12">
                  <div className="my_profile_setting_input form-group">
                    <label>Page link <small style={{ color: "#888" }}>(links the industry title on the card &mdash; leave blank to render it as plain text)</small></label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <select
                        className="form-control"
                        value={industryOptions.some((o) => `/industries/${o.slug}` === it.href) ? it.href : ""}
                        onChange={(e) => setArr("dtIndustries", "items", i, "href", e.target.value)}
                      >
                        <option value="">&mdash; Select an industry page &mdash;</option>
                        {industryOptions.map((o) => (
                          <option key={o.slug} value={`/industries/${o.slug}`}>{o.name}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        className="form-control"
                        value={it.href || ""}
                        onChange={(e) => setArr("dtIndustries", "items", i, "href", e.target.value)}
                        placeholder="/industries/healthcare"
                        style={{ fontSize: 12 }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Bullets <small style={{ color: "#888" }}>(one per line, three shown)</small></label><textarea className="form-control" rows={3} value={(it.bullets || []).join("\n")} onChange={(e) => setArr("dtIndustries", "items", i, "bullets", e.target.value.split("\n"))} /></div></div>
                <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Body <small style={{ color: "#888" }}>(leave blank to keep this row as a plain label)</small></label><textarea className="form-control" rows={4} value={it.body || ""} onChange={(e) => setArr("dtIndustries", "items", i, "body", e.target.value)} /></div></div>
                <div className="col-xl-12">
                  <div className="my_profile_setting_input form-group">
                    <label>Image <small style={{ color: "#888" }}>(shown beside the copy; the row renders without one if left empty)</small></label>
                    <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
                      <div className="wrap-custom-file" style={{ height: 150, width: 260, flexShrink: 0 }}>
                        <input
                          type="file"
                          id={`dt-industry-image-${i}`}
                          accept="image/*"
                          onChange={(e) => handleDtIndustryImageUpload(i, e)}
                        />
                        <label
                          htmlFor={`dt-industry-image-${i}`}
                          style={it.image ? {
                            backgroundImage: `url(${dtIndustryPreview(it.image)})`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                          } : {}}
                        >
                          <span><i className="flaticon-download"></i> {it.image ? "Change Image" : "Upload Image"}</span>
                        </label>
                      </div>
                      <div style={{ width: 300 }}>
                        <div className="my_profile_setting_input form-group">
                          <label style={{ fontSize: 13 }}>Image Alt Text <small style={{ color: "#888" }}>(auto-filled from filename)</small></label>
                          <input
                            type="text"
                            className="form-control"
                            value={it.imageAlt || ""}
                            onChange={(e) => setArr("dtIndustries", "items", i, "imageAlt", e.target.value)}
                            placeholder="e.g. Connected real estate development"
                          />
                        </div>
                        {it.image && (
                          <>
                            <div style={{ fontSize: 11, color: "#9a9bb8", wordBreak: "break-all", marginBottom: 6 }}>{it.image}</div>
                            <button
                              type="button"
                              onClick={() => { setArr("dtIndustries", "items", i, "image", ""); setArr("dtIndustries", "items", i, "imageAlt", ""); }}
                              style={{ border: "1px solid #f0c0c0", background: "#fff5f5", color: "#c44", padding: "4px 12px", borderRadius: 4, fontSize: 12, cursor: "pointer" }}
                            >
                              × Remove image
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {[0, 1].map((k) => (
                  <Fragment key={k}>
                    <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>{`Stat ${k + 1} value`}</label><input type="text" className="form-control" value={it.stats?.[k]?.value || ""} onChange={(e) => { const next = [...(it.stats || [])]; while (next.length < 2) next.push(emptyDtStat()); next[k] = { ...next[k], value: e.target.value }; setArr("dtIndustries", "items", i, "stats", next); }} placeholder="40%" /></div></div>
                    <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>{`Stat ${k + 1} label`}</label><input type="text" className="form-control" value={it.stats?.[k]?.label || ""} onChange={(e) => { const next = [...(it.stats || [])]; while (next.length < 2) next.push(emptyDtStat()); next[k] = { ...next[k], label: e.target.value }; setArr("dtIndustries", "items", i, "stats", next); }} placeholder="Operational efficiency" /></div></div>
                  </Fragment>
                ))}
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  const renderDtProcess = () => (
    <SectionCard id="sec-dtprocess" title="Process" accentColor="#2c2e50" {...toggle("dtProcess")} badge={form.dtProcess.steps.length}>
      {form.dtProcess.show && (
        <>
          {secText("dtProcess", "heading", "Heading (dark part)", "Our Digital Transformation", "col-lg-6")}
          {secText("dtProcess", "headingAccent", "Heading accent (gradient part)", "Process", "col-lg-6")}
          {secTextarea("dtProcess", "intro", "Intro", "Six stages, and skipping the first one…", 2)}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Laid out as two rows of three joined by dashed connectors, with the lower row running right to left. That only works for <strong>exactly six steps</strong> &mdash; any other count falls back to the built-in six so the connectors stay correct. List them in order 01&ndash;06; the reversal is handled for you.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Steps</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("dtProcess", "steps", emptyDtStep)}>+ Add Step</button></div>
          {(form.dtProcess.steps || []).map((st, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Step" {...dnd("dtProcess", "steps", i)} onRemove={() => removeArr("dtProcess", "steps", i)}>
                <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Badge number</label><input type="text" className="form-control" value={st.n || ""} onChange={(e) => setArr("dtProcess", "steps", i, "n", e.target.value)} placeholder="01" /></div></div>
                <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Eyebrow</label><input type="text" className="form-control" value={st.eyebrow || ""} onChange={(e) => setArr("dtProcess", "steps", i, "eyebrow", e.target.value)} placeholder="Step 01 · Strategy" /></div></div>
                <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={st.title || ""} onChange={(e) => setArr("dtProcess", "steps", i, "title", e.target.value)} /></div></div>
                <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Body</label><textarea className="form-control" rows={3} value={st.body || ""} onChange={(e) => setArr("dtProcess", "steps", i, "body", e.target.value)} /></div></div>
                <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Pull quote <small style={{ color: "#888" }}>(the tinted box; quotation marks are added automatically)</small></label><textarea className="form-control" rows={2} value={st.quote || ""} onChange={(e) => setArr("dtProcess", "steps", i, "quote", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  // ── Staff Augmentation: which model fits ──
  // Icon names are keys of QUESTION_ICONS / MODEL_ICONS in
  // StaffAugModelFitSection, not admin IconPicker keys.
  const FIT_Q_ICONS = ["Users", "TrendingUp", "Target"];
  const FIT_M_ICONS = ["User", "Users", "FileText"];
  const renderModelFit = () => (
    <SectionCard id="sec-modelfit" title="Model Fit" accentColor="#3c3e66" {...toggle("modelFit")} badge={form.modelFit.models.length}>
      {form.modelFit.show && (
        <>
          {secText("modelFit", "heading", "Heading (dark part)", "Staff Augmentation, Dedicated Teams, or Full Outsourcing:", "col-lg-6")}
          {secText("modelFit", "headingAccent", "Heading accent (gradient part)", "Which one Actually Fits", "col-lg-6")}
          {secTextarea("modelFit", "intro", "Intro", "These three models get used interchangeably in sales conversations...", 2)}

          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Decision questions <small style={{ color: "#888", fontWeight: 400 }}>(the design uses three)</small></div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("modelFit", "questions", emptyFitQuestion)}>+ Add Question</button></div>
          {(form.modelFit.questions || []).map((q, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Question" {...dnd("modelFit", "questions", i)} onRemove={() => removeArr("modelFit", "questions", i)}>
                <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>Icon</label>
                  <select className="form-control" value={q.icon || ""} onChange={(e) => setArr("modelFit", "questions", i, "icon", e.target.value)}>
                    <option value="">- select -</option>
                    {FIT_Q_ICONS.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div></div>
                <div className="col-xl-9"><div className="my_profile_setting_input form-group"><label>Question</label><input type="text" className="form-control" value={q.text || ""} onChange={(e) => setArr("modelFit", "questions", i, "text", e.target.value)} /></div></div>
              </StepCard>
            </div>
          ))}

          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", margin: "6px 0 14px", fontSize: 13, color: "#474972" }}>
            The three models below drive both the branches under the question card and the comparison columns, so they render twice. Best with exactly three.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Models</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("modelFit", "models", emptyFitModel)}>+ Add Model</button></div>
          {(form.modelFit.models || []).map((m, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Model" {...dnd("modelFit", "models", i)} onRemove={() => removeArr("modelFit", "models", i)}>
                <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>Icon</label>
                  <select className="form-control" value={m.icon || ""} onChange={(e) => setArr("modelFit", "models", i, "icon", e.target.value)}>
                    <option value="">- select -</option>
                    {FIT_M_ICONS.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div></div>
                <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Name</label><input type="text" className="form-control" value={m.name || ""} onChange={(e) => setArr("modelFit", "models", i, "name", e.target.value)} placeholder="Staff Augmentation" /></div></div>
                <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Best fit for</label><textarea className="form-control" rows={2} value={m.fit || ""} onChange={(e) => setArr("modelFit", "models", i, "fit", e.target.value)} /></div></div>
                <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Who directs the work</label><input type="text" className="form-control" value={m.directs || ""} onChange={(e) => setArr("modelFit", "models", i, "directs", e.target.value)} placeholder="Your team, your process" /></div></div>
                <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Typical duration</label><input type="text" className="form-control" value={m.duration || ""} onChange={(e) => setArr("modelFit", "models", i, "duration", e.target.value)} placeholder="Weeks to several months" /></div></div>
              </StepCard>
            </div>
          ))}

          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Pull quote <small style={{ color: "#888", fontWeight: 400 }}>(two paragraphs beside the questions)</small></div></div>
          {(form.modelFit.quotes || ["", ""]).map((q, i) => (
            <div className="col-lg-6" key={i}>
              <div className="my_profile_setting_input form-group">
                <label>{`Paragraph ${i + 1}`}</label>
                <textarea className="form-control" rows={3} value={q || ""} onChange={(e) => setStr("modelFit", "quotes", i, e.target.value)} />
              </div>
            </div>
          ))}

          {secText("modelFit", "warningTitle", "Callout title", "When Staff Augmentation Is Not the Right Fit", "col-lg-12")}
          {(form.modelFit.warningParagraphs || ["", ""]).map((w, i) => (
            <div className="col-lg-6" key={i}>
              <div className="my_profile_setting_input form-group">
                <label>{`Callout paragraph ${i + 1}`}</label>
                <textarea className="form-control" rows={3} value={w || ""} onChange={(e) => setStr("modelFit", "warningParagraphs", i, e.target.value)} />
              </div>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  // ── Staff Augmentation: services accordion ──
  const renderStaffServices = () => (
    <SectionCard id="sec-staffservices" title="Services" accentColor="#3c3e66" {...toggle("staffServices")} badge={form.staffServices.items.length}>
      {form.staffServices.show && (
        <>
          {secText("staffServices", "heading", "Heading (dark part)", "Our staff Augmentation", "col-lg-6")}
          {secText("staffServices", "headingAccent", "Heading accent (gradient part)", "Services", "col-lg-6")}
          {secTextarea("staffServices", "intro", "Intro", "Every placement gets scoped against a specific gap and a defined outcome...", 2)}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Rows are numbered automatically (01, 02, ...) and the first one opens by default. Each row takes definition <strong>blocks</strong> (three read best on one line) and a <strong>delivery timeline</strong> of five steps.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Service rows</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("staffServices", "items", emptyStaffService)}>+ Add Service</button></div>
          {(form.staffServices.items || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Service" {...dnd("staffServices", "items", i)} onRemove={() => removeArr("staffServices", "items", i)}>
                <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title || ""} onChange={(e) => setArr("staffServices", "items", i, "title", e.target.value)} placeholder="IT Staff Augmentation" /></div></div>
                <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>Duration</label><input type="text" className="form-control" value={c.duration || ""} onChange={(e) => setArr("staffServices", "items", i, "duration", e.target.value)} placeholder="2-3 Weeks" /></div></div>
                <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>Price</label><input type="text" className="form-control" value={c.price || ""} onChange={(e) => setArr("staffServices", "items", i, "price", e.target.value)} placeholder="On Request" /></div></div>

                <div className="col-xl-12">
                  <label style={{ fontWeight: 600 }}>Blocks</label>
                  {(c.blocks || []).map((b, j) => (
                    <div key={j} className="d-flex gap-2 mb-2 align-items-start">
                      <input type="text" className="form-control" style={{ maxWidth: 220 }} value={b.label || ""} onChange={(e) => setNestedObj("staffServices", "items", i, "blocks", j, "label", e.target.value)} placeholder="What it is" />
                      <textarea className="form-control" rows={2} value={b.body || ""} onChange={(e) => setNestedObj("staffServices", "items", i, "blocks", j, "body", e.target.value)} placeholder="Description" />
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeNestedObj("staffServices", "items", i, "blocks", j)}>x</button>
                    </div>
                  ))}
                  <button type="button" className="btn admore_btn btn-sm mt-1 mb20" onClick={() => addNestedObj("staffServices", "items", i, "blocks", emptyServiceBlock)}>+ Block</button>
                </div>

                <div className="col-xl-12">
                  <label style={{ fontWeight: 600 }}>Timeline steps</label>
                  {(c.steps || []).map((st, j) => (
                    <div key={j} className="d-flex gap-2 mb-2">
                      <input type="text" className="form-control" value={st || ""} onChange={(e) => setNestedStr("staffServices", "items", i, "steps", j, e.target.value)} placeholder={"Step " + (j + 1)} />
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeNestedStr("staffServices", "items", i, "steps", j)}>x</button>
                    </div>
                  ))}
                  <button type="button" className="btn admore_btn btn-sm mt-1" onClick={() => addNestedStr("staffServices", "items", i, "steps")}>+ Step</button>
                </div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  const renderWebServices = () => (
    <SectionCard id="sec-services" title="Services" accentColor="#3c3e66" {...toggle("services")} badge={form.services.items.length}>
      {form.services.show && (
        <>
          {secText("services", "heading", "Heading (white part)", "Our Web Development", "col-lg-6")}
          {secText("services", "headingAccent", "Heading accent (gradient part)", "Services", "col-lg-6")}
          {secTextarea("services", "intro", "Intro", "Everything below gets scoped against a commercial outcome...", 2)}
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Cards are numbered automatically (01, 02, …). The orbit graphic and layout are fixed — best with 8 cards.
          </div>
          <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Services</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("services", "items", emptyServiceItem)}>+ Add Service</button></div>
          {(form.services.items || []).map((c, i) => (
            <div className="col-12" key={i}>
              <StepCard index={i} label="Service" {...dnd("services", "items", i)} onRemove={() => removeArr("services", "items", i)}>
                <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title || ""} onChange={(e) => setArr("services", "items", i, "title", e.target.value)} placeholder="Custom Website Development" /></div></div>
                <div className="col-xl-8"><div className="my_profile_setting_input form-group"><label>Description</label><textarea className="form-control" rows={3} value={c.desc || ""} onChange={(e) => setArr("services", "items", i, "desc", e.target.value)} /></div></div>
                <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>CTA text <small style={{ color: "#888" }}>(optional · defaults to "Learn More")</small></label><input type="text" className="form-control" value={c.ctaText || ""} onChange={(e) => setArr("services", "items", i, "ctaText", e.target.value)} placeholder="Learn More" /></div></div>
                <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>CTA link <small style={{ color: "#888" }}>(optional · defaults to "/contact-us")</small></label><input type="text" className="form-control" value={c.ctaLink || ""} onChange={(e) => setArr("services", "items", i, "ctaLink", e.target.value)} placeholder="/contact-us" /></div></div>
              </StepCard>
            </div>
          ))}
        </>
      )}
    </SectionCard>
  );

  return (
    <>
      {/* Section navigator */}
      <div style={{ position: "sticky", top: "60px", zIndex: 49, background: "#2c2e50", padding: "8px 16px", display: "flex", flexWrap: "wrap", gap: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
        {(isAi ? SECTION_NAV_AI : isMobile ? SECTION_NAV_MOBILE : isEcommerce ? SECTION_NAV_ECOMMERCE : isWebDev ? SECTION_NAV_WEBDEV : isStaffAug ? SECTION_NAV_STAFFAUG : isDevops ? SECTION_NAV_DEVOPS : isDt ? SECTION_NAV_DT : SECTION_NAV).map((s) => (
          <a key={s.id} href={`#${s.id}`} style={{ background: "rgba(255,255,255,0.1)", color: "#e8ecf4", borderRadius: "4px", padding: "4px 10px", fontSize: "11px", fontWeight: 500, textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(163,177,138,0.35)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          >{s.label}</a>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="row">
        {/* ── Core ── */}
        <SectionCard id="sec-core" title="Core Information" accentColor="#4b4d7c">
          <div className="col-lg-4">
            <div className="my_profile_setting_input form-group">
              <label>Title</label>
              <input type="text" className="form-control" value={form.title} onChange={handleTitle} placeholder="e.g. Software Development" />
              {error.title && <span className="text-danger">{error.title}</span>}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="my_profile_setting_input form-group">
              <label>Slug (URL) — renders at /services/&lt;slug&gt;</label>
              <input type="text" className="form-control" value={form.slug} onChange={handleSlug} placeholder="e.g. software-development" />
              {error.slug && <span className="text-danger">{error.slug}</span>}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="my_profile_setting_input form-group">
              <label>Template (layout)</label>
              <select className="form-control" value={form.template} onChange={(e) => setTop("template", e.target.value)}>
                {TEMPLATES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
              </select>
            </div>
          </div>
        </SectionCard>

        {/* ── Hero ── */}
        <SectionCard id="sec-hero" title="Hero" accentColor="#3c3e66" {...toggle("hero")}>
          {form.hero.show && (
            <>
              {/* Digital Transformation takes the whole headline in one field.
                  Its three-tone treatment is a styling rule, not an editorial
                  one, so the page derives the split instead of asking an editor
                  to pre-chop the line into parts. */}
              {isDt ? (
                <>
                  {secText("hero", "heading", "Heading", "Digital Transformation Company", "col-lg-12")}
                  <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
                    Type the headline as one line. The <strong>first and last words</strong> are coloured and everything between them is white &mdash; &ldquo;Digital <em>Transformation</em> Company&rdquo; &mdash; so there is nothing to split up by hand.
                  </div>
                </>
              ) : (
                <>
                  {isMad
                    ? secText("hero", "heading", "Heading (coloured part — shown first)", isAi ? "Artificial Intelligence" : isEcommerce ? "Ecommerce Development Company That Builds" : isDevops ? "Cloud and DevOps" : "Mobile App Development")
                    : secText("hero", "heading", "Heading (lead)", "Building Scalable,")}
                  {isMad
                    ? secText("hero", "headingAccent", "Heading tail (normal text)", isAi ? "Development Company" : isEcommerce ? "Revenue Infrastructure" : "Company")
                    : secText("hero", "headingAccent", "Heading accent (coloured part)", "Human-Centered Solutions")}
                </>
              )}
              {paragraphBlock("hero", "paragraphs", "Intro Paragraphs")}
              {secText("hero", "cta1Text", "Primary CTA text", "Get Free Consultation", "col-lg-3")}
              {secText("hero", "cta1Link", "Primary CTA link", "/contact-us", "col-lg-3")}
              {secText("hero", "cta2Text", "Secondary CTA text", "View Our Work", "col-lg-3")}
              {secText("hero", "cta2Link", "Secondary CTA link", "/case-study", "col-lg-3")}

              {/* Hero image upload — AI hero is a CSS chip diagram, Ecommerce hero
                  is a fixed glow graphic; neither takes an uploaded image */}
              {!isAi && !isEcommerce && !isWebDev && !isStaffAug && !isDevops && !isDt && (
              <div className="col-lg-12">
                <div className="my_profile_setting_input form-group">
                  <label>Hero Image <small style={{ color: "#888" }}>(right column visual · falls back to default if not set)</small></label>
                  <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div className="wrap-custom-file" style={{ height: 200, width: 340, flexShrink: 0 }}>
                      <input
                        type="file"
                        id="hero-image-upload"
                        accept="image/*"
                        onChange={handleHeroImageUpload}
                      />
                      <label
                        htmlFor="hero-image-upload"
                        style={form.hero.heroImage ? {
                          backgroundImage: `url(${(process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")}/${(form.hero.heroImage || "").replace(/^\//, "")})`,
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                        } : {}}
                      >
                        <span><i className="flaticon-download"></i> {form.hero.heroImage ? "Change Image" : "Upload Image"}</span>
                      </label>
                    </div>
                    <div style={{ width: 280 }}>
                      <div className="my_profile_setting_input form-group">
                        <label style={{ fontSize: 13 }}>Image Alt Text <small style={{ color: "#888" }}>(auto-filled from filename)</small></label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.hero.heroImageAlt || ""}
                          onChange={(e) => setSec("hero", "heroImageAlt", e.target.value)}
                          placeholder="e.g. Software development dashboard"
                        />
                      </div>
                      {form.hero.heroImage && (
                        <button
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, hero: { ...p.hero, heroImage: "", heroImageAlt: "" } }))}
                          style={{ border: "1px solid #f0c0c0", background: "#fff5f5", color: "#c44", padding: "4px 12px", borderRadius: 4, fontSize: 12, cursor: "pointer" }}
                        >
                          × Remove image (revert to default)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* AI template hero uses trust badges; Ecommerce hero's stats bar and
                  its 3 floating metric cards are fixed design elements — no editor
                  is shown for them; other templates use stats */}
              {isEcommerce ? (
                <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#474972" }}>
                  The stats bar (4.9 Google Rating, 97% Retention, etc.) and the three floating metric cards on the right are fixed design elements and are not editable here.
                </div>
              ) : isAi ? (
                <>
                  <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Trust badges</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("hero", "badges", emptyBadge)}>+ Add Badge</button></div>
                  {(form.hero.badges || []).map((b, i) => (
                    <div className="col-12" key={i}>
                      <StepCard index={i} label="Badge" {...dnd("hero", "badges", i)} onRemove={() => removeArr("hero", "badges", i)}>
                        <div className="col-xl-2"><IconPicker value={b.icon} onChange={(v) => setArr("hero", "badges", i, "icon", v)} /></div>
                        <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={b.title} onChange={(e) => setArr("hero", "badges", i, "title", e.target.value)} placeholder="AI-First Since 2023" /></div></div>
                        <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Subtitle (optional)</label><input type="text" className="form-control" value={b.subtitle || ""} onChange={(e) => setArr("hero", "badges", i, "subtitle", e.target.value)} placeholder="Build locally, shipped globally" /></div></div>
                      </StepCard>
                    </div>
                  ))}
                </>
              ) : isWebDev ? (
                <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#474972" }}>
                  This hero has no stats bar of its own — the 4-stat strip (Google Rating, Client Retention, etc.) is a separate, fixed design element below and is not editable here.
                </div>
              ) : isStaffAug ? (
                <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#474972" }}>
                  This hero is centred with <strong>no image</strong>, and the 4-stat strip below it (4.9 Google Rating, 97% Client Retention, 180+ Clients Served, 15+ Industries Served) is a <strong>fixed</strong> design element. Neither is editable here — set the heading, body and the two CTAs above.
                </div>
              ) : isDt ? (
                <>
                  <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
                    The hero artwork is a <strong>fixed</strong> design element (the core-pillar render), so there is no image upload. The 4-stat strip takes its values and labels from here &mdash; only the <strong>first four</strong> render, and the dividers between them are positional.
                  </div>
                  <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Stats bar</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("hero", "stats", emptyStat)}>+ Add Stat</button></div>
                  {(form.hero.stats || []).map((st, i) => (
                    <div className="col-12" key={i}>
                      <StepCard index={i} label="Stat" {...dnd("hero", "stats", i)} onRemove={() => removeArr("hero", "stats", i)}>
                        <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Value</label><input type="text" className="form-control" value={st.value || ""} onChange={(e) => setArr("hero", "stats", i, "value", e.target.value)} placeholder="4.9" /></div></div>
                        <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Label</label><input type="text" className="form-control" value={st.label || ""} onChange={(e) => setArr("hero", "stats", i, "label", e.target.value)} placeholder="Google Rating" /></div></div>
                      </StepCard>
                    </div>
                  ))}
                </>
              ) : isDevops ? (
                <>
                  <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
                    The hero artwork is a <strong>fixed</strong> design element (the particle handshake), so there is no image upload. The 4-stat strip below it takes its values and labels from here, but each <strong>icon is fixed by position</strong> (star, users, briefcase, rocket) because they are exported Figma marks — so only the first four stats render.
                  </div>
                  <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Stats bar</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("hero", "stats", emptyStat)}>+ Add Stat</button></div>
                  {(form.hero.stats || []).map((s, i) => (
                    <div className="col-12" key={i}>
                      <StepCard index={i} label="Stat" {...dnd("hero", "stats", i)} onRemove={() => removeArr("hero", "stats", i)}>
                        <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Value</label><input type="text" className="form-control" value={s.value} onChange={(e) => setArr("hero", "stats", i, "value", e.target.value)} placeholder="4.9" /></div></div>
                        <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Label</label><input type="text" className="form-control" value={s.label} onChange={(e) => setArr("hero", "stats", i, "label", e.target.value)} placeholder="Google Rating" /></div></div>
                      </StepCard>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Stats bar</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("hero", "stats", emptyStat)}>+ Add Stat</button></div>
                  {(form.hero.stats || []).map((s, i) => (
                    <div className="col-12" key={i}>
                      <StepCard index={i} label="Stat" {...dnd("hero", "stats", i)} onRemove={() => removeArr("hero", "stats", i)}>
                        {!isMobile && <div className="col-xl-4"><IconPicker value={s.icon} onChange={(v) => setArr("hero", "stats", i, "icon", v)} /></div>}
                        <div className={isMobile ? "col-xl-6" : "col-xl-4"}><div className="my_profile_setting_input form-group"><label>Value</label><input type="text" className="form-control" value={s.value} onChange={(e) => setArr("hero", "stats", i, "value", e.target.value)} placeholder="4.9" /></div></div>
                        <div className={isMobile ? "col-xl-6" : "col-xl-4"}><div className="my_profile_setting_input form-group"><label>Label</label><input type="text" className="form-control" value={s.label} onChange={(e) => setArr("hero", "stats", i, "label", e.target.value)} placeholder="Google Rating" /></div></div>
                      </StepCard>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </SectionCard>

        {/* ── Why Now (Web Development only) ── */}
        {isWebDev && renderWhyNow()}
        {isStaffAug && renderHiringGap()}

        {/* ── Intro (mobile) / Why Custom (software-dev) / Platform Problem (ecommerce) ── */}
        {isMobile && renderIntro()}
        {isAi && renderGap()}
        {isEcommerce && renderPlatformProblem()}
        {/* Services (AI dedicated — the carousel cards, stored in process.steps) */}
        {isAi && renderAiServicesCard()}
        {!isMobile && !isAi && !isEcommerce && !isWebDev && !isStaffAug && !isDevops && !isDt && (
        <SectionCard id="sec-whycustom" title="Why Custom Software" accentColor="#2c2e50" {...toggle("whyCustom")} badge={form.whyCustom.features.length}>
          {form.whyCustom.show && (
            <>
              {secText("whyCustom", "heading", "Heading (lead)", "Why Businesses Are Moving Toward")}
              {secText("whyCustom", "headingAccent", "Heading accent", "Custom Software Development")}
              {paragraphBlock("whyCustom", "paragraphs", "Left-column Paragraphs")}
              {secText("whyCustom", "rightTitle", "Right-column intro line", "What custom software delivers that off-the-shelf tools cannot", "col-lg-12")}

              <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Feature cards (right column)</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("whyCustom", "features", emptyIconCard)}>+ Add Feature</button></div>
              {(form.whyCustom.features || []).map((c, i) => (
                <div className="col-12" key={i}>
                  <StepCard index={i} label="Feature" {...dnd("whyCustom", "features", i)} onRemove={() => removeArr("whyCustom", "features", i)}>
                    <div className="col-xl-3"><IconPicker value={c.icon} onChange={(v) => setArr("whyCustom", "features", i, "icon", v)} /></div>
                    <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title} onChange={(e) => setArr("whyCustom", "features", i, "title", e.target.value)} /></div></div>
                    <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Description</label><textarea className="form-control" rows={3} value={c.desc} onChange={(e) => setArr("whyCustom", "features", i, "desc", e.target.value)} /></div></div>
                  </StepCard>
                </div>
              ))}
</>
          )}
        </SectionCard>
        )}

        {!isAi && !isEcommerce && !isWebDev && !isStaffAug && !isDevops && !isDt && (
        <SectionCard id="sec-services" title="Services" accentColor="#3c3e66" {...toggle("services")} badge={form.services.items.length}>
          {form.services.show && (
            <>
              {secText("services", "heading", "Heading (lead)", isMobile ? "Our Mobile App Development" : "Our")}
              {secText("services", "headingAccent", "Heading accent", isMobile ? "Process" : "Software Development")}
              {secTextarea("services", "intro", "Intro", "We offer a comprehensive range of services...", 2)}
              {isMobile ? renderMobileProcess() : iconCardBlock("services", "items", "Service", "+ Add Service")}
            </>
          )}
        </SectionCard>
        )}

        {/* ── Services (Web Development orbit cards — title+desc only, no icon) ── */}
        {isWebDev && renderWebServices()}
        {isStaffAug && renderStaffServices()}
        {isStaffAug && renderCapabilitiesGrid()}
        {isStaffAug && renderModelFit()}

        {/* ── Cloud & DevOps bespoke sections, in live page order ── */}
        {isDt && renderDtProblem()}
        {isDt && renderDtServices()}
        {isDt && renderDtCapabilities()}
        {isDt && renderDtScope()}
        {isDt && renderDtCost()}
        {isDt && renderDtTrends()}
        {isDt && renderDtIndustries()}
        {isDt && renderDtProcess()}

        {isDevops && renderDevopsBottleneck()}
        {isDevops && renderDevopsServices()}
        {isDevops && renderDevopsCapabilities()}
        {isDevops && renderDevopsEngagementFit()}
        {isDevops && renderDevopsCost()}
        {isDevops && renderDevopsOutlook()}

        {isEcommerce && renderEcommerceServices()}
        {(isEcommerce || isWebDev) && renderCommerceEngineering()}

        {/* ── Capabilities + AI Trends + Industries (AI only) ── */}
        {isAi && renderCapabilities()}
        {/* Trends — AI's "AI Trends" tab, Ecommerce's "Trends" tab and Web Development's
            "Trends" tab all share the same generic heading/headingAccent/intro/
            items[icon,title,desc] shape. */}
        {(isAi || isEcommerce || isWebDev || isStaffAug) && renderTrends()}
        {isAi && renderIndustries()}

        {isEcommerce && renderEcommercePlatforms()}
        {/* Industries (ecommerce position — right after Ecommerce Platforms; Web
            Development has no Ecommerce Platforms section, so it goes straight here) ── */}
        {(isEcommerce || isWebDev || isStaffAug || isDevops) && renderIndustries()}

        {/* ── Solutions (software-dev only) ── */}
        {!isMobile && !isAi && !isEcommerce && !isWebDev && !isStaffAug && !isDevops && !isDt && (
        <SectionCard id="sec-solutions" title="Solutions" accentColor="#2c2e50" {...toggle("solutions")} badge={form.solutions.items.length}>
          {form.solutions.show && (
            <>
              {secText("solutions", "heading", "Heading accent (coloured part)", "Software Solutions")}
              {secText("solutions", "headingAccent", "Heading tail (dark part)", "We Build")}
              {iconCardBlock("solutions", "items", "Solution", "+ Add Solution")}
            </>
          )}
        </SectionCard>
        )}

        {/* ── AI (software-dev only) ── */}
        {!isMobile && !isAi && !isEcommerce && !isWebDev && !isStaffAug && !isDevops && !isDt && (
        <SectionCard id="sec-ai" title="AI Integration" accentColor="#3c3e66" {...toggle("ai")} badge={form.ai.items.length}>
          {form.ai.show && (
            <>
              {secText("ai", "heading", "Heading (lead)", "AI Integration in", "col-lg-4")}
              {secText("ai", "headingAccent", "Heading accent", "Every Software", "col-lg-4")}
              {secText("ai", "headingTail", "Heading tail", "We Build", "col-lg-4")}
              {paragraphBlock("ai", "paragraphs", "Left-column Paragraphs")}
              {iconCardBlock("ai", "items", "Capability", "+ Add Capability")}
            </>
          )}
        </SectionCard>
        )}

        {/* ── Technologies (Tech Stack — mobile + AI) ── */}
        {isMad && renderTechnologies()}
        {/* Why Choose — mobile shows it here; AI shows it after Case Studies */}
        {isMobile && renderWhyChoose()}

        {/* ── Industries (software-dev position; mobile renders it after Case Studies) ── */}
        {!isMobile && !isAi && !isEcommerce && !isWebDev && !isStaffAug && !isDevops && !isDt && renderIndustries()}

        {/* ── Tech Stack (software-dev only) ── */}
        {!isMobile && !isAi && !isEcommerce && !isWebDev && !isStaffAug && !isDevops && !isDt && (
        <SectionCard id="sec-techstack" title="Tech Stack" accentColor="#3c3e66" {...toggle("techStack")}>
          {form.techStack.show && (
            <>
              <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
                Tech categories and pills are static. Only the heading and subtitle can be overridden here.
              </div>
              {secText("techStack", "heading", "Heading (leave blank for default)", 'Built with <span>Best-in-Class</span> Technologies')}
              {secTextarea("techStack", "subtitle", "Subtitle / description", "We work across the full modern stack...", 3)}
            </>
          )}
        </SectionCard>
        )}

        {/* ── Process (software-dev + mobile; AI uses its own dedicated card) ──
            On the Mobile template this `process` section holds the dark-snake
            SERVICE CARDS (stored in process.steps) and is edited with the snake
            editor; software-dev keeps the standard step editor. ── */}
        {!isAi && !isEcommerce && !isWebDev && !isStaffAug && !isDevops && !isDt && (
        <SectionCard id="sec-process" title="Process" accentColor="#3c3e66" {...toggle("process")} badge={form.process.steps.length}>
          {form.process.show && (
            <>
              {secText("process", "heading", "Heading (lead)", isMobile ? "Custom Mobile App Development" : "Our Software Development")}
              {secText("process", "headingAccent", "Heading accent", isMobile ? "Services" : "Process")}
              {secTextarea("process", "intro", "Intro", "A structured, agile process is what makes predictable software...", 2)}
              {isMobile ? renderMobileServices() : (
                <>
                  <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Steps</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("process", "steps", emptyIconCard)}>+ Add Step</button></div>
                  {(form.process.steps || []).map((c, i) => (
                    <div className="col-12" key={i}>
                      <StepCard index={i} label="Step" {...dnd("process", "steps", i)} onRemove={() => removeArr("process", "steps", i)}>
                        <div className="col-xl-3"><IconPicker value={c.icon} onChange={(v) => setArr("process", "steps", i, "icon", v)} /></div>
                        <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title} onChange={(e) => setArr("process", "steps", i, "title", e.target.value)} /></div></div>
                        <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Description</label><textarea className="form-control" rows={3} value={c.desc} onChange={(e) => setArr("process", "steps", i, "desc", e.target.value)} /></div></div>
                      </StepCard>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </SectionCard>
        )}

        {/* ── Process (AI dedicated — the dark-snake stages, stored in services.items) ── */}
        {isAi && renderAiProcessCard()}

        {/* ── Process (Ecommerce + Web Development — MadProcess timeline, shared ecommerceProcess key) ── */}
        {(isEcommerce || isWebDev || isStaffAug || isDevops) && renderEcommerceProcess()}

        {/* ── Engagement Models (mobile + AI + ecommerce + web development) ── */}
        {isMad && renderEngagement()}

        {/* ── Case Studies (select existing) ── */}
        <SectionCard id="sec-casestudies" title="Case Studies" accentColor="#2c2e50" {...toggle("caseStudies")} badge={form.caseStudies.items.length}>
          {form.caseStudies.show && (
            <>
              <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
                Select existing case studies to feature. All card data (title, description, image, challenges, what we built, metrics, link) is fetched automatically from the case study detail page.
              </div>
              {secText("caseStudies", "heading", "Heading (lead)", "Work That")}
              {secText("caseStudies", "headingAccent", "Heading accent", "Speaks For Itself")}
              {secTextarea("caseStudies", "intro", "Intro", "Every project we take on is a business problem before it is a technical one.", 2)}
              <div className="col-lg-12">
                <div style={{ fontWeight: 600, marginBottom: 6, color: "#2c2e50" }}>
                  Selected case studies <span style={{ fontWeight: 400, fontSize: 12, color: "#9a9bb8" }}>(pick up to 3)</span>
                </div>
                {[0, 1, 2].map((i) => {
                  const selected = form.caseStudies.items?.[i]?.ref ?? "";
                  const usedSlugs = (form.caseStudies.items || []).map((c) => c.ref).filter((s, idx) => s && idx !== i);
                  return (
                    <div key={i} className="my_profile_setting_input form-group" style={{ marginBottom: 10 }}>
                      <label style={{ fontSize: 12, color: "#6e6f8a" }}>Case Study {i + 1}</label>
                      <select
                        className="form-control"
                        value={selected}
                        onChange={(e) => {
                          const next = [...(form.caseStudies.items || [{ ref: "" }, { ref: "" }, { ref: "" }])];
                          while (next.length < 3) next.push({ ref: "" });
                          next[i] = { ref: e.target.value };
                          setSec("caseStudies", "items", next);
                        }}
                      >
                        <option value="">— None —</option>
                        {caseStudyOptions.filter((o) => !usedSlugs.includes(o.slug)).map((o) => (
                          <option key={o.slug} value={o.slug}>{o.title}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </SectionCard>

        {/* ── Why Choose (AI + Ecommerce + Web Development position — after Case Studies, matching the live page) ── */}
        {(isAi || isEcommerce || isWebDev || isStaffAug || isDevops || isDt) && renderWhyChoose()}

        {/* ── Testimonials (shared — after Case Studies; not used on the Ecommerce
            or Cloud & DevOps live pages) ── */}
        {!isEcommerce && !isDevops && !isDt && renderTestimonials()}

        {/* ── Industries (mobile position — after Case Studies; AI shows it after AI Trends) ── */}
        {isMobile && renderIndustries()}

        {/* ── Why Akoode (software-dev only) ── */}
        {!isMobile && !isAi && !isEcommerce && !isWebDev && !isStaffAug && !isDevops && !isDt && (
        <SectionCard id="sec-whyakoode" title="Why Akoode" accentColor="#3c3e66" {...toggle("whyAkoode")} badge={form.whyAkoode.cards.length}>
          {form.whyAkoode.show && (
            <>
              <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
                The awards / recognition logos row stays as the existing static assets — edit the heading, cards, and award captions here.
              </div>
              {secText("whyAkoode", "heading", "Heading (lead)", "Why Software Teams")}
              {secText("whyAkoode", "headingAccent", "Heading accent", "Choose Akoode")}
              {secTextarea("whyAkoode", "subtitle", "Subtitle", "Built for product engineering. Backed by proven results across 15 industries.", 2)}

              {iconCardBlock("whyAkoode", "cards", "Card", "+ Add Card", false)}
            </>
          )}
        </SectionCard>
        )}

        {/* ── Blogs ── */}
        <SectionCard id="sec-blogs" title="Blogs" accentColor="#3c3e66" {...toggle("blogs")}>
          {form.blogs.show && (
            <>
              <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
                Choose up to 3 blogs to feature in this section. The card layout and styling are fixed — only heading, subtext, and blog selection are editable.
              </div>
              {secText("blogs", "heading", "Heading (lead)", "Insights &")}
              {secText("blogs", "headingAccent", "Heading accent", "Resources")}
              {secTextarea("blogs", "intro", "Subtext", "Explore our latest thinking on software development, technology trends, and best practices.", 2)}
              <div className="col-lg-12">
                <div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Blog Slots (max 3)</div>
              </div>
              {[0, 1, 2].map((i) => {
                const blogItems = form.blogs.items || [];
                const selected = blogItems[i]?.ref || "";
                const usedSlugs = [0, 1, 2].filter((j) => j !== i).map((j) => blogItems[j]?.ref || "").filter(Boolean);
                return (
                  <div className="col-lg-4" key={i}>
                    <div className="my_profile_setting_input form-group">
                      <label>Blog {i + 1}</label>
                      <select
                        className="form-control"
                        value={selected}
                        onChange={(e) => {
                          const next = [...(form.blogs.items || [{ ref: "" }, { ref: "" }, { ref: "" }])];
                          while (next.length < 3) next.push({ ref: "" });
                          next[i] = { ref: e.target.value };
                          setSec("blogs", "items", next);
                        }}
                      >
                        <option value="">— None —</option>
                        {blogOptions.filter((o) => !usedSlugs.includes(o.slug)).map((o) => (
                          <option key={o.slug} value={o.slug}>{o.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </SectionCard>

        {/* ── FAQ ── */}
        <SectionCard id="sec-faq" title="FAQ" accentColor="#2c2e50" {...toggle("faq")} badge={form.faq.items.length}>
          {form.faq.show && (
            <>
              {secText("faq", "heading", "Heading (lead)", "Everything teams")}
              {secText("faq", "headingAccent", "Heading accent", "ask us first.")}
              {secTextarea("faq", "intro", "Intro", "Straight answers on timelines, team shape, security...", 2)}
              <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Questions</div><button type="button" className="btn admore_btn mb20" onClick={() => addArr("faq", "items", emptyFaq)}>+ Add Question</button></div>
              {(form.faq.items || []).map((c, i) => (
                <div className="col-12" key={i}>
                  <StepCard index={i} label="Q" {...dnd("faq", "items", i)} onRemove={() => removeArr("faq", "items", i)}>
                    <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Question</label><textarea className="form-control" rows={3} value={c.q} onChange={(e) => setArr("faq", "items", i, "q", e.target.value)} /></div></div>
                    <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Answer</label><textarea className="form-control" rows={3} value={c.a} onChange={(e) => setArr("faq", "items", i, "a", e.target.value)} /></div></div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* ── Final CTA ── */}
        <SectionCard id="sec-finalcta" title="Final CTA" accentColor="#3c3e66" {...toggle("finalCta")}>
          {form.finalCta.show && (
            <>
              <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
                The enquiry form, layout and styling stay exactly as they are — only the eyebrow, heading and subtext are editable.
              </div>
              {secText("finalCta", "eyebrow", "Eyebrow (small tag)", "Start Your Project", "col-lg-6")}
              {secText("finalCta", "heading", "Heading (lead)", "Start Your", "col-lg-3")}
              {secText("finalCta", "headingAccent", "Heading accent", "AI Development", "col-lg-3")}
              {secTextarea("finalCta", "subtitle", "Subtext", "Send your brief and someone from Akoode will respond within one business day.", 3)}
            </>
          )}
        </SectionCard>

        {/* ── Meta ── */}
        <SectionCard id="sec-meta" title="Meta (SEO)" accentColor="#4b4d7c">
          {secText("meta", "title", "Meta Title", "", "col-lg-12")}
          {secTextarea("meta", "description", "Meta Description", "Short SEO description for this page", 3)}
        </SectionCard>

        {/* ── Sticky Submit Bar ──────────────────────────────────────────────── */}
        <div style={{ position: "sticky", bottom: 0, zIndex: 99, background: "#fff", borderTop: "1px solid #e4e4f0", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, boxShadow: "0 -2px 10px rgba(75,77,124,0.1)", marginTop: "8px", width: "100%" }}>
          <button type="button" className="btn btn1" onClick={() => router.push("/thebusinesshub/updated-services")}>← Back</button>
          {error.general && <span className="text-danger">{error.general}</span>}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <select
              className="form-control"
              style={{ width: 130, height: 40 }}
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
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
                document.querySelector("form")?.requestSubmit();
              }}
            >
              Save as Draft
            </button>
            <button
              type="button"
              className="btn btn1"
              disabled={isSubmitting || !form.slug}
              onClick={() => {
                // Preview must open the SAME origin the admin runs on, because that
                // origin's backend is where the draft was just saved. Using
                // NEXT_PUBLIC_SITE_URL (production) opened akoode.com and rendered
                // stale/absent production data instead of the draft just saved.
                const siteUrl = window.location.origin;
                const secret = process.env.NEXT_PUBLIC_PREVIEW_SECRET || "";
                window.open(`${siteUrl}/services/${form.slug}?preview=${secret}`, "_blank");
              }}
            >
              Preview
            </button>
            <button type="submit" className="btn btn2" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

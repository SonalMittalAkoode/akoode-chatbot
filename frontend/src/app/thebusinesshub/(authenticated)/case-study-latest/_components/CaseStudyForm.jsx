"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  addCaseStudyLatestAPI,
  updateCaseStudyLatestAPI,
  getCSLById,
} from "@/api/caseStudyLatest";
import SectionCard from "../../services/_components/SectionCard";
import StepCard from "../../services/_components/StepCard";
import IconPicker from "@/components/admin/IconPicker";
import UploadWithAlt from "@/components/admin/UploadWithAlt";
import HtmlEditor from "@/components/HtmlEditor";
import { fileNameToAlt } from "@/utils/imageAlt";
import { STANDARD_TYPES } from "@/config/caseStudyCategories";
import DocxImportPanel from "@/components/admin/DocxImportPanel";
import { importCaseStudyLatestDocxAPI } from "@/api/docxImport";

// ── asset url helper (for previewing existing uploaded images on edit) ──
const buildAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL || ""}${path}`;
};

// ── section navigator (anchors) — labels mirror the frontend components ──
const SECTION_NAV = [
  { id: "sec-core", label: "Core" },
  { id: "sec-hero", label: "Hero" },
  { id: "sec-rethinking", label: "About the Client" },
  { id: "sec-challenges", label: "The Problem" },
  { id: "sec-build", label: "Project Objectives" },
  { id: "sec-pipeline", label: "The Solution" },
  { id: "sec-powerful", label: "Core Features" },
  { id: "sec-techstack", label: "Tech Stack" },
  { id: "sec-keychallenges", label: "Engineering Challenges" },
  { id: "sec-whatchanged", label: "Results & Impact" },
  { id: "sec-analytics", label: "Use cases" },
  { id: "sec-whychoose", label: "Why Akoode" },
  { id: "sec-finalcta", label: "Final CTA" },
  { id: "sec-meta", label: "Meta" },
];

// ── DOCX import: section checklist shown in the import dialog. Keys match
// backend/services/docxImporter/index.js CASE_STUDY_SECTIONS. ──
const DOCX_SECTIONS = [
  "hero", "rethinking", "challenges", "build", "pipeline", "powerful",
  "techStack", "keyChallenges", "whatChanged", "analytics", "whyChoose",
  "finalCta", "meta",
];
const DOCX_SECTION_LABELS = {
  hero: "Hero",
  rethinking: "About the Client",
  challenges: "The Problem",
  build: "Project Objectives",
  pipeline: "The Solution",
  powerful: "Core Features",
  techStack: "Tech Stack",
  keyChallenges: "Engineering Challenges",
  whatChanged: "Results & Impact",
  analytics: "Use cases",
  whyChoose: "Why Akoode",
  finalCta: "Final CTA",
  meta: "Meta",
};

// ── empty item factories ──
const emptyChip = () => ({ label: "", value: "", link: "", services: [] });
const emptyStat = () => ({ value: "", title: "", sub: "" });
const emptyProjectInfo = () => ({ icon: "", label: "", value: "" });
const emptyIconCard = () => ({ icon: "", title: "", desc: "" });
const emptyBuildCard = () => ({ n: "", title: "", desc: "" });
const emptyFeature = () => ({ tag: "", title: "", desc: "", bullets: [""], media: "", mediaAlt: "", mediaType: "image", embedCode: "", mediaFile: null, mediaPreview: "" });
const emptyTechCat = () => ({ icon: "", title: "", desc: "", pills: [{ label: "", img: "" }] });

// Available tech-stack logos (public/tech_stacks) — shown as a dropdown so the
// admin can pick a logo instead of typing its path.
const TECH_LOGOS = [
  "FastAPI.svg", "Ionic.svg", "Pinecone.svg", "angular-icon.svg", "anthropic.svg",
  "apple_objectivec.svg", "aws-dynamodb.svg", "aws.svg", "azure.svg", "clickhouse.svg",
  "django.svg", "docker.svg", "elasticsearch.svg", "expo.svg", "express-js.svg",
  "firebase.svg", "flutter.svg", "github_actions.svg", "go.svg", "google-cloud.svg",
  "graphql.svg", "huggingface.svg", "jenkins.svg", "kotlin.svg", "kubernetes.svg",
  "langchain.svg", "laravel.svg", "llamaindex.svg", "mongodb.svg", "mysql.svg",
  "nextjs.svg", "node-js.svg", "ollama-icon.svg", "openai.svg", "owasp.svg",
  "postgresql.svg", "python.svg", "pytorch.svg", "react.svg", "redis.svg",
  "redux.svg", "rest-api.svg", "scikit-learn.svg", "spring.svg", "storybook.svg",
  "supabase.svg", "swift.svg", "tailwind.svg", "tensor_flow.svg", "terraform.svg",
  "typescript.svg", "vue-js.svg", "webpack-icon.svg", "x_code.svg",
].map((file) => ({
  file,
  path: `/tech_stacks/${file}`,
  label: file
    .replace(/\.svg$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()),
}));
const emptyKeyCard = () => ({ icon: "", title: "", problem: "", approach: "", stat: "" });
const emptyColumn = () => ({ label: "", cards: [{ icon: "", title: "", desc: "" }] });
const emptyResultStat = () => ({ icon: "", value: "", label: "", desc: "" });

const INITIAL = {
  title: "", slug: "", keywords: "",
  // hero
  heroShow: true, heroHeading: "", heroHeadingAccent: "", heroBody: "",
  heroImageAlt: "",
  listingImageAlt: "",
  metaChips: [],
  heroFloatingCards: [
    { label: "Top Speed", value: "28.4", unit: "km/h" },
    { label: "Distance", value: "7.82", unit: "km" },
    { label: "Possession Time", value: "3.6", unit: "sec" },
  ],
  // rethinking
  rethinkingShow: false, rethinkingHeading: "", rethinkingHeadingAccent: "", rethinkingBody: "",
  rethinkingCtaText: "", rethinkingCtaLink: "", projectInfoTitle: "Project Info",
  stats: [], projectInfo: [],
  // challenges
  challengesShow: false, challengesHeading: "", challengesHeadingAccent: "", challengesIntro: "",
  challengeCards: [], challengesQuote: "",
  // build
  buildShow: false, buildHeading: "", buildHeadingAccent: "", buildIntro: "", buildCards: [],
  // pipeline
  pipelineShow: false, pipelineHeading: "", pipelineHeadingAccent: "", pipelineIntro: "", pipelineSteps: [],
  // powerful
  powerfulShow: false, powerfulHeading: "", powerfulHeadingAccent: "", features: [],
  // techStack
  techStackShow: false, techStackHeading: "", techStackHeadingAccent: "", techStackIntro: "",
  techCats: [], techStackCtaText: "", techStackCtaLink: "",
  // keyChallenges
  keyChallengesShow: false, keyChallengesHeading: "", keyChallengesHeadingAccent: "", keyChallengesIntro: "",
  hubImageAlt: "", hubBadge: "AI-Powered System", keyCards: [],
  keyChallengesCtaText: "", keyChallengesCtaLink: "",
  // whatChanged
  whatChangedShow: false, whatChangedHeading: "", whatChangedHeadingAccent: "", whatChangedIntro: "",
  changeColumns: [], resultStats: [],
  // analytics
  analyticsShow: false, analyticsHeading: "", analyticsHeadingAccent: "", analyticsIntro: "",
  analyticsItems: [],
  // whyChoose
  whyChooseShow: false, whyChooseHeading: "", whyChooseHeadingAccent: "", whyChooseIntro: "", whyChooseCards: [],
  // finalCta (heading + subtext only; rest of the CTA is static)
  finalCtaHeading: "", finalCtaSubtitle: "",
  // meta
  metaTitle: "", metaDescription: "",
};

const toSlug = (v) =>
  v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function CaseStudyForm() {
  const router = useRouter();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState(INITIAL);
  const [statusValue, setStatusValue] = useState("draft");
  const [slugEdited, setSlugEdited] = useState(false);
  // The slug the case study had when this edit session loaded. If the slug is
  // changed on save, we use this to purge the OLD path's ISR cache so the old
  // URL stops resolving immediately (otherwise it serves stale for ~1h).
  const originalSlugRef = useRef("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});
  const [services, setServices] = useState([]); // navbar services for the Services chip dropdown
  const [industryOptions, setIndustryOptions] = useState([]); // {name, slug} — live list for the Industry chip dropdown + auto-linking

  // fetch the same services the navbar uses (for the "Services" meta chip dropdown)
  useEffect(() => {
    const BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "").replace(/\/$/, "");
    fetch(`${BASE}/api/services`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!Array.isArray(data)) return;
        const opts = data
          .map((s) => ({
            slug: s.slug,
            label: String(s.project || s.title || "").replace(/<[^>]*>/g, "").trim(),
            link: s.slug ? `/services/${s.slug}` : "",
          }))
          .filter((o) => o.label && o.link);
        setServices(opts);
      })
      .catch(() => {});
  }, []);

  // Fetch the live Industries list for the "Industry" chip dropdown + auto-link.
  // Was previously a hardcoded 15-name list matched against a separate name→slug
  // map — any text mismatch (casing, punctuation) silently dropped the link, and
  // newly added industries never appeared. Now the dropdown IS the live list, and
  // the slug is taken directly from the chosen option, so the link can't drift.
  useEffect(() => {
    const BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "").replace(/\/$/, "");
    fetch(`${BASE}/api/industry?limit=20`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => {
        const items = data?.items || data?.data || [];
        if (!Array.isArray(items)) return;
        const opts = items
          .filter((ind) => ind.name && ind.slug)
          .map((ind) => ({ name: ind.name.trim(), slug: ind.slug }));
        setIndustryOptions(opts);
      })
      .catch(() => {});
  }, []);

  // images
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState("");
  const [heroImageExisting, setHeroImageExisting] = useState("");
  const [listingImageFile, setListingImageFile] = useState(null);
  const [listingImagePreview, setListingImagePreview] = useState("");
  const [listingImageExisting, setListingImageExisting] = useState("");
  const [hubImageFile, setHubImageFile] = useState(null);
  const [hubImagePreview, setHubImagePreview] = useState("");
  const [hubImageExisting, setHubImageExisting] = useState("");

  // ── drag-to-reorder (StepCard handle) ──
  const dragState = useRef({ key: null, from: null });
  const dnd = (key, index) => ({
    draggableHandle: true,
    onHandleDragStart: () => { dragState.current = { key, from: index }; },
    onCardDragOver: (e) => e.preventDefault(),
    onCardDrop: () => {
      const { key: k, from } = dragState.current;
      if (k !== key || from === null || from === index) return;
      setForm((p) => {
        const arr = [...p[key]];
        const [moved] = arr.splice(from, 1);
        arr.splice(index, 0, moved);
        return { ...p, [key]: arr };
      });
      dragState.current = { key: null, from: null };
    },
  });

  // ── state helpers ──
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const addItem = (k, empty) => setForm((p) => ({ ...p, [k]: [...p[k], empty()] }));
  const removeItem = (k, i) => setForm((p) => ({ ...p, [k]: p[k].filter((_, idx) => idx !== i) }));
  const setItem = (k, i, field, v) =>
    setForm((p) => ({ ...p, [k]: p[k].map((it, idx) => (idx === i ? { ...it, [field]: v } : it)) }));
  // nested string array (feature bullets)
  const addSub = (k, i, sub, empty) =>
    setForm((p) => ({ ...p, [k]: p[k].map((it, idx) => (idx === i ? { ...it, [sub]: [...(it[sub] || []), empty] } : it)) }));
  const removeSub = (k, i, sub, j) =>
    setForm((p) => ({ ...p, [k]: p[k].map((it, idx) => (idx === i ? { ...it, [sub]: it[sub].filter((_, x) => x !== j) } : it)) }));
  const setSub = (k, i, sub, j, v) =>
    setForm((p) => ({ ...p, [k]: p[k].map((it, idx) => { if (idx !== i) return it; const arr = [...it[sub]]; arr[j] = v; return { ...it, [sub]: arr }; }) }));
  // nested object array (techCat pills, column cards)
  const addSubObj = (k, i, sub, empty) =>
    setForm((p) => ({ ...p, [k]: p[k].map((it, idx) => (idx === i ? { ...it, [sub]: [...(it[sub] || []), empty] } : it)) }));
  const removeSubObj = (k, i, sub, j) =>
    setForm((p) => ({ ...p, [k]: p[k].map((it, idx) => (idx === i ? { ...it, [sub]: it[sub].filter((_, x) => x !== j) } : it)) }));
  const setSubObj = (k, i, sub, j, field, v) =>
    setForm((p) => ({ ...p, [k]: p[k].map((it, idx) => { if (idx !== i) return it; const arr = [...it[sub]]; arr[j] = { ...arr[j], [field]: v }; return { ...it, [sub]: arr }; }) }));

  // toggle a service in a "Services" meta chip's multi-select list
  const toggleChipService = (i, svc) =>
    setForm((p) => ({
      ...p,
      metaChips: p.metaChips.map((m, idx) => {
        if (idx !== i) return m;
        const list = m.services || [];
        const exists = list.some((x) => x.link === svc.link);
        const next = exists
          ? list.filter((x) => x.link !== svc.link)
          : [...list, { name: svc.label, link: svc.link }];
        return { ...m, services: next, value: next.map((x) => x.name).join(", "), link: "" };
      }),
    }));

  // ── core handlers ──
  const handleTitle = (e) => {
    const val = e.target.value;
    set("title", val);
    if (!slugEdited) set("slug", toSlug(val));
  };
  const handleSlug = (e) => { set("slug", e.target.value); setSlugEdited(true); };

  // ── field render helpers (functions returning JSX — safe, intrinsic types) ──
  const text = (label, k, placeholder = "", col = "col-lg-6") => (
    <div className={col}>
      <div className="my_profile_setting_input form-group">
        <label>{label}</label>
        <input type="text" className="form-control" value={form[k] ?? ""} onChange={(e) => set(k, e.target.value)} placeholder={placeholder} />
      </div>
    </div>
  );
  const editor = (label, k, col = "col-lg-12") => (
    <div className={col}>
      <div className="my_profile_setting_input form-group">
        <label>{label}</label>
        <HtmlEditor value={form[k] ?? ""} onChange={(v) => set(k, v)} />
      </div>
    </div>
  );

  // ── load on edit ──
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getCSLById(id);
        const d = res?.data ?? res;
        if (!d) return;
        const merged = { ...INITIAL };
        merged.title = d.title ?? ""; merged.slug = d.slug ?? ""; merged.keywords = d.keywords ?? "";
        originalSlugRef.current = d.slug ?? "";
        setSlugEdited(true);
        setStatusValue(d.status === true ? "active" : d.isDraft ? "draft" : "inactive");

        const sec = (obj, keys) => keys.forEach((k) => { if (obj && obj[k.src] !== undefined) merged[k.dst] = obj[k.src]; });

        const hero = d.hero || {};
        merged.heroShow = hero.show !== false;
        merged.heroHeading = hero.heading ?? ""; merged.heroHeadingAccent = hero.headingAccent ?? "";
        merged.heroBody = hero.body ?? ""; merged.heroImageAlt = hero.heroImageAlt ?? "";
        merged.listingImageAlt = hero.listingImageAlt ?? "";
        merged.metaChips = hero.metaChips || [];
        merged.heroFloatingCards = hero.floatingCards?.length ? hero.floatingCards : INITIAL.heroFloatingCards;
        setHeroImageExisting(hero.heroImage ?? ""); setHeroImagePreview(buildAssetUrl(hero.heroImage ?? ""));
        setListingImageExisting(hero.listingImage ?? ""); setListingImagePreview(buildAssetUrl(hero.listingImage ?? ""));

        const r = d.rethinking || {};
        merged.rethinkingShow = !!r.show; merged.rethinkingHeading = r.heading ?? ""; merged.rethinkingHeadingAccent = r.headingAccent ?? "";
        merged.rethinkingBody = r.body ?? ""; merged.rethinkingCtaText = r.ctaText ?? ""; merged.rethinkingCtaLink = r.ctaLink ?? "";
        merged.projectInfoTitle = r.projectInfoTitle ?? "Project Info"; merged.stats = r.stats || []; merged.projectInfo = r.projectInfo || [];

        const c = d.challenges || {};
        merged.challengesShow = !!c.show; merged.challengesHeading = c.heading ?? ""; merged.challengesHeadingAccent = c.headingAccent ?? "";
        merged.challengesIntro = c.intro ?? ""; merged.challengeCards = c.cards || []; merged.challengesQuote = c.quote ?? "";

        const b = d.build || {};
        merged.buildShow = !!b.show; merged.buildHeading = b.heading ?? ""; merged.buildHeadingAccent = b.headingAccent ?? "";
        merged.buildIntro = b.intro ?? ""; merged.buildCards = b.cards || [];

        const p = d.pipeline || {};
        merged.pipelineShow = !!p.show; merged.pipelineHeading = p.heading ?? ""; merged.pipelineHeadingAccent = p.headingAccent ?? "";
        merged.pipelineIntro = p.intro ?? ""; merged.pipelineSteps = p.steps || [];

        const pw = d.powerful || {};
        merged.powerfulShow = !!pw.show; merged.powerfulHeading = pw.heading ?? ""; merged.powerfulHeadingAccent = pw.headingAccent ?? "";
        merged.features = (pw.features || []).map((ft) => ({
          ...ft,
          bullets: ft.bullets?.length ? ft.bullets : [""],
          mediaType: ft.mediaType || "image",
          mediaAlt: ft.mediaAlt || "",
          embedCode: ft.embedCode || "",
          mediaFile: null,
          mediaPreview: buildAssetUrl(ft.media || ""),
        }));

        const ts = d.techStack || {};
        merged.techStackShow = !!ts.show; merged.techStackHeading = ts.heading ?? ""; merged.techStackHeadingAccent = ts.headingAccent ?? "";
        merged.techStackIntro = ts.intro ?? ""; merged.techCats = (ts.cats || []).map((cat) => ({ ...cat, pills: cat.pills?.length ? cat.pills : [{ label: "", img: "" }] }));
        merged.techStackCtaText = ts.ctaText ?? ""; merged.techStackCtaLink = ts.ctaLink ?? "";

        const kc = d.keyChallenges || {};
        merged.keyChallengesShow = !!kc.show; merged.keyChallengesHeading = kc.heading ?? ""; merged.keyChallengesHeadingAccent = kc.headingAccent ?? "";
        merged.keyChallengesIntro = kc.intro ?? ""; merged.hubImageAlt = kc.hubImageAlt ?? ""; merged.hubBadge = kc.hubBadge ?? "AI-Powered System";
        merged.keyCards = kc.cards || [];
        merged.keyChallengesCtaText = kc.ctaText ?? ""; merged.keyChallengesCtaLink = kc.ctaLink ?? "";
        setHubImageExisting(kc.hubImage ?? ""); setHubImagePreview(buildAssetUrl(kc.hubImage ?? ""));

        const wc = d.whatChanged || {};
        merged.whatChangedShow = !!wc.show; merged.whatChangedHeading = wc.heading ?? ""; merged.whatChangedHeadingAccent = wc.headingAccent ?? "";
        merged.whatChangedIntro = wc.intro ?? "";
        merged.changeColumns = (wc.columns || []).map((col) => ({ ...col, cards: col.cards?.length ? col.cards : [{ icon: "", title: "", desc: "" }] }));
        merged.resultStats = wc.resultStats || [];

        const an = d.analytics || {};
        merged.analyticsShow = !!an.show; merged.analyticsHeading = an.heading ?? ""; merged.analyticsHeadingAccent = an.headingAccent ?? "";
        merged.analyticsIntro = an.intro ?? ""; merged.analyticsItems = an.items || [];

        const wch = d.whyChoose || {};
        merged.whyChooseShow = !!wch.show; merged.whyChooseHeading = wch.heading ?? ""; merged.whyChooseHeadingAccent = wch.headingAccent ?? "";
        merged.whyChooseIntro = wch.intro ?? ""; merged.whyChooseCards = wch.cards || [];

        merged.finalCtaHeading = d.finalCta?.heading ?? ""; merged.finalCtaSubtitle = d.finalCta?.subtitle ?? "";

        merged.metaTitle = d.meta?.title ?? ""; merged.metaDescription = d.meta?.description ?? "";

        setForm(merged);
      } catch (err) {
        toast.error(err.message || "Failed to load entry");
      }
    })();
  }, [id]);

  // ── image uploads ──
  const uploadHero = (e) => {
    const file = e.target.files[0];
    setHeroImageFile(file || null);
    setHeroImagePreview(file ? URL.createObjectURL(file) : buildAssetUrl(heroImageExisting));
    if (file && !form.heroImageAlt) set("heroImageAlt", fileNameToAlt(file.name));
  };
  const uploadListing = (e) => {
    const file = e.target.files[0];
    setListingImageFile(file || null);
    setListingImagePreview(file ? URL.createObjectURL(file) : buildAssetUrl(listingImageExisting));
    if (file && !form.listingImageAlt) set("listingImageAlt", fileNameToAlt(file.name));
  };
  const uploadHub = (e) => {
    const file = e.target.files[0];
    setHubImageFile(file || null);
    setHubImagePreview(file ? URL.createObjectURL(file) : buildAssetUrl(hubImageExisting));
    if (file && !form.hubImageAlt) set("hubImageAlt", fileNameToAlt(file.name));
  };

  // per-feature media (image OR video)
  const onFeatureMedia = (i, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isVideo = (file.type || "").startsWith("video");
    setForm((p) => ({
      ...p,
      features: p.features.map((it, idx) =>
        idx === i
          ? {
              ...it,
              mediaFile: file,
              mediaPreview: URL.createObjectURL(file),
              mediaType: isVideo ? "video" : "image",
              mediaAlt: it.mediaAlt || fileNameToAlt(file.name),
            }
          : it
      ),
    }));
  };
  const removeFeatureMedia = (i) =>
    setForm((p) => ({
      ...p,
      features: p.features.map((it, idx) =>
        idx === i ? { ...it, mediaFile: null, mediaPreview: "", media: "" } : it
      ),
    }));

  // Feature media picker — first feature allows image / video / embed,
  // every other feature is image-only.
  const featureMediaField = (ft, i) => {
    const allowEmbed = i === 0;
    const mode = ft.mediaType || "image";
    const accept = "image/*";
    const modes = allowEmbed ? ["image", "embed"] : ["image"];
    return (
      <div className="col-xl-12">
        <div className="my_profile_setting_input form-group">
          <label>Media {allowEmbed ? "(image or embed code)" : "(image only)"}</label>

          {allowEmbed && (
            <div className="d-flex gap-2 mb-2" style={{ flexWrap: "wrap" }}>
              {modes.map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setItem("features", i, "mediaType", m)}
                    style={{
                      padding: "5px 16px", borderRadius: 6, border: "1px solid #4b4d7c",
                      background: active ? "#4b4d7c" : "#fff", color: active ? "#fff" : "#4b4d7c",
                      fontSize: 13, fontWeight: 600, textTransform: "capitalize", cursor: "pointer",
                    }}
                  >
                    {m === "embed" ? "Embed code" : m}
                  </button>
                );
              })}
            </div>
          )}

          {mode !== "embed" && (
            <div className="my_profile_setting_input form-group" style={{ marginBottom: 10 }}>
              <label htmlFor={`feat-alt-${i}`} style={{ fontSize: 13 }}>Alt Text</label>
              <input
                id={`feat-alt-${i}`}
                type="text"
                className="form-control"
                value={ft.mediaAlt || ""}
                onChange={(e) => setItem("features", i, "mediaAlt", e.target.value)}
                placeholder="Describe the image (auto-filled from filename)"
              />
            </div>
          )}

          {mode === "embed" ? (
            <>
              <textarea
                className="form-control"
                rows={4}
                value={ft.embedCode || ""}
                onChange={(e) => setItem("features", i, "embedCode", e.target.value)}
                placeholder="Paste an embed code (e.g. <iframe ...></iframe>) or a video URL"
              />
              {ft.embedCode && (
                <div
                  style={{ marginTop: 10, border: "1px solid #e0e0f0", borderRadius: 8, padding: 8, maxWidth: 360, overflow: "hidden" }}
                  dangerouslySetInnerHTML={{ __html: ft.embedCode }}
                />
              )}
            </>
          ) : (
            <div className="d-flex align-items-center flex-wrap gap-3">
              <div className="wrap-custom-file height-150" style={{ width: 220 }}>
                <input type="file" id={`feat-media-${i}`} accept={accept} onChange={(e) => onFeatureMedia(i, e)} />
                <label
                  htmlFor={`feat-media-${i}`}
                  style={ft.mediaPreview && ft.mediaType === "image" ? { backgroundImage: `url(${ft.mediaPreview})` } : {}}
                >
                  <span><i className="flaticon-download"></i> {ft.mediaPreview ? "Change" : "Upload"}</span>
                </label>
              </div>
              {ft.mediaPreview && (
                <button type="button" className="btn" style={{ color: "#ff5a5f", border: "1px solid #ff5a5f", padding: "4px 12px", height: 40 }} onClick={() => removeFeatureMedia(i)}>
                  Remove
                </button>
              )}
            </div>
          )}

          <small style={{ color: "#888", display: "block", marginTop: 6 }}>
            {allowEmbed
              ? "Upload an image (jpg/png/webp/svg), or paste an embed code / video URL (recommended for videos — YouTube, Vimeo, etc.)."
              : "Image only — jpg/png/webp/svg."}
          </small>
        </div>
      </div>
    );
  };

  // ── submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.slug.trim()) errs.slug = "Slug is required";
    if (Object.keys(errs).length) { setError(errs); toast.error("Please fix the highlighted fields"); return; }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      const status = statusValue === "active";
      const isDraft = statusValue === "draft";

      // simple scalar fields
      const scalarKeys = Object.keys(INITIAL).filter((k) => !Array.isArray(INITIAL[k]));
      scalarKeys.forEach((k) => fd.append(k, form[k] ?? ""));
      fd.append("status", status);
      fd.append("isDraft", isDraft);

      // images
      if (heroImageFile) fd.append("heroImage", heroImageFile);
      else if (heroImageExisting) fd.append("heroImageExisting", heroImageExisting);
      if (listingImageFile) fd.append("listingImage", listingImageFile);
      else if (listingImageExisting) fd.append("listingImageExisting", listingImageExisting);
      if (hubImageFile) fd.append("hubImage", hubImageFile);
      else if (hubImageExisting) fd.append("hubImageExisting", hubImageExisting);

      // list helpers
      const appendObjs = (name, arr, fields) =>
        arr.forEach((it, i) => fields.forEach((f) => fd.append(`${name}[${i}][${f}]`, it[f] ?? "")));

      form.metaChips.forEach((m, i) => {
        fd.append(`metaChips[${i}][label]`, m.label ?? "");
        fd.append(`metaChips[${i}][value]`, m.value ?? "");
        fd.append(`metaChips[${i}][link]`, m.link ?? "");
        (m.services || []).forEach((s, j) => {
          fd.append(`metaChips[${i}][services][${j}][name]`, s.name ?? "");
          fd.append(`metaChips[${i}][services][${j}][link]`, s.link ?? "");
        });
      });
      appendObjs("heroFloatingCards", form.heroFloatingCards, ["label", "value", "unit"]);
      appendObjs("stats", form.stats, ["value", "title", "sub"]);
      appendObjs("projectInfo", form.projectInfo, ["icon", "label", "value"]);
      appendObjs("challengeCards", form.challengeCards, ["icon", "title", "desc"]);
      appendObjs("buildCards", form.buildCards, ["n", "title", "desc"]);
      appendObjs("pipelineSteps", form.pipelineSteps, ["n", "title", "desc"]);
      appendObjs("keyCards", form.keyCards, ["icon", "title", "problem", "approach", "stat"]);
      appendObjs("resultStats", form.resultStats, ["icon", "value", "label", "desc"]);
      appendObjs("analyticsItems", form.analyticsItems, ["icon", "title", "desc"]);
      appendObjs("whyChooseCards", form.whyChooseCards, ["icon", "title", "desc"]);

      // features (with nested bullets + image/video/embed media)
      form.features.forEach((ft, i) => {
        ["tag", "title", "desc", "mediaAlt"].forEach((f) => fd.append(`features[${i}][${f}]`, ft[f] ?? ""));
        (ft.bullets || []).forEach((b, j) => fd.append(`features[${i}][bullets][${j}]`, b ?? ""));
        fd.append(`features[${i}][mediaType]`, ft.mediaType ?? "image");
        if (ft.mediaType === "embed") {
          fd.append(`features[${i}][embedCode]`, ft.embedCode ?? "");
        } else if (ft.mediaFile) {
          fd.append(`featureMedia[${i}]`, ft.mediaFile);
        } else {
          fd.append(`features[${i}][media]`, ft.media ?? "");
        }
      });

      // techCats (with nested pills)
      form.techCats.forEach((cat, i) => {
        ["icon", "title", "desc"].forEach((f) => fd.append(`techCats[${i}][${f}]`, cat[f] ?? ""));
        (cat.pills || []).forEach((pl, j) => {
          fd.append(`techCats[${i}][pills][${j}][label]`, pl.label ?? "");
          fd.append(`techCats[${i}][pills][${j}][img]`, pl.img ?? "");
        });
      });

      // changeColumns (with nested cards)
      form.changeColumns.forEach((col, i) => {
        fd.append(`changeColumns[${i}][label]`, col.label ?? "");
        (col.cards || []).forEach((cd, j) => {
          ["icon", "title", "desc"].forEach((f) => fd.append(`changeColumns[${i}][cards][${j}][${f}]`, cd[f] ?? ""));
        });
      });

      const res = isEdit ? await updateCaseStudyLatestAPI(id, fd) : await addCaseStudyLatestAPI(fd);
      toast.success(res.message || (isEdit ? "Updated successfully" : "Created successfully"));
      setError({});

      // Bust the ISR cache so production reflects the change immediately.
      // On a slug rename also pass the previous slug so the OLD URL is purged
      // and stops resolving right away (it would otherwise serve stale ~1h).
      try {
        const oldSlug =
          isEdit && originalSlugRef.current && originalSlugRef.current !== form.slug
            ? originalSlugRef.current
            : undefined;
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "casestudy",
            slug: form.slug,
            ...(oldSlug && { oldSlug }),
            secret: process.env.NEXT_PUBLIC_PREVIEW_SECRET || "",
          }),
        });
      } catch { /* non-critical — page will self-heal within revalidate window */ }

      setTimeout(() => router.push("/thebusinesshub/case-study-latest"), 1200);
    } catch (err) {
      setError({ general: err.message || "Something went wrong" });
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── DOCX import ───────────────────────────────────────────
  // Maps the nested shape returned by the importer onto this form's flat
  // state. Images are never imported — only their alt text — so the existing
  // upload state is left exactly as it is.
  const populateFromDocx = (d) => {
    if (!d) return;
    const merged = { ...form };

    merged.title = d.title ?? "";
    merged.slug = d.slug ?? "";
    merged.keywords = d.keywords ?? "";

    const hero = d.hero || {};
    merged.heroShow = hero.show !== false;
    merged.heroHeading = hero.heading ?? "";
    merged.heroHeadingAccent = hero.headingAccent ?? "";
    merged.heroBody = hero.body ?? "";
    merged.heroImageAlt = hero.heroImageAlt ?? "";
    merged.listingImageAlt = hero.listingImageAlt ?? "";
    // The document carries chip values as plain text. Re-link them here against
    // the live services / industries lists the form already fetched, so the
    // Services checkboxes and the Industry link come back set wherever the
    // names match. Anything unmatched stays as text for the admin to fix.
    merged.metaChips = (hero.metaChips || []).map((chip) => {
      const label = String(chip.label || "").trim().toLowerCase();
      const names = String(chip.value || "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      if (label === "services") {
        const picked = names
          .map((name) => services.find((sv) => sv.label.toLowerCase() === name.toLowerCase()))
          .filter(Boolean)
          .map((sv) => ({ name: sv.label, link: sv.link }));
        return picked.length
          ? { ...chip, services: picked, value: picked.map((x) => x.name).join(", "), link: "" }
          : { ...chip, services: [] };
      }
      if (label === "industry") {
        const opt = industryOptions.find(
          (o) => o.name.toLowerCase() === String(chip.value || "").trim().toLowerCase()
        );
        return { ...chip, link: opt ? `/industries/${opt.slug}` : "" };
      }
      return chip;
    });
    if (hero.floatingCards?.length) merged.heroFloatingCards = hero.floatingCards;

    const r = d.rethinking || {};
    merged.rethinkingShow = !!r.show;
    merged.rethinkingHeading = r.heading ?? ""; merged.rethinkingHeadingAccent = r.headingAccent ?? "";
    merged.rethinkingBody = r.body ?? ""; merged.rethinkingCtaText = r.ctaText ?? ""; merged.rethinkingCtaLink = r.ctaLink ?? "";
    merged.projectInfoTitle = r.projectInfoTitle || "Project Info";
    merged.stats = r.stats || []; merged.projectInfo = r.projectInfo || [];

    const c = d.challenges || {};
    merged.challengesShow = !!c.show;
    merged.challengesHeading = c.heading ?? ""; merged.challengesHeadingAccent = c.headingAccent ?? "";
    merged.challengesIntro = c.intro ?? ""; merged.challengeCards = c.cards || []; merged.challengesQuote = c.quote ?? "";

    const b = d.build || {};
    merged.buildShow = !!b.show;
    merged.buildHeading = b.heading ?? ""; merged.buildHeadingAccent = b.headingAccent ?? "";
    merged.buildIntro = b.intro ?? ""; merged.buildCards = b.cards || [];

    const p = d.pipeline || {};
    merged.pipelineShow = !!p.show;
    merged.pipelineHeading = p.heading ?? ""; merged.pipelineHeadingAccent = p.headingAccent ?? "";
    merged.pipelineIntro = p.intro ?? ""; merged.pipelineSteps = p.steps || [];

    const pw = d.powerful || {};
    merged.powerfulShow = !!pw.show;
    merged.powerfulHeading = pw.heading ?? ""; merged.powerfulHeadingAccent = pw.headingAccent ?? "";
    merged.features = (pw.features || []).map((ft) => ({
      ...ft,
      bullets: ft.bullets?.length ? ft.bullets : [""],
      mediaType: ft.mediaType || "image",
      mediaAlt: ft.mediaAlt || "",
      embedCode: ft.embedCode || "",
      media: "",
      mediaFile: null,
      mediaPreview: "",
    }));

    const ts = d.techStack || {};
    merged.techStackShow = !!ts.show;
    merged.techStackHeading = ts.heading ?? ""; merged.techStackHeadingAccent = ts.headingAccent ?? "";
    merged.techStackIntro = ts.intro ?? "";
    merged.techCats = (ts.cats || []).map((cat) => ({
      ...cat,
      pills: cat.pills?.length ? cat.pills : [{ label: "", img: "" }],
    }));
    merged.techStackCtaText = ts.ctaText ?? ""; merged.techStackCtaLink = ts.ctaLink ?? "";

    const kc = d.keyChallenges || {};
    merged.keyChallengesShow = !!kc.show;
    merged.keyChallengesHeading = kc.heading ?? ""; merged.keyChallengesHeadingAccent = kc.headingAccent ?? "";
    merged.keyChallengesIntro = kc.intro ?? "";
    merged.hubImageAlt = kc.hubImageAlt ?? "";
    merged.hubBadge = kc.hubBadge || "AI-Powered System";
    merged.keyCards = kc.cards || [];
    merged.keyChallengesCtaText = kc.ctaText ?? ""; merged.keyChallengesCtaLink = kc.ctaLink ?? "";

    const wc = d.whatChanged || {};
    merged.whatChangedShow = !!wc.show;
    merged.whatChangedHeading = wc.heading ?? ""; merged.whatChangedHeadingAccent = wc.headingAccent ?? "";
    merged.whatChangedIntro = wc.intro ?? "";
    merged.changeColumns = (wc.columns || []).map((col) => ({
      ...col,
      cards: col.cards?.length ? col.cards : [{ icon: "", title: "", desc: "" }],
    }));
    merged.resultStats = wc.resultStats || [];

    const an = d.analytics || {};
    merged.analyticsShow = !!an.show;
    merged.analyticsHeading = an.heading ?? ""; merged.analyticsHeadingAccent = an.headingAccent ?? "";
    merged.analyticsIntro = an.intro ?? ""; merged.analyticsItems = an.items || [];

    const wch = d.whyChoose || {};
    merged.whyChooseShow = !!wch.show;
    merged.whyChooseHeading = wch.heading ?? ""; merged.whyChooseHeadingAccent = wch.headingAccent ?? "";
    merged.whyChooseIntro = wch.intro ?? ""; merged.whyChooseCards = wch.cards || [];

    merged.finalCtaHeading = d.finalCta?.heading ?? ""; merged.finalCtaSubtitle = d.finalCta?.subtitle ?? "";
    merged.metaTitle = d.meta?.title ?? ""; merged.metaDescription = d.meta?.description ?? "";

    // The slug came from the document, so typing in Title must not overwrite it.
    setSlugEdited(true);
    setError({});
    setForm(merged);
  };

  const hasImportableData = Boolean(
    form.title || form.heroHeading || form.rethinkingHeading || form.features.length
  );

  // shorthand toggle prop builder
  const toggle = (key) => ({ toggleId: key, toggleName: key, enabled: form[key], onToggle: (e) => set(key, e.target.checked) });

  return (
    <>
      {/* Section navigator */}
      <div style={{ position: "sticky", top: "60px", zIndex: 49, background: "#2c2e50", padding: "8px 16px", display: "flex", flexWrap: "wrap", gap: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
        {SECTION_NAV.map((s) => (
          <a key={s.id} href={`#${s.id}`} style={{ background: "rgba(255,255,255,0.1)", color: "#e8ecf4", borderRadius: "4px", padding: "4px 10px", fontSize: "11px", fontWeight: 500, textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(163,177,138,0.35)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          >{s.label}</a>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="row">
        <DocxImportPanel
          importFn={importCaseStudyLatestDocxAPI}
          onPopulate={populateFromDocx}
          hasExistingData={hasImportableData}
          sections={DOCX_SECTIONS}
          sectionLabels={DOCX_SECTION_LABELS}
          requireTemplate={false}
        />

        {/* ── Core ── */}
        <SectionCard id="sec-core" title="Core Information" accentColor="#4b4d7c">
          <div className="col-lg-6">
            <div className="my_profile_setting_input form-group">
              <label>Title</label>
              <input type="text" className="form-control" value={form.title} onChange={handleTitle} placeholder="e.g. Performance Tracking System Using Computer Vision" />
              {error.title && <span className="text-danger">{error.title}</span>}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="my_profile_setting_input form-group">
              <label>Slug (URL)</label>
              <input type="text" className="form-control" value={form.slug} onChange={handleSlug} placeholder="e.g. performance-tracking-system" />
              {error.slug && <span className="text-danger">{error.slug}</span>}
            </div>
          </div>
        </SectionCard>

        {/* ── HeroSection ── */}
        <SectionCard id="sec-hero" title="Hero" accentColor="#3c3e66" {...toggle("heroShow")}>
          {form.heroShow && (
            <>
              {text("Heading (lead)", "heroHeading", "Performance Tracking System Using")}
              {text("Heading accent (colored part)", "heroHeadingAccent", "Computer Vision")}
              {editor("Body / subtitle", "heroBody")}

              <div className="col-lg-4">
                <div style={{ fontWeight: 600, marginBottom: 6, color: "#484848" }}>Hero Image (right side)</div>
                <UploadWithAlt altId="csl-hero-alt" altLabel="Alt Text" altValue={form.heroImageAlt} altOnChange={(v) => set("heroImageAlt", v)} altPlaceholder="Describe the hero image" hasFile={!!heroImagePreview} onRemove={() => { setHeroImageFile(null); setHeroImageExisting(""); setHeroImagePreview(""); }}>
                  <div className="wrap-custom-file height-150">
                    <input type="file" id="csl-hero-img" accept="image/*" onChange={uploadHero} />
                    <label style={heroImagePreview ? { backgroundImage: `url(${heroImagePreview})` } : {}} htmlFor="csl-hero-img">
                      <span><i className="flaticon-download"></i> Upload</span>
                    </label>
                  </div>
                </UploadWithAlt>
              </div>

              <div className="col-lg-4">
                <div style={{ fontWeight: 600, marginBottom: 6, color: "#484848" }}>Listing Image (Case studies page)</div>
                <UploadWithAlt altId="csl-listing-alt" altLabel="Alt Text" altValue={form.listingImageAlt} altOnChange={(v) => set("listingImageAlt", v)} altPlaceholder="Describe the listing image" hasFile={!!listingImagePreview} onRemove={() => { setListingImageFile(null); setListingImageExisting(""); setListingImagePreview(""); }}>
                  <div className="wrap-custom-file height-150">
                    <input type="file" id="csl-listing-img" accept="image/*" onChange={uploadListing} />
                    <label style={listingImagePreview ? { backgroundImage: `url(${listingImagePreview})` } : {}} htmlFor="csl-listing-img">
                      <span><i className="flaticon-download"></i> Upload</span>
                    </label>
                  </div>
                </UploadWithAlt>
              </div>

              <div className="col-lg-12">
                <div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Meta Chips</div>
                <button type="button" className="btn admore_btn mb20" onClick={() => addItem("metaChips", emptyChip)}>+ Add Chip</button>
              </div>
              {form.metaChips.map((m, i) => (
                <div className="col-12" key={i}>
                  <StepCard index={i} label="Chip" {...dnd("metaChips", i)} onRemove={() => removeItem("metaChips", i)}>
                    <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Label</label><input type="text" className="form-control" value={m.label} onChange={(e) => setItem("metaChips", i, "label", e.target.value)} placeholder="e.g. Industry" /></div></div>
                    <div className="col-xl-7">
                      <div className="my_profile_setting_input form-group">
                        <label>Value{String(m.label || "").trim().toLowerCase() === "services" ? <span style={{ fontSize: 11, color: "#888" }}> — pick one or more services ({(m.services || []).length} selected)</span> : String(m.label || "").trim().toLowerCase() === "type" ? <span style={{ fontSize: 11, color: "#888" }}> — pick one or more category types</span> : null}</label>
                        {String(m.label || "").trim().toLowerCase() === "industry" ? (
                          <select
                            className="form-control"
                            value={m.value}
                            onChange={(e) => {
                              const val = e.target.value;
                              const opt = industryOptions.find((o) => o.name === val);
                              setForm((p) => ({
                                ...p,
                                metaChips: p.metaChips.map((chip, idx) =>
                                  idx === i ? { ...chip, value: val, link: opt ? `/industries/${opt.slug}` : "" } : chip
                                ),
                              }));
                            }}
                          >
                            <option value="">— Select Industry —</option>
                            {industryOptions.map((ind) => (
                              <option key={ind.slug} value={ind.name}>{ind.name}</option>
                            ))}
                          </select>
                        ) : String(m.label || "").trim().toLowerCase() === "services" ? (
                          <div style={{ border: "1px solid #dde2f3", borderRadius: 8, padding: 10, maxHeight: 190, overflowY: "auto", background: "#fbfbff" }}>
                            {services.length === 0 ? (
                              <div style={{ fontSize: 12, color: "#888" }}>Loading services…</div>
                            ) : (
                              services.map((s) => {
                                const checked = (m.services || []).some((x) => x.link === s.link);
                                return (
                                  <label key={s.link} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", cursor: "pointer", fontSize: 13, margin: 0 }}>
                                    <input type="checkbox" checked={checked} onChange={() => toggleChipService(i, s)} style={{ width: 15, height: 15 }} />
                                    <span>{s.label}</span>
                                  </label>
                                );
                              })
                            )}
                          </div>
                        ) : String(m.label || "").trim().toLowerCase() === "type" ? (
                          <div style={{ border: "1px solid #dde2f3", borderRadius: 8, padding: 10, background: "#fbfbff" }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>
                              Select Category Types (Multiple allowed):
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: 8 }}>
                              {STANDARD_TYPES.map((t) => {
                                const selectedList = (m.value || "").split(",").map((s) => s.trim()).filter(Boolean);
                                const checked = selectedList.some((sel) => sel.toLowerCase() === t.toLowerCase());
                                return (
                                  <label
                                    key={t}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 6,
                                      padding: "4px 10px",
                                      borderRadius: 6,
                                      background: checked ? "#eef2ff" : "#fff",
                                      border: checked ? "1px solid #6366f1" : "1px solid #d1d5db",
                                      cursor: "pointer",
                                      fontSize: 13,
                                      margin: 0,
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => {
                                        let next;
                                        if (checked) {
                                          next = selectedList.filter((sel) => sel.toLowerCase() !== t.toLowerCase());
                                        } else {
                                          next = [...selectedList, t];
                                        }
                                        setItem("metaChips", i, "value", next.join(", "));
                                      }}
                                      style={{ width: 14, height: 14 }}
                                    />
                                    <span style={{ color: checked ? "#4338ca" : "#374151", fontWeight: checked ? 600 : 400 }}>{t}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <div>
                              <label style={{ fontSize: 11, color: "#666", marginBottom: 2, display: "block" }}>Custom or Comma-Separated Value:</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={m.value || ""}
                                onChange={(e) => setItem("metaChips", i, "value", e.target.value)}
                                placeholder="e.g. Artificial Intelligence, Mobile App Development"
                              />
                            </div>
                          </div>
                        ) : (
                          <input type="text" className="form-control" value={m.value} onChange={(e) => setItem("metaChips", i, "value", e.target.value)} placeholder="e.g. Sports Analytics" />
                        )}
                      </div>
                    </div>
                  </StepCard>
                </div>
              ))}

              {/* Floating insight cards over the hero image — fixed 3 positions */}
              <div className="col-lg-12">
                <div style={{ fontWeight: 600, marginBottom: 4, color: "#2c2e50" }}>Floating Insight Cards</div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>Three cards layered over the hero image. Positions are fixed — select an icon, then enter a heading and subtitle for each card.</div>
              </div>
              {form.heroFloatingCards.map((card, i) => (
                <div className="col-12" key={i}>
                  <StepCard index={i} label="Card">
                    <div className="col-xl-4">
                      <div className="my_profile_setting_input form-group">
                        <IconPicker
                          label="Icon"
                          value={card.unit}
                          onChange={(v) => setItem("heroFloatingCards", i, "unit", v)}
                        />
                      </div>
                    </div>
                    <div className="col-xl-4">
                      <div className="my_profile_setting_input form-group">
                        <label>Heading</label>
                        <input type="text" className="form-control" value={card.label} onChange={(e) => setItem("heroFloatingCards", i, "label", e.target.value)} placeholder="e.g. AI Player Tracking" />
                      </div>
                    </div>
                    <div className="col-xl-4">
                      <div className="my_profile_setting_input form-group">
                        <label>Text</label>
                        <textarea className="form-control" rows={3} value={card.value} onChange={(e) => setItem("heroFloatingCards", i, "value", e.target.value)} placeholder="e.g. Real-time detection and tracking of every player" />
                      </div>
                    </div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* ── RethinkingSection ── */}
        <SectionCard id="sec-rethinking" title="About the Client" accentColor="#2c2e50" {...toggle("rethinkingShow")} badge={form.stats.length + form.projectInfo.length}>
          {form.rethinkingShow && (
            <>
              {text("Heading (lead)", "rethinkingHeading", "Rethinking Performance ")}
              {text("Heading accent", "rethinkingHeadingAccent", "Analysis Modern Sports")}
              {editor("Body copy", "rethinkingBody")}
              {text("CTA Text", "rethinkingCtaText", "Start Your Project", "col-lg-6")}
              {text("CTA Link", "rethinkingCtaLink", "/post-requirement", "col-lg-6")}
              {text("Project Info card title", "projectInfoTitle", "Project Info", "col-lg-6")}

              <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Stats</div><button type="button" className="btn admore_btn mb20" onClick={() => addItem("stats", emptyStat)}>+ Add Stat</button></div>
              {form.stats.map((s, i) => (
                <div className="col-12" key={i}>
                  <StepCard index={i} label="Stat" {...dnd("stats", i)} onRemove={() => removeItem("stats", i)}>
                    <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Value</label><input type="text" className="form-control" value={s.value} onChange={(e) => setItem("stats", i, "value", e.target.value)} placeholder="94+" /></div></div>
                    <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={s.title} onChange={(e) => setItem("stats", i, "title", e.target.value)} placeholder="Hours / Week" /></div></div>
                    <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Sub</label><input type="text" className="form-control" value={s.sub} onChange={(e) => setItem("stats", i, "sub", e.target.value)} /></div></div>
                  </StepCard>
                </div>
              ))}

              <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Project Info items</div><button type="button" className="btn admore_btn mb20" onClick={() => addItem("projectInfo", emptyProjectInfo)}>+ Add Item</button></div>
              {form.projectInfo.map((pi, i) => (
                <div className="col-12" key={i}>
                  <StepCard index={i} label="Project Info" {...dnd("projectInfo", i)} onRemove={() => removeItem("projectInfo", i)}>
                    <div className="col-xl-3"><IconPicker value={pi.icon} onChange={(v) => setItem("projectInfo", i, "icon", v)} /></div>
                    <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Label</label><input type="text" className="form-control" value={pi.label} onChange={(e) => setItem("projectInfo", i, "label", e.target.value)} placeholder="Client" /></div></div>
                    <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Value</label><input type="text" className="form-control" value={pi.value} onChange={(e) => setItem("projectInfo", i, "value", e.target.value)} placeholder="Confidential" /></div></div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* ── ChallengesSection ── */}
        <SectionCard id="sec-challenges" title="The Problem" accentColor="#3c3e66" {...toggle("challengesShow")} badge={form.challengeCards.length}>
          {form.challengesShow && (
            <>
              {text("Heading (lead)", "challengesHeading", "What Challenges Do Sports Teams Face In ")}
              {text("Heading accent", "challengesHeadingAccent", "Performance Analysis?")}
              {editor("Intro", "challengesIntro")}
              <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Cards</div><button type="button" className="btn admore_btn mb20" onClick={() => addItem("challengeCards", emptyIconCard)}>+ Add Card</button></div>
              {form.challengeCards.map((c, i) => (
                <div className="col-12" key={i}>
                  <StepCard index={i} label="Card" {...dnd("challengeCards", i)} onRemove={() => removeItem("challengeCards", i)}>
                    <div className="col-xl-3"><IconPicker value={c.icon} onChange={(v) => setItem("challengeCards", i, "icon", v)} /></div>
                    <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title} onChange={(e) => setItem("challengeCards", i, "title", e.target.value)} /></div></div>
                    <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Description</label><HtmlEditor value={c.desc} onChange={(v) => setItem("challengeCards", i, "desc", v)} /></div></div>
                  </StepCard>
                </div>
              ))}
              {editor("Quote strip", "challengesQuote")}
            </>
          )}
        </SectionCard>

        {/* ── BuildSection ── */}
        <SectionCard id="sec-build" title="Project Objectives" accentColor="#2c2e50" {...toggle("buildShow")} badge={form.buildCards.length}>
          {form.buildShow && (
            <>
              {text("Heading (lead)", "buildHeading", "What We Set Out ")}
              {text("Heading accent", "buildHeadingAccent", "To Build")}
              {editor("Intro", "buildIntro")}
              <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Cards</div><button type="button" className="btn admore_btn mb20" onClick={() => addItem("buildCards", emptyBuildCard)}>+ Add Card</button></div>
              {form.buildCards.map((c, i) => (
                <div className="col-12" key={i}>
                  <StepCard index={i} label="Card" {...dnd("buildCards", i)} onRemove={() => removeItem("buildCards", i)}>
                    <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Number</label><input type="text" className="form-control" value={c.n} onChange={(e) => setItem("buildCards", i, "n", e.target.value)} placeholder="1" /></div></div>
                    <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title} onChange={(e) => setItem("buildCards", i, "title", e.target.value)} /></div></div>
                    <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Description</label><HtmlEditor value={c.desc} onChange={(v) => setItem("buildCards", i, "desc", v)} /></div></div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* ── PipelineSection ── */}
        <SectionCard id="sec-pipeline" title="The Solution" accentColor="#3c3e66" {...toggle("pipelineShow")} badge={form.pipelineSteps.length}>
          {form.pipelineShow && (
            <>
              {text("Heading (lead)", "pipelineHeading", "Turning Raw Footage Into ")}
              {text("Heading accent", "pipelineHeadingAccent", "Intelligent Insights")}
              {editor("Intro", "pipelineIntro")}
              <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Steps</div><button type="button" className="btn admore_btn mb20" onClick={() => addItem("pipelineSteps", emptyBuildCard)}>+ Add Step</button></div>
              {form.pipelineSteps.map((c, i) => (
                <div className="col-12" key={i}>
                  <StepCard index={i} label="Step" {...dnd("pipelineSteps", i)} onRemove={() => removeItem("pipelineSteps", i)}>
                    <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Number</label><input type="text" className="form-control" value={c.n} onChange={(e) => setItem("pipelineSteps", i, "n", e.target.value)} placeholder="1" /></div></div>
                    <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title} onChange={(e) => setItem("pipelineSteps", i, "title", e.target.value)} /></div></div>
                    <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Description</label><HtmlEditor value={c.desc} onChange={(v) => setItem("pipelineSteps", i, "desc", v)} /></div></div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* ── PowerfulSection ── */}
        <SectionCard id="sec-powerful" title="Core Features" accentColor="#2c2e50" {...toggle("powerfulShow")} badge={form.features.length}>
          {form.powerfulShow && (
            <>
              {text("Heading (lead)", "powerfulHeading", "What Makes This System ")}
              {text("Heading accent", "powerfulHeadingAccent", "Powerful")}
              <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Features</div><button type="button" className="btn admore_btn mb20" onClick={() => addItem("features", emptyFeature)}>+ Add Feature</button></div>
              {form.features.map((ft, i) => (
                <div className="col-12" key={i}>
                  <StepCard index={i} label="Feature" {...dnd("features", i)} onRemove={() => removeItem("features", i)}>
                    <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Tag</label><input type="text" className="form-control" value={ft.tag} onChange={(e) => setItem("features", i, "tag", e.target.value)} placeholder="FEATURE : 01" /></div></div>
                    <div className="col-xl-8"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={ft.title} onChange={(e) => setItem("features", i, "title", e.target.value)} /></div></div>
                    {featureMediaField(ft, i)}
                    <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Description</label><HtmlEditor value={ft.desc} onChange={(v) => setItem("features", i, "desc", v)} /></div></div>
                    <div className="col-xl-12">
                      <div style={{ fontWeight: 600, marginBottom: 6, color: "#4b4d7c" }}>Bullets</div>
                      {(ft.bullets || []).map((b, j) => (
                        <div key={j} className="d-flex gap-2 mb-2 align-items-center">
                          <input type="text" className="form-control" value={b} onChange={(e) => setSub("features", i, "bullets", j, e.target.value)} placeholder="Bullet point" />
                          <button type="button" className="btn" style={{ color: "#ff5a5f", border: "1px solid #ff5a5f", padding: "4px 10px" }} onClick={() => removeSub("features", i, "bullets", j)}>×</button>
                        </div>
                      ))}
                      <button type="button" className="btn admore_btn" onClick={() => addSub("features", i, "bullets", "")}>+ Add Bullet</button>
                    </div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* ── TechStackSection ── */}
        <SectionCard id="sec-techstack" title="Tech Stack" accentColor="#3c3e66" {...toggle("techStackShow")} badge={form.techCats.length}>
          {form.techStackShow && (
            <>
              {text("Heading (lead)", "techStackHeading", "Built With Advanced ")}
              {text("Heading accent", "techStackHeadingAccent", "AI Technologies")}
              {editor("Intro", "techStackIntro")}
              {text("CTA Text", "techStackCtaText", "Start Your Project", "col-lg-6")}
              {text("CTA Link", "techStackCtaLink", "/post-requirement", "col-lg-6")}
              <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Categories</div><button type="button" className="btn admore_btn mb20" onClick={() => addItem("techCats", emptyTechCat)}>+ Add Category</button></div>
              {form.techCats.map((cat, i) => (
                <div className="col-12" key={i}>
                  <StepCard index={i} label="Category" {...dnd("techCats", i)} onRemove={() => removeItem("techCats", i)}>
                    <div className="col-xl-3"><IconPicker value={cat.icon} onChange={(v) => setItem("techCats", i, "icon", v)} /></div>
                    <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={cat.title} onChange={(e) => setItem("techCats", i, "title", e.target.value)} /></div></div>
                    <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Description</label><HtmlEditor value={cat.desc} onChange={(v) => setItem("techCats", i, "desc", v)} /></div></div>
                    <div className="col-xl-12">
                      <div style={{ fontWeight: 600, marginBottom: 6, color: "#4b4d7c" }}>Pills (logo + label)</div>
                      {(cat.pills || []).map((pl, j) => (
                        <div key={j} className="d-flex gap-2 mb-2 align-items-center">
                          <input type="text" className="form-control" value={pl.label} onChange={(e) => setSubObj("techCats", i, "pills", j, "label", e.target.value)} placeholder="Label e.g. React" />
                          {pl.img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={pl.img} alt="" style={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0 }} />
                          ) : (
                            <span style={{ width: 32, height: 32, flexShrink: 0, border: "1px dashed #ccc", borderRadius: 6 }} />
                          )}
                          <select
                            className="form-control"
                            value={pl.img}
                            onChange={(e) => {
                              const path = e.target.value;
                              setSubObj("techCats", i, "pills", j, "img", path);
                              // auto-fill the label from the chosen logo when it's empty
                              const found = TECH_LOGOS.find((l) => l.path === path);
                              if (found && !String(pl.label || "").trim()) {
                                setSubObj("techCats", i, "pills", j, "label", found.label);
                              }
                            }}
                          >
                            <option value="">Select logo…</option>
                            {TECH_LOGOS.map((l) => (
                              <option key={l.path} value={l.path}>{l.label}</option>
                            ))}
                          </select>
                          <button type="button" className="btn" style={{ color: "#ff5a5f", border: "1px solid #ff5a5f", padding: "4px 10px" }} onClick={() => removeSubObj("techCats", i, "pills", j)}>×</button>
                        </div>
                      ))}
                      <button type="button" className="btn admore_btn" onClick={() => addSubObj("techCats", i, "pills", { label: "", img: "" })}>+ Add Pill</button>
                    </div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* ── KeyChallengesSection ── */}
        <SectionCard id="sec-keychallenges" title="Engineering Challenges" accentColor="#2c2e50" {...toggle("keyChallengesShow")} badge={form.keyCards.length}>
          {form.keyChallengesShow && (
            <>
              {text("Heading (lead)", "keyChallengesHeading", "Key Challenges & ")}
              {text("Heading accent", "keyChallengesHeadingAccent", "How We Solve Them")}
              {editor("Intro", "keyChallengesIntro")}
              {text("Hub badge text", "hubBadge", "AI-Powered System", "col-lg-4")}
              {text("CTA Text", "keyChallengesCtaText", "Let's Solve Your Challenges", "col-lg-4")}
              {text("CTA Link", "keyChallengesCtaLink", "/post-requirement", "col-lg-4")}

              <div className="col-lg-4">
                <div style={{ fontWeight: 600, marginBottom: 6, color: "#484848" }}>Hub (centre) Image</div>
                <UploadWithAlt altId="csl-hub-alt" altLabel="Alt Text" altValue={form.hubImageAlt} altOnChange={(v) => set("hubImageAlt", v)} altPlaceholder="Describe the hub image" hasFile={!!hubImagePreview} onRemove={() => { setHubImageFile(null); setHubImageExisting(""); setHubImagePreview(""); }}>
                  <div className="wrap-custom-file height-150">
                    <input type="file" id="csl-hub-img" accept="image/*" onChange={uploadHub} />
                    <label style={hubImagePreview ? { backgroundImage: `url(${hubImagePreview})` } : {}} htmlFor="csl-hub-img">
                      <span><i className="flaticon-download"></i> Upload</span>
                    </label>
                  </div>
                </UploadWithAlt>
              </div>

              <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Challenge Cards</div><button type="button" className="btn admore_btn mb20" onClick={() => addItem("keyCards", emptyKeyCard)}>+ Add Card</button></div>
              {form.keyCards.map((c, i) => (
                <div className="col-12" key={i}>
                  <StepCard index={i} label="Card" {...dnd("keyCards", i)} onRemove={() => removeItem("keyCards", i)}>
                    <div className="col-xl-3"><IconPicker value={c.icon} onChange={(v) => setItem("keyCards", i, "icon", v)} /></div>
                    <div className="col-xl-9"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title} onChange={(e) => setItem("keyCards", i, "title", e.target.value)} /></div></div>
                    <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Problem</label><HtmlEditor value={c.problem} onChange={(v) => setItem("keyCards", i, "problem", v)} /></div></div>
                    <div className="col-xl-6"><div className="my_profile_setting_input form-group"><label>Approach</label><HtmlEditor value={c.approach} onChange={(v) => setItem("keyCards", i, "approach", v)} /></div></div>
                    <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Stat pill text</label><input type="text" className="form-control" value={c.stat} onChange={(e) => setItem("keyCards", i, "stat", e.target.value)} placeholder="Real-time across 15 feeds" /></div></div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* ── WhatChangedSection ── */}
        <SectionCard id="sec-whatchanged" title="Results & Impact" accentColor="#3c3e66" {...toggle("whatChangedShow")} badge={form.changeColumns.length}>
          {form.whatChangedShow && (
            <>
              {text("Heading (lead)", "whatChangedHeading", "What Changed ")}
              {text("Heading accent", "whatChangedHeadingAccent", "After Implementation")}
              {editor("Intro", "whatChangedIntro")}
              <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Columns (BEFORE / OUR SOLUTION / AFTER)</div><button type="button" className="btn admore_btn mb20" onClick={() => addItem("changeColumns", emptyColumn)}>+ Add Column</button></div>
              {form.changeColumns.map((col, i) => (
                <div className="col-12" key={i}>
                  <StepCard index={i} label="Column" {...dnd("changeColumns", i)} onRemove={() => removeItem("changeColumns", i)}>
                    <div className="col-xl-12"><div className="my_profile_setting_input form-group"><label>Column label</label><input type="text" className="form-control" value={col.label} onChange={(e) => setItem("changeColumns", i, "label", e.target.value)} placeholder="BEFORE" /></div></div>
                    <div className="col-xl-12">
                      <div style={{ fontWeight: 600, marginBottom: 6, color: "#4b4d7c" }}>Cards</div>
                      {(col.cards || []).map((cd, j) => (
                        <div key={j} className="row" style={{ borderTop: "1px dashed #ddd", paddingTop: 10, marginBottom: 6 }}>
                          <div className="col-xl-3"><IconPicker value={cd.icon} onChange={(v) => setSubObj("changeColumns", i, "cards", j, "icon", v)} /></div>
                          <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={cd.title} onChange={(e) => setSubObj("changeColumns", i, "cards", j, "title", e.target.value)} /></div></div>
                          <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Description</label><HtmlEditor value={cd.desc} onChange={(v) => setSubObj("changeColumns", i, "cards", j, "desc", v)} /></div></div>
                          <div className="col-xl-1 d-flex align-items-center"><button type="button" className="btn" style={{ color: "#ff5a5f", border: "1px solid #ff5a5f", padding: "4px 10px" }} onClick={() => removeSubObj("changeColumns", i, "cards", j)}>×</button></div>
                        </div>
                      ))}
                      <button type="button" className="btn admore_btn mt10" onClick={() => addSubObj("changeColumns", i, "cards", { icon: "", title: "", desc: "" })}>+ Add Card</button>
                    </div>
                  </StepCard>
                </div>
              ))}

              <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Result stats strip</div><button type="button" className="btn admore_btn mb20" onClick={() => addItem("resultStats", emptyResultStat)}>+ Add Stat</button></div>
              {form.resultStats.map((c, i) => (
                <div className="col-12" key={i}>
                  <StepCard index={i} label="Stat" {...dnd("resultStats", i)} onRemove={() => removeItem("resultStats", i)}>
                    <div className="col-xl-3"><IconPicker value={c.icon} onChange={(v) => setItem("resultStats", i, "icon", v)} /></div>
                    <div className="col-xl-2"><div className="my_profile_setting_input form-group"><label>Value</label><input type="text" className="form-control" value={c.value} onChange={(e) => setItem("resultStats", i, "value", e.target.value)} placeholder="70%" /></div></div>
                    <div className="col-xl-3"><div className="my_profile_setting_input form-group"><label>Label</label><input type="text" className="form-control" value={c.label} onChange={(e) => setItem("resultStats", i, "label", e.target.value)} placeholder="Faster Processing" /></div></div>
                    <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Description</label><input type="text" className="form-control" value={c.desc} onChange={(e) => setItem("resultStats", i, "desc", e.target.value)} /></div></div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* ── AnalyticsSection ── */}
        <SectionCard id="sec-analytics" title="Use cases" accentColor="#2c2e50" {...toggle("analyticsShow")} badge={form.analyticsItems.length}>
          {form.analyticsShow && (
            <>
              {text("Heading (lead)", "analyticsHeading", "Performance ")}
              {text("Heading accent", "analyticsHeadingAccent", "Analytics")}
              {editor("Intro", "analyticsIntro")}
              <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Items</div><button type="button" className="btn admore_btn mb20" onClick={() => addItem("analyticsItems", emptyIconCard)}>+ Add Item</button></div>
              {form.analyticsItems.map((c, i) => (
                <div className="col-12" key={i}>
                  <StepCard index={i} label="Item" {...dnd("analyticsItems", i)} onRemove={() => removeItem("analyticsItems", i)}>
                    <div className="col-xl-3"><IconPicker value={c.icon} onChange={(v) => setItem("analyticsItems", i, "icon", v)} /></div>
                    <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title} onChange={(e) => setItem("analyticsItems", i, "title", e.target.value)} /></div></div>
                    <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Description</label><HtmlEditor value={c.desc} onChange={(v) => setItem("analyticsItems", i, "desc", v)} /></div></div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* ── WhyChooseSection ── */}
        <SectionCard id="sec-whychoose" title="Why Akoode" accentColor="#3c3e66" {...toggle("whyChooseShow")} badge={form.whyChooseCards.length}>
          {form.whyChooseShow && (
            <>
              {text("Heading (lead)", "whyChooseHeading", "Why Businesses Choose Akoode For ")}
              {text("Heading accent", "whyChooseHeadingAccent", "AI Development")}
              {editor("Intro", "whyChooseIntro")}
              <div className="col-lg-12"><div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Cards</div><button type="button" className="btn admore_btn mb20" onClick={() => addItem("whyChooseCards", emptyIconCard)}>+ Add Card</button></div>
              {form.whyChooseCards.map((c, i) => (
                <div className="col-12" key={i}>
                  <StepCard index={i} label="Card" {...dnd("whyChooseCards", i)} onRemove={() => removeItem("whyChooseCards", i)}>
                    <div className="col-xl-3"><IconPicker value={c.icon} onChange={(v) => setItem("whyChooseCards", i, "icon", v)} /></div>
                    <div className="col-xl-4"><div className="my_profile_setting_input form-group"><label>Title</label><input type="text" className="form-control" value={c.title} onChange={(e) => setItem("whyChooseCards", i, "title", e.target.value)} /></div></div>
                    <div className="col-xl-5"><div className="my_profile_setting_input form-group"><label>Description</label><HtmlEditor value={c.desc} onChange={(v) => setItem("whyChooseCards", i, "desc", v)} /></div></div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* MoreCaseStudies is static (live data). FinalCTA is the reused services
            component — only its heading + subtext are editable here. */}

        {/* ── Final CTA ── */}
        <SectionCard id="sec-finalcta" title="Final CTA" accentColor="#3c3e66">
          <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
            Only the heading and subtext are editable — the form, layout and styling stay exactly as they are. Leave blank to keep the current defaults.
          </div>
          {text("Heading", "finalCtaHeading", "Let's Build Something That Performs", "col-lg-12")}
          <div className="col-lg-12">
            <div className="my_profile_setting_input form-group">
              <label>Subtext</label>
              <textarea className="form-control" rows={3} value={form.finalCtaSubtitle} onChange={(e) => set("finalCtaSubtitle", e.target.value)} placeholder="Tell us what you're building. A senior engineer — not an account manager — will reply within thirty working minutes." />
            </div>
          </div>
        </SectionCard>

        {/* ── Meta ── */}
        <SectionCard id="sec-meta" title="Meta (SEO)" accentColor="#4b4d7c">
          {text("Meta Title", "metaTitle", "", "col-lg-12")}
          <div className="col-lg-12">
            <div className="my_profile_setting_input form-group">
              <label>Meta Description</label>
              <textarea className="form-control" rows={3} value={form.metaDescription ?? ""} onChange={(e) => set("metaDescription", e.target.value)} placeholder="Short SEO description for this page" />
            </div>
          </div>
        </SectionCard>

        {error.general && <div className="col-12"><span className="text-danger">{error.general}</span></div>}

        {/* ── Status + Save ── */}
        <SectionCard id="sec-status" title="Publish" accentColor="#4b4d7c">
          <div className="col-lg-4">
            <div className="my_profile_setting_input form-group">
              <label>Status</label>
              <select className="form-control" value={statusValue} onChange={(e) => setStatusValue(e.target.value)}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="col-lg-12 mt10 text-end">
            <button type="submit" className="btn btn2" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </SectionCard>
      </form>
    </>
  );
}

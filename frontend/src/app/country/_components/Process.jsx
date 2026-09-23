"use client";

import { useState, useEffect } from "react";
import {
  FiBarChart2,
  FiCheck,
  FiCloud,
  FiCpu,
  FiCalendar,
  FiDatabase,
  FiFileText,
  FiGlobe,
  FiSearch,
  FiShield,
  FiSmartphone,
  FiUsers,
} from "react-icons/fi";
import Image from "next/image";
import { splitTitle, resolveIcon, buildAssetUrl } from "./shared";
import RichText from "./RichText";
import { FiZap } from "react-icons/fi";

const ICON_PROPS = { size: 22, strokeWidth: 1.5 };

const DEFAULT_STEPS = [
  {
    id: "01",
    shortTitle: "Web platforms",
    title: "Web platforms",
    body: "Performance-first marketing sites, dashboards, and B2B portals built on Next.js with edge rendering — Core Web Vitals green from day one, headless CMS your team owns, and typed APIs that scale with your roadmap.",
    timeline: "2 – 4 weeks",
    timelineNote: "From signed scope to first production slice on your domain",
    deliverables: [
      "Production-ready Next.js app with ISR / edge where it fits",
      "Headless CMS wiring (Sanity, Contentful, or Strapi)",
      "Design system + Storybook handover for your team",
      "CI, previews, and observability hooks for every deploy",
    ],
    icon: <FiGlobe {...ICON_PROPS} />,
  },
  {
    id: "02",
    shortTitle: "Mobile apps",
    title: "Mobile applications",
    body: "Native-feel React Native and Flutter apps with offline-first sync and predictable two-week release trains — TestFlight-ready builds every sprint and OTA fixes when stores slow you down.",
    timeline: "3 – 5 weeks",
    timelineNote: "First internal build to store submission, typical B2B scope",
    deliverables: [
      "App shell, navigation, and auth integrated with your backend",
      "Offline-first data layer with conflict-safe sync patterns",
      "EAS / Play pipeline with staged rollout and crash reporting",
      "Detox or Maestro smoke suite on critical user paths",
    ],
    icon: <FiSmartphone {...ICON_PROPS} />,
  },
  {
    id: "03",
    shortTitle: "AI & ML",
    title: "AI & machine learning",
    body: "RAG search, agents, and fine-tuned models wired into your product — evaluation harnesses, guardrails, and latency budgets so intelligence ships as a feature teams can trust and extend.",
    timeline: "2 – 6 weeks",
    timelineNote: "Depends on data access, eval depth, and model choice",
    deliverables: [
      "Retrieval + prompt stack with citation-accurate responses",
      "Agent workflows with tools, memory, and safety checks",
      "Streaming APIs with P95 latency dashboards",
      "Regression suite for prompts, tools, and retrieval quality",
    ],
    icon: <FiCpu {...ICON_PROPS} />,
  },
  {
    id: "04",
    shortTitle: "Cloud & DevOps",
    title: "Cloud & DevOps",
    body: "AWS / GCP architectures with infra-as-code, GitOps delivery, and observability by default — audit-friendly baselines so your platform runs while the team sleeps.",
    timeline: "2 – 4 weeks",
    timelineNote: "Foundation account + first production workload pattern",
    deliverables: [
      "Terraform modules and environments (dev / staging / prod)",
      "Observability: traces, metrics, structured logs, SLOs",
      "CI/CD with rollback under minutes, not hours",
      "Cost and security guardrails documented for reviewers",
    ],
    icon: <FiCloud {...ICON_PROPS} />,
  },
  {
    id: "05",
    shortTitle: "Data engineering",
    title: "Data engineering",
    body: "Warehouses, ELT, and reverse-ETL so every team queries the same source of truth — lineage, tests, and freshness alerts before dashboards go live.",
    timeline: "3 – 6 weeks",
    timelineNote: "Medallion layout + first business-critical marts",
    deliverables: [
      "Warehouse modelling in dbt with tests and documentation",
      "Orchestration with SLAs and owner-visible failures",
      "Reverse-ETL into CRM and ops tools where needed",
      "Executive-facing semantic layer or BI connection",
    ],
    icon: <FiDatabase {...ICON_PROPS} />,
  },
  {
    id: "06",
    shortTitle: "Security & compliance",
    title: "Security & compliance",
    body: "SOC 2, ISO 27001, DPDP, and RBI-adjacent controls engineered in from sprint one — evidence trails, access patterns, and pen-test readiness without slowing delivery.",
    timeline: "Ongoing",
    timelineNote: "Aligned to audit windows and your assurance schedule",
    deliverables: [
      "Threat model + control mapping for your stack",
      "Secure SDLC hooks in CI (SAST, deps, secrets scanning)",
      "Logging and access review playbooks your team can run",
      "Vendor DPAs and subprocessors documented for legal",
    ],
    icon: <FiShield {...ICON_PROPS} />,
  },
];

const ORB_ICON_WRAP =
  "flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(167,139,250,0.4)] bg-[rgba(10,8,20,0.85)] text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.4)]";

function StageGraphic({ className = "" }) {
  const base =
    "relative mx-auto h-[240px] w-[240px] shrink-0 select-none sm:h-[268px] sm:w-[268px] lg:mx-0 lg:h-[272px] lg:w-[272px]";
  return (
    <div className={[base, className].filter(Boolean).join(" ")} aria-hidden>
      <div className="pointer-events-none absolute inset-[10%] rounded-full border border-dashed border-violet-400/25" />
      <div className="pointer-events-none absolute inset-[18%] rounded-full border border-dashed border-violet-400/18" />
      <div className="pointer-events-none absolute inset-[26%] rounded-full border border-dotted border-violet-300/12" />
      <span className="pointer-events-none absolute left-[48%] top-[11%] h-1 w-1 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
      <span className="pointer-events-none absolute right-[14%] top-[40%] h-1 w-1 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
      <span className="pointer-events-none absolute bottom-[18%] right-[42%] h-1 w-1 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
      <span className="pointer-events-none absolute bottom-[28%] left-[16%] h-1 w-1 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
      <div className={`absolute left-[6%] top-[14%] ${ORB_ICON_WRAP}`}>
        <FiBarChart2 className="h-4 w-4" strokeWidth={1.5} />
      </div>
      <div className={`absolute right-[8%] top-[16%] ${ORB_ICON_WRAP}`}>
        <FiFileText className="h-4 w-4" strokeWidth={1.5} />
      </div>
      <div className={`absolute bottom-[14%] right-[10%] ${ORB_ICON_WRAP}`}>
        <FiShield className="h-4 w-4" strokeWidth={1.5} />
      </div>
      <div className={`absolute bottom-[16%] left-[12%] ${ORB_ICON_WRAP}`}>
        <FiUsers className="h-4 w-4" strokeWidth={1.5} />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[118px] w-[118px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_25%,rgba(192,167,255,0.65)_0%,rgba(124,58,237,0.55)_38%,rgba(40,22,80,0.9)_72%,rgba(8,6,16,1)_100%)] shadow-[0_0_52px_rgba(139,92,246,0.55),0_0_120px_rgba(91,33,182,0.25),inset_0_1px_0_rgba(255,255,255,0.18)] ring-1 ring-violet-400/35" />
      <div className="absolute left-1/2 top-1/2 flex h-[118px] w-[118px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <FiSearch className="relative z-[1] h-9 w-9 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]" strokeWidth={1.2} />
      </div>
    </div>
  );
}

/** Shared detail panel — used by both accordion (mobile) and sidebar layout (desktop) */
function DetailPanel({ s, withWatermark = false }) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-3xl border border-[rgba(221,223,238,0.14)]",
        "bg-[linear-gradient(145deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_42%,rgba(12,12,18,0.65)_100%)]",
        "p-5 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.75)] sm:p-8 lg:p-10",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(124,58,237,0.14),transparent_58%)]" />

      {withWatermark && (
        <div
          className="pointer-events-none absolute right-0 top-0 z-0 h-[300px] w-[300px] -translate-y-8 translate-x-2 opacity-[0.11] saturate-75 sm:h-[380px] sm:w-[380px] sm:-translate-y-10 sm:translate-x-4 sm:opacity-[0.15] sm:saturate-100 lg:h-[480px] lg:w-[480px] lg:-translate-y-14 lg:translate-x-6 lg:opacity-[0.18] xl:h-[540px] xl:w-[540px] xl:-translate-y-16 xl:translate-x-8 xl:opacity-[0.2]"
          aria-hidden
        >
          <div className="flex h-full w-full items-center justify-end pr-0 sm:pr-2 lg:pr-4">
            <div className="origin-center scale-[1.2] sm:scale-[1.32] lg:scale-[1.48] xl:scale-[1.58]">
              <StageGraphic className="mx-0" />
            </div>
          </div>
        </div>
      )}

      <div className="relative z-[1]">
        <div className="mb-4 space-y-3 sm:mb-5 sm:space-y-4">
          <span className="inline-flex items-center rounded-full border border-violet-500/40 bg-[rgba(124,58,237,0.18)] px-3 py-1.5 text-[12px] font-bold uppercase leading-none tracking-[0.18em] text-violet-100">
            Stage {s.id}
          </span>
          <h3 className="sbc-h3 m-0 block pt-0.5 font-bold text-white [text-shadow:0_1px_24px_rgba(0,0,0,0.45)]">
            {s.title}
          </h3>
        </div>

        <RichText className="sbc-body m-0 mb-5 !text-[rgba(245,244,255,0.96)] leading-[1.75] [text-shadow:0_1px_18px_rgba(0,0,0,0.55)] sm:mb-7 lg:max-w-[40rem]" html={s.body} />

        <div className="mt-6 border-t border-white/[0.08] pt-6 sm:mt-8 sm:pt-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-0">
            <div className="sm:border-r sm:border-white/[0.08] sm:pr-8 lg:pr-10">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-violet-300">
                Timeline
              </p>
              <div className="flex items-center gap-3 mt-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-500/35 bg-[rgba(124,58,237,0.12)] text-violet-100 shadow-[0_0_24px_rgba(139,92,246,0.2)]">
                  <FiCalendar className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <p className="m-0 text-lg font-semibold leading-tight text-white">{s.timeline}</p>
              </div>
              <p className="mt-3 pl-[52px] text-sm leading-relaxed text-slate-400">{s.timelineNote}</p>
            </div>
            <div className="sm:pl-8 lg:pl-10">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-violet-300">
                You receive
              </p>
              <ul className="space-y-3 mt-5">
                {s.deliverables.map((line) => (
                  <li key={line} className="flex gap-3 text-[14px] leading-normal text-slate-400 sm:text-[15px]">
                    <span className="mt-[0.2em] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600/85 text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]">
                      <FiCheck className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                    <span className="min-w-0">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Process({ data }) {
  const heading = data?.heading || "Six disciplines, one team, shipping under one roof.";
  const subtitle =
    data?.subtitle ||
    "We don't subcontract. Every line of code, every pixel, every pipeline is built by Akoode engineers — pair-shipping inside your slack.";
  const STEPS = data?.steps?.length
    ? data.steps.map((s, i) => {
        const iconData = s.icon || s.iconImg || "";
        const isImage = iconData.includes("/") || iconData.startsWith("http");
        const Icon = !isImage ? resolveIcon(iconData, null) : null;
        
        return {
          id: s.shortTitle ? String(i + 1).padStart(2, "0") : DEFAULT_STEPS[i]?.id || String(i + 1).padStart(2, "0"),
          shortTitle: s.shortTitle || s.title || "",
          title: s.title || "",
          body: s.body || "",
          timeline: s.timeline || "",
          timelineNote: s.timelineNote || "",
          deliverables: Array.isArray(s.deliverables) ? s.deliverables : [],
          iconData,
          isImage,
          Icon: Icon || DEFAULT_STEPS[i]?.icon || <FiZap />,
        };
      })
    : DEFAULT_STEPS;

  const [active, setActive] = useState(-1);
  const [openedOnce, setOpenedOnce] = useState(() => new Set());

  useEffect(() => {
    if (window.innerWidth >= 768) setActive(0);
  }, []);

  const desktopStep = STEPS[active >= 0 ? active : 0];

  const toggleTab = (i) => {
    setActive((prev) => (prev === i ? -1 : i));
    setOpenedOnce((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
  };

  return (
    <section className="sbc-section sbc-section--dark" id="services">
      <div className="sbc-grain" />
      <div className="sbc-glow-blob sbc-glow-blob--tl" aria-hidden="true" />
      <div className="sbc-glow-blob sbc-glow-blob--br" aria-hidden="true" />
      <div className="sbc-container relative z-[2]">
        <div className="reveal sbc-section-head mb-10 px-2 sm:mb-14 sm:px-0 md:pt-8 lg:mb-16 lg:pt-10">
          <h2 className="sbc-h2 sbc-section-title text-[#1a1a1a] font-bold transition-colors duration-400 mb-0">
            {(() => {
              const { main, accent, suffix } = splitTitle(heading);
              return (
                <>
                  {main} {accent && <span className="sbc-heading-accent">{accent}</span>} {suffix}
                </>
              );
            })()}
          </h2>
          <RichText className="sbc-body-lg sbc-section-subtitle !text-[rgba(245,244,255,0.93)]" html={subtitle} />
        </div>

        {/* ── Mobile / tablet accordion (hidden on lg+) ─────────── */}
        <div className="reveal d1 flex flex-col gap-2 lg:hidden">
          {STEPS.map((s, i) => {
            const on = i === active;
            return (
              <div
                key={s.id}
                className={[
                  "overflow-hidden rounded-2xl border transition-colors duration-300",
                  on
                    ? "border-violet-500/45 shadow-[0_0_0_1px_rgba(139,92,246,0.25)]"
                    : "border-white/[0.08]",
                ].join(" ")}
              >
                {/* Accordion trigger */}
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => toggleTab(i)}
                  className={[
                    "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-300",
                    on
                      ? "bg-[rgba(139,92,246,0.12)]"
                      : "bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)]",
                  ].join(" ")}
                >
                  {/* Icon */}
                  <div
                    className={[
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-colors duration-300 overflow-hidden",
                      on
                        ? "border-violet-400/45 bg-[rgba(139,92,246,0.2)] text-violet-100"
                        : "border-white/10 bg-[rgba(255,255,255,0.04)] text-slate-400",
                    ].join(" ")}
                  >
                    {s.isImage ? (
                      <Image src={buildAssetUrl(s.iconData)} alt="" width={40} height={40} className="w-full h-full object-contain p-2" />
                    ) : (
                      typeof s.Icon === 'function' ? <s.Icon size={20} /> : s.Icon
                    )}
                  </div>

                  {/* Label */}
                  <div className="min-w-0 flex-1 leading-tight">
                    <div
                      className={[
                        "mb-0.5 font-mono text-[11px] font-medium leading-none tabular-nums tracking-wide",
                        on ? "text-violet-300" : "text-slate-500",
                      ].join(" ")}
                    >
                      {s.id}
                    </div>
                    <div
                      className={[
                        "text-[14px] font-semibold leading-tight tracking-[-0.02em]",
                        on ? "text-white" : "text-slate-300",
                      ].join(" ")}
                    >
                      {s.shortTitle}
                    </div>
                  </div>

                  {/* Chevron */}
                  <svg
                    className={[
                      "h-4 w-4 shrink-0 transition-transform duration-300",
                      on ? "rotate-180 text-violet-300" : "text-slate-500",
                    ].join(" ")}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Accordion body — CSS grid trick for smooth expand/collapse */}
                <div
                  className={[
                    "grid transition-all duration-300 ease-out",
                    on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <div className="px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
                      {(on || openedOnce.has(i)) && <DetailPanel s={s} withWatermark={false} />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Desktop layout: sticky sidebar + panel (lg+) ─────── */}
        <div className="reveal d1 hidden items-start gap-10 lg:grid lg:grid-cols-12 xl:gap-12">
          <aside className="flex flex-col gap-3 lg:sticky lg:top-[80px] lg:col-span-4 lg:self-start">
            {STEPS.map((s, i) => {
              const on = i === (active >= 0 ? active : 0);
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={on}
                  aria-controls="services-detail-panel"
                  onClick={() => setActive(i)}
                  className={[
                    "group relative flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300",
                    on
                      ? "border-violet-500/55 bg-[rgba(139,92,246,0.12)] shadow-[0_0_0_1px_rgba(139,92,246,0.35),0_0_28px_rgba(124,58,237,0.28)]"
                      : "border-white/[0.08] bg-[rgba(255,255,255,0.03)] hover:border-white/[0.14] hover:bg-[rgba(255,255,255,0.05)]",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-colors duration-300 overflow-hidden",
                      on
                        ? "border-violet-400/45 bg-[rgba(139,92,246,0.2)] text-violet-100"
                        : "border-white/10 bg-[rgba(255,255,255,0.04)] text-slate-400 group-hover:text-slate-200",
                    ].join(" ")}
                  >
                    {s.isImage ? (
                      <Image src={buildAssetUrl(s.iconData)} alt="" width={44} height={44} className="w-full h-full object-contain p-2.5" />
                    ) : (
                      typeof s.Icon === 'function' ? <s.Icon size={22} /> : s.Icon
                    )}
                  </div>
                  <div className="min-w-0 flex-1 leading-tight">
                    <div
                      className={[
                        "mb-1 font-mono text-[11px] font-medium leading-none tabular-nums tracking-wide",
                        on ? "text-violet-300" : "text-slate-500",
                      ].join(" ")}
                    >
                      {s.id}
                    </div>
                    <div
                      className={[
                        "truncate text-[15px] font-semibold leading-tight tracking-[-0.02em]",
                        on ? "text-white" : "text-slate-300",
                      ].join(" ")}
                    >
                      {s.shortTitle}
                    </div>
                  </div>
                  {on && (
                    <span
                      className="pointer-events-none absolute -right-px top-1/2 h-0 w-0 -translate-y-1/2 border-y-[7px] border-l-[8px] border-y-transparent border-l-violet-400/90"
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </aside>

          <div
            id="services-detail-panel"
            className="lg:col-span-8"
            role="region"
            aria-label={`${desktopStep.shortTitle} details`}
          >
            <DetailPanel s={desktopStep} />
          </div>
        </div>
      </div>
    </section>
  );
}

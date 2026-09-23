"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { resolveIcon, buildAssetUrl } from "./shared";
import HeroBreadcrumb from "@/components/HeroBreadcrumb";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

/* ─── Sparkline ─────────────────────────────────────────── */
const SparkLine = () => (
  <svg viewBox="0 0 274 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[70px]">
    <defs>
      <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#67BD8C" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#67BD8C" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 68 C45 62,65 76,100 56 C135 36,155 70,185 50 C215 30,240 60,274 24"
      stroke="#67BD8C" strokeWidth="3" fill="none" strokeLinecap="round"
    />
    <path
      d="M0 68 C45 62,65 76,100 56 C135 36,155 70,185 50 C215 30,240 60,274 24 L274 90 L0 90 Z"
      fill="url(#sparkGrad)"
    />
    <circle cx="274" cy="24" r="5" fill="#67BD8C" />
    <circle cx="274" cy="24" r="10" fill="#67BD8C" fillOpacity="0.2" />
  </svg>
);

/* ─── Inline Icons ───────────────────────────────────────── */
const TrendUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#67BD8C" strokeWidth="2">
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
    <polyline points="16,7 22,7 22,13" />
  </svg>
);

const CodeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6679E4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const AIIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6679E4" strokeWidth="1.8">
    <path d="M10 2H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h5" />
    <path d="M14 2h5a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5" />
    <path d="M10 16H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h5" />
    <path d="M14 16h5a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-5" />
    <rect x="10" y="2" width="4" height="20" rx="1" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.67">
    <polyline points="9,18 15,12 9,6" />
  </svg>
);

/* Stat icons — exact match to Figma outlines */
const BriefcaseStatIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
    <rect x="2.5" y="9" width="25" height="18" rx="2" stroke="#7186FA" strokeWidth="2" />
    <path d="M10 9V7a2.5 2.5 0 0 1 2.5-2.5h5A2.5 2.5 0 0 1 20 7v2" stroke="#7186FA" strokeWidth="2" />
  </svg>
);
const UsersStatIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
    <path d="M2.5 25v-2a6 6 0 0 1 6-6h7a6 6 0 0 1 6 6v2" stroke="#7186FA" strokeWidth="2" />
    <circle cx="12" cy="9" r="5" stroke="#7186FA" strokeWidth="2" />
    <path d="M25 3a5 5 0 0 1 0 9.7M27.5 25v-2a5 5 0 0 0-3.75-4.85" stroke="#7186FA" strokeWidth="2" />
  </svg>
);
const RevenueStatIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
    <rect x="3.75" y="3.75" width="22.5" height="22.5" rx="3" stroke="#7186FA" strokeWidth="2" />
    <line x1="10" y1="22" x2="10" y2="14" stroke="#7186FA" strokeWidth="2" strokeLinecap="round" />
    <line x1="15" y1="22" x2="15" y2="8" stroke="#7186FA" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="22" x2="20" y2="16" stroke="#7186FA" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const RocketStatIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
    <path d="M5.63 24.38c-1.88 1.57-2.5 5-2.5 5s3.62-.62 5-2.5c.75-.88.75-2.25-.12-3.13-.88-.87-2.13-.75-2.38.63z" stroke="#6679E4" strokeWidth="2" />
    <path d="M15 18.75l-3.75-3.75A20 20 0 0 1 13.75 11 15 15 0 0 1 26.25 3.75c0 3.12-.87 8.75-6.25 12.5A20 20 0 0 1 15 18.75z" stroke="#6679E4" strokeWidth="2" />
    <path d="M11.25 15H6.25s.63-3.75 2.5-5c1.88-1.25 5.63 0 5.63 0" stroke="#6679E4" strokeWidth="2" />
    <path d="M15 18.75v5s3.75-.62 5-2.5c1.25-1.87 0-5.62 0-5.62" stroke="#6679E4" strokeWidth="2" />
  </svg>
);

/* TrustRow */
const FACES = [
  { letter: 'P', bg: 'linear-gradient(135deg,#7c3aed,#4338ca)', ml: 0 },
  { letter: 'J', bg: 'linear-gradient(135deg,#0891b2,#0e7490)', ml: '-8px' },
  { letter: 'S', bg: 'linear-gradient(135deg,#059669,#047857)', ml: '-8px' },
  { letter: 'A', bg: 'linear-gradient(135deg,#d97706,#b45309)', ml: '-8px' },
];

const TrustRow = () => {
  return (
    <div className="flex flex-col items-start gap-1 pt-3 ">
      {/* Avatars Container */}
      <div className="flex">
        {FACES.map((f) => (
          <div
            key={f.letter}
            className="w-7 h-7 rounded-full border-2 border-[#39374A] flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: f.bg, marginLeft: f.ml }}
          >
            {f.letter}
          </div>
        ))}
      </div>

      {/* Text Container */}
      <div className="text-[11px] text-[#c5bfea] font-['Figtree']">
        <strong className="text-white">110+ Happy Clients</strong> trust Akoode globally <br /> ⭐ 5/5 on Clutch
      </div>
    </div>
  );
};

/* Shared card glass style */
const card = {
  background: "rgba(255,255,255,0.05)",
  borderRadius: 16,
  outline: "0.8px solid rgba(255,255,255,0.10)",
  outlineOffset: "-0.8px",
  overflow: "hidden",
};

/* Stat icon box */
const iconBox = {
  width: 48,
  height: 48,
  flexShrink: 0,
  background: "#1D1F4B",
  borderRadius: 12,
  outline: "0.8px solid #7186FA",
  outlineOffset: "-0.8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

/* ─── H1 length-aware sizing ──────────────────────────────
 * This is a SHARED template rendered by hundreds of service-by-city and
 * service-by-country pages, and the H1 copy is produced per-page by the AI
 * content pipeline — so its length is not something we control at design time.
 * Short titles ("Software Development Company Chicago", ~35 chars) and long
 * ones ("AI-Powered Software Development Company In Chicago Delivering
 * Enterprise Digital Solutions", ~90 chars) hit the same markup. At a single
 * fixed size the long ones wrap to 3 lines and push the hero out of layout.
 *
 * So: DO NOT "fix" this back to one hardcoded font size. The tiers step the
 * H1 down as the title grows. Tier 1 is byte-identical to the size this hero
 * has always used, so every existing short-title page renders unchanged.
 *
 * Sizes stay as responsive clamps rather than Tailwind's text-5xl/4xl/3xl
 * scale because those are flat px values — text-5xl (48px) would actually
 * enlarge today's desktop H1 (42px) and blow up the 32px mobile size.
 * The tiers below keep roughly Tailwind's 5xl→4xl→3xl step ratio.
 */
const H1_SIZE_TIERS = [
  { maxChars: 45, className: "text-[clamp(32px,3.8vw,42px)]" }, // current size — unchanged
  { maxChars: 65, className: "text-[clamp(26px,3.0vw,33px)]" },
  { maxChars: Infinity, className: "text-[clamp(23px,2.6vw,29px)]" },
];

// headline is rendered via dangerouslySetInnerHTML and may carry <span> wrappers,
// so measure the visible text, not the markup.
const h1SizeClass = (html = "") => {
  const len = String(html).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().length;
  return H1_SIZE_TIERS.find((t) => len <= t.maxChars).className;
};

// Hero stats bar is STATIC across all SBC pages — admin overrides are ignored.
const STATIC_HERO_STATS = [
  { Icon: BriefcaseStatIcon, value: "180+", label: "Projects Delivered", sub: "Across global markets" },
  { Icon: UsersStatIcon, value: "97%", label: "Client Retention", sub: "Long-term technology partnerships" },
  { Icon: RevenueStatIcon, value: "30+", label: "AI-Powered Solutions Built", sub: "Scalable AI systems for modern businesses" },
  { Icon: RocketStatIcon, value: "15+", label: "Industries Served", sub: "From FinTech to HealthTech and SaaS" },
];

/* ─── Component ─────────────────────────────────────────── */
export default function HeroSection({ data, title, country, parentPage }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const crumbLabel = title || country;
  const headline = data?.heading || "Software Development\nThat Drives <span style=\"color:#7784C5\">Real Impact</span>";
  const bodyText = data?.body || "Full-Stack, AI-powered software built for UK businesses that need to move fast, scale smarter, and stay ahead.";
  const btn1 = "Start Your Project";
  const btn1Link = "/post-requirement";
  const btn2 = "See Our Work";
  const btn2Link = "/case-studies";

  const rawHeroImg = data?.heroImage || data?.hero?.heroImage || "";
  const heroImageSrc = rawHeroImg ? (buildAssetUrl(rawHeroImg) || "/placeholder-hero.webp") : "/placeholder-hero.webp";
  const heroImageAlt = data?.heroImageAlt || "Hero illustration";

  // Hero stats are STATIC — ignore data.stats / data.hero.stats.
  const resolvedStats = STATIC_HERO_STATS.map(s => ({ ...s, isImage: false }));

  // Project Progress card — admin-editable (title / body / value).
  const ppSource = data?.projectProgress || data?.hero?.projectProgress || {};
  const projectProgressTitle = ppSource.title || "Project Progress";
  const projectProgressBody = ppSource.body || "Delivering scalable software solutions on time, sprint after sprint.";
  const projectProgressValue = ppSource.value || "+ 51%";

  const fade = (d = 0) => ({
    // opacity stays 1 so LCP element is visible on first paint.
    // translateY still provides the entrance animation after mount.
    opacity: 1,
    transform: mounted ? "none" : "translateY(20px)",
    transition: `transform 0.7s ease ${d}s`,
  });

  return (
    <div
      className="w-full min-h-[100vh] flex flex-col justify-start lg:justify-center pt-[72px] sm:pt-[80px] lg:pt-0"
      style={{ background: "linear-gradient(180deg, #1F2336 0%, #130F25 100%)", fontFamily: "Figtree, DM Sans, Inter, sans-serif" }}
    >
      <div className="w-full flex flex-col gap-6 lg:gap-4 lg:flex-1 lg:justify-center pt-4 lg:pt-10">
        {/* ── HERO ── */}
        <section className="w-full w-[92%] xl:w-[88%] mx-auto px-5 sm:px-0">
          <div className="flex flex-col lg:flex-row items-center gap-10 xl:gap-12">

            {/* LEFT COPY */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-5 lg:gap-7 w-full lg:w-[48%] xl:w-[50%] flex-shrink-0 mt-2 lg:mt-0 lg:pt-4" style={fade(0)}>

              {/* breadcrumb — country pages: Home > {page}; city pages: Home > {country page} > {city page} */}
              <HeroBreadcrumb
                className="!mb-0"
                items={[
                  { label: "Home", href: "/" },
                  ...(parentPage ? [{ label: parentPage.label, href: parentPage.href }] : []),
                  { label: crumbLabel },
                ]}
              />

              {/* Heading */}
              <div className="flex flex-col gap-3 lg:gap-5">
                <h1
                  className={`capitalize leading-[1.12] ${h1SizeClass(headline)}`}
                  style={{ color: "white", fontWeight: 400, fontFamily: "Figtree, sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: processHtmlLinks(headline) }}
                />

                <p className="mx-auto lg:mx-0" style={{ color: "rgba(255,255,255,0.85)", fontSize: "clamp(15px,1.4vw,16px)", fontWeight: 400, lineHeight: "26px", maxWidth: 540, fontFamily: "Figtree, sans-serif" }}>
                  {bodyText}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-2">
                <a
                  href={btn1Link}
                  className="flex items-center justify-center gap-2 transition-opacity hover:opacity-90 active:scale-[0.98]"
                  style={{
                    height: 54, borderRadius: 30,
                    background: "linear-gradient(90deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)",
                    boxShadow: "0px 8px 24px rgba(0,0,0,0.25)",
                    outline: "1.5px solid #889AF5", outlineOffset: "-1.5px",
                    padding: "0 32px",
                    color: "white", fontSize: 16, fontWeight: 500,
                    fontFamily: "Figtree, sans-serif",
                    textDecoration: "none",
                  }}
                >
                  {btn1} <ChevronRight />
                </a>

                <a
                  href={btn2Link}
                  className="flex items-center justify-center transition-opacity hover:opacity-80"
                  style={{
                    height: 54, borderRadius: 30,
                    outline: "1.5px solid rgba(255,255,255,0.15)", outlineOffset: "-1.5px",
                    padding: "0 32px",
                    color: "white", fontSize: 16, fontWeight: 500,
                    fontFamily: "Figtree, sans-serif",
                    textDecoration: "none",
                  }}
                >
                  {btn2}
                </a>
              </div>
            </div>

            {/* RIGHT CARDS */}
            <div
              className="flex-1 w-full !hidden lg:!grid"
              style={{ ...fade(0.2), gridTemplateColumns: "1fr 1.35fr", gap: "clamp(12px,1.2vw,20px)", alignItems: "center" }}
            >

              {/* Project Progress */}
              <div className="lg:mt-[20%]" style={card}>
                <div className="p-5 xl:p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p style={{ color: "white", fontSize: 16, fontWeight: 500, lineHeight: "20px", fontFamily: "Figtree, sans-serif" }}>
                        {projectProgressTitle}
                      </p>
                      <p className="mt-1.5" style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 400, lineHeight: "18px", maxWidth: 180, fontFamily: "Figtree, sans-serif" }}>
                        {projectProgressBody}
                      </p>
                    </div>
                    <div style={{
                      width: 40, height: 40, flexShrink: 0,
                      background: "#39454F", borderRadius: 12,
                      outline: "1px solid #67BD8C", outlineOffset: "-1px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <TrendUpIcon />
                    </div>
                  </div>

                  <div className="relative mt-6">
                    <span
                      className="absolute left-1/2 -translate-x-1/2 -top-3 z-10 whitespace-nowrap"
                      style={{
                        background: "rgba(103,189,140,0.10)",
                        borderRadius: 8,
                        outline: "0.8px solid #64B587", outlineOffset: "-0.8px",
                        padding: "4px 8px",
                        color: "#67BD8C", fontSize: 13, fontWeight: 500, lineHeight: "18px",
                        fontFamily: "Figtree, sans-serif",
                      }}
                    >
                      {projectProgressValue}
                    </span>
                    <SparkLine />
                  </div>
                </div>
              </div>

              {/* Right sub-col */}
              <div className="relative flex flex-col w-[90%] mt-5" style={{ gap: "clamp(10px,1vw,12px)", left: "5%" }}>

                {/* Code card */}
                <div
                  className="relative overflow-hidden w-[90%]"
                  style={{
                    height: 160,
                    borderRadius: 16,
                    background: "linear-gradient(135deg, rgba(28,57,142,0.20) 0%, rgba(89,22,139,0.30) 100%)",
                    boxShadow: "0px 8px 32px rgba(0,0,0,0.30)",
                    outline: "1px solid rgba(255,255,255,0.10)", outlineOffset: "-1px",
                  }}
                >
                  <Image
                    src={heroImageSrc}
                    alt={heroImageAlt}
                    fill
                    sizes="(max-width: 768px) 90vw, 400px"
                    className="object-cover"
                  />
                </div>

                {/* AI Solutions */}
                <div className="w-full mb-5" style={{ ...card, padding: "15px" }}>
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p style={{ color: "white", fontSize: 16, fontWeight: 500, lineHeight: "22px", fontFamily: "Figtree, sans-serif" }}>
                        AI-Powered Solutions
                      </p>
                      <p className="mt-1.5" style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 400, lineHeight: "18px", maxWidth: 160, fontFamily: "Figtree, sans-serif" }}>
                        Intelligent, scalable, and future-ready software built for modern businesses.
                      </p>
                    </div>
                    <div style={{
                      width: 38, height: 38, flexShrink: 0,
                      background: "#1D1F4B", borderRadius: 10,
                      outline: "0.8px solid #6679E4", outlineOffset: "-0.8px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <AIIcon />
                    </div>
                  </div>

                  <TrustRow />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── STATS STRIP ── */}
      <section className="w-[92%] xl:w-[88%] mx-auto px-4 sm:px-0 mt-4 lg:mt-0 mb-6 lg:mb-12">
        <div
          className="grid grid-cols-2 lg:grid-cols-4 w-full"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: "24px",
              outline: "1px solid rgba(255,255,255,0.08)",
              outlineOffset: "-1px",
              padding: "14px 18px",
            }}
          >
            {resolvedStats.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-2 sm:gap-4 px-2 sm:px-5 py-3 sm:py-4"
              >
                <div style={iconBox} className="!w-[28px] !h-[28px] sm:!w-[48px] sm:!h-[48px] overflow-hidden shrink-0 mt-0.5">
                  <div className="flex items-center justify-center w-full h-full">
                    {s.isImage ? (
                      <Image
                        src={buildAssetUrl(s.icon)}
                        alt=""
                        width={48}
                        height={48}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="scale-50 sm:scale-[.85]">
                        <s.Icon />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <p
                    style={{
                      color: "#fff",
                      fontSize: "clamp(16px, 4vw, 24px)",
                      fontWeight: 700,
                      lineHeight: "1.2",
                    }}
                  >
                    {s.value}
                  </p>

                  <div>
                    <p
                      style={{
                        color: "#fff",
                        fontSize: "clamp(10px, 2.5vw, 13px)",
                        fontWeight: 500,
                        lineHeight: "1.2"
                      }}
                    >
                      {s.label}
                    </p>

                    <p
                      style={{
                        color: "#8A94A6",
                        fontSize: "11px",
                      }}
                    >
                      {s.sub}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
    </div>
  );
}

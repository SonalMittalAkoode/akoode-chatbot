"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import resolveImageUrl from "@/utils/resolveImageUrl";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const stripHtml = (s) => String(s || "").replace(/<[^>]*>/g, "").trim();

const shortText = (s, max = 160) => {
  const t = stripHtml(s);
  return t.length > max ? t.slice(0, max).replace(/\s+\S*$/, "") + "…" : t;
};

const CASE_STUDIES = [
  {
    title: "Brokerage CRM Rebuilt on Next.js — 12,000 Agents, Zero Downtime",
    slug: "brokerage-crm-rebuilt",
    industry: "Real Estate",
    country: "UK",
    shortdescription:
      "A property platform with 12,000 agents replaced a legacy monolith and cut listing-publish time from 6 minutes to under 90 seconds. Search latency dropped 94% with a new geospatial indexing layer.",
    stat1Value: "40%",
    stat1Label: "Faster Listings",
    stat2Value: "1.6M",
    stat2Label: "Listings Indexed",
    image: "/industries_page/hero.png",
  },
  {
    title: "PropTech SaaS: From MVP to $2M ARR in 18 Months",
    slug: "proptech-saas-mvp",
    industry: "PropTech",
    country: "UAE",
    shortdescription:
      "A white-label property management platform that scaled from 0 to 400 landlords with multi-currency billing and automated compliance reporting.",
    stat1Value: "$2M",
    stat1Label: "ARR Reached",
  },
  {
    title: "AI-Powered Valuation Engine for Investment Firm",
    slug: "ai-valuation-engine",
    industry: "Real Estate",
    country: "India",
    shortdescription:
      "A machine learning valuation model trained on 8 years of transaction data, reducing appraisal time from 3 days to 4 hours with 91% accuracy.",
    stat1Value: "3x",
    stat1Label: "Faster Appraisals",
  },
];

function CaseCard({ study, index }) {
  const [hover, setHover] = useState(false);
  const tag = `${study.industry}${study.country ? ` — ${study.country}` : ""}`;

  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="flex flex-col h-full no-underline rounded-[20px] p-8 border transition-all duration-300"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover
          ? "linear-gradient(135deg, rgba(119,132,197,0.12) 0%, rgba(79,96,181,0.08) 100%)"
          : "rgba(29,31,75,0.4)",
        border: hover
          ? "1px solid rgba(136,154,245,0.35)"
          : "1px solid rgba(136,154,245,0.12)",
        transform: hover ? "translateY(-5px)" : "none",
        boxShadow: hover ? "0 20px 40px -12px rgba(79,96,181,0.3)" : "none",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <span
          className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide"
          style={{
            background: "rgba(136,154,245,0.15)",
            color: "#889AF5",
            border: "1px solid rgba(136,154,245,0.25)",
          }}
        >
          ↑ {study.stat1Value} {study.stat1Label}
        </span>
        <span className="text-xs tracking-widest uppercase text-[rgba(136,154,245,0.7)]">
          {tag}
        </span>
      </div>
      <h3 className="text-white text-lg font-semibold leading-snug mb-3">
        {study.title}
      </h3>
      <p className="text-[rgba(255,255,255,0.65)] text-sm leading-relaxed flex-1">
        {shortText(study.shortdescription, 130)}
      </p>
      <div className="flex items-center gap-2 mt-6 text-[#889AF5] font-medium text-sm">
        Read the case study <ArrowRight size={15} strokeWidth={1.5} />
      </div>
    </Link>
  );
}

export default function CaseStudy({ data, featured: featuredOverride, others: othersOverride = [] }) {
  const props = data || {};
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: el.clientWidth * 0.82, behavior: "smooth" });
    }, 3500);
    return () => {
      clearInterval(id);
      clearTimeout(timerRef.current);
    };
  }, []);

  const pauseBriefly = () => {
    pausedRef.current = true;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 2000);
  };

  // Pull pulse stats from the case study record's `whychooseus` JSON (the same
  // source the case-study detail page reads). Strip HTML so values render as
  // plain numbers/labels in the badge and stat grid.
  const pulseStat = (cs, key) => stripHtml(cs?.whychooseus?.[key] || "");

  // If the admin has selected a featured case study for this industry, map
  // its DB shape onto the local card structure so the existing UI continues
  // to work with no visual change.
  const mappedOverride = featuredOverride
    ? {
        title: featuredOverride.title || CASE_STUDIES[0].title,
        slug: featuredOverride.slug || CASE_STUDIES[0].slug,
        industry: featuredOverride.industry || CASE_STUDIES[0].industry,
        country: featuredOverride.country || "",
        shortdescription:
          featuredOverride.shortdescription || CASE_STUDIES[0].shortdescription,
        stat1Value: pulseStat(featuredOverride, "pulseStat1Value") || CASE_STUDIES[0].stat1Value,
        stat1Label: pulseStat(featuredOverride, "pulseStat1Label") || CASE_STUDIES[0].stat1Label,
        stat2Value: pulseStat(featuredOverride, "pulseStat2Value") || CASE_STUDIES[0].stat2Value,
        stat2Label: pulseStat(featuredOverride, "pulseStat2Label") || CASE_STUDIES[0].stat2Label,
        image: resolveImageUrl(
          featuredOverride.casestudyimage ||
          featuredOverride.aboutimage ||
          featuredOverride.logoimage
        ) || CASE_STUDIES[0].image,
      }
    : null;

  const featured = mappedOverride || CASE_STUDIES[0];

  const mappedOthers = othersOverride.length > 0
    ? othersOverride.map((cs) => ({
        title: cs.title || "",
        slug: cs.slug || "",
        industry: cs.industry || "",
        country: cs.country || "",
        shortdescription: cs.shortdescription || "",
        stat1Value: pulseStat(cs, "pulseStat1Value"),
        stat1Label: pulseStat(cs, "pulseStat1Label"),
        stat2Value: pulseStat(cs, "pulseStat2Value"),
        stat2Label: pulseStat(cs, "pulseStat2Label"),
      }))
    : null;

  // Side cards are optional — only render the ones the admin actually picked.
  // No hardcoded fallback when none are selected.
  const others = mappedOthers || [];

  return (
    <section className="w-full bg-[#101828] py-16 sm:py-20 lg:py-24 px-6 md:px-16 lg:px-24 font-figtree">
      {/* Header */}
      <div className="text-left md:text-center mb-14">
        {props?.eyebrow && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#889AF5]/30 bg-[#1D1F4B]/60 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#889AF5]" />
            <span className="text-[#889AF5] text-sm font-medium tracking-wide">
              {props.eyebrow}
            </span>
          </div>
        )}
        <h2 className="text-white text-[24px] sm:text-[28px] font-bold leading-tight sm:leading-8 capitalize mb-4">
          {props?.heading ? (
            props.heading
          ) : (
            <>
              Outcomes You Can Take{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(90deg, #7784C5 0%, #889AF5 100%)",
                }}
              >
                To Your Board Meeting
              </span>
            </>
          )}
        </h2>
        <div
          className="text-white/70 text-sm sm:text-base capitalize leading-relaxed max-w-2xl mx-auto [&_p]:m-0 [&_span]:m-0"
          dangerouslySetInnerHTML={{ __html: processHtmlLinks(props?.subtitle || "A spotlight build plus more wins — shipping speed, compliance, and revenue you can measure.") }}
        />
      </div>

      {/* Featured case study */}
      <div
        className="relative mb-10 overflow-hidden rounded-[28px] p-8 md:p-14 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] items-center gap-10 lg:gap-14"
        style={{
          background:
            "linear-gradient(160deg, rgba(119,132,197,0.10) 0%, rgba(79,96,181,0.06) 100%)",
          border: "1px solid rgba(136,154,245,0.18)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.05), 0 40px 80px -20px rgba(0,0,0,0.4)",
        }}
      >
        {/* Left: text + stats + CTA */}
        <div className="relative z-[1]">
          <div className="flex gap-2.5 flex-wrap mb-5">
            <span
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide"
              style={{
                background: "rgba(136,154,245,0.15)",
                color: "#889AF5",
                border: "1px solid rgba(136,154,245,0.25)",
              }}
            >
              ↑ {featured.stat1Value} {featured.stat1Label}
            </span>
            <span
              className="px-3.5 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase border border-[rgba(136,154,245,0.3)] text-[rgba(136,154,245,0.85)]"
            >
              {featured.industry}
              {featured.country && ` — ${featured.country}`}
            </span>
          </div>

          <h3 className="text-white text-2xl md:text-3xl font-bold leading-[1.2] max-w-[560px] mb-5">
            {featured.title}
          </h3>
          <p className="text-[rgba(255,255,255,0.7)] text-base leading-relaxed max-w-[520px]">
            {shortText(featured.shortdescription, 180)}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 md:gap-12 mt-10">
            {[
              [featured.stat1Value, featured.stat1Label],
              [featured.stat2Value, featured.stat2Label],
            ].map(
              ([v, l], idx) =>
                v && (
                  <div key={idx}>
                    <div className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none">
                      {v}
                    </div>
                    <div className="text-xs tracking-widest uppercase text-[rgba(136,154,245,0.85)] mt-2">
                      {l}
                    </div>
                  </div>
                )
            )}
          </div>

          {/* CTA */}
          <div className="mt-10">
            <Link
              href={`/case-studies/${featured.slug}`}
              className="inline-flex items-center gap-2 h-[56px] px-6 rounded-full text-white text-[14px] font-medium whitespace-nowrap no-underline group transition-transform duration-300 hover:scale-[1.04]"
              style={{
                background:
                  "linear-gradient(180deg, #7784c5 0%, #495074 50%, #4f5581 100%)",
                border: "1.5px solid #7683c5",
                boxShadow: "0 4px 20px -4px rgba(15,18,40,0.45)",
                fontFamily: "Figtree, sans-serif",
              }}
            >
              Read the full case study
              <ArrowRight
                size={18}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Right: image */}
        <div
          className="hidden lg:block relative z-[1] rounded-[22px] overflow-hidden w-full aspect-[16/10] min-h-[320px]"
          style={{ boxShadow: "0 20px 60px -20px rgba(0,0,0,0.5)" }}
        >
          <img
            src={featured.image || "/industries_page/hero.png"}
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </div>

      {/* Other cases — only rendered when the admin picked at least one.
          Mobile peek carousel / desktop 2-col grid. */}
      {others.length > 0 && (
        <div
          ref={trackRef}
          onTouchStart={pauseBriefly}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
          className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-6 md:overflow-x-visible md:items-start"
        >
          {others.map((study, i) => (
            <div
              key={study.slug || study._id || i}
              className="min-w-[82vw] flex flex-col snap-center md:min-w-0"
            >
              <CaseCard study={study} index={i + 1} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

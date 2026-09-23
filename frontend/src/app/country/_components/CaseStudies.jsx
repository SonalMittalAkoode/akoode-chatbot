"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Magnetic } from "./Magnetic";
import resolveImageUrl from "@/utils/resolveImageUrl";
import { mergeWhyChooseUsShowcase } from "@/utils/whyChooseUsShowcase";
import { splitTitle } from "./shared";
import RichText from "./RichText";

const stripHtml = (s) => String(s || "").replace(/<[^>]*>/g, "").trim();

// Fallback data to prevent "totally blank" appearance
const DEFAULT_CASES = [
  {
    title: "Brokerage CRM rebuilt on Next.js + Mongo",
    slug: "brokerage-crm-rebuilt",
    industry: "Real Estate",
    country: "UK",
    shortdescription: "A property platform with 12,000 agents replaced a legacy monolith and cut listing-publish time from 6 minutes to under 90 seconds.",
    whychooseus: {
      pulseStat1Value: "40%",
      pulseStat1Label: "faster listings",
      pulseStat2Value: "1.6M",
      pulseStat2Label: "Listings indexed",
      pulseQualityTitle: "94%",
      pulseQualitySubtitle: "Search latency drop"
    }
  },
  {
    title: "Route AI for an inter-city fleet",
    slug: "route-ai-logistics",
    industry: "Logistics",
    shortdescription: "A geospatial agent rewrote dispatch decisions every 15 seconds — saving fuel and unlocking same-day delivery.",
    whychooseus: {
      pulseStat1Value: "₹38 Cr",
      pulseStat1Label: "saved",
    }
  },
  {
    title: "KYC funnel redesigned end-to-end",
    slug: "kyc-funnel-redesign",
    industry: "Fintech",
    shortdescription: "An onboarding flow that shrank from 14 minutes to 4, with DPDP-compliant data residency baked in.",
    whychooseus: {
      pulseStat1Value: "3x",
      pulseStat1Label: "conversion",
    }
  }
];

function CaseCard({ study, index }) {
  const [hover, setHover] = useState(false);
  const wcu = mergeWhyChooseUsShowcase(study?.whychooseus);
  const metric = wcu.pulseStat1Value || "40% faster";
  const tag = study?.industry 
    ? `${study.industry}${study.country ? ` - ${study.country}` : ""}`
    : "Technology";
  
  return (
    <Link
      href={`/case-studies/${study?.slug || "#"}`}
      className={`reveal d${(index % 4) + 1} p-10 rounded-[20px] cursor-pointer transition-all duration-[350ms] ease-[cubic-bezier(.2,.8,.2,1)] border border-[rgba(221,223,238,0.20)] flex flex-col h-full no-underline`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "linear-gradient(135deg, rgba(180,160,255,0.10) 0%, rgba(100,80,220,0.07) 100%)" : "rgba(236,234,253,0.03)",
        transform: hover ? "translateY(-6px)" : "none",
        boxShadow: hover ? "0 20px 40px -12px rgba(60,40,180,0.35)" : "none",
      }}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6 sm:mb-8">
        <span
          className="shrink-0 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-[11px] sm:text-[12px] font-semibold tracking-[0.06em] bg-[#e8e5fb] text-[#18193e] whitespace-nowrap"
          style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
        >
          ↑ {metric}
        </span>
        <span
          className="text-[10.5px] sm:text-[12px] tracking-[0.1em] sm:tracking-[0.14em] uppercase text-[rgba(230,228,250,0.92)]"
          style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
        >
          {tag}
        </span>
      </div>
      <h3 className="sbc-h3 text-white font-semibold mb-3.5">{study?.title}</h3>
      <p className="sbc-body text-[rgba(245,244,255,0.96)] line-clamp-2">
        {study?.shortdescription 
          ? stripHtml(study.shortdescription) 
          : stripHtml(study?.description).slice(0, 150) + "..."}
      </p>
      <div className="flex items-center gap-2 mt-8 text-white font-medium text-[14px]">
        Read the case study <ArrowRight size={16} strokeWidth={1.5} />
      </div>
    </Link>
  );
}

export function CaseStudies({ data }) {
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const timerRef = useRef(null);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
      else el.scrollBy({ left: el.clientWidth * 0.82, behavior: 'smooth' });
    }, 3500);
    return () => { clearInterval(id); clearTimeout(timerRef.current); };
  }, []);
  const pauseBriefly = () => {
    pausedRef.current = true;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { pausedRef.current = false; }, 2000);
  };

  const heading = data?.heading || "Outcomes you can take to your board meeting.";
  const subtitle = data?.subtitle || "A spotlight build plus more wins — shipping speed, compliance, and revenue you can measure.";

  // Prioritize populated cases from the database
  const dynamicCases = [];
  if (data?.featuredCase) dynamicCases.push(data.featuredCase);
  if (data?.otherCases) dynamicCases.push(...(data.otherCases || []));

  const studies = dynamicCases.length > 0 ? dynamicCases : DEFAULT_CASES;

  const featured = studies[0];
  const others = studies.slice(1, 3); // Max 2 others
  const featuredWcu = mergeWhyChooseUsShowcase(featured?.whychooseus);

  return (
    <section className="sbc-section sbc-section--dark" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="sbc-grain" />
      <div className="sbc-glow-blob sbc-glow-blob--tl" aria-hidden="true" />
      <div className="sbc-glow-blob sbc-glow-blob--br" aria-hidden="true" />
      <div className="sbc-container relative z-[2]">
        <div className="reveal mx-auto mb-12 px-4 text-center sm:mb-16 sm:px-0 sbc-section-head sbc-section-head--single-title">
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
          <RichText className="sbc-body-lg sbc-section-subtitle !text-[rgba(245,244,255,0.96)]" html={subtitle} />
        </div>

        {/* Featured Case Study */}
        {featured && (
          <div
            className="reveal d1 relative mb-16 overflow-hidden rounded-[28px] p-8 md:mb-20 md:p-14 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] items-center gap-10 lg:gap-14"
            style={{
              background: "linear-gradient(160deg, rgba(180,160,255,0.10) 0%, rgba(100,80,220,0.06) 100%)",
              border: "1px solid rgba(221,223,238,0.22)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 40px 80px -20px rgba(0,0,0,0.3)",
            }}
          >
            <div className="relative z-[1]">
              <div className="flex gap-2.5 flex-wrap mb-5">
                <span
                  className="px-3.5 py-2 rounded-full text-[12px] font-semibold tracking-[0.06em] bg-[#e8e5fb] text-[#18193e]"
                  style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
                >
                  ↑ {featuredWcu.pulseStat1Value || "Featured"} {featuredWcu.pulseStat1Label}
                </span>
                <span
                  className="px-3.5 py-2 rounded-full text-[12px] font-medium tracking-[0.12em] uppercase border border-[rgba(230,228,250,0.45)] text-[rgba(245,244,255,0.95)]"
                  style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
                >
                  {featured.industry} {featured.country && `- ${featured.country}`}
                </span>
              </div>
              <h3 className="sbc-h3 max-w-[620px] text-white font-bold leading-[1.15]">
                {featured.title}
              </h3>
              <p className="sbc-body !text-[rgba(245,244,255,0.96)] mt-6 max-w-[560px] leading-relaxed">
                 {featured.shortdescription 
                   ? stripHtml(featured.shortdescription) 
                   : stripHtml(featured.description).slice(0, 180) + "..."}
              </p>
              <div className="grid grid-cols-2 gap-8 md:gap-12 mt-10">
                {[
                  [featuredWcu.pulseStat1Value, featuredWcu.pulseStat1Label],
                  [featuredWcu.pulseStat2Value, featuredWcu.pulseStat2Label],
                ].map(([v, l], idx) => (
                  v && (
                    <div key={idx}>
                      <div
                        className="text-[22px] sm:text-[36px] font-bold text-white tracking-[-0.03em] leading-none"
                        style={{ fontFamily: "var(--font-figtree), system-ui, sans-serif" }}
                      >
                        {v}
                      </div>
                      <div
                        className="text-[11px] tracking-[0.14em] uppercase text-[rgba(230,228,250,0.95)] mt-2"
                        style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
                      >
                        {l}
                      </div>
                    </div>
                  )
                ))}
              </div>
              <div className="mt-10">
                <Magnetic>
                  <Link href={`/case-studies/${featured.slug}`} className="sbc-btn sbc-btn--cta group !no-underline">
                    Read the full case study{" "}
                    <ArrowRight size={18} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Magnetic>
              </div>
            </div>
            <div
              className="hidden lg:block relative z-[1] rounded-[22px] overflow-hidden w-full aspect-[16/10] min-h-[340px]"
              style={{
                background: "linear-gradient(160deg, #ebe9f8 0%, #DDDFEE 100%)",
                boxShadow: "0 20px 60px -20px rgba(0,0,0,0.4)",
              }}
            >
              <Image 
                src={resolveImageUrl(featured.casestudyimage) || "/placeholder.jpg"} 
                alt={featured.title || "Case Study"} 
                fill 
                className="object-cover pointer-events-none select-none"
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Mobile: peek carousel — md+: 2-col grid */}
        <div
          ref={trackRef}
          onTouchStart={pauseBriefly}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
          className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sbc-card-strip md:grid md:grid-cols-2 md:gap-6 md:overflow-x-visible md:items-start"
        >
          {others.map((study, i) => (
            <div key={study.slug || i} className="min-w-[82vw] flex flex-col snap-center md:min-w-0">
              <CaseCard study={study} index={i + 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

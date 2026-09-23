"use client";

import { useRef, useEffect } from "react";
import { FiUsers, FiCpu, FiAward, FiShield } from "react-icons/fi";
import { resolveIcon } from "@/app/country/_components/shared";
import resolveImageUrl from "@/utils/resolveImageUrl";
import AwardsPanel from "@/components/AwardsPanel";
import FounderCtaStrip from "@/components/FounderCtaStrip";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const DEFAULT_CARDS = [
  {
    Icon: FiUsers,
    title: "No Subcontracting — Your Project Stays In-House",
    desc: "Every project runs entirely within Akoode's in-house team. Clients work directly with the developers, architects, designers, and strategists responsible for delivery from discovery through deployment.",
  },
  {
    Icon: FiCpu,
    title: "AI-First Real Estate Engineering",
    desc: "We integrate AI into production systems: property recommendation engines, intelligent search, predictive valuations, and automated document workflows — not a marketing term.",
  },
  {
    Icon: FiAward,
    title: "Senior Engineers Lead Every Engagement",
    desc: "A senior engineer leads every Akoode project — directly involved in architecture decisions, sprint reviews, technical planning, and deployment from day one.",
  },
  {
    Icon: FiShield,
    title: "Compliance & Security Designed In From the Start",
    desc: "We build systems aligned with data privacy regulations, enterprise security requirements, and regulated industry workflows from the very first design sprint.",
  },
];

const ROW1 = [
  { name: "Top US-Based IT Services Firm 2026", src: "/clients/us-based.webp" },
  { name: "Clutch",            src: "/whyus_badge/clutch.webp" },
  { name: "Outlook",           src: "/whyus_badge/outlook.webp" },
  { name: "Ai Automation",     src: "/whyus_badge/techreviewer.webp" },
  { name: "Business Standard", src: "/whyus_badge/bsdesktop.webp" },
  { name: "YourStory",         src: "/whyus_badge/yourstory.webp" },
];

const ROW2 = [
  { name: "Good Firms",      src: "/whyus_badge/goodfirms.webp" },
  { name: "Top Machine Learning Companies - Goodfirms", src: "/clients/godfirms.webp" },
  { name: "Top eCommerce Development Company", src: "/clients/eCommerce_dev.webp" },
  { name: "Entrepreneur",    src: "/strip/strip4.svg" },
  { name: "ZBusiness",       src: "/whyus_badge/zeebiz_logo.svg" },
  { name: "Times of India",  src: "/whyus_badge/toi_logo.png" },
  { name: "Hindustan Times", src: "/whyus_badge/ht.webp" },
];

// This page's own award/press badges, de-duplicated, fed into the shared
// AwardsPanel design (single-row marquee) instead of the old two-row layout.
const AWARDS_LOGOS = [...ROW1, ...ROW2].filter(
  (item, i, arr) => arr.findIndex((x) => x.src === item.src) === i
);

function FeatureCard({ Icon: IconProp, imgSrc, title, desc, description }) {
  const body = desc || description || "";
  return (
    <div className="h-full flex flex-col rounded-[10px] bg-white p-7 border"
      style={{ borderColor: "rgba(119,132,197,0.2)" }}>
      <div className="flex items-start gap-4 mb-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ background: "rgba(119,132,197,0.1)" }}
        >
          {imgSrc
            ? <img src={imgSrc} alt={title || "Feature icon"} className="w-[20px] h-[20px] object-contain" />
            : <IconProp size={18} style={{ color: "#7784C5" }} />
          }
        </div>
        <h3 className="text-[#14153d] font-semibold text-[15px] sm:text-[16px] lg:text-[17px] leading-tight">
          {title}
        </h3>
      </div>
      <div
        className="text-sm leading-7 text-[#4A5565] [&_p]:m-0"
        dangerouslySetInnerHTML={{ __html: processHtmlLinks(body) }}
      />
    </div>
  );
}

export default function WhyChooseAkoode({ data }) {
  const CARDS = data?.items?.length > 0
    ? data.items.map((it) => {
        const isImg = it.icon && (it.icon.startsWith("/") || it.icon.startsWith("http"));
        return { ...it, Icon: isImg ? null : resolveIcon(it.icon, FiUsers), imgSrc: isImg ? resolveImageUrl(it.icon) : null };
      })
    : DEFAULT_CARDS;
  const eyebrow = data?.eyebrow;
  const heading = data?.heading;
  const subtitle = data?.subtitle || "Built for property platforms. Backed by proven results.";
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
    return () => { clearInterval(id); clearTimeout(timerRef.current); };
  }, []);

  const pauseBriefly = () => {
    pausedRef.current = true;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { pausedRef.current = false; }, 2000);
  };

  return (
    <>
      <section
        className="py-16 sm:py-20 lg:py-24 font-figtree"
        style={{
          background:
            "linear-gradient(160deg, #f5f3fa 0%, #ebe9f4 50%, #f0eef8 100%)",
        }}
      >
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">

          {/* Header */}
          <div className="max-w-[760px] mb-12 md:mb-16">
            {eyebrow && (
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5"
                style={{
                  background: "rgba(29,31,75,0.06)",
                  borderColor: "rgba(119,132,197,0.3)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7784C5]" />
                <span className="text-[#4F5581] text-sm font-medium tracking-wide">
                  {eyebrow}
                </span>
              </div>
            )}
            <h2 className="text-[#14153d] text-[24px] sm:text-[28px] font-bold leading-tight sm:leading-8 mb-4">
              {heading ? (
                heading
              ) : (
                <>
                  Why Real Estate Teams{" "}
                  <span
                    className="text-transparent bg-clip-text"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #7784C5 0%, #889AF5 100%)",
                    }}
                  >
                    Choose Akoode
                  </span>
                </>
              )}
            </h2>
            <div
              className="text-[#4A5565] text-sm sm:text-base leading-relaxed [&_p]:m-0"
              dangerouslySetInnerHTML={{ __html: processHtmlLinks(subtitle) }}
            />
          </div>

          {/* Main 2-col layout */}
          <div className="flex flex-col lg:grid lg:grid-cols-[2.1fr_1fr] gap-6 md:gap-8 w-full">

            {/* Feature cards — mobile horizontal scroll / sm+ 2-col grid */}
            <div
              ref={trackRef}
              onTouchStart={pauseBriefly}
              onMouseEnter={() => { pausedRef.current = true; }}
              onMouseLeave={() => { pausedRef.current = false; }}
              className="order-2 lg:order-1 min-w-0 flex sm:grid sm:grid-cols-2 items-stretch gap-5 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 snap-x snap-mandatory sm:snap-none scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {CARDS.map((card, i) => (
                <div key={i} className="min-w-[80vw] sm:min-w-0 flex flex-col snap-center">
                  <FeatureCard {...card} />
                </div>
              ))}
            </div>

            {/* Awards panel — shared AwardsPanel design, fed with this page's
                own press/award badges. min-w-0 is load-bearing: the marquee
                row inside is `w-max` (~1400px of logos) and, without an
                explicit min-width on this grid item, that intrinsic content
                width balloons the "1fr" track past its share, squeezing and
                overlapping the cards column instead of being clipped by
                AwardsPanel's own overflow-hidden. */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-24 self-start w-full min-w-0">
              <AwardsPanel logos={AWARDS_LOGOS} />
            </div>

          </div>

          {/* CTA bar */}
          <div className="mt-8">
            <FounderCtaStrip />
          </div>

        </div>
      </section>
    </>
  );
}

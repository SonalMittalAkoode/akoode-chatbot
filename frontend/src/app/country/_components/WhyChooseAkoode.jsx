"use client";

import { useRef, useEffect, useState } from "react";
import { FiUsers, FiCpu, FiAward, FiShield, FiZap } from "react-icons/fi";
import { resolveIcon, ICON_MAP, splitTitle } from "./shared";
import RichText from "./RichText";
import AwardsPanel from "@/components/AwardsPanel";
import FounderCtaStrip from "@/components/FounderCtaStrip";

const FALLBACK_CARDS = [
  {
    icon: "FiUsers",
    title: "No Subcontracting - Your Project Stays In-House",
    desc: "Every project runs entirely within Akoode's in-house team. Clients work directly with the developers, architects, designers, and strategists responsible for delivery from discovery through deployment.",
  },
  {
    icon: "FiCpu",
    title: "AI-First Software Development - Not a Marketing Term",
    desc: "We integrate AI into production systems: document analysis workflows, intelligent automation, recommendation engines, predictive analytics, and AI-powered search.",
  },
  {
    icon: "FiAward",
    title: "Senior Engineers Lead Every UK Engagement",
    desc: "A senior engineer leads every Akoode project — directly involved in architecture decisions, sprint reviews, technical planning, and deployment.",
  },
  {
    icon: "FiShield",
    title: "UK-Relevant Compliance Designed In From the Start",
    desc: "We build systems aligned with UK GDPR, enterprise security requirements, and regulated industry workflows from the first design sprint.",
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

function FeatureCard({ card }) {
  const Icon = resolveIcon(card.icon, FiZap);
  const isEmoji = !ICON_MAP[card.icon];

  return (
    <div className="h-full flex flex-col rounded-[10px] border border-[#e7e0ff] bg-white p-7">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(123,110,246,0.12)]">
          {Icon && !isEmoji ? (
            <Icon size={18} className="text-[#7b6ef6]" />
          ) : (
            <span>{card.icon}</span>
          )}
        </div>

        <h3 className="text-[#1a1a1a] font-semibold text-[18px] leading-tight">
          {card.title}
        </h3>
      </div>

      <RichText className="text-sm leading-7 text-[#625d84]" html={card.desc} />
    </div>
  );
}

export default function WhyChoose({ data }) {
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

  // Match the Awards panel's height to the first card's height, but only at
  // the `lg` breakpoint where they sit side-by-side in a grid — below that
  // the panel is a stacked full-width block and should size to its own content.
  const firstCardRef = useRef(null);
  const [awardsHeight, setAwardsHeight] = useState(null);
  useEffect(() => {
    const card = firstCardRef.current;
    if (!card) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setAwardsHeight(mq.matches ? card.offsetHeight : null);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(card);
    mq.addEventListener('change', sync);
    window.addEventListener('resize', sync);
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  const heading =
    data?.heading ||
    "Why UK Teams Choose Akoode";

  const subtitle =
    data?.subtitle ||
    "Built for regulated industries. Backed by proven results.";

  const cards = data?.cards?.length
    ? data.cards
    : FALLBACK_CARDS;

  return (
    <section className="bg-[#f4f2f8] py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        
        {/* heading */}
        <div className="sbc-section-head sbc-section-head--single-title !max-w-[920px] mb-12 md:mb-16">
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
          <RichText className="sbc-body-lg sbc-section-subtitle text-[#2a2d52]" html={subtitle} />
        </div>

        {/* main layout — 5-col grid: cards take 3 cols (60%), Awards panel takes 2 (40%).
            The Awards panel's height is set via JS (see awardsHeight state below) to
            exactly match the first row of cards, not the whole 2-row section. */}
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 md:gap-8 w-full max-w-full">

          {/* Top on Mobile: Awards Section — shared AwardsPanel design (single-row
              marquee), fed with this page's own press/award badges. The wrapper
              stretches to the full cards-column height (default grid stretch),
              giving the panel room to stick to top-24 as you scroll through it,
              while the panel's own box stays exactly one card row tall. */}
          <div className="order-1 lg:order-2 lg:col-span-2 w-full max-w-full min-w-0">
            <AwardsPanel
              logos={AWARDS_LOGOS}
              className="lg:sticky lg:top-24"
              style={awardsHeight ? { height: awardsHeight } : undefined}
            />
          </div>

          {/* Cards — horizontal scroll on mobile, 2-col grid from sm, full grid on lg.
              grid-rows-2 makes both rows share the tallest row's height so all 4
              cards end up the same size regardless of description length. */}
          <div
            ref={trackRef}
            onTouchStart={pauseBriefly}
            onMouseEnter={() => { pausedRef.current = true; }}
            onMouseLeave={() => { pausedRef.current = false; }}
            className="order-2 lg:order-1 lg:col-span-3 min-w-0 flex sm:grid sm:grid-cols-2 sm:grid-rows-2 items-stretch gap-5 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 scrollbar-hide snap-x snap-mandatory sm:snap-none scroll-smooth w-full max-w-full"
          >
            {cards.slice(0, 4).map((card, i) => (
              <div key={i} ref={i === 0 ? firstCardRef : null} className="min-w-[80vw] sm:min-w-0 flex flex-col snap-center">
                <FeatureCard card={card} />
              </div>
            ))}
          </div>

        </div>

        {/* CTA Bar */}
        <div className="mt-8">
          <FounderCtaStrip
            headingClassName="sbc-h3 font-bold"
            bodyClassName="sbc-body !text-white/75 leading-[1.75]"
            buttonClassName="text-[14px] sm:text-[15px] font-bold"
          />
        </div>

      </div>
    </section>
  );
}
"use client";

import { m } from "framer-motion";
import { useState, useRef } from "react";
import { stripHtml } from "../stripHtml";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  BarChart2,
  Database,
  Target,
  Layers,
  TrendingUp,
  Users,
  Settings,
  Briefcase,
} from "lucide-react";

const CASE_STUDIES = [
  {
    category: "FINTECH",
    Icon: CreditCard,
    title: "Payments Platform",
    outcomes: [
      { metric: "40%", Icon: TrendingUp, label: "Reduction in payment drop-off rate" },
      { metric: "50K+", Icon: Users, label: "Monthly active users at launch" },
    ],
    challenge:
      "The client's legacy payment flow had a 40% drop-off at checkout. Sessions were fragmented across three systems with no unified state.",
    built:
      "We rebuilt the entire payment orchestration layer as a single-session API-first system, adding real-time retry logic and a progressive UI that reduced cognitive load at every step.",
    href: "/case-studies",
  },
  {
    category: "ANALYTICS",
    Icon: BarChart2,
    title: "SaaS Analytics Dashboard",
    outcomes: [
      { metric: "60%", Icon: TrendingUp, label: "Faster reporting cycles" },
      { metric: "12", Icon: Settings, label: "Data sources integrated in one view" },
    ],
    challenge:
      "Analysts were spending 3 hours per day manually pulling data from 12 disconnected platforms. Reports were always a week out of date.",
    built:
      "We built a unified data pipeline and real-time BI dashboard. Auto-scheduled reports, anomaly alerts, and drill-down views eliminated manual work entirely.",
    href: "/case-studies",
  },
  {
    category: "ENTERPRISE",
    Icon: Database,
    title: "Enterprise ERP Migration",
    outcomes: [
      { metric: "28%", Icon: TrendingUp, label: "Reduction in operational overhead" },
      { metric: "10x", Icon: BarChart2, label: "Faster inter-department data sync" },
    ],
    challenge:
      "A 600-person manufacturer was running five disconnected systems. Production, HR, finance, and procurement had no shared data layer — causing costly delays and reporting errors.",
    built:
      "We designed a modular ERP on a cloud-native microservices architecture, migrated all data with zero downtime, and delivered a unified real-time operations hub.",
    href: "/case-studies",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function SdCaseStudies({ data, caseStudies }) {
  const rawHeading    = data?.heading       || "Work That Speaks For Itself";
  const rawAccent     = data?.headingAccent;
  const headingWords  = rawHeading.trim().split(/\s+/);
  const headingAccent = (rawAccent !== undefined && rawAccent !== "")
    ? rawAccent
    : headingWords.slice(-3).join(" ");
  const heading       = (rawAccent !== undefined && rawAccent !== "")
    ? rawHeading
    : headingWords.slice(0, -3).join(" ");
  const intro         = data?.intro         || "Every project we take on is a business problem before it is a technical one. Here is a snapshot of how we have helped businesses across industries build software that made a measurable difference.";
  const isDynamic      = Array.isArray(caseStudies) && caseStudies.length > 0;
  // Tag each entry so padded static fallbacks still render correctly even when
  // isDynamic is true for the overall list.
  const displayStudies = isDynamic
    ? [
        ...caseStudies.map((cs) => ({ ...cs, _isDynamic: true })),
        ...CASE_STUDIES.slice(caseStudies.length, 3).map((cs) => ({ ...cs, _isDynamic: false })),
      ]
    : CASE_STUDIES.map((cs) => ({ ...cs, _isDynamic: false }));

  const sliderRef  = useRef(null);
  const [slideIdx, setSlideIdx] = useState(0);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const perCard = (scrollWidth - clientWidth) / Math.max(displayStudies.length - 1, 1);
    setSlideIdx(Math.round(scrollLeft / perCard));
  };

  const scrollToSlide = (idx) => {
    if (!sliderRef.current) return;
    const { scrollWidth, clientWidth } = sliderRef.current;
    const perCard = (scrollWidth - clientWidth) / Math.max(displayStudies.length - 1, 1);
    sliderRef.current.scrollTo({ left: idx * perCard, behavior: "smooth" });
  };


  return (
    <section className="py-16 sm:py-20 lg:py-24" style={{ background: "#F8FAFF" }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        {/* heading */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "var(--font-figtree), Inter, sans-serif",
              fontWeight: 700,
              fontSize: 26,
              lineHeight: 1.25,
              color: "#191A2E",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {heading}{" "}
            <span style={{ color: "#7784C5" }}>{headingAccent}</span>
          </m.h2>
          <m.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-figtree), Inter, sans-serif",
              fontWeight: 400,
              fontSize: 15,
              lineHeight: 1.75,
              color: "#4A5565",
              maxWidth: 680,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            {intro}
          </m.p>
        </div>

        {/* cards — horizontal slider on mobile, grid on md+ */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-4 py-2 md:py-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayStudies.map((cs, i) => {
            const cardDynamic = cs._isDynamic === true;
            return (
            <m.div
              key={cardDynamic ? cs.slug : cs.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="snap-start shrink-0 md:shrink-[unset] w-[82vw] md:w-auto rounded-2xl flex flex-col overflow-hidden bg-white"
              style={{ border: "1px solid #E8EAF2" }}
            >
              {/* card header — dark gradient */}
              <div
                className="px-6 py-5 flex items-center gap-4"
                style={{
                  background: "linear-gradient(225deg, #576099 0%, #3A4066 50%, #1D2033 100%)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.92)" }}
                >
                  {cardDynamic
                    ? <Briefcase size={22} style={{ color: "#1D1F4B" }} />
                    : <cs.Icon size={22} style={{ color: "#1D1F4B" }} />
                  }
                </div>
                <div>
                  {!cardDynamic && (
                    <p
                      className="text-[11px] font-medium tracking-[0.1em] uppercase mb-0.5"
                      style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.55)" }}
                    >
                      {cs.category}
                    </p>
                  )}
                  <h3
                    style={{ fontFamily: "var(--font-figtree), Inter, sans-serif", fontWeight: 700, fontSize: 17, lineHeight: 1.2, color: "#ffffff", margin: 0 }}
                  >
                    {cs.title}
                  </h3>
                </div>
              </div>

              <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: "1 1 auto", gap: "20px" }}>
                {/* key outcomes */}
                {(() => {
                  const items = cardDynamic
                    ? (cs.rethinking?.stats ?? []).slice(0, 2).map((s) => ({
                        metric: stripHtml(String(s.value || "")),
                        label:  stripHtml(String(s.title || "")),
                        Icon: TrendingUp,
                      }))
                    : cs.outcomes;
                  return items?.length > 0 ? (
                    <div>
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          color: "#1D1F4B",
                          fontSize: "12px",
                          fontWeight: 600,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          marginBottom: "12px",
                          marginTop: 0
                        }}
                      >
                        Key Outcomes
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                        {items.map((o, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl p-3 flex flex-col gap-2"
                            style={{ background: "linear-gradient(180deg, #576099 0%, #3A4066 50%, #1D2033 100%)" }}
                          >
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: "#1D1F4B" }}
                            >
                              <o.Icon size={13} style={{ color: "#ffffff" }} />
                            </div>
                            <p
                              style={{ fontFamily: "Inter, sans-serif", color: "#ffffff", fontWeight: 700, fontSize: 24, lineHeight: 1, margin: 0 }}
                            >
                              {o.metric}
                            </p>
                            <p style={{ fontFamily: "var(--font-figtree), Inter, sans-serif", fontSize: 11, lineHeight: 1.45, color: "#ffffff", margin: 0 }}>
                              {o.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* challenge */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "#1D1F4B" }}
                    >
                      <Target size={20} style={{ color: "#ffffff" }} />
                    </div>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        color: "#364153",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        margin: 0
                      }}
                    >
                      Challenge
                    </p>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-figtree), Inter, sans-serif",
                      fontSize: "13px",
                      lineHeight: "1.65",
                      color: "#364153",
                      margin: 0,
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      display: "-webkit-box",
                      overflow: "hidden"
                    }}
                  >
                    {cardDynamic ? stripHtml(cs.challenges?.intro) : cs.challenge}
                  </p>
                </div>

                {/* what we built */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "#1D1F4B" }}
                    >
                      <Layers size={20} style={{ color: "#ffffff" }} />
                    </div>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        color: "#364153",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        margin: 0
                      }}
                    >
                      What We Built
                    </p>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-figtree), Inter, sans-serif",
                      fontSize: "13px",
                      lineHeight: "1.65",
                      color: "#364153",
                      margin: 0,
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      display: "-webkit-box",
                      overflow: "hidden"
                    }}
                  >
                    {cardDynamic ? stripHtml(cs.build?.intro) : cs.built}
                  </p>
                </div>

                {/* per-card CTA */}
                <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                  <Link
                    href={cardDynamic ? `/case-studies/${cs.slug}` : cs.href}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full transition-all duration-200 hover:opacity-90"
                    style={{
                      background: "linear-gradient(90deg, #474972 0%, #585c9c 100%)",
                      color: "#ffffff",
                      fontFamily: "var(--font-figtree), Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: 14,
                      textDecoration: "none",
                    }}
                  >
                    View Case Study
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </m.div>
            );
          })}
        </div>

        {/* Dot indicators — mobile only */}
        <div className="flex md:hidden justify-center gap-2 mt-5">
          {displayStudies.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="flex h-6 min-w-6 items-center justify-center"
              style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer" }}
            >
              <span
                style={{
                  width: slideIdx === i ? 22 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: slideIdx === i ? "#7784C5" : "rgba(119,132,197,0.3)",
                  transition: "width 0.3s ease, background 0.3s ease",
                }}
              />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}

"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const NOISE_BG_CLASS =
  "[background-image:url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%224%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22/%3E%3C/svg%3E')]";

const OVERSHADOW =
  "absolute inset-0 pointer-events-none opacity-100 transition-all duration-500 md:opacity-0 md:group-hover:opacity-100 bg-[linear-gradient(to_top,rgba(4,5,14,0.85)_0%,rgba(4,5,14,0.4)_55%,transparent_100%)]";

const CONFIG = [
  {
    cardBg: "bg-[linear-gradient(155deg,#0d0f2a,#1D1F4B)]",
    glowBg: "bg-[radial-gradient(circle,rgba(119,132,197,0.25)_0%,transparent_70%)]",
    dotClass: "bg-[#889AF5] shadow-[0_0_8px_#889AF5]",
    iconSmWrap: "border border-[#889AF555] bg-[#889AF522]",
    footerBar: "border-t border-[#889AF522] bg-[#0c0d1e]",
    bullet: "bg-[#889AF5]",
  },
  {
    cardBg: "bg-[linear-gradient(150deg,#111230,#2a3060)]",
    glowBg: "bg-[radial-gradient(circle,rgba(136,154,245,0.22)_0%,transparent_70%)]",
    dotClass: "bg-[#DDDFEE] shadow-[0_0_8px_#DDDFEE]",
    iconSmWrap: "border border-[#DDDFEE55] bg-[#DDDFEE22]",
    footerBar: "border-t border-[#DDDFEE22] bg-[#0c0d1e]",
    bullet: "bg-[#DDDFEE]",
  },
  {
    cardBg: "bg-[linear-gradient(145deg,#0f1030,#3c3f6a)]",
    glowBg: "bg-[radial-gradient(circle,rgba(119,132,197,0.22)_0%,transparent_70%)]",
    dotClass: "bg-[#7784C5] shadow-[0_0_8px_#7784C5]",
    iconSmWrap: "border border-[#7784C555] bg-[#7784C522]",
    footerBar: "border-t border-[#7784C522] bg-[#0c0d1e]",
    bullet: "bg-[#7784C5]",
  },
  {
    cardBg: "bg-[linear-gradient(135deg,#0c0e28,#40415D)]",
    glowBg: "bg-[radial-gradient(circle,rgba(136,154,245,0.22)_0%,transparent_70%)]",
    dotClass: "bg-[#889AF5] shadow-[0_0_8px_#889AF5]",
    iconSmWrap: "border border-[#889AF555] bg-[#889AF522]",
    footerBar: "border-t border-[#889AF522] bg-[#0c0d1e]",
    bullet: "bg-[#889AF5]",
  },
  {
    cardBg: "bg-[linear-gradient(140deg,#0a0c24,#3c3f6a)]",
    glowBg: "bg-[radial-gradient(circle,rgba(221,223,238,0.22)_0%,transparent_70%)]",
    dotClass: "bg-[#DDDFEE] shadow-[0_0_8px_#DDDFEE]",
    iconSmWrap: "border border-[#DDDFEE55] bg-[#DDDFEE22]",
    footerBar: "border-t border-[#DDDFEE22] bg-[#0c0d1e]",
    bullet: "bg-[#DDDFEE]",
  },
];

const INDUSTRIES = [
  {
    name: "Residential Real Estate",
    img: "/industriesWeServe/real_estate.webp",
    points: ["Property listing platforms", "CRM & lead tracking", "Virtual tour integrations"],
  },
  {
    name: "Commercial Real Estate",
    img: "/industriesWeServe/manufacturing_iot_software.webp",
    points: ["Lease & tenant management", "Asset performance dashboards", "Multi-site portfolio tools"],
  },
  {
    name: "PropTech & Fintech",
    img: "/industriesWeServe/finance_banking.webp",
    points: ["Mortgage & payment rails", "Escrow automation", "Compliance & KYC workflows"],
  },
  {
    name: "Property Marketplaces",
    img: "/industriesWeServe/retail_e-commerce.webp",
    points: ["Multi-vendor listing platforms", "Search & filter engines", "Agent network portals"],
  },
  {
    name: "Logistics & Facilities",
    img: "/industriesWeServe/logistics.webp",
    points: ["Maintenance request tracking", "Vendor & contractor management", "Asset lifecycle tools"],
  },
  {
    name: "Hospitality & Short-Stay",
    img: "/industriesWeServe/travel_hospitality.webp",
    points: ["Booking & reservation systems", "Dynamic pricing engines", "Guest experience platforms"],
  },
  {
    name: "Real Estate Education",
    img: "/industriesWeServe/education.webp",
    points: ["Agent training platforms", "Certification & licensing LMS", "Market analytics tools"],
  },
];

const CARD_W = 280;
const SCROLL_BY = CARD_W + 16;
const AUTO_INTERVAL = 3500;

export default function Industries() {
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const pauseTimerRef = useRef(null);

  const pauseAutoBriefly = () => {
    pausedRef.current = true;
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
      pauseTimerRef.current = null;
    }, 2000);
  };

  const scroll = (dir) => {
    pauseAutoBriefly();
    trackRef.current?.scrollBy({ left: dir * SCROLL_BY, behavior: "smooth" });
  };

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      const el = trackRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: SCROLL_BY, behavior: "smooth" });
    }, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="industries-served"
      className="overflow-hidden py-16 sm:py-20 lg:py-24 font-figtree"
      style={{ background: "linear-gradient(160deg, #f5f3fa 0%, #ebe9f4 50%, #f0eef8 100%)" }}
    >
      {/* Header */}
      <div className="mx-auto mb-10 w-full max-w-[1240px] md:mb-12 px-[5%]">
        <div className="max-w-[760px]">
          {/* <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5"
            style={{
              background: "rgba(29,31,75,0.06)",
              borderColor: "rgba(119,132,197,0.3)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#7784C5]" />
            <span className="text-[#4F5581] text-sm font-medium tracking-wide">
              Industries We Serve
            </span>
          </div> */}

          <h2 className="text-[#14153d] text-[24px] sm:text-[28px] font-bold leading-tight sm:leading-8 mb-4">
            Deep Expertise Across{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #7784C5 0%, #889AF5 100%)",
              }}
            >
              Every Vertical
            </span>
          </h2>
          <p className="text-[#4A5565] text-sm sm:text-base leading-relaxed">
            We bring domain knowledge and battle-tested engineering to every
            industry — solving sector-specific challenges with speed and
            precision.
          </p>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 hover:-translate-x-0.5"
            style={{
              border: "1px solid rgba(119,132,197,0.3)",
              background: "rgba(119,132,197,0.08)",
              color: "#7784C5",
            }}
            aria-label="Previous"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-all duration-300 hover:translate-x-0.5"
            style={{
              border: "1px solid rgba(119,132,197,0.5)",
              background: "linear-gradient(135deg, #7784C5 0%, #4F60B5 100%)",
            }}
            aria-label="Next"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Scroll track */}
      <div className="mx-auto max-w-[1240px] pl-[5%]">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
        >
          {INDUSTRIES.map((ind, i) => {
            const cfg = CONFIG[i % CONFIG.length];
            const { cardBg, glowBg, dotClass, iconSmWrap, footerBar, bullet } = cfg;
            const iconUrl = ind.img;

            return (
              <div
                key={ind.name}
                className={`group relative h-[290px] cursor-pointer flex-none snap-start overflow-hidden rounded-2xl border border-[rgba(119,132,197,0.15)] transition-all duration-500 w-[78vw] sm:w-[260px] md:w-[280px] ${cardBg}`}
              >
                {/* Noise texture */}
                <div
                  className={`pointer-events-none absolute inset-0 opacity-[0.04] ${NOISE_BG_CLASS}`}
                />

                {/* Glow orb */}
                <div
                  className={`pointer-events-none absolute left-1/2 top-[38%] size-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[24px] transition-all duration-500 md:group-hover:opacity-30 ${glowBg}`}
                />

                {/* Dark overlay — always on mobile, hover-only on desktop */}
                <div className={OVERSHADOW} />

                {/* Full-card image background — desktop only; mobile keeps the gradient */}
                <Image
                  src={iconUrl}
                  alt={ind.name}
                  fill
                  sizes="280px"
                  className="hidden md:block object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-[8px]"
                />
                <div className="hidden md:block absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/80" />

                {/* Accent dot */}
                <div
                  className={`absolute right-4 top-4 z-10 size-2 rounded-full ${dotClass}`}
                />

                {/* Small circular image — always on mobile, hover on desktop */}
                <div
                  className={`absolute left-4 top-4 z-10 flex size-10 scale-100 items-center justify-center rounded-full opacity-100 transition-all duration-500 md:scale-50 md:opacity-0 md:group-hover:scale-100 md:group-hover:opacity-100 overflow-hidden ${iconSmWrap}`}
                >
                  <Image
                    src={iconUrl}
                    alt={ind.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Footer — desktop default only */}
                <div
                  className={`absolute bottom-0 left-0 right-0 translate-y-3 px-5 py-4 opacity-0 transition-all duration-500 md:translate-y-0 md:opacity-100 md:group-hover:translate-y-3 md:group-hover:opacity-0 ${footerBar}`}
                >
                  <p className="mb-0 mt-0 font-bold leading-tight text-white text-sm">
                    {ind.name}
                  </p>
                </div>

                {/* Rich content — always on mobile, hover on desktop */}
                <div className="pointer-events-auto absolute inset-0 z-[5] flex translate-y-0 flex-col justify-start p-5 pt-[70px] opacity-100 transition-all duration-500 md:pointer-events-none md:translate-y-3 md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100">
                  <h3 className="mb-2 text-base font-extrabold text-[#f8f7ff]">
                    {ind.name}
                  </h3>
                  <div className="mb-4 flex flex-col gap-2">
                    {ind.points.map((pt, pi) => (
                      <div key={pi} className="flex items-start gap-2">
                        <div
                          className={`mt-1.5 size-[5px] shrink-0 rounded-full ${bullet}`}
                        />
                        <span className="text-[11px] leading-tight text-[#e8e4fc]">
                          {pt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

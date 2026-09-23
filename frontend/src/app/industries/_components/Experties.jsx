"use client";

import { useRef, useEffect } from "react";
import {
  FiRepeat,
  FiTrendingUp,
  FiClipboard,
  FiUsers,
  FiLayers,
  FiCamera,
  FiChevronRight,
} from "react-icons/fi";
import { resolveIcon } from "@/app/country/_components/shared";
import resolveImageUrl from "@/utils/resolveImageUrl";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const AUTO_INTERVAL = 3500;

const DEFAULT_PLATFORMS = [
  {
    num: "01",
    icon: FiRepeat,
    title: "Property Marketplace Platform",
    subtitle: "Listing Aggregation, Search & Discovery",
    features: [
      "Large-scale MLS data ingest",
      "Geospatial search & filtering",
      "Agent network & listings",
      "Mobile-first UX",
    ],
  },
  {
    num: "02",
    icon: FiTrendingUp,
    title: "Real Estate Investment Platform",
    subtitle: "Big Data, Machine Learning",
    features: [
      "Investment analytics",
      "Deal management",
      "Portfolio tracking",
      "Market forecasting",
    ],
  },
  {
    num: "03",
    icon: FiClipboard,
    title: "Property Management System",
    subtitle: "Operations, Compliance, Payments",
    features: [
      "Lease management",
      "Maintenance requests",
      "Tenant portals",
      "Accounting integrations",
    ],
  },
  {
    num: "04",
    icon: FiUsers,
    title: "Broker & Agent CRM",
    subtitle: "Brokerage, Workflow, Commissions",
    features: [
      "Lead capture & assignment",
      "Team collaboration",
      "Transaction pipelines",
      "Automated workflows",
    ],
  },
  {
    num: "05",
    icon: FiLayers,
    title: "PropTech SaaS Platform",
    subtitle: "Multi-tenant, Extensibility, Security",
    features: [
      "Subscription billing",
      "Third-party integrations",
      "White-label deployment",
      "API-first design",
    ],
  },
  {
    num: "06",
    icon: FiCamera,
    title: "Virtual Property Experience Platform",
    subtitle: "3D Tours, VR/AR, Immersive Tech",
    features: [
      "Advanced filtering",
      "Virtual site visits",
      "In-app chat",
      "Saved searches/alerts",
    ],
  },
];

export default function Experties({ data }) {
  const platforms = data?.items?.length > 0
    ? data.items.map((it, idx) => {
        const isImg = typeof it.icon === "string" && (it.icon.startsWith("/") || it.icon.startsWith("http"));
        return {
          ...it,
          num: it.num || String(idx + 1).padStart(2, "0"),
          icon: isImg ? null : (typeof it.icon === "string" ? resolveIcon(it.icon, FiLayers) : (it.icon || FiLayers)),
          imgSrc: isImg ? resolveImageUrl(it.icon) : null,
          features: Array.isArray(it.features)
            ? it.features
            : typeof it.features === "string"
            ? it.features.split("\n").filter(Boolean)
            : [],
        };
      })
    : DEFAULT_PLATFORMS;
  const eyebrow = data?.eyebrow;
  const heading = data?.heading || "Purpose-Built Platforms For Every Real Estate Business Model";
  const subtitle = data?.subtitle || "We Build Custom Software For Residential Marketplaces, Commercial Platforms, Property Management, Brokerage CRMs, And More. Each Solution Is Tailored To Your Unique Workflows And Growth Objectives.";
  const trackRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      const el = trackRef.current;
      if (!el || window.matchMedia("(min-width: 1024px)").matches) return;
      const step = el.clientWidth * 0.85;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: step, behavior: "smooth" });
    }, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24 font-figtree">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="text-left md:text-center mb-10 sm:mb-12 lg:mb-14 max-w-[1100px] mx-auto">
          {eyebrow && (
            <p className="text-[#4A5565] text-[12px] sm:text-[13px] lg:text-[14px] font-semibold uppercase tracking-[0.12em] mb-3 sm:mb-4">
              {eyebrow}
            </p>
          )}
          <h2 className="text-[#191A2E] text-[24px] sm:text-[28px] font-bold leading-tight sm:leading-8 capitalize mb-4">
            {heading}
          </h2>
          <div
            className="text-[#191A2E] text-sm sm:text-base font-normal max-w-[940px] mx-auto leading-relaxed capitalize [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: processHtmlLinks(subtitle) }}
          />
        </div>

        {/* Timeline icons row (desktop only — hidden on stacked layouts) */}
        <div className="hidden lg:flex items-center justify-between w-full mb-10 px-1">
          {platforms.map(({ icon: Icon, imgSrc, title }, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="w-[clamp(48px,4.2vw,64px)] h-[clamp(48px,4.2vw,64px)] aspect-square rounded-full bg-[#1D1F4B] flex items-center justify-center shadow-md flex-shrink-0">
                {imgSrc
                  ? <img src={imgSrc} alt={title || "Platform icon"} className="w-[24px] h-[24px] object-contain brightness-0 invert" />
                  : <Icon className="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px]" color="white" />
                }
              </div>
              {i < platforms.length - 1 && (
                <div className="flex items-center flex-1 mx-2">
                  <span className="w-2 h-2 rounded-full bg-[#1D1F4B] flex-shrink-0" />
                  <div className="flex-1 border-t-2 border-dashed border-[#1D1F4B]" />
                  <span className="w-2 h-2 rounded-full bg-[#1D1F4B] flex-shrink-0" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Platform cards — slider on mobile/tablet, grid on lg+ */}
        <div
          ref={trackRef}
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
          onTouchStart={() => {
            pausedRef.current = true;
          }}
          onTouchEnd={() => {
            setTimeout(() => {
              pausedRef.current = false;
            }, 1500);
          }}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-6 lg:gap-0 lg:overflow-visible lg:snap-none lg:pb-0 lg:border lg:border-[#E4E4E4] lg:rounded-xl lg:overflow-hidden"
        >
          {platforms.map(({ num, icon: Icon, imgSrc, title, subtitle, features }, i) => (
            <div
              key={i}
              className={`flex-none w-[78vw] sm:w-[300px] snap-start lg:w-auto lg:flex-auto bg-white p-4 lg:p-5 flex flex-col gap-3 lg:gap-4 rounded-xl lg:rounded-none border lg:border-0 border-[#E4E4E4] ${
                i < platforms.length - 1 ? "lg:border-r lg:border-[#E4E4E4]" : ""
              }`}
            >
              {/* Mobile-only icon (timeline hidden below lg) */}
              <div className="lg:hidden w-12 h-12 rounded-full bg-[#1D1F4B] flex items-center justify-center">
                {imgSrc
                  ? <img src={imgSrc} alt={title || "Platform icon"} className="w-[22px] h-[22px] object-contain brightness-0 invert" />
                  : <Icon size={22} color="white" />
                }
              </div>

              {/* Number badge — desktop only */}
              <div className="hidden lg:flex w-8 h-8 rounded-full bg-[#1D1F4B] items-center justify-center">
                <span className="text-white text-[11px] font-medium leading-none">
                  {num}
                </span>
              </div>

              {/* Title & subtitle */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[#101828] text-[16px] sm:text-[18px] font-semibold leading-[1.3]">
                  {title}
                </h3>
                <p className="text-[#7784C5] text-[13px] sm:text-[14px] font-medium leading-[1.4]">
                  {subtitle}
                </p>
              </div>

              {/* Feature list */}
              <ul className="flex flex-col gap-1.5 mt-1">
                {features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="mt-[7px] w-[5px] h-[5px] rounded-full bg-[#1D1F4B] flex-shrink-0" />
                    <span className="text-[#4A5565] text-[13px] sm:text-[14px] leading-[1.5]">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        {/* <div className="flex justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-1.5 w-full max-w-[340px] py-3.5 px-6 rounded-full bg-gradient-to-r from-[#7784C5] via-[#4F60B5] to-[#4F5581] shadow-[0_10px_30px_rgba(0,0,0,0.2)] outline outline-[1.5px] outline-[#889AF5] -outline-offset-[1.5px] no-underline text-white text-[15px] sm:text-[16px] font-medium transition-transform hover:-translate-y-0.5"
          >
            See All Platforms
            <FiChevronRight size={18} />
          </a>
        </div> */}
      </div>
    </section>
  );
}

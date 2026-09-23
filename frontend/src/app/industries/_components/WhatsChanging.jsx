"use client";

import Image from "next/image";
import resolveImageUrl from "@/utils/resolveImageUrl";
import {
  FiZap,
  FiLayers,
  FiCloud,
  FiFileText,
  FiBarChart2,
  FiChevronRight,
} from "react-icons/fi";
import { resolveIcon } from "@/app/country/_components/shared";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const DEFAULT_TRENDS = [
  {
    num: "01",
    icon: FiZap,
    title: "Generative AI is Reshaping Property Search",
    desc: "Natural language queries and AI-powered recommendations are replacing traditional search filters and making discovery intuitive.",
  },
  {
    num: "02",
    icon: FiLayers,
    title: "PropTech Consolidation is Creating Platform Winners",
    desc: "Scale, data, and comprehensive ecosystems are becoming competitive advantages that smaller point solutions cannot replicate.",
  },
  {
    num: "03",
    icon: FiCloud,
    title: "Cloud-Native Infrastructure Becoming the Default",
    desc: "Legacy on-premise systems are being replaced by cloud-native architectures that enable rapid scaling and global deployment.",
  },
  {
    num: "04",
    icon: FiFileText,
    title: "Automated Document Workflows Cutting Overhead",
    desc: "AI-driven document processing is eliminating manual review cycles and accelerating deal timelines significantly.",
  },
  {
    num: "05",
    icon: FiBarChart2,
    title: "Predictive Analytics Driving Investment Decisions",
    desc: "Data-driven insights are replacing intuition in property investment, tenant acquisition, and portfolio management.",
  },
];


const toPlainText = (html) =>
  String(html || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

export default function WhatsChanging({ data }) {
  const trends = data?.items?.length > 0
    ? data.items.map((it, idx) => ({
        ...it,
        num: it.num || String(idx + 1).padStart(2, "0"),
        icon: resolveIcon(it.icon, FiZap),
      }))
    : DEFAULT_TRENDS;
  const eyebrow = data?.eyebrow;
  const heading = data?.heading;
  const subtitle = data?.subtitle || "";
  const defaultSubtitle = "The Market Has Shifted. What Worked Five Years Ago Won't Work Today, And The Next Decade Will Be Built By Those Who Adapt. Here Are The Transformation Drivers.";
  const rawSectionImage = data?.image || "";
  const sectionImage = rawSectionImage ? resolveImageUrl(rawSectionImage) : null;
  const sectionImageAlt = data?.imageAlt || "Industry Technology";

  return (
    <section className="w-full bg-[#F8FAFF] py-16 sm:py-20 lg:py-24 font-figtree">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 lg:gap-12 xl:gap-16 items-start">

          {/* Left column — sticky */}
          <div className="flex flex-col gap-5 lg:gap-6 lg:sticky lg:top-24">
            {eyebrow && (
              <p className="text-[#4A5565] text-[12px] sm:text-[13px] lg:text-[14px] font-semibold uppercase tracking-[0.12em]">
                {eyebrow}
              </p>
            )}
            <h2 className="text-[#191A2E] text-[24px] sm:text-[28px] font-bold leading-tight sm:leading-8 capitalize">
              {heading ? (
                heading
              ) : (
                <>
                  Real Estate Technology Trends Shaping The Industry In{" "}
                  <span className="text-[#7784C5]">2025 And Beyond.</span>
                </>
              )}
            </h2>
            <div
              className="text-[#191A2E] text-sm sm:text-base font-normal leading-relaxed [&_p]:m-0"
              dangerouslySetInnerHTML={{ __html: processHtmlLinks(subtitle || defaultSubtitle) }}
            />

            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mt-2">
              {sectionImage ? (
                <Image
                  src={sectionImage}
                  alt={sectionImageAlt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/industries_page/hero.png"
                  alt={sectionImageAlt || "Industry technology trends visual"}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>

          </div>

          {/* Right column */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {trends.map((trend, i) => {
              const Icon = trend.icon;
              return (
                <div key={i} className="flex items-stretch gap-3 sm:gap-4 min-h-[80px]">
                  {/* Number badge */}
                  <div
                    className="hidden lg:flex w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] lg:w-[54px] lg:h-[54px] rounded-full items-center justify-center flex-shrink-0 self-center"
                    style={{
                      background: "linear-gradient(180deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)",
                    }}
                  >
                    <span className="text-white text-[14px] sm:text-[15px] lg:text-[16px] font-medium leading-none">
                      {trend.num}
                    </span>
                  </div>

                  {/* Card */}
                  <div className="flex-1 flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                    <div className="w-[48px] h-[48px] sm:w-[54px] sm:h-[54px] lg:w-[58px] lg:h-[58px] rounded-[10px] bg-[#1D1F4B] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px]" color="white" />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <h3 className="text-[#101828] text-[15px] sm:text-[16px] font-semibold leading-[1.35] m-0">
                        {trend.title}
                      </h3>
                      <p className="text-[#4A5565] text-[13px] sm:text-[14px] leading-[1.6] m-0">
                        {toPlainText(trend.desc || trend.description)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

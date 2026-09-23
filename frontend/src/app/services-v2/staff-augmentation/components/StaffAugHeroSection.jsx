"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import HeroBreadcrumb from "@/components/HeroBreadcrumb";

// Figma node 1029:3224 — the headline gradient is a shallower ramp than the
// web-development hero's (8.62deg vs 26.78deg), so it is kept separate rather
// than shared.
const HEADLINE_GRADIENT =
  "linear-gradient(8.62deg, #7784C5 33.662%, #B7BEED 48.02%, #6077EC 58.532%, #7683C5 85.197%)";

const CTA_GRADIENT = "linear-gradient(90deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)";

export default function StaffAugHeroSection({ data } = {}) {
  const heading = data?.heading || "Staff Augmentation";
  const headingAccent = data?.headingAccent || "Company";
  const dynParas = (data?.paragraphs || []).filter(Boolean);
  const hasDynParas = dynParas.length > 0;
  const cta1TextRaw = data?.cta1Text || "Get free consultation";
  const cta1Link = data?.cta1Link || "/post-requirement";
  const cta2TextRaw = data?.cta2Text || "View our work";
  const cta2Link = data?.cta2Link || "/case-studies";

  // Enforce lowercase on key words to match the Figma spec design in the screenshot
  const cta1TextFormatted = cta1TextRaw
    .replace("Free", "free")
    .replace("Consultation", "consultation");
  const cta2TextFormatted = cta2TextRaw
    .replace("Our", "our")
    .replace("Work", "work");

  return (
    <section className="relative overflow-hidden lg:flex-1 lg:flex lg:items-center">
      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 pt-20 sm:px-8 sm:pt-24 lg:px-16 lg:pt-0 lg:pb-0">
        <HeroBreadcrumb
          align="center"
          className="mb-0"
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "Staff Augmentation" },
          ]}
        />

        <div className="mx-auto mt-3 flex w-full max-w-[915px] flex-col items-center gap-[18px] text-center lg:mt-[43px]">
          {/* The accent half stays solid white on purpose: a fully bg-clip-text
              headline is not an LCP candidate, so the largest opaque text on
              this hero has to be real painted glyphs. */}
          <h1
            className="font-figtree font-normal capitalize text-[clamp(1.75rem,3.6vw,3.125rem)] tracking-[-0.01em]"
            style={{ lineHeight: 1.08 }}
          >
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADLINE_GRADIENT }}>
              {heading}{" "}
            </span>
            <span className="text-white">{headingAccent}</span>
          </h1>

          <div className="flex w-full flex-col gap-[1em] font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[16px] lg:text-[18px] [&_p]:m-0">
            {hasDynParas ? (
              dynParas.map((p, i) => (
                <div
                  key={i}
                  dangerouslySetInnerHTML={{ __html: p.replace(/“|”|&ldquo;|&rdquo;/g, '"') }}
                />
              ))
            ) : (
              <p className="m-0">
                Most hiring plans die in the six weeks between "we need a senior backend
                engineer" and someone actually starting. Akoode is a staff augmentation company
                that closes that gap. We place vetted engineers, designers and QA specialists directly
                inside your team, working your sprints, your tools and your standups, so a skill gap
                stops being a quarter-long project of its own.
              </p>
            )}
          </div>

          {/* CTAs — Figma 1029:3226: centered w-fit buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 w-full">
            <Link
              href={cta1Link}
              className="inline-flex items-center justify-center gap-[5px] rounded-[40px] border-[1.5px] px-[28px] py-[12px] font-figtree font-medium leading-6 text-white text-[15px] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95"
              style={{ background: CTA_GRADIENT, borderColor: "#889AF5", boxShadow: "0px 10px 15px rgba(0,0,0,0.3)" }}
            >
              {cta1TextFormatted}
              <ChevronRight size={16} />
            </Link>
            {cta2TextRaw && cta2Link && (
              <Link
                href={cta2Link}
                className="inline-flex items-center justify-center rounded-[40px] border-[1.5px] px-[28px] py-[12px] font-figtree font-medium leading-6 text-white text-[15px] transition-colors duration-300 hover:bg-white/5"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                {cta2TextFormatted}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

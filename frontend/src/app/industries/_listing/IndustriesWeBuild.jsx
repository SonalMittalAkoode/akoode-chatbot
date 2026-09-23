"use client";

import { useState } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import { getIndustryIcon } from "@/utils/industryIcons";

// Smaller screens (single-column) only show a few cards at first, then reveal
// more on demand; sm+ (the grid) always shows everything.
const INITIAL_MOBILE = 4;
const MOBILE_STEP = 2;

// Clamp a description to roughly the card word-count shown in the design
// (keeps every card visually balanced regardless of the source length).
const MAX_WORDS = 24;
const clampWords = (text = "") => {
  const words = String(text).replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (words.length <= MAX_WORDS) return words.join(" ");
  return words.slice(0, MAX_WORDS).join(" ") + "…";
};

export default function IndustriesWeBuild({ items = [], data }) {
  const heading       = data?.heading       || "The Industries";
  const headingAccent = data?.headingAccent || "We Build For";
  const intro         = data?.intro         || "Deep domain knowledge, production-grade engineering, and team models that scale with your delivery timeline.";

  // Mobile-only "view more" — extra cards stay in the DOM (good for SEO/crawlers)
  // and are just hidden via CSS below sm until revealed.
  const [mobileVisible, setMobileVisible] = useState(INITIAL_MOBILE);

  // Fully data-driven — nothing renders without live industries.
  if (!items?.length) return null;

  return (
    <section className="relative font-figtree pb-20 pt-4 lg:pb-24">
      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
        {/* heading */}
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="ind-h2 text-center"
        >
          <span className="text-white">{heading} </span>
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(90deg, #7784C5 3%, #B7BEED 30%, #6077EC 50%, #7683C5 100%)" }}
          >
            {headingAccent}
          </span>
        </m.h2>
        <m.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="ind-lead capitalize mx-auto mt-4 max-w-[900px] text-center"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          {intro}
        </m.p>

        {/* card grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map((ind, i) => {
            const Icon = getIndustryIcon(ind.slug);
            const href = ind.slug ? `/industries/${ind.slug}` : "#";
            return (
              <m.div
                key={ind.slug || ind.name || i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: (i % 5) * 0.06 }}
                className={`group flex flex-col rounded-[24px] bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)] ${i >= mobileVisible ? "max-sm:hidden" : ""}`}
                style={{ outline: "0.8px solid #E8ECF5", outlineOffset: "-0.8px" }}
              >
                {/* icon */}
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-[13px] sm:h-14 sm:w-14 sm:rounded-[16px]"
                  style={{ background: "#1D1F4B", outline: "0.8px solid #E5EAFF", outlineOffset: "-0.8px" }}
                >
                  <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6" strokeWidth={1.7} />
                </span>

                {/* title */}
                <h3 className="ind-card-title mt-5" style={{ color: "#1D2033" }}>
                  {ind.name}
                </h3>

                {/* description */}
                <p className="ind-body mt-2.5 flex-1" style={{ color: "#667085" }}>
                  {clampWords(ind.desc)}
                </p>

                {/* explore link */}
                <Link
                  href={href}
                  className="ind-btn mt-3 inline-flex items-center gap-[5px]"
                  style={{ color: "#1D1F4B" }}
                >
                  Explore {ind.name}
                  <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </m.div>
            );
          })}
        </div>

        {/* mobile-only "view more" — reveals MOBILE_STEP cards per tap (sm+ shows all) */}
        {mobileVisible < items.length && (
          <div className="mt-8 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setMobileVisible((c) => Math.min(c + MOBILE_STEP, items.length))}
              className="ind-btn inline-flex items-center gap-2 rounded-full px-7 py-3 text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(90deg, #7784C5 0%, #4F60B5 55%, #4F5581 100%)", outline: "1.5px solid #889AF5", outlineOffset: "-1.5px" }}
            >
              View More
              <ChevronDown size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

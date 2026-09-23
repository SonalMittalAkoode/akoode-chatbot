"use client";

import React, { useEffect, useMemo, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { hasHtmlContent, sanitizeRichText } from "@/utils/safeRichText";
import { resolveImageAlt } from "@/utils/imageAlt";

const buildAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_FRONTEND_API_URL) ||
    "";
  if (!base) {
    return path.startsWith("/") ? path : `/${path}`;
  }
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

const headingVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const mapSteps = (steps) => {
  if (!Array.isArray(steps)) return [];
  return steps
    .map((step, index) => {
      const title = step?.titlestep ?? step?.title ?? "";
      const description = step?.descriptionstep ?? step?.description ?? "";
      const image = step?.imageurl || step?.imagestep || step?.imageUrl || "";

      if (!title && !description) {
        return null;
      }

      return {
        id: step?._id ?? step?.id ?? `industry-step-${index}`,
        title,
        description,
        image: buildAssetUrl(image),
        imageAlt: step?.imagealt || "",
      };
    })
    .filter(Boolean);
};

const stripHtml = (html) =>
  (html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

export default function Industry1SectionArea({ heading = "", description = "", steps = [] }) {
  const dynamicTabs = useMemo(() => mapSteps(steps), [steps]);
  const [activeTabId, setActiveTabId] = useState(dynamicTabs[0]?.id || "");

  useEffect(() => {
    if (!activeTabId && dynamicTabs[0]?.id) {
      setActiveTabId(dynamicTabs[0].id);
    }
  }, [dynamicTabs]);

  if (!dynamicTabs || dynamicTabs.length === 0) {
    return null;
  }

  const activeTab = dynamicTabs.find((t) => t.id === activeTabId) || dynamicTabs[0];





  return (
    <div className="relative z-[1] py-2 md:py-[80px] bg-[#f8faff]" id="industries">
      {/* SEO: full list of all tabs (title + description) rendered in DOM so crawlers
          index every entry — not only the currently-active tab. Visually hidden via
          sr-only utility (position:absolute, clip-path); still in the HTML payload. */}
      <div className="sr-only">
        {heading && <h2>{stripHtml(heading)}</h2>}
        {dynamicTabs.map((tab) => (
          <div key={`seo-${tab.id}`}>
            <h3>{stripHtml(tab.title)}</h3>
            <p>{stripHtml(tab.description)}</p>
          </div>
        ))}
      </div>

      <div className="container font-figtree mx-auto px-[2rem] lg:px-[70px]">
        {/* Header Section */}
        {heading && (
          <div className="max-w-3xl mx-auto text-center mb-8 md:mb-16">
            <m.h2
              aria-label={heading}
              initial="hidden"
              variants={headingVariants}
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[#1a1a1a] font-bold text-[24px] sm:text-[28px] leading-tight sm:leading-8 transition-colors duration-400"
            >
              {heading.split("").map((char, index) => (
                <m.span aria-hidden="true" key={index} variants={letterVariants}>
                  {char}
                </m.span>
              ))}
            </m.h2>
            {description && (
              hasHtmlContent(description) ? (
                <div
                  className="mt-3 text-sm md:text-base text-[#505169] leading-relaxed prose prose-sm max-w-none [&_a]:text-[#474972] [&_a]:underline [&_a]:font-medium"
                  dangerouslySetInnerHTML={{ __html: sanitizeRichText(description) }}
                />
              ) : (
                <p className="mt-3 text-sm md:text-base text-[#505169] leading-relaxed">
                  {stripHtml(description)}
                </p>
              )
            )}
          </div>
        )}

        {/* --- MOBILE ACCORDION (Hidden on MD and up) --- */}
        <div className="md:hidden space-y-3">
          {dynamicTabs.map((tab) => (
            <div key={tab.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <button
                onClick={() => setActiveTabId(activeTabId === tab.id ? "" : tab.id)}
                className={`w-full flex items-center justify-between p-3 text-left transition-all duration-300 ${activeTabId === tab.id ? "bg-[#474972] text-white" : "text-[#010225] hover:bg-gray-50"
                  }`}
              >
                <span className="text-[16px] font-bold">{stripHtml(tab.title)}</span>
                <m.div animate={{ rotate: activeTabId === tab.id ? 180 : 0 }}>
                  <ChevronDown size={18} />
                </m.div>
              </button>
              <AnimatePresence initial={false}>
                {activeTabId === tab.id && (
                  <m.div
                    initial={{ maxHeight: 0, opacity: 0 }}
                    animate={{ maxHeight: 500, opacity: 1 }}
                    exit={{ maxHeight: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-white">
                      {hasHtmlContent(tab.description) ? (
                        <div
                          className="text-[15px] leading-relaxed text-[#505169]"
                          dangerouslySetInnerHTML={{ __html: sanitizeRichText(tab.description) }}
                        />
                      ) : (
                        <p className="text-[15px] leading-relaxed text-[#505169]">{tab.description}</p>
                      )}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* --- DESKTOP TWO-COLUMN LAYOUT (Hidden on small screens) --- */}
        <div className="hidden md:flex gap-10 items-start">

          {/* Sidebar — shows 5 items at a time, rest scroll */}
          <div className="w-[260px] lg:w-[290px] shrink-0">
            <div className="overflow-y-auto scrollbar-show space-y-1 p-2 pr-3" style={{ maxHeight: '246px' }}>
              {dynamicTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`w-full flex items-center group px-3 py-2.5 rounded-xl text-[15px] font-bold transition-all duration-200 ${
                    activeTabId === tab.id
                      ? "bg-[#474972] text-white shadow-md"
                      : "text-[#505169] hover:bg-[#f0f3ff] hover:text-[#474972]"
                  }`}
                >
                  <span className="text-left leading-snug">{stripHtml(tab.title)}</span>
                  <ChevronRight
                    size={15}
                    className={`ml-auto shrink-0 transition-all duration-200 ${
                      activeTabId === tab.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0 bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 overflow-y-auto">
            <AnimatePresence mode="wait">
              <m.div
                key={activeTab.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="text-[24px] font-bold text-[#010225] mb-0">{stripHtml(activeTab.title)}</h3>
                <div className="w-16 h-[2px] bg-[#474972] rounded-full mb-4" />

                {hasHtmlContent(activeTab.description) ? (
                  <div
                    className="text-[17px] lg:text-[18px] leading-relaxed text-[#505169] max-w-4xl"
                    dangerouslySetInnerHTML={{ __html: sanitizeRichText(activeTab.description) }}
                  />
                ) : (
                  <p className="text-[17px] lg:text-[18px] leading-relaxed text-[#505169] max-w-4xl">{activeTab.description}</p>
                )}
              </m.div>
            </AnimatePresence>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `
          .scrollbar-show::-webkit-scrollbar {
            width: 3px;
            display: block;
          }
          .scrollbar-show::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .scrollbar-show::-webkit-scrollbar-thumb {
            background: #474972;
            border-radius: 10px;
          }
          .scrollbar-show::-webkit-scrollbar-thumb:hover {
            background: #36385a;
          }
        `}} />
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { hasHtmlContent, normalizeHtml, sanitizeRichText } from "@/utils/safeRichText";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const EASE = [0.25, 0.1, 0.25, 1]; // ease-out curve

export default function Faq5SectionArea({ faqs }) {
  const [openId, setOpenId] = useState(null);

  const faqList = Array.isArray(faqs)
    ? [...faqs].sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
    : [];

  const headingText = "Frequently Asked Questions";

  const renderFaqDescription = (value) => {
    if (!value) return null;

    if (hasHtmlContent(value)) {
      return (
        <div
          className="[&_a]:text-[#474972] [&_a]:underline [&_a]:font-medium"
          dangerouslySetInnerHTML={{
            __html: processHtmlLinks(sanitizeRichText(normalizeHtml(value))),
          }}
        />
      );
    }

    return <div className="[&_a]:text-[#474972] [&_a]:underline [&_a]:font-medium">{value}</div>;
  };

  if (faqList.length === 0) return null;

  return (
    <section className="py-14 bg-[#fcfdfc] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#EEF2FF] rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#F0F9FF] rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Badge & Heading — single motion for performance */}
        <div className="text-center mb-8 md:mb-12 space-y-1">
          {/* <SectionBadge text="FAQS" variant="light" /> */}
          <m.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: EASE }}
            className="text-[#1a1a1a] font-bold text-[24px] sm:text-[28px] leading-tight sm:leading-8 transition-colors duration-400"
          >
            {headingText}
          </m.h2>
        </div>

        {/* FAQ list — CSS grid accordion for smooth height, no layout thrashing */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {faqList.map((item, index) => {
            const itemId = item._id || index + 1;
            const isOpen = openId === itemId;

            return (
              <div
                key={itemId}
                className={`relative border-2 rounded-xl overflow-hidden bg-[linear-gradient(135deg,rgb(255,255,255),rgba(248,249,250,0.3))] transition-shadow duration-300 ease-out ${isOpen
                  ? "border-[#474972] shadow-xl z-20"
                  : "border-[#474972] shadow-sm z-10 hover:border-[#474972]/60 hover:shadow-md"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : itemId)}
                  className="w-full flex items-center gap-4 md:gap-6 p-3 md:p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#474972] focus-visible:ring-offset-2 rounded-xl"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${itemId}`}
                  id={`faq-question-${itemId}`}
                >
                  {/* Number Circle */}
                  <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 bg-[#474972] rounded-full flex items-center justify-center text-white text-sm md:text-base font-bold shadow-md">
                    {index + 1}
                  </div>

                  {/* Question */}
                  <span className="flex-grow text-[16px] md:text-[18px] font-medium pr-4 leading-tight font-figtree text-[#212529]">
                    {item.title}
                  </span>

                  {/* Toggle Icon */}
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#474972] text-white transition-transform duration-200 ease-out"
                    aria-hidden
                  >
                    {isOpen ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Answer — always rendered in DOM so crawlers can index it;
                    visually collapsed via max-height when closed. */}
                <div
                  id={`faq-answer-${itemId}`}
                  role="region"
                  aria-labelledby={`faq-question-${itemId}`}
                  inert={!isOpen}
                  className="overflow-hidden transition-[max-height] duration-300 ease-out"
                  style={{ maxHeight: isOpen ? 600 : 0 }}
                >
                  <div className="px-3 md:px-4 pb-6 pt-0 text-[#4A5568] text-[15px] md:text-[16px] leading-relaxed">
                    {renderFaqDescription(item.description)}
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

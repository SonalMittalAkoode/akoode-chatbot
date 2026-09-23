"use client";

import { m } from "framer-motion";

/* Shared design tokens + primitives for the Case Study v2 page sections. */

export const ACCENT = "#7784C5";

/* Reveal-on-scroll wrapper (matches the site's framer-motion feel) */
export function Reveal({ children, className = "", delay = 0, y = 28 }) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </m.div>
  );
}

/* Section heading where part of the text is rendered in the accent colour.
   `lead`/`accent`/`tail` compose the line; `dark` switches base colour. */
export function Heading({ lead, accent, tail = "", dark = false, className = "", eyebrow = "The Akoode advantage" }) {
  return (
    <div className={className}>
      {/* eyebrow pill — compact, matches the FEATURE tag pill */}
      {eyebrow && (
        <div className="mb-4">
          <span
            className={`inline-flex items-center rounded-full border px-4 py-1.5 font-figtree text-[12px] font-medium tracking-[0.3px] ${dark ? "border-white/15 bg-white/[0.06] text-white/90" : "border-[#1D1F4B]/25 bg-[#1D1F4B]/[0.04] text-[#1D1F4B]"}`}
          >
            {eyebrow}
          </span>
        </div>
      )}
      <h2
        className={`font-figtree font-bold capitalize leading-tight sm:leading-8 text-[24px] sm:text-[28px] ${dark ? "text-white" : "text-[#191A2E]"}`}
      >
        {lead}
        {accent && (
          <>
            {" "}
            <span style={{ color: ACCENT }}>{accent}</span>
          </>
        )}
        {tail}
      </h2>
    </div>
  );
}

"use client";

import { m } from "framer-motion";
import { Code2 } from "lucide-react";

// Static "Why Choose … In Gurgaon" section. Content is fixed (not CMS-driven)
// per the Figma; rendered right after the Intro on the mobile-app template.
const PARAGRAPHS = [
  "Gurgaon has emerged as one of India's leading technology hubs, home to a dense ecosystem of skilled mobile app developers, product designers, and engineering teams serving global clients across the US, Europe, and beyond.",
  "Partnering with a mobile app development company in Gurgaon, India, means faster turnaround, transparent communication, and solutions built to international standards, at a fraction of the cost of equivalent teams in Western markets.",
  "Whether you are a startup looking to launch your first app or an enterprise scaling a complex mobile platform, Gurgaon's development companies bring deep domain expertise across iOS, Android, and cross-platform frameworks to deliver applications that perform in real markets.",
];

// Vertical dotted rail — dots fade from 0.45 → 0.08 opacity (matches Figma).
const DOTS = 18;
const dotOpacity = (i) => (0.45 - (i * (0.45 - 0.08)) / (DOTS - 1)).toFixed(2);

const StarBadge = () => (
  <span
    className="flex h-[58px] w-[58px] items-center justify-center rounded-full"
    style={{
      background: "linear-gradient(135deg, #EEF2FF 0%, #DDE5FF 100%)",
      boxShadow: "0 4px 16px rgba(102,121,255,0.12)",
      outline: "0.8px solid rgba(102,121,255,0.18)",
    }}
  >
    <Code2 size={24} strokeWidth={1.8} style={{ color: "#6679FF" }} />
  </span>
);

export default function MadWhyGurgaon() {
  return (
    <section className="py-16 sm:py-20 lg:py-24" style={{ background: "#F8FAFF" }}>
      <div className="mx-auto max-w-[1280px] px-4">
        {/* heading */}
        <m.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-[820px] text-center font-figtree font-bold capitalize leading-tight text-[24px] sm:text-[28px]"
          style={{ color: "#1D1F4B" }}
        >
          What Makes Gurgaon the Right Base for Your {" "}
          <span style={{ color: "#7784C5" }}>Mobile App Development Partner</span>{" "}
          
        </m.h2>

        {/* gradient divider */}
        <div
          className="mx-auto mt-5 h-[3px] w-[52px] rounded"
          style={{ background: "linear-gradient(90deg, #6679FF 0%, #4E6BFF 100%)" }}
        />

        {/* subtitle */}
        <m.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-6 max-w-[920px] text-center font-figtree font-normal leading-[1.7] text-[14px] sm:text-[15px] lg:text-[16px]"
          style={{ color: "#1D1F4B" }}
        >
          Choosing the right mobile app development partner in Gurgaon, India gives your business access to world-class tech talent, cost-effective delivery, and a time zone advantage that keeps projects moving.
        </m.p>

        {/* card */}
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-12 max-w-[1200px] overflow-hidden rounded-[32px] bg-white"
          style={{ boxShadow: "0 20px 50px rgba(20,40,120,0.06)", outline: "0.8px solid #EEF2FF" }}
        >
          <div className="flex">
            {/* left rail (desktop) */}
            <div
              className="hidden w-[120px] shrink-0 flex-col items-center py-11 sm:flex"
              style={{ background: "#FAFBFF", borderRight: "0.8px solid #EEF2FF" }}
            >
              <StarBadge />
              <div className="mt-3.5 flex flex-1 flex-col items-center gap-[5px]">
                {Array.from({ length: DOTS }, (_, i) => (
                  <span
                    key={i}
                    className="h-[3px] w-[3px] rounded-full"
                    style={{ background: `rgba(102,121,255,${dotOpacity(i)})` }}
                  />
                ))}
              </div>
            </div>

            {/* content */}
            <div className="flex flex-1 flex-col justify-center gap-5 px-6 py-9 sm:px-12 sm:py-11">
              {/* mobile badge */}
              <div className="sm:hidden">
                <StarBadge />
              </div>
              {PARAGRAPHS.map((p, i) => (
                <p
                  key={i}
                  className="font-figtree font-normal leading-[1.8] text-[14px] sm:text-[15px] lg:text-[16px]"
                  style={{ color: "#475569" }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

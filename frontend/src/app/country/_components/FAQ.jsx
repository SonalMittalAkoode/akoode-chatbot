"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { splitTitle } from "./shared";
import RichText from "./RichText";

const DEFAULT_QS = [
  { q: "How quickly can a team start?", a: "For hourly and dedicated-pod engagements, within five business days. Fixed-scope projects take an extra 1–2 weeks for the discovery phase to land." },
  { q: "Do you sign NDAs and IP-assignment agreements?", a: "Always. We sign your paper or ours — and source code is pushed to a repository you own from day one." },
  { q: "What happens if we need to scale the team up or down?", a: "Pods flex by ±2 engineers per sprint with 2 weeks notice. We've shrunk and re-grown teams on the same product four times in a row." },
  { q: "Is your work covered under DPDP and GDPR?", a: "Yes. We default to data residency in ap-south-1 (Mumbai), and our SOC 2 Type II report is available under NDA." },
  { q: "Can you work with our existing engineering team?", a: "That's the most common shape. We embed in your slack, attend your stand-ups, and follow your ADR process." },
  { q: "Do you offer post-launch support?", a: "24/7 on-call rotations with documented SLOs are bundled with every dedicated-pod engagement and available as an add-on otherwise." },
];

export function FAQ({ data }) {
  const heading = data?.heading || "Everything teams ask us first.";
  const subtitle =
    data?.subtitle ||
    "Straight answers on timelines, team shape, security, and how we plug into your existing delivery process.";
  const qs = data?.items?.length
    ? data.items.map((item) => ({ q: item.question || "", a: item.answer || "" }))
    : DEFAULT_QS;
  const [open, setOpen] = useState(0);
  return (
    <section className="sbc-section sbc-section--light">
      <div className="sbc-glow-blob sbc-light-blob--tl" aria-hidden="true" />
      <div className="sbc-glow-blob sbc-light-blob--br" aria-hidden="true" />
      <div className="sbc-container flex flex-col items-center relative z-[1]">
        <div className="reveal sbc-section-head w-full mb-12 px-2 sm:mb-16 sm:px-0">
          <h2 className="sbc-h2 sbc-section-title text-[#1a1a1a] font-bold transition-colors duration-400">
            {(() => {
              const { main, accent, suffix } = splitTitle(heading);
              return (
                <>
                  {main} {accent && <span className="sbc-heading-accent">{accent}</span>} {suffix}
                </>
              );
            })()}
          </h2>
          <RichText className="sbc-body-lg sbc-section-subtitle text-[#2a2d52]" html={subtitle} />
        </div>
        <div className="reveal d2 w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 border-t border-[rgba(60,63,106,0.18)]">
          {[0, 1].map((colIndex) => (
            <div key={colIndex} className="flex flex-col">
              {qs.map((q, i) => {
                if (i % 2 !== colIndex) return null;
                const isOpen = open === i;
                return (
                  <div
                    key={`${q.q}-${i}`}
                    className="border-b border-[rgba(60,63,106,0.18)]"
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="w-full text-left flex justify-between items-center gap-4 py-5 px-2 bg-transparent border-0 transition-colors duration-300"
                      style={{
                        fontFamily: "var(--font-figtree), system-ui, sans-serif",
                      }}
                    >
                      <span className="flex-grow text-[16px] md:text-[18px] font-medium pr-4 leading-tight font-figtree text-[#212529]">
                        {q.q}
                      </span>
                      <span
                        className="grid place-items-center flex-shrink-0 w-9 h-9 rounded-full"
                        style={{
                          background: isOpen
                            ? "linear-gradient(135deg, #3a3c80 0%, #5048b0 100%)"
                            : "linear-gradient(135deg, #edeaf8 0%, #e4e0f5 100%)",
                          transform: isOpen ? "rotate(45deg)" : "none",
                          transition: "transform .35s cubic-bezier(.2,.8,.2,1), background .3s",
                          color: isOpen ? "#fff" : "#252747",
                          boxShadow: isOpen ? "0 4px 16px -4px rgba(80,60,200,0.4)" : "none",
                        }}
                      >
                        <FiPlus size={18} strokeWidth={1.5} />
                      </span>
                    </button>
                    <div
                      className="overflow-hidden"
                      style={{
                        maxHeight: isOpen ? 240 : 0,
                        transition: "max-height .45s cubic-bezier(.2,.8,.2,1)",
                      }}
                    >
                      <div className="px-3 md:px-4 pb-6 pt-0 text-[#4A5568] text-[15px] md:text-[16px] leading-relaxed">
                        {q.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

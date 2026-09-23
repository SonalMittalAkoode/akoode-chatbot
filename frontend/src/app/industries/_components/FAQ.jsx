"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const DEFAULT_QS = [
  {
    q: "How quickly can a team start?",
    a: "For hourly and dedicated-pod engagements, within five business days. Fixed-scope projects take an extra 1–2 weeks for the discovery phase to land.",
  },
  {
    q: "Do you sign NDAs and IP-assignment agreements?",
    a: "Always. We sign your paper or ours — and source code is pushed to a repository you own from day one.",
  },
  {
    q: "What happens if we need to scale the team up or down?",
    a: "Pods flex by ±2 engineers per sprint with 2 weeks notice. We've shrunk and re-grown teams on the same product four times in a row.",
  },
  {
    q: "Is your work covered under DPDP and GDPR?",
    a: "Yes. We default to data residency in ap-south-1 (Mumbai), and our SOC 2 Type II report is available under NDA.",
  },
  {
    q: "Can you work with our existing engineering team?",
    a: "That's the most common shape. We embed in your Slack, attend your stand-ups, and follow your ADR process.",
  },
  {
    q: "Do you offer post-launch support?",
    a: "24/7 on-call rotations with documented SLOs are bundled with every dedicated-pod engagement and available as an add-on otherwise.",
  },
];

export default function FAQ({ data }) {
  const QS = data?.items?.length > 0
    ? data.items.map((it) => ({ q: it.question ?? it.q, a: it.answer ?? it.a }))
    : DEFAULT_QS;
  const eyebrow = data?.eyebrow;
  const heading = data?.heading;
  const subtitle = data?.subtitle || "Straight answers on timelines, team shape, security, and how we plug into your existing delivery process.";
  const [open, setOpen] = useState(0);

  return (
    <section
      className="relative py-16 sm:py-20 lg:py-24 px-6 md:px-16 lg:px-24 overflow-hidden font-figtree"
      style={{
        background:
          "linear-gradient(160deg, #f5f3fa 0%, #ebe9f4 50%, #f0eef8 100%)",
      }}
    >
      {/* Glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[80px] -top-[80px] w-[420px] h-[420px] rounded-full blur-[100px] z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(119,132,197,0.22) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[80px] -bottom-[80px] w-[360px] h-[360px] rounded-full blur-[100px] z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(79,96,181,0.18) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-[1] mx-auto max-w-[1240px] flex flex-col items-center">

        {/* Header */}
        <div className="w-full mb-12 sm:mb-16">
          {eyebrow && (
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5"
              style={{
                background: "rgba(29,31,75,0.06)",
                borderColor: "rgba(119,132,197,0.3)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#7784C5]" />
              <span className="text-[#4F5581] text-sm font-medium tracking-wide">
                {eyebrow}
              </span>
            </div>
          )}

          <h2 className="text-[#14153d] text-[24px] sm:text-[28px] font-bold leading-tight sm:leading-8 mb-4">
            {heading ? (
              heading
            ) : (
              <>
                Everything teams{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #7784C5 0%, #889AF5 100%)",
                  }}
                >
                  ask us first.
                </span>
              </>
            )}
          </h2>
          <div
            className="text-[#4A5565] text-sm sm:text-base leading-relaxed max-w-[680px] [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: processHtmlLinks(subtitle) }}
          />
        </div>

        {/* 2-column accordion grid */}
        <div
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 border-t"
          style={{ borderColor: "rgba(119,132,197,0.2)" }}
        >
          {[0, 1].map((col) => (
            <div key={col} className="flex flex-col">
              {QS.map((item, i) => {
                if (i % 2 !== col) return null;
                const isOpen = open === i;
                return (
                  <div
                    key={i}
                    className="border-b"
                    style={{ borderColor: "rgba(119,132,197,0.2)" }}
                  >
                    <h3 className="m-0">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="w-full text-left flex justify-between items-center gap-4 py-5 px-2 bg-transparent border-0 transition-colors duration-300"
                    >
                      <span className="flex-grow text-[16px] md:text-[18px] font-medium pr-4 leading-tight text-[#14153d]">
                        {item.q}
                      </span>
                      <span
                        className="grid place-items-center flex-shrink-0 w-9 h-9 rounded-full transition-all duration-300"
                        style={{
                          background: isOpen
                            ? "linear-gradient(135deg, #7784C5 0%, #4F60B5 100%)"
                            : "rgba(119,132,197,0.1)",
                          transform: isOpen ? "rotate(45deg)" : "none",
                          color: isOpen ? "#fff" : "#7784C5",
                          boxShadow: isOpen
                            ? "0 4px 16px -4px rgba(119,132,197,0.45)"
                            : "none",
                          border: isOpen
                            ? "none"
                            : "1px solid rgba(119,132,197,0.25)",
                        }}
                      >
                        <FiPlus size={18} strokeWidth={1.5} />
                      </span>
                    </button>
                    </h3>
                    <div
                      className="overflow-hidden"
                      style={{
                        maxHeight: isOpen ? 240 : 0,
                        transition: "max-height .45s cubic-bezier(.2,.8,.2,1)",
                      }}
                    >
                      <div
                        className="px-3 md:px-4 pb-6 pt-0 text-[#4A5565] text-[15px] md:text-[16px] leading-relaxed [&_p]:m-0"
                        dangerouslySetInnerHTML={{ __html: processHtmlLinks(item.a || "") }}
                      />
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

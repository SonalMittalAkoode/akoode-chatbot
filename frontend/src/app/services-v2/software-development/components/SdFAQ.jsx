"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";

const QS = [
  {
    q: "How quickly can a software development team start?",
    a: "For dedicated-team and hourly engagements, within five business days. Fixed-scope projects take an extra 1–2 weeks for the discovery phase to land.",
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

export default function SdFAQ({ data }) {
  const [open, setOpen] = useState(0);
  const heading       = data?.heading       || "Everything teams";
  const headingAccent = data?.headingAccent || "ask us first.";
  const dynItems      = data?.items?.length ? data.items : null;

  return (
    <section
      className="relative py-16 sm:py-20 lg:py-24 px-6 md:px-16 lg:px-24 overflow-hidden font-figtree"
      style={{
        background: "linear-gradient(160deg, #f5f3fa 0%, #ebe9f4 50%, #f0eef8 100%)",
      }}
    >
      {/* Glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[80px] -top-[80px] w-[420px] h-[420px] rounded-full blur-[100px] z-0"
        style={{ background: "radial-gradient(circle, rgba(119,132,197,0.22) 0%, transparent 65%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[80px] -bottom-[80px] w-[360px] h-[360px] rounded-full blur-[100px] z-0"
        style={{ background: "radial-gradient(circle, rgba(79,96,181,0.18) 0%, transparent 65%)" }}
      />

      <div className="relative z-[1] mx-auto max-w-[1240px] flex flex-col items-center">

        {/* Header */}
        <div className="w-full mb-12 sm:mb-16">
          <h2 className="text-[#14153d] text-[24px] sm:text-[28px] font-bold leading-tight sm:leading-8 mb-4">
            {heading}{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #7784C5 0%, #889AF5 100%)" }}
            >
              {headingAccent}
            </span>
          </h2>
          <p className="text-[#4A5565] text-sm sm:text-base leading-relaxed max-w-[680px] m-0">
            Straight answers on timelines, team shape, security, and how we plug into your existing delivery process.
          </p>
        </div>
        <div
          className="w-full columns-1 md:columns-2 gap-x-12 lg:gap-x-16 border-t"
          style={{ borderColor: "rgba(119,132,197,0.2)" }}
        >
          {(dynItems || QS).map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="break-inside-avoid border-b" style={{ borderColor: "rgba(119,132,197,0.2)" }}>
                <h3 className="m-0">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full text-left flex justify-between items-center gap-4 py-5 px-2 bg-transparent border-0 transition-colors duration-300"
                  >
                    <span className="flex-grow text-[15px] md:text-[18px] font-medium pr-3 md:pr-4 leading-snug md:leading-tight text-[#14153d]">
                      {item.q}
                    </span>
                    <span
                      className="grid place-items-center flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full transition-all duration-300"
                      style={{
                        background: isOpen ? "linear-gradient(135deg, #7784C5 0%, #4F60B5 100%)" : "rgba(119,132,197,0.1)",
                        transform: isOpen ? "rotate(45deg)" : "none",
                        color: isOpen ? "#fff" : "#7784C5",
                        boxShadow: isOpen ? "0 4px 16px -4px rgba(119,132,197,0.45)" : "none",
                        border: isOpen ? "none" : "1px solid rgba(119,132,197,0.25)",
                      }}
                    >
                      <FiPlus size={18} strokeWidth={1.5} />
                    </span>
                  </button>
                </h3>
                <div
                  className="overflow-hidden"
                  style={{ maxHeight: isOpen ? 320 : 0, transition: "max-height .45s cubic-bezier(.2,.8,.2,1)" }}
                >
                  <p className="px-2 md:px-4 pb-5 md:pb-6 pt-0 text-[#4A5565] text-[14px] md:text-[16px] leading-relaxed m-0">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

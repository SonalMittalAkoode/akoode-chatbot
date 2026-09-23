"use client";

import Image from "next/image";

// Default awards / press logos shown in the marquee when a page doesn't pass
// its own `logos` prop. Bundled under /public (frontend-local).
const DEFAULT_LOGOS = [
  { name: "Top US-Based IT Services Firm 2026", src: "/clients/us-based.webp" },
  { name: "Clutch",            src: "/whyus_badge/clutch.webp" },
  { name: "Outlook",           src: "/whyus_badge/outlook.webp" },
  { name: "Ai Automation",     src: "/whyus_badge/techreviewer.webp" },
  { name: "Business Standard", src: "/whyus_badge/bsdesktop.webp" },
  { name: "YourStory",         src: "/whyus_badge/yourstory.webp" },
  { name: "Good Firms",        src: "/whyus_badge/goodfirms.webp" },
  { name: "Top Machine Learning Companies - Goodfirms", src: "/clients/godfirms.webp" },
  { name: "Top eCommerce Development Company", src: "/clients/eCommerce_dev.webp" },
  { name: "Entrepreneur",      src: "/strip/strip4.svg" },
  { name: "ZBusiness",         src: "/whyus_badge/zeebiz_logo.svg" },
  { name: "Times of India",    src: "/whyus_badge/toi_logo.png" },
  { name: "Hindustan Times",   src: "/whyus_badge/ht.webp" },
];

// "Awards & Recognitions" dark panel with an auto-scrolling logo marquee.
// Global — shared across services-v2 (software-development, mobile-app,
// ai-development), the country/[market] service pages, and the industries
// pages. Pass `logos` to swap in page-specific badges while keeping this
// same panel design; falls back to the default press list if omitted.
//
// Text uses `!text-white/...` (Tailwind's important-prefix) rather than
// plain `text-white/...` because some host pages wrap everything in a
// `.sbc-page` container that applies a global `p { color: #2a2d52 }` rule —
// without `!important` that rule wins on specificity and the text goes
// invisible against this panel's dark background.
export default function AwardsPanel({ className = "", logos = DEFAULT_LOGOS, style }) {
  return (
    <>
      <style>{`
        @keyframes sd-marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .sd-mq-l { animation: sd-marquee-left 28s linear infinite; }
      `}</style>

      <div
        className={`flex flex-col rounded-[10px] p-5 sm:p-7 w-full min-w-0 overflow-hidden ${className}`}
        style={{
          background: "#1D1F4B",
          border: "1px solid rgba(136,154,245,0.18)",
          boxShadow: "0 30px 60px -15px rgba(16,24,40,0.3)",
          ...style,
        }}
      >
        <div className="flex justify-between items-center mb-3 shrink-0">
          <span className="!text-white text-[15px] sm:text-[16px] font-bold leading-tight">
            Awards & Recognitions
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-[#889AF5]" />
        </div>
        <p className="text-[12px] !text-white/70 mb-6 leading-relaxed shrink-0">
          Recognised by leading platforms, startup ecosystems, and global technology communities.
        </p>

        <div className="flex-1 flex flex-col justify-center overflow-hidden">
          <div className="flex gap-3 w-max sd-mq-l">
            {[...logos, ...logos].map((item, i) => (
              <div
                key={i}
                className="w-[110px] h-[110px] flex-shrink-0 rounded-[10px] flex items-center justify-center p-1.5 bg-white transition-shadow duration-300 hover:shadow-md"
                style={{ border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <Image
                  src={item.src}
                  alt={item.name}
                  width={90}
                  height={90}
                  className={`object-contain w-full h-full${item.src === "/strip/strip4.svg" ? " invert" : ""}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

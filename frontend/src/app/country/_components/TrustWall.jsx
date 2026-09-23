"use client";

import { useState } from "react";
import { splitTitle } from "./shared";

function ClientLogo({ name }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="grid place-items-center py-[50px] px-6 transition-all duration-300"
      style={{
        background: hover
          ? "linear-gradient(135deg, #f0effe 0%, #e8e5fb 100%)"
          : "linear-gradient(135deg, #edeaf8 0%, #e9e6f6 100%)",
        boxShadow: hover ? "inset 0 0 0 1px rgba(100,80,200,0.2)" : "none",
      }}
    >
      <div
        className="flex items-center gap-2 text-[24px] font-bold tracking-[-0.02em] transition-all duration-300"
        style={{
          fontFamily: "var(--font-figtree), system-ui, sans-serif",
          color: hover ? "#18193e" : "rgba(42,45,82,0.62)",
          filter: hover ? "none" : "grayscale(1)",
        }}
      >
        <span
          className="w-3.5 h-3.5 rounded-[4px] transition-[background] duration-300"
          style={{ background: hover ? "linear-gradient(135deg, #4a3ea0, #3a3c80)" : "rgba(42,45,82,0.62)" }}
        />
        {name}
      </div>
    </div>
  );
}

export function TrustWall({ data }) {
  const heading = data?.heading || "Built for teams who don't have time to be patient.";
  const subtitle = data?.subtitle || "Trusted by operators who need clean communication, visible progress, and software that survives real growth.";
  const logos = ["Helio", "Northwave", "Paystack-IN", "Mahala", "Verdant", "Citrine", "Kepler", "Orbit"];
  return (
    <section className="sbc-section sbc-section--light">
      <div className="sbc-glow-blob sbc-light-blob--tl" aria-hidden="true" />
      <div className="sbc-glow-blob sbc-light-blob--br" aria-hidden="true" />
      <div className="sbc-container relative z-[1]">
        <div className="reveal sbc-section-head sbc-section-head--single-title mb-[60px]">
          <h2 className="sbc-h2 sbc-section-title text-[#1a1a1a] font-bold transition-colors duration-400 mb-0">
            {(() => {
              const { main, accent, suffix } = splitTitle(heading);
              return (
                <>
                  {main} {accent && <span className="sbc-heading-accent">{accent}</span>} {suffix}
                </>
              );
            })()}
          </h2>
          <p className="sbc-body-lg sbc-section-subtitle text-[#2a2d52]">
            {subtitle}
          </p>
        </div>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-[20px] overflow-hidden"
          style={{
            background: "rgba(100,80,200,0.20)",
            border: "1px solid rgba(100,80,200,0.20)",
            boxShadow: "0 8px 40px -12px rgba(80,60,180,0.18)",
          }}
        >
          {logos.map((l) => (
            <ClientLogo key={l} name={l} />
          ))}
        </div>
      </div>
    </section>
  );
}

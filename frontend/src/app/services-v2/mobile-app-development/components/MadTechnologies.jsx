"use client";

import { useState } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import resolveAsset, { IS_DEV } from "../resolveAsset";
import madData from "../madData";

export default function MadTechnologies({ data }) {
  // Fall back to static content when the backend doesn't persist these fields.
  const intro = data?.intro || madData.technologies.intro;
  const tabs = data?.tabs?.length ? data.tabs : madData.technologies.tabs;
  const [autoLead, ...autoRestWords] = data?.heading ? data.heading.trim().split(/\s+/) : [];
  const headingLead = data?.headingLead || autoLead || "Technologies";
  const headingRest = data?.headingRest || (autoRestWords.length ? autoRestWords.join(" ") : "") || "We Use For Mobile App Development";
  const [active, setActive] = useState(0);

  const count = tabs.length || 1;
  const activeTab = tabs[active] || tabs[0];
  // Only render logos that actually have an image (CMS rows may be incomplete).
  const featured = (activeTab?.logos || []).filter((l) => l?.img);

  return (
    <section className="py-16 sm:py-20 lg:py-24" style={{ background: "#fcfdfc" }}>
      <div className="max-w-[1240px] mx-auto px-4">
        {/* heading */}
        <div className="text-center max-w-[920px] mx-auto mb-12">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-figtree font-bold text-[24px] sm:text-[28px] capitalize leading-tight mb-5"
          >
            {headingLead && (
              <>
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg, #7784C5 0%, #B7BEED 35%, #6077EC 70%, #7683C5 100%)" }}
                >
                  {headingLead}
                </span>{" "}
              </>
            )}
            <span style={{ color: "#1D1F4B" }}>{headingRest}</span>
          </m.h2>
          {intro && (
            <m.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-figtree text-[14px] sm:text-[15px] leading-[1.7]"
              style={{ color: "#434A77" }}
            >
              {intro}
            </m.p>
          )}
        </div>

        {/* featured logos for active tab */}
        <m.div
          key={`logos-${active}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 mb-14"
        >
          {featured.map((logo, i) => (
            <div key={logo.label || i} className="flex items-center gap-3">
              <Image
                src={resolveAsset(logo.img)}
                alt={logo.label ? `${logo.label} logo` : "Technology logo"}
                width={40}
                height={40}
                className="h-9 w-9 sm:h-10 sm:w-10 object-contain"
                unoptimized={IS_DEV}
              />
              <span className="font-figtree font-s  emibold text-[15px] sm:text-[18px]" style={{ color: "#1D1F4B" }}>
                {logo.label}
              </span>
            </div>
          ))}
        </m.div>

        {/* mobile: 2-column tab grid (no progress bar / no scroll) */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {tabs.map((tab, i) => {
            const isActive = i === active;
            return (
              <button
                key={tab.label || i}
                type="button"
                onClick={() => setActive(i)}
                className="rounded-lg px-3 py-2.5 text-center font-figtree font-medium text-[13px] transition-colors"
                style={
                  isActive
                    ? { background: "linear-gradient(90deg, #6E78C7 0%, #5B6CFF 100%)", color: "#fff" }
                    : { background: "#f4f5fb", color: "#434A77", border: "1px solid rgba(119,132,197,0.2)" }
                }
                aria-pressed={isActive}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* sm+: progress bar track + glowing active segment, labels spread evenly */}
        <div className="hidden sm:block">
          <div className="relative h-[2px] w-full" style={{ background: "#0F172A" }}>
            <span
              aria-hidden
              className="absolute -top-[2px] h-[6px] rounded-full transition-[left] duration-300 ease-out"
              style={{
                width: `${100 / count}%`,
                left: `${(active * 100) / count}%`,
                background: "linear-gradient(90deg, #6E78C7 0%, #5B6CFF 100%)",
                boxShadow: "0 0 12px rgba(91,108,255,0.6)",
              }}
            />
          </div>
          <div className="grid mt-5" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
            {tabs.map((tab, i) => {
              const isActive = i === active;
              return (
                <button
                  key={tab.label || i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`px-2 text-center font-figtree text-[14px] leading-snug transition-colors ${
                    isActive ? "font-semibold" : "font-medium"
                  }`}
                  style={{ color: isActive ? "#1D1F4B" : "#434A77" }}
                  aria-pressed={isActive}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

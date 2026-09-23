"use client";

import { m } from "framer-motion";
import { Sparkles } from "lucide-react";
import { resolveIcon } from "../iconResolver";
import aiData from "../aiData";

// "Specialised AI Capabilities We Build" — left narrative + a 2-column grid of
// capability cells separated by thin periwinkle divider lines (Figma exact).
const D = aiData.capabilities;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }),
};

const DIVIDER = "0.8px solid rgba(109,128,237,0.45)"; // #6D80ED

function CapabilityCell({ item, index, last, first }) {
  const Icon = resolveIcon(item.icon) || Sparkles;
  return (
    <m.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className={`flex flex-col items-start px-7 pb-8 ${first ? "pt-0" : "pt-8"}`}
      style={{ borderBottom: last ? undefined : DIVIDER }}
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-[13px]"
        style={{ background: "#1D1F4B", outline: "0.8px solid rgba(102,121,228,0.22)", outlineOffset: "-0.8px" }}
      >
        <Icon size={22} className="text-white" strokeWidth={1.6} />
      </span>
      <span className="mt-5 block h-[2px] w-[24px] rounded" style={{ background: "#6679E4" }} aria-hidden />
      <h3 className="mt-4 font-figtree font-semibold text-[16px] sm:text-[18px] leading-[1.35]" style={{ color: "#1F2336" }}>
        {item.title}
      </h3>
      <div className="mt-2.5 font-figtree text-[13px] sm:text-[14px] leading-[1.7] [&_p]:m-0" style={{ color: "#475569" }} dangerouslySetInnerHTML={{ __html: item.desc || "" }} />
    </m.div>
  );
}

export default function AiCapabilities({ data }) {
  const heading = data?.heading || D.heading;
  const headingAccent = data?.headingAccent || D.headingAccent;
  const quote = data?.quote || D.quote;
  const paragraph = data?.paragraph || D.paragraph;
  const items = data?.items?.length ? data.items : D.items;

  return (
    <section className="relative pb-16 sm:pb-20 lg:pb-24" style={{ background: "#F8FAFF" }}>
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* left narrative — sticky while the grid scrolls past */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-figtree font-bold capitalize text-[24px] sm:text-[28px] leading-tight sm:leading-8"
            >
              <span style={{ color: "#1D1F4B" }}>{heading} </span>
              <span style={{ color: "#7784C5" }}>{headingAccent}</span>
            </m.h2>

            {quote && (
              <div className="mt-7 flex gap-4">
                <span className="mt-1 w-[3px] shrink-0 rounded" style={{ background: "#8C98D3" }} aria-hidden />
                <p className="font-figtree font-normal capitalize text-sm sm:text-base leading-relaxed" style={{ color: "#1D1F4B" }}>
                  {quote}
                </p>
              </div>
            )}

            {paragraph && (
              <p className="mt-7 font-figtree text-sm sm:text-base leading-relaxed" style={{ color: "#4A5565" }}>
                {paragraph}
              </p>
            )}
          </div>

          {/* right capability columns — content-sized cells, the second column
              staggered down to match the Figma */}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col sm:border-r" style={{ borderColor: "rgba(109,128,237,0.45)" }}>
              {items.filter((_, i) => i % 2 === 0).map((item, idx) => (
                <CapabilityCell key={item.title || idx} item={item} index={idx * 2} first={idx === 0} last={idx === Math.ceil(items.length / 2) - 1} />
              ))}
            </div>
            <div className="flex flex-col sm:pt-8">
              {items.filter((_, i) => i % 2 === 1).map((item, idx) => (
                <CapabilityCell key={item.title || idx} item={item} index={idx * 2 + 1} first={idx === 0} last={idx === Math.floor(items.length / 2) - 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

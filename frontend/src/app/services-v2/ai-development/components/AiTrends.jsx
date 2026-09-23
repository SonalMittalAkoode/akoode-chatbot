"use client";

import { m } from "framer-motion";
import { Sparkles } from "lucide-react";
import { resolveIcon } from "../iconResolver";
import aiData from "../aiData";

// "Where Enterprise AI Stands in 2026" — heading/intro split + a stack of
// horizontal dark-gradient trend cards (icon column with a divider, then text).
const D = aiData.trends;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.06 } }),
};

export default function AiTrends({ data }) {
  const heading = data?.heading || D.heading;
  const headingAccent = data?.headingAccent || D.headingAccent;
  const intro = data?.intro || D.intro;
  const items = data?.items?.length ? data.items : D.items;

  return (
    <section className="relative overflow-hidden pb-16 sm:pb-20 lg:pb-24" style={{ background: "#F8FAFF" }}>
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        {/* heading + intro split */}
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
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

          {intro && (
            <div className="flex gap-4 lg:pt-2">
              <span className="mt-1 w-[3px] shrink-0 rounded" style={{ background: "#8C98D3" }} aria-hidden />
              <p className="font-figtree font-normal capitalize text-sm sm:text-base leading-relaxed" style={{ color: "#1D1F4B" }}>
                {intro}
              </p>
            </div>
          )}
        </div>

        {/* trend cards — horizontal snap-slider on small screens, stacked on lg */}
        <div className="mt-12 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-col lg:gap-6 lg:overflow-visible lg:px-0">
          {items.map((item, i) => {
            const Icon = resolveIcon(item.icon) || Sparkles;
            return (
              <m.div
                key={item.title || i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex w-[85%] shrink-0 snap-start items-stretch overflow-hidden rounded-[24px] sm:w-[60%] lg:w-auto"
                style={{
                  background: "linear-gradient(360deg, #576099 0%, #3A4066 50%, #1D2033 100%)",
                  outline: "0.8px solid #EEF1FF",
                  outlineOffset: "-0.8px",
                }}
              >
                {/* icon column with divider — hidden on small screens */}
                <div
                  className="hidden shrink-0 items-center justify-center px-6 sm:flex sm:px-8"
                  style={{ borderRight: "1.67px solid rgba(182,189,229,0.5)" }}
                >
                  <span
                    className="flex h-[72px] w-[72px] items-center justify-center rounded-[20px]"
                    style={{ background: "#1D1F4B", outline: "1px solid #576099", outlineOffset: "-1px" }}
                  >
                    <Icon size={30} className="text-white" strokeWidth={1.6} />
                  </span>
                </div>

                {/* content */}
                <div className="flex flex-col justify-center px-6 py-7 sm:px-8 sm:py-8">
                  <h3 className="font-figtree font-semibold text-[16px] sm:text-[18px] leading-[1.35] text-white">
                    {item.title}
                  </h3>
                  <div className="mt-3 font-figtree text-[13px] sm:text-[14px] leading-[1.7] [&_p]:m-0" style={{ color: "rgba(255,255,255,0.82)" }} dangerouslySetInnerHTML={{ __html: item.desc || "" }} />
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

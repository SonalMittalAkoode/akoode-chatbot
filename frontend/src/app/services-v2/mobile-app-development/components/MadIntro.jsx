"use client";

import { m } from "framer-motion";
import { Sparkles } from "lucide-react";
import { resolveIcon } from "../iconResolver";
import madData from "../madData";
import AwardsPanel from "@/components/AwardsPanel";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06 },
  }),
};

// Static fallback for sections the current backend schema can't persist yet.
const D = madData.intro;
const nonEmpty = (arr) => (arr || []).filter(Boolean);

export default function MadIntro({ data }) {
  const heading = data?.heading || D.heading;
  const headingAccent = data?.headingAccent || D.headingAccent;
  const paragraphs = nonEmpty(data?.paragraphs).length
    ? nonEmpty(data.paragraphs)
    : D.paragraphs;
  const pills = data?.pills?.length ? data.pills : D.pills;
  const statCards = data?.statCards?.length ? data.statCards : D.statCards;
  const closingParagraphs = nonEmpty(data?.closingParagraphs).length
    ? nonEmpty(data.closingParagraphs)
    : D.closingParagraphs;

  return (
    // Dark backdrop = hero's end colour; the white panel's rounded top corners
    // reveal it, producing the Figma curved dark→white transition.
    <section className="relative" style={{ background: "#101828" }}>
      <div
        className="rounded-t-[44px] sm:rounded-t-[72px] lg:rounded-t-[70px] py-16 sm:py-20 lg:py-24"
        style={{ background: "#fcfdfc" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          {/* heading */}
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-figtree font-bold text-[24px] sm:text-[28px] capitalize leading-tight mb-10"
          >
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #7784C5 3%, #B7BEED 30%, #6077EC 50%, #7683C5 100%)",
              }}
            >
              {heading}
            </span>{" "}
            <span style={{ color: "#1D1F4B" }}>{headingAccent}</span>
          </m.h2>

          {/* top split: paragraphs (left) + feature card & stat cards (right) */}
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-start">
            {/* left: narrative */}
            <div className="space-y-6">
              {paragraphs.map((text, i) => (
                <m.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="font-figtree text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.8] [&_p]:m-0"
                  style={{ color: "#4A5565" }}
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              ))}
            </div>

            {/* right: feature pills card + stat cards */}
            <div className="space-y-6">
              {pills.length > 0 && (
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl bg-white p-7 sm:p-8"
                  style={{
                    border: "1px solid rgba(119,132,197,0.16)",
                    boxShadow: "0 4px 26px rgba(119,132,197,0.08)",
                  }}
                >
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-x-4 gap-y-6">
                    {pills.map((p, i) => {
                      const PillIcon = resolveIcon(p.icon) || Sparkles;
                      return (
                        <div
                          key={p.label || i}
                          className="flex flex-col items-center text-center gap-3"
                        >
                          <span
                            className="flex h-14 w-14 items-center justify-center rounded-full"
                            style={{ background: "#1D1F4B" }}
                          >
                            <PillIcon size={22} className="text-white" />
                          </span>
                          <span
                            className="font-figtree font-medium text-[12.5px] leading-tight"
                            style={{ color: "#1D1F4B" }}
                          >
                            {p.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </m.div>
              )}

              {statCards.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {statCards.map((c, i) => {
                    const StatIcon = resolveIcon(c.icon) || Sparkles;
                    return (
                      <m.div
                        key={c.value || i}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="rounded-2xl p-6 min-h-[210px]"
                        style={{
                          background:
                            "linear-gradient(135deg, #576099 0%, #3A4066 50%, #1D2033 100%)",
                        }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                            <StatIcon size={18} style={{ color: "#1D1F4B" }} />
                          </span>
                          <p className="font-figtree font-bold text-white text-[28px] leading-none">
                            {c.value}
                          </p>
                        </div>
                        <p className="font-figtree font-semibold text-white text-[15px] mb-2">
                          {c.label}
                        </p>
                        <p
                          className="font-figtree text-[12.5px] leading-[1.6]"
                          style={{ color: "rgba(255,255,255,0.7)" }}
                        >
                          {c.desc}
                        </p>
                      </m.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          {/* Awards & Recognitions — sits at the end of the intro narrative. */}
          <div className="mt-14">
            <AwardsPanel />
          </div>

          {/* closing narrative */}
          {closingParagraphs.length > 0 && (
            <div className="space-y-5 mt-14 max-w-[1100px]">
              {closingParagraphs.map((text, i) => (
                <m.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="font-figtree text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.8] [&_p]:m-0"
                  style={{ color: "#4A5565" }}
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

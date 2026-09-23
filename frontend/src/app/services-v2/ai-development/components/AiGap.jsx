"use client";

import { m } from "framer-motion";
import { Sparkles } from "lucide-react";
import { resolveIcon } from "../iconResolver";
import aiData from "../aiData";

const D = aiData.gap;
const nonEmpty = (arr) => (arr || []).filter(Boolean);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.06 } }),
};

export default function AiGap({ data }) {
  const heading = data?.heading || D.heading;
  const quote = data?.quote || D.quote;
  const featureTitle = data?.featureTitle || D.featureTitle;
  const featureBody = data?.featureBody || D.featureBody;
  const paragraphs = nonEmpty(data?.paragraphs).length ? nonEmpty(data.paragraphs) : D.paragraphs;
  const shiftsHeading = data?.shiftsHeading || D.shiftsHeading;
  const shifts = data?.shifts?.length ? data.shifts : D.shifts;

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      // Starts at the hero's exact end colour (#1D2033) so the seam is invisible
      // and the two sections read as one continuous dark-navy gradient.
      style={{ background: "linear-gradient(180deg, #1D2033 0%, #1B1F3A 55%, #181C36 100%)" }}
    >
      {/* top-corner periwinkle blooms — mirror the hero's bottom-corner blooms so
          the glow flows continuously across the hero ↔ gap seam (no centre bloom,
          so there is no horizontal band at the join) */}
      <div
        className="pointer-events-none absolute"
        aria-hidden
        style={{ left: 0, top: 0, width: "62%", height: "78%", opacity: 0.28, background: "radial-gradient(ellipse 120% 130% at -8.83% -13.49%, #D7DDFF 8%, #5968B3 31%, rgba(0,0,0,0) 54%, rgba(0,0,0,0) 100%)" }}
      />
      <div
        className="pointer-events-none absolute"
        aria-hidden
        style={{ right: 0, top: 0, width: "62%", height: "78%", opacity: 0.28, background: "radial-gradient(ellipse 120% 130% at 108.83% -13.49%, #D7DDFF 8%, #5968B3 31%, rgba(0,0,0,0) 54%, rgba(0,0,0,0) 100%)" }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-8">
        {/* top split */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* left */}
          <div>
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-figtree font-bold capitalize text-[24px] sm:text-[28px] leading-tight sm:leading-8"
              style={{ color: "#F8FAFF" }}
            >
              {heading}
            </m.h2>

            {/* quote with left rail */}
            {quote && (
              <div className="mt-7 flex gap-4">
                <span className="mt-1 w-[3px] shrink-0 rounded" style={{ background: "#8C98D3" }} aria-hidden />
                <p
                  className="font-figtree font-normal capitalize text-sm sm:text-base leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.82)" }}
                >
                  {quote}
                </p>
              </div>
            )}

            {/* feature card */}
            {(featureTitle || featureBody) && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="mt-7 rounded-2xl p-6 sm:p-7"
                style={{
                  background: "linear-gradient(135deg, rgba(102,121,228,0.16) 0%, rgba(29,32,51,0.30) 100%)",
                  border: "1px solid rgba(136,154,245,0.22)",
                }}
              >
                {/* <h3 className="font-figtree font-semibold text-[16px] sm:text-[18px] leading-[1.35] text-white">{featureTitle}</h3> */}
                <p
                  className="mt-3 font-figtree text-[13px] sm:text-[14px] leading-[1.7]"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {featureBody}
                </p>
              </m.div>
            )}
          </div>

          {/* right narrative */}
          <div className="space-y-6 lg:pt-2">
            {/* accent dash */}
            <span className="block h-[3px] w-[62px] rounded" style={{ background: "linear-gradient(180deg, #1D1F4B 0%, #889AF5 100%)" }} aria-hidden />
            {paragraphs.map((text, i) => (
              <m.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="font-figtree text-sm sm:text-base leading-relaxed [&_p]:m-0 [&_p+p]:mt-4"
                style={{ color: "rgba(255,255,255,0.78)" }}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            ))}
          </div>
        </div>

        {/* shifts heading with side rules */}
        <div className="mt-16 flex items-center justify-center gap-4 sm:mt-20">
          <span className="hidden h-px max-w-[280px] flex-1 sm:block" style={{ background: "linear-gradient(90deg, rgba(102,121,228,0) 0%, rgba(102,121,228,0.46) 100%)" }} aria-hidden />
          <h3
            className="text-center font-figtree font-bold uppercase text-[15px] sm:text-[20px] lg:text-[24px]"
            style={{ color: "white", letterSpacing: "3px" }}
          >
            {shiftsHeading}
          </h3>
          <span className="hidden h-px max-w-[280px] flex-1 sm:block" style={{ background: "linear-gradient(90deg, rgba(102,121,228,0.46) 0%, rgba(102,121,228,0) 100%)" }} aria-hidden />
        </div>

        {/* shift cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {shifts.map((s, i) => {
            const ShiftIcon = resolveIcon(s.icon) || Sparkles;
            return (
              <m.div
                key={s.num || i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative overflow-hidden rounded-2xl p-6 transition-colors duration-300 hover:border-[rgba(136,154,245,0.45)]"
                style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(136,154,245,0.16)" }}
              >
                {/* top accent bar */}
                <span
                  aria-hidden
                  className="absolute left-6 top-0 h-[3px] w-[62px] rounded-b"
                  style={{ background: "linear-gradient(90deg, #1D1F4B 0%, #889AF5 100%)" }}
                />
                {/* number + fading divider line */}
                <div className="flex items-center gap-3">
                  <p className="font-figtree font-bold text-[18px]" style={{ color: "#D0D8FF", letterSpacing: "2px" }}>
                    {s.num}
                  </p>
                  <span
                    aria-hidden
                    className="h-px flex-1"
                    style={{ background: "linear-gradient(90deg, rgba(102,121,228,0.5) 0%, rgba(102,121,228,0) 100%)" }}
                  />
                </div>
                <span
                  className="mt-5 flex h-11 w-11 items-center justify-center rounded-[13px]"
                  style={{ background: "#1D1F4B", outline: "0.8px solid rgba(102,121,228,0.22)", outlineOffset: "-0.8px" }}
                >
                  <ShiftIcon size={20} style={{ color: "#9AA9FF" }} strokeWidth={1.7} />
                </span>
                <h3 className="mt-5 font-figtree font-semibold text-[16px] sm:text-[18px] leading-[1.35] text-white">{s.title}</h3>
                <div
                  className="mt-2.5 font-figtree text-[13px] sm:text-[14px] leading-[1.7] [&_p]:m-0"
                  style={{ color: "rgba(255,255,255,0.72)" }}
                  dangerouslySetInnerHTML={{ __html: s.desc || "" }}
                />
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

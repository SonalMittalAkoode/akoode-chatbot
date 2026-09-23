"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Target } from "lucide-react";

import resolveAsset, { IS_DEV } from "../resolveAsset";
import madData from "../madData";

const DEFAULT_STAGE_IMAGE = "/mobile-app/container.png";
// Timeline content lives under the `services` key (its stages are stored in
// `services.items`) — see madData / template wiring.
const D = madData.services;

export default function MadProcess({ data }) {
  const heading = data?.heading || D.heading;
  const headingAccent = data?.headingAccent || D.headingAccent;
  const intro = data?.intro || D.intro;
  // Render the CMS-saved stages whenever the record has any; only fall back to
  // the static stages when nothing is stored (e.g. a brand-new service).
  const rawSteps = data?.steps || [];
  const sourceSteps = rawSteps.length ? rawSteps : D.items;
  const steps = sourceSteps.map((s, i) => ({ ...s, num: s.num || String(i + 1).padStart(2, "0") }));
  const [active, setActive] = useState(0);
  // Tracks navigation direction (1 = forward/next, -1 = backward/previous) so
  // the stage card slides in from the matching side instead of just fading.
  const [direction, setDirection] = useState(1);

  if (!steps.length) return null;
  const step = steps[active];
  const go = (dir) => {
    setDirection(dir);
    setActive((prev) => (prev + dir + steps.length) % steps.length);
  };
  const goTo = (i) => {
    setDirection(i > active ? 1 : -1);
    setActive(i);
  };

  return (
    // overflow-x-hidden clips the decorative card-stack below, whose -40px /
    // -22px bleed pushed the document 24px wide between 1024 and 1280 (it has
    // room to peek above that). Pre-existing on every template using this
    // section, not specific to one.
    <section className="overflow-x-hidden py-16 sm:py-20 lg:py-24" style={{ background: "#fcfdfc" }}>
      <div className="max-w-[1280px] mx-auto px-4">
        {/* heading */}
        <div className="text-center max-w-[920px] mx-auto mb-12 lg:mb-16">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-figtree font-bold text-[24px] sm:text-[28px] capitalize leading-tight mb-5"
          >
            <span style={{ color: "#191A2E" }}>{heading} </span>
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #7784C5 0%, #B7BEED 50%, #6077EC 100%)" }}
            >
              {headingAccent}
            </span>
          </m.h2>
          {intro && (
            <m.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-figtree text-[14px] sm:text-[15px] leading-[1.7]"
              style={{ color: "#1D1F4B" }}
            >
              {intro}
            </m.p>
          )}
        </div>

        {/* SEO — the slider only mounts the active stage, so every stage's full
            content is mirrored here for crawlers (visually hidden). The section
            heading itself is NOT repeated here — it's already rendered once,
            visibly, above; duplicating it here only produced a second <h2> with
            identical text (confusing crawlers) and a duplicate announcement for
            screen readers.

            Placed after the heading, not before it: emitted first, these <h3>s
            reached crawlers ahead of the <h2> that introduces them, so the
            document outline showed six orphan stage headings preceding their
            own section title. */}
        <div className="sr-only">
          {steps.map((s, i) => (
            <article key={`seo-step-${i}`}>
              <h3>{`Stage ${s.num}: ${s.stageTitle || s.label || ""}`}</h3>
              {s.intro && <div dangerouslySetInnerHTML={{ __html: s.intro }} />}
              {s.outcome && <p>Outcome: {s.outcome}</p>}
            </article>
          ))}
        </div>

        {/* timeline — circles + dashed connectors */}
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 mb-12">
          <div className="flex items-start justify-between min-w-[560px] sm:min-w-0 max-w-[1100px] mx-auto pt-2">
          {steps.map((s, i) => {
            const done = i <= active;
            const isActive = i === active;
            return (
              <Fragment key={s.num}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className="flex flex-col items-center gap-2 shrink-0"
                  aria-pressed={isActive}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full font-figtree font-semibold text-[15px] text-white transition-all duration-300"
                    style={{
                      background: done ? "linear-gradient(135deg, #1D1F4B 0%, #363B5E 100%)" : "#8E97CF",
                      transform: isActive ? "scale(1.1)" : "scale(1)",
                      boxShadow: isActive ? "0 0 0 6px rgba(108,111,168,0.14)" : "none",
                    }}
                  >
                    {s.num}
                  </span>
                  <span
                    className={`font-figtree text-[13px] sm:text-[14px] ${isActive ? "font-bold" : "font-medium"}`}
                    style={{ color: "#1D1F4B" }}
                  >
                    {s.label}
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <div className="flex-1 mx-2 mt-[19px] border-t-2 border-dashed" style={{ borderColor: "#CBD5E1" }} />
                )}
              </Fragment>
            );
          })}
          </div>
        </div>

        {/* stage detail card */}
        <div className="relative">
          {/* stacked cards behind — the Figma "card stack" effect (peeks on the sides) */}
          <div
            aria-hidden
            className="hidden lg:block absolute rounded-[30px]"
            style={{ top: 24, bottom: 24, left: -40, right: -40, background: "#EFF1FE", zIndex: 0 }}
          />
          <div
            aria-hidden
            className="hidden lg:block absolute rounded-[30px]"
            style={{ top: 12, bottom: 12, left: -22, right: -22, background: "#E4E8FF", zIndex: 0 }}
          />

          {/* nav arrows */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous stage"
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition hover:-translate-y-[calc(50%+2px)]"
            style={{ border: "1px solid #e8ecf4" }}
          >
            <ChevronLeft size={20} style={{ color: "#1D1F4B" }} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next stage"
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition hover:-translate-y-[calc(50%+2px)]"
            style={{ border: "1px solid #e8ecf4" }}
          >
            <ChevronRight size={20} style={{ color: "#1D1F4B" }} />
          </button>

          <AnimatePresence mode="wait">
            <m.div
              key={step.num}
              initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
              transition={{ duration: 0.35 }}
              className="relative z-10 grid lg:grid-cols-2 lg:min-h-[460px] overflow-hidden rounded-[28px] bg-white lg:mx-2"
              style={{ border: "1px solid #EEF0F7", boxShadow: "0 24px 60px rgba(125,134,182,0.18)" }}
            >
              {/* image (left on desktop, below content on mobile) */}
              <div className="relative order-2 lg:order-1 h-[360px] lg:h-full p-8 bg-white lg:border-r" style={{ borderColor: "#EEF0F7" }}>
                <Image
                  src={resolveAsset(step.image) || DEFAULT_STAGE_IMAGE}
                  alt={step.imageAlt || step.stageTitle || step.label || "Process stage"}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-contain"
                  unoptimized={IS_DEV}
                />
              </div>

              {/* content (right on desktop, above image on mobile) */}
              <div className="order-1 lg:order-2 p-7 sm:p-9 lg:p-10">
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 font-figtree font-semibold text-[11px] tracking-[1.5px]"
                  style={{ border: "1px solid #D5DAF0", color: "#1D1F4B" }}
                >
                {step.label}
                </span>
                <h3 className="font-figtree font-bold text-[24px] sm:text-[30px] leading-tight mt-4 mb-2" style={{ color: "#0F172A" }}>
                  {step.link ? (
                    <Link href={step.link} className="transition-colors hover:text-[#5B6CFF]">
                      {step.stageTitle}
                    </Link>
                  ) : (
                    step.stageTitle
                  )}
                </h3>
                <span className="block h-[3px] w-12 rounded mb-5" style={{ background: "#889AF5" }} />

                <div
                  className="font-figtree text-[15px] leading-[1.6] mb-6 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_a]:text-[#5B6CFF] [&_a]:underline [&_strong]:font-semibold"
                  style={{ color: "#475569" }}
                  dangerouslySetInnerHTML={{ __html: step.intro || "" }}
                />

                {step.outcome && (
                  <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "#F8F9FF", border: "1px solid #E8ECF4" }}>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "linear-gradient(135deg, #576099 0%, #5B6CFF 100%)" }}>
                      <Target size={16} className="text-white" />
                    </span>
                    <p className="font-figtree text-[14px] leading-[1.5]" style={{ color: "#374151" }}>
                      {step.outcome}
                    </p>
                  </div>
                )}
              </div>
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

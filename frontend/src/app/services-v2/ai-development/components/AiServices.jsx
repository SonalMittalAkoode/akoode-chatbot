"use client";

import { m } from "framer-motion";
import aiData from "../aiData";
import ServiceCarousel from "./ServiceCarousel";

// "Our AI Development Services" — a modern 3D carousel. The heading/intro and
// the service-card content are unchanged; only the layout + interaction were
// swapped from the old sliding conveyor to a centred 3-card carousel
// (see ServiceCarousel for the transform logic and controls).
const D = aiData.process;

export default function AiServices({ data }) {
  const heading = data?.heading || D.heading;
  const headingAccent = data?.headingAccent || D.headingAccent;
  const intro = data?.intro || D.intro;
  const steps = data?.steps?.length
    ? data.steps
    : data?.items?.length
    ? data.items
    : D.steps;

  if (!steps?.length) return null;

  return (
    <section className="relative" style={{ background: "#181C36" }}>
      <div
        className="overflow-hidden rounded-t-[44px] py-16 sm:rounded-t-[72px] sm:py-20 lg:rounded-t-[120px] lg:py-24"
        style={{ background: "#F8FAFF" }}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
          {/* heading */}
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center font-figtree text-[24px] font-bold capitalize leading-tight sm:text-[28px] sm:leading-8"
          >
            <span style={{ color: "#7784C5" }}>{heading} </span>
            <span style={{ color: "#1D1F4B" }}>{headingAccent}</span>
          </m.h2>

          {/* subtitle */}
          {intro && (
            <p
              className="mx-auto mt-5 max-w-[920px] text-center font-figtree text-sm leading-relaxed sm:text-base"
              style={{ color: "#191A2E" }}
            >
              {intro}
            </p>
          )}

          {/* 3D carousel */}
          <ServiceCarousel items={steps} />
        </div>
      </div>
    </section>
  );
}

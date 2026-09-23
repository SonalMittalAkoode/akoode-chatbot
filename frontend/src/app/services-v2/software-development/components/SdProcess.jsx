"use client";

import { m } from "framer-motion";
import { resolveIcon } from "../iconResolver";
import {
  Search,
  Map,
  Palette,
  Code2,
  ShieldCheck,
  Rocket,
  Settings,
} from "lucide-react";

const STEPS = [
  {
    num: "01",
    Icon: Search,
    title: "Discovery & Requirement Analysis",
    desc: "We begin by understanding your business and users — and your people. This is a collaborative stage where we work alongside your team to precisely and carefully define what needs to be built.",
  },
  {
    num: "02",
    Icon: Map,
    title: "Planning & Architecture",
    desc: "Based on collected requirements, we create a project roadmap, select the best technologies, and design the system architecture to ensure scalability, reliability, and maintainability.",
  },
  {
    num: "03",
    Icon: Palette,
    title: "UI/UX Design",
    desc: "We create wireframes, user flows, and visual designs that are brand-aligned and aligned with your goals. All design work is validated with your team to ensure it meets user expectations before development begins.",
  },
  {
    num: "04",
    Icon: Code2,
    title: "Agile Development",
    desc: "Our developers work in two-week sprint cycles, delivering working, testable features with daily standups, sprint demos, and transparent progress tracking so you always know where things stand.",
  },
  {
    num: "05",
    Icon: ShieldCheck,
    title: "Testing & Quality Assurance",
    desc: "We perform functional testing, performance, and security testing at every sprint. Every feature is validated against acceptance criteria, ensuring nothing reaches production unless it meets the standard.",
  },
  {
    num: "06",
    Icon: Rocket,
    title: "Deployment",
    desc: "We deploy with a zero-downtime release plan after UAT testing, validation, and ongoing reporting. The deployment process is automated, documented, and designed to roll back safely if needed.",
  },
  {
    num: "07",
    Icon: Settings,
    title: "Maintenance & Support",
    desc: "Post-launch, we monitor performance, resolve issues, implement improvements, release updates, and ensure your systems and software continue to work and align with your business as it evolves.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08 },
  }),
};

export default function SdProcess({ data }) {
  const heading       = data?.heading       || "Our Software Development";
  const headingAccent = data?.headingAccent || "Process";
  const intro         = data?.intro         || "A structured, agile process is what makes predictable software delivers from unpredictable project cycles. Our process brings clarity at every stage, gives you complete visibility into progress, and ensures the final product closely reflects your business objectives — not just the brief you set on day one.";
  const dynSteps      = data?.steps?.length ? data.steps : null;
  const steps = (dynSteps || STEPS).map((s, i) => ({
    num:  dynSteps ? String(i + 1).padStart(2, "0") : s.num,
    Icon: dynSteps ? (resolveIcon(s.icon) || Search) : s.Icon,
    title: s.title,
    desc:  s.desc,
  }));

  return (
    <section className="py-16 sm:py-20 lg:py-24" style={{ background: "#F8FAFF" }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        {/* heading */}
        <div className="text-center max-w-[680px] mx-auto mb-16">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-[family-name:var(--font-figtree)] font-bold text-[26px] capitalize leading-tight mb-5"
            style={{ color: "#191A2E" }}
          >
            {heading}{" "}
            <span style={{ color: "#7784C5" }}>{headingAccent}</span>
          </m.h2>
          <m.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-[family-name:var(--font-figtree)] font-normal text-[15px] leading-[1.75]"
            style={{ color: "#4A5565" }}
          >
            {intro}
          </m.p>
        </div>

        {/* ── Desktop table (md+) ── */}
        <div
          className="hidden md:block rounded-2xl overflow-hidden"
          style={{ border: "1px solid #E8EAF2" }}
        >
          {steps.map((step, i) => (
            <m.div
              key={step.num}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex items-stretch"
              style={{
                borderBottom: i < steps.length - 1 ? "1px solid rgba(29,31,75,0.08)" : "none",
              }}
            >
              {/* col 1: number block */}
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(180deg, #576099 0%, #3A4066 50%, #1D2033 100%)",
                  width: 120,
                  minWidth: 120,
                }}
              >
                <span
                  className="font-bold text-white text-[24px] select-none"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {step.num}
                </span>
              </div>

              {/* col 2: icon + title */}
              <div
                className="flex items-center gap-4 px-6 py-6 shrink-0"
                style={{ width: 260, minWidth: 260 }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "#1D1F4B" }}
                >
                  <step.Icon size={26} style={{ color: "#ffffff" }} />
                </div>
                <p
                  className="font-[family-name:var(--font-figtree)] font-semibold text-[15px] leading-[1.4]"
                  style={{ color: "#1D1F4B" }}
                >
                  {step.title}
                </p>
              </div>

              {/* separator line */}
              <div
                className="shrink-0"
                style={{ width: 2.5, background: "#7186FA", margin: "18px 0" }}
              />

              {/* col 3: description */}
              <div className="flex items-center px-8 py-6 flex-1">
                <p
                  className="font-[family-name:var(--font-figtree)] font-normal text-[14px] leading-[1.7]"
                  style={{ color: "#364153" }}
                >
                  {step.desc}
                </p>
              </div>
            </m.div>
          ))}
        </div>

        {/* ── Mobile cards (< md) ── */}
        <div className="md:hidden space-y-3">
          {steps.map((step, i) => (
            <m.div
              key={step.num}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex items-stretch rounded-2xl overflow-hidden"
              style={{ border: "1px solid #E8EAF2" }}
            >
              {/* number col */}
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(180deg, #576099 0%, #3A4066 50%, #1D2033 100%)",
                  width: 52,
                  minWidth: 52,
                }}
              >
                <span
                  className="font-bold text-white text-[15px] select-none"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {step.num}
                </span>
              </div>

              {/* content */}
              <div className="p-4 flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#1D1F4B" }}
                  >
                    <step.Icon size={17} style={{ color: "#ffffff" }} />
                  </div>
                  <h3
                    className="font-[family-name:var(--font-figtree)] font-semibold text-[13px] leading-[1.3]"
                    style={{ color: "#1D1F4B" }}
                  >
                    {step.title}
                  </h3>
                </div>
                <p
                  className="font-[family-name:var(--font-figtree)] text-[12px] leading-[1.65]"
                  style={{ color: "#364153" }}
                >
                  {step.desc}
                </p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

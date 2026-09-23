"use client";

import { m } from "framer-motion";
import { resolveIcon } from "../iconResolver";
import {
  Settings2,
  Gauge,
  Layers,
  ShieldCheck,
  Trophy,
  Search,
  BarChart2,
  PenLine,
  Code2,
  CircleCheck
} from "lucide-react";

const MINI_STEPS = [
  { Icon: Search,    label: "Discover" },
  { Icon: BarChart2, label: "Analyze"  },
  { Icon: PenLine,   label: "Design"   },
  { Icon: Code2,     label: "Build"    },
];

const FEATURES = [
  {
    num: "01",
    Icon: Settings2,
    title: "Technology that fits your processes",
    desc: "Built around how you work, not generic workflows. Custom software integrates with your existing systems and mirrors your unique business logic precisely.",
  },
  {
    num: "02",
    Icon: Gauge,
    title: "Real-time intelligence built in",
    desc: "Move from reactive reporting to proactive decision support. Your platform surfaces the right data at the right moment — no manual extraction needed.",
  },
  {
    num: "03",
    Icon: Layers,
    title: "Scalability without compromise",
    desc: "Architecture that grows with your business from day one. No per-seat pricing, no artificial feature caps — just a foundation engineered to evolve.",
  },
  {
    num: "04",
    Icon: ShieldCheck,
    title: "Complete IP ownership",
    desc: "Everything we build belongs to you. Your data, your codebase, your competitive advantage — zero vendor lock-in, no ongoing licensing dependencies.",
  },
  {
    num: "05",
    Icon: Trophy,
    title: "Competitive differentiation",
    desc: "Custom software becomes a moat. While competitors buy the same off-the-shelf tools, you operate on a platform they simply cannot replicate.",
  },
];

const PARAGRAPHS = [
  "At Akoode, we begin every engagement by understanding your business strategy first. Your traffic is your highest possession. We build custom websites, web applications, and mobile applications engineered to support specific business outcomes, not templates.",
  "In high-performance environments, off-the-shelf tools weren't capturing all the data that mattered. Akoode built a next-generation platform to capture patterns that standard software can't see but teams urgently need to act on — patterns that directly impact outcomes.",
  "The product integrates real-time feeds into a single AI dashboard that extracts high-level performance metrics and delivers an AI-powered system capable of generating real-time insights directly from live operational data.",
  "This wasn't just looking for automation. They needed intelligence — something that could understand context, anticipate what decision-makers need, and deliver answers faster than the competition.",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

export default function SdWhyCustom({ data }) {
  const heading       = data?.heading       || "Why Businesses Are Moving Toward";
  const headingAccent = data?.headingAccent || "Custom Software Development";
  const rightTitle    = data?.rightTitle    || "What custom software development delivers that off-the-shelf tools cannot";
  const dynParas      = (data?.paragraphs || []).filter(Boolean);
  const hasDynParas   = dynParas.length > 0;
  const dynFeatures   = data?.features?.length ? data.features : null;

  return (
    <section className="py-16 sm:py-20 lg:py-24" style={{ background: "#F8FAFF" }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-4">
        <div className="grid lg:grid-cols-2 gap-14 xl:gap-20">

          {/* ── left col ── */}
          <div>
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-[family-name:var(--font-figtree)] font-bold text-[24px] sm:text-[28px] capitalize leading-tight mb-7"
              style={{ color: "#191A2E" }}
            >
              {heading}{" "}
              <span style={{ color: "#7784C5" }}>{headingAccent}</span>
            </m.h2>

            <div className="space-y-6">
              {(hasDynParas ? dynParas : PARAGRAPHS).map((text, i) => (
                <m.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className={`font-[family-name:var(--font-figtree)] text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.75] ${i === 0 ? "pl-4 border-l-[3px] rounded-sm" : ""}`}
                  style={{ color: "#4A5565", ...(i === 0 && { borderColor: "#8C98D3" }) }}
                  {...(hasDynParas ? { dangerouslySetInnerHTML: { __html: text } } : {})}
                >
                  {hasDynParas ? undefined : text}
                </m.div>
              ))}
            </div>

            {/* ── mini process bar ── */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 rounded-2xl p-5"
              style={{
                background: "linear-gradient(135deg, #1D1F4B 0%, #191A2E 100%)",
                border: "1px solid rgba(102,121,228,0.18)",
              }}
            >
              {/* header row */}
              <div className="flex items-start gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "#ffffff" }}
                >
                  <CircleCheck size={16} style={{ color: "#1D1F4B" }} />
                </div>
                <p
                  className="font-[family-name:var(--font-figtree)] text-[13px] sm:text-[14px] leading-[1.6] pt-0.5"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  At Akoode, we begin every engagement by understanding how your business
                  actually operates today and where it needs to go.
                </p>
              </div>

              {/* steps row — icon track + labels below */}
              <div>
                {/* icon + connector track */}
                <div className="flex items-center">
                  {MINI_STEPS.map((step, i) => {
                    return (
                      <div key={step.label} className="flex items-center flex-1 last:flex-none">
                        {/* circle icon — shrink-0 keeps it perfectly round */}
                        <div
                          className="shrink-0"
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: "44%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#ffffff",
                            border: "none",
                          }}
                        >
                          <step.Icon
                            size={18}
                            style={{ color: "#1D1F4B" }}
                          />
                        </div>
                        {/* connector — flex-1 fills gap between circles */}
                        {i < MINI_STEPS.length - 1 && (
                          <div
                            className="flex-1 mx-2"
                            style={{
                              height: 2,
                              background:
                                i < MINI_STEPS.length - 2
                                  ? "#fff"
                                  : "#fff",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* labels row — same proportional spacing */}
                <div className="flex mt-2">
                  {MINI_STEPS.map((step, i) => {
                    const isActive = i === MINI_STEPS.length - 1;
                    return (
                      <div
                        key={step.label}
                        className="flex-1 last:flex-none flex"
                        style={{ justifyContent: i === MINI_STEPS.length - 1 ? "flex-end" : "flex-start" }}
                      >
                        <span
                          className="font-[family-name:var(--font-figtree)] font-[500] text-[12px]"
                          style={{ color: isActive ? "#ffffff" : "rgba(255,255,255,0.75)" }}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </m.div>
          </div>

          {/* ── right col ── */}
          <div>
            <m.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-[family-name:var(--font-figtree)] font-[400] text-[16px] sm:text-[17px] leading-[1.5] mb-7"
              style={{ color: "#191A2E" }}
            >
              {rightTitle}
            </m.p>

            <div className="space-y-6">
              {(dynFeatures || FEATURES).map((feat, i) => {
                const FeatIcon = dynFeatures ? (resolveIcon(feat.icon) || Settings2) : feat.Icon;
                const num = dynFeatures ? String(i + 1).padStart(2, "0") : feat.num;
                return (
                  <m.div
                    key={num}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="flex items-center gap-4 rounded-2xl px-5 py-4"
                    style={{ background: "linear-gradient(135deg, #576099 0%, #3A4066 50%, #1D2033 100%)" }}
                  >
                    <div className="shrink-0 rounded-xl flex items-center justify-center" style={{ width: 52, height: 52, background: "#1D1F4B" }}>
                      <FeatIcon size={24} style={{ color: "#ffffff" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-[family-name:var(--font-figtree)] font-[600] text-[15px] sm:text-[16px] leading-[1.3] mb-1">
                        {feat.title}
                      </h3>
                      <p className="font-[family-name:var(--font-figtree)] text-[13px] leading-[1.6]" style={{ color: "rgba(255,255,255,0.5)" }}>
                        {feat.desc}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center justify-center rounded-lg text-[12px] font-[600]" style={{ width: 36, height: 36, background: "#ffffff", color: "#1D1F4B", fontFamily: "Inter, sans-serif", border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(4px)" }}>
                      {num}
                    </div>
                  </m.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

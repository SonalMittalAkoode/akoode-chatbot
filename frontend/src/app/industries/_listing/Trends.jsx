"use client";

import { m } from "framer-motion";
import { Sparkles, ShieldCheck, Boxes, Bot, Layers, Smartphone } from "lucide-react";

// "Where Industry Software Stands in 2026" — same design/styling as the
// AI development Trends section: heading/intro split + a stack of horizontal
// dark-gradient trend cards (icon column with a divider, then text).
const D = {
  heading: "Why Industry-Specific Software Is Being",
  headingAccent: "Rebuilt in 2026",
  intro:
    "What worked three years ago is already losing ground. The platforms winning in 2026 are built differently. Here is what is driving the shift.",
  items: [
    {
      Icon: ShieldCheck,
      title: "Compliance Complexity Has Accelerated",
      desc: "DPDP in India, evolving data residency requirements, and sector-specific mandates across Finance, Healthcare, and Government are forcing architectural rethinks for platforms that were built on simpler assumptions.",
    },
    {
      Icon: Bot,
      title: "AI Integration Is Now a Table Stake",
      desc: "In 2026, buyers across every vertical expect intelligent automation, predictive analytics, and workflow AI to be part of the platform - not a future roadmap item. Platforms shipping without these are already behind.",
    },
    {
      Icon: Boxes,
      title: "Integration Debt Is Killing Product Velocity",
      desc: "Platforms built on siloed architectures are struggling to connect internal tools, third-party APIs, and data sources at the speed modern operations demand. Clean integration architecture is now a competitive advantage, not a technical detail.",
    },
    {
      Icon: Layers,
      title: "Legacy Modernisation Is the Dominant Spend Category",
      desc: "From Banking to Manufacturing to Government, the dominant engineering budget in 2026 is not new builds - it is replacing legacy systems that are holding operational scale back. Staff augmentation and dedicated teams are the preferred model for this work.",
    },
    {
      Icon: Smartphone,
      title: "Mobile-First User Expectations Have Reached B2B",
      desc: "Field workers, logistics operators, and healthcare teams now expect the same UX quality from their work applications that they get from consumer apps. Platforms that ignore mobile experience are losing adoption from the teams they are built to serve.",
    },
  ],
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.06 } }),
};

export default function Trends({ data }) {
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
            className="ind-h2"
          >
            <span style={{ color: "#1D1F4B" }}>{heading} </span>
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #7784C5 0%, #889AF5 100%)" }}
            >
              {headingAccent}
            </span>
          </m.h2>

          {intro && (
            <div className="flex gap-4 lg:pt-2">
              <span className="mt-1 w-[3px] shrink-0 rounded" style={{ background: "#8C98D3" }} aria-hidden />
              <p className="ind-lead" style={{ color: "#1D1F4B" }}>
                {intro}
              </p>
            </div>
          )}
        </div>

        {/* trend cards — horizontal snap-slider on small screens, stacked on lg */}
        <div className="mt-12 flex gap-5 overflow-x-auto snap-x snap-mandatory pt-2 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:gap-6 lg:overflow-visible lg:pt-0 lg:pb-0">
          {items.map((item, i) => {
            const Icon = item.Icon || Sparkles;
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
                  <h3 className="ind-card-title text-white">
                    {item.title}
                  </h3>
                  <div className="ind-body mt-3 [&_p]:m-0" style={{ color: "rgba(255,255,255,0.82)" }}>
                    {item.desc}
                  </div>
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

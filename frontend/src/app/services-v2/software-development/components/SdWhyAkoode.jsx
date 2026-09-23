"use client";

import { FiUsers, FiCpu, FiAward, FiShield, FiBarChart2, FiMessageSquare } from "react-icons/fi";
import { resolveIcon } from "../iconResolver";
import AwardsPanel from "@/components/AwardsPanel";

const CARDS = [
  {
    Icon: FiUsers,
    title: "No Subcontracting — Your Project Stays In-House",
    desc: "Every project runs entirely within Akoode's in-house team. Clients work directly with the developers, architects, designers, and strategists responsible for delivery from discovery through deployment.",
  },
  {
    Icon: FiCpu,
    title: "AI-First Software Engineering",
    desc: "We integrate AI into production systems: intelligent automation, predictive analytics, recommendation engines, and NLP pipelines — built into the software we deliver, not bolted on after.",
  },
  {
    Icon: FiAward,
    title: "Senior Engineers Lead Every Engagement",
    desc: "A senior engineer leads every Akoode project — directly involved in architecture decisions, sprint reviews, technical planning, and deployment from day one.",
  },
  {
    Icon: FiShield,
    title: "Compliance & Security Designed In From the Start",
    desc: "We build systems aligned with data privacy regulations, enterprise security requirements, and regulated industry workflows from the very first design sprint.",
  },
  {
    Icon: FiBarChart2,
    title: "Full Visibility Into Every Sprint",
    desc: "You see exactly what's being built, tested, and shipped — weekly demos, live dashboards, and async updates keep you informed without requiring constant check-ins.",
  },
  {
    Icon: FiMessageSquare,
    title: "One Point of Contact, Zero Handoff Confusion",
    desc: "A dedicated delivery lead owns communication end-to-end. No rotating project managers, no lost context — the same person who scoped your project sees it through to launch.",
  },
];

function FeatureCard({ Icon: IconProp, title, desc }) {
  return (
    <div
      className="h-full flex flex-col rounded-[10px] bg-white p-7 border"
      style={{ borderColor: "rgba(119,132,197,0.2)" }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ background: "rgba(119,132,197,0.1)" }}
        >
          <IconProp size={18} style={{ color: "#7784C5" }} />
        </div>
        <h3 className="text-[#14153d] font-semibold text-[15px] sm:text-[16px] lg:text-[17px] leading-tight">
          {title}
        </h3>
      </div>
      <div className="text-sm leading-7 text-[#4A5565] m-0 [&_p]:m-0 [&_p+p]:mt-3" dangerouslySetInnerHTML={{ __html: desc || "" }} />
    </div>
  );
}

export default function SdWhyAkoode({ data, mobileSlider = false }) {
  const heading       = data?.heading       || "Why Software Teams";
  const headingAccent = data?.headingAccent || "Choose Akoode";
  const subtitle      = data?.subtitle      || "Built for product engineering. Backed by proven results across 15 industries.";
  const dynCards      = data?.cards?.length
    ? data.cards.map((c) => ({
        Icon:  resolveIcon(c.icon) || FiCpu,
        title: c.title,
        desc:  c.desc,
      }))
    : null;

  return (
    <>
      <section
        className="py-16 sm:py-20 lg:py-24 font-figtree"
        style={{
          background: "linear-gradient(160deg, #f5f3fa 0%, #ebe9f4 50%, #f0eef8 100%)",
        }}
      >
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">

          {/* Header */}
          <div className="max-w-[760px] mb-12 md:mb-16">
            <h2 className="text-[#14153d] text-[24px] sm:text-[28px] font-bold leading-tight sm:leading-8 mb-4">
              {heading}{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg, #7784C5 0%, #889AF5 100%)" }}
              >
                {headingAccent}
              </span>
            </h2>
            <p className="text-[#4A5565] text-sm sm:text-base leading-relaxed m-0">
              {subtitle}
            </p>
          </div>

          {/* Feature cards — 3-col grid on desktop. With mobileSlider, small
              screens become a horizontal snap-scroll carousel. */}
          <div
            className={
              mobileSlider
                ? "flex gap-5 overflow-x-auto snap-x snap-mandatory pb-3 -mx-5 px-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible mb-8"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
            }
          >
            {(dynCards || CARDS).map((card, i) => (
              <div key={i} className={mobileSlider ? "shrink-0 snap-start w-[82%] sm:w-[46%] lg:w-auto" : ""}>
                <FeatureCard {...card} />
              </div>
            ))}
          </div>

          {/* Awards panel — full width at bottom */}
          <AwardsPanel />

        </div>
      </section>
    </>
  );
}

"use client";

import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const DEFAULT_STEPS = [
  {
    num: "01",
    title: "Discovery & Business Analysis",
    desc: "We start by deeply understanding your business model, target users, competitive landscape, and business goals. No assumptions. No templates. We map the exact platform you need and why.",
  },
  {
    num: "02",
    title: "UX/UI Strategy & Design",
    desc: "We craft intuitive user experiences and conversion-optimized interfaces tailored to your target audience and business goals.",
  },
  {
    num: "03",
    title: "Agile Development",
    desc: "Iterative sprints with full transparency. You see progress every week, not just at the end.",
  },
  {
    num: "04",
    title: "AI Model Integration",
    desc: "We embed intelligent features — recommendations, predictions, automation — directly into your platform.",
  },
  {
    num: "05",
    title: "QA & Performance Testing",
    desc: "Rigorous testing across devices, load scenarios, and edge cases to ensure your platform performs under real-world conditions.",
  },
  {
    num: "06",
    title: "Deployment & Scaling",
    desc: "Cloud-native deployments built to scale with your growth, with monitoring and support baked in from day one.",
  },
];

export default function HowWeWork({ data }) {
  const steps = data?.items?.length > 0
    ? data.items.map((it, idx) => ({
        ...it,
        num: it.num || String(idx + 1).padStart(2, "0"),
      }))
    : DEFAULT_STEPS;
  const eyebrow = data?.eyebrow;
  const heading = data?.heading;
  const subtitle = data?.subtitle || "From First Call To Product Launch, Here's Exactly How We Operate No Fluff, No Mystery. Just Disciplined Execution Designed To Ship Platforms That Work.";
  const ctaLabel = data?.cta1Label || "Read More on our Blog";
  const ctaLink = data?.cta1Link || "#";
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="w-full bg-[#101828] py-16 sm:py-20 lg:py-24 px-6 md:px-16 lg:px-24 font-figtree">
      <div className="flex flex-col lg:flex-row gap-16 items-start">

        {/* Left column */}
        <div className="flex flex-col gap-8 lg:w-[45%] flex-shrink-0">
          {eyebrow && (
            <p className="text-white text-base font-medium uppercase tracking-wide">
              {eyebrow}
            </p>
          )}
          <h2 className="text-white text-[24px] sm:text-[28px] font-bold leading-tight sm:leading-8 capitalize">
            {heading ? (
              heading
            ) : (
              <>
                Our Real Estate{" "}
                <span className="text-[#7784C5]">Software Development Process</span>
              </>
            )}
          </h2>
          <div
            className="text-white/80 text-sm sm:text-base capitalize leading-relaxed [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: processHtmlLinks(subtitle) }}
          />

          <a
            href={ctaLink}
            className="self-start px-8 py-4 rounded-full text-white text-[15px] sm:text-[16px] lg:text-lg font-medium leading-6 flex items-center gap-2 no-underline"
            style={{
              background:
                "linear-gradient(90deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)",
              outline: "1.5px solid #889AF5",
            }}
          >
            {ctaLabel}
            <span>&#8250;</span>
          </a>
        </div>

        {/* Right column — accordion card */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-[#E5E7EB]">
          {steps.map((step, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className={i > 0 ? "border-t border-[#E5E7EB]" : ""}>
                {/* Row header */}
                <h3 className="m-0">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between px-6 py-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[#4F39F6] text-xl sm:text-2xl font-light leading-8 w-8 flex-shrink-0">
                      {step.num}
                    </span>
                    <span className="text-[#101828] text-[15px] sm:text-[16px] lg:text-lg font-medium leading-7">
                      {step.title}
                    </span>
                  </div>
                  <span className="text-[#99A1AF] flex-shrink-0">
                    {isOpen ? <FiMinus size={20} /> : <FiPlus size={20} />}
                  </span>
                </button>
                </h3>

                {/* Expanded content — always in DOM for crawlers; collapsed via max-height when closed. */}
                <div
                  inert={!isOpen}
                  className="overflow-hidden transition-[max-height] duration-300 ease-out"
                  style={{ maxHeight: isOpen ? 600 : 0 }}
                >
                  <div className="px-6 pb-6 pl-[4.5rem]">
                    <div
                      className="text-[#4A5565] text-sm leading-relaxed [&_p]:m-0"
                      dangerouslySetInnerHTML={{ __html: processHtmlLinks(step.desc || step.description || "") }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

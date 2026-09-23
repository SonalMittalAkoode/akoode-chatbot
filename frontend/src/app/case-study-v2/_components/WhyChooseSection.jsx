import { BrainCircuit, Settings, Layers, TrendingUp } from "lucide-react";
import { Reveal, Heading } from "./shared";
import { renderIcon, RichText, pick, pickList } from "./dynamic";

const WHY_CHOOSE = [
  {
    icon: BrainCircuit,
    title: "Deep AI & CV Expertise",
    desc: "A team that lives in computer vision and machine learning — not generalists adapting to it.",
  },
  {
    icon: Settings,
    title: "Custom-Built, Not Template",
    desc: "Every model and pipeline is engineered around your data, your sport and your workflow.",
  },
  {
    icon: Layers,
    title: "End-to-End Development",
    desc: "From ingestion to dashboard — we own the full stack so nothing falls through the gaps.",
  },
  {
    icon: TrendingUp,
    title: "Built to Scale",
    desc: "Architected for real-time video at volume, with pipelines that grow with your needs.",
  },
];

const DEFAULT_INTRO =
  "This case study is one of 50+ AI and computer vision solutions we've delivered. Here's what makes the difference.";

export default function WhyChooseSection({ data }) {
  const heading = pick(data?.heading, "Why Businesses Choose Akoode For ");
  const accent = pick(data?.headingAccent, "AI Development");
  const intro = pick(data?.intro, DEFAULT_INTRO);
  const cards = pickList(data?.cards, WHY_CHOOSE);

  return (
    <section className="bg-white py-[40px] pb-[80px] md:py-[60px] md:pb-[110px]">
      <div className="mx-auto w-full max-w-[92rem] px-5 sm:px-8 lg:px-[clamp(1.5rem,3vw,3rem)]">
        <Reveal className="max-w-4xl">
          <Heading eyebrow="Why Akoode" lead={heading} accent={accent} />
          <RichText
            html={intro}
            className="mt-6 text-[14px] leading-[1.5] text-[#191A2E]/90 sm:text-[16px] lg:text-[18px]"
          />
        </Reveal>

        {/* dark cards — icon tile on the left, title + description on the right */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
          {cards.map(({ icon, title, desc }, i) => (
            <Reveal key={title || i} delay={i * 0.07}>
              <div className="group h-full rounded-[18px] border border-white/10 bg-[linear-gradient(160deg,#2b2e6b_0%,#1f2150_50%,#15173a_100%)] p-6 shadow-[0_18px_44px_rgba(29,31,75,0.22)] transition-transform duration-300 hover:-translate-y-1.5 md:p-7">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-white">
                    {renderIcon(icon, { size: 22, className: "text-[#1D1F4B]" })}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold leading-[1.3] text-white sm:text-[16px]">
                      {title}
                    </h3>
                    <RichText html={desc} className="mt-2.5 text-[13px] leading-[1.7] text-white/55" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

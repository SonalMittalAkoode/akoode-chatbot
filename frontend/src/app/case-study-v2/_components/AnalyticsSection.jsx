import {
  User,
  Target,
  Lightbulb,
  Shield,
  Users,
  TrendingUp,
} from "lucide-react";
import { Reveal, Heading } from "./shared";
import { renderIcon, RichText, pick, pickList } from "./dynamic";

const ANALYTICS = [
  {
    icon: User,
    title: "Player Performance Tracking",
    desc: "Measure individual player output — speed, endurance, agility and movement across every session and match.",
  },
  {
    icon: Target,
    title: "Training Optimization",
    desc: "Identify performance gaps in training data and adjust drills based on real metrics rather than intuition.",
  },
  {
    icon: Lightbulb,
    title: "Match Strategy Planning",
    desc: "Analyze opponent movement patterns and build data-driven game plans before every match.",
  },
  {
    icon: Shield,
    title: "Injury Risk Analysis",
    desc: "Detect movement anomalies and overexertion patterns that may indicate elevated injury risk early.",
  },
  {
    icon: Users,
    title: "Recruitment & Scouting",
    desc: "Evaluate prospective players using objective performance data rather than subjective observation.",
  },
  {
    icon: TrendingUp,
    title: "Performance Benchmarking",
    desc: "Track player development over a full season and compare against team and league-wide benchmarks.",
  },
];

const DEFAULT_INTRO =
  "This platform's architecture can be applied across a broad range of sports analytics challenges beyond its initial scope.";

export default function AnalyticsSection({ data }) {
  const heading = pick(data?.heading, "Performance ");
  const accent = pick(data?.headingAccent, "Analytics");
  const intro = pick(data?.intro, DEFAULT_INTRO);
  const items = pickList(data?.items, ANALYTICS);

  return (
    <section className="bg-white py-[40px] md:py-[60px]">
      <div className="mx-auto w-full max-w-[92rem] px-5 sm:px-8 lg:px-[clamp(1.5rem,3vw,3rem)]">
        <Reveal className="max-w-4xl">
          <Heading eyebrow="Use cases" lead={heading} accent={accent} />
          <RichText
            html={intro}
            className="mt-6 text-[14px] leading-[1.5] text-[#191A2E]/90 sm:text-[16px] lg:text-[18px]"
          />
        </Reveal>

        {/* borderless items — dark icon tile, underlined title, description */}
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-14 lg:grid-cols-3 lg:gap-x-16">
          {items.map(({ icon, title, desc }, i) => (
            <Reveal key={title || i} delay={i * 0.05} className="max-w-[360px]">
              <span className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#1D1F4B]">
                {renderIcon(icon, { size: 22, className: "text-white" })}
              </span>
              <h3 className="mt-4 text-[16px] font-semibold leading-[1.3] text-[#101828] sm:text-[18px]">
                {title}
              </h3>
              <span
                aria-hidden
                className="mt-2 block h-[3px] w-[72px] rounded-full bg-gradient-to-r from-[#7784C5] to-[#7784C5]/10"
              />
              <RichText
                html={desc}
                className="mt-3 text-[13px] leading-[1.6] text-[#4A5565] sm:text-[14px]"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

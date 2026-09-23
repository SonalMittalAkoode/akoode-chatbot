import Link from "next/link";
import { ChevronRight, Eye, Layers, Code, Monitor, MapPin } from "lucide-react";
import { Reveal, Heading } from "./shared";
import { renderIcon, RichText, pick, pickList } from "./dynamic";

const PROJECT_INFO = [
  { icon: Eye, label: "Client", value: "Confidential" },
  { icon: Layers, label: "Industry", value: "Sports Analytics" },
  { icon: Code, label: "Use Case", value: "Player Performance Tracking" },
  { icon: Monitor, label: "Solution", value: "AI + Computer Vision" },
  { icon: MapPin, label: "Engagement", value: "Custom Ai Build" },
];

const STATS = [
  {
    value: "94+",
    title: "Hours / Week",
    sub: "Saved in manual data tagging and highlight extraction",
  },
  {
    value: "10x",
    title: "Faster Analysis",
    sub: "Real-time insights vs traditional post-game breakdown",
  },
  {
    value: "Real-time",
    title: "AI Detection",
    sub: "Live tracking of movement patterns across 15 camera feeds",
  },
  {
    value: "4K",
    title: "Video Processing",
    sub: "High-resolution computer vision at 60fps for precision analytics",
  },
];

export default function RethinkingSection({ data }) {
  const heading = pick(data?.heading, "Rethinking Performance ");
  const accent = pick(data?.headingAccent, "Analysis Modern Sports");
  const bodyHtml = data?.body; // HtmlEditor output (when from DB)
  const ctaText = pick(data?.ctaText, "Start Your Mobile App Project");
  const ctaLink = pick(data?.ctaLink, "/post-requirement");
  const stats = pickList(data?.stats, STATS);
  const projectInfoTitle = pick(data?.projectInfoTitle, "Project Info");
  const projectInfo = pickList(data?.projectInfo, PROJECT_INFO);

  return (
    <section className="bg-[#f6f7fc] py-[60px] md:py-[90px]">
      <div className="mx-auto w-full max-w-[92rem] px-5 sm:px-8 lg:px-[clamp(1.5rem,3vw,3rem)]">
        {/* heading sits above the grid so the card starts at the copy level
            (not aligned to the title) and ends where the left content ends */}
        <Reveal>
          <Heading eyebrow="About the Client" lead={heading} accent={accent} />
        </Reveal>

        <div className="mt-7 grid grid-cols-1 items-start gap-10 lg:mt-9 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          {/* left — copy, CTA, stats */}
          <Reveal className="flex flex-col">
            {bodyHtml ? (
              <RichText
                html={bodyHtml}
                className="space-y-5 text-[14px] leading-[1.6] text-[#191A2E] sm:text-[16px] lg:text-[18px]"
              />
            ) : (
              <div className="space-y-5 text-[14px] leading-[1.6] text-[#191A2E] sm:text-[16px] lg:text-[18px]">
                <p>
                  In high-performance sports environments, news cameras and
                  stock trackers weren&apos;t capturing all the movement data
                  that mattered. Akoode built a next-generation computer vision
                  platform to capture patterns that a referee can&apos;t see, but
                  coaching teams urgently need to correct.
                </p>
                <p>
                  The product integrates 15+ real-time video feeds into a single
                  AI dashboard that extracts high-level performance metrics and
                  delivers an AI-powered system capable of generating real-time,
                  actionable insights directly from live match video.
                </p>
                <p>
                  This wasn&apos;t just looking for automation — they needed
                  intelligence. Something that could understand context,
                  anticipate what data scientists need, and deliver answers
                  faster than the game.
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="mt-8">
              <Link
                href={ctaLink}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#5a5e9e_0%,#7c80c8_100%)] px-8 py-3.5 text-[15px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(124,128,200,0.45)] md:text-[16px]"
              >
                {ctaText}
                <ChevronRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* stats — divider-separated columns */}
            <div className="mt-auto grid grid-cols-2 gap-y-8 pt-12 sm:flex sm:gap-0">
              {stats.map((s, i) => (
                <div
                  key={s.title}
                  className={`sm:flex-1 sm:px-6 sm:first:pl-0 ${
                    i > 0 ? "sm:border-l sm:border-[#d9dbeb]" : ""
                  }`}
                >
                  <p className="text-[26px] font-bold leading-none text-[#1D1F4B] md:text-[30px]">
                    {s.value}
                  </p>
                  <p className="mt-2 text-[14px] font-medium text-[#1D1F4B]">
                    {s.title}
                  </p>
                  <p className="mt-1 text-[12px] leading-snug text-[#6A7282]">
                    {s.sub}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* right — PROJECT INFO card (sticky, natural height) */}
          <Reveal delay={0.12} className="lg:sticky lg:top-[100px]">
            <div className="w-full flex-col rounded-[24px] border border-white/5 bg-[linear-gradient(180deg,#2b2e6b_0%,#191b45_100%)] p-7 shadow-[0_24px_60px_rgba(29,31,75,0.3)] md:p-9">
              <h3 className="text-[16px] font-semibold uppercase tracking-[1px] text-white sm:text-[18px]">
                {projectInfoTitle}
              </h3>
              <div className="mt-8 flex flex-col gap-7">
                {projectInfo.map(({ icon, label, value }, i) => (
                  <div
                    key={label || i}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex min-w-0 shrink-0 items-center gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border border-[#4b50aa] bg-[#15173a]">
                        {renderIcon(icon, { size: 26, className: "text-[#7186FA]", strokeWidth: 2 })}
                      </span>
                      <p className="truncate text-[17px] font-normal text-white md:text-[20px]">
                        {label}
                      </p>
                    </div>
                    <p className="min-w-0 max-w-[45%] break-words text-right text-[13px] text-white/65 md:text-[15px]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

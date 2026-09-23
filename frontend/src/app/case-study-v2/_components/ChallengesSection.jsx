import { Video, Database, Clock, BarChart3 } from "lucide-react";
import { Reveal, Heading } from "./shared";
import { renderIcon, RichText, pick, pickList } from "./dynamic";

const CHALLENGES = [
  {
    icon: Video,
    title: "Unstructured Video Data",
    desc: "Raw match footage is packed with insight but extremely difficult to access manually for analysis and interpretation.",
  },
  {
    icon: Database,
    title: "No Centralized Analytics Platform",
    desc: "Without a unified system, performance data lives across siloed machines — not readily accessible or shareable with coaching staff.",
  },
  {
    icon: Clock,
    title: "Manual & Time-Intensive Review",
    desc: "Analyst teams had to re-watch entire video libraries to find specific patterns, consuming excessive time while critical insights were missed.",
  },
  {
    icon: BarChart3,
    title: "No Structured Performance Metrics",
    desc: "Movement and decision metrics were measured by feel, not data — with no real system to surface actionable, comparable coaching metrics.",
  },
];

const DEFAULT_INTRO =
  "Performance coaching at the elite level needs data granularity that's completely impossible to scale. Coaches were making manual decisions without structured data to back them up.";
const DEFAULT_QUOTE =
  "Coaches were making decisions based on observation, not data — during high-performance moments at the kind of scale and pace that creates true competitive advantage.";

export default function ChallengesSection({ data }) {
  const heading = pick(data?.heading, "What Challenges Do Sports Teams Face In ");
  const accent = pick(data?.headingAccent, "Performance Analysis?");
  const intro = pick(data?.intro, DEFAULT_INTRO);
  const cards = pickList(data?.cards, CHALLENGES);
  const quote = pick(data?.quote, DEFAULT_QUOTE);

  return (
    <section className="bg-white py-[40px] md:py-[60px]">
      <div className="mx-auto w-full max-w-[92rem] px-5 sm:px-8 lg:px-[clamp(1.5rem,3vw,3rem)]">
        <Reveal className="max-w-4xl">
          <Heading eyebrow="The Problem" lead={heading} accent={accent} />
          <RichText
            html={intro}
            className="mt-5 text-[14px] leading-[1.5] text-[#191A2E]/90 sm:text-[16px] md:mt-6 lg:text-[18px]"
          />
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:mt-10 md:grid-cols-2">
          {cards.map(({ icon, title, desc }, i) => (
            <Reveal key={title || i} delay={i * 0.06}>
              {/* light by default → smoothly turns dark on hover (gradient
                  is faded in via an opacity overlay since background-image
                  itself can't be CSS-transitioned) */}
              <div className="group relative h-full overflow-hidden rounded-[18px] border border-[#eef0f6] border-l-[3px] border-l-[#8894F4] bg-white p-5 shadow-[0_4px_40px_rgba(0,0,0,0.05)] transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#2b2e6b] hover:border-l-[#8894F4] hover:shadow-[0_22px_55px_rgba(29,31,75,0.28)] sm:rounded-[20px] sm:p-7 md:p-8">
                {/* dark gradient overlay */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,#2b2e6b_0%,#1d1f4b_100%)] opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
                />
                <div className="relative z-10 flex gap-4 sm:gap-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1d1f4b] transition-colors duration-500 group-hover:bg-white/15 sm:h-12 sm:w-12">
                    {renderIcon(icon, { size: 20, className: "text-white sm:h-[22px] sm:w-[22px]" })}
                  </span>
                  <div>
                    <h3 className="text-[16px] font-semibold leading-[1.3] text-[#101828] transition-colors duration-500 group-hover:text-white sm:text-[18px]">
                      {title}
                    </h3>
                    <RichText
                      html={desc}
                      className="mt-2 text-[13px] leading-[1.6] text-[#4A5565] transition-colors duration-500 group-hover:text-white/80 sm:mt-3 sm:text-[14px]"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* dark quote strip */}
        <Reveal className="mt-8">
          <div className="flex items-start gap-3 rounded-[16px] bg-[#1d1f4b] px-5 py-5 sm:gap-4 sm:rounded-[18px] sm:px-7 sm:py-6 md:px-10 md:py-7">
            <span className="font-serif text-[30px] leading-[0.7] text-[#7186FA] sm:text-[40px]">
              &ldquo;
            </span>
            <RichText
              html={quote}
              className="text-[14px] italic leading-[1.6] text-white/90 sm:text-[15px] md:text-[17px]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

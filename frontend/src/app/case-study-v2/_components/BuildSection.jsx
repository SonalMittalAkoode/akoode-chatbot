import { Reveal, Heading } from "./shared";
import { RichText, pick, pickList } from "./dynamic";

const BUILD_CARDS = [
  {
    n: "1",
    title: "Automate Video Analysis",
    desc: "Harness the power of artificial intelligence to transform raw footage into structured, searchable insight automatically.",
  },
  {
    n: "2",
    title: "Precision Player Tracking",
    desc: "Detect and follow every player across the field with frame-accurate spatial positioning and trajectory mapping.",
  },
  {
    n: "3",
    title: "Real-Time Metrics",
    desc: "Generate performance metrics as plays unfold, so coaches see what matters the moment it happens.",
  },
  {
    n: "4",
    title: "Data-Driven Coaching",
    desc: "Replace subjective observation with objective, comparable data for every player in every play.",
  },
  {
    n: "5",
    title: "Reduce Manual Workload",
    desc: "Cut analyst hours dramatically by automating tagging, clipping and highlight extraction end-to-end.",
  },
];

const DEFAULT_INTRO =
  "The client needed a next-generation AI system that could transform raw game footage into meaningful, real-time performance intelligence.";

export default function BuildSection({ data }) {
  const heading = pick(data?.heading, "What We Set Out ");
  const accent = pick(data?.headingAccent, "To Build");
  const intro = pick(data?.intro, DEFAULT_INTRO);
  const cards = pickList(data?.cards, BUILD_CARDS);

  return (
    <section className="bg-white py-[40px] md:py-[60px]">
      <div className="mx-auto w-full max-w-[92rem] px-5 sm:px-8 lg:px-[clamp(1.5rem,3vw,3rem)]">
        <Reveal className="max-w-4xl">
          <Heading eyebrow="Project Objectives" lead={heading} accent={accent} />
          <RichText
            html={intro}
            className="mt-5 text-[14px] leading-[1.5] text-[#191A2E]/90 sm:text-[16px] md:mt-6 lg:text-[18px]"
          />
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:mt-10 lg:grid-cols-5">
          {cards.map((c, i) => (
            <Reveal key={c.title || i} delay={i * 0.06}>
              <div className="group relative h-full overflow-hidden rounded-[20px] border border-white/[0.06] bg-[linear-gradient(180deg,#43477e_0%,#262a55_48%,#1a1c42_100%)] p-5 shadow-[0_18px_44px_rgba(29,31,75,0.28)] transition-transform duration-300 hover:-translate-y-1.5 sm:p-6">
                {/* glossy top sheen */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),transparent)]"
                />
                <div className="relative z-10">
                  <span className="block bg-gradient-to-b from-white via-white/40 to-white/[0.04] bg-clip-text text-[52px] font-bold leading-none text-transparent sm:text-[60px]">
                    {c.n}
                  </span>
                  <h3 className="mt-3 text-[16px] font-semibold leading-[1.3] text-white sm:text-[18px]">
                    {c.title}
                  </h3>
                  <RichText
                    html={c.desc}
                    className="mt-3 text-[13px] leading-[1.6] text-white/75 sm:text-[14px]"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

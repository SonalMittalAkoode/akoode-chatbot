import { Reveal, Heading } from "./shared";
import { RichText, pick, pickList } from "./dynamic";

const PIPELINE = [
  {
    n: "1",
    title: "Video Ingestion",
    desc: "Raw multi-camera match footage is captured and streamed into the platform.",
  },
  {
    n: "2",
    title: "Segmentation",
    desc: "Footage is automatically split into 10–15 second play-by-play clips.",
  },
  {
    n: "3",
    title: "AI Detection",
    desc: "Computer vision models detect and track every player across frames.",
  },
  {
    n: "4",
    title: "Metrics Engine",
    desc: "Motion algorithms calculate speed, distance and positioning per player.",
  },
  {
    n: "5",
    title: "Insights Output",
    desc: "Structured, comparable performance data is delivered to coaches instantly.",
  },
];

const DEFAULT_INTRO =
  "Akoode Technologies developed a scalable, AI-powered platform that transforms unstructured video into structured performance data — end-to-end, fully automated.";

export default function PipelineSection({ data }) {
  const heading = pick(data?.heading, "Turning Raw Footage Into ");
  const accent = pick(data?.headingAccent, "Intelligent Insights");
  const intro = pick(data?.intro, DEFAULT_INTRO);
  const steps = pickList(data?.steps, PIPELINE);

  return (
    <section className="bg-white py-[40px] md:py-[60px]">
      <div className="mx-auto w-full max-w-[92rem] px-5 sm:px-8 lg:px-[clamp(1.5rem,3vw,3rem)]">
        <Reveal className="max-w-4xl">
          <Heading eyebrow="The Solution" lead={heading} accent={accent} />
          <RichText
            html={intro}
            className="mt-5 text-[14px] leading-[1.5] text-[#191A2E]/90 sm:text-[16px] md:mt-6 lg:text-[18px]"
          />
        </Reveal>

        {/* dark gradient panel with the 5 pipeline steps */}
        <Reveal className="mt-8 md:mt-10">
          <div className="relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-[linear-gradient(120deg,#3f4382_0%,#26294f_55%,#191b42_100%)] p-6 shadow-[0_24px_60px_rgba(29,31,75,0.3)] sm:p-9 md:p-10">
            {/* glossy top sheen */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)]"
            />
            <div className="relative z-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
              {steps.map((step, i) => (
                <div
                  key={step.title || i}
                  className={`lg:px-6 lg:first:pl-0 lg:last:pr-0 ${
                    i > 0 ? "lg:border-l lg:border-white/10" : ""
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[16px] font-bold text-[#1d1f4b] shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
                    {step.n}
                  </div>
                  <h3 className="mt-5 text-[16px] font-semibold leading-[1.3] text-white sm:text-[18px]">
                    {step.title}
                  </h3>
                  <RichText
                    html={step.desc}
                    className="mt-2 text-[13px] leading-[1.6] text-white/65 sm:text-[14px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

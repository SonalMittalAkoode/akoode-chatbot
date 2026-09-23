import Image from "next/image";
import withLineBreak from "../headingBreak";

const ACCENT_GRADIENT =
  "linear-gradient(7.573deg, #7784C5 33.662%, #B7BEED 48.02%, #6077EC 58.532%, #7683C5 85.197%)";

const PILL_GRADIENT =
  "linear-gradient(to left, rgba(102,121,228,0.2), rgba(102,121,228,0.45))";

const COST_WIDTHS = ["lg:w-[68.613%]", "lg:w-[63.047%]", "lg:w-[63.047%]", "lg:w-[73.449%]"];

const COST_FACTORS = [
  {
    n: "01",
    title: "Number of systems involved",
    body: "Modernizing one legacy application costs meaningfully less than integrating five disconnected platforms",
  },
  {
    n: "02",
    title: "Data complexity",
    body: "Clean, well-structured data is a different engagement than data scattered across spreadsheets, legacy databases, and someone's personal files",
  },
  {
    n: "03",
    title: "Number of systems involved",
    body: "A transformation touching one department is a different undertaking than one requiring adoption across an entire organization",
  },
  {
    n: "04",
    title: "Compliance requirements",
    body: "Regulated industries add real engineering and audit time that a standard modernization project doesn't need",
  },
];

const TIMELINE = [
  {
    title: "Single System Modernization",
    body: "A single system modernization typically runs six to twelve weeks depending on complexity.",
    value: "6–12",
    unit: "Weeks",
    fill: "34.8%",
    dot: { size: "lg:size-[0.684vw]", color: "#CDD3EE" },
    railAbove: null,
    railBelow: "#CDD3EE",
  },
  {
    title: "Full Digital Transformtion",
    body: "A full digital transformation engagement, spanning multiple systems, process redesign, and change management, usually runs four to nine months, sometimes longer for genuinely large organizations.",
    value: "4-9",
    unit: "Months",
    fill: "68.3%",
    dot: { size: "lg:size-[1.052vw]", color: "#6679E4" },
    railAbove: "#CDD3EE",
    railBelow: "#6679E4",
  },
  {
    title: "Point Automation",
    body: "Point automation projects, one specific repetitive process, are often the fastest engagement we run, typically two to six weeks from assessment to a working automation.",
    value: "2-6",
    unit: "Weeks",
    fill: "15.2%",
    dot: { size: "lg:size-[1.368vw]", color: "#130E2A" },
    railAbove: "#6679E4",
    railBelow: null,
  },
];

const seq = (n, i) => n || String(i + 1).padStart(2, "0");

export default function DtCostTimeline({ data } = {}) {
  const heading = data?.heading || "What Digital Transformation\nActually Costs";
  const headingAccent = data?.headingAccent || "and How Long It Takes";
  const intro =
    data?.intro ||
    "On the page directly, rather than left for a sales call, because cost and timeline are usually the two questions that decide whether a shortlist conversation even starts.";
  const costHeading = data?.costHeading || "What Drives the cost";
  const circleEyebrow = data?.circleEyebrow || "Cost is driven by";
  const circleTitle = data?.circleTitle || "Four\nKey\nFactors";
  const factors = (data?.factors?.length ? data.factors : COST_FACTORS).slice(0, COST_WIDTHS.length);
  const timelineHeading = data?.timelineHeading || "How LOng it actually takes";
  const timeline = TIMELINE.map((coded, i) => ({
    ...coded,
    ...(data?.timelines?.[i] || {}),
    fill: coded.fill,
    dot: coded.dot,
    railAbove: coded.railAbove,
    railBelow: coded.railBelow,
  }));
  const bannerLead =
    data?.bannerLead || "A number quoted before we\u2019ve actually seen your systems is a guess";
  const bannerHighlight = data?.bannerHighlight || "dressed up";
  const bannerTail = data?.bannerTail || "as a quote.";
  const bannerBody =
    data?.bannerBody ||
    "We give a fixed estimate after a technical and operational assessment, so you\u2019re comparing a real number, not a marketing range.";

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-[1901px] px-5 py-8 sm:px-8 lg:px-0 lg:py-[2.576vw] lg:pl-[3.893%] lg:pr-[2.893%]">
        {/* ── Heading, centred ── */}
        <h2 className="text-center font-figtree font-semibold capitalize leading-[1.02] text-[24px] sm:text-[28px]">
          <span className="whitespace-pre-line text-[#1D1F4B]">{withLineBreak(heading)} </span>
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: ACCENT_GRADIENT }}>
            {headingAccent}
          </span>
        </h2>

        <p className="mx-auto mt-[clamp(10px,0.7364vw,14px)] text-center font-figtree font-normal leading-[1.1] text-[#1D1F4B] text-[14px] sm:text-[15px] lg:text-[16px] lg:w-[57.653%]">
          {intro}
        </p>

        <div className="mt-12 flex flex-col gap-12 lg:mt-[2.104vw] lg:flex-row lg:items-start lg:gap-[3.950%]">
          {/* ── Left: what drives the cost ── */}
          <div className="lg:w-[61.851%]">
            <p className="font-figtree font-bold uppercase leading-[1.05] text-[#1D1F4B] text-[20px] sm:text-[22px]">
              {costHeading}
            </p>

            <div className="relative mt-5 lg:mt-[0.526vw]">
              <div
                className="absolute left-0 top-[5.471vw] hidden aspect-[316/311] w-[28.832%] flex-col items-start justify-start gap-[0.21vw] rounded-full bg-gradient-to-b from-[#CCD5FF] to-[#F7F9FE] px-[2.630vw] pb-[2.104vw] pt-[2.841vw] lg:flex"
              >
                <p className="font-figtree font-bold uppercase leading-[1.976] tracking-[0.118em] text-[#6679E4] text-[0.894vw]">
                  {circleEyebrow}
                </p>
                <p className="whitespace-pre-line font-figtree font-bold leading-[1.125] text-[#130E2A] text-[2.104vw]">
                  {circleTitle}
                </p>
                <span className="mt-[0.21vw] block h-[0.21vw] w-[2.262vw] rounded-full bg-[#6679E4]" />
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute left-[14.69%] top-[3.104vw] hidden aspect-[213/409] w-[19.434%] lg:block"
              >
                <Image
                  src="/digital-transformation/cost-arc.svg"
                  alt=""
                  fill
                  sizes="220px"
                  className="object-fill"
                />
              </div>

              <div className="relative z-10 flex flex-col gap-4 lg:items-end lg:gap-[1.194vw]">
                {factors.map((factor, i) => (
                  <div
                    key={i}
                    className={`flex items-center overflow-hidden rounded-[clamp(20px,3.419vw,65px)] lg:h-[6.470vw] ${COST_WIDTHS[i]}`}
                    style={{ background: "rgba(205,211,238,0.35)" }}
                  >
                    <span
                      className="flex aspect-square h-full shrink-0 items-center justify-center rounded-full font-figtree font-semibold leading-[0.667] text-[#1D1F4B] text-[clamp(22px,2.2094vw,42px)]"
                      style={{ backgroundImage: PILL_GRADIENT }}
                    >
                      {seq(factor.n, i)}
                    </span>
                    <div className="min-w-0 flex-1 p-[clamp(12px,0.8417vw,16px)]">
                      <p className="font-figtree font-semibold leading-[1.68] text-black text-[14px] sm:text-[15px] lg:text-[16px]">
                        {factor.title}
                      </p>
                      <p className="font-figtree font-normal leading-[1.333] text-[#1D1F4B] text-[14px] sm:text-[15px] lg:text-[16px]">
                        {factor.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: how long it actually takes ── */}
          <div className="lg:w-[34.199%]">
            <p className="font-figtree font-bold uppercase leading-[1.05] text-[#1D1F4B] text-[20px] sm:text-[22px]">
              {timelineHeading}
            </p>

            <div className="mt-[clamp(20px,1.841vw,35px)] lg:pt-[1.473vw]">
              {timeline.map((item, i) => (
                <div
                  key={i}
                  className={`flex gap-4 lg:gap-[1.052vw] ${i > 0 ? "mt-8 lg:mt-0" : ""}`}
                >
                  <div className="flex shrink-0 flex-col items-center lg:w-[2.104vw]">
                    {item.railAbove && (
                      <span
                        aria-hidden
                        className="hidden w-[2px] shrink-0 lg:block lg:h-[1.894vw]"
                        style={{ background: item.railAbove }}
                      />
                    )}
                    <span
                      className={`relative z-10 size-3 shrink-0 rounded-full lg:-my-[2px] ${item.dot.size}`}
                      style={{ background: item.dot.color }}
                    />
                    {item.railBelow && (
                      <span
                        aria-hidden
                        className="hidden w-[2px] flex-1 lg:block"
                        style={{ background: item.railBelow }}
                      />
                    )}
                  </div>

                  <div className={`min-w-0 flex-1 ${i > 0 ? "lg:pt-[1.894vw]" : ""}`}>
                    <div className="flex items-start gap-4 lg:gap-[0.842vw]">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-figtree font-extrabold leading-[1.25] tracking-[-0.0156em] lg:leading-[0.9375] text-[#130E2A] text-[16px] sm:text-[18px]">
                          {item.title}
                        </h3>
                        <p className="pt-2 font-figtree font-normal leading-[1.146] text-[#191A2E] text-[14px] sm:text-[15px] lg:text-[16px]">
                          {item.body}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="font-figtree font-extrabold leading-[1] tracking-[0.088em] text-[#6679E4] text-[clamp(22px,1.788vw,34px)]">
                          {item.value}
                        </p>
                        <p className="pt-[2px] font-figtree font-medium uppercase leading-[1.1] lg:leading-[0.797] tracking-[0.106em] text-[#7784C5] text-[clamp(11px,0.842vw,16px)]">
                          {item.unit}
                        </p>
                      </div>
                    </div>

                    <div
                      className="mt-[clamp(10px,0.7364vw,14px)] h-[clamp(6px,0.4208vw,8px)] w-full overflow-hidden rounded-[10px]"
                      style={{ background: "rgba(205,211,238,0.45)" }}
                    >
                      <span
                        className="block h-full rounded-[10px] bg-[#889AF5]"
                        style={{ width: item.fill }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footnote banner ── */}
        <div
          className="mt-12 flex flex-col gap-5 rounded-[14px] px-[clamp(18px,1.683vw,32px)] py-[clamp(18px,1.157vw,22px)] sm:flex-row sm:items-center sm:gap-[clamp(18px,1.473vw,28px)] lg:mt-[2.576vw]"
          style={{ background: "rgba(205,211,238,0.2)" }}
        >
          <span
            className="flex shrink-0 items-center justify-center rounded-[10px] h-[clamp(60px,4.261vw,81px)] w-[clamp(56px,3.998vw,76px)]"
            style={{ background: "rgba(102,121,228,0.25)" }}
          >
            <Image
              src="/digital-transformation/quote-doc.svg"
              alt=""
              width={40}
              height={48}
              className="h-[clamp(28px,2.525vw,48px)] w-[clamp(23px,2.104vw,40px)]"
            />
          </span>

          <span
            aria-hidden
            className="hidden w-px shrink-0 bg-[#CDD3EE] sm:block sm:h-[clamp(40px,2.841vw,54px)]"
          />

          <div className="min-w-0">
            <p className="font-figtree font-semibold leading-[1.3] tracking-[-0.0177em] lg:leading-[0.92] text-[#130E2A] text-[14px] sm:text-[15px] lg:text-[16px]">
              {bannerLead}{" "}
              <span className="text-[#6679E4]">{bannerHighlight}</span> {bannerTail}
            </p>
            <p className="pt-[clamp(8px,0.7364vw,14px)] font-figtree font-normal leading-[1.3] text-[#7784C5] lg:leading-[0.911] text-[14px] sm:text-[15px] lg:text-[16px]">
              {bannerBody}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

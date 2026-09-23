"use client";

const HEADING_GRADIENT =
  "linear-gradient(11.76deg, #7784C5 33.66%, #B7BEED 48.02%, #6077EC 58.53%, #7683C5 85.2%)";

const GLOW_BAND =
  "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 18%, #1D1F4B 34%, #4A5390 52%, #889AF5 90%, #889AF5 100%)";

// Fallback content shown when no CMS record supplies commerceEngineering.columns.
const DEFAULT_COLUMNS = [
  {
    title: "AI-Driven Personalisation",
    desc: "Recommendation engines and behavioural segmentation trained on your own order data, running server-side so conversion improves without page speed paying for it. Your data, your models, your margin.",
  },
  {
    title: "Search and Merchandising Engines",
    desc: "Typo-tolerant, intent-aware product search on Elasticsearch or Typesense, tuned with your stock and margin priorities. People who use site search convert at several times the rate of people who browse. That makes search quality a revenue lever, not a nice-to-have.",
  },
  {
    title: "Custom Pricing and Promotions Engines",
    desc: "Contract pricing, volume breaks, regional price books, stackable promotion rules, one engine. Essential in B2B. Nearly impossible to do cleanly with a plugin stack, which is why so few try.",
  },
  {
    title: "Performance Engineering",
    desc: "Core Web Vitals as a written product requirement: LCP targets, edge caching, image pipelines, load-tested checkout. Speed gets scoped, built and measured like any other feature.",
  },
  {
    title: "Subscription and Recurring Commerce",
    desc: "Subscription billing, pause-and-skip, dunning, churn analytics, built into checkout rather than strapped on afterwards. Replenishment and membership models live or die on this layer.",
  },
  {
    title: "Commerce Data and Analytics Pipelines",
    desc: "Clean event tracking, warehouse syncs, margin-level reporting your finance team will actually sign off on. A funnel you cannot measure honestly is a funnel you cannot fix.",
  },
];

const DIVIDER = "rgba(255,255,255,0.22)";
// Shiny gradient for the top of each vertical line (bright in the glow, fading down).
const LINE_SHINE =
  "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0) 100%)";
const POINT_GLOW = "0 0 10px 3px rgba(180,195,255,0.75)";

export default function CommerceEngineeringSection({ data } = {}) {
  const heading = data?.heading || "Commerce Engineering";
  const headingAccent = data?.headingAccent || "Beyond the Storefront";
  const intro =
    data?.intro ||
    "A storefront is the baseline. The work below is where custom platforms pull away from template stores, and increasingly it is the reason clients ring us in the first place.";
  const rawColumns = data?.columns?.length ? data.columns : DEFAULT_COLUMNS;
  const columns = rawColumns.map((c, i) => ({ n: String(i + 1).padStart(2, "0"), title: c.title, body: c.desc }));

  return (
    <section className="relative overflow-hidden" style={{ background: "#191A2E" }}>

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[80px] hidden h-[320px] w-screen -translate-x-1/2 lg:block"
        style={{ backgroundImage: GLOW_BAND }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1901px] px-5 pt-16 sm:px-8 lg:px-[106px] lg:pt-[70px]">
        {/* header */}
        <div className="flex max-w-[1011px] flex-col gap-6 lg:gap-[26px]">
          <h2 className="font-figtree font-normal leading-[1.2] text-[24px] sm:text-[28px]">
            <span className="text-white">{heading} </span>
            <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADING_GRADIENT }}>
              {headingAccent}
            </span>
          </h2>
          <p className="font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px]">
            {intro}
          </p>
        </div>
      </div>

      {/* columns */}
      <div className="relative z-10 mx-auto mt-6 w-full max-w-[1901px] px-5 sm:px-8 lg:mt-[50px] lg:px-[96px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
          {columns.map((c, i) => (
            <div key={c.n} className="relative flex flex-col pb-14 lg:min-h-[642px]">
              {/* vertical line + rounded foot + baseline; extends 24px into the next
                  column to fill its corner notch, so the baseline stays continuous */}
              <span
                aria-hidden
                className={`pointer-events-none absolute bottom-0 left-0 top-0 rounded-bl-[24px] border-b border-l ${
                  i === columns.length - 1 ? "right-0" : "-right-6"
                }`}
                style={{ borderColor: DIVIDER }}
              />
              {/* shiny highlight + glowing point at the top of the left line */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 h-3/5 w-px"
                style={{ background: LINE_SHINE }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                style={{ boxShadow: POINT_GLOW }}
              />

              <div className="relative flex flex-col pl-8 pr-4 lg:pl-10">
                {/* number — in the glow band */}
                <div className="flex h-[110px] items-center lg:h-[150px]">
                  <span className="font-figtree font-bold leading-none text-white text-[clamp(2.75rem,4.5vw,4rem)]">
                    {c.n}
                  </span>
                </div>

                <h3 className="mb-5 mt-5 font-figtree text-[18px] sm:text-[20px] font-semibold leading-[1.2] text-white">
                  {c.title}
                </h3>
                <p className="font-figtree text-[14px] sm:text-[15px] font-normal leading-[1.6] text-white">
                  {c.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-16 lg:h-[70px]" />
    </section>
  );
}

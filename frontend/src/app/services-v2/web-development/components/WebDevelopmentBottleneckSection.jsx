"use client";

import { TrendingDown, ShieldAlert, Smartphone, Search } from "lucide-react";

const HEADLINE_GRADIENT =
  "linear-gradient(27.01deg, #7784C5 33.66%, #B7BEED 48.02%, #6077EC 58.53%, #7683C5 85.2%)";

const DEFAULT_POINTS = [
  {
    Icon: TrendingDown,
    text: "Every extra second of load time costs conversions. Most sites we inherit are three to five seconds slow, and nobody noticed until revenue did.",
  },
  {
    Icon: Search,
    text: "Search rankings reward speed, structure and fresh content. A site nobody has touched since launch is a site search engines quietly stop showing.",
  },
  {
    Icon: ShieldAlert,
    text: "Unpatched plugins and ageing frameworks are the easiest door into a business. Security is not a line item you add later.",
  },
  {
    Icon: Smartphone,
    text: "Most traffic today arrives on a phone. A layout that only works on desktop is turning away the majority of the people who show up.",
  },
];

export default function WebDevelopmentBottleneckSection({ data } = {}) {
  const heading = data?.heading || "When the Website becomes the";
  const headingAccent = data?.headingAccent || "Bottleneck, Growth stalls.";
  const intro =
    data?.intro ||
    "Most businesses don't have a marketing problem. They have a website problem wearing a marketing problem's clothes: slow pages, stale content, and a build nobody dares touch anymore.";
  const cardTitle =
    data?.cardTitle || "Akoode is not a template shop. We do not sell themes, and we will not sell you one";
  const cardBody =
    data?.cardBody ||
    "What we build is the layer underneath: architecture, performance budgets, content systems and integrations shaped around how your business actually grows.";
  const quote =
    data?.quote ||
    "A website that cannot keep up is not standing still. It is losing you leads on a Tuesday afternoon while nobody watches.";
  const points = data?.points?.length ? data.points : DEFAULT_POINTS;

  return (
    <section className="relative overflow-hidden" style={{ background: "#130E2A" }}>
      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-y-14 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-x-16 lg:px-16 lg:py-20 xl:gap-x-20">
        {/* ── Left column ── */}
        <div className="flex flex-col">
          <h2 className="mb-[18px] max-w-[724px] font-figtree font-normal leading-[1.2] text-[24px] sm:text-[28px] tracking-[-0.01em]">
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADLINE_GRADIENT }}>
              {heading}{" "}
            </span>
            <span className="text-white">{headingAccent}</span>
          </h2>

          <p className="max-w-[724px] font-figtree font-normal leading-[1.275] text-white text-[14px] sm:text-[15px]">
            {intro}
          </p>

          <div className="relative mt-10 w-full max-w-[708px] lg:mt-auto">
            <div
              className="relative overflow-hidden rounded-[26px] px-[26px] py-[28px] sm:px-11 sm:py-9"
              style={{
                backgroundImage:
                  "radial-gradient(115% 115% at 50% 50%, rgba(17,17,20,0.55) 38%, rgba(74,83,144,0.30) 100%)",
                backdropFilter: "blur(94.38px)",
                WebkitBackdropFilter: "blur(94.38px)",
                boxShadow: "inset 0 0 55px rgba(102,121,228,0.12), 0px 3.78px 3.78px rgba(0,0,0,0.25)",
                border: "1px solid rgba(136,154,245,0.25)",
              }}
            >
              <div className="flex items-center gap-4 border-b-2 pb-6" style={{ borderColor: "#262D59" }}>
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl sm:size-12 sm:rounded-2xl"
                  style={{
                    backgroundImage:
                      "linear-gradient(158.14deg, rgba(255,255,255,0.05) 4.17%, rgba(255,255,255,0.02) 94.14%)",
                    border: "0.944px solid rgba(255,255,255,0.16)",
                  }}
                >
                  <ShieldAlert className="size-5 sm:size-6" style={{ color: "#C1C4D1" }} strokeWidth={1.5} />
                </div>
                <h3 className="font-figtree font-semibold leading-[1.2] text-white text-[18px] sm:text-[21px]">
                  {cardTitle}
                </h3>
              </div>

              <p className="mt-8 font-figtree font-normal leading-[1.275] text-white text-[14px] sm:text-[15px]">
                {cardBody}
              </p>
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-[30px]">
          {points.map(({ Icon, text }, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 pr-2 sm:pr-5 ${
                i < points.length - 1 ? "border-b-2 pb-4 pt-[5px]" : "pt-[5px]"
              }`}
              style={i < points.length - 1 ? { borderColor: "#292E4B" } : undefined}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white sm:size-11">
                <Icon className="size-5" style={{ color: "#1D1F4B" }} strokeWidth={1.75} />
              </div>
              <p className="font-figtree font-normal leading-[1.275] text-white text-[14px] sm:text-[15px]">{text}</p>
            </div>
          ))}

          <div className="flex items-stretch gap-[14px]">
            <span
              aria-hidden
              className="w-[3px] shrink-0 rounded-full"
              style={{ background: "linear-gradient(180deg, #6679E4 0%, rgba(102,121,228,0.2) 100%)" }}
            />
            <p className="font-figtree font-medium leading-[1.275] text-white/80 text-[14px] sm:text-[15px]">
              {quote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

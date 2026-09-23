"use client";

import { Layers, TrendingUp, SlidersHorizontal, Clock, Globe } from "lucide-react";
import { resolveIcon } from "../iconResolver";

// Diagonal gradient on the first half of the headline (Figma 27.01deg).
const HEADLINE_GRADIENT =
  "linear-gradient(27.01deg, #7784C5 33.66%, #B7BEED 48.02%, #6077EC 58.53%, #7683C5 85.2%)";

// Right-column list — icon + copy, each divided by a bottom rule. Fallback
// content shown when no CMS record supplies platformProblem.points.
const DEFAULT_POINTS = [
  {
    Icon: TrendingUp,
    text: "The pattern repeats so often we could set a watch by it. A business launches on a hosted platform, grows quickly, then spends year three fighting the tool.",
  },
  {
    Icon: SlidersHorizontal,
    text: "B2B pricing needs a workaround. ERP sync needs three plugins, two of which hate each other. Checkout slows down every time a campaign lands.",
  },
  {
    Icon: Clock,
    text: "At some point, patching costs more than building properly would have.",
  },
  {
    Icon: Globe,
    text: "And the ground has moved. Buyers in 2026 expect pages that load in under two seconds, stock counts that are actually true, and product suggestions that make sense, because everyone else already gives them that. Search engines rank against the same signals.",
  },
];

export default function PlatformBottleneckSection({ data } = {}) {
  const heading = data?.heading || "When the Platform becomes the";
  const headingAccent = data?.headingAccent || "Bottleneck, Revenue follows.";
  const intro =
    data?.intro ||
    "Most growing stores do not have a marketing problem. They have a platform problem wearing a marketing problem's clothes: slow pages, broken syncs, features the storefront simply refuses to support.";
  const cardTitle =
    data?.cardTitle || "Akoode is not a Shopify agency. We do not sell themes, and we will not sell you one";
  const cardBody =
    data?.cardBody ||
    "What we build is the layer underneath: catalogues, pricing engines, checkout logic and integrations shaped around how your business actually takes money.";
  const quote =
    data?.quote ||
    "A platform that cannot keep up is not standing still. It is losing you orders on a Tuesday afternoon while nobody watches";
  const points = data?.points?.length
    ? data.points.map((p) => ({ Icon: resolveIcon(p.icon) || TrendingUp, text: p.text }))
    : DEFAULT_POINTS;

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

          {/* Glowing card — /e-commerce/stroke.svg supplies the blue corner-glow gradient edge */}
          <div className="relative mt-10 w-full max-w-[708px] lg:mt-auto">
            {/* faint outer bloom — only the stroke's bright corners bleed out */}
            <img
              src="/e-commerce/stroke.svg"
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full opacity-55 blur-[7px]"
            />
            {/* frosted glass body + thin white hairline */}
            <div
              className="relative overflow-hidden rounded-[26px] px-[26px] py-[28px] sm:px-11 sm:py-9"
              style={{
                // Figma inner fill: glow bleeds in from all four edges, darker in the centre.
                backgroundImage:
                  "radial-gradient(115% 115% at 50% 50%, rgba(17,17,20,0.55) 38%, rgba(74,83,144,0.30) 100%)",
                backdropFilter: "blur(94.38px)",
                WebkitBackdropFilter: "blur(94.38px)",
                boxShadow: "inset 0 0 55px rgba(102,121,228,0.12), 0px 3.78px 3.78px rgba(0,0,0,0.25)",
              }}
            >
              <div className="flex items-center gap-4 border-b-2 pb-6" style={{ borderColor: "#262D59" }}>
                {/* frosted icon tile */}
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl sm:size-12 sm:rounded-2xl"
                  style={{
                    backgroundImage:
                      "linear-gradient(158.14deg, rgba(255,255,255,0.05) 4.17%, rgba(255,255,255,0.02) 94.14%)",
                    border: "0.944px solid rgba(255,255,255,0.16)",
                  }}
                >
                  <Layers className="size-5 sm:size-6" style={{ color: "#C1C4D1" }} strokeWidth={1.5} />
                </div>
                <h3 className="font-figtree font-semibold leading-[1.2] text-white text-[18px] sm:text-[21px]">
                  {cardTitle}
                </h3>
              </div>

              <p className="mt-8 font-figtree font-normal leading-[1.275] text-white text-[14px] sm:text-[15px]">
                {cardBody}
              </p>
            </div>
            {/* crisp gradient stroke on top — bright blue at top-left & bottom-right */}
            <img
              src="/e-commerce/stroke.svg"
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
            />
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
              <p className="font-figtree font-normal leading-[1.275] text-white text-[14px] sm:text-[15px]">
                {text}
              </p>
            </div>
          ))}

          {/* accent-bar quote */}
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

"use client";

import { ShieldAlert } from "lucide-react";

// Figma: linear-gradient(23.56deg, #7784C5 33.66%, #B7BEED 48.02%, #6077EC 58.53%, #7683C5 85.2%)
const HEADLINE_GRADIENT =
  "linear-gradient(23.56deg, #7784C5 33.66%, #B7BEED 48.02%, #6077EC 58.53%, #7683C5 85.2%)";

const DEFAULT_CARDS = [
  {
    number: "01",
    text: "Here is what we see in most audits. A site built three or four years ago, on a theme that seemed fine at the time. Plugins stacked on plugins. Nobody quite knows what half of them do anymore, but removing one breaks the contact form.",
  },
  {
    number: "02",
    text: "Core Web Vitals are red. Mobile users, who are now most users, get the worst version of everything.",
  },
  {
    number: "03",
    text: "None of this shows up as a single dramatic failure, which is exactly the problem. It shows up as a conversion rate slightly worse than it should be, rankings that slip a position or two each quarter, and a bounce rate everyone has learned to live with.",
  },
  {
    number: "04",
    text: "In 2026, with AI search engines reading your site's structure as closely as humans read its copy, living with it has become genuinely expensive.",
  },
];

export default function WebDevelopmentWhyNowSection({ data } = {}) {
  const heading = data?.heading || "A Slow, Generic website is quitely taxing";
  const headingAccent = data?.headingAccent || "Everthing Else you spend on";
  const intro =
    data?.intro ||
    "Your ads, your SEO, your sales team's follow-ups: all of it funnels into one place. If that place takes five seconds to load and looks like everyone else's template, the money leaks out at the last step.";
  const cardTitle =
    data?.cardTitle || "Akoode does not sell templates with your logo swapped in.";
  const cardBody =
    data?.cardBody ||
    "We are a web development company that engineers websites the way product teams engineer software: performance budgets, real architecture, and conversion goals written down before design starts.";
  const cards = data?.cards?.length ? data.cards : DEFAULT_CARDS;

  return (
    <section className="relative overflow-hidden" style={{ background: "#0E0A20" }}>
      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-y-14 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-x-12 lg:px-16 lg:py-24 xl:gap-x-16">
        {/* ── Left column: heading + intro, glowing quote card below — narrower (5/12) so its
            text wraps to more lines and closes the height gap against the wider, shorter right column ── */}
        <div className="flex flex-col lg:col-span-5">
          <h2 className="max-w-[678px] font-figtree font-normal leading-[1.2] text-[24px] sm:text-[28px] tracking-[-0.01em]">
            <span className="text-white">{heading} </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADLINE_GRADIENT }}>
              {headingAccent}
            </span>
          </h2>

          <p className="mt-[30px] max-w-[678px] font-figtree font-normal leading-[1.275] text-white text-[14px] sm:text-[15px]">
            {intro}
          </p>

          <div className="relative mt-10 w-full max-w-[678px]">
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

        {/* ── Right column: 4 numbered cards — wider (7/12) so cards wrap to fewer lines ── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
          {cards.map(({ number, text }) => (
            <div
              key={number}
              className="flex flex-col rounded-[20px] border px-[22px] py-7 sm:px-[26px] sm:py-8"
              style={{ borderColor: "#6D80ED" }}
            >
              <p className="font-figtree font-bold leading-none text-white text-[28px] sm:text-[32px]">
                {number}
              </p>
              <span className="mt-4 mb-5 h-[2px] w-14 shrink-0 rounded-full" style={{ background: "#6679E4" }} />
              <p className="font-figtree font-normal leading-[1.275] text-white text-[14px] sm:text-[15px]">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

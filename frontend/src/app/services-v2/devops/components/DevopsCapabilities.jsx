"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";

// Figma node 1329:501. A six-stop horizontal timeline: spheres sit on a shared
// axis, with cards alternating above (01/03/05) and below (02/04/06), each tied
// to the axis by a hairline stem that ends in a dot at the card's top-left.
const HEADING_GRADIENT =
  "linear-gradient(5.03deg, #7784C5 33.66%, #B7BEED 48.02%, #6077EC 58.53%, #7683C5 85.2%)";

// Exported sphere fill: radial gradient centred at 36%/32% reaching the outer
// colour at 72% of the diameter (Figma userSpaceOnUse r=161.28 on a 224 circle).
const SPHERE_FILL = "radial-gradient(ellipse 72% 72% at 36% 32%, #6679E4 0%, #1D1F4B 100%)";
const LINE_COLOR = "#6679E4";

// The timeline and the stacked list are two renderings of the same six items.
// Mounting both (split only by `hidden lg:grid` / `lg:hidden`) put every title
// and paragraph in the HTML twice, so crawlers saw each capability doubled.
// Mount one at a time instead — the same fix SdIndustries and
// WebDevelopmentWhyChooseSection already use. Defaults to false so SSR emits
// the mobile list, matching mobile-first indexing, then swaps after mount.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return isDesktop;
}

const DEFAULT_ITEMS = [
  {
    title: "DevSecOps and Compliance",
    desc: "Security checks, vulnerability scanning, and compliance validation built directly into the CI/CD pipeline rather than run as a separate audit after the fact.",
  },
  {
    title: "DevSecOps and Compliance",
    desc: "Security checks, vulnerability scanning, and compliance validation built directly into the CI/CD pipeline rather than run as a separate audit after the fact.",
  },
  {
    title: "DevSecOps and Compliance",
    desc: "Security checks, vulnerability scanning, and compliance validation built directly into the CI/CD pipeline rather than run as a separate audit after the fact.",
  },
  {
    title: "DevSecOps and Compliance",
    desc: "Security checks, vulnerability scanning, and compliance validation built directly into the CI/CD pipeline rather than run as a separate audit after the fact.",
  },
  {
    title: "DevSecOps and Compliance",
    desc: "Security checks, vulnerability scanning, and compliance validation built directly into the CI/CD pipeline rather than run as a separate audit after the fact.",
  },
  {
    title: "DevSecOps and Compliance",
    desc: "Security checks, vulnerability scanning, and compliance validation built directly into the CI/CD pipeline rather than run as a separate audit after the fact.",
  },
];

// Stem left edge sits on the sphere's left edge; the card clears it by ~7% of
// the column, mirroring Figma's 135px stem against a 155px card origin.
const STEM_X = "11%";
const CARD_X = "18%";

function CardBody({ title, desc }) {
  return (
    <>
      <p className="font-figtree font-bold leading-[1.2] text-white text-[18px] sm:text-[20px] tracking-[-0.02em]">
        {title}
      </p>
      <p className="mt-[14px] font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px]">
        {desc}
      </p>
    </>
  );
}

// Sits on the stem: left lands on STEM_X, then the negative margin pulls the
// 10px dot back by half its width so it is centred on the 1px line.
function Dot({ top }) {
  return (
    <span
      aria-hidden
      className="absolute size-[10px] rounded-full"
      style={{ top, left: STEM_X, marginLeft: "-4.5px", background: LINE_COLOR }}
    />
  );
}

export default function DevopsCapabilities({ data } = {}) {
  const heading = data?.heading || "Capabilities Most DevOps";
  const headingAccent = data?.headingAccent || "Vendors Treat as an Afterthought";
  const intro =
    data?.intro ||
    "Setting up a pipeline is the easy part of this work. The capabilities below are what decide whether that pipeline still makes sense a year later.";
  const items = data?.items?.length ? data.items : DEFAULT_ITEMS;
  const isDesktop = useIsDesktop();

  return (
    <section className="relative overflow-hidden" style={{ background: "#130E2A" }}>
      <div className="mx-auto w-full max-w-[1500px] px-5 py-12 sm:px-8 lg:px-16 lg:py-14">
        <div className="mb-12 flex flex-col gap-[18px] lg:mb-14">
          <h2 className="font-figtree font-normal leading-[1.2] text-[24px] sm:text-[28px] tracking-[-0.01em]">
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADING_GRADIENT }}>
              {heading}{" "}
            </span>
            <span className="text-white">{headingAccent}</span>
          </h2>

          <p className="font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px]">
            {intro}
          </p>
        </div>

        {/* ── lg+: the horizontal timeline ──
            Three explicit rows (above-axis cards / spheres / below-axis cards)
            shared by all six columns. The card rows size to their tallest card,
            so real CMS copy of any length grows the row instead of overflowing
            a fixed height and sliding under the spheres. */}
        {isDesktop ? (
          <div className="grid grid-cols-6" style={{ gridTemplateRows: "auto auto auto" }}>
            {items.map((item, i) => {
              const isAbove = i % 2 === 0;
              return (
                <Fragment key={i}>
                  {/* Row 1 — cards above the axis, bottom-aligned so every card
                      keeps the same clearance from the spheres regardless of
                      how many lines it runs to. */}
                  <div
                    className="relative flex items-end"
                    style={{ gridColumn: i + 1, gridRow: 1 }}
                  >
                    {isAbove && (
                      <div className="relative w-full pb-6">
                        <span
                          aria-hidden
                          className="absolute bottom-0 top-[5px] w-px"
                          style={{ left: STEM_X, background: LINE_COLOR }}
                        />
                        <Dot top={0} />
                        <div style={{ paddingLeft: CARD_X }}>
                          <CardBody {...item} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Row 2 — the axis. Line and stem continuations sit behind
                      the sphere, which is opaque and hides where they cross. */}
                  <div
                    className="relative flex items-center justify-center"
                    style={{ gridColumn: i + 1, gridRow: 2 }}
                  >
                    {/* The axis stops under the first and last spheres rather than
                        running to the track edges, so no stub pokes out either end. */}
                    <span
                      aria-hidden
                      className="absolute top-1/2 h-px -translate-y-1/2"
                      style={{
                        left: i === 0 ? STEM_X : 0,
                        right: i === items.length - 1 ? STEM_X : 0,
                        background: LINE_COLOR,
                      }}
                    />
                    <span
                      aria-hidden
                      className={`absolute w-px ${isAbove ? "top-0 h-1/2" : "bottom-0 top-1/2"}`}
                      style={{ left: STEM_X, background: LINE_COLOR }}
                    />

                    <div
                      className="relative z-10 flex aspect-square w-[78%] items-center justify-center rounded-full"
                      style={{ background: SPHERE_FILL }}
                    >
                      <span className="font-figtree font-normal leading-none text-white text-[22px] xl:text-[26px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Dashed connector ring, centred on the axis at each gap. */}
                    {i < items.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute right-0 top-1/2 z-10 flex size-8 translate-x-1/2 -translate-y-1/2 items-center justify-center"
                      >
                        <Image src="/devops/connector.png" alt="" width={32} height={32} className="size-8" />
                        <span
                          className="absolute size-[10px] rounded-full"
                          style={{ background: LINE_COLOR }}
                        />
                      </span>
                    )}
                  </div>

                  {/* Row 3 — cards below the axis. Figma drops the stem ~30px
                      clear of the sphere before the dot. */}
                  <div className="relative" style={{ gridColumn: i + 1, gridRow: 3 }}>
                    {!isAbove && (
                      <>
                        <span
                          aria-hidden
                          className="absolute top-0 h-[30px] w-px"
                          style={{ left: STEM_X, background: LINE_COLOR }}
                        />
                        <Dot top={25} />
                        <div style={{ paddingLeft: CARD_X, paddingTop: 22 }}>
                          <CardBody {...item} />
                        </div>
                      </>
                    )}
                  </div>
                </Fragment>
              );
            })}
          </div>
        ) : (
          /* ── below lg: the same sequence read vertically ── */
          <div className="flex flex-col">
            {items.map((item, i) => (
              <div key={i} className="relative flex gap-5 pb-10 last:pb-0 sm:gap-7">
                {i < items.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-[31px] top-[68px] w-px sm:left-[39px] sm:top-[84px]"
                    style={{ background: LINE_COLOR }}
                  />
                )}
                <div
                  className="flex size-16 shrink-0 items-center justify-center rounded-full sm:size-20"
                  style={{ background: SPHERE_FILL }}
                >
                  <span className="font-figtree font-normal leading-none text-white text-[18px] sm:text-[22px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex-1 pt-1">
                  <CardBody {...item} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

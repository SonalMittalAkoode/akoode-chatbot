"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useIsDesktop from "@/hooks/useIsDesktop";
import resolveAsset, { IS_DEV } from "../resolveAsset";

const ACCENT_GRADIENT =
  "linear-gradient(12.986deg, #7784C5 33.662%, #B7BEED 48.02%, #6077EC 58.532%, #7683C5 85.197%)";

const CARD_GRADIENT =
  "linear-gradient(159.386deg, #130E2A 7.213%, #1D2B70 62.836%, #162050 92.787%)";

const INDUSTRIES = [
  { n: "01", label: "Real Estate", href: "/industries/real-estate" },
  { n: "02", label: "Healthcare", href: "/industries/healthcare" },
  { n: "03", label: "Retail & E-Commerce", href: "/industries/retail-and-ecommerce" },
  { n: "04", label: "Media & Entertainment", href: "/industries/media-and-entertainment" },
  { n: "05", label: "Finance & Banking", href: "/industries/finance-and-banking" },
  { n: "06", label: "Automotive", href: "/industries/automotive" },
  { n: "07", label: "Agriculture", href: "/industries/agriculture" },
  { n: "08", label: "Telecommunication", href: "/industries/telecommunication" },
  { n: "09", label: "Manufacturing", href: "/industries/manufacturing" },
  { n: "10", label: "Public Sector & Government", href: "/industries/public-sector" },
  { n: "11", label: "Energy & Utilities", href: "/industries/energy-and-utilities" },
  { n: "12", label: "Travel & Hospitality", href: "/industries/travel-and-hospitality" },
  { n: "13", label: "Education & E-Learning", href: "/industries/education" },
  { n: "14", label: "Insurance", href: "/industries/insurance" },
  { n: "15", label: "Logistics & Supply Chain", href: "/industries/logistics" },
];

const DETAILS = {
  0: {
    bullets: [
      "Unified property management systems",
      "Connected customer engagement",
      "Real-time leasing data and insights",
    ],
    body: "Property management still runs on spreadsheets and phone calls at more businesses than you'd expect. We build digital platforms that unify property management, customer engagement, and leasing data, so decisions get made on current occupancy and demand instead of a report someone compiled last month.",
    image: "/digital-transformation/industry-real-estate.webp",
    imageAlt: "Isometric render of a connected real estate development",
    stats: [
      { value: "40%", label: "Operational efficiency" },
      { value: "60%", label: "Faster decision-making" },
    ],
  },
};

const DEFAULT_INDEX = 0;

const CODED_ITEMS = INDUSTRIES.map((item, i) => ({ ...item, ...(DETAILS[i] || {}) }));

// The industry title, linked to its own page when the CMS row sets `href`.
// The heading element is unchanged either way — only its text becomes a link —
// so the outline stays intact whether or not a row is linked.
function IndustryTitle({ item, className }) {
  const label = item?.label;
  if (!label) return null;
  return (
    <h3 className={className}>
      {item?.href ? (
        <Link
          href={item.href}
          className="rounded-sm underline decoration-white/40 underline-offset-4 transition-colors duration-200 hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#889AF5]"
        >
          {label}
        </Link>
      ) : (
        label
      )}
    </h3>
  );
}

function Bullets({ detail, compact }) {
  if (!detail?.bullets?.length) return null;
  return (
    <ul
      className={`flex flex-col gap-[clamp(6px,0.473vw,9px)] ${
        compact ? "" : "pt-[clamp(12px,0.947vw,18px)] lg:min-h-[7.891vw] lg:w-[87.34%]"
      }`}
    >
      {(detail.bullets || []).map((bullet, i) => (
        <li key={i} className="flex items-center gap-[clamp(6px,0.473vw,9px)]">
          <span
            aria-hidden
            className="shrink-0 rounded-[3.5px] bg-[#6679E4] size-[clamp(7px,0.526vw,10px)]"
          />
          <span
            className={`font-figtree font-normal leading-[1.4] text-white ${
              compact ? "text-[15px]" : "text-[14px] sm:text-[15px] lg:text-[16px]"
            }`}
          >
            {bullet}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Stats({ detail, compact }) {
  if (!detail?.stats?.length) return null;
  return (
    <div
      className={`flex items-stretch border-t-[0.8px] border-white ${
        compact
          ? "mt-5 pt-4"
          : "mt-[clamp(16px,1.157vw,22px)] pt-[clamp(10px,0.789vw,15px)] lg:min-h-[6.155vw] lg:w-[87.34%]"
      }`}
    >
      {(detail.stats || []).map((stat, i) => (
        <div
          key={i}
          className={
            i === 0
              ? "flex-1 pr-[clamp(10px,0.736vw,14px)]"
              : "flex-1 shrink-0 border-l border-white pl-[clamp(14px,1.262vw,24px)] lg:w-[50.96%] lg:flex-none"
          }
        >
          <p
            className={`font-figtree font-black leading-[1] tracking-[-0.04em] text-[#889AF5] ${
              compact ? "text-[22px]" : "text-[clamp(20px,1.4729vw,28px)]"
            }`}
          >
            {stat.value} <span className="text-[0.54em]">&uarr;</span>
          </p>
          <p
            className={`pt-[5px] font-figtree font-normal leading-[1.4] text-white ${
              compact
                ? "text-[14px]"
                : `text-[14px] sm:text-[15px] lg:text-[16px] ${i === 0 ? "lg:w-[7.364vw]" : "lg:w-[9.942vw]"}`
            }`}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function Illustration({ detail, compact }) {
  if (!detail?.image) return null;
  return (
    <div
      className={`relative overflow-hidden ${
        compact ? "mx-auto mt-6 w-full max-w-[300px] sm:max-w-[380px]" : "w-full lg:w-[55.1%] lg:shrink-0"
      }`}
    >
      <div className="relative aspect-[662/611] w-full">
        <Image
          src={resolveAsset(detail.image)}
          alt={detail.imageAlt || ""}
          fill
          sizes={compact ? "380px" : "(max-width: 1023px) 100vw, 46vw"}
          className="object-contain"
          unoptimized={IS_DEV}
        />
      </div>
    </div>
  );
}

export default function DtIndustries({ data } = {}) {
  const heading = data?.heading || "What Digital Transformation\nActually Costs";
  const headingAccent = data?.headingAccent || "and How Long It Takes";
  const intro =
    data?.intro ||
    "On the page directly, rather than left for a sales call, because cost and timeline are usually the two questions that decide whether a shortlist conversation even starts.";
  const listTitle = data?.listTitle || "Explore\nIndustries";
  const items = data?.items?.length ? data.items : CODED_ITEMS;

  const isDesktop = useIsDesktop();
  const [selected, setSelected] = useState(DEFAULT_INDEX);
  const [openIndex, setOpenIndex] = useState(DEFAULT_INDEX);

  const active = items[selected] || items[0] || {};
  const activeDetail = active?.body ? active : null;

  return (
    <section className="relative w-full bg-[#F8FAFF]">
      <div className="mx-auto w-full max-w-[1901px] px-5 pt-8 sm:px-8 lg:px-0 lg:pl-[4.261%] lg:pt-[2.576vw]">
        <h2 className="font-figtree font-semibold capitalize leading-[1.02] text-[24px] sm:text-[28px]">
          <span className="whitespace-pre-line text-[#1D1F4B]">{heading} </span>
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: ACCENT_GRADIENT }}>
            {headingAccent}
          </span>
        </h2>
        <p className="mt-[clamp(10px,0.7364vw,14px)] font-figtree font-normal leading-[1.1] text-[#1D1F4B] text-[14px] sm:text-[15px] lg:text-[16px] lg:w-[53.5%]">
          {intro}
        </p>
      </div>

      {/* ── Accordion, below lg ── */}
      {!isDesktop && (
      <div className="mx-auto w-full max-w-[1901px] px-5 pb-8 pt-8 sm:px-8">
        <p className="whitespace-pre-line font-figtree text-[16px] font-bold uppercase leading-[1.4] text-[#1D1F4B]">
          {listTitle}
        </p>

        <ul className="mt-4 flex flex-col gap-2">
          {items.map((item, i) => {
            const detail = item?.body ? item : null;
            const open = detail && openIndex === i;
            return (
              <li key={i}>
                <button
                  type="button"
                  disabled={!detail}
                  aria-expanded={detail ? open : undefined}
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  className={`flex w-full items-center justify-between gap-4 rounded-[14px] px-4 py-3 text-left transition-colors ${
                    open ? "bg-[#1D1F4B]" : "bg-transparent"
                  } ${detail ? "cursor-pointer" : "cursor-default"}`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`min-w-[18px] font-figtree text-[14px] font-medium ${
                        open ? "text-[#8B8A9E]" : "text-[#1D1F4B]"
                      }`}
                    >
                      {item.n}
                    </span>
                    <span
                      className={`font-figtree text-[16px] font-medium ${
                        open ? "font-semibold text-white" : "text-[#1D1F4B]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </span>

                  {detail && (
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-full"
                      style={{ background: open ? "rgba(255,255,255,0.12)" : "rgba(29,31,75,0.08)" }}
                    >
                      <Image
                        src="/digital-transformation/ind-arrow.svg"
                        alt=""
                        width={20}
                        height={20}
                        className={`size-4 transition-transform duration-300 ${
                          open ? "rotate-90" : ""
                        }`}
                      />
                    </span>
                  )}
                </button>

                {open && (
                  <div
                    className="mt-2 overflow-hidden rounded-[20px] px-5 py-6"
                    style={{ backgroundImage: CARD_GRADIENT }}
                  >
                    <p className="font-figtree text-[14px] font-medium tracking-[0.018em] text-white">
                      {item.n} —
                    </p>
                    <IndustryTitle
                      item={item}
                      className="mt-2 font-figtree text-[20px] sm:text-[22px] font-black leading-[1.05] tracking-[-0.0207em] text-white"
                    />
                    <div className="mt-4">
                      <Bullets detail={detail} compact />
                    </div>
                    <p className="mt-4 font-figtree text-[15px] font-normal leading-[1.5] text-white">
                      {detail.body}
                    </p>
                    <Stats detail={detail} compact />
                    <Illustration detail={detail} compact />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      )}

      {isDesktop && (
      <div className="mx-auto w-full max-w-[1901px] lg:mt-[1.736vw] lg:flex lg:items-start lg:gap-[7.386%] lg:pb-[2.576vw] lg:pl-[3.787%] lg:pr-[5.05%]">
        <div className="lg:w-[17.080%] lg:shrink-0">
          <p className="whitespace-pre-line font-figtree font-bold uppercase leading-[1.4] text-[#1D1F4B] text-[14px] sm:text-[15px] lg:text-[16px]">
            {listTitle}
          </p>

          <ul className="mt-[clamp(10px,0.736vw,14px)] flex flex-col gap-[clamp(8px,0.736vw,14px)]">
            {items.map((item, i) => {
              const detail = item?.body ? item : null;
              const isActive = i === selected;
              return (
                <li key={i}>
                  <button
                    type="button"
                    disabled={!detail}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => setSelected(i)}
                    className={
                      isActive
                        ? "flex w-full items-center justify-between gap-4 rounded-[20px] border-l-[1.6px] border-[#6679E4] bg-[#1D1F4B] py-[6px] pl-[14px] pr-[8px] text-left lg:h-[3.314vw]"
                        : "flex w-full items-center rounded-[7px] border-l-[1.6px] border-transparent px-[8px] py-[6px] text-left"
                    }
                  >
                    <span
                      className={
                        isActive
                          ? "flex items-center gap-[clamp(8px,0.631vw,12px)]"
                          : "flex items-center gap-[clamp(5px,0.316vw,6px)]"
                      }
                    >
                      <span
                        className={
                          isActive
                            ? "min-w-[14px] font-figtree font-medium tracking-[0.019em] text-[#8B8A9E] text-[14px] sm:text-[15px] lg:text-[16px]"
                            : "min-w-[14px] font-figtree font-medium tracking-[0.025em] text-[#1D1F4B] text-[14px] sm:text-[15px] lg:text-[16px]"
                        }
                      >
                        {item.n}
                      </span>
                      <span
                        className={
                          isActive
                            ? "font-figtree font-semibold leading-[1.4] text-white text-[14px] sm:text-[15px] lg:text-[16px]"
                            : "font-figtree font-medium leading-[1.4] text-[#1D1F4B] text-[14px] sm:text-[15px] lg:text-[16px]"
                        }
                      >
                        {item.label}
                      </span>
                    </span>

                    {isActive && (
                      <span
                        className="flex shrink-0 items-center justify-center rounded-[24px] h-[clamp(30px,2.051vw,39px)] w-[clamp(32px,2.209vw,42px)]"
                        style={{ background: "rgba(255,255,255,0.12)" }}
                      >
                        <Image
                          src="/digital-transformation/ind-arrow.svg"
                          alt=""
                          width={20}
                          height={20}
                          className="size-[clamp(14px,1.052vw,20px)]"
                        />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          className="overflow-hidden rounded-[clamp(24px,3.051vw,58px)] pb-[clamp(16px,1.157vw,22px)] pl-[clamp(18px,2.209vw,42px)] pr-[clamp(16px,1.157vw,22px)] pt-[clamp(18px,1.262vw,24px)] lg:sticky lg:top-[100px] lg:mt-[1.841vw] lg:min-h-[41.452vw] lg:w-[75.534%] lg:self-start"
          style={{ backgroundImage: CARD_GRADIENT }}
        >
          <div className="flex items-center justify-between lg:h-[3.998vw]">
            <p className="font-figtree font-medium leading-[1.4] tracking-[0.018em] text-white text-[14px] sm:text-[15px] lg:text-[16px]">
              {active.n} —
            </p>
            <div className="flex items-start gap-[7px]">
              {[
                { src: "ind-prev.svg", bg: "rgba(255,255,255,0.07)" },
                { src: "ind-next.svg", bg: "rgba(102,121,228,0.35)" },
              ].map((nav) => (
                <span
                  key={nav.src}
                  className="flex shrink-0 items-center justify-center rounded-full border-2 border-[#576099] size-[clamp(40px,3.156vw,60px)]"
                  style={{ background: nav.bg }}
                >
                  <Image
                    src={`/digital-transformation/${nav.src}`}
                    alt=""
                    width={40}
                    height={40}
                    className="size-[clamp(26px,2.104vw,40px)]"
                  />
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-8 lg:w-[95.98%] lg:flex-row lg:items-center lg:gap-0">
            <div className="lg:w-[44.9%] lg:shrink-0">
              <IndustryTitle
                item={active}
                className="pt-[clamp(6px,0.631vw,12px)] font-figtree font-black leading-[1.05] tracking-[-0.0207em] text-white text-[clamp(28px,3.0510vw,58px)] lg:min-h-[3.472vw]"
              />

              {activeDetail && (
                <>
                  <Bullets detail={activeDetail} />
                  <p className="pt-[clamp(10px,0.631vw,12px)] font-figtree font-normal leading-[1.4] text-white text-[14px] sm:text-[15px] lg:text-[16px] lg:min-h-[13.467vw]">
                    {activeDetail.body}
                  </p>
                  <Stats detail={activeDetail} />
                </>
              )}
            </div>

            {activeDetail && <Illustration detail={activeDetail} />}
          </div>
        </div>
      </div>
      )}
    </section>
  );
}

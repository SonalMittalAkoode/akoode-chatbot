"use client";

import { useState } from "react";
import { SA_SERVICES } from "../saData";

// Figma node 1066:1751 — the accent half of the heading, at 21.66deg.
const HEADING_GRADIENT =
  "linear-gradient(21.66deg, #7784C5 33.662%, #B7BEED 48.02%, #6077EC 58.532%, #7683C5 85.197%)";

const INK = "#111827";
const BODY_INK = "#1D2033";
const META_INK = "#1D1F4B";
const RULE = "#E5E7EB";
const ACCENT = "#7186FA";
const NODE = "#6679E4";

const TWO_UP_ROW =
  "flex flex-col gap-y-7 sm:flex-row sm:gap-x-8 xl:ml-[17.34%] xl:gap-x-[8.44%]";
const TWO_UP_COL =
  "flex flex-col gap-y-7 sm:flex-1 xl:w-[35.31%] xl:flex-none xl:gap-y-14";
const THREE_UP_GRID =
  "grid grid-cols-1 gap-y-7 sm:grid-cols-2 sm:gap-x-8 " +
  "xl:grid-cols-[29.19%_29.19%_29.19%] xl:gap-x-[4.65%]";

const RAIL_W = "xl:w-[83.82%]";
const LABEL_COLS = "xl:grid-cols-[repeat(4,20.712%)_minmax(0,1fr)]";
const LABEL_CAP = "xl:max-w-[57.5%]";
const LABEL_CAP_LAST = "xl:max-w-[79%]";

function Timeline({ steps }) {
  if (!steps?.length) return null;
  const last = steps.length - 1;

  return (
    <div className="pt-7 xl:pt-[34px]">
      {/* Node rail — every node but the last trails a connecting line. Only
          shown at xl: below that the labels cannot hold the node pitch, and a
          rail whose dots do not line up with the copy beneath reads as broken.
          Smaller screens get the same steps as a bulleted list instead. */}
      <div className={`hidden items-center xl:flex ${RAIL_W}`}>
        {steps.map((step, i) => (
          <div
            key={`node-${i}`}
            className={`flex items-center ${i === last ? "shrink-0" : "min-w-0 flex-1"}`}
          >
            <span
              aria-hidden
              className="size-[10px] shrink-0 rounded-[5px]"
              style={{ background: NODE }}
            />
            {i < last && (
              <span aria-hidden className="h-px min-w-0 flex-1" style={{ background: NODE }} />
            )}
          </div>
        ))}
      </div>

      {/* No column gap at xl: Figma carries that 16px as padding INSIDE each
          cell (1066:1898 pr-[16px]), so the cells stay on the 213.75px pitch and
          line up with the nodes. A real gap pushes each label 16px further right
          than the one before it — by the fifth, 61px adrift. */}
      <ol className={`mt-2.5 grid list-none grid-cols-1 gap-x-8 gap-y-2 p-0 sm:grid-cols-2 xl:gap-x-0 xl:gap-y-0 ${LABEL_COLS}`}>
        {steps.map((step, i) => (
          <li
            key={`label-${i}`}
            className={`flex min-w-0 items-start gap-2 font-figtree font-normal text-[12px] leading-[1.35] sm:text-[13px] xl:block xl:text-[14px] xl:leading-[17.4px] ${i === last ? LABEL_CAP_LAST : LABEL_CAP
              }`}
            style={{ color: INK }}
          >
            <span
              aria-hidden
              className="mt-[6px] size-[6px] shrink-0 rounded-full xl:hidden"
              style={{ background: NODE }}
            />
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Block({ block }) {
  return (
    <div className="flex min-w-0 flex-col">
      <p
        className="m-0 font-figtree font-bold leading-[1.2] text-[15px] sm:text-[17px]"
        style={{ color: INK }}
      >
        {block.label}
      </p>
      <p
        className="m-0 pt-2.5 font-figtree font-normal leading-[1.6] text-[13px] sm:text-[14px]"
        style={{ color: BODY_INK }}
      >
        {block.body}
      </p>
    </div>
  );
}

function ServiceRow({ item, index, isOpen, onToggle }) {
  const n = String(index + 1).padStart(2, "0");
  const blocks = item.blocks || [];

  const twoUp = blocks.length >= 4;
  const panelId = `sa-service-panel-${index}`;
  const buttonId = `sa-service-button-${index}`;
  const headingId = `sa-service-heading-${index}`;

  return (
    <div
      className={index === 0 ? "border-t-0 xl:border-t-[1.67px]" : "border-t-[1.67px]"}
      style={{ borderColor: RULE }}
    >
      <div className="relative">
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-labelledby={headingId}
          onClick={onToggle}
          className="peer absolute inset-0 z-10 w-full cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
          style={{ outlineColor: ACCENT }}
        />

        <div className="flex w-full items-center gap-4 py-5 transition-opacity duration-200 peer-hover:opacity-80 peer-focus-visible:opacity-80 sm:gap-6 xl:min-h-[74px] xl:gap-[35px] xl:py-0">
          <span
            className="shrink-0 font-figtree font-bold leading-[30px] tracking-[-0.4px] text-[18px] sm:text-[22px]"
            style={{ color: ACCENT }}
          >
            {n}
          </span>

          <span aria-hidden className="hidden h-[22px] w-px shrink-0 xl:block" style={{ background: RULE }} />

          <h3
            id={headingId}
            className="m-0 min-w-0 flex-1 font-figtree font-semibold leading-[1.25] tracking-[-0.4px] text-[15px] sm:text-[18px]"
            style={{ color: INK }}
          >
            {item.title}
          </h3>

          {item.duration && (
            <span
              className="hidden shrink-0 whitespace-nowrap font-figtree font-normal leading-[21px] text-[14px] xl:block xl:text-[16px]"
              style={{ color: META_INK }}
            >
              {item.duration}
            </span>
          )}
          {item.price && (
            <span
              className="hidden shrink-0 whitespace-nowrap font-figtree font-normal leading-[21px] text-[14px] xl:block xl:text-[16px]"
              style={{ color: META_INK }}
            >
              {item.price}
            </span>
          )}

          <span
            aria-hidden
            className="shrink-0 select-none text-center font-figtree font-light leading-none text-[30px] xl:text-[40px]"
            style={{ color: META_INK, width: 23 }}
          >
            {isOpen ? "\u2212" : "+"}
          </span>
        </div>
      </div>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        className={`pb-10 xl:pt-[18px] xl:pb-[52px] ${isOpen ? "block" : "hidden"}`}
      >
        {(item.duration || item.price) && (
          <div
            className="mb-6 flex flex-wrap gap-x-6 gap-y-1 font-figtree text-[14px] xl:hidden"
            style={{ color: META_INK }}
          >
            {item.duration && <span>{item.duration}</span>}
            {item.price && <span>{item.price}</span>}
          </div>
        )}

        {twoUp ? (
          <div className="grid grid-cols-1 gap-y-7 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 xl:ml-[17.34%] xl:gap-x-[8.44%]">
            {blocks.map((block, i) => {
              let orderClass = "order-1";
              if (i === 1) orderClass = "order-2 sm:order-3";
              else if (i === 2) orderClass = "order-3 sm:order-2";
              else if (i === 3) orderClass = "order-4 sm:order-4";
              return (
                <div key={i} className={orderClass}>
                  <Block block={block} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className={THREE_UP_GRID}>
            {blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        )}

        <Timeline steps={item.steps} />
      </div>
    </div>
  );
}

export default function StaffAugServicesSection({ data } = {}) {
  const heading = data?.heading || "Our staff Augmentation";
  const headingAccent = data?.headingAccent || "Services";
  const intro =
    data?.intro ||
    "Every placement gets scoped against a specific gap and a defined outcome, not a generic headcount request. The models below are the ways we combine engineers into your team; most clients use one or two.";
  const rawItems = data?.items?.length ? data.items : SA_SERVICES;
  const items = rawItems.filter((item) => item && item.title && item.title.trim());

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative bg-white">

      <div className="mx-auto grid w-full max-w-[1901px] grid-cols-1 gap-y-10 px-5 py-10 sm:px-8 lg:py-14 xl:grid-cols-[32.341%_59.073%] xl:gap-x-[8.586%] xl:pl-[5.576%] xl:pr-[2.525%]">

        <div className="xl:sticky xl:top-28 xl:mt-[20px] xl:self-start">
          <h2
            className="m-0 font-figtree font-normal capitalize leading-[1.2] text-[24px] sm:text-[28px]"
            style={{ color: "#191A2E" }}
          >
            {heading}{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADING_GRADIENT }}>
              {headingAccent}
            </span>
          </h2>
          <p
            className="mt-[18px] font-figtree font-normal capitalize leading-[1.6] text-[14px] sm:text-[15px]"
            style={{ color: "#191A2E" }}
          >
            {intro}
          </p>
        </div>

        {/* ── Accordion column ── */}
        <div className="flex flex-col gap-[18px]">
          {items.map((item, i) => (
            <ServiceRow
              key={item.title || i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((prev) => (prev === i ? -1 : i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

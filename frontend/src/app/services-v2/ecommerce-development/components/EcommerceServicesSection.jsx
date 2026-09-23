"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Gradient on the second line of the heading (Figma 17.19deg).
const HEADING_GRADIENT =
  "linear-gradient(17.19deg, #7784C5 33.66%, #B7BEED 48.02%, #6077EC 58.53%, #7683C5 85.2%)";

// Number-bar segment colours, dark → light (cycles per position within a row of 4).
const BAR_COLORS = ["#1D1F4B", "#464981", "#6467A9", "#8E91D7"];

// Fallback content shown when no CMS record supplies ecommerceServices.items.
const DEFAULT_SERVICES = [
  {
    title: "Custom Ecommerce Development",
    desc: "Storefronts and commerce engines written from scratch in Next.js and Node. You decide how the catalogue is structured, how checkout behaves, and how fast the thing runs, because you own all of it. No rented platform, no monthly ceiling on what you can build.",
  },
  {
    title: "B2B Ecommerce Development",
    desc: "Wholesale does not work like retail, and pretending otherwise is why most B2B portals fail. We build quote-based ordering, account-level price books, credit limits, approval chains and bulk reordering, so your dealers stop calling and start ordering at 11pm on their own.",
  },
  {
    title: "Ecommerce App Development",
    desc: "Mobile commerce apps in React Native and Flutter, running on the same backend as your web store. One inventory, one customer record, everywhere. Built for repeat purchase behaviour, with push re-engagement and checkout fast enough that nobody abandons it out of boredom.",
  },
  {
    title: "Ecommerce Marketplace Development",
    desc: "Multi-vendor platforms with seller onboarding, commission engines, split payments and dispute handling. The buyer-facing catalogue is honestly the easy half. The operational tooling that keeps two hundred sellers behaving is the part we obsess over.",
  },
  {
    title: "Headless Ecommerce Development",
    desc: "A decoupled frontend over commerce APIs, which means your content team, your merchandisers and your checkout can each ship on their own schedule. Makes particular sense for brands running several storefronts or regions off one product backend.",
  },
  {
    title: "Ecommerce Integrations",
    desc: "Payment gateways, ERP, CRM, logistics APIs, tax engines, accounting. Integration work is where stores quietly bleed money, usually through silent failures nobody notices for a fortnight. We build integrations with retries, alerts and reconciliation, and we treat them as core engineering rather than plumbing.",
  },
  {
    title: "Custom Ecommerce development",
    desc: "Structured moves off Shopify, WooCommerce, Magento or a legacy custom build, with SEO preservation baked into the acceptance criteria. URLs, rankings, order history and customer accounts come with you. Both platforms run in parallel until cutover is boring, which is exactly how cutover should feel.",
  },
  {
    title: "Custom ecommerce development",
    desc: "Monitoring, patching, integration upkeep, and conversion iteration after launch. Your store keeps a named team that knows the codebase. Not a ticket queue, not a rotating cast of strangers.",
  },
];

function ServiceCard({ n, desc, title, colorIdx }) {
  return (
    <div className="flex h-full flex-col">
      {/* number badge — shown on the mobile/tablet stack where the bar is hidden */}
      <span
        className="mb-3 inline-flex w-fit items-center justify-center rounded-[12px] px-4 py-1 font-figtree text-[20px] font-bold text-white lg:hidden"
        style={{ background: BAR_COLORS[colorIdx] }}
      >
        {n}
      </span>

      <div className="flex h-full flex-col border-l-2 pl-5" style={{ borderColor: "#7185FA" }}>
        <h3 className="mb-2.5 font-figtree text-[18px] sm:text-[20px] font-semibold leading-[1.2] text-[#1D1F4B]">
          {title}
        </h3>
        <p className="flex-1 font-figtree text-[14px] sm:text-[15px] font-normal leading-[1.6] text-[#1D1F4B]">
          {desc}
        </p>
        <Link
          href="/contact-us"
          className="group mt-4 inline-flex w-fit items-center gap-1.5 font-figtree text-[15px] font-semibold tracking-[-0.135px] text-[#7185FA]"
        >
          Talk to our team
          <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export default function EcommerceServicesSection({ data } = {}) {
  const heading = data?.heading || "Our Ecommerce";
  const headingAccent = data?.headingAccent || "Development Services";
  const intro =
    data?.intro ||
    "Every engagement here is scoped against a commercial number: conversion, cost to serve, or a channel that does not exist yet. These are the ecommerce development services clients hire us for most.";
  const rawItems = data?.items?.length ? data.items : DEFAULT_SERVICES;
  const SERVICES = rawItems.map((it, i) => ({ n: String(i + 1).padStart(2, "0"), title: it.title, desc: it.desc }));

  // Small screens: reveal 4 cards first, then 2 more per "View more" click.
  // The unrevealed cards stay mounted and are hidden with CSS rather than
  // sliced out of the array — slicing removed them from the DOM entirely,
  // which is what made a second desktop-only copy necessary in the first place.
  const [visible, setVisible] = useState(4);

  return (
    <section className="relative" style={{ background: "#F8FAFF" }}>
      <div className="mx-auto w-full max-w-[1721px] px-5 py-16 sm:px-8 lg:px-[106px] lg:py-[70px]">
        {/* header */}
        <div className="mb-12 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <h2 className="shrink-0 font-figtree font-normal leading-[1.2] text-[24px] sm:text-[28px]">
            <span className="text-[#1D1F4B]">{heading} </span>
            <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADING_GRADIENT }}>
              {headingAccent}
            </span>
          </h2>
          <p className="font-figtree font-normal leading-[1.6] text-[#1D1F4B] text-[14px] sm:text-[15px] lg:max-w-[1035px]">
            {intro}
          </p>
        </div>

        {/* One grid for every breakpoint. Below lg it stacks 1-up / 2-up and the
            number badge inside ServiceCard shows; at lg+ it becomes 4-up and the
            number-bar strip above each card takes over. Previously these were two
            separate blocks, so the first four services rendered twice in the DOM. */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-12">
          {SERVICES.map((s, i) => {
            const colorIdx = i % BAR_COLORS.length;
            // Column position within the lg 4-up row — drives the bar bleed and
            // stacking so the strip still reads as one continuous band per row.
            const col = i % 4;
            const isLastInRow = col === 3 || i === SERVICES.length - 1;
            return (
              <div
                key={s.n}
                className={`flex-col ${i < visible ? "flex" : "hidden lg:flex"}`}
              >
                {/* number-bar segment — sits in the card's own column so the seam
                    lands exactly on the next card's accent line; each segment bleeds
                    ~4px past the gap so the bar reads as one continuous strip */}
                <div
                  className="relative mb-11 hidden h-[94px] items-center justify-center rounded-[12px] px-[14px] lg:flex"
                  style={{
                    background: BAR_COLORS[colorIdx],
                    width: isLastInRow ? "100%" : "calc(100% + 24px)",
                    zIndex: col,
                  }}
                >
                  <span className="font-figtree text-[30px] font-bold leading-9 text-white">{s.n}</span>
                </div>
                <ServiceCard {...s} colorIdx={colorIdx} />
              </div>
            );
          })}
        </div>

        {/* Reveal control is small-screen only — at lg+ every card is already shown */}
        {visible < SERVICES.length && (
          <div className="mt-10 flex justify-center lg:hidden">
            <button
              type="button"
              onClick={() => setVisible((v) => Math.min(v + 2, SERVICES.length))}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-figtree text-[15px] font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(90deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)" }}
            >
              View more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

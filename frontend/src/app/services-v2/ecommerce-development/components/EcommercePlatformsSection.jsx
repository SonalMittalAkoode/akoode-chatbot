"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Heading accent gradient (Figma 18.49deg).
const HEADING_GRADIENT =
  "linear-gradient(18.49deg, #7784C5 33.66%, #B7BEED 48.02%, #6077EC 58.53%, #7683C5 85.2%)";

const LEFT_GRADIENT =
  "linear-gradient(90deg, rgba(19,14,42,0) 22%, #2A2F58 40%, #566099 62%, #889AF5 85%, #7C89DE 100%)";
const RIGHT_BG = "#14102C";
const CARD_BORDER = "rgba(136,154,245,0.18)";

// Fallback content shown when no CMS record supplies ecommercePlatforms.rows.
const DEFAULT_PLATFORMS = [
  {
    title: "Shopify Development Company",
    desc: "Shopify suits fast-moving D2C brands and international sellers who want speed to market without sacrificing scale. We build custom Shopify and Shopify Plus stores, from theme development to app integration, tuned for conversion rather than just launch speed.",
    ctaText: "Explore Shopify Development",
  },
  {
    title: "WooCommerce Website Development Company",
    desc: "WooCommerce works best for content-led brands and WordPress publishers who want deep customisation without enterprise licensing costs. Our WooCommerce builds pair strong SEO foundations with performance tuning most agencies skip.",
    ctaText: "Explore WooCommerce Development",
  },
  {
    title: "Magento Development Company",
    desc: "Magento earns its complexity for large catalogues, multi-store operations and B2B pricing rules that simpler platforms cannot handle. We build and migrate Magento 2 stores engineered for enterprise scale, not just enterprise price tags.",
    ctaText: "Explore Magento Development",
  },
  {
    title: "OpenCart Development Company",
    desc: "OpenCart gives small and mid-sized businesses a lightweight, cost-effective route into ecommerce without unnecessary overhead. We build OpenCart stores that stay fast and manageable as the catalogue grows, not just at launch.",
    ctaText: "Explore OpenCart Development",
  },
];

export default function EcommercePlatformsSection({ data } = {}) {
  const heading = data?.heading || "Ecommerce Platforms";
  const headingAccent = data?.headingAccent || "we specialise in";
  const intro =
    data?.intro ||
    "Choosing the right platform decides how far a store scales before it needs rebuilding, and no single platform is right for every business model. As an ecommerce development company working across all the major options, we build platform-specific solutions matched to your catalogue size, budget and growth plan.";
  const rawRows = data?.rows?.length ? data.rows : DEFAULT_PLATFORMS;
  const PLATFORMS = rawRows.map((r, i) => ({
    n: String(i + 1).padStart(2, "0"),
    title: r.title,
    body: r.desc,
    cta: r.ctaText || `Explore ${r.title}`,
    href: r.ctaLink || "/contact-us",
  }));

  return (
    <section className="relative" style={{ background: "#130E2A" }}>
      <div className="mx-auto w-full max-w-[1760px] px-5 py-16 sm:px-8 lg:px-16 lg:py-[88px]">
        {/* header */}
        <div className="mb-12 flex flex-col gap-6 lg:mb-[64px] lg:flex-row lg:items-start lg:gap-[26px]">
          <h2 className="shrink-0 font-figtree font-normal leading-[1.2] text-[24px] sm:text-[28px]">
            <span className="text-white">{heading} </span>
            <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADING_GRADIENT }}>
              {headingAccent}
            </span>
          </h2>
          <p className="font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px] lg:max-w-[1011px]">
            {intro}
          </p>
        </div>

        {/* rows */}
        <div className="flex flex-col gap-[21px]">
          {PLATFORMS.map((p) => (
            <div key={p.n} className="relative min-h-[120px] lg:min-h-[150px]">
              {/* desktop: two overlapping rounded cards — dark (right) sits behind, the
                  gradient card (left) layers on top so the glow reads in front at the seam */}
              <div
                aria-hidden
                className="absolute inset-y-0 right-0 hidden w-[50%] rounded-[36px] border lg:block"
                style={{ background: RIGHT_BG, borderColor: CARD_BORDER }}
              />
              <div
                aria-hidden
                className="absolute inset-y-0 left-0 hidden w-[54%] rounded-[36px] lg:block"
                style={{ backgroundImage: LEFT_GRADIENT }}
              />
              {/* mobile: single card */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-[36px] border lg:hidden"
                style={{ backgroundImage: LEFT_GRADIENT, borderColor: CARD_BORDER }}
              />

              {/* content */}
              <div className="relative z-10 flex h-full min-h-[120px] flex-col gap-6 px-6 py-8 lg:min-h-[150px] lg:flex-row lg:items-center lg:gap-0 lg:px-0 lg:py-0">
                {/* left — number + divider + title */}
                <div className="flex items-center gap-5 lg:w-[55%] lg:shrink-0 lg:pl-[40px]">
                  <span className="font-figtree font-bold leading-none text-white text-[clamp(2.75rem,4.5vw,4rem)]">
                    {p.n}
                  </span>
                  <div className="flex min-h-[64px] items-center border-l-[1.67px] border-white pl-[30px] lg:min-h-[79px]">
                    <h3 className="font-figtree font-semibold leading-[1.2] text-white text-[18px] sm:text-[20px]">
                      {p.title}
                    </h3>
                  </div>
                </div>

                {/* right — body + links (sits on the dark card, past the gradient edge) */}
                <div className="flex flex-col gap-2.5 lg:flex-1 lg:pl-8 lg:pr-[40px]">
                  <p className="font-figtree text-[14px] sm:text-[15px] font-normal leading-[1.6] text-white">
                    {p.body}
                  </p>
                  <Link
                    href={p.href}
                    className="group inline-flex w-fit items-center gap-1.5 font-figtree text-[15px] font-semibold tracking-[-0.135px] text-[#7185FA]"
                  >
                    {p.cta}
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

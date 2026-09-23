"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CaseStudySearch from "./CaseStudySearch";

/* ------------------------------------------------------------------ *
 *  Generic category card grid for the case-study listing page —
 *  converted from the Figma category frames (AI & ML, Web & Platform…):
 *  icon chip + two-tone heading, grid of white cards (image, category
 *  pill, title, client, divider, result + arrow).
 *
 *  On phones only the first `mobileVisibleCount` cards are visible
 *  until "View More" is tapped. The rest are hidden with CSS
 *  (`hidden sm:flex`), never removed from the DOM, so crawlers always
 *  see every card in the server-rendered HTML.
 * ------------------------------------------------------------------ */
/* Card-count → layout, per the Figma listing rules:
 *   1–2 cards → the wide 2-up layout
 *   3 cards   → 3-up
 *   4 cards   → 4-up (one full row)
 *   5+ cards  → 3-up (wraps into further rows of 3)
 * Pass `columns` explicitly only to override this. */
function autoColumns(count) {
    if (count <= 2) return "2";
    if (count === 3) return "3";
    if (count === 4) return "4";
    return "3";
}

export default function CategoryCasesSection({
    id,
    icon: Icon,
    headingDark,
    headingLight,
    items,
    /* "2" | "3" | "4" (lg column count) — auto-derived from items.length
       per the Figma rules; pass explicitly only to force a layout. */
    columns,
    sectionBgClassName = "bg-[#F4F5FA]",
    mobileVisibleCount = 3,
    /* Figma flips the heading tones on some frames (light words first) */
    headingLightFirst = false,
    /* When set, the heading gets an arrow linking to the filtered
       /case-studies category listing. */
    viewAllHref,
    /* When set, renders a search box (searching this full flat list, not
       just `items`) to the right of the arrow. */
    searchItems,
}) {
    const [expanded, setExpanded] = useState(false);
    const headingId = `${id}-title`;
    const resolvedColumns = columns || autoColumns(items.length);
    const isSingleCard = items.length === 1;
    // A lone card renders in a single column at one 2-up column's width
    // (~790px), so it matches the 2-up card style instead of shrinking
    // to half a row.
    const gridCols = isSingleCard
        ? "gap-6"
        : resolvedColumns === "4"
          ? "gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7"
          : resolvedColumns === "2"
            ? "gap-6 sm:grid-cols-2 lg:gap-12"
            : "gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7";

    return (
        <section
            aria-labelledby={headingId}
            className={`${sectionBgClassName} font-figtree`}
        >
            <div className="mx-auto w-full max-w-[1630px] px-5 py-12 sm:px-8 sm:py-16 lg:px-[clamp(2rem,4vw,4.25rem)] lg:py-20">
                {/* Section heading — the arrow + (optional) search box sit at the
                    far right; the search box pushes the arrow in from the edge.
                    Wraps to its own full-width row on phones. */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4 sm:mb-10 sm:flex-nowrap">
                    <div className="flex min-w-0 items-center gap-4">
                        <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_2px_10px_rgba(29,31,75,0.08)]">
                            <Icon
                                className="h-6 w-6 text-[#5971fc]"
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                        </span>
                        <h2
                            id={headingId}
                            className="font-normal leading-tight tracking-[0] text-[clamp(1.5rem,2.4vw,2.5rem)]"
                        >
                            {headingLightFirst ? (
                                <>
                                    <span className="text-[#A0ABDC]">{headingLight}</span>{" "}
                                    <span className="text-[#3D4665]">{headingDark}</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-[#3D4665]">{headingDark}</span>{" "}
                                    <span className="text-[#A0ABDC]">{headingLight}</span>
                                </>
                            )}
                        </h2>
                    </div>

                    <div className="order-3 flex w-full items-center gap-3 sm:order-none sm:w-auto">
                        {/* Arrow → the filtered /case-studies category listing.
                            Hover matches the NavBar phone/CTA button gradient. */}
                        {viewAllHref && (
                            <Link
                                href={viewAllHref}
                                aria-label={`View all ${headingDark} ${headingLight} case studies`}
                                className="group/all flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D7DCF2] bg-white text-[#5971fc] transition-all duration-300 hover:border-[#7683C5] hover:bg-[linear-gradient(180deg,#7784C5_0%,#495074_50%,#4F5581_100%)] hover:text-white hover:shadow-[0px_0px_30px_0px_#A855F766] sm:h-11 sm:w-11"
                            >
                                <ArrowRight
                                    className="h-5 w-5 transition-transform duration-300 group-hover/all:translate-x-0.5"
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                            </Link>
                        )}

                        {searchItems && <CaseStudySearch items={searchItems} />}
                    </div>
                </div>

                {/* Card grid — every card always in the DOM for SEO */}
                <div
                    className={`grid grid-cols-1 ${gridCols} ${
                        isSingleCard ? "sm:max-w-[792px]" : ""
                    }`}
                >
                    {items.map((item, index) => (
                        <article
                            key={item.image}
                            className={`group flex-col overflow-hidden rounded-xl border border-[#E7EAF4] bg-white transition-shadow duration-300 hover:shadow-[0_14px_34px_rgba(29,31,75,0.12)] ${
                                index >= mobileVisibleCount && !expanded
                                    ? "hidden sm:flex"
                                    : "flex"
                            }`}
                        >
                            {/* Uploads arrive in mixed ratios, so the image keeps its
                                own natural ratio (w-full h-auto) — full card width,
                                nothing cropped. flex-1 makes this zone (not the text
                                block) absorb the row's height difference, so the text
                                content stays compact and bottom-aligned across cards
                                whose images are shorter than the row's tallest. */}
                            <div className="relative w-full flex-1 flex items-center overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={0}
                                    height={0}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
                                />
                            </div>

                            <div className="flex flex-col items-start gap-2 p-4 sm:p-5">
                                <span className="rounded-full bg-[#EDEFFB] px-3 py-1.5 text-[12px] font-medium leading-none text-[#7C86D8]">
                                    {item.category}
                                </span>

                                <h3 className="text-[17px] font-semibold leading-[1.3] text-[#191A2E] sm:text-[18px]">
                                    {item.title}
                                </h3>

                                <p className="text-[13px] font-normal leading-[1.4] text-[#6A7282] sm:text-[14px]">
                                    {item.client}
                                </p>

                                <div className="w-full border-t border-[#EEF0F6] pt-3">
                                    <Link
                                        href={item.href || "/case-studies"}
                                        aria-label={`Read the ${item.title} case study`}
                                        className="flex w-full items-center justify-between gap-3 text-left"
                                    >
                                        <span className="text-[13px] font-normal leading-[1.4] text-[#4A5565] sm:text-[14px]">
                                            {item.result}
                                        </span>
                                        <ArrowRight
                                            className="h-5 w-5 shrink-0 text-[#5971fc] transition-transform duration-300 group-hover:translate-x-1"
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Phone-only reveal for the remaining cards */}
                {!expanded && items.length > mobileVisibleCount && (
                    <div className="mt-8 flex justify-center sm:hidden">
                        <button
                            type="button"
                            onClick={() => setExpanded(true)}
                            aria-expanded={expanded}
                            className="inline-flex items-center gap-2 rounded-full border border-[#5971fc] px-6 py-2.5 text-[15px] font-medium text-[#5971fc] transition-colors duration-300 hover:bg-[#5971fc] hover:text-white"
                        >
                            View More
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

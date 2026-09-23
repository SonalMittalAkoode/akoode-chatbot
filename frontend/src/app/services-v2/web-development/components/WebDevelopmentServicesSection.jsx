"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HEADING_GRADIENT =
  "linear-gradient(18.49deg, #7784C5 33.66%, #B7BEED 48.02%, #6077EC 58.53%, #7683C5 85.2%)";

// Figma canvas the desktop orbit composition below was measured against
// (node 700:466, frame 1901 wide). CONTENT_TOP is the y of the topmost
// orbit element (item 01's card) and CONTENT_H is the height of everything
// below it (through item 04's card, the tallest drop) — together they define
// a local box we re-baseline every coordinate against. Positions are stored
// as % of that box so the whole composition scales fluidly with the
// container instead of clipping on narrower desktops.
const DESIGN_W = 1901;
const CONTENT_TOP = 217;
const CONTENT_H = 917; // 1133.25 (item04 card bottom) − 217, rounded up
const L = (px) => `${((px / DESIGN_W) * 100).toFixed(3)}%`;
const T = (px) => `${(((px - CONTENT_TOP) / CONTENT_H) * 100).toFixed(3)}%`;
const W = (px) => `${((px / DESIGN_W) * 100).toFixed(3)}%`;
const H = (px) => `${((px / CONTENT_H) * 100).toFixed(3)}%`;

// Figma had real, unique copy only for items 01–03; 04–08 were left as an
// unfinished placeholder (same title and paragraph repeated five times), so
// those five use this page's own service copy instead of shipping the
// duplicate placeholder text.
const DEFAULT_SERVICES = [
  {
    title: "Custom Website Development",
    desc: "Websites built from scratch in Next.js, shaped around how your business actually converts. No rented themes, no plugin ceiling on what you can build.",
  },
  {
    title: "Web Application Development",
    desc: "Dashboards, portals, SaaS products and internal tools that handle real operational complexity. We build web applications for performance under load and security under attack, because both get tested eventually whether you planned for it or not.",
  },
  {
    title: "Website Design (UI/UX)",
    desc: "Design that starts from user journeys and conversion evidence rather than moodboards. Our design team works alongside the engineers from day one, so nothing beautiful gets specified that cannot be built fast.",
  },
  {
    title: "Ecommerce Website Development",
    desc: "Storefronts and checkout flows engineered for conversion, from product catalogues to payment integrations, built to scale past your first thousand orders.",
  },
  {
    title: "CMS & Content-Driven Websites",
    desc: "Editable, structured content platforms your marketing team can actually run without filing a ticket every time a page needs to change.",
  },
  {
    title: "API Development & Integrations",
    desc: "CRMs, payment gateways, ERPs and third-party services connected with retries, logging and alerts — treated as core engineering, not plumbing.",
  },
  {
    title: "AI-Powered Web Platforms",
    desc: "Search, recommendations, chat and automation layered into your platform where it moves a real metric, not bolted on for the sake of a feature list.",
  },
  {
    title: "Website Maintenance & Support",
    desc: "Monitoring, patching and iteration after launch, with a named team that knows the codebase, not a rotating queue of strangers.",
  },
];

// Desktop item slots — number+title+desc box position, and the matching
// connector-line asset that runs from the sphere out to that slot. All
// coordinates are in the original Figma frame's px space; L/T/W/H rescale
// them relative to the content box above.
const SLOTS = [
  { box: { left: 55, top: 217, width: 468 }, connector: { src: "/web_dev/services/group737.svg", left: 439, top: 231, width: 303.064, height: 185.797, transform: "scaleY(-1) rotate(180deg)" } },
  { box: { left: 55, top: 449, width: 436 }, connector: { src: "/web_dev/services/group742.svg", left: 446, top: 459, width: 257, height: 103, transform: "scaleY(-1) rotate(180deg)" } },
  { box: { left: 54, top: 704, width: 400 }, connector: { src: "/web_dev/services/group743.svg", left: 438, top: 631, width: 276, height: 83, transform: "rotate(180deg)" } },
  { box: { left: 55, top: 950, width: 397 }, connector: { src: "/web_dev/services/group739.svg", left: 480, top: 778, width: 370.064, height: 190, transform: "rotate(180deg)" } },
  { box: { left: 1443, top: 224, width: 400 }, connector: { src: "/web_dev/services/group736.svg", left: 1153.94, top: 242, width: 265.064, height: 165.297, transform: "none" } },
  { box: { left: 1445, top: 457, width: 394 }, connector: { src: "/web_dev/services/group740.svg", left: 1200, top: 462, width: 219, height: 91.797, transform: "none" } },
  { box: { left: 1445, top: 694, width: 394 }, connector: { src: "/web_dev/services/group741.svg", left: 1191, top: 618, width: 228, height: 91.797, transform: "scaleY(-1)" } },
  { box: { left: 1445, top: 920, width: 391 }, connector: { src: "/web_dev/services/group738.svg", left: 1063, top: 776, width: 366, height: 159, transform: "scaleY(-1)" } },
];

// Sphere, orbit ring and glow bar — same content box, re-baselined via T()/H().
const SPHERE = { left: 701, top: 302, size: 500 };
const RING = { left: 701, top: 312, size: 500 };
const GLOW_BAR = { left: 729, top: 336, width: 225, height: 436 };

// Small glowing accent dots scattered along the connector lines. Figma's
// source only had 7 of these for 8 lines — item 03's ("Website Design
// (UI/UX)") was missing one; added here at the matching corner of its
// connector (group743) following the same offset pattern as its sibling
// (group739/item 04, which uses the same rotate-180 transform family).
const DOTS = [
  { left: 1184, top: 613 },
  { left: 1192, top: 542 },
  { left: 1148, top: 398 },
  { left: 735, top: 404 },
  { left: 694, top: 552 },
  { left: 1056, top: 769 },
  { left: 838, top: 770 },
  { left: 706, top: 625 },
];

function NumberedCard({ n, title, desc, ctaText, ctaLink, boxStyle }) {
  return (
    <div className="absolute flex items-start gap-2" style={boxStyle}>
      <p className="w-9 shrink-0 font-figtree text-[20px] font-bold leading-none text-white sm:text-[22px]">{n}</p>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
        <h3 className="font-figtree text-[14px] font-semibold leading-[1.2] text-white sm:text-[15px]">{title}</h3>
        <p className="font-figtree text-[12px] font-normal leading-[1.5] text-white sm:text-[13px]">{desc}</p>
        <Link
          href={ctaLink}
          className="group mt-0.5 inline-flex items-center gap-1.5 font-figtree text-[12px] font-semibold tracking-[-0.135px] sm:text-[13px]"
          style={{ color: "#7185FA" }}
        >
          {ctaText}
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

function MobileCard({ n, title, desc, ctaText, ctaLink }) {
  return (
    <div className="flex flex-col border-l-2 pl-5" style={{ borderColor: "#7185FA" }}>
      <span className="mb-2 font-figtree text-[15px] font-bold leading-none" style={{ color: "#7185FA" }}>
        {n}
      </span>
      <h3 className="mb-2.5 font-figtree text-[18px] font-semibold leading-[1.2] text-white sm:text-[20px]">{title}</h3>
      <p className="font-figtree text-[14px] font-normal leading-[1.6] text-white sm:text-[15px]">{desc}</p>
      <Link
        href={ctaLink}
        className="group mt-4 inline-flex w-fit items-center gap-1.5 font-figtree text-[15px] font-semibold tracking-[-0.135px]"
        style={{ color: "#7185FA" }}
      >
        {ctaText}
        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

export default function WebDevelopmentServicesSection({ data } = {}) {
  const heading = data?.heading || "Our Web Development";
  const headingAccent = data?.headingAccent || "Services";
  const intro =
    data?.intro ||
    "Everything below gets scoped against a commercial outcome: more qualified leads, faster load times, lower maintenance cost, or a platform that finally supports what the business wants to do next.";
  const rawItems = data?.items?.length ? data.items : DEFAULT_SERVICES;
  const items = rawItems.map((it, i) => ({
    n: String(i + 1).padStart(2, "0"),
    title: it.title,
    desc: it.desc,
    ctaText: it.ctaText || "Learn More",
    ctaLink: it.ctaLink || "/contact-us",
  }));

  // The desktop orbit layout and the mobile stacked list used to both render
  // unconditionally (split only by `hidden lg:block` / `lg:hidden`), shipping
  // every service's title + description twice in the HTML. Mount only one at
  // a time instead — default to the mobile list (matches SSR / mobile-first
  // indexing, so hydration doesn't mismatch), swap to the desktop orbit
  // post-mount if the viewport actually is one.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ background: "#130E2A" }}>
      <div className="mx-auto w-full max-w-[1721px] px-5 py-16 sm:px-8 lg:px-[76px] lg:py-[70px]">
        {/* ── Header ── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <h2 className="shrink-0 font-figtree font-normal leading-[1.2] text-[24px] sm:text-[28px]">
            <span className="text-white">{heading} </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADING_GRADIENT }}>
              {headingAccent}
            </span>
          </h2>
          <p className="font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px] lg:max-w-[1011px]">
            {intro}
          </p>
        </div>

        {isDesktop && (
        <div className="relative mt-16 w-full" style={{ aspectRatio: `${DESIGN_W} / ${CONTENT_H}` }}>
          {/* sphere */}
          <img
            src="/web_dev/services/ellipse34.svg"
            alt=""
            className="absolute"
            style={{ left: L(SPHERE.left), top: T(SPHERE.top), width: W(SPHERE.size), height: H(SPHERE.size) }}
          />
          {/* dashed orbit ring */}
          <div
            className="absolute flex items-center justify-center"
            style={{ left: L(RING.left), top: T(RING.top), width: W(RING.size), height: H(RING.size) }}
          >
            <img src="/web_dev/services/group723.svg" alt="" className="h-full w-full rotate-90" />
          </div>
          {/* glow bar behind the sphere */}
          <div
            className="absolute rounded-bl-[228px] rounded-tl-[228px]"
            style={{
              left: L(GLOW_BAR.left),
              top: T(GLOW_BAR.top),
              width: W(GLOW_BAR.width),
              height: H(GLOW_BAR.height),
              backgroundImage: "linear-gradient(33deg, #1D1F4B 26%, #3A4178 45%, #6679E4 70%, #889AF5 100%)",
            }}
          />
          {/* connector lines */}
          {SLOTS.map((s, i) => (
            <img
              key={i}
              src={s.connector.src}
              alt=""
              className="absolute"
              style={{
                left: L(s.connector.left),
                top: T(s.connector.top),
                width: W(s.connector.width),
                height: H(s.connector.height),
                transform: s.connector.transform,
              }}
            />
          ))}
          {/* accent dots */}
          {DOTS.map((d, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: L(d.left),
                top: T(d.top),
                width: W(14),
                height: H(14),
                background: "#28326D",
                boxShadow: "0px 4px 4px 0px #7186FA, 2px 0px 65.8px 0px rgba(113,134,250,0.25)",
              }}
            />
          ))}
          {/* numbered service cards */}
          {items.map((item, i) => (
            <NumberedCard
              key={item.n}
              n={item.n}
              title={item.title}
              desc={item.desc}
              ctaText={item.ctaText}
              ctaLink={item.ctaLink}
              boxStyle={{
                left: L(SLOTS[i].box.left),
                top: T(SLOTS[i].box.top),
                width: W(SLOTS[i].box.width),
              }}
            />
          ))}
        </div>
        )}

        {/* ── Mobile/tablet: simple stacked list ── */}
        {!isDesktop && (
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
          {items.map((item) => (
            <MobileCard
              key={item.n}
              n={item.n}
              title={item.title}
              desc={item.desc}
              ctaText={item.ctaText}
              ctaLink={item.ctaLink}
            />
          ))}
        </div>
        )}
      </div>
    </section>
  );
}

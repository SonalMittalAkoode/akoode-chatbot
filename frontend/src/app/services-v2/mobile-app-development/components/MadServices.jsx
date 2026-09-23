"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import madData from "../madData";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: (i % 4) * 0.08 },
  }),
};

// Glowing spine dot.
function Dot() {
  return (
    <span
      aria-hidden
      className="h-3.5 w-3.5 shrink-0 rounded-full"
      style={{ background: "#717DBB", boxShadow: "0 0 10px #6679E4" }}
    />
  );
}

// Gradient pill tag (IOS, ANDROID, …) — links to the service sub-page when `link` is set.
function Pill({ children, link }) {
  const cls =
    "inline-flex items-center rounded-md px-3.5 py-1.5 font-figtree font-semibold uppercase text-[16px] tracking-wide text-white";
  const style = { background: "linear-gradient(90deg, #6E78C7 0%, #5B6CFF 100%)" };
  if (link) {
    return (
      <Link href={link} className={`${cls} transition-opacity hover:opacity-90`} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <span className={cls} style={style}>
      {children}
    </span>
  );
}

// Connector line between cards.
// `arrow` = "left" | "right" (double-headed) | "wrap-left" (left only) |
//           "wrap-right" (right only) | "line" (plain) | null.
function Connector({ arrow }) {
  if (!arrow) return null;
  const both = arrow === "left" || arrow === "right";
  const showLeft = both || arrow === "wrap-left";
  const showRight = both || arrow === "wrap-right";
  return (
    <span className="flex items-center flex-1 ml-2" aria-hidden>
      {showLeft && <ChevronLeft size={18} className="-mr-[5px]" style={{ color: "#6077EC" }} />}
      <span className="flex-1 h-[2px]" style={{ background: "linear-gradient(90deg, #576099, #6077EC)" }} />
      {showRight && <ChevronRight size={18} className="-ml-[5px]" style={{ color: "#6077EC" }} />}
    </span>
  );
}

function Card({ svc, index, arrow, down }) {
  return (
    <m.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="relative min-w-0"
    >
      {/* right-side U-turn: drops from the end of row 1 (03) down to row 2 (04),
          turning left into the back-flow with a chevron at the bottom. */}
      {down && (
        <span aria-hidden className="absolute right-0 top-[19px]" style={{ height: "calc(100% + 56px)" }}>
          <span
            className="absolute right-0 top-0 h-full w-[2px] rounded"
            style={{ background: "linear-gradient(180deg, #576099, #6077EC)" }}
          />
        </span>
      )}
      {/* dot + number + pill + connecting arrow (starts at the pill) */}
      <div className="flex items-center gap-2.5 mb-3">
        <Dot />
        <span className="font-figtree font-semibold text-[16px]" style={{ color: "#B7BEED" }}>
          {svc.num}
        </span>
        <Pill link={svc.link}>{svc.tag}</Pill>
        <Connector arrow={arrow} />
      </div>
      <h3 className="font-figtree font-semibold text-white text-[16px] leading-tight mb-2">
        {svc.link ? (
          <Link href={svc.link} className="transition-colors hover:text-[#B7BEED]">
            {svc.title}
          </Link>
        ) : (
          svc.title
        )}
      </h3>
      <div
        className="font-figtree text-[13px] leading-[1.65] [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:underline [&_strong]:font-semibold"
        style={{ color: "rgba(255,255,255,0.6)" }}
        dangerouslySetInnerHTML={{ __html: svc.desc || "" }}
      />
    </m.div>
  );
}

export default function MadServices({ data }) {
  const heading = data?.heading || "Custom Mobile App Development";
  const headingAccent = data?.headingAccent || "Services";
  const intro = data?.intro || "";
  // Use the CMS services whenever they exist; only fall back to the static set
  // when there are none. The pill `tag` isn't persisted by the backend, so derive
  // a short label from the title (strip the "App Development" suffix).
  const rawItems = data?.items || [];
  // Snake cards live under the `process` key (stored in `process.steps`).
  const sourceItems = rawItems.length ? rawItems : madData.process.steps;
  const items = sourceItems.map((s, i) => ({
    num: s.num || String(i + 1).padStart(2, "0"),
    tag: s.tag || (s.title || "").replace(/\s*app\s*development$/i, "").replace(/\s*development$/i, "").trim() || s.title,
    title: s.title,
    desc: s.desc,
    link: s.link || s.href || "",
  }));

  const row1 = items.slice(0, 3); // 01 → 03 (arrows right)
  const row2 = items.slice(3, 6).reverse(); // 06 ← 04 (arrows left, starts from the right at 04)

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{ background: "linear-gradient(180deg, #1D2033 0%, #101828 100%)" }}
    >
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 rounded-full blur-[120px]"
        style={{ width: 800, height: 400, background: "radial-gradient(circle, rgba(113,134,250,0.12) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4">
        {/* header: heading left, intro right */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-end mb-12 lg:mb-16">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-figtree font-bold text-[24px] sm:text-[28px] capitalize leading-tight"
          >
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #7784C5 0%, #B7BEED 30%, #6077EC 50%, #7683C5 100%)" }}
            >
              {heading}
            </span>{" "}
            <span className="text-white">{headingAccent}</span>
          </m.h2>
          {intro && (
            <m.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-figtree text-[14px] sm:text-[15px] leading-[1.7]"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {intro}
            </m.p>
          )}
        </div>

        {/* ── desktop snake (lg+) ── */}
        <div className="hidden lg:flex flex-col gap-14">
          {/* row 1 → forward (right) arrows; last card (03) turns down on the right */}
          <div className="grid grid-cols-3 gap-x-3">
            {row1.map((svc, i) => (
              <Card
                key={svc.num}
                svc={svc}
                index={i}
                arrow={i < row1.length - 1 ? "wrap-right" : "line"}
                down={i === row1.length - 1}
              />
            ))}
          </div>
          {/* row 2 ← back (left) arrows; starts from the right at 04 (fed by the
              U-turn above), the rest flow left toward 06 */}
          <div className="grid grid-cols-3 gap-x-3">
            {Array.from({ length: Math.max(0, 3 - row2.length) }).map((_, i) => (
              <div key={`pad-${i}`} aria-hidden />
            ))}
            {row2.map((svc, i) => (
              <Card key={svc.num} svc={svc} index={i + 3} arrow="wrap-left" />
            ))}
          </div>
        </div>

        {/* ── mobile / tablet grid (< lg) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 lg:hidden">
          {items.map((svc, i) => (
            <Card key={svc.num} svc={svc} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Snake-connector process section (same design/styling as the Mad snake). The
// columns adapt to the card count: ≤4 → one row, otherwise two balanced rows
// (6 → 3×2, 8 → 4×2). Capped at 4 columns.
const colsFor = (n) => (n <= 4 ? n : Math.min(4, Math.ceil(n / 2)));

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: (i % 4) * 0.08 } }),
};

function Dot() {
  return (
    <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: "#717DBB", boxShadow: "0 0 10px #6679E4" }} />
  );
}

function Pill({ children, link }) {
  const cls = "inline-flex items-center rounded-md px-3.5 py-1.5 font-figtree font-semibold uppercase text-[16px] tracking-wide text-white";
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

// arrow: "wrap-left" | "wrap-right" | "line" | null
function Connector({ arrow }) {
  if (!arrow) return null;
  const showLeft = arrow === "wrap-left";
  const showRight = arrow === "wrap-right";
  return (
    <span className="flex flex-1 items-center ml-2" aria-hidden>
      {showLeft && <ChevronLeft size={18} className="-mr-[5px]" style={{ color: "#6077EC" }} />}
      <span className="h-[2px] flex-1" style={{ background: "linear-gradient(90deg, #576099, #6077EC)" }} />
      {showRight && <ChevronRight size={18} className="-ml-[5px]" style={{ color: "#6077EC" }} />}
    </span>
  );
}

function Card({ svc, index, arrow, down }) {
  return (
    <m.div custom={index} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative min-w-0">
      {/* right-side U-turn down to the next row */}
      {down && (
        <span aria-hidden className="absolute right-0 top-[19px]" style={{ height: "calc(100% + 56px)" }}>
          <span className="absolute right-0 top-0 h-full w-[2px] rounded" style={{ background: "linear-gradient(180deg, #576099, #6077EC)" }} />
        </span>
      )}
      <div className="mb-3 flex items-center gap-2.5">
        <Dot />
        <span className="font-figtree font-semibold text-[16px]" style={{ color: "#B7BEED" }}>
          {svc.num}
        </span>
        <Pill link={svc.link}>{svc.tag}</Pill>
        <Connector arrow={arrow} />
      </div>
      <h3 className="mb-2 font-figtree font-semibold text-[16px] leading-tight text-white">
        {svc.link ? (
          <Link href={svc.link} className="transition-colors hover:text-[#B7BEED]">
            {svc.title}
          </Link>
        ) : (
          svc.title
        )}
      </h3>
      <div className="font-figtree text-[13px] leading-[1.65] [&_p]:m-0" style={{ color: "rgba(255,255,255,0.6)" }} dangerouslySetInnerHTML={{ __html: svc.desc || "" }} />
    </m.div>
  );
}

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

export default function AiProcess({ data }) {
  const heading = data?.heading || "Our AI Development";
  const headingAccent = data?.headingAccent || "Process";
  const intro = data?.intro || "";
  const items = (data?.items || data?.steps || []).map((s, i) => ({
    num: s.num || String(i + 1).padStart(2, "0"),
    tag: s.tag || s.label || s.title,
    title: s.stageTitle || s.title,
    desc: s.desc || s.intro || s.outcome,
    link: s.link || "",
  }));

  if (!items.length) return null;
  const cols = colsFor(items.length);
  const rows = chunk(items, cols);

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24" style={{ background: "linear-gradient(180deg, #1D2033 0%, #101828 100%)" }}>
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 rounded-full blur-[120px]" style={{ width: 800, height: 400, background: "radial-gradient(circle, rgba(113,134,250,0.12) 0%, transparent 70%)" }} />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4">
        {/* header */}
        <div className="mb-12 grid items-end gap-6 lg:mb-16 lg:grid-cols-2 lg:gap-12">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-figtree font-bold text-[24px] sm:text-[28px] capitalize leading-tight"
          >
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #7784C5 0%, #B7BEED 30%, #6077EC 50%, #7683C5 100%)" }}>
              {heading}
            </span>{" "}
            <span className="text-white">{headingAccent}</span>
          </m.h2>
          {intro && (
            <m.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="font-figtree text-[14px] sm:text-[15px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.6)" }}>
              {intro}
            </m.p>
          )}
        </div>

        {/* desktop snake (lg+) */}
        <div className="hidden flex-col gap-14 lg:flex">
          {rows.map((row, r) => {
            const forward = r % 2 === 0;
            const hasNext = r < rows.length - 1;
            const display = forward ? row : [...row].reverse();
            const pad = cols - row.length; // right-align backward rows under the U-turn
            return (
              <div key={r} className="grid gap-x-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                {!forward && Array.from({ length: pad }).map((_, i) => <div key={`pad-${i}`} aria-hidden />)}
                {display.map((svc, i) => {
                  const isLast = i === display.length - 1;
                  if (forward) {
                    return <Card key={svc.num} svc={svc} index={r * cols + i} arrow={isLast ? "line" : "wrap-right"} down={isLast && hasNext} />;
                  }
                  return <Card key={svc.num} svc={svc} index={r * cols + i} arrow="wrap-left" />;
                })}
              </div>
            );
          })}
        </div>

        {/* mobile / tablet grid (< lg) */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:hidden">
          {items.map((svc, i) => (
            <Card key={svc.num} svc={svc} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

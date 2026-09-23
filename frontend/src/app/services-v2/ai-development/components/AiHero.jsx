"use client";

import { Fragment } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import HeroBreadcrumb from "@/components/HeroBreadcrumb";
import {
  Cpu,
  Code2,
  LineChart,
  Network,
  LayoutGrid,
  Database,
} from "lucide-react";
import { resolveIcon } from "../iconResolver";

// Circuit geometry, in the SVG's 1366×370 user space (matches the Figma banner
// proportions). Node boxes AND the chip are sized in the SAME user units (as a
// % of the container width), so wires meet the boxes exactly at any width — the
// container's aspect-ratio equals the viewBox, so 1 user unit is square.
const VW = 1366;
const VH = 370;
const C = { x: 683, y: 185 }; // chip centre

// AI chip — proportions taken straight from the Figma spec (140px box, 12px side
// pins, 8px thickness, ~40px pin pitch, 14.5px legs). Expressed in the SVG's
// user units so the HTML chip and the SVG traces scale together and stay locked.
const BOX = 104; // AI box edge (Figma 140)
const boxL = C.x - BOX / 2;
const boxR = C.x + BOX / 2;
const SIDE_PIN = (12 / 140) * BOX; // side-pin horizontal extent
const ROW_DY = (40 / 140) * BOX; // vertical pitch between the 3 side pins
const tipL = boxL - SIDE_PIN; // left pin tips (where traces begin)
const tipR = boxR + SIDE_PIN; // right pin tips
const ROWS = [C.y - ROW_DY, C.y, C.y + ROW_DY]; // top / mid / bottom pin rows

// Pin/leg positions as fractions of the box (for the HTML nubs).
const SIDE_PIN_W = 12 / 140;
const SIDE_PIN_H = 8 / 140;
const ROW_FRAC = [0.214, 0.5, 0.786]; // Figma rows 46/85/126 within the 140 box
const LEG_W = 8 / 140;
const LEG_H = 30 / 140; // leg length (fraction of box)
const LEG_FRAC = [0.3, 0.5, 0.7]; // three legs, centred under the chip

const NODE = 90; // surrounding icon box (user units)
const NH = NODE / 2;

const NODES = [
  { key: "cpu", Icon: Cpu, x: 327, y: 100, side: "L", row: "top" },
  { key: "code", Icon: Code2, x: 206, y: 185, side: "L", row: "mid" },
  { key: "chart", Icon: LineChart, x: 327, y: 270, side: "L", row: "bot" },
  { key: "net", Icon: Network, x: 1039, y: 100, side: "R", row: "top" },
  { key: "grid", Icon: LayoutGrid, x: 1160, y: 185, side: "R", row: "mid" },
  { key: "db", Icon: Database, x: 1039, y: 270, side: "R", row: "bot" },
];

const pct = (v, total) => `${(v / total) * 100}%`;

// Trace from a node's chip-facing edge to the chip pin tip. Middle = straight
// line; top/bottom = out horizontally, diagonal in, then short horizontal.
function wirePath({ x, y, side, row }) {
  const left = side === "L";
  const edgeX = left ? x + NH : x - NH;
  const tip = left ? tipL : tipR;
  if (row === "mid") return `M ${edgeX} ${C.y} H ${tip}`;
  const pinY = row === "top" ? ROWS[0] : ROWS[2];
  const b1 = left ? edgeX + 92 : edgeX - 92; // end of the icon-side horizontal
  const b2 = left ? tip - 64 : tip + 64; // start of the chip-side horizontal
  return `M ${edgeX} ${y} H ${b1} L ${b2} ${pinY} H ${tip}`;
}

// Exact Figma pin glow.
const PIN_GLOW = "2px 0px 65.8px rgba(113,134,250,0.25), 0px 4px 4px #7186FA";

export default function AiHero({ data, title }) {
  const crumbLabel = title;
  const heading = data?.heading || "Artificial Intelligence";
  const headingAccent = data?.headingAccent || "Development Company";
  const paragraphs = (data?.paragraphs || []).filter(Boolean);
  const cta1Text = data?.cta1Text || "Get free consultation";
  const cta1Link = data?.cta1Link || "/contact-us";
  const cta2Text = data?.cta2Text || "View our AI work";
  const cta2Link = data?.cta2Link || "/case-studies";
  const badges = data?.badges || [];

  return (
    <section
      className="relative overflow-hidden pb-16"
      style={{ background: "linear-gradient(180deg, #1D2033 0%, #181C30 55%, #1D2033 100%)" }}
    >
      {/* keyframes for the data-flow pulses along the wires */}
      <style>{`
        @keyframes aiFlow { to { stroke-dashoffset: 296; } }
        @keyframes aiChipHalo {
          0%, 100% { opacity: 0.75; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
        }
      `}</style>

      {/* background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute rounded-full"
          style={{ width: 700, height: 700, left: "50%", top: -260, transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(113,134,250,0.16) 0%, transparent 70%)", filter: "blur(70px)" }}
        />
        {/* Figma ambient gradient shadow — bottom-left light bloom */}
        <div
          className="absolute"
          style={{ left: 0, bottom: 0, width: "62%", height: "78%", opacity: 0.28, background: "radial-gradient(ellipse 120% 130% at -8.83% 113.49%, #D7DDFF 8%, #5968B3 31%, rgba(0,0,0,0) 54%, rgba(0,0,0,0) 100%)" }}
        />
        {/* mirrored bottom-right light bloom */}
        <div
          className="absolute"
          style={{ right: 0, bottom: 0, width: "62%", height: "78%", opacity: 0.28, background: "radial-gradient(ellipse 120% 130% at 108.83% 113.49%, #D7DDFF 8%, #5968B3 31%, rgba(0,0,0,0) 54%, rgba(0,0,0,0) 100%)" }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4">
        {/* heading + animation — fills one viewport */}
        <div className="min-h-screen flex flex-col justify-center pt-24 pb-4">
        {/* breadcrumb */}
        <HeroBreadcrumb
          align="center"
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: crumbLabel },
          ]}
        />

        {/* heading */}
        <h1
          className="text-center font-figtree font-normal capitalize text-[clamp(1.9rem,3.6vw,3.125rem)]"
          style={{ lineHeight: 1.08 }}
        >
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(90deg, #7784C5 3%, #B7BEED 30%, #6077EC 50%, #7683C5 100%)" }}
          >
            {heading}
          </span>{" "}
          <span className="text-white">{headingAccent}</span>
        </h1>

        {/* subtitle */}
        {paragraphs.length > 0 && (
          <div className="mx-auto mt-4 max-w-[860px] space-y-3 text-center">
            {paragraphs.map((p, i) => (
              <div
                key={i}
                className="font-figtree text-[14px] sm:text-[16px] lg:text-[18px] leading-[1.6] [&_p]:m-0"
                style={{ color: "rgba(255,255,255,0.78)" }}
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={cta1Link}
            className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-figtree font-medium text-[16px] leading-6 text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(71,73,114,0.6)]"
            style={{ background: "linear-gradient(90deg, #7784C5 0%, #4F60B5 55%, #4F5581 100%)", outline: "1.5px solid #889AF5", outlineOffset: "-1.5px" }}
          >
            {cta1Text}
            <ChevronRight size={16} />
          </Link>
          {cta2Text && cta2Link && (
            <Link
              href={cta2Link}
              className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-figtree font-medium text-[16px] leading-6 text-white transition-all duration-300 hover:bg-white/10"
              style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.2)" }}
            >
              {cta2Text}
            </Link>
          )}
        </div>

        {/* circuit diagram — height-capped so the hero fits one viewport; hidden on small screens */}
        <div className="relative mx-auto mt-6 hidden sm:block" style={{ aspectRatio: `${VW} / ${VH}`, height: "min(46vh, 420px)", maxWidth: "100%" }}>
          {/* soft glow bands sitting between the connecting lines (behind the wires) */}
          <div
            aria-hidden
            className="absolute"
            style={{ left: "1%", top: "50%", width: "46%", height: "30%", transform: "translateY(-50%)", background: "radial-gradient(ellipse 78% 58% at 88% 50%, rgba(135,154,245,0.30) 0%, rgba(89,104,179,0.13) 42%, transparent 76%)", filter: "blur(7px)" }}
          />
          <div
            aria-hidden
            className="absolute"
            style={{ right: "1%", top: "50%", width: "46%", height: "30%", transform: "translateY(-50%)", background: "radial-gradient(ellipse 78% 58% at 12% 50%, rgba(135,154,245,0.30) 0%, rgba(89,104,179,0.13) 42%, transparent 76%)", filter: "blur(7px)" }}
          />

          {/* wires (drawn in chip-matching user space so they meet the boxes) */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${VW} ${VH}`}
            fill="none"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              {/* soft glow/shadow for the connector traces — user-space units so
                  it also applies to the perfectly-horizontal centre lines (whose
                  zero-height bounding box would otherwise collapse the region) */}
              <filter id="aiWireGlow" filterUnits="userSpaceOnUse" x="0" y="0" width={VW} height={VH}>
                <feGaussianBlur stdDeviation="2.4" />
              </filter>
            </defs>

            {/* connecting traces */}
            {NODES.map((n, i) => {
              const d = wirePath(n);
              return (
                <g key={n.key}>
                  {/* drop shadow sitting just below the line */}
                  <path d={d} transform="translate(0, 5)" stroke="#5566C4" strokeOpacity="0.55" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#aiWireGlow)" />
                  <path d={d} stroke="#9FB0FF" strokeOpacity="0.9" strokeWidth="1.6" strokeLinejoin="round" />
                  {/* travelling data pulse */}
                  <path
                    d={d}
                    stroke="#C2CCFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="18 296"
                    style={{ animation: "aiFlow 2.8s linear infinite", animationDelay: `${i * 0.34}s` }}
                  />
                </g>
              );
            })}

            {/* static bright "between-lines" dashes sitting on each trace */}
            {NODES.map((n) => {
              const left = n.side === "L";
              const edgeX = left ? n.x + NH : n.x - NH;
              const dx = left ? edgeX + 46 : edgeX - 46;
              const y = n.row === "mid" ? C.y : n.y;
              return (
                <line
                  key={`dash-${n.key}`}
                  x1={dx - 11}
                  y1={y}
                  x2={dx + 11}
                  y2={y}
                  stroke="#C7CFFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              );
            })}
          </svg>

          {/* thin glowing streaks in the gaps BETWEEN the trace rows — each
              starts at the chip and runs outward, with a glowing dot at the end */}
          {[C.y - ROW_DY / 2, C.y + ROW_DY / 2].map((ry, i) =>
            ["L", "R"].map((side) => {
              const left = side === "L";
              const segLen = 76;
              const th = 2;
              const dd = 4; // dot diameter (user units)
              const startX = left ? boxL - segLen : boxR; // streak left edge (starts at chip outline)
              const outerX = left ? boxL - segLen : boxR + segLen; // dot centre (outer end)
              // faded at the chip, glowing toward the outer dot
              const grad = left
                ? "linear-gradient(90deg, rgba(178,190,255,0.95) 0%, rgba(178,190,255,0) 100%)"
                : "linear-gradient(90deg, rgba(178,190,255,0) 0%, rgba(178,190,255,0.95) 100%)";
              return (
                <Fragment key={`gap-${side}-${i}`}>
                  <span
                    aria-hidden
                    className="absolute"
                    style={{
                      left: pct(startX, VW),
                      top: pct(ry - th / 2, VH),
                      width: pct(segLen, VW),
                      height: pct(th, VH),
                      background: grad,
                      boxShadow: "0 0 8px rgba(123,134,250,0.55)",
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute rounded-full"
                    style={{
                      left: pct(outerX - dd / 2, VW),
                      top: pct(ry - dd / 2, VH),
                      width: pct(dd, VW),
                      aspectRatio: "1 / 1",
                      background: "#C7CFFF",
                      boxShadow: "0 0 7px 1px rgba(123,134,250,0.85)",
                    }}
                  />
                </Fragment>
              );
            })
          )}

          {/* node boxes */}
          {NODES.map(({ key, Icon, x, y }) => (
            <span
              key={key}
              className="absolute flex items-center justify-center rounded-[14px]"
              style={{
                left: pct(x, VW),
                top: pct(y, VH),
                width: pct(NODE, VW),
                aspectRatio: "1 / 1",
                transform: "translate(-50%, -50%)",
                background: "linear-gradient(180deg, rgba(38,42,78,0.85) 0%, rgba(24,27,52,0.92) 100%)",
                outline: "1.5px solid rgba(123,142,255,0.65)",
                outlineOffset: "-1.5px",
                boxShadow: "0 6px 22px rgba(0,0,0,0.45), 0 0 18px rgba(102,121,228,0.18)",
              }}
            >
              <Icon className="h-1/2 w-1/2" style={{ color: "#9AA9FF" }} strokeWidth={1.6} />
            </span>
          ))}

          {/* purple bloom behind the chip (Figma radial glow wrapper) */}
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{
              left: "50%",
              top: "50%",
              width: pct(BOX * 2.5, VW),
              aspectRatio: "1 / 1",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(ellipse 70.71% 70.71% at 50% 50%, rgba(102,121,228,0.35) 0%, rgba(0,0,0,0) 70%)",
              animation: "aiChipHalo 3.4s ease-in-out infinite",
            }}
          />

          {/* AI chip unit — box + pins/legs, exact Figma spec */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              width: pct(BOX, VW),
              aspectRatio: "1 / 1",
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* left side pins */}
            {ROW_FRAC.map((f, i) => (
              <span
                key={`pl-${i}`}
                className="absolute"
                style={{
                  left: `${-SIDE_PIN_W * 100}%`,
                  top: `${(f - SIDE_PIN_H / 2) * 100}%`,
                  width: `${SIDE_PIN_W * 100}%`,
                  height: `${SIDE_PIN_H * 100}%`,
                  background: "#7186FA",
                  borderTopLeftRadius: 3,
                  borderBottomLeftRadius: 3,
                  boxShadow: PIN_GLOW,
                }}
              />
            ))}
            {/* right side pins */}
            {ROW_FRAC.map((f, i) => (
              <span
                key={`pr-${i}`}
                className="absolute"
                style={{
                  left: "100%",
                  top: `${(f - SIDE_PIN_H / 2) * 100}%`,
                  width: `${SIDE_PIN_W * 100}%`,
                  height: `${SIDE_PIN_H * 100}%`,
                  background: "#7186FA",
                  borderTopRightRadius: 3,
                  borderBottomRightRadius: 3,
                  boxShadow: PIN_GLOW,
                }}
              />
            ))}
            {/* bottom legs, each tipped with a small glowing dot */}
            {LEG_FRAC.map((f, i) => {
              const dotFrac = 5 / 140; // dot diameter as fraction of the box
              return (
                <Fragment key={`leg-${i}`}>
                  <span
                    className="absolute"
                    style={{
                      left: `${(f - LEG_W / 2) * 100}%`,
                      top: "100%",
                      width: `${LEG_W * 100}%`,
                      height: `${LEG_H * 100}%`,
                      background: "linear-gradient(180deg, rgba(113,134,250,0.45) 0%, #7186FA 100%)",
                      borderBottomLeftRadius: 3,
                      borderBottomRightRadius: 3,
                      boxShadow: "0 0 6px rgba(113,134,250,0.6)",
                    }}
                  />
                  <span
                    className="absolute rounded-full"
                    style={{
                      left: `${(f - dotFrac / 2) * 100}%`,
                      top: `${(1 + LEG_H - dotFrac / 2) * 100}%`,
                      width: `${dotFrac * 100}%`,
                      aspectRatio: "1 / 1",
                      background: "#C7CFFF",
                      boxShadow: "0 0 7px 1px rgba(123,134,250,0.85)",
                    }}
                  />
                </Fragment>
              );
            })}

            {/* the box */}
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background: "#1D1F4B",
                borderRadius: `${(14 / 140) * BOX}%`,
                outline: "4px solid #7186FA",
                outlineOffset: "-4px",
                boxShadow: "0 0 40px 4px rgba(113,134,250,0.45)",
              }}
            >
              <span
                className="font-figtree leading-none"
                style={{
                  color: "#7B8EFF",
                  fontWeight: 800,
                  letterSpacing: "2px",
                  fontSize: `clamp(20px, ${((0.5 * BOX) / VW) * 100}vw, ${((0.5 * BOX) / VW) * 1480}px)`,
                  textShadow: "0 0 18px rgba(123,142,255,0.55)",
                }}
              >
                AI
              </span>
            </div>
          </div>
        </div>
        </div>

        {/* trust strip */}
        {badges.length > 0 && (
          <div
            className="mx-auto mt-6 w-full max-w-[1280px] rounded-[32px] px-6 py-7 sm:px-10"
            style={{
              background: "linear-gradient(180deg, rgba(45,49,80,0.55) 0%, rgba(26,29,52,0.55) 100%)",
              border: "1px solid rgba(136,154,245,0.16)",
              boxShadow: "0 18px 48px rgba(0,0,0,0.32)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-4">
              {badges.map((b, i) => {
                const BadgeIcon = resolveIcon(b.icon) || Sparkles;
                return (
                  <div key={b.title || i} className="flex items-center gap-3.5">
                    <span
                      className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px]"
                      style={{
                        background: "linear-gradient(180deg, #2A2F5C 0%, #1D1F4B 100%)",
                        outline: "1px solid rgba(123,142,255,0.40)",
                        outlineOffset: "-1px",
                        boxShadow: "0 0 18px rgba(102,121,228,0.20)",
                      }}
                    >
                      {BadgeIcon && <BadgeIcon size={24} style={{ color: "#9AA9FF" }} strokeWidth={1.7} />}
                    </span>
                    <div className="min-w-0">
                      <p className="font-figtree font-medium text-[14px] sm:text-[15px] leading-snug text-white">{b.title}</p>
                      {b.subtitle && (
                        <p className="font-figtree text-[12px] leading-snug" style={{ color: "#8A93A8" }}>
                          {b.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { m } from "framer-motion";
import { Shield, User, Layers, ShieldCheck, Cpu, Users } from "lucide-react";

// Right-side diagram lives in a single SVG (viewBox 0 0 1011 640) so the whole
// thing — stack, dashed connectors, badges and labels — scales as one unit and
// keeps the exact Figma proportions at any container width. Badges/labels/chip
// are HTML inside <foreignObject> so they stay selectable + crisp.
const VB_W = 1340;
const VB_H = 800;

// stack geometry — three rounded isometric plates (~28% larger; dominant element)
const SX = 670;
const HW = 262;        // diamond half-width
const HH = 140;        // diamond half-height
const RAD = 36;        // corner radius of each plate
const LAYERS = [438, 360, 282]; // bottom → top (drawn in this order)
const CHIP_Y = 282;    // chip centred on the top plate

// rounded isometric diamond centred at (SX, cy)
function diamond(cy) {
  const top = [SX, cy - HH], right = [SX + HW, cy], bottom = [SX, cy + HH], left = [SX - HW, cy];
  const pts = [top, right, bottom, left];
  const edge = Math.hypot(HW, HH);
  const f = Math.min(RAD, edge * 0.4) / edge; // cut fraction along each edge
  let d = "";
  for (let i = 0; i < 4; i++) {
    const V = pts[i], P = pts[(i + 3) % 4], N = pts[(i + 1) % 4];
    const a = [V[0] + (P[0] - V[0]) * f, V[1] + (P[1] - V[1]) * f];
    const b = [V[0] + (N[0] - V[0]) * f, V[1] + (N[1] - V[1]) * f];
    d += `${i === 0 ? "M" : "L"} ${a[0].toFixed(1)},${a[1].toFixed(1)} Q ${V[0]},${V[1]} ${b[0].toFixed(1)},${b[1].toFixed(1)} `;
  }
  return d + "Z";
}

const NODES = [
  {
    key: "tl",
    Icon: Shield,
    bx: 170, by: 72,
    tx: 40, ty: 150, tw: 360,
    titleBold: "Fewer architecture", titleRest: " reworks",
    desc: "Because compliance and data constraints are factored in from discovery.",
    // badge → right → rounded corner → down → dot at the stack's upper-left
    connector: "M 220,72 H 542 Q 560,72 560,90 V 178",
    dot: [560, 178],
    dot2: [220, 72],
  },
  {
    key: "tr",
    Icon: User,
    bx: 1170, by: 72,
    tx: 940, ty: 150, tw: 360,
    titleNormal: "Faster user ", titleBold2: "adoption",
    desc: "Because the product fits existing workflows rather than asking teams to adapt to it.",
    connector: "M 1120,72 H 798 Q 780,72 780,90 V 178",
    dot: [780, 178],
    dot2: [1120, 72],
  },
  {
    key: "bl",
    Icon: Layers,
    bx: 170, by: 600,
    tx: 40, ty: 660, tw: 360,
    titleBold: "Lower integration", titleRest: " costs",
    desc: "Because third-party systems in each vertical are already known and mapped.",
    // dot ON the MIDDLE plate's front-left edge → left → rounded corner → down → badge
    connector: "M 450,382 H 188 Q 170,382 170,400 V 540",
    dot: [450, 382],
    dot2: [170, 540],
  },
  {
    key: "br",
    Icon: ShieldCheck,
    bx: 1170, by: 600,
    tx: 940, ty: 660, tw: 360,
    titleBold: "Fewer surprises", titleRest: " in QA",
    desc: "Because edge cases specific to the industry are anticipated, not discovered post-launch.",
    connector: "M 890,382 H 1152 Q 1170,382 1170,400 V 540",
    dot: [890, 382],
    dot2: [1170, 540],
  },
];

export default function PlatformValue({ data }) {
  const heading       = data?.heading       || "What A Well-Built Industry Platform Actually Does For";
  const headingAccent = data?.headingAccent || "Your Revenue";
  const quote         = data?.quote         || "Generic software development moves fast on paper and stalls in practice. Compliance logic added after the fact. Workflows rebuilt because the original architecture did not account for how the industry actually operates. Integrations that work in staging and break in production because a domain-specific edge case was never anticipated.";
  const body          = data?.body          || "Industry-focused engineering costs less to maintain, launches closer to specification, and earns user adoption faster because it fits how people in that vertical already work. That is not a positioning statement. It is what we have observed across 180+ client engagements.";
  const statValue = data?.statValue || "180+";
  const statLabel = data?.statLabel || "Client Engagements";
  const statDesc  = data?.statDesc  || "Observed across 180+ client engagements delivering industry-focused software.";

  return (
    <section className="font-figtree py-12 sm:py-20 lg:py-24" style={{ background: "#F8FAFF" }}>
      <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-stretch gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">

          {/* ── left column ── */}
          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <h2 className="ind-h2">
              <span style={{ color: "#1D1F4B" }}>{heading} </span>
              <span style={{ color: "#7784C5" }}>{headingAccent}</span>
            </h2>

            {/* quote / callout with left rule */}
            <div className="mt-8 pl-5" style={{ borderLeft: "4px solid #8C98D3" }}>
              <p className="ind-lead" style={{ color: "#1D1F4B" }}>
                {quote}
              </p>
            </div>

            {/* body */}
            <p className="ind-lead mt-8" style={{ color: "#1D1F4B" }}>
              {body}
            </p>

            {/* 180+ stat card */}
            <div
              className="mt-auto flex items-start gap-[18px] rounded-[24px] bg-white p-[26px]"
              style={{ outline: "0.8px solid #E8ECF5", outlineOffset: "-0.8px", marginTop: "clamp(2rem,3vw,3.5rem)" }}
            >
              <span
                className="flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-[20px]"
                style={{ background: "#1D1F4B", outline: "0.8px solid #E5EAFF", outlineOffset: "-0.8px" }}
              >
                <Users size={34} className="text-white" strokeWidth={1.8} />
              </span>
              <div>
                <p className="ind-stat" style={{ color: "#1D2033" }}>{statValue}</p>
                <p className="ind-card-title mt-2" style={{ color: "#1D2033" }}>{statLabel}</p>
                <p className="ind-body mt-2" style={{ color: "#667085" }}>{statDesc}</p>
              </div>
            </div>
          </m.div>

          {/* ── right column: diagram card ── */}
          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-[clamp(28px,3vw,47px)] bg-white p-6 sm:p-8 lg:p-10"
            style={{ boxShadow: "0 24px 60px rgba(29,31,75,0.06)" }}
          >
            {/* card heading — visual repeat of the section <h2>, so it is not a
                heading element (keeps the h1 → h2 → h3 outline clean) */}
            <p aria-hidden className="ind-h2 hidden lg:block">
              <span style={{ color: "#1D1F4B" }}>{heading} </span>
              <span style={{ color: "#7784C5" }}>{headingAccent}</span>
            </p>

            {/* mobile / tablet: the diagram's percent-positioned labels can't
                scale down on a narrow screen, so render the same four points as a
                clean stacked list instead (the lg+ diagram stays untouched). */}
            <div className="flex flex-col gap-5 lg:hidden">
              {NODES.map((n) => {
                const Icon = n.Icon;
                return (
                  <div key={`m-${n.key}`} className="flex items-start gap-4">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]"
                      style={{ background: "#1D1F4B" }}
                    >
                      <Icon size={20} color="#ffffff" strokeWidth={1.9} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-figtree font-bold text-[15px] leading-snug" style={{ color: "#1D1F4B" }}>
                        {n.titleBold}{n.titleRest}{n.titleNormal}{n.titleBold2}
                      </p>
                      <p className="font-figtree mt-1.5 text-[13px] leading-[1.55]" style={{ color: "#5B6473" }}>
                        {n.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* diagram — desktop only (lg+) */}
            <div className="relative mt-2 hidden lg:block">
            <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-auto w-full" role="img" aria-label="How a well-built platform improves revenue">
              <defs>
                {/* plate fill — exact Figma gradient (137° ≈ top-left → bottom-right) */}
                <linearGradient id="pvTop" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#576099" />
                  <stop offset="50%" stopColor="#3B4167" />
                  <stop offset="50%" stopColor="#3A4066" />
                  <stop offset="100%" stopColor="#1D2033" />
                </linearGradient>
                <filter id="pvShadow" x="-40%" y="-30%" width="180%" height="180%">
                  <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#1D2033" floodOpacity="0.30" />
                </filter>
                <filter id="pvBadgeShadow" x="-70%" y="-70%" width="240%" height="240%">
                  <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#1D2033" floodOpacity="0.20" />
                </filter>
                <filter id="pvChipShadow" x="-70%" y="-70%" width="240%" height="240%">
                  <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#1D2033" floodOpacity="0.22" />
                </filter>
              </defs>

              {/* dashed connectors + dots (behind the stack) */}
              {NODES.map((n) => (
                <g key={`c-${n.key}`}>
                  <path d={n.connector} fill="none" stroke="#1D1F4B" strokeOpacity="0.9" strokeWidth="3" strokeLinecap="round" strokeDasharray="7 9" />
                  <circle cx={n.dot[0]} cy={n.dot[1]} r="7" fill="#1D1F4B" />
                  {n.dot2 && <circle cx={n.dot2[0]} cy={n.dot2[1]} r="7" fill="#1D1F4B" />}
                </g>
              ))}

              {/* rounded isometric stack — 3 plates only; each casts a soft
                  shadow on the one below for depth (no separate dark thickness). */}
              {LAYERS.map((cy) => (
                <path
                  key={`l-${cy}`}
                  d={diamond(cy)}
                  fill="url(#pvTop)"
                  stroke="#7A85BC"
                  strokeOpacity="0.28"
                  strokeWidth="1"
                  filter="url(#pvShadow)"
                />
              ))}

              {/* bottom connector dots redrawn ON TOP of the plates so they sit on
                  the middle card's front edge instead of being hidden behind it */}
              {NODES.filter((n) => n.key === "bl" || n.key === "br").map((n) => (
                <circle key={`fd-${n.key}`} cx={n.dot[0]} cy={n.dot[1]} r="7" fill="#1D1F4B" />
              ))}

              {/* centre chip — native SVG circle (shadow via filter) + transparent icon */}
              <circle cx={SX} cy={CHIP_Y} r="60" fill="#FFFFFF" stroke="#E1E7FB" strokeWidth="1" filter="url(#pvChipShadow)" />
              <foreignObject x={SX - 30} y={CHIP_Y - 30} width="60" height="60">
                <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent" }}>
                  <Cpu size={50} color="#1D1F4B" strokeWidth={1.7} />
                </div>
              </foreignObject>

              {/* node badges — native SVG circle (shadow via filter) + transparent icon */}
              {NODES.map((n) => {
                const Icon = n.Icon;
                return (
                  <g key={`b-${n.key}`}>
                    <circle cx={n.bx} cy={n.by} r="38" fill="#1D1F4B" filter="url(#pvBadgeShadow)" />
                    <foreignObject x={n.bx - 22} y={n.by - 22} width="44" height="44">
                      <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent" }}>
                        <Icon size={28} color="#ffffff" strokeWidth={1.9} />
                      </div>
                    </foreignObject>
                  </g>
                );
              })}

            </svg>

              {/* text labels — crisp HTML overlay (NOT scaled down by the SVG),
                  positioned by % so they track the badges; overflow stays visible
                  so the copy is never cropped. */}
              {NODES.map((n) => (
                <div
                  key={`t-${n.key}`}
                  className="absolute"
                  style={{ left: `${(n.tx / VB_W) * 100}%`, top: `${(n.ty / VB_H) * 100}%`, width: `${(n.tw / VB_W) * 100}%` }}
                >
                  <p className="font-figtree font-bold text-[14px] sm:text-[15px] lg:text-[16px] leading-snug" style={{ color: "#1D1F4B" }}>
                    {n.titleBold}{n.titleRest}{n.titleNormal}{n.titleBold2}
                  </p>
                  <p className="font-figtree mt-2 text-[12px] sm:text-[13px] lg:text-[14px] leading-[1.55]" style={{ color: "#5B6473" }}>
                    {n.desc}
                  </p>
                </div>
              ))}
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, FastForward, Users, TrendingUp, Shield } from "lucide-react";
import { SA_HIRING_GAP_POINTS } from "../saData";

// Figma node 1046:4232 — same four-stop ramp as the hero, at 11.44deg.
const HEADLINE_GRADIENT =
  "linear-gradient(11.44deg, #7784C5 33.662%, #B7BEED 48.02%, #6077EC 58.532%, #7683C5 85.197%)";

// Figma 1046:4195 — the filled capsule. In the source this sits on the middle
// card, which is the design showing its hover state rather than a permanently
// special card: any capsule takes this treatment while the pointer is over it,
// and the middle one wears it at rest.
const HIGHLIGHT_FILL =
  "linear-gradient(152deg, #4A5AE8 8.49%, #7185FA 45.85%, #889AF5 91.51%)";

const RULE_GRADIENT = "linear-gradient(90deg, #7185FA 0%, #889AF5 100%)";

const CAPSULE_FILL = "rgba(16,20,50,0.55)";
const CAPSULE_BORDER = "rgba(113,133,250,0.86)";
const CAPSULE_BORDER_ACTIVE = "rgba(113,133,250,0.7)";
const INK_ACTIVE = "#1D2033";
const RULE_ACTIVE = "#1D1F4B";

const ICONS = { Clock, FastForward, Users, TrendingUp, Shield };

// Capsule geometry, straight from Figma 1046:4167.
const CAP_W = 260;
const CAP_W_HIGHLIGHT = 280;
const CAP_H_TALL = 400;
const CAP_H_SHORT = 340;
const ARROW_W = 48;

const TRANSITION = "opacity 300ms ease, color 300ms ease, border-color 300ms ease, background-color 300ms ease";

const CAP_GAP = 22;

// Height and width come from a capsule's POSITION, not from per-item flags:
// odd-numbered capsules (1st, 3rd, 5th) are tall, the ones between them are
// short, and the centre one carries the frame's extra 20px of width. Deriving
// it this way keeps the row's natural width at the 1762px the fit-scale is
// calibrated against no matter what an admin types.
const isTall = (i) => i % 2 === 0;
const isCentre = (i, n) => i === Math.floor((n - 1) / 2);
const capWidth = (i, n) => (isCentre(i, n) ? CAP_W_HIGHLIGHT : CAP_W);
const capHeight = (i) => (isTall(i) ? CAP_H_TALL : CAP_H_SHORT);

const naturalWidth = (points) =>
  points.reduce((sum, _p, i) => sum + capWidth(i, points.length), 0) +
  ARROW_W * Math.max(0, points.length - 1);

// The row is 1762px wide at its designed size, so on anything narrower than a
// ~1900px frame it would either clip or need a scrollbar. Scaling the whole
// composition keeps every capsule visible AND keeps the proportions exact,
// which squeezing individual capsules would not.
function useFitScale(naturalW) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !naturalW) return undefined;
    const update = () => {
      const avail = el.clientWidth;
      setScale(avail > 0 && avail < naturalW ? avail / naturalW : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [naturalW]);

  return [wrapRef, scale];
}

// The connector between capsules (Figma 1046:4178). Not a stock lucide glyph —
// the shaft runs 38 of 48 units and the head overlaps it — so it is inlined
// rather than approximated with ArrowRight.
function Connector({ className = "" }) {
  return (
    <svg
      width="48"
      height="24"
      viewBox="0 0 48 24"
      fill="none"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 12H38" stroke="#7185FA" strokeOpacity="0.86" strokeWidth="1.67" />
      <path
        d="M32 7L40 12L32 17"
        stroke="#7185FA"
        strokeOpacity="0.86"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// One capsule. Geometry (size, icon size, gap, rule width) comes from the data
// and never changes, so promoting a card on hover cannot reflow its neighbours
// or make the row twitch. Only the treatment — fill, ink, border — animates.
function Capsule({ point, Icon, active, shape, onEnter, onLeave, className = "", style }) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`relative flex flex-col items-center justify-center motion-reduce:transition-none ${className}`}
      style={{
        // Transparent while active: the gradient layer below is inset to the
        // padding box, so leaving the dark fill on would show a hairline of it
        // inside the border.
        background: active ? "transparent" : CAPSULE_FILL,
        borderStyle: "solid",
        borderWidth: active ? 0.8 : 1.67,
        borderColor: active ? CAPSULE_BORDER_ACTIVE : CAPSULE_BORDER,
        gap: CAP_GAP,
        transition: TRANSITION,
        ...shape,
        ...style,
      }}
    >
      {/* A gradient cannot be tweened between values, so the fill is a separate
          layer whose opacity animates instead. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 motion-reduce:transition-none"
        style={{
          backgroundImage: HIGHLIGHT_FILL,
          borderRadius: "inherit",
          opacity: active ? 1 : 0,
          transition: "opacity 300ms ease",
        }}
      />

      <Icon
        className="relative size-11 shrink-0 motion-reduce:transition-none"
        // Figma strokes these at 2.67 against a 44px box; lucide's viewBox is
        // 24, so the equivalent stroke is 2.67 * 24 / 44.
        strokeWidth={1.456}
        style={{ color: active ? INK_ACTIVE : "#FFFFFF", transition: TRANSITION }}
      />
      <p
        className={`relative font-figtree text-center leading-[1.275] text-[14px] motion-reduce:transition-none sm:text-[15px] ${
          active ? "font-medium tracking-[-0.15px]" : "font-normal tracking-[-0.07px]"
        }`}
        style={{ color: active ? INK_ACTIVE : "#FFFFFF", transition: TRANSITION }}
      >
        {point.text}
      </p>
      <span
        aria-hidden
        className="relative h-[2px] w-6 shrink-0 rounded-[2px] motion-reduce:transition-none"
        style={{
          backgroundColor: active ? RULE_ACTIVE : "transparent",
          backgroundImage: active ? "none" : RULE_GRADIENT,
          opacity: active ? 1 : 0.6,
          transition: TRANSITION,
        }}
      />
    </div>
  );
}

export default function StaffAugHiringGapSection({ data } = {}) {
  const heading = data?.heading || "The Hire You Need Takes Longer to Find Than";
  const headingAccent = data?.headingAccent || "The Problem can wait";
  const points = data?.points?.length ? data.points : SA_HIRING_GAP_POINTS;
  const naturalW = naturalWidth(points);
  const [wrapRef, scale] = useFitScale(naturalW + 16);

  // The filled capsule is purely a hover state — nothing is lit at rest, and
  // hovering any of the five gives it the treatment. (The Figma frame shows the
  // middle one filled because that frame captures the hover, not a resting
  // special case.)
  const [hovered, setHovered] = useState(null);
  const activeIndex = hovered ?? -1;

  return (
    <section className="relative overflow-hidden" style={{ background: "#130E2A" }}>
      {/* Figma's frame is 1901 wide with 70px gutters, so the row hits its
          designed 1:1 size on a full-width display and scales below that. */}
      <div className="mx-auto w-full max-w-[1901px] px-5 py-10 sm:px-8 lg:py-14 xl:px-[3.682%]">
        <h2 className="max-w-[1340px] font-figtree font-normal capitalize leading-[1.2] text-[24px] sm:text-[28px] tracking-[-0.01em]">
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADLINE_GRADIENT }}>
            {heading}{" "}
          </span>
          <span className="text-white">{headingAccent}</span>
        </h2>

        {/* ── Desktop: the capsule row at its designed proportions, scaled
            down as one piece when the viewport is narrower than its 1762px
            natural width. ── */}
        <div ref={wrapRef} className="mt-8 hidden xl:mt-12 xl:block">
          <div style={{ height: (CAP_H_TALL + 8) * scale, overflow: "hidden" }}>
            <div
              className="flex items-center p-1 pr-3"
              style={{
                width: naturalW + 16,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
              onMouseLeave={() => setHovered(null)}
            >
              {points.map((point, i) => {
                const Icon = ICONS[point.icon] || Clock;
                const isLast = i === points.length - 1;
                return (
                  <div key={i} className="flex shrink-0 items-center">
                    <Capsule
                      point={point}
                      Icon={Icon}
                      active={i === activeIndex}
                      className="rounded-[200px] px-6 py-8"
                      shape={{
                        width: capWidth(i, points.length),
                        height: capHeight(i),
                      }}
                      onEnter={() => setHovered(i)}
                    />
                    {!isLast && <Connector className="shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Mobile / tablet: the capsule geometry cannot survive a narrow
            column, so the same content stacks as rounded cards. Touch has no
            hover, so none of them is filled. ── */}
        <div className="mt-6 flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-5 xl:hidden">
          {points.map((point, i) => {
            const Icon = ICONS[point.icon] || Clock;
            return (
              <Capsule
                key={i}
                point={point}
                Icon={Icon}
                active={false}
                className="rounded-[40px] px-7 py-9 text-center sm:px-10"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { resolveIcon } from "../iconResolver";

// A reusable 3D carousel for the AI service cards. Only the centre card and its
// two immediate neighbours are visible; every other card is parked off-stage at
// opacity 0. Cards are positioned purely with GPU-accelerated transforms
// (translateX / rotateY / scale) inside a perspective wrapper, and the index in
// React state is the single source of truth — moving it animates everything via
// CSS transitions, so there are no per-frame re-renders and no jitter.

// Per-slot transform states (relative offset from the active card).
const SLOT = {
  center: { x: "0%", rotateY: 0, scale: 1, opacity: 1, z: 30, blur: 0 },
  left: { x: "-60%", rotateY: 20, scale: 0.82, opacity: 0.65, z: 20, blur: 1.5 },
  right: { x: "60%", rotateY: -20, scale: 0.82, opacity: 0.65, z: 20, blur: 1.5 },
  // Parked further out and faded — used for the cards that aren't in view and,
  // on mobile, for the side cards too (single-card mode).
  hiddenLeft: { x: "-110%", rotateY: 28, scale: 0.7, opacity: 0, z: 10, blur: 4 },
  hiddenRight: { x: "110%", rotateY: -28, scale: 0.7, opacity: 0, z: 10, blur: 4 },
};

const DRAG_THRESHOLD = 60; // px the pointer must travel to commit a slide

function ServiceCard({ item }) {
  const Icon = resolveIcon(item.icon) || Sparkles;
  const link = item.link || "/contact-us";
  return (
    <article
      className="relative h-full w-full overflow-hidden rounded-[24px] p-7"
      style={{
        background:
          "linear-gradient(140deg, #1F2336 0%, #252D5A 45%, #2E3E80 75%, #3B4FA3 100%)",
        boxShadow:
          "0 4px 20px rgba(31,35,54,0.35), 0 18px 48px rgba(102,121,228,0.25)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-20 h-[240px] w-[260px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(102,121,228,0.30) 0%, transparent 70%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-5 left-3 font-figtree font-extrabold leading-none"
        style={{ fontSize: 130, color: "rgba(255,255,255,0.06)" }}
      >
        {item.num}
      </span>

      <div className="relative flex items-start justify-between">
        <span className="font-figtree font-extrabold text-[32px] leading-none text-white">
          {item.num}.
        </span>
        <span
          className="flex h-[56px] w-[56px] items-center justify-center rounded-[18px]"
          style={{
            background: "rgba(255,255,255,0.09)",
            outline: "0.8px solid rgba(255,255,255,0.15)",
            outlineOffset: "-0.8px",
          }}
        >
          <Icon size={26} className="text-white" strokeWidth={1.6} />
        </span>
      </div>

      <h3
        className="relative mt-6 font-figtree text-[15px] font-bold uppercase sm:text-[16px]"
        style={{ color: "rgba(168,178,255,0.85)", letterSpacing: "2px" }}
      >
        {item.title}
      </h3>
      <span
        className="relative mt-4 block h-[2.5px] w-[40px] rounded"
        style={{ background: "linear-gradient(90deg, #6679E4 0%, #A8B2FF 100%)" }}
        aria-hidden
      />
      <div
        className="relative mt-4 line-clamp-5 font-figtree text-[13px] leading-[1.7] sm:text-[14px] [&_p]:m-0"
        style={{ color: "rgba(255,255,255,0.62)" }}
        dangerouslySetInnerHTML={{ __html: item.desc || "" }}
      />
      <Link
        href={link}
        tabIndex={-1}
        className="relative mt-6 inline-flex items-center gap-2 font-figtree text-[15px] font-semibold transition-opacity hover:opacity-80 sm:text-[16px]"
        style={{ color: "#A8B2FF" }}
      >
        Learn More <span className="sr-only">about {item.title}</span>
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}

export default function ServiceCarousel({ items }) {
  const n = items?.length || 0;
  const [active, setActive] = useState(0);
  // "single" hides the side cards (mobile); "multi" shows the 3-card stage.
  const [mode, setMode] = useState("multi");
  const stageRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, moved: false });

  const go = useCallback(
    (dir) => {
      if (n === 0) return;
      setActive((cur) => (cur + dir + n) % n);
    },
    [n]
  );

  // Responsive mode — only the side-card visibility changes; the centre card
  // and its smooth transitions are identical across breakpoints.
  useEffect(() => {
    const apply = () => setMode(window.innerWidth < 640 ? "single" : "multi");
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  // Resolve the visual slot for a card given its distance from the active one.
  const slotFor = useCallback(
    (i) => {
      // Signed shortest offset around the ring (enables infinite looping).
      let offset = (i - active + n) % n;
      if (offset > n / 2) offset -= n;

      if (offset === 0) return SLOT.center;
      if (offset === 1) return mode === "single" ? SLOT.hiddenRight : SLOT.right;
      if (offset === -1) return mode === "single" ? SLOT.hiddenLeft : SLOT.left;
      return offset > 0 ? SLOT.hiddenRight : SLOT.hiddenLeft;
    },
    [active, n, mode]
  );

  // Pointer drag / touch swipe (Pointer Events cover mouse + touch + pen).
  const onPointerDown = (e) => {
    drag.current = { active: true, startX: e.clientX, moved: false };
  };
  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    if (Math.abs(e.clientX - drag.current.startX) > 8) drag.current.moved = true;
  };
  const onPointerUp = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.active = false;
    if (dx <= -DRAG_THRESHOLD) go(1);
    else if (dx >= DRAG_THRESHOLD) go(-1);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  const cards = useMemo(() => items || [], [items]);
  if (n === 0) return null;

  return (
    <div
      className="relative mt-12 select-none overflow-hidden rounded-[28px] px-2 py-10 sm:px-6"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 0%, #fafafa 0%, #fbfbfb 60%, #ffffff 100%)",
      }}
    >
      {/* 3D stage — perspective gives the side cards real depth from rotateY. */}
      <div
        ref={stageRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Our AI development services"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current.active = false)}
        className="relative mx-auto h-[460px] w-full max-w-[1100px] cursor-grab touch-pan-y outline-none active:cursor-grabbing sm:h-[480px]"
        style={{ perspective: "1400px" }}
      >
        {cards.map((item, i) => {
          const slot = slotFor(i);
          const isCenter = slot === SLOT.center;
          return (
            <div
              key={item.num || i}
              className="absolute left-1/2 top-1/2 h-[420px] w-[min(86vw,360px)] will-change-transform"
              style={{
                transform: `translate(-50%, -50%) translateX(${slot.x}) rotateY(${slot.rotateY}deg) scale(${slot.scale})`,
                opacity: slot.opacity,
                zIndex: slot.z,
                filter: slot.blur ? `blur(${slot.blur}px)` : "none",
                pointerEvents: isCenter ? "auto" : "none",
                transition:
                  "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), filter 700ms ease",
                transformStyle: "preserve-3d",
              }}
            >
              <ServiceCard item={item} />
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous service"
          className="flex h-12 w-12 items-center justify-center rounded-full text-[#5563C9] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6679E4] active:scale-95"
          style={{
            background: "#FFFFFF",
            outline: "1.5px solid rgba(102,121,228,0.45)",
            outlineOffset: "-1.5px",
            boxShadow: "0 6px 18px rgba(31,35,54,0.14)",
          }}
        >
          <ChevronLeft size={22} strokeWidth={2} />
        </button>

        {/* Dot indicators double as quick navigation. */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Select service">
          {cards.map((item, i) => {
            const isActive = i === active;
            return (
              <button
                key={item.num || i}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to ${item.title}`}
                onClick={() => setActive(i)}
                className="flex h-6 min-w-6 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6679E4]"
              >
                <span
                  className="h-2.5 rounded-full transition-all"
                  style={{
                    width: isActive ? 28 : 10,
                    background: isActive ? "#6679E4" : "#C3CBEF",
                  }}
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next service"
          className="flex h-12 w-12 items-center justify-center rounded-full text-[#5563C9] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6679E4] active:scale-95"
          style={{
            background: "#FFFFFF",
            outline: "1.5px solid rgba(102,121,228,0.45)",
            outlineOffset: "-1.5px",
            boxShadow: "0 6px 18px rgba(31,35,54,0.14)",
          }}
        >
          <ChevronRight size={22} strokeWidth={2} />
        </button>
      </div>

      {/* Screen-reader status of the current card. */}
      <p className="sr-only" aria-live="polite">
        Service {active + 1} of {n}: {cards[active]?.title}
      </p>
    </div>
  );
}

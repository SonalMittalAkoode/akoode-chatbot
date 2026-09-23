"use client";

import { useState, useEffect, useRef } from "react";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const DEFAULT_CAPABILITIES = [
  {
    n: "01",
    title: "Custom Platform Architecture",
    desc: "We design and build scalable, cloud-native architectures purpose-built for real estate. No cookie-cutter frameworks — every system is engineered to your business model and growth trajectory.",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    n: "02",
    title: "AI & ML Integration",
    desc: "Embed intelligent features directly into your platform — property recommendations, price predictions, smart search, and automated lead scoring that gets smarter over time.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    n: "03",
    title: "Real-Time Data Pipelines",
    desc: "Live MLS feeds, market analytics, and operational dashboards built on high-throughput pipelines that surface the right data at the right moment.",
    icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
  },
  {
    n: "04",
    title: "Geospatial Intelligence",
    desc: "Advanced map-based search, neighborhood analytics, proximity scoring, and location-aware features that make property discovery intuitive and powerful.",
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  },
  {
    n: "05",
    title: "Mobile-First Engineering",
    desc: "Native iOS and Android apps or high-performance PWAs built for on-the-go agents, buyers, and property managers — with offline support and real-time sync.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    n: "06",
    title: "Security & Compliance",
    desc: "Enterprise-grade security, data encryption, role-based access, and compliance-ready architectures to protect your users and satisfy regulatory requirements.",
    icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
  },
  {
    n: "07",
    title: "Performance & Scaling",
    desc: "Sub-second load times, optimized database queries, CDN-first delivery, and continuous monitoring to keep your platform fast at any scale.",
    icon: "M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm15 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5z",
  },
];

function CapIcon({ d, color, size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

const STEP_DURATION = 3500;
const TICK = 80;

export default function Capabilities({ data }) {
  const capabilities = data?.items?.length > 0
    ? data.items.map((it, idx) => ({
        ...it,
        n: it.n || String(idx + 1).padStart(2, "0"),
        icon: it.icon || "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      }))
    : DEFAULT_CAPABILITIES;
  const eyebrow = data?.eyebrow;
  const heading = data?.heading;
  const subtitle = data?.subtitle || "A battle-tested delivery framework built for speed, transparency, and zero-compromise quality.";
  const [active, setActive] = useState(capabilities[2]?.n || capabilities[0]?.n);

  const [mobileActive, setMobileActive] = useState(null);
  const [autoProgress, setAutoProgress] = useState(0);
  const [autoRunning, setAutoRunning] = useState(false);

  const timerRef = useRef(null);
  const autoIdxRef = useRef(0);
  const elapsedRef = useRef(0);
  const pausedRef = useRef(false);

  const startCycle = () => {
    clearInterval(timerRef.current);
    autoIdxRef.current = 0;
    elapsedRef.current = 0;
    pausedRef.current = false;
    setMobileActive(capabilities[0].n);
    setAutoProgress(0);
    setAutoRunning(true);

    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;
      elapsedRef.current += TICK;
      const pct = Math.min((elapsedRef.current / STEP_DURATION) * 100, 100);
      setAutoProgress(pct);

      if (elapsedRef.current >= STEP_DURATION) {
        const next = autoIdxRef.current + 1;
        if (next >= capabilities.length) {
          clearInterval(timerRef.current);
          setAutoRunning(false);
          setAutoProgress(0);
        } else {
          autoIdxRef.current = next;
          elapsedRef.current = 0;
          setMobileActive(capabilities[next].n);
          setAutoProgress(0);
        }
      }
    }, TICK);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const section = document.getElementById("capabilities");
    if (!section) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (window.innerWidth >= 640) return;
        if (entry.isIntersecting) {
          setTimeout(startCycle, 300);
        } else {
          clearInterval(timerRef.current);
          setAutoRunning(false);
          setAutoProgress(0);
          setMobileActive(null);
        }
      },
      { threshold: 0.25 }
    );

    obs.observe(section);
    return () => {
      obs.disconnect();
      clearInterval(timerRef.current);
    };
  }, []);

  const handleMobileClick = (stepN) => {
    if (autoRunning) {
      pausedRef.current = true;
      clearInterval(timerRef.current);
      setAutoRunning(false);
      setAutoProgress(0);
    }
    setMobileActive((prev) => (prev === stepN ? null : stepN));
  };

  return (
    <section
      id="capabilities"
      className="w-full py-16 sm:py-20 lg:py-24 px-6 md:px-16 lg:px-24 bg-[#F8FAFF] font-figtree"
    >
      <div className="max-w-[1240px] mx-auto">

        {/* Header */}
        <div className="text-left md:text-center mb-14">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7784C5]/30 bg-[#7784C5]/10 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7784C5]" />
              <span className="text-[#4F5581] text-sm font-medium tracking-wide">
                {eyebrow}
              </span>
            </div>
          )}
          <h2 className="text-[#191A2E] text-[24px] sm:text-[28px] font-bold leading-tight sm:leading-8 capitalize mb-4">
            {heading ? (
              heading
            ) : (
              <>
                Engineering Excellence{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #7784C5 0%, #4F60B5 100%)",
                  }}
                >
                  At Every Layer
                </span>
              </>
            )}
          </h2>
          <div
            className="text-[#4A5565] text-sm sm:text-base capitalize leading-relaxed max-w-2xl mx-auto [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: processHtmlLinks(subtitle) }}
          />
        </div>

        {/* Desktop — horizontal expanding panels */}
        <div
          className="hidden sm:flex rounded-2xl overflow-hidden"
          style={{
            height: 390,
            background: "#070814",
            border: "1px solid rgba(136,154,245,0.13)",
            boxShadow: "0 0 80px rgba(119,132,197,0.07)",
          }}
        >
          {capabilities.map((cap, i) => {
            const isActive = active === cap.n;
            return (
              <div
                key={cap.n}
                onMouseEnter={() => setActive(cap.n)}
                className="relative flex flex-col cursor-pointer select-none overflow-hidden"
                style={{
                  flex: isActive ? "2 2 0%" : "0.42 0.42 0%",
                  borderRight:
                    i < capabilities.length - 1
                      ? "1px solid rgba(136,154,245,0.12)"
                      : "none",
                  background: isActive
                    ? "linear-gradient(145deg, #1D1F4B 0%, #151740 60%, #0f1130 100%)"
                    : "linear-gradient(180deg, rgba(119,132,197,0.04) 0%, rgba(79,96,181,0.07) 100%)",
                  transition:
                    "flex 0.52s cubic-bezier(0.4,0,0.2,1), background 0.4s ease",
                }}
              >
                {/* Active glow */}
                {isActive && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at 25% 18%, rgba(119,132,197,0.18) 0%, transparent 62%)",
                    }}
                  />
                )}
                {/* Inactive left border accent */}
                {!isActive && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[1.5px] pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 0%, rgba(136,154,245,0.3) 50%, transparent 100%)",
                    }}
                  />
                )}

                {/* Top row: number + pulse dot */}
                <div className="flex items-center justify-between px-4 pt-5 shrink-0">
                  <span
                    className="text-[10px] font-bold tracking-[3px] transition-colors duration-300"
                    style={{
                      color: isActive
                        ? "#A8B5FF"
                        : "rgba(180,194,255,0.95)",
                    }}
                  >
                    {cap.n}
                  </span>
                  {isActive && (
                    <div className="w-[5px] h-[5px] rounded-full bg-[#7784C5] animate-pulse" />
                  )}
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col justify-center px-4 overflow-hidden">
                  {isActive ? (
                    <div>
                      <div
                        className="w-6 h-[1px] mb-5"
                        style={{ background: "#7784C5" }}
                      />
                      <h3 className="text-[17px] sm:text-[18px] lg:text-[19px] font-extrabold text-white leading-[1.3] mb-3">
                        {cap.title}
                      </h3>
                      <div
                        className="text-[13px] sm:text-[14px] leading-[1.8] [&_p]:m-0"
                        style={{ color: "rgba(255,255,255,0.75)" }}
                        dangerouslySetInnerHTML={{ __html: processHtmlLinks(cap.desc || cap.description || "") }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                          fontSize: 12,
                          fontWeight: 500,
                          letterSpacing: "1.5px",
                          color: "rgba(232,228,255,0.95)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {cap.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom: progress bar + phase label */}
                <div className="px-4 pb-5 shrink-0">
                  {isActive ? (
                    <>
                      <div
                        className="w-full h-[1.5px] rounded-full overflow-hidden mb-3"
                        style={{ background: "rgba(119,132,197,0.15)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${
                              (parseInt(cap.n) / capabilities.length) * 100
                            }%`,
                            background:
                              "linear-gradient(90deg, #4F60B5, #889AF5)",
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[9px] font-bold tracking-[2.5px] uppercase"
                          style={{ color: "#7784C5" }}
                        >
                          Layer {parseInt(cap.n)} / {capabilities.length}
                        </span>
                        <CapIcon d={cap.icon} color="#889AF5" size={17} />
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-center">
                      <CapIcon
                        d={cap.icon}
                        color="rgba(180,194,255,0.9)"
                        size={16}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile — auto-advancing accordion */}
        <div className="sm:hidden flex flex-col gap-2">
          {capabilities.map((cap, i) => {
            const isActive = mobileActive === cap.n;
            const showBar = autoRunning && isActive;

            return (
              <div
                key={cap.n}
                onClick={() => handleMobileClick(cap.n)}
                className="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
                style={{
                  border: `1px solid ${
                    isActive
                      ? "rgba(119,132,197,0.4)"
                      : "rgba(119,132,197,0.1)"
                  }`,
                  background: isActive ? "#1D1F4B" : "#0c0d1a",
                }}
              >
                {/* Auto-progress bar */}
                {showBar && (
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px] z-10"
                    style={{ background: "rgba(119,132,197,0.12)" }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${autoProgress}%`,
                        background:
                          "linear-gradient(90deg, #4F60B5, #889AF5)",
                        transition: `width ${TICK}ms linear`,
                        borderRadius: "0 2px 2px 0",
                      }}
                    />
                  </div>
                )}

                {/* Row header */}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <span
                    className="text-[10px] font-bold tracking-[2.5px] shrink-0"
                    style={{
                      color: isActive
                        ? "#889AF5"
                        : "rgba(136,154,245,0.45)",
                    }}
                  >
                    {cap.n}
                  </span>
                  <span className="flex-1 text-[13px] sm:text-[13.5px] font-semibold text-white">
                    {cap.title}
                  </span>
                  {showBar && (
                    <div className="w-[5px] h-[5px] rounded-full bg-[#7784C5] animate-pulse mr-1 shrink-0" />
                  )}
                  <CapIcon
                    d={
                      isActive
                        ? "M5 15l7-7 7 7"
                        : "M19 9l-7 7-7-7"
                    }
                    color={
                      isActive
                        ? "#889AF5"
                        : "rgba(119,132,197,0.38)"
                    }
                    size={13}
                  />
                </div>

                {/* Expanded content */}
                {isActive && (
                  <div className="px-4 pb-4 border-t border-[rgba(119,132,197,0.12)]">
                    <div
                      className="text-[12.5px] leading-[1.75] pt-3 [&_p]:m-0"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                      dangerouslySetInnerHTML={{ __html: processHtmlLinks(cap.desc || cap.description || "") }}
                    />
                    {showBar && (
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[rgba(119,132,197,0.08)]">
                        <span
                          className="text-[9px] font-bold tracking-[2px] uppercase"
                          style={{ color: "#7784C5" }}
                        >
                          Layer {i + 1} / {capabilities.length}
                        </span>
                        <CapIcon d={cap.icon} color="#889AF5" size={14} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import { Search, Layers, CodeXml, Rocket } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  {
    num: "01",
    Icon: Search,
    title: "Discovery and Scoping",
    desc: "We start by mapping the domain constraints before touching architecture. Compliance requirements, integration dependencies, and industry-specific data models are documented in week one, not discovered in QA.",
  },
  {
    num: "02",
    Icon: Layers,
    title: "Architecture and Stack Selection",
    desc: "Stack decisions are made against your platform's actual requirements - scale targets, compliance constraints, and third-party integration needs. No default stacks assigned before the scoping conversation.",
  },
  {
    num: "03",
    Icon: CodeXml,
    title: "Build and Sprint Delivery",
    desc: "Engineering runs in two-week sprints with demos, written progress updates, and a living backlog visible to your team. No black boxes. No surprises at milestone handoffs.",
  },
  {
    num: "04",
    Icon: Rocket,
    title: "Launch, Integration, and Handoff",
    desc: "Go-live preparation includes deployment planning, load testing, and documentation that your internal team can actually use. We stay available post-launch to resolve issues that emerge in production.",
  },
];

// Connector geometry (desktop, 4 equal cols · 2.5rem gap · 84px icons).
// Adjacent icon centres are (25% + 10px) apart; first centre sits at 42px.
const SEGMENTS = [
  { left: "42px", width: "calc(25% + 10px)" },
  { left: "calc(25% + 52px)", width: "calc(25% + 10px)" },
  { left: "calc(50% + 62px)", width: "calc(25% + 10px)" },
];

const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function WayWeWork({ data }) {
  const heading       = data?.heading       || "The Way We Work Across";
  const headingAccent = data?.headingAccent || "Every Industry";
  const intro         = data?.intro         || "Our delivery model does not change per industry.\nWhat changes is the domain expertise our engineers bring to each phase.";
  const steps = data?.steps?.length ? data.steps : STEPS;

  const sectionRef = useRef(null);
  const stepsRef = useRef(null);
  const cardRefs = useRef([]);
  const segRefs = useRef([]);
  // Only true once the pinned desktop timeline is mounted. Until then (SSR,
  // tablet, mobile) every step + connector renders fully visible.
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const el = stepsRef.current;
    if (!el) return undefined;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const seg = Math.max(1, steps.length - 1); // number of reveals / connectors
      setInteractive(true);

      // Map the scrubbed progress (0→1) onto each reveal. Reveal k owns the
      // sub-interval [(k-1)/seg, k/seg]; inside it the connector grows first
      // (0→0.5) and then the card slides in from the right (0.4→1).
      const apply = (p) => {
        for (let k = 1; k <= seg; k++) {
          const local = clamp((p - (k - 1) / seg) * seg);
          const conn = clamp(local / 0.5);
          const card = clamp((local - 0.4) / 0.6);

          const sEl = segRefs.current[k - 1];
          if (sEl) sEl.style.transform = `scaleX(${conn})`;

          const cEl = cardRefs.current[k];
          if (cEl) {
            cEl.style.opacity = String(card);
            cEl.style.transform = `translateX(${(1 - card) * 80}px) scale(${0.96 + 0.04 * card})`;
            // opacity (not visibility:hidden) keeps the text in the DOM + a11y
            // tree so crawlers still see it; pointer-events guards interaction.
            cEl.style.pointerEvents = card >= 0.99 ? "auto" : "none";
          }
        }
      };

      apply(0); // start state: only step 01 + nothing beyond it

      const st = ScrollTrigger.create({
        // Pin ONLY the dark container, and centre it so it stays fully visible.
        trigger: el,
        start: "center center",
        end: () => "+=" + seg * window.innerHeight,
        pin: el,
        pinSpacing: true,
        // Higher scrub lag = the animation eases toward the scroll position
        // instead of tracking it 1:1, which reads much smoother.
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => apply(self.progress),
      });

      return () => {
        st.kill();
        setInteractive(false);
        // Restore the full-visible layout (React re-render also reapplies it).
        cardRefs.current.forEach((cEl) => {
          if (!cEl) return;
          cEl.style.opacity = "";
          cEl.style.transform = "";
          cEl.style.visibility = "";
          cEl.style.pointerEvents = "";
        });
        segRefs.current.forEach((sEl) => {
          if (sEl) sEl.style.transform = "";
        });
      };
    });

    return () => mm.revert();
  }, [steps.length]);

  // Hidden initial style for steps 02+ on the interactive desktop path; prevents
  // a flash of the full timeline before the first scroll frame applies.
  const initialCardStyle = (i) => {
    const base = { willChange: "transform, opacity" };
    if (interactive && i > 0) {
      return {
        ...base,
        opacity: 0,
        pointerEvents: "none",
        transform: "translateX(80px) scale(0.96)",
      };
    }
    return base;
  };

  return (
    <section ref={sectionRef} className="font-figtree py-12 sm:py-20 lg:py-24" style={{ background: "#F8FAFF" }}>
      <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">

        {/* ── header row — title (left half) | centred divider | subtitle (right) ── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-0">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="ind-h2 lg:basis-[44%] lg:shrink-0 lg:pr-10"
          >
            <span style={{ color: "#1D1F4B" }}>{heading} </span>
            <span style={{ color: "#7784C5" }}>{headingAccent}</span>
          </m.h2>

          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:flex lg:flex-1 lg:items-center lg:border-l-4 lg:pl-10"
            style={{ borderColor: "#8C98D3" }}
          >
            <p className="ind-lead whitespace-pre-line" style={{ color: "#1D1F4B" }}>
              {intro}
            </p>
          </m.div>
        </div>

        {/* ── steps card (this is the pinned element) ── */}
        <m.div
          ref={stepsRef}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12 rounded-[clamp(28px,3vw,50px)] px-6 py-12 sm:px-10 lg:px-14 lg:py-16"
          style={{ background: "#1D1F4B" }}
        >
          <div className="relative">
            {/* connector segments — each grows left→right as the next step reveals.
                No full line is drawn up front; the timeline builds piece by piece. */}
            {SEGMENTS.slice(0, steps.length - 1).map((g, i) => (
              <div
                key={`seg-${i}`}
                ref={(node) => (segRefs.current[i] = node)}
                className="pointer-events-none absolute hidden lg:block"
                style={{
                  top: 42,
                  left: g.left,
                  width: g.width,
                  borderTop: "3px dashed rgba(123,142,255,0.9)",
                  transform: interactive ? "scaleX(0)" : "scaleX(1)",
                  transformOrigin: "left center",
                  willChange: "transform",
                }}
                aria-hidden
              />
            ))}
            <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => {
              const Icon = s.Icon || Search;
              const isLast = i === steps.length - 1;
              return (
                <div
                  key={s.num || i}
                  ref={(node) => (cardRefs.current[i] = node)}
                  className="flex flex-col items-start"
                  style={initialCardStyle(i)}
                >
                  {/* icon (sits on top of the connector line) */}
                  <span
                    className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full sm:h-[84px] sm:w-[84px]"
                    style={{
                      background: "linear-gradient(135deg, #7185FA 0%, #5B73F6 100%)",
                      boxShadow: isLast
                        ? "0 0 28px rgba(113,133,250,0.48), 0 0 0 5px rgba(113,133,250,0.12)"
                        : "0 0 28px rgba(113,133,250,0.48)",
                    }}
                  >
                    <Icon className="h-7 w-7 text-white sm:h-[34px] sm:w-[34px]" strokeWidth={2.4} />
                  </span>

                  {/* number */}
                  <p className="ind-num mt-8 hidden text-white sm:block">{s.num}</p>

                  {/* accent bar */}
                  <span className="mt-4 block h-[3px] w-8 rounded-[3px]" style={{ background: "#7185FA" }} />

                  {/* title */}
                  <h3 className="ind-card-title mt-4 max-w-[220px] text-white">
                    {s.title}
                  </h3>

                  {/* description */}
                  <p className="ind-body mt-4 max-w-[220px]" style={{ color: "rgba(255,255,255,0.72)" }}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

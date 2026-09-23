"use client";

import React, { useRef, useEffect, useState } from "react";
import { m } from "framer-motion";
import { Code2, Building2, Cloud, Globe, Plug, RefreshCw } from "lucide-react";
import { resolveIcon } from "../iconResolver";
import { stripHtml } from "../stripHtml";

const SERVICES = [
  {
    num: "01",
    Icon: Code2,
    title: "Custom Software Development",
    desc: "Tailored software solutions designed specifically for your unique business needs, processes, and workflows. We build scalable, maintainable systems that give you a competitive advantage.",
  },
  {
    num: "02",
    Icon: Building2,
    title: "Enterprise Software Development",
    desc: "Robust, secure, and scalable enterprise-grade applications that handle complex business logic, high transaction volumes, and mission-critical operations with reliability.",
  },
  {
    num: "03",
    Icon: Cloud,
    title: "SaaS Product Development",
    desc: "Full-stack SaaS product development from concept to launch. Multi-tenant architecture, subscription management, analytics, and everything needed to scale a successful SaaS business.",
  },
  {
    num: "04",
    Icon: Globe,
    title: "Web Application Development",
    desc: "Modern, responsive web applications built with cutting-edge frameworks. Fast, accessible, and optimised for performance across all devices and browsers.",
  },
  {
    num: "05",
    Icon: Plug,
    title: "API Development & Integration",
    desc: "RESTful and GraphQL APIs that connect your systems seamlessly. Third-party integrations, microservices architecture, and unified data flow across your technology stack.",
  },
  {
    num: "06",
    Icon: RefreshCw,
    title: "Software Modernisation",
    desc: "Transform legacy systems into modern, cloud-native applications. Refactoring, re-architecting, and migrating outdated technology to improve performance and reduce technical debt.",
  },
];

/*
  STICKY_TOP = distance from viewport top where cards/left/numbers lock in place.
  Must clear the fixed navbar (≈ 64 px) plus a small safety margin.
*/
const STICKY_TOP = 80; // px

export default function SdServices({ data }) {
  const heading       = data?.heading       || "Software Development";
  const headingAccent = data?.headingAccent || "Services";
  const intro         = data?.intro         || "We offer a comprehensive range of services designed to support every phase of the software development lifecycle, from strategic planning to deployment and ongoing optimisation.";
  const dynItems      = data?.items?.length ? data.items : null;
  const items = (dynItems || SERVICES).map((s, i) => ({
    num:  dynItems ? String(i + 1).padStart(2, "0") : s.num,
    Icon: dynItems ? (resolveIcon(s.icon) || Code2) : s.Icon,
    title: stripHtml(s.title),
    desc:  s.desc || "",
  }));
  const sectionRef = useRef(null);
  /*
    cardRefs[i] points to the OUTER sticky wrapper of each card.
    GSAP ScrollTrigger watches each wrapper; when its top hits STICKY_TOP
    the corresponding number becomes "active". This is PURE STATE SYNC —
    no GSAP pins, no GSAP transforms. The stacking is handled entirely by
    CSS `position: sticky` on the wrapper divs.
  */
  const cardRefs = useRef([]);
  // -1 = no card has reached sticky position yet (section not fully in view)
  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    // Guard: GSAP must only run in the browser
    if (typeof window === "undefined") return;

    /*
      Desktop-only: the sticky-number sync drives the `lg:grid` layout, which
      is display:none below lg (mobile renders a separate section). Skip the
      work — and the GSAP payload — entirely on smaller screens.
    */
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    let triggers = [];
    let cancelled = false;

    /*
      Lazy-load GSAP + ScrollTrigger so the ~50KB library is code-split out of
      the critical bundle and only fetched once this desktop effect runs.
    */
    (async () => {
      const [gsapMod, stMod] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      const gsap = gsapMod.default || gsapMod;
      const { ScrollTrigger } = stMod;
      gsap.registerPlugin(ScrollTrigger);

      cardRefs.current.forEach((el, i) => {
        if (!el) return;

        const st = ScrollTrigger.create({
          trigger: el,
          /*
            Fire when the card's top crosses STICKY_TOP from viewport top.
            "+2" gives a tiny tolerance so the trigger fires after CSS sticky
            has engaged (not before), preventing a 1-frame mismatch.
          */
          start: `top top+=${STICKY_TOP + 2}`,
          onEnter: () => setActiveIdx(i),
          onLeaveBack: () => setActiveIdx(Math.max(-1, i - 1)),
        });

        triggers.push(st);
      });

      // Recalculate after mount in case SSR produced different layout metrics
      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="bg-white hidden lg:block"
        /*
          pt-20  (80 px) — breathing room above first card; also equals
                           STICKY_TOP so card-01 arrives at its sticky
                           position the moment the section top hits the viewport.
          pb-[280px]     — extra scroll distance that keeps the fully-stacked
                           state visible before the section exits the viewport.
        */
        style={{ paddingTop: 96, paddingBottom: 96 }}
      >
        <div
          className="max-w-[1400px] mx-auto px-10"
          style={{
            display: "grid",
            gridTemplateColumns: "4fr 60px 6fr",
            columnGap: 32,
            rowGap: 12,
            alignItems: "start",
          }}
        >
          {/* Col 1: text — spans all 6 service rows + 5 gaps, CSS sticky */}
          <div
            style={{
              gridColumn: 1,
              gridRow: "1 / span 6",
              position: "sticky", 
              top: STICKY_TOP,
              paddingRight: 48,
            }}
          >
            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-[family-name:var(--font-figtree)] font-bold text-[26px] capitalize leading-tight mb-5"
              style={{ color: "#191A2E" }}
            >
              Our <span style={{ color: "#7784C5" }}>{heading}</span>{" "}
              {headingAccent}
            </m.p>
            <m.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-[family-name:var(--font-figtree)] text-[14px] leading-[1.7]"
              style={{ color: "#4A5565" }}
            >
              {intro}
            </m.p>
          </div>

          {items.map((svc, i) => (
            <React.Fragment key={svc.num}>
              {/* Circle — col 2, row i+1, individually sticky.
                  Connector is absolutely positioned INSIDE this sticky cell
                  so it sticks with the circle and never scrolls away. */}
              <div
                style={{
                  gridColumn: 2,
                  gridRow: i + 1,
                  position: "sticky",
                  top: STICKY_TOP,
                  zIndex: i + 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 130,
                }}
              >
                <m.div
                  animate={{
                    background:
                      i <= activeIdx
                        ? "linear-gradient(135deg, #1D1F4B 0%, #191A2E 100%)"
                        : "rgba(113,134,250,0.22)",
                    borderColor:
                      i <= activeIdx
                        ? "rgba(102,121,228,0.7)"
                        : "rgba(113,134,250,0.5)",
                    color: "#fff",
                    scale: i === activeIdx ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 flex items-center justify-center text-[13px] font-[600]"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "1.5px solid",
                    fontFamily: "Inter, sans-serif",
                    flexShrink: 0,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {svc.num}
                </m.div>

                {/* Connector: inside sticky circle cell → sticks with circle.
                    top = 50% + 22px (just below circle edge).
                    height 98px = 43px to cell-bottom + 12px rowGap + 43px into next cell. */}
                {i < items.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(50% + 22px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 2,

                      /*
                       * Shorter connector so it visually ends
                       * before the next sticky circle appears.
                       */
                      height: 72,

                      backgroundImage:
                        i < activeIdx
                          ? "repeating-linear-gradient(to bottom, rgba(102,121,228,0.7) 0px, rgba(102,121,228,0.7) 5px, transparent 5px, transparent 10px)"
                          : "repeating-linear-gradient(to bottom, rgba(113,134,250,0.45) 0px, rgba(113,134,250,0.45) 5px, transparent 5px, transparent 10px)",

                      transition: "background-image 0.3s",
                      zIndex: 0,
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>

              {/* Card — col 3, row i+1, individually sticky */}
              <div
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                style={{
                  gridColumn: 3,
                  gridRow: i + 1,
                  position: "sticky",
                  top: STICKY_TOP,
                  zIndex: i + 1,
                }}
              >
                <div
                  className="rounded-2xl px-6 py-4 flex items-start gap-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #1D1F4B 0%, #191A2E 100%)",
                    border: "1px solid rgba(102,121,228,0.3)",
                    minHeight: 130,
                  }}
                >
                  <div
                    className="shrink-0 rounded-xl flex items-center justify-center mt-0.5"
                    style={{
                      width: 48,
                      height: 48,
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <svc.Icon size={20} style={{ color: "#ffffff" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-[family-name:var(--font-figtree)] font-bold text-[15px] leading-[1.3] mb-2">
                      {svc.title}
                    </p>
                    <div
                      className="font-[family-name:var(--font-figtree)] text-[13px] leading-[1.65] [&_a]:underline [&_a]:underline-offset-2 [&_a]:text-[#A0AEFF] [&_a]:hover:text-white [&_p]:m-0"
                      style={{ color: "rgba(255,255,255,0.65)" }}
                      dangerouslySetInnerHTML={{ __html: svc.desc }}
                    />
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MOBILE  –  sticky stacking cards
          ══════════════════════════════════════════════ */}
      <section className="bg-white lg:hidden" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="max-w-[540px] mx-auto px-5">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-[family-name:var(--font-figtree)] font-bold text-[24px] capitalize leading-tight mb-4"
            style={{ color: "#191A2E" }}
          >
            Our <span style={{ color: "#7784C5" }}>{heading}</span>{" "}
            {headingAccent}
          </m.h2>
          <m.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-[family-name:var(--font-figtree)] text-[14px] leading-[1.7] mb-10"
            style={{ color: "#4A5565" }}
          >
            {intro}
          </m.p>

          {items.map((svc, i) => (
            <div
              key={svc.num}
              style={{
                position: "sticky",
                top: STICKY_TOP,
                zIndex: i + 1,
                marginBottom: i < items.length - 1 ? 12 : 0,
              }}
            >
              <div
                className="rounded-2xl px-4 py-4 flex items-start gap-3"
                style={{
                  background: "linear-gradient(135deg, #1D1F4B 0%, #191A2E 100%)",
                  border: "1px solid rgba(102,121,228,0.3)",
                }}
              >
                {/* icon */}
                <div
                  className="shrink-0 rounded-xl flex items-center justify-center"
                  style={{
                    width: 40,
                    height: 40,
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    flexShrink: 0,
                  }}
                >
                  <svc.Icon size={18} style={{ color: "#ffffff" }} />
                </div>

                {/* text */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-[family-name:var(--font-figtree)] font-bold text-[14px] leading-[1.3] mb-1.5">
                    {svc.title}
                  </h3>
                  <div
                    className="font-[family-name:var(--font-figtree)] text-[12px] leading-[1.65] [&_a]:underline [&_a]:underline-offset-2 [&_a]:text-[#A0AEFF] [&_a]:hover:text-white [&_p]:m-0"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                    dangerouslySetInnerHTML={{ __html: svc.desc }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

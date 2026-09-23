"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { resolveIcon } from "../iconResolver";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const resolveImg = (src) => {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  // Bundled illustrations under /public/software_development are served frontend-local.
  if (src.startsWith("/software_development/")) return src;
  return `${API_BASE}/${src.replace(/^\//, "")}`;
};

import {
  Heart,
  ShoppingBag,
  Landmark,
  Play,
  Truck,
  Plane,
  BookOpen,
  Factory,
  Car,
  Zap,
  Shield,
  Wifi,
  Leaf,
  Scale,
  Building2,
  ChevronDown,
} from "lucide-react";

const INDUSTRIES = [
  {
    num: "01",
    Icon: Heart,
    name: "Healthcare & HealthTech",
    image: "/software_development/healthcare.png",
    desc: "We build platforms for patient data management, telemedicine solutions, and diagnostic tools. From wearable device integration to hospital management systems, our healthcare solutions scale from startups to established healthcare institutions.",
  },
  {
    num: "02",
    Icon: ShoppingBag,
    name: "Retail & E-Commerce",
    image: "/software_development/ecommerce.png",
    desc: "End-to-end retail platforms from omnichannel commerce engines to personalised recommendation systems. We build for scale, handling peak traffic events while maintaining sub-100ms response times.",
  },
  {
    num: "03",
    Icon: Landmark,
    name: "Finance & Banking",
    image: "/software_development/finance.png",
    desc: "Secure, compliant fintech and banking platforms built to regulatory standards. From payment gateways to lending platforms and portfolio management dashboards — engineered for trust and transparency.",
  },
  {
    num: "04",
    Icon: Play,
    name: "Media & Entertainment",
    image: "/software_development/media.png",
    desc: "Streaming infrastructure, content management platforms, and audience analytics tools that handle millions of concurrent users. Built to deliver content fast, personalised, and at global scale.",
  },
  {
    num: "05",
    Icon: Truck,
    name: "Supply Chain & Logistics",
    image: "/software_development/supply_chain.png",
    desc: "Real-time visibility platforms, route optimisation engines, and inventory management systems that give logistics operators the data they need to reduce cost and increase reliability.",
  },
  { num: "06", Icon: Plane,     name: "Travel & Hospitality",       image: null, desc: "Booking platforms, revenue management systems, and guest experience tools that power hotels, airlines, and travel aggregators. Designed for high availability during peak booking seasons." },
  { num: "07", Icon: BookOpen,  name: "Education & E-Learning",      image: null, desc: "LMS platforms, adaptive learning engines, and assessment tools that make education accessible, measurable, and engaging — built for institutions, ed-tech startups, and enterprise training." },
  { num: "08", Icon: Factory,   name: "Manufacturing",               image: null, desc: "MES, predictive maintenance systems, and factory floor analytics that connect your OT and IT layers. We help manufacturers reduce downtime and increase throughput with real-time intelligence." },
  { num: "09", Icon: Car,       name: "Automotive",                  image: null, desc: "Connected vehicle platforms, dealer management systems, and after-sales service portals. We build the digital backbone for automotive brands navigating the transition to software-defined vehicles." },
  { num: "10", Icon: Zap,       name: "Energy & Utilities",          image: null, desc: "Smart grid analytics, energy management platforms, and asset monitoring dashboards for utilities and renewable energy operators. Built for reliability in mission-critical environments." },
  { num: "11", Icon: Shield,    name: "Insurance",                   image: null, desc: "Policy management systems, claims automation platforms, and underwriting tools that reduce processing time while improving accuracy and regulatory compliance." },
  { num: "12", Icon: Wifi,      name: "Telecommunications",          image: null, desc: "OSS/BSS platforms, customer experience portals, and network analytics tools for telecom operators. Engineered for the volume and reliability demands of carrier-grade infrastructure." },
  { num: "13", Icon: Leaf,      name: "Agriculture & AgriTech",      image: null, desc: "Precision farming platforms, supply chain traceability tools, and market-linkage systems that empower farmers and agribusinesses with data-driven insights." },
  { num: "14", Icon: Scale,     name: "Legal & Compliance",          image: null, desc: "Contract lifecycle management, legal research tools, and compliance monitoring platforms that help legal teams move faster while reducing risk exposure." },
  { num: "15", Icon: Building2, name: "Public Sector & Government",  image: null, desc: "Citizen service portals, public records management systems, and inter-department collaboration platforms built to government security and accessibility standards." },
];
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return isDesktop;
}

export default function SdIndustries({ data }) {
  const [active, setActive] = useState(0);
  const isDesktop = useIsDesktop();
  const rawHeading    = data?.heading       || "We Deliver Software Development Services Across 15 Industries";
  const rawAccent     = data?.headingAccent;
  // If headingAccent is explicitly provided and non-empty, use it.
  // Otherwise, auto-split the last 2 words of the heading as the accent.
  const headingWords  = rawHeading.trim().split(/\s+/);
  const headingAccent = (rawAccent !== undefined && rawAccent !== "")
    ? rawAccent
    : headingWords.slice(-3).join(" ");
  const heading       = (rawAccent !== undefined && rawAccent !== "")
    ? rawHeading
    : headingWords.slice(0, -3).join(" ");
  const intro         = data?.intro         || "Our extensive experience spans across major industries, giving us intimate knowledge of domain-specific challenges, compliance requirements and competitive dynamics. We translate your industry expertise into scalable digital solutions.";
  const dynIndustries = data?.items?.length
    ? data.items.map((ind, i) => ({
        num:   String(i + 1).padStart(2, "0"),
        Icon:  resolveIcon(ind.icon) || Heart,
        name:  ind.name,
        desc:  ind.desc,
        image: ind.image || null,
        href:  ind.href || null,
      }))
    : null;
  const items   = dynIndustries || INDUSTRIES;
  const current = items[active >= 0 ? active : 0] || items[0];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white overflow-clip">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-[6fr_6fr] gap-8 items-start">

          {/* ── left: heading + subtitle + list ── */}
          <div className="flex flex-col order-2 lg:order-1">
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: "var(--font-figtree), Inter, sans-serif",
                fontWeight: 700,
                fontSize: 26,
                lineHeight: 1.2,
                color: "#1D1F4B",
                marginBottom: 16,
              }}
            >
              {heading}{" "}
              <span style={{ color: "#7784C5" }}>{headingAccent}</span>
            </m.h2>
            <m.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                fontFamily: "var(--font-figtree), Inter, sans-serif",
                fontWeight: 400,
                fontSize: 15,
                lineHeight: 1.75,
                color: "#4A5565",
                marginBottom: 24,
              }}
            >
              {intro}
            </m.p>

            {/* list panel */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(29,31,75,0.1)" }}
            >
              {items.map((ind, i) => {
                const isActive = active === i;
                return (
                  <div key={ind.num} style={{ borderBottom: "1px solid rgba(29,31,75,0.07)" }}>
                    <div className="relative">
                      <button
                        onClick={() => setActive(isActive ? -1 : i)}
                        aria-expanded={isActive}
                        aria-labelledby={`sd-industry-heading-${i}`}
                        className="peer absolute inset-0 z-10 w-full border-0 bg-transparent p-0"
                      />
                      {isActive ? (
                        /* ── ACTIVE header ── */
                        <div
                          className="flex items-center gap-4 px-5 py-4"
                          style={{
                            background: "linear-gradient(135deg, #576099 0%, #3A4066 50%, #1D2033 100%)",
                          }}
                        >
                          <span
                            aria-hidden
                            className="font-bold leading-none select-none shrink-0"
                            style={{ fontFamily: "Inter, sans-serif", fontSize: 32, color: "#ffffff" }}
                          >
                            {parseInt(ind.num)}
                          </span>
                          <h3
                            id={`sd-industry-heading-${i}`}
                            style={{ margin: 0, flex: 1, fontFamily: "var(--font-figtree), Inter, sans-serif", fontWeight: 600, fontSize: 15, lineHeight: 1.3, color: "#ffffff" }}
                          >
                            {ind.name}
                          </h3>
                          <div
                            aria-hidden
                            className="w-11 h-11 rounded-xl items-center justify-center shrink-0 hidden lg:flex"
                            style={{ background: "rgba(255,255,255,0.92)" }}
                          >
                            <ind.Icon size={18} style={{ color: "#1D1F4B" }} />
                          </div>
                          <ChevronDown
                            aria-hidden
                            size={18}
                            className="lg:hidden shrink-0 transition-transform duration-300"
                            style={{ color: "rgba(255,255,255,0.7)", transform: "rotate(180deg)" }}
                          />
                        </div>
                      ) : (
                        /* ── INACTIVE row ── */
                        <div className="flex items-center gap-3 px-5 py-3.5">
                          <div
                            aria-hidden
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: "#1D1F4B" }}
                          >
                            <ind.Icon size={16} style={{ color: "#ffffff" }} />
                          </div>
                          <span
                            aria-hidden
                            className="text-[13px] font-medium shrink-0 w-6"
                            style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}
                          >
                            {ind.num}
                          </span>
                          <h3
                            id={`sd-industry-heading-${i}`}
                            style={{ margin: 0, flex: 1, fontFamily: "var(--font-figtree), Inter, sans-serif", fontWeight: 400, fontSize: 14, lineHeight: 1.35, color: "#364153" }}
                          >
                            {ind.name}
                          </h3>
                          <ChevronDown
                            aria-hidden
                            size={16}
                            className="lg:hidden shrink-0"
                            style={{ color: "#9AA3AF" }}
                          />
                        </div>
                      )}
                    </div>

                    {/* ── Mobile inline accordion detail — below lg only ── */}
                    {!isDesktop && (
                    <div
                      className="lg:hidden overflow-hidden"
                      style={{
                        maxHeight: isActive ? 1500 : 0,
                        transition: "max-height 0.4s ease-in-out",
                      }}
                    >
                      <div className="px-4 pt-3 pb-4">
                        <div
                          className="rounded-2xl overflow-hidden"
                          style={{ background: "linear-gradient(180deg, #1D2033 0%, #3A4066 100%)" }}
                        >
                          <div className="p-5 flex flex-col gap-4">
                            <div
                              className="[&_*]:!text-inherit"
                              style={{
                                fontFamily: "var(--font-figtree), Inter, sans-serif",
                                fontWeight: 400,
                                fontSize: 14,
                                lineHeight: 1.75,
                                color: "rgba(255,255,255,0.85)",
                              }}
                              dangerouslySetInnerHTML={{ __html: ind.desc || "" }}
                            />
                            {resolveImg(ind.image) && (
                              <div
                                className="rounded-xl overflow-hidden"
                                style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(255,255,255,0.2)" }}
                              >
                                <Image
                                  src={resolveImg(ind.image)}
                                  alt={ind.name}
                                  width={800}
                                  height={400}
                                  sizes="(max-width: 1024px) 100vw, 800px"
                                  className="w-full h-auto object-contain"
                                  style={{ display: "block" }}
                                />
                              </div>
                            )}
                            {ind.href && (
                              <Link
                                href={ind.href}
                                className="w-fit font-[family-name:var(--font-figtree)] text-[14px] font-semibold underline underline-offset-2 decoration-white/40 hover:decoration-white/80 transition-all duration-200"
                                style={{ color: "rgba(255,255,255,0.9)" }}
                              >
                                Explore {ind.name}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── right: detail panel — mounted on lg+ only (see useIsDesktop) ── */}
          <div className="hidden lg:block lg:sticky lg:top-28 order-1 lg:order-2">
            {isDesktop && current && (
            <AnimatePresence mode="wait">
              <m.div
                key={current.num}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="rounded-3xl overflow-hidden flex flex-col min-h-[500px]"
                style={{ background: "linear-gradient(180deg, #1D2033 0%, #3A4066 100%)" }}
              >
                <div className="p-10 lg:p-12 flex flex-col flex-1">
                  {/* ghost number + title row */}
                  <div className="flex items-end gap-4 mb-5">
                    <p
                      className="font-bold leading-none select-none shrink-0"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "clamp(48px, 10vw, 120px)",
                        lineHeight: 0.85,
                        background: "linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.06) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {parseInt(current.num)}
                    </p>
                    {current.href ? (
                      <Link href={current.href} target="_blank" rel="noopener noreferrer" className="group/title">
                        <p style={{ color: "#ffffff", fontFamily: "var(--font-figtree), Inter, sans-serif", fontWeight: 700, fontSize: 24, lineHeight: 1.2, paddingBottom: 8, margin: 0, textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.4)", textUnderlineOffset: 4 }}>
                          {current.name}
                        </p>
                      </Link>
                    ) : (
                      <p style={{ color: "#ffffff", fontFamily: "var(--font-figtree), Inter, sans-serif", fontWeight: 700, fontSize: 24, lineHeight: 1.2, paddingBottom: 8, margin: 0 }}>
                        {current.name}
                      </p>
                    )}
                  </div>
                  <div
                    className="[&_*]:!text-inherit"
                    style={{
                      fontFamily: "var(--font-figtree), Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: 15,
                      lineHeight: 1.75,
                      color: "rgba(255,255,255,0.85)",
                      marginBottom: 32,
                    }}
                    dangerouslySetInnerHTML={{ __html: current.desc || "" }}
                  />
                  {resolveImg(current.image) && (
                    <div
                      className="mt-auto rounded-2xl overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(255,255,255,0.2)" }}
                    >
                      <Image
                        src={resolveImg(current.image)}
                        alt={current.name}
                        width={800}
                        height={400}
                        sizes="(max-width: 1024px) 100vw, 800px"
                        className="w-full h-auto object-contain"
                        style={{ display: "block" }}
                      />
                    </div>
                  )}
                </div>
              </m.div>
            </AnimatePresence>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

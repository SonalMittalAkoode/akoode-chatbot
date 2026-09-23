"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Star, TrendingUp, Users, Globe } from "lucide-react";
import { resolveIcon } from "../iconResolver";
import HeroBreadcrumb from "@/components/HeroBreadcrumb";
import "./SdHero.css";

const STATS = [
  { value: "4.9", label: "Google Rating", Icon: Star },
  { value: "97%", label: "Client Retention", Icon: TrendingUp },
  { value: "100+", label: "Clients Served", Icon: Users },
  { value: "Global", label: "Delivery", Icon: Globe },
];



const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const resolveImg = (src) => {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${API_BASE}/${src.replace(/^\//, "")}`;
};

export default function SdHero({ data, title }) {
  const crumbLabel   = title;
  const heading      = data?.heading      || "Building Scalable,";
  const headingAccent= data?.headingAccent|| "Human-Centered Solutions";
  const cta1Text     = data?.cta1Text     || "Get Free Consultation";
  const cta1Link     = data?.cta1Link     || "/contact-us";
  const cta2Text     = data?.cta2Text     || "View Our Work";
  const cta2Link     = data?.cta2Link     || "/case-studies";
  const dynParas     = (data?.paragraphs || []).filter(Boolean);
  const hasDynParas  = dynParas.length > 0;
  const dynStats     = data?.stats?.length ? data.stats : null;
  const heroImgSrc   = resolveImg(data?.heroImage) || "/software_development/hero.png";
  const heroImgAlt   = data?.heroImageAlt || "Software development dashboard";

  return (
    <section
      className="relative overflow-hidden min-h-screen flex flex-col"
      style={{ background: "linear-gradient(180deg, #1D2033 0%, #101828 100%)" }}
    >
      {/* background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            left: -280,
            top: -200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(113,134,250,0.13) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            right: -100,
            top: 80,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(119,132,197,0.09) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* main content */}
      <div className="relative z-10 flex-1 flex items-center w-full max-w-[1400px] mx-auto px-4 md:px-4 pt-28 pb-10 gap-12 xl:gap-20">
        {/* ── left col ── */}
        <div className="flex-1 max-w-[640px]">
          {/* breadcrumb */}
          <HeroBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: crumbLabel },
            ]}
          />

          <h1
            className="sd-hero-h1 font-[family-name:var(--font-figtree)] font-normal capitalize mb-5 text-[clamp(1.9rem,3.6vw,3.125rem)]"
            style={{ lineHeight: "1.08" }}
          >
            <span className="text-white">{heading} </span>
            <br className="hidden md:block" />
            <span style={{ color: "#7784C5" }}>{headingAccent}</span>
          </h1>

          <div
            className="sd-hero-reveal sd-hero-reveal--d1 space-y-3 mb-8"
          >
            {hasDynParas ? dynParas.map((p, i) => (
              <div
                key={i}
                className="font-[family-name:var(--font-figtree)] text-[14px] sm:text-[16px] leading-[1.6]"
                style={{ color: i === 0 ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.62)" }}
                dangerouslySetInnerHTML={{ __html: p }}
              />
            )) : (
              <>
                <p className="font-[family-name:var(--font-figtree)] text-[14px] sm:text-[16px] lg:text-[18px] leading-[1.6]" style={{ color: "rgba(255,255,255,0.88)" }}>
                  At Akoode Technologies, we see software as more than code. It is the foundation of how modern businesses operate, scale, and compete.
                </p>
                <p className="font-[family-name:var(--font-figtree)] text-[14px] sm:text-[16px] leading-[1.6]" style={{ color: "rgba(255,255,255,0.62)" }}>
                  We partner with startups, mid-sized businesses, and enterprise teams to build systems that are not only functional but meaningful — rooted in real business challenges, not assumptions or templates.
                </p>
                <p className="font-[family-name:var(--font-figtree)] text-[14px] sm:text-[16px] leading-[1.6]" style={{ color: "rgba(255,255,255,0.62)" }}>
                  From custom platforms and enterprise applications to SaaS products and AI-powered systems, our software development services are built to integrate seamlessly, deliver measurable outcomes, and scale alongside your growth.
                </p>
              </>
            )}
          </div>

          {/* CTAs */}
          <div
            className="sd-hero-reveal sd-hero-reveal--d2 flex flex-wrap gap-4"
          >
            <Link
              href={cta1Link}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-[family-name:var(--font-figtree)] font-[500] text-[16px] leading-6 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(71,73,114,0.6)] hover:-translate-y-0.5"
              style={{ background: "linear-gradient(90deg, #474972 0%, #585c9c 100%)" }}
            >
              {cta1Text}
              <ChevronRight size={16} />
            </Link>
            {(cta2Text && cta2Link) && (
              <Link
                href={cta2Link}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-[family-name:var(--font-figtree)] font-[500] text-[16px] leading-6 transition-all duration-300 hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.2)" }}
              >
                {cta2Text}
              </Link>
            )}
          </div>

        </div>

        {/* ── right col ── */}
        <div
          className="sd-hero-image-reveal hidden lg:block shrink-0 relative"
          style={{ width: 520 }}
        >
          <Image
            src={heroImgSrc}
            alt={heroImgAlt}
            width={520}
            height={430}
            sizes="520px"
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* stats bar */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-4 pb-8">
        <div
          className="rounded-2xl px-6 lg:px-10 py-5 grid grid-cols-2 lg:grid-cols-4 gap-6"
          style={{
            background:
              "linear-gradient(180deg, rgba(29,31,75,0.96) 0%, rgba(16,24,40,0.98) 100%)",
            border: "1.5px solid rgba(102,121,228,0.18)",
            backdropFilter: "blur(20px)",
          }}
        >
          {(dynStats || STATS).map((s, i) => {
            const IconComp = dynStats
              ? (resolveIcon(s.icon) || Star)
              : s.Icon;
            const { value, label } = s;
            return (
              <div
                key={label || i}
                className={`flex items-center gap-4 ${i < 3 ? "lg:border-r lg:pr-8" : ""}`}
                style={i < 3 ? { borderColor: "rgba(255,255,255,0.1)" } : {}}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#ffffff" }}>
                  <IconComp size={19} style={{ color: "#1D1F4B" }} />
                </div>
                <div>
                  <p className="text-white font-[family-name:var(--font-figtree)] font-[700] text-[22px] leading-[1.15]" style={{ letterSpacing: "-0.01em" }}>{value}</p>
                  <p className="font-[family-name:var(--font-figtree)] font-[400] text-[12.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { FaAndroid, FaApple, FaCode } from "react-icons/fa";
import resolveAsset, { IS_DEV } from "../resolveAsset";
import HeroBreadcrumb from "@/components/HeroBreadcrumb";

// Concentric orbit rings (outer → inner) — exact Figma spec: solid #576099 stroke.
const RINGS = [
  { size: 600, border: 2 },
  { size: 500, border: 5 },
  { size: 400, border: 2 },
];

// Shared badge card: white background, dark icon.
const badgeStyle = { background: "#ffffff", boxShadow: "0 14px 34px rgba(0,0,0,0.35)" };

// Continuous 360° orbit (reuses the global `spinSlow` keyframe from globals.css).
const ORBIT_ANIM = "spinSlow 30s linear infinite";

// Floating badges positioned on the orbit; they rotate with the rings.
const BADGES = [
  { Icon: FaAndroid, pos: { top: 80, left: 42 } },
  { Icon: FaApple, pos: { top: "47%", right: 8 } },
  { Icon: FaCode, pos: { bottom: 70, left: 78 } },
];

export default function MadHero({ data, title }) {
  const heading = data?.heading || "Mobile App Development";
  const crumbLabel = title;
  const headingAccent = data?.headingAccent || "Company";
  const paragraphs = (data?.paragraphs || []).filter(Boolean);
  const cta1Text = data?.cta1Text || "Start your Project";
  const cta1Link = data?.cta1Link || "/contact-us";
  const cta2Text = data?.cta2Text || "View our work";
  const cta2Link = data?.cta2Link || "/case-studies";
  const stats = data?.stats || [];
  const heroImgSrc = resolveAsset(data?.heroImage) || "/mobile-app/mobile.png";
  const heroImgAlt = data?.heroImageAlt || "Mobile app dashboards on phone";

  return (
    <section
      className="relative overflow-hidden min-h-screen flex flex-col justify-center pt-18 pb-6"
      style={{ background: "linear-gradient(180deg, #1D2033 0%, #101828 100%)" }}
    >
      {/* background glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            left: -280,
            top: -200,
            background: "radial-gradient(circle, rgba(113,134,250,0.13) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 500,
            height: 500,
            right: -100,
            top: 80,
            background: "radial-gradient(circle, rgba(119,132,197,0.09) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* main content */}
      <div className="relative z-10 flex items-center w-full max-w-[1400px] mx-auto px-4 gap-8 xl:gap-16">
        {/* left col */}
        <div className="flex-1 max-w-[760px]">
          {/* breadcrumb */}
          <HeroBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: crumbLabel },
            ]}
          />

          <h1
            className="font-figtree font-normal capitalize mb-5 text-[clamp(1.9rem,3.6vw,3.125rem)]"
            style={{ lineHeight: 1.08 }}
          >
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #7784C5 3%, #B7BEED 30%, #6077EC 50%, #7683C5 100%)" }}
            >
              {heading}{" "}
            </span>
            <br className="hidden md:block" />
            <span className="text-white">{headingAccent}</span>
          </h1>

          <div className="space-y-3 mb-8">
            {paragraphs.map((p, i) => (
              <div
                key={i}
                className="font-figtree text-[14px] sm:text-[16px] lg:text-[18px] leading-[1.6] [&_p]:m-0"
                style={{ color: i === 0 ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.62)" }}
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href={cta1Link}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-figtree font-medium text-[16px] leading-6 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(71,73,114,0.6)] hover:-translate-y-0.5"
              style={{ background: "linear-gradient(90deg, #474972 0%, #585c9c 100%)" }}
            >
              {cta1Text}
              <ChevronRight size={16} />
            </Link>
            {cta2Text && cta2Link && (
              <Link
                href={cta2Link}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-figtree font-medium text-[16px] leading-6 transition-all duration-300 hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.2)" }}
              >
                {cta2Text}
              </Link>
            )}
          </div>
        </div>

        {/* right col — orbit rings + phone mockups + floating badges.
            Inner composition is designed at 600px then scaled down so the
            layout box stays short enough to fit the hero in one viewport. */}
        <div className="hidden lg:flex shrink-0 relative items-center justify-center ml-auto" style={{ width: 510, height: 510 }}>
          <div className="relative flex items-center justify-center" style={{ width: 600, height: 600, transform: "scale(0.85)" }}>
          {/* rotating rings layer (behind phones) */}
          <div
            className="absolute inset-0 z-0 flex items-center justify-center"
            style={{ animation: `${ORBIT_ANIM} normal` }}
          >
            {RINGS.map((ring) => (
              <span
                key={ring.size}
                aria-hidden
                className="absolute rounded-full"
                style={{ width: ring.size, height: ring.size, border: `${ring.border}px solid #576099` }}
              />
            ))}
          </div>

          {/* center glow behind phones */}
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{
              width: 360,
              height: 360,
              background: "radial-gradient(circle, rgba(113,134,250,0.2) 0%, transparent 70%)",
              filter: "blur(45px)",
            }}
          />

          {/* phone image (static, centered) */}
          <Image
            src={heroImgSrc}
            alt={heroImgAlt}
            width={580}
            height={580}
            sizes="580px"
            className="relative z-10 w-[580px] max-w-none h-auto object-contain drop-shadow-[0_36px_70px_rgba(0,0,0,0.5)]"
            priority
            unoptimized={IS_DEV}
          />

          {/* rotating badges layer (in front) — orbits in sync with the rings */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ animation: `${ORBIT_ANIM} normal` }}
          >
            {BADGES.map(({ Icon, pos }, i) => (
              <span
                key={i}
                aria-hidden
                className="absolute flex h-15 w-15 items-center justify-center rounded-xl"
                style={{ ...pos, ...badgeStyle }}
              >
                {/* counter-rotate so the icon stays upright while orbiting */}
                <span style={{ animation: `${ORBIT_ANIM} reverse`, display: "flex" }}>
                  <Icon size={30} style={{ color: "#1D1F4B" }} />
                </span>
              </span>
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* stats bar — plain numbers with vertical dividers (no card, no icons) */}
      {stats.length > 0 && (
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 max-w-[800px]">
            {stats.map((s, i) => (
              <div
                key={s.label || i}
                className={`flex flex-col justify-center px-2 sm:px-8 ${i === 0 ? "sm:pl-0" : "sm:border-l"}`}
                style={i > 0 ? { borderColor: "rgba(255,255,255,0.16)" } : {}}
              >
                <p className="text-white font-figtree font-bold text-[28px] sm:text-[30px] leading-none mb-1.5">
                  {s.value}
                </p>
                <p className="font-figtree font-medium text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

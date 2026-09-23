"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import HeroBreadcrumb from "@/components/HeroBreadcrumb";

const HEADLINE_GRADIENT =
  "linear-gradient(22.32deg, #7784C5 33.66%, #B7BEED 48.02%, #6077EC 58.53%, #7683C5 85.2%)";

// "Talk to an Expert" button fill — Figma left→right gradient (#7784C5 → #4F60B5 → #4F5581).
const CTA_GRADIENT = "linear-gradient(90deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)";

const STATS = [
  { value: "4.9", label: "Google Rating" },
  { value: "97%", label: "Client Retention" }, 
  { value: "180+", label: "Clients served" },
  { value: "15+", label: "Industries Served" },
];

const FLOATING_CARDS = [
  {
    value: "400",
    suffix: "+",
    label: "connectors for software sandboxing & validation",
    style: { left: "6.6%", top: "25.5%", width: "33.6%", height: "16.8%" },
    borderWidth: "0.8px",
  },
  {
    value: "50",
    suffix: "+",
    label: "Reduction in manual effort",
    style: { left: "55.1%", top: "16.1%", width: "25.5%", height: "14.9%" },
    borderWidth: "2.67px",
  },
  {
    value: "80%",
    suffix: "+",
    label: "Reduction in manual efforts in data migration task", // Figma "migrationing" — corrected
    style: { left: "55.1%", top: "50.8%", width: "33.6%", height: "16.8%" },
    borderWidth: "0.8px",
  },
];

function FloatingCard({ value, suffix, label, style, borderWidth }) {
  return (
    <div
      className="absolute overflow-hidden rounded-2xl"
      style={{
        ...style,
        background: "#2D3566",
        border: `${borderWidth} solid rgba(255,255,255,0.1)`,
      }}
    >
      <div className="flex h-full flex-col justify-center px-[10%] py-[8%]">
        <div className="flex items-center font-figtree leading-none" style={{ color: "#889AF5" }}>
          <span className="text-[clamp(1.125rem,1.5vw,1.75rem)] tracking-[-0.03em]">{value}</span>
          <span className="text-[clamp(1rem,1.3vw,1.5rem)] tracking-[-0.03em]">{suffix}</span>
        </div>
        <p className="mt-[6px] font-figtree font-medium leading-[1.3] text-white text-[clamp(0.6875rem,0.85vw,0.875rem)]">
          {label}
        </p>
      </div>
    </div>
  );
}

export default function EcommerceDevelopmentHeroSection({ data, title } = {}) {
  const heading = data?.heading || "Ecommerce Development Company That Builds";
  const headingAccent = data?.headingAccent || "Revenue Infrastructure";
  const dynParas = (data?.paragraphs || []).filter(Boolean);
  const hasDynParas = dynParas.length > 0;
  const cta1Text = data?.cta1Text || "Talk to an Expert";
  const cta1Link = data?.cta1Link || "/contact-us";
  const cta2Text = data?.cta2Text || "View our work";
  const cta2Link = data?.cta2Link || "/case-studies";
  const crumbLabel = title || "Ecommerce Development";

  return (
    <section
      className="relative flex flex-col overflow-hidden lg:min-h-screen"
      style={{ background: "#130E2A" }}
    >
      {/* soft ambient glow behind the right composition (mobile fallback) */}
      <div
        aria-hidden
        className="pointer-events-none absolute lg:hidden"
        style={{
          width: 420,
          height: 420,
          right: -160,
          top: 40,
          background: "radial-gradient(circle, rgba(113,134,250,0.18) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-10 px-5 pt-24 pb-10 sm:px-8 lg:flex-row lg:items-center lg:gap-8 lg:px-16 lg:pt-24 xl:gap-12">
        {/* ── Left column ── */}
        <div className="flex w-full flex-col lg:max-w-[640px] xl:max-w-[720px]">
          <HeroBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: crumbLabel },
            ]}
          />

          <h1 className="mb-[10px] font-figtree font-normal leading-[1.12] text-[clamp(1.9rem,3.6vw,3.125rem)] tracking-[-0.01em]">
            <span className="text-white">
              {heading}{" "}
            </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADLINE_GRADIENT }}>{headingAccent}</span>
          </h1>

          <div className="mb-8 flex flex-col gap-[1.06em] font-figtree font-normal leading-[1.6] text-white/80 text-[14px] sm:text-[16px] lg:text-[18px] [&_p]:m-0">
            {hasDynParas ? (
              dynParas.map((p, i) => <div key={i} dangerouslySetInnerHTML={{ __html: p }} />)
            ) : (
              <>
                <p className="m-0">
                  Shopify was probably the right call when you started. It usually is.
                  Somewhere between your first thousand orders and your first ERP integration, though, the
                  platform stops helping and starts charging you for workarounds.
                  <br />
                  Akoode is an ecommerce development company for businesses at exactly that point.
                </p>
                <p className="m-0">
                  We build custom platforms, B2B portals, marketplaces and headless storefronts, and our
                  ecommerce development services treat your store as revenue infrastructure, not a theme with
                  plugins bolted on.
                </p>
              </>
            )}
          </div>

          {/* CTAs */}
          <div className="mb-[49px] flex w-full max-w-[804px] flex-col gap-4 sm:flex-row sm:gap-5">
            <Link
              href={cta1Link}
              className="inline-flex flex-1 items-center justify-center gap-[5px] rounded-[40px] border-[1.5px] px-[26px] py-[15px] font-figtree font-medium leading-6 text-white text-[16px] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95"
              style={{
                background: CTA_GRADIENT,
                borderColor: "#889AF5",
                boxShadow: "0px 10px 15px rgba(0,0,0,0.3)",
              }}
            >
              {cta1Text}
              <ChevronRight size={20} />
            </Link>
            {cta2Text && cta2Link && (
              <Link
                href={cta2Link}
                className="inline-flex flex-1 items-center justify-center rounded-[40px] border-[1.5px] px-[26px] py-[16px] font-figtree font-medium leading-6 text-white text-[16px] transition-colors duration-300 hover:bg-white/5"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                {cta2Text}
              </Link>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:flex sm:flex-wrap">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col justify-center py-[6px] pr-4 sm:pr-[42px] ${
                  i === 0 ? "" : "sm:pl-[25px]"
                } ${i < STATS.length - 1 ? "sm:border-r" : ""}`}
                style={i < STATS.length - 1 ? { borderColor: "#889AF5" } : undefined}
              >
                <p className="mb-3 font-figtree font-bold leading-none text-white text-[28px] sm:text-[30px]">
                  {s.value}
                </p>
                <p className="font-figtree font-medium leading-5 text-white text-[13px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column: glow + floating metric cards ── */}
        <div className="relative mx-auto hidden w-full max-w-[560px] shrink-0 lg:block lg:mx-0 lg:ml-auto lg:w-[46%] lg:self-start xl:w-[52%]">
          {/* aspect-ratio box locks the 817×895 Figma composition */}
          <div className="relative w-full" style={{ aspectRatio: "817 / 895" }}>
            <Image
              src="/e-commerce/hero.webp"
              alt=""
              aria-hidden
              fill
              priority
              sizes="(min-width: 1280px) 52vw, 46vw"
              className="pointer-events-none object-cover"
            />
            {FLOATING_CARDS.map((card) => (
              <FloatingCard key={card.label} {...card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

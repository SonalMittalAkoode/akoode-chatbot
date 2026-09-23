"use client";

import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";
import { ChevronRight, Star, Users, Briefcase, Building2 } from "lucide-react";
import HeroBreadcrumb from "@/components/HeroBreadcrumb";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

// Trust strip — exact Figma values (4.9 Google Rating / 97% Client Retention /
// 180+ Clients Served / 15+ Industries Served).
const STATS = [
  { Icon: Star,      value: "4.9",  label: "Google Rating",     sub: "Trusted by clients worldwide" },
  { Icon: Users,     value: "97%",  label: "Client Retention",  sub: "Long-term partnerships since 2019" },
  { Icon: Briefcase, value: "180+", label: "Clients Served",    sub: "Building products across domains" },
  { Icon: Building2, value: "15+",  label: "Industries Served", sub: "Delivering software globally" },
];

export default function ListingHero({ data }) {
  const heading       = data?.heading       || "Software Built For The";
  const headingAccent = data?.headingAccent || "Industry You Work In";
  const subtitle      = data?.subtitle      || "<p>Every industry runs on different data, different compliance requirements, and different user expectations. We build software that fits how your business actually works - not templates dressed up to look like they do.</p>";
  const ctaLabel      = data?.ctaLabel      || "Tell Us What You're Building";
  const ctaLink       = data?.ctaLink       || "/contact-us";
  const heroImage     = data?.image         || "/industries_page/list_hero.webp";
  const stats         = data?.stats?.length ? data.stats : STATS;

  return (
    <section className="relative font-figtree">
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 pt-24 lg:pt-20 pb-18">
        {/* ── hero row ── */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* left: copy */}
          <div>
            {/* breadcrumb */}
            <HeroBreadcrumb
              className="!mb-7"
              items={[
                { label: "Home", href: "/" },
                // Current page → plain text (no link).
                { label: "Industries" },
              ]}
            />

            <m.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-normal capitalize text-[28px] sm:text-[34px] lg:text-[44px] leading-[1.15]"
            >
              <span className="text-white">{heading} </span>
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg, #7784C5 3%, #B7BEED 30%, #6077EC 50%, #7683C5 100%)" }}
              >
                {headingAccent}
              </span>
            </m.h1>

            <m.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 max-w-[580px] text-[15px] lg:text-[16px] font-normal leading-[1.65] [&_p]:m-0 [&_p+p]:mt-4"
              style={{ color: "rgba(255,255,255,0.85)" }}
              dangerouslySetInnerHTML={{ __html: processHtmlLinks(subtitle) }}
            />

            <m.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-9"
            >
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-2.5 rounded-full px-8 py-4 font-medium text-[15px] sm:text-[16px] leading-6 text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(71,73,114,0.6)]"
                style={{ background: "linear-gradient(90deg, #7784C5 0%, #4F60B5 55%, #4F5581 100%)", outline: "1.5px solid #889AF5", outlineOffset: "-1.5px" }}
              >
                {ctaLabel}
                <ChevronRight size={18} />
              </Link>
            </m.div>
          </div>

          {/* right: dashboard mockup */}
          <m.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div
              className="absolute inset-0 -z-10 rounded-[48px]"
              style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(102,121,228,0.35) 0%, transparent 70%)", filter: "blur(40px)" }}
              aria-hidden
            />
            <Image
              src={heroImage}
              alt="Industry software dashboard"
              width={847}
              height={564}
              priority
              sizes="(max-width: 1024px) 100vw, 740px"
              className="w-full h-auto rounded-[24px]"
            />
          </m.div>
        </div>

        {/* ── trust strip ── */}
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 w-full rounded-[32px] px-6 py-7 sm:px-10"
          style={{
            background: "linear-gradient(180deg, rgba(45,49,80,0.55) 0%, rgba(26,29,52,0.55) 100%)",
            border: "1px solid rgba(136,154,245,0.16)",
            boxShadow: "0 18px 48px rgba(0,0,0,0.32)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-x-6 gap-y-6 sm:gap-y-7 lg:grid-cols-4 lg:gap-x-4">
            {stats.map((s, i) => {
              const Icon = s.Icon || Star;
              return (
                <div key={s.label || i} className="flex items-center gap-3.5">
                  <span
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[12px]"
                    style={{
                      background: "rgba(113,134,250,0.06)",
                      border: "1px solid rgba(113,134,250,0.45)",
                    }}
                  >
                    <Icon size={22} style={{ color: "#7186FA" }} strokeWidth={1.6} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-[20px] sm:text-[24px] leading-tight text-white">{s.value}</p>
                    <p className="font-medium text-[14px] sm:text-[15px] leading-tight text-white">{s.label}</p>
                    {s.sub && (
                      <p className="text-[12px] sm:text-[13px] leading-tight" style={{ color: "#BCBCBC" }}>{s.sub}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </m.div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiClock, FiHome, FiLayers, FiMapPin, FiUsers, FiZap } from "react-icons/fi";
import { buildAssetUrl, resolveIcon, splitTitle } from "./shared";
import RichText from "./RichText";

const DEFAULT_SKYLINE = "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=1800";
const FEATURE_ICONS = [FiHome, FiUsers, FiClock, FiLayers];

const DEFAULT_FEATURES = [
  { Icon: FiHome, title: "UK market scale:", body: "The UK's tech sector accounts for over 10% of GDP - and London's FinTech sector processes more capital than any other European city" },
  { Icon: FiUsers, title: "Timezone overlap:", body: "4–6 hours overlap with IST (GMT+0/+1) real-time collaboration every morning without sacrificing evening bandwidth" },
  { Icon: FiClock, title: "Regulatory expertise:", body: "UK GDPR, FCA compliance, NHS Digital standards (DCB0129/0160), PCI-DSS — built into architecture from sprint 1" },
  { Icon: FiLayers, title: "UK vertical depth:", body: "Deep experience in London FinTech (Open Banking, FCA-regulated workflows), NHS-adjacent HealthTech, and UK SaaS scale-ups targeting Series A and beyond" },
];

export function WhyGurugram({ data }) {
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const timerRef = useRef(null);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
      else el.scrollBy({ left: el.clientWidth * 0.82, behavior: 'smooth' });
    }, 3500);
    return () => { clearInterval(id); clearTimeout(timerRef.current); };
  }, []);
  const pauseBriefly = () => {
    pausedRef.current = true;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { pausedRef.current = false; }, 2000);
  };

  const heading = data?.heading || "Why the UK is Europe's Most Demanding Market for Software Development.";
  const para1 = data?.para1 || "The UK tech sector generated over £200 billion in output last year and hosts more venture-backed tech companies per capita than any country outside the US. London alone is home to 40,000+ technology firms, from pre-seed FinTech startups in Shoreditch to enterprise healthcare platforms operating across NHS trust networks. Manchester, Leeds, Edinburgh, and Bristol are accelerating fast — each developing distinct vertical specialisms that create specific, non-generic software development needs.";
  const para2 = data?.para2 || "This is not a market where generic, offshore-delivered software survives. UK buyers are sophisticated. They've been burned by agencies that under-deliver and by freelance teams that evaporate post-launch. The demand in this market is for software development companies that bring technical rigour, compliance literacy, and genuine delivery accountability — not proposals built on templates.";
  const para3 = data?.para3 || "";
  const cardLocation = data?.cardLocation || "Gurugram, India";
  const cardHeading = data?.cardHeading || "India's Global Capability Hub";
  const cardBody = data?.cardBody || "The epicenter of product engineering, innovation and digital transformation.";
  const imageSrc = data?.image ? buildAssetUrl(data.image) : "/placeholder-skyline.webp";
  const imageAlt = data?.imageAlt || "Modern high-rise business district";

  const features = data?.features?.length
    ? data.features.map((f, i) => {
        const isImage = f.icon?.includes("/") || f.icon?.startsWith("http");
        return {
          icon: f.icon,
          isImage,
          Icon: !isImage ? resolveIcon(f.icon, FiZap) : null,
          title: f.title,
          body: f.body
        };
      })
    : DEFAULT_FEATURES.map(f => ({ ...f, isImage: false }));

  return (
    <section className="sbc-section sbc-section--light sbc-why-gurugram-section" style={{ paddingBottom: 50 }}>
      <div className="sbc-glow-blob sbc-light-blob--tl" aria-hidden="true" />
      <div className="sbc-glow-blob sbc-light-blob--br" aria-hidden="true" />
      <div className="sbc-container">
        <header className="sbc-section-head mb-10 px-2 sm:mb-12 sm:px-0 lg:mb-14">
          <h2 className="sbc-h2 sbc-section-title text-[#1a1a1a] font-bold transition-colors duration-400 mb-0">
            {(() => {
              const { main, accent, suffix } = splitTitle(heading);
              return (
                <>
                  {main} {accent && <span className="sbc-gurugram-title-gradient">{accent}</span>} {suffix}
                </>
              );
            })()}
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-6 xl:gap-8">
          <div className="order-2 reveal flex min-h-0 min-w-0 flex-col lg:order-1 lg:min-h-0">
            <div className="flex flex-col gap-5 px-2 sm:gap-6 sm:px-0">
              {para1 && <RichText className="sbc-body w-full hyphens-auto text-pretty text-justify leading-relaxed text-[#505169] [overflow-wrap:anywhere]" html={para1} />}
              {para2 && <RichText className="sbc-body w-full hyphens-auto text-pretty text-justify leading-relaxed text-[#505169] [overflow-wrap:anywhere]" html={para2} />}
              {para3 && <RichText className="sbc-body w-full hyphens-auto text-pretty text-justify leading-relaxed text-[#505169] [overflow-wrap:anywhere]" html={para3} />}
            </div>
            <div ref={trackRef} onTouchStart={pauseBriefly} onMouseEnter={() => { pausedRef.current = true; }} onMouseLeave={() => { pausedRef.current = false; }} className="mt-6 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-7 sm:overflow-visible sm:px-0">
              {features.map(({ Icon, title, body, isImage, icon }) => (
                <div key={title} className="flex min-w-[78%] snap-center gap-3 sm:gap-4 rounded-2xl border border-[rgba(99,102,241,0.12)] bg-white p-4 sm:p-5 shadow-[0_4px_24px_-8px_rgba(80,60,180,0.1)] sm:min-w-0">
                  <div
                    className="flex h-8 w-8 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full overflow-hidden mt-0.5"
                    style={{ background: "linear-gradient(145deg, rgba(99,102,241,0.14) 0%, rgba(59,130,246,0.1) 100%)", border: "1.5px solid rgba(99,102,241,0.28)", boxShadow: "0 4px 14px -6px rgba(79,70,229,0.35)" }}
                  >
                    {isImage ? (
                      <Image src={buildAssetUrl(icon)} alt="" width={32} height={32} className="w-full h-full object-contain p-1.5 sm:p-2" />
                    ) : (
                      <Icon size={14} strokeWidth={1.75} className="text-[#4f46e5] sm:hidden" aria-hidden />
                    )}
                    {!isImage && <Icon size={20} strokeWidth={1.75} className="text-[#4f46e5] hidden sm:block" aria-hidden />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="sbc-h3 mb-1 sm:mb-1.5 text-[#14153d] text-[14px] sm:text-base">{title}</h3>
                    <RichText className="sbc-body text-[#505169] text-[12px] sm:text-sm leading-relaxed" html={body} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 relative mb-6 w-full min-w-0 lg:order-2 lg:mb-0 lg:sticky lg:top-24 lg:z-10 lg:self-start">
            <div
              className="reveal d2 relative isolate h-[min(32rem,calc(100svh-6.5rem))] w-full min-h-[340px] overflow-hidden rounded-[32px] sm:h-[min(34rem,calc(100svh-6.75rem))] sm:min-h-[360px] lg:h-[min(40rem,calc(100svh-8.75rem))] lg:min-h-0"
              style={{ boxShadow: "0 28px 70px -24px rgba(45,45,90,0.35), 0 12px 32px -16px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.6)" }}
            >
              <Image src={imageSrc} alt={imageAlt} fill className="object-cover object-[center_30%] lg:object-[center_25%]" sizes="(min-width:1024px) 40vw, 100vw" priority={false} unoptimized={true} />
              <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_top,rgba(2,4,10,0.92)_0%,rgba(10,12,26,0.38)_16%,transparent_38%)]" />
              <div className="absolute inset-x-0 bottom-0 z-[2]">
                <div
                  className="sbc-gurugram-card-footer relative z-[2] flex flex-col justify-end px-6 pb-6 pt-10 sm:px-8 sm:pb-7 sm:pt-12"
                  style={{ background: "linear-gradient(180deg, rgba(2,4,12,0) 0%, rgba(2,4,12,0.62) 14%, rgba(3,5,18,0.94) 42%, rgba(1,2,10,0.99) 100%)", backdropFilter: "blur(20px) saturate(150%)", WebkitBackdropFilter: "blur(20px) saturate(150%)" }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <FiMapPin size={15} strokeWidth={2.5} className="shrink-0 text-[#e9d5ff]" aria-hidden />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.85)]">{cardLocation}</span>
                  </div>
                  <h3 className="text-white text-xl font-bold leading-snug sm:text-2xl sm:leading-tight">{cardHeading}</h3>
                  <RichText className="sbc-body sbc-gurugram-card-body mt-2 max-w-lg leading-relaxed" html={cardBody} />
                  <div className="absolute bottom-5 right-5 flex items-center gap-1.5 sm:bottom-6 sm:right-6" aria-hidden>
                    <span className="h-2 w-2 rounded-full bg-[#c4b5fd] shadow-[0_0_12px_rgba(196,181,253,0.95)]" />
                    {/* <span className="h-2 w-2 rounded-full bg-white/35" />
                    <span className="h-2 w-2 rounded-full bg-white/35" /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center sm:mt-14">
          <Link href="/post-requirement" className="sbc-btn sbc-btn--primary group h-[56px] px-8 text-[15px] !no-underline">
            Submit Your Requirement
            <FiArrowRight size={18} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

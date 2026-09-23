'use client';

import { useRef, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { splitTitle } from './shared';
import RichText from './RichText';

// Fixed list of 15 industries. Name + image are locked across all SBC pages;
// only the bullet `points` can be customized per page via the admin form.
// `slug` links to the industry's real live page at /industries/[slug] — all 15
// are now published; every card gets the "Explore Now" CTA. Slugs verified
// directly against the live /industries API, not guessed from the name.
const STATIC_INDUSTRIES = [
  { name: 'Healthcare',                  img: '/industriesWeServe/healthcare.webp',                  slug: 'healthcare',                defaultPoints: ['Patient management and EHR systems', 'Telemedicine platforms', 'HIPAA-compliant architecture', 'Care pathway and clinical workflows'] },
  { name: 'Retail and E-Commerce',       img: '/industriesWeServe/retail_e-commerce.webp',           slug: 'retail-and-ecommerce',       defaultPoints: ['Multi-vendor marketplaces', 'Inventory and order management', 'Personalised shopping UX', 'Headless commerce integrations'] },
  { name: 'Media and Entertainment',     img: '/industriesWeServe/media_entertainment.webp',         slug: 'media-and-entertainment',    defaultPoints: ['Streaming and OTT platforms', 'Content management and DRM', 'Audience analytics dashboards', 'Subscription and paywall logic'] },
  { name: 'Finance and Banking',         img: '/industriesWeServe/finance_banking.webp',             slug: 'finance-and-banking',        defaultPoints: ['Payment gateway integration', 'Fraud detection systems', 'PCI-DSS compliance', 'KYC and customer onboarding flows'] },
  { name: 'Automotive',                  img: '/industriesWeServe/automotive.webp',                  slug: 'automotive',                 defaultPoints: ['Connected vehicle telemetry', 'Fleet operations dashboards', 'Driver and rider mobile apps', 'Dealership CRM integrations'] },
  { name: 'Agriculture',                 img: '/industriesWeServe/agriculture.webp',                 slug: 'agriculture',                defaultPoints: ['Farm operations platforms', 'IoT sensor data pipelines', 'Crop and yield analytics', 'Supply chain traceability'] },
  { name: 'Telecommunication',           img: '/industriesWeServe/telecommunication.webp',           slug: 'telecommunication',          defaultPoints: ['Subscriber management systems', 'Billing and rating engines', 'Network operations dashboards', 'Self-service customer portals'] },
  { name: 'Manufacturing',               img: '/industriesWeServe/manufacturing_iot_software.webp',  slug: 'manufacturing',              defaultPoints: ['MES and shop-floor software', 'IoT and machine telemetry', 'Quality assurance workflows', 'Predictive maintenance models'] },
  { name: 'Public Sector and Government',img: '/industriesWeServe/public_sector_government.webp',    slug: 'public-sector',              defaultPoints: ['Citizen-facing service portals', 'Case and workflow management', 'Accessible, audit-ready platforms', 'Data residency and compliance controls'] },
  { name: 'Real Estate',                 img: '/industriesWeServe/real_estate.webp',                 slug: 'real-estate',                defaultPoints: ['Property listing platforms', 'CRM and lead tracking', 'Virtual tour integrations', 'Tenant and lease management'] },
  { name: 'Energy and Utilities',        img: '/industriesWeServe/energy_utilities.webp',            slug: 'energy-and-utilities',       defaultPoints: ['Smart meter data pipelines', 'Asset and outage management', 'Customer billing portals', 'Grid analytics and forecasting'] },
  { name: 'Travel and Hospitality',      img: '/industriesWeServe/travel_hospitality.webp',          slug: 'travel-and-hospitality',     defaultPoints: ['Booking and reservation systems', 'Travel itinerary platforms', 'Reviews and loyalty engines', 'Concierge and guest experience apps'] },
  { name: 'Education',                   img: '/industriesWeServe/education.webp',                   slug: 'education',                  defaultPoints: ['LMS and course platforms', 'Live class and webinar tools', 'Progress tracking and analytics', 'Assessment and certification flows'] },
  { name: 'Insurance',                   img: '/industriesWeServe/insurance.webp',                   slug: 'insurance',                  defaultPoints: ['Policy administration systems', 'Claims and underwriting workflows', 'Fraud detection and risk scoring', 'Customer self-service portals'] },
  { name: 'Logistics and Supply Chain',  img: '/industriesWeServe/logistics.webp',                   slug: 'logistics',                  defaultPoints: ['Real-time fleet tracking', 'Route and delivery optimisation', 'Warehouse management systems', 'End-to-end shipment visibility'] },
];

/** Encoded noise texture — Tailwind arbitrary background-image (static string for JIT). */
const NOISE_BG_CLASS =
  "[background-image:url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%224%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22/%3E%3C/svg%3E')]";

const OVERSHADOW =
  'absolute inset-0 pointer-events-none opacity-100 transition-all duration-500 md:opacity-0 md:group-hover:opacity-100 bg-[linear-gradient(to_top,rgba(4,5,14,0.85)_0%,rgba(4,5,14,0.4)_55%,transparent_100%)]';

// Visual palette cycled across the 15 industry cards. Icons are no longer used —
// each card renders the industry's full-bleed image background instead.
const CONFIG = [
  {
    cardBg: 'bg-[linear-gradient(145deg,#0f1030,#3c3f6a)]',
    glowBg: 'bg-[radial-gradient(circle,rgba(157,143,245,0.21)_0%,transparent_70%)]',
    dotClass: 'bg-[#edeafd] shadow-[0_0_8px_#edeafd]',
    iconSmWrap: 'border border-[#9d8ff555] bg-[#9d8ff522]',
    footerBar: 'border-t border-[#9d8ff522] bg-[#0c0d1e]',
    bullet: 'bg-[#9d8ff5]',
    cta: '!text-[#9d8ff5]',
  },
  {
    cardBg: 'bg-[linear-gradient(150deg,#111230,#474972)]',
    glowBg: 'bg-[radial-gradient(circle,rgba(237,234,253,0.21)_0%,transparent_70%)]',
    dotClass: 'bg-[#DDDFEE] shadow-[0_0_8px_#DDDFEE]',
    iconSmWrap: 'border border-[#edeafd55] bg-[#edeafd22]',
    footerBar: 'border-t border-[#edeafd22] bg-[#0c0d1e]',
    bullet: 'bg-[#edeafd]',
    cta: '!text-[#edeafd]',
  },
  {
    cardBg: 'bg-[linear-gradient(135deg,#0c0e28,#40415D)]',
    glowBg: 'bg-[radial-gradient(circle,rgba(157,143,245,0.21)_0%,transparent_70%)]',
    dotClass: 'bg-[#edeafd] shadow-[0_0_8px_#edeafd]',
    iconSmWrap: 'border border-[#9d8ff555] bg-[#9d8ff522]',
    footerBar: 'border-t border-[#9d8ff522] bg-[#0c0d1e]',
    bullet: 'bg-[#9d8ff5]',
    cta: '!text-[#9d8ff5]',
  },
  {
    cardBg: 'bg-[linear-gradient(155deg,#0d0f2a,#4a4d6a)]',
    glowBg: 'bg-[radial-gradient(circle,rgba(221,223,238,0.21)_0%,transparent_70%)]',
    dotClass: 'bg-[#eae9f6] shadow-[0_0_8px_#eae9f6]',
    iconSmWrap: 'border border-[#DDDFEE55] bg-[#DDDFEE22]',
    footerBar: 'border-t border-[#DDDFEE22] bg-[#0c0d1e]',
    bullet: 'bg-[#DDDFEE]',
    cta: '!text-[#DDDFEE]',
  },
  {
    cardBg: 'bg-[linear-gradient(140deg,#0a0c24,#3c3f6a)]',
    glowBg: 'bg-[radial-gradient(circle,rgba(234,233,246,0.21)_0%,transparent_70%)]',
    dotClass: 'bg-[#DDDFEE] shadow-[0_0_8px_#DDDFEE]',
    iconSmWrap: 'border border-[#eae9f655] bg-[#eae9f622]',
    footerBar: 'border-t border-[#eae9f622] bg-[#0c0d1e]',
    bullet: 'bg-[#eae9f6]',
    cta: '!text-[#eae9f6]',
  },
];

const CARD_W = 280;
const SCROLL_BY = CARD_W + 16;
const AUTO_INTERVAL = 3500;

export default function IndustriesSection({ data }) {
  const heading = data?.heading || "Deep Expertise Across Every Vertical";
  const subtitle =
    data?.subtitle ||
    "We bring domain knowledge and battle-tested engineering to every industry — solving sector-specific challenges with speed and precision.";

  // Industries are FIXED — name + image are locked. Only the per-industry `points`
  // can be customised per page. We match incoming data by name (case-insensitive)
  // so admin can update content for any industry without affecting its image or order.
  const findByName = (name) =>
    (data?.items || []).find(
      (it) => String(it?.name || "").trim().toLowerCase() === name.trim().toLowerCase()
    );
  const industries = STATIC_INDUSTRIES.map((s, i) => {
    const match = findByName(s.name);
    const incomingPoints = Array.isArray(match?.points) ? match.points.filter(Boolean) : [];
    return {
      name: s.name,
      img: s.img,
      iconAlt: match?.iconAlt || s.name,
      points: incomingPoints.length ? incomingPoints : s.defaultPoints,
      href: s.slug ? `/industries/${s.slug}` : null,
    };
  });
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const pauseTimerRef = useRef(null);

  const pauseAutoBriefly = () => {
    pausedRef.current = true;
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
      pauseTimerRef.current = null;
    }, 2000);
  };

  const scroll = (dir) => {
    pauseAutoBriefly();
    trackRef.current?.scrollBy({ left: dir * SCROLL_BY, behavior: 'smooth' });
  };

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      const el = trackRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: SCROLL_BY, behavior: 'smooth' });
      }
    }, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="sbc-section--light overflow-hidden bg-[#f2f0f7] py-[70px] md:py-[100px]"
      id="industries"
    >
      {/* ── Header — same horizontal shell as scroll track (pl-[5%], flush right) ── */}
      <div
        className="mx-auto mb-10 w-full max-w-[1240px] opacity-0 translate-y-[28px] transition-[opacity,transform] duration-700 ease-out md:mb-12"
        data-rv
      >
        <div className="px-[5%]">
          <div className="sbc-section-head sbc-section-head--single-title !max-w-[920px] mb-0">
            <h2 className="sbc-h2 sbc-section-title text-[#1a1a1a] font-bold transition-colors duration-400 mb-0">
              {(() => {
                const { main, accent, suffix } = splitTitle(heading);
                return (
                  <>
                    {main} {accent && <span className="sbc-heading-accent">{accent}</span>} {suffix}
                  </>
                );
              })()}
            </h2>
            <RichText className="sbc-body-lg sbc-section-subtitle !text-[#1a1730]" html={subtitle} />
          </div>
        </div>
        <div className="mt-3 flex justify-end gap-3 px-[5%] md:mt-4">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(120,115,200,0.25)] bg-[rgba(124,110,240,0.1)] text-[#9d8ff5] transition-all duration-300 hover:-translate-x-0.5"
            aria-label="Previous"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(124,110,240,0.45)] bg-[rgba(124,110,240,0.22)] text-white transition-all duration-300 hover:translate-x-0.5"
            aria-label="Next"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── Scroll track ── */}
      <div className="mx-auto max-w-[1240px] pl-[5%]">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
        >
          {industries.map((ind, i) => {
            const iconUrl = ind.img;
            // Cycle through the existing color CONFIG palette for 15 industries.
            const cfg = CONFIG[i % CONFIG.length];
            const {
              cardBg,
              glowBg,
              dotClass,
              iconSmWrap,
              footerBar,
              bullet,
              cta,
            } = cfg;
            return (
              <div
                key={ind.name}
                className={`group relative h-[290px] cursor-pointer flex-none snap-start overflow-hidden rounded-2xl border border-[rgba(120,115,200,0.15)] transition-all duration-500 w-[78vw] sm:w-[260px] md:w-[280px] ${cardBg}`}
              >
                {/* Noise texture */}
                <div
                  className={`pointer-events-none absolute inset-0 opacity-[0.04] ${NOISE_BG_CLASS}`}
                />

                {/* Glow orb */}
                <div
                  className={`pointer-events-none absolute left-1/2 top-[38%] size-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[24px] transition-all duration-500 md:group-hover:opacity-30 ${glowBg}`}
                />

                {/* Dark overlay — always on mobile, hover-only on desktop */}
                <div className={OVERSHADOW} />

                {/* Full-card image background — desktop only; mobile keeps the gradient.
                    Explicit width/height (not `fill` + a fixed-px `sizes`) so Next.js
                    generates a capped 1x/2x srcSet for this ~280px slot instead of the
                    full unbounded deviceSizes range (up to 3840w) that a `sizes` prop
                    always triggers on a `fill` image, regardless of the value passed. */}
                <Image
                  src={iconUrl}
                  alt={ind.iconAlt || ind.name}
                  width={384}
                  height={290}
                  className="absolute inset-0 hidden h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-[8px] md:block"
                />
                <div className="hidden md:block absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/80" />

                {/* Accent dot */}
                <div
                  className={`absolute right-4 top-4 z-10 size-2 rounded-full ${dotClass}`}
                />

                {/* ── Small circular icon — always on mobile, hover on desktop ── */}
                <div
                  className={`absolute left-4 top-4 z-10 flex size-10 scale-100 items-center justify-center rounded-full opacity-100 transition-all duration-500 md:scale-50 md:opacity-0 md:group-hover:scale-100 md:group-hover:opacity-100 overflow-hidden ${iconSmWrap}`}
                >
                  <Image src={iconUrl} alt={ind.iconAlt || ind.name} width={40} height={40} className="h-full w-full object-cover" />
                </div>

                {/* ── Footer — desktop default only ── */}
                <div
                  className={`absolute bottom-0 left-0 right-0 translate-y-3 px-5 py-4 opacity-0 transition-all duration-500 md:translate-y-0 md:opacity-100 md:group-hover:translate-y-3 md:group-hover:opacity-0 ${footerBar}`}
                >
                  <div>
                    <p className="sbc-body !mb-0 !mt-0 font-bold leading-tight !text-white">{ind.name}</p>
                  </div>
                </div>

                {/* ── Rich content — always on mobile, hover on desktop ── */}
                <div
                  className="pointer-events-auto absolute inset-0 z-[5] flex translate-y-0 flex-col justify-start p-5 pt-[70px] opacity-100 transition-all duration-500 md:pointer-events-none md:translate-y-3 md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100"
                >
                  <h3 className="sbc-h3 mb-2 font-extrabold !text-[#f8f7ff]">
                    {ind.name}
                  </h3>

                  <div className="mb-4 flex flex-col gap-2">
                    {ind.points.map((pt, pi) => (
                      <div key={pi} className="flex items-start gap-2">
                        <div className={`mt-1.5 size-[5px] shrink-0 rounded-full ${bullet}`} />
                        <span className="text-[11px] leading-tight !text-[#e8e4fc]">{pt}</span>
                      </div>
                    ))}
                  </div>

                  {ind.href && (
                    <Link
                      href={ind.href}
                      className={`group/cta mt-auto inline-flex items-center gap-1.5 text-[12px] font-bold transition-all hover:gap-2.5 ${cta}`}
                    >
                      Explore Now
                      <FiArrowRight size={14} className="transition-transform duration-300 group-hover/cta:translate-x-1" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

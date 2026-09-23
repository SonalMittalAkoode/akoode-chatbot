'use client';

import Image from 'next/image';
import {
  FiAward,
  FiEye,
  FiLink2,
  FiMessageCircle,
  FiTrendingUp,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiZap,
} from 'react-icons/fi';
import { LuHandshake } from 'react-icons/lu';
import { SSUB, rv, buildAssetUrl, resolveIcon, splitTitle } from './shared';
import RichText from './RichText';

const ICON_COLORS = ['#9d8ff5', '#b8acff', '#9d8ff5', '#b8acff'];
const FEATURE_ICONS = [FiTrendingUp, FiEye, FiLink2, FiAward];
const CLIENT_LOVE_ICONS = [FiCheckCircle, FiMessageCircle, FiAward, LuHandshake];

const DEFAULT_FEATURES = [
  { Icon: FiTrendingUp, color: '#9d8ff5', title: 'Proven Delivery Excellence', body: 'Consistently delivering high-performance digital products on time, on budget, and aligned with real business goals.' },
  { Icon: FiEye, color: '#b8acff', title: 'Transparent Collaboration', body: 'Weekly progress visibility, real-time communication, and zero surprises throughout every phase of development.' },
  { Icon: FiLink2, color: '#9d8ff5', title: 'Long-Term Technology Partners', body: "We don't just launch products — we stay involved to optimize, scale, and support your growth journey." },
  { Icon: FiAward, color: '#b8acff', title: 'Recognized by Clients & Industry', body: 'Top-rated across trusted platforms and featured by leading business and technology publications worldwide.' },
];

const DEFAULT_PLATFORM_RATINGS = [
  { key: 'google', img: '/reviews/googlelogo.svg', rating: '4.9', accent: '#7c6ef0', a11yLabel: 'Google' },
  { key: 'clutch', img: '/reviews/clutch.svg', rating: '5.0', accent: '#7c6ef0', a11yLabel: 'Clutch' },
  { key: 'goodfirms', img: '/reviews/Goodfirms_Logo.svg', rating: '4.8', accent: '#9d8ff5', a11yLabel: 'GoodFirms', logoScale: 1.2 },
];

const DEFAULT_CLIENT_LOVE = [
  { Icon: FiCheckCircle, title: 'On-time Delivery', body: '98% of projects delivered on time' },
  { Icon: FiMessageCircle, title: 'Clear Communication', body: 'Real-time updates and transparency' },
  { Icon: FiAward, title: 'Quality & Reliability', body: 'High-quality code and scalable solutions' },
  { Icon: LuHandshake, title: 'Long-term Partnership', body: '80% clients continue to work with us' },
];

/**
 * Normalizes logos to one visual size: fixed-height slot + `object-contain` + intrinsic `width`/`height` on Image.
 */
function PlatformRatingLogo({ src, alt = "", scale = 1 }) {
  return (
    <div className="flex h-[5.25rem] w-full min-w-0 items-center justify-center px-0.5 sm:h-[5.75rem]">
      <Image
        src={src}
        alt={alt}
        width={400}
        height={160}
        unoptimized={true}
        sizes="(min-width: 1024px) 160px, 30vw"
        className="max-h-[5rem] min-h-[2.5rem] w-auto max-w-[min(100%,13.5rem)] object-contain object-center sm:max-h-[5.5rem] sm:max-w-[min(100%,14rem)]"
        style={
          scale !== 1 ? { transform: `scale(${scale})`, transformOrigin: 'center center' } : undefined
        }
      />
    </div>
  );
}

/** Fractional star bar: empty track + filled overlay (e.g. 4.8 → partial 5th star) */
function StarRow({ ratingValue, color }) {
  const pct = (Math.min(5, Math.max(0, ratingValue)) / 5) * 100;
  return (
    <span className="relative inline-block select-none text-[14px] leading-none tracking-[0.06em] sm:text-[16px]" aria-hidden>
      <span className="text-[#d8d4ea]">★★★★★</span>
      <span
        className="absolute left-0 top-0 overflow-hidden whitespace-nowrap"
        style={{ width: `${pct}%`, color }}
      >
        ★★★★★
      </span>
    </span>
  );
}

function PlatformRatingsPanel() {
  // Platform Ratings are fully static — admin overrides are ignored.
  // Logos sourced from /public/reviews/*.svg.
  const list = DEFAULT_PLATFORM_RATINGS;
  return (
    <div className="w-full min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[17px] font-bold leading-snug text-[#18193e] sm:text-lg">Platform Ratings</h3>
          <p className="mt-1.5 text-[13px] leading-snug text-[#505169] sm:text-[14px]">
            What our clients say across leading platforms.
          </p>
        </div>
        {/* <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(99,102,241,0.35)] bg-white text-[#474972] shadow-sm sm:h-9 sm:w-9">
            <FiChevronLeft size={17} strokeWidth={2} />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(99,102,241,0.35)] bg-white text-[#474972] shadow-sm sm:h-9 sm:w-9">
            <FiChevronRight size={17} strokeWidth={2} />
          </span>
        </div> */}
      </div>

      <div className="mt-4 grid w-full grid-cols-3 gap-3 min-[1100px]:gap-4">
        {list.map((r, idx) => {
          const imgSrc = r.img?.startsWith('/') ? r.img : buildAssetUrl(r.img);
          const ratingValue = parseFloat(r.rating);
          const accent = r.accent || (idx % 2 === 0 ? '#7c6ef0' : '#9d8ff5');
          return (
            <div
              key={r.key || r.name || idx}
              className="flex min-w-0 flex-col items-center justify-center gap-4 rounded-[14px] border border-[rgba(99,102,241,0.14)] bg-white px-3 py-4 shadow-[0_8px_28px_-12px_rgba(65,50,140,0.14)] sm:gap-5 sm:px-4 sm:py-5"
            >
              <span className="sr-only">{r.a11yLabel || r.name}, {r.rating} out of five stars</span>
              <PlatformRatingLogo src={imgSrc} alt={r.imgAlt || r.a11yLabel || r.name || ""} scale={r.logoScale ?? 1} />
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                <span className="text-[26px] font-black leading-none tabular-nums text-[#18193e] sm:text-[32px]">
                  {r.rating}
                </span>
                <StarRow ratingValue={ratingValue} color={accent} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function WhyCustomSoftwareSection({ data }) {
  const heading = data?.heading || "Built with Precision";
  const intro = data?.intro || "The best partnerships are built on outcomes, not promises. From fast-growing startups to established enterprises, teams choose Akoode for execution they can trust, communication they can rely on, and products that create measurable business impact.";

  const features = data?.features?.length
    ? data.features.map((f, i) => {
        const isImage = f.icon?.includes("/") || f.icon?.startsWith("http");
        return {
          icon: f.icon,
          isImage,
          Icon: !isImage ? resolveIcon(f.icon, FiZap) : null,
          color: ICON_COLORS[i % ICON_COLORS.length],
          title: f.title,
          body: f.body,
        };
      })
    : DEFAULT_FEATURES.map(f => ({ ...f, isImage: false }));

  const clientLove = data?.clientLove?.length
    ? data.clientLove.map((c, i) => ({
        Icon: resolveIcon(c.icon, FiZap),
        title: c.title,
        body: c.body,
      }))
    : DEFAULT_CLIENT_LOVE;

  const platformRatings = data?.platformRatings?.length ? data.platformRatings : null;

  return (
    <section
      className="sbc-section--light relative z-[1] px-[5%] pb-16 pt-[80px] md:pb-[100px] md:pt-[80px]"
      style={{ background: 'linear-gradient(135deg, #f5f3fa 0%, #ebe9f4 45%, #f2eff8 100%)' }}
      id="custom-software"
    >
      <div className="mx-auto max-w-[1240px]">
        <div className="sbc-section-head sbc-section-head--single-title mb-12 w-full">
          <h2 className="sbc-h2 sbc-section-title text-[#1a1a1a] font-bold transition-colors duration-400 mb-0">
            {(() => {
              const { main, accent } = splitTitle(heading);
              return (
                <>
                  {main} {accent && <span className="sbc-heading-accent">{accent}</span>}
                </>
              );
            })()}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:gap-8 lg:grid-cols-[5fr_6fr] lg:items-start lg:gap-4 xl:gap-5">
          <div data-rv className="order-2 flex min-h-0 min-w-0 flex-col lg:order-1" style={rv()}>
            <div className="flex flex-col gap-6 pt-5 md:gap-7 lg:flex-1">
              <RichText className={`${SSUB} mb-0 max-w-full text-left`} html={intro} />
              {features.map((f) => (
                <div key={f.title} className="group flex items-start gap-5">
                  <div
                    className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] transition-all duration-300 group-hover:scale-110 overflow-hidden"
                    style={{ background: `${f.color}28`, border: `1.5px solid ${f.color}70` }}
                  >
                    {f.isImage ? (
                      <Image src={buildAssetUrl(f.icon)} alt="" width={44} height={44} className="w-full h-full object-contain p-1.5" />
                    ) : (
                      <f.Icon size={20} style={{ color: f.color }} />
                    )}
                  </div>
                  <div className="min-w-0 max-w-full">
                    <h3 className="sbc-h3 mb-2 text-[#18193e]">{f.title}</h3>
                    <RichText className="sbc-body leading-[1.75] text-[#2a2d52]" html={f.body} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 relative min-w-0 mb-4 sm:mb-5 lg:mb-0 lg:order-2 lg:mb-0 lg:sticky lg:top-24 lg:z-10 lg:self-start">
            <div
              data-rv
              style={rv(0.12)}
              className="reveal d2 mx-auto w-full max-w-[34rem] flex flex-col overflow-hidden rounded-[14px] border-[1.5px] border-[rgba(108,80,220,0.16)] bg-white shadow-[0_20px_56px_-20px_rgba(65,45,150,0.28)]"
            >
              <div className="h-[3px] w-full shrink-0 bg-gradient-to-r from-[#7c6ef0] via-[#a78bfa] to-[#67e8f9]" aria-hidden />
              <div className="relative shrink-0 px-5 pb-6 pt-6 sm:px-8 sm:pt-8">
                <PlatformRatingsPanel />
              </div>
              <div
                className="mt-auto shrink-0 px-5 py-7 sm:px-8 sm:py-8"
                style={{
                  background: 'linear-gradient(180deg, rgba(157,143,245,0.14) 0%, rgba(237,233,255,0.85) 48%, rgba(245,242,255,0.95) 100%)',
                  borderTop: '1px solid rgba(99,102,241,0.12)',
                }}
              >
                <h4 className="mb-5 text-left text-[14px] font-bold leading-snug text-[#18193e] sm:text-[15px] md:text-base">
                  What clients love about working with us
                </h4>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mt-4">
                  {clientLove.map(({ Icon, title, body }) => (
                    <div key={title} className="flex min-w-0 flex-col items-center text-center">
                      <div className="mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[rgba(99,102,241,0.45)] bg-white/90 text-[#5b5ce7] shadow-sm sm:mb-2.5 sm:h-10 sm:w-10">
                        <Icon size={18} strokeWidth={1.75} className="shrink-0 sm:h-5 sm:w-5" aria-hidden />
                      </div>
                      <h5 className="text-[10px] font-semibold leading-snug text-[#18193e] sm:text-[11px] md:text-xs">{title}</h5>
                      <p className="mt-1 text-[9px] leading-snug text-[#505169] sm:text-[10px] md:text-[11px]">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

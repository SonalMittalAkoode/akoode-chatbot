import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { ACCENT, Reveal } from "./shared";
import { RichText, buildAssetUrl, pick, pickList, renderIcon } from "./dynamic";

const META_CHIPS = [
  { label: "Industry", value: "Sports Analytics" },
  {
    label: "Services",
    value: "AI Development, Computer Vision, Video Analytics",
  },
  { label: "Client", value: "Confidential, USA" },
  { label: "Type", value: "Custom AI Solution" },
];

const DEFAULT_BODY =
  "Transforming sports analytics with real-time video intelligence, automated player tracking and data-driven performance insights.";

// Per-card accent colours (position 0, 1, 2).
const CARD_ACCENTS = [
  { color: "#7c3aed", bg: "#ede9fe" },
  { color: "#2563eb", bg: "#dbeafe" },
  { color: "#059669", bg: "#d1fae5" },
];

// Floating insight cards over the hero image.
// `label` = card title, `value` = subtitle, `unit` = react-icons key (e.g. FiZap).
const DEFAULT_FLOATING = [
  { label: "AI Player Tracking",  value: "Real-time detection and tracking of every player",   unit: "LuBrain"      },
  { label: "Advanced Analysis",   value: "Deep insights with smart metrics",                   unit: "FiLayers"     },
  { label: "Performance Impact",  value: "Optimize team performance with actionable insights", unit: "FiTrendingUp" },
];

export default function HeroSection({ data }) {
  const heading = pick(data?.heading, "Performance Tracking System Using");
  const accent = pick(data?.headingAccent, "Computer Vision");
  const body = pick(data?.body, DEFAULT_BODY);
  const chips = pickList(data?.metaChips, META_CHIPS);
  // CTAs are fixed (not editable from admin) — always point to these routes.
  const cta1 = "Start Your Project";
  const cta1Link = "/post-requirement";
  const cta2 = "Book a Free Consultation";
  const cta2Link = "/contact-us";
  const heroImage = data?.heroImage ? buildAssetUrl(data.heroImage) : "";
  const heroImageAlt = pick(
    data?.heroImageAlt,
    "AI computer-vision player tracking across a live football play"
  );
  const floating = pickList(data?.floatingCards, DEFAULT_FLOATING);

  return (
    <section className="relative w-full overflow-hidden bg-[linear-gradient(180deg,#1c1c34_0%,#16172e_55%,#101126_100%)] font-figtree lg:flex lg:min-h-[100dvh] lg:items-center">
      {/* ambient glows */}
      <div
        className="pointer-events-none absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-[#2b2e6b]/50 blur-[130px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-0 right-[-140px] h-[480px] w-[480px] rounded-full bg-[#3a3f8a]/35 blur-[140px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(119,132,197,0.14),transparent_60%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[92rem] flex-col gap-10 px-5 pt-[clamp(6rem,13vh,8rem)] pb-[clamp(2rem,5vh,3.5rem)] sm:px-8 lg:flex-row lg:items-center lg:gap-[clamp(2rem,3vw,4rem)] lg:px-[clamp(1.5rem,3vw,3rem)]">
        {/* left */}
        <Reveal className="w-full lg:w-[52%] xl:w-[54%]">
          <h1 className="font-figtree font-normal capitalize leading-[1.08] text-white text-[clamp(1.9rem,3.6vw,3.125rem)]">
            {heading}{accent ? " " : ""}
            {accent && <span style={{ color: ACCENT }}>{accent}</span>}
          </h1>

          <RichText
            html={body}
            className="mt-4 max-w-[600px] leading-[1.5] text-white/75 text-[clamp(0.9rem,1.1vw,1.0625rem)]"
          />

          {/* meta chips — full-width stacked rows on mobile (so long, linked
             values read cleanly), inline bordered pills from sm up */}
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            {chips.map((c, i) => (
              <span
                key={c.label || i}
                className="flex w-full items-baseline gap-1 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-2.5 leading-relaxed backdrop-blur-sm sm:inline-flex sm:w-auto sm:rounded-full sm:py-2 sm:leading-none text-[clamp(0.78rem,0.85vw,0.8125rem)]"
              >
                <span className="shrink-0 font-semibold text-white">{c.label} : </span>
                {c.services?.length ? (
                  <span className="min-w-0">
                    {c.services.map((s, k) => (
                      <span key={s.link || k}>
                        {k > 0 ? <span className="text-[#9aa0c4]">, </span> : null}
                        <Link
                          href={s.link || "#"}
                          className="text-[#bcc6ff] underline decoration-[#7784C5] decoration-2 underline-offset-4 transition-colors hover:text-white"
                        >
                          {s.name}
                        </Link>
                      </span>
                    ))}
                  </span>
                ) : c.link ? (
                  <Link
                    href={c.link}
                    className="min-w-0 text-[#bcc6ff] underline decoration-[#7784C5] decoration-2 underline-offset-4 transition-colors hover:text-white"
                  >
                    {c.value}
                  </Link>
                ) : (
                  <span className="min-w-0 text-[#9aa0c4]">{c.value}</span>
                )}
              </span>
            ))}
          </div>

          {/* CTAs — pill */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href={cta1Link}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#5a5e9e_0%,#7c80c8_100%)] px-8 py-3.5 text-[15px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(124,128,200,0.45)] md:text-[16px]"
            >
              {cta1}
              <ChevronRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href={cta2Link}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.03] px-8 py-3.5 text-[15px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10 md:text-[16px]"
            >
              {cta2}
            </Link>
          </div>
        </Reveal>

        {/* right — light tracking card with floating metric cards.
           Hidden below lg: the floating-card overlay only lays out cleanly in
           the side-by-side desktop layout, so on phones/tablets we drop it and
           let the text column use the full width. */}
        <Reveal
          delay={0.15}
          className="hidden w-full justify-center lg:flex lg:w-[48%] lg:justify-end xl:w-[46%]"
        >
          <HeroVisual image={heroImage} alt={heroImageAlt} cards={floating} />
        </Reveal>
      </div>
    </section>
  );
}

/* Single floating insight card — icon (tinted square) + bold title + subtitle. */
function InsightCard({ card, index = 0, className = "" }) {
  const { color, bg } = CARD_ACCENTS[index] || CARD_ACCENTS[0];
  return (
    <div className={`rounded-[12px] border-[0.8px] border-[#889AF5]/60 bg-white p-3 shadow-[0_18px_44px_rgba(8,10,30,0.22)] ${className}`}>
      {card.unit && (
        <div
          className="mb-2 inline-flex items-center justify-center rounded-[8px] p-[7px]"
          style={{ background: bg }}
        >
          {renderIcon(card.unit, { size: 16, style: { color } })}
        </div>
      )}
      <p className="text-[12px] font-semibold leading-snug text-[#101828] md:text-[13px]">
        {card.label}
      </p>
      <p className="mt-1 text-[10px] leading-snug text-[#6A7282] md:text-[11px]">
        {card.value}
      </p>
    </div>
  );
}

/* Hero right-side visual — main image card with three floating insight cards. */
function HeroVisual({ image, alt, cards = DEFAULT_FLOATING }) {
  const c0 = cards[0] || DEFAULT_FLOATING[0];
  const c1 = cards[1] || DEFAULT_FLOATING[1];
  const c2 = cards[2] || DEFAULT_FLOATING[2];
  return (
    <div className="relative mx-auto w-full max-w-[400px] px-7 sm:max-w-[440px] sm:px-9 lg:w-[clamp(320px,38vw,470px)] lg:max-w-none lg:px-0">
      <div className="relative overflow-hidden rounded-[24px] bg-white p-2 shadow-[0_30px_80px_rgba(8,10,30,0.45)] md:p-2.5">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={alt}
            className="block h-auto w-full rounded-[18px]"
          />
        ) : (
          <Image
            src="/caseStudy/hero.png"
            alt={alt}
            width={1308}
            height={1202}
            priority
            sizes="(max-width: 640px) 86vw, (max-width: 1024px) 440px, 460px"
            className="block h-auto w-full rounded-[18px]"
          />
        )}
      </div>

      {/* floating card 0 — top-right */}
      <InsightCard card={c0} index={0} className="absolute -top-10 right-[8%] w-[158px] sm:-top-12 sm:right-[10%] md:w-[178px]" />

      {/* floating card 1 — left */}
      <InsightCard card={c1} index={1} className="absolute left-5 top-16 w-[152px] sm:left-7 sm:top-20 md:w-[168px]" />

      {/* floating card 2 — right-mid */}
      <InsightCard card={c2} index={2} className="absolute -right-2 top-[54%] w-[152px] sm:-right-14 md:w-[168px]" />
    </div>
  );
}

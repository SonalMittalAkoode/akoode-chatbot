"use client";

import Image from "next/image";
import Link from "next/link";
import HeroBreadcrumb from "@/components/HeroBreadcrumb";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const HERO_IMAGE = "/country/mobile_app_development.png";
const heroImageAlt = (label) =>
  label
    ? `${label} — Akoode mobile app development shown on a phone`
    : "Akoode mobile app development shown on a phone";

const DEFAULT_STATS = [
  { value: "4.9", label: "Google Rating" },
  { value: "97%", label: "Client Retention" },
  { value: "15+", label: "Industries Served" },
  { value: "Global", label: "Delivery" },
];

const STAGE_W = 1048;
const STAGE_H = 653;
const pctX = (px) => `${(px / STAGE_W) * 100}%`;
const pctY = (px) => `${(px / STAGE_H) * 100}%`;

const CARD_W = 192.85;
const CARD_H = 99.654;

const CARD_SLOTS = [
  { left: 103, top: 108 },
  { left: 26, top: 266 },
  { left: 746, top: 151 },
  { left: 855, top: 314 },
];

const OVERDRAW = 5.3333;

const CONNECTORS = [
  { src: "/mobile-app/mad-conn-tl.svg", left: 249, top: 61, w: 163, h: 62 },
  { src: "/mobile-app/mad-conn-tr.svg", left: 643, top: 108, w: 126, h: 57 },
  { src: "/mobile-app/mad-conn-bl.svg", left: 122, top: 352, w: 281, h: 106 },
  { src: "/mobile-app/mad-conn-br.svg", left: 652, top: 400, w: 249, h: 104 },
];

const GLOW_SVG =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 1901 1113' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.3839e-14 -138.21 311.86 4.8894e-13 950.5 1382.1)'><stop stop-color='rgba(255,255,255,1)' offset='0'/><stop stop-color='rgba(217,222,248,1)' offset='0.078125'/><stop stop-color='rgba(179,188,242,1)' offset='0.15625'/><stop stop-color='rgba(140,155,235,1)' offset='0.23437'/><stop stop-color='rgba(102,121,228,1)' offset='0.3125'/><stop stop-color='rgba(81,94,182,0.75)' offset='0.36846'/><stop stop-color='rgba(61,68,135,0.5)' offset='0.42443'/><stop stop-color='rgba(19,14,42,0)' offset='0.53636'/><stop stop-color='rgba(19,14,42,0)' offset='1'/></radialGradient></defs></svg>\")";

function splitHeading(raw = "") {
  const text = String(raw).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return { lead: "", tail: "" };
  const idx = text.lastIndexOf(" ");
  if (idx === -1) return { lead: "", tail: text };
  return { lead: text.slice(0, idx), tail: text.slice(idx + 1) };
}

function toParagraphs(body = "") {
  const raw = String(body || "").trim();
  if (!raw) return [];
  if (/<p[\s>]/i.test(raw)) {
    return raw.split(/<\/p>/i).map((s) => s.replace(/<p[^>]*>/i, "").trim()).filter(Boolean);
  }
  return raw.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
}

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function StatCard({ value, label, className = "", style }) {
  return (
    <div
      className={`flex items-center gap-[14px] rounded-[18px] px-[22px] py-[18px] ${className}`}
      style={{
        background: "#0c0f24",
        border: "0.8px solid rgba(102,121,228,0.22)",
        ...style,
      }}
    >
      <span
        aria-hidden
        className="shrink-0 rounded-[2px]"
        style={{ width: 3, height: 44, background: "linear-gradient(180deg, #6679e4 0%, #576099 100%)" }}
      />
      <div className="flex flex-col items-start">
        <p
          className="font-figtree whitespace-nowrap"
          style={{ color: "#fff", fontSize: 24, fontWeight: 700, lineHeight: "28.8px" }}
        >
          {value}
        </p>
        <p
          className="font-figtree whitespace-nowrap pt-[3px]"
          style={{ fontSize: 13, fontWeight: 500, lineHeight: "15.6px", color: "#8b90b8" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

export default function MadLocationHero({ data, title, country, parentPage }) {
  const crumbLabel = title || country;

  const { lead, tail } = splitHeading(data?.heading || "Mobile App Development Company");
  const paragraphs = toParagraphs(data?.body);

  const cta1Text = data?.cta1Text || "Start your Project";
  const cta1Link = data?.cta1Link || "/post-requirement";
  const cta2Text = data?.cta2Text || "View our work";
  const cta2Link = data?.cta2Link || "/case-studies";

  const rawStats = Array.isArray(data?.stats) ? data.stats.filter((s) => s?.value) : [];
  const stats = (rawStats.length ? rawStats : DEFAULT_STATS).slice(0, 4);


  return (
    <section
      className="relative z-10 w-full overflow-hidden lg:flex lg:min-h-screen lg:flex-col lg:justify-center"
      style={{ background: "linear-gradient(180deg, #1f2336 0%, #130f25 100%)" }}
    >
      {/* z-10 above: `.sbc-thread` (the page-wide reading-progress line every
          SBC page carries) is `position:absolute; z-index:1` off `.sbc-page`,
          centred at 50% of the whole page — without this the hero's own open
          background lets that line show through as a stray vertical stroke.
          The opaque hero background then fully occludes it for this section;
          the thread is untouched everywhere else on the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 w-full"
        style={{ height: "91.76%", backgroundImage: GLOW_SVG, backgroundSize: "100% 100%" }}
      />

      <div className="relative z-10 mx-auto flex w-[92%] max-w-[1048px] flex-col items-center">
        <div className="flex flex-col items-center pt-[88px] text-center lg:pt-[104px]">
          <HeroBreadcrumb
            items={[
              { label: "Home", href: "/" },
              ...(parentPage ? [{ label: parentPage.label, href: parentPage.href }] : []),
              { label: crumbLabel },
            ]}
          />

          <div className="flex w-full flex-col items-center gap-[18px]">
            <h1
              className="font-figtree max-w-[845px] capitalize"
              style={{
                color: "#fff",
                fontSize: "clamp(28px, 3.2vw, 42px)",
                fontWeight: 400,
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
              }}
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(8.2396deg, rgb(119,132,197) 33.662%, rgb(183,190,237) 48.02%, rgb(96,119,236) 58.532%, rgb(118,131,197) 85.197%)",
                }}
              >
                {lead}
              </span>{" "}
              <span className="text-white">{tail}</span>
            </h1>

            {paragraphs.map((p, i) => (
              <div
                key={i}
                className="font-figtree w-full max-w-[720px] [&_p]:m-0 [&_p]:!text-inherit"
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "clamp(15px, 1.4vw, 16px)",
                  lineHeight: "26px",
                }}
                dangerouslySetInnerHTML={{ __html: processHtmlLinks(p) }}
              />
            ))}
          </div>

          <div className="mt-[28px] flex flex-wrap items-center justify-center gap-4">
            <Link
              href={cta1Link}
              className="font-figtree flex h-[54px] items-center justify-center gap-2 rounded-[30px] px-8 transition-transform duration-300 hover:-translate-y-0.5"
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: 500,
                lineHeight: "24px",
                background: "linear-gradient(90deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)",
                border: "1.5px solid #889AF5",
                boxShadow: "0px 8px 24px rgba(0,0,0,0.25)",
              }}
            >
              {cta1Text}
              <ChevronRight />
            </Link>

            {cta2Text && (
              <Link
                href={cta2Link}
                className="font-figtree flex h-[54px] items-center justify-center rounded-[30px] px-8 transition-colors duration-300 hover:bg-white/10"
                style={{ color: "#fff", fontSize: 16, fontWeight: 500, lineHeight: "24px", border: "1.5px solid rgba(255,255,255,0.15)" }}
              >
                {cta2Text}
              </Link>
            )}
          </div>
        </div>

        <div className="relative mt-10 w-full lg:mt-[39px] lg:aspect-[1048/653]">
          <div className="hidden lg:block">
            {stats.map((s, i) => {
              const slot = CARD_SLOTS[i];
              if (!slot) return null;
              return (
                <StatCard
                  key={`${s.label}-${i}`}
                  value={s.value}
                  label={s.label}
                  className="absolute z-10"
                  style={{
                    left: pctX(slot.left),
                    top: pctY(slot.top),
                    width: "max-content",
                    minWidth: pctX(CARD_W),
                    height: pctY(CARD_H),
                  }}
                />
              );
            })}
          </div>

          <Image
            src={HERO_IMAGE}
            alt={heroImageAlt(crumbLabel)}
            width={488}
            height={653}
            sizes="(max-width: 1024px) 80vw, 488px"
            priority
            className="z-20 mx-auto block h-auto w-[80%] max-w-[420px] object-contain lg:absolute lg:left-[24.0458%] lg:top-0 lg:mx-0 lg:w-[46.5649%] lg:max-w-none"
          />

          <div className="hidden lg:block">
            {CONNECTORS.map((c) => (
              <img
                key={c.src}
                src={c.src}
                alt=""
                aria-hidden
                className="pointer-events-none absolute z-30 block max-w-none"
                style={{
                  left: pctX(c.left - OVERDRAW / 2),
                  top: pctY(c.top - OVERDRAW / 2),
                  width: pctX(c.w + OVERDRAW),
                  height: pctY(c.h + OVERDRAW),
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 grid w-full grid-cols-2 gap-3 pb-12 sm:gap-4 lg:hidden">
          {stats.map((s, i) => (
            <StatCard key={`${s.label}-m-${i}`} value={s.value} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

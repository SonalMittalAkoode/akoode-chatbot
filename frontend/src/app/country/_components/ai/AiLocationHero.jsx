"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, Building2, Globe, Star, UserCheck } from "lucide-react";
import HeroBreadcrumb from "@/components/HeroBreadcrumb";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const STAGE_W = 1901;
const at = (px) => `${((px / STAGE_W) * 100).toFixed(4)}vw`;
const fluid = (min, px) => `clamp(${min}px, ${at(px)}, ${px}px)`;
const H1_SIZE = "clamp(28px, 3.2vw, 42px)";
const BODY_SIZE = "clamp(15px, 1.4vw, 16px)";

const HERO_IMAGE = "/ai-dev/ai-orb.png";
const heroImageAlt = (label) =>
  label
    ? `${label} — Akoode AI development neural network visual`
    : "Akoode AI development neural network visual";

const BACKDROP =
  "radial-gradient(130% 107.13% at 50% 10%, rgba(29,31,75,0) 37.41%, rgba(66,76,152,0.5) 53.34%, rgba(84,99,190,0.75) 61.305%, rgba(102,121,228,1) 69.27%, rgba(140,155,235,1) 76.953%, rgba(179,188,242,1) 84.635%, rgba(217,222,248,1) 92.318%, rgba(255,255,255,1) 100%)";

const BASE = "linear-gradient(180deg, #1E2235 0%, #181A30 46%, #16172C 100%)";

const HEADING_GRADIENT =
  "linear-gradient(4.6636deg, rgb(119,132,197) 33.662%, rgb(183,190,237) 48.02%, rgb(96,119,236) 58.532%, rgb(118,131,197) 85.197%)";

const CTA_GRADIENT = "linear-gradient(90deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)";

const DEFAULT_BADGES = [
  { Icon: Star,      title: "4.9",    sub: "Google Rating",     gap: 36, ring: "#7186FA", ink: "#7186FA" },
  { Icon: UserCheck, title: "97%",    sub: "Client Retention",  gap: 36, ring: "#7186FA", ink: "#7186FA" },
  { Icon: Building2, title: "15+",    sub: "Industries Served", gap: 30, ring: "#7186FA", ink: "#7186FA" },
  { Icon: Globe,     title: "Global", sub: "OutSourcing",       gap: 36, ring: "#7998FF", ink: "#7186FA" },
  { Icon: Award,     title: "5.0",    sub: "Clutch Rating",     gap: 29, ring: "#7998FF", ink: "#6679E4" },
];

const strip = (s) => String(s).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

function splitHeading(raw = "") {
  const h = String(raw || "").trim();
  if (!h) return { lead: "", tail: "" };

  const open = h.indexOf("<span");
  const close = h.indexOf("</span>");
  if (open !== -1 && close > open) {
    const gt = h.indexOf(">", open);
    const lead = h.slice(gt + 1, close);
    const tail = `${h.slice(0, open)} ${h.slice(close + 7)}`;
    return { lead: strip(lead), tail: strip(tail) };
  }

  const nl = h.indexOf("\n");
  if (nl !== -1) return { lead: strip(h.slice(0, nl)), tail: strip(h.slice(nl + 1)) };

  const words = strip(h).split(" ").filter(Boolean);
  if (words.length < 2) return { lead: words.join(" "), tail: "" };
  const cut = Math.min(Math.max(Math.round(words.length * 0.45), 1), words.length - 1);
  return { lead: words.slice(0, cut).join(" "), tail: words.slice(cut).join(" ") };
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
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0">
    <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function BadgeIcon({ Icon, ring, ink }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center"
      style={{
        width: fluid(48, 60),
        height: fluid(48, 60),
        borderRadius: fluid(11, 14),
        background: "#1D1F4B",
        outline: `0.8px solid ${ring}`,
        outlineOffset: "-0.8px",
      }}
    >
      <Icon
        size={30}
        strokeWidth={1.6}
        style={{ color: ink, width: fluid(24, 30), height: fluid(24, 30) }}
        aria-hidden
      />
    </span>
  );
}

export default function AiLocationHero({ data, title, country, parentPage }) {
  const crumbLabel = title || country;

  const { lead, tail } = splitHeading(data?.heading || "Artificial Intelligence Development Company");
  const paragraphs = toParagraphs(data?.body);

  const cta1Text = data?.cta1Text || "Get free consultation";
  const cta1Link = data?.cta1Link || "/post-requirement";
  const cta2Text = data?.cta2Text || "View Our Ai Work";
  const cta2Link = data?.cta2Link || "/case-studies";
  const authored = Array.isArray(data?.stats) ? data.stats : [];
  const items = DEFAULT_BADGES.map((fallback, i) => {
    const s = authored[i];
    const title = String(s?.value ?? "").trim();
    if (!title) return fallback;
    return {
      ...fallback,
      title,
      sub: s.label || s.sub || "",
      boldPrefix:
        fallback.boldPrefix && title.startsWith(fallback.boldPrefix)
          ? fallback.boldPrefix
          : "",
    };
  });

  return (
    <section
      className="relative z-10 w-full overflow-hidden lg:flex lg:min-h-screen lg:flex-col lg:justify-center"
      style={{ background: BASE }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: BACKDROP }}
      />

      <div
        className="relative z-10 mx-auto flex w-[92%] flex-col items-center pt-[104px] text-center lg:w-[min(86.9542vw,1653px)] lg:pt-[110px]"
        style={{ paddingBottom: fluid(48, 80) }}
      >
        <HeroBreadcrumb align="center" items={[
          { label: "Home", href: "/" },
          ...(parentPage ? [{ label: parentPage.label, href: parentPage.href }] : []),
          { label: crumbLabel },
        ]} />

        <div
          className="relative w-[72vw] max-w-[482px] lg:w-[min(25.3551vw,482px)]"
          style={{ aspectRatio: "482 / 435" }}
        >
          <span className="ai-orb-band ai-orb-band--core">
            <span className="ai-orb-spin">
              <Image
                src={HERO_IMAGE}
                alt={heroImageAlt(crumbLabel)}
                width={482}
                height={435}
                sizes="(max-width: 1024px) 72vw, 25.36vw"
                priority
                className="ai-orb-core"
              />
            </span>
          </span>
          <span className="ai-orb-band ai-orb-band--shell" aria-hidden>
            <span className="ai-orb-spin">
              <Image
                src={HERO_IMAGE}
                alt=""
                width={482}
                height={435}
                sizes="(max-width: 1024px) 72vw, 25.36vw"
                className="ai-orb-shell"
              />
            </span>
          </span>
        </div>

        <div
          className="flex w-full flex-col items-center lg:max-w-[81.6697%]"
          style={{ marginTop: fluid(18, 26), gap: fluid(28, 45) }}
        >
          <div className="flex w-full flex-col items-center" style={{ gap: fluid(12, 18) }}>
            <h1
              className="font-figtree w-full"
              style={{ fontSize: H1_SIZE, fontWeight: 400, lineHeight: 1.12, letterSpacing: "-0.02em" }}
            >
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADING_GRADIENT }}>
                {lead}
              </span>{" "}
              <span className="text-white">{tail}</span>
            </h1>

            {paragraphs.map((p, i) => (
              <div
                key={i}
                className="font-figtree w-full [&_p]:m-0 [&_p]:!text-inherit"
                style={{ color: "#fff", fontSize: BODY_SIZE, lineHeight: "26px" }}
                dangerouslySetInnerHTML={{ __html: processHtmlLinks(p) }}
              />
            ))}
          </div>

          {/* Two equal 370.5×72 pills inside a 761-wide row (Figma 1166:2295). */}
          <div
            className="flex w-full flex-col items-stretch sm:max-w-[560px] sm:flex-row sm:items-center lg:max-w-[46.0375%]"
            style={{ gap: fluid(14, 20) }}
          >
            <Link
              href={cta1Link}
              className="font-figtree flex items-center justify-center gap-[5px] transition-transform duration-300 hover:-translate-y-0.5 sm:flex-1"
              style={{
                height: fluid(56, 72),
                borderRadius: fluid(30, 40),
                fontSize: fluid(16, 18),
                fontWeight: 500,
                lineHeight: "24px",
                color: "#fff",
                background: CTA_GRADIENT,
                border: "1.5px solid #889AF5",
                filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.3))",
              }}
            >
              {cta1Text}
              <ChevronRight />
            </Link>

            {cta2Text && (
              <Link
                href={cta2Link}
                className="font-figtree flex items-center justify-center transition-colors duration-300 hover:bg-white/10 sm:flex-1"
                style={{
                  height: fluid(56, 72),
                  borderRadius: fluid(30, 40),
                  fontSize: fluid(16, 18),
                  fontWeight: 500,
                  lineHeight: "24px",
                  color: "#fff",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                }}
              >
                {cta2Text}
              </Link>
            )}
          </div>
        </div>

        <div
          className="grid w-full grid-cols-1 text-left min-[420px]:grid-cols-2 lg:flex lg:flex-nowrap lg:items-center lg:justify-center lg:max-w-[81.6697%]"
          style={{
            marginTop: fluid(18, 26),
            background: "rgba(29,32,51,0.6)",
            border: "1px solid rgba(29,32,51,0.3)",
            borderRadius: fluid(24, 40),
            paddingLeft: fluid(18, 40),
            paddingRight: fluid(18, 40),
            paddingTop: fluid(14, 20),
            paddingBottom: fluid(14, 20),
            columnGap: fluid(20, 48),
            rowGap: fluid(16, 28),
          }}
        >
          {items.map((b, i) => (
            <div
              key={`${b.title}-${i}`}
              className="flex items-center justify-start lg:min-w-0 lg:flex-auto lg:justify-center"
              style={{ gap: fluid(12, b.gap), paddingTop: fluid(14, 30), paddingBottom: fluid(14, 30) }}
            >
              <BadgeIcon Icon={b.Icon} ring={b.ring} ink={b.ink} />
              <div className="min-w-0">
                <p
                  className="font-figtree"
                  style={{ fontSize: fluid(16, 18), fontWeight: 500, lineHeight: 1.35, color: "#fff" }}
                >
                  {b.boldPrefix ? (
                    <>
                      <span style={{ fontWeight: 700 }}>{b.boldPrefix}</span>
                      {b.title.slice(b.boldPrefix.length)}
                    </>
                  ) : (
                    b.title
                  )}
                </p>
                {b.sub && (
                  <p
                    className="font-figtree"
                    style={{ fontSize: fluid(13, 15), fontWeight: 400, lineHeight: 1.35, color: "#8A90AD" }}
                  >
                    {b.sub}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

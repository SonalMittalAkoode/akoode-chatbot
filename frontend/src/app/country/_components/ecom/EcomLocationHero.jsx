"use client";

import Image from "next/image";
import Link from "next/link";
import HeroBreadcrumb from "@/components/HeroBreadcrumb";
import { processHtmlLinks } from "@/utils/processHtmlLinks";
const HERO_IMAGE = "/country/ecommerce.png";
const GLOW_IMAGE = "/country/ecommerce-glow.svg";

const heroImageAlt = (label) =>
  label
    ? `${label} — Akoode e-commerce storefront shown on a laptop`
    : "Akoode e-commerce storefront shown on a laptop";

const HEADING_GRADIENT =
  "linear-gradient(22.517deg, rgb(119,132,197) 33.662%, rgb(183,190,237) 48.02%, rgb(96,119,236) 58.532%, rgb(118,131,197) 85.197%)";

const CTA_GRADIENT = "linear-gradient(90deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)";

const DEFAULT_STATS = [
  { value: "4.9", label: "Google Rating" },
  { value: "97%", label: "Client Retention" },
  { value: "15+", label: "Industries Served" },
  { value: "Global", label: "Delivery" },
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
  <svg
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden
    className="size-[18px] shrink-0 xl:size-[min(20px,1.0521vw)]"
  >
    <path
      d="M7.5 15L12.5 10L7.5 5"
      stroke="white"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function EcomLocationHero({ data, title, country, parentPage }) {
  const crumbLabel = title || country;

  const { lead, tail } = splitHeading(
    data?.heading ||
      "<span>High Performance E-commerce solutions</span> That scale your Business"
  );
  const paragraphs = toParagraphs(
    data?.body ||
      "We build powerful, secure, and conversion-focused ecommerce platforms that deliver exceptional shopping experiences and measurable business growth."
  );

  const cta1Text = data?.cta1Text || "Talk to an Expert";
  const cta1Link = data?.cta1Link || "/post-requirement";
  const cta2Text = data?.cta2Text || "View our work";
  const cta2Link = data?.cta2Link || "/case-studies";

  const rawStats = Array.isArray(data?.stats) ? data.stats.filter((s) => s?.value) : [];
  const stats = (rawStats.length ? rawStats : DEFAULT_STATS).slice(0, 4);

  const crumbs = [
    { label: "Home", href: "/" },
    ...(parentPage ? [{ label: parentPage.label, href: parentPage.href }] : []),
    { label: crumbLabel },
  ];

  const ctaBase =
    "font-figtree flex w-full items-center justify-center rounded-full sm:w-auto sm:flex-1 " +
    "text-[clamp(15px,3.6vw,17px)] xl:text-[min(18px,0.9469vw)] " +
    "h-[56px] xl:h-[min(72px,3.7875vw)]";

  return (
    <section
      className="relative z-10 w-full overflow-hidden xl:flex xl:min-h-screen xl:flex-col xl:justify-center"
      style={{ background: "#130e2a" }}
    >
      <div className="relative mx-auto xl:aspect-[1901/896] xl:w-[min(100vw,1901px)]">
        <img
          src={GLOW_IMAGE}
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-[-40%] top-[28%] z-0 block h-[95%] w-[180%] max-w-none xl:left-[21.0910%] xl:top-[-10.7199%] xl:h-[157.1283%] xl:w-[126.9953%]"
          style={{ mixBlendMode: "plus-lighter" }}
        />
        <div className="relative z-20 mx-auto flex w-[92%] max-w-[720px] flex-col gap-4 pt-[88px] xl:absolute xl:left-[6.3125%] xl:top-[27.3438%] xl:mx-0 xl:w-[48.1326%] xl:max-w-none xl:gap-[min(18px,0.9469vw)] xl:pt-0">
          <div className="xl:absolute xl:bottom-[calc(100%_+_min(18px,0.9469vw))] xl:left-0">
            <HeroBreadcrumb items={crumbs} />
          </div>
          <h1
            className="font-figtree max-w-[845px]"
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
              style={{ backgroundImage: HEADING_GRADIENT }}
            >
              {lead}
            </span>{" "}
            <span style={{ color: "#fff" }}>{tail}</span>
          </h1>

          <div className="flex w-full max-w-[720px] flex-col gap-3">
            {paragraphs.map((p, i) => (
              <div
                key={i}
                className="font-figtree [&_p]:m-0 [&_p]:!text-inherit"
                style={{ color: "rgba(255,255,255,0.85)", fontSize: "clamp(15px, 1.4vw, 16px)", lineHeight: "26px" }}
                dangerouslySetInnerHTML={{ __html: processHtmlLinks(p) }}
              />
            ))}
          </div>

          <div className="mt-3 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center xl:mt-0 xl:h-[min(74px,3.8927vw)] xl:w-[87.8689%] xl:gap-[min(20px,1.0521vw)]">
            <Link
              href={cta1Link}
              className={`${ctaBase} gap-[6px] transition-transform duration-300 hover:-translate-y-0.5 xl:gap-[min(5px,0.2630vw)]`}
              style={{
                color: "#fff",
                fontWeight: 500,
                lineHeight: 1.3333,
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
                className={`${ctaBase} transition-colors duration-300 hover:bg-white/10`}
                style={{
                  color: "#fff",
                  fontWeight: 500,
                  lineHeight: 1.3333,
                  border: "1.5px solid rgba(255,255,255,0.2)",
                }}
              >
                {cta2Text}
              </Link>
            )}
          </div>
        </div>
        <div className="mx-auto mt-8 grid w-[92%] max-w-[720px] grid-cols-2 gap-x-6 gap-y-6 sm:hidden">
          {stats.map((s, i) => (
            <div key={`${s.label}-m-${i}`} className="flex flex-col gap-3">
              <p className="font-figtree whitespace-nowrap" style={{ color: "#fff", fontWeight: 700, fontSize: 30, lineHeight: "36px" }}>
                {s.value}
              </p>
              <p className="font-figtree whitespace-nowrap" style={{ color: "#fff", fontWeight: 500, fontSize: 14, lineHeight: "20px" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-8 hidden w-[92%] max-w-[720px] sm:grid sm:grid-cols-4 xl:absolute xl:left-[6.3125%] xl:top-[77.2321%] xl:mx-0 xl:mt-0 xl:w-[51.6570%] xl:max-w-none">
          {stats.map((s, i) => (
            <div
              key={`${s.label}-${i}`}
              className="flex flex-col gap-3 xl:h-[104px] xl:justify-center"
              style={{
                borderRight: i < stats.length - 1 ? "1px solid #889AF5" : "none",
                paddingLeft: i === 0 ? 0 : 25,
                paddingRight: i === stats.length - 1 ? 0 : 42,
              }}
            >
              <p className="font-figtree whitespace-nowrap" style={{ color: "#fff", fontWeight: 700, fontSize: 30, lineHeight: "36px" }}>
                {s.value}
              </p>
              <p className="font-figtree whitespace-nowrap" style={{ color: "#fff", fontWeight: 500, fontSize: 14, lineHeight: "20px" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <Image
          src={HERO_IMAGE}
          alt={heroImageAlt(crumbLabel)}
          width={1136}
          height={820}
          sizes="(max-width: 1279px) 100vw, 60vw"
          priority
          className="relative z-10 mt-8 block h-auto w-full max-w-none xl:absolute xl:left-[44.2420%] xl:top-[8.2589%] xl:mt-0 xl:h-[91.5179%] xl:w-[59.7580%] xl:object-contain xl:object-center"
        />
      </div>
    </section>
  );
}

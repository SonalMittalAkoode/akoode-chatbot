"use client";

import Image from "next/image";
import useIsDesktop from "@/hooks/useIsDesktop";

const ACCENT_GRADIENT =
  "linear-gradient(19.426deg, #7784C5 33.662%, #B7BEED 48.02%, #6077EC 58.532%, #7683C5 85.197%)";

const CARDS = [
  {
    n: "01",
    heading: "Is AI now the starting point for digital transformation, or still an add-on?",
    body: 'For most businesses starting a transformation initiative in 2026, AI integration is designed in from the beginning rather than bolted on once the "real" transformation is finished. The businesses treating AI as a separate, later phase are increasingly the ones rebuilding parts of their architecture a second time to accommodate it properly.',
    pos: "lg:left-[2.788%] lg:top-[59.812%] lg:w-[29.406%] lg:h-[34.694%]",
  },
  {
    n: "02",
    heading: "Why has process redesign overtaken pure digitization as the priority?",
    body: 'Digitizing a broken process just makes the broken process faster, and enough businesses learned that lesson the expensive way that process redesign now comes before automation in most serious transformation scopes, not after. The conversation has shifted from "how do we automate this" to "should this process even exist in its current form."',
    pos: "lg:left-[4.471%] lg:top-[22.292%] lg:w-[29.406%] lg:h-[34.694%]",
  },
  {
    n: "03",
    heading: "How is change management changing as transformation projects get faster?",
    body: "Faster implementation timelines have made change management the actual bottleneck in more transformation projects than the technology itself. A system that ships in six weeks but takes six months for the organization to actually adopt hasn't saved anyone time, and businesses are increasingly budgeting for adoption as seriously as they budget for development.",
    pos: "lg:left-[36.612%] lg:top-[8.870%] lg:w-[28.511%] lg:h-[37.127%]",
  },
  {
    n: "04",
    heading: "Why has process redesign overtaken pure digitization as the priority?",
    body: "Big-bang legacy rebuilds carry a failure risk most businesses have grown unwilling to accept, especially once a few high-profile failed rebuilds became industry cautionary tales. Phased modernization, replacing and validating one component at a time, has become the default approach precisely because it keeps the business running throughout instead of betting everything on a single cutover date.",
    pos: "lg:left-[66.965%] lg:top-[14.521%] lg:w-[30.405%] lg:h-[36.107%]",
  },
  {
    n: "05",
    heading: "How is data governance shaping AI adoption in transformation projects?",
    body: "As more transformation initiatives lean on AI-driven decision systems, the businesses getting real value are the ones that treated data quality and governance as foundational work, not cleanup done after the fact. The gap between businesses with genuinely trustworthy data and those without it has become one of the clearest predictors of whether an AI initiative actually delivers.",
    pos: "lg:left-[68.385%] lg:top-[52.433%] lg:w-[29.406%] lg:h-[39.168%]",
  },
];

const CONNECTORS = [
  { src: "trend-c1.svg", pos: "left-[31.668%] top-[56.123%] w-[7.522%] h-[6.201%]", flip: "-scale-y-100" },
  { src: "trend-c2.svg", pos: "left-[59.968%] top-[46.075%] w-[7.680%] h-[7.692%]", flip: "" },
  { src: "trend-c3.svg", pos: "left-[59.968%] top-[76.217%] w-[9.311%] h-[12.402%]", flip: "-scale-y-100 rotate-180" },
  { src: "trend-c4.svg", pos: "left-[40.610%] top-[45.133%] w-[3.367%] h-[6.515%]", flip: "-scale-y-100 rotate-180" },
  { src: "trend-c5.svg", pos: "left-[30.773%] top-[73.469%] w-[7.522%] h-[18.760%]", flip: "" },
];

function Heading({ canvas, heading, headingAccent, intro }) {
  const inner = (
    <>
      <h2 className="font-figtree font-semibold capitalize leading-[1.02] text-[24px] sm:text-[28px]">
        <span className="text-[#1D1F4B]">{heading} </span>
        <span className="bg-clip-text text-transparent" style={{ backgroundImage: ACCENT_GRADIENT }}>
          {headingAccent}
        </span>
      </h2>
      <p
        className={`font-figtree font-normal leading-[1.3] text-[#1D1F4B] text-[14px] sm:text-[15px] lg:text-[16px] ${
          canvas ? "mt-2 w-[87.67%]" : "mt-3"
        }`}
      >
        {intro}
      </p>
    </>
  );

  if (!canvas) return inner;
  return <div className="absolute left-[4.261%] top-[5.494%] w-[34.98%]">{inner}</div>;
}

function Card({ card, canvas }) {
  return (
    <div
      className={
        canvas
          ? `absolute flex items-start rounded-[3.735vw] bg-[#F4F5FE] p-[1.683vw] ${card.pos}`
          : "flex items-start rounded-[28px] bg-[#F4F5FE] p-6"
      }
    >
      <div className={canvas ? "flex w-full flex-col gap-[1.315vw]" : "flex w-full flex-col gap-4"}>
        <div className="flex items-start gap-[4.37%]">
          <span
            className={
              canvas
                ? "flex shrink-0 items-center justify-center rounded-full bg-[#1D1F4B] font-figtree font-semibold tracking-[0.0136em] text-white h-[3.682vw] w-[11.8%] text-[1.2625vw]"
                : "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1D1F4B] font-figtree text-[16px] font-semibold text-white"
            }
          >
            {card.n}
          </span>
          <h3
            className={
              canvas
                ? "w-[88.69%] shrink-0 font-figtree font-extrabold leading-[1.0833] text-[#130E2A] text-[1.2625vw]"
                : "font-figtree text-[16px] sm:text-[18px] font-extrabold leading-[1.25] text-[#130E2A]"
            }
          >
            {card.heading}
          </h3>
        </div>

        <p
          className={
            canvas
              ? "font-figtree font-normal leading-[1.527] text-[#1D1F4B] text-[1.1573vw]"
              : "font-figtree text-[14px] sm:text-[15px] lg:text-[16px] font-normal leading-[1.6] text-[#1D1F4B]"
          }
        >
          {card.body}
        </p>
      </div>
    </div>
  );
}

function OrbLabel({ canvas, eyebrow, title, titleAccent }) {
  return (
    <div
      className={
        canvas
          ? "absolute left-[43.418%] top-[61.481%] flex w-[13.213%] flex-col items-center gap-[0.21vw]"
          : "flex flex-col items-center gap-1"
      }
    >
      <p
        className={
          canvas
            ? "font-figtree font-bold uppercase tracking-[0.1176em] text-white text-[0.894vw]"
            : "font-figtree text-[13px] font-bold uppercase tracking-[0.1176em] text-white"
        }
      >
        {eyebrow}
      </p>
      <span
        className={
          canvas
            ? "block h-[0.21vw] w-[2.262vw] rounded-full bg-[#7186FA]"
            : "block h-[3px] w-[32px] rounded-full bg-[#7186FA]"
        }
      />
      <p
        className={
          canvas
            ? "whitespace-nowrap text-center font-figtree font-bold leading-[1.125] text-white text-[2.104vw]"
            : "text-center font-figtree text-[26px] font-bold leading-[1.2] text-white"
        }
      >
        <span className="whitespace-pre-line">{title}</span>
        <br />
        <span className="text-[#7186FA]">{titleAccent}</span>
      </p>
    </div>
  );
}

const seq = (n, i) => n || String(i + 1).padStart(2, "0");

export default function DtTrends({ data } = {}) {
  const isDesktop = useIsDesktop();
  const heading = data?.heading || "Where Digital Transformation Stands";
  const headingAccent = data?.headingAccent || "in 2026";
  const intro =
    data?.intro ||
    "None of this is a forecast. These are the conditions already shaping transformation budgets and priorities this year.";
  const orbEyebrow = data?.orbEyebrow || "Five Trends";
  const orbTitle = data?.orbTitle || "Shaping\nTransformation";
  const orbTitleAccent = data?.orbTitleAccent || "in 2026";
  const cards = CARDS.map((coded, i) => ({ ...coded, ...(data?.items?.[i] || {}) }));

  return (
    <section className="relative w-full overflow-hidden bg-white">

      {isDesktop ? (
      <div className="relative mx-auto w-full max-w-[1901px] aspect-[1901/1274]">
        <div className="absolute left-[33.193%] top-[46.782%] h-[42.148%] w-[33.655%]">
          <Image
            src="/digital-transformation/trends-orb.webp"
            alt=""
            fill
            sizes="(max-width: 1023px) 0px, 34vw"
            className="object-contain"
          />
        </div>

        <Heading canvas heading={heading} headingAccent={headingAccent} intro={intro} />
        <OrbLabel canvas eyebrow={orbEyebrow} title={orbTitle} titleAccent={orbTitleAccent} />
        {cards.map((card, i) => (
          <Card key={i} card={{ ...card, n: seq(card.n, i) }} canvas />
        ))}

        {CONNECTORS.map((c) => (
          <div key={c.src} aria-hidden className={`pointer-events-none absolute z-10 ${c.pos}`}>
            <div className={`relative h-full w-full ${c.flip}`}>
              <Image
                src={`/digital-transformation/${c.src}`}
                alt=""
                fill
                sizes="180px"
                className="object-fill"
              />
            </div>
          </div>
        ))}
      </div>

      ) : (
      // ── Stack, below lg ──
      <div className="mx-auto w-full max-w-[1901px] px-5 pb-8 pt-10 sm:px-8">
        <Heading heading={heading} headingAccent={headingAccent} intro={intro} />

        <div className="relative mx-auto mb-10 mt-10 w-full max-w-[420px]">
          <div className="relative aspect-[1369/1149] w-full">
            <Image
              src="/digital-transformation/trends-orb.webp"
              alt=""
              fill
              sizes="420px"
              className="object-contain"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <OrbLabel eyebrow={orbEyebrow} title={orbTitle} titleAccent={orbTitleAccent} />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {cards.map((card, i) => (
            <Card key={i} card={{ ...card, n: seq(card.n, i) }} />
          ))}
        </div>
      </div>
      )}
    </section>
  );
}

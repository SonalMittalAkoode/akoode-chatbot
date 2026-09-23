import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CircleCheck,
  Zap,
  Layers,
  Sun,
  Database,
} from "lucide-react";
import { Reveal, Heading } from "./shared";
import { renderIcon, RichText, buildAssetUrl, pick, pickList } from "./dynamic";

const KEY_CARDS = [
  {
    icon: Zap,
    title: "Latency at Scale",
    problem:
      "Processing 15+ live feeds in real time at 4K resolution without dropping frames or overwhelming compute.",
    approach:
      "A GPU-accelerated streaming pipeline processes every feed in parallel with sub-second latency.",
    stat: "Real-time across 15 feeds",
  },
  {
    icon: Layers,
    title: "Occlusion & Overlap",
    problem:
      "Players overlap and cross constantly, breaking naïve frame-to-frame tracking and identity.",
    approach:
      "Re-identification models keep every player's track consistent through collisions and crowds.",
    stat: "Consistent multi-player tracking",
  },
  {
    icon: Sun,
    title: "Lighting Variance",
    problem:
      "Stadium lighting shifts constantly across a match, venues and weather conditions.",
    approach:
      "Augmented training data keeps detection accurate in any lighting condition.",
    stat: "Accurate in any condition",
  },
  {
    icon: Database,
    title: "Data Volume",
    problem:
      "4K footage at 60fps generates enormous volumes of raw video data to store and query.",
    approach:
      "A tiered storage pipeline keeps everything fast to query and cost-efficient at scale.",
    stat: "Fast & cost-efficient at scale",
  },
];


const DEFAULT_INTRO =
  "Building an AI system for live sports video comes with real engineering complexity. Here's what we tackled, and how.";

/* ------------------------------------------------------------------ *
 *  Desktop hub-and-spoke geometry (coordinate space = 1280 × containerH,
 *  driven by the connector SVG's viewBox so it maps 1:1 to the container).
 *
 *  cx/cy  — hub centre (fixed, so the container can grow downward without
 *           shifting the hub out from under the connectors).
 *  R      — radius of the dashed ring; connector ring-ends are computed to
 *           land exactly on this circle.
 *  slots  — the four card positions. `cardTop` is the absolute top of each
 *           card div; `ax/ay` is the anchor where the connector meets the
 *           card edge (left cards exit their right edge x=358, right cards
 *           their left edge x=922). Slots are spaced ~500px apart vertically
 *           so the variable-height cards can never overlap.
 * ------------------------------------------------------------------ */
const HUB = {
  width: 1280,
  cx: 640,
  cy: 430,
  R: 196,
  containerH: 1070,
  slots: [
    { side: "left", cardTop: 120, ax: 358, ay: 230 }, // top-left
    { side: "left", cardTop: 590, ax: 358, ay: 730 }, // bottom-left
    { side: "right", cardTop: 5, ax: 922, ay: 115 }, // top-right
    { side: "right", cardTop: 500, ax: 922, ay: 610 }, // bottom-right
  ],
};

export default function KeyChallengesSection({ data }) {
  const heading = pick(data?.heading, "Key Challenges & ");
  const accent = pick(data?.headingAccent, "How We Solve Them");
  const intro = pick(data?.intro, DEFAULT_INTRO);
  const cards = pickList(data?.cards, KEY_CARDS);
  const hubImage = data?.hubImage ? buildAssetUrl(data.hubImage) : "";
  const hubImageAlt = pick(data?.hubImageAlt, "AI computer-vision analysing a live sports play");
  const hubBadge = pick(data?.hubBadge, "AI-Powered System");
  const ctaText = pick(data?.ctaText, "Let's Solve Your Challenges");
  const ctaLink = pick(data?.ctaLink, "/post-requirement");

  return (
    <section className="bg-white py-[40px] md:py-[60px]">
      <div className="mx-auto w-full max-w-[92rem] px-5 sm:px-8 lg:px-[clamp(1.5rem,3vw,3rem)]">
        <Reveal className="max-w-4xl">
          <Heading eyebrow="Engineering Challenges" lead={heading} accent={accent} />
          <RichText
            html={intro}
            className="mt-5 text-[14px] leading-[1.5] text-[#191A2E]/90 sm:text-[16px] md:mt-6 lg:text-[18px]"
          />
        </Reveal>

        {/* ---- hub-and-spoke (desktop) — left column low, right column high,
               with dashed elbow connectors whose ring-end is computed to land
               exactly on the hub's dashed ring (see HUB / connector geometry
               below). Card slots are spaced far enough apart that the variable-
               height cards can never overlap. ---- */}
        <Reveal className="mt-14 hidden lg:block">
          <div
            className="relative mx-auto w-full max-w-[1280px]"
            style={{ height: HUB.containerH }}
          >
            <HubConnectors />

            {/* centre image — pinned to a fixed centre so growing the
               container never shifts it out from under the connectors */}
            <div
              className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ top: HUB.cy }}
            >
              <HubImage image={hubImage} alt={hubImageAlt} badge={hubBadge} />
            </div>

            {/* cards — left column pushed down, right column pulled up */}
            <div
              className="absolute left-0 z-10 w-[28%]"
              style={{ top: HUB.slots[0].cardTop }}
            >
              {cards[0] && <KeyCard {...cards[0]} />}
            </div>
            <div
              className="absolute left-0 z-10 w-[28%]"
              style={{ top: HUB.slots[1].cardTop }}
            >
              {cards[1] && <KeyCard {...cards[1]} />}
            </div>
            <div
              className="absolute right-0 z-10 w-[28%]"
              style={{ top: HUB.slots[2].cardTop }}
            >
              {cards[2] && <KeyCard {...cards[2]} />}
            </div>
            <div
              className="absolute right-0 z-10 w-[28%]"
              style={{ top: HUB.slots[3].cardTop }}
            >
              {cards[3] && <KeyCard {...cards[3]} />}
            </div>
          </div>
        </Reveal>

        {/* ---- stacked (mobile / tablet) ---- */}
        <div className="mt-12 lg:hidden">
          <div className="flex justify-center">
            <HubImage image={hubImage} alt={hubImageAlt} badge={hubBadge} />
          </div>
          <div className="mt-24 grid grid-cols-1 gap-5 sm:mt-28 sm:grid-cols-2">
            {cards.map((c, i) => (
              <Reveal key={c.title || i} delay={i * 0.05}>
                <KeyCard {...c} />
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-14 flex justify-center">
          <Link
            href={ctaLink}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#5a5e9e_0%,#7c80c8_100%)] px-8 py-3.5 text-[15px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(124,128,200,0.45)] md:text-[16px]"
          >
            {ctaText}
            <ArrowRight
              size={18}
              className="rotate-[-45deg] transition-transform duration-300 group-hover:rotate-0"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* Dashed elbow connectors drawn as one inline SVG. For each card anchor we
   shoot a short horizontal stub out of the card edge, then a diagonal that
   ends exactly on the hub ring — the ring-end point P is the intersection of
   the line (anchor → hub centre) with the circle of radius R, so it always
   meets the ring no matter how the cards are spaced. A dot sits at both ends. */
function HubConnectors() {
  const { width, containerH, cx, cy, R, slots } = HUB;
  const STUB = 40;
  const lines = slots.map((s) => {
    const dx = s.ax - cx;
    const dy = s.ay - cy;
    const len = Math.hypot(dx, dy) || 1;
    const px = cx + (R * dx) / len; // ring-end X (lands on the circle)
    const py = cy + (R * dy) / len; // ring-end Y
    const stubX = s.side === "left" ? s.ax + STUB : s.ax - STUB;
    return {
      d: `M ${s.ax} ${s.ay} L ${stubX} ${s.ay} L ${px} ${py}`,
      ax: s.ax,
      ay: s.ay,
      px,
      py,
    };
  });

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${containerH}`}
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    >
      {lines.map((l, i) => (
        <g key={i} stroke="#1D1F4B" fill="#1D1F4B">
          <path
            d={l.d}
            fill="none"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 8"
          />
          <circle cx={l.ax} cy={l.ay} r={5} />
          <circle cx={l.px} cy={l.py} r={5} />
        </g>
      ))}
    </svg>
  );
}

/* Central circular image for the Key-Challenges hub — circular frame with
   20px padding + a solid 3px #1D1F4B ring (per the Figma dev export),
   targeting corner brackets and the AI-Powered System badge. */
function HubImage({ image, alt, badge }) {
  return (
    <div className="relative h-[240px] w-[240px] shrink-0 sm:h-[320px] sm:w-[320px] lg:h-[360px] lg:w-[360px]">
      {/* dark dashed circular ring */}
      <div
        aria-hidden
        className="absolute -inset-4 rounded-full border-4 border-dashed border-[#1D1F4B]"
      />
      {/* image */}
      <div className="absolute inset-0 overflow-hidden rounded-full shadow-[0_30px_70px_rgba(29,31,75,0.35)]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <Image
            src="/caseStudy/challenges.webp"
            alt={alt}
            fill
            sizes="340px"
            className="object-cover"
          />
        )}
        {/* single scanner focus frame over the player (upper-centre) */}
        <div className="absolute left-1/2 top-[6%] h-[40%] w-[51%] -translate-x-1/2">
          {/* frosted lower fill */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-[18px] bg-white/20"
          />
          {/* rounded corner brackets (#6679E4) */}
          <span
            aria-hidden
            className="absolute left-0 top-0 h-9 w-9 rounded-tl-[18px] border-l-[5px] border-t-[5px] border-[#6679E4]"
          />
          <span
            aria-hidden
            className="absolute right-0 top-0 h-9 w-9 rounded-tr-[18px] border-r-[5px] border-t-[5px] border-[#6679E4]"
          />
          <span
            aria-hidden
            className="absolute bottom-0 left-0 h-9 w-9 rounded-bl-[18px] border-b-[5px] border-l-[5px] border-[#6679E4]"
          />
          <span
            aria-hidden
            className="absolute bottom-0 right-0 h-9 w-9 rounded-br-[18px] border-b-[5px] border-r-[5px] border-[#6679E4]"
          />
        </div>
      </div>
      {/* badge */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#1d1f4b] px-4 py-1.5 text-[12px] font-medium text-white shadow-[0_10px_24px_rgba(29,31,75,0.4)]">
        {badge}
      </div>
    </div>
  );
}

/* Dark hub card — dark icon tile, problem, OUR APPROACH, and a white stat pill. */
function KeyCard({ icon, title, problem, approach, stat }) {
  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-[linear-gradient(150deg,#34387a_0%,#23265a_45%,#191b45_100%)] p-5 shadow-[0_18px_44px_rgba(29,31,75,0.3)] sm:p-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#14163a]">
        {renderIcon(icon, { size: 22, className: "text-[#6679E4]" })}
      </span>
      <h3 className="mt-5 text-[16px] font-semibold leading-[1.3] text-white sm:text-[18px]">
        {title}
      </h3>
      <RichText html={problem} className="mt-3 text-[13px] leading-[1.6] text-white/65" />
      <p className="mt-5 text-[11px] font-bold uppercase tracking-[1.5px] text-white/50">
        Our Approach
      </p>
      <RichText html={approach} className="mt-1.5 text-[13px] leading-[1.6] text-white/65" />
      <div className="mt-5 flex w-full items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-[12px] font-medium text-[#1d1f4b]">
        <CircleCheck size={16} className="shrink-0 text-[#6679E4]" />
        {stat}
      </div>
    </div>
  );
}

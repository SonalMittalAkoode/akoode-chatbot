import { Clapperboard, Users, BarChart3 } from "lucide-react";
import { Reveal, Heading } from "./shared";
import { RichText, buildAssetUrl, pick, pickList } from "./dynamic";

const FEATURES = [
  {
    tag: "FEATURE : 01",
    title: "Automated Video Segmentation",
    desc: "The system automatically divides raw match footage into 10–15 second clips, each representing a single play. This eliminates the need for manual editing and creates a structured dataset that coaches can navigate instantly.",
    bullets: [
      "Eliminates manual editing entirely",
      "Enables granular play-by-play analysis",
      "Speeds up the entire coaching workflow",
    ],
    mock: "segmentation",
  },
  {
    tag: "FEATURE : 02",
    title: "AI-Based Player Detection & Tracking",
    desc: "Advanced computer vision models detect and track multiple players simultaneously across video frames with high precision. The system maps movement trajectories and spatial positioning for every player on the field.",
    bullets: [
      "Multi-player tracking in real time",
      "Movement trajectory mapping",
      "Accurate spatial positioning data",
    ],
    mock: "tracking",
  },
  {
    tag: "FEATURE : 03",
    title: "Performance Metrics Engine",
    desc: "Using motion analysis algorithms, the system calculates critical performance indicators for every player in every play. Coaches get objective, comparable data instead of subjective observation.",
    bullets: [
      "Speed & acceleration per player",
      "Total distance covered per play",
      "Movement angle and direction changes",
    ],
    mock: "metrics",
  },
];

export default function PowerfulSection({ data }) {
  const heading = pick(data?.heading, "What Makes This System ");
  const accent = pick(data?.headingAccent, "Powerful");
  const features = pickList(data?.features, FEATURES);

  return (
    <section className="relative overflow-hidden bg-[#0c1024] py-[60px] md:py-[100px]">
      <div
        className="pointer-events-none absolute -top-20 left-1/2 h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-[#2b2e6b]/40 blur-[150px]"
        aria-hidden
      />
      <div className="relative z-10 mx-auto w-full max-w-[92rem] px-5 sm:px-8 lg:px-[clamp(1.5rem,3vw,3rem)]">
        <Reveal className="max-w-4xl">
          <Heading eyebrow="Core Features" lead={heading} accent={accent} dark />
        </Reveal>

        <div className="mt-14 space-y-16 md:space-y-24">
          {features.map((f, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={f.tag || i}>
                <div
                  className={`grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}
                >
                  {/* text */}
                  <div>
                    <p className="mb-5 inline-block rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold tracking-[1.5px] text-white/90">
                      {f.tag}
                    </p>
                    <h3 className="text-[22px] font-semibold capitalize leading-[1.2] text-white sm:text-[24px] md:text-[28px]">
                      {f.title}
                    </h3>
                    <RichText
                      html={f.desc}
                      className="mt-5 text-[14px] leading-[1.6] text-white/70 sm:text-[16px] lg:text-[18px]"
                    />
                    <ul className="mt-7 space-y-3.5">
                      {(f.bullets || []).map((b, bi) => (
                        <li
                          key={b || bi}
                          className="flex items-start gap-3 text-[14px] leading-snug text-white/85 sm:text-[16px]"
                        >
                          <span
                            className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-white/60"
                            aria-hidden
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* visual — DB media/embed, else the placeholder mock */}
                  <FeatureMock feature={f} />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Feature visual — renders the admin's image / embed when present, else an
   on-brand placeholder mock (used by the static defaults). */
function FeatureMock({ feature = {} }) {
  const { media, mediaType, embedCode, mock, title, mediaAlt } = feature;

  // Embed code (e.g. a YouTube / Vimeo iframe)
  if (mediaType === "embed" && embedCode) {
    return (
      <div
        className="relative aspect-[16/11] overflow-hidden rounded-[24px] border border-white/10 bg-black shadow-[0_30px_70px_rgba(0,0,0,0.4)] [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full [&_video]:absolute [&_video]:inset-0 [&_video]:h-full [&_video]:w-full"
        dangerouslySetInnerHTML={{ __html: embedCode }}
      />
    );
  }

  if (media) {
    const url = buildAssetUrl(media);
    if (mediaType === "video") {
      return (
        <div className="relative aspect-[16/11] overflow-hidden rounded-[24px] border border-white/10 bg-black shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
          <video src={url} className="absolute inset-0 h-full w-full object-cover" muted loop autoPlay playsInline controls />
        </div>
      );
    }
    return (
      <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={mediaAlt || title || ""} className="block w-full h-auto" />
      </div>
    );
  }

  // Placeholder visual cards (Figma) — dark gradient + soft centre glow,
  // a centred icon and a "[ … screenshot here ]" caption.
  const MAP = {
    segmentation: {
      Icon: Clapperboard,
      caption: "Video segmentation UI / screenshot here",
    },
    tracking: { Icon: Users, caption: "Player tracking UI / screenshot here" },
    metrics: {
      Icon: BarChart3,
      caption: "Performance metrics UI / screenshot here",
    },
  };
  const { Icon, caption } = MAP[mock] || MAP.segmentation;

  return (
    <div className="relative flex aspect-[16/11] items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_50%_42%,#2a2f63_0%,#16183c_58%,#101228_100%)] shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
      {/* soft centre glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(113,134,250,0.20),transparent_55%)]"
      />
      <div className="relative z-10 flex flex-col items-center text-center">
        <Icon size={46} className="text-[#8894F4]" strokeWidth={1.4} />
        <p className="mt-4 text-[13px] text-white/40">[ {caption} ]</p>
      </div>
    </div>
  );
}

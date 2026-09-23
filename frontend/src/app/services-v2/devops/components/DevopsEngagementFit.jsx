import Image from "next/image";
import { Target, Cloud, Users, User, Clock, Lightbulb } from "lucide-react";
import resolveIcon from "../iconResolver";

// Figma node 1365:1363. Three comparison columns over two closing callout cards.
const HEADING_GRADIENT =
  "linear-gradient(9.25deg, #7784C5 33.66%, #B7BEED 48.02%, #6077EC 58.53%, #7683C5 85.2%)";

const BIG_CIRCLE_BG = "#646CAB";
const LABEL_COLOR = "#7186FA";
const TITLE_COLOR = "#EEF1FF";

// Callout icon well — Figma paints a tight navy radial behind the glyph.
const WELL_BG = "radial-gradient(circle at 38% 32%, #0C1B68 0%, #08144D 50%, #040D32 100%)";

const DEFAULT_OPTIONS = [
  {
    Icon: Target,
    title: "DevOps Consulting",
    desc: "Best for a defined transformation with a clear end in mind.",
    rows: [
      { label: "Best Fit", value: "A defined transformation: migrate, containerize, build a pipeline" },
      { label: "Who Owns It Long-Term", value: "You, once it's handed off" },
      { label: "Typical Duration", value: "Weeks to a few months" },
    ],
  },
  {
    Icon: Cloud,
    title: "Managed DevOps",
    desc: "Best for ongoing infrastructure ownership without building a team.",
    rows: [
      { label: "Best Fit", value: "Ongoing infrastructure ownership without hiring an internal team" },
      { label: "Who Owns It Long-Term", value: "Us, accountable to SLOs" },
      { label: "Typical Duration", value: "Ongoing" },
    ],
  },
  {
    Icon: Users,
    title: "DevOps Consulting",
    desc: "Best for a defined transformation with a clear end in mind.",
    rows: [
      {
        label: "Best Fit",
        value: "A team large enough to justify full-time headcount and clear technical leadership already in place",
      },
      { label: "Who Owns It Long-Term", value: "You, from day one" },
      { label: "Typical Duration", value: "Permanent" },
    ],
  },
];

const DEFAULT_CALLOUTS = [
  {
    Icon: Lightbulb,
    text: "If you need a specific transformation completed and your team can maintain it afterward, consulting is usually the right call. If infrastructure needs ongoing ownership but you're not at the scale where a full internal platform team makes sense yet, managed DevOps closes that gap. We'll tell you during scoping if what you actually need is a hire, not a vendor, even though that's the answer that doesn't get us the engagement.",
  },
  {
    Icon: Users,
    text: "DevOps consulting or managed services work badly when the infrastructure need is so central to the product that it needs a full-time technical owner making daily judgment calls, not a partner brought in periodically. If that's genuinely where you are, we'll say so in the first call rather than selling a retainer that was never going to be the right shape for the problem.",
  },
];

// Row glyphs, in Figma's order: the notched "fit" mark, an owner, a clock.
function RowIcon({ index }) {
  if (index === 0) {
    return <Image src="/devops/icon-fit.svg" alt="" width={18} height={18} className="size-[18px]" />;
  }
  const Glyph = index === 1 ? User : Clock;
  return <Glyph className="size-[18px]" style={{ color: "#1D1F4B" }} strokeWidth={1.5} />;
}

export default function DevopsEngagementFit({ data } = {}) {
  const heading = data?.heading || "DevOps Consulting, Managed Services,";
  const headingAccent = data?.headingAccent || "or an Internal Hire: Which One Fits";
  const intro =
    data?.intro ||
    "These three get treated as interchangeable in sales conversations, and they solve genuinely different problems. Picking the wrong one is the most common reason a DevOps engagement disappoints on both sides.";
  // CMS rows carry an icon *name*; the coded defaults carry the component
  // itself. Resolve names, and fall back to the default at the same position so
  // a record that omits icons still renders the designed marks.
  const options = data?.options?.length
    ? data.options.map((o, i) => ({
        ...o,
        Icon: resolveIcon(o.icon) || DEFAULT_OPTIONS[i % DEFAULT_OPTIONS.length].Icon,
      }))
    : DEFAULT_OPTIONS;
  const callouts = data?.callouts?.length
    ? data.callouts.map((c, i) => ({
        ...c,
        Icon: resolveIcon(c.icon) || DEFAULT_CALLOUTS[i % DEFAULT_CALLOUTS.length].Icon,
      }))
    : DEFAULT_CALLOUTS;

  return (
    <section className="relative overflow-hidden" style={{ background: "#130E2A" }}>
      <div className="mx-auto w-full max-w-[1500px] px-5 py-12 sm:px-8 lg:px-16 lg:py-14">
        <div className="mx-auto w-full lg:w-[90%]">
          <div className="mb-12 flex flex-col gap-[18px] lg:mb-16">
            <h2 className="font-figtree font-normal leading-[1.2] text-[24px] sm:text-[28px] tracking-[-0.01em]">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADING_GRADIENT }}>
                {heading}
              </span>
              <br className="hidden sm:block" />{" "}
              <span className="text-white">{headingAccent}</span>
            </h2>

            <p className="font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px]">
              {intro}
            </p>
          </div>

          {/* ── Three comparison columns ── */}
          <div className="grid grid-cols-1 gap-x-14 gap-y-12 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto_auto]">
            {options.map(({ Icon, title, desc, rows }, i) => (
              <div
                key={i}
                className="flex flex-col gap-6 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:gap-y-7"
              >
                <div className="flex items-start gap-5">
                  <span
                    className="flex size-[80px] shrink-0 items-center justify-center rounded-full xl:size-[88px]"
                    style={{ background: BIG_CIRCLE_BG }}
                  >
                    <Icon
                      className="size-[42px] xl:size-[46px]"
                      style={{ color: "rgba(255,255,255,0.9)" }}
                      strokeWidth={1.6}
                    />
                  </span>
                  <div className="pt-1">
                    <h3
                      className="font-figtree font-semibold leading-[1.1] text-[18px] sm:text-[20px] tracking-[-0.02em]"
                      style={{ color: TITLE_COLOR }}
                    >
                      {title}
                    </h3>
                    <p className="mt-[10px] font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px]">
                      {desc}
                    </p>
                  </div>
                </div>

                {rows.map((row, r) => (
                  <div key={r} className="flex items-start gap-[14px]">
                    <span
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white"
                      style={{ border: "0.8px solid rgba(79,124,255,0.28)" }}
                    >
                      <RowIcon index={r} />
                    </span>
                    <div>
                      <p
                        className="font-figtree font-bold uppercase leading-[1.2] tracking-[0.075em] text-[14px] sm:text-[15px]"
                        style={{ color: LABEL_COLOR }}
                      >
                        {row.label}
                      </p>
                      <p className="mt-[5px] font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px]">
                        {row.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* ── Two closing callouts ── */}
          <div className="mt-14 grid grid-cols-1 gap-7 lg:mt-[70px] lg:grid-cols-2">
            {callouts.map(({ Icon, text }, i) => (
              <div
                key={i}
                className="flex items-start gap-6 rounded-2xl px-7 py-6 sm:px-9 sm:py-8"
                style={{ background: BIG_CIRCLE_BG, border: "0.8px solid #889AF5" }}
              >
                <span
                  className="flex size-[60px] shrink-0 items-center justify-center rounded-full"
                  style={{ background: WELL_BG, border: "0.8px solid #4F7CFF" }}
                >
                  <Icon className="size-[30px]" style={{ color: "#FFFFFF" }} strokeWidth={1.6} />
                </span>
                <p className="font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px]">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

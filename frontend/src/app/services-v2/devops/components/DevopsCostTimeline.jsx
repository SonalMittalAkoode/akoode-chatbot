import {
  Box,
  Layers,
  ShieldCheck,
  RefreshCw,
  CodeXml,
  Cloud,
  Search,
  ClipboardCheck,
  FileText,
  Calendar,
  TrendingUp,
} from "lucide-react";
import resolveIcon from "../iconResolver";

// Figma node 1379:535. Three numbered blocks under a shared heading: cost
// drivers, delivery timelines, and the estimate process.
const HEADING_GRADIENT =
  "linear-gradient(5.03deg, #7784C5 33.66%, #B7BEED 48.02%, #6077EC 58.53%, #7683C5 85.2%)";

const ACCENT = "#4F7FEA";
const TITLE_COLOR = "#E8ECFF";
const UNIT_COLOR = "#7880A0";

const DEFAULT_DRIVERS = [
  {
    Icon: Box,
    title: "Current Infrastructure Complexity",
    desc: "A single application on one cloud provider costs less to transform than a multi-service system spread across three environments.",
  },
  {
    Icon: Layers,
    title: "Scope of Transformation",
    desc: "A single CI/CD pipeline is a different engagement than a full cloud migration with containerization and monitoring included.",
  },
  {
    Icon: ShieldCheck,
    title: "Compliance Requirements",
    desc: "HIPAA, SOC 2, or PCI DSS-aligned infrastructure adds real engineering time that a standard build doesn't need.",
  },
  {
    Icon: RefreshCw,
    title: "Ongoing vs One-Time",
    desc: "A defined migration project and an ongoing managed DevOps retainer sit in genuinely different cost brackets.",
  },
];

const DEFAULT_TIMELINES = [
  { Icon: CodeXml, title: "CI/CD Pipeline Implementation", range: "2–4", unit: "Weeks" },
  { Icon: Cloud, title: "Full Cloud Migration", range: "6–12", unit: "Weeks" },
  { Icon: Box, title: "Containerization & Kubernetes Adoption", range: "4–8", unit: "Weeks" },
];

const DEFAULT_STEPS = [
  { Icon: Search, title: "Technical Assessment", desc: "We evaluate your environment, requirements, and goals in detail." },
  { Icon: ClipboardCheck, title: "Fixed Estimate", desc: "We provide a clear, fixed estimate based on real understanding." },
  { Icon: FileText, title: "Real Numbers", desc: "You get a real number, not a marketing range or rough guess." },
  { Icon: Calendar, title: "Execution Plan", desc: "We align on scope, timeline, and delivery plan." },
  { Icon: TrendingUp, title: "Delivery", desc: "We build, deploy, and optimize on time, on budget." },
];

// Numbered rule that caps each block: "01 — LABEL ————————".
function BlockLabel({ n, children }) {
  return (
    <div className="flex items-center gap-3 sm:gap-[14px]">
      <span className="font-figtree font-bold leading-none text-[13px] sm:text-[14px]" style={{ color: ACCENT }}>
        {n}
      </span>
      <span aria-hidden className="h-px w-[28px] shrink-0" style={{ background: ACCENT }} />
      <span
        className="whitespace-nowrap font-figtree font-bold uppercase leading-none tracking-[0.12em] text-[12px] sm:text-[13px]"
        style={{ color: ACCENT }}
      >
        {children}
      </span>
      <span aria-hidden className="h-px flex-1" style={{ background: ACCENT }} />
    </div>
  );
}

export default function DevopsCostTimeline({ data } = {}) {
  const heading = data?.heading || "What Cloud and DevOps Work";
  const headingAccent = data?.headingAccent || "Actually Costs and How Long It Takes";
  const note =
    data?.note ||
    "A number quoted before we've seen your actual infrastructure is a guess, not a quote. We give a fixed estimate after a technical assessment, so you're comparing a real number, not a marketing range.";
  const intro =
    data?.intro ||
    "On the page deliberately, rather than left for a sales call, because cost and timeline are usually the two questions that decide whether a shortlist conversation even starts.";
  // CMS entries carry an icon *name*; the coded defaults carry the component.
  // Resolve names and fall back to the default mark at the same position.
  const withIcons = (rows, defaults) =>
    rows?.length
      ? rows.map((r, i) => ({ ...r, Icon: resolveIcon(r.icon) || defaults[i % defaults.length].Icon }))
      : defaults;

  const drivers = withIcons(data?.drivers, DEFAULT_DRIVERS);
  const timelines = withIcons(data?.timelines, DEFAULT_TIMELINES);
  const steps = withIcons(data?.steps, DEFAULT_STEPS);

  return (
    <section className="relative overflow-hidden" style={{ background: "#130E2A" }}>
      <div className="mx-auto w-full max-w-[1500px] px-5 py-12 sm:px-8 lg:px-16 lg:py-14">
        {/* Runs at 90% of the page container from lg up, matching the services
            and engagement-fit sections so all three share one left edge. */}
        <div className="mx-auto w-full lg:w-[90%]">
          {/* ── Heading + the "i" note, side by side from lg ── */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
            <div className="lg:w-[52%]">
              <h2 className="font-figtree font-normal leading-[1.2] text-[24px] sm:text-[28px] tracking-[-0.01em]">
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADING_GRADIENT }}>
                  {heading}{" "}
                </span>
                <span className="text-white">{headingAccent}</span>
              </h2>

              <p className="mt-[18px] font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px]">
                {intro}
              </p>
            </div>

            <div className="flex items-center gap-5 sm:gap-[31px] lg:w-[48%]">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-full"
                style={{ border: "0.8px solid " + ACCENT }}
              >
                <span
                  className="font-figtree font-extrabold italic leading-none text-[15px]"
                  style={{ color: ACCENT }}
                >
                  i
                </span>
              </span>
              <p className="font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px]">{note}</p>
            </div>
          </div>

          {/* ── 01 · What drives the cost ── */}
          <div className="mt-12 lg:mt-14">
            <BlockLabel n="01">What Drives the Cost</BlockLabel>

            <div className="mt-6 grid grid-cols-1 gap-x-14 gap-y-8 lg:grid-cols-2">
              {drivers.map(({ Icon, title, desc }, i) => (
                <div key={i} className="flex items-start gap-4 sm:gap-[27px]">
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-full sm:size-12"
                    style={{ background: "rgba(79,127,234,0.08)", border: "1px solid " + ACCENT }}
                  >
                    <Icon className="size-5 sm:size-6" style={{ color: ACCENT }} strokeWidth={1.5} />
                  </span>
                  <p
                    className="w-[110px] shrink-0 font-figtree font-medium leading-[1.6] text-[14px] sm:w-[150px] sm:text-[15px]"
                    style={{ color: TITLE_COLOR }}
                  >
                    {title}
                  </p>
                  {/* Figma runs a hairline rule between the label and its copy. */}
                  <p
                    className="flex-1 border-l pl-4 font-figtree font-normal leading-[1.6] text-white text-[14px] sm:pl-[42px] sm:text-[15px]"
                    style={{ borderColor: "rgba(255,255,255,0.3)" }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── 02 · How long it actually takes ── */}
          <div className="mt-12 lg:mt-14">
            <BlockLabel n="02">How Long It Actually Takes</BlockLabel>

            <div className="mt-4">
              {timelines.map(({ Icon, title, range, unit }, i) => (
                <div
                  key={i}
                  className="flex flex-col py-5 sm:py-[22px]"
                  style={{ borderBottom: "0.8px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="flex items-center gap-4 sm:gap-[18px]">
                    <span
                      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white sm:size-12"
                      style={{ border: "0.8px solid " + ACCENT }}
                    >
                      <Icon className="size-5 sm:size-6" style={{ color: "#1D1F4B" }} strokeWidth={1.6} />
                    </span>
                    <p
                      className="flex-1 font-figtree font-bold leading-[1.3] text-[14px] sm:text-[15px]"
                      style={{ color: TITLE_COLOR }}
                    >
                      {title}
                    </p>
                    <span className="shrink-0 text-right">
                      <span
                        className="block font-figtree font-extrabold leading-none text-[22px] sm:text-[24px]"
                        style={{ color: ACCENT }}
                      >
                        {range}
                      </span>
                      <span
                        className="mt-1 block font-figtree font-normal uppercase leading-none tracking-[0.18em] text-[10px] sm:text-[11px]"
                        style={{ color: UNIT_COLOR }}
                      >
                        {unit}
                      </span>
                    </span>
                  </div>

                  {/* Progress rail: filled dot, hairline, hollow ring — indented to
                      clear the icon circle so it starts under the title. */}
                  <div className="mt-[14px] flex items-center pl-[60px] sm:pl-[66px]">
                    <span aria-hidden className="size-[9px] shrink-0 rounded-full" style={{ background: ACCENT }} />
                    <span aria-hidden className="h-px flex-1" style={{ background: ACCENT }} />
                    <span
                      aria-hidden
                      className="size-[11px] shrink-0 rounded-full"
                      style={{ border: "0.8px solid " + ACCENT }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 03 · From unknown to clear, fixed estimate ── */}
          <div className="mt-12 lg:mt-14">
            <BlockLabel n="03">From Unknown to Clear, Fixed Estimate</BlockLabel>

            <div className="mt-7 grid grid-cols-1 gap-x-[18px] gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map(({ Icon, title, desc }, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2">
                    <Icon className="size-5 shrink-0" style={{ color: ACCENT }} strokeWidth={1.75} />
                    <p
                      className="font-figtree font-bold leading-[1.3] text-[14px] sm:text-[15px]"
                      style={{ color: TITLE_COLOR }}
                    >
                      {title}
                    </p>
                  </div>
                  <p className="mt-2 font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px]">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

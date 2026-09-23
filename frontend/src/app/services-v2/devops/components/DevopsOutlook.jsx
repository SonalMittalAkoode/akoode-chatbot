import Image from "next/image";
import { Layers, RefreshCw, Brain } from "lucide-react";
import resolveIcon from "../iconResolver";

// Figma node 1410:2121. Five outlined Q&A cards, each led by a large index,
// a dot, an icon well and a hairline divider.
const HEADING_GRADIENT =
  "linear-gradient(5.03deg, #7784C5 33.66%, #B7BEED 48.02%, #6077EC 58.53%, #7683C5 85.2%)";

const ACCENT = "#4F7FEA";
const DOT_COLOR = "#4D7CFE";
const INDEX_COLOR = "#B5BEDB";
const QUESTION_COLOR = "#F2F4F8";

// Cards 02 and 03 use exported marks: a four-bar chart and the Kubernetes helm,
// neither of which has a clear lucide equivalent.
const ICON_FINOPS = "/devops/icon-finops.svg";
const ICON_KUBERNETES = "/devops/icon-kubernetes.svg";

const DEFAULT_CARDS = [
  {
    Icon: Layers,
    question: "Why is platform engineering replacing traditional DevOps teams?",
    answer:
      "DevOps teams that spend most of their time responding to ticket requests from other engineers have quietly become the bottleneck they were built to remove. Platform engineering flips that: building self-service infrastructure that other teams use directly, without a DevOps engineer standing between every request and its fulfillment. The businesses making this shift are seeing DevOps headcount stop scaling linearly with engineering headcount.",
  },
  {
    src: ICON_FINOPS,
    question: "How has FinOps changed cloud spending decisions in 2026?",
    answer:
      "Cloud cost has moved from a finance-team line item reviewed quarterly to an engineering decision made daily. Teams increasingly see real-time cost attribution per service, per feature, sometimes per pull request, changing architectural decisions before code ships rather than after the bill arrives.",
  },
  {
    src: ICON_KUBERNETES,
    question: "Is Kubernetes still the default choice for container orchestration?",
    answer:
      "Mostly yes, but with real pushback in specific cases. Kubernetes remains the default for genuinely complex, multi-service systems, while smaller teams increasingly choose simpler managed container platforms when Kubernetes operational overhead is not worth carrying at their scale.",
  },
  {
    Icon: RefreshCw,
    question: "Why are zero-downtime deployments now a baseline expectation, not a differentiator?",
    answer:
      "Scheduled maintenance windows have become a competitive disadvantage as tolerance for planned downtime continues to drop. Blue-green deployments and canary releases are increasingly treated as the minimum baseline for customer-facing products.",
  },
  {
    Icon: Brain,
    question: "How is AI changing DevOps and infrastructure work itself?",
    answer:
      "AI-assisted incident response and anomaly detection are becoming genuinely useful for catching infrastructure problems and improving alert triage. The realistic picture is narrower than the hype: AI supports pattern detection and operations, but does not replace engineering judgment.",
  },
];

// Icon well: lucide where the glyph matches, the exported mark otherwise.
function CardIcon({ Icon, src }) {
  if (src) {
    return <Image src={src} alt="" width={24} height={24} className="size-5 sm:size-6" />;
  }
  return <Icon className="size-5 sm:size-6" style={{ color: "#FFFFFF" }} strokeWidth={1.5} />;
}

export default function DevopsOutlook({ data } = {}) {
  const heading = data?.heading || "What Cloud and DevOps";
  const headingAccent = data?.headingAccent || "Work Stands in 2026";
  const note =
    data?.note ||
    "A number quoted before we've seen your actual infrastructure is a guess, not a quote. We give a fixed estimate after a technical assessment, so you're comparing a real number, not a marketing range.";
  const intro =
    data?.intro ||
    "None of this is a forecast. These are the conditions already shaping infrastructure budgets and technical decisions this year.";
  // CMS cards carry an icon *name*; the coded defaults carry a component or an
  // exported asset path. Resolve names, falling back to the default at the same
  // position so cards 02 and 03 keep their bespoke marks when unset.
  const cards = data?.cards?.length
    ? data.cards.map((c, i) => {
        const fallback = DEFAULT_CARDS[i % DEFAULT_CARDS.length];
        const Resolved = resolveIcon(c.icon);
        return Resolved
          ? { ...c, Icon: Resolved, src: undefined }
          : { ...c, Icon: fallback.Icon, src: fallback.src };
      })
    : DEFAULT_CARDS;

  return (
    <section className="relative overflow-hidden" style={{ background: "#130E2A" }}>
      <div className="mx-auto w-full max-w-[1500px] px-5 py-12 sm:px-8 lg:px-16 lg:py-14">
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

          {/* ── The five cards, 38px apart in Figma ── */}
          <div className="mt-12 flex flex-col gap-[38px] lg:mt-14">
            {cards.map(({ Icon, src, question, answer }, i) => (
              <div
                key={i}
                className="flex flex-col gap-5 rounded-[12px] px-6 py-6 sm:flex-row sm:items-center sm:gap-0 sm:px-9 sm:py-[26px]"
                style={{ border: "2px solid " + ACCENT }}
              >
                {/* Leading rail: index, dot, icon well, divider. */}
                <div className="flex shrink-0 items-center">
                  <span
                    className="font-figtree font-bold leading-none tracking-[-0.04em] text-[30px] sm:text-[38px]"
                    style={{ color: INDEX_COLOR }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="mx-3 size-[7px] shrink-0 rounded-full sm:mx-[14px]"
                    style={{ background: DOT_COLOR }}
                  />
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-full sm:size-14"
                    style={{
                      background: "rgba(77,124,254,0.07)",
                      border: "0.8px solid rgba(77,124,254,0.42)",
                    }}
                  >
                    <CardIcon Icon={Icon} src={src} />
                  </span>
                  <span
                    aria-hidden
                    className="mx-5 hidden h-[72px] w-px shrink-0 sm:mx-7 sm:block"
                    style={{ background: "#1B2945" }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  {/* Figma sets the question at the same size as the answer —
                      weight and colour carry the hierarchy, not scale. */}
                  <h3
                    className="font-figtree font-semibold leading-[1.35] tracking-[-0.01em] text-[14px] sm:text-[15px]"
                    style={{ color: QUESTION_COLOR }}
                  >
                    {question}
                  </h3>
                  <p className="mt-[10px] font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px]">
                    {answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import {
  Clock,
  BarChart3,
  Users,
  RefreshCw,
  Play,
  Target,
  TrendingUp,
  Layers,
  Zap,
  CircleCheck,
  Eye,
} from "lucide-react";
import { Reveal, Heading } from "./shared";
import { renderIcon, RichText, pick, pickList } from "./dynamic";

// Three columns (BEFORE / OUR SOLUTION / AFTER) share the same four rows;
// only the leading icon differs per column — matching the Figma frame.
const CHANGE_ROWS = [
  {
    title: "Time-Consuming Manual Review",
    desc: "Hours spent manually reviewing match footage with no automation.",
  },
  {
    title: "No Measurable Metrics",
    desc: "Lack of precise data to evaluate player performance.",
  },
  {
    title: "Subjective Coaching Decisions",
    desc: "Decisions were based on observation, not data.",
  },
  {
    title: "No Cross-Session Comparison",
    desc: "Impossible to track progress or improvement over time.",
  },
];

const CHANGE_COLS = [
  { label: "BEFORE", icons: [Clock, BarChart3, Users, RefreshCw] },
  { label: "OUR SOLUTION", icons: [Play, Target, TrendingUp, Layers] },
  { label: "AFTER", icons: [Zap, CircleCheck, TrendingUp, Eye] },
];

const RESULT_STATS = [
  {
    icon: Zap,
    value: "70%",
    label: "Faster Processing",
    desc: "What took hours now takes just minutes.",
  },
  {
    icon: Target,
    value: "94%",
    label: "Tracking Accuracy",
    desc: "Multi-player detection consistently maintained across all scenarios.",
  },
  {
    icon: Eye,
    value: "Real-time",
    label: "Performance Insights",
    desc: "Live insights generated and delivered during match play.",
  },
];

// Default columns reshaped to the DB shape: each column owns its 4 cards.
const DEFAULT_COLUMNS = CHANGE_COLS.map((col) => ({
  label: col.label,
  cards: CHANGE_ROWS.map((row, ri) => ({
    icon: col.icons[ri],
    title: row.title,
    desc: row.desc,
  })),
}));

const DEFAULT_INTRO =
  "We transformed unstructured sports footage into real-time intelligence, helping coaches make faster and smarter decisions.";

/* Parent grid row templates (pill row + N card rows). The three columns share
   these rows via subgrid so equivalent cards line up across columns regardless
   of text length. Strings are listed literally so Tailwind generates them. */
const ROW_TPL = {
  3: "sm:grid-rows-[auto_auto_auto_auto]",
  4: "sm:grid-rows-[auto_auto_auto_auto_auto]",
  5: "sm:grid-rows-[auto_auto_auto_auto_auto_auto]",
  6: "sm:grid-rows-[auto_auto_auto_auto_auto_auto_auto]",
};

export default function WhatChangedSection({ data }) {
  const heading = pick(data?.heading, "What Changed ");
  const accent = pick(data?.headingAccent, "After Implementation");
  const intro = pick(data?.intro, DEFAULT_INTRO);
  const columns = pickList(data?.columns, DEFAULT_COLUMNS);
  const resultStats = pickList(data?.resultStats, RESULT_STATS);
  const maxCards = Math.max(0, ...columns.map((c) => (c.cards || []).length));
  const rowsClass = ROW_TPL[maxCards] || ROW_TPL[4];

  return (
    <section className="bg-white py-[40px] md:py-[60px]">
      <div className="mx-auto w-full max-w-[92rem] px-5 sm:px-8 lg:px-[clamp(1.5rem,3vw,3rem)]">
        {/* two-column: heading on the left, the BEFORE/SOLUTION/AFTER columns on the right */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
          <Reveal className="lg:sticky lg:top-28 lg:w-[340px] lg:shrink-0 lg:self-start lg:pt-2 xl:w-[380px]">
            <Heading eyebrow="Results & Impact" lead={heading} accent={accent} />
            <RichText
              html={intro}
              className="mt-5 max-w-[541px] text-[14px] leading-[1.5] text-[#191A2E]/90 sm:text-[16px] lg:text-[18px]"
            />
          </Reveal>

          {/* right column — the three card columns, then the stats strip
             (so the strip aligns to the cards block, not full width) */}
          <div className="flex-1">
            <div className={`grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-[17px] ${rowsClass}`}>
              {columns.map((col, ci) => (
                <Reveal
                  key={col.label || ci}
                  delay={ci * 0.08}
                  className="flex flex-col gap-[17px] sm:grid sm:gap-[17px] sm:[grid-row:1/-1] sm:grid-rows-subgrid"
                >
                  {/* column pill header */}
                  <span className="inline-flex h-[45px] items-center justify-center self-start rounded-full bg-[#1D1F4B] px-3.5 text-[14px] font-bold uppercase leading-5 text-white outline outline-1 -outline-offset-1 outline-white/10">
                    {col.label}
                  </span>

                  {/* cards */}
                  {(col.cards || []).map((row, ri) => (
                    <div
                      key={row.title || ri}
                      className="flex h-full items-start gap-4 rounded-2xl border-[0.8px] border-[#E5E7EB] bg-white p-6"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#1D1F4B]">
                        {renderIcon(row.icon, { size: 20, className: "text-white" })}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-semibold leading-[1.3] text-[#101828] sm:text-[16px]">
                          {row.title}
                        </h3>
                        <RichText
                          html={row.desc}
                          className="mt-1 text-[12px] font-normal leading-[1.6] text-[#4A5565] sm:text-[13px]"
                        />
                      </div>
                    </div>
                  ))}
                </Reveal>
              ))}
            </div>

            {/* dark result-stats strip — aligned to the cards block */}
            <Reveal className="mt-8">
              <div className="grid grid-cols-1 gap-8 rounded-[20px] bg-[#1D1F4B] px-6 py-7 sm:grid-cols-3 md:px-8">
                {resultStats.map(({ icon, value, label, desc }, i) => (
                  <div key={label || i} className="flex items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] border-[0.8px] border-[#E4E4E4] bg-white">
                      {renderIcon(icon, { size: 22, className: "text-[#1D1F4B]" })}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="flex flex-wrap items-baseline gap-x-2 leading-5">
                        <span className="whitespace-nowrap text-[22px] font-medium text-white">
                          {value}
                        </span>
                        <span className="text-[14px] font-medium text-white">
                          {label}
                        </span>
                      </p>
                      <p className="mt-2 text-[12px] font-normal leading-4 text-[#b8b8ba]">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

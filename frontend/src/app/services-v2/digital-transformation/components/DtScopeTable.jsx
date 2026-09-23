"use client";

import useIsDesktop from "@/hooks/useIsDesktop";
import withLineBreak from "../headingBreak";

const ACCENT_GRADIENT =
  "linear-gradient(8.028deg, #7784C5 33.662%, #B7BEED 48.02%, #6077EC 58.532%, #7683C5 85.197%)";

const APPROACH_GRADIENT =
  "linear-gradient(to left, rgba(102,121,228,0.2), rgba(102,121,228,0.45))";

const CELL_BORDER = "rgba(205,211,238,0.7)";

const COL_WIDTHS = ["lg:w-[22.191%]", "lg:w-[29.625%]", "lg:w-[25.142%]", "lg:w-[23.042%]"];
const COLUMNS = ["Approach", "Best Fit", "Typical Duration", "Risk If Scoped Wrong"];

const ROW_HEIGHTS = ["lg:min-h-[7.522vw]", "lg:min-h-[8.153vw]", "lg:min-h-[8.943vw]"];

const ROWS = [
  {
    n: "01",
    approach: "Full Digital Transformation",
    cells: [
      "Multiple disconnected systems, a broader strategic shift in how the business operates",
      "Several months to a year or more",
      "Scope creep, stalled momentum without visible early wins",
    ],
  },
  {
    n: "02",
    approach: "Single System Modernization",
    cells: [
      "One specific legacy system that's become the clear bottleneck",
      "Weeks to a few months",
      "Fixes the symptom, not the disconnected systems around it",
    ],
  },
  {
    n: "03",
    approach: "Point Automation",
    cells: [
      "A specific repetitive process costing real hours, without a broader systems problem",
      "Weeks",
      "Solves one thing while ignoring a bigger structural issue, if one actually exists",
    ],
  },
];

const seq = (n, i) => n || String(i + 1).padStart(2, "0");

export default function DtScopeTable({ data } = {}) {
  const isDesktop = useIsDesktop();
  const heading =
    data?.heading || "Full Transformation, a Single Modernization\nProject, or Point Automation:";
  const headingAccent = data?.headingAccent || "Which One Fits";
  const intro =
    data?.intro ||
    "These get treated as the same conversation and they\u2019re not. Picking the wrong scope is the most common reason a transformation initiative either stalls halfway or costs far more than the actual problem justified.";
  const columns = data?.columns?.filter(Boolean)?.length ? data.columns.filter(Boolean) : COLUMNS;
  const rows = (data?.rows?.length ? data.rows : ROWS)
    .slice(0, ROW_HEIGHTS.length)
    .map((row) => ({
      ...row,
      cells: row.cells || [row.bestFit || "", row.duration || "", row.risk || ""],
    }));
  const noteBody =
    data?.noteBody ||
    "If the real problem is one legacy system nobody\u2019s touched in years, a full transformation engagement is more than the problem needs, and we\u2019ll say so. If the disconnection runs across finance, operations, and customer-facing systems all at once, starting with a single automation project just delays the work that actually needs doing.";
  const calloutTitle =
    data?.calloutTitle || "When You Don\u2019t Need a Transformation Consultant at All";
  const calloutBody =
    data?.calloutBody ||
    "Sometimes the honest answer is that you need one system fixed, not a strategic transformation engagement. If that\u2019s what the first conversation reveals, we\u2019ll scope it as the smaller project it actually is, rather than stretch it into something bigger because that\u2019s the more profitable conversation to have.";

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-[1901px] px-5 py-8 sm:px-8 lg:px-0 lg:py-[2.576vw] lg:pl-[4.261%] lg:pr-[3.419%]">
        <h2 className="font-figtree font-semibold capitalize leading-[1.02] text-[24px] sm:text-[28px]">
          <span className="whitespace-pre-line text-[#1D1F4B]">{withLineBreak(heading)} </span>
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: ACCENT_GRADIENT }}>
            {headingAccent}
          </span>
        </h2>

        <p className="mt-[clamp(10px,0.789vw,15px)] font-figtree font-normal leading-[1.1] text-[#1D1F4B] text-[14px] sm:text-[15px] lg:text-[16px] lg:w-[57.95%]">
          {intro}
        </p>

        <div className="mt-10 flex flex-col gap-[clamp(12px,1.052vw,20px)] lg:mt-[3.36vw]">
          {isDesktop && (
          <div className="flex items-center lg:h-[2.21vw]">
            {columns.map((label, i) => (
              <div
                key={label}
                className={`${COL_WIDTHS[i]} pl-[0.9204vw] ${i > 0 ? "border-l-[1.67px] border-[#6679E4]" : ""}`}
              >
                <p className="font-figtree font-bold uppercase leading-[1.4] text-[#6679E4] text-[clamp(13px,1.2625vw,24px)]">
                  {label}
                </p>
              </div>
            ))}
          </div>
          )}

          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`flex flex-col overflow-hidden rounded-[clamp(4px,0.4734vw,9px)] lg:flex-row lg:items-stretch ${ROW_HEIGHTS[rowIndex]}`}
              style={{ background: "rgba(205,211,238,0.13)" }}
            >
              <div
                className={`flex items-center gap-[clamp(8px,0.6136vw,11.664px)] py-[clamp(14px,0.9204vw,17.496px)] pl-[clamp(14px,0.9817vw,18.662px)] pr-4 ${COL_WIDTHS[0]}`}
                style={{ backgroundImage: APPROACH_GRADIENT }}
              >
                <span className="font-figtree font-black leading-[1] tracking-[-0.04em] text-[#1D1F4B] text-[clamp(20px,1.4729vw,28px)]">
                  {seq(row.n, rowIndex)}
                </span>
                <span className="font-figtree font-semibold leading-[1.4] text-[#1D1F4B] text-[14px] sm:text-[15px] lg:text-[16px]">
                  {row.approach}
                </span>
              </div>

              {row.cells.map((cell, i) => (
                <div
                  key={columns[i + 1] || i}
                  className={`flex flex-col justify-center border-t-[0.8px] p-[clamp(14px,0.8417vw,16px)] lg:border-l-[0.8px] lg:border-t-0 ${COL_WIDTHS[i + 1]}`}
                  style={{ borderColor: CELL_BORDER }}
                >
                  {!isDesktop && (
                    <span className="mb-1 font-figtree text-[12px] font-bold uppercase leading-[1.4] text-[#6679E4]">
                      {columns[i + 1]}
                    </span>
                  )}
                  <p className="font-figtree font-normal leading-[1.4] text-[#1D1F4B] text-[14px] sm:text-[15px] lg:text-[16px]">
                    {cell}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Footnote pair ── */}
        <div className="mt-10 flex flex-col gap-[clamp(20px,1.8407vw,34.992px)] lg:mt-[2.576vw] lg:flex-row lg:items-stretch">
          <div className="flex gap-[clamp(20px,1.8407vw,34.992px)] lg:w-[39.6%]">
            <span aria-hidden className="w-[3px] shrink-0 self-stretch bg-[#6679E4]" />
            <p className="font-figtree font-normal leading-[1.4] text-[#130E2A] text-[20px] sm:text-[22px]">
              {noteBody}
            </p>
          </div>

          <div
            className="flex overflow-hidden rounded-[clamp(4px,0.4295vw,8.165px)] lg:flex-1"
            style={{ background: "rgba(205,211,238,0.22)" }}
          >
            <span aria-hidden className="w-[3px] shrink-0 self-stretch bg-[#889AF5]" />
            <div className="flex flex-col justify-center px-[clamp(16px,1.1044vw,20.995px)] py-[clamp(16px,0.9817vw,18.662px)]">
              <h3 className="pb-[clamp(6px,0.5522vw,10.498px)] font-figtree font-bold leading-[1.4] text-[#130E2A] text-[20px] sm:text-[22px]">
                {calloutTitle}
              </h3>
              <p className="font-figtree font-normal leading-[1.4] text-[#6679E4] text-[14px] sm:text-[15px] lg:text-[16px]">
                {calloutBody}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

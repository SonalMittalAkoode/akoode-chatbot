import { Users, Target, TrendingUp, User, FileText, Clock } from "lucide-react";
import { SA_MODEL_FIT } from "../saData";

// Figma node 1084:792.
const INK = "#191A2E";
const QUOTE_INK = "#111827";
const NAVY = "#1D1F4B";
const MUTED = "#6B7280";
const CARD_BG = "#EFF2FF";
const CARD_BORDER = "#BFC9FF";
const RULE = "#889AF5";
const RING = "#E6E9F2";
const ICON_RING = "#DBEAFE";

// Same four-stop ramp as the rest of the page, at 7.77deg (1085:1167).
const HEADING_GRADIENT =
  "linear-gradient(7.77deg, #7784C5 33.662%, #B7BEED 48.02%, #6077EC 58.532%, #7683C5 85.197%)";

const QUESTION_ICONS = { Users, TrendingUp, Target };
const MODEL_ICONS = { User, Users, FileText };

// The three decision rows: navy card, white circle, navy glyph.
function QuestionRow({ icon, text }) {
  const Icon = QUESTION_ICONS[icon] || Users;
  return (
    <div
      className="flex items-center gap-4 rounded-[22px] border p-4 sm:gap-[26px] sm:p-6"
      style={{ background: NAVY, borderColor: RING }}
    >
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-full border-[0.8px] bg-white sm:size-[59px]"
        style={{ borderColor: RING }}
      >
        {/* Figma strokes these at 2 against a 28px box; lucide's viewBox is 24. */}
        <Icon className="size-6 sm:size-7" strokeWidth={1.71} style={{ color: NAVY }} />
      </span>
      <p className="m-0 min-w-0 font-figtree font-semibold leading-[1.25] tracking-[-0.4px] text-white text-[15px] sm:text-[17px]">
        {text}
      </p>
    </div>
  );
}

// A navy tile holding a white glyph — used for the three branches under the
// question card, and again as each comparison column's marker.
function ModelTile({ icon, className = "" }) {
  const Icon = MODEL_ICONS[icon] || User;
  return (
    <span
      className={`flex size-14 shrink-0 items-center justify-center rounded-[14px] border-[0.8px] sm:size-16 ${className}`}
      style={{ background: NAVY, borderColor: ICON_RING }}
    >
      <Icon className="size-7 sm:size-8" strokeWidth={1.5} style={{ color: "#FFFFFF" }} />
    </span>
  );
}

function MetaRow({ Icon, label, value, className = "" }) {
  return (
    <div className={`flex items-center gap-[15px] text-left sm:gap-[18px] ${className}`}>
      <Icon className="size-6 shrink-0 sm:size-[27px]" strokeWidth={1.6} style={{ color: MUTED }} />
      <div className="min-w-0">
        <p
          className="m-0 font-figtree font-semibold uppercase leading-[16.5px] tracking-[1.4px] text-[12px] sm:text-[13px]"
          style={{ color: MUTED }}
        >
          {label}
        </p>
        <p
          className="m-0 pt-1 font-figtree font-medium leading-[21px] text-[13px] sm:text-[15px]"
          style={{ color: INK }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function StaffAugModelFitSection({ data } = {}) {
  const d = { ...SA_MODEL_FIT, ...(data || {}) };
  const questions = d.questions?.length ? d.questions : SA_MODEL_FIT.questions;
  const models = d.models?.length ? d.models : SA_MODEL_FIT.models;
  const quotes = d.quotes?.length ? d.quotes : SA_MODEL_FIT.quotes;
  const warningParagraphs = d.warningParagraphs?.length
    ? d.warningParagraphs
    : SA_MODEL_FIT.warningParagraphs;

  return (
    <section className="relative bg-white">
      {/* Frame is 1901 wide with content at left-100 — a 5.26% gutter. */}
      <div className="mx-auto w-full max-w-[1901px] px-5 py-10 sm:px-8 lg:py-14 xl:px-[5.26%] xl:pb-[48px] xl:pt-[70px]">
        <h2 className="m-0 font-figtree font-normal capitalize leading-[1.2] text-[24px] sm:text-[28px]">
          {/* Figma (1085:1167) forces the accent onto its own line rather than
              letting it wrap; without the break it rides up onto line one. */}
          <span style={{ color: INK }}>{d.heading} </span>
          <br aria-hidden />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADING_GRADIENT }}>
            {d.headingAccent}
          </span>
        </h2>
        <p
          className="mt-[18px] font-figtree font-normal capitalize leading-[1.6] text-[14px] sm:text-[15px]"
          style={{ color: INK }}
        >
          {d.intro}
        </p>

        {/* ── Decision questions, and the quote that answers them ── */}
        <div className="mt-7 grid grid-cols-1 gap-10 xl:mt-[40px] xl:grid-cols-[38.97%_55.37%] xl:gap-x-[5.66%]">
          <div className="flex flex-col">
            <div
              className="flex flex-col gap-[18px] rounded-[29px] border-[1.67px] px-4 py-6 sm:px-[25px] sm:py-9"
              style={{ borderColor: "#9DA4B1" }}
            >
              {questions.map((q, i) => (
                <QuestionRow key={i} icon={q.icon} text={q.text} />
              ))}
            </div>

            {/* Three branches dropping from the card to the model tiles */}
            <div className="flex w-full items-start justify-center gap-2 sm:w-[92%] sm:self-center">
              {models.map((m, i) => (
                <div key={i} className="flex min-w-0 flex-1 flex-col items-center">
                  <span aria-hidden className="h-7 w-px" style={{ background: NAVY }} />
                  <span aria-hidden className="mb-4 size-2 rounded-[4px]" style={{ background: NAVY }} />
                  <ModelTile icon={m.icon} className="mb-2.5" />
                  <p
                    className="m-0 text-center font-figtree font-medium leading-[24px] text-[14px] sm:text-[16px]"
                    style={{ color: NAVY }}
                  >
                    {m.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <img
              src="/staff_augmentation/modelfit-quote.svg"
              alt=""
              aria-hidden
              className="h-[42px] w-[56px] shrink-0 sm:h-[58px] sm:w-[78px]"
            />
             <p
              className="mt-4 font-figtree font-medium leading-[1.4] tracking-[-0.4px] text-[15px] sm:text-[18px] xl:text-[20px]"
              style={{ color: QUOTE_INK }}
            >
              {quotes[0]}
            </p>
            <p
              className="mt-6 font-figtree font-normal leading-[1.4] text-[15px] sm:text-[18px] xl:text-[20px]"
              style={{ color: NAVY }}
            >
              {quotes[1]}
            </p>
          </div>
        </div>

        {/* ── Side-by-side comparison ── */}
        <div
          className="mt-7 grid grid-cols-1 gap-10 rounded-[32px] border p-6 sm:p-10 md:grid-cols-2 xl:mt-[31px] xl:grid-cols-3 xl:gap-[43px] xl:rounded-[58px] xl:p-16"
          style={{ background: CARD_BG, borderColor: CARD_BORDER }}
        >
          {models.map((m, i) => (
            <div key={i} className="flex min-w-0 flex-col items-center text-center xl:px-[30px]">
              <ModelTile icon={m.icon} className="mb-2.5" />
              <h3
                className="m-0 pt-6 font-figtree font-bold leading-[1.2] tracking-[-0.4px] text-[18px] sm:text-[21px]"
                style={{ color: INK }}
              >
                {m.name}
              </h3>
              <span aria-hidden className="mx-auto mt-4 h-[2px] w-7 rounded-[1px]" style={{ background: RULE }} />
              <p
                className="m-0 pt-5 font-figtree font-normal leading-[1.6] text-[14px] sm:text-[15px]"
                style={{ color: MUTED }}
              >
                {m.fit}
              </p>
              {/* Centred as a GROUP, not per row: w-fit shrinks the wrapper to
                  the wider of the two rows and mx-auto centres it, so both rows
                  share a left edge and their icons stay on one vertical line.
                  Centring each row on its own width drifts them apart whenever
                  the two values differ in length. */}
              <div className="mx-auto flex w-fit max-w-full flex-col">
                <MetaRow Icon={User} label="Who directs the work" value={m.directs} className="pt-8" />
                <MetaRow Icon={Clock} label="Typical duration" value={m.duration} className="pt-5" />
              </div>
            </div>
          ))}
        </div>

        {/* ── When it is not the right fit ── */}
        <div
          className="mt-6 flex items-start gap-5 rounded-[28px] p-6 sm:gap-10 sm:p-9 xl:mt-[31px] xl:gap-[78px] xl:rounded-[42px] xl:p-[38px]"
          style={{ background: NAVY }}
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-[28px] bg-white sm:size-14">
            <span
              className="font-figtree font-extrabold leading-[24px] text-[20px] sm:text-[24px]"
              style={{ color: NAVY }}
            >
              !
            </span>
          </span>
          <div className="flex min-w-0 flex-col gap-[9px] text-white xl:max-w-[1479px]">
            <p className="m-0 font-figtree font-bold leading-[1.2] tracking-[-0.4px] text-[18px] sm:text-[21px]">
              {d.warningTitle}
            </p>
            {warningParagraphs.map((p, i) => (
              <p
                key={i}
                className="m-0 font-figtree font-normal leading-[1.6] text-[14px] sm:text-[15px]"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

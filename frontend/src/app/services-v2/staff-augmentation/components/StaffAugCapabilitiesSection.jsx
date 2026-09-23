import { SA_CAPABILITIES } from "../saData";

// Figma node 1072:526 — white ground, no gradient on the heading.
const INK = "#191A2E";
const TITLE_INK = "#111827";
const BODY_INK = "#1D1F4B";
const ACCENT = "#7186FA";
const RULE = "#B1B7C0";

// Each item is number | rule | (title + body). In the frame the number sits at
// x=0, the 1.877px rule at x=66.64 and the copy at x=101.36 — i.e. two even
// ~33px gutters — and the copy column runs 687 of the item's 788px.
function Capability({ n, title, desc }) {
  return (
    <div className="flex items-start gap-5 sm:gap-[33px]">
      <p
        className="m-0 w-[34px] shrink-0 pt-[10px] font-figtree font-bold leading-[30px] tracking-[-0.4px] text-[20px] sm:text-[24px]"
        style={{ color: ACCENT }}
      >
        {n}
      </p>
      <span
        aria-hidden
        className="hidden h-[50px] w-[2px] shrink-0 sm:block"
        style={{ background: RULE }}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <h3
          className="m-0 pt-[10px] font-figtree font-semibold leading-[30px] tracking-[-0.4px] text-[16px] sm:text-[18px]"
          style={{ color: TITLE_INK }}
        >
          {title}
        </h3>
        <p
          className="m-0 pt-[20px] font-figtree font-normal leading-[1.6] text-[14px] sm:text-[15px]"
          style={{ color: BODY_INK }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function StaffAugCapabilitiesSection({ data } = {}) {
  const heading = data?.heading || "Capabilities Most Staffing Vendors Do Not Carry";
  const intro =
    data?.intro ||
    "Every placement gets scoped against a specific gap and a defined outcome, not a generic headcount request. The models below are the ways we combine engineers into your team; most clients use one or two.";
  const items = data?.items?.length ? data.items : SA_CAPABILITIES;

  return (
    <section className="relative bg-white">
      {/* Figma frame is 1901 wide with the content at left-106 running 1633px,
          so the gutters are 5.576% / 8.522%. */}
      <div className="mx-auto w-full max-w-[1901px] px-5 py-10 sm:px-8 lg:py-14 xl:pb-[70px] xl:pl-[5.576%] xl:pr-[8.522%] xl:pt-[70px]">
        <h2
          className="m-0 max-w-[1255px] font-figtree font-normal capitalize leading-[1.2] text-[24px] sm:text-[28px]"
          style={{ color: INK }}
        >
          {heading}
        </h2>
        <p
          className="mt-[18px] max-w-[1255px] font-figtree font-normal capitalize leading-[1.6] text-[14px] sm:text-[15px]"
          style={{ color: INK }}
        >
          {intro}
        </p>

        <div className="mt-7 grid grid-cols-1 gap-x-[3.49%] gap-y-8 lg:grid-cols-2 xl:mt-[48px] xl:auto-rows-[minmax(142px,auto)] xl:gap-y-[16px]">
          {items.map((item, i) => (
            <Capability
              key={item.title || i}
              n={String(i + 1).padStart(2, "0")}
              title={item.title}
              desc={item.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

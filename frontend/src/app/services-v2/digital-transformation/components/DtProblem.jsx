import Image from "next/image";
import withLineBreak from "../headingBreak";

const ACCENT_GRADIENT =
  "linear-gradient(33.035deg, #7784C5 33.662%, #B7BEED 48.02%, #6077EC 58.532%, #7683C5 85.197%)";

const ITEMS = [
  {
    n: "01",
    eyebrow: "The Reality",
    heading: "Here's the pattern behind most transformation engagements we take on.",
    body: "A business has grown past the systems it started with, a CRM that doesn't talk to the ERP, a reporting process that's really three people manually exporting spreadsheets every Friday, an approval workflow that lives in someone's email inbox because nobody ever automated it. None of this looks urgent day to day. It just quietly costs hours, then headcount, then eventually a competitive disadvantage nobody can point to a single cause for.",
  },
  {
    n: "02",
    eyebrow: "Why Now",
    heading:
      "By the time a business calls a digital transformation company, the cost of staying disconnected usually isn't theoretical anymore.",
    body: "It shows up as decisions made on data that's two weeks stale, as customer experience that breaks the moment a request touches more than one system, and as an engineering team spending more time patching integrations than building anything new. In 2026, with AI-driven automation genuinely capable of removing entire categories of manual work, the businesses still running on disconnected systems aren't just inefficient, they're the ones a faster-moving competitor is quietly pulling ahead of.",
  },
];

const RAIL_WORDS = ["Connected", "System", "Real", "Outcomes"];

const seq = (n, i) => n || String(i + 1).padStart(2, "0");

export default function DtProblem({ data } = {}) {
  const heading = data?.heading || "The Tools Aren’t the Problem,";
  const headingAccent =
    data?.headingAccent || "the Systems Underneath Them Never Talked to Each Other";
  const intro =
    data?.intro ||
    "A business can buy the best CRM, the best analytics platform, and the best automation tool on the market, and still be running on disconnected systems that nobody designed to work together.";
  const cardEyebrow = data?.cardEyebrow || "Our Positioning";
  const cardTitle =
    data?.cardTitle || "Akoode is not a software vendor selling you a platform and walking away.";
  const cardBody =
    data?.cardBody ||
    "We are a digital transformation company that redesigns the operating model first, then builds the technology to support it, so the tools actually get used the way they were supposed to.";
  const railWords = data?.railWords?.filter(Boolean)?.length
    ? data.railWords.filter(Boolean)
    : RAIL_WORDS;
  const items = data?.items?.length ? data.items : ITEMS;

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-[1901px] lg:grid lg:grid-cols-[54.655%_45.345%] lg:items-stretch">
        {/* ── Left: heading, sub, positioning card ── */}
        <div className="flex flex-col gap-[clamp(24px,2.42vw,46px)] px-5 py-8 sm:px-8 lg:justify-center lg:py-[2.576vw] lg:pl-[10.202%] lg:pr-[12.223%]">
          <h2 className="font-figtree font-semibold capitalize leading-[1.1] text-[24px] sm:text-[28px]">
            <span className="whitespace-pre-line text-[#1D1F4B]">{withLineBreak(heading)} </span>
            <span
              className="whitespace-pre-line bg-clip-text text-transparent"
              style={{ backgroundImage: ACCENT_GRADIENT }}
            >
              {headingAccent}
            </span>
          </h2>

          <p className="font-figtree font-normal leading-[1.1] text-[#1D1F4B] text-[14px] sm:text-[15px] lg:text-[16px]">
{intro}
          </p>

          <div className="relative w-full overflow-hidden rounded-[12.83px] bg-[#130E2A] px-[3.226%] pb-[6.638%] pt-[2.916%]">
            <div
              aria-hidden
              className="pointer-events-none absolute right-[1.86%] top-[3.7%] hidden aspect-[274/295] h-[87.3%] sm:block"
            >
              <Image
                src="/digital-transformation/card-wave.svg"
                alt=""
                fill
                sizes="280px"
                className="object-fill"
              />
            </div>

            <div className="relative flex flex-col gap-6 sm:flex-row sm:gap-0">
              <div className="sm:w-[66.28%]">
                <p className="font-figtree font-bold uppercase leading-[1.2] text-[#889AF5] text-[clamp(15px,1.1573vw,22px)]">
                  {cardEyebrow}
                </p>
                <p className="pt-[clamp(4px,0.3755vw,7.138px)] font-figtree font-semibold leading-[1.4] tracking-[-0.0122em] text-[#F0F2FF] text-[14px] sm:text-[15px] lg:text-[16px]">
                  {cardTitle}
                </p>
                <p className="pt-[clamp(6px,0.5752vw,10.935px)] font-figtree font-normal leading-[1.68] text-white text-[14px] sm:text-[15px] lg:text-[16px]">
                  {cardBody}
                </p>
              </div>

              <div className="flex items-stretch gap-[clamp(10px,0.859vw,16.33px)] sm:ml-[2.18%] sm:flex-1">
                <span aria-hidden className="w-px shrink-0 self-stretch bg-[#889AF5]" />
                <p className="flex flex-col justify-center font-figtree font-semibold uppercase leading-[1.2] text-[#889AF5] text-[clamp(14px,1.2625vw,24px)]">
                  {railWords.map((word, i) => (
                    <span key={i}>{word}</span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: the #E9EEFD reality panel ── */}
        <div className="flex items-center justify-center border-[#BDC5FD] bg-[#E9EEFD] px-5 py-8 sm:px-8 lg:border-l lg:px-0 lg:py-[2.576vw]">
          <div className="flex w-full flex-col gap-[clamp(28px,1.841vw,34.992px)] lg:w-[106.148%] lg:shrink-0">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-[clamp(16px,1.788vw,34px)] lg:w-[88.74%]"
              >
                <span
                  className="flex shrink-0 items-center justify-center rounded-full border-[0.8px] border-[#CDD3EE] bg-[#130E2A] font-figtree font-bold tracking-[-0.01em] text-[#889AF5] size-[clamp(44px,3.156vw,60px)] text-[14px] sm:text-[15px] lg:text-[16px]"
                >
                  {seq(item.n, i)}
                </span>

                <div className="min-w-0 pt-1 lg:w-[82.02%]">
                  <p className="font-figtree font-bold uppercase leading-[1.2] tracking-[0.15em] text-[#6679E4] text-[clamp(13px,1.0521vw,20px)]">
                    {item.eyebrow}
                  </p>
                  <h3 className="pt-[10px] font-figtree font-bold leading-[1.4] text-[#130E2A] text-[20px] sm:text-[22px]">
                    {item.heading}
                  </h3>
                  <p className="pt-[10px] font-figtree font-normal leading-[1.4] text-[#4A4565] text-[14px] sm:text-[15px] lg:text-[16px]">
                    {item.body}
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

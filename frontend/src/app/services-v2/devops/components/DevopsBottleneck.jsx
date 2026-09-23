import { Layers } from "lucide-react";
const HEADLINE_GRADIENT =
  "linear-gradient(34.06deg, #7784C5 33.66%, #B7BEED 48.02%, #6077EC 58.53%, #7683C5 85.2%)";

const DEFAULT_POINTS = [
  "Here's the pattern behind most of the DevOps engagements we take on. A team ships fast in year one on whatever infrastructure got them live, a single EC2 instance, a manual deploy script, maybe a Jenkins job someone half-configured and never touched again. It works, right up until it doesn't: a deploy breaks production at 2am, a traffic spike takes the whole site down, or a new engineer spends their first two weeks just figuring out how anything actually gets to production.",
  "By the time a business calls a DevOps company, the cost of the current setup usually isn't hypothetical anymore. It's measured in incident hours, in engineers who'd rather quit than touch the deploy script again, and in a roadmap that's quietly been rewritten around what the infrastructure can survive rather than what the product actually needs.",
  "In 2026, with cloud costs under real scrutiny and uptime expectations higher than ever, the businesses still running on accumulated infrastructure decisions are the ones losing both money and engineering time to a problem that was solvable eighteen months ago.",
];

export default function DevopsBottleneck({ data } = {}) {
  const heading = data?.heading || "Your Deploys Are Slow Because Nobody Ever Designed the Path,";
  const headingAccent = data?.headingAccent || "It Just Grew.";
  const intro =
    data?.intro ||
    "Most growing stores do not have a marketing problem. They have a platform problem wearing a marketing problem's clothes: slow pages, broken syncs, features the storefront simply refuses to support.";
  const cardTitle = data?.cardTitle || "Akoode is not a tools vendor who installs Kubernetes and leaves.";
  const cardBody =
    data?.cardBody ||
    "We are a cloud and DevOps company that owns the outcome, from a messy first assessment through infrastructure your team can actually run without us once it's stable.";
  const points = data?.points?.length ? data.points : DEFAULT_POINTS;

  return (
    <section className="relative overflow-hidden" style={{ background: "#130E2A" }}>
      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-y-14 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:gap-x-16 lg:px-16 lg:py-14 xl:gap-x-20">
        {/* ── Left column: heading, intro, glass card ── */}
        <div className="flex flex-col">
          <h2 className="mb-[18px] max-w-[724px] font-figtree font-normal leading-[1.2] text-[24px] sm:text-[28px] tracking-[-0.01em]">
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADLINE_GRADIENT }}>
              {heading}{" "}
            </span>
            <span className="text-white">{headingAccent}</span>
          </h2>

          <p className="max-w-[724px] font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px]">
            {intro}
          </p>

          <div className="relative mt-10 w-full max-w-[708px] lg:mt-auto">
            <div
              className="relative overflow-hidden rounded-[26px] px-[26px] py-[28px] sm:px-11 sm:py-9"
              style={{
                backgroundImage:
                  "radial-gradient(115% 115% at 50% 50%, rgba(17,17,20,0.55) 38%, rgba(74,83,144,0.30) 100%)",
                backdropFilter: "blur(94.38px)",
                WebkitBackdropFilter: "blur(94.38px)",
                boxShadow: "inset 0 0 55px rgba(102,121,228,0.12), 0px 3.78px 3.78px rgba(0,0,0,0.25)",
                border: "1px solid rgba(136,154,245,0.25)",
              }}
            >
              <div className="flex items-center gap-4 border-b-2 pb-6" style={{ borderColor: "#262D59" }}>
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl sm:size-12 sm:rounded-2xl"
                  style={{
                    backgroundImage:
                      "linear-gradient(158.14deg, rgba(255,255,255,0.05) 4.17%, rgba(255,255,255,0.02) 94.14%)",
                    border: "0.944px solid rgba(255,255,255,0.16)",
                  }}
                >
                  <Layers className="size-5 sm:size-6" style={{ color: "#C1C4D1" }} strokeWidth={1.5} />
                </div>
                <h3 className="font-figtree font-semibold leading-[1.2] text-white text-[18px] sm:text-[20px]">
                  {cardTitle}
                </h3>
              </div>

              <p className="mt-8 font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px]">
                {cardBody}
              </p>
            </div>
          </div>
        </div>
        <div className="relative flex flex-col gap-10 pl-10 sm:gap-12">
          <span
            aria-hidden
            className="absolute bottom-0 left-2 top-[12px] w-[2px]"
            style={{
              background: "linear-gradient(180deg, rgba(113,133,250,0.7) 0%, rgba(113,133,250,0.15) 100%)",
            }}
          />

          {points.map((text, i) => (
            <div key={i} className="relative flex flex-col gap-3">
              <span
                aria-hidden
                className="absolute left-[-37px] top-[5px] size-3 rounded-full sm:top-[7px]"
                style={{
                  background: "#7185FA",
                  boxShadow: "0px 0px 16px rgba(113,133,250,0.5)",
                }}
              />
              <p className="font-figtree font-semibold leading-[1.2] tracking-[0.065em] text-[16px] sm:text-[18px]" style={{ color: "#7185FA" }}>
                ( {String(i + 1).padStart(2, "0")} )
              </p>
              {/* Rail entries are authored in the admin's rich-text editor, so
                  they arrive as HTML and have to be rendered as such. */}
              <div
                className="font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px] [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const ACCENT_GRADIENT =
  "linear-gradient(8.028deg, #7784C5 33.662%, #B7BEED 48.02%, #6077EC 58.532%, #7683C5 85.197%)";
import withLineBreak from "../headingBreak";


const CARD_OFFSETS = [
  "lg:mt-[16.149vw]",
  "lg:mt-[13.098vw]",
  "lg:mt-[9.995vw]",
  "lg:mt-[6.944vw]",
  "lg:mt-[2.999vw]",
  "lg:mt-0",
];

const CAPABILITIES = [
  {
    n: "01",
    title: "Enterprise\nSystem Integration",
    body: 'CRMs, ERPs, and internal tools connected into one coherent system instead of a collection of platforms that each do their job in isolation. This is where most "transformation" projects quietly fail, and where we spend real engineering time.',
  },
  {
    n: "02",
    title: "Change Management and Adoption",
    body: "New systems that nobody actually uses aren't a transformation, they're an expensive shelf item. We build training and adoption plans alongside the technical rollout, not as an afterthought once the system's already live.",
  },
  {
    n: "03",
    title: "Process Redesign, Not Just Digitization",
    body: "Automating a broken process just makes the broken process faster. We redesign the workflow itself before automating it, so the outcome is actually better, not just quicker at being the same.",
  },
  {
    n: "04",
    title: "Data Governance and Quality",
    body: 'AI and analytics are only as good as the data underneath them. We build data quality and governance into the pipeline from the start, so "garbage in, garbage out" isn\'t the quiet failure mode nobody catches until the dashboard\'s already wrong.',
  },
  {
    n: "05",
    title: "Phased Rollout Strategy",
    body: "Transformation doesn't have to mean a risky big-bang cutover. We stage rollouts so the business keeps running while systems change underneath it, with rollback points built in at each stage.",
  },
  {
    n: "06",
    title: "Post-Launch Optimization",
    body: "The system that goes live on day one isn't the system that should still be running unchanged a year later. We stay engaged to tune, adjust, and improve based on how the transformation actually performs once real usage hits it.",
  },
];

const seq = (n, i) => n || String(i + 1).padStart(2, "0");

export default function DtCapabilities({ data } = {}) {
  const heading = data?.heading || "Capabilities Most Transformation\nvendors Treat as";
  const headingAccent = data?.headingAccent || "An Afterthought";
  const intro =
    data?.intro ||
    "Modernizing one system is straightforward. The capabilities below are what decide whether the whole transformation actually holds together a year later.";
  const items = (data?.items?.length ? data.items : CAPABILITIES).slice(0, CARD_OFFSETS.length);

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-[1901px] px-5 py-8 sm:px-8 lg:px-0 lg:py-[2.576vw] lg:pl-[4.261%] lg:pr-[2.946%]">
        <h2 className="font-figtree font-semibold capitalize leading-[1.02] text-[24px] sm:text-[28px]">
          <span className="whitespace-pre-line text-[#1D1F4B]">{withLineBreak(heading)} </span>
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: ACCENT_GRADIENT }}>
            {headingAccent}
          </span>
        </h2>

        <p className="mt-[clamp(10px,0.789vw,15px)] font-figtree font-normal leading-[1.1] text-[#1D1F4B] text-[14px] sm:text-[15px] lg:text-[16px] lg:w-[43.99%]">
{intro}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-0 lg:flex lg:items-start lg:gap-0">
          {items.map((item, i) => (
            <div
              key={i}
              className={`flex flex-col lg:w-[16.667%] lg:gap-[0.631vw] lg:pb-[2.104vw] lg:pt-[1.683vw] ${CARD_OFFSETS[i]}`}
            >
              <div className="pb-[clamp(10px,0.8417vw,16px)]">
                <span className="block font-figtree font-bold leading-[0.706] text-[#7186FA] text-[clamp(32px,2.683vw,51px)]">
                  {seq(item.n, i)}
                </span>
              </div>

              <div className="border-t-[3px] border-[#6679E4]">
                <div className="flex h-full flex-col bg-gradient-to-b from-[#DCE1FF] to-white p-[clamp(12px,0.8417vw,16px)] text-[#1D1F4B] text-[clamp(14px,1.2625vw,24px)] leading-[1.4]">
                  <p className="mb-[-0.2104vw] whitespace-pre-line font-figtree font-semibold lg:min-h-[4.787vw]">
                    {item.title}
                  </p>
                  <p className="font-figtree font-normal">{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

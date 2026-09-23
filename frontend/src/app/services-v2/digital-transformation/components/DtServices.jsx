import Image from "next/image";
import withLineBreak from "../headingBreak";

const ACCENT_GRADIENT =
  "linear-gradient(21.163deg, #7784C5 33.662%, #B7BEED 48.02%, #6077EC 58.532%, #7683C5 85.197%)";

const ROW_GRADIENT =
  "linear-gradient(165.467deg, #4D5FC4 8.128%, #6172CF 45.813%, #889AF5 91.872%)";

export const DT_SERVICES = [
  {
    n: "01",
    eyebrow: "Modernize",
    title: "Enterprise Application Modernization",
    desc: "Rebuilding legacy systems into cloud-native, scalable applications.",
  },
  {
    n: "02",
    eyebrow: "Migrate",
    title: "Cloud Migration and Optimization",
    desc: "Moving infrastructure to AWS, Azure, or GCP with a strategy behind the choice.",
  },
  {
    n: "03",
    eyebrow: "Insights",
    title: "Data Analytics and AI Integration",
    desc: "Building the data pipelines and AI-driven systems for real-time decisions.",
  },
  {
    n: "04",
    eyebrow: "Automate",
    title: "Robotic Process Automation",
    desc: "Automating the repetitive, rules-based work currently done by a person.",
  },
  {
    n: "05",
    eyebrow: "Connect",
    title: "Customer Experience Transformation",
    desc: "Redesigning digital touchpoints so the customer experience holds together across channels.",
  },
  {
    n: "06",
    eyebrow: "Protect",
    title: "Cybersecurity and Risk Management",
    desc: "Security built into the transformation itself, not audited after the fact.",
  },
];

const seq = (n, i) => n || String(i + 1).padStart(2, "0");

export default function DtServices({ data } = {}) {
  const heading = data?.heading || "Our Digital\nTransformation,";
  const headingAccent = data?.headingAccent || "Services";
  const intro =
    data?.intro ||
    "Every engagement gets scoped against a measurable outcome: fewer manual hours, faster decisions, lower operating cost, or a customer experience that finally holds together across channels.";
  const ctaText = data?.ctaText || "Talk to Our Team";
  const ctaLink = data?.ctaLink || "/contact-us";
  const services = data?.items?.length ? data.items : DT_SERVICES;

  return (
    <section className="relative w-full bg-white">
      <div className="mx-auto w-full max-w-[1901px] px-5 py-8 sm:px-8 lg:grid lg:grid-cols-[31.095%_68.905%] lg:py-[2.576vw] lg:pl-[4.261%] lg:pr-[6.417%]">
        <div className="flex flex-col gap-[clamp(24px,2.42vw,46px)] lg:sticky lg:top-[100px] lg:self-start">
          <h2 className="font-figtree font-semibold capitalize leading-[1.02] text-[24px] sm:text-[28px]">
            <span className="whitespace-pre-line text-[#1D1F4B]">{withLineBreak(heading)} </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: ACCENT_GRADIENT }}>
              {headingAccent}
            </span>
          </h2>
          <p className="font-figtree font-normal leading-[1.1] text-[#1D1F4B] text-[14px] sm:text-[15px] lg:text-[16px] lg:w-[81.06%]">
{intro}
          </p>

          <a
            href={ctaLink}
            className="group inline-flex items-center gap-[clamp(14px,1.473vw,28px)]"
          >
            <span
              className="flex shrink-0 items-center justify-center rounded-full border-[0.8px] transition-transform duration-300 group-hover:-translate-y-0.5 size-[clamp(44px,3.156vw,60px)]"
              style={{ background: "rgba(30,22,72,0.9)", borderColor: "rgba(136,154,245,0.35)" }}
            >
              <Image
                src="/digital-transformation/arrow-cta.svg"
                alt=""
                width={34}
                height={34}
                className="size-[clamp(24px,1.7885vw,34px)]"
              />
            </span>
            <span className="font-figtree font-semibold leading-[1.4] tracking-[-0.00535em] text-[#1D1F4B] text-[14px] sm:text-[15px] lg:text-[16px]">
              {ctaText}
            </span>
          </a>
        </div>

        {/* ── Right: the six service rows ── */}
        <div className="mt-10 flex flex-col gap-[clamp(8px,0.526vw,10px)] lg:mt-0">
          {services.map((service, i) => {
            return (
              <div
                key={i}
                style={{ "--row-grad": ROW_GRADIENT }}
                className="group flex items-stretch gap-[clamp(8px,0.842vw,16px)] lg:min-h-[clamp(120px,8.048vw,153px)]"
              >
                {/* Number strip */}
                <div className="flex shrink-0 flex-col items-center justify-center rounded-[12px] bg-[#5B6CCC] py-[13.997px] transition-colors duration-300 ease-out group-hover:bg-[#1D1F4B] gap-[clamp(20px,3.945vw,75px)] w-[clamp(32px,2.3146vw,44px)]">
                  <span className="font-figtree font-bold leading-[0.583] text-white text-[clamp(14px,1.2625vw,24px)]">
                    {seq(service.n, i)}
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 rounded-[3.031px] bg-white size-[clamp(4px,0.3189vw,6.063px)]"
                    style={{ boxShadow: "0px 0px 8px 0px #6679E4" }}
                  />
                </div>
                <div
                  className="relative flex min-w-0 flex-1 flex-col justify-center overflow-hidden rounded-[12px] border-[0.8px] bg-[#1D1F4B] px-[1.681%] py-5 lg:flex-row lg:items-center lg:py-[1.05vw]"
                  style={{ borderColor: "rgba(136,154,245,0.48)" }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[image:var(--row-grad)] transition-opacity duration-300 ease-out group-hover:opacity-0"
                  />
                  <div className="relative z-10 shrink-0 pr-[1.471%] lg:w-[24.373%]">
                    <p className="font-figtree font-semibold uppercase leading-[1.2] text-[clamp(12px,0.8417vw,16px)]" style={{ color: "rgba(255,255,255,0.62)" }}>
                      {service.eyebrow}
                    </p>
                    <p className="pt-[clamp(4px,0.3374vw,6.415px)] font-figtree font-semibold leading-[1.4] text-[#F0F2FF] text-[14px] sm:text-[15px] lg:text-[16px]">
                      {service.title}
                    </p>
                  </div>

                  <span
                    aria-hidden
                    className="relative z-10 hidden w-px shrink-0 bg-[#8795E1] lg:block lg:h-[clamp(60px,4.576vw,87px)]"
                  />

                  <div className="relative z-10 flex min-w-0 flex-1 items-center gap-[6px] pt-4 lg:pl-[2.523%] lg:pr-[3.2%] lg:pt-0">
                    <p className="min-w-0 flex-1 font-figtree font-normal leading-[1.4] text-[#F0F2FF] text-[14px] sm:text-[15px] lg:text-[16px]">
                      {service.desc}
                    </p>
                    <span
                      className="flex shrink-0 items-center justify-center rounded-[20px] border-[1.6px] h-[clamp(32px,2.104vw,40px)] w-[clamp(46px,3.156vw,60px)]"
                      style={{ borderColor: "rgba(255,255,255,0.3)" }}
                    >
                      <Image
                        src="/digital-transformation/arrow-row.svg"
                        alt=""
                        width={24}
                        height={24}
                        className="size-[clamp(16px,1.2625vw,24px)]"
                      />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

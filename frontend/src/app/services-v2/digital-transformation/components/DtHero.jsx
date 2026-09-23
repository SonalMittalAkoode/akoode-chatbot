import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import HeroBreadcrumb from "@/components/HeroBreadcrumb";

// Brightened a step over the source gradient so the accent words stay legible on #13103A.
const HEADLINE_GRADIENT =
  "linear-gradient(5.725deg, #95A1DC 33.662%, #CFD5F6 48.02%, #8093FF 58.532%, #94A0DC 85.197%)";

const CTA_GRADIENT = "linear-gradient(90deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)";

const STATS = [
  { value: "4.9", label: "Google Rating" },
  { value: "97%", label: "Client Retention" },
  { value: "15+", label: "Industries Served" },
  { value: "Global", label: "Delivery" },
];

const DEFAULT_PARAGRAPHS = [
  "Most digital transformation initiatives don't fail because the technology was wrong, they fail because nobody redesigned how the business actually works before buying the tools.",
  "Akoode is a digital transformation company that starts with the operational problem, not the software catalog. We help businesses modernize legacy systems, automate the workflows quietly eating engineering time, and build the data and AI foundation the next five years of growth actually needs.",
];

function splitHeading(full) {
  const words = String(full || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return { lead: "", middle: "", tail: "" };
  if (words.length === 1) return { lead: words[0], middle: "", tail: "" };
  if (words.length === 2) return { lead: words[0], middle: words[1], tail: "" };
  return {
    lead: words[0],
    middle: words.slice(1, -1).join(" "),
    tail: words[words.length - 1],
  };
}

export default function DtHero({ data } = {}) {
  const derived = splitHeading(data?.heading || "Digital Transformation Company");
  const heading = data?.headingAccent || data?.headingTail ? data?.heading || "" : derived.lead;
  const headingAccent = data?.headingAccent || derived.middle;
  const headingTail = data?.headingTail || derived.tail;
  const paragraphs = data?.paragraphs?.filter(Boolean)?.length
    ? data.paragraphs.filter(Boolean)
    : DEFAULT_PARAGRAPHS;
  const cta1Text = data?.cta1Text || "Get Free Consultation";
  const cta1Link = data?.cta1Link || "/contact-us";
  const cta2Text = data?.cta2Text || "View our work";
  const cta2Link = data?.cta2Link || "/case-studies";
  const stats = (data?.stats?.length ? data.stats : STATS).slice(0, 4);

  return (
    <section
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
      style={{ background: "#13103A" }}
    >
      <div className="relative mx-auto w-full max-w-[1901px] px-5 pb-14 pt-28 sm:px-8 lg:px-0 lg:pb-[2vw] lg:pt-[84px]">
        <div className="mb-4 lg:mb-[0.5vw] lg:pl-[4.313%]">
          <HeroBreadcrumb
            className="mb-0"
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: "Digital Transformation" },
            ]}
          />
        </div>

        <div className="relative mx-auto w-[80%] lg:w-[52.772%]">
          <div className="relative aspect-[1254/522] w-full">
            <Image
              src="/digital-transformation/hero-network.webp"
              alt="Cloud, data, systems and people feeding a central digital transformation core that outputs higher efficiency, smarter decisions, better experiences and sustainable growth"
              fill
              sizes="(max-width: 1023px) 80vw, 53vw"
              className="object-contain"
              priority
              fetchPriority="high"
            />
            <span
              aria-hidden
              className="dt-flow pointer-events-none absolute inset-0"
              style={{
                // A CSS url() bypasses next/image, so this must point at a
                // pre-shrunk asset or the browser fetches the full 309 KB
                // source a second time. The mask is read as luminance only,
                // so a 640px greyscale copy (38 KB) is indistinguishable here.
                WebkitMaskImage: "url(/digital-transformation/hero-network-mask.webp)",
                maskImage: "url(/digital-transformation/hero-network-mask.webp)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                maskMode: "luminance",
              }}
            >
              <span className="dt-flow-band absolute inset-y-0 block w-[38%]" />
            </span>
          </div>
        </div>

        <div className="mx-auto mt-8 flex flex-col items-center gap-[clamp(10px,0.789vw,15px)] lg:mt-[0.9vw] lg:w-[87.743%]">
          <h1
            className="bg-clip-text text-center font-figtree font-semibold capitalize tracking-[-0.01em] text-transparent text-[clamp(1.9rem,3.6vw,3.125rem)]"
            style={{ backgroundImage: HEADLINE_GRADIENT, lineHeight: 1.1 }}
          >
            {heading}
            {headingAccent && <span className="text-white">{` ${headingAccent}`}</span>}
            {headingTail && ` ${headingTail}`}
          </h1>

          <div className="mx-auto flex max-w-[68ch] flex-col gap-[0.75em] text-center font-figtree font-normal leading-[1.6] tracking-[0.005em] text-white/85 text-[15px] sm:text-[16px] lg:text-[17px]">
            {paragraphs.map((para, i) => (
              <div key={i} className="[&_p]:m-0" dangerouslySetInnerHTML={{ __html: para }} />
            ))}
          </div>

          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-4 lg:mt-2 lg:w-[48.201%] lg:flex-nowrap lg:gap-[clamp(12px,1.052vw,20px)]">
            <Link
              href={cta1Link}
              className="inline-flex items-center justify-center gap-2.5 rounded-full border-[1.5px] px-7 py-3.5 font-figtree font-medium leading-6 text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 text-[15px] sm:text-[16px] lg:h-[clamp(52px,3.788vw,72px)] lg:flex-1 lg:px-[26px] lg:py-0"
              style={{
                background: CTA_GRADIENT,
                borderColor: "#889AF5",
                filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.3))",
              }}
            >
              {cta1Text}
              <ChevronRight size={16} />
            </Link>

            {cta2Text && cta2Link && (
              <Link
                href={cta2Link}
                className="inline-flex items-center justify-center rounded-full border-[1.5px] px-7 py-3.5 font-figtree font-medium leading-6 text-white transition-colors duration-300 hover:bg-white/5 text-[15px] sm:text-[16px] lg:h-[clamp(52px,3.788vw,72px)] lg:flex-1 lg:px-[26px] lg:py-0"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.2)" }}
              >
                {cta2Text}
              </Link>
            )}
          </div>
        </div>

        <div className="mt-10 lg:mt-[clamp(20px,2.6vw,50px)]">
          <div className="mx-auto grid max-w-[560px] grid-cols-2 gap-y-6 sm:max-w-none sm:grid-cols-4 sm:gap-y-0 lg:flex lg:w-fit lg:items-center lg:justify-center">
            {stats.map((stat, i) => {
              const isLast = i === stats.length - 1;
              // Left-hand cell of each row in the 2-up mobile grid.
              const startsRow = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={[
                    "flex items-center justify-center border-[#889AF5] lg:h-[clamp(72px,5.47vw,104px)]",
                    startsRow ? "pl-0 pr-5" : "pl-5 pr-0",
                    "sm:px-[clamp(16px,1.315vw,25px)] lg:px-[clamp(20px,1.762vw,33.5px)]",
                    startsRow ? "border-r" : "border-r-0",
                    isLast ? "sm:border-r-0" : "sm:border-r",
                  ].join(" ")}
                >
                  <div className="flex flex-col items-center gap-[clamp(6px,0.631vw,12px)]">
                    <span className="font-figtree font-bold leading-[1.2] text-white text-[clamp(22px,1.578vw,30px)]">
                      {stat.value}
                    </span>
                    <span className="font-figtree font-medium leading-[1.43] text-white text-[clamp(13px,0.7364vw,14px)]">
                      {stat.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

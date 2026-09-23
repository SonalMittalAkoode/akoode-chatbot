import { FiCpu, FiLayers, FiTarget, FiUsers } from "react-icons/fi";
import { resolveIcon } from "@/app/country/_components/shared";
import resolveImageUrl from "@/utils/resolveImageUrl";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const DEFAULT_ADVANTAGES = [
  {
    number: "01",
    title: "AI-First Development",
    desc: "We don't just add AI features, we architect it into the foundation. Our systems use large language models to eliminate manual data management and enable advanced AI use cases.",
    Icon: FiCpu,
  },
  {
    number: "02",
    title: "End-to-End Platform Engineering",
    desc: "We design, build, and deploy complete real estate ecosystems from CRM and lead gen to analytics and transactions. Everything unified, nothing bolted on.",
    Icon: FiLayers,
  },
  {
    number: "03",
    title: "Revenue-Focused Architecture",
    desc: "Every technical decision is weighed for impact on conversion, retention, and lifetime value. Faster pages mean better leads. Better data means better decisions.",
    Icon: FiTarget,
  },
  {
    number: "04",
    title: "Domain-Deep Expertise",
    desc: "Our team builds exclusively for real estate. Markets, brokers, developers, investors — we understand the workflows, the jargon, and the incentives.",
    Icon: FiUsers,
  },
];

function NumberBox({ num }) {
  return (
    <div className="hidden md:flex w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] lg:w-[50px] lg:h-[50px] flex-shrink-0 bg-[#1D1F4B] rounded-[8px] items-center justify-center">
      <span className="text-white text-[16px] sm:text-[18px] lg:text-[20px] font-medium leading-none">
        {num}
      </span>
    </div>
  );
}

function IconBox({ Icon, imgSrc, label }) {
  return (
    <div className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] lg:w-[90px] lg:h-[90px] flex-shrink-0 bg-white rounded-[14px] border border-[#E4E4E4] flex items-center justify-center shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      {imgSrc
        ? <img src={imgSrc} alt={label || "Advantage icon"} className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] object-contain" />
        : <Icon className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] lg:w-[36px] lg:h-[36px]" color="#1D1F4B" />
      }
    </div>
  );
}

function TextBlock({ title, desc, description }) {
  const body = desc || description || "";
  return (
    <div className="flex-1 min-w-0 max-w-[460px]">
      <h3 className="text-[#101828] text-[17px] sm:text-[20px] lg:text-[24px] font-medium leading-[1.25] mb-1.5 sm:mb-2.5 m-0">
        {title}
      </h3>
      <div
        className="text-[#4A5565] text-[13px] sm:text-[15px] lg:text-[16px] font-normal leading-[1.45] [&_p]:m-0"
        dangerouslySetInnerHTML={{ __html: processHtmlLinks(body) }}
      />
    </div>
  );
}

function DottedConnector({ reverse = false }) {
  return (
    <div className="hidden md:flex items-center w-[clamp(140px,18vw,260px)] flex-shrink-0 mx-2 lg:mx-4">
      {reverse && (
        <span className="w-2.5 h-2.5 rounded-full bg-[#1D1F4B] flex-shrink-0" />
      )}
      <div className="flex-1 border-t-[2px] border-dotted border-[#1D1F4B]/55" />
      {!reverse && (
        <span className="w-2.5 h-2.5 rounded-full bg-[#1D1F4B] flex-shrink-0" />
      )}
    </div>
  );
}

export default function AkoodeAdvantageSection({ data }) {
  const advantages = data?.items?.length > 0 ? data.items : DEFAULT_ADVANTAGES;
  const eyebrow = data?.eyebrow;
  const heading = data?.heading;
  const subtitle = data?.subtitle || "We are a team of senior engineers who specialize in building AI systems for real estate companies. Our focus is data management and analysis, with top-notch AI capabilities.";
  const ctaLabel = data?.cta1Label || "Let's Discuss Your Platform";
  const ctaLink = data?.cta1Link || "#";

  return (
    <section className="bg-[#F8FAFF] py-16 sm:py-20 lg:py-24 font-figtree">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16">
        {/* Section Heading */}
        <div className="text-left md:text-center mb-10 sm:mb-12 lg:mb-16 max-w-[1100px] mx-auto">
          {eyebrow && (
            <div className="text-[#4A5565] text-[14px] sm:text-[16px] lg:text-[18px] font-medium capitalize mb-3 sm:mb-4">
              {eyebrow}
            </div>
          )}
          <h2 className="mb-4 text-[24px] sm:text-[28px] font-bold leading-tight sm:leading-8 capitalize">
            {heading ? (
              <span className="text-[#191A2E]">{heading}</span>
            ) : (
              <>
                <span className="text-[#191A2E]">
                  We Build Technology That Makes Real Estate Businesses{" "}
                </span>
                <span className="text-[#7784C5]">
                  Measurably Faster, Smarter, And More Profitable.
                </span>
              </>
            )}
          </h2>
          <div
            className="text-[#191A2E] text-sm sm:text-base font-normal capitalize leading-relaxed max-w-[960px] md:mx-auto [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: processHtmlLinks(subtitle) }}
          />
        </div>

        {/* Advantage Rows */}
        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
          {advantages.map((adv, idx) => {
            const isEven = idx % 2 === 1; // rows 02, 04
            const num = adv.number || String(idx + 1).padStart(2, "0");

            if (!isEven) {
              return (
                <div
                  key={num}
                  className="flex items-center gap-4 sm:gap-5 lg:gap-7 w-full"
                >
                  <NumberBox num={num} />
                  <TextBlock title={adv.title} desc={adv.desc} description={adv.description} />
                  <DottedConnector />
                  {(() => {
                    const isImg = adv.icon && (adv.icon.startsWith("/") || adv.icon.startsWith("http"));
                    return <IconBox Icon={resolveIcon(adv.icon, adv.Icon || FiCpu)} imgSrc={isImg ? resolveImageUrl(adv.icon) : null} label={adv.title} />;
                  })()}
                </div>
              );
            }

            return (
              <div
                key={num}
                className="flex items-center gap-4 sm:gap-5 lg:gap-7 w-full md:pl-[12%] lg:pl-[18%]"
              >
                {(() => {
                  const isImg = adv.icon && (adv.icon.startsWith("/") || adv.icon.startsWith("http"));
                  return <IconBox Icon={resolveIcon(adv.icon, adv.Icon || FiCpu)} imgSrc={isImg ? resolveImageUrl(adv.icon) : null} />;
                })()}
                <DottedConnector reverse />
                <TextBlock title={adv.title} desc={adv.desc} description={adv.description} />
                <NumberBox num={num} />
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-10 sm:mt-12 lg:mt-14">
          <a
            href={ctaLink}
            className="inline-flex items-center justify-center gap-2 w-full max-w-[440px] py-3.5 sm:py-4 px-6 sm:px-8 bg-gradient-to-r from-[#7784C5] via-[#4F60B5] to-[#4F5581] shadow-[0_10px_30px_rgba(0,0,0,0.25)] rounded-full outline outline-[1.5px] outline-[#889AF5] -outline-offset-[1.5px] no-underline text-white text-[15px] sm:text-[17px] font-medium leading-6 transition-transform hover:-translate-y-0.5"
          >
            {ctaLabel}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 5l5 5-5 5"
                stroke="white"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

import {
  FiLayers,
  FiMapPin,
  FiTrendingDown,
  FiSettings,
  FiUsers,
  FiEye,
  FiSearch,
  FiTool,
  FiServer,
} from "react-icons/fi";
import { resolveIcon } from "@/app/country/_components/shared";
import resolveImageUrl from "@/utils/resolveImageUrl";
import { sanitizeRichText } from "@/utils/safeRichText";

const DEFAULT_PAIN_POINTS = [
  {
    title: "Disconnected Systems",
    desc: "CRMs that don't talk to your selling platforms. Lead generation tools that can't sync your website or ads.",
    Icon: FiLayers,
  },
  {
    title: "Poor Lead Quality & Conversion",
    desc: "Paying for unqualified leads. No automated nurturing, and losing leads before they even contact you.",
    Icon: FiUsers,
  },
  {
    title: "No Real-Time Market Visibility",
    desc: "Inventory decisions made on gut feeling instead of data. Late to market, losing out on buyer demand.",
    Icon: FiEye,
  },
  {
    title: "Buyer Friction in Discovery Process",
    desc: "Properties buried in static PDFs or slow-load web pages. Buyers bounce before they even book a tour.",
    Icon: FiSearch,
  },
  {
    title: "Operational Overhead in Property Management",
    desc: "Manual tenant communication cause delays. Broken maintenance workflows and scattered data.",
    Icon: FiTool,
  },
  {
    title: "No Scalable Technology Foundation",
    desc: "Legacy software can't scale as you scale. Adding a location or product means building from scratch.",
    Icon: FiServer,
  },
];

const FloatingCard = ({ Icon, imgSrc, title, desc, className = "", children }) => (
  <div
    className={`relative w-[clamp(150px,17vw,220px)] bg-gradient-to-b from-[#576099] via-[#3A4066] to-[#1D2033] rounded-2xl p-3 sm:p-4 shadow-lg ${className}`}
  >
    {children}
    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#1D1F4B] rounded-[9px] flex items-center justify-center mb-2">
      {imgSrc
        ? <img src={imgSrc} alt={title || "Pain point icon"} className="w-[16px] h-[16px] object-contain brightness-0 invert" />
        : Icon ? <Icon size={15} color="white" /> : null
      }
    </div>
    <div className="text-white text-[12px] sm:text-[13.5px] font-semibold leading-[18px] mb-1">
      {title}
    </div>
    <div
      className="text-white/70 text-[10.5px] sm:text-[11.5px] font-normal leading-[15px] [&_p]:m-0 [&_a]:text-white [&_a]:underline [&_a]:underline-offset-2 [&_a]:break-words"
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(desc) }}
    />
  </div>
);

const DEFAULT_FLOATING_CARDS = [
  { DefaultIcon: FiLayers,      title: "Disconnected Systems",       desc: "Tools and platforms that don't integrate. Duplicate data entry and lost leads in every team silo.",             className: "" },
  { DefaultIcon: FiMapPin,      title: "Lack of Market Visibility",  desc: "Limited real-time insights into what's best to buy, sell, or invest in at any given moment.",                 className: "mt-[-25px]" },
  { DefaultIcon: FiTrendingDown,title: "Low Lead Conversion",        desc: "Poor targeting and slow follow-up lead pipelines are full of unqualified prospects and wasted budget.",       className: "" },
  { DefaultIcon: FiSettings,    title: "High Operational Overhead",  desc: "Manual processes and inefficient communication workflows slow down teams and reduce efficiency.",               className: "mt-[20px]" },
];

function resolveFloatingCard(cmsCard, def) {
  if (!cmsCard) return { Icon: def.DefaultIcon, imgSrc: null, title: def.title, desc: def.desc, className: def.className };
  const icon = cmsCard.icon || "";
  const isImg = icon && (icon.startsWith("/") || icon.startsWith("http"));
  return {
    Icon: isImg ? null : resolveIcon(icon, def.DefaultIcon),
    imgSrc: isImg ? resolveImageUrl(icon) : null,
    title: cmsCard.title || def.title,
    desc: cmsCard.desc || def.desc,
    className: def.className,
  };
}

export default function WhySection({ data }) {
  const painPoints = data?.items?.length > 0 ? data.items : DEFAULT_PAIN_POINTS;
  const heading = data?.heading;
  const subtitle = data?.subtitle || "Modern customers demand seamless experiences, but traditional processes and disconnected systems limit your ability to scale, optimize revenue, and deliver on expectations.";
  const rawBuildingImage = data?.image || "";
  const buildingImage = rawBuildingImage ? resolveImageUrl(rawBuildingImage) : "/industries_page/whyIndustry.webp";
  const buildingAlt = data?.imageAlt || "Real Estate Technology Challenges";
  const cmsFc = Array.isArray(data?.floatingCards) && data.floatingCards.length >= 4 ? data.floatingCards : null;
  const fc = DEFAULT_FLOATING_CARDS.map((def, i) => resolveFloatingCard(cmsFc ? cmsFc[i] : null, def));
  const defaultHeading = (
    <>
      <span className="text-[#191A2E]">Why Real Estate Businesses Are </span>
      <span className="text-[#7784C5]">Losing Revenue </span>
      <span className="text-[#191A2E]">To Outdated Technology</span>
    </>
  );

  return (
    <section className="bg-[#F8FAFF] py-16 lg:py-24 font-figtree">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16">
        {/* Heading — rendered ONCE as an H2 here (visible on mobile/tablet, hidden on desktop).
            Desktop version below is a styled div (not a heading) to avoid duplicate H2 in the DOM. */}
        <div className="lg:hidden mb-10">
          <h2 className="mb-4 text-[24px] sm:text-[28px] font-bold leading-tight sm:leading-8 capitalize">
            {heading ? <span className="text-[#191A2E]">{heading}</span> : defaultHeading}
          </h2>
          <div
            className="text-[#4A5565] text-sm sm:text-base leading-relaxed [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-8 lg:gap-10 xl:gap-14 items-start">
          {/* ── Left column ── */}
          <div className="hidden lg:block">
            {/* Desktop heading — styled like an H2 but not a heading element (the real H2 lives above). */}
            <div className="hidden lg:block mb-8 xl:mb-10" aria-hidden="true">
              <div className="mb-4 text-[24px] sm:text-[28px] font-bold leading-tight sm:leading-8 capitalize">
                {heading ? <span className="text-[#191A2E]">{heading}</span> : defaultHeading}
              </div>
              <div
                className="text-[#4A5565] text-sm sm:text-base leading-relaxed [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            </div>

            {/* Image + floating cards stage */}
            <div className="relative hidden lg:block">
              {/* Top row */}
              <div className="hidden lg:flex justify-between items-start relative z-[2] mb-[-80px]">
                <FloatingCard Icon={fc[0].Icon} imgSrc={fc[0].imgSrc} title={fc[0].title} desc={fc[0].desc} className={fc[0].className}>
                  <img src="/badge/left.svg" alt="Connector arrow linking pain point card" aria-hidden="true" className="hidden lg:block absolute pointer-events-none z-[3]"
                    style={{ top: "55%", left: "calc(100% - 12px)", width: "clamp(60px,6vw,80px)", height: "auto" }} />
                </FloatingCard>
                <FloatingCard Icon={fc[1].Icon} imgSrc={fc[1].imgSrc} title={fc[1].title} desc={fc[1].desc} className={fc[1].className}>
                  <img src="/badge/right.svg" alt="Connector arrow linking pain point card" aria-hidden="true" className="hidden lg:block absolute pointer-events-none z-[3]"
                    style={{ top: "55%", right: "calc(100% - 12px)", width: "clamp(60px,6vw,80px)", height: "auto" }} />
                </FloatingCard>
              </div>

              {/* Building image */}
              <div className="relative z-[0]">
                <img
                  src={buildingImage}
                  alt={buildingAlt}
                  className="w-full rounded-[20px] block object-contain"
                />
              </div>

              {/* Bottom row */}
              <div className="hidden lg:flex justify-between items-start relative z-[2] mt-[-40px]">
                <FloatingCard Icon={fc[2].Icon} imgSrc={fc[2].imgSrc} title={fc[2].title} desc={fc[2].desc} className={fc[2].className}>
                  <img src="/badge/left_bottom.svg" alt="Connector arrow linking pain point card" aria-hidden="true" className="hidden sm:block absolute pointer-events-none z-[3]"
                    style={{ bottom: "calc(100% - 65px)", left: "calc(100% - 20px)", width: "clamp(60px,6vw,85px)", height: "auto" }} />
                </FloatingCard>
                <FloatingCard Icon={fc[3].Icon} imgSrc={fc[3].imgSrc} title={fc[3].title} desc={fc[3].desc} className={fc[3].className}>
                  <img src="/badge/right_bottom.svg" alt="Connector arrow linking pain point card" aria-hidden="true" className="hidden sm:block absolute pointer-events-none z-[3]"
                    style={{ top: "-30%", right: "95%", width: "clamp(60px,6vw,60px)", height: "auto" }} />
                </FloatingCard>
              </div>
            </div>
          </div>

          {/* ── Right column: white pain-point cards ── */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {painPoints.map((item, idx) => {
              const isImg = item.icon && (item.icon.startsWith("/") || item.icon.startsWith("http"));
              const ItemIcon = isImg ? null : resolveIcon(item.icon, item.Icon || FiSettings);
              const desc = item.desc || item.description || "";
              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 sm:gap-5 bg-white rounded-2xl border border-[#E5E7EB] px-5 sm:px-6 py-4 sm:py-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                    {isImg
                      ? <img src={resolveImageUrl(item.icon)} alt={item.title || "Pain point icon"} className="w-[22px] h-[22px] object-contain" />
                      : <ItemIcon size={19} color="#4A5565" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#101828] text-[15px] sm:text-[16px] lg:text-[17px] font-semibold leading-[1.4] mb-1 m-0">
                      {item.title}
                    </h3>
                    <div
                      className="text-[#4A5565] text-[13.5px] sm:text-[14px] lg:text-[15px] font-normal leading-[1.55] [&_p]:m-0"
                      dangerouslySetInnerHTML={{ __html: desc }}
                    />
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

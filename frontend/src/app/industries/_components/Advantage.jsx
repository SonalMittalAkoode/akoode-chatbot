import {
  FiUsers,
  FiDollarSign,
  FiShield,
  FiTrendingUp,
  FiZap,
  FiTarget,
} from "react-icons/fi";
import { resolveIcon } from "@/app/country/_components/shared";
import resolveImageUrl from "@/utils/resolveImageUrl";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const DEFAULT_LEFT = [
  {
    icon: FiUsers,
    title: "More Qualified Leads",
    desc: "Smarter search and AI matching bring users who are ready to transact, not just browse.",
  },
  {
    icon: FiDollarSign,
    title: "Lower Operational Cost",
    desc: "Automation and AI eliminate manual overhead and let smaller teams scale farther.",
  },
  {
    icon: FiShield,
    title: "Investor Confidence",
    desc: "Data-driven insights and reporting demonstrate measurable impact, driving long-term commitments.",
  },
];

const DEFAULT_RIGHT = [
  {
    icon: FiTrendingUp,
    title: "Higher Listing Velocity",
    desc: "Buyers decide faster. Less time on-market. More deal closures.",
  },
  {
    icon: FiZap,
    title: "New Revenue Streams",
    desc: "Unlock new monetization through premium tools, listings, and marketplace fees.",
  },
  {
    icon: FiTarget,
    title: "Competitive Defensibility",
    desc: "Proprietary tech creates moats that competitors cannot cross.",
  },
];

function AdvantageItem({ icon, Icon: IconProp, title, desc, description, borderBottom }) {
  const isImg = typeof icon === "string" && (icon.startsWith("/") || icon.startsWith("http"));
  const ResolvedIcon = isImg ? null : (typeof icon === "string" ? resolveIcon(icon, FiZap) : (icon || IconProp || FiZap));
  const imgSrc = isImg ? resolveImageUrl(icon) : null;
  const body = desc || description || "";
  return (
    <div
      className={`flex items-start gap-4 lg:gap-5 px-5 sm:px-7 lg:px-9 py-6 sm:py-7 lg:py-8 ${
        borderBottom ? "border-b border-[#E4E4E4]" : ""
      }`}
    >
      <div className="w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] lg:w-[60px] lg:h-[60px] rounded-[12px] bg-[#1D1F4B] flex items-center justify-center flex-shrink-0">
        {imgSrc
          ? <img src={imgSrc} alt={title || "Advantage icon"} className="w-[28px] h-[28px] object-contain brightness-0 invert" />
          : <ResolvedIcon className="w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px]" color="white" />
        }
      </div>
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <h3 className="text-[#101828] text-[16px] sm:text-[18px] font-semibold leading-[1.35]">
          {title}
        </h3>
        <div
          className="text-[#4A5565] text-[14px] sm:text-[15px] leading-[22px] [&_p]:m-0"
          dangerouslySetInnerHTML={{ __html: processHtmlLinks(body) }}
        />
      </div>
    </div>
  );
}

export default function Advantage({ data }) {
  const allItems = data?.items?.length > 0 ? data.items : [...DEFAULT_LEFT, ...DEFAULT_RIGHT];
  const mid = Math.ceil(allItems.length / 2);
  const leftItems = allItems.slice(0, mid);
  const rightItems = allItems.slice(mid);
  const eyebrow = data?.eyebrow;
  const heading = data?.heading;
  const subtitle = data?.subtitle || "Technology Is Not A Cost Center. It's A Revenue Multiplier. Here's The Direct Business Impact Our Platforms Deliver:";
  return (
    <section
      className="w-full py-16 sm:py-20 lg:py-24 font-figtree"
      style={{
        background:
          "linear-gradient(180deg, #E8EAF6 0%, #F0F2FA 60%, #ffffff 100%)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="text-left md:text-center mb-10 sm:mb-12 lg:mb-14 max-w-[1100px] mx-auto">
          {eyebrow && (
            <p className="text-[#4A5565] text-[14px] sm:text-[16px] lg:text-[18px] font-medium capitalize mb-3 sm:mb-4">
              {eyebrow}
            </p>
          )}
          <h2 className="text-[#191A2E] text-[24px] sm:text-[28px] font-bold leading-tight sm:leading-8 capitalize mb-4">
            {heading ? (
              heading
            ) : (
              <>
                What A Well-Built Real Estate Platform Actually Does For{" "}
                <span className="text-[#7784C5]">Your Revenue</span>
              </>
            )}
          </h2>
          <div
            className="text-[#191A2E] text-sm sm:text-base font-normal capitalize leading-relaxed max-w-[920px] mx-auto [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: processHtmlLinks(subtitle) }}
          />
        </div>

        {/* White card */}
        <div className="bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(29,32,51,0.06)] max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left column */}
            <div>
              {leftItems.map((item, i) => (
                <AdvantageItem
                  key={i}
                  {...item}
                  borderBottom={i < leftItems.length - 1}
                />
              ))}
            </div>

            {/* Right column — separated by left border on md+, top border on mobile */}
            <div className="md:border-l border-t md:border-t-0 border-[#E4E4E4]">
              {rightItems.map((item, i) => (
                <AdvantageItem
                  key={i}
                  {...item}
                  borderBottom={i < rightItems.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

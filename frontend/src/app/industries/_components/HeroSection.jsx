import { FiLayout, FiTrendingUp } from "react-icons/fi";
import resolveImageUrl from "@/utils/resolveImageUrl";
import HeroBreadcrumb from "@/components/HeroBreadcrumb";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const statItems = [
  { value: '180+', label: 'Projects Delivered', sub: 'Across USA, Europe & India', border: true },
  { value: '97%', label: 'Client Retention', sub: 'Year-on-year since 2023', border: true },
  { value: '15+', label: 'Industries Served', sub: 'From FinTech to HealthTech and SaaS', border: false },
];

export default function HeroSection({ data, name }) {
  const heading = data?.heading;
  const crumbLabel = name || heading;
  const subtitle = data?.subtitle || "We engineer intelligent property platforms that attract more leads, close deals faster, and automate what slows your business down from marketplace apps to investment analytics systems.";
  const cta1Label = data?.cta1Label || "Book a Free Strategy Call";
  const cta1Link = data?.cta1Link || "#";
  const cta2Label = data?.cta2Label || "View Our Work";
  const cta2Link = data?.cta2Link || "#";

  // Building image
  const heroImage = data?.image ? resolveImageUrl(data.image) : "/industries_page/hero.webp";
  const heroImageAlt = data?.imageAlt || "AI-Powered Real Estate Software";

  // Top-right card (dynamic from items[0])
  const card = data?.items?.[0] || {};
  const cardTitle = card.cardTitle || "AI-Powered Solutions";
  const cardDesc = card.cardDesc || "Intelligent, scalable & future-ready software for modern businesses.";

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-gradient-to-b from-[#1F2336] to-[#130F25] font-figtree">
      <div className="w-full max-w-[92rem] mx-auto px-5 sm:px-8 lg:px-[clamp(1rem,3vw,3rem)] pt-36 pb-16 lg:pt-24 lg:pb-10 lg:h-[100dvh] flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-[clamp(2rem,2.5vw,3.5rem)]">

        {/* ── Left Column ── */}
        <div className="w-full lg:flex-none lg:w-[42%] pt-0 lg:pt-[clamp(0.5rem,1vw,1.5rem)]">
          {/* breadcrumb */}
          <HeroBreadcrumb
            className="!mb-7"
            items={[
              { label: "Home", href: "/" },
              { label: "Industries", href: "/industries" },
              { label: crumbLabel },
            ]}
          />

          <h1 className="mb-[clamp(0.75rem,1vw,1.25rem)] text-2xl md:text-[42px] font-semibold leading-[1.1] capitalize">
            {heading ? (
              <span className="text-white">{heading}</span>
            ) : (
              <>
                <span className="text-white">AI-Powered </span>
                <span className="text-[#7784C5]">Real Estate </span>
                <span className="text-white">Software Development Company</span>
              </>
            )}
          </h1>

          <div
            className="mb-[clamp(1.5rem,2.5vw,2.5rem)] text-white/90 text-sm md:text-[18px] font-normal leading-[1.5] [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: processHtmlLinks(subtitle) }}
          />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-[clamp(0.75rem,1.5vw,1.25rem)] mb-8 lg:mb-[clamp(2rem,3.5vw,4rem)] w-full lg:w-[90%]">
            <a
              href={cta1Link}
              className="flex-1 min-h-[56px] sm:min-h-0 sm:h-[clamp(3rem,3.5vw,3.75rem)] px-[clamp(1.25rem,2vw,2rem)] py-4 sm:py-0 bg-gradient-to-r from-[#7784C5] via-[#4F60B5] to-[#4F5581] shadow-[0px_10px_30px_rgba(0,0,0,0.30)] rounded-[40px] [outline:1.5px_solid_#889AF5] [outline-offset:-1.5px] flex items-center justify-center gap-2 no-underline text-white text-[clamp(0.8rem,0.95vw,1rem)] font-medium whitespace-nowrap"
            >
              {cta1Label}
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.5 5l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a
              href={cta2Link}
              className="flex-1 min-h-[56px] sm:min-h-0 sm:h-[clamp(3rem,3.5vw,3.75rem)] px-[clamp(1.25rem,2vw,2rem)] py-4 sm:py-0 rounded-[40px] [border:1.5px_solid_rgba(255,255,255,0.20)] flex items-center justify-center no-underline text-white text-[clamp(0.8rem,0.95vw,1rem)] font-medium whitespace-nowrap"
            >
              {cta2Label}
            </a>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap sm:flex-nowrap w-full lg:w-[90%]">
            {statItems.map((s, i) => (
              <div
                key={s.value}
                className={`flex-1 min-w-[110px] py-[clamp(0.75rem,1.2vw,1.25rem)] ${i > 0 ? 'sm:pl-[clamp(1rem,1.5vw,1.5rem)]' : ''} ${s.border ? 'sm:pr-[clamp(1rem,1.5vw,1.5rem)] sm:border-r sm:border-r-[#889AF5]' : ''}`}
              >
                <div className="text-white text-[clamp(1.25rem,1.6vw,1.875rem)] font-bold leading-tight mb-2">{s.value}</div>
                <div className="text-white text-[clamp(0.75rem,0.85vw,0.875rem)] font-medium leading-5">{s.label}</div>
                <div className="text-[#6A7282] text-[clamp(0.625rem,0.75vw,0.75rem)] font-normal leading-4">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="hidden lg:block w-full lg:flex-1 relative lg:h-[78vh]">

          {/* Hero Image — dynamic from admin */}
          <div className="absolute top-[16%] left-[10%] w-[84%] h-[82%] rounded-[24px] overflow-hidden border border-white/15 z-[1]">
            <img
              src={heroImage}
              alt={heroImageAlt}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* AI-Powered Solutions Card — dynamic from admin items[0] */}
          <div className="hidden md:block absolute top-0 right-0 w-[55%] lg:w-[43%] bg-gradient-to-b from-[#1D2033] via-[#2E3558] to-[#576099] rounded-[24px] [border:clamp(0.75rem,0.85vw,1rem)_solid_#1D2033] py-3 px-5 z-[2]">
            <div className="flex items-start justify-between">
              <span className="text-white text-[0.9375rem] font-semibold leading-snug pr-3 pt-0.5">
                {cardTitle}
              </span>
              <div className="w-11 h-11 bg-[#1D1F4B] rounded-xl border border-[#6679E4]/60 flex items-center justify-center flex-shrink-0">
                <FiLayout size={19} color="#6679E4" />
              </div>
            </div>
            <p className="text-white/70 text-[0.8125rem] leading-[1.55] mb-3">
              {cardDesc}
            </p>
            {/* Avatar initials */}
            <div className="flex items-center mb-3">
              {["P","J","S","A"].map((initial, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full border-2 border-[#232640] flex items-center justify-center flex-shrink-0 text-white text-[13px] font-bold${i > 0 ? ' -ml-3' : ''}`}
                  style={{ background: ["#7C3AED","#D97706","#059669","#2563EB"][i] }}
                >
                  {initial}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white text-[0.9375rem] font-semibold">110+</span>
              <span className="text-white/60 text-[0.8125rem]">Happy Clients</span>
            </div>
          </div>

          {/* Proven Business Impact Card — hardcoded */}
          <div
            className="hidden md:block absolute bottom-[-6%] left-0 w-[55%] lg:w-[43%] rounded-[24px] [border:clamp(0.75rem,0.85vw,1rem)_solid_#1D2033] py-3 px-5 z-[2]"
            style={{ background: 'linear-gradient(150deg,#576099 0%,#3A4066 45%,#1D2033 100%)' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 bg-[#1D1F4B] rounded-xl border border-[#6679E4]/60 flex items-center justify-center flex-shrink-0">
                <FiTrendingUp size={19} color="#6273DA" />
              </div>
              <span className="text-white text-[0.9375rem] font-semibold leading-snug">
                Proven Business Impact
              </span>
            </div>
            <p className="text-white/70 text-[0.8125rem] leading-[1.55] mb-3">
              Our client see measurable results within the first 90 days of launch.
            </p>
            <div className="flex gap-0.5 mb-2">
              {[1,2,3,4,5].map((i) => (
                <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="#FFB900">
                  <polygon points="10,2 12.2,7.5 18,7.5 13.5,11.5 15.5,18 10,14.5 4.5,18 6.5,11.5 2,7.5 7.8,7.5"/>
                </svg>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-white text-[0.9375rem] font-bold">5.0</span>
              <span className="text-white/60 text-[0.8125rem]">Rating on Clutch</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white text-[0.9375rem] font-bold">4.9</span>
              <span className="text-white/60 text-[0.8125rem]">Rating on Google</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function FounderCtaStrip({
  heading = "Talk Directly with Our Founder",
  body = "Discuss your software vision, AI roadmap, and delivery strategy with the team leading product engineering at Akoode.",
  ctaText = "Reserve Your Slot",
  ctaLink = "https://calendly.com/akhil-akoode/",
  imageSrc = "/aboutUs/akhil.webp",
  imageAlt = "Akhilesh K Verma, Founder of Akoode Technologies",
  headingClassName = "text-2xl font-bold leading-snug",
  bodyClassName = "text-base leading-[1.75]",
  buttonClassName = "text-[14px] sm:text-[15px] lg:text-[16px] font-bold",
  className = "",
}) {
  return (
    <div
      className={`rounded-[20px] p-6 sm:p-8 md:p-10 text-white relative overflow-hidden ${className}`}
      style={{ background: "#1D1F4B" }}
    >
      {/* Glow blobs */}
      <div
        className="pointer-events-none absolute -top-16 -left-16 w-56 h-56 rounded-full blur-3xl"
        style={{ background: "rgba(119,132,197,0.2)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 w-56 h-56 rounded-full blur-3xl"
        style={{ background: "rgba(79,96,181,0.15)" }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-10">

        {/* Founder image */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full scale-110"
              style={{ border: "2px solid rgba(136,154,245,0.4)" }}
            />
            <div
              className="h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 rounded-full overflow-hidden"
              style={{ border: "2px solid rgba(136,154,245,0.5)" }}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={128}
                height={128}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 text-center lg:text-left">
          <h3 className={`text-white m-0 mb-3 ${headingClassName}`}>
            {heading}
          </h3>
          <p className={`text-white/75 m-0 mx-auto lg:mx-0 max-w-[36rem] ${bodyClassName}`}>
            {body}
          </p>
        </div>

        {/* CTA button */}
        <div className="shrink-0 flex flex-col items-stretch lg:items-end">
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-white no-underline transition-all duration-300 whitespace-nowrap ${buttonClassName}`}
            style={{
              background:
                "linear-gradient(90deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)",
              outline: "1.5px solid #889AF5",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {ctaText}
            <ArrowRight size={14} />
          </a>
        </div>

      </div>
    </div>
  );
}

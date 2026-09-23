import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import HeroBreadcrumb from "@/components/HeroBreadcrumb";

const HEADLINE_GRADIENT =
  "linear-gradient(18.73deg, #7784C5 33.66%, #B7BEED 48.02%, #6077EC 58.53%, #7683C5 85.2%)";

// Primary CTA fill — Figma left→right gradient with the #889AF5 hairline border.
const CTA_GRADIENT = "linear-gradient(90deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)";

// The stats bar is a fixed design element on this template, exactly as on Web
// Development and Staff Augmentation: the marks are exported Figma SVGs, so the
// CMS supplies value/label only and the icon stays keyed to position.
const STAT_ICONS = [
  "/devops/icon-star.svg",
  "/devops/icon-users.svg",
  "/devops/icon-briefcase.svg",
  "/devops/icon-rocket.svg",
];

const DEFAULT_STATS = [
  { value: "4.9", label: "Google Rating" },
  { value: "97%", label: "Client Retention" },
  { value: "180+", label: "Clients Served" },
  { value: "15+", label: "Industries Served" },
];

const DEFAULT_PARAGRAPHS = [
  "Most engineering teams don't have a tooling problem, they have a deployment that takes an afternoon and a rollback that takes a war room. Akoode is a cloud and DevOps company that fixes the actual bottleneck: infrastructure that fights you instead of scaling with you. We build CI/CD pipelines, cloud architecture, and Kubernetes platforms that let engineers ship without holding their breath every release.",
];

export default function DevopsHero({ data, title } = {}) {
  const heading = data?.heading || "Cloud and DevOps";
  const headingAccent = data?.headingAccent || "Company";
  const paragraphs = (data?.paragraphs || []).filter(Boolean);
  const bodyParagraphs = paragraphs.length ? paragraphs : DEFAULT_PARAGRAPHS;
  const cta1Text = data?.cta1Text || "Get Free Consultation";
  const cta1Link = data?.cta1Link || "/contact-us";
  const cta2Text = data?.cta2Text || "View Our Work";
  const cta2Link = data?.cta2Link || "/case-studies";
  const crumbLabel = title || "Cloud and DevOps";
  const stats = (data?.stats?.length ? data.stats : DEFAULT_STATS).slice(0, 4);

  return (
    <section
      className="relative flex flex-col justify-center overflow-hidden lg:h-screen lg:min-h-[700px]"
      style={{ background: "#0E092B" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[52%] w-full overflow-hidden opacity-70 sm:h-[60%] lg:right-[3px] lg:top-px lg:h-[90.3%] lg:w-[65.8%] lg:rounded-r-[69px] lg:opacity-100"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.45) 14%, #000 34%), linear-gradient(180deg, #000 0%, #000 72%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.45) 14%, #000 34%), linear-gradient(180deg, #000 0%, #000 72%, transparent 100%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        <Image
          src="/devops/hero-bg.webp"
          alt=""
          fill
          sizes="(max-width: 1023px) 100vw, 66vw"
          className="object-cover"
          priority
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,9,43,0.35) 0%, rgba(14,9,43,0.85) 45%, #0E092B 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1901px] px-5 pb-14 pt-28 sm:px-8 lg:px-[88px] lg:pb-10 lg:pt-[100px]">
        <div className="flex w-full max-w-[746px] flex-col gap-[18px]">
          <HeroBreadcrumb
            className="mb-0"
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: crumbLabel },
            ]}
          />

          <h1
            className="font-figtree font-normal tracking-[-0.01em] text-[clamp(1.75rem,3.6vw,3.125rem)]"
            style={{ lineHeight: 1.08 }}
          >
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADLINE_GRADIENT }}>
              {heading}{" "}
            </span>
            {/* Figma stacks the accent on its own line; at the smaller live type
                scale the phrase would otherwise collapse onto one line. */}
            <br className="hidden lg:block" />
            <span className="text-white">{headingAccent}</span>
          </h1>

          {/* CMS paragraphs arrive as rich text, so render them as HTML the way
              the other services-v2 heroes do. */}
          <div className="flex flex-col gap-[1em] font-figtree font-normal leading-[1.6] text-white/80 text-[14px] sm:text-[16px] lg:text-[18px] [&_p]:m-0">
            {bodyParagraphs.map((p, i) => (
              <div key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>

          <div className="mt-[6px] flex max-w-[600px] flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={cta1Link}
              className="inline-flex flex-1 items-center justify-center gap-[5px] rounded-[40px] border-[1.5px] px-[28px] py-[12px] font-figtree text-[15px] font-medium leading-6 text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95"
              style={{
                background: CTA_GRADIENT,
                borderColor: "#889AF5",
                boxShadow: "0px 10px 15px rgba(0,0,0,0.3)",
              }}
            >
              {cta1Text}
              <ChevronRight size={16} />
            </Link>

            {cta2Text && cta2Link && (
              <Link
                href={cta2Link}
                className="inline-flex flex-1 items-center justify-center rounded-[40px] border-[1.5px] px-[28px] py-[12px] font-figtree text-[15px] font-medium leading-6 text-white transition-colors duration-300 hover:bg-white/5"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                {cta2Text}
              </Link>
            )}
          </div>
        </div>

        <div
          className="mt-10 rounded-[28px] px-6 py-6 lg:mt-8 lg:rounded-[36px] lg:px-[34px] lg:py-[28px]"
          style={{
            background: "rgba(29,32,51,0.28)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(3px)",
          }}
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-7 lg:grid-cols-4 lg:gap-x-10 xl:gap-x-16">
            {stats.map((stat, i) => (
              <div key={stat.label || i} className="flex items-center gap-3 sm:gap-5 lg:gap-6">
                <span
                  className="flex size-[44px] shrink-0 items-center justify-center rounded-[10px]"
                  style={{ background: "#1D1F4B", border: "0.8px solid #7186FA" }}
                >
                  <Image src={STAT_ICONS[i]} alt="" width={22} height={22} className="size-[22px]" />
                </span>
                <span className="flex flex-col gap-[3px]">
                  <span className="font-figtree text-[22px] font-bold leading-[1.2] text-white">
                    {stat.value}
                  </span>
                  <span className="font-figtree text-[13px] font-medium leading-[1.4] text-white/80">
                    {stat.label}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

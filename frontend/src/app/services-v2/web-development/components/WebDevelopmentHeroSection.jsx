"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import HeroBreadcrumb from "@/components/HeroBreadcrumb";

const HEADLINE_GRADIENT =
  "linear-gradient(26.78deg, #7784C5 33.662%, #B7BEED 48.02%, #6077EC 58.532%, #7683C5 85.197%)";

const CTA_GRADIENT = "linear-gradient(90deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)";

export default function WebDevelopmentHeroSection({ data } = {}) {
  const heading = data?.heading || "Powerful Web Solutions";
  const headingAccent = data?.headingAccent || "that scale with your Business.";
  const dynParas = (data?.paragraphs || []).filter(Boolean);
  const hasDynParas = dynParas.length > 0;
  const cta1Text = data?.cta1Text || "Get Free Consultation";
  const cta1Link = data?.cta1Link || "/post-requirement";
  const cta2Text = data?.cta2Text || "View our work";
  const cta2Link = data?.cta2Link || "/case-studies";

  return (
    <section className="relative overflow-hidden">

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 pt-20 sm:px-8 sm:pt-24 lg:px-16 lg:pt-28">
        <HeroBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "Web Development" },
          ]}
        />

        {/* ── Text row: headline hugs its own content width, paragraph fills the rest — Figma gap ≈ 33px ── */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-8">
          <h1 className="font-figtree font-normal text-[clamp(1.75rem,3.6vw,3.125rem)] tracking-[-0.01em] lg:max-w-[560px]" style={{ lineHeight: 1.08 }}>
            {data?.heading || data?.headingAccent ? (
              <>
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADLINE_GRADIENT }}>
                  {heading}{" "}
                </span>
                <span className="text-white">{headingAccent}</span>
              </>
            ) : (
              <>
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADLINE_GRADIENT }}>
                  Powerful Web Solutions
                  <br />
                </span>
                <span className="text-white">
                  that scale with your
                  <br />
                  Business.
                </span>
              </>
            )}
          </h1>

          <div className="flex w-full flex-col gap-[18px] lg:flex-1">
            <div className="flex flex-col gap-[1em] font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[16px] lg:text-[18px] [&_p]:m-0">
              {hasDynParas ? (
                dynParas.map((p, i) => <div key={i} dangerouslySetInnerHTML={{ __html: p }} />)
              ) : (
                <p className="m-0">
                  Most business websites are built once, admired for a week, then quietly ignored while they
                  lose speed, rankings and leads. Akoode is a web development company that builds the other
                  kind: fast, measurable platforms engineered to earn their keep. Our web development services
                  cover custom websites, web applications, full-stack builds and AI-powered platforms for
                  clients across India, UK, US and UAE.
                </p>
              )}
            </div>

            {/* CTAs */}
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-3">
              <Link
                href={cta1Link}
                className="inline-flex items-center justify-center gap-[5px] rounded-[40px] border-[1.5px] px-[20px] py-[10px] font-figtree font-medium leading-6 text-white text-[15px] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95"
                style={{ background: CTA_GRADIENT, borderColor: "#889AF5", boxShadow: "0px 10px 15px rgba(0,0,0,0.3)" }}
              >
                {cta1Text}
                <ChevronRight size={16} />
              </Link>
              {cta2Text && cta2Link && (
                <Link
                  href={cta2Link}
                  className="inline-flex items-center justify-center rounded-[40px] border-[1.5px] px-[20px] py-[10px] font-figtree font-medium leading-6 text-white text-[15px] transition-colors duration-300 hover:bg-white/5"
                  style={{ borderColor: "rgba(255,255,255,0.2)" }}
                >
                  {cta2Text}
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="relative mt-7 hidden w-full overflow-hidden rounded-t-[36px] sm:mt-10 sm:block sm:aspect-[2.4/1] lg:mt-13 lg:aspect-[1489/442] lg:w-[92.1%] lg:ml-[1.9%]">
          <Image
            src="/web_dev/ecommerce.png"
            alt="Akoode web development platform dashboard"
            fill
            priority
            sizes="(min-width: 1024px) 1489px, 100vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}

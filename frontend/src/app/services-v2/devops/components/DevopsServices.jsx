"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HEADING_GRADIENT =
  "linear-gradient(5.27deg, #7784C5 33.66%, #B7BEED 48.02%, #6077EC 58.53%, #7683C5 85.2%)";

const DEFAULT_SERVICES = [
  {
    title: "CI/CD Pipeline Implementation",
    desc: "Automated pipelines that test, build, and deploy code without a human manually running scripts or babysitting a release.",
  },
  {
    title: "Cloud Infrastructure and Migration",
    desc: "Moving to a cloud platform, or redesigning infrastructure you're already running on one, for availability, cost, and scale that actually match current traffic.",
  },
  {
    title: "Infrastructure as Code",
    desc: "Infrastructure defined in version-controlled scripts using tools like Terraform, rather than configured by hand through a cloud console.",
  },
  {
    title: "Containerization and Orchestration",
    desc: "Packaging applications in containers with Docker and managing them at scale with Kubernetes, so deployments behave the same way in every environment.",
  },
  {
    title: "DevSecOps and Compliance",
    desc: "Security checks, vulnerability scanning, and compliance validation built directly into the CI/CD pipeline rather than run as a separate audit after the fact.",
  },
  {
    title: "Monitoring and Observability",
    desc: "Real-time dashboards, logging, and alerting that tell you something's wrong before a customer does.",
  },
  {
    title: "Cloud Cost Optimization",
    desc: "Auditing and restructuring cloud spend so you're paying for the infrastructure you actually use, not what got provisioned once and never revisited.",
  },
  {
    title: "Site Reliability and On-Call Support",
    desc: "Ongoing infrastructure ownership after launch, incident response, capacity planning, and the ongoing work of keeping a system reliable as it grows.",
  },
];

export default function DevopsServices({ data } = {}) {
  const heading = data?.heading || "Our Cloud";
  const headingAccent = data?.headingAccent || "and";
  const headingTail = data?.headingTail || "DevOps Services";
  const intro =
    data?.intro ||
    "Most growing stores do not have a marketing problem. They have a platform problem wearing a marketing problem's clothes: slow pages, broken syncs, features the storefront simply refuses to support.";
  const items = data?.items?.length ? data.items : DEFAULT_SERVICES;
  const ctaText = data?.ctaText || "Talk to Our Team";
  const ctaLink = data?.ctaLink || "/contact-us";

  // Below lg: reveal 4 cards, then 2 more per "View more" press. The hidden
  // cards stay mounted and are hidden with CSS rather than sliced out of the
  // array — slicing would drop them from the DOM entirely, so crawlers (and
  // anyone reading the markup) would only ever see the first four.
  const [visibleCount, setVisibleCount] = useState(4);

  return (
    <section className="relative overflow-hidden" style={{ background: "#130E2A" }}>
      <div className="mx-auto w-full max-w-[1500px] px-5 py-12 sm:px-8 lg:px-16 lg:py-14">
        <div className="mx-auto w-full lg:w-[90%]">
          <div className="mb-12 flex flex-col gap-[18px] lg:mb-14">
            <h2 className="font-figtree font-normal leading-[1.2] text-[24px] sm:text-[28px] tracking-[-0.01em]">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADING_GRADIENT }}>
                {heading}{" "}
              </span>
              <span className="text-white">{headingAccent} </span>
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADING_GRADIENT }}>
                {headingTail}
              </span>
            </h2>

            <p className="font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px]">
              {intro}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-[30px] gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-12">
            {items.map((service, i) => (
              <div
                key={service.title}
                className={`flex-col border-t-2 pt-6 sm:pt-7 ${
                  i < visibleCount ? "flex" : "hidden lg:flex"
                }`}
                style={{ borderColor: "rgba(113,133,250,0.5)" }}
              >
                <p
                  className="mb-3 font-figtree font-semibold leading-[1.2] tracking-[0.065em] text-[16px] sm:text-[18px]"
                  style={{ color: "#889AF5" }}
                >
                  ( {String(i + 1).padStart(2, "0")} )
                </p>

                <h3 className="mb-3 font-figtree font-bold leading-[1.2] text-white text-[18px] sm:text-[20px] tracking-[-0.02em]">
                  {service.title}
                </h3>

                {/* Authored in the admin's rich-text editor so labels like
                    "What it is:" can be bolded, so it arrives as HTML. */}
                <div
                  className="font-figtree font-normal leading-[1.6] text-white text-[14px] sm:text-[15px] [&_p]:m-0 [&_p+p]:mt-2 [&_strong]:font-semibold [&_b]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: service.desc || "" }}
                />
                {/* Figma places the arrow ahead of the label, not after it.
                    mt-auto pins the link to the bottom of the (stretched) grid
                    cell so every CTA in a row shares one baseline.
                    A card's own CTA wins; blank falls back to the section CTA,
                    which falls back to the coded default. */}
                <Link
                  href={service.ctaLink || ctaLink}
                  className="group mt-auto inline-flex w-fit items-center gap-2 pt-4 font-figtree font-medium leading-[1.4] text-[14px] sm:text-[15px]"
                  style={{ color: "#7185FA" }}
                >
                  <ArrowRight size={18} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  {service.ctaText || ctaText}
                </Link>
              </div>
            ))}
          </div>

          {/* Small-screen only — at lg the grid already shows every card. */}
          {visibleCount < items.length && (
            <div className="mt-10 flex justify-center lg:hidden">
              <button
                type="button"
                onClick={() => setVisibleCount((v) => Math.min(v + 2, items.length))}
                className="inline-flex items-center justify-center rounded-[40px] border-[1.5px] px-[28px] py-[12px] font-figtree text-[15px] font-medium leading-6 text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95"
                style={{
                  background: "linear-gradient(90deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)",
                  borderColor: "#889AF5",
                  boxShadow: "0px 10px 15px rgba(0,0,0,0.3)",
                }}
              >
                View more
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

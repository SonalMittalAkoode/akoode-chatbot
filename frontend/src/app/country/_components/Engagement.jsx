"use client";

import { FiArrowRight, FiCheck } from "react-icons/fi";
import { engagementModels as DEFAULT_ENGAGEMENT_MODELS } from "./data";
import { rv, splitTitle } from "./shared";
import RichText from "./RichText";

export function Engagement({ data }) {
  const heading = data?.heading || "Flexible Engagement Models";
  const subtitle =
    data?.subtitle ||
    "Choose how you want to work with us. Every model comes with dedicated engineers, full IP ownership, and transparent communication.";
  
  // Popular card is first in DOM so mobile slider starts at it.
  // Desktop re-centers it via CSS order on .engagement-models-grid.
  const engagementModels = [
    DEFAULT_ENGAGEMENT_MODELS.find((m) => m.popular),
    DEFAULT_ENGAGEMENT_MODELS.find((m) => !m.popular && m.title === "Fixed Cost"),
    DEFAULT_ENGAGEMENT_MODELS.find((m) => !m.popular && m.title === "Staff Augmentation"),
  ].filter(Boolean);

  return (
    <section
      id="engagement"
      className="sbc-surface--dark-mesh w-full overflow-hidden px-[5%] py-10 md:py-14 lg:py-24"
    >
      <div className="max-w-[1240px] mx-auto relative z-[1]">
        <div
          className="mb-10 flex flex-col items-center text-center md:mb-16 sbc-section-head sbc-section-head--single-title max-w-none w-full gap-4"
          data-rv
          style={rv()}
        >
          <h2 className="sbc-h2 sbc-section-title text-white font-bold transition-colors duration-400 !m-0 mb-3 md:mb-4">
            {(() => {
              const { main, accent, suffix } = splitTitle(heading);
              return (
                <>
                  {main} {accent && <span className="sbc-heading-accent">{accent}</span>} {suffix}
                </>
              );
            })()}
          </h2>
          <RichText className="sbc-body-lg sbc-section-subtitle !m-0 px-3 font-medium !text-[rgba(245,245,255,0.98)]" html={subtitle} />
        </div>

        <div className="engagement-models-grid flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6 lg:items-stretch">
          {engagementModels.map((m, i) => {
            const isPopular = !!m.popular;
            const ctaText = m.ctaText;
            const ctaLink = m.ctaLink;

            return (
              <div
                key={i}
                className={`flex-none w-[90vw] lg:w-auto lg:flex-1 flex flex-col
                  relative overflow-hidden rounded-[20px] p-6 text-left md:p-8 lg:p-9
                  transition-all duration-500 ease-out will-change-transform
                  ${isPopular
                      ? "z-10 lg:scale-110 border border-[rgba(124,110,240,0.55)] bg-gradient-to-br from-[#1f2133] via-[#17182a] to-[#101121] shadow-[0_0_0_1px_rgba(124,110,240,0.35),0_20px_56px_rgba(0,0,0,0.5),0_0_40px_rgba(103,232,249,0.08)]"
                      : "z-0 border border-[rgba(255,255,255,0.12)] bg-[rgba(18,20,34,0.55)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  }`}
                data-rv
                style={rv(i * 0.1)}
              >
                {isPopular && (
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#7c6ef0] to-[#67e8f9]" />
                )}

                <div className="flex items-center justify-between gap-3 mb-3 md:mb-4">
                  <h3 className="sbc-h3 !m-0 min-w-0 flex-1 font-bold text-white">{m.title}</h3>
                  {isPopular && (
                    <span className="inline-flex flex-shrink-0 items-center rounded-full bg-[linear-gradient(180deg,#7784C5_0%,#495074_50%,#4F5581_100%)] px-4 py-1.5 text-[11px] font-bold leading-snug tracking-[0.3px] !text-white shadow-[0_2px_10px_-2px_rgba(15,18,40,0.35)] md:px-5 md:py-2 md:text-[12px]">
                      Most Popular
                    </span>
                  )}
                </div>

                <div className="relative mb-5 overflow-hidden rounded-[10px] border border-[rgba(157,143,245,0.22)] bg-[linear-gradient(105deg,rgba(124,110,240,0.14)_0%,rgba(103,232,249,0.05)_55%,rgba(18,20,34,0.2)_100%)] py-2 pl-4 pr-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] before:pointer-events-none before:absolute before:bottom-2 before:left-0 before:top-2 before:w-[3px] before:rounded-r before:bg-gradient-to-b before:from-[#9d8ff5] before:to-[#67e8f9] before:shadow-[0_0_12px_rgba(103,232,249,0.35)] before:content-[''] md:mb-6">
                  <p className="!m-0 max-w-full text-[10px] font-bold uppercase leading-snug tracking-[0.06em] !text-[#ddd8fc] md:text-[11px] md:leading-[1.45]">
                    {m.best}
                  </p>
                </div>

                <RichText className="sbc-body !m-0 mb-5 !text-white/90 md:mb-6 leading-relaxed" html={m.body} />

                <ul className="mb-6 flex list-none flex-col gap-3 p-0 md:mb-8 md:gap-4">
                  {m.perks.map((perk, idx) => (
                    <li
                      key={`${perk}-${idx}`}
                      className="flex items-start gap-3 text-[13px] leading-[1.5] tracking-[0.006em] text-[rgba(245,244,255,0.98)] md:text-[14px] md:leading-[1.55]"
                    >
                      <FiCheck
                        className="mt-px flex-shrink-0 text-[#67e8f9] md:mt-0.5"
                        size={15}
                        strokeWidth={2.75}
                        aria-hidden={true}
                      />
                      <span className="min-w-0 block leading-[1.5] md:leading-[1.55]">{perk}</span>
                    </li>
                  ))}
                </ul>

                {isPopular ? (
                  <a
                    href={ctaLink}
                    className="sbc-btn sbc-btn--cta group mt-auto w-full justify-center !no-underline h-[56px] text-[15px]"
                  >
                    {ctaText}
                    <FiArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                ) : (
                  <a
                    href={ctaLink}
                    className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full border border-[rgba(255,255,255,0.35)] bg-transparent h-[56px] text-[15px] font-semibold !leading-tight !text-white no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.55)] hover:bg-white/5"
                  >
                    {ctaText} <span aria-hidden>→</span>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

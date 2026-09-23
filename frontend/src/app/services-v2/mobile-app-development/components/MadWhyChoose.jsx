"use client";

import { m } from "framer-motion";
import { Sparkles } from "lucide-react";
import { resolveIcon } from "../iconResolver";
import madData from "../madData";

const BORDER = "1.5px solid #576099";

// Glowing junction dot where the connector meets the card border.
function Dot() {
  return (
    <span
      aria-hidden
      className="h-2.5 w-2.5 shrink-0 rounded-full"
      style={{ background: "#717DBB", boxShadow: "0 0 10px rgba(113,125,187,0.8)" }}
    />
  );
}

function IconBox({ Icon }) {
  return (
    <span
      className="hidden lg:flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
      style={{ border: BORDER, background: "rgba(255,255,255,0.02)" }}
    >
      <Icon size={26} style={{ color: "#B7BEED" }} />
    </span>
  );
}

// Card whose top border is cropped by the title (native fieldset/legend).
function WhyCard({ title, desc }) {
  return (
    <fieldset
      className="h-full rounded-2xl px-6 pb-6 pt-1"
      style={{ border: BORDER, background: "rgba(255,255,255,0.015)" }}
    >
      <legend className="px-3 font-figtree font-bold text-white text-[18px] sm:text-[21px] leading-tight">
        {title}
      </legend>
      <div
        className="font-figtree text-[14px] sm:text-[15px] leading-[1.7] pt-1 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:underline [&_strong]:font-semibold"
        style={{ color: "rgba(255,255,255,0.72)" }}
        dangerouslySetInnerHTML={{ __html: desc || "" }}
      />
    </fieldset>
  );
}

// Connector: dot at the card edge + short line running to the icon.
function Connector({ flip }) {
  return (
    <div className={`hidden lg:flex items-center w-16 shrink-0 ${flip ? "flex-row-reverse" : ""}`} aria-hidden>
      <Dot />
      <span className="flex-1 h-[1.5px]" style={{ background: "linear-gradient(90deg, #576099, #6077EC)" }} />
    </div>
  );
}

export default function MadWhyChoose({ data }) {
  const D = madData.whyChoose;
  const heading = data?.heading || D.heading;
  const headingAccent = data?.headingAccent || D.headingAccent;
  const headingTail = data?.headingTail || D.headingTail;
  const subtitle = data?.subtitle || D.subtitle;
  // Fall back to static cards when the backend doesn't persist them.
  const cards = (data?.cards?.length ? data.cards : D.cards).map((c) => ({
    title: c.title,
    desc: c.desc,
    Icon: resolveIcon(c.icon) || Sparkles,
  }));

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{ background: "linear-gradient(180deg, #14132A 0%, #18172C 100%)" }}
    >
      <div className="relative z-10 max-w-[1280px] mx-auto px-4">
        {/* heading — flows to ~2 rows, gradient on the accent */}
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center font-figtree font-bold text-[24px] sm:text-[28px] capitalize leading-tight mb-4 max-w-[820px] mx-auto"
        >
          <span className="text-white">{heading} </span>
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(90deg, #7784C5 0%, #B7BEED 50%, #6077EC 100%)" }}
          >
            {headingAccent}
          </span>{" "}
          <span className="text-white">{headingTail}</span>
        </m.h2>
        {subtitle && (
          <m.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center font-figtree text-[14px] sm:text-[15px] leading-[1.7] max-w-[680px] mx-auto mb-14 lg:mb-20"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {subtitle}
          </m.p>
        )}

        <div className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-1 py-2 lg:flex-col lg:gap-10 lg:overflow-visible lg:snap-none lg:p-0">
          {cards.map((card, i) => {
            const cardLeft = i % 2 === 0; // even → card on left, icon on right
            return (
              <m.div
                key={card.title || i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[46%] lg:w-full lg:flex lg:items-center lg:justify-start ${
                  cardLeft ? "" : "lg:flex-row-reverse"
                }`}
              >
                <div className="h-full w-full lg:h-auto lg:w-[66%]">
                  <WhyCard title={card.title} desc={card.desc} />
                </div>
                <Connector flip={!cardLeft} />
                <IconBox Icon={card.Icon} />
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

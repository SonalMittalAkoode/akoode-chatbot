"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { Gauge, FileCheck2, TrendingUp, LifeBuoy } from "lucide-react";
import { resolveIcon } from "@/app/country/_components/shared";

const BORDER = "1.5px solid #576099";

const DEFAULT_CARDS = [
  {
    title: "Performance-First Engineering",
    desc: "Every build is scoped against Core Web Vitals from day one, not patched in after launch when the numbers come back bad.",
    Icon: Gauge,
  },
  {
    title: "Transparent, Fixed-Scope Delivery",
    desc: "Price, timeline and scope agreed before a line of code gets written, and they stay agreed. Milestones you sign off, one by one.",
    Icon: FileCheck2,
  },
  {
    title: "SEO & Growth Built In",
    desc: "Structure, speed and content architecture that search engines reward, baked into the build rather than bolted on afterwards.",
    Icon: TrendingUp,
  },
  {
    title: "Long-Term Support, Not Just Launch",
    desc: "A named team that knows your codebase stays on after go-live for monitoring, patching and iteration, not a ticket queue of strangers.",
    Icon: LifeBuoy,
  },
];

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
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
      style={{ border: BORDER, background: "rgba(255,255,255,0.02)" }}
    >
      <Icon size={26} style={{ color: "#B7BEED" }} />
    </span>
  );
}

function WhyCard({ title, desc }) {
  return (
    <fieldset className="h-full rounded-2xl px-6 pb-6 pt-1" style={{ border: BORDER, background: "rgba(255,255,255,0.015)" }}>
      <legend className="px-3 font-figtree font-bold text-white text-[18px] sm:text-[21px] leading-tight">
        {title}
      </legend>
      <div
        className="font-figtree text-[14px] sm:text-[15px] leading-[1.7] pt-1 [&_p]:m-0"
        style={{ color: "rgba(255,255,255,0.72)" }}
        dangerouslySetInnerHTML={{ __html: desc }}
      />
    </fieldset>
  );
}

function Connector({ flip }) {
  return (
    <div className={`flex items-center w-16 shrink-0 ${flip ? "flex-row-reverse" : ""}`} aria-hidden>
      <Dot />
      <span className="flex-1 h-[1.5px]" style={{ background: "linear-gradient(90deg, #576099, #6077EC)" }} />
    </div>
  );
}

export default function WebDevelopmentWhyChooseSection({ data } = {}) {
  const heading = data?.heading || "Why Businesses Choose";
  const headingAccent = data?.headingAccent || "Akoode";
  const headingTail = data?.headingTail || "for Web Development";
  const subtitle =
    data?.subtitle ||
    "Not another agency with a portfolio full of screenshots. A team that ships platforms engineered to earn their keep, and stays on to prove it.";
  // CMS-authored cards store the icon as a string (from the admin's IconPicker,
  // e.g. "FiZap") — resolve it to a component. The hardcoded defaults already
  // carry real lucide components under `Icon`, so they're used as-is.
  const cards = data?.cards?.length
    ? data.cards.map((c) => ({ title: c.title, desc: c.desc, Icon: resolveIcon(c.icon, Gauge) }))
    : DEFAULT_CARDS;

  // The desktop zigzag and the mobile horizontal scroller used to both render
  // unconditionally (split only by `hidden lg:flex` / `lg:hidden`), shipping
  // every card's title + description twice in the HTML. Mount only one at a
  // time instead — default to mobile (matches SSR / mobile-first indexing),
  // swap to the desktop zigzag post-mount if the viewport actually is one.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24" style={{ background: "linear-gradient(180deg, #14132A 0%, #18172C 100%)" }}>
      <div className="relative z-10 max-w-[1280px] mx-auto px-4">
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center font-figtree font-bold text-[24px] sm:text-[28px] leading-tight mb-4 max-w-[820px] mx-auto"
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

        {/* ── desktop zigzag (lg+) ── */}
        {isDesktop && (
        <div className="flex flex-col gap-10">
          {cards.map((card, i) => {
            const cardLeft = i % 2 === 0;
            return (
              <m.div
                key={card.title || i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`flex items-center ${cardLeft ? "justify-start" : "justify-end"}`}
              >
                {cardLeft ? (
                  <>
                    <div className="w-[66%]">
                      <WhyCard title={card.title} desc={card.desc} />
                    </div>
                    <Connector />
                    <IconBox Icon={card.Icon} />
                  </>
                ) : (
                  <>
                    <IconBox Icon={card.Icon} />
                    <Connector flip />
                    <div className="w-[66%]">
                      <WhyCard title={card.title} desc={card.desc} />
                    </div>
                  </>
                )}
              </m.div>
            );
          })}
        </div>
        )}

        {/* ── mobile / tablet horizontal scroller (< lg) ── */}
        {!isDesktop && (
        <div className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-1 py-2">
          {cards.map((card, i) => (
            <m.div
              key={card.title || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[46%]"
            >
              <WhyCard title={card.title} desc={card.desc} />
            </m.div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}

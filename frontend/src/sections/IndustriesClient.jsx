"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SectionBadge from '../components/SectionBadge';

const headingText = "Tailored solutions for diverse industries";

const headingVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.02 },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const IndustriesClient = ({ industries = [], className = "" }) => {
  const [openIndex, setOpenIndex] = useState(null);

  // Each card: <Link> when an admin-published industry slug is available,
  // <div> otherwise. Keeps the static card visible even when no page exists yet.
  const DesktopCard = ({ ind, children }) => {
    const className =
      "group relative flex flex-col items-start pl-3 border-l-2 transition-all duration-300 overflow-hidden py-2 no-underline";
    const style = {
      borderImageSource: "linear-gradient(to bottom, #7C86FF, #7C86FF)",
      borderImageSlice: 1,
    };
    return ind.slug ? (
      <Link href={`/industries/${ind.slug}`} className={`${className} cursor-pointer`} style={style}>
        {children}
      </Link>
    ) : (
      <div className={className} style={style}>{children}</div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-[#f0f1f9] to-[#f7f8fc]">
      <section
        className={`py-4 md:py-8 mx-1 md:mx-6 lg:mx-10 rounded-[20px] lg:rounded-[3px] relative overflow-hidden font-figtree ${className}`}
        style={{ background: "linear-gradient(180deg, #1F2336 0%, #130F25 100%)" }}
      >
        <div className="container mx-auto px-3 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-4 md:mb-12">
            <div className="flex justify-center">
              <SectionBadge text="INDUSTRIES WE SERVE" />
            </div>
            <m.h2
              variants={headingVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[16px] md:text-[22px] font-bold text-white leading-tight mt-4 px-0 sm:px-0"
            >
              {headingText.split("").map((char, index) => (
                <m.span key={index} variants={letterVariants}>
                  {char}
                </m.span>
              ))}
            </m.h2>
          </div>

          {/* Desktop Grid Layout (Hidden on mobile) */}
          <m.div
            className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-y-6 gap-x-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {industries.map((ind) => (
              <m.div key={ind.title} variants={cardVariants} initial="rest" whileHover="hover" animate="rest">
                <DesktopCard ind={ind}>
                  {/* Hover Background Layer */}
                  <m.div
                    className="absolute inset-0 z-0 origin-left"
                    variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                    transition={{ duration: 0.5, ease: "circInOut" }}
                    style={{ background: "linear-gradient(90deg, #5F699D 0%, #1F2336 100%)" }}
                  />
                  <div className="relative z-10 w-full">
                    <div className="mb-2">
                      <Image src={ind.icon} alt={ind.title} width={24} height={24} className="w-6 h-6 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2 leading-tight">{ind.title}</h3>
                    <p className="text-[#94A3B8] text-sm leading-relaxed max-w-[180px] group-hover:text-gray-200 transition-colors">
                      {ind.desc}
                    </p>
                  </div>
                </DesktopCard>
              </m.div>
            ))}
          </m.div>

          {/* All industry descriptions rendered for crawlers regardless of
              accordion state — AnimatePresence removes collapsed bodies from
              the DOM so Google's mobile-first indexer would miss them. */}
          <div className="sr-only">
            {industries.map((ind) => (
              <div key={`seo-${ind.title}`}>
                <h3>{ind.title}</h3>
                <p>{ind.desc}</p>
                {ind.slug && <a href={`/industries/${ind.slug}`}>Explore {ind.title}</a>}
              </div>
            ))}
          </div>

          {/* Mobile Accordion Layout (Visible only on mobile) */}
          <div className="sm:hidden flex flex-col border-t border-white/10">
            {industries.map((ind, idx) => (
              <div key={ind.title} className="border-b border-white/10">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between py-5 text-left transition-colors hover:bg-white/5 active:bg-white/5 px-4"
                >
                  <div className="flex items-center gap-4">
                    <Image src={ind.icon} alt={ind.title} width={24} height={24} className="w-6 h-6" />
                    <span className="text-white font-bold text-[15px]">{ind.title}</span>
                  </div>
                  <m.div animate={{ rotate: openIndex === idx ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown size={18} className="text-white/60" />
                  </m.div>
                </button>
                <AnimatePresence>
                  {openIndex === idx && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 pt-1">
                        <p className="text-[#94A3B8] text-sm leading-relaxed">{ind.desc}</p>
                        {ind.slug && (
                          <Link
                            href={`/industries/${ind.slug}`}
                            className="inline-block mt-3 text-[#7C86FF] text-sm font-semibold no-underline"
                          >
                            Explore →
                          </Link>
                        )}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndustriesClient;

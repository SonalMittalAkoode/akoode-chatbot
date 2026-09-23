"use client";

import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import SectionBadge from '../../components/SectionBadge';
import { sideCategories, techStack } from './TechnologiesData';
import CategorySection from './CategorySection';

export default function Technologies() {
    const [activeCategory, setActiveCategory] = useState("Artificial Intelligence");
    const [activeTech, setActiveTech] = useState(null);


    const headingVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.02,
            },
        },
    };

    const letterVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
        },
    };


    const collectNames = (items) => {
      if (!Array.isArray(items)) return [];
      return items.map((it) => (it?.name || it?.title || "")).filter(Boolean);
    };

    return (
        <section className="bg-[#F8F9FF] py-8 md:py-14 font-figtree px-4 md:px-10 lg:px-30 min-h-screen">
            {/* SEO: every category's full tech stack rendered in DOM for crawlers —
                the visible UI only shows the active category at a time. */}
            <div className="sr-only">
                <h2>Technologies we use</h2>
                {Object.keys(techStack || {}).map((category) => {
                    const cat = techStack[category] || {};
                    const all = [
                        ...collectNames(cat.Technologies),
                        ...collectNames(cat.Languages),
                        ...collectNames(cat.Tools),
                    ];
                    if (all.length === 0) return null;
                    return (
                        <div key={`seo-tech-${category}`}>
                            <h3>{category}</h3>
                            <ul>
                                {all.map((name, i) => <li key={`${category}-${i}`}>{name}</li>)}
                            </ul>
                        </div>
                    );
                })}
            </div>

            <div className="max-w-7xl text-center mx-auto">
                <div className="mb-8">
                    <SectionBadge text="TECHNOLOGIES WE USE" />

                    <m.h2
                        variants={headingVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-xl md:text-[22px] font-bold text-[#1E293B] leading-tight mt-4 px-4"
                    >
                        {"Leveraging cutting-edge technologies to power your vision".split("").map((char, index) => (
                            <m.span key={index} variants={letterVariants}>
                                {char}
                            </m.span>
                        ))}
                    </m.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
                    {/* Left Sidebar: Lists (Desktop) / Accordion (Mobile) */}
                    <div className="flex flex-col gap-4">
                        {sideCategories.map((category) => (
                            <div key={category} className="w-full">
                                <button
                                    onClick={() => setActiveCategory(activeCategory === category ? (window.innerWidth < 1024 ? null : category) : category)}
                                    className={`group flex items-center gap-3 w-full transition-all duration-300 py-2 ${activeCategory === category
                                        ? "text-[#474972]"
                                        : "text-[#1E293B] hover:text-[#474972] hover:translate-x-1"
                                        }`}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                                            {activeCategory === category ? (
                                                <>
                                                    {/* Desktop Dot */}
                                                    <m.div layoutId="activeIndicator" className="hidden lg:block w-2 h-2 rounded-full bg-[#474972]" aria-hidden />
                                                    {/* Mobile Arrow (Expanded) */}
                                                    <m.div initial={{ rotate: 0 }} animate={{ rotate: 180 }} className="lg:hidden text-[#474972]" aria-hidden>
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </m.div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Desktop Ghost Dot Slot */}
                                                    <div className="hidden lg:block w-2 h-2 rounded-full bg-transparent" />
                                                    {/* Mobile Arrow (Collapsed) */}
                                                    <div className="lg:hidden text-[#64748b]" aria-hidden>
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <span className={`text-lg font-semibold text-left transition-all duration-300`}>
                                            {category}
                                        </span>
                                    </div>
                                </button>

                                {/* Mobile Content */}
                                <div className="lg:hidden overflow-hidden">
                                    <AnimatePresence>
                                        {activeCategory === category && (
                                            <m.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="pt-4 pb-6 pl-5"
                                            >
                                                <div className="flex flex-col gap-6">
                                                    <CategorySection title={techStack[category]?.titles?.Technologies || "Technologies"} items={techStack[category]?.Technologies} activeTech={activeTech} setActiveTech={setActiveTech} />
                                                    <CategorySection title={techStack[category]?.titles?.Languages || "Languages"} items={techStack[category]?.Languages} activeTech={activeTech} setActiveTech={setActiveTech} />
                                                    <CategorySection title={techStack[category]?.titles?.Tools || "Tools"} items={techStack[category]?.Tools} activeTech={activeTech} setActiveTech={setActiveTech} />
                                                </div>
                                            </m.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Content (Desktop Only) — sticky */}
                    <div className="hidden lg:flex flex-col gap-8 sticky top-24 p-3 overflow-visible">    <CategorySection title={techStack[activeCategory]?.titles?.Technologies || "Technologies"} items={techStack[activeCategory]?.Technologies} activeTech={activeTech} setActiveTech={setActiveTech} />
                        <CategorySection title={techStack[activeCategory]?.titles?.Languages || "Languages"} items={techStack[activeCategory]?.Languages} activeTech={activeTech} setActiveTech={setActiveTech} />
                        <CategorySection title={techStack[activeCategory]?.titles?.Tools || "Tools"} items={techStack[activeCategory]?.Tools} activeTech={activeTech} setActiveTech={setActiveTech} />
                    </div>
                </div>
            </div>
        </section>
    );
}

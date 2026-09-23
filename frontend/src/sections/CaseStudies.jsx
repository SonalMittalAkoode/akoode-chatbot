"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionBadge from "../components/SectionBadge";
import Button from "../components/Button";

const WORD_LIMIT = 50;

/** Truncate text to a word count; adds ellipsis only when truncated. */
function truncateToWords(text, limit = WORD_LIMIT) {
    if (!text || typeof text !== "string") return "";
    const words = text.trim().split(/\s+/);
    if (words.length <= limit) return text.trim();
    return words.slice(0, limit).join(" ") + "…";
}

const CaseStudies = ({ caseStudies: caseStudiesProp = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const headingText = "Real success stories showcasing our expertise and impact";

    const caseStudiesData = useMemo(() => {
        if (Array.isArray(caseStudiesProp) && caseStudiesProp.length > 0) {
            return caseStudiesProp;
        }
        return [];
    }, [caseStudiesProp]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % caseStudiesData.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + caseStudiesData.length) % caseStudiesData.length);
    };

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

    const currentStudy = caseStudiesData[currentIndex];
    const hasStudies = caseStudiesData.length > 0;

    if (!hasStudies) {
        return null;
    }

    const logoIsLocal = currentStudy?.logo?.startsWith("/") && !currentStudy?.logo?.startsWith("//");

    const stripHtml = (html) => String(html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

    return (
        <section className="bg-[#4b4d7b] py-8 md:py-20 text-white overflow-hidden">
            {/* SEO: every case study rendered in DOM for crawlers — the slider only
                shows one at a time. */}
            <div className="sr-only">
                <h2>Case studies</h2>
                {caseStudiesData.map((cs, i) => {
                    const title = cs?.title || cs?.name || "";
                    const summary = cs?.summary || cs?.description || cs?.shortDescription || "";
                    return (
                        <article key={`seo-cs-${cs?._id || cs?.id || cs?.slug || i}`}>
                            {title && <h3>{stripHtml(title)}</h3>}
                            {summary && <p>{stripHtml(summary)}</p>}
                        </article>
                    );
                })}
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-20">
                {/* Top Centered Section */}
                <div className="relative mb-8 md:mb-16">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <SectionBadge text="CASE STUDIES" />
                        </div>

                        <m.h2
                            variants={headingVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-[16px] md:text-[22px] font-bold text-white leading-tight mt-4"
                        >
                            {headingText.split("").map((char, index) => (
                                <m.span key={index} variants={letterVariants}>
                                    {char}
                                </m.span>
                            ))}
                        </m.h2>
                    </div>

                    {caseStudiesData.length > 1 && (
                        <div className="hidden lg:flex gap-4 justify-center lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 mt-8 lg:mt-0">
                            <button
                                onClick={prevSlide}
                                className="w-11 h-11 md:w-13 md:h-13 cursor-pointer rounded-full bg-white flex items-center justify-center text-[#474972] hover:opacity-90 transition active:scale-95 shadow-lg"
                                aria-label="Previous case study"
                            >
                                <ChevronLeft className="text-xs md:text-sm" size={16} aria-hidden />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-11 h-11 md:w-13 md:h-13 cursor-pointer rounded-full bg-white flex items-center justify-center text-[#474972] hover:opacity-90 transition active:scale-95 shadow-lg"
                                aria-label="Next case study"
                            >
                                <ChevronRight className="text-xs md:text-sm" size={16} aria-hidden />
                            </button>
                        </div>
                    )}
                </div>

                <div className="relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <m.div
                            key={currentStudy.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            drag={caseStudiesData.length > 1 ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={
                                caseStudiesData.length > 1
                                    ? (e, { offset }) => {
                                        const swipe = Math.abs(offset.x) > 50;
                                        if (swipe) {
                                            if (offset.x > 0) prevSlide();
                                            else nextSlide();
                                        }
                                    }
                                    : undefined
                            }
                            className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:justify-between items-center"
                        >
                            {/* Right column: Product type + client logo (match original design) */}
                            <div className="relative flex flex-col items-center order-1 lg:order-2 w-full">
                                <div className="text-center mb-6 lg:mb-8">
                                    <p className="text-sm md:text-base text-white/70 mb-1">
                                        {currentStudy.label}
                                    </p>
                                    <p
                                        className="text-3xl md:text-4xl lg:text-4xl font-dancing italic text-white leading-tight"
                                        style={{ fontFamily: "var(--font-satisfy)" }}
                                    >
                                        {currentStudy.transformText}
                                    </p>
                                </div>

                                {/* Logo area: white box with dashed border — image fits inside card */}
                                <div className="bg-white p-4 lg:p-6 rounded-[2rem] shadow-2xl w-full max-w-[260px] lg:max-w-[400px]">
                                    <div className="relative w-full aspect-[3/2] border-2 border-dashed border-[#585c9c] rounded-2xl overflow-hidden flex items-center justify-center bg-gray-50/50">
                                        {currentStudy.logo ? (
                                            logoIsLocal ? (
                                                <Image
                                                    src={currentStudy.logo}
                                                    alt="Client Logo"
                                                    fill
                                                    className="object-contain"
                                                    sizes="(max-width: 400px) 180px, (max-width: 768px) 224px, (max-width: 1024px) 252px, 352px"
                                                    priority={currentIndex === 0}
                                                    quality={60}
                                                />
                                            ) : (
                                                <Image
                                                    src={currentStudy.logo}
                                                    alt="Client Logo"
                                                    fill
                                                    className="object-contain"
                                                    sizes="(max-width: 400px) 180px, (max-width: 768px) 224px, (max-width: 1024px) 252px, 352px"
                                                    priority={currentIndex === 0}
                                                    quality={60}
                                                />
                                            )
                                        ) : (
                                            <span className="text-gray-400 text-sm">Logo</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Left column: title, highlight, Client Overview, CTA */}
                            <div className="space-y-4 lg:space-y-5 order-2 lg:order-1 text-center lg:text-left">
                                {/* <h3 className="text-xl md:text-2xl font-bold leading-tight max-w-[500px] mx-auto lg:mx-0 text-white">
                                    {currentStudy.title}
                                </h3> */}

                                {/* {currentStudy.highlight && (
                                    <div className="inline-block px-4 py-2 border border-white/30 bg-white/10 rounded-lg text-sm md:text-base text-white/90">
                                        {currentStudy.highlight}
                                    </div>
                                )} */}

                                <div className="space-y-3 lg:space-y-4">
                                    <h4 className="text-lg md:text-xl font-bold text-white">
                                        Client Overview
                                    </h4>
                                    <p className="text-white/80 text-[15px] md:text-base leading-[1.7] max-w-[500px] mx-auto lg:mx-0">
                                        {truncateToWords(currentStudy.overview) || "—"}
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        text="View Case Study"
                                        href={currentStudy.link}
                                        variant="black"
                                    />
                                </div>
                            </div>
                        </m.div>
                    </AnimatePresence>
                </div>

                {/* SEO: visually hidden list of all case studies so Googlebot
                    can crawl every entry. The slider above only renders the
                    active slide; this mirrors all entries into the DOM with
                    titles, overviews, and links without affecting layout. */}
                <ul
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        width: 1,
                        height: 1,
                        padding: 0,
                        margin: -1,
                        overflow: "hidden",
                        clip: "rect(0, 0, 0, 0)",
                        whiteSpace: "nowrap",
                        border: 0,
                    }}
                >
                    {caseStudiesData.map((study) => (
                        <li key={`seo-${study.id}`}>
                            <a href={study.link || "#"} tabIndex={-1}>
                                <span>{study.title || study.label}</span>
                                <span>{study.label}</span>
                                <span>{study.transformText}</span>
                                <span>{study.overview}</span>
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Mobile bullet pointers */}
                {caseStudiesData.length > 1 && (
                    <div className="flex justify-center gap-2 mt-6 lg:hidden">
                        {caseStudiesData.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setCurrentIndex(i)}
                                aria-label={`Go to case study ${i + 1}`}
                                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all duration-300"
                            >
                                <span
                                    className={`h-2 rounded-full transition-all duration-300 block ${i === currentIndex ? "w-6 bg-white" : "w-2 bg-white/40"
                                        }`}
                                    aria-hidden
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CaseStudies;

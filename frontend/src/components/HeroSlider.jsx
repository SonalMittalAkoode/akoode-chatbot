"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

/* ----------------------------- Slide Data ----------------------------- */

const SLIDES = [
    {
        badge: "Innovating tomorrow's solutions today",
        heading: {
            plain: "Step Into the Future with ",
            highlight: "AI Solutions",
        },
        subheading:
            "Delivering custom software, DevOps, SaaS & AI-driven digital transformation globally.",
        cta: {
            primary: "Request Your Free AI Consultation",
            secondary: "Watch Testimony",
            primaryLink: "/contact-us",
            secondaryLink: "https://www.youtube.com/playlist?list=PLZINKn-mhXSLtW2auFnZIBweoEqo1qtq9",
        },
    },
    {
        badge: "Your dream project, crafted to perfection",
        heading: {
            plain: "Harness The Full Potential Of ",
            highlight: "Artificial Intelligence",
        },
        subheading:
            "To Transform Your Business, Supercharge Productivity, and Stay Ahead in an Ever-Evolving World.",
        cta: {
            primary: "Explore AI Solutions Today",
            secondary: "Watch Testimony",
            primaryLink: "/contact-us",
            secondaryLink: "https://www.youtube.com/playlist?list=PLZINKn-mhXSLtW2auFnZIBweoEqo1qtq9",
        },
    },
    {
        badge: "Imagine it, we'll bring it to life",
        heading: {
            plain: "From Data To Decisions, We ",
            highlight: "Build Smarter Systems",
        },
        subheading:
            "That Think, Learn, and Act. Empower Your Business to Solve Complex Problems with Precision and Speed.",
        cta: {
            primary: "Get a Tailored AI Strategy",
            secondary: "Watch Testimony",
            primaryLink: "/contact-us",
            secondaryLink: "https://www.youtube.com/playlist?list=PLZINKn-mhXSLtW2auFnZIBweoEqo1qtq9",
        },
    },
];

/* ----------------------------- Animation ----------------------------- */

const slideVariants = {
    enter: (dir) => ({
        x: dir > 0 ? 20 : -20,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (dir) => ({
        x: dir > 0 ? -20 : 20,
        opacity: 0,
    }),
};

export default function HeroSlider() {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    // Skip entrance animation on first paint so LCP element is visible immediately.
    // useRef avoids a re-render; becomes true after the first slide auto-advance or click.
    const hasMounted = useRef(false);

    const next = useCallback(() => {
        hasMounted.current = true;
        setDirection(1);
        setIndex((prev) => (prev + 1) % SLIDES.length);
    }, []);

    const prev = useCallback(() => {
        hasMounted.current = true;
        setDirection(-1);
        setIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    }, []);

    /* ----------------------------- Autoplay ----------------------------- */

    useEffect(() => {
        const timer = setInterval(next, 7000);
        return () => clearInterval(timer);
    }, [next]);

    const slide = SLIDES[index];

    return (
        <>
            {/* All slides rendered statically for crawlers; only the active one
                is visible — AnimatePresence handles the visible swap above. */}
            <div className="sr-only">
                {SLIDES.map((s, i) => (
                    <div key={i}>
                        <span>{s.badge}</span>
                        {/* Not an <h1>: the page's single H1 lives in a content section.
                            These hero slide taglines stay crawlable as plain text. */}
                        <p>{s.heading.plain}{s.heading.highlight}</p>
                        <p>{s.subheading}</p>
                        <a href={s.cta.primaryLink}>{s.cta.primary}</a>
                    </div>
                ))}
            </div>

            {/* Badge */}
            <div className="h-[31px] px-4 flex items-center bg-white/5 border border-white/10 border-t-white/30 rounded-full backdrop-blur-sm overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                    <m.span
                        key={index}
                        custom={direction}
                        variants={slideVariants}
                        initial={hasMounted.current ? "enter" : false}
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="font-figtree text-white text-[10px] uppercase tracking-[0.2em] whitespace-nowrap"
                    >
                        {slide.badge}
                    </m.span>
                </AnimatePresence>
            </div>

            {/* Heading */}
            <div className="mt-8 max-w-[700px] text-left md:text-center">
                <AnimatePresence mode="wait" custom={direction}>
                    <m.div
                        key={index}
                        custom={direction}
                        variants={slideVariants}
                        initial={hasMounted.current ? "enter" : false}
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.5 }}
                        className="font-figtree leading-[1.2]"
                    >
                        <span className="block text-[26px] md:text-[50px] font-normal bg-gradient-to-b from-white/80 to-white bg-clip-text text-transparent">
                            {slide.heading.plain}
                        </span>
                        <span className="block mt-[12px] md:mt-0 text-[52px] md:text-[52px] font-extrabold text-white">
                            {slide.heading.highlight}
                        </span>
                    </m.div>
                </AnimatePresence>
            </div>

            {/* Subheading */}
            <div className="mt-4 max-w-[900px] text-left md:text-center">
                <AnimatePresence mode="wait" custom={direction}>
                    <m.p
                        key={index}
                        custom={direction}
                        variants={slideVariants}
                        initial={hasMounted.current ? "enter" : false}
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.5 }}
                        className="font-figtree text-sm md:text-base leading-relaxed bg-gradient-to-b from-white/80 to-white bg-clip-text text-transparent"
                    >
                        {slide.subheading}
                    </m.p>
                </AnimatePresence>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start md:items-center">
                <Link
                    href={slide.cta.primaryLink}
                    className="font-figtree flex items-center gap-2 px-6 h-10 bg-white rounded-full shadow-lg text-black text-sm font-medium hover:bg-opacity-90 transition"
                >
                    {slide.cta.primary}
                    <ChevronRight size={16} />
                </Link>

                <a
                    href={slide.cta.secondaryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-figtree flex items-center gap-2 px-5 h-10 rounded-full text-white text-sm font-medium bg-white/10 border border-white/20 hover:bg-white/20 transition"
                >
                    {slide.cta.secondary}
                    <Play size={14} />
                </a>
            </div>

            {/* Navigation (Desktop) */}
            <div className="absolute bottom-6 right-6 hidden md:flex gap-2">
                <button
                    onClick={prev}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/20 hover:bg-white/10 transition"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={22} className="text-white" aria-hidden />
                </button>
                <button
                    onClick={next}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/20 hover:bg-white/10 transition"
                    aria-label="Next slide"
                >
                    <ChevronRight size={22} className="text-white" aria-hidden />
                </button>
            </div>
        </>
    );
}

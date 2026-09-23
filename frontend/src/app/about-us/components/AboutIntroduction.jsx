"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from "next/image";
import { m } from "framer-motion";
import { Check } from "lucide-react";
import SectionBadge from "../../../components/SectionBadge";
import { getFrontendRatings } from '../../../api/frontend/rating';

export default function AboutIntroduction() {
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const data = await getFrontendRatings();
                setRatings(data);
            } catch (error) {
                console.error("Failed to fetch ratings:", error);
            }
        };
        fetchRatings();
    }, []);

    // Fallback static metrics if API data is unavailable
    const fallbackMetrics = useMemo(() => [
        { _id: 'f1', value: '4.9', suffix: '/5', title: 'Google Reviews' },
        { _id: 'f2', value: '97', suffix: '%', title: 'Customer Retention Rate' },
        { _id: 'f3', value: '100', suffix: '+', title: 'Active Clients Globally' },
        { _id: 'f4', value: '5', suffix: '/5', title: 'Clutch Reviews' }
    ], []);

    const activeMetrics = useMemo(() => (
        Array.isArray(ratings) && ratings.length > 0 ? ratings.slice(0, 4) : fallbackMetrics
    ), [ratings, fallbackMetrics]);

    return (
        <section className="py-10 md:py-20 bg-white overflow-hidden font-sans" aria-label="About Introduction">
            <div className="w-full mx-auto px-[2rem] md:px-[15px] min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px] min-[1400px]:max-w-[1320px]">

                {/* Header Section */}
                <div className="mb-8">
                    <SectionBadge text="AKOODE TECHNOLOGIES" />
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-7 lg:gap-20">
                    {/* Content Column - below image on mobile/tablet, left on desktop */}
                    <div className="order-2 lg:order-none lg:w-[40%] space-y-7 w-full">
                        <header>
                            <h2 className="text-[20px] md:text-[24px] leading-[32px] font-semibold text-[#2A2B44] mb-[15px]">
                                At Akoode Technologies, we see technology as more than progress —
                            </h2>
                            <p className="text-[18px] leading-[26px] font-medium text-[#37385C] tracking-tight">
                                It's the poetry of possibility, written in code.
                            </p>
                        </header>

                        <m.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-white rounded-[16px] p-6 shadow-[0px_4px_40px_0px_rgba(0,0,0,0.09)] border border-gray-100"
                        >
                            <div className="space-y-6 text-[#37385C]">
                                <p className="text-[16px] leading-[26px] font-medium">
                                    We are a new-generation AI and digital innovation company,
                                    reimagining how people and businesses experience technology. Our
                                    story is grounded in purpose and driven by a belief that intelligence
                                    must always stay human at heart.
                                </p>
                                <p className="text-[16px] leading-[26px] font-medium">
                                    Our story began with a simple yet powerful belief: that innovation
                                    should empower lives, not complicate them. Born from humble
                                    roots and shaped by global experience, Akoode Technologies was
                                    built to bridge human potential with intelligent systems.
                                </p>
                            </div>
                        </m.div>
                    </div>

                    {/* Image Visuals Column - on top on mobile/tablet, right on desktop */}
                    <div className="order-1 lg:order-none lg:w-[52%] relative group w-full" aria-hidden="true">
                        {/* Mobile & tablet: single Why Choose Us image */}
                        <m.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative w-full aspect-[4/3] sm:aspect-[1.5/1] rounded-md overflow-hidden shadow-lg lg:hidden"
                        >
                            <Image
                                src="/whyChooseUs/about-us.jpg"
                                alt="Why Choose Us - Office collaboration and workspace"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1023px) 100vw, 0px"
                            />
                        </m.div>

                        {/* Desktop: 3-panel grid */}
                        <div className="hidden lg:grid grid-cols-[1.3fr_1fr] grid-rows-2 gap-4 aspect-[1.5/1]">
                            {[
                                { src: "/whyChooseUs/pic1.webp", alt: "CEO", span: "row-span-2 shadow-xl" },
                                { src: "/whyChooseUs/pic2.webp", alt: "Collaboration", span: "shadow-lg" },
                                { src: "/whyChooseUs/pic3.webp", alt: "Precision", span: "shadow-lg" }
                            ].map((img, i) => (
                                <m.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: i * 0.2 }}
                                    className={`relative rounded-md overflow-hidden ${img.span} group after:absolute after:w-[200%] after:h-0 after:left-1/2 after:top-1/2 after:bg-white/30 after:-translate-x-1/2 after:-translate-y-1/2 after:-rotate-45 after:z-[1] after:transition-all after:duration-700 hover:after:h-[300%] hover:after:bg-transparent`}
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </m.div>
                            ))}
                        </div>

                        {/* Floating Credibility Badge */}
                        <m.div
                            initial={{ opacity: 0, scale: 0.8, translate: "-50%, -50%" }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                                opacity: { duration: 0.6, delay: 0.6 },
                                scale: { duration: 0.6, delay: 0.6 },
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }}
                            viewport={{ once: true }}
                            className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl border border-gray-100 flex items-center gap-4 max-w-[280px] z-20 w-[90%] md:w-auto"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#6369A1] to-[#2A2B44] flex items-center justify-center text-white shrink-0 shadow-lg" aria-hidden="true">
                                <Check size={20} />
                            </div>
                            <span className=" text-[#2A2B44] font-bold text-sm leading-tight">
                                Trusted AI & Software Development Company in India | USA
                            </span>
                        </m.div>

                        {/* Ornamental Decorations */}
                        {/* <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-gray-50 rounded-full blur-3xl opacity-50" />
                        <div className="absolute -z-10 -bottom-10 -left-10 w-60 h-60 bg-[#474972]/5 rounded-full blur-3xl opacity-50" /> */}
                    </div>
                </div>

                {/* CEO Voice Section */}
                <m.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="text-center bg-white rounded-[15px] mt-3 py-8 md:py-10 max-w-[800px] w-full mx-auto my-0 md:my-12 shadow-sm border border-gray-50 relative z-[3]"
                >
                    <blockquote className="font-satisfy text-[24px] md:text-[28px] leading-tight text-[#2A2B44]">
                        “We were never here just to build products —
                        <span className="block italic text-[#4A5175]">we’re here to build a world where technology feels human”</span>
                        <footer className="block mt-4 text-sm md:text-base font-sans font-semibold text-gray-900 border-t border-gray-100 pt-4 w-fit mx-auto">
                            - Akhilesh K Verma, CEO
                        </footer>
                    </blockquote>
                </m.div>

                {/* Key Performance Metrics */}
                <div className="pt-10 border-t border-gray-50">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
                        {activeMetrics.map((metric, index) => {
                            const isLast = index === activeMetrics.length - 1;
                            return (
                                <m.div
                                    key={metric._id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className={`relative text-center px-4 ${!isLast ? 'md:after:content-[""] md:after:absolute md:after:h-3/5 md:after:w-px md:after:right-0 md:after:top-1/2 md:after:-translate-y-1/2 md:after:bg-[#E6E6E9]' : ''
                                        }`}
                                >
                                    <h3 className="text-[30px] md:text-[36px] font-normal text-[#2A2B44] leading-tight mb-2">
                                        {metric.value}{metric.suffix}
                                    </h3>
                                    <p className="text-[14px] md:text-[16px] font-normal text-[#4A4B65] leading-snug lowercase first-letter:uppercase">
                                        {metric.title}
                                    </p>
                                </m.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

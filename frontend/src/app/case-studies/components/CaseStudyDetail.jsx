'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, m } from 'framer-motion';
import { processHtmlLinks } from "@/utils/processHtmlLinks";
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Check,
} from 'lucide-react';
import resolveImageUrl from '@/utils/resolveImageUrl';
import SectionBadge from '@/components/SectionBadge';
import Button from '@/components/Button';
import Image from 'next/image';
import {
    mergeWhyChooseUsShowcase,
    whyChooseUsShowcaseIsVisible,
    getWhyChooseUsIconComponent,
} from '@/utils/whyChooseUsShowcase';

export default function CaseStudyDetailSection({ caseStudy }) {
    if (!caseStudy) {
        return (
            <div className="py-[70px] max-md:py-[50px]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap">
                        <div className="w-full">
                            <div className="text-center py-12">
                                <h3 className="text-2xl font-bold mb-4">Case Study not found</h3>
                                <p className="text-gray-600 mb-6">The case study you are looking for might have been removed or is temporarily unavailable.</p>
                                <Link href="/case-studies" className="inline-block px-6 py-3 bg-[#6d4bfb] text-white font-medium rounded-lg hover:opacity-90 transition-all">
                                    Back to Case Studies
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Normalize data to ensure consistent rendering between server and client
    const normalizeString = (value) => {
        if (value === null || value === undefined) return '';
        return String(value);
    };

    const aboutImageUrl = resolveImageUrl(caseStudy.aboutimage) || '/images/case-study/default.jpg';
    const deliveredImageUrl = resolveImageUrl(caseStudy.deliveredimage || caseStudy.deliveredImage || caseStudy.casestudyimage) || '/caseStudy/Qualis.png';
    const processSteps = Array.isArray(caseStudy.processstep) ? caseStudy.processstep : [];
    const challengeSteps = Array.isArray(caseStudy.challengestep) ? caseStudy.challengestep : [];

    // Normalize all string fields to ensure consistent hydration
    const description = normalizeString(caseStudy.description);
    const abouttitle = normalizeString(caseStudy.abouttitle);
    const aboutdescription = normalizeString(caseStudy.aboutdescription);
    const challengetitle = normalizeString(caseStudy.challengetitle);
    const challengedescription = normalizeString(caseStudy.challengedescription);
    const deliveredtitle = normalizeString(caseStudy.deliveredtitle);
    const delivereddescription = normalizeString(caseStudy.delivereddescription);
    const resultstitle = normalizeString(caseStudy.resultstitle);
    const resultsdescription = normalizeString(caseStudy.resultsdescription);
    const resultssubdescription = normalizeString(caseStudy.resultssubdescription);
    const processtitle = normalizeString(caseStudy.processtitle);
    const processdescription = normalizeString(caseStudy.processdescription);
    const techtitle = normalizeString(caseStudy.techtitle);
    const techdescription = normalizeString(caseStudy.techdescription);
    const deliveredvideo = normalizeString(caseStudy.deliveredvideo);
    const quotedescription = normalizeString(caseStudy.quotedescription);
    const quotetitle = normalizeString(caseStudy.quotetitle);
    const quotename = normalizeString(caseStudy.quotename);
    const htmlLooksEmpty = (html) => !html || !String(html).replace(/<[^>]*>/g, '').trim();
    const showQuoteSection = !htmlLooksEmpty(quotedescription) || quotetitle.trim() || quotename.trim();

    const whychooseus = mergeWhyChooseUsShowcase(caseStudy.whychooseus);
    const showWhyChooseUsShowcase = whyChooseUsShowcaseIsVisible(whychooseus);
    const whyChooseUsFeatures = Array.isArray(whychooseus.features) ? whychooseus.features : [];
    const whyChooseUsFooter = Array.isArray(whychooseus.footer) ? whychooseus.footer : [];
    const textPlain = (s) => String(s || '').replace(/<[^>]*>/g, '').trim();
    const showWcuPulse =
        textPlain(whychooseus.pulseCaption) ||
        textPlain(whychooseus.pulseStat1Label) ||
        textPlain(whychooseus.pulseStat1Value) ||
        textPlain(whychooseus.pulseStat1Sub) ||
        textPlain(whychooseus.pulseStat2Label) ||
        textPlain(whychooseus.pulseStat2Value) ||
        textPlain(whychooseus.pulseStat2Sub) ||
        textPlain(whychooseus.pulseQualityTitle) ||
        textPlain(whychooseus.pulseQualitySubtitle);
    const showWcuFeatureCards = whyChooseUsFeatures.some(
        (f) => textPlain(f?.title) || textPlain(f?.description)
    );
    const aboutTitlePlain = abouttitle.replace(/<[^>]*>/g, '').trim();
    const country = normalizeString(caseStudy.country || caseStudy.countryName);
    const industry = normalizeString(caseStudy.industry || caseStudy.industryName);
    const techimages = Array.isArray(caseStudy.techimages) ? caseStudy.techimages : [];
    const deliveredTechStackLogos = techimages.map((img, idx) => ({
        src: resolveImageUrl(img),
        alt: `Tech ${idx + 1}`,
        width: 180,
        height: 72,
    }));
    const techStackCount = deliveredTechStackLogos.length;
    const mobileTechGridClass = techStackCount === 4 ? 'grid-cols-2' : techStackCount <= 3 ? 'grid-cols-3' : 'grid-cols-6';
    const getMobileTechCardSpan = (index) => {
        if (techStackCount === 4) return 'col-span-1';
        if (techStackCount <= 3) return 'col-span-1';
        if (techStackCount === 5) return index < 3 ? 'col-span-2' : 'col-span-3';
        if (techStackCount % 3 === 1 && index === techStackCount - 1) return 'col-span-6';
        if (techStackCount % 3 === 2 && index >= techStackCount - 2) return 'col-span-3';
        return 'col-span-2';
    };
    const getMobileTechImageHeight = () => {
        if (techStackCount <= 2) return 'h-[54px]';
        if (techStackCount === 3) return 'h-[48px]';
        if (techStackCount === 4) return 'h-[42px]';
        if (techStackCount === 5) return 'h-[36px]';
        return 'h-[40px]';
    };

    const normalizeServicesUsed = (value) => {
        if (Array.isArray(value)) {
            return value
                .map((item) => {
                    if (typeof item === 'string') return item.trim();
                    if (item && typeof item === 'object') {
                        return normalizeString(item.title || item.name || item.label).trim();
                    }
                    return '';
                })
                .filter(Boolean);
        }

        if (typeof value === 'string') {
            // Automatically insert a comma between adjacent anchor tags if the user forgot
            const processedValue = value.replace(/<\/a>\s*(?=<a\b)/gi, '</a>,');

            return processedValue
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
        }

        return [];
    };

    const servicesUsed = normalizeServicesUsed(
        caseStudy.servicesUsed ||
        caseStudy.serviceUsed ||
        caseStudy.services ||
        caseStudy.project
    );
    const showMetaStrip = Boolean(country || industry || servicesUsed.length);

    // Process slider state (mobile/tablet only — Framer Motion)
    const [activeStep, setActiveStep] = useState(0);
    const [stepDir, setStepDir] = useState(1);
    useEffect(() => {
        if (processSteps.length <= 1) return;
        const timer = setInterval(() => {
            setStepDir(1);
            setActiveStep(prev => (prev + 1) % processSteps.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [processSteps.length]);

    const goToStep = (next) => {
        const total = processSteps.length;
        setStepDir(next > activeStep || (activeStep === total - 1 && next === 0) ? 1 : -1);
        setActiveStep(next);
    };

    // Challenge cards slider (mobile/tablet only — same pattern as Process)
    const [activeChallenge, setActiveChallenge] = useState(0);
    const [challengeDir, setChallengeDir] = useState(1);
    useEffect(() => {
        if (challengeSteps.length <= 1) return;
        const timer = setInterval(() => {
            setChallengeDir(1);
            setActiveChallenge((prev) => (prev + 1) % challengeSteps.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [challengeSteps.length]);

    useEffect(() => {
        if (challengeSteps.length === 0) return;
        setActiveChallenge((i) => (i >= challengeSteps.length ? challengeSteps.length - 1 : i));
    }, [challengeSteps.length]);

    const goToChallenge = (next) => {
        const total = challengeSteps.length;
        setChallengeDir(
            next > activeChallenge || (activeChallenge === total - 1 && next === 0) ? 1 : -1
        );
        setActiveChallenge(next);
    };

    // Parse resultsdescription via DOMParser — client only, so start empty to avoid SSR flash
    const [resultsProse, setResultsProse] = useState('');
    const [resultItems, setResultItems] = useState([]);
    const [resultsMounted, setResultsMounted] = useState(false);

    useEffect(() => {
        if (!resultsdescription) {
            setResultsMounted(true);
            return;
        }
        const doc = new DOMParser().parseFromString(resultsdescription, 'text/html');
        const items = [];

        // Primary: admin uses .about-list-box structure
        const listBoxes = doc.querySelectorAll('.about-list-box');
        if (listBoxes.length > 0) {
            listBoxes.forEach(box => {
                const inner = box.querySelector('div');
                items.push(inner ? inner.innerHTML.trim() : box.innerHTML.trim());
            });
            doc.querySelectorAll('.row').forEach(el => el.remove());
        } else {
            // Fallback: standard <ul><li> structure
            const lis = doc.querySelectorAll('li');
            if (lis.length > 0) {
                lis.forEach(li => items.push(li.innerHTML.trim()));
                doc.querySelectorAll('ul, ol').forEach(el => el.remove());
            } else {
                // Ultimate Fallback: The WYSIWYG editor stripped custom class tags and returned basic paragraphs.
                // We extract paragraphs or line-break separated text into the pills grid.
                const paragraphs = Array.from(doc.querySelectorAll('p'));
                if (paragraphs.length > 1) {
                    paragraphs.forEach(p => {
                        const content = p.innerHTML.trim();
                        if (content) items.push(content);
                    });
                    doc.querySelectorAll('p').forEach(el => el.remove());
                } else if (paragraphs.length === 1 && paragraphs[0].innerHTML.includes('<br>')) {
                    const lines = paragraphs[0].innerHTML.split(/<br\s*\/?>/i);
                    lines.forEach(line => {
                        const trimmed = line.trim();
                        if (trimmed) items.push(trimmed);
                    });
                    doc.querySelectorAll('p').forEach(el => el.remove());
                }
            }
        }

        setResultItems(items);
        setResultsProse(doc.body.innerHTML.trim());
        setResultsMounted(true);
    }, [resultsdescription]);

    // Animation variants for staggered heading
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

    // Shared classes for admin-injected content (dangerouslySetInnerHTML)
    const dynamicContentClasses = "prose prose-lg max-w-none [&_h2]:text-3xl [&_h2]:md:text-[40px] [&_h2]:font-extrabold [&_h2]:mb-6 [&_h2]:text-gray-900 [&_h2]:leading-[1.2] [&_h3]:text-[42px] [&_h3]:font-bold [&_h3]:font-satisfy [&_h3]:text-gray-900 [&_h3]:mb-8 [&_h4]:text-2xl [&_h4]:font-bold [&_h4]:mb-4 [&_h5]:text-xl [&_h5]:font-bold [&_h5]:mb-3 [&_p]:mb-6 [&_p]:text-[#444] [&_p]:leading-[1.8] [&_p]:font-normal [&_ul]:list-disc [&_ul]:pl-6 [&_a]:text-[#6d4bfb] [&_a]:underline casestudy-slider-boxarea";
    const customListClasses = "custom-list";

    return (
        <div className="bg-white">
            {/* Intro / About — sp1: 70px top + bottom */}
            {(description || abouttitle || aboutdescription || caseStudy.aboutimage) && (
                <section className="pt-[70px] pb-[70px] max-md:pt-[50px] max-md:pb-[50px] relative z-[1]">
                    <div className="container mx-auto px-4 md:px-[70px] font-figtree ">
                        {/* Description card — mb-5 (~48px) to layout below */}
                        {description && description.trim() && (
                            <div className="max-w-full mx-auto mb-[50px] md:mb-[80px]">
                                <div className="bg-white rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.06)] border border-gray-100 p-8 md:pt-8 text-left relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div
                                            className={`${dynamicContentClasses} text-gray-800`}
                                            dangerouslySetInnerHTML={{ __html: processHtmlLinks(description) }}
                                        />
                                    </div>

                                    {showMetaStrip && (
                                        <div className="relative z-10 mt-2 pt-6 border-t border-gray-100">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                                                <div>
                                                    <p className="text-[12px] text-[#666] leading-none mb-3">Country</p>
                                                    <p className="text-[10px] md:text-[18px] font-medium text-[#4a4a4a] leading-tight">
                                                        {country || 'N/A'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-[12px] text-[#666] leading-none mb-3">Industry</p>
                                                    <p className="text-[10px] md:text-[18px] font-medium text-[#4a4a4a] leading-tight">
                                                        {industry || 'N/A'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-[12px] text-[#666] leading-none mb-3">Services Used</p>
                                                    <div className="flex flex-wrap gap-3">
                                                        {servicesUsed.length > 0 ? (
                                                            servicesUsed.map((service, index) => (
                                                                <span
                                                                    key={`${service}-${index}`}
                                                                    className="inline-flex items-center gap-2 rounded-[10px] border border-[#4b4e6a] bg-white px-4 py-2 text-[12px] text-[#6b6b6b] leading-none [&_a]:text-[#1a1a1a] [&_a]:font-medium hover:bg-gray-50 transition-colors cursor-pointer [&_a]:underline"
                                                                >
                                                                    <span dangerouslySetInnerHTML={{ __html: processHtmlLinks(service) }} />
                                                                    <ArrowRight size={14} className="text-[#6b6b6b]" />
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-[20px] md:text-[22px] font-medium text-[#4a4a4a] leading-tight">
                                                                N/A
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full opacity-50 -z-0"></div> */}
                                </div>
                            </div>
                        )}

                        {/* Client's Requirement — two-column layout */}
                        {(abouttitle || aboutdescription || caseStudy.aboutimage) && (
                            <div className="grid grid-cols-1 gap-10 lg:gap-16 items-center">

                                {/* IMAGE */}
                                {/* {caseStudy.aboutimage && (
                                    <div className="relative order-first lg:order-last">
                                        Image block (kept commented as is)
                                    </div>
                                )} */}

                                {/* TEXT CONTENT */}
                                <div className={`order-last lg:order-first ${caseStudy.aboutimage ? '' : 'w-full'}`}>

                                    {/* BADGE */}
                                    {caseStudy.title && (
                                        <SectionBadge text={`Case Study - ${caseStudy.title}`} />
                                    )}

                                    {/* TITLE + DESCRIPTION */}
                                    {(abouttitle?.trim() || aboutdescription?.trim()) && (
                                        <div className="mt-[26px] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">

                                            {/* TITLE */}
                                            {abouttitle?.trim() && (
                                                <m.h2
                                                    variants={headingVariants}
                                                    initial="hidden"
                                                    whileInView="visible"
                                                    viewport={{ once: true }}
                                                    className="text-[24px] md:text-[28px] font-bold text-[#1a1a1a] leading-[1.3]"
                                                >
                                                    {aboutTitlePlain.split("").map((char, index) => (
                                                        <m.span key={index} variants={letterVariants}>
                                                            {char}
                                                        </m.span>
                                                    ))}
                                                </m.h2>
                                            )}

                                            {/* DESCRIPTION */}
                                            {aboutdescription?.trim() && (
                                                <div
                                                    className={`${dynamicContentClasses} ${customListClasses}`}
                                                    dangerouslySetInnerHTML={{ __html: processHtmlLinks(aboutdescription) }}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Our Process — sp1: 70px top + bottom */}
            {processSteps.length > 0 && (
                <section className="pt-[0px] pb-[0px] md:pt-[20px] md:pb-[20px] relative overflow-hidden">
                    <div className="container mx-auto px-4 md:px-[70px] font-figtree relative z-10">
                        {/* Header: space18 (18px) between badge and title, space-margin60 (60px) below header */}
                        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-[60px]">
                            <SectionBadge text={'Our Process'} variant='service' />
                            <m.h2
                                variants={headingVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="text-2xl md:text-[32px] font-semibold text-[#1a1a1a] leading-tight mt-[18px]"
                            >
                                {(processtitle || 'Our Approach to Every Project').split("").map((char, index) => (
                                    <m.span key={index} variants={letterVariants}>
                                        {char}
                                    </m.span>
                                ))}
                            </m.h2>
                            {processdescription && processdescription.trim() && (
                                <div
                                    className="text-gray-600 text-[16px] leading-relaxed mt-[12px] whitespace-pre-line [&_a]:underline [&_a]:text-[#6d4bfb]"
                                    dangerouslySetInnerHTML={{ __html: processHtmlLinks(processdescription) }}
                                />
                            )}
                        </div>

                        {/* ── Desktop: 4-column grid with connector line ── */}
                        <div className={`hidden lg:grid relative gap-10 ${processSteps.length === 3 ? 'lg:grid-cols-3' : processSteps.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-4'}`}>
                            {processSteps.map((step, index) => {
                                return (
                                    <div key={step._id || index} className="relative min-h-[180px] pr-4">
                                        <div className="absolute left-[-4] top-[-8] text-[92px] font-bold leading-none text-black/8 select-none">
                                            {index + 1}
                                        </div>
                                        <div className="relative z-10 pt-12">
                                            <h5 className="text-[22px] font-bold text-[#1a1a1a] leading-tight mb-4">
                                                {step.title}
                                            </h5>
                                            {step.description && (
                                                <div
                                                    className="text-[16px] text-[#4f4f4f] leading-[1.7] [&_a]:underline [&_a]:text-[#6d4bfb]"
                                                    dangerouslySetInnerHTML={{ __html: processHtmlLinks(step.description) }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── Mobile / Tablet: Framer Motion slider ── */}
                        <div className="lg:hidden">
                            {/* Slide area */}
                            <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
                                <AnimatePresence initial={false} custom={stepDir} mode="wait">
                                    {(() => {
                                        const step = processSteps[activeStep];
                                        return (
                                            <m.div
                                                key={activeStep}
                                                custom={stepDir}
                                                initial={{ x: stepDir * 100 + '%', opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: stepDir * -100 + '%', opacity: 0 }}
                                                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                className="relative px-6 py-4"
                                            >
                                                <div className="absolute left-6 top-0 text-[72px] font-bold leading-none text-black/8 select-none">
                                                    {activeStep + 1}
                                                </div>
                                                <div className="relative z-10 pt-10">
                                                    <h5 className="text-[22px] font-bold text-[#1a1a1a] leading-tight mb-4">
                                                        {step?.title}
                                                    </h5>
                                                    {step?.description && (
                                                        <div
                                                            className="text-[16px] text-[#4f4f4f] leading-[1.7] [&_a]:underline [&_a]:text-[#6d4bfb]"
                                                            dangerouslySetInnerHTML={{ __html: processHtmlLinks(step.description) }}
                                                        />
                                                    )}
                                                </div>
                                            </m.div>
                                        );
                                    })()}
                                </AnimatePresence>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-center gap-4 ">
                                <button
                                    onClick={() => goToStep((activeStep - 1 + processSteps.length) % processSteps.length)}
                                    className="h-8 w-8 flex items-center justify-center rounded-full bg-[#eeeef8] text-[#474972] hover:bg-[#4c4e81] hover:text-white transition-colors"
                                    aria-label="Previous step"
                                >
                                    <ChevronLeft className="text-xs" size={12} />
                                </button>

                                <div className="flex gap-2 items-center">
                                    {processSteps.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => goToStep(i)}
                                            aria-label={`Step ${i + 1}`}
                                            className="rounded-full transition-all duration-300"
                                            style={{
                                                width: i === activeStep ? 24 : 10,
                                                height: 10,
                                                background: i === activeStep ? '#4c4e81' : '#d8d8ed',
                                            }}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => goToStep((activeStep + 1) % processSteps.length)}
                                    className="h-8 w-8 flex items-center justify-center rounded-full bg-[#eeeef8] text-[#474972] hover:bg-[#4c4e81] hover:text-white transition-colors"
                                    aria-label="Next step"
                                >
                                    <ChevronRight className="text-xs" size={12} />
                                </button>
                            </div>

                            {/* Step counter */}
                            <p className="text-center text-gray-400 text-[12px] mt-3 tracking-wide">
                                {activeStep + 1} / {processSteps.length}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Challenges — dark slate panel, centered header, 3-up cards (check + uppercase title) */}
            {/* {(challengetitle || challengedescription || challengeSteps.length > 0) && (
                <section className="bg-white py-[40px] md:py-[60px]">
                    <div className="container mx-auto px-4 md:px-[70px] font-figtree">
                        <div className="mx-auto max-w-6xl rounded-[24px] bg-[#4b4f82] px-6 py-10 shadow-[0_20px_60px_rgba(43,46,86,0.18)] md:px-12 md:py-14">
                            <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
                                {challengetitle && challengetitle.trim() ? (
                                    <h2
                                        className="text-2xl font-bold leading-tight text-white md:text-[30px] [&_*]:text-white [&_a]:text-white [&_a]:underline"
                                        dangerouslySetInnerHTML={{ __html: processHtmlLinks(challengetitle) }}
                                    />
                                ) : challengeSteps.length > 0 ? (
                                    <h2 className="text-2xl font-bold leading-tight text-white md:text-[30px]">
                                        Challenges We Faced
                                    </h2>
                                ) : null}
                                {challengedescription && challengedescription.trim() && (
                                    <div
                                        className="mt-4 text-[15px] leading-relaxed text-white/85 md:text-[16px] [&_*]:text-white/85 [&_a]:text-white [&_a]:underline"
                                        dangerouslySetInnerHTML={{ __html: processHtmlLinks(challengedescription) }}
                                    />
                                )}
                            </div>

                            {challengeSteps.length > 0 && (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {challengeSteps.map((challenge, index) => (
                                        <div
                                            key={challenge._id || index}
                                            className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/10 px-5 py-8 text-center"
                                        >
                                            <div
                                                className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15"
                                                aria-hidden
                                            >
                                                <Check className="text-white" size={20} strokeWidth={2.5} />
                                            </div>
                                            {challenge.title && (
                                                <h3 className="mb-4 text-[12px] font-bold uppercase leading-snug tracking-wide text-white md:text-[13px]">
                                                    {challenge.title}
                                                </h3>
                                            )}
                                            {challenge.description && (
                                                <div
                                                    className="text-[13px] leading-relaxed text-white/80 md:text-[14px] [&_p]:mb-2 [&_p:last-child]:mb-0 [&_a]:text-white [&_a]:underline"
                                                    dangerouslySetInnerHTML={{ __html: processHtmlLinks(challenge.description) }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )} */}
            {/* Challenges — sp10: 100px top + bottom; inner .cta-bg-area: p-[40px] */}
            {(challengetitle || challengedescription || challengeSteps.length > 0) && (
                <section className="bg-white py-[40px] md:py-[60px]">
                    <div className="container mx-auto px-4">
                        <div className="bg-[#4c4e81] rounded-3xl p-[40px] max-md:p-[24px]">
                            {/* Header — mb space before cards */}
                            <div className="max-w-3xl mx-auto text-center mb-[25px] md:mb-[40px]">
                                {challengetitle && challengetitle.trim() && (
                                    <h2 className="text-[24px] md:text-[30px] font-bold text-white mb-[12px] leading-tight [&_a]:underline [&_a]:text-white" dangerouslySetInnerHTML={{ __html: processHtmlLinks(challengetitle) }} />
                                )}
                                {challengedescription && challengedescription.trim() && (
                                    <div className="text-white/80 text-[15px] leading-relaxed [&_a]:underline [&_a]:text-white" dangerouslySetInnerHTML={{ __html: processHtmlLinks(challengedescription) }} />
                                )}
                            </div>

                            {challengeSteps.length > 0 && (
                                <>
                                    {/* ── Desktop: 3-column grid ── */}
                                    <div className="hidden lg:grid grid-cols-3 gap-5">
                                        {challengeSteps.map((challenge, index) => (
                                            <div key={challenge._id || index} className="bg-[#5a5c90] rounded-2xl overflow-hidden flex flex-col">
                                                <div className="flex justify-center pt-8 pb-5">
                                                    <div className="h-12 w-12 flex items-center justify-center bg-[#9ea0bb]/70 rounded-full">
                                                        <Check className="text-white" size={20} />
                                                    </div>
                                                </div>
                                                {challenge.title && (
                                                    <div className="bg-[#9ea0bb]/50 px-6 py-3 text-center">
                                                        <h5 className="text-[16px] font-bold text-white uppercase tracking-widest leading-snug">{challenge.title}</h5>
                                                    </div>
                                                )}
                                                {challenge.description && (
                                                    <div className="px-6 py-5 text-center text-white/80 text-[14px] leading-relaxed [&_a]:underline [&_a]:text-white" dangerouslySetInnerHTML={{ __html: processHtmlLinks(challenge.description) }} />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* ── Mobile / Tablet: Framer Motion slider ── */}
                                    <div className="lg:hidden">
                                        {/* Slide area */}
                                        <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: 260 }}>
                                            <AnimatePresence initial={false} custom={challengeDir} mode="wait">
                                                <m.div
                                                    key={activeChallenge}
                                                    custom={challengeDir}
                                                    initial={{ x: challengeDir * 100 + '%', opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    exit={{ x: challengeDir * -100 + '%', opacity: 0 }}
                                                    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                    className="bg-[#5a5c90] rounded-2xl overflow-hidden flex flex-col"
                                                >
                                                    <div className="flex justify-center pt-8 pb-5">
                                                        <div className="h-12 w-12 flex items-center justify-center bg-[#9ea0bb]/70 rounded-full">
                                                            <Check className="text-white" size={20} />
                                                        </div>
                                                    </div>
                                                    {challengeSteps[activeChallenge]?.title && (
                                                        <div className="bg-[#9ea0bb]/50 px-6 py-3 text-center">
                                                            <h5 className="text-[14px] font-bold text-white uppercase tracking-widest leading-snug">
                                                                {challengeSteps[activeChallenge].title}
                                                            </h5>
                                                        </div>
                                                    )}
                                                    {challengeSteps[activeChallenge]?.description && (
                                                        <div
                                                            className="px-6 py-5 text-center text-white/80 text-[14px] leading-relaxed [&_a]:underline [&_a]:text-white"
                                                            dangerouslySetInnerHTML={{ __html: processHtmlLinks(challengeSteps[activeChallenge].description) }}
                                                        />
                                                    )}
                                                </m.div>
                                            </AnimatePresence>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex items-center justify-center gap-4 mt-6">
                                            <button
                                                onClick={() => goToChallenge((activeChallenge - 1 + challengeSteps.length) % challengeSteps.length)}
                                                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors"
                                                aria-label="Previous"
                                            >
                                                <ChevronLeft size={16} />
                                            </button>

                                            <div className="flex gap-2 items-center">
                                                {challengeSteps.map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => goToChallenge(i)}
                                                        aria-label={`Challenge ${i + 1}`}
                                                        className="rounded-full transition-all duration-300"
                                                        style={{
                                                            width: i === activeChallenge ? 24 : 10,
                                                            height: 10,
                                                            background: i === activeChallenge ? '#fff' : 'rgba(255,255,255,0.35)',
                                                        }}
                                                    />
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => goToChallenge((activeChallenge + 1) % challengeSteps.length)}
                                                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors"
                                                aria-label="Next"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>

                                        {/* Step counter */}
                                        <p className="text-center text-white/50 text-[12px] mt-3 tracking-wide">
                                            {activeChallenge + 1} / {challengeSteps.length}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}


            {/* Delivered */}
            {(deliveredtitle || delivereddescription) && (
                <>
                    <section
                        className="pt-[48px] pb-[48px] max-md:pt-[40px] max-md:pb-[40px] relative mt-0 md:mt-[40px]"
                        style={{
                            backgroundImage: "url('/footer-bg.jpg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >

                        <div className="container mx-auto px-4 relative z-10">
                            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                                <div className="text-left">
                                    {deliveredtitle && deliveredtitle.trim() && (
                                        <h2 className="text-3xl md:text-[42px] font-bold text-white mb-6 leading-tight [&_a]:underline [&_a]:text-white" dangerouslySetInnerHTML={{ __html: processHtmlLinks(deliveredtitle) }} />
                                    )}
                                    {delivereddescription && delivereddescription.trim() && (
                                        <div className="text-white/85 text-[15px] leading-relaxed relative z-10 w-full overflow-hidden block [&_a]:underline [&_a]:text-white">
                                            {resultsMounted && (
                                                <div dangerouslySetInnerHTML={{ __html: processHtmlLinks(delivereddescription) }} />
                                            )}
                                        </div>
                                    )}
                                    <div className="pt-[24px]">
                                        <Button
                                            href="/post-requirement"
                                            text="Start Your Project"
                                            className="bg-white text-black border border-black hover:bg-black hover:text-white transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    {deliveredvideo && deliveredvideo.trim() ? (
                                        <div
                                            className="overflow-hidden rounded-[24px] border border-white/10 bg-black shadow-[0_18px_50px_rgba(0,0,0,0.18)] aspect-video [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
                                            dangerouslySetInnerHTML={{ __html: processHtmlLinks(deliveredvideo) }}
                                        />
                                    ) : (
                                        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] aspect-video">
                                            <Image
                                                src={deliveredImageUrl}
                                                alt={deliveredtitle || caseStudy.title || 'Delivered solution'}
                                                width={700}
                                                height={420}
                                                className="w-full h-full object-contain object-center bg-white"
                                                unoptimized={true}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {(techtitle || techdescription || techimages.length > 0) && (
                        <section className="bg-white py-[40px] md:py-[60px]">
                            <div className="container mx-auto px-4">
                                <div className="max-w-6xl mx-auto">
                                    <h3 className="text-2xl md:text-[32px] font-semibold text-[#1a1a1a] leading-tight text-center my-[18px]">
                                        {techtitle || "Tech stacks we used"}
                                    </h3>
                                    {techdescription && techdescription.trim() && (
                                        <div className="text-center text-gray-600 mb-8 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: processHtmlLinks(techdescription) }} />
                                    )}
                                    <div className={`grid ${mobileTechGridClass} md:grid-cols-4 gap-3 md:gap-6 items-center`}>
                                        {deliveredTechStackLogos.map((logo, index) => (
                                            <div
                                                key={logo.alt}
                                                className={`flex items-center justify-center min-h-[88px] md:min-h-[110px] ${getMobileTechCardSpan(index)} md:col-span-1`}
                                            >
                                                <Image
                                                    src={logo.src}
                                                    alt={logo.alt}
                                                    width={logo.width}
                                                    height={logo.height}
                                                    className={`${getMobileTechImageHeight()} md:h-[52px] w-auto max-w-full object-contain`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </>
            )}

            {/* Why choose us — CMS showcase (before Results & Impact) */}
            {showWhyChooseUsShowcase && (
                <section
                    className="relative overflow-hidden bg-gradient-to-b from-[#eceafe]/90 via-[#f7f8fc] to-white py-[48px] md:py-[76px]"
                    aria-label={textPlain(whychooseus.badge) || 'Why choose us'}
                >
                    <div
                        className="pointer-events-none absolute -top-28 right-[-80px] h-[340px] w-[340px] rounded-full bg-[#6d4bfb]/15 blur-3xl"
                        aria-hidden
                    />
                    <div
                        className="pointer-events-none absolute bottom-[-60px] left-[-100px] h-[300px] w-[300px] rounded-full bg-[#4c4e81]/12 blur-3xl"
                        aria-hidden
                    />
                    <div
                        className="pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(109,75,251,0.06)_0%,transparent_65%)]"
                        aria-hidden
                    />

                    <div className="container relative z-10 mx-auto px-4 md:px-[70px] font-figtree">
                        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
                            <SectionBadge text={textPlain(whychooseus.badge) || 'Why choose us'} variant="service" />
                            {textPlain(whychooseus.title) && (
                                <m.h2
                                    id="why-choose-us-heading"
                                    variants={headingVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="mt-[18px] text-2xl font-semibold leading-tight text-[#1a1a1a] md:text-[34px]"
                                >
                                    {whychooseus.title.split('').map((char, index) => (
                                        <m.span key={`wcu-h-${index}`} variants={letterVariants}>
                                            {char === ' ' ? ' ' : char}
                                        </m.span>
                                    ))}
                                </m.h2>
                            )}
                            {textPlain(whychooseus.subtitle) && (
                                <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-gray-600 md:text-[16px]">
                                    {whychooseus.subtitle}
                                </p>
                            )}
                        </div>

                        {(showWcuPulse || showWcuFeatureCards) && (
                            <div
                                className={`mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:gap-8 lg:items-stretch ${
                                    showWcuPulse && showWcuFeatureCards
                                        ? 'lg:grid-cols-12'
                                        : 'lg:grid-cols-1'
                                }`}
                            >
                                {showWcuPulse && (
                                    <m.div
                                        className={
                                            showWcuFeatureCards
                                                ? 'lg:col-span-5'
                                                : 'mx-auto w-full max-w-xl lg:col-span-1'
                                        }
                                        initial={{ opacity: 0, y: 28 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-40px' }}
                                        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    >
                                        <div className="relative h-full min-h-[280px] rounded-[24px] bg-gradient-to-br from-[#6d4bfb] via-[#7b5cff] to-[#4c4e81] p-[1px] shadow-[0_24px_70px_rgba(109,75,251,0.28)]">
                                            <div className="flex h-full flex-col rounded-[23px] bg-white p-6 md:p-8">
                                                <div className="mb-6 flex items-center gap-2">
                                                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" aria-hidden />
                                                    <span className="h-2.5 w-2.5 rounded-full bg-[#ffd43b]" aria-hidden />
                                                    <span className="h-2.5 w-2.5 rounded-full bg-[#51cf66]" aria-hidden />
                                                    <span className="ml-auto text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                                        {textPlain(whychooseus.pulseCaption) || ' '}
                                                    </span>
                                                </div>
                                                <div className="mb-5 space-y-2.5">
                                                    <div className="h-2.5 rounded-full bg-gray-100" style={{ width: '72%' }} />
                                                    <div className="h-2.5 rounded-full bg-gray-100" />
                                                    <div
                                                        className="h-2.5 rounded-full bg-gradient-to-r from-[#6d4bfb]/35 to-transparent"
                                                        style={{ width: '88%' }}
                                                    />
                                                </div>
                                                <div className="grid flex-1 grid-cols-2 gap-3">
                                                    <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-[#f7f8fc] p-4">
                                                        <span className="text-[11px] font-medium text-gray-500">
                                                            {whychooseus.pulseStat1Label || ' '}
                                                        </span>
                                                        <span className="mt-2 text-3xl font-bold tabular-nums text-[#4c4e81]">
                                                            {whychooseus.pulseStat1Value || ' '}
                                                        </span>
                                                        <span className="mt-1 text-[11px] text-gray-400">
                                                            {whychooseus.pulseStat1Sub || ' '}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-[#f3f0ff] p-4">
                                                        <span className="text-[11px] font-medium text-gray-500">
                                                            {whychooseus.pulseStat2Label || ' '}
                                                        </span>
                                                        <span className="mt-2 text-3xl font-bold tabular-nums text-[#6d4bfb]">
                                                            {whychooseus.pulseStat2Value || ' '}
                                                        </span>
                                                        <span className="mt-1 text-[11px] text-gray-400">
                                                            {whychooseus.pulseStat2Sub || ' '}
                                                        </span>
                                                    </div>
                                                </div>
                                                {(textPlain(whychooseus.pulseQualityTitle) ||
                                                    textPlain(whychooseus.pulseQualitySubtitle)) && (
                                                    <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#6d4bfb]/15 bg-[#faf9ff] px-4 py-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6d4bfb]/12">
                                                            <Check className="text-[#6d4bfb]" size={18} strokeWidth={2.5} />
                                                        </div>
                                                        <div className="min-w-0 text-left">
                                                            <p className="text-[13px] font-semibold text-[#1a1a1a]">
                                                                {whychooseus.pulseQualityTitle || ' '}
                                                            </p>
                                                            <p className="text-[12px] text-gray-500">
                                                                {whychooseus.pulseQualitySubtitle || ' '}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </m.div>
                                )}

                                {showWcuFeatureCards && (
                                    <div
                                        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 ${
                                            showWcuPulse ? 'lg:col-span-7' : 'lg:col-span-1 max-w-6xl mx-auto w-full'
                                        }`}
                                    >
                                        {whyChooseUsFeatures.filter(
                                            (f) => textPlain(f?.title) || textPlain(f?.description)
                                        ).map((feat, index) => {
                                            const IconCmp = getWhyChooseUsIconComponent(feat.icon);
                                            return (
                                                <m.div
                                                    key={`${feat.title}-${index}`}
                                                    initial={{ opacity: 0, y: 22 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true, margin: '-30px' }}
                                                    transition={{
                                                        duration: 0.45,
                                                        delay: index * 0.06,
                                                        ease: [0.25, 0.46, 0.45, 0.94],
                                                    }}
                                                    className="group relative overflow-hidden rounded-[20px] border border-gray-100 bg-white/90 p-6 shadow-[0px_8px_40px_0px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6d4bfb]/25 hover:shadow-[0px_16px_48px_0px_rgba(109,75,251,0.12)]"
                                                >
                                                    <div
                                                        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#6d4bfb]/[0.07] transition-transform duration-500 group-hover:scale-150"
                                                        aria-hidden
                                                    />
                                                    <div className="relative flex items-start gap-4">
                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eeeef8] to-[#e4e0ff] text-[#4c4e81] shadow-inner ring-1 ring-white/80 transition-transform duration-300 group-hover:scale-105">
                                                            <IconCmp size={22} strokeWidth={2} aria-hidden />
                                                        </div>
                                                        <div className="min-w-0 pt-0.5">
                                                            <h3 className="text-[17px] font-bold leading-snug text-[#1a1a1a] md:text-[18px]">
                                                                {feat.title}
                                                            </h3>
                                                            <p className="mt-2 text-[13.5px] leading-relaxed text-gray-600 md:text-[14px] whitespace-pre-line">
                                                                {feat.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </m.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {whyChooseUsFooter.filter((r) => textPlain(r?.label) || textPlain(r?.sublabel)).length >
                            0 && (
                            <m.div
                                className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-center gap-6 rounded-[20px] border border-gray-100/80 bg-white/60 px-6 py-5 shadow-[0px_4px_30px_0px_rgba(76,78,129,0.08)] backdrop-blur-sm md:mt-12 md:gap-10 md:px-10"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                            >
                                {whyChooseUsFooter
                                    .filter((row) => textPlain(row?.label) || textPlain(row?.sublabel))
                                    .map((row, fIdx) => (
                                        <div
                                            key={`wcu-footer-${fIdx}`}
                                            className="flex min-w-[200px] flex-1 items-center gap-3 sm:min-w-0"
                                        >
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4c4e81]/10">
                                                <Check className="text-[#4c4e81]" size={15} strokeWidth={2.5} aria-hidden />
                                            </span>
                                            <div className="text-left">
                                                <p className="text-[13px] font-semibold text-[#1a1a1a]">{row.label}</p>
                                                <p className="text-[12px] text-gray-500">{row.sublabel}</p>
                                            </div>
                                        </div>
                                    ))}
                            </m.div>
                        )}
                    </div>
                </section>
            )}

            {/* Results & Impact — sp1: 70px top + bottom */}
            {(resultstitle || resultsdescription || resultssubdescription) && (
                <section className="bg-white py-[40px] md:py-[60px]">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            {resultstitle && resultstitle.trim() && (
                                <h2 className="text-[24px] md:text-[30px] font-bold text-[#1a1a1a] mb-[12px] leading-tight [&_a]:underline [&_a]:text-[#6d4bfb]" dangerouslySetInnerHTML={{ __html: processHtmlLinks(resultstitle) }} />
                            )}
                            {resultssubdescription && resultssubdescription.trim() && (
                                <div className="text-gray-600 text-[16px] leading-relaxed mb-[24px] [&_a]:underline [&_a]:text-[#6d4bfb]" dangerouslySetInnerHTML={{ __html: processHtmlLinks(resultssubdescription) }} />
                            )}
                            {/* Only render after DOMParser has run — prevents SSR flash */}
                            {resultsMounted && (
                                <>
                                    {/* Prose paragraphs */}
                                    {resultsProse && resultsProse.trim() && (
                                        <div className="text-gray-600 text-[15px] leading-relaxed mb-[40px] [&_a]:underline [&_a]:text-[#6d4bfb]" dangerouslySetInnerHTML={{ __html: processHtmlLinks(resultsProse) }} />
                                    )}
                                    {/* Pill cards */}
                                    {resultItems.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {resultItems.map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 bg-[#4c4e81] rounded-full px-5 py-4">
                                                    <div className="h-9 w-9 shrink-0 flex items-center justify-center bg-white/20 rounded-full">
                                                        <Check className="text-white" size={14} />
                                                    </div>
                                                    <div
                                                        className="text-left text-white/90 text-[11.5px] [&_h5]:text-white [&_h5]:text-[12px] [&_h5]:font-semibold [&_h5]:leading-snug [&_h5]:mb-0.5 [&_strong]:font-semibold [&_p]:text-white/90 [&_p]:text-[11.5px] [&_p]:leading-relaxed [&_p]:mb-0 [&_a]:underline [&_a]:text-white"
                                                        dangerouslySetInnerHTML={{ __html: processHtmlLinks(item) }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {resultItems.length === 0 && resultsdescription && (
                                        <div className="text-gray-600 text-[15px] leading-relaxed [&_a]:underline [&_a]:text-[#6d4bfb]" dangerouslySetInnerHTML={{ __html: processHtmlLinks(resultsdescription) }} />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}


            {/* Quote / Testimonial */}
            {showQuoteSection && (
                <section className="bg-white pt-0 pb-[40px] md:pb-[50px]">
                    <div className="container mx-auto px-4">
                        {quotetitle && quotetitle.trim() && (
                            <h2 className="text-center text-[20px] md:text-[26px] font-bold text-[#1a1a1a] mb-6 leading-tight">
                                {quotetitle}
                            </h2>
                        )}
                        <div className="max-w-full mx-auto rounded-[24px] bg-[#f7f8fc] px-6 py-8 md:px-12 md:py-10">
                            <div className="flex items-start gap-5 md:gap-7">
                                <div className="w-[5px] shrink-0 self-stretch rounded-full bg-[#2f3150]" aria-hidden />
                                <div className="min-w-0 flex-1">
                                    {!htmlLooksEmpty(quotedescription) && (
                                        <div
                                            className="text-[18px] leading-[1.55] text-[#1f274a] md:text-[20px] [&_p]:italic [&_p]:mb-2 [&_p:last-child]:mb-0 [&_a]:text-[#6d4bfb] [&_a]:underline"
                                            dangerouslySetInnerHTML={{ __html: processHtmlLinks(quotedescription) }}
                                        />
                                    )}
                                    {quotename && quotename.trim() && (
                                        <p className="mt-4 text-[14px] font-semibold text-[#4c4e81] tracking-wide">
                                            — {quotename}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="bg-white py-[40px] md:py-[60px]">
                <div className="container mx-auto px-4">
                    <div className="bg-[#2f3150] rounded-3xl p-[30px] md:p-[60px] relative overflow-hidden text-center">
                        <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-white/5"></div>
                        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/5"></div>

                        <div className="relative z-10">
                            <h2 className="text-[24px] md:text-[30px] font-bold text-white leading-tight">
                                Ready to Start Your Project?
                            </h2>
                            <p className="text-white/75 text-[15px] mt-[18px]">
                                Let's build something amazing together.
                            </p>
                            <div className="pt-[24px] flex justify-center">
                                <Button
                                    href="/post-requirement"
                                    text="Start Your Project"
                                    className="bg-white text-black border border-black hover:bg-black hover:text-white transition-all duration-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";

/**
 * PrivacyPolicyInnerArea Component
 * 
 * Detailed Privacy Policy content with a sticky sidebar for navigation.
 * Styled exclusively using Tailwind CSS.
 */
export default function AiContentPolicyInnerArea() {
    const [activeId, setActiveId] = useState("scope-of-policy");

    // Handle active state based on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-120px 0px -70% 0px" }
        );

        const sections = document.querySelectorAll(".privacy-section");
        sections.forEach((section) => observer.observe(section));

        return () => sections.forEach((section) => observer.unobserve(section));
    }, []);

    const tocItems = [
        { id: "purpose", label: "1. Purpose" },
        { id: "permitted-uses", label: "2. Permitted Uses" },
        { id: "restricted-uses", label: "3. Restricted Uses" },
        { id: "attribution-requirement", label: "4. Attribution Requirement" },
        { id: "intellectual-property", label: "5. Intellectual Property" },
        { id: "contact-permissions", label: "6. Contact for Permissions" },
        { id: "policy-updates", label: "7. Policy Updates" },
    ];

    const CheckIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="14" viewBox="0 0 22 14" fill="none" className="shrink-0 mt-1">
            <path d="M11.3909 14C11.0558 14 10.8325 13.8667 10.6091 13.6L5.91878 8C5.47208 7.46667 5.47208 6.66667 5.91878 6.13333C6.36548 5.6 7.03553 5.6 7.48223 6.13333L11.3909 10.8L20.1015 0.4C20.5482 -0.133333 21.2183 -0.133333 21.665 0.4C22.1117 0.933333 22.1117 1.73333 21.665 2.26667L12.1726 13.6C12.0609 13.8667 11.7259 14 11.3909 14Z" className="fill-slate-500"></path>
            <path d="M5.80711 14C5.47208 14 5.24873 13.8667 5.02538 13.6L0.335025 8C-0.111675 7.46667 -0.111675 6.66667 0.335025 6.13333C0.781726 5.6 1.45178 5.6 1.89848 6.13333L6.58883 11.7333C7.03553 12.2667 7.03553 13.0667 6.58883 13.6C6.47716 13.8667 6.14213 14 5.80711 14ZM11.7259 7.06667C11.3909 7.06667 11.1675 6.93333 10.9442 6.66667C10.4975 6.13333 10.4975 5.33333 10.9442 4.8L14.5178 0.4C14.9645 -0.133333 15.6345 -0.133333 16.0812 0.4C16.5279 0.933333 16.5279 1.73333 16.0812 2.26667L12.5076 6.66667C12.2843 6.93333 12.0609 7.06667 11.7259 7.06667Z" className="fill-slate-500"></path>
        </svg>
    );

    return (
        <section className="bg-white py-[60px] px-[2rem] lg:px-[110px] overflow-visible text-slate-800">
            <div className="mx-auto w-full max-w-[1320px] bg-indigo-50 p-[38px] rounded-[20px] shadow-sm overflow-visible">
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start text-slate-700">

                    {/* Sidebar / Table of Contents */}
                    <aside className="md:sticky md:top-[15px] self-start md:border-r border-indigo-100 md:pr-5">
                        <div className="flex items-center gap-[10px] font-semibold text-[#0f172a] mb-4">
                            <span className="w-9 h-9 inline-flex items-center justify-center bg-indigo-100 text-linear-gradient(90deg, #474972 0%, #585c9c 100%) rounded-[10px]">
                                <FileText className="text-[#474972]" size={20} />
                            </span>
                            <span>Table of Contents</span>
                        </div>

                        <ul className="space-y-1">
                            {tocItems.map((item) => (
                                <li key={item.id}>
                                    <a
                                        href={`#${item.id}`}
                                        className={`block px-3 py-2 rounded-[10px] text-sm transition-all duration-200 ${activeId === item.id
                                            ? "text-white font-semibold shadow-md"
                                            : "text-slate-600 hover:bg-white/50"
                                            }`}
                                        style={activeId === item.id ? { background: 'var(--Main-Color, linear-gradient(90deg, #474972 0%, #585c9c 100%))' } : {}}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Content Area */}
                    <div className="flex flex-col gap-6 text-slate-600 leading-relaxed">
                        <p>
                            <strong className="text-[#0f172a]">Effective Date:</strong> 17 February 2026
                        </p>
                        <p className="mb-4">
                            <strong className="text-[#0f172a]">Company:</strong> Akoode Technologies
                        </p>

                        {/* Section 1 */}
                        <section id="purpose" className="privacy-section scroll-mt-[90px]">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">
                                    1. Purpose
                                </h4>
                            </div>
                            <p>
                                This AI Content Usage Policy outlines how content published on Akoode Technologies’
                                website may be accessed, processed, summarized, or used by Artificial Intelligence
                                systems, including but not limited to Large Language Models (LLMs), retrieval systems,
                                and AI-powered assistants.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section id="permitted-uses" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">
                                    2. Permitted Uses
                                </h4>
                            </div>

                            <p className="mb-4">
                                We support responsible AI innovation and allow the following uses of our publicly available website content:
                            </p>

                            <ul className="space-y-3 mb-4">
                                <li className="flex items-start gap-2"><CheckIcon /> Summarization of content</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Quoting excerpts with clear attribution</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Indexing for retrieval-augmented generation (RAG) systems</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Referencing our materials in research or educational contexts</li>
                            </ul>

                            <p>
                                Attribution must clearly mention:
                                <strong className="text-[#0f172a]"> “Source: Akoode Technologies”</strong>
                            </p>
                        </section>

                        {/* Section 3 */}
                        <section id="restricted-uses" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">
                                    3. Restricted Uses
                                </h4>
                            </div>

                            <p className="mb-4">
                                The following uses are not permitted without prior written consent:
                            </p>

                            <ul className="space-y-3">
                                <li className="flex items-start gap-2"><CheckIcon /> Use of our content for AI model training</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Full-content replication or redistribution</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Commercial reuse without attribution</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Automated scraping that impacts website performance</li>
                            </ul>
                        </section>

                        {/* Section 4 */}
                        <section id="attribution-requirement" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">
                                    4. Attribution Requirement
                                </h4>
                            </div>

                            <p>
                                Any AI-generated output that substantially references Akoode Technologies’ content
                                must provide clear and visible attribution to:
                            </p>

                            <div className="mt-3 space-y-1">
                                <p><strong className="text-[#0f172a]">Akoode Technologies</strong></p>
                                <p>
                                    <Link href="https://www.akoode.com" className="font-bold text-[#4f46e5] hover:underline">
                                        https://www.akoode.com
                                    </Link>
                                </p>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section id="intellectual-property" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">
                                    5. Intellectual Property
                                </h4>
                            </div>

                            <p>
                                All content on this website — including text, images, code samples, case studies,
                                and design assets — remains the intellectual property of Akoode Technologies unless otherwise stated.
                            </p>

                            <p className="mt-3">
                                This policy does not transfer any ownership rights.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section id="contact-permissions" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">
                                    6. Contact for Permissions
                                </h4>
                            </div>

                            <p className="mb-3">
                                For training access, licensing requests, or enterprise AI partnerships, please contact:
                            </p>

                            <p>
                                📧{" "}
                                <a href="mailto:info@akoode.com" className="font-bold text-[#4f46e5] hover:underline">
                                    info@akoode.com
                                </a>
                            </p>
                        </section>

                        {/* Section 7 */}
                        <section id="policy-updates" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">
                                    7. Policy Updates
                                </h4>
                            </div>

                            <p>
                                We may update this policy periodically to reflect evolving AI technologies
                                and regulatory developments.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </section>
    );
}

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
export default function PrivacyPolicyInnerArea() {
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
        { id: "scope-of-policy", label: "1. Scope of This Policy" },
        { id: "nature-of-business", label: "2. Nature of Business & Transactions" },
        { id: "information-collection", label: "3. Information We Collect" },
        { id: "purpose-of-collection", label: "4. Purpose of Information Collection" },
        { id: "international-transactions", label: "5. International Transactions & Services" },
        { id: "fraud-prevention", label: "6. Fraud Prevention & Risk Control Measures" },
        { id: "payment-processing", label: "7. Payment Processing" },
        { id: "data-security", label: "8. Data Security" },
        { id: "data-retention", label: "9. Data Retention" },
        { id: "third-party-disclosure", label: "10. Third-Party Disclosure" },
        { id: "cookies-tracking", label: "11. Cookies & Website Tracking" },
        { id: "your-rights", label: "12. Your Rights" },
        { id: "policy-changes", label: "13. Changes to This Policy" },
        { id: "contact-information", label: "14. Contact Information" },
    ];

    const CheckIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="14" viewBox="0 0 22 14" fill="none" className="shrink-0 mt-1">
            <path d="M11.3909 14C11.0558 14 10.8325 13.8667 10.6091 13.6L5.91878 8C5.47208 7.46667 5.47208 6.66667 5.91878 6.13333C6.36548 5.6 7.03553 5.6 7.48223 6.13333L11.3909 10.8L20.1015 0.4C20.5482 -0.133333 21.2183 -0.133333 21.665 0.4C22.1117 0.933333 22.1117 1.73333 21.665 2.26667L12.1726 13.6C12.0609 13.8667 11.7259 14 11.3909 14Z" className="fill-slate-500"></path>
            <path d="M5.80711 14C5.47208 14 5.24873 13.8667 5.02538 13.6L0.335025 8C-0.111675 7.46667 -0.111675 6.66667 0.335025 6.13333C0.781726 5.6 1.45178 5.6 1.89848 6.13333L6.58883 11.7333C7.03553 12.2667 7.03553 13.0667 6.58883 13.6C6.47716 13.8667 6.14213 14 5.80711 14ZM11.7259 7.06667C11.3909 7.06667 11.1675 6.93333 10.9442 6.66667C10.4975 6.13333 10.4975 5.33333 10.9442 4.8L14.5178 0.4C14.9645 -0.133333 15.6345 -0.133333 16.0812 0.4C16.5279 0.933333 16.5279 1.73333 16.0812 2.26667L12.5076 6.66667C12.2843 6.93333 12.0609 7.06667 11.7259 7.06667Z" className="fill-slate-500"></path>
        </svg>
    );

    return (
        <section className="bg-white py-[60px] px-5 sm:px-[60px] lg:px-[110px] overflow-visible text-slate-800">
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

                        {/* Section 1 */}
                        <section id="scope-of-policy" className="privacy-section scroll-mt-[90px]">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">1. Scope of This Policy</h4>
                            </div>
                            <p className="mb-4">This Privacy Policy applies to:</p>
                            <ul className="space-y-3 mb-4">
                                <li className="flex items-start gap-2"><CheckIcon /> Visitors to our website</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Business clients and prospects</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Users contacting us via forms, email, or other communication channels</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Information shared during contractual, invoicing, and service delivery processes</li>
                            </ul>
                            <p>
                                Akoode does <strong className="text-[#0f172a]">not</strong> sell products or accept instant purchases through the website.
                                All services are provided through <strong className="text-[#0f172a]">formal agreements, contracts, or invoices</strong>
                                shared directly with clients.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section id="nature-of-business" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">2. Nature of Business & Transactions</h4>
                            </div>
                            <p className="mb-4">
                                Akoode Technologies operates as a <strong className="text-[#0f172a]">service-based technology company</strong>, offering:
                            </p>
                            <ul className="space-y-3 mb-4">
                                <li className="flex items-start gap-2"><CheckIcon /> Software development services</li>
                                <li className="flex items-start gap-2"><CheckIcon /> AI and automation solutions</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Digital product engineering and consulting</li>
                            </ul>
                            <p className="mb-2">Payments received by Akoode are strictly against:</p>
                            <ul className="space-y-3 mb-4">
                                <li className="flex items-start gap-2"><CheckIcon /> Contractual service agreements</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Project-based or milestone-based invoices</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Professional services rendered to clients</li>
                            </ul>
                            <p>No anonymous, automated, or walk-in transactions are supported.</p>
                        </section>

                        {/* Section 3 */}
                        <section id="information-collection" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">3. Information We Collect</h4>
                            </div>
                            <h5 className="font-bold text-[#0f172a] mb-3">a. Personal & Business Information</h5>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start gap-2"><CheckIcon /> Name, email address, phone number</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Company name and designation</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Billing and invoicing details</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Communication records related to services</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Contractual and service-related documentation</li>
                            </ul>
                            <h5 className="font-bold text-[#0f172a] mb-3">b. Technical & Website Information</h5>
                            <ul className="space-y-3 mb-4">
                                <li className="flex items-start gap-2"><CheckIcon /> IP address</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Browser and device details</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Pages visited and interaction data</li>
                            </ul>
                            <p>This data is collected for security, analytics, and performance monitoring only.</p>
                        </section>

                        {/* Section 4 */}
                        <section id="purpose-of-collection" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">4. Purpose of Information Collection</h4>
                            </div>
                            <ul className="space-y-3 mb-4">
                                <li className="flex items-start gap-2"><CheckIcon /> Communicate with clients and prospects</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Create invoices and process payments</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Deliver contracted services</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Maintain records for accounting and compliance</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Prevent fraud and unauthorized transactions</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Meet legal, tax, and regulatory obligations</li>
                            </ul>
                            <p>
                                We <strong className="text-[#0f172a]">do not</strong> sell, rent, or trade personal data.
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section id="international-transactions" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">5. International Transactions & Services</h4>
                            </div>
                            <p className="mb-3">
                                Akoode provides services to clients located in multiple countries, including but not limited to:
                            </p>
                            <ul className="space-y-3 mb-4">
                                <li className="flex items-start gap-2"><CheckIcon /> India</li>
                                <li className="flex items-start gap-2"><CheckIcon /> United States</li>
                                <li className="flex items-start gap-2"><CheckIcon /> United Kingdom</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Europe</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Middle East</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Asia-Pacific regions</li>
                            </ul>
                            <p>
                                International payments are accepted <strong className="text-[#0f172a]">only from verified clients</strong> after due
                                diligence, contractual agreement, and invoice issuance.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section id="fraud-prevention" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">6. Fraud Prevention & Risk Control Measures</h4>
                            </div>
                            <ul className="space-y-3 mb-4">
                                <li className="flex items-start gap-2"><CheckIcon /> Client verification before onboarding</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Contractual documentation for every engagement</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Invoice-based payment collection only</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Restricted acceptance of payments from unknown or unverified sources</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Monitoring of transaction patterns</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Compliance with Razorpay and banking partner guidelines</li>
                            </ul>
                            <p>
                                Akoode reserves the right to decline or refund transactions that appear suspicious or
                                non-compliant.
                            </p>
                        </section>

                        {/* Section 7 */}
                        <section id="payment-processing" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">7. Payment Processing</h4>
                            </div>
                            <p className="mb-3">
                                Payments are processed through authorized payment gateways such as <strong className="text-[#0f172a]">Razorpay</strong>.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2"><CheckIcon /> Does <strong className="text-[#0f172a]">not</strong> store credit or debit card details</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Does <strong className="text-[#0f172a]">not</strong> store banking or payment credentials</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Relies entirely on PCI-DSS–compliant payment partners</li>
                            </ul>
                        </section>

                        {/* Section 8 */}
                        <section id="data-security" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">8. Data Security</h4>
                            </div>
                            <p className="mb-3">We implement technical and organizational measures to protect against:</p>
                            <ul className="space-y-3 mb-4">
                                <li className="flex items-start gap-2"><CheckIcon /> Unauthorized access</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Data loss or misuse</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Alteration or disclosure</li>
                            </ul>
                            <p>
                                However, no internet-based transmission is 100% secure, and users share information at their
                                own risk.
                            </p>
                        </section>

                        {/* Section 9 */}
                        <section id="data-retention" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">9. Data Retention</h4>
                            </div>
                            <p className="mb-3">We retain data:</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2"><CheckIcon /> For the duration of the contractual relationship</li>
                                <li className="flex items-start gap-2"><CheckIcon /> As required by accounting, tax, or regulatory laws</li>
                                <li className="flex items-start gap-2"><CheckIcon /> For legitimate business and compliance purposes</li>
                            </ul>
                        </section>

                        {/* Section 10 */}
                        <section id="third-party-disclosure" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">10. Third-Party Disclosure</h4>
                            </div>
                            <p className="mb-3">Certain third-party analytics, advertising, and website optimization providers may process limited technical and behavioral information in accordance with their own privacy policies.</p>
                            <ul className="space-y-3 mb-4">
                                <li className="flex items-start gap-2"><CheckIcon /> Payment processors</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Legal, tax, or regulatory authorities</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Professional advisors (accounting, compliance, legal)</li>
                            </ul>
                            <p>Such sharing is strictly limited to lawful and legitimate purposes.</p>
                        </section>

                        {/* Section 11 */}
                        <section id="cookies-tracking" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">11. Cookies & Website Tracking</h4>
                            </div>
                            <p className="mb-3">Akoode Technologies uses cookies and similar tracking technologies to improve website functionality, analyze traffic patterns, monitor website performance, and enhance user experience.
                                Cookies are small text files stored on a user’s device when visiting a website. <br /> We currently use the following categories of cookies:</p>
                                <p><strong>Necessary Cookies :</strong> <br />Required for essential website functionality, security, navigation, and user preference management.</p>
                                <p><strong>Analytics Cookies :</strong> <br />Used to understand website usage, visitor behavior, traffic sources, and performance metrics.</p>
                                <p>Tools currently used may include:</p>
                            <ul className="space-y-3 mb-4">
                                <li className="flex items-start gap-2"><CheckIcon /> Google Tag Manager (GTM)</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Google Analytics</li>
                            </ul>
                            <p>Analytics cookies are activated only after user consent where required under applicable laws.</p>
                            <p>Users may:</p>
                            <ul className="space-y-3 mb-4">
                                <li className="flex items-start gap-2">Accept all cookies</li>
                                <li className="flex items-start gap-2">Reject non-essential cookies</li>
                                {/* <li className="flex items-start gap-2"></li> */}
                            </ul>
                        </section>

                        {/* Section 12 */}
                        <section id="your-rights" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">12. Your Rights</h4>
                            </div>
                            <p className="mb-3">You have the right to:</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2"><CheckIcon /> Request access to your data</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Request correction or deletion</li>
                                <li className="flex items-start gap-2"><CheckIcon /> Withdraw consent where applicable</li>
                            </ul>
                        </section>

                        {/* Section 13 */}
                        <section id="policy-changes" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">13. Changes to This Policy</h4>
                            </div>
                            <p>
                                Akoode reserves the right to update this Privacy Policy at any time. Updates will be reflected
                                by revising the “Last Updated” date. <br />
                                <i>Last Updated: May 13, 2026</i>
                            </p>
                        </section>

                        {/* Section 14 */}
                        <section id="contact-information" className="privacy-section scroll-mt-[90px] border-t border-[#e2e8f0] pt-6">
                            <div className="mb-4">
                                <h4 className="font-sans text-[22px] font-semibold text-[#0f172a] m-0 leading-[1.3]">14. Contact Information</h4>
                            </div>
                            <div className="space-y-1">
                                <p><strong className="text-[#0f172a]">Akoode Technologies</strong></p>
                                <p>
                                    📧 Email:{" "}
                                    <a href="mailto:info@akoode.com" className="font-bold text-[#4f46e5] hover:underline">
                                        info@akoode.com
                                    </a>
                                </p>
                                <p>
                                    🌐 Website:{" "}
                                    <Link href="https://akoode.com" className="font-bold text-[#4f46e5] hover:underline">
                                        https://akoode.com
                                    </Link>
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </section>
    );
}

"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { Linkedin } from "lucide-react";


export default function AboutLeadership() {
    return (
        <section className="py-10 sm:py-14 md:py-[70px] bg-[#fcfcfc] overflow-hidden font-sans" aria-label="Leadership Team">
            <div className="w-full mx-auto  px-[2rem] md:px-[15px] min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px] min-[1400px]:max-w-[1320px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">

                    {/* Visual Profile Column */}
                    <m.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative z-[1] w-full"
                        aria-hidden="true"
                    >
                        {/* Decorative Background Frame */}
                        <div className="hidden md:block absolute -bottom-[25px] -right-[25px] w-full h-full border-2 border-[#f0f0f0] rounded-[20px] z-[1]"></div>

                        {/* Interactive Hero Image */}
                        <div className="relative z-[2] w-full h-[280px] sm:h-[340px] md:h-[420px] lg:h-[700px] rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] group transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-t after:from-[#2A2B44]/50 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-all after:duration-400 after:z-[3] after:pointer-events-none">
                            <Image
                                src="/aboutUs/akhil.webp"
                                alt="Akhilesh K Verma - Founder & CEO"
                                fill
                                priority
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </m.div>

                    {/* Biographical Content Column */}
                    <m.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="leadership-content w-full"
                    >
                        <header className="mb-6 sm:mb-8 lg:mb-10">
                            <h2 className="text-[22px] sm:text-[28px] md:text-[36px] lg:text-[50px] leading-[1.2] sm:leading-[1.15] font-bold text-[#2A2B44] tracking-tight">
                                Driving Excellence through <span className="text-[#7B7E9A]">Visionary Strategy.</span>
                            </h2>
                        </header>

                        <div className="mb-6 sm:mb-8">
                            <h3 className="text-[22px] sm:text-[26px] md:text-[32px] font-bold text-[#2A2B44] mb-1">Akhilesh K Verma</h3>
                            <p className="text-base sm:text-[18px] italic text-[#7B7E9A] font-medium">Founder & CEO, Akoode Technologies</p>
                        </div>

                        <article className="text-[#555] text-[15px] sm:text-[16px] leading-[1.6] sm:leading-[26px] mb-6 sm:mb-8">
                            <p className="mb-4 sm:mb-5">
                                With over <strong className="text-[#2A2B44]">10+ years</strong> of experience in AI, deep learning, data science, and digital
                                transformation consulting, Akhil Verma, Founder & CEO of Akoode Technologies, leads with a clear
                                mission — to build technology that inspires empathy, trust, transparency, and pride among every user
                                and stakeholder.
                            </p>
                            <p>
                                Driven by a passion for meaningful innovation, Akhil believes in developing solutions that combine
                                high-end performance, precision, and human impact. Under his leadership, Akoode has grown into a
                                trusted global technology partner, empowering businesses with AI-driven, reliable, and transformative
                                digital solutions that fuel intelligent growth.
                            </p>
                        </article>

                        <blockquote className="leadership-quote text-[15px] sm:text-[16px] md:text-[18px] italic leading-[1.5] text-[#2A2B44] px-4 sm:px-6 md:px-8 py-4 sm:py-5 bg-[#f7f8fa] border-l-4 border-[#2A2B44] rounded-r-[10px] sm:rounded-r-[12px] my-6 sm:my-8 md:my-9 font-medium">
                            <p>"Our success is built on the foundation of trust we establish with our partners and the relentless pursuit of quality in every project we deliver."</p>
                        </blockquote>

                        <footer className="leadership-btns flex items-center gap-4 sm:gap-5 mt-4 sm:mt-5 lg:mt-0 flex-wrap">
                            <a
                                href="https://www.linkedin.com/in/vrakhil07/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Connect with Akhilesh K Verma on LinkedIn"
                                className="vl-btn-outline px-[10px] py-[6px] bg-[#474972] text-white text-[14px] sm:text-[16px] font-semibold rounded-[8px] border border-[#e1e1e1] transition-all duration-400 hover:bg-[#2A2B44] hover:border-[#2A2B44] flex items-center justify-center w-11 h-11 sm:w-[40px] sm:h-[40px] min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 hover:shadow-md"
                            >
                                <Linkedin size={16} aria-hidden="true" />
                            </a>
                        </footer>
                    </m.div>
                </div>
            </div>
        </section>
    );
}

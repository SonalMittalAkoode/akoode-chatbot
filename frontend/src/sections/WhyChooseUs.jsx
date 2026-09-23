"use client";

import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import SectionBadge from "../components/SectionBadge";
import Button from "../components/Button";

export default function AboutSection() {
    const headingText = "Why Choose Akoode Technologies?";

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

    return (
        <section className="relative bg-[#eef0f7] py-14 ">
            {/* Background element */}
            <div className="absolute left-8 top-10 opacity-100 hidden lg:block">
                <Image
                    src="/whyChooseUs/elements9.png"
                    alt="background element"
                    width={400}
                    height={400}
                    className="animate-spin-slow"
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-14 items-center">

                    {/* LEFT SIDE IMAGES */}
                    <div className="relative">

                        {/* Mobile Image */}
                        <div className="block md:hidden mb-6">
                            <Image
                                src="/whyChooseUs/home-page.webp"
                                alt="Akoode office"
                                width={600}
                                height={500}
                                className="rounded-2xl w-full object-cover"
                            />
                        </div>

                        {/* Desktop Images */}
                        <div className="relative hidden md:grid grid-cols-2 gap-6 items-stretch">
                            <div className="flex">
                                <Image
                                    src="/whyChooseUs/about-img1.png"
                                    alt="Office building"
                                    width={400}
                                    height={800}
                                    className="rounded-2xl object-cover w-full h-full"
                                />
                            </div>

                            <div className="space-y-6 flex flex-col">
                                <div className="flex-1">
                                    <Image
                                        src="/whyChooseUs/about-img2.png"
                                        alt="Team working"
                                        width={400}
                                        height={400}
                                        className="rounded-2xl object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Image
                                        src="/whyChooseUs/about-img3.png"
                                        alt="Meeting discussion"
                                        width={400}
                                        height={400}
                                        className="rounded-2xl object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                            {/* Floating Card */}
                            <div
                                className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl px-4 md:px-6 py-3 md:py-4 flex items-center gap-2 md:gap-3 w-[85%] md:w-[320px] shadow-[0px_20px_50px_rgba(0,0,0,0.15)] animate-float z-20"
                            >
                                <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#4b4d7b] text-white shrink-0">
                                    <span className="text-sm md:text-lg font-semibold">✓</span>
                                </div>

                                <p className="text-xs md:text-sm font-medium text-gray-700 leading-snug">
                                    Powering global businesses with intelligent, future-ready software solutions
                                </p>
                            </div>
                        </div>



                    </div>

                    {/* RIGHT SIDE CONTENT */}
                    <div>
                        <div className="space-y-1">
                            <SectionBadge text="Akoode Technologies" variant="light" />
                            <m.h2
                                variants={headingVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="text-xl md:text-[22px] font-bold text-[#1E293B] leading-tight mt-4"
                            >
                                {headingText.split("").map((char, index) => (
                                    <m.span key={index} variants={letterVariants}>
                                        {char}
                                    </m.span>
                                ))}
                            </m.h2>
                        </div>

                        <p className="mt-6 text-gray-600 leading-relaxed">
                            Akoode Technologies is your trusted partner in innovation,
                            delivering cutting-edge AI-driven solutions tailored to your
                            business needs. With expertise spanning Artificial Intelligence,
                            Blockchain, IoT, and Digital Transformation, we offer
                            comprehensive services designed to future-proof your operations.
                        </p>

                        {/* Progress Section */}
                        <div className="mt-8 flex items-center gap-6">
                            <div className="relative w-20 h-20">
                                <div className="w-20 h-20 rounded-full bg-[#2e0797] flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#2e0797] font-bold">
                                        100%
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900">
                                    Our proven track record of 100+ successful projects,
                                </h4>
                                <p className="text-gray-600 mt-1">
                                    global reach, and focus on quality ensures scalable,
                                    reliable, and impactful results.
                                </p>
                            </div>
                        </div>

                        {/* Quote Box */}
                        <div className="mt-8 bg-white p-6 rounded-xl shadow-md border-l-4 border-[#565a96]">
                            <p className="text-gray-600 italic">
                                "By combining advanced technologies with a client-first
                                approach, we empower businesses to achieve measurable growth
                                and long-term success, supported by dedicated maintenance and
                                ongoing support."
                            </p>
                        </div>

                        <Link href="/contact-us">
                            <Button
                                text="See How Can We Help"
                                variant="primary"
                                className="mt-6 mx-auto"
                            />
                        </Link>
                        {/* <div className="mt-8"></div> */}
                    </div>
                </div>
            </div>
        </section>
    );
}


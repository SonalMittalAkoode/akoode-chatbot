"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionBadge from "../components/SectionBadge";

function getCardsPerStep(containerWidth) {
    if (containerWidth < 768) return 1;
    if (containerWidth < 1024) return 2;
    return 3;
}

const services = [
    {
        id: 1,
        title: "Artificial Intelligence",
        href: "/services/artificial-intelligence",
        icon: "/services/artificial-intelligence.svg",
        tagline: "Build Intelligent Systems That Scale",
        desc: "As an AI development company, we design enterprise AI solutions, machine learning models, and AI automation systems that transform data into strategic advantage.",
    },
    {
        id: 2,
        title: "Digital Transformation",
        href: "/services/digital-transformation",
        icon: "/services/digital-transformation.svg",
        tagline: "Reimagine Business Through Intelligent Technology",
        desc: "We help organizations modernize systems, streamline workflows, and adopt advanced digital solutions that enable sustainable growth and operational agility.",
    },
    {
        id: 3,
        title: "Software Development",
        href: "/services/software-development",
        icon: "/services/software-development.svg",
        tagline: "Custom Software Built for Enterprise Scale",
        desc: "Our custom software development services deliver secure, scalable, and performance-driven applications tailored to your business processes.",
    },
    {
        id: 4,
        title: "Mobile App Development",
        href: "/services/mobile-app-development",
        icon: "/services/mobile-app-development.svg",
        tagline: "High-Performance Apps for Modern Users",
        desc: "As a mobile app development company, we build native and cross-platform applications designed for speed, scalability, and exceptional user experience.",
    },
    {
        id: 5,
        title: "Web Development",
        href: "/services/web-development",
        icon: "/services/web-development.svg",
        tagline: "Enterprise Web Platforms That Perform",
        desc: "We develop secure, scalable, and high-performance web applications that support business growth, digital engagement, and seamless integrations.",
    },
    {
        id: 6,
        title: "eCommerce Solution",
        href: "/services/ecommerce-development",
        icon: "/services/ecommerce.svg",
        tagline: "Conversion-Focused Commerce Platforms",
        desc: "We build powerful eCommerce solutions and digital storefronts that drive online sales, enhance customer experience, and support business scalability.",
    },
    {
        id: 7,
        title: "IoT Intelligence Engineering",
        href: "/services/iot",
        icon: "/services/iot-development.svg",
        tagline: "Connecting Devices with Intelligent Systems",
        desc: "Our IoT solutions combine sensors, connectivity, and analytics to create smart ecosystems that monitor, automate, and optimize operations.",
    },
    {
        id: 8,
        title: "BigData & Data Analytics",
        href: "/services/big-data",
        icon: "/services/analytics-data.svg",
        tagline: "Turn Complex Data into Strategic Insight",
        desc: "As a data analytics and machine learning development company, we transform raw data into actionable intelligence for smarter business decisions.",
    },
    {
        id: 9,
        title: "Cloud and DevOps",
        href: "/services/cloud-and-devops-solutions",
        icon: "/services/azuredevops.svg",
        tagline: "Cloud-Native Infrastructure for Scalability",
        desc: "Our cloud and DevOps services streamline deployments, improve reliability, and enable businesses to scale applications securely and efficiently.",
    },
    {
        id: 10,
        title: "Blockchain Development",
        href: "/services/blockchain-development",
        icon: "/services/blockchain.svg",
        tagline: "Secure Decentralized Systems for the Future",
        desc: "We build blockchain platforms, smart contracts, and decentralized applications designed for transparency, security, and trust.",
    },
    {
        id: 11,
        title: "On-Demand Tech Talent",
        href: "/services/staff-augmentation",
        icon: "/services/staff-augmentation.svg",
        tagline: "Extend Your Team with Elite Engineers",
        desc: "Our staff augmentation services provide experienced developers, engineers, and AI specialists ready to accelerate your technology roadmap.",
    },
    {
        id: 12,
        title: "360 Digital Marketing",
        href: "/services/360-digital-marketing",
        icon: "/services/digital-marketing.svg",
        tagline: "Data-Driven Marketing That Delivers Growth",
        desc: "Our digital marketing services combine SEO, performance marketing, and analytics to attract qualified traffic and generate measurable results.",
    },
];

export default function ServiceSection() {
    const carouselRef = useRef(null);
    const [scrollStep, setScrollStep] = useState(0);

    const updateMeasurements = useCallback(() => {
        const track = carouselRef.current;
        if (!track) return;
        // Defer layout reads to next frame to avoid forced reflow (read after any pending layout)
        requestAnimationFrame(() => {
            const containerWidth = track.offsetWidth;
            const firstCard = track.firstElementChild;
            const gap = firstCard
                ? parseFloat(getComputedStyle(track).gap) || 16
                : 16;
            const cardWidth = firstCard ? firstCard.offsetWidth : 300;
            const cardsPerStep = getCardsPerStep(containerWidth);
            setScrollStep(cardsPerStep * (cardWidth + gap));
        });
    }, []);

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

    useEffect(() => {
        updateMeasurements();
    }, [updateMeasurements]);

    useEffect(() => {
        const track = carouselRef.current;
        if (!track) return;
        const ro = new ResizeObserver(updateMeasurements);
        ro.observe(track);
        return () => ro.disconnect();
    }, [updateMeasurements]);

    const nextSlide = useCallback(() => {
        const track = carouselRef.current;
        if (!track) return;
        const maxScroll = track.scrollWidth - track.clientWidth;
        // Reached the last card → loop back to the first
        if (track.scrollLeft >= maxScroll - 2) {
            track.scrollTo({ left: 0, behavior: "smooth" });
            return;
        }
        track.scrollBy({ left: scrollStep || track.offsetWidth, behavior: "smooth" });
    }, [scrollStep]);

    const prevSlide = useCallback(() => {
        const track = carouselRef.current;
        if (!track) return;
        // At the first card → loop to the last
        if (track.scrollLeft <= 2) {
            track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
            return;
        }
        track.scrollBy({ left: -(scrollStep || track.offsetWidth), behavior: "smooth" });
    }, [scrollStep]);

    const headingText = "Top AI & Software Development Company in India Delivering Digital Transformation";

    return (
        <section
            className="relative py-12 sm:py-16 md:py-14 lg:py-14 bg-cover bg-center min-w-0 overflow-x-hidden"
            style={{ backgroundImage: "url('/bg-hexagon.svg')" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mb-12">

                {/* Header */}
                <div className="relative mb-8 md:mb-20">
                    <div className="text-center max-w-5xl mx-auto">
                        <SectionBadge text="Services" variant="light" />
                        <m.h1
                            variants={headingVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-xl md:text-[20px] font-bold text-[#1E293B] leading-tight mt-4 px-0"
                        >
                            {headingText.split("").map((char, index) => (
                                <m.span key={index} variants={letterVariants}>
                                    {char}
                                </m.span>
                            ))}
                        </m.h1>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="hidden md:flex gap-4 justify-center md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 mt-8 md:mt-0">
                        <button
                            onClick={prevSlide}
                            className="w-11 h-11 md:w-13 md:h-13 cursor-pointer rounded-full bg-[#474972] flex items-center justify-center text-white hover:opacity-90 transition active:scale-95"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="text-xs md:text-sm" size={16} aria-hidden />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="w-11 h-11 md:w-13 md:h-13 cursor-pointer rounded-full bg-[#474972] flex items-center justify-center text-white hover:opacity-90 transition active:scale-95"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="text-xs md:text-sm" size={16} aria-hidden />
                        </button>
                    </div>
                </div>

                {/* Manually scrollable slider: native horizontal scroll with momentum + soft snap (swipe / drag / wheel) plus prev-next buttons */}
                <div
                    ref={carouselRef}
                    className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto overflow-y-visible scroll-smooth snap-x snap-proximity overscroll-x-contain pt-12 pb-8 -mt-12 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
                >
                    {services.map((service, index) => (
                            <m.div
                                key={`service-${index}`}
                                whileHover={{ y: -8 }}
                                className="group flex-shrink-0 snap-start w-[260px] sm:w-[300px] md:w-[320px] lg:w-[360px] xl:w-[380px] 2xl:w-[400px] bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg relative transition-all duration-500 ease-in-out hover:bg-[#565a98] hover:shadow-2xl"
                            >

                                {/* Arrow Button — linked to service page */}
                                <Link
                                    href={service.href}
                                    aria-label={`Go to ${service.title} service`}
                                    className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#565a98] md:bg-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition duration-500"
                                >
                                    <svg
                                        className="w-4 h-4 sm:w-5 sm:h-5 text-white md:text-[#565a98] transition duration-500"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        aria-hidden
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M7 17L17 7M7 7h10v10"
                                        />
                                    </svg>
                                </Link>

                                {/* Icon */}
                                <div className="relative mb-6 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">

                                    {/* Glow */}
                                    <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition duration-500 group-hover:opacity-100" />

                                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#565a98] flex items-center justify-center transition duration-500 group-hover:bg-white/20">

                                        <Image
                                            src={service.icon}
                                            alt={service.title}
                                            width={24}
                                            height={24}
                                            className="transition duration-500 group-hover:scale-x-[-1]"
                                        />
                                    </div>
                                </div>

                                {/* Title — plain, no link */}
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 group-hover:text-white transition duration-300">
                                    {service.title}
                                </h3>

                                {/* Tagline */}
                                <p className="text-sm sm:text-base text-gray-700 font-medium mb-2 group-hover:text-indigo-100 transition duration-300">
                                    {service.tagline}
                                </p>

                                {/* Description */}
                                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-indigo-200 transition duration-300">
                                    {service.desc}
                                </p>

                                {/* Bottom Number */}
                                <div className="mt-6 flex items-center gap-3">
                                    <span className="w-8 sm:w-10 h-[2px] bg-gray-400 group-hover:bg-white transition duration-300" />
                                    <span className="text-xs sm:text-sm font-semibold text-gray-500 group-hover:text-white transition duration-300">
                                        {String(service.id).padStart(2, "0")}
                                    </span>
                                </div>

                            </m.div>
                        ))}
                </div>
            </div>
        </section>
    );
}

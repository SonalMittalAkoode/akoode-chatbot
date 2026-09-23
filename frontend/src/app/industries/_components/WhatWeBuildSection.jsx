"use client";

import { useRef, useEffect } from "react";
import {
  FiZap,
  FiSmartphone,
  FiGlobe,
  FiFileText,
  FiBarChart2,
  FiCpu,
  FiShield,
  FiClipboard,
  FiLayers,
} from "react-icons/fi";
import { resolveIcon } from "@/app/country/_components/shared";
import resolveImageUrl from "@/utils/resolveImageUrl";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const DEFAULT_SERVICES = [
  {
    title: "AI-Powered Real Estate Solutions",
    desc: "Harness the power of artificial intelligence to transform your real estate business. Our AI solutions automate property valuations, predict market trends, and enhance customer interactions.",
    Icon: FiZap,
  },
  {
    title: "Real Estate App Development",
    desc: "Custom mobile and web applications tailored for real estate professionals. From property listings to virtual tours, we create seamless digital experiences.",
    Icon: FiSmartphone,
  },
  {
    title: "Real Estate Web Platform Development",
    desc: "Build powerful, scalable web platforms that connect buyers, sellers, and agents. Our platforms are built with modern technologies for optimal performance.",
    Icon: FiGlobe,
  },
  {
    title: "Property Management Software",
    desc: "Streamline your property management with our custom software solutions. Track tenants, manage maintenance, and automate workflows all in one place.",
    Icon: FiFileText,
  },
  {
    title: "Real Estate Analytics & Insights",
    desc: "Turn data into actionable insights with our analytics platforms. Track market trends, property performance, and customer behavior to make informed decisions.",
    Icon: FiBarChart2,
  },
  {
    title: "AI/ML & Immersive Technologies",
    desc: "Leverage machine learning and immersive tech like VR/AR to provide cutting-edge property visualization and predictive analytics for your clients.",
    Icon: FiCpu,
  },
  {
    title: "Blockchain-Based Real Estate Solutions",
    desc: "Implement secure, transparent blockchain technology for property transactions, smart contracts, and decentralized real estate marketplaces.",
    Icon: FiShield,
  },
  {
    title: "Enterprise Real Estate Solutions",
    desc: "Large-scale enterprise solutions for real estate corporations. We build robust systems that handle millions of properties and transactions securely.",
    Icon: FiClipboard,
  },
];

function ServiceCard({ svc }) {
  return (
    <div className="group relative rounded-2xl h-full flex flex-col bg-white border-transparent lg:border lg:border-[#E5E7EB] shadow-[0_10px_30px_rgba(29,32,51,0.2)] lg:shadow-[0_1px_2px_rgba(16,24,40,0.04)] lg:hover:border-transparent lg:hover:shadow-[0_10px_30px_rgba(29,32,51,0.2)] transition-[box-shadow,border-color] duration-500 cursor-pointer overflow-hidden">
      {/* Gradient overlay — always on mobile/tablet, fades in on hover at lg+ */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#576099] via-[#3A4066] to-[#1D2033] opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />

      {/* Content — sits above the overlay */}
      <div className="relative z-10 p-5 sm:p-6 lg:p-7 h-full flex flex-col">
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-[12px] flex items-center justify-center mb-6 sm:mb-8 lg:mb-10 overflow-hidden">
          {/* Icon chip — dark by default on mobile, light by default on lg with hover swap */}
          <span aria-hidden="true" className="absolute inset-0 bg-[#EEF2FF] opacity-0 lg:opacity-100 transition-opacity duration-500 lg:group-hover:opacity-0" />
          <span aria-hidden="true" className="absolute inset-0 bg-[#1D1F4B] opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500" />
          {svc.imgSrc
            ? <img src={svc.imgSrc} alt={svc.title || "Service icon"} className="relative w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] object-contain brightness-0 invert lg:brightness-100 lg:invert-0 lg:group-hover:brightness-0 lg:group-hover:invert transition-all duration-500" />
            : <svc.Icon className="relative w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] lg:w-[22px] lg:h-[22px] text-white lg:text-[#434A77] lg:group-hover:text-white transition-colors duration-500" />
          }
        </div>
        <h3 className="text-[16px] sm:text-[18px] font-semibold leading-[1.35] mb-2 sm:mb-2.5 text-white lg:text-[#101828] lg:group-hover:text-white transition-colors duration-500 m-0">
          {svc.title}
        </h3>
        <div
          className="text-[14px] leading-[22px] text-white/85 lg:text-[#4A5565] lg:group-hover:text-white/85 transition-colors duration-500 [&_p]:m-0"
          dangerouslySetInnerHTML={{ __html: processHtmlLinks(svc.desc || svc.description || "") }}
        />
      </div>
    </div>
  );
}

const AUTO_INTERVAL = 3500;

export default function WhatWeBuildSection({ data }) {
  const services = data?.items?.length > 0
    ? data.items.map((it) => {
        const isImg = it.icon && (it.icon.startsWith("/") || it.icon.startsWith("http"));
        return { ...it, Icon: isImg ? null : resolveIcon(it.icon, FiLayers), imgSrc: isImg ? resolveImageUrl(it.icon) : null };
      })
    : DEFAULT_SERVICES;
  const eyebrow = data?.eyebrow;
  const heading = data?.heading || "Real Estate Software Development Services";
  const subtitle = data?.subtitle || "We specialize in creating innovative software solutions for the real estate industry. From AI-powered platforms to custom mobile apps, we deliver technology that drives growth and efficiency.";
  const trackRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      const el = trackRef.current;
      if (!el || window.matchMedia("(min-width: 1024px)").matches) return;
      const step = el.clientWidth * 0.85;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: step, behavior: "smooth" });
    }, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-[#F8FAFF] py-16 sm:py-20 lg:py-24 font-figtree">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16">
        {/* Section Heading */}
        <div className="text-left md:text-center mb-10 sm:mb-12 lg:mb-16 max-w-[1100px] mx-auto">
          {eyebrow && (
            <div className="text-[#4A5565] text-[14px] sm:text-[16px] lg:text-[18px] font-medium capitalize mb-3 sm:mb-4">
              {eyebrow}
            </div>
          )}
          <h2 className="mb-4 text-[#191A2E] text-[24px] sm:text-[28px] font-bold leading-tight sm:leading-8 capitalize">
            {heading}
          </h2>
          <div
            className="text-[#191A2E] text-sm sm:text-base font-normal capitalize leading-relaxed max-w-[960px] mx-auto [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: processHtmlLinks(subtitle) }}
          />
        </div>

        {/* Mobile/tablet: horizontal auto-scroll slider | Desktop: grid */}
        <div
          ref={trackRef}
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
          onTouchStart={() => {
            pausedRef.current = true;
          }}
          onTouchEnd={() => {
            setTimeout(() => {
              pausedRef.current = false;
            }, 1500);
          }}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-5 lg:overflow-visible lg:snap-none lg:pb-0"
        >
          {services.map((svc, idx) => (
            <div
              key={idx}
              className="flex-none w-[78vw] sm:w-[300px] snap-start lg:w-auto lg:flex-auto"
            >
              <ServiceCard svc={svc} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

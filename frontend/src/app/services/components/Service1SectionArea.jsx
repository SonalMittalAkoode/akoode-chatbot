"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from "lucide-react";
import Button from '../../../components/Button';
import { hasHtmlContent, sanitizeRichText } from "@/utils/safeRichText";
import { resolveImageAlt } from '@/utils/imageAlt';

const SLIDER_INTERVAL_MS = 5000;

const buildAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  // Keep "public/" prefix if present - don't remove it
  let normalizedPath = path;

  // Remove leading slash if present (we'll add it back after base URL)
  normalizedPath = normalizedPath.startsWith("/") ? normalizedPath.slice(1) : normalizedPath;

  // Get API base URL - prefer NEXT_PUBLIC_API_URL, fallback to NEXT_PUBLIC_FRONTEND_API_URL
  const base =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_FRONTEND_API_URL) ||
    "";

  if (!base) {
    // If no base URL, return the path with leading slash
    return `/${normalizedPath}`;
  }

  // Normalize base URL (remove trailing slash)
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;

  // Construct full URL: base + / + path (keeping public/ if it exists)
  const fullUrl = `${normalizedBase}/${normalizedPath}`;

  return fullUrl;
};


const mapSteps = (steps) => {
  if (!Array.isArray(steps)) return [];
  return steps
    .map((step, index) => {
      const title = step?.titlestep ?? step?.title ?? "";
      const description = step?.descriptionstep ?? step?.description ?? "";
      if (!title && !description) {
        return null;
      }
      const imagePath = step?.imageurl || step?.imagestep || step?.imageUrl || step?.image || "";
      const iconUrl = imagePath ? buildAssetUrl(imagePath) : "";

      return {
        id: step?._id ?? step?.id ?? `service-step-${index}`,
        icon: iconUrl,
        imageAlt: step?.imagealt || "",
        title,
        description,
        number: String(index + 1).padStart(2, "0"),
      };
    })
    .filter(Boolean);
};

/** Extract first anchor href from HTML string (e.g. from service description) */
const extractLinkFromHtml = (html) => {
  if (!html || typeof html !== "string") return null;
  const match = html.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/i);
  return match ? match[1] : null;
};

const getSpanClass = (index, total) => {
  // Mobile: Always full width (will be handled by col-span-12)

  // Desktop logic for 12-column grid
  if (total === 4) {
    return 'lg:col-span-6'; // 2 per row
  }
  if (total === 5) {
    return index < 2 ? 'lg:col-span-6' : 'lg:col-span-4'; // 2 in 1st row, 3 in 2nd row
  }
  if (total === 6) {
    return 'lg:col-span-4'; // 3 per row (3-3)
  }
  if (total === 7) {
    if (index < 2) return 'lg:col-span-6'; // 1st row: 2 cards
    if (index < 5) return 'lg:col-span-4'; // 2nd row: 3 cards
    return 'lg:col-span-6'; // 3rd row: 2 cards (2-3-2)
  }
  if (total >= 8) {
    if (index < 2) return 'lg:col-span-6'; // 1st row: 2 cards
    return 'lg:col-span-4'; // Subsequent rows: 3 cards
  }

  // Fallback / Defaults
  return 'lg:col-span-4';
};

/** Single service card content - shared by slider and grid */
function ServiceCardInner({ service, iconSrc, linkHref }) {
  return (
    <div className="relative z-[1] w-full flex flex-col rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 md:p-6 h-auto overflow-hidden shadow-[0_0.25rem_0.75rem_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_4px_40px_rgba(0,0,0,0.09)] group after:content-[''] after:absolute after:inset-0 after:left-1/2 after:-translate-x-1/2 after:w-[0px] after:bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] after:-z-10 after:opacity-0 after:transition-all after:duration-500 hover:after:rounded-xl hover:after:w-full hover:after:opacity-100">
      {linkHref && (
        <a
          href={linkHref}
          aria-label={`Learn more about ${service.title || 'this service'}`}
          className="absolute -right-[100px] -top-[100px] transition-all duration-[400ms] group-hover:top-7 group-hover:right-7 z-10"
        >
          <div className="h-[40px] w-[40px] sm:h-[45px] sm:w-[45px] inline-flex items-center justify-center bg-white text-[#474972] rounded-full -rotate-45 hover:rotate-0 transition-transform duration-300 shadow-sm">
            <ArrowRight size={18} className="sm:w-5 sm:h-5" aria-hidden="true" />
          </div>
        </a>
      )}
      <div className="w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] rounded-full flex items-center justify-center bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] shrink-0 transition-all duration-400 group-hover:scale-110 group-hover:bg-white mb-2 sm:mb-3">
      <Image
          src={iconSrc || "/images/artificial-intelligence/3d-metaverse/augmented-reality.svg"}
          alt={resolveImageAlt(service.imageAlt, service.title || "service")}
          width={30}
          height={30}
          className="max-w-[26px] max-h-[26px] sm:max-w-[30px] sm:max-h-[30px] object-contain transition-all duration-400"
        />
      </div>
      <h3 className="text-[#1a1a1a] font-semibold text-[16px] sm:text-[18px] leading-tight sm:leading-8 transition-colors duration-400 group-hover:text-white">
        {service.title}
      </h3>
      {service.description && hasHtmlContent(service.description) ? (
        <div className="mt-3 sm:mt-4 text-[#37385C] text-[13px] sm:text-[14px] leading-[1.4] sm:leading-[22px] flex-1 prose prose-sm max-w-none transition-colors duration-400 group-hover:text-white group-hover:opacity-90 [&_a]:text-[#474972] [&_a]:underline group-hover:[&_a]:text-white" dangerouslySetInnerHTML={{ __html: sanitizeRichText(service.description) }} />
      ) : (
        <p className="mt-3 sm:mt-4 text-[#37385C] text-[13px] sm:text-[14px] leading-[1.4] sm:leading-[22px] flex-1 transition-colors duration-400 group-hover:text-white group-hover:opacity-90">{service.description}</p>
      )}
    </div>
  );
}

const sliderVariants = {
  enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
};

export default function Service1SectionArea({
  heading,
  description,
  steps,
}) {
  const dynamicServices = mapSteps(steps);
  const iconFallbackPool = dynamicServices.map((item) => item.icon);
  const usingDynamic = dynamicServices.length > 0;
  const services = dynamicServices;

  const [sliderIndex, setSliderIndex] = useState(0);
  const [sliderDirection, setSliderDirection] = useState(1);

  const goTo = useCallback((nextIndex) => {
    setSliderDirection(nextIndex > sliderIndex ? 1 : -1);
    setSliderIndex(nextIndex);
  }, [sliderIndex]);

  const goNext = useCallback(() => {
    const next = (sliderIndex + 1) % services.length;
    goTo(next);
  }, [sliderIndex, services.length, goTo]);

  const goPrev = useCallback(() => {
    const prev = (sliderIndex - 1 + services.length) % services.length;
    goTo(prev);
  }, [sliderIndex, services.length, goTo]);

  useEffect(() => {
    if (services.length <= 1) return;
    const t = setInterval(goNext, SLIDER_INTERVAL_MS);
    return () => clearInterval(t);
  }, [sliderIndex, services.length, goNext]);

  const headingText = heading && heading !== "Our Services" ? heading : null;
  const descriptionText = description || "";
  const hasHtmlDescription = hasHtmlContent(description);

  return (
    <div className="relative z-[1] bg-gray-100 py-12 sm:py-16 md:py-[40px]" id="es">
      <div className="container font-figtree mx-auto px-[2rem] md:px-10 lg:px-[70px]">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10 md:mb-[60px]">
          {heading && (
            <h2 className="text-[#1a1a1a] font-bold text-[24px] sm:text-[28px] leading-tight sm:leading-8 transition-colors duration-400">
              {heading}
            </h2>
          )}
          {headingText && <div className="h-3 sm:h-4" />}
          {hasHtmlDescription ? (
            <div className="prose prose-sm sm:prose max-w-none text-gray-600 text-left sm:text-center [&_a]:text-[#474972] [&_a]:underline" dangerouslySetInnerHTML={{ __html: sanitizeRichText(descriptionText) }} />
          ) : (
            <p className="text-gray-600 text-sm sm:text-base">{descriptionText}</p>
          )}
        </div>

        {/* MOBILE: Slider (1 card at a time, auto-advance) */}
        {services.length > 0 && (
          <div className="md:hidden relative w-full">
            <div className="overflow-hidden w-full min-h-[280px]">
              <AnimatePresence mode="wait" initial={false} custom={sliderDirection}>
                <m.div
                  key={sliderIndex}
                  custom={sliderDirection}
                  variants={sliderVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                  className="w-full"
                >
                  <ServiceCardInner
                    service={services[sliderIndex]}
                    iconSrc={services[sliderIndex].icon || (usingDynamic ? iconFallbackPool[sliderIndex % iconFallbackPool.length] : undefined)}
                    linkHref={extractLinkFromHtml(services[sliderIndex].description)}
                  />
                </m.div>
              </AnimatePresence>
            </div>
            {/* Dots */}
            {services.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {services.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all duration-200"
                  >
                    <span
                      className={`h-2 rounded-full transition-all duration-200 block ${i === sliderIndex ? "w-6 bg-[#474972]" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
                      aria-hidden
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TABLET + DESKTOP: Grid */}
        <div className="hidden md:grid grid-cols-12 gap-4 lg:gap-6">
          {services.map((service, index) => {
            const iconSrc = service.icon || (usingDynamic ? iconFallbackPool[index % iconFallbackPool.length] : undefined);
            const spanClass = getSpanClass(index, services.length);
            const linkHref = extractLinkFromHtml(service.description);
            return (
              <m.div
                key={service.id ?? index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`col-span-12 md:col-span-6 ${spanClass} flex`}
              >
                <ServiceCardInner service={service} iconSrc={iconSrc} linkHref={linkHref} />
              </m.div>
            );
          })}
        </div>

        {/* CTA BUTTON */}
        <m.div
          className="max-w-md mx-auto mt-6 sm:mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button
            text="Start Your Project Now"
            href="/post-requirement"
          />
        </m.div>
      </div>
    </div>
  );
}
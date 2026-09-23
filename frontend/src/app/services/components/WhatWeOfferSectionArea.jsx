"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { hasHtmlContent, normalizeHtml, sanitizeRichText } from "@/utils/safeRichText";
import { resolveImageAlt } from "@/utils/imageAlt";

const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

const buildAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_FRONTEND_API_URL) ||
    "";
  if (!base) {
    return path.startsWith("/") ? path : `/${path}`;
  }
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function WhatWeOfferSectionArea({
  eyebrow = "What We Offer",
  heading = "",
  features = []
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCardsToShow(1.2); // Partial cards for better mobile hint
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!Array.isArray(features) || features.length === 0) {
    return null;
  }

  const headingText = heading || "";
  const hasHtmlHeading = hasHtmlContent(headingText);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <section className="relative py-20 bg-[#f8faff] overflow-hidden font-figtree">
      {/* SEO: every feature rendered in DOM for crawlers (carousel below only shows the visible window). */}
      <div className="sr-only">
        {eyebrow && <h2>{stripHtml(eyebrow)}</h2>}
        {features.map((f, i) => {
          const t = f?.title || f?.titlestep || "";
          const d = f?.description || f?.descriptionstep || "";
          return (
            <div key={`seo-${f?._id || f?.id || i}`}>
              {t && <h3>{stripHtml(t)}</h3>}
              {d && <p>{stripHtml(d)}</p>}
            </div>
          );
        })}
      </div>

      <div className="container font-figtree mx-auto px-[2rem] md:px-[70px]">
        {/* Header */}
        <div className="relative flex flex-col items-center mb-16 px-4">
          <div className="max-w-3xl text-center mx-auto">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-[#1a1a1a] font-bold text-[24px] sm:text-[28px] leading-tight sm:leading-8 transition-colors duration-400">
                {eyebrow || "What We Offer"}
              </h2>
              <div className="mt-6">
                {hasHtmlHeading ? (
                  <p
                    className="text-gray-600 text-sm sm:text-base"
                    dangerouslySetInnerHTML={{ __html: sanitizeRichText(normalizeHtml(headingText)) }}
                  />
                ) : (
                  <p className="text-gray-600 text-sm sm:text-base">
                    {headingText}
                  </p>
                )}
              </div>
            </m.div>
          </div>

          {/* Navigation Buttons - Similar to Testimonials */}
          {features.length > cardsToShow && (
            <div className="flex gap-4 mt-8 md:mt-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
              <button
                onClick={prevSlide}
                className="w-12 h-12 cursor-pointer rounded-full bg-[#474972] flex items-center justify-center text-white hover:bg-[#585c9c] transition-all active:scale-95 shadow-md"
                aria-label="Previous slide"
              >
                <ChevronLeft size={16} aria-hidden />
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 cursor-pointer rounded-full bg-[#474972] flex items-center justify-center text-white hover:bg-[#585c9c] transition-all active:scale-95 shadow-md"
                aria-label="Next slide"
              >
                <ChevronRight size={16} aria-hidden />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          <div className="overflow-visible">
            <m.div
              className="flex gap-8"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, { offset }) => {
                const swipe = Math.abs(offset.x) > 50;
                if (swipe && features.length > cardsToShow) {
                  if (offset.x > 0) prevSlide();
                  else nextSlide();
                }
              }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <div className="flex gap-8 w-full transition-transform duration-500 ease-out">
                  {Array.from({ length: Math.ceil(cardsToShow) }).map((_, i) => {
                    const featureIndex = (currentIndex + i) % features.length;
                    const feature = features[featureIndex];
                    const imageUrl = buildAssetUrl(
                      feature?.imageurl || feature?.imagestep || feature?.image
                    );
                    const tag = feature?.tag || "";
                    const title = feature?.title || feature?.titlestep || "";
                    const description = feature?.description || feature?.descriptionstep || "";
                    const link = feature?.link || feature?.linkstep || "";
                    const imageAlt = feature?.imagealt || "";
                    const hasHtmlDescription = hasHtmlContent(description);

                    return (
                      <m.div
                        key={`${feature?._id || feature?.id || featureIndex}-${i}`}
                        initial={{ opacity: 0, scale: 0.95, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95, x: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative rounded-3xl overflow-hidden shadow-lg group/item flex-shrink-0"
                        style={{
                          flexBasis: `calc((100% - ${(Math.ceil(cardsToShow) - 1) * 2}rem) / ${cardsToShow})`,
                          minWidth: typeof window !== "undefined" && window.innerWidth < 768 ? "85%" : "auto"
                        }}
                      >
                         <div className="min-h-[450px] md:min-h-[400px] h-auto relative">
                          <Image
                            src={imageUrl || "/images/ios/app-development.jpg"}
                            alt={resolveImageAlt(imageAlt, title || "Service")}
                            fill
                            className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#010225]/90 via-[#010225]/40 to-transparent opacity-80 group-hover/item:opacity-90 transition-opacity"></div>

                          {/* Content Overlay */}
                          <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                            {/* {tag && <p className="text-[#eff1ff] text-sm font-medium tracking-wider uppercase mb-2 opacity-100 translate-y-0 md:opacity-0 md:-translate-y-4 md:group-hover/item:opacity-100 md:group-hover/item:translate-y-0 transition-all duration-500 delay-100 font-figtree">{tag}</p>} */}
                            {title && <h3 className="text-2xl md:text-3xl font-bold mb-4 opacity-100 translate-y-0 md:opacity-0 md:-translate-y-4 md:group-hover/item:opacity-100 md:group-hover/item:translate-y-0 transition-all duration-500 delay-200 font-figtree">{title}</h3>}
                            {description && (
                              <div className="opacity-100 translate-y-0 md:opacity-0 md:-translate-y-4 md:group-hover/item:opacity-100 md:group-hover/item:translate-y-0 transition-all duration-500 delay-300">
                                {hasHtmlDescription ? (
                                  <div className="text-gray-200 text-sm line-clamp-9 md:line-clamp-7  mb-6 font-figtree [&_a]:text-white [&_a]:underline" dangerouslySetInnerHTML={{ __html: sanitizeRichText(normalizeHtml(description)) }} />
                                ) : (
                                  <p className="text-gray-200 text-sm line-clamp-9 md:line-clamp-7 mb-6 font-figtree">{description}</p>
                                )}
                              </div>
                            )}
                            {link && (
                              <m.a
                                href={link}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-12 h-12 rounded-full bg-white text-[#010225] flex items-center justify-center self-start opacity-100 translate-y-0 md:opacity-0 md:-translate-y-4 md:group-hover/item:opacity-100 md:group-hover/item:translate-y-0 transition-all duration-500 delay-400 hover:bg-[#474972] hover:text-white"
                                aria-label="View more"
                              >
                                <ArrowRight size={20} aria-hidden />
                              </m.a>
                            )}
                          </div>
                        </div>
                      </m.div>
                    );
                  })}
                </div>
              </AnimatePresence>
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
}
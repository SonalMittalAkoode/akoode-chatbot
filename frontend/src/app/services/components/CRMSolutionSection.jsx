"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import { processHtmlLinks } from "@/utils/processHtmlLinks";

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

const normalizeBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  if (typeof value === "number") return value === 1;
  return fallback;
};

const mapSteps = (steps) => {
  if (!Array.isArray(steps)) return [];
  return steps
    .map((step, index) => {
      const title = step?.titlestep ?? step?.title ?? "";
      const description = step?.descriptionstep ?? step?.description ?? "";
      const image = step?.imageurl || step?.imagestep || step?.imageUrl || "";
      const subtitle = step?.subtitlestep ?? step?.subtitle ?? "";

      if (!title && !description) {
        return null;
      }

      // Generate tab IDs dynamically - use predefined names for first 4, then use index
      const tabNames = ['home', 'profile', 'contact', 'activity'];
      const tabName = index < tabNames.length ? tabNames[index] : `tab-${index}`;

      return {
        id: step?._id ?? step?.id ?? `crm-step-${index}`,
        title,
        description,
        subtitle,
        image: buildAssetUrl(image),
        tabId: `pills-${tabName}`,
        tabButtonId: `pills-${tabName}-tab`,
      };
    })
    .filter(Boolean);
};

// Short label for pill (first 2 words or first ~20 chars) so it fits in slider
const getPillLabel = (tab) => {
  const title = tab?.title || "";
  const words = title.trim().split(/\s+/);
  if (words.length <= 2) return title;
  return words.slice(0, 2).join(" ");
};

export default function CRMSolutionSection({ service }) {
  const [isClient, setIsClient] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if industry section is enabled
  const isIndustryEnabled = normalizeBoolean(
    service?.industryhow,
    Array.isArray(service?.industrystep) && service.industrystep.length > 0
  );

  // Map industry steps to tabs
  const dynamicTabs = mapSteps(service?.industrystep || []);
  const sectionTitle = service?.industrytitle || "CRM Solutions";

  // Don't render if industry section is not enabled or no steps
  if (!isIndustryEnabled || !dynamicTabs || dynamicTabs.length === 0) {
    return null;
  }

  const hasHtmlContent = (text) => text && (text.includes('<') || text.includes('&lt;'));

  const goTo = useCallback((index) => {
    const i = Math.max(0, Math.min(index, dynamicTabs.length - 1));
    setActiveIndex(i);
    if (typeof window !== "undefined" && window.bootstrap?.Tab && isClient) {
      const btn = document.getElementById(dynamicTabs[i]?.tabButtonId);
      if (btn) new window.bootstrap.Tab(btn).show();
    }
  }, [dynamicTabs, isClient]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined" || !isClient) return;

    const initializeTabs = () => {
      // Check if Bootstrap is available
      if (!window.bootstrap) {
        setTimeout(initializeTabs, 500);
        return;
      }

      // Check if document and required elements exist
      if (!document || !document.querySelector) {
        setTimeout(initializeTabs, 500);
        return;
      }

      // Wait for DOM to be ready
      if (window.$) {
        $(document).ready(() => {
          // Initialize Bootstrap tabs
          if (window.bootstrap && window.bootstrap.Tab) {
            const tabElements = document.querySelectorAll(
              '#pills-tab button[data-bs-toggle="pill"]'
            );
            tabElements.forEach((element) => {
              try {
                new window.bootstrap.Tab(element);
              } catch (error) {
                console.error("Error initializing tab for element:", error);
              }
            });
          }
        });
      } else {
        // Fallback if jQuery is not available
        setTimeout(() => {
          if (window.bootstrap && window.bootstrap.Tab) {
            const tabElements = document.querySelectorAll(
              '#pills-tab button[data-bs-toggle="pill"]'
            );
            tabElements.forEach((element) => {
              try {
                new window.bootstrap.Tab(element);
              } catch (error) {
                console.error("Error initializing tab for element:", error);
              }
            });
          }
        }, 100);
      }
    };

    // Add a delay to ensure DOM is fully rendered
    const timer = setTimeout(initializeTabs, 200);

    // Cleanup function
    return () => {
      clearTimeout(timer);
    };
  }, [isClient, dynamicTabs]);

  return (
    <section id="crms" className="bg-light py-8 sm:py-10 md:py-12 lg:p-5">
      <div className="crm-solutions service2-section-area sp1">
        <div className="container px-[2rem] md:px-8">
          <div className="service-header text-center heading2 mb-6 sm:mb-8 md:mb-10">
            <h2 className="space-margin30 text-[22px] sm:text-[26px] md:text-[30px] lg:text-[34px] font-bold text-[#1E293B] leading-snug sm:leading-tight max-w-full">
              {sectionTitle}
            </h2>
          </div>
          <div className="row">
            <div className="col-12 col-lg-10 m-auto">
              <div className="service-widgets-section">
                {/* Mobile/tablet: single pane driven by slider index */}
                <div className="lg:hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    {(() => {
                      const tab = dynamicTabs[activeIndex];
                      if (!tab) return null;
                      return (
                        <m.div
                          key={tab.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="row align-items-center g-4 g-lg-5"
                        >
                          <div className="col-12 col-lg-6 order-2 order-lg-1">
                            <div className="service-boxarea">
                              <div className="space28 h-4 sm:h-6 md:h-7"></div>
                              <div className="content-area">
                                <h3 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-semibold text-[#1E293B] leading-tight">
                                  {tab.title}
                                </h3>
                                <div className="space16 h-3 sm:h-4"></div>
                                {hasHtmlContent(tab.description) ? (
                                  <div
                                    className="ckeditor-content text-[14px] sm:text-[15px] md:text-base text-[#505169] leading-relaxed [&_a]:text-[#474972] [&_a]:underline"
                                    dangerouslySetInnerHTML={{ __html: processHtmlLinks(tab.description) }}
                                  />
                                ) : (
                                  <p className="text-[14px] sm:text-[15px] md:text-base text-[#505169] leading-relaxed mb-0">
                                    {tab.description}
                                  </p>
                                )}
                                <div className="space28 h-5 sm:h-6 md:h-7"></div>
                                <Link
                                  href="/contact-us"
                                  className="vl-btn2 inline-flex items-center gap-1.5 text-[13px] sm:text-[14px] md:text-base font-medium text-[#474972] hover:text-[#2A2B44] transition-colors"
                                >
                                  Learn More
                                  <ArrowRight className="inline-block shrink-0" size={14} />
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-lg-1 d-none d-lg-block"></div>
                          <div className="col-12 col-lg-5 order-1 order-lg-2">
                            <div className="images-area">
                              <div className="img1 reveal rounded-lg overflow-hidden">
                                <Image
                                  src={tab.image || "/images/custom-soft-dev/end-to-end.webp"}
                                  alt={tab.title}
                                  width={500}
                                  height={500}
                                  className="img-fluid w-full h-auto object-cover"
                                />
                              </div>
                            </div>
                          </div>
                        </m.div>
                      );
                    })()}
                  </AnimatePresence>
                </div>

                {/* Desktop: Bootstrap tab panes */}
                <div className="hidden lg:block tab-content" id="pills-tabContent">
                  {dynamicTabs.map((tab, index) => (
                    <div
                      key={tab.id}
                      className={`tab-pane fade ${index === 0 ? 'show active' : ''}`}
                      id={tab.tabId}
                      role="tabpanel"
                      aria-labelledby={tab.tabButtonId}
                      tabIndex={0}
                    >
                      <div className="row align-items-center g-4 g-lg-5">
                        <div className="col-12 col-lg-6 order-2 order-lg-1">
                          <div className="service-boxarea">
                            <div className="space28 h-4 sm:h-6 md:h-7"></div>
                            <div className="content-area">
                              <h3
                                data-aos="fade-left"
                                data-aos-duration="800"
                                className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-semibold text-[#1E293B] leading-tight"
                              >
                                {tab.title}
                              </h3>
                              <div className="space16 h-3 sm:h-4"></div>
                              {hasHtmlContent(tab.description) ? (
                                <div
                                  className="ckeditor-content text-[14px] sm:text-[15px] md:text-base text-[#505169] leading-relaxed [&_a]:text-[#474972] [&_a]:underline"
                                  data-aos="fade-left"
                                  data-aos-duration="900"
                                  dangerouslySetInnerHTML={{ __html: processHtmlLinks(tab.description) }}
                                />
                              ) : (
                                <p
                                  className="text-[14px] sm:text-[15px] md:text-base text-[#505169] leading-relaxed mb-0"
                                  data-aos="fade-left"
                                  data-aos-duration="900"
                                >
                                  {tab.description}
                                </p>
                              )}
                              <div className="space28 h-5 sm:h-6 md:h-7"></div>
                              <Link
                                href="/contact-us"
                                className="vl-btn2 inline-flex items-center gap-1.5 text-[13px] sm:text-[14px] md:text-base font-medium text-[#474972] hover:text-[#2A2B44] transition-colors"
                              >
                                Learn More <span className="sr-only">about {tab.title}</span>
                                <ArrowRight className="inline-block shrink-0" size={14} />
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-1 d-none d-lg-block"></div>
                        <div className="col-12 col-lg-5 order-1 order-lg-2">
                          <div className="images-area">
                            <div className="img1 reveal rounded-lg overflow-hidden">
                              <Image
                                src={tab.image || "/images/custom-soft-dev/end-to-end.webp"}
                                alt={tab.title}
                                width={500}
                                height={500}
                                className="img-fluid w-full h-auto object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space80 mt-8 sm:mt-10 md:mt-12 lg:mt-16"></div>

                {/* Mobile/tablet: pill slider — one pill at a time, text truncated, dots to switch */}
                <div className="lg:hidden tabs-btn-area w-full min-w-0 max-w-full">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto">
                      <AnimatePresence mode="wait" initial={false}>
                        <m.button
                          key={activeIndex}
                          type="button"
                          role="tab"
                          aria-selected="true"
                          aria-label={dynamicTabs[activeIndex]?.title}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.2 }}
                          className="nav-link active w-full rounded-full py-3 px-5 text-center text-sm sm:text-base font-medium text-white bg-[#474972] border-0 cursor-default shadow-sm"
                        >
                          <span className="block truncate">
                            {getPillLabel(dynamicTabs[activeIndex])}
                          </span>
                        </m.button>
                      </AnimatePresence>
                    </div>
                    <ul className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="CRM solution tabs">
                      {dynamicTabs.map((tab, index) => (
                        <li key={tab.id} role="presentation">
                          <button
                            type="button"
                            role="tab"
                            aria-selected={index === activeIndex}
                            aria-label={`${getPillLabel(tab)} tab`}
                            onClick={() => goTo(index)}
                            className={`h-2 rounded-full transition-all duration-200 ${index === activeIndex
                                ? "w-6 bg-[#474972]"
                                : "w-2 bg-[#474972]/30 hover:bg-[#474972]/50"
                              }`}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Desktop: Bootstrap pills */}
                <div className="hidden lg:block tabs-btn-area w-full min-w-0 max-w-full">
                  <ul className="nav nav-pills flex-wrap justify-content-center gap-2 sm:gap-3 py-2" id="pills-tab" role="tablist">
                    {dynamicTabs.map((tab, index) => {
                      const titleWords = tab.title.split(' ');
                      const firstLine = titleWords[0] || '';
                      const secondLine = tab.subtitle || titleWords.slice(1).join(' ') || '';

                      return (
                        <li key={tab.id} className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${index === 0 ? 'active' : ''} text-[11px] sm:text-[13px] md:text-sm px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-pill whitespace-nowrap`}
                            id={tab.tabButtonId}
                            data-bs-toggle="pill"
                            data-bs-target={`#${tab.tabId}`}
                            type="button"
                            role="tab"
                            aria-controls={tab.tabId}
                            aria-selected={index === 0 ? 'true' : 'false'}
                          >
                            {firstLine} {secondLine && <span>{secondLine}</span>}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

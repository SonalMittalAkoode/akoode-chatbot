"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionBadge from "../../components/SectionBadge";
import ReviewCard from "./ReviewCard";
import ReviewVideo from "./ReviewVideo";
import { getVideoTableData } from "@/api/frontend/video";
import { getTestimonialTableData } from "@/api/frontend/testimonial";

export default function Testimonials({ hideBadge = false, data, initialVideoTestimonials = [], initialTextTestimonials = [] }) {
  const headingText = data?.heading || "Hear from those who trusted us to bring their ideas to life";
  const [currentIndex, setCurrentIndex] = useState(0);
  // Seed state from server props so SSR HTML contains real content for crawlers.
  // Falls back to client-side fetch when not seeded (e.g. used outside homepage).
  const [videoTestimonials, setVideoTestimonials] = useState(initialVideoTestimonials);
  const [textTestimonials, setTextTestimonials] = useState(initialTextTestimonials);

  useEffect(() => {
    if (initialVideoTestimonials.length > 0 && initialTextTestimonials.length > 0) return;

    const fetchData = async () => {
      const [videoData, textData] = await Promise.all([
        getVideoTableData(),
        getTestimonialTableData()
      ]);

      if (videoData && videoData.length > 0) {
        setVideoTestimonials(videoData);
      }
      if (textData && textData.length > 0) {
        setTextTestimonials(textData);
      }
    };
    fetchData();
  }, []);

  // Variants for staggered letter animation
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

  // Total sets we can navigate through. 
  // We want to ensure we have enough videos to show 3 at a time.
  const totalItems = (videoTestimonials.length > 0 && textTestimonials.length > 0)
    ? Math.min(textTestimonials.length, videoTestimonials.length - 2)
    : 0;

  const nextSlide = () => {
    if (totalItems <= 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const prevSlide = () => {
    if (totalItems <= 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  if (videoTestimonials.length === 0 || textTestimonials.length === 0) return null;

  const stripHtml = (html) => String(html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

  return (
    <section className="relative md:py-14 py-8 bg-[#f7f8fc] overflow-hidden">
      {/* SEO: every text testimonial rendered in DOM for crawlers — the carousel
          above only shows the active one at a time. */}
      <div className="sr-only">
        <h2>Client testimonials</h2>
        {textTestimonials.map((t, i) => {
          const author = t?.name || t?.author || t?.clientname || "";
          const role = t?.designation || t?.role || t?.position || "";
          const text = t?.review || t?.testimonial || t?.message || t?.description || "";
          return (
            <blockquote key={`seo-tt-${t?._id || t?.id || i}`}>
              <p>{stripHtml(text)}</p>
              {(author || role) && <cite>{[author, role].filter(Boolean).join(", ")}</cite>}
            </blockquote>
          );
        })}
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="relative mb-8 md:mb-20">
          {/* Centered Content */}
          <div className="text-center max-w-3xl mx-auto">
            {!hideBadge && (
              <div className="flex justify-center">
                <SectionBadge text="WHAT OUR CLIENTS SAY" />
              </div>
            )}
            <m.h2
              variants={headingVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-xl md:text-[22px] font-bold text-[#1E293B] leading-tight mt-4 px-4"
            >
              {headingText.split("").map((char, index) => (
                <m.span key={index} variants={letterVariants}>
                  {char}
                </m.span>
              ))}
            </m.h2>
          </div>

          {/* Navigation Buttons - Positioned at bottom on mobile, side on desktop */}
          <div className="hidden md:flex gap-4 justify-center md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 mt-8 md:mt-0">
            <button
              onClick={prevSlide}
              className="w-11 h-11 md:w-13 md:h-13 cursor-pointer rounded-full bg-[#474972] flex items-center justify-center text-white hover:opacity-90 transition active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="text-xs md:text-sm" size={16} aria-hidden />
            </button>
            <button
              onClick={nextSlide}
              className="w-11 h-11 md:w-13 md:h-13 cursor-pointer rounded-full bg-[#474972] flex items-center justify-center text-white hover:opacity-90 transition active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight className="text-xs md:text-sm" size={16} aria-hidden />
            </button>
          </div>
        </div>

        {/* Carousel Grid */}
        <m.div
          className="flex flex-col lg:grid lg:grid-cols-6 gap-6 lg:gap-3 items-stretch"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_e, { offset }) => {
            const swipe = Math.abs(offset.x) > 50;
            if (swipe) {
              if (offset.x > 0) prevSlide();
              else nextSlide();
            }
          }}
        >
          {/* Review Card - Spans 3 columns (Left 50%) - Slides from Left */}
          <m.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:col-span-3 h-full overflow-hidden relative min-h-[250px] md:min-h-[300px]"
          >
            <AnimatePresence mode="wait">
              <m.div
                key={textTestimonials[currentIndex]._id || textTestimonials[currentIndex].id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="h-full"
              >
                <ReviewCard testimonial={textTestimonials[currentIndex]} />
              </m.div>
            </AnimatePresence>
          </m.div>

          {/* Video Section - Spans 3 columns (Right 50%) - Slides from Right */}
          <m.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-visible"
          >
            <AnimatePresence mode="popLayout">
              {videoTestimonials.slice(currentIndex, currentIndex + 3).map((video, idx) => (
                <m.div
                  key={video._id || video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className={`${idx >= 2 ? "hidden sm:block" : "block"} h-full`}
                >
                  <ReviewVideo video={video} />
                </m.div>
              ))}
            </AnimatePresence>
          </m.div>
        </m.div>

        {/* Mobile bullet pointers */}
        {totalItems > 0 && (
          <div className="flex justify-center gap-0 mt-6 md:hidden">
            {Array.from({ length: totalItems }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all duration-300"
              >
                <span
                  className={`h-2 rounded-full transition-all duration-300 block ${i === currentIndex ? "w-6 bg-[#474972]" : "w-2 bg-[#474972]/40"
                    }`}
                  aria-hidden
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { m } from "framer-motion";
import resolveImageUrl from "@/utils/resolveImageUrl";
import Image from 'next/image';

const FALLBACK_IMAGES = [
    { image: "/images/career/akoode-culture.webp", title: "Team Culture" }
];

export default function CultureShowcaseCarousel({ images = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [cardsPerView, setCardsPerView] = useState(3); // Default: 3 cards
    const [isTransitioning, setIsTransitioning] = useState(false);
    const trackRef = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const activeImages = images.length > 0 ? images : FALLBACK_IMAGES;

    // Set client-only flag
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Update cards per view based on window width
    useEffect(() => {
        if (!isClient) return;

        const updateCardsPerView = () => {
            const width = window.innerWidth;
            if (width >= 1200) {
                setCardsPerView(3); // 3 cards on large screens
            } else if (width >= 768) {
                setCardsPerView(2); // 2 cards on tablets
            } else {
                setCardsPerView(1); // 1 card on mobile
            }
        };

        updateCardsPerView();
        window.addEventListener('resize', updateCardsPerView);
        return () => window.removeEventListener('resize', updateCardsPerView);
    }, [isClient]);

    // Calculate total number of pages
    const totalPages = Math.ceil(activeImages.length / cardsPerView);

    // Handle pagination dot click with smooth transition
    const goToPage = (pageIndex) => {
        if (isTransitioning || pageIndex === currentIndex) return;
        setIsTransitioning(true);
        setCurrentIndex(pageIndex);
        setTimeout(() => setIsTransitioning(false), 1000); // Slightly longer than transition duration
    };

    // Handle touch events for mobile swipe
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (isTransitioning) return;

        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50; // Minimum swipe distance

        if (Math.abs(diff) > threshold) {
            setIsTransitioning(true);
            if (diff > 0 && currentIndex < totalPages - 1) {
                // Swipe left - next
                setCurrentIndex(prev => prev + 1);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - prev
                setCurrentIndex(prev => prev - 1);
            }
            setTimeout(() => setIsTransitioning(false), 1000);
        }
    };

    // Auto-scroll carousel every 5 seconds
    useEffect(() => {
        if (!isClient || totalPages <= 1) return;

        const intervalId = setInterval(() => {
            if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentIndex((prev) => {
                    // Loop back to start when reaching the end
                    return prev >= totalPages - 1 ? 0 : prev + 1;
                });
                setTimeout(() => setIsTransitioning(false), 1000);
            }
        }, 5000); // 5 seconds

        return () => clearInterval(intervalId);
    }, [isClient, totalPages, isTransitioning]);

    // Calculate transform based on current index
    const getTransform = () => {
        if (!isClient) return 'translateX(0)';
        return `translateX(-${currentIndex * 100}%)`;
    };

    // Don't render until client-side to avoid hydration mismatch
    if (!isClient) {
        return (
            <div className="culture-showcase-section">
                <div className="container">
                    <div className="culture-showcase-carousel-wrapper">
                        <div className="culture-showcase-loading">Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative py-20 md:py-12 bg-[#f8f9fa]">
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
                <m.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                    <h2 className="text-[#2a2b44] font-bold font-figtree text-2xl md:text-[24px] mb-3">
                        Life @ Akoode
                    </h2>
                    <p className="text-[#2a2b44] font-figtree text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        A place where ideas grow, people matter, and technology stays human.
                    </p>
                </m.div>

                <m.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="relative w-full overflow-hidden"
                >
                    <div
                        className="flex flex-nowrap items-stretch will-change-transform"
                        ref={trackRef}
                        style={{
                            transform: getTransform(),
                            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {activeImages.map((img, idx) => (
                            <div
                                key={`${img._id || 'fallback'}-${idx}`}
                                className="p-1 md:p-2 box-border"
                                style={{
                                    flex: `0 0 calc(100% / ${cardsPerView})`,
                                    maxWidth: `calc(100% / ${cardsPerView})`
                                }}
                            >
                                <div className="relative w-full aspect-[1.2/1] rounded-2xl overflow-hidden shadow-sm transition-all duration-300 bg-white hover:shadow-lg">
                                    <Image
                                        src={resolveImageUrl(img.image)}
                                        alt={img.title || "Life @ Akoode"}
                                        fill
                                        sizes="(max-width:768px) 100vw, 50vw"
                                        className="object-cover block transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </m.div>

                {/* Pagination dots */}
                {totalPages > 1 && (() => {
                    const MAX_VISIBLE = 7;
                    let start = Math.max(0, currentIndex - Math.floor(MAX_VISIBLE / 2));
                    const end = Math.min(totalPages, start + MAX_VISIBLE);
                    start = Math.max(0, end - MAX_VISIBLE);
                    const visiblePages = Array.from({ length: end - start }, (_, i) => start + i);
                    return (
                        <div className="flex justify-center items-center gap-1 mt-9 w-full overflow-hidden">
                            {visiblePages.map((pageIdx) => (
                                <button
                                    key={pageIdx}
                                    type="button"
                                    className="min-h-[28px] min-w-[10px] flex items-center justify-center p-0 border-none cursor-pointer rounded-full transition-all duration-300 shrink-0"
                                    onClick={() => goToPage(pageIdx)}
                                    aria-label={`Go to page ${pageIdx + 1}`}
                                >
                                    <span
                                        className={`h-2 transition-all duration-300 rounded-full block ${pageIdx === currentIndex
                                            ? 'bg-[#474972] w-8'
                                            : 'bg-gray-200 w-2 hover:bg-gray-300'
                                            }`}
                                        aria-hidden
                                    />
                                </button>
                            ))}
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}

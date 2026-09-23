"use client";
import Image from 'next/image';
import { useEffect, useMemo, useState, useRef } from "react";

const buildImageUrl = (src) => {
    if (!src) return "/images/teams/default.webp";
    if (src.startsWith("http") || src.startsWith("data:")) return src;

    const base =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_FRONTEND_API_URL ||
        "http://localhost:5000";

    // Ensure proper URL construction
    const cleanBase = base.replace(/\/$/, "");
    const cleanSrc = src.startsWith("/") ? src : `/${src}`;

    return `${cleanBase}${cleanSrc}`;
};

const getItemsToShow = (width) => {
    if (width >= 1200) return 4;
    if (width >= 992) return 3;
    // Mobile and tablet: single card for a professional, focused layout
    if (width >= 768) return 1;
    return 1;
};

// Fisher-Yates shuffle algorithm for randomization
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const INTERVAL_MS = 5000;

export default function TeamCarousel({ employees }) {
    const [startIndex, setStartIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(4);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const intervalRef = useRef(null);

    // SSR-safe: Start with original order, shuffle on client after hydration
    const [displayEmployees, setDisplayEmployees] = useState(employees || []);
    const [isShuffled, setIsShuffled] = useState(false);

    // Shuffle ONLY on client after hydration (fixes hydration mismatch)
    useEffect(() => {
        if (!isShuffled && employees?.length > 0) {
            setDisplayEmployees(shuffleArray(employees));
            setIsShuffled(true);
        }

        if (employees?.length > 0 && JSON.stringify(employees) !== JSON.stringify(displayEmployees) && !isShuffled) {
            setDisplayEmployees(employees);
        }
    }, [employees, isShuffled]);

    const totalEmployees = displayEmployees?.length || 0;

    // Create extended array with clones for infinite loop
    const extendedEmployees = useMemo(() => {
        if (!displayEmployees?.length) return [];

        // Clone enough items to fill one viewport
        const cloneCount = Math.min(itemsToShow, displayEmployees.length);
        const clones = displayEmployees.slice(0, cloneCount);

        return [...displayEmployees, ...clones];
    }, [displayEmployees, itemsToShow]);

    useEffect(() => {
        const updateItemsToShow = () => {
            if (typeof window === "undefined") return;
            const width = window.innerWidth;
            setItemsToShow(getItemsToShow(width));
        };

        updateItemsToShow();
        window.addEventListener("resize", updateItemsToShow);

        return () => window.removeEventListener("resize", updateItemsToShow);
    }, []);

    // Seamless position reset when reaching clones
    useEffect(() => {
        if (startIndex >= totalEmployees && totalEmployees > 0) {
            // We're showing clones now, wait for transition to finish, then jump back
            const timeout = setTimeout(() => {
                setIsTransitioning(false);
                setStartIndex(startIndex - totalEmployees);

                // Re-enable transition on next frame
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setIsTransitioning(true);
                    });
                });
            }, 500); // Match CSS transition duration

            return () => clearTimeout(timeout);
        }
    }, [startIndex, totalEmployees]);

    // Auto-advance carousel
    const startAutoAdvance = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        if (extendedEmployees.length <= itemsToShow) return;

        intervalRef.current = setInterval(() => {
            setStartIndex((prev) => {
                const next = prev + 1;
                // Allow going into clone territory (seamless loop)
                if (next >= extendedEmployees.length) {
                    return 0;
                }
                return next;
            });
        }, INTERVAL_MS);
    };

    useEffect(() => {
        startAutoAdvance();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [extendedEmployees.length, itemsToShow]);

    // Navigation handlers
    const handlePrev = () => {
        setStartIndex((prev) => {
            if (prev <= 0) {
                // Jump to end of real items (will show clones)
                return totalEmployees;
            }
            return prev - 1;
        });
        startAutoAdvance(); // Reset auto-advance timer
    };

    const handleNext = () => {
        setStartIndex((prev) => {
            const next = prev + 1;
            // Allow going into clone territory
            if (next >= extendedEmployees.length) {
                return 0;
            }
            return next;
        });
        startAutoAdvance(); // Reset auto-advance timer
    };

    if (!extendedEmployees.length) {
        return (
            <div className="flex flex-wrap -mx-[1.5rem] mt-[1.5rem] text-center justify-center">
                <div className="w-full text-center">
                    <p>No team members found.</p>
                </div>
            </div>
        );
    }

    // Calculate transform for sliding effect; padding aligned with container
    const getCardWidth = () => {
        if (typeof window === "undefined") return 300;
        const width = window.innerWidth;
        let padding = 32; // px-4*2
        if (width >= 640) padding = 48;
        if (width >= 768) padding = 64;
        if (width >= 1024) padding = 96;
        if (width >= 1280) padding = 160;

        const containerWidth = width - padding;
        return containerWidth / itemsToShow;
    };

    const cardWidth = getCardWidth();
    const translateX = -(startIndex * cardWidth);

    return (
        <div className="team-carousel-container relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[80px]">
            {/* Previous Button */}
            <button
                className="team-carousel-nav-button team-carousel-nav-prev absolute top-1/2 -translate-y-1/2 left-1 sm:left-2 md:left-[10px] w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center bg-white/95 border border-black/10 rounded-full cursor-pointer transition-all duration-300 z-10 shadow-md backdrop-blur-[4px] hover:bg-[#5a5a75]/95 hover:scale-110 hover:shadow-lg disabled:opacity-50 group touch-manipulation"
                onClick={handlePrev}
                aria-label="Previous team member"
            >
                <svg
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#5a5a75] transition-colors duration-300 group-hover:text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                >
                    <path
                        d="M15 18L9 12L15 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {/* Carousel */}
            <div className="team-carousel-scroll-wrapper overflow-hidden w-full pb-3 sm:pb-4 mb-2 sm:mb-3 px-0 border-none shadow-none bg-transparent">
                <div
                    className={`team-carousel-window flex flex-nowrap w-full ${!isTransitioning ? "transition-none" : "transition-transform duration-500 ease-out"}`}
                    style={{ transform: `translateX(${translateX}px)` }}
                >
                    {extendedEmployees.map((employee, idx) => (
                        <div
                            key={`${employee._id}-${idx}`}
                            className="team-carousel-item flex-shrink-0 flex justify-center"
                            style={{
                                width: `${cardWidth}px`,
                                minWidth: `${cardWidth}px`,
                                maxWidth: `${cardWidth}px`,
                                padding: "0 6px"
                            }}
                        >
                            <div className="team-card w-full max-w-[320px] mx-auto sm:max-w-none lg:max-w-none lg:w-full h-full flex flex-col bg-[#f4f4f8] rounded-xl sm:rounded-[10px] overflow-hidden transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:-translate-y-1 sm:hover:-translate-y-[5px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)]">
                                <div className="team-img w-full flex-shrink-0 aspect-square overflow-hidden bg-gray-200">
                                    <Image
                                        src={buildImageUrl(employee.image)}
                                        alt={employee.name || "Team Member"}
                                        width={320}
                                        height={320}
                                        className="w-full h-full object-cover object-center"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="team-info flex-shrink-0 bg-[#5a5a75] text-white p-4 sm:p-[15px] text-center">
                                    <h5 className="font-semibold mb-0.5 sm:mb-1 text-base sm:text-[1.1rem] text-white leading-tight">{employee.name || "Team Member"}</h5>
                                    <p className="text-sm sm:text-[0.9rem] mb-0 opacity-90 text-white/90 leading-snug">{employee.designation || ""}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Next Button */}
            <button
                className="team-carousel-nav-button team-carousel-nav-next absolute top-1/2 -translate-y-1/2 right-1 sm:right-2 md:right-[10px] w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center bg-white/95 border border-black/10 rounded-full cursor-pointer transition-all duration-300 z-10 shadow-md backdrop-blur-[4px] hover:bg-[#5a5a75]/95 hover:scale-110 hover:shadow-lg disabled:opacity-50 group touch-manipulation"
                onClick={handleNext}
                aria-label="Next team member"
            >
                <svg
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#5a5a75] transition-colors duration-300 group-hover:text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                >
                    <path
                        d="M9 18L15 12L9 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    );
}

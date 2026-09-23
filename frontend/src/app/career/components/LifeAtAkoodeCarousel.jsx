"use client";

import { useState, useEffect, useRef } from "react";
import resolveImageUrl from "@/utils/resolveImageUrl";
import Image from 'next/image';

const SLIDE_INTERVAL_MS = 5000;
const FALLBACK_IMAGE = "/images/career/akoode-culture.webp";

export default function LifeAtAkoodeCarousel({ images = [] }) {
    // console.log(images)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const intervalRef = useRef(null);

    // Set client-only flag to avoid SSR issues
    useEffect(() => {
        setIsClient(true);
    }, []);

    const activeImages = images.length > 0 ? images : [{ image: FALLBACK_IMAGE }];

    useEffect(() => {
        if (!isClient || activeImages.length <= 1) return;

        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % activeImages.length);
        }, SLIDE_INTERVAL_MS);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isClient, activeImages.length]);

    const currentImage = activeImages[currentIndex];

    return (
        <div className="life-at-akoode-carousel">
            <div className="carousel-inner">
                {activeImages.map((img, idx) => (
                    <div
                        key={`${img._id || 'fallback'}-${idx}`}
                        className={`carousel-slide ${idx === currentIndex ? 'active' : ''}`}
                    >
                        <Image
                            src={resolveImageUrl(img.image)}
                            alt={img.title || "Life at Akoode"}
                            width={800}
                            height={500}
                            sizes="(max-width:768px) 100vw, 800px"
                            className="w-full h-auto rounded"
                        />
                    </div>
                ))}
            </div>

            {/* Optional: Indicator dots */}
            {activeImages.length > 1 && (
                <div className="carousel-indicators">
                    {activeImages.map((_, idx) => (
                        <button
                            key={idx}
                            className={`indicator ${idx === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

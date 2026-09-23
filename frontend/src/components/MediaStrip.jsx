"use client";

import Image from "next/image";

export default function MediaStrip() {
    const logos = [
        { src: "/strip/strip1.svg", alt: "Business Standard", width: 80, height: 20 },
        { src: "/strip/yourstory.svg", alt: "yourstory", width: 80, height: 20 },
        { src: "/strip/forbes.svg", alt: "Forbes", width: 80, height: 20 },
        { src: "/strip/mid-day.svg", alt: "Mid-Day", width: 80, height: 20 },
        { src: "/strip/republic.svg", alt: "Republic Logo", width: 80, height: 20 },
        { src: "/strip/business_world.svg", alt: "Business World", width: 120, height: 100 },
        { src: "/strip/pti_logo.svg", alt: "PTI Logo", width: 80, height: 80 },
        { src: "/strip/zbusiness.webp", alt: "Zee Business", width: 120, height: 80 },
        { src: "/strip/abp.svg", alt: "ABP Live", width: 80, height: 20 },
        { src: "/strip/ani_news.svg", alt: "ANI News", width: 80, height: 80 },
    ];

    // Two copies: animate translateX(0) → translateX(-50%) of max-content width = seamless loop
    const duplicatedLogos = [...logos, ...logos];

    return (
        <section className="bg-[#f0f1f9] py-6 border-y border-white/10 overflow-hidden">
            <div className="relative overflow-hidden">
                {/* Gradient fade edges — logos dissolve in from right, out to left */}
                <div className="absolute inset-y-0 left-0 w-32 md:w-52 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(to right, #f0f1f9 30%, rgba(240,241,249,0.6) 70%, transparent 100%)" }} />
                <div className="absolute inset-y-0 right-0 w-32 md:w-52 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(to left, #f0f1f9 30%, rgba(240,241,249,0.6) 70%, transparent 100%)" }} />

                <div className="flex w-max items-center gap-20 md:gap-28 animate-marquee will-change-transform">
                    {duplicatedLogos.map((logo, index) => (
                        <div
                            key={index}
                            className="shrink-0 flex items-center justify-center grayscale brightness-0 opacity-100"
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={logo.width}
                                height={logo.height}
                                className="h-8 w-auto object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

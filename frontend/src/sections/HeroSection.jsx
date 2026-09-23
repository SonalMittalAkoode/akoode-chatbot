"use client";
 
import GlowingOrb from "@/components/GlowingOrb";
import HeroSlider from "@/components/HeroSlider";
 
export default function HeroSection() {
    return (
        <section className="relative min-h-[88vh] flex flex-col justify-center bg-gradient-to-b from-[#1F2336] to-[#130F25] overflow-hidden px-4">
 
            <div className="relative z-10 flex flex-col items-start md:items-center min-h-[88vh] justify-center">
 
                {/* Glowing Orb */}
                <div className="absolute top-1/2 left-0 md:left-1/2 -translate-y-1/2 md:-translate-x-1/2 pointer-events-none -z-10 scale-[0.9]">
                    <GlowingOrb />
                </div>
 
                {/* Slider content: badge, heading, subheading, CTAs */}
                <HeroSlider />

                {/* In The News Section */}
                <div className="absolute bottom-3 left-0 w-full flex justify-center">
                    <div className="flex items-center w-full max-w-2xl px-4 md:px-10 overflow-hidden">
                        <div 
                            className="flex-1 h-[1px]" 
                            style={{ 
                                background: 'linear-gradient(to left, #F0F1F9 0%, #F0F1F9 10%, #B4B5BB 21%, #78797D 44%, #000000 78%)' 
                            }}
                        ></div>
                        <span className="mx-4 md:mx-6 text-white text-[10px] md:text-xs font-normal tracking-[0.1em] uppercase whitespace-nowrap">
                            FEATURED IN
                        </span>
                        <div 
                            className="flex-1 h-[1px]" 
                            style={{ 
                                background: 'linear-gradient(to right, #F0F1F9 0%, #F0F1F9 10%, #B4B5BB 21%, #78797D 44%, #000000 78%)' 
                            }}
                        ></div>
                    </div>
                </div>
 
            </div>
 
        </section>
    );
}
 
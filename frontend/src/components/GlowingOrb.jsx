"use client";

import React, { useEffect, useRef } from "react";
import { m, useMotionValue, useTransform, animate } from "framer-motion";

const GlowingOrb = ({ className = "" }) => {
    const strips = Array.from({ length: 6 });
    const controlsRef = useRef(null);

    const progress = useMotionValue(0);
    const xSmall = useTransform(progress, [0, 1], [-120, 120]);
    const xLarge = useTransform(progress, [0, 1], [-500, 500]);
    const y = useTransform(progress, [0, 0.5, 1], [0, 120, 0]);
    const x = useMotionValue(0);

    useEffect(() => {
        const isLarge = window.innerWidth >= 1280;
        const source = isLarge ? xLarge : xSmall;
        x.set(source.get());
        const unsubscribe = source.on("change", (v) => x.set(v));
        return unsubscribe;
    }, [x, xSmall, xLarge]);

    useEffect(() => {
        const startAnimation = () => {
            const isMobile = window.innerWidth < 768;
            controlsRef.current = animate(progress, 1, {
                duration: isMobile ? 32 : 18,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
            });
        };

        // Defer until browser is idle — hydration finishes first, then orb animates.
        // requestIdleCallback is not available in Safari so we fall back to setTimeout.
        let handle;
        if (typeof requestIdleCallback !== "undefined") {
            handle = requestIdleCallback(startAnimation, { timeout: 1000 });
        } else {
            handle = setTimeout(startAnimation, 500);
        }

        // Pause when user switches tabs — no point burning GPU on hidden pages.
        const onVisibilityChange = () => {
            if (document.hidden) {
                controlsRef.current?.stop();
            } else {
                startAnimation();
            }
        };
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            if (typeof requestIdleCallback !== "undefined") {
                cancelIdleCallback(handle);
            } else {
                clearTimeout(handle);
            }
            controlsRef.current?.stop();
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, [progress]);

    return (
        <m.div
            className={`relative w-[480px] h-[480px] xl:w-[800px] xl:h-[800px] flex items-center justify-center ${className}`}
            style={{ x, y, willChange: "transform" }}
        >
            {/* Core Orb */}
            <div
                className="absolute w-[350px] h-[350px] rounded-full blur-[45px]"
                style={{
                    background:
                        "linear-gradient(180deg, #050734 0%, rgba(30, 38, 157, 0.8) 25%, rgba(55, 63, 177, 0.9) 50%, #7993D0 75%, #FFFFFF 100%)",
                    transform: "rotate(180deg)",
                }}
            />

            {/* Glass strips — backdrop-filter on the parent, not each strip individually.
                One compositor layer instead of six. Visually identical. */}
            <div
                className="absolute w-[350px] h-[350px] flex"
                style={{
                    maskImage:
                        "radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0) 75%)",
                    WebkitMaskImage:
                        "radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0) 75%)",
                    backdropFilter: "blur(50px)",
                    WebkitBackdropFilter: "blur(50px)",
                }}
            >
                {strips.map((_, index) => (
                    <div
                        key={index}
                        className="flex-1 h-full"
                        style={{
                            background:
                                "linear-gradient(270deg, rgba(255,255,255,0.05) 17%, rgba(255,255,255,0.22) 100%)",
                            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.1)",
                            opacity: 0.4,
                        }}
                    />
                ))}
            </div>
        </m.div>
    );
};

export default React.memo(GlowingOrb);
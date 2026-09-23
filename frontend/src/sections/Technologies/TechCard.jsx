"use client";

import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const isValidSrc = (src) =>
    typeof src === "string" && src.trim() !== "" &&
    (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://"));

export default function TechCard({ name, icon, index, activeTech, setActiveTech }) {
    const [isHovered, setIsHovered] = useState(false);

    const isClicked = activeTech === name;
    const showTooltip = isHovered || isClicked;

    return (
        <div className="relative">
            <m.div
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={() => setActiveTech(isClicked ? null : name)}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-[#FFFFFF] rounded-xl flex flex-col items-center justify-center text-center group cursor-pointer transition-all duration-300 shadow-[2px_2px_8px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_16px_0px_rgba(0,0,0,0.15)]"
            >
                {isValidSrc(icon) ? (
                    <Image
                        src={icon}
                        alt={name}
                        width={40}
                        height={40}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    />
                ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#7683C5]/10 rounded-lg flex items-center justify-center text-[#7683C5] font-bold text-sm sm:text-base">
                        {name.charAt(0)}
                    </div>
                )}
            </m.div>

            <AnimatePresence>
                {showTooltip && (
                    <m.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.8 }}
                        className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-[#1F2336] text-white text-[10px] sm:text-xs font-semibold rounded-lg whitespace-nowrap shadow-xl pointer-events-none"
                    >
                        {name}
                        {/* Tooltip Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#1F2336]" />
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}

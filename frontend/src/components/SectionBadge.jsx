"use client";

import Image from "next/image";

export default function SectionBadge({ text, variant = "default" }) {
    const isService = variant === "service";

    return (
        <div className={`inline-flex items-center gap-2 p-2 rounded-lg ${isService
                ? "bg-[#eaebfa] text-white"
                : "bg-white"
            }`}>
            {/* Icon Wrapper */}
            <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-[#474972] to-[#585c9c]">
                <Image
                    src="/badge/sub-logo1.svg"
                    alt="section icon"
                    width={18}
                    height={18}
                    className="brightness-0 invert"
                />
            </div>

            {/* Text */}
            <p className="bg-gradient-to-r from-[#474972] to-[#585c9c] bg-clip-text text-transparent font-semibold md:text-[18px] text-[12px] uppercase font-sans">
                {text}
            </p>
        </div>
    );
}

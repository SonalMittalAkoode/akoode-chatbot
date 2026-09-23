"use client";

import React, { useEffect, useState } from "react";
import { m } from "framer-motion";
import { hasHtmlContent, sanitizeRichText } from "@/utils/safeRichText";

const normalizeBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  if (typeof value === "number") return value === 1;
  return fallback;
};

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

export default function ServiceSection({ service }) {
  // ✅ Keep server + first client render in sync
  const [isEnabled, setIsEnabled] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!service) return;

    setIsEnabled(normalizeBoolean(service?.serviceSectionShow, false));
    setTitle(service?.serviceSectionTitle || "");
    setDescription(service?.serviceSectionDescription || "");
  }, [service]);

  // Show section when there is content (title or description), regardless of toggle
  if (!title?.trim() && !description?.trim()) {
    return null;
  }

  return (
    <div
      className="relative z-[1] py-20 md:pt-[70px] overflow-hidden"
      style={{
        backgroundColor: "#eff1ff",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="container mx-auto px-[2rem] md:px-4">
        <div className="max-w-4xl mx-auto text-center font-figtree">
          <div className="flex flex-col space-y-6 items-center">
            {title && (
              <m.h2
                aria-label={title}
                variants={headingVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-lg sm:text-xl md:text-[22px] leading-[1.3] font-semibold text-[#010225] tracking-[-0.54px] text-center px-4"
              >
                {title.split("").map((char, index) => (
                  <m.span aria-hidden="true" key={index} variants={letterVariants}>
                    {char}
                  </m.span>
                ))}
              </m.h2>
            )}
            {description && (
              hasHtmlContent(description) ? (
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-lg md:text-[18px] text-[#212529] leading-[26px] max-w-3xl [&_a]:text-[#474972] [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: sanitizeRichText(description) }}
                />
              ) : (
                <m.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-lg md:text-[18px] text-[#212529] leading-[26px] max-w-3xl"
                >
                  {description}
                </m.p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

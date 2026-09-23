"use client";

import React, { useEffect, useState } from "react";
import { m } from "framer-motion";
import Image from 'next/image';
import { hasHtmlContent, normalizeHtml, sanitizeRichText } from "@/utils/safeRichText";
import { resolveImageAlt } from "@/utils/imageAlt";

const buildAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_FRONTEND_API_URL) ||
    "";
  if (!base) {
    return path.startsWith("/") ? path : `/ ${path} `;
  }
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/ ${path} `;
  return `${normalizedBase}${normalizedPath} `;
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

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export default function PeopleSectionArea({
  heading,
  description,
  image,
  imageAlt,
  listItems = []
}) {
  // ✅ Avoid hydration mismatch: render only on client after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Don't render if no data provided
  if (!heading && !description && !image) {
    return null;
  }

  const imageUrl = buildAssetUrl(image);
  const hasListItems = Array.isArray(listItems) && listItems.length > 0;

  // Check if heading contains HTML
  const hasHtmlHeading = hasHtmlContent(heading);
  const hasHtmlDescription = hasHtmlContent(description);

  // If description already contains list items HTML, don't render listItems separately
  // This prevents duplication and hydration mismatch
  const descriptionHasList = description && (
    description.includes('<div class="custom-list">') ||
    description.includes('<ul>') ||
    description.includes('<li>')
  );

  // If description has block-level HTML (div, ul, etc.), use div instead of p tag
  // This logic is no longer needed as the description will always render within a div if it has HTML, or a p if it's plain text, and the styling is handled by Tailwind.

  return (
    <section className="relative overflow-hidden bg-[#7e7f9c]">
      <div className="flex flex-col lg:flex-row w-full min-h-[500px] lg:min-h-[600px]">

        {/* Left Side Image */}
        {imageUrl && (
          <m.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full lg:w-1/2 h-[300px] lg:h-auto overflow-hidden"
          >
            <Image
              src={imageUrl}
              alt={resolveImageAlt(imageAlt, heading || "Team")}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </m.div>
        )}

        {/* Right Side Content */}
        <m.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`w-full lg:w-1/2 flex items-center p-8 md:p-14 lg:p-16 text-white ${!imageUrl ? 'w-full' : ''} `}
        >
          <div className="max-w-xl font-figtree">
            {heading && (
              <m.h2
                aria-label={hasHtmlHeading ? undefined : heading}
                variants={headingVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-3xl md:text-2xl text-black lg:text-3xl font-bold leading-tight mb-4"
              >
                {hasHtmlHeading ? (
                  <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(normalizeHtml(heading)) }} />
                ) : (
                  heading.split("").map((char, index) => (
                    <m.span aria-hidden="true" key={index} variants={letterVariants}>
                      {char}
                    </m.span>
                  ))
                )}
              </m.h2>
            )}

            {description && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {hasHtmlDescription ? (
                  <div
                    className="text-lg text-black/60 leading-relaxed space-y-4 [&_a]:text-[#474972] [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: sanitizeRichText(normalizeHtml(description)) }}
                  />
                ) : (
                  <p className="text-lg text-black/60 leading-tight mb-4">
                    {description}
                  </p>
                )}
              </m.div>
            )}

            {/* List Items */}
            {hasListItems && !descriptionHasList && (
              <div className="space-y-4">
                {listItems.map((item, index) => (
                  <m.div
                    key={index}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1.5 flex-shrink-0">
                      <svg width="22" height="14" viewBox="0 0 22 14" fill="none" className="w-5 h-auto">
                        <path d="M11.3909 14C11.0558 14 10.8325 13.8667 10.6091 13.6L5.91878 8C5.47208 7.46667 5.47208 6.66667 5.91878 6.13333C6.36548 5.6 7.03553 5.6 7.48223 6.13333L11.3909 10.8L20.1015 0.4C20.5482 -0.133333 21.2183 -0.133333 21.665 0.4C22.1117 0.933333 22.1117 1.73333 21.665 2.26667L12.1726 13.6C12.0609 13.8667 11.7259 14 11.3909 14Z" fill="white" />
                        <path d="M5.80711 14C5.47208 14 5.24873 13.8667 5.02538 13.6L0.335025 8C-0.111675 7.46667 -0.111675 6.66667 0.335025 6.13333C0.781726 5.6 1.45178 5.6 1.89848 6.13333L6.58883 11.7333C7.03553 12.2667 7.03553 13.0667 6.58883 13.6C6.47716 13.8667 6.14213 14 5.80711 14ZM11.7259 7.06667C11.3909 7.06667 11.1675 6.93333 10.9442 6.66667C10.4975 6.13333 10.4975 5.33333 10.9442 4.8L14.5178 0.4C14.9645 -0.133333 15.6345 -0.133333 16.0812 0.4C16.5279 0.933333 16.5279 1.73333 16.0812 2.26667L12.5076 6.66667C12.2843 6.93333 12.0609 7.06667 11.7259 7.06667Z" fill="white" />
                      </svg>
                    </div>
                    <span className="text-lg md:text-xl font-medium">
                      {typeof item === 'string' ? item : (item.title || item.text || item)}
                    </span>
                  </m.div>
                ))}
              </div>
            )}
          </div>
        </m.div>

      </div>
    </section>
  );
}
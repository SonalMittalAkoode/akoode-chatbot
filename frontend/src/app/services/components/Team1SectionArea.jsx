"use client";

import React from 'react'
import { m } from "framer-motion";
import { hasHtmlContent, sanitizeRichText } from "@/utils/safeRichText";

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

const extractListItems = (html) => {
  if (!html) return [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  const items = [];
  let match;
  while ((match = liRegex.exec(html)) !== null) {
    // Strip inner <p> tags if they exist to prevent layout issues
    const content = match[1].replace(/<\/?p[^>]*>/gi, '').trim();
    items.push(content);
  }
  return items;
};

export default function Team1SectionArea({
  eyebrow = "Must Look At Features of Metaverse 3D Development",
  heading,
  description,
}) {
  const headingText =
    heading ||
    "Rely on the Metaverse and 3D experts to create an intuitive user experience by developing a real-like digital world for the benefit of customers to better connect and buy from you. As part of the Metaverse 3D development services, have a close look at the following few features.";

  const descriptionText = description || null;
  const parsedListItems = descriptionText ? extractListItems(descriptionText) : [];
  const hasMultipleParagraphs = !parsedListItems.length && descriptionText && descriptionText.split(/<p[^>]*>/).length > 2;

  return (
    <div className="relative z-[1] py-16 md:py-20 bg-[#eff1ff]">
      <div className="container mx-auto px-[2rem]">
        <div className="max-w-4xl mx-auto text-center font-figtree">
          <h2 className="text-[#1a1a1a] font-bold text-[24px] sm:text-[28px] leading-tight sm:leading-8 transition-colors duration-400">
            {eyebrow}
          </h2>

          <m.h2
            aria-label={headingText}
            variants={headingVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-2xl md:text-xl font-bold text-[#010225] leading-tight mt-6 mb-6"
          >
            {headingText.split("").map((char, index) => (
              <m.span aria-hidden="true" key={index} variants={letterVariants}>
                {char}
              </m.span>
            ))}
          </m.h2>

          {descriptionText && (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-md text-[#505169] leading-relaxed"
            >
              {parsedListItems.length > 0 ? (
                <div className="max-w-2xl mx-auto space-y-2">
                  {parsedListItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 text-left">
                      <div className="mt-[20px] flex-shrink-0">
                        <svg width="22" height="14" viewBox="0 0 22 14" fill="none" className="w-5 h-auto">
                          <path d="M11.3909 14C11.0558 14 10.8325 13.8667 10.6091 13.6L5.91878 8C5.47208 7.46667 5.47208 6.66667 5.91878 6.13333C6.36548 5.6 7.03553 5.6 7.48223 6.13333L11.3909 10.8L20.1015 0.4C20.5482 -0.133333 21.2183 -0.133333 21.665 0.4C22.1117 0.933333 22.1117 1.73333 21.665 2.26667L12.1726 13.6C12.0609 13.8667 11.7259 14 11.3909 14Z" fill="#474972" />
                          <path d="M5.80711 14C5.47208 14 5.24873 13.8667 5.02538 13.6L0.335025 8C-0.111675 7.46667 -0.111675 6.66667 0.335025 6.13333C0.781726 5.6 1.45178 5.6 1.89848 6.13333L6.58883 11.7333C7.03553 12.2667 7.03553 13.0667 6.58883 13.6C6.47716 13.8667 6.14213 14 5.80711 14ZM11.7259 7.06667C11.3909 7.06667 11.1675 6.93333 10.9442 6.66667C10.4975 6.13333 10.4975 5.33333 10.9442 4.8L14.5178 0.4C14.9645 -0.133333 15.6345 -0.133333 16.0812 0.4C16.5279 0.933333 16.5279 1.73333 16.0812 2.26667L12.5076 6.66667C12.2843 6.93333 12.0609 7.06667 11.7259 7.06667Z" fill="#474972" />
                        </svg>
                      </div>
                      <div className="text-md sm:text-lg font-medium text-[#010225] [&_a]:text-[#474972] [&_a]:underline" dangerouslySetInnerHTML={{ __html: sanitizeRichText(item) }} />
                    </div>
                  ))}
                </div>
              ) : hasMultipleParagraphs || hasHtmlContent(descriptionText) ? (
                <div
                  className="max-w-2xl mx-auto text-center [&_a]:text-[#474972] [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: sanitizeRichText(descriptionText) }}
                />
              ) : (
                <p className="max-w-2xl mx-auto text-center">{descriptionText}</p>
              )}
            </m.div>
          )}
        </div>
      </div>
    </div>
  )
}

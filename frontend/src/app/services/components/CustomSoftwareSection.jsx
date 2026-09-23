"use client";

import React, { useEffect, useState } from "react";
import { m } from "framer-motion";
import Button from "@/components/Button";
import Image from 'next/image';
import { resolveImageAlt } from "@/utils/imageAlt";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const renderHtmlWithButtons = (html) => {
  if (!html) return null;

  // Regex to match <a> tags and their content
  // Matches: <a ... href="url" ...>text</a>
  const aTagRegex = /<a\s+([^>]*?)href="([^"]*?)"([^>]*?)>([\s\S]*?)<\/a>/gi;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = aTagRegex.exec(html)) !== null) {
    // Add text before the <a> tag
    const beforeText = html.substring(lastIndex, match.index);
    if (beforeText) {
      parts.push(<span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: processHtmlLinks(beforeText) }} />);
    }

    const href = match[2];
    const text = match[4].replace(/<[^>]*>?/gm, ''); // Strip tags from link text

    // Add Button component
    parts.push(
      <Button
        key={`btn-${match.index}`}
        text={text}
        href={href}
        className="mt-4"
      />
    );

    lastIndex = aTagRegex.lastIndex;
  }

  // Add remaining text
  const remainingText = html.substring(lastIndex);
  if (remainingText) {
    parts.push(<span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: processHtmlLinks(remainingText) }} />);
  }

  return parts.length > 0 ? parts : <span dangerouslySetInnerHTML={{ __html: processHtmlLinks(html) }} />;
};

const buildAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_FRONTEND_API_URL) ||
    "";
  if (!base) {
    return path.startsWith("/") ? path : `/${path}`;
  }
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

const normalizeBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  if (typeof value === "number") return value === 1;
  return fallback;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
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
    transition: { duration: 0.3 },
  },
};

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="14" viewBox="0 0 22 14" fill="none" className="shrink-0 mt-3 sm:mt-5">
    <path d="M11.3909 14C11.0558 14 10.8325 13.8667 10.6091 13.6L5.91878 8C5.47208 7.46667 5.47208 6.66667 5.91878 6.13333C6.36548 5.6 7.03553 5.6 7.48223 6.13333L11.3909 10.8L20.1015 0.4C20.5482 -0.133333 21.2183 -0.133333 21.665 0.4C22.1117 0.933333 22.1117 1.73333 21.665 2.26667L12.1726 13.6C12.0609 13.8667 11.7259 14 11.3909 14Z" fill="#474972" />
    <path d="M5.80711 14C5.47208 14 5.24873 13.8667 5.02538 13.6L0.335025 8C-0.111675 7.46667 -0.111675 6.66667 0.335025 6.13333C0.781726 5.6 1.45178 5.6 1.89848 6.13333L6.58883 11.7333C7.03553 12.2667 7.03553 13.0667 6.58883 13.6C6.47716 13.8667 6.14213 14 5.80711 14ZM11.7259 7.06667C11.3909 7.06667 11.1675 6.93333 10.9442 6.66667C10.4975 6.13333 10.4975 5.33333 10.9442 4.8L14.5178 0.4C14.9645 -0.133333 15.6345 -0.133333 16.0812 0.4C16.5279 0.933333 16.5279 1.73333 16.0812 2.26667L12.5076 6.66667C12.2843 6.93333 12.0609 7.06667 11.7259 7.06667Z" fill="#474972" />
  </svg>
);

const extractListItems = (html) => {
  if (!html) return [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  const items = [];
  let match;
  while ((match = liRegex.exec(html)) !== null) {
    const content = match[1].replace(/<\/?p[^>]*>/gi, '').trim();
    items.push(content);
  }
  return items;
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function CustomSoftwareSection({ service }) {
  // ✅ avoid hydration mismatch: render only on client after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const title = service?.customSoftwareTitle || "Custom Software Development";
  const description = service?.customSoftwareDescription || "";
  const image = buildAssetUrl(
    service?.customSoftwareImage || "/images/custom-soft-dev/custom-dev.webp"
  );
  const steps =
    Array.isArray(service?.customSoftwareSteps) &&
      service.customSoftwareSteps.length > 0
      ? service.customSoftwareSteps
      : [];

  const isEnabled = normalizeBoolean(service?.customSoftwareShow, false) || steps.length > 0;

  if (!isEnabled || steps.length === 0) {
    return null;
  }

  // Normalize HTML to prevent weird spacing issues
  const normalizeHTML = (html) => {
    if (!html) return "";
    return html
      .replace(/\s+/g, " ")
      .replace(/>\s+</g, "><")
      .trim();
  };


  const renderDescription = (html) => {
    if (!html) return null;

    // Split by ul tags to handle them separately
    const parts = html.split(/(<ul[\s\S]*?<\/ul>)/gi);

    return parts.map((part, index) => {
      if (part.toLowerCase().startsWith("<ul")) {
        const items = extractListItems(part);
        return (
          <ul key={index} className="space-y-3 sm:space-y-4 my-1">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckIcon />
                <span>{renderHtmlWithButtons(item)}</span>
              </li>
            ))}
          </ul>
        );
      } else if (part.trim()) {
        const normalized = normalizeHTML(part);
        if (!normalized) return null;
        return (
          <div
            key={index}
            className="mb-4 last:mb-0"
          >
            {renderHtmlWithButtons(normalized)}
          </div>
        );
      }
      return null;
    });
  };

  return (
    <section id="csd" className="py-10 sm:py-14 md:py-[70px] bg-[#f8faff] font-figtree overflow-hidden">
      <div className="container mx-auto px-[2rem] md:px-8">
        {/* Main Content Section */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-20 items-center mb-6 sm:mb-8">
          <m.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 w-full"
          >
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-xl sm:shadow-2xl">
              <Image
                src={image}
                alt={resolveImageAlt(service?.customsoftwareimagealt, title || "Custom Software Development")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </m.div>

          <m.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 w-full min-w-0"
          >
            <div className="mb-6 sm:mb-8 font-figtree">
              <m.h2
                aria-label={title}
                variants={headingVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-[20px] sm:text-[26px] md:text-[30px] lg:text-[34px] font-semibold text-[#1E293B] leading-snug sm:leading-tight mb-3 sm:mb-4"
              >
                {title.split("").map((char, index) => (
                  <m.span aria-hidden="true" key={index} variants={letterVariants} className="inline">
                    {char}
                  </m.span>
                ))}
              </m.h2>
              {description && (
                <div className="text-[14px] sm:text-[15px] md:text-[16px] text-[#505169] leading-relaxed [&_.mt-4]:mt-3 [&_.mt-4]:sm:mt-4">
                  {renderDescription(description)}
                </div>
              )}
            </div>
          </m.div>
        </div>

        {/* Approach Section */}
        <div className="pt-10 sm:pt-14 md:pt-20 border-t border-gray-200">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-[#1a1a1a] font-bold text-[24px] sm:text-[28px] leading-tight sm:leading-8 transition-colors duration-400">
              Our Software Development Approach
            </h2>
          </div>

          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          >
            {steps.map((step, index) => {
              const stepIcon = buildAssetUrl(
                step.icon || `/images/custom-soft-dev/planning.svg`
              );
              const stepNumber = String(index + 1).padStart(2, "0");
              return (
                <m.div
                  key={index}
                  variants={itemVariants}
                  className="flex"
                >
                  <div className="relative z-[1] isolate w-full h-full flex flex-col rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 md:p-6 h-auto overflow-hidden shadow-[0_0.25rem_0.75rem_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_4px_40px_rgba(0,0,0,0.09)] group after:content-[''] after:absolute after:inset-0 after:left-1/2 after:-translate-x-1/2 after:w-[0px] after:bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] after:-z-10 after:opacity-0 after:transition-all after:duration-500 hover:after:rounded-2xl hover:after:w-full hover:after:opacity-100">
                    <div className="w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] rounded-full flex items-center justify-center bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] shrink-0 transition-all duration-400 group-hover:scale-110 group-hover:bg-white mb-4 sm:mb-6">
                      <Image
                        src={stepIcon}
                        alt={resolveImageAlt(step.iconAlt, step.title)}
                        width={30}
                        height={30}
                        className="max-w-[26px] max-h-[26px] sm:max-w-[30px] sm:max-h-[30px] object-contain transition-all duration-400 group-hover:brightness-0"
                      />
                    </div>

                    <h4
                      className="text-[#1a1a1a] font-semibold text-[16px] sm:text-[18px] leading-tight sm:leading-8 line-clamp-3 transition-colors duration-400 group-hover:text-white mb-3 sm:mb-4"
                      dangerouslySetInnerHTML={{
                        __html: processHtmlLinks(normalizeHTML(step.title),) }}
                    />

                    <div
                      className="text-[#37385C] text-[14px] sm:text-[16px] leading-[1.4] sm:leading-[22px] line-clamp-6 flex-1 transition-colors duration-400 group-hover:text-white group-hover:opacity-90 mb-4 sm:mb-6"
                      dangerouslySetInnerHTML={{
                        __html: processHtmlLinks(normalizeHTML(step.description),) }}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-lg sm:text-xl font-normal font-black text-[#1a1a1a] transition-colors duration-400 group-hover:text-white leading-none">
                        {stepNumber}
                      </span>
                    </div>
                  </div>
                </m.div>
              );
            })}
          </m.div>
        </div>
      </div>
    </section>
  );
}

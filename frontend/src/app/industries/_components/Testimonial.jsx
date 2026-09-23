"use client";

import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const stripHtml = (s) => String(s || "").replace(/<[^>]*>/g, "").trim();

/**
 * Industry-page Testimonial section.
 *
 * Props:
 *   data         – section CMS doc { heading, subtitle, enabled, ... }
 *   testimonials – resolved Testimonial records (ordered by admin)
 *                  shape: [{ title, description, designation, logoimage, star }]
 *                  (title is the author's name per testimonialModel)
 */
export default function Testimonial({ data, testimonials = [] }) {
  if (data?.enabled === false) return null;

  const heading = data?.heading || "";
  const subtitle = data?.subtitle || "";
  const list = Array.isArray(testimonials) ? testimonials.filter(Boolean) : [];

  const hasHeader = Boolean(heading || subtitle);
  if (!hasHeader && list.length === 0) return null;

  return (
    <section className="w-full bg-white font-figtree py-16 sm:py-20 lg:py-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24">
        {/* Header */}
        {hasHeader && (
          <div className="text-left md:text-center mb-12 md:mb-16">
            {heading && (
              <h2 className="text-[#101828] text-[24px] sm:text-[28px] font-bold leading-tight capitalize mb-4">
                {heading}
              </h2>
            )}
            {subtitle && (
              <div
                className="text-[#475467] text-sm sm:text-base leading-relaxed max-w-2xl md:mx-auto [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: processHtmlLinks(subtitle) }}
              />
            )}
          </div>
        )}

        {/* Cards grid — selected testimonials in admin-defined order */}
        {list.length > 0 && (
          <div
            className={`grid gap-6 ${
              list.length === 1
                ? "max-w-3xl mx-auto"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {list.map((t, idx) => {
              const authorName = t?.title || "";
              const role = t?.designation || "";
              const quote = stripHtml(t?.description || "");
              const rawAvatar = t?.logoimage || "";
              // Only use the avatar if it's a valid absolute URL or root-relative path.
              const avatar = rawAvatar && (rawAvatar.startsWith("/") || rawAvatar.startsWith("http")) ? rawAvatar : "";
              const stars = Math.min(5, Math.max(0, Number(t?.star) || 0));
              if (!quote) return null;
              return (
                <div
                  key={t?._id || idx}
                  className="relative rounded-[20px] p-6 md:p-8 bg-[#F7F8FC] border border-[#E4E7EC] flex flex-col"
                  style={{ boxShadow: "0 12px 30px -16px rgba(16,24,40,0.10)" }}
                >
                  <Quote
                    size={28}
                    strokeWidth={1.5}
                    className="text-[#7784C5] mb-3"
                    aria-hidden
                  />
                  {stars > 0 && (
                    <div
                      className="flex items-center gap-1 mb-3"
                      aria-label={`${stars} star rating`}
                    >
                      {Array.from({ length: stars }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="text-[#F5B544] fill-[#F5B544]"
                          aria-hidden
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-[#101828] text-[14px] md:text-[15px] leading-relaxed mb-6 flex-1">
                    “{quote}”
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    {avatar && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#E4E7EC] flex-shrink-0">
                        <Image
                          src={avatar}
                          alt={authorName || "Testimonial author"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      {authorName && (
                        <div className="text-[#101828] font-semibold text-[13px] sm:text-[14px] lg:text-[15px]">
                          {authorName}
                        </div>
                      )}
                      {role && (
                        <div className="text-[#475467] text-[12px] sm:text-[12.5px] lg:text-[13px]">{role}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

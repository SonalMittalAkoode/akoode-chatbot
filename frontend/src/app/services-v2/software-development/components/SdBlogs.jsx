"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import resolveImageUrl from "@/utils/resolveImageUrl";

const formatDate = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return "Recent";
  return parsed.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const excerpt = (text = "", maxWords = 20) => {
  const clean = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = clean.split(" ").filter(Boolean);
  return words.length <= maxWords ? clean : words.slice(0, maxWords).join(" ") + "...";
};

export default function SdBlogs({ data, blogs: blogsProp }) {
  const heading       = data?.heading       || "Related";
  const headingAccent = data?.headingAccent || "Blogs";
  const intro         = data?.intro;

  const hasProp = Array.isArray(blogsProp) && blogsProp.length > 0;
  const [fetched, setFetched] = useState([]);

  useEffect(() => {
    if (hasProp) return;
    const apiUrl = process.env.NEXT_PUBLIC_FRONTEND_API_URL || "http://localhost:5000/frontend/";
    fetch(`${apiUrl}api/blog/list?page=1&limit=3`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const items = d?.blogs || d?.data || (Array.isArray(d) ? d : []);
        setFetched(items.slice(0, 3));
      })
      .catch(() => {});
  }, [hasProp]);

  const blogs = hasProp ? blogsProp : fetched;

  const sliderRef = useRef(null);
  const [slideIdx, setSlideIdx] = useState(0);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const perCard = (scrollWidth - clientWidth) / Math.max(blogs.length - 1, 1);
    setSlideIdx(Math.round(scrollLeft / perCard));
  };

  const scrollToSlide = (idx) => {
    if (!sliderRef.current) return;
    const { scrollWidth, clientWidth } = sliderRef.current;
    const perCard = (scrollWidth - clientWidth) / Math.max(blogs.length - 1, 1);
    sliderRef.current.scrollTo({ left: idx * perCard, behavior: "smooth" });
  };

  if (blogs.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">

        {/* header */}
        <div className="flex flex-col items-stretch sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-4">
          <h2 className="text-[24px] md:text-[30px] font-bold text-[#1a1a1a]">
            {heading}{" "}
            <span style={{ color: "#7784C5" }}>{headingAccent}</span>
          </h2>
          <Link
            href="/blog"
            className="self-end sm:self-auto shrink-0 whitespace-nowrap inline-flex items-center gap-1 rounded-full
              border border-[#474972]/30 bg-[rgba(111,105,247,0.08)]
              px-4 py-2 text-[13px] sm:text-[14px] font-semibold text-[#474972]
              transition-colors duration-300 hover:bg-[#474972] hover:text-white"
          >
            View all
            <span aria-hidden>→</span>
          </Link>
        </div>

        {intro && (
          <p className="text-[15px] text-[#4A5565] leading-[1.75] mb-8 max-w-[640px]">{intro}</p>
        )}
        {!intro && <div className="mb-8" />}

        {/* cards — horizontal slider on mobile, grid on md+ */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-4 pb-2 md:pb-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {blogs.map((blog) => {
            const rawImage =
              blog.logoimage ||
              (Array.isArray(blog.images) && blog.images[0]) ||
              (typeof blog.image === "string" ? blog.image : null);
            const imageUrl = resolveImageUrl(rawImage) || "/images/blog/blog1.webp";
            const slug = blog.slug || blog._id || "#";
            const desc = excerpt(
              blog.shortdescription || blog.aboutdescription || blog.metadescription || "",
              20
            );

            return (
              <div key={blog._id ?? blog.slug ?? blog.id} className="snap-start shrink-0 md:shrink-[unset] w-[82vw] md:w-auto relative rounded-2xl group">
                {/* thumbnail */}
                <div className="relative h-[240px] rounded-[8px] overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={blog.title || "Blog"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-all duration-[400ms] group-hover:scale-110 group-hover:-rotate-[4deg] group-hover:grayscale"
                  />
                  <div
                    className="absolute left-1/2 top-1/2 w-[200%] h-0
                      -translate-x-1/2 -translate-y-1/2 -rotate-45
                      bg-white/30 z-[1]
                      group-hover:h-[250%] group-hover:bg-transparent
                      transition-all duration-[600ms]"
                  />
                </div>

                {/* floating card */}
                <div
                  className="relative z-[2] bg-white rounded-[8px] p-6
                    border border-[rgba(170,170,170,0.15)]
                    -mt-[84px] mx-[16px]
                    shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                >
                  {/* date tag */}
                  <span
                    className="inline-flex items-center gap-1.5
                      bg-[rgba(111,105,247,0.12)] text-[#474972]
                      px-2.5 py-1.5 rounded-[4px]
                      text-[13px] font-medium leading-none"
                  >
                    <Image src="/calendar.svg" alt="date" width={13} height={13} unoptimized />
                    {formatDate(blog.createdAt || blog.updatedAt)}
                  </span>

                  <div className="h-4" />

                  <h3 className="text-[17px] font-semibold text-[#1a1a1a] leading-[26px] line-clamp-2">
                    <Link
                      href={`/blog/${slug}`}
                      className="hover:text-[#474972] transition-colors duration-300"
                    >
                      {blog.title || "Blog"}
                    </Link>
                  </h3>

                  {desc && (
                    <>
                      <div className="h-3" />
                      <p className="text-[14px] text-gray-600 leading-[22px]">{desc}</p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot indicators — mobile only */}
        <div className="flex md:hidden justify-center gap-2 mt-5">
          {blogs.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="flex h-6 min-w-6 items-center justify-center"
              style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer" }}
            >
              <span
                style={{
                  width: slideIdx === i ? 22 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: slideIdx === i ? "#7784C5" : "rgba(119,132,197,0.3)",
                  transition: "width 0.3s ease, background 0.3s ease",
                }}
              />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}

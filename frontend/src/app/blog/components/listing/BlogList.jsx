'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { Plus } from "lucide-react";
import resolveImageUrl from '@/utils/resolveImageUrl';
import Image from 'next/image';
import { getBlogTableData } from '@/api/frontend/blog';

const formatBlogDate = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return 'Recent';
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

/** Truncate to ~20 words for card description. */
const stripHtml = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const excerptWords = (text, maxWords = 20) => {
  if (!text || typeof text !== 'string') return '';
  const cleanText = stripHtml(text);
  const words = cleanText.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return cleanText;
  return words.slice(0, maxWords).join(' ') + '…';
};

/** Stable id for dedupe + keys: prefer Mongo _id, then slug. */
function blogStableId(post) {
  if (!post || typeof post !== 'object') return '';
  const id = post._id != null ? String(post._id) : '';
  if (id) return id;
  if (post.slug) return `slug:${String(post.slug)}`;
  return '';
}

function mergeBlogsUnique(existing, incoming) {
  const seen = new Set();
  for (const p of existing) {
    const id = blogStableId(p);
    if (id) seen.add(id);
  }
  const out = [...existing];
  for (const p of incoming) {
    const id = blogStableId(p);
    if (id) {
      if (seen.has(id)) continue;
      seen.add(id);
    }
    out.push(p);
  }
  return out;
}

export default function BlogArea({ blogs = [], totalBlogs = 0, category }) {
  const initial = Array.isArray(blogs) ? mergeBlogsUnique([], blogs) : [];
  const [displayedBlogs, setDisplayedBlogs] = useState(initial);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  /**
   * Initial server load: page=1, limit=6 → skip 0–5.
   * "Load more" uses limit=3. skip=6 → (page-1)*3=6 → page=3 (page 2 with limit=3 would skip 3–5 and DUPLICATE part of the first 6).
   */
  const [nextPage, setNextPage] = useState(3);
  const loadGuardRef = useRef(false);

  const filteredBlogs = searchQuery.trim()
    ? displayedBlogs.filter((p) =>
        (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        stripHtml(p.description || p.metadescription || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : displayedBlogs;

  const hasData = filteredBlogs.length > 0;
  const showButton = !searchQuery.trim() && displayedBlogs.length < totalBlogs;

  const handleLoadMore = async () => {
    if (isLoadingMore || !showButton || loadGuardRef.current) return;
    loadGuardRef.current = true;
    setIsLoadingMore(true);
    try {
      const response = await getBlogTableData(nextPage, 3, category);
      const newBlogs = response?.blogs || [];
      if (newBlogs.length > 0) {
        setDisplayedBlogs((prev) => mergeBlogsUnique(prev, newBlogs));
        setNextPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to load more blogs:", error);
    } finally {
      setIsLoadingMore(false);
      loadGuardRef.current = false;
    }
  };

  return (
    /* .vl-blog-4-area-inner .sp1 — py-[70px] */
    <div className="py-[70px] bg-white">
      <div className="container mx-auto px-[2rem] md:px-[15px]">

        {/* Search Bar */}
        <div className="mb-10 max-w-[560px] mx-auto">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#474972]/50 pointer-events-none"
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blogs..."
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-[#d0d3ee] bg-white text-[15px] text-[#333] placeholder-[#bbb] outline-none focus:border-[#474972] focus:ring-2 focus:ring-[#474972]/15 transition-all duration-200 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#474972] transition-colors"
                aria-label="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* .row → 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 items-stretch">
          {hasData ? (
            filteredBlogs.map((post, index) => {
              const rawImage =
                post.logoimage ||
                (Array.isArray(post.images) && post.images.length > 0 && post.images[0]) ||
                (typeof post.image === 'string' ? post.image : null);
              const imageUrl = resolveImageUrl(rawImage) || '/images/blog/blog1.webp';
              const slug = post.slug || post._id || '#';
              const rowKey = blogStableId(post) || `blog-row-${index}`;

              return (
                <div key={rowKey} className="group flex flex-col h-full">

                  {/* Image — fixed height */}
                  <div className="relative h-[240px] rounded-[8px] overflow-hidden flex-shrink-0">
                    <Image
                      src={imageUrl}
                      alt={post.title || 'Blog image'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-all duration-[400ms]
                        group-hover:scale-110 group-hover:-rotate-[4deg] group-hover:grayscale"
                    />
                    <div
                      className="absolute left-1/2 top-1/2 w-[200%] h-0
                        -translate-x-1/2 -translate-y-1/2 -rotate-45
                        bg-white/30 z-[1]
                        group-hover:h-[250%] group-hover:bg-transparent
                        transition-all duration-[600ms]"
                    />
                  </div>

                  {/* Content — grows to fill card height, overlap image */}
                  <div
                    className="relative z-[2] bg-white rounded-[8px] p-6 flex flex-col flex-1
                      border border-[rgba(170,170,170,0.15)]
                      -mt-[80px] mx-[16px]
                      shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                  >
                    {/* Date tag */}
                    <div>
                      <span
                        className="inline-flex items-center gap-[6px]
                          bg-[rgba(111,105,247,0.2)] text-[#474972]
                          px-[10px] py-[6px] rounded-[4px]
                          text-[13px] font-medium leading-none"
                      >
                        <Image
                          src="/calendar.svg"
                          alt="Calendar icon"
                          width={14}
                          height={14}
                          unoptimized
                          className="w-[14px] h-[14px]"
                        />
                        {formatBlogDate(post.date || post.publishedOn || post.createdAt)}
                      </span>
                    </div>

                    <div className="h-[16px]" />

                    {/* Title */}
                    <h2 className="text-[17px] font-semibold text-[#1a1a1a] leading-[26px] line-clamp-2">
                      <Link
                        href={`/blog/${slug}`}
                        className="underline decoration-[#000000]/50 underline-offset-[3px] hover:no-underline hover:text-[#000000] transition-colors duration-300"
                      >
                        {post.title || 'Blog Title'}
                      </Link>
                    </h2>

                    {/* Description — fills remaining space */}
                    {(post.description || post.metadescription) && (
                      <>
                        <div className="h-[12px]" />
                        <p className="text-[14px] text-gray-600 leading-[22px] line-clamp-3 flex-1">
                          {excerptWords(post.description || post.metadescription || '', 20)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500">
              {searchQuery.trim()
                ? `No blogs found for "${searchQuery}"`
                : 'No blogs available at the moment.'}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {showButton && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="relative z-10 overflow-hidden inline-flex items-center justify-center gap-2 px-7 py-2 rounded-lg bg-white text-[#474972] font-bold border border-[#474972]/10 shadow-sm transition-all duration-400 cursor-pointer after:content-[''] after:absolute after:inset-y-0 after:left-1/2 after:-translate-x-1/2 after:w-[10px] after:bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] after:-z-10 after:opacity-0 after:transition-all after:duration-400 hover:text-white hover:after:w-full hover:after:rounded-lg hover:after:opacity-100"
            >
              {isLoadingMore ? "Loading..." : "Load More"} <Plus className="inline-block ml-1" size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

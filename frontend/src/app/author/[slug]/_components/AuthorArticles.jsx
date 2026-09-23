'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import resolveImageUrl from '@/utils/resolveImageUrl';
import { excerptWords, stripHtml } from '@/app/blog/utils/blogText';

// Mobile reveals 3 per batch; desktop fills its 4-column row. The breakpoint
// difference is expressed in CSS rather than a JS media query, so the server and
// client render identically (no hydration flash).
const MOBILE_STEP = 3;
const DESKTOP_STEP = 4;

const formatDate = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const cardImage = (blog) =>
  resolveImageUrl(
    blog?.logoimage ||
      (Array.isArray(blog?.images) && blog.images.length > 0 ? blog.images[0] : null) ||
      (typeof blog?.image === 'string' ? blog.image : null)
  ) || '/blogs/non-featured.jpg';

const cardExcerpt = (blog) =>
  stripHtml(blog?.metadescription) ||
  stripHtml(blog?.shortdescription) ||
  excerptWords(blog?.description, 18);

/* 974:1187 — article card */
function ArticleCard({ blog }) {
  const category = blog?.blogcategory?.title || blog?.blogcategory?.name;
  const date = formatDate(blog?.date || blog?.publishedAt || blog?.createdAt);
  const href = blog?.slug ? `/blog/${blog.slug}` : '/blog';

  return (
    // Only the CTA is a link — the card body itself is not clickable.
    <article className="flex flex-col overflow-hidden rounded-[20px] border border-[#E3E7FF] bg-white transition-shadow duration-300 hover:shadow-[0px_10px_30px_0px_rgba(113,133,250,0.14)]">
      {/* 974:1188 — media band. Figma's 403×168 (2.4:1) is far wider than the
          16:9 blog thumbnails, which left big side bars under object-contain, so
          the band matches the images instead: ~94% of uploads are 16:9 and now
          fill it exactly. #F0F2F8 covers the letterbox on odd-sized outliers. */}
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[#F0F2F8]">
        <Image
          src={cardImage(blog)}
          alt={blog?.logoimagealt || blog?.title || 'Article'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 326px"
          className="object-contain"
        />
        {category && (
          /* 974:1190 — category chip */
          <span className="absolute left-[12px] top-[12px] rounded-[6px] bg-white/92 px-[10px] py-[4px] text-[12px] font-semibold leading-[16.5px] tracking-[0.44px] text-[#7185FA] backdrop-blur-[2px]">
            {category}
          </span>
        )}
      </div>

      {/* 974:1192 — card body */}
      <div className="flex flex-1 flex-col px-[18px] pb-[20px] pt-[16px]">
        {date && (
          <p className="pb-[10px] text-[13px] leading-[18px] text-[#6B7280]">{date}</p>
        )}
        {/* 974:1197 — clamped to the 3-line box the design reserves */}
        <h3 className="line-clamp-3 text-[19px] font-bold leading-[24px] tracking-[-0.15px] text-[#1D2033]">
          {blog?.title}
        </h3>
        <p className="mt-[10px] line-clamp-3 text-[13px] leading-[17px] text-[#6B7280]">
          {cardExcerpt(blog)}
        </p>
        {/* 974:1200 — the only interactive element in the card */}
        <Link
          href={href}
          className="group mt-auto flex w-fit items-center gap-[6px] pt-[14px] text-[15px] font-semibold leading-[19.5px] text-[#7185FA] transition-opacity hover:opacity-80"
        >
          Read Article
          <ArrowRight
            className="size-[17px] shrink-0 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={2}
            aria-hidden
          />
        </Link>
      </div>
    </article>
  );
}

export default function AuthorArticles({ blogs = [], firstName = '' }) {
  const [batches, setBatches] = useState(1);
  if (blogs.length === 0) return null;

  const mobileLimit = batches * MOBILE_STEP;
  const desktopLimit = batches * DESKTOP_STEP;
  const moreOnMobile = blogs.length > mobileLimit;
  const moreOnDesktop = blogs.length > desktopLimit;

  // Every card is rendered so its link is crawlable; batching only toggles CSS
  // visibility. Hiding beyond the batch keeps the page short without dropping
  // internal links that Google would otherwise never reach (it does not click).
  const visibilityClass = (index) => {
    if (index < mobileLimit) return '';
    if (index < desktopLimit) return 'hidden sm:block';
    return 'hidden';
  };

  return (
    <>
      {/* 974:1067 */}
      <h2 className="text-[22px] font-semibold leading-[32px] tracking-[-0.84px] text-[#1D2033] md:text-[26px]">
        More From {firstName || 'this author'}
      </h2>

      {/* 974:1222 — 4-up on desktop, reflowing down to a single column */}
      <div className="grid grid-cols-1 gap-[21px] sm:grid-cols-2 xl:grid-cols-4">
        {blogs.map((blog, index) => (
          <div key={blog?._id || blog?.slug} className={visibilityClass(index)}>
            <ArticleCard blog={blog} />
          </div>
        ))}
      </div>

      {/* 974:1330 */}
      {(moreOnMobile || batches > 1) && (
        <button
          type="button"
          onClick={() => setBatches((prev) => (moreOnMobile ? prev + 1 : 1))}
          className={`mx-auto flex cursor-pointer items-center gap-[6px] text-[15px] font-medium leading-[21px] text-[#7185FA] transition-opacity hover:opacity-80 ${
            moreOnDesktop ? '' : moreOnMobile ? 'sm:hidden' : ''
          }`}
        >
          {moreOnMobile ? 'View more articles' : 'Show fewer articles'}
          <ChevronDown
            className={`size-[18px] shrink-0 transition-transform duration-300 ${moreOnMobile ? '' : 'rotate-180'}`}
            strokeWidth={1.67}
            aria-hidden
          />
        </button>
      )}

    </>
  );
}

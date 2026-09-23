'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { estimateReadTime, excerptWords } from '../../utils/blogText';

const formatCardDate = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return 'Recent';
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

export default function CategorySection({
  posts = [],
  id,
  heading = 'Engineering excellence,',
  headingAccent = 'delivered At scale',
  subtitle = 'In-depth guides, best practices and real-world insights',
  viewAllHref = '/blog',
}) {
  const sliderRef = useRef(null);
  const [slideIdx, setSlideIdx] = useState(0);

  if (!posts.length) return null;

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const perCard = (scrollWidth - clientWidth) / Math.max(posts.length - 1, 1);
    setSlideIdx(Math.round(scrollLeft / perCard));
  };

  const scrollToSlide = (idx) => {
    if (!sliderRef.current) return;
    const { scrollWidth, clientWidth } = sliderRef.current;
    const perCard = (scrollWidth - clientWidth) / Math.max(posts.length - 1, 1);
    sliderRef.current.scrollTo({ left: idx * perCard, behavior: 'smooth' });
  };

  return (
    <section id={id} className="relative overflow-hidden bg-[#F8FAFF] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <Image
        src="/badge/cat-light.svg"
        alt="Akoode Blogs"
        aria-hidden
        fill
        className="pointer-events-none object-contain"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 xl:grid xl:grid-cols-2 xl:items-center xl:gap-10">
          <h2 className="max-w-[820px] text-[28px] font-[400] capitalize leading-[1.15] tracking-[-0.3px] text-[#1D1F4B] sm:text-[36px] lg:text-[44px]">
            {heading}
            <br />
            <span className="text-[#7784C5]">{headingAccent}</span>
          </h2>

          <div className="flex items-start gap-3 sm:gap-4">
            <span className="mt-1 h-11 w-1 shrink-0 rounded-full bg-[#8C98D3]" />
            <p className="text-[16px] leading-[1.3] text-[#1D1F4B] sm:text-[20px] lg:text-[24px] lg:leading-[1.28]">
              {subtitle}
            </p>
          </div>
        </div>

        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 sm:snap-none lg:mt-14 lg:grid-cols-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {posts.map((post, index) => {
            const slug = post.slug || post._id || '#';
            const categoryLabel = post.blogcategory?.title || 'Insight';
            const readTime = estimateReadTime(post.description || post.metadescription);
            const dateLabel = formatCardDate(post.date || post.publishedOn || post.createdAt);
            const excerpt = excerptWords(post.description || post.metadescription, 55);

            return (
              <div
                key={post._id || post.slug || index}
                className="group relative flex w-[80vw] shrink-0 snap-start sm:w-auto sm:shrink sm:min-h-[330px] lg:min-h-[365px]"
              >
                <div
                  style={{ transformOrigin: 'center' }}
                  className="static flex h-full w-full flex-col gap-4 rounded-[16px] border-2 border-[#AFC9FF] bg-[#1D1F4B] p-6 [transform:scale(1)] transition-transform duration-300 ease-out sm:absolute sm:inset-0 sm:h-auto sm:w-auto sm:group-hover:z-10 sm:group-hover:[transform:scale(1.05)] lg:rounded-[20px] lg:p-7"
                >
                  <span className="inline-flex w-fit items-center rounded-[6px] bg-[rgba(136,154,244,0.60)] px-3 py-1 text-[12px] font-medium text-white">
                    {categoryLabel}
                  </span>

                  <h3 className="line-clamp-3 text-[16px] font-semibold leading-[1.35] sm:line-clamp-2 sm:text-[18px]">
                    <Link href={`/blog/${slug}`} className="text-white">
                      {post.title}
                    </Link>
                  </h3>

                  {excerpt && (
                    <p className="text-[13px] leading-[20px] text-white sm:line-clamp-5 sm:text-[14px]">
                      {excerpt}
                    </p>
                  )}

                  <div className="mt-auto flex items-center gap-3 border-t border-[#D7D7D7]/40 pt-4 text-[13px] text-white">
                    <span className="flex items-center gap-1.5 border-r border-white/50 pr-3">
                      <Calendar size={14} />
                      {dateLabel}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {readTime}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot indicators — mobile slider only */}
        {/* 24x24 buttons (a11y touch-target minimum) with the visual dot as an inner span */}
        <div className="mt-5 flex justify-center sm:hidden">
          {posts.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="flex h-6 min-w-6 items-center justify-center"
              style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
            >
              <span
                style={{
                  width: slideIdx === i ? 22 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: slideIdx === i ? '#7784C5' : 'rgba(119,132,197,0.3)',
                  transition: 'width 0.3s ease, background 0.3s ease',
                }}
              />
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#5566DC] transition-all hover:gap-2.5 sm:text-[17px]"
          >
            View All
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

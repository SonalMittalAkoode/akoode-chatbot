import Link from 'next/link';
import resolveImageUrl from '@/utils/resolveImageUrl';
import { estimateReadTime } from '../../utils/blogText';
import { getServiceHrefForCategory } from '../../utils/categoryServiceMap';
import BlogImage from './BlogImage';
import TrendingSearchBar from './TrendingSearchBar';

export default function TrendingSection({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <section className="bg-white px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-t-[16px] border border-[#E8ECF4]">
        {/* Header row */}
        <div className="flex items-center justify-between gap-4 bg-white px-4 py-5 sm:px-6">
          <h2 className="text-[16px] font-semibold text-[#1D1F4B] sm:text-[20px] lg:text-[24px]">
            Trending
          </h2>
          <TrendingSearchBar />
        </div>

        {posts.map((post, index) => {
          const image = resolveImageUrl(post.logoimage) || '/blogs/non-featured.jpg';
          const slug = post.slug || post._id || '#';
          const categoryLabel = post.blogcategory?.title || 'Insight';
          const serviceHref = getServiceHrefForCategory(post.blogcategory);
          const readTime = estimateReadTime(post.description || post.metadescription);

          return (
            <div
              key={post._id || post.slug || index}
              className="flex items-center gap-4 border-t border-[#E8ECF4] px-4 py-5 sm:gap-6 sm:px-6 lg:gap-10"
            >
              <span className="shrink-0 text-[16px] font-extrabold text-[#1D1F4B] sm:text-[18px] lg:text-[20px]">
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* xl: one line — category | title | read time, spread like the Figma row. Below xl:
                  stacked for legibility (at lg the fixed-width columns leave too little room for the title). */}
              <div className="flex min-w-0 flex-1 flex-col gap-1 xl:flex-row xl:items-center xl:gap-10">
                {serviceHref ? (
                  <Link
                    href={serviceHref}
                    className="shrink-0 text-[13px] font-bold text-[#5566DC] sm:text-[16px] xl:w-[220px] xl:text-[18px]"
                  >
                    {categoryLabel}
                  </Link>
                ) : (
                  <span className="shrink-0 text-[13px] font-bold text-[#5566DC] sm:text-[16px] xl:w-[220px] xl:text-[18px]">
                    {categoryLabel}
                  </span>
                )}
                <h3 className="min-w-0 flex-1 text-[14px] font-medium text-[#0F172A] sm:text-[17px] lg:text-[20px]">
                  <Link
                    href={`/blog/${slug}`}
                    className="line-clamp-2 xl:line-clamp-1"
                  >
                    {post.title}
                  </Link>
                </h3>
                <span className="shrink-0 text-[12px] text-[#64748B] sm:text-[15px] xl:w-[120px] xl:text-right xl:text-[18px]">
                  {readTime}
                </span>
              </div>

              <div className="relative hidden h-16 w-[114px] shrink-0 overflow-hidden rounded-[7px] sm:block">
                <BlogImage
                  src={image}
                  fallbackSrc="/blogs/non-featured.jpg"
                  alt={post.logoimagealt || post.title || 'Blog thumbnail'}
                  fill
                  sizes="114px"
                  className="object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

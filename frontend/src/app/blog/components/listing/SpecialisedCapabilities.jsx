import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Sparkles } from 'lucide-react';
import resolveImageUrl from '@/utils/resolveImageUrl';
import { estimateReadTime, excerptWords } from '../../utils/blogText';
import BlogImage from './BlogImage';

const formatCardDate = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return 'Recent';
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

export default function SpecialisedCapabilities({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <section className="bg-[#F8FAFF] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-4 sm:mb-10 sm:gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#1D1F4B] sm:h-16 sm:w-16 sm:rounded-[16px]">
            <Sparkles className="h-6 w-6 text-white sm:h-8 sm:w-8" />
          </div>
          <h2 className="text-[24px] font-normal capitalize leading-[1.1] text-[#1D1F4B] sm:text-[36px] lg:text-[44px]">
            Specialised AI <span className="text-[#7784C5]">Capabilities We Build</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post, index) => {
            const image = resolveImageUrl(post.logoimage) || '/blogs/non-featured.jpg';
            const slug = post.slug || post._id || '#';
            const categoryLabel = post.blogcategory?.title || 'AI/ML';
            const readTime = estimateReadTime(post.description || post.metadescription);
            const dateLabel = formatCardDate(post.date || post.publishedOn || post.createdAt);
            const excerpt = excerptWords(post.description || post.metadescription);

            return (
              <Link
                key={post._id || post.slug || index}
                href={`/blog/${slug}`}
                className="group flex flex-col rounded-[31px] border border-[#E5E7EB] bg-white p-3.5 transition-shadow hover:shadow-[0_12px_32px_rgba(29,31,75,0.08)]"
              >
                <div className="relative h-[220px] w-full overflow-hidden rounded-[26px]">
                  <BlogImage
                    src={image}
                    fallbackSrc="/blogs/non-featured.jpg"
                    alt={post.logoimagealt || post.title || 'Blog thumbnail'}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 px-1.5 pt-4">
                  <span className="inline-flex w-fit items-center rounded-[6px] bg-[rgba(136,154,244,0.33)] px-2.5 py-1 text-[13px] font-medium text-[#101828]">
                    {categoryLabel}
                  </span>
                  <h3 className="line-clamp-2 text-[17px] font-medium leading-[1.3] text-[#101828] sm:text-[20px]">
                    {post.title}
                  </h3>
                  {excerpt && (
                    <p className="line-clamp-2 text-[13px] leading-[1.35] text-[#4A5565] sm:text-[14px]">
                      {excerpt}
                    </p>
                  )}

                  <div className="mt-1 flex items-center gap-3 text-[12px] text-[#4A5565] sm:text-[13px]">
                    <span className="flex items-center gap-1.5 border-r border-[#4A5565]/40 pr-3">
                      <Calendar size={15} />
                      {dateLabel}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={15} />
                      {readTime}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center sm:mt-12">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-[18px] font-semibold text-[#5566DC] transition-all hover:gap-3 sm:text-[24px]"
          >
            View All
            <ArrowRight size={22} />
          </Link>
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import { ArrowRight } from "lucide-react";
import resolveImageUrl from '@/utils/resolveImageUrl';
import Image from 'next/image';

const formatBlogDate = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return 'Recent';
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

export default function BlogBottomArea({ blogs = [] }) {
  const items = Array.isArray(blogs) ? blogs.slice(0, 3) : [];

  if (items.length === 0) return null;

  return (
    /*
      .vl-blog-bottom-area — relative, z-1
      .sp2 — pt-[100px] pb-[70px] (mobile: pt-[50px] pb-[20px])
    */
    <div className="relative z-[1] pt-[50px] pb-[20px] md:pt-[100px] md:pb-[70px] bg-white">
      <div className="container mx-auto px-4">

        {/* .heading2 .space-margin60 — centred title, mb-[60px] */}
        <div className="max-w-xl mx-auto text-center mb-[60px]">
          {/*
            .heading2 h2 — font-s48 (~48px), bold, line-height 58px, dark text
          */}
          <h2 className="text-[32px] md:text-[48px] font-bold leading-[1.2] md:leading-[58px] text-[#1a1a1a]">
            View More Our Blog
          </h2>
        </div>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((blog) => {
            const rawImage =
              blog.logoimage ||
              (Array.isArray(blog.images) && blog.images.length > 0 && blog.images[0]) ||
              (typeof blog.image === 'string' ? blog.image : null);
            const imageUrl = resolveImageUrl(rawImage) || '/images/blog/blog1.webp';
            const slug = blog.slug || blog._id || '#';

            return (
              /*
                .vl-blog-1-item — relative, rounded-2xl, mb-[30px]
                Uses `group` so child hover targets work
              */
              <div
                key={blog._id ?? blog.slug ?? blog.id}
                className="relative rounded-2xl mb-[30px] group"
              >
                {/* .vl-blog-1-thumb .image-anime — h-[280px], overflow-hidden, rounded-[8px] */}
                <div className="relative h-[280px] rounded-[8px] overflow-hidden min-h-[220px] max-md:min-h-[200px]">
                  <Image
                    src={imageUrl}
                    alt={blog.title || "Blog image"}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-all duration-[400ms] 
      group-hover:scale-110 group-hover:-rotate-[4deg] group-hover:grayscale"
                  />
                  {/* .image-anime diagonal shine overlay */}
                  <div
                    className="absolute left-1/2 top-1/2 w-[200%] h-0
                      -translate-x-1/2 -translate-y-1/2 -rotate-45
                      bg-white/30 z-[1]
                      group-hover:h-[250%] group-hover:bg-transparent
                      transition-all duration-[600ms]"
                  />
                </div>

                {/*
                  .vl-blog-1-content
                  — relative, z-2, p-24px, bg-white,
                    -mt-[100px] mx-[16px] (overlap effect),
                    shadow-[0_.25rem_.75rem_rgba(0,0,0,.05)]
                */}
                <div
                  className="relative z-[2] p-6 bg-white rounded-[8px]
                    -mt-[100px] mx-[16px]
                    shadow-[0_0.25rem_0.75rem_rgba(0,0,0,0.05)]
                    border border-[rgba(170,170,170,0.12)]"
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
                        src="/images/calendar.svg"
                        alt="Calendar"
                        width={14}
                        height={14}
                        unoptimized
                        className="w-[14px] h-[14px]"
                      />
                      {formatBlogDate(blog.date || blog.publishedOn || blog.createdAt)}
                    </span>
                  </div>

                  {/* space16 */}
                  <div className="h-[16px]" />

                  <h4 className="text-[17px] font-semibold text-[#1a1a1a] leading-[26px] line-clamp-2">
                    <Link
                      href={`/blog/${slug}`}
                      className="hover:text-[#474972] transition-colors duration-300"
                    >
                      {blog.title || 'Blog Title'}
                    </Link>
                  </h4>

                  {/* space20 */}
                  <div className="h-[20px]" />

                  {/* .readmore — angled arrow */}
                  <Link
                    href={`/blog/${slug}`}
                    className="inline-flex items-center gap-[5px] text-[14px] font-semibold
                      text-[#1a1a1a] hover:text-[#474972] transition-colors duration-300"
                  >
                    Learn More <span className="sr-only">about {blog.title || 'this post'}</span>
                    <ArrowRight className="-rotate-45" size={11} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

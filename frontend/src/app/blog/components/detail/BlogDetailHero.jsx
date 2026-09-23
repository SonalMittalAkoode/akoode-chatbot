import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import HeroBreadcrumb from '@/components/HeroBreadcrumb';
import resolveImageUrl from '@/utils/resolveImageUrl';
import { authorSlug } from '@/utils/authorSlug';

/* Company profile — used when an author has no personal LinkedIn on record. */
const AKOODE_LINKEDIN = 'https://www.linkedin.com/company/akoode-technologies/';

const getInitials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'A';

export default function BlogDetailHero({ blog }) {
  const title = blog?.title || 'Blog Detail';

  const author = blog?.author && typeof blog.author === 'object' ? blog.author : null;
  const authorName = author?.name || blog?.authorName || null;
  const authorRole = author?.designation || 'Technology Consultant';
  const authorImage = resolveImageUrl(author?.image);
  const authorLinkedin = author?.linkedin || author?.linkedinUrl || AKOODE_LINKEDIN;
  // Only employee-backed authors have a profile page. A free-text authorName has
  // nowhere to go, so the CTA is dropped rather than sent somewhere unrelated.
  const authorHref = author?.name ? `/author/${authorSlug(author.name)}` : null;

  return (
    // min-h keeps the band near the Figma 1901×630 proportion so the gradient frames the same way
    <section className="relative z-[1] overflow-hidden bg-[#130E2A] font-figtree lg:min-h-[432px]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/blogs/blog-hero-gradient.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 pt-[100px] pb-[34px] sm:pt-[110px] sm:pb-[40px] md:pt-[150px] md:pb-[52px] lg:pt-[170px] lg:pb-[70px]">
        <div
          className={`grid grid-cols-1 items-start gap-8 sm:gap-10 ${
            authorName
              ? 'lg:grid-cols-[minmax(0,1fr)_370px] xl:grid-cols-[minmax(0,1fr)_478px] lg:gap-10 xl:gap-[80px]'
              : ''
          }`}
        >

          <div className="flex min-w-0 flex-col gap-[14px] sm:gap-[18px]">
            <HeroBreadcrumb
              className="mb-0"
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blogs', href: '/blog' },
                { label: title },
              ]}
            />
            {/* 913:965 — kept at the page's original h1 metrics (42px/64px, -0.54px) */}
            <h1 className="capitalize break-words hyphens-auto text-[22px] md:text-[42px] font-semibold leading-tight md:leading-[64px] tracking-[-0.54px] text-white">
              {title}
            </h1>
          </div>

          {/* ── Right: author card (914:982) ── */}
          {authorName && (
            <aside
              className="relative min-w-0 overflow-hidden rounded-[18px] sm:rounded-[22px]"
              style={{
                backgroundImage:
                  'linear-gradient(150.61deg, rgb(247, 249, 255) 0%, rgb(255, 255, 255) 100%)',
              }}
            >
              {/* 914:983 — left accent rail */}
              <span aria-hidden className="absolute left-0 top-px bottom-px w-[5px] rounded-l-[18px] bg-[#7784C5] sm:w-[6px] sm:rounded-l-[22px]" />

              <div className="flex flex-col py-[20px] pl-[20px] pr-[16px] sm:py-[26px] sm:pl-[28px] sm:pr-[22px] md:py-[29px] md:pl-[40px] md:pr-[29px]">
                <div className="flex items-start gap-[14px] sm:gap-[16px] md:gap-[22px]">
                  {/* 914:991 — 88px avatar (scaled down on the smallest screens) */}
                  <div className="relative size-[60px] shrink-0 overflow-hidden rounded-full border-[2.4px] border-white shadow-[0px_2px_12px_0px_rgba(113,133,250,0.18)] sm:size-[80px]">
                    {authorImage ? (
                      <Image
                        src={authorImage}
                        alt={authorName}
                        width={80}
                        height={80}
                        sizes="80px"
                        className="size-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center rounded-full bg-gradient-to-br from-[#7784C5] to-[#4F5581] text-[20px] font-bold text-white sm:text-[26px]">
                        {getInitials(authorName)}
                      </span>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-col">
                    {/* 914:994 */}
                    <p className="text-[11px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#7185FA]">
                      Written by:
                    </p>
                    {/* 914:997 */}
                    <p className="pt-[5px] break-words text-[18px] font-bold leading-[24px] tracking-[-0.48px] text-[#1D2033] sm:text-[20px] sm:leading-[27px] md:text-[24px]">
                      {authorName}
                    </p>
                    {/* 914:1000 */}
                    <div className="pt-[7px] break-words text-[13px] leading-[19.5px] text-[#6B7280] sm:text-[14px] sm:leading-[21.5px]">
                      <p>{authorRole},</p>
                      <p className="font-medium text-[#4B5563]">Akoode Technologies</p>
                    </div>
                    {/* 914:1002 */}
                    <a
                      href={authorLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-[12px] inline-flex w-fit items-center gap-[6px] text-[13px] font-medium leading-[19.5px] text-[#6679E4] transition-opacity hover:opacity-80"
                    >
                      <Image
                        src="/blogs/linkedin-badge.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="size-[16px] shrink-0"
                      />
                      LinkedIn
                      <ExternalLink className="size-[12px] shrink-0" strokeWidth={1.39} aria-hidden />
                    </a>
                  </div>
                </div>

                {/* 914:1013 */}
                {authorHref && (
                  <Link
                    href={authorHref}
                    className="mt-[16px] flex min-h-[40px] w-full items-center justify-center gap-[8px] rounded-[11px] bg-gradient-to-r from-[#1D1F4B] to-[#7185FA] px-[16px] py-[9px] text-center text-[13px] font-semibold leading-[20px] tracking-[0.15px] text-white drop-shadow-[0px_4px_8px_rgba(113,133,250,0.35)] transition-transform duration-200 hover:-translate-y-[1px] sm:mt-[25px] sm:min-h-[48px] sm:gap-[9px] sm:rounded-[15px] sm:px-[22px] sm:py-[13px] sm:text-[14px] sm:leading-[21px]"
                  >
                    More from this author
                    <ArrowRight className="size-[15px] shrink-0 sm:size-[16px]" strokeWidth={1.75} aria-hidden />
                  </Link>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}

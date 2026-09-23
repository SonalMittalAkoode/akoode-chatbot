import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import resolveImageUrl from '@/utils/resolveImageUrl';
import HeroBreadcrumb from '@/components/HeroBreadcrumb';

const stripHtml = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

/** First 2–3 <p> blocks of the rich-text body, falling back to sentence groups for plain text. */
const getParagraphs = (html, maxParagraphs = 3) => {
  if (!html || typeof html !== 'string') return [];

  const matches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => stripHtml(m[1]))
    .filter(Boolean);

  if (matches.length > 0) return matches.slice(0, maxParagraphs);

  const clean = stripHtml(html);
  if (!clean) return [];
  const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
  const perParagraph = Math.max(1, Math.ceil(sentences.length / maxParagraphs));
  const paragraphs = [];
  for (let i = 0; i < sentences.length && paragraphs.length < maxParagraphs; i += perParagraph) {
    paragraphs.push(sentences.slice(i, i + perParagraph).join(' ').trim());
  }
  return paragraphs;
};


const MAX_DESCRIPTION_CHARS = 900;

const trimToBudget = (paragraphs, budget = MAX_DESCRIPTION_CHARS) => {
  const MIN_TAIL = 80;
  const kept = [];
  let used = 0;

  for (const paragraph of paragraphs) {
    const remaining = budget - used;
    if (remaining <= 0) break;

    if (paragraph.length <= remaining) {
      kept.push(paragraph);
      used += paragraph.length;
      continue;
    }

    if (remaining < MIN_TAIL && kept.length > 0) break;

    const slice = paragraph.slice(0, remaining);
    const lastSpace = slice.lastIndexOf(' ');
    const cut = (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).replace(
      /[\s.,;:!?—–-]+$/,
      '',
    );
    if (cut) kept.push(`${cut}…`);
    break;
  }

  return kept;
};

export default function BlogHero({ blogs = [] }) {
  const [featured] = blogs;

  if (!featured) return null;

  const featuredImage = resolveImageUrl(featured.logoimage) || '/blogs/hero.png';
  const featuredSlug = featured.slug || featured._id || '#';
  const paragraphs = trimToBudget(
    getParagraphs(featured.description || featured.metadescription, 4),
  );

  return (
    <section className="relative overflow-hidden bg-[#1F2336] pt-[100px] pb-8 md:pt-[112px] md:pb-10">
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 right-[-10%] h-[420px] w-[70%] rounded-full opacity-40 blur-[110px] md:right-0 md:w-[45%]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(113,133,250,0.35) 0%, rgba(42,47,72,0.1) 70%, transparent 100%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 lg:absolute lg:left-4 lg:top-2 lg:z-10 lg:mb-0 xl:left-8">
          <HeroBreadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mx-auto max-w-[820px] text-[28px] sm:text-[36px] lg:text-[44px] font-[family-name:var(--font-figtree)] font-[400] capitalize leading-[1.15] tracking-[-0.3px] text-white">
            Technical Thinking For{' '}
            <span className="text-[#889AF4]">Teams That Build Things</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-[1.5] text-white/80 sm:text-[16px] md:text-[18px]">
            AI, software development, and platform engineering. Written for CTOs, engineering
            managers, and founders who want depth, not summaries.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-10 pb-8 md:mt-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10 lg:pb-10">
          <Link
            href={`/blog/${featuredSlug}`}
            className="group relative block aspect-[7/4] w-full self-start"
          >
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <Image
                src={featuredImage}
                alt={featured.logoimagealt || featured.title || 'Featured blog image'}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
                fetchPriority="high"
              />
            </div>

            {/* Frosted glass title card — matches Figma's Rectangle1 (radial tint + blur(40px) + grain), hangs below the image */}
            <div
              className="absolute inset-x-0 -bottom-6 overflow-hidden rounded-2xl backdrop-blur-[40px] sm:-bottom-8"
              style={{
                background:
                  'radial-gradient(ellipse 127% 152% at 15% 21%, rgba(164,239,255,0.20) 0%, rgba(110,191,244,0.04) 77%, rgba(70,144,213,0) 100%)',
              }}
            >
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-overlay opacity-30"
                style={{
                  backgroundImage: "url('/blogs/title_card.webp')",
                  backgroundSize: '300px',
                }}
              />
              <div className="relative bg-gradient-to-t from-black/70 to-black/10 p-4 sm:p-6 lg:p-7">
                <h2 className="text-[16px] font-semibold leading-snug text-white sm:text-[19px] lg:text-[21px]">
                  {featured.title}
                </h2>
              </div>
            </div>
          </Link>

          <div className="lg:relative">
            <div className="flex flex-col lg:absolute lg:inset-0">
              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden lg:gap-4 lg:[mask-image:linear-gradient(to_bottom,#000_calc(100%_-_28px),transparent_100%)] lg:[-webkit-mask-image:linear-gradient(to_bottom,#000_calc(100%_-_28px),transparent_100%)]">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-[13px] leading-[1.6] text-white/80 sm:text-[14px] lg:text-[15px]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <Link
                href={`/blog/${featuredSlug}`}
                className="group mt-4 inline-flex w-fit shrink-0 items-center gap-1.5 text-[14px] font-semibold text-[#7185FA] transition-all hover:gap-2.5 sm:text-[16px]"
              >
                Read Article
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

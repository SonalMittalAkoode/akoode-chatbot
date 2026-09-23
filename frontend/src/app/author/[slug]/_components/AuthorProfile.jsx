import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import resolveImageUrl from '@/utils/resolveImageUrl';

const AKOODE_LINKEDIN = 'https://www.linkedin.com/company/akoode-technologies/';

const getInitials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'A';

/**
 * Author profile header — avatar, name, role, LinkedIn and the pull quote.
 * Figma: sourabh-akoode-dev / node 952:749
 */
export default function AuthorProfile({ author }) {
  const name = author?.name || 'Author';
  const role = author?.designation || '';
  const avatar = resolveImageUrl(author?.image);
  const linkedin = author?.linkedin || author?.linkedinUrl || AKOODE_LINKEDIN;
  const quote = author?.quote || '';
  const bioParagraphs = String(author?.bio || '')
    .split(/\n{1,}/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      {/* 952:761 — breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-[15px] font-medium capitalize leading-[1.1] text-[#4A5565] md:text-[16px]">
        <ol className="flex flex-wrap items-center gap-x-[6px] gap-y-[4px]">
          <li>
            <Link href="/" className="transition-colors hover:text-[#7185FA]">Home</Link>
          </li>
          <li aria-hidden>/</li>
          {/* Plain text, not a link: there is no /author index page, and pointing
              this at /blog would send people somewhere they did not ask for. */}
          <li>Author</li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-[#1D2033]">{name}</li>
        </ol>
      </nav>

      {/* 952:871 — identity block + quote card */}
      <div className="flex flex-col items-start gap-[28px] lg:flex-row lg:items-center lg:gap-[60px] xl:gap-[80px]">
        <div className="flex min-w-0 items-center gap-[20px] sm:gap-[28px] xl:gap-[36px]">
          {/* 952:873 — 155px avatar, 2.4px #7185FA ring */}
          <div className="relative size-[92px] shrink-0 overflow-hidden rounded-full border-[2.4px] border-[#7185FA] shadow-[0px_4px_20px_0px_rgba(113,133,250,0.18)] sm:size-[112px] xl:size-[124px]">
            {avatar ? (
              <Image
                src={avatar}
                alt={name}
                fill
                sizes="124px"
                priority
                className="rounded-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center rounded-full bg-gradient-to-br from-[#7784C5] to-[#4F5581] text-[30px] font-bold text-white">
                {getInitials(name)}
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-[10px] xl:gap-[14px]">
            {/* 952:872 */}
            <h1 className="break-words text-[28px] font-normal capitalize leading-none text-[#191A2E] sm:text-[34px] xl:text-[38px]">
              {name}
            </h1>
            {role && (
              /* 952:878 */
              <p className="text-[15px] leading-[1.35] text-[#6B7280] sm:text-[17px] xl:text-[18px]">
                {role}, Akoode Technologies
              </p>
            )}
            {/* 952:882 */}
            <div className="flex flex-col items-start gap-[11px]">
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[7px] text-[14px] font-medium leading-[21px] text-[#7185FA] transition-opacity hover:opacity-80 xl:text-[15px]"
              >
                <Image
                  src="/blogs/linkedin-badge-lg.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="size-[18px] shrink-0"
                />
                LinkedIn
                <ExternalLink className="size-[16px] shrink-0" strokeWidth={1.8} aria-hidden />
              </a>
              {/* 952:899 — 40×2 accent rule */}
              <span aria-hidden className="h-[2px] w-[40px] rounded-[2px] bg-[#7185FA] opacity-60" />
            </div>
          </div>
        </div>

        {quote && (
          /* 967:904 — pull quote card */
          <figure className="w-full min-w-0 rounded-[14px] border-[1.66px] border-[#889AF5] px-[22px] py-[14px] sm:px-[34px] sm:py-[16px] lg:flex-1">
            {/* 967:905 — Georgia renders the STRAIGHT quote as the two tapered
                vertical strokes in the design; a curly &ldquo; is a different glyph. */}
            <span
              aria-hidden
              className="block h-[47px] font-[Georgia,'Times_New_Roman',serif] text-[54px] leading-[54px] text-[#889AF5]"
            >
              {'"'}
            </span>
            <blockquote className="break-words text-[16px] font-normal capitalize leading-[1.25] text-[#191A2E] sm:text-[17px] xl:text-[18px]">
              {quote}
            </blockquote>
          </figure>
        )}
      </div>

      {/* 970:930 / 970:932 — bio paragraphs */}
      {bioParagraphs.length > 0 && (
        <div className="flex flex-col">
          {bioParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-[15px] leading-[1.6] text-[#191A2E] sm:text-[16px] xl:text-[18px] xl:leading-[28.8px]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import resolveImageUrl from '@/utils/resolveImageUrl';

// "More Case Studies" — same card design as the live /case-study page, retuned
// to this page's theme (92rem container, two-tone heading, industries type scale).

const formatDate = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return 'Recent';
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

const stripHtml = (text) => {
  if (!text || typeof text !== 'string') return '';
  const pMatch = text.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (pMatch) {
    return pMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const noHeaders = text.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, ' ');
  return noHeaders.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const excerptWords = (text, maxWords = 20) => {
  const clean = stripHtml(text);
  if (!clean) return '';
  const words = clean.split(/\s+/).filter(Boolean);
  return words.length <= maxWords ? clean : `${words.slice(0, maxWords).join(' ')}...`;
};

export default function MoreCaseStudies({ caseStudies = [] }) {
  if (!Array.isArray(caseStudies) || caseStudies.length === 0) return null;

  return (
    <section className="bg-white py-[40px] md:py-[60px] font-figtree">
      <div className="mx-auto w-full max-w-[92rem] px-5 sm:px-8 lg:px-[clamp(1.5rem,3vw,3rem)]">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-[24px] font-bold capitalize leading-tight text-[#191A2E] sm:text-[28px] sm:leading-8">
            More <span style={{ color: '#7784C5' }}>Case Studies</span>
          </h2>
          <Link
            href="/case-studies"
            className="shrink-0 text-[14px] font-semibold text-[#7784C5] transition-colors duration-300 hover:text-[#5a5e9e]"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((item) => {
            const imageUrl =
              resolveImageUrl(item.casestudyimage) || '/images/case-study/default.jpg';
            const slug = item.slug || item._id || '#';
            const shortAbout = excerptWords(
              item.aboutdescription || item.shortdescription || item.metadescription || '',
              20
            );

            return (
              <div
                key={item._id ?? item.slug ?? item.id}
                className="group flex h-full flex-col"
              >
                <div className="relative h-[240px] shrink-0 overflow-hidden rounded-[8px]">
                  <Image
                    src={imageUrl}
                    alt={item.title || 'Case Study image'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-all duration-[400ms] group-hover:scale-110 group-hover:-rotate-[4deg] group-hover:grayscale"
                  />
                  <div
                    className="absolute left-1/2 top-1/2 z-[1] h-0 w-[200%]
                      -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-white/30
                      transition-all duration-[600ms]
                      group-hover:h-[250%] group-hover:bg-transparent"
                  />
                </div>

                <div
                  className="relative z-[2] -mt-[84px] mx-[16px] flex flex-1 flex-col rounded-[8px]
                    border border-[rgba(170,170,170,0.15)] bg-white p-6
                    shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                >
                  <h3 className="line-clamp-2 text-[16px] font-semibold leading-[1.45] text-[#191A2E] sm:text-[18px]">
                    <Link
                      href={`/case-studies/${slug}`}
                      className="transition-colors duration-300 hover:text-[#7784C5]"
                    >
                      {item.title || 'Case Study'}
                    </Link>
                  </h3>

                  {shortAbout && (
                    <>
                      <div className="h-[12px]" />
                      <p className="text-[13px] leading-[1.6] text-[#4A5565] sm:text-[14px]">
                        {shortAbout}
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

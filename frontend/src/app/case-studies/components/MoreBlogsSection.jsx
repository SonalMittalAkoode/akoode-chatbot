'use client';

import Link from 'next/link';
import Image from 'next/image';
import resolveImageUrl from '@/utils/resolveImageUrl';

const formatCaseStudyDate = (value) => {
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
    // Try to find the first paragraph content to avoid headers (like h5)
    const pMatch = text.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (pMatch) {
        return pMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    // Fallback: strip headers and then all tags
    const noHeaders = text.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, ' ');
    return noHeaders.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const excerptWords = (text, maxWords = 20) => {
    const cleanText = stripHtml(text);
    if (!cleanText) return '';
    const words = cleanText.split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return cleanText;
    return `${words.slice(0, maxWords).join(' ')}...`;
};

export default function MoreBlogsSection({ caseStudies = [] }) {
    if (!Array.isArray(caseStudies) || caseStudies.length === 0) {
        return null;
    }

    return (
        <section className="pt-[40px] pb-[30px] md:pt-[50px] bg-white">
            <div className="container mx-auto px-4 md:px-[70px]">
                <div className="flex items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-[24px] md:text-[30px] font-bold text-[#1a1a1a] mt-3">
                            More Case Studies
                        </h2>
                    </div>
                    <Link
                        href="/case-studies"
                        className="text-[14px] font-semibold text-[#474972] hover:text-[#2f3157] transition-colors duration-300"
                    >
                        View all
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {caseStudies.map((item) => {
                        const imageUrl = resolveImageUrl(item.casestudyimage) || '/images/case-study/default.jpg';
                        const slug = item.slug || item._id || '#';

                        const shortDescriptionRaw = item.shortdescription || '';
                        const aboutDescriptionRaw = item.aboutdescription || '';
                        const shortAbout = excerptWords(
                            aboutDescriptionRaw || shortDescriptionRaw || item.metadescription || '',
                            20
                        );

                        return (
                            <div key={item._id ?? item.slug ?? item.id} className="group">
                                <div className="relative h-[240px] rounded-[8px] overflow-hidden">
                                    <Image
                                        src={imageUrl}
                                        alt={item.title || 'Case Study image'}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition-all duration-[400ms] group-hover:scale-110 group-hover:-rotate-[4deg] group-hover:grayscale"
                                    />
                                    <div
                                        className="absolute left-1/2 top-1/2 w-[200%] h-0
                                            -translate-x-1/2 -translate-y-1/2 -rotate-45
                                            bg-white/30 z-[1]
                                            group-hover:h-[250%] group-hover:bg-transparent
                                            transition-all duration-[600ms]"
                                    />
                                </div>

                                <div
                                    className="relative z-[2] bg-white rounded-[8px] p-6
                                        border border-[rgba(170,170,170,0.15)]
                                        -mt-[84px] mx-[16px]
                                        shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                                >
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
                                            {formatCaseStudyDate(item.createdAt || item.updatedAt)}
                                        </span>
                                    </div>

                                    <div className="h-[16px]" />

                                    <h4 className="text-[17px] font-semibold text-[#1a1a1a] leading-[26px] line-clamp-2">
                                        <Link
                                            href={`/case-studies/${slug}`}
                                            className="hover:text-[#474972] transition-colors duration-300"
                                        >
                                            {item.title || 'Case Study'}
                                        </Link>
                                    </h4>

                                    {shortAbout && (
                                        <>
                                            <div className="h-[12px]" />
                                            <p className="text-[14px] text-gray-600 leading-[22px]">
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

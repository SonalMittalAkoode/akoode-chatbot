'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { Plus } from "lucide-react";
import resolveImageUrl from '@/utils/resolveImageUrl';
import { getCasestudyList } from '@/api/frontend/casestudy';

const excerptWords = (text, maxWords = 20) => {
    if (!text || typeof text !== 'string') return '';
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return text.trim();
    return `${words.slice(0, maxWords).join(' ')}...`;
};

/** Stable id for dedupe + keys: prefer Mongo _id, then slug. */
function caseStableId(item) {
    if (!item || typeof item !== 'object') return '';
    const id = item._id != null ? String(item._id) : '';
    if (id) return id;
    if (item.slug) return `slug:${String(item.slug)}`;
    return '';
}

/** Append incoming items without duplicate _id OR slug (avoids overlap from
 *  page/limit math, racing requests, or a legacy + latest record sharing a slug). */
function mergeUnique(existing, incoming) {
    const seenIds = new Set();
    const seenSlugs = new Set();
    for (const p of existing) {
        if (p?._id != null) seenIds.add(String(p._id));
        if (p?.slug) seenSlugs.add(String(p.slug));
    }
    const out = [...existing];
    for (const p of incoming) {
        const id = p?._id != null ? String(p._id) : '';
        const slug = p?.slug ? String(p.slug) : '';
        if ((id && seenIds.has(id)) || (slug && seenSlugs.has(slug))) continue;
        if (id) seenIds.add(id);
        if (slug) seenSlugs.add(slug);
        out.push(p);
    }
    return out;
}

export default function CaseStudyArea({ caseStudies = [], totalCaseStudies = 0 }) {
    const initial = Array.isArray(caseStudies) ? mergeUnique([], caseStudies) : [];
    const [displayed, setDisplayed] = useState(initial);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    /**
     * Initial server load: page=1, limit=6 → items 0–5.
     * "Load More" uses limit=3. skip=6 → (page-1)*3=6 → page=3 (page 2 with limit=3 would skip 3–5 and DUPLICATE part of the first 6).
     */
    const [nextPage, setNextPage] = useState(3);
    const loadGuardRef = useRef(false);

    const hasData = displayed.length > 0;
    const showButton = displayed.length < totalCaseStudies;

    const handleLoadMore = async () => {
        if (isLoadingMore || !showButton || loadGuardRef.current) return;
        loadGuardRef.current = true;
        setIsLoadingMore(true);
        try {
            const response = await getCasestudyList(nextPage, 3);
            const newItems = response?.data || [];
            if (newItems.length > 0) {
                setDisplayed((prev) => mergeUnique(prev, newItems));
                setNextPage((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Failed to load more case studies:", error);
        } finally {
            setIsLoadingMore(false);
            loadGuardRef.current = false;
        }
    };

    return (
        <div className="py-[50px] md:py-[70px] relative z-10 bg-[#f7f8fc]">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                    {hasData ? (
                        displayed.map((item) => {
                            const imageUrl = resolveImageUrl(item.casestudyimage) || '/images/case-study/default.jpg';
                            const logoUrl = resolveImageUrl(item.casestudylogo || item.logoimage || item.logo) || null;
                            const slug = item.slug || item._id || '#';
                            const shortDescriptionRaw = item.shortdescription || '';
                            const aboutDescriptionRaw = item.aboutdescription || '';
                            const shortDescription = shortDescriptionRaw.replace(/<[^>]*>/g, '').trim();
                            const shortAbout = excerptWords(
                                aboutDescriptionRaw.replace(/<[^>]*>/g, '').trim(),
                                20
                            );
                            const tagText = shortDescription || 'Case Study';

                            return (
                                <div key={caseStableId(item) || item.id} className="group mb-[20px]">
                                    <div className="relative h-[280px] rounded-[8px] overflow-hidden min-h-[220px] max-md:min-h-[200px]">
                                        <Image
                                            src={imageUrl}
                                            alt={item.title || 'Case Study'}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
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
                                            -mt-[100px] mx-[16px]
                                            shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                                    >
                                        <div>
                                            <span
                                                className="inline-flex max-w-full items-center gap-[6px]
                                                    bg-[rgba(111,105,247,0.2)] text-[#474972]
                                                    px-[10px] py-[6px] rounded-[4px]
                                                    text-[13px] font-medium leading-none"
                                            >
                                                <span className="line-clamp-1">{tagText}</span>
                                            </span>
                                        </div>

                                        <div className="h-[16px]" />

                                        {logoUrl ? (
                                            <div className="mb-[12px]">
                                                <Link href={`/case-studies/${slug}`} className="inline-block">
                                                    <Image
                                                        src={logoUrl}
                                                        alt={item.title || 'Logo'}
                                                        width={120}
                                                        height={40}
                                                        className="max-h-[40px] w-auto object-contain"
                                                    />
                                                </Link>
                                            </div>
                                        ) : null}

                                        <h4 className="text-[17px] font-semibold text-[#1a1a1a] leading-[26px] line-clamp-2">
                                            <Link
                                                href={`/case-studies/${slug}`}
                                                className="underline decoration-[#000000]/50 underline-offset-[3px] hover:no-underline hover:text-[#000000] transition-colors duration-300"
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
                        })
                    ) : (
                        <div className="col-span-full">
                            <div className="text-center py-10">
                                <p className="text-lg text-gray-500">No case studies available at the moment.</p>
                            </div>
                        </div>
                    )}
                </div>

                {showButton && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className="relative z-10 overflow-hidden inline-flex items-center justify-center gap-2 px-7 py-2 rounded-lg bg-white text-[#474972] font-bold border border-[#474972]/10 shadow-sm transition-all duration-400 cursor-pointer after:content-[''] after:absolute after:inset-y-0 after:left-1/2 after:-translate-x-1/2 after:w-[10px] after:bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] after:-z-10 after:opacity-0 after:transition-all after:duration-400 hover:text-white hover:after:w-full hover:after:rounded-lg hover:after:opacity-100"
                        >
                            {isLoadingMore ? "Loading..." : "Load More"} <Plus className="inline-block ml-1" size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

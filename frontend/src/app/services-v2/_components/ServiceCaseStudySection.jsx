'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';

const truncate = (s, max = 200) => {
  const t = String(s || '').replace(/<[^>]*>/g, '').trim();
  return t.length > max ? t.slice(0, max).replace(/\s+\S*$/, '') + '…' : t;
};

export default function ServiceCaseStudySection({ caseStudies, titleParts }) {
  const [idx, setIdx] = useState(0);
  const total = caseStudies.length;
  const cs = caseStudies[idx];

  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  return (
    <section className="w-full py-10 sm:py-14 lg:py-20 px-5 sm:px-8 md:px-16 lg:px-24 bg-white">

      {/* Header: centered title + mobile nav row below, desktop nav absolute right */}
      <div className="relative text-center mb-8 sm:mb-10">
        {titleParts?.length > 0 && (
          <h2 className="text-[22px] sm:text-[28px] lg:text-[34px] font-[400] font-[family-name:var(--font-figtree)] leading-[1.3] max-w-5xl mx-auto">
            {titleParts.map((part, i) => (
              <span key={i} style={{ color: part.purple ? '#7784C5' : '#191A2E' }}>
                {part.text}
              </span>
            ))}
          </h2>
        )}

        {/* Desktop nav — absolute right */}
        {total > 1 && (
          <div className="hidden lg:flex items-center gap-3 absolute right-0 top-1/2 -translate-y-1/2">
            <button onClick={prev} aria-label="Previous case study"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-[#7784C5] hover:text-white"
              style={{ border: '1.5px solid #C5CAE9', color: '#4F60B5' }}>
              <ChevronLeft size={16} />
            </button>
            <span className="text-[13px] font-[family-name:var(--font-figtree)]" style={{ color: '#7784C5' }}>
              {idx + 1} / {total}
            </span>
            <button onClick={next} aria-label="Next case study"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-[#7784C5] hover:text-white"
              style={{ border: '1.5px solid #C5CAE9', color: '#4F60B5' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Mobile nav — centered below title */}
        {total > 1 && (
          <div className="flex lg:hidden items-center justify-center gap-4 mt-5">
            <button onClick={prev} aria-label="Previous case study"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ border: '1.5px solid rgba(136,154,245,0.4)', color: '#7784C5' }}>
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1.5">
              {caseStudies.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} aria-label={`Case study ${i + 1}`}
                  className="transition-all duration-300 rounded-full"
                  style={{ width: i === idx ? 20 : 8, height: 8, background: i === idx ? '#7784C5' : 'rgba(119,132,197,0.35)' }}
                />
              ))}
            </div>
            <button onClick={next} aria-label="Next case study"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ border: '1.5px solid rgba(136,154,245,0.4)', color: '#7784C5' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Slider card */}
      <div
        className="overflow-hidden rounded-[20px] sm:rounded-[24px]"
        style={{ background: 'linear-gradient(160deg,#1D1F4B 0%,#131530 100%)', border: '1px solid rgba(136,154,245,0.18)', boxShadow: '0 24px 60px -12px rgba(30,34,90,0.18)' }}
      >
        <AnimatePresence mode="wait">
          <m.div
            key={idx}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            drag={total > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={total > 1 ? (_, { offset }) => { if (Math.abs(offset.x) > 50) offset.x > 0 ? prev() : next(); } : undefined}
            className="p-6 sm:p-8 md:p-12 flex flex-col lg:grid lg:grid-cols-[1.1fr_1fr] items-center gap-8 lg:gap-12"
          >
            {/* Image — top on mobile (order-1), right on desktop (order-2) */}
            <div className="order-1 lg:order-2 w-full">
              <div className="relative rounded-[16px] overflow-hidden w-full aspect-[16/10]"
                style={{ boxShadow: '0 16px 40px -12px rgba(0,0,0,0.45)' }}>
                <img
                  src={cs.image || '/industries_page/hero.png'}
                  alt={cs.title}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                />
              </div>
            </div>

            {/* Content — bottom on mobile (order-2), left on desktop (order-1) */}
            <div className="order-2 lg:order-1 text-center lg:text-left w-full">
              <div className="flex gap-2.5 flex-wrap mb-5 justify-center lg:justify-start">
                {cs.stat1Value && (
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide"
                    style={{ background: 'rgba(136,154,245,0.15)', color: '#889AF5', border: '1px solid rgba(136,154,245,0.25)' }}>
                    ↑ {cs.stat1Value} {cs.stat1Label}
                  </span>
                )}
                <span className="px-3.5 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase border border-[rgba(136,154,245,0.3)] text-[rgba(136,154,245,0.85)]">
                  {cs.industry}{cs.country ? ` — ${cs.country}` : ''}
                </span>
              </div>

              <h3 className="text-white text-[18px] sm:text-xl md:text-[24px] font-bold leading-[1.25] mb-3 sm:mb-4 font-[family-name:var(--font-figtree)]">
                {cs.title}
              </h3>
              <p className="text-white/60 text-[13px] sm:text-[14px] leading-relaxed font-[family-name:var(--font-figtree)]">
                {truncate(cs.shortdescription)}
              </p>

              <div className="grid grid-cols-2 gap-6 sm:gap-8 md:gap-12 mt-6 sm:mt-8">
                {[[cs.stat1Value, cs.stat1Label], [cs.stat2Value, cs.stat2Label]].map(([v, l], i) =>
                  v ? (
                    <div key={i}>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-none">{v}</div>
                      <div className="text-[10px] tracking-widest uppercase mt-2" style={{ color: 'rgba(136,154,245,0.85)' }}>{l}</div>
                    </div>
                  ) : null
                )}
              </div>

              <div className="mt-6 sm:mt-8 flex justify-center lg:justify-start">
                <Link
                  href={`/case-studies/${cs.slug}`}
                  className="inline-flex items-center gap-2 h-[44px] sm:h-[48px] px-5 sm:px-6 rounded-full text-white text-[13px] font-medium no-underline group transition-transform duration-300 hover:scale-[1.04] font-[family-name:var(--font-figtree)] capitalize"
                  style={{ background: 'linear-gradient(180deg,#7784c5 0%,#495074 50%,#4f5581 100%)', border: '1.5px solid #7683c5' }}
                >
                  Read the full case study
                  <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </m.div>
        </AnimatePresence>
      </div>

      {/* Desktop dots */}
      {total > 1 && (
        <div className="hidden lg:flex justify-center gap-2 mt-5">
          {caseStudies.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Case study ${i + 1}`}
              className="transition-all duration-300 rounded-full"
              style={{ width: i === idx ? 24 : 8, height: 8, background: i === idx ? '#7784C5' : 'rgba(119,132,197,0.3)' }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

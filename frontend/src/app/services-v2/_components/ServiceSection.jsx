'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import FeatureCard from './FeatureCard';

export default function ServiceSection({ service }) {
  return (
    <section id={service.id} className="py-10 sm:py-14 lg:py-24" style={{ background: '#F8FAFF' }}>
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-16 items-stretch">

          {/* Left: title + descriptions + CTA */}
          <div className="lg:w-[38%] shrink-0 flex flex-col">

            {/* All text content stacked */}
            <div className="flex flex-col gap-4 sm:gap-5 flex-1">
              <h2 className="text-[28px] sm:text-[34px] lg:text-[44px] font-[family-name:var(--font-figtree)] font-[400] capitalize leading-[1.15]">
                {service.titleParts.map((part, i) => (
                  <span key={i} style={{ color: part.purple ? '#7784C5' : '#191A2E' }}>
                    {part.text}
                  </span>
                ))}
              </h2>

              {/* Editorial subtitle */}
              {service.subtitle && (
                <p className="text-[#191A2E] text-[15px] lg:text-[16px] font-[family-name:var(--font-figtree)] font-[400] leading-[1.65]">
                  {service.subtitle}
                </p>
              )}

              {/* Editorial divider block */}
              {service.dividerDesc && (
                <div className="hidden sm:flex gap-4">
                  <div className="w-[4px] shrink-0 rounded-full self-stretch" style={{ background: '#8C98D3' }} />
                  <p className="text-[#191A2E] text-[13px] sm:text-[14px] lg:text-[15px] font-[family-name:var(--font-figtree)] font-[400] leading-[1.65]">
                    {service.dividerDesc}
                  </p>
                </div>
              )}

              {/* API description — fills remaining left-column height so no gap before CTA */}
              {service.apiDesc && (
                <p className="hidden sm:block text-[#191A2E]/65 text-[13px] lg:text-[14px] font-[family-name:var(--font-figtree)] font-[400] leading-[1.7] mt-1">
                  {service.apiDesc}
                </p>
              )}
            </div>

            {/* CTA — sits directly after content, aligned to card-grid bottom on lg */}
            <div className="lg:mt-auto pt-6 sm:pt-7">
              <Link
                href={service.ctaLink || '/services'}
                className="flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 rounded-full text-white text-[15px] sm:text-[16px] font-[family-name:var(--font-figtree)] font-[500] leading-6 transition-opacity hover:opacity-90 capitalize"
                style={{ background: 'linear-gradient(135deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)' }}
              >
                {service.ctaLabel}
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right: children service cards */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:auto-rows-fr">
            {service.features.map((feat) => (
              <FeatureCard key={feat.title} {...feat} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

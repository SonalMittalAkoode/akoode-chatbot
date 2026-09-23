'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import TrustBadge from './TrustBadge';
import { TRUST_BADGES } from '../_helpers';

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden flex flex-col"
      style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #1F2336 0%, #130F25 100%)' }}
    >
      {/* Orbs — desktop */}
      <div className="pointer-events-none absolute hidden sm:block"
        style={{ width: 880, height: 880, left: -480, top: -260, borderRadius: 1440, background: 'linear-gradient(180deg, rgba(113,134,250,0) 46%, #7186FA 77%, #4F5581 100%)', filter: 'blur(80px)', opacity: 0.55 }} />
      <div className="pointer-events-none absolute hidden sm:block"
        style={{ width: 880, height: 880, right: -480, top: -260, borderRadius: 1440, background: 'linear-gradient(180deg, rgba(113,134,250,0) 46%, #7186FA 77%, #4F5581 100%)', filter: 'blur(80px)', opacity: 0.45 }} />
      {/* Orbs — mobile */}
      <div className="pointer-events-none absolute sm:hidden"
        style={{ width: 340, height: 340, left: -160, top: -100, borderRadius: 999, background: 'radial-gradient(circle, #7186FA 0%, transparent 70%)', filter: 'blur(60px)', opacity: 0.35 }} />
      <div className="pointer-events-none absolute sm:hidden"
        style={{ width: 300, height: 300, right: -120, top: -80, borderRadius: 999, background: 'radial-gradient(circle, #7186FA 0%, transparent 70%)', filter: 'blur(60px)', opacity: 0.3 }} />

      {/* Centre content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 sm:px-8 lg:px-20 pt-24 sm:pt-28 pb-6">
        <h1 className="max-w-[820px] text-[28px] sm:text-[36px] lg:text-[44px] font-[family-name:var(--font-figtree)] font-[400] capitalize leading-[1.15] mb-4 tracking-[-0.3px]">
          <span className="text-white">End-To-End Technology Services That Turn Business Complexity Into </span>
          <span style={{ color: '#7784C5' }}>Competitive Advantage</span>
        </h1>

        <p className="max-w-[600px] text-white/75 text-[14px] sm:text-[15px] lg:text-[17px] font-[family-name:var(--font-figtree)] font-[400] leading-[1.6] mb-8 px-1">
          From AI and deep learning to full-stack software, mobile apps and eCommerce — Akoode builds the technology systems that help B2B companies move faster, scale smarter, and stay ahead of the competition.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/case-studies"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white text-[15px] sm:text-[16px] font-[family-name:var(--font-figtree)] font-[500] leading-6 transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)' }}
          >
            See What We Build
            <ChevronRight size={16} />
          </Link>
          <Link
            href="/contact-us"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white text-[15px] sm:text-[16px] font-[family-name:var(--font-figtree)] font-[500] leading-6 transition-colors hover:bg-white/5"
            style={{ background: 'rgba(16,18,40,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            Talk to a Strategist
          </Link>
        </div>
      </div>

      {/* Trust badges */}
      <div className="relative z-10 w-full pb-5 px-5 sm:px-8 lg:px-20">
        <div className="rounded-2xl px-4 sm:px-6 lg:px-10 py-4 sm:py-5"
          style={{ background: 'linear-gradient(180deg, rgba(22,26,48,0.97) 0%, rgba(16,12,32,0.97) 100%)', border: '1.5px solid rgba(113,134,250,0.25)', backdropFilter: 'blur(16px)', boxShadow: '0 0 40px rgba(113,134,250,0.06)' }}>
          {/* Mobile: compact stacked */}
          <div className="flex sm:hidden gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-between">
            {TRUST_BADGES.map((b) => <TrustBadge key={b.title} {...b} compact />)}
          </div>
          {/* Desktop: full row */}
          <div className="hidden sm:flex items-center justify-between gap-4">
            {TRUST_BADGES.map((b, i) => (
              <div key={b.title} className="flex items-center gap-3 flex-1">
                <TrustBadge {...b} />
                {i < TRUST_BADGES.length - 1 && (
                  <div className="hidden xl:block w-px h-10 ml-auto shrink-0" style={{ background: 'rgba(113,134,250,0.2)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

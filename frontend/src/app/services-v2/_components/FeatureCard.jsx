'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FeatureCard({ Icon, title, desc, href }) {
  const cardStyle = { background: 'linear-gradient(160deg, #232847 0%, #1A1F3A 100%)' };
  const cardCls   = 'rounded-2xl p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 h-full transition-transform duration-300 hover:-translate-y-0.5';

  const inner = (
    <>
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#2E3460' }}>
          <Icon size={18} color="#8B9FE8" strokeWidth={1.7} />
        </div>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#ffffff' }}>
          <ArrowRight size={12} color="#1A1F3A" strokeWidth={2.2} style={{ transform: 'rotate(-45deg)' }} />
        </div>
      </div>
      <div>
        <h3 className="text-white text-[13px] sm:text-[15px] font-[family-name:var(--font-figtree)] font-[600] leading-[20px] sm:leading-[22px] mb-1 sm:mb-1.5">
          {title}
        </h3>
        <p className="text-white/55 text-[11px] sm:text-[12px] font-[family-name:var(--font-figtree)] font-[400] leading-[17px] sm:leading-[19px]">
          {desc}
        </p>
      </div>
    </>
  );

  if (href) {
    return <Link href={href} className={cardCls + ' no-underline block'} style={cardStyle}>{inner}</Link>;
  }
  return <div className={cardCls} style={cardStyle}>{inner}</div>;
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Brain, Code2, Layers, Monitor, Smartphone, ShoppingCart } from 'lucide-react';

const COUNTRY_CARDS = [
  {
    flagSrc: '/services_svg/united_states.svg',
    flagAlt: 'US flag',
    country: 'United States',
    cities: 'New York · San Francisco · Austin · Boston',
    desc: 'Our US-facing teams support businesses from New York to San Francisco - delivering technology solutions calibrated to American enterprise expectations. Fast delivery cycles, clear ownership, and communication across EST/PST time zones. ',
    services: [
      { Icon: Code2, label: 'Software Development\nCompany USA' },
      { Icon: Brain, label: 'AI Development\nServices New York' },
      { Icon: Smartphone, label: 'Mobile App\nDevelopment USA' },
      { Icon: Monitor, label: 'Web Development\nUSA' },
      { Icon: ShoppingCart, label: 'eCommerce\nDevelopment USA' },
      { Icon: Layers, label: 'SaaS Development\nCompany USA' },
    ],
  },
  {
    flagSrc: '/services_svg/united-kingdom.svg',
    flagAlt: 'UK flag',
    country: 'United Kingdom',
    cities: 'London · Manchester · Birmingham · Leeds · Edinburgh',
    desc: 'We work with UK businesses to deliver technology solutions that meet GDPR standards, UK compliance requirements, and the delivery rigour that British enterprise expects. Our UK-facing teams operate on GMT/BST hours for real-time collaboration. ',
    services: [
      { Icon: Code2, label: 'Software Development\nCompany UK', href: '/uk/software-development-company' },
      { Icon: Brain, label: 'Software Development\nCompany London', href: '/uk/london/software-development-company' },
      { Icon: Smartphone, label: 'Software Development Company\n`Manchester', href: '/uk/manchester/software-development-company' },
      { Icon: Monitor, label: 'Web Development\nLondon' },
      { Icon: ShoppingCart, label: 'eCommerce\nDevelopment UK' },
      { Icon: Layers, label: 'SaaS Development\nCompany UK' },
    ],
  },
];

function WorldMap() {
  return (
    <div className="relative w-full h-full min-h-[180px] sm:min-h-[260px] lg:min-h-[320px] flex items-center justify-center overflow-hidden rounded-2xl"
      style={{ background: '#F0F2FF' }}>
      <Image
        src="/map.webp"
        alt="World map"
        fill
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="object-contain"
      />
    </div>
  );
}

export default function GlobalPresenceSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-20">

        {/* Text + map */}
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-16 items-center mb-8 sm:mb-12">
          <div className="lg:w-[42%] shrink-0 flex flex-col gap-4 sm:gap-6">
            <h2 className="text-[26px] sm:text-[34px] lg:text-[44px] font-[family-name:var(--font-figtree)] font-[400] leading-[1.15]">
              <span className="text-[#191A2E]">We Work With Clients Across The </span>
              <span style={{ color: '#7784C5' }}>UK, US &amp; Beyond</span>
            </h2>
            <p className="text-[#191A2E] text-[15px] lg:text-[17px] font-[family-name:var(--font-figtree)] font-[400] leading-[1.65]">
              Our technology teams are built for international delivery - remote-first, documentation-heavy, and tuned to the communication expectations of UK and US enterprise clients. We understand local market dynamics, regulatory requirements, and what 'on time' actually means. 
            </p>
            <div className="flex gap-4">
              <div className="w-[4px] shrink-0 rounded-full self-stretch" style={{ background: '#8C98D3' }} />
              <p className="text-[#191A2E] text-[13px] sm:text-[14px] lg:text-[15px] font-[family-name:var(--font-figtree)] font-[400] leading-[1.65]">
                Your website is your highest-traffic salesperson. We build custom websites, web applications, and full-stack platforms engineered for speed, scalability, and conversion — from marketing sites that rank to enterprise web apps that handle millions of users.
              </p>
            </div>
          </div>
          <div className="w-full lg:flex-1 rounded-2xl overflow-hidden" style={{ background: '#F0F2FF', minHeight: 220 }}>
            <WorldMap />
          </div>
        </div>

        {/* Country cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {COUNTRY_CARDS.map((card) => (
            <div key={card.country} className="rounded-2xl flex flex-col"
              style={{ background: 'linear-gradient(160deg, #2A3060 0%, #222850 50%, #1C2245 100%)', border: '1px solid rgba(113,134,250,0.2)', padding: 'clamp(20px, 4vw, 40px)' }}>
              <div className="flex flex-col gap-3 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <img src={card.flagSrc} alt={card.flagAlt} className="w-8 h-8 sm:w-9 sm:h-9 rounded-md object-contain"
                    style={{ background: 'rgba(255,255,255,0.1)', padding: 4 }} />
                  <h3 className="text-white text-[20px] sm:text-[24px] font-[family-name:var(--font-figtree)] font-[600] leading-tight">
                    {card.country}
                  </h3>
                </div>
                <p className="text-[#8B98B8] text-[12px] sm:text-[13px] font-[family-name:var(--font-figtree)] font-[400] tracking-wide">
                  {card.cities}
                </p>
                <p className="text-white/75 text-[13px] sm:text-[15px] font-[family-name:var(--font-figtree)] font-[400] leading-[1.7]">
                  {card.desc}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6">
                {card.services.map((s) => {
                  const iconBox = (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
                      style={{ background: 'rgba(255,255,255,0.92)' }}>
                      <s.Icon size={14} color="#2A3060" strokeWidth={2} />
                    </div>
                  );
                  return s.href ? (
                    <Link key={s.label} href={s.href} className="flex items-start gap-2 sm:gap-3 group">
                      {iconBox}
                      <span className="text-white/85 text-[12px] sm:text-[13px] font-[family-name:var(--font-figtree)] font-[400] leading-[1.5] whitespace-pre-line group-hover:text-white transition-colors underline underline-offset-2 decoration-white/40 group-hover:decoration-white/80">
                        {s.label}
                      </span>
                    </Link>
                  ) : (
                    <div key={s.label} className="flex items-start gap-2 sm:gap-3">
                      {iconBox}
                      <span className="text-white/85 text-[12px] sm:text-[13px] font-[family-name:var(--font-figtree)] font-[400] leading-[1.5] whitespace-pre-line">
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

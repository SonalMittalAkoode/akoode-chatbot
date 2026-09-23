'use client';

import { useEffect, useRef, useState } from 'react';

export default function CategoryPillNav({ navRef, sections, activeId, onTabClick, visible = true }) {
  const trackRef = useRef(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const checkOverflow = () => {
      setOverflowing(track.scrollWidth > track.clientWidth + 1);
    };

    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(track);
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      ref={navRef}
      className={`sticky top-[56px] z-[900] transition-all duration-300 md:top-[64px] ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
      style={{ background: 'linear-gradient(180deg, #1D2033 0%, #1A0F2E 100%)' }}
    >
      <div className="mx-auto max-w-[1400px] px-4 py-3 sm:py-4">
        <span className="mb-2.5 block text-center text-[11px] font-semibold uppercase tracking-wide text-white/50 sm:mb-3 sm:text-[12px]">
          Browse by category
        </span>
        <div
          ref={trackRef}
          className={`flex items-center gap-2 sm:gap-3 ${
            overflowing
              ? 'snap-x snap-mandatory overflow-x-auto pb-1 justify-start'
              : 'flex-wrap justify-center overflow-visible'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onTabClick(section.id)}
                className={`shrink-0 rounded-full whitespace-nowrap px-3 py-2 text-center text-[13px] font-[500] leading-[1.5] text-white transition-all sm:px-4 sm:py-2.5 sm:text-[14px] lg:text-[15px] ${
                  overflowing ? 'snap-start' : ''
                }`}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #8B9FE8 0%, #6679E4 40%, #576099 100%)'
                    : 'linear-gradient(135deg, #3A4066 0%, #2A3055 50%, #1D2033 100%)',
                  border: isActive
                    ? '1px solid rgba(180,190,237,0.4)'
                    : '1px solid rgba(113,134,250,0.2)',
                  boxShadow: isActive ? '0 0 16px rgba(102,121,228,0.3)' : 'none',
                }}
              >
                {section.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

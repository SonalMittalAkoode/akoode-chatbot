'use client';

import { useEffect, useRef, useState } from 'react';

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState('');
  const navRef = useRef(null);
  const itemRefs = useRef({});

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0% -60% 0%', threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    if (!activeId) return;
    const activeEl = itemRefs.current[activeId];
    const navEl = navRef.current;
    if (!activeEl || !navEl) return;

    const navRect = navEl.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();
    if (itemRect.top < navRect.top || itemRect.bottom > navRect.bottom) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeId]);

  if (!headings.length) return null;

  return (
    <div className="w-full rounded-[12px] overflow-hidden border border-[#d8daf0] shadow-sm" style={{ background: '#eff1ff' }}>

      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-[#d0d3ee]">
        <div className="flex items-center gap-[10px]">
          <div className="flex flex-col justify-center gap-[4px] shrink-0">
            <span className="block w-[16px] h-[2px] rounded-full bg-[#474972]/60" />
            <span className="block w-[10px] h-[2px] rounded-full bg-[#474972]/35" />
            <span className="block w-[16px] h-[2px] rounded-full bg-[#474972]/60" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#474972] leading-none">
            Table of Contents
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav ref={navRef} className="toc-nav px-3 py-3 max-h-[240px] overflow-y-auto">
        <ul className="flex flex-col gap-[2px]">
          {headings.map(({ id, text }, index) => {
            const isActive = activeId === id;
            return (
              <li key={id} ref={(el) => { itemRefs.current[id] = el; }}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(id);
                    if (el) {
                      const offset = 90;
                      const top = el.getBoundingClientRect().top + window.scrollY - offset;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                    setActiveId(id);
                  }}
                  className={[
                    'group flex items-start gap-3 pl-3 pr-2 py-[9px] rounded-[8px] transition-all duration-200',
                    isActive
                      ? 'bg-[#474972]/10 border-l-[3px] border-[#474972]'
                      : 'border-l-[3px] border-transparent hover:bg-[#474972]/6 hover:border-[#474972]/30',
                  ].join(' ')}
                >
                  {/* Number badge */}
                  <span
                    className={[
                      'shrink-0 mt-[1px] w-[20px] h-[20px] rounded-full flex items-center justify-center text-[10px] font-bold transition-colors duration-200',
                      isActive
                        ? 'bg-[#474972] text-white'
                        : 'bg-[#474972]/15 text-[#474972]/70 group-hover:bg-[#474972]/25 group-hover:text-[#474972]',
                    ].join(' ')}
                  >
                    {index + 1}
                  </span>

                  {/* Heading text */}
                  <span
                    className={[
                      'text-[12.5px] leading-[1.5] line-clamp-2 transition-colors duration-200',
                      isActive
                        ? 'text-[#474972] font-semibold'
                        : 'text-[#333333]/70 group-hover:text-[#333333]',
                    ].join(' ')}
                  >
                    {text}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom accent */}
      <div
        className="h-[3px]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #47497240 30%, #47497299 50%, #47497240 70%, transparent 100%)',
        }}
      />
    </div>
  );
}

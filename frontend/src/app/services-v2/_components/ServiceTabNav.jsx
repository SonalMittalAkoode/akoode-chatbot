'use client';

export default function ServiceTabNav({ navRef, sections, activeId, navStuck, navVisible = true, onTabClick }) {
  return (
    <nav
      ref={navRef}
      className={`sticky top-[56px] md:top-[64px] z-[990] transition-all duration-300 ${
        navVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-[150%] pointer-events-none'
      }`}
      style={{
        background: 'linear-gradient(180deg, #1D2033 0%, #1A0F2E 100%)',
        backdropFilter: 'blur(16px)',
        boxShadow: navStuck ? '0 4px 32px rgba(0,0,0,0.5)' : 'none',
        borderBottom: navStuck ? '1px solid rgba(113,134,250,0.12)' : 'none',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
        <div className="relative">
          {/* Right fade hint on mobile */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:hidden z-10"
            style={{ background: 'linear-gradient(to left, #1A0F2E 0%, transparent 100%)' }} />
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-[14px] sm:py-[18px] w-full">
            {sections.map((s) => {
              const isActive = activeId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onTabClick(s.id)}
                  className="shrink-0 sm:flex-1 text-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[13px] sm:text-[14px] lg:text-[15px] font-[family-name:var(--font-figtree)] font-[500] leading-[1.5] transition-all whitespace-nowrap"
                  style={{
                    color: '#fff',
                    background: isActive
                      ? 'linear-gradient(135deg, #8B9FE8 0%, #6679E4 40%, #576099 100%)'
                      : 'linear-gradient(135deg, #3A4066 0%, #2A3055 50%, #1D2033 100%)',
                    border: isActive
                      ? '1px solid rgba(180,190,237,0.4)'
                      : '1px solid rgba(113,134,250,0.2)',
                    boxShadow: isActive ? '0 0 16px rgba(102,121,228,0.3)' : 'none',
                  }}
                >
                  {s.tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

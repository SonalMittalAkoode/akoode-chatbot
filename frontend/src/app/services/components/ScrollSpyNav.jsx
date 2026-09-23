'use client';
 
import React, { useEffect, useState } from 'react';
 
export default function ScrollSpyNav({ sections = [] }) {
  const [activeSection, setActiveSection] = useState(sections.length > 0 ? sections[0]?.id : '');
 
  useEffect(() => {
    if (sections.length === 0) return;
 
    // Throttle scroll handler to reduce forced reflows
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 100;
 
          // Batch all layout reads together
          sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setActiveSection(section.id);
              }
            }
          });
          ticking = false
        })
        ticking = true
      }
    };
 
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);
 
  const handleNavClick = (sectionId, e) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
 
  // Don't render if no sections
  if (!sections || sections.length === 0) {
    return null;
  }
 
  return (
    <div className="sticky top-[60px] z-[50] bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm font-figtree">
      <nav
        id="nav-scrollspy"
        className="container mx-auto px-[2rem] flex items-center justify-start md:justify-center gap-8 md:gap-12 py-4 overflow-x-auto flex-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {sections.map((section, index) => {
          if (!section || !section.id || !section.title) return null;
          const isActive = activeSection === section.id;
          return (
            <a
              key={section.id || `section-${index}`}
              href={`#${section.id}`}
              onClick={(e) => handleNavClick(section.id, e)}
              className={`relative py-2 shrink-0 text-[13px] font-medium uppercase tracking-widest transition-all duration-300 ${isActive
                ? "text-[#010225] after:w-full"
                : "text-[#6c757d] hover:text-[#010225] after:w-0"
                } after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#474972] after:transition-all after:duration-300`}
            >
              {section.title}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
 
 
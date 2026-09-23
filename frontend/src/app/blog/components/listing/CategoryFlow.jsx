'use client';

import { useEffect, useRef, useState } from 'react';
import CategoryPillNav from './CategoryPillNav';
import CategorySection from './CategorySection';
import CategorySectionDark from './CategorySectionDark';

/** Wires the sticky CategoryPillNav to the 8 alternating light/dark category sections
 *  below it via scroll-spy (IntersectionObserver) + smooth-scroll, the same pattern
 *  services-v2's ServicesPageClient uses for its ServiceTabNav. */
export default function CategoryFlow({ sections }) {
  const [activeId, setActiveId] = useState(sections[0]?.id || '');
  const [navVisible, setNavVisible] = useState(true);
  const navRef = useRef(null);

  useEffect(() => {
    if (!sections.length) return;
    const sectionEls = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);
    if (!sectionEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }),
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    if (!sections.length) return;
    const lastEl = document.getElementById(sections[sections.length - 1].id);
    if (!lastEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setNavVisible(!scrolledPast);
      },
      { threshold: 0 }
    );
    observer.observe(lastEl);
    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const headerHeight = typeof window !== 'undefined' && window.innerWidth >= 768 ? 64 : 56;
    const offset = (navRef.current?.offsetHeight ?? 60) + headerHeight;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset - 16, behavior: 'smooth' });
  };

  return (
    <>
      <CategoryPillNav
        navRef={navRef}
        sections={sections}
        activeId={activeId}
        onTabClick={scrollToSection}
        visible={navVisible}
      />

      {sections.map((section) => {
        const SectionComponent = section.theme === 'dark' ? CategorySectionDark : CategorySection;
        return (
          <SectionComponent
            key={section.id}
            id={section.id}
            posts={section.posts}
            heading={section.heading}
            headingAccent={section.headingAccent}
            subtitle={section.subtitle}
            viewAllHref={`/blog/category/${section.id}`}
          />
        );
      })}
    </>
  );
}

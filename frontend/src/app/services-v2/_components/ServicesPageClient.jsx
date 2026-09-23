'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import NavBar from '@/components/NavBarClient';
import Footer from '@/components/Footer';
import SubscribeForm from '@/components/SubscribeForm';
import { Engagement } from '@/app/country/_components/Engagement';
import FinalCTA from '@/components/FinalCTA';
import '@/app/country/_components/sbc.css';
import '@/app/services-v2/services-v2.css';
import {
  getCachedServices, getCachedServicesStale,
  setCachedServices, isCacheStale,
} from '@/utils/servicesCache';
import {
  getCachedCaseStudies, getCachedCaseStudiesStale,
  setCachedCaseStudies, isCaseStudiesCacheStale,
} from '@/utils/caseStudiesCache';

import HeroSection from './HeroSection';
import ServiceTabNav from './ServiceTabNav';
import ServiceSection from './ServiceSection';
import ServiceCaseStudySection from './ServiceCaseStudySection';
import GlobalPresenceSection from './GlobalPresenceSection';
import { buildSections } from '../_helpers';

export default function ServicesPageClient() {

  // ── API data ───────────────────────────────────────────────────────────────
  const [servicesData, setServicesData] = useState(() => getCachedServicesStale() || []);
  const [caseStudiesData, setCaseStudiesData] = useState(() => getCachedCaseStudiesStale() || []);

  useEffect(() => {
    const cached = getCachedServices();
    if (cached?.length) { setServicesData(cached); return; }
    if (!isCacheStale()) return;
    const BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? '').replace(/\/$/, '');
    fetch(`${BASE}/api/services`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (Array.isArray(data) && data.length) { setCachedServices(data); setServicesData(data); } })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const cached = getCachedCaseStudies();
    if (cached?.length) { setCaseStudiesData(cached); return; }
    if (!isCaseStudiesCacheStale()) return;
    const BASE = process.env.NEXT_PUBLIC_FRONTEND_API_URL ?? '';
    fetch(`${BASE}api/casestudy/list`)
      .then((r) => r.ok ? r.json() : null)
      .then((res) => {
        let items = [];
        if (res?.status === 'success' && Array.isArray(res.data)) items = res.data;
        else if (Array.isArray(res?.data)) items = res.data;
        else if (Array.isArray(res)) items = res;
        if (items.length) { setCachedCaseStudies(items); setCaseStudiesData(items); }
      })
      .catch(() => {});
  }, []);

  // ── Build sections ─────────────────────────────────────────────────────────
  const allSections = useMemo(() => buildSections(servicesData, caseStudiesData), [servicesData, caseStudiesData]);

  // ── Navigation state ───────────────────────────────────────────────────────
  const [activeId, setActiveId] = useState('');
  const [navStuck, setNavStuck] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const navRef = useRef(null);

  // Scroll-spy: re-observe when sections change (API load)
  useEffect(() => {
    if (!allSections.length) return;
    if (!activeId) setActiveId(allSections[0].id);

    const sectionEls = allSections.map((s) => document.getElementById(s.id));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }),
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sectionEls.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [allSections]);

  // Sticky nav shadow
  useEffect(() => {
    const sentinel = document.getElementById('nav-sentinel');
    if (!sentinel) return;
    const obs = new IntersectionObserver(([e]) => setNavStuck(!e.isIntersecting), { threshold: 1 });
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  // Hide the sticky tab nav once the last service section (Digital Marketing) is
  // scrolled past and out of view; show it again when scrolling back up into it.
  useEffect(() => {
    if (!allSections.length) return;
    const sentinel = document.getElementById('services-end-sentinel');
    if (!sentinel) return;
    const headerHeight = typeof window !== 'undefined' && window.innerWidth >= 768 ? 64 : 56;
    const navHeight = navRef.current?.offsetHeight ?? 60;
    const line = headerHeight + navHeight;
    // Visible while the sentinel sits below the sticky-nav line; hidden only once it
    // scrolls above (i.e. Digital Marketing has been scrolled up and out of view).
    const obs = new IntersectionObserver(
      ([e]) => setNavVisible(e.boundingClientRect.top > line),
      { rootMargin: `-${line}px 0px 0px 0px`, threshold: 0 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [allSections]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Account for the fixed header (56px mobile / 64px desktop) plus the sticky tab nav height
    const headerHeight = typeof window !== 'undefined' && window.innerWidth >= 768 ? 64 : 56;
    const offset = (navRef.current?.offsetHeight ?? 60) + headerHeight;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset - 16, behavior: 'smooth' });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <NavBar />

      <HeroSection />

      <div id="nav-sentinel" className="h-px" />

      <ServiceTabNav
        navRef={navRef}
        sections={allSections}
        activeId={activeId}
        navStuck={navStuck}
        navVisible={navVisible}
        onTabClick={scrollToSection}
      />

      {allSections.map((service) => (
        <div key={service.id}>
          <ServiceSection service={service} />
          {service.caseStudies?.length > 0 && (
            <ServiceCaseStudySection caseStudies={service.caseStudies} titleParts={service.caseStudyTitleParts} />
          )}
        </div>
      ))}

      <div id="services-end-sentinel" aria-hidden className="h-0" />

      <GlobalPresenceSection />

      {/* Engagement */}
      <div className="services-v2-engagement">
        <Engagement />
      </div>

      {/* Final CTA */}
      <div className="services-v2-finalcta">
        <FinalCTA
          variant="dark"
          service="Services Page Enquiry"
          data={{
            eyebrow: 'Start Your Project',
            heading: "Let's Build Something That Performs",
            subtitle: "Tell us what you're building. A senior engineer — not an account manager — will reply within thirty working minutes.",
          }}
        />
      </div>

      <SubscribeForm />
      <Footer />
    </>
  );
}

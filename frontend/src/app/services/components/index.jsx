
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import About5SectionArea from './About5SectionArea';
import Service1SectionArea from './Service1SectionArea';
// import EnterpriseSolutionSection from './EnterpriseSolutionSection';
import Team1SectionArea from './Team1SectionArea';
import TechnologySectionArea from './TechnologySectionArea';
import Industry1SectionArea from './Industry1SectionArea';
// import CRMSolutionSection from './CRMSolutionSection';
import ScrollSpyNav from './ScrollSpyNav';
import CustomSoftwareSection from './CustomSoftwareSection';
import ServiceSection from './ServiceSection';
import Faq5SectionArea from './Faq5SectionArea';
import PeopleSectionArea from './PeopleSectionArea';
import WhatWeOfferSectionArea from './WhatWeOfferSectionArea';
import { ChevronRight } from "lucide-react";

import SubscribeForm from '@/components/SubscribeForm';
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const buildAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
    "";
  if (!base) {
    return path.startsWith("/") ? path : `/${path}`;
  }
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

const normalizeBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  if (typeof value === "number") return value === 1;
  return fallback;
};

export default function ServicePage({ service }) {

  const rawHeroTitle = service?.title ?? 'Best Metaverse Development Company';
  const heroHighlight = service?.project && service.project !== rawHeroTitle ? service.project : '';
  const heroDescription = service?.description ?? '';

  const normalizeHTML = (html) => {
    if (!html) return "";
    return String(html).replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
  };

  const hasHtml = (value) => {
    if (!value) return false;
    const v = String(value);
    return v.includes("<") || v.includes("&lt;");
  };

  const GRADIENT_SPAN_CLASS =
    "text-transparent bg-clip-text bg-[linear-gradient(to_right,#2A2B44_0%,#4A5175_25%,#00F6FF_50%,#4A5175_75%,#2A2B44_100%)] bg-[length:200%_auto] animate-text-shine";

  const applyGradientToNonEmptySpans = (html) => {
    if (!html) return "";
    const raw = String(html);

    return raw.replace(/<span\b([^>]*)>([\s\S]*?)<\/span>/gi, (full, attrs = "", inner = "") => {
      const innerText = String(inner)
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;|&#160;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

      // Only apply gradient if span actually has visible text.
      if (!innerText) return full;

      // If a class attribute exists, append; otherwise add a class attribute.
      if (/\bclass\s*=/.test(attrs)) {
        return `<span${attrs.replace(
          /\bclass\s*=\s*(['"])([\s\S]*?)\1/i,
          (m, q, existing) => {
            const next = existing.includes("animate-text-shine")
              ? existing
              : `${existing} ${GRADIENT_SPAN_CLASS}`.trim();
            return `class=${q}${next}${q}`;
          }
        )}>${inner}</span>`;
      }

      return `<span${attrs} class="${GRADIENT_SPAN_CLASS}">${inner}</span>`;
    });
  };

  // Only apply styling if admin explicitly provides HTML in the title.
  // If it's plain text, render as plain text (no automatic gradient span).
  const heroTitleHtml = hasHtml(rawHeroTitle)
    ? applyGradientToNonEmptySpans(normalizeHTML(rawHeroTitle))
    : "";

  const aboutTag = service?.abouttag;
  const aboutHeading = service?.abouttitle || service?.resultstitle || service?.servicetitle || heroTitle;
  const aboutDescription = service?.aboutdescription;
  const aboutSecondary = service?.resultsdescription;
  const aboutImage = buildAssetUrl(service?.aboutimage);

  // Check if about section has content (title, description, or image)
  const hasAboutContent = () => {
    const hasTitle = (service?.abouttitle || service?.resultstitle || service?.servicetitle || '').toString().trim() !== '';
    const hasDescription = (service?.aboutdescription || '').toString().trim() !== '';
    const hasImage = (service?.aboutimage || '').toString().trim() !== '';
    return hasTitle || hasDescription || hasImage;
  };

  const showAboutSection = hasAboutContent();

  const showServicesSection = normalizeBoolean(
    service?.serviceshow,
    Array.isArray(service?.servicestep) && service.servicestep.length > 0
  );

  const showWhatWeOfferSection = normalizeBoolean(
    service?.whatweofferhow,
    Array.isArray(service?.whatweofferstep) && service.whatweofferstep.length > 0
  );

  const hasTechnologyContent = () => {
    if (Array.isArray(service?.technologystep) && service.technologystep.length > 0) return true;
    const t = service || {};
    return !!(t.frontendtechnologytitle || t.frontendtechnologydescription || t.backendtechnologytitle || t.backendtechnologydescription || t.databasetechnologytitle || t.databasetechnologydescription);
  };
  const showTechnologySection = normalizeBoolean(
    service?.frontendtechnologyhow || service?.backendtechnologyhow || service?.databasetechnologyhow,
    hasTechnologyContent()
  );

  const showIndustrySection = normalizeBoolean(
    service?.industryhow,
    Array.isArray(service?.industrystep) && service.industrystep.length > 0
  );

  const hasTeamContent = (service?.teamServicesTitle || service?.teamServicesSubTitle || service?.teamServicesDescription || '').toString().trim() !== '';
  const showTeamSection = normalizeBoolean(service?.teamServiceshow, hasTeamContent);

  const hasPeopleContent = (service?.peopletitle || service?.peopledescription || service?.peopleimage || '').toString().trim() !== '';
  const showPeopleSection = normalizeBoolean(service?.peoplehow, hasPeopleContent);

  const showScrollSpyNav = normalizeBoolean(
    service?.scrollSpyNavShow,
    Array.isArray(service?.scrollSpyNavSections) && service.scrollSpyNavSections.length > 0
  );

  const hasCustomSoftwareContent = Array.isArray(service?.customSoftwareSteps) && service.customSoftwareSteps.length > 0;
  const showCustomSoftwareSection = normalizeBoolean(service?.customSoftwareShow, hasCustomSoftwareContent);

  const hasServiceSectionContent = ((service?.serviceSectionTitle || '').toString().trim() !== '' || (service?.serviceSectionDescription || '').toString().trim() !== '');
  const showServiceSection = normalizeBoolean(service?.serviceSectionShow, hasServiceSectionContent);

  // Filter out sections that don't have valid data
  const filteredScrollSpySections = Array.isArray(service?.scrollSpyNavSections)
    ? service.scrollSpyNavSections.filter(section => {
      // Only filter out invalid sections (missing id or title)
      if (!section || !section.id || !section.title) return false;
      return true;
    })
    : [];

  return (
    <>

      <NavBar />

      <div
        className="relative z-[1] overflow-hidden pt-[120px] pb-[60px] md:pt-[138px] md:pb-[76px]"
        style={{
          backgroundImage: "url('/inner-bg.webp')",
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="container mx-auto px-[2rem]">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl md:text-[42px] font-semibold mb-4 md:mb-6 font-sans text-white">
              {heroTitleHtml ? (
                <span dangerouslySetInnerHTML={{ __html: processHtmlLinks(heroTitleHtml) }} />
              ) : (
                rawHeroTitle
              )}
            </h1>
            <p className="text-[14px] md:text-[18px] text-white/90">
              <a href="/" className="text-[14px] md:text-[18px] text-white hover:text-[#a8a6ff] transition-colors duration-400">Home</a>
              <ChevronRight className="mx-2 text-[10px] inline-block align-middle" size={12} strokeWidth={3} />{" "}
              <a href="/services" className="text-[14px] md:text-[18px] text-white hover:text-[#a8a6ff] transition-colors duration-400">Services</a>
              <ChevronRight className="mx-2 text-[10px] inline-block align-middle" size={12} strokeWidth={3} />{" "}
              <span className="text-white font-semibold" dangerouslySetInnerHTML={{ __html: processHtmlLinks(heroHighlight) }} />
            </p>
          </div>
        </div>
      </div>

      {showServiceSection && (
        <ServiceSection service={service} />
      )}


      {showScrollSpyNav && filteredScrollSpySections.length > 0 && (
        <ScrollSpyNav sections={filteredScrollSpySections} />
      )}

      {showCustomSoftwareSection && (
        <CustomSoftwareSection service={service} />
      )}

      {showAboutSection && (
        <About5SectionArea
          tag={aboutTag}
          heading={aboutHeading}
          description={aboutDescription}
          secondaryDescription={aboutSecondary}
          image={aboutImage}
          imageAlt={service?.aboutimagealt}
        />
      )}




      {showServicesSection && (
        <Service1SectionArea
          eyebrow={service?.title}
          heading={service?.servicetitle}
          description={service?.servicedescription}
          steps={service?.servicestep}
        />
      )}

      {showTeamSection && (
        <Team1SectionArea
          eyebrow={service?.teamServicesTitle || "Our Team"}
          heading={service?.teamServicesSubTitle}
          description={service?.teamServicesDescription}
          features={[]}
        />
      )}
      {showWhatWeOfferSection && (
        <WhatWeOfferSectionArea
          eyebrow={service?.whatweoffertitle}
          heading={service?.whatweofferdescription}
          features={service?.whatweofferstep}
        />
      )}

      {showTechnologySection && (
        <TechnologySectionArea service={service} />
      )}

      {showIndustrySection && (
        <Industry1SectionArea
          heading={service?.industrytitle}
          description={service?.industrydescription}
          steps={service?.industrystep}
        />
      )}

      {showPeopleSection && (
        <PeopleSectionArea
          heading={service?.peopletitle}
          description={service?.peopledescription}
          image={buildAssetUrl(service?.peopleimage)}
          imageAlt={service?.peopleimagealt}
          listItems={[]}
        />
      )}

      <Faq5SectionArea faqs={service?.faqs} />

      <SubscribeForm />
      <Footer />
    </>
  );
}
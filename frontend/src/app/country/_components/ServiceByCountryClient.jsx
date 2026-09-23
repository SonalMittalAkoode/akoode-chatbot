"use client";

import { useEffect, useRef } from "react";
import NavBar from "@/components/NavBarClient";
import Footer from "@/components/Footer";
import SubscribeForm from "@/components/SubscribeForm";
import Hero from "./Hero";
import TrustSection from "./TrustSection";
import { WhyGurugram as WhyLocation } from "./WhyLocation";
import { CitiesMap } from "./CitiesMap";
import { ServicesWeOffer } from "./ServicesWeOffer";
import { Process } from "./Process";
import { TechStack } from "./TechStack";
import { CaseStudies } from "./CaseStudies";
import Testimonial from "@/sections/Testimonials";
import IndustriesSection from "./IndustriesSection";
import { Engagement } from "./Engagement";
import { FAQ } from "./FAQ";
import { Blog } from "./Blog";
import FinalCTA from "@/components/FinalCTA";
import { splitTitle } from "./shared";
import "./sbc.css";
import WhyChoose from "./WhyChooseAkoode";
import { normalizeTemplate, usesV2Sections } from "@/config/pageTemplates";


import MadLocationHero from "./mad/MadLocationHero";
import EcomLocationHero from "./ecom/EcomLocationHero";
import AiLocationHero from "./ai/AiLocationHero";
// import EcomServices from "./ecom/EcomServices"; // parked — see the "process" render block below
import MadTechnologies from "@/app/services-v2/mobile-app-development/components/MadTechnologies";
import MadCaseStudies from "@/app/services-v2/mobile-app-development/components/MadCaseStudies";
import MadIndustries from "@/app/services-v2/mobile-app-development/components/MadIndustries";
import TestimonialsSection from "@/app/services-v2/_components/TestimonialsSection";

const HERO_BY_TEMPLATE = {
  "mobile-app-development": MadLocationHero,
  "ecommerce-development": EcomLocationHero,
  "ai-development": AiLocationHero,
};

const MARKET_ISO = {
  uk: "GB", gb: "GB",
  us: "US", usa: "US",
  au: "AU", australia: "AU",
  ca: "CA", canada: "CA",
  ae: "AE", uae: "AE", dubai: "AE",
  sg: "SG", singapore: "SG",
  de: "DE", germany: "DE",
  fr: "FR", france: "FR",
  nl: "NL", netherlands: "NL",
  nz: "NZ", newzealand: "NZ",
  ie: "IE", ireland: "IE",
  in: "IN", india: "IN",
};
const marketIso = (market) => {
  const countrySegment = (market || "").toLowerCase().split("/")[0];
  return MARKET_ISO[countrySegment] ?? "IN";
};
// import { CookieConsent } from "@/components/CookieConsent";

function NarrativeThread() {
  const fillRef = useRef(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const p = Math.max(0, Math.min(1, window.scrollY / max));
        if (fillRef.current) fillRef.current.style.height = p * 100 + "%";
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div className="sbc-thread" aria-hidden="true">
      <div ref={fillRef} className="sbc-thread__fill" />
    </div>
  );
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));

    const observedRv = new WeakSet();
    const ioRv = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
            ioRv.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    const observeRv = () => {
      document.querySelectorAll("[data-rv], .reveal:not(.in)").forEach((el) => {
        if (observedRv.has(el)) return;
        observedRv.add(el);
        if (el.classList.contains("reveal")) {
          io.observe(el);
        } else {
          ioRv.observe(el);
        }
      });
    };
    observeRv();
    const mo = new MutationObserver(observeRv);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      ioRv.disconnect();
      mo.disconnect();
    };
  });
}

const stripHtml = (s) => String(s || "").replace(/<[^>]*>/g, "").trim();

function toMadTechData(techStack) {
  if (!techStack) return null;
  return {
    heading: techStack.heading,
    intro: stripHtml(techStack.subtitle),
    tabs: (techStack.cats || []).map((cat) => ({
      label: cat.title,
      logos: (cat.pills || []).map((p) => ({
        label: p.label,
        img: p.img || p.imgExisting || "",
      })),
    })),
  };
}

function toMadCaseStudiesData(caseStudies) {
  if (!caseStudies) return null;
  return {
    heading: caseStudies.heading,
    headingAccent: undefined, 
    intro: stripHtml(caseStudies.subtitle),
  };
}

function toMadIndustriesData(industries) {
  if (!industries) return null;
  return {
    heading: industries.heading,
   
    headingAccent: industries.headingAccent || undefined,
    intro: stripHtml(industries.subtitle),
    items: (industries.items || []).map((ind) => ({
      name: ind.name,
      // Pages authored on the default template store a bullet list (`points`)
      // rather than `sub`, so fall back to joining those into sentences.
      desc: ind.sub
        ? ind.sub
        : ind.points?.length
          ? ind.points.join(". ") + (ind.points.length > 1 ? "." : "")
          : "",
      image: ind.iconImg || ind.iconImgExisting || null,
      href: ind.ctaLink || null,
      icon: ind.icon || "Heart",
    })),
  };
}

export default function ServiceByCountryClient({ data = null, parentPage = null }) {
  useReveal();
  const show = (section) => !data || data[section]?.show !== false;
  const showFlat = (key) => !data || data[key] !== false;

  // Single source of truth, shared with the four SBC admin forms so the
  // editor can never offer fields this page will not render.
  const template = normalizeTemplate(data?.template);
  const isV2 = usesV2Sections(template);
  const TemplateHero = HERO_BY_TEMPLATE[template];

  return (
    <>
      <NavBar />
      <div className="sbc-page">
        <NarrativeThread />

        {show("hero") && (
          TemplateHero
            ? <TemplateHero data={data?.hero} title={data?.title} country={data?.country} parentPage={parentPage} />
            : <Hero data={data?.hero} title={data?.title} country={data?.country} parentPage={parentPage} />
        )}
        {show("chooseUs") && <TrustSection data={data?.chooseUs} />}
        {show("whyLocation") && <WhyLocation data={data?.whyLocation} />}

        {!isV2 && data?.citiesMap?.show === true && (
          <CitiesMap
            data={data.citiesMap}
            market={data?.market}
            slug={data?.slug}
          />
        )}
        {show("process") && (
          // EcomServices (the custom Figma "service section" build) is parked
          // for now — see the commented branch below — while its layout is
          // reworked. The ecommerce template borrows the MAD services section
          // as-is in the meantime, same as the mobile-app-development template.
          // template === "ecommerce-development"
          //   ? <EcomServices data={data?.process} />
          //   :
          <ServicesWeOffer data={data?.process} variant={isV2 ? "mad" : "default"} />
        )}
        {show("whatWeDo") && <Process data={data?.whatWeDo} />}

        {show("techStack") && (
          isV2
            ? <MadTechnologies data={toMadTechData(data?.techStack)} />
            : <TechStack data={data?.techStack} />
        )}

        {showFlat("caseStudiesShow") && (() => {
          const dynamicCases = [];
          if (data?.caseStudies?.featuredCase) dynamicCases.push(data.caseStudies.featuredCase);
          if (data?.caseStudies?.otherCases) dynamicCases.push(...(data.caseStudies.otherCases || []));
          return isV2
            ? <MadCaseStudies data={toMadCaseStudiesData(data?.caseStudies)} caseStudies={dynamicCases} />
            : <CaseStudies data={data?.caseStudies} />;
        })()}

        {showFlat("testimonialsShow") && (
          isV2
            ? <TestimonialsSection data={data?.testimonials} />
            : <Testimonial hideBadge={true} data={data?.testimonials} />
        )}

        {show("industries") && (
          isV2
            ? <MadIndustries data={toMadIndustriesData(data?.industries)} />
            : <IndustriesSection data={data?.industries} />
        )}

        {show("whyChoose") && <WhyChoose data={data?.whyChoose} />}
        {show("engagement") && <Engagement data={data?.engagement} />}
        {show("faq") && <FAQ data={data?.faq} />}
        {showFlat("blogShow") && <Blog data={data?.blog} />}
        {show("finalCta") && (() => {
          const { main, accent, suffix } = splitTitle(data?.finalCta?.heading || "Start your project");
          return (
            <FinalCTA
              variant="dark"
              defaultCountryIso={marketIso(data?.market)}
              service={data?.title || "Service by country"}
              pageContext={{
                pageType: "country-service",
                market:   data?.market   || "",
                slug:     data?.slug     || "",
                country:  data?.country  || "",
              }}
              data={{
                eyebrow: data?.finalCta?.eyebrow,
                heading: main,
                headingAccent: accent,
                headingTail: suffix,
                subtitle:
                  data?.finalCta?.body ||
                  data?.finalCta?.subtitle ||
                  "Tell us what you're building. A senior engineer (not an account manager) will reply within thirty working minutes.",
              }}
            />
          );
        })()}
      </div>
      <SubscribeForm blendWithSbc />
      <Footer />
      {/* <CookieConsent /> */}
    </>
  );
}

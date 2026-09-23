"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import resolveImageUrl from "@/utils/resolveImageUrl";

// Bundled public assets pass through untouched; CMS uploads (relative paths)
// are served from the API origin via resolveImageUrl.
const LOCAL_PREFIXES = [
  "/mobile-app/", "/tech_stacks/", "/software_development/", "/industries/",
  "/badge/", "/strip/", "/whyus_badge/", "/testimonials/",
];
const resolveAsset = (src) => {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  if (LOCAL_PREFIXES.some((p) => src.startsWith(p))) return src;
  return resolveImageUrl(src);
};

// Static preview content — shown when the CMS record has no testimonials yet.
const SAMPLE_QUOTE =
  '"Akoode Technologies has done a fantastic job developing a custom web application for my global real estate firm. What really stood out was their deep research and data integration for different countries and cities, which added huge value to our platform. The design is modern, sleek, and user-friendly. From start to finish, their team was professional, supportive, and highly skilled. Yes, the pricing is slightly on the higher side, but the quality, speed, and long-term results make it completely worth it."';
const DEFAULT_ITEMS = [
  { quote: SAMPLE_QUOTE, name: "Ankit Goyal", designation: "Founder & CEO", company: "WeGrow InfraVentures", mediaType: "none" },
  { quote: SAMPLE_QUOTE, name: "Ankit Goyal", designation: "Founder & CEO", company: "WeGrow InfraVentures", mediaType: "portrait", image: "/software_development/hero.png" },
  { quote: SAMPLE_QUOTE, name: "Ankit Goyal", designation: "Founder & CEO", company: "WeGrow InfraVentures", mediaType: "landscape", image: "/software_development/hero.png" },
];

const stripHtml = (html) => String(html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

// ── Shared bits ───────────────────────────────────────────────────────────────
const QuoteGlyph = ({ size = 120 }) => (
  <span
    aria-hidden
    className="block select-none leading-none"
    style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#1D1F4B", fontSize: size, lineHeight: 0.8 }}
  >
    &ldquo;
  </span>
);

const Dots = ({ count, active, onPick, style = {}, className = "" }) => (
  <div className={className} style={{ display: "flex", alignItems: "center", gap: 12, ...style }}>
    {Array.from({ length: count }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onPick(i)}
        aria-label={`Go to testimonial ${i + 1}`}
        className="flex min-h-[28px] items-center justify-center"
        style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0 }}
      >
        <span
          aria-hidden
          className="block h-3 rounded-full transition-all duration-300"
          style={{ width: i === active ? 26 : 12, background: i === active ? "#1D1F4B" : "#D1D5DB" }}
        />
      </button>
    ))}
  </div>
);

// Quote text — shared typography across all three layouts.
const QuoteText = ({ children, className = "" }) => (
  <p
    className={className}
    style={{ fontFamily: "var(--font-figtree), Inter, sans-serif", fontWeight: 400, fontSize: 15, lineHeight: 1.8, color: "#1D1F4B" }}
  >
    {children}
  </p>
);

const Name = ({ children }) => (
  <div style={{ fontFamily: "var(--font-figtree), Inter, sans-serif", fontWeight: 700, fontSize: 20, lineHeight: 1.2, color: "#1D1F4B" }}>{children}</div>
);
const Company = ({ children }) => (
  <div style={{ fontFamily: "var(--font-figtree), Inter, sans-serif", fontWeight: 600, fontSize: 16, lineHeight: 1.3, color: "#1D1F4B" }}>{children}</div>
);
const Designation = ({ children }) => (
  <div style={{ fontFamily: "var(--font-figtree), Inter, sans-serif", fontWeight: 500, fontSize: 14, color: "#6B7280" }}>{children}</div>
);
const Divider = ({ style = {}, className = "" }) => (
  <span className={`block h-1 w-[60px] rounded-full ${className}`} style={{ background: "#1D1F4B", ...style }} />
);

const MediaThumb = ({ item, orientation }) => {
  const [playing, setPlaying] = useState(false);
  const src = resolveAsset(item.image);
  const aspect = orientation === "portrait" ? "aspect-[9/14]" : "aspect-[3/2]";
  const wrap = orientation === "portrait" ? "max-w-[360px] w-full mx-auto" : "w-full";
  const hasEmbed = Boolean(item.embedCode && item.embedCode.trim());

  return (
    <div
      className={`group relative ${aspect} overflow-hidden rounded-[20px] ${wrap} [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full`}
      style={{ background: "#E4E8FF" }}
    >
      {playing && hasEmbed ? (
        <div className="absolute inset-0" dangerouslySetInnerHTML={{ __html: item.embedCode }} />
      ) : (
        <>
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={item.imageAlt || item.name || "Client testimonial"} className="absolute inset-0 h-full w-full object-cover" />
          )}
          <button
            type="button"
            onClick={() => hasEmbed && setPlaying(true)}
            aria-label="Play video testimonial"
            className={`absolute inset-0 flex items-center justify-center ${hasEmbed ? "cursor-pointer" : "cursor-default"}`}
            disabled={!hasEmbed}
          >
            <span
              className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full transition-transform group-hover:scale-105"
              style={{ background: "#1D1F4B", boxShadow: "0 0 0 10px rgba(79,107,255,0.12)" }}
            >
              <Play size={26} className="ml-1 text-white" fill="white" />
            </span>
          </button>
        </>
      )}
    </div>
  );
};

export default function TestimonialsSection({ data, centerDotsOnMobile = false }) {
  const heading = data?.heading || "What Our Client Says";
  const dotsAlign = centerDotsOnMobile ? "justify-center sm:justify-start" : "";
  const headingWords = heading.trim().split(/\s+/);
  const headingLead = headingWords.slice(0, -2).join(" ");
  const headingAccent = headingWords.slice(-2).join(" ");
  const items = (Array.isArray(data?.items) && data.items.length ? data.items : DEFAULT_ITEMS)
    .filter((t) => t && t.quote && t.quote.trim());
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!items.length) return null;
  const item = items[active % items.length];
  const orientation = item.mediaType === "portrait" ? "portrait" : "landscape";
  // Video / media testimonials disabled — force the text-only layout.
  const hasMedia = false; // item.mediaType === "portrait" || item.mediaType === "landscape";

  return (
    <section className="py-16 sm:py-20 lg:py-24" style={{ background: "#F8FAFF" }}>

      <div className="sr-only" aria-hidden="true">
        {items.map((t, i) => (
          <blockquote key={`seo-${i}`}>
            <p>{stripHtml(t.quote)}</p>
            {(t.name || t.company) && <cite>{[t.name, t.company, t.designation].filter(Boolean).join(", ")}</cite>}
          </blockquote>
        ))}
      </div>

      <div className="mx-auto max-w-[1280px] px-4">
        <m.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10 text-center font-bold"
          style={{
            color: "#1D1F4B",
            fontFamily: "var(--font-figtree), Inter, sans-serif",
            fontSize: 26,
            fontWeight: 700,
            lineHeight: 1.25,
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          {headingLead && <>{headingLead} </>}
          <span
            style={{
              backgroundImage: "linear-gradient(90deg, #7784C5 0%, #B7BEED 50%, #6077EC 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {headingAccent}
          </span>
        </m.h2>

        <AnimatePresence mode="wait">
          <m.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            {!hasMedia ? (
              /* ── Variant 1: text-only ────────────────────────────────── */
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 40 }}>
                {/* Left: quote box */}
                <div style={{ position: "relative", flex: "1 1 420px", minWidth: 0 }}>
                  <div
                    style={{
                      borderRadius: 20,
                      paddingLeft: 48,
                      paddingRight: 28,
                      paddingTop: 64,
                      paddingBottom: 36,
                      border: "3px solid #1D1F4B",
                    }}
                  >
                    <QuoteText>{item.quote}</QuoteText>
                  </div>
                  {/* Quote glyph sits in a notch on the top border */}
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      zIndex: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      transform: "translateY(-33%)",
                      paddingLeft: 12,
                      paddingRight: 12,
                      background: "#F8FAFF",
                    }}
                  >
                    <span style={{ display: "block", transform: "translateY(0.28em)" }}>
                      <QuoteGlyph size={80} />
                    </span>
                  </span>
                </div>
                {/* Right: name panel */}
                <div
                  style={{
                    flex: isMobile ? "1 1 100%" : "0 0 260px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: isMobile ? "center" : "flex-start",
                    textAlign: isMobile ? "center" : "left",
                  }}
                >
                  <Name>{item.name}</Name>
                  {item.designation && <Designation>{item.designation}</Designation>}
                  {item.company && <Company>{item.company}</Company>}
                  <Divider style={{ margin: isMobile ? "16px auto 0" : "16px 0 0" }} />
                  <Dots
                    count={items.length}
                    active={active}
                    onPick={setActive}
                    style={{ justifyContent: isMobile ? "center" : "flex-start", marginTop: 24 }}
                  />
                </div>
              </div>
            ) : (
              /* ── Variants 2 & 3: portrait / landscape media ──────────── */
              <div className={`grid items-center gap-8 lg:gap-14 ${orientation === "portrait" ? "lg:grid-cols-[minmax(0,380px)_1fr]" : "lg:grid-cols-[1.15fr_1fr]"}`}>
                <MediaThumb item={item} orientation={orientation} />
                <div className="flex flex-col lg:border-l-[3px] lg:pl-8 xl:pl-12" style={{ borderColor: "#96A6F6" }}>
                  <QuoteGlyph size={72} />
                  <QuoteText className="mt-2">{item.quote}</QuoteText>
                  <Divider className="mt-7" />
                  <div className="mt-5 flex flex-col gap-1.5">
                    <Name>{item.name}</Name>
                    {item.company && <Company>{item.company}</Company>}
                    {item.designation && <Designation>{item.designation}</Designation>}
                  </div>
                  <Dots count={items.length} active={active} onPick={setActive} className={`mt-7 ${dotsAlign}`} />
                </div>
              </div>
            )}
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

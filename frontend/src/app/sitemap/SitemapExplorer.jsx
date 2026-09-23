"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Search } from "lucide-react";

// Each item counts as a page; a parent with children counts itself plus each child.
const countPages = (items) =>
  items.reduce((sum, it) => sum + 1 + (it.children?.length || 0), 0);

export default function SitemapExplorer({ sections }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const isFiltering = q.length > 0;

  let total = 0;
  const visible = sections
    .map((sec, i) => {
      let items = sec.items;
      if (isFiltering) {
        items = sec.items
          .map((it) => {
            const parentMatch = it.label.toLowerCase().includes(q);
            const matchedChildren = (it.children || []).filter((c) =>
              c.label.toLowerCase().includes(q)
            );
            if (!parentMatch && matchedChildren.length === 0) return null;
            return { ...it, children: parentMatch ? it.children : matchedChildren };
          })
          .filter(Boolean);
      }
      const itemCount = countPages(items);
      total += itemCount;
      return {
        ...sec,
        num: String(i + 1).padStart(2, "0"),
        matched: items,
        countLabel:
          (isFiltering ? `${itemCount} of ${countPages(sec.items)}` : itemCount) +
          ` page${itemCount === 1 ? "" : "s"}`,
      };
    })
    .filter((sec) => sec.matched.length > 0);

  return (
    <div className="min-h-screen bg-[#EEF0F8] font-figtree text-[#2E2F62]">
      {/* Shared gradient def so lucide icons can render with the site brand
          gradient via stroke="url(#akoode-icon-gradient)" instead of a flat color. */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="akoode-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#474972" />
            <stop offset="100%" stopColor="#585c9c" />
          </linearGradient>
        </defs>
      </svg>
      {/* ── Hero + search ── */}
      <section className="relative overflow-hidden px-6 pt-[clamp(110px,10vw,132px)] pb-[clamp(36px,6vw,64px)] [background:radial-gradient(900px_420px_at_50%_-140px,rgba(90,95,240,.14),rgba(139,92,246,.05)_55%,transparent_75%)]">
        <div className="mx-auto max-w-[860px] text-center">
          <div className="mb-[18px] text-xs font-semibold uppercase tracking-[0.42em] text-[#5A5FF0]">
            Sitemap
          </div>
          <h1 className="mb-4 text-[clamp(32px,5.2vw,56px)] font-bold leading-[1.12] text-[#2E2F62] [text-wrap:balance]">
            Find your way around{" "}
            <span className="bg-[linear-gradient(90deg,#7784C5_3%,#B7BEED_30%,#6077EC_50%,#7683C5_100%),linear-gradient(90deg,#C1C4D1_0%,#00116A_100%)] bg-clip-text text-transparent">
              Akoode
            </span>
          </h1>
          <p className="mx-auto mb-[30px] max-w-[560px] text-[clamp(14px,1.6vw,16.5px)] leading-[1.65] text-[#6B6D9C] [text-wrap:pretty]">
            Every page on our site, organized by category — services,
            industries, case studies, careers, and more.
          </p>
          <div className="relative mx-auto max-w-[520px]">
            <Search
              size={19}
              strokeWidth={2.5}
              stroke="url(#akoode-icon-gradient)"
              className="pointer-events-none absolute left-[18px] top-1/2 -translate-y-1/2"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages… e.g. “Blockchain” or “Healthcare”"
              className="w-full rounded-full border border-[#5A5FF0]/20 bg-white py-4 pl-[50px] pr-5 text-[14.5px] text-[#2E2F62] shadow-[0_6px_24px_rgba(46,48,98,.08)] outline-none placeholder:text-[#9698BC] focus:border-[#5A5FF0] focus:shadow-[0_6px_24px_rgba(90,95,240,.22)]"
            />
          </div>
          {isFiltering && (
            <div className="mt-[14px] text-[13px] text-[#6B6D9C]">
              {total} page{total === 1 ? "" : "s"} found across{" "}
              {visible.length} categor{visible.length === 1 ? "y" : "ies"}
            </div>
          )}
        </div>
      </section>

      {/* ── Sections ── */}
      <main className="mx-auto max-w-[1320px] px-6 pb-[clamp(40px,6vw,72px)]">
        {visible.map((sec) => (
          <section
            key={sec.title}
            className="flex flex-wrap gap-x-12 gap-y-7 border-t border-[#2E3062]/10 py-[clamp(28px,4vw,44px)]"
          >
            <div className="min-w-[230px] max-w-[340px] flex-[1_1_250px]">
              <div className="flex items-baseline gap-3">
                <span className="text-[13px] font-semibold tabular-nums text-[#9B6BFA]">
                  {sec.num}
                </span>
                <h2 className="m-0 text-[clamp(20px,2.4vw,25px)] font-semibold text-[#2E2F62]">
                  {sec.title}
                </h2>
              </div>
              <span className="mt-3 inline-flex rounded-full bg-[#5A5FF0]/10 px-3 py-1 text-xs font-semibold text-[#5A5FF0]">
                {sec.countLabel}
              </span>
              <p className="mt-3 text-[13.5px] leading-[1.6] text-[#6B6D9C] [text-wrap:pretty]">
                {sec.desc}
              </p>
            </div>
            <div className="flex-[3_1_460px]">
              {sec.title === "Locations We Serve" ? (
                <LocationsSection items={sec.matched} />
              ) : (
                <div className="grid content-start gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(228px,1fr))]">
                  {sec.matched.map((item, idx) =>
                    item.children?.length > 0 ? (
                      <ServiceItem
                        key={`${item.href}-${idx}`}
                        item={item}
                        forceOpen={isFiltering}
                      />
                    ) : (
                      <Link
                        key={`${item.href}-${idx}`}
                        href={item.href}
                        className="flex min-h-[44px] items-center justify-between gap-2.5 rounded-xl border border-[#2E3062]/5 bg-white/55 px-4 py-2.5 text-sm font-medium leading-[1.4] text-[#3C3E75] transition-all duration-200 hover:-translate-y-px hover:border-[#5A5FF0]/35 hover:bg-white hover:text-[#5A5FF0] hover:shadow-[0_6px_18px_rgba(90,95,240,.14)]"
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight size={16} strokeWidth={2.5} stroke="url(#akoode-icon-gradient)" className="flex-none" />
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          </section>
        ))}

        {isFiltering && total === 0 && (
          <div className="border-t border-[#2E3062]/10 px-5 py-[70px] text-center">
            <Search size={34} strokeWidth={2} stroke="url(#akoode-icon-gradient)" className="mx-auto mb-3" />
            <div className="mb-1.5 text-[17px] font-semibold text-[#2E2F62]">
              No pages match “{query}”
            </div>
            <div className="text-sm text-[#6B6D9C]">
              Try a shorter keyword, or clear the search to browse all
              categories.
            </div>
          </div>
        )}
      </main>

      {/* ── CTA banner ── */}
      <section className="mx-auto max-w-[1320px] px-6 pb-[clamp(40px,6vw,72px)]">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-[linear-gradient(120deg,#33355E_0%,#2B2C50_60%,#3A2E63_100%)] p-[clamp(24px,5vw,56px)] shadow-[0_18px_48px_rgba(30,31,70,.28)] md:px-[clamp(24px,5vw,64px)]">
          <div className="flex-[1_1_320px]">
            <h2 className="mb-2.5 text-[clamp(22px,3vw,30px)] font-semibold text-white [text-wrap:balance]">
              Can’t find what you’re looking for?
            </h2>
            <p className="max-w-[480px] text-[14.5px] leading-[1.6] text-[#B9BBDD] [text-wrap:pretty]">
              Tell us about your project and our team will point you in the
              right direction within one business day.
            </p>
          </div>
          <div className="flex flex-wrap gap-3.5">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5A5FF0] to-[#8B5CF6] px-7 py-3.5 text-[14.5px] font-semibold text-white shadow-[0_6px_20px_rgba(90,95,240,.45)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_10px_26px_rgba(90,95,240,.6)]"
            >
              Contact Us <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceItem({ item, forceOpen }) {
  const [open, setOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const containerRef = useRef(null);
  const closeTimer = useRef(null);
  const isOpen = open || forceOpen;

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const onChange = (e) => setCanHover(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };
  useEffect(() => () => cancelClose(), []);

  // Safety net: close on any click/tap outside this card, and on Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const hoverHandlers = canHover
    ? {
        onMouseEnter: () => {
          cancelClose();
          setOpen(true);
        },
        onMouseLeave: scheduleClose,
      }
    : {};

  return (
    <div ref={containerRef} className="relative" {...hoverHandlers}>
      <div
        className={`relative z-10 flex min-h-[44px] items-center gap-1 rounded-xl border bg-white pr-1.5 transition-colors duration-200 ${
          isOpen
            ? "border-[#5A5FF0]/35 shadow-[0_10px_28px_rgba(90,95,240,.16)]"
            : "border-[#2E3062]/5 bg-white/55 hover:border-[#5A5FF0]/35 hover:bg-white"
        }`}
      >
        <Link
          href={item.href}
          className="flex min-w-0 flex-1 items-center justify-between gap-2.5 px-4 py-2.5 text-sm font-medium leading-[1.4] text-[#3C3E75] hover:text-[#5A5FF0]"
        >
          <span className="truncate">{item.label}</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
          className="flex flex-none items-center justify-center rounded-lg p-1.5 hover:bg-[#5A5FF0]/10"
        >
          <ChevronDown
            size={15}
            stroke="url(#akoode-icon-gradient)"
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      {/*
        Always rendered (not `isOpen && …`) so every child-service link is
        present in the server-rendered HTML for crawlers to find, even
        though it's visually collapsed until expanded. `hidden` toggles
        `display:none` only for sighted/interactive use — screen readers and
        crawlers still see the underlying anchors and hrefs in the markup.
      */}
      <div
        aria-hidden={!isOpen}
        className={`absolute left-0 right-0 top-[calc(100%+6px)] z-20 flex flex-col gap-0.5 rounded-xl border border-[#2E3062]/8 bg-white p-2 shadow-[0_16px_40px_rgba(46,48,98,.18)] ${
          isOpen ? "" : "hidden"
        }`}
      >
        {item.children.map((child, idx) => (
          <Link
            key={`${child.href}-${idx}`}
            href={child.href}
            tabIndex={isOpen ? 0 : -1}
            onClick={() => setOpen(false)}
            className="rounded-lg px-2.5 py-1.5 text-[13px] leading-snug text-[#6B6D9C] transition-colors duration-150 hover:bg-[#5A5FF0]/10 hover:text-[#5A5FF0]"
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function LocationsSection({ items }) {
  const [mode, setMode] = useState("countries");
  const [panelOpen, setPanelOpen] = useState(false);
  const containerRef = useRef(null);

  const countryItems = items.filter((it) => !it.city);
  const cityItems = items.filter((it) => it.city);

  const options = [
    { value: "countries", label: "Countries", count: countryItems.length },
    { value: "cities", label: "Cities", count: cityItems.length },
  ];
  const current = options.find((o) => o.value === mode);

  useEffect(() => {
    if (!panelOpen) return;
    const onPointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [panelOpen]);

  return (
    <div>
      <div ref={containerRef} className="relative mb-4 max-w-[280px]">
        <button
          type="button"
          onClick={() => setPanelOpen((v) => !v)}
          aria-expanded={panelOpen}
          className="flex w-full items-center justify-between gap-2.5 rounded-xl border border-[#2E3062]/10 bg-white px-4 py-3 text-sm font-semibold text-[#2E2F62] shadow-[0_2px_10px_rgba(46,48,98,.05)]"
        >
          {current.label}
          <ChevronDown
            size={16}
            stroke="url(#akoode-icon-gradient)"
            className={`transition-transform duration-200 ${panelOpen ? "rotate-180" : ""}`}
          />
        </button>
        {panelOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-[#2E3062]/8 bg-white shadow-[0_16px_40px_rgba(46,48,98,.18)]">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setMode(opt.value);
                  setPanelOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                  opt.value === mode
                    ? "bg-[#5A5FF0]/8 font-semibold text-[#2E2F62]"
                    : "font-medium text-[#3C3E75] hover:bg-[#5A5FF0]/5"
                }`}
              >
                {opt.label}
                <span className="text-[13px] text-[#9698BC]">({opt.count})</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {/*
        Both grids are always rendered — only one is shown at a time via
        `hidden` — so every country and city page link is present in the
        server-rendered HTML for crawlers, regardless of which tab a visitor
        last picked. Client-side toggling never removes the other from the
        DOM the way conditional rendering would.
      */}
      {[
        { key: "countries", list: countryItems },
        { key: "cities", list: cityItems },
      ].map(({ key, list }) => (
        <div
          key={key}
          aria-hidden={mode !== key}
          className={`grid content-start gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(228px,1fr))] ${
            mode === key ? "" : "hidden"
          }`}
        >
          {list.map((item, idx) => (
            <Link
              key={`${item.href}-${idx}`}
              href={item.href}
              tabIndex={mode === key ? 0 : -1}
              className="flex min-h-[44px] items-center justify-between gap-2.5 rounded-xl border border-[#2E3062]/5 bg-white/55 px-4 py-2.5 text-sm font-medium leading-[1.4] text-[#3C3E75] transition-all duration-200 hover:-translate-y-px hover:border-[#5A5FF0]/35 hover:bg-white hover:text-[#5A5FF0] hover:shadow-[0_6px_18px_rgba(90,95,240,.14)]"
            >
              <span>{item.label}</span>
              <ArrowUpRight size={16} strokeWidth={2.5} stroke="url(#akoode-icon-gradient)" className="flex-none" />
            </Link>
          ))}
          {list.length === 0 && (
            <div className="col-span-full py-6 text-sm text-[#6B6D9C]">
              No locations in this category.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

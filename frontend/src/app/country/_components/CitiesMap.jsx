"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { splitTitle } from "./shared";
import RichText from "./RichText";

const VARIANTS = {
  us: {
    layout: "pills",
    countryLabel: "The USA",
    map: "/country/usa-map.webp",
    mapAlt: "Map of the United States marked with the cities Akoode delivers from",
    heading: "Software Development <span>Across The USA</span>",
    body: "Akoode delivers software development in 15+ US cities, with senior engineers working inside your timezone and your compliance requirements, not a generic offshore queue.",
    cities: [
      { name: "Chicago", slug: "chicago" },
      { name: "Los Angeles", slug: "los-angeles" },
      { name: "New York", slug: "newyork" },
      { name: "Houston", slug: "houston" },
      { name: "Austin", slug: "austin" },
      { name: "Dallas", slug: "dallas" },
      { name: "San Francisco", slug: "san-francisco" },
      { name: "Miami", slug: "miami" },
      { name: "Atlanta", slug: "atlanta" },
      { name: "Washington, DC", slug: "washington-dc" },
      { name: "Philadelphia", slug: "philadelphia" },
      { name: "Boston", slug: "boston" },
      { name: "Oklahoma", slug: "oklahoma" },
      { name: "Seattle", slug: "seattle" },
      { name: "Denver", slug: "denver" },
    ],
  },

  uk: {
    layout: "map",
    countryLabel: "The UK",
    map: "/country/uk-map-v3.webp",
    mapLabeled: "/country/uk-map-labeled-v4.webp",
    mapAlt:
      "Map of the United Kingdom with pins marking the cities Akoode delivers from, including London, Manchester, Birmingham and Edinburgh",
    heading: "Software Development <span>Across The UK</span>",
    body: "Akoode delivers software development in 15+ UK cities, with senior engineers working inside your timezone and your compliance requirements, not a generic offshore queue.",
    cities: [
      { name: "London", slug: "london", pin: [84.19, 82.15] },
      { name: "Manchester", slug: "manchester", pin: [57.20, 58.51] },
      { name: "Birmingham", slug: "birmingham", pin: [55.51, 70.64] },
      { name: "Edinburgh", slug: "edinburgh", pin: [50.72, 31.19] },
      { name: "Glasgow", slug: "glasgow", pin: [34.29, 30.58] },
      { name: "Leeds", slug: "leeds", pin: [64.42, 53.42] },
      { name: "Liverpool", slug: "liverpool", pin: [49.19, 59.25] },
      { name: "Sheffield", slug: "sheffield", pin: [65.86, 60.98] },
      { name: "Bristol", slug: "bristol", pin: [50.46, 84.28] },
      { name: "Cardiff", slug: "cardiff", pin: [36.69, 78.66] },
      { name: "Belfast", slug: "belfast", pin: [15.34, 46.14] },
      { name: "Newcastle", slug: "newcastle", pin: [63.72, 42.52] },
      { name: "Nottingham", slug: "nottingham", pin: [70.49, 65.59] },
      { name: "Cambridge", slug: "cambridge", pin: [82.87, 73.62] },
      { name: "Reading", slug: "reading", pin: [62.67, 80.63] },
    ],
  },
};

const PILL_BASE =
  "group relative flex h-full w-full items-center justify-between gap-3 rounded-full border-[0.8px] text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white " +
  "min-h-[48px] px-5 py-3 lg:min-h-[clamp(40px,3.05vw,58px)] lg:px-[1.16vw] lg:py-0";
const PILL_IDLE = "border-[#e4e7f2] bg-white hover:border-[#6679e4] hover:bg-[#ecefff]";
const PILL_LABEL =
  "truncate font-medium leading-tight text-[#130e2a] text-[15px] lg:text-[clamp(12px,0.947vw,18px)]";

export function CitiesMap({ data, market, slug }) {
  const STEP = 4;
  const [visibleCount, setVisibleCount] = useState(STEP);
  // Links pin hotspots and city chips together in both directions.
  const [activeCity, setActiveCity] = useState(null);

  const variant = VARIANTS[data?.variant] || VARIANTS.us;

  const cities = data?.cities?.length ? data.cities : variant.cities;
  if (!cities?.length) return null;

  const body = data?.body || variant.body;
  const mapSrc = data?.mapImage || variant.map;
  const mapAlt = data?.mapImageAlt || variant.mapAlt;

  const heading = data?.heading || variant.heading;
  const { main, accent, suffix } = splitTitle(heading);
  const hasMore = visibleCount < cities.length;

  const hrefFor = (city) => {
    if (city.href) return city.href;
    if (market && slug && city.slug) return `/${market}/${city.slug}/${slug}`;
    return null;
  };

  /* ── UK: white section, copy left, portrait pinned map right ───────────── */
  if (variant.layout === "map") {
    return (
      <section className="sbc-section relative overflow-hidden bg-white !py-0">
        <div className="grid items-start lg:grid-cols-2">
          <div className="reveal relative z-10 px-6 py-14 sm:px-10 lg:px-0 lg:pl-[4.68vw] lg:pr-[3vw] lg:pt-[5vw]">
            <h2
              style={{ marginBottom: "clamp(18px, 1.1vw, 26px)" }}
              className="font-bold text-[26px] leading-[1.15] !text-[#191a2e] lg:text-[clamp(24px,2.52vw,42px)] lg:leading-[1.25]"
            >
              {main}{" "}
              {accent && (
                <span className="bg-[linear-gradient(91deg,#7784C5_0%,#B7BEED_40%,#6378E3_100%)] bg-clip-text text-transparent [-webkit-text-fill-color:transparent]">
                  {accent}
                </span>
              )}{" "}
              {suffix}
            </h2>
            <RichText
              className="!text-[#191a2e] text-[15px] leading-[1.6] lg:max-w-[24.8vw] lg:text-[clamp(13px,1.26vw,24px)] lg:leading-[1.45]"
              html={body}
            />

            <nav aria-label={`Cities across ${variant.countryLabel}`} className="hidden lg:block lg:mt-[2.5vw]">
              <ul className="flex list-none flex-wrap gap-x-2 gap-y-2 p-0">
                {cities.map((city) => {
                  const href = hrefFor(city);
                  if (!href) {
                    return (
                      <li key={city.slug || city.name} className="rounded-full border border-[#e4e7f2] bg-white px-4 py-2 text-[13px] font-medium text-[#191a2e]">
                        {city.name}
                      </li>
                    );
                  }
                  const isActive = activeCity === city.slug;
                  return (
                    <li key={city.slug || city.name}>
                      <Link
                        href={href}
                        onMouseEnter={() => setActiveCity(city.slug)}
                        onMouseLeave={() => setActiveCity(null)}
                        onFocus={() => setActiveCity(city.slug)}
                        onBlur={() => setActiveCity(null)}
                        className={`group inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-medium text-[#191a2e] transition-colors !no-underline ${
                          isActive ? "border-[#6679e4] bg-[#ecefff]" : "border-[#e4e7f2] bg-white"
                        }`}
                      >
                        {city.name}
                        <FiArrowRight
                          className={`h-3.5 w-3.5 shrink-0 text-[#7185FA] transition-transform duration-200 ${isActive ? "translate-x-0.5" : ""}`}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Figma: 619x901 map sitting at the left edge of the right column. */}
          <div className="reveal relative flex justify-center px-1 pb-14 lg:justify-start lg:px-0 lg:pb-0 lg:pl-[2.5vw]">
            <div className="relative w-full max-w-[560px] lg:w-[32.6vw] lg:max-w-none">
              <Image
                src={variant.mapLabeled || mapSrc}
                alt={mapAlt}
                width={619}
                height={901}
                sizes="(max-width: 1024px) 99vw, 33vw"
                className="h-auto w-full lg:hidden"
              />
              <Image
                src={mapSrc}
                alt={mapAlt}
                width={619}
                height={901}
                sizes="(max-width: 1024px) 99vw, 33vw"
                className="hidden h-auto w-full lg:block"
              />
              {cities.map((city) => {
                if (!city.pin) return null;
                const [x, y] = city.pin;
                const href = hrefFor(city);
                const isActive = activeCity === city.slug;
                return (
                  <Fragment key={`pin-${city.slug}`}>
                    {href && (
                      <Link
                        href={href}
                        aria-label={`Software development company in ${city.name}`}
                        style={{ left: `${x - 2}%`, top: `${y}%` }}
                        className="absolute h-[5%] w-[19%] -translate-y-1/2 rounded-full lg:hidden"
                      />
                    )}
                    <div
                      aria-hidden="true"
                      onMouseEnter={() => setActiveCity(city.slug)}
                      onMouseLeave={() => setActiveCity(null)}
                      style={{ left: `${x}%`, top: `${y}%` }}
                      className={`absolute hidden h-[4.5%] w-[7%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 lg:block ${
                        isActive ? "scale-125 bg-[#6378E3]/25 ring-2 ring-[#6378E3]" : "ring-0"
                      }`}
                    />
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sbc-section relative overflow-hidden bg-[#1d1f4b] !py-0">
      <div className="grid lg:grid-cols-[31.6%_68.4%]">
        <div className="reveal flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-0 lg:py-0 lg:pl-[4.6vw] lg:pr-[2vw]">
          <h2
            style={{ marginBottom: "clamp(22px, 1.1vw, 28px)" }}
            className="font-bold !text-white text-[26px] leading-[1.15] lg:text-[clamp(24px,2.52vw,42px)] lg:leading-[1.25]"
          >
            {main}{" "}
            {accent && (
              <span className="bg-[linear-gradient(91deg,#7185FA_0%,#95A2FF_45%,#E4E9FF_100%)] bg-clip-text text-transparent [-webkit-text-fill-color:transparent]">
                {accent}
              </span>
            )}{" "}
            {suffix}
          </h2>
          <RichText
            className="!text-[#e5e7eb] text-[15px] leading-[1.6] lg:max-w-[24.8vw] lg:text-[clamp(13px,1.26vw,24px)] lg:leading-[1.45]"
            html={body}
          />
        </div>

        <div className="relative isolate flex min-h-[420px] flex-col justify-center bg-[#b6b7c5] px-5 py-12 sm:px-8 lg:aspect-[1300/707] lg:min-h-0 lg:flex-row lg:items-center lg:px-0 lg:py-[9%] lg:pl-[5.4%]">
          <Image
            src={mapSrc}
            alt={mapAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 68vw"
            className="-z-10 object-contain object-center opacity-40 lg:opacity-100"
          />
          <nav aria-label={`Cities across ${variant.countryLabel}`} className="flex flex-col justify-center lg:block lg:w-[61.2%]">
            <ul
              className="grid list-none grid-cols-1 gap-x-5 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-[4.3%]"
              style={{ rowGap: "clamp(14px, 3vw, 24px)" }}
            >
              {cities.map((city, i) => {
                const href = hrefFor(city);

                const inner = (
                  <>
                    <span className={PILL_LABEL}>{city.name}</span>
                    {href && (
                      <FiArrowRight
                        className="h-5 w-5 shrink-0 text-[#7185FA] transition-transform duration-200 group-hover:translate-x-0.5 lg:h-[1.26vw] lg:w-[1.26vw] lg:min-h-[14px] lg:min-w-[14px]"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    )}
                  </>
                );
                return (
                  <li
                    key={city.slug || city.name}
                    className={`reveal ${i >= visibleCount ? "hidden lg:block" : ""}`}
                    style={{ transitionDelay: `${i * 0.03}s` }}
                  >
                    {href ? (
                      <Link href={href} className={`${PILL_BASE} ${PILL_IDLE} !no-underline`}>
                        {inner}
                      </Link>
                    ) : (
                      <div className={`${PILL_BASE} border-[#e4e7f2] bg-white`}>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            {hasMore && (
              <button
                type="button"
                onClick={() => setVisibleCount((v) => v + STEP)}
                className="group mx-auto mt-6 flex items-center gap-2 rounded-full bg-[#1d1f4b] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2a2d63] lg:hidden"
              >
                View more
                <svg
                  className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </nav>
        </div>
      </div>
    </section>
  );
}

export default CitiesMap;

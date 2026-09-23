"use client";

import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";
import { splitTitle } from "./shared";

export function Testimonial({ data }) {
  const heading = data?.heading || "Stories from teams we've built with";
  const subtitle = data?.subtitle || "Real partnerships. Real people. Real stories.";
  const testimonials = [
    {
      id: 1,
      video: "https://www.youtube.com/embed/uTlVqq-R43U?rel=0&vq=hd1080",
      quote:
        "Akoode quietly became the engineering org we wished we'd hired in-house. They speak Gurugram-business and Bay-Area-engineering with equal fluency — and they ship on Fridays.",
      name: "Riya Aggarwal",
      role: "VP Product, Northwave Realty · Gurugram",
      initials: "RA",
    },
    {
      id: 2,
      video: "https://www.youtube.com/embed/uTlVqq-R43U?rel=0",
      quote:
        "Akoode engineers integrated into our product org like they'd been with us for years. Communication was sharp, delivery was sharper.",
      name: "Karan Mehta",
      role: "CTO, Heliopath Logistics · Gurgaon",
      initials: "KM",
    },
    {
      id: 3,
      video: "https://www.youtube.com/embed/uTlVqq-R43U?rel=0",
      quote:
        "Every sprint felt predictable, every release felt polished. That kind of execution is rare.",
      name: "Priya Sharma",
      role: "Head of Product, Finvault · Bengaluru",
      initials: "PS",
    },
  ];

  const N = testimonials.length;

  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);

  const pauseRef = useRef(false);

  const goTo = (i) => {
    if (i === active || fading) return;
    setFading(true);
    setTimeout(() => {
      setActive(i);
      setFading(false);
    }, 350);
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (pauseRef.current) return;
      setFading(true);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % N);
        setFading(false);
      }, 350);
    }, 8000);
    return () => clearInterval(id);
  }, [N]);

  const t = testimonials[active];

  return (
    <section
      className="sbc-section sbc-section--light py-14 xl:py-16 overflow-hidden"
      onMouseEnter={() => { pauseRef.current = true; }}
      onMouseLeave={() => { pauseRef.current = false; }}
    >
      <div className="sbc-container">
        {/* heading */}
        <div className="mx-auto mb-12 md:mb-16 sbc-section-head sbc-section-head--single-title">
          <h2 className="sbc-h2 sbc-section-title text-[#1a1a1a] font-bold transition-colors duration-400 mb-0">
            {(() => {
              const { main, accent, suffix } = splitTitle(heading);
              return (
                <>
                  {main} {accent && <span className="sbc-heading-accent">{accent}</span>} {suffix}
                </>
              );
            })()}
          </h2>
          <p className="sbc-body-lg sbc-section-subtitle text-[#2a2d52]">
            {subtitle}
          </p>
        </div>

        {/* cards */}
        <div className="max-w-[1400px] mx-auto">
          <div
            className="grid lg:grid-cols-2 gap-4 items-stretch"
            style={{
              opacity: fading ? 0 : 1,
              transform: fading ? "translateY(12px) scale(.99)" : "translateY(0px) scale(1)",
              filter: fading ? "blur(3px)" : "blur(0px)",
              transition: "all .35s cubic-bezier(.2,.8,.2,1)",
            }}
          >
            {/* LEFT — video */}
            <div className="h-[220px] sm:h-[300px] lg:h-[420px] xl:h-[460px] rounded-[5px] overflow-hidden bg-black">
              <div className="relative w-full h-full">
                <iframe
                  src={t.video}
                  title={t.name}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>

            {/* RIGHT — no fixed height on mobile so content never overflows */}
            <div className="rounded-[5px] bg-white border border-[rgba(124,110,240,.12)] shadow-[0_20px_60px_rgba(70,50,140,.06)] p-5 sm:p-7 lg:p-8 xl:p-10 flex flex-col lg:h-[420px] xl:h-[460px]">
              {/* centered content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center py-3 sm:py-4 lg:py-0">
                <Quote
                  size={32}
                  className="text-[#5a4cff] mb-4 sm:mb-5 lg:mb-6 shrink-0"
                />
                <blockquote className="w-full text-[15px] sm:text-[17px] lg:text-[19px] xl:text-[22px] leading-[1.6] tracking-[-.02em] text-[#18193e] font-medium">
                  {t.quote}
                </blockquote>
              </div>

              {/* author */}
              <div className="mt-4 pt-4 sm:pt-5 lg:pt-6 border-t border-[#f1efff] flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] shrink-0 rounded-full bg-[#f1efff] flex items-center justify-center font-bold text-[#18193e] text-[13px] sm:text-[15px]">
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-[#18193e] text-[14px] sm:text-[16px]">
                    {t.name}
                  </div>
                  <div className="text-[#575b85] text-[12px] sm:text-[14px] leading-snug">
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* indicators */}
          <div className="mt-6 flex justify-center gap-2.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="border-none p-0 cursor-pointer"
                style={{
                  width: i === active ? 26 : 8,
                  height: 8,
                  borderRadius: 999,
                  background: i === active ? "#4d46d8" : "rgba(77,70,216,.18)",
                  transition: "all .35s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { Bot, TrendingUp, Sparkles, MessageSquare, ChevronDown } from "lucide-react";
import { resolveIcon } from "../iconResolver";
import { stripHtml } from "../stripHtml";

const AI_ITEMS = [
  {
    Icon: Bot,
    title: "Intelligent Process Automation",
    desc: "Replace repetitive manual work with AI-driven workflows that learn and improve over time. Your operations become faster, more consistent, and dramatically less error-prone.",
  },
  {
    Icon: TrendingUp,
    title: "Predictive Analytics & Business Intelligence",
    desc: "Move from looking backward at what happened to looking forward at what will. Our BI layers surface anomalies, forecast trends, and deliver insights before problems escalate.",
  },
  {
    Icon: Sparkles,
    title: "AI-Powered Recommendation Engines",
    desc: "Serve your users the right content, products, and actions at the right moment. Context-aware engines that compound in value with every interaction.",
  },
  {
    Icon: MessageSquare,
    title: "Natural Language Processing",
    desc: "Extract meaning from unstructured text, voice, and documents at scale. From intelligent document processing to conversational interfaces that understand intent.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function SdAI({ data }) {
  const [openIdx, setOpenIdx] = useState(null);
  const heading       = data?.heading       || "AI Integration in";
  const headingAccent = data?.headingAccent || "Every Software";
  const headingTail   = data?.headingTail   || "We Build";
  const dynParas      = (data?.paragraphs || []).filter(Boolean);
  const hasDynParas   = dynParas.length > 0;
  const dynItems      = data?.items?.length ? data.items.map(s => ({
    Icon: resolveIcon(s.icon) || Bot,
    title: stripHtml(s.title),
    desc:  s.desc || "",
  })) : null;

  return (
    <section
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #1D2033 0%, #101828 100%)" }}
    >
      {/* background orb */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 600,
          height: 600,
          right: -200,
          top: -100,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(113,134,250,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-4">
        <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-start">

          {/* ── left col ── */}
          <div>
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-[family-name:var(--font-figtree)] font-bold text-[26px] leading-tight mb-8"
            >
              <span className="text-white">{heading} </span>
              <span style={{ color: "#7784C5" }}>{headingAccent}</span>
              <span className="text-white"> {headingTail}</span>
            </m.h2>

            <div className="space-y-5">
              {hasDynParas ? dynParas.map((p, i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className={`font-[family-name:var(--font-figtree)] font-normal text-[15px] leading-[1.75]${i === 0 ? " pl-4" : ""}`}
                  style={{ color: "#ffffff", ...(i === 0 && { borderLeft: "2px solid #7784C5" }) }}
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              )) : (
                <>
                  <m.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="font-[family-name:var(--font-figtree)] font-normal text-[15px] leading-[1.75] pl-4" style={{ color: "#ffffff", borderLeft: "2px solid #7784C5" }}>
                    At Akoode, we go beyond conventional development by integrating artificial intelligence directly into the software systems we build.
                  </m.p>
                  <m.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.18 }} className="font-[family-name:var(--font-figtree)] font-normal text-[15px] leading-[1.75]" style={{ color: "#ffffff" }}>
                    Businesses that integrate AI into their core platforms gain a compounding advantage over time. Operations become faster, decisions become better-informed, and the software itself becomes more valuable with every interaction.
                  </m.p>
                  <m.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.26 }} className="font-[family-name:var(--font-figtree)] font-normal text-[15px] leading-[1.75]" style={{ color: "#ffffff" }}>
                    We help businesses move from reactive systems — where teams respond to problems after they occur — to predictive and adaptive platforms that get ahead of them.
                  </m.p>
                </>
              )}
            </div>
          </div>

          {/* ── right col: AI capabilities accordion ── */}
          <div>
            {(dynItems || AI_ITEMS).map((item, i) => {
              const isOpen = openIdx === i;
              return (
                <m.div
                  key={item.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {/* header row — clickable */}
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="w-full flex items-center gap-5 py-5 text-left"
                  >
                    {/* icon — white bg, dark icon */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: isOpen
                          ? "rgba(113,134,250,0.25)"
                          : "rgba(255,255,255,0.92)",
                      }}
                    >
                      <item.Icon
                        size={20}
                        style={{ color: isOpen ? "#A0AEFF" : "#1D1F4B" }}
                      />
                    </div>

                    <h3 className="flex-1 text-white font-[family-name:var(--font-figtree)] font-semibold text-[16px] sm:text-[18px] leading-[1.3]">
                      {item.title}
                    </h3>

                    <m.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0"
                    >
                      <ChevronDown size={18} style={{ color: "rgba(255,255,255,0.4)" }} />
                    </m.div>
                  </button>

                  {/* collapsible description — always in DOM so crawlers can index it */}
                  <div
                    style={{
                      maxHeight: isOpen ? 300 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div
                      className="font-[family-name:var(--font-figtree)] text-[14px] leading-[1.65] pb-5 pl-16 [&_a]:underline [&_a]:underline-offset-2 [&_a]:text-[#A0AEFF] [&_a]:hover:text-white [&_p]:m-0"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                      dangerouslySetInnerHTML={{ __html: item.desc }}
                    />
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

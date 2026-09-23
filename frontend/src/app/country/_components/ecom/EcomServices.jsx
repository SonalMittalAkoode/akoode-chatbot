"use client";

import { FiSearch, FiZap, FiBarChart2, FiShield } from "react-icons/fi";

const ILLUSTRATION = "/country/ecom-services/illustration.png";
const CTA_ARROW = "/country/ecom-services/cta-arrow.svg";
const CTA_WAVE = "/country/ecom-services/cta-wave.svg";

const TIMELINE = [
  { dot: "#b6c0fa", title: "Document Understanding", body: "Extract, structure, and make sense of your data" },
  { dot: "#6679e4", title: "AI Integration", body: "Connect the right models to the right tasks" },
  { dot: "#b6c0fa", title: "Intelligent Workflows", body: "Automate decisions with built-in human handoff" },
  { dot: "#6679e4", title: "Secure & Responsible AI", body: "Privacy-first, compliant, and built to scale" },
];

const FEATURE_CARDS = [
  { Icon: FiSearch, title: "Retrieval systems", body: "built on your own documents, not a generic model's memory", n: "01" },
  { Icon: FiZap, title: "LLM integration", body: "across OpenAI, Claude, and open-source models, picked by task rather than brand", n: "02" },
  { Icon: FiZap, title: "Workflow automation", body: "that hands off to a human when confidence drops, not silently", n: "03" },
  { Icon: FiBarChart2, title: "Recommendation and prediction models", body: "tuned against your actual data, not a demo dataset", n: "04" },
  { Icon: FiShield, title: "Data handling", body: "built with PIPEDA's minimisation principle in mind from the schema up", n: "05" },
];

const TECH_STACK = [
  { label: "OpenAI", icon: "/country/ecom-services/tech-openai.svg" },
  { label: "LangChain", icon: "/country/ecom-services/tech-langchain.svg" },
  { label: "Hugging Face", icon: "/country/ecom-services/tech-huggingface.svg" },
  { label: "PyTorch", icon: "/country/ecom-services/tech-pytorch.svg" },
  { label: "Vector Databases", icon: "/country/ecom-services/tech-vectordb.svg" },
  { label: "FastAPI", icon: "/country/ecom-services/tech-fastapi.svg" },
];

const HEADING_GRADIENT =
  "linear-gradient(20.307deg, rgb(119,132,197) 33.662%, rgb(183,190,237) 48.02%, rgb(96,119,236) 58.532%, rgb(118,131,197) 85.197%)";

function splitHeading(raw = "") {
  const idx = raw.lastIndexOf(" for ");
  if (idx === -1) return { lead: raw, tail: "" };
  return { lead: raw.slice(0, idx), tail: raw.slice(idx + 1) };
}

export default function EcomServices({ data }) {
  const { lead, tail } = splitHeading(
    data?.heading || "AI Software Development for Canadian Companies"
  );
  const intro =
    data?.intro ||
    "Most AI projects stall at the demo stage. Ours don't, because we build for the part after the demo: the RAG pipeline that has to keep working when your document library doubles, the LLM integration that has to degrade gracefully when the API is slow, the search system that has to explain why it returned a given answer when someone in compliance asks.";
  const strong =
    data?.body ||
    "Akoode builds AI for document processing, support automation, and internal search that's designed to survive contact with real usage, not just a stakeholder walkthrough.";

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-20 lg:py-[100px]" style={{ background: "#130e2a" }}>
      <div className="mx-auto flex w-[92%] max-w-[1741px] flex-col gap-16 lg:gap-[70px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-[4%]">
          <div className="flex w-full flex-col gap-7 lg:w-[42%]">
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((n) =>
                n === 1 ? (
                  <span
                    key={n}
                    className="font-figtree flex h-[33px] items-center justify-center rounded-[6px] px-3 text-[13px] font-bold"
                    style={{ background: "#7185fa", color: "#1d1f4b" }}
                  >
                    0{n}
                  </span>
                ) : (
                  <span
                    key={n}
                    className="font-figtree flex h-[33px] items-center justify-center rounded-[6px] px-3 text-[13px] font-bold"
                    style={{ border: "0.8px solid #6679e4", color: "#6679e4" }}
                  >
                    0{n}
                  </span>
                )
              )}
            </div>

            <h2
              className="font-figtree capitalize"
              style={{ fontWeight: 600, lineHeight: 1.22, letterSpacing: "-0.012em", fontSize: "clamp(18px, 1.9vw, 24px)" }}
            >
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: HEADING_GRADIENT }}>
                {lead}
              </span>{" "}
              <span style={{ color: "#fff" }}>{tail}</span>
            </h2>

            <p className="font-figtree" style={{ color: "#fff", fontSize: 16, lineHeight: "26px" }}>
              {intro}
            </p>
            <p className="font-figtree font-semibold" style={{ color: "#fff", fontSize: 16, lineHeight: "26px" }}>
              {strong}
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-10 lg:w-[54%] lg:flex-row lg:items-center lg:gap-[56px]">
            <img
              src={ILLUSTRATION}
              alt="Layered AI architecture illustration"
              className="block h-auto w-[70%] max-w-[320px] shrink-0 lg:w-[42%] lg:max-w-none"
            />

            <div className="flex w-full flex-col gap-6 lg:w-[52%]">
              {TIMELINE.map((t, i) => (
                <div key={i} className="relative flex items-start gap-3">
                  {/* Connector to the illustration — parked for now, not wired
                      into ServiceByCountryClient (see the "process" render
                      block there); left in place, commented, for whenever
                      this section gets picked back up.
                  <span
                    aria-hidden
                    className="pointer-events-none absolute hidden h-0 lg:block"
                    style={{ left: -128, top: 11, width: 128, borderTop: "1.5px dotted #6679e4" }}
                  />
                  */}
                  <span
                    aria-hidden
                    className="mt-1.5 block shrink-0 rounded-[7px]"
                    style={{ width: 12, height: 12, background: t.dot }}
                  />
                  <div className="flex flex-col">
                    <h4 className="font-figtree font-semibold" style={{ color: "#fff", fontSize: 16, lineHeight: "22px" }}>
                      {t.title}
                    </h4>
                    <p className="font-figtree mt-1" style={{ color: "#fff", fontSize: 16, lineHeight: "26px" }}>
                      {t.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Five flat feature cards ── */}
        <div
          className="grid grid-cols-1 overflow-hidden rounded-[20px] sm:grid-cols-2 lg:grid-cols-5"
          style={{ background: "#f4f5fd", border: "0.8px solid #e5e8f5" }}
        >
          {FEATURE_CARDS.map((c, i) => (
            <div
              key={i}
              className="flex flex-col gap-6 px-6 pb-7 pt-8"
              style={{ borderRight: i < FEATURE_CARDS.length - 1 ? "0.8px solid #e5e8f5" : "none" }}
            >
              <div
                className="flex size-16 items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(180deg, #576099 0%, #3a4066 50%, #1d2033 100%)",
                  border: "0.8px solid #e8ecf3",
                }}
              >
                <c.Icon size={32} color="#fff" />
              </div>
              <h3 className="font-figtree font-semibold" style={{ color: "#130e2a", fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
                {c.title}
              </h3>
              <p className="font-figtree flex-1" style={{ color: "#1d1f4b", fontSize: 16, lineHeight: "26px" }}>
                {c.body}
              </p>
              <div className="flex items-center gap-[10px]">
                <span className="font-figtree font-bold" style={{ color: "#6679e4", fontSize: 24 }}>
                  {c.n}
                </span>
                <span className="h-[2px] flex-1" style={{ background: "#e5e8f5" }} />
                <span className="block shrink-0 rounded-[7px]" style={{ width: 12, height: 12, background: "#6679e4" }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Tech stack strip ── */}
        <div className="overflow-hidden rounded-[20px]" style={{ border: "0.8px solid #e5e8f5" }}>
          <div className="flex flex-col lg:flex-row">
            <div className="flex shrink-0 flex-col justify-center gap-3 px-8 py-9 lg:w-[140px]" style={{ borderRight: "0.8px solid #e5e8f5", borderBottom: "0.8px solid #e5e8f5" }}>
              <p className="font-figtree font-extrabold uppercase tracking-[1.5px]" style={{ color: "#fff", fontSize: 24, lineHeight: 1.4 }}>
                Tech<br />Stack
              </p>
              <span className="h-[2px] w-7 rounded-[1px]" style={{ background: "#889af5" }} />
            </div>

            <div className="grid flex-1 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
              {TECH_STACK.map((t, i) => (
                <div
                  key={t.label}
                  className="flex flex-col items-center justify-center gap-[18px] px-3 py-7"
                  style={{ borderRight: i < TECH_STACK.length - 1 ? "0.8px solid #e5e8f5" : "none" }}
                >
                  <div
                    className="flex size-16 items-center justify-center rounded-full"
                    style={{ background: "#f4f5fd", border: "0.8px solid #e5e8f5" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.icon} alt="" aria-hidden className="size-8" />
                  </div>
                  <p className="font-figtree text-center font-semibold" style={{ color: "#fff", fontSize: 16, lineHeight: 1.4 }}>
                    {t.label}
                  </p>
                </div>
              ))}

              <a
                href="/services"
                className="relative col-span-2 flex items-center gap-5 overflow-hidden px-8 py-8 transition-opacity hover:opacity-90 sm:col-span-2 lg:col-span-2"
                style={{ backgroundImage: "linear-gradient(139.874deg, #6679e4 0%, #889af5 100%)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CTA_WAVE} alt="" aria-hidden className="pointer-events-none absolute left-0 top-0 h-[36px] w-full" />
                <div className="relative flex flex-col">
                  <p className="font-figtree font-bold" style={{ color: "#fff", fontSize: 16, lineHeight: 1.35 }}>
                    Explore Service Details
                  </p>
                  <p className="font-figtree mt-1" style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.4 }}>
                    See how we can solve what&apos;s next.
                  </p>
                </div>
                <span
                  className="relative ml-auto flex size-12 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(255,255,255,0.2)", border: "0.8px solid rgba(255,255,255,0.5)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={CTA_ARROW} alt="" aria-hidden className="size-5" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { FiArrowRight } from "react-icons/fi";
import { splitTitle, buildAssetUrl } from "./shared";
import RichText from "./RichText";
import Link from "next/link";
import Image from "next/image";

export function Blog({ data }) {
  const heading = data?.heading || "Reading from the studio.";
  const subtitle = data?.subtitle || "Notes, engineering decisions, and field lessons from the products we build every week.";

  // Use selected blogs from DB if they exist, otherwise use fallbacks
  const blogItems = data?.selectedBlogs?.length > 0
    ? data.selectedBlogs.map(b => ({
      tag: b.tags?.[0] || "Insights",
      t: b.title,
      d: b.description?.replace(/<[^>]*>/g, '').slice(0, 120) + "...",
      read: "5 min", // Fallback read time
      slug: b.slug,
      image: b.logoimage ? buildAssetUrl(b.logoimage) : null
    }))
    : [
      { tag: "NCR Insights", t: "State of NCR tech, 2026", d: "Hiring trends, salary benchmarks, and what 240 founders told us about the next 18 months.", read: "7 min", slug: "#", image: null },
      { tag: "Engineering", t: "From a Mongo monolith to microservices — without downtime", d: "How we cut over a 12,000-agent CRM live, with zero scheduled outage windows.", read: "11 min", slug: "#", image: null },
      { tag: "AI", t: "A pragmatic RAG playbook for Indian SaaS", d: "What worked, what didn't, and what we'd do differently across six production deployments.", read: "9 min", slug: "#", image: null },
    ];

  return (
    <section className="sbc-section sbc-section--light pt-[80px] pb-[80px]">
      <div className="sbc-glow-blob sbc-light-blob--tl" aria-hidden="true" />
      <div className="sbc-glow-blob sbc-light-blob--br" aria-hidden="true" />
      <div className="sbc-container relative z-[1]">
        <div className="relative mb-16">
          <div className="reveal sbc-section-head sbc-section-head--single-title">
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
            <RichText className="sbc-body-lg sbc-section-subtitle text-[#2a2d52]" html={subtitle} />
          </div>
          <Link
            href="/blog"
            className="z-10 mt-6 ml-auto flex w-fit items-center gap-2 text-[#18193e] font-medium hover:opacity-80 max-md:mb-4 md:absolute md:right-0 md:top-0 md:mt-0 md:ml-0"
          >
            All articles <FiArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sbc-card-strip overflow-x-clip">
          {blogItems.map((p, i) => (
            <Link
              href={p.slug !== "#" ? `/blog/${p.slug}` : "#"}
              key={p.t}
              className={`reveal d${i + 1} relative isolate overflow-hidden cursor-pointer rounded-[20px] border border-[rgba(100,80,200,0.12)] transition-[box-shadow,transform] duration-300 block !no-underline`}
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f6f4ff 100%)",
                boxShadow: "0 6px 30px -8px rgba(80,60,180,0.14), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(80,60,180,0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 20px -6px rgba(80,60,180,0.10)";
              }}
            >
              <div
                className="aspect-[4/3] relative overflow-hidden rounded-t-[20px]"
                style={{
                  background:
                    i === 0
                      ? "linear-gradient(135deg, #1a1b36 0%, #2d2f60 40%, #3a3c80 100%)"
                      : i === 1
                        ? "linear-gradient(135deg, #c8c4f0 0%, #ebe9f8 50%, #d8d4f0 100%)"
                        : "linear-gradient(135deg, #18193e 0%, #3a3c70 40%, #c8c4f0 100%)",
                }}
              >
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.t}
                    fill
                    unoptimized
                    className="object-cover object-top !absolute !inset-0"
                  />
                )}
              </div>
              <div className="p-7">
                <h3 className="sbc-h3 mb-2 text-[#18193e]">{p.t}</h3>
                <p className="sbc-body text-[#252747]">{p.d}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

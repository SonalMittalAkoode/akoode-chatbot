"use client";

import { m } from "framer-motion";
import { resolveIcon } from "../iconResolver";
import { stripHtml } from "../stripHtml";
import {
  LayoutGrid,
  Users,
  Cloud,
  Zap,
  BarChart2,
  GitBranch,
} from "lucide-react";

const SOLUTIONS = [
  {
    Icon: LayoutGrid,
    title: "ERP Systems",
    desc: "Unified enterprise resource planning platforms that connect finance, HR, procurement, and operations into one intelligent, real-time system.",
  },
  {
    Icon: Users,
    title: "CRM Platforms",
    desc: "Customer relationship management solutions that give your sales and support teams a 360° view of every customer interaction and pipeline stage.",
  },
  {
    Icon: Cloud,
    title: "SaaS Products",
    desc: "Cloud-based software-as-a-service products built for multi-tenant scale, subscription management, and continuous delivery pipelines.",
  },
  {
    Icon: Zap,
    title: "Business Automation Tools",
    desc: "Workflow automation platforms that eliminate manual processes, reduce errors, and free your team to focus on high-value strategic work.",
  },
  {
    Icon: BarChart2,
    title: "Data Analytics Dashboards",
    desc: "Custom analytics and BI dashboards that surface the metrics your team actually needs to make faster, smarter, data-driven decisions.",
  },
  {
    Icon: GitBranch,
    title: "Workflow Management Systems",
    desc: "End-to-end workflow orchestration tools that track, assign, and optimise how work moves through your organisation efficiently.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07 },
  }),
};

export default function SdSolutions({ data }) {
  const heading       = data?.heading       || "Software Solutions";
  const headingAccent = data?.headingAccent || "We Build";
  const dynItems      = data?.items?.length ? data.items.map((s) => ({
    Icon: resolveIcon(s.icon) || LayoutGrid,
    title: stripHtml(s.title),
    desc:  s.desc || "",
  })) : null;

  return (
    <section className="py-16 sm:py-20 lg:py-24" style={{ background: "#F8FAFF" }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-4">
        {/* heading */}
        <div className="text-center max-w-[640px] mx-auto mb-14">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-[family-name:var(--font-figtree)] font-bold text-[24px] sm:text-[28px] capitalize leading-tight"
            style={{ color: "#191A2E" }}
          >
            <span style={{ color: "#7784C5" }}>{heading}</span>{" "}
            <span style={{ color: "#191A2E" }}>{headingAccent}</span>
          </m.h2>
        </div>

        {/* grid — 2 cols mobile, 3 cols tablet, 6 cols desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
          {(dynItems || SOLUTIONS).map((sol, i) => (
            <m.div
              key={sol.title || i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex flex-col gap-3"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#1D1F4B" }}>
                <sol.Icon size={18} style={{ color: "#ffffff" }} />
              </div>

              {/* title + accent */}
              <div>
                <h3
                  className="font-[family-name:var(--font-figtree)] font-bold text-[14px] leading-[1.3]"
                  style={{ color: "#101828" }}
                >
                  {sol.title}
                </h3>
                <div
                  className="w-10 h-[3px] rounded-full mt-2"
                  style={{ background: "#7784C5" }}
                />
              </div>

              {/* desc */}
              <div
                className="font-[family-name:var(--font-figtree)] text-[12px] leading-[1.6] [&_a]:underline [&_a]:underline-offset-2 [&_a]:text-[#474972] [&_a]:hover:text-[#1D1F4B] [&_p]:m-0"
                style={{ color: "#4A5565" }}
                dangerouslySetInnerHTML={{ __html: sol.desc }}
              />
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";
import { Globe, Smartphone, Brain, Code2, ShoppingCart, Cloud, Cpu, Boxes, Megaphone, ChevronRight } from "lucide-react";

const SERVICES = [
  {
    num: "01",
    Icon: Brain,
    title: "Artificial Intelligence",
    desc: "Intelligent platforms, predictive models, and AI-driven automation built into the software systems we deliver.",
    href: "/services/artificial-intelligence",
  },
  {
    num: "02",
    Icon: Code2,
    title: "Software Development",
    desc: "Custom platforms, SaaS products and enterprise software built end-to-end for your operational requirements.",
    href: "/services/software-development",
  },
  {
    num: "03",
    Icon: Smartphone,
    title: "Mobile App Development",
    desc: "Native and cross-platform mobile apps engineered for performance, scale, and a seamless user experience.",
    href: "/services/mobile-app-development",
  },
  {
    num: "04",
    Icon: Globe,
    title: "Web Development",
    desc: "Fast, responsive websites and web apps engineered for performance, accessibility, and search visibility.",
    href: "/services/web-development",
  },
  {
    num: "05",
    Icon: ShoppingCart,
    title: "eCommerce Development",
    desc: "Scalable online stores and marketplaces with secure checkout, payments, and inventory at their core.",
    href: "/services/ecommerce-development",
  },
  {
    num: "06",
    Icon: Cloud,
    title: "Cloud and DevOps",
    desc: "Cloud architecture, CI/CD pipelines, and infrastructure automation that keep your systems reliable and scalable.",
    href: "/services/cloud-and-devops-solutions",
  },
  {
    num: "07",
    Icon: Cpu,
    title: "IoT Development",
    desc: "Connected device ecosystems with real-time data pipelines, dashboards, and edge-to-cloud integration.",
    href: "/services/iot",
  },
  {
    num: "08",
    Icon: Boxes,
    title: "Blockchain Development",
    desc: "Smart contracts, decentralized apps, and secure ledger solutions built for trust and transparency.",
    href: "/services/blockchain-development",
  },
  {
    num: "09",
    Icon: Megaphone,
    title: "360 Digital Marketing",
    desc: "SEO, paid media, and content strategy that turn your platform into a measurable growth engine.",
    href: "/services/360-digital-marketing",
  },
];

// slug/title keyword → icon, so dynamically-fetched services still get a glyph.
const SERVICE_ICON_MAP = [
  { k: ["artificial-intelligence", "ai-services"], Icon: Brain },
  { k: ["software-dev", "software-development"], Icon: Code2 },
  { k: ["mobile-app", "mobile-application"], Icon: Smartphone },
  { k: ["web-dev", "web-development", "website"], Icon: Globe },
  { k: ["ecommerce", "e-commerce", "shopify", "magento", "woo"], Icon: ShoppingCart },
  { k: ["cloud", "devops"], Icon: Cloud },
  { k: ["iot", "internet-of-things"], Icon: Cpu },
  { k: ["blockchain", "crypto"], Icon: Boxes },
  { k: ["digital-marketing", "360", "marketing"], Icon: Megaphone },
];
const iconForService = (key = "") => {
  const s = String(key).toLowerCase();
  return SERVICE_ICON_MAP.find(({ k }) => k.some((w) => s.includes(w)))?.Icon ?? Globe;
};

export default function ServicesDeliver({ items, data }) {
  const heading       = data?.heading       || "The Services We Deliver";
  const headingAccent = data?.headingAccent || "Across These Industries";
  const intro         = data?.intro         || "Our industry expertise is backed by deep capability in the platforms we build. Every engagement draws on one or more of the following service areas.";

  // Prefer the dynamic list passed from the server; fall back to the static set.
  const source = items?.length ? items : (data?.items?.length ? data.items : SERVICES);
  const services = source.map((s, i) => ({
    num: s.num || String(i + 1).padStart(2, "0"),
    Icon: s.Icon || iconForService(s.slug || s.title || ""),
    title: s.title,
    desc: s.desc,
    href: s.href || (s.slug ? `/services/${s.slug}` : "#"),
  }));

  return (
    <section className="font-figtree py-12 sm:py-20 lg:py-24" style={{ background: "#F8FAFF" }}>
      <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:items-start">

          {/* ── left column ── */}
          <div>
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="ind-h2"
            >
              <span style={{ color: "#1D1F4B" }}>{heading} </span>
              <span style={{ color: "#7784C5" }}>{headingAccent}</span>
            </m.h2>

            {/* intro callout */}
            <m.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-9 pl-5"
              style={{ borderLeft: "4px solid #8C98D3" }}
            >
              <p className="ind-lead capitalize max-w-[560px]" style={{ color: "#1D1F4B" }}>
                {intro}
              </p>
            </m.div>

            {/* service rows — inner scroll so the full parent-service list stays
                within the section height and aligned with the right illustration */}
            <div className="custom-scrollbar mt-8 max-h-[420px] overflow-y-auto pr-3 lg:max-h-[520px]">
              {services.map((s, i) => {
                const Icon = s.Icon || Globe;
                return (
                  <m.div
                    key={s.num || i}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    className="flex items-center gap-5 py-7"
                    style={{ borderBottom: "0.8px solid #E8ECF5" }}
                  >
                    {/* number — hidden on small screens */}
                    <span className="ind-num hidden w-[clamp(38px,4vw,52px)] shrink-0 sm:block" style={{ color: "#1D1F4B" }}>
                      {s.num}
                    </span>

                    {/* icon */}
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] sm:h-[68px] sm:w-[68px] sm:rounded-[18px]"
                      style={{ background: "#1D1F4B", outline: "0.8px solid #E5EAFF", outlineOffset: "-0.8px" }}
                    >
                      <Icon className="h-5 w-5 text-white sm:h-7 sm:w-7" strokeWidth={1.8} />
                    </span>

                    {/* title + desc */}
                    <div className="min-w-0 flex-1">
                      <h3 className="ind-card-title" style={{ color: "#1D2033" }}>
                        <Link href={s.href || "#"} className="no-underline" style={{ color: "inherit" }}>
                          {s.title}
                        </Link>
                      </h3>
                      <p className="ind-body mt-1.5" style={{ color: "#3F3F3F" }}>{s.desc}</p>
                    </div>

                    {/* explore link */}
                    <Link
                      href={s.href || "#"}
                      className="ind-btn group hidden shrink-0 items-center gap-1.5 self-start pt-1 sm:flex"
                      style={{ color: "#1D1F4B" }}
                    >
                      Explore Service
                      <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </m.div>
                );
              })}
            </div>
          </div>

          {/* ── right column: services illustration ── */}
          <m.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto w-full max-w-[560px] rounded-[31px] p-6 sm:p-10 lg:sticky lg:top-24 lg:self-start"
            style={{ background: "linear-gradient(180deg, #F4F7FF 0%, #FFFFFF 100%)" }}
          >
            <Image
              src="/industries_page/services.webp"
              alt="Services delivered illustration"
              width={600}
              height={600}
              className="h-auto w-full"
            />
          </m.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { Lightbulb, Check, ChevronRight } from "lucide-react";

const CARD_BG = "linear-gradient(180deg, #576099 0%, #3A4066 50%, #1D2033 100%)";
const BTN_BG = "linear-gradient(90deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)";

// Fixed engagement models — content is static; only the section heading and
// subtitle are editable from the CMS.
// The three engagement models are a fixed design element, identical on every
// template — the admin editor only exposes the heading and subtitle, and no
// template overrides these any more.
const DEFAULT_PLANS = [
  {
    title: "Fixed Cost",
    bestFor: "Best for: scope that is already nailed down, and a price you want nailed down with it",
    points: [
      "Price, timeline and scope agreed before a line of code gets written, and they stay agreed",
      "Milestones with acceptance criteria you personally sign off, one by one",
      "The low-risk route for MVPs and launches with a hard deadline attached",
      "If mid-project surprises are what worry you, this model exists to prevent them",
    ],
    ctaText: "Get a Quote",
    ctaLink: "/contact-us",
    popular: false,
  },
  {
    title: "Dedicated Team",
    bestFor: "Best for: products that will keep evolving long after version one ships",
    points: [
      "Engineers, designers, QA and a PM who work as part of your team, not around it",
      "You set sprint priorities. We build them. That simple",
      "Grow or shrink the team as the roadmap demands, without renegotiating everything",
      "Plugs into whatever tools and workflows your team already runs",
      "You talk to the people writing your code. Never through an account manager",
    ],
    ctaText: "Post Your Requirement",
    ctaLink: "/post-requirement",
    popular: true,
  },
  {
    title: "Staff Augmentation",
    bestFor: "Best for: a skill gap today, or velocity you need by next sprint",
    points: [
      "Specialists who slot into your existing team and standups from day one",
      "Senior skills without the cost, or the three-month wait, of a full-time hire",
      "Add people when timelines tighten, release them when things calm down",
      "Onboarded and shipping within days. Not months. Days",
    ],
    ctaText: "Hire Team",
    ctaLink: "/services/staff-augmentation",
    popular: false,
  },
];


function PlanCard({ plan, index }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex flex-col rounded-2xl p-7 sm:p-8 ${
        plan.popular ? "z-10 lg:-my-10 shadow-[0_24px_55px_rgba(0,0,0,0.35)]" : ""
      }`}
      style={{ background: CARD_BG, ...(plan.popular && { outline: "1.5px solid #889AF5", outlineOffset: "-1.5px" }) }}
    >
      {/* MOST POPULAR badge — sits on the card's top-right corner. It used to sit
          at top-14, level with the heading, which a short title like "Dedicated
          Team" cleared but a longer one runs straight underneath. */}
      {plan.popular && (
        <span
          className="absolute -top-3 -right-3 z-20 rounded-lg px-4 py-2 font-figtree font-bold text-white text-[12px] whitespace-nowrap"
          style={{ background: "#7784C5", border: "1px solid #ffffff", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}
        >
          MOST POPULAR
        </span>
      )}

      {/* header: icon + title */}
      <div className="flex items-center gap-4 mb-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]" style={{ background: "#1D1F4B" }}>
          <Lightbulb size={22} className="text-white" />
        </span>
        <h3 className="font-figtree font-bold uppercase text-white text-[20px] sm:text-[22px] leading-tight">
          {plan.title}
        </h3>
      </div>

      {/* best for */}
      <p className="font-figtree font-medium uppercase text-[14px] sm:text-[15px] leading-snug mb-6" style={{ color: "rgba(255,255,255,0.92)" }}>
        {plan.bestFor}
      </p>

      {/* checklist */}
      <ul className="space-y-4 mb-8 flex-1">
        {(plan.points || []).map((pt, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Check size={16} className="mt-0.5 shrink-0 text-white" />
            <span className="font-figtree italic text-[14px] sm:text-[15px] leading-snug" style={{ color: "rgba(255,255,255,0.85)" }}>
              {pt}
            </span>
          </li>
        ))}
      </ul>

      {/* cta */}
      <div className="mt-auto flex justify-center">
        <Link
          href={plan.ctaLink || "/contact-us"}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-5 sm:px-7 py-3 sm:py-3.5 text-center font-figtree font-medium text-white text-[14px] sm:text-[15px] leading-snug transition-transform duration-300 hover:-translate-y-0.5"
          style={{ background: BTN_BG, boxShadow: "0 10px 30px rgba(0,0,0,0.3)", outline: "1.5px solid #889AF5", outlineOffset: "-1.5px" }}
        >
          {plan.ctaText}
          <ChevronRight size={16} className="shrink-0" />
        </Link>
      </div>
    </m.div>
  );
}

export default function MadEngagement({ data }) {
  const heading = data?.heading || "Flexible Engagement Models";
  const headingTail = data?.headingTail || "For Mobile App Development";
  const subtitle = data?.subtitle || "";
  // When `tailAccent` is set the gradient moves to the tail (second part) and the
  // lead becomes dark — default keeps the original lead-gradient look.
  const tailAccent = !!data?.tailAccent;
  const GRADIENT = "linear-gradient(90deg, #7784C5 0%, #B7BEED 50%, #6077EC 100%)";
  // Plans default to the built-in set; a template may pass its own via data.plans.
  const plans = data?.plans?.length ? data.plans : DEFAULT_PLANS;

  return (
    <section className="py-16 sm:py-20 lg:py-24" style={{ background: "#F8FAFF" }}>
      <div className="max-w-[1400px] mx-auto px-4">
        {/* heading */}
        <div className="text-center max-w-[1040px] mx-auto mb-12 lg:mb-16">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-figtree font-bold text-[24px] sm:text-[28px] capitalize leading-tight mb-5"
          >
            <span
              className={tailAccent ? "" : "text-transparent bg-clip-text"}
              style={tailAccent ? { color: "#1D1F4B" } : { backgroundImage: GRADIENT }}
            >
              {heading}
            </span>{" "}
            <span
              className={tailAccent ? "text-transparent bg-clip-text" : ""}
              style={tailAccent ? { backgroundImage: GRADIENT } : { color: "#1D1F4B" }}
            >
              {headingTail}
            </span>
          </m.h2>
          {subtitle && (
            <m.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-figtree text-[14px] sm:text-[15px] leading-[1.7]"
              style={{ color: "#1D1F4B" }}
            >
              {subtitle}
            </m.p>
          )}
        </div>

        {/* plan cards — middle one elevated */}
        <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan, i) => (
            <PlanCard key={plan.title || i} plan={plan} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

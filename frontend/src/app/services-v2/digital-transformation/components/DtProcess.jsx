"use client";

import useIsDesktop from "@/hooks/useIsDesktop";

const ACCENT_GRADIENT =
  "linear-gradient(6.407deg, #7784C5 33.662%, #B7BEED 48.02%, #6077EC 58.532%, #7683C5 85.197%)";

const DASHED = "border-dashed border-[#1D1F4B]";

const STEPS = [
  {
    n: "01",
    eyebrow: "Step 01 · Strategy",
    title: "Business Analysis and Transformation Strategy",
    body: "We start by understanding your current systems, workflows, and the specific business challenges driving the initiative. Inefficiencies, gaps, and real opportunities get mapped across departments before a single recommendation gets made.",
    quote: "A transformation roadmap built before the diagnosis is a guess wearing a strategy's clothes.",
  },
  {
    n: "02",
    eyebrow: "Step 02 · Architecture",
    title: "Technology Assessment and Architecture Planning",
    body: "Your existing technology stack gets evaluated honestly, what's worth keeping, what's actively holding you back, and the architecture required to support real scalability gets defined from there. Cloud, AI, data, and automation choices all get made against your actual constraints, not a generic reference stack.",
    quote: "The wrong architecture decision here gets expensive to unwind eighteen months in.",
  },
  {
    n: "03",
    eyebrow: "Step 03 · Redesign",
    title: "Process Redesign and System Integration",
    body: "Core business processes get redesigned to eliminate the inefficiency, not just digitized in their current broken shape. At the same time, we integrate the systems that actually need to talk to each other, ERP, CRM, and third-party tools, closing the data silos that caused half the original problem.",
    quote: "Automating a broken process just makes the broken process happen faster.",
  },
];

const STEPS_TWO = [
  {
    n: "06",
    eyebrow: "Step 06 · Adoption and Growth",
    title: "Deployment, Change Management, and Continuous Improvement",
    body: "Deployment happens with minimal disruption to daily operations, backed by training and change management that gets the organization actually using what was built, not just technically live. We stay engaged afterward, monitoring performance and implementing improvements as the business's needs keep evolving.",
    quote: "A transformation roadmap built before the diagnosis is a guess wearing a strategy's clothes.",
  },
  {
    n: "05",
    eyebrow: "Step 05 · Validation",
    title: "Testing, Security, and Optimization",
    body: "Every system gets tested for reliability, security, and real-world performance before anyone calls it finished, with continuous optimization built in rather than treated as a one-time pre-launch checklist. Compliance and data integrity get validated alongside functionality, not after.",
    quote: "A system that passes a demo and fails under real load was never actually tested.",
  },
  {
    n: "04",
    eyebrow: "Step 04 · Build",
    title: "Development and Implementation",
    body: "Digital solutions get built and deployed against your actual requirements, applications, automation systems, data platforms, with scalability and integration treated as first-class requirements from the start, not retrofitted after launch.",
    quote: "Implementation that ignores integration produces another disconnected system, just a newer one.",
  },
];

const ALL_STEPS = [...STEPS, ...[...STEPS_TWO].reverse()];

function Badge({ n }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full bg-[#1D1F4B] font-figtree font-bold tracking-[0.0125em] text-white size-[clamp(40px,3.156vw,60px)] text-[14px] sm:text-[15px] lg:text-[16px]">
      {n}
    </span>
  );
}

function Connector({ bridgeGap, dot }) {
  return (
    <span
      aria-hidden
      className={`flex min-w-0 flex-1 items-center gap-[2px] ${
        dot ? "ml-[clamp(10px,1.052vw,20px)]" : "ml-0"
      } ${bridgeGap ? "lg:mr-[-1.946vw]" : ""}`}
    >
      {dot && (
        <span className="shrink-0 rounded-full bg-[#1D1F4B] size-[clamp(7px,0.561vw,10.667px)]" />
      )}
      <span className={`min-w-0 flex-1 border-t-2 ${DASHED}`} />
    </span>
  );
}

function BadgeRow({ steps, dropLastDot }) {
  return (
    <div className="hidden lg:grid lg:grid-cols-3 lg:gap-x-[2.180%]">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={i} className="flex items-center">
            <Badge n={seq(step.n, i)} />
            <Connector bridgeGap={!isLast} dot={!(dropLastDot && isLast)} />
          </div>
        );
      })}
    </div>
  );
}

function StepCard({ step, minHeight, layout }) {
  return (
    <div
      className={`flex flex-col rounded-[24px] border-[0.8px] border-[rgba(49,91,255,0.3)] bg-white px-[clamp(18px,1.368vw,26px)] pb-[clamp(18px,1.368vw,26px)] pt-[clamp(26px,2.525vw,48px)] ${layout} ${minHeight}`}
    >
      <p className="pb-[10px] font-figtree font-bold uppercase leading-[1.2] tracking-[0.1167em] text-[#315BFF] text-[clamp(12px,0.947vw,18px)]">
        {step.eyebrow}
      </p>

      <h3 className="pb-[13px] font-figtree font-extrabold leading-[1.4] tracking-[-0.0158em] text-[#0D124A] text-[20px] sm:text-[22px] lg:w-[102.45%]">
        {step.title}
      </h3>

      <p className="font-figtree font-normal leading-[1.68] text-[#3D4680] text-[clamp(14px,1.052vw,20px)]">
        {step.body}
      </p>

      <div className="pt-[clamp(12px,0.947vw,18px)]">
        <div
          className="rounded-[10px] border-l-[2.4px] border-[#315BFF] px-[15px] py-[13px]"
          style={{ background: "rgba(49,91,255,0.05)" }}
        >
          <p className="font-figtree font-normal italic leading-[1.17] text-[#0D124A] text-[14px] sm:text-[15px] lg:text-[16px]">
            &ldquo;{step.quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

function CardRow({ steps, minHeight }) {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 lg:gap-x-[2.180%] lg:gap-y-0">
      {steps.map((step, i) => (
        <StepCard
          key={i}
          step={step}
          layout="w-[82vw] shrink-0 snap-start md:w-auto md:shrink"
          minHeight={minHeight}
        />
      ))}
    </div>
  );
}

const seq = (n, i) => n || String(i + 1).padStart(2, "0");

export default function DtProcess({ data } = {}) {
  const isDesktop = useIsDesktop();
  const heading = data?.heading || "Our Digital Transformation";
  const headingAccent = data?.headingAccent || "Process";
  const intro =
    data?.intro ||
    "Six stages, and skipping the first one is the single most common reason a transformation initiative ends up solving the wrong problem well.";
  const steps = data?.steps?.length === 6 ? data.steps : ALL_STEPS;
  const rowOne = steps.slice(0, 3);
  const rowTwo = steps.slice(3, 6).reverse();
  const allSteps = steps;

  return (
    <section className="relative w-full overflow-hidden bg-[#F8FAFF]">
      <div className="mx-auto w-full max-w-[1901px] px-5 py-8 sm:px-8 lg:px-0 lg:py-[2.576vw] lg:pl-[4.682%] lg:pr-[6.049%]">
        <h2 className="font-figtree font-semibold capitalize leading-[1.02] text-[24px] sm:text-[28px]">
          <span className="text-[#1D1F4B]">{heading} </span>
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: ACCENT_GRADIENT }}>
            {headingAccent}
          </span>
        </h2>
        <p className="mt-[clamp(10px,0.947vw,18px)] font-figtree font-normal leading-[1.1] text-[#1D1F4B] text-[14px] sm:text-[15px] lg:text-[16px] lg:w-[59.93%]">
{intro}
        </p>

        {!isDesktop && (
          <div className="mt-10">
            <CardRow steps={allSteps} minHeight="" />
          </div>
        )}

        {isDesktop && (
        <>
        <div className="relative lg:mt-[1.526vw]">
          <div
            aria-hidden
            className={`pointer-events-none absolute bottom-[1.578vw] right-[-4.420%] top-[1.578vw] hidden w-[3.946vw] rounded-br-[3.156vw] rounded-tr-[3.156vw] border-2 border-l-0 lg:block ${DASHED}`}
          />

          <BadgeRow steps={rowOne} />
          <div className="lg:mt-[1.052vw]">
            <CardRow steps={rowOne} minHeight="lg:min-h-[24.882vw]" />
          </div>

          <div className="mt-10 lg:mt-[1.420vw]">
            <BadgeRow steps={rowTwo} dropLastDot />
          </div>
        </div>

        <div className="lg:mt-[0.842vw]">
          <CardRow steps={rowTwo} minHeight="lg:min-h-[26.354vw]" />
        </div>
        </>
        )}
      </div>
    </section>
  );
}

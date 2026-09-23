// Default content for the Staff Augmentation template.
// Mirrors the Figma source (node 1017:2050 and its three sibling frames).
// Every export here is a fallback: when the Updated Services CMS record
// supplies the matching section, the CMS value wins.

// ── Hiring-gap capsules (Figma node 1046:4166) ──────────────────────────────
// Height alternates and the centre capsule's extra width are both derived from
// position in StaffAugHiringGapSection; the filled treatment is hover-only.
export const SA_HIRING_GAP_POINTS = [
  {
    icon: "Clock",
    text: "A senior engineer opening in 2026 takes, on average, longer to fill than the sprint that actually needed them.",
  },
  {
    icon: "FastForward",
    text: "By the time an offer gets signed, the roadmap has usually moved twice.",
  },
  {
    icon: "Users",
    text: "Akoode is not a recruitment agency that hands you a resume and disappears.",
  },
  {
    icon: "TrendingUp",
    text: "Traditional hiring solves none of these on a useful timeline. Three to four months is normal.",
  },
  {
    icon: "Shield",
    text: "There is a second, quieter cost too. Every open role is a role your existing team is covering informally, usually badly, usually at the expense of the thing they were actually hired to do.",
  },
];

// ── Services accordion (Figma nodes 1066:1746 / 1068:2058) ──────────────────
// Each entry renders one collapsible ServiceRow. `blocks` are the definition
// panels; `steps` are the five timeline nodes underneath them.
export const SA_SERVICES = [
  {
    title: "IT Staff Augmentation",
    duration: "2–3 Weeks",
    price: "On Request",
    blocks: [
      {
        label: "What it is",
        body: "Individual engineers, designers, QA specialists or DevOps professionals added directly into your existing team and reporting into your process.",
      },
      {
        label: "Problem it solves",
        body: "A defined skill gap on a team that otherwise runs fine, where hiring permanently would be slower and more expensive than the gap justifies.",
      },
      {
        label: "Typical engagement",
        body: "We shortlist within days against your actual stack, run a technical screen alongside your team if you want visibility, and the engineer joins your standups, your sprint tooling and your codebase inside two to three weeks.",
      },
      {
        label: "Outcome",
        body: "The gap closes without a six-month hiring cycle, and you keep full control over how the work gets prioritised.",
      },
    ],
    steps: [
      "Shortlist & fit engineers",
      "Technical screening with your team",
      "Onboarding & integration",
      "Active delivery in your sprints",
      "Review & continuous support",
    ],
  },
  {
    title: "Dedicated Development Team Extension",
    duration: "4+ Weeks",
    price: "On Request",
    blocks: [
      {
        label: "What it is",
        body: "A multi-person team, engineers, a QA lead, sometimes a PM, functioning as an extension of your in-house team for an extended build.",
      },
      {
        label: "Problem it solves",
        body: "A roadmap bigger than your current headcount can carry, where the work is genuinely long-term rather than a single sprint's worth of relief.",
      },
      {
        label: "Outcome",
        body: "Delivery capacity that scales with the roadmap, with the same engineers staying on the product long enough to actually understand it.",
      },
    ],
    steps: [
      "Understand your roadmap & gaps",
      "Team composition & planning",
      "Team setup & integration",
      "Aligned to your sprint cadence",
      "Long-term delivery & optimisation",
    ],
  },
  {
    title: "Short-Term & Project-Based Augmentation",
    duration: "1-12 Weeks",
    price: "On Request",
    blocks: [
      {
        label: "What it is",
        body: "Engineers brought in for a defined window, a migration, a launch push, a specific feature, with a clear start and end date agreed upfront.",
      },
      {
        label: "Problem it solves",
        body: "Work that genuinely does not justify permanent hiring, but still needs senior hands, not a generalist spread too thin across five other things.",
      },
      {
        label: "Outcome",
        body: "The spike gets absorbed without a permanent cost sitting on the books once it is over.",
      },
    ],
    steps: [
      "Scope & timeline agreed",
      "Right engineers for the job",
      "Focused execution & collaboration",
      "Quality delivery & testing",
      "Handover or smooth offboarding",
    ],
  },
  {
    title: "Specialised Skill Augmentation",
    duration: "2-12 Weeks",
    price: "On Request",
    blocks: [
      {
        label: "What it is",
        body: "Engineers in skills that are genuinely hard to hire permanently right now, AI and machine learning, DevOps and platform engineering, cloud architecture, security, and senior QA automation.",
      },
      {
        label: "Problem it solves",
        body: "A roadmap that needs one specific, scarce skill for a defined stretch of work, where a full-time hire would sit underused once that stretch ends.",
      },
      {
        label: "Outcome",
        body: "Access to expertise your permanent team does not have to carry year-round, without the cost of carrying it year-round anyway.",
      },
    ],
    steps: [
      "Skill requirement & context",
      "Expert matching & validation",
      "Plug into architecture & decisions",
      "Execute with depth & quality",
      "Deliver knowledge & impact",
    ],
  },
  {
    title: "Offshore Staff Augmentation",
    duration: "4+ Weeks",
    price: "On Request",
    blocks: [
      {
        label: "What it is",
        body: "Engineers based in India working as a genuine extension of teams in the US, UK, EU and UAE, with working hours structured around meaningful overlap.",
      },
      {
        label: "Problem it solves",
        body: "Local hiring markets that are either too expensive, too slow, or too thin on the specific skill you need right now.",
      },
      {
        label: "Outcome",
        body: "Senior engineering capacity at a materially different cost structure, without the communication friction the model gets stereotyped for.",
      },
    ],
    steps: [
      "Overlap hours agreed upfront",
      "Team aligned to your timezone & tools",
      "Seamless collaboration & communication",
      "Consistent delivery & visibility",
      "Long-term partnership & scaling",
    ],
  },
  {
    title: "Contract-to-Hire Augmentation",
    duration: "3–6 Months",
    price: "On Request",
    blocks: [
      {
        label: "What it is",
        body: "An augmented engineer who works with your team for an agreed period with the explicit option to convert to a direct hire.",
      },
      {
        label: "Problem it solves",
        body: "The real risk in permanent hiring, that a resume and four interviews do not tell you how someone actually works inside your team.",
      },
      {
        label: "Outcome",
        body: "A hiring decision made on months of real working evidence instead of a handful of interview hours.",
      },
    ],
    steps: [
      "Engineer joins on contract",
      "Works within your team & processes",
      "Performance review & alignment",
      "Conversion decision (if both agree)",
      "Seamless transition to permanent hire",
    ],
  },
  {
    title: "Managed Staff Augmentation",
    duration: "4+ Weeks",
    price: "On Request",
    blocks: [
      {
        label: "What it is",
        body: "Augmented engineers plus a delivery lead on our side who owns quality, coordination and reporting, for clients who want capacity without adding management overhead of their own.",
      },
      {
        label: "Problem it solves",
        body: "Teams that need extra hands but do not have spare management bandwidth to directly supervise contractors day to day.",
      },
      {
        label: "Outcome",
        body: "Added capacity that runs itself operationally, with visibility into progress without you having to chase it.",
      },
    ],
    steps: [
      "Delivery lead assigned",
      "Planning & milestones agreed",
      "Execution, QA & quality control",
      "Regular reporting & updates",
      "Escalate early, not at deadline",
    ],
  },
];

// ── Trends (feeds WhatsChanging) ────────────────────────────────────────────
// Icon keys must exist in utils/adminIconMap.js or resolveIcon silently falls
// back to FiZap.
export const SA_TRENDS = [
  {
    icon: "FiClock",
    title: "Hiring Cycles Keep Outrunning Roadmaps",
    desc: "Senior engineering roles now take three to four months to close. Roadmaps do not pause for that, so the gap gets absorbed by whoever is already stretched.",
  },
  {
    icon: "FiCode",
    title: "AI and Platform Skills Are Scarce, Not Absent",
    desc: "ML, DevOps and cloud-architecture specialists exist, but rarely want a permanent seat. Access matters more than headcount for these skills.",
  },
  {
    icon: "FiUsers",
    title: "Distributed Teams Are Now the Default",
    desc: "Overlap hours, async handovers and shared tooling are standard practice. Where an engineer sits matters far less than how they integrate.",
  },
  {
    icon: "FiTrendingUp",
    title: "Budgets Favour Flexible Capacity",
    desc: "Committing to permanent headcount for temporary work is a harder sell than it was. Teams increasingly scale up and back down deliberately.",
  },
  {
    icon: "FiShield",
    title: "Contractor Governance Is Under Scrutiny",
    desc: "Security reviews, IP ownership and compliance now get checked before an external engineer touches a repository, not after.",
  },
];

// Feeds WebDevelopmentWhyChooseSection, whose own defaults are web-development
// specific. Icon keys must exist in utils/adminIconMap.js or resolveIcon
// silently falls back to FiZap.
export const SA_WHY_CHOOSE_CARDS = [
  {
    icon: "FiClock",
    title: "Shortlists In Days, Not Quarters",
    desc: "We shortlist against your actual stack within days and have the engineer in your standups inside two to three weeks, not three to four months.",
  },
  {
    icon: "FiUsers",
    title: "Engineers, Not Resumes",
    desc: "We are not a recruitment agency that hands over a CV and disappears. The people we place stay accountable to us and integrated with you.",
  },
  {
    icon: "FiToggleRight",
    title: "Scale Up, And Back Down",
    desc: "Add capacity when timelines tighten and release it when they do not, without renegotiating the whole engagement every time the roadmap moves.",
  },
  {
    icon: "FiShield",
    title: "Governance Handled Upfront",
    desc: "IP ownership, security review and compliance are agreed before anyone touches a repository, so procurement is not the thing that delays the start.",
  },
];

// ── Capabilities grid (Figma node 1072:526) ─────────────────────────────────
export const SA_CAPABILITIES = [
  {
    title: "Rapid Technical Vetting",
    desc: "Every engineer clears a structured technical assessment specific to your stack before you see a profile, not a generic aptitude test. You are shown candidates who have already proven the specific skill, not ones who might grow into it.",
  },
  {
    title: "Security and Compliance Onboarding",
    desc: "Background checks, NDA execution, access provisioning and compliance training run before day one, scaled to what your industry actually requires. A financial services client and an early-stage startup do not need the same onboarding, and we do not treat them like they do.",
  },
  {
    title: "Time Zone Aligned Delivery",
    desc: "Overlap hours are set deliberately against your team's working day, not left to chance. Standups, code review turnaround and incident response are planned around when your team is actually online.",
  },
  {
    title: "Tooling and Access Provisioning",
    desc: "Engineers arrive ready to work in your stack: repository access, CI/CD, project management tools and communication platforms configured before the first standup, not fumbled through in week two.",
  },
  {
    title: "Performance Management and Replacement",
    desc: "Placements are monitored against agreed expectations, not left to surface problems on their own. If a placement genuinely is not working, replacement happens fast and without the awkward renegotiation most vendors put you through.",
  },
  {
    title: "Scalable Ramp Up and Ramp Down",
    desc: "Team size flexes with the roadmap in both directions. Adding a second engineer for a crunch period, or releasing one once a project winds down, does not require renegotiating the entire arrangement each time.",
  },
];

// ── Which model fits (Figma node 1084:792) ──────────────────────────────────
// `icon` on questions is a key of QUESTION_ICONS, and on models a key of
// MODEL_ICONS, both in StaffAugModelFitSection.
export const SA_MODEL_FIT = {
  heading: "Staff Augmentation, Dedicated Teams, or Full Outsourcing:",
  headingAccent: "Which one Actually Fits",
  intro:
    "These three models get used interchangeably in sales conversations and they should not be. Each solves a different shaped problem, and picking the wrong one is the most common reason an engagement disappoints on both sides.",
  questions: [
    { icon: "Users", text: "Do you have an existing team and leadership in place?" },
    { icon: "TrendingUp", text: "Do you need ongoing support to build and scale your product?" },
    { icon: "Target", text: "Do you want the vendor to own delivery of a defined outcome?" },
  ],
  models: [
    {
      icon: "User",
      name: "Staff Augmentation",
      fit: "A defined skill gap on a team that already has process and leadership in place",
      directs: "Your team, your process",
      duration: "Weeks to several months",
    },
    {
      icon: "Users",
      name: "Dedicated Team",
      fit: "A roadmap larger than current headcount, ongoing product development",
      directs: "Shared, with your product direction",
      duration: "Months to years",
    },
    {
      icon: "FileText",
      name: "Full Project Outsourcing",
      fit: "A defined skill gap on a team that already has process and leadership in place",
      directs: "The vendor, against agreed specs",
      duration: "Fixed project length",
    },
  ],
  quotes: [
    "If your team already has strong technical leadership and simply needs more hands executing against that direction, staff augmentation is usually the right call.",
    "If you are missing that leadership entirely, or the whole product needs building from a standing start, a dedicated team or a fixed-scope project is often the more honest answer, and we will tell you so during scoping rather than sell augmentation because it is the easier close.",
  ],
  warningTitle: "When Staff Augmentation Is Not the Right Fit",
  warningParagraphs: [
    "Augmentation works badly when a team has no existing technical leadership to plug an engineer into, when the work needs a single accountable vendor for a fixed deliverable, or when the gap is really a process problem that more headcount will not fix.",
    "We would rather say that in the first call than three months into a placement that was never going to work.",
  ],
};

// ── Engagement models (staff-augmentation only) ─────────────────────────────
// Every other template shares the fixed Fixed Cost / Dedicated Team / Staff
// Augmentation set in MadEngagement; this page bills differently, so it passes
// its own three. The middle card keeps `popular` so the row keeps the lifted
// centre card, accent outline and badge every other template has.
export const SA_ENGAGEMENT_PLANS = [
  {
    title: "Long-Term Dedicated Hire",
    bestFor:
      "Best for: teams that need a dedicated engineer functioning as a full-time equivalent for the long haul",
    points: [
      "A dedicated developer who works exclusively on your product, not split across other client accounts",
      "Functions as a true FTE extension of your team, same engineer, same context, month after month",
      "Priced as a flat monthly rate per resource, not an hourly meter running in the background",
      "Built for teams that know this isn't a three-month gap, it's a permanent seat they're not ready to hire locally for yet",
      "Lower effective cost per hour than short-term engagements, since neither side is re-negotiating scope every few weeks",
    ],
    ctaText: "Get Dedicated Hire Pricing",
    ctaLink: "/contact-us",
    popular: false,
  },
  {
    title: "Monthly & Hourly Billing",
    bestFor:
      "Best for: flexible capacity where the workload shifts month to month, or you just need a defined number of hours",
    points: [
      "Choose a monthly retainer for predictable recurring capacity, or pure hourly billing when the ask is smaller and doesn't justify a full monthly block",
      "Scale hours up during a sprint crunch, scale down the moment things calm down, no renegotiation required",
      "Transparent hourly rate by skill and seniority, so you know exactly what a senior DevOps hour costs versus a mid-level QA hour",
      "No minimum long-term commitment, month-to-month or hour-by-hour, cancel or adjust with notice",
      "The right fit when you're still validating whether this is a long-term need or a short-term gap",
    ],
    ctaText: "See Monthly & Hourly Rates",
    ctaLink: "/contact-us",
    popular: true,
  },
  {
    title: "Quarterly Billing",
    bestFor:
      "Best for: enterprise teams whose budget cycles and procurement approvals run on a quarterly rhythm",
    points: [
      "One quarterly invoice instead of three separate monthly ones, built for finance teams that plan and approve spend in quarters",
      "Locked-in rate for the full quarter, so a rate change mid-cycle never surfaces on an unexpected invoice",
      "Meaningful cost savings versus month-to-month billing, in exchange for the quarter-long commitment",
      "Fits naturally alongside enterprise procurement and vendor approval processes that already run on this cadence",
      "Capacity planning done once per quarter instead of re-litigated monthly",
    ],
    ctaText: "Request Quarterly Pricing",
    ctaLink: "/contact-us",
    popular: false,
  },
];

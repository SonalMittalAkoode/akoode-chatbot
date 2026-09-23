// Content for the shared sections this page imports from the staff-augmentation
// and mobile-app-development templates. Each shared component falls back to its
// own defaults when a key is absent, so only DevOps-specific copy lives here.

export const DEVOPS_PROCESS_STEPS = [
  {
    num: "01",
    label: "Assessment",
    stageTitle: "Infrastructure Assessment",
    intro:
      "Before proposing a pipeline or a platform, we map what you are actually running: environments, deploy paths, failure history and the parts nobody wants to touch.",
    points: [
      "Audit environments, services and deploy paths",
      "Review incident history and recovery times",
      "Identify the constraints driving cost and risk",
      "Agree what success looks like in measurable terms",
    ],
    outcome: "A written picture of the current state and a fixed estimate built on it, not on assumptions.",
  },
  {
    num: "02",
    label: "Architecture",
    stageTitle: "Target Architecture",
    intro:
      "We design the end state before touching anything, so the migration path is a decision you sign off on rather than something discovered mid-project.",
    points: [
      "Define cloud topology, networking and environments",
      "Choose orchestration to match team size, not fashion",
      "Plan cost controls and scaling behaviour up front",
      "Document rollback and disaster-recovery paths",
    ],
    outcome: "An architecture your team understands and can defend, with the trade-offs written down.",
  },
  {
    num: "03",
    label: "Pipelines",
    stageTitle: "CI/CD Implementation",
    intro:
      "Automated build, test and deploy pipelines that remove the manual steps where releases usually break.",
    points: [
      "Build and test automation on every commit",
      "Environment promotion with approval gates",
      "Secrets management and artefact versioning",
      "Automated rollback on failed health checks",
    ],
    outcome: "Releases that take minutes and no longer need a senior engineer standing by.",
  },
  {
    num: "04",
    label: "Security",
    stageTitle: "DevSecOps & Compliance",
    intro:
      "Security checks belong inside the pipeline, not in an audit that happens after the code already shipped.",
    points: [
      "Dependency and container image scanning",
      "Policy-as-code and infrastructure compliance checks",
      "Access control, audit trails and secret rotation",
      "Evidence collection for SOC 2, HIPAA or PCI DSS",
    ],
    outcome: "Compliance evidence produced continuously instead of assembled in a panic each cycle.",
  },
  {
    num: "05",
    label: "Observability",
    stageTitle: "Monitoring & Observability",
    intro:
      "Dashboards, logs and alerting tuned so the team hears about problems before a customer reports them.",
    points: [
      "Metrics, logs and traces in one place",
      "SLOs defined per service with error budgets",
      "Alert routing that avoids fatigue",
      "Cost attribution per service and environment",
    ],
    outcome: "Alerts that mean something, and the data to prove where time and money actually go.",
  },
  {
    num: "06",
    label: "Handover",
    stageTitle: "Handover or Ongoing Ownership",
    intro:
      "Either your team takes it from here with documentation they can follow, or we keep running it against agreed SLOs.",
    points: [
      "Runbooks and architecture documentation",
      "Working sessions with your engineers",
      "Optional on-call rotation and incident response",
      "Quarterly review of cost, reliability and scale",
    ],
    outcome: "Infrastructure your team can run without us, and a standing option for us to run it if you prefer.",
  },
];

export const DEVOPS_FAQ_ITEMS = [
  {
    q: "How long does a typical cloud migration take?",
    a: "Six to twelve weeks for a full migration, two to four for a CI/CD pipeline, four to eight for containerization and Kubernetes. The estimate is fixed after the technical assessment, not before it.",
  },
  {
    q: "Do you work with our existing cloud provider?",
    a: "Yes. We work across AWS, Azure and Google Cloud, and we will tell you if staying put is the cheaper answer rather than selling you a migration you do not need.",
  },
  {
    q: "Can you take over infrastructure someone else built?",
    a: "That is most of what we do. We start with an assessment of what exists, document it, then decide with you what is worth keeping and what has to change.",
  },
  {
    q: "Do we need Kubernetes?",
    a: "Often no. Kubernetes earns its operational overhead on genuinely complex multi-service systems. Smaller teams are usually better served by a managed container platform, and we will say so.",
  },
  {
    q: "What happens after the project ends?",
    a: "You get runbooks, architecture documentation and working sessions with your engineers. If you would rather not own it, managed DevOps with agreed SLOs is available as a retainer.",
  },
  {
    q: "How do you handle compliance requirements?",
    a: "Compliance checks run inside the pipeline. For SOC 2, HIPAA or PCI DSS-aligned work, evidence is collected continuously so audits stop being a separate project.",
  },
];

// MadEngagement ships three generic plans; this page bills by infrastructure
// engagement shape instead, so it overrides them. `bestFor` carries its own
// "Best for:" prefix, matching SA_ENGAGEMENT_PLANS.
export const DEVOPS_ENGAGEMENT_PLANS = [
  {
    title: "Fixed Cost",
    bestFor: "Best for: scope that is already nailed down, and a price you want nailed down with it",
    points: [
      "Price, timeline and scope agreed before a line of code gets written, and they stay agreed",
      "Milestones with acceptance criteria you personally sign off, one by one",
      "The low-risk route for a defined migration or pipeline build with a hard deadline attached",
      "If mid-project surprises are what worry you, this model exists to prevent them",
    ],
    ctaText: "Get a Quote",
    ctaLink: "/contact-us",
    popular: false,
  },
  {
    title: "Dedicated Team",
    bestFor: "Best for: infrastructure that will keep evolving long after the first migration ships",
    points: [
      "Engineers who work as part of your team, not around it",
      "You set priorities. We build them. That simple",
      "Grow or shrink the engagement as infrastructure needs change, without renegotiating everything",
      "Plugs into whatever tools and workflows your team already runs",
      "You talk to the people writing your infrastructure code. Never through an account manager",
    ],
    ctaText: "Post Your Requirement",
    ctaLink: "/contact-us",
    popular: true,
  },
  {
    title: "Staff Augmentation",
    bestFor: "Best for: a DevOps skill gap today, or capacity you need by next sprint",
    points: [
      "Specialists who slot into your existing team and standups from day one",
      "Senior DevOps and cloud skills without the cost, or the three-month wait, of a full-time hire",
      "Add capacity when a migration tightens the timeline, release it when things calm down",
      "Onboarded and shipping within days. Not months. Days",
    ],
    ctaText: "Hire Team",
    ctaLink: "/contact-us",
    popular: false,
  },
];

export const DEVOPS_INDUSTRIES = [
  {
    title: "Fintech",
    desc: "Regulated deployment paths, audit trails and zero-downtime releases for systems where a failed deploy is a reportable incident.",
  },
  {
    title: "Healthcare",
    desc: "HIPAA-aligned infrastructure with access controls and evidence collection built into the pipeline rather than bolted on at audit time.",
  },
  {
    title: "Ecommerce",
    desc: "Infrastructure that survives traffic spikes without over-provisioning for them the other fifty weeks of the year.",
  },
  {
    title: "SaaS",
    desc: "Multi-tenant environments, per-customer cost attribution and release cadence that does not slow down as the product grows.",
  },
  {
    title: "Logistics",
    desc: "Always-on systems with tight recovery targets, where scheduled maintenance windows are not an option.",
  },
  {
    title: "Media",
    desc: "Elastic capacity for unpredictable demand, with cost controls that keep the bill proportional to actual usage.",
  },
];

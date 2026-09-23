// Single content source for the AI Development template.
// Mirrors the Mobile App Development madData shape 1:1 so the same reused
// Mad* components and the eventual CMS lift (Updated Services) map cleanly.
//
// Key/design mapping (matches the mobile template wiring):
//   `services` → 6-stage process timeline (rendered by MadProcess)
//   `process`  → service list cards        (rendered by MadServices)

const aiData = {
  meta: {
    title: "Artificial Intelligence Development Company | Akoode Technologies",
    description:
      "Akoode Technologies builds production AI systems — from machine learning and LLM applications to full-stack software and intelligent automation. An AI-first development company serving the UK, US, and India.",
    path: "/services/artificial-intelligence",
    serviceType: "Artificial Intelligence Development",
  },

  hero: {
    heading: "Artificial Intelligence",
    headingAccent: "Development Company",
    paragraphs: [
      "From AI and deep learning to full-stack software, mobile apps, and eCommerce. Akoode builds the technology systems that help B2B companies move faster, scale smarter, and stay ahead of the competition.",
    ],
    cta1Text: "Get free consultation",
    cta1Link: "/contact-us",
    cta2Text: "View our AI work",
    cta2Link: "/case-studies",
    badges: [
      { icon: "Brain", title: "AI-First Since 2023", subtitle: "Build locally, shipped globally" },
      { icon: "Briefcase", title: "180+ Projects Shipped" },
      { icon: "Award", title: "Clutch Top B2B Company" },
      { icon: "Globe", title: "UK, US & India" },
      { icon: "Rocket", title: "10+ Years of Delivery" },
    ],
  },

  // The dark "Gap" section that replaces the generic intro for this template.
  gap: {
    heading: "The Gap Between Businesses That Use AI And Those That Have Integrated It",
    quote:
      "The challenge for most organisations is not a shortage of interest. It is the difficulty of moving from interest to implementation without the right partner.",
    featureTitle: "Akoode Technologies",
    featureBody:
      "We combine strategy, data engineering, model development, and production deployment under one engagement, so you are not coordinating between five vendors to get one working AI system.",
    paragraphs: [
      "There is a difference between a business that has experimented with AI and one that has genuinely built it into how it operates. The first group has tried tools, run pilots, or added a chatbot somewhere. The second has fundamentally changed how decisions get made and how workflows run.",
      "The gap is widening. Businesses with AI at the system level are processing data faster, responding to market shifts earlier, and running with lower manual overhead. The challenge for most organisations is not a shortage of interest. It is the difficulty of moving from interest to implementation without the right partner.",
    ],
    shiftsHeading: "What shifts when AI is built into your core systems",
    shifts: [
      { num: "01", icon: "CheckCircle2", title: "Decisions in seconds", desc: "Decisions that took hours get made in seconds, with better data behind them." },
      { num: "02", icon: "Workflow", title: "Workflows run themselves", desc: "Processes that required human review at every step run autonomously at scale." },
      { num: "03", icon: "Users", title: "Personalised at scale", desc: "Customer interactions become personalised without adding headcount." },
      { num: "04", icon: "ShieldCheck", title: "Risks surface early", desc: "Anomalies, risks, and opportunities surface before they become visible manually." },
      { num: "05", icon: "TrendingUp", title: "Software compounds", desc: "Your software gets more valuable with every interaction, not less." },
    ],
  },

  // Service-list cards (rendered by MadServices via the `process` key).
  process: {
    heading: "Our Artificial Intelligence",
    headingAccent: "Development Services",
    intro:
      "We offer end-to-end AI development services that take you from problem definition through to deployed, monitored systems in production. Every engagement is structured around a clear business outcome, not a list of deliverables for their own sake.",
    steps: [
      { num: "01", tag: "Strategy", title: "AI Strategy & Consulting", icon: "Map", link: "/services/ai-strategy-consulting", desc: "Before any model is trained, we identify where AI creates measurable value in your business, validate feasibility against your data, and define a roadmap that ties every initiative to an outcome." },
      { num: "02", tag: "ML", title: "Machine Learning Development", icon: "Cpu", link: "/services/machine-learning-development", desc: "We build, train, and tune custom machine learning models for prediction, classification, recommendation, and forecasting — designed for the accuracy and reliability production demands." },
      { num: "03", tag: "LLM", title: "Generative AI & LLM Apps", icon: "Bot", link: "/services/generative-ai-development", desc: "From retrieval-augmented assistants to document automation, we build LLM applications grounded in your data with guardrails, evaluation, and cost control built in." },
      { num: "04", tag: "Vision", title: "Computer Vision", icon: "Eye", link: "/services/computer-vision", desc: "Image and video understanding for quality inspection, detection, OCR, and real-time analytics — deployed on cloud or edge to match your latency needs." },
      { num: "05", tag: "Data", title: "Data Engineering & MLOps", icon: "Database", link: "/services/data-engineering-mlops", desc: "Reliable AI starts with reliable data. We build the pipelines, feature stores, and MLOps tooling that keep models trained, monitored, and shipping safely." },
      { num: "06", tag: "NLP", title: "Natural Language Processing", icon: "MessageSquare", link: "/services/nlp-development", desc: "Sentiment, intent, extraction, and search over unstructured text — turning support tickets, contracts, and conversations into structured signal." },
      { num: "07", tag: "Agents", title: "AI Agents & Automation", icon: "Workflow", link: "/services/ai-agents-automation", desc: "Autonomous and human-in-the-loop agents that execute multi-step workflows across your tools, removing manual overhead from operations." },
      { num: "08", tag: "Integration", title: "AI Integration & Support", icon: "Settings", link: "/services/ai-integration-support", desc: "We embed AI into your existing software, monitor model performance in production, and retrain as your data and business evolve." },
    ],
  },

  // "Specialised AI Capabilities We Build" — left narrative + 2-column grid.
  capabilities: {
    heading: "Specialised AI",
    headingAccent: "Capabilities We Build",
    quote:
      "At Akoode, we go beyond conventional development by integrating artificial intelligence directly into the software systems we build.",
    paragraph:
      "Businesses that integrate AI into their core platforms gain a compounding advantage over time. Operations become faster, decisions become better-informed, and the software itself becomes more valuable with every interaction. We help businesses move from reactive systems, where teams respond to problems after they occur, to predictive and adaptive platforms that get ahead of them.",
    // Row-major order (2 columns): the grid lays these out left-to-right, top-to-bottom.
    items: [
      { icon: "Bot", title: "Agentic AI Systems", desc: "AI agents that reason, plan, and execute multi-step tasks autonomously." },
      { icon: "ShoppingCart", title: "AI-Powered Recommendation Engines", desc: "Recommendation systems that learn from user behaviour to deliver personalised suggestions." },
      { icon: "MessageSquare", title: "Conversational AI and Virtual Assistants", desc: "Intelligent conversational systems built on LLM foundations that deliver accurate contextual responses." },
      { icon: "Box", title: "3D, Metaverse, and Spatial AI", desc: "AI-powered 3D visualisation, simulation, and immersive experiences for digital twins and spatial computing." },
      { icon: "BarChart3", title: "AI for Data Science and Analytics", desc: "End-to-end data science capability from data engineering to model development across multiple data types." },
      { icon: "Share2", title: "Integrated Intelligence Platforms", desc: "Integrated platforms that connect data, models, and workflows into a unified intelligence system." },
    ],
  },

  // "Where Enterprise AI Stands in 2026" — heading/intro split + stacked
  // horizontal dark-gradient trend cards.
  trends: {
    heading: "Where Enterprise AI Stands in 2026 and What It Means for",
    headingAccent: "Your Business",
    intro:
      "The AI developments that were emerging twelve months ago are now production-reality in leading organisations. Here is where the most significant shifts have landed, and how Akoode positions you to benefit from each one.",
    items: [
      {
        icon: "Bot",
        title: "Agentic AI Has Moved from Experiment to Operations",
        desc: "Multi-step AI agents that plan, reason, and execute across tools and data sources are running in production at scale. Organisations that piloted agentic systems in 2025 are now seeing compounding efficiency gains in operations, finance, and customer service. The window for first-mover advantage is still open, but it is closing.",
      },
      {
        icon: "FileSearch",
        title: "RAG Is Now the Default for Enterprise LLM Applications",
        desc: "Generic LLMs hallucinate on your business data. Retrieval-augmented generation solves this by grounding model responses in your actual documents, databases, and knowledge bases. By mid-2026, RAG is not a leading-edge technique. It is the baseline expectation for any LLM application that needs to be accurate in a business context.",
      },
      {
        icon: "ShieldCheck",
        title: "AI Governance Is Now a Board-Level Requirement",
        desc: "Regulators across the EU, UK, and India have moved AI accountability from the IT team to the boardroom. Explainability, audit trails, bias monitoring, and data lineage are now requirements, not differentiators. We build observability and governance infrastructure into every AI system we deploy.",
      },
      {
        icon: "Network",
        title: "Small, Fine-Tuned Models Are Outperforming General LLMs on Specific Tasks",
        desc: "Specialised, fine-tuned models are beating general-purpose LLMs on narrow tasks while costing a fraction to run. Training a smaller model on your domain data delivers higher accuracy, lower latency, and predictable costs. We help you choose where a focused model beats a frontier one.",
      },
      {
        icon: "Layers",
        title: "Multimodal AI Is Unlocking New Industry Use Cases",
        desc: "Systems that process text, images, audio, and structured data simultaneously are opening use cases in inspection, documentation, and customer interaction that were not technically viable in 2024. We are actively building multimodal systems in healthcare, manufacturing, and retail where combining visual and textual data improves accuracy significantly.",
      },
    ],
  },

  technologies: {
    heading: "Technologies We Use For AI Development",
    intro:
      "Technology choices in AI have long-term consequences. A framework chosen for a quick proof of concept can become a liability when the model goes to production, when data volumes grow, or when the system needs governance it was never designed for. We select the stack based on your problem, your data, and where this system needs to be in three years.",
    tabs: [
      {
        label: "ML Frameworks",
        logos: [
          { label: "TensorFlow", img: "/tech_stacks/tensor_flow.svg" },
          { label: "PyTorch", img: "/tech_stacks/pytorch.svg" },
          { label: "scikit-learn", img: "/tech_stacks/python.svg" },
          { label: "Keras", img: "/tech_stacks/tensor_flow.svg" },
        ],
      },
      {
        label: "LLM & GenAI",
        logos: [
          { label: "OpenAI API", img: "/tech_stacks/openai.svg" },
          { label: "LangChain", img: "/tech_stacks/langchain.svg" },
          { label: "Hugging Face", img: "/tech_stacks/python.svg" },
          { label: "Vector DBs", img: "/tech_stacks/postgresql.svg" },
        ],
      },
      {
        label: "Languages",
        logos: [
          { label: "Python", img: "/tech_stacks/python.svg" },
          { label: "Node.js", img: "/tech_stacks/node-js.svg" },
          { label: "Go", img: "/tech_stacks/rest-api.svg" },
          { label: "SQL", img: "/tech_stacks/postgresql.svg" },
        ],
      },
      {
        label: "Cloud & MLOps",
        logos: [
          { label: "AWS", img: "/tech_stacks/aws.svg" },
          { label: "Google Cloud", img: "/tech_stacks/google-cloud.svg" },
          { label: "Docker", img: "/tech_stacks/docker.svg" },
          { label: "Firebase", img: "/tech_stacks/firebase.svg" },
        ],
      },
      {
        label: "Data & APIs",
        logos: [
          { label: "GraphQL", img: "/tech_stacks/graphql.svg" },
          { label: "REST APIs", img: "/tech_stacks/rest-api.svg" },
          { label: "PostgreSQL", img: "/tech_stacks/postgresql.svg" },
          { label: "Redis", img: "/tech_stacks/redis.svg" },
        ],
      },
      {
        label: "Databases",
        logos: [
          { label: "PostgreSQL", img: "/tech_stacks/postgresql.svg" },
          { label: "MongoDB", img: "/tech_stacks/mongodb.svg" },
          { label: "Redis", img: "/tech_stacks/redis.svg" },
          { label: "Firestore", img: "/tech_stacks/firebase.svg" },
        ],
      },
    ],
  },

  whyChoose: {
    heading: "Why Businesses Choose",
    headingAccent: "Akoode Technologies",
    headingTail: "As Their AI Development Company",
    subtitle:
      "We build AI systems that reach production and stay there — engineered by senior teams, owned end-to-end, and delivered with full visibility from data to deployment.",
    cards: [
      { title: "AI-First by Architecture, Not by Marketing", icon: "FiCpu", desc: "AI is not a feature we bolt on. We design systems where models, data pipelines, and applications are built to work together from day one, so what we ship survives contact with real production traffic." },
      { title: "Fully In-House Engineering Team", icon: "FiUsers", desc: "We do not subcontract model development, data engineering, or MLOps to third parties. Every engineer working on your system is part of our core team — consistent quality, direct communication, real accountability." },
      { title: "End-to-End Ownership", icon: "FiBox", desc: "We manage strategy, data, model development, and production deployment under one engagement. No coordinating between five vendors, no gaps in responsibility when something needs fixing in production." },
      { title: "Senior-Led Delivery", icon: "FiAward", desc: "The people you meet during scoping are the people who build your system. Senior ML and data engineers lead every engagement, and that shows in the architecture decisions made early, when they are cheapest to get right." },
      { title: "Global Delivery, Locally Built", icon: "FiGlobe", desc: "Our clients span the UK, US, and India. We are structured for asynchronous collaboration, document to a professional standard, and operate with the communication rigour international clients expect." },
      { title: "Production, Not Just Pilots", icon: "FiRefreshCw", desc: "Most AI projects stall at the proof-of-concept stage. We are built to cross the gap — with evaluation, monitoring, and retraining designed in so your AI keeps performing after launch." },
    ],
  },

  // 6-stage process timeline (rendered by MadProcess via the `services` key).
  services: {
    heading: "Our AI Development",
    headingAccent: "Process",
    intro:
      "A structured process is what separates AI that reaches production from pilots that stall. We follow a six-stage process designed to give you clarity at every step, consistent visibility into progress, and a system that ties back to a measurable business outcome.",
    items: [
      {
        num: "01",
        label: "Discovery",
        stageTitle: "Discovery & Use-Case Scoping",
        intro: "Before any model is trained, we map where AI creates measurable value and validate feasibility against the data you actually have.",
        points: [
          "Identify high-value, feasible use cases",
          "Audit data availability and quality",
          "Define success metrics before building",
          "Align stakeholders on priorities and ROI",
        ],
        outcome: "A validated roadmap with use cases ranked by value and feasibility.",
      },
      {
        num: "02",
        label: "Data",
        stageTitle: "Data Engineering & Preparation",
        intro: "Reliable AI starts with reliable data. We build the pipelines and feature foundations the models depend on.",
        points: [
          "Pipelines for ingestion and cleaning",
          "Feature engineering and labelling",
          "Governance, privacy, and compliance",
          "Reproducible, versioned datasets",
        ],
        outcome: "Clean, well-governed data ready for model development.",
      },
      {
        num: "03",
        label: "Modeling",
        stageTitle: "Model Development",
        intro: "We build, train, and tune models against your success metrics, iterating in tight cycles with measurable evaluation.",
        points: [
          "Baseline and candidate model selection",
          "Training, tuning, and experimentation",
          "Rigorous, reproducible evaluation",
          "Bias, robustness, and edge-case checks",
        ],
        outcome: "A validated model that meets the success criteria defined in discovery.",
      },
      {
        num: "04",
        label: "Integration",
        stageTitle: "Integration & Productionisation",
        intro: "We wrap the model in the software, APIs, and guardrails it needs to run inside your business safely.",
        points: [
          "APIs and application integration",
          "Guardrails, fallbacks, and cost control",
          "Load, latency, and security testing",
          "Human-in-the-loop where it matters",
        ],
        outcome: "A production-ready system integrated into your stack.",
      },
      {
        num: "05",
        label: "Deployment",
        stageTitle: "Deployment & MLOps",
        intro: "We deploy with a controlled release plan and the monitoring needed to keep the system trustworthy in production.",
        points: [
          "Automated, documented release pipeline",
          "Drift and performance monitoring",
          "Safe rollback designed in",
          "Alerting tied to real model health",
        ],
        outcome: "A monitored deployment with rollback safety built in.",
      },
      {
        num: "06",
        label: "Evolution",
        stageTitle: "Monitoring & Retraining",
        intro: "Models decay as the world changes. We monitor, retrain, and improve as your data and business evolve.",
        points: [
          "Continuous performance monitoring",
          "Scheduled and triggered retraining",
          "New use cases as value is proven",
          "Alignment with your evolving business",
        ],
        outcome: "An AI system that keeps performing and compounding over time.",
      },
    ],
  },

  engagement: {
    heading: "Flexible Engagement Models",
    headingTail: "For AI Development",
    subtitle:
      "Choose how you want to work with us. Every model includes dedicated engineers, full IP ownership, transparent communication, and direct access to the people building your system.",
    plans: [
      {
        title: "Fixed Cost",
        bestFor: "Best For: Projects With Well-Defined Scope And Clear Deliverables",
        points: [
          "Scope, timeline, and budget agreed upfront. No surprises mid-project",
          "Transparent pricing with defined milestones and delivery structure",
          "Lower financial risk, ideal for MVPs and defined product launches",
          "Clear acceptance criteria at every milestone",
        ],
        ctaText: "Get a Quote",
        ctaLink: "/contact-us",
        popular: false,
      },
      {
        title: "Dedicated Team",
        bestFor: "Best For: Projects Requiring Continuous Development And Long-Term Product Evolution",
        points: [
          "A dedicated team works as an extension of your in-house engineers, designers, QA, and PMs",
          "Full control over the development process and sprint priorities",
          "Easy scalability as the product and team requirements evolve",
          "Seamless integration with your existing tools and workflows",
          "Direct access to engineers with no account managers or intermediaries",
        ],
        ctaText: "Post Your Requirement",
        ctaLink: "/post-requirement",
        popular: true,
      },
      {
        title: "Staff Augmentation",
        bestFor: "Best For: Filling Skill Gaps Or Accelerating Development Velocity",
        points: [
          "Extend your internal team with skilled AI engineers who integrate into your workflow",
          "Immediate access to specialist skills without full-time hiring costs",
          "Scale resources up or down as priorities and timelines shift",
          "Engineers onboard and productive within days, not months",
          "No recruitment overhead, no fixed headcount commitment",
        ],
        ctaText: "Hire Team",
        ctaLink: "/contact-us",
        popular: false,
      },
    ],
  },

  caseStudies: {
    heading: "Work That",
    headingAccent: "Speaks For Itself",
    intro:
      "Every AI system we build is a business problem before it is a technical one. Here is a snapshot of how we have helped businesses ship AI that made a measurable difference.",
  },

  industries: {
    heading: "We Build AI Across",
    headingAccent: "15 Industries",
    intro:
      "Our experience spans major industries, giving us domain-specific knowledge of the data, compliance requirements, and decision workflows that shape successful AI systems.",
  },

  blogs: {
    heading: "Related",
    headingAccent: "Blogs",
  },

  faq: {
    heading: "Everything teams",
    headingAccent: "ask us first.",
    items: [
      {
        q: "How long does it take to build an AI system?",
        a: "A focused proof of concept typically takes 4–8 weeks. A production system with data pipelines, integration, and MLOps runs 3–6 months. We give you a milestone-based timeline after the discovery phase.",
      },
      {
        q: "Do we need a lot of data to start?",
        a: "Not always. Some use cases run on pre-trained or foundation models with little data, while custom models need quality labelled data. In discovery we audit what you have and tell you honestly what is feasible.",
      },
      {
        q: "Can you integrate AI into our existing software?",
        a: "Yes. We embed models into your current applications via APIs, add guardrails and monitoring, and keep the system maintainable for your team after handover.",
      },
      {
        q: "Who owns the models, code, and IP?",
        a: "You do, from day one. Source and model artifacts live in a repository you own, and we sign IP-assignment and NDA agreements as standard.",
      },
      {
        q: "How do you keep AI accurate after launch?",
        a: "We build in evaluation, drift and performance monitoring, and retraining. When data shifts or accuracy drops, the system flags it and we retrain under a support plan.",
      },
      {
        q: "Can you work with our existing team or models?",
        a: "Absolutely. We embed with your team, follow your workflows, and can take over, audit, or extend existing models and pipelines after a short review.",
      },
    ],
  },

  finalCta: {
    eyebrow: "Start Your Project",
    heading: "Start Your",
    headingAccent: "AI Development",
    subtitle:
      "Send your brief and someone from Akoode will respond within one business day. The first conversation covers your use case, your data, and how the build would be approached. No pitch deck, no pressure.",
  },
};

export default aiData;

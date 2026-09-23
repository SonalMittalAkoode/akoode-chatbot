// Single content source for the Mobile App Development template.
// Kept as one object so the eventual CMS lift (Updated Services) is a 1:1 mapping.
// Icon fields are string keys resolved by the shared adminIconMap via iconResolver.

const madData = {
  // Single source for SEO title/description — consumed by both layout (metadata)
  // and page (JSON-LD) so the strings are never duplicated.
  meta: {
    title: "Mobile App Development Company | Akoode Technologies",
    description:
      "Akoode Technologies builds iOS, Android, and cross-platform mobile apps engineered for scale from day one. A Gurgaon-based mobile app development company serving India, the US, and Europe.",
    path: "/services-v2/mobile-app-development",
    serviceType: "Mobile App Development",
  },

  hero: {
    heading: "Mobile App Development",
    headingAccent: "Company",
    paragraphs: [
      "Businesses today don't just need a mobile app. They need a product that users open by habit, that handles real transaction volumes without breaking, and that a development team can actually maintain and improve over time. That is what we build at Akoode Technologies.",
      "As a mobile app development company working with clients across India, the US, and Europe, we design and develop iOS, Android, and cross-platform applications that are built for scale from day one, not refactored into it later.",
    ],
    cta1Text: "Start your Project",
    cta1Link: "/contact-us",
    cta2Text: "View our work",
    cta2Link: "/case-studies",
    heroImage: "/mobile-app/mobile.png",
    heroImageAlt: "Mobile app development dashboards",
    stats: [
      { value: "4.9", label: "Google Rating", icon: "Star" },
      { value: "97%", label: "Client Retention", icon: "TrendingUp" },
      { value: "15+", label: "Industries Served", icon: "Layers" },
      { value: "Global", label: "Delivery", icon: "Globe" },
    ],
  },

  intro: {
    heading: "Mobile App Development",
    headingAccent: "Company",
    paragraphs: [
      "Most companies treat mobile development as a one-time project. Build the app, launch it, move on. That thinking is exactly why so many apps get rebuilt from scratch 18 months later, because the architecture was never designed to grow, the codebase was handed off without documentation, and the original vendor is long gone by the time the performance problems start showing.",
      "The mobile channel is no longer a secondary touchpoint for most industries. It is where customers complete purchases, where operations teams manage field workflows, where B2B platforms push time-sensitive updates, and where user engagement data actually lives. A poorly built app is not just a UX problem, it is a competitive liability that compounds over time.",
      "The difference between a mobile app that becomes a core business asset and one that needs to be replaced is almost never the idea. It is the quality of the engineering decisions made in the first sprint.",
    ],
    pills: [
      { label: "Build App", icon: "Code2" },
      { label: "User Growth", icon: "Users" },
      { label: "Performance Demands", icon: "Gauge" },
      { label: "Scalability", icon: "Layers" },
      { label: "Business Success", icon: "Trophy" },
    ],
    statCards: [
      {
        value: "18 Months",
        label: "Rebuild Cycle",
        desc: "Many apps get rebuilt within 18 months due to poor architecture and short-term engineering decisions.",
        icon: "Calendar",
      },
      {
        value: "70%+",
        label: "Apps Need Major Refactoring",
        desc: "Over 70% of apps require major refactoring or rebuilding due to scalability, performance, and maintainability issues.",
        icon: "PieChart",
      },
    ],
    closingParagraphs: [
      "Akoode Technologies is a mobile app development company in Gurgaon building products for businesses that cannot afford to get this decision wrong. We work with funded startups shipping their first product, mid-market companies replacing consumer-facing apps that have outgrown their original build, and enterprise teams that need specialist mobile engineers embedded directly into their existing squads.",
      "What sets us apart is not a service list, it is how we approach the work. Every project begins with a structured discovery process that maps your users, your business model, and your technical constraints before a single wireframe is drawn. We do not start building until we understand what success actually looks like for your specific situation. From there, we take full ownership across design, development, QA, and post-launch optimisation, with no handoffs to junior teams, no outsourced QA, and no disappearing act after go-live.",
      "Our capabilities span native iOS and Android development, cross-platform apps using Flutter and React Native, AI-powered mobile applications, and enterprise-grade solutions built for high-volume, high-compliance environments.",
    ],
  },

  // Dark-snake section. Lives under the `process` key so the admin "Process"
  // tab + `process` data key + snake design all line up (see template wiring).
  process: {
    heading: "Custom Mobile App Development",
    headingAccent: "Services",
    intro:
      "We cover the full spectrum of mobile app development, from platform-specific native builds to cross-platform applications designed for enterprise scale. Each service below links to its dedicated sub-page.",
    steps: [
      { num: "01", tag: "iOS", title: "iOS App Development", icon: "Apple", link: "/services/ios-app-development", desc: "Building for Apple's premium demands more than Swift knowledge. It requires a deep understanding of the App Store review process, Apple Human Interface Guidelines, and the performance expectations of users on premium devices." },
      { num: "02", tag: "Android", title: "Android App Development", icon: "Smartphone", link: "/services/android-app-development", desc: "Android's device fragmentation is the part of mobile development that agencies consistently underestimate. We design with Kotlin and Jetpack Compose and test across real-world devices." },
      { num: "03", tag: "Native", title: "Native App Development", icon: "Cpu", link: "/services/native-app-development", desc: "When your application needs deep hardware integration, maximum rendering performance, real-time processing, or platform-specific APIs, native development delivers without compromise." },
      { num: "04", tag: "Hybrid", title: "Hybrid App Development", icon: "Layers", link: "/services/hybrid-app-development", desc: "Hybrid development lets businesses launch across iOS and Android faster and at lower cost, without maintaining two separate codebases." },
      { num: "05", tag: "React Native", title: "React Native App Development", icon: "Atom", link: "/services/react-native-app-development", desc: "React Native is the right choice for teams that want to share business logic and state management with an existing web application where advanced capabilities are needed." },
      { num: "06", tag: "Flutter", title: "Flutter App Development", icon: "Feather", link: "/services/flutter-app-development", desc: "Flutter is our default recommendation for most cross-platform mobile projects. It delivers near-native performance, a consistent UI across iOS and Android, and a single codebase." },
      { num: "07", tag: "Planning", title: "Architecture & Planning", icon: "Map", link: "/services/architecture-planning", desc: "We define your technical architecture, app architecture, and roadmap based on your goals, scale, and budget to ensure a solid foundation for long-term success." },
      { num: "08", tag: "Support", title: "Support & Evolution", icon: "Settings", link: "/services/support-evolution", desc: "We provide ongoing maintenance, performance enhancements, and scaling support to keep your app secure, fast, and future-ready as your business grows." },
    ],
  },

  technologies: {
    heading: "Technologies We Use For Mobile App Development",
    intro:
      "Technology choices in mobile development have long-term consequences. A framework chosen for short-term development speed can become a liability when the platform releases a major update, when the team scales, or when the product needs capabilities the framework was not designed for. We select the stack based on your product requirements, your timeline, and where this application needs to be in three years, not just at launch.",
    tabs: [
      {
        label: "Mobile Frameworks",
        logos: [
          { label: "Flutter", img: "/tech_stacks/flutter.svg" },
          { label: "React Native", img: "/tech_stacks/react.svg" },
          { label: "Ionic", img: "/tech_stacks/Ionic.svg" },
          { label: "Expo", img: "/tech_stacks/expo.svg" },
        ],
      },
      {
        label: "Native Languages",
        logos: [
          { label: "Swift", img: "/tech_stacks/swift.svg" },
          { label: "Kotlin", img: "/tech_stacks/kotlin.svg" },
          { label: "Objective-C", img: "/tech_stacks/apple_objectivec.svg" },
          { label: "Xcode", img: "/tech_stacks/x_code.svg" },
        ],
      },
      {
        label: "Backend & APIs",
        logos: [
          { label: "Node.js", img: "/tech_stacks/node-js.svg" },
          { label: "Python", img: "/tech_stacks/python.svg" },
          { label: "GraphQL", img: "/tech_stacks/graphql.svg" },
          { label: "REST APIs", img: "/tech_stacks/rest-api.svg" },
        ],
      },
      {
        label: "Cloud & DevOps",
        logos: [
          { label: "AWS", img: "/tech_stacks/aws.svg" },
          { label: "Google Cloud", img: "/tech_stacks/google-cloud.svg" },
          { label: "Docker", img: "/tech_stacks/docker.svg" },
          { label: "Firebase", img: "/tech_stacks/firebase.svg" },
        ],
      },
      {
        label: "AI & Machine learning",
        logos: [
          { label: "OpenAI API", img: "/tech_stacks/openai.svg" },
          { label: "TensorFlow", img: "/tech_stacks/tensor_flow.svg" },
          { label: "PyTorch", img: "/tech_stacks/pytorch.svg" },
          { label: "LangChain", img: "/tech_stacks/langchain.svg" },
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
    headingTail: "As Their Mobile App Development Company",
    subtitle:
      "We engineer mobile products that become core business assets — built by senior engineers, owned end-to-end, and delivered with full visibility from discovery to launch.",
    cards: [
      { title: "AI-First by architecture, Not by Marketing", icon: "Cpu", desc: "From the first discovery call to post-launch monitoring, we manage the complete product lifecycle under one roof. No handoffs between vendors, no gaps in responsibility, and no finger-pointing when something needs fixing six months after launch." },
      { title: "Fully In-House Engineering Team", icon: "Users", desc: "We do not subcontract development or QA to third parties. Every engineer, designer, and tester working on your project is part of our core team. That means consistent code quality, direct communication, and accountability that a subcontracting model cannot provide." },
      { title: "End-to-End Ownership", icon: "Box", desc: "From the first discovery call to post-launch monitoring, we manage the complete product lifecycle under one roof. No handoffs between vendors, no gaps in responsibility, and no finger-pointing when something needs fixing six months after launch." },
      { title: "Senior-Led Delivery", icon: "Award", desc: "The people you meet during scoping are the people who build your product. We do not staff projects with junior developers once the contract is signed. Senior engineers lead every engagement, and that shows in the decisions made early, when they are cheapest to get right." },
      { title: "Global Delivery, Gurgaon-Based", icon: "Globe", desc: "Our clients are based across India, the US, the UK, and Europe. We are structured for asynchronous collaboration, produce documentation in English to a professional standard, and operate with the communication rigour that international clients expect, without the pricing of a Western agency." },
      { title: "Agile Process with Real Visibility", icon: "RefreshCw", desc: "You see working software at the end of every two-week sprint, not status updates. Our process gives you regular checkpoints to course-correct, clear milestone-based delivery, and direct access to the team building your product throughout the engagement." },
    ],
  },

  // Timeline section. Lives under the `services` key so the admin "Services"
  // tab + `services` data key + timeline design all line up (see template wiring).
  services: {
    heading: "Our Mobile App Development",
    headingAccent: "Process",
    intro:
      "A structured process is not a formality. It is what separates predictable delivery from projects that drift. We follow a six-stage process designed to give you clarity at every step, consistent visibility into progress, and a product that reflects your business goals rather than assumptions made in week one.",
    items: [
      {
        num: "01",
        label: "Discovery",
        stageTitle: "Discovery & Scoping",
        intro: "Before any wireframe or architecture diagram exists, we spend time understanding how your business actually operates and where this product fits into the picture.",
        points: [
          "Map users, business model, and technical constraints",
          "Define what success looks like before building",
          "Validate scope against budget and timeline",
          "Align stakeholders on priorities",
        ],
        outcome: "A validated roadmap, aligned goals, and a strong foundation for predictable delivery.",
      },
      {
        num: "02",
        label: "Design",
        stageTitle: "UI/UX Design",
        intro: "We translate the discovery findings into intuitive flows and interfaces validated with your team before development begins.",
        points: [
          "Wireframes and user flows aligned to real tasks",
          "Brand-aligned, accessible visual design",
          "Interactive prototypes for early feedback",
          "Design validated against user expectations",
        ],
        outcome: "A clear, validated design system ready for engineering.",
      },
      {
        num: "03",
        label: "Development",
        stageTitle: "Agile Development",
        intro: "Before any wireframe or architecture diagram exists, we spend time understanding how your business actually operates and where this module fits into the picture.",
        points: [
          "Two-week sprint cycles for consistent momentum",
          "Working, testable builds at the end of every sprint",
          "Regular feedback loops to align with your goals",
          "Flexibility to adapt without derailing the project",
        ],
        outcome: "A validated roadmap, aligned goals, and a strong foundation for predictable delivery.",
      },
      {
        num: "04",
        label: "QA",
        stageTitle: "Testing & Quality Assurance",
        intro: "Every feature is validated against acceptance criteria with functional, performance, and security testing at every sprint.",
        points: [
          "Functional testing across devices and platforms",
          "Performance and security testing each sprint",
          "Acceptance-criteria validation",
          "Nothing ships unless it meets the standard",
        ],
        outcome: "A reliable, production-ready build verified across real-world conditions.",
      },
      {
        num: "05",
        label: "Deployment",
        stageTitle: "Deployment",
        intro: "We deploy with a zero-downtime release plan after UAT, validation, and ongoing reporting.",
        points: [
          "Automated, documented release pipeline",
          "Zero-downtime deployment strategy",
          "Safe rollback designed in",
          "Store submission and launch support",
        ],
        outcome: "A smooth, controlled launch with rollback safety built in.",
      },
      {
        num: "06",
        label: "Support",
        stageTitle: "Maintenance & Support",
        intro: "Post-launch, we monitor performance, resolve issues, and ship improvements as your business evolves.",
        points: [
          "Performance monitoring and issue resolution",
          "Regular updates and improvements",
          "Scaling support as usage grows",
          "Alignment with your evolving business",
        ],
        outcome: "A product that keeps performing and evolving with your business.",
      },
    ],
  },

  engagement: {
    heading: "Flexible Engagement Models",
    headingTail: "For Mobile App Development",
    subtitle:
      "Choose how you want to work with us. Every model includes dedicated engineers, full IP ownership, transparent communication, and direct access to the people building your product.",
    plans: [
      {
        title: "Fixed Cost",
        bestFor: "Best For: Well-Defined Projects With Clear Scope And Deliverables",
        points: [
          "Scope, timeline, and budget agreed upfront. No surprises mid-project",
          "Transparent pricing with milestone-based delivery structure",
          "Lower financial risk, ideal for MVPs and first-time app builds",
          "Clear acceptance criteria defined at every milestone",
        ],
        ctaText: "Get a Quote",
        ctaLink: "/contact-us",
        popular: false,
      },
      {
        title: "Dedicated Team",
        bestFor: "Best For: Long-Term Products Requiring Continuous Development And Evolving Roadmaps",
        points: [
          "A dedicated team works as a direct extension of your in-house engineers, designers, QA, and PMs",
          "Full control over sprint priorities and development direction",
          "Easy scalability as your product and team requirements evolve",
          "Seamless integration with your existing tools and workflows",
          "Direct access to engineers with no account managers or intermediaries",
        ],
        ctaText: "Post your requirement",
        ctaLink: "/post-requirement",
        popular: true,
      },
      {
        title: "Staff Augmentation",
        bestFor: "Best For: Teams Needing To Fill Specialist Skill Gaps Or Accelerate Delivery Velocity",
        points: [
          "Extend your team with senior mobile engineers who integrate directly into your workflow",
          "Immediate access to Flutter, React Native, Swift, and Kotlin specialists without a hiring cycle",
          "Engineers onboard and become productive within days, not months",
          "Scale resources up or down as priorities and timelines shift",
          "No recruitment overhead, no probation period, no fixed headcount commitment",
          "Works for both startups filling capability gaps and enterprises adding platform-specific expertise",
        ],
        ctaText: "Hire mobile Engineers",
        ctaLink: "/contact-us",
        popular: false,
      },
    ],
  },

  caseStudies: {
    heading: "Work That",
    headingAccent: "Speaks For Itself",
    intro:
      "Every mobile app we build is a business problem before it is a technical one. Here is a snapshot of how we have helped businesses ship products that made a measurable difference.",
  },

  industries: {
    heading: "We Build Mobile Apps Across",
    headingAccent: "15 Industries",
    intro:
      "Our experience spans major industries, giving us domain-specific knowledge of the challenges, compliance requirements, and user expectations that shape successful mobile products.",
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
        q: "How long does it take to build a mobile app?",
        a: "A typical MVP ships in 8–14 weeks. Complex, multi-platform products with backend and integrations run 4–6 months. We give you a milestone-based timeline after the discovery phase.",
      },
      {
        q: "Do you build native or cross-platform apps?",
        a: "Both. We recommend native (Swift/Kotlin) when you need maximum performance or deep hardware access, and cross-platform (Flutter/React Native) when speed-to-market and a shared codebase matter more. We choose based on your product, not a default.",
      },
      {
        q: "Do you publish the app to the App Store and Play Store?",
        a: "Yes. We handle the full submission process — store listings, review guidelines, signing, and release — and support you through approvals and post-launch updates.",
      },
      {
        q: "Who owns the code and IP?",
        a: "You do, from day one. Source is pushed to a repository you own, and we sign IP-assignment and NDA agreements as standard.",
      },
      {
        q: "Do you provide post-launch support and maintenance?",
        a: "Yes. We offer ongoing maintenance, performance monitoring, OS-update compatibility, and feature iterations under flexible support plans.",
      },
      {
        q: "Can you work with our existing team or codebase?",
        a: "Absolutely. We embed with your team, follow your workflows, and can take over or extend an existing app after a short codebase audit.",
      },
    ],
  },

  finalCta: {
    eyebrow: "Start Your Project",
    heading: "Start Your",
    headingAccent: "Mobile App Development",
    subtitle:
      "Send your brief and someone from Akoode will respond within one business day. The first conversation covers your use case, your current environment, and how the build would be approached. No pitch deck, no pressure.",
  },
};

export default madData;

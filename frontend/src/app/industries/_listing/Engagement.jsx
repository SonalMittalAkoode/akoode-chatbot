// Reuses the Mobile App Development engagement section (identical design/styling),
// with industry-focused engagement-model content. Mirrors how CaseStudies wraps
// SdCaseStudies — no design changes, only the heading/subtitle/plans content.
import MadEngagement from "@/app/services-v2/mobile-app-development/components/MadEngagement";

const DATA = {
  heading: "How Teams Work",
  headingTail: "With Us",
  tailAccent: true, // gradient on the second part ("With Us"), dark lead
  subtitle:
    "Pick the model that fits where your project stands. All three include dedicated engineers with domain context in your vertical.",
  plans: [
    {
      title: "Fixed Cost",
      bestFor:
        "For projects with a clearly scoped specification and a firm delivery timeline.",
      points: [
        "Fixed scope, fixed price",
        "Milestone-based delivery",
        "Full project documentation",
        "Best for: defined MVPs and defined feature rollouts",
      ],
      ctaText: "Get a Quote",
      ctaLink: "/contact-us",
      popular: false,
    },
    {
      title: "Dedicated Team",
      bestFor:
        "A cross-functional team embedded into your delivery cycle, owning sprint outcomes with you.",
      points: [
        "Tech Lead + Engineers + QA",
        "Weekly sprint delivery and demos",
        "Scale up or down with 30 days notice",
        "Best for: product teams building continuously",
      ],
      ctaText: "Post Your Requirement",
      ctaLink: "/post-requirement",
      popular: true,
    },
    {
      title: "Staff Augmentation",
      bestFor:
        "Individual engineers who integrate into your existing team and work under your processes and priorities.",
      points: [
        "Plug into existing team and tools",
        "You manage the roadmap and priorities",
        "Fast ramp-up, typically within 5-7 days",
        "Best for: CTOs filling skill gaps or scaling sprint capacity fast",
      ],
      ctaText: "Hire Engineers",
      ctaLink: "/contact-us",
      popular: false,
    },
  ],
};

export default function Engagement() {
  return <MadEngagement data={DATA} />;
}

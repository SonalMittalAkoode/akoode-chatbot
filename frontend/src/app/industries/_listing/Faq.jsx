// Reuses the software-development FAQ section (identical design/styling),
// driven by industry-focused questions.
import SdFAQ from "@/app/services-v2/software-development/components/SdFAQ";

const DATA = {
  heading: "Questions Teams",
  headingAccent: "Ask Us First.",
  items: [
    {
      q: "Do you work with companies that are new to software development, or only with established tech teams?",
      a: "We work with both. Some clients come to us with a product brief and no internal engineering team. Others have a strong internal team and need specific expertise or extra capacity. We adjust our approach based on where you are.",
    },
    {
      q: "How do I know if your team understands my industry well enough to build for it?",
      a: "We have delivered across 15 industry verticals and can share relevant work from each. Before any engagement starts, our engineers brief themselves on the domain constraints, compliance requirements, and integration landscape specific to your sector. If you want to verify this, the first call is the place to do it.",
    },
    {
      q: "What is the difference between your Dedicated Team and Staff Augmentation models?",
      a: "Staff Augmentation places individual engineers inside your existing team working under your management. Dedicated Team means we own a cross-functional squad that includes a Tech Lead, engineers, and QA, with shared accountability for sprint delivery outcomes. The right choice depends on your current team structure and how much delivery responsibility you want to carry.",
    },
    {
      q: "How quickly can you start an engagement?",
      a: "For Staff Augmentation, we can typically have profiled engineers ready for your review within 48 to 72 hours. For a Dedicated Team or Fixed Cost project, kick-off usually happens within one to two weeks of contract signature, after scoping and team assembly.",
    },
    {
      q: "Do you only work with clients in India?",
      a: "No. Our client base spans India, the US, UK, Europe, Southeast Asia, and the Middle East. Our teams work across time zones and are set up for async-first collaboration with regular live touchpoints scheduled to fit your working hours.",
    },
    {
      q: "How are projects priced?",
      a: "Fixed Cost projects are priced against a defined scope document. Dedicated Teams and Staff Augmentation are priced on a monthly retainer basis per engineer or per team. We share a detailed cost estimate after the initial scoping call, not before it.",
    },
    {
      q: "Will I get a senior engineer or junior engineers who are supervised by a senior?",
      a: "Seniority is specified upfront based on what your project needs. We do not use a model where junior engineers are passed off under a senior umbrella. If you need senior-level engineers, that is what the team will contain.",
    },
    {
      q: "What industries do you have the most experience in?",
      a: "We have the deepest delivery track record in Healthcare, Finance and Banking, Real Estate, Retail and E-Commerce, and Logistics. That said, we have completed production-ready platforms across all 15 verticals listed on this page.",
    },
    {
      q: "Can you take over a project that is already in progress?",
      a: "Yes. We have taken over mid-build projects multiple times. Before committing, we run a technical assessment of what exists - codebase quality, architecture decisions, outstanding dependencies - and give you a clear picture of what continuation will involve.",
    },
    {
      q: "Do you sign NDAs and handle IP ownership transfer?",
      a: "Yes. NDAs are standard at the start of every engagement. Full IP ownership of all code and deliverables transfers to the client upon project completion or as defined in the contract. We do not retain any licensing or usage rights.",
    },
    {
      q: "What post-launch support do you offer?",
      a: "We offer a defined post-launch support window on all Fixed Cost projects. Dedicated Teams remain available beyond go-live as part of the ongoing engagement. For Staff Augmentation, the engineer stays in your team as long as the engagement continues.",
    },
    {
      q: "How do I get started?",
      a: "Use the contact form or the Founder Call booking link on this page. Bring a short brief about what you are building - a few sentences is enough for the first conversation. We will take it from there.",
    },
  ],
};

export default function Faq() {
  return <SdFAQ data={DATA} />;
}

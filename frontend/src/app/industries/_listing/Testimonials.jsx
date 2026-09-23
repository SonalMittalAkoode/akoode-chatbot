// Reuses the shared testimonials section (identical design/styling) with a
// curated set for the Industries listing page — keeps the existing first review
// and adds the AI / computer-vision client testimonials.
import TestimonialsSection from "@/app/services-v2/_components/TestimonialsSection";

const DATA = {
  heading: "What Our Clients Say",
  items: [
    {
      quote:
        "Akoode Technologies has done a fantastic job developing a custom web application for my global real estate firm. What really stood out was their deep research and data integration for different countries and cities, which added huge value to our platform. The design is modern, sleek, and user-friendly. From start to finish, their team was professional, supportive, and highly skilled. Yes, the pricing is slightly on the higher side, but the quality, speed, and long-term results make it completely worth it.",
      name: "Ankit Goyal",
      designation: "Founder & CEO",
      company: "WeGrow InfraVentures",
      mediaType: "none",
    },
    {
      quote:
        "I engaged Akoode Technologies to implement AI services for monitoring my pharmaceutical plant using vision AI. They did an outstanding job. Thanks to their efforts, our SOPs and compliance are being followed perfectly. I appreciate their hard work and look forward to collaborating with the team again. Akoode Technologies truly stands out as the best AI and computer vision services company in Gurgaon, India.",
      name: "Alexander",
      designation: "CTO",
      mediaType: "none",
    },
    {
      quote:
        "Working with Akoode Technologies was an excellent experience. They helped us build an internal computer vision solution for our coaching platform, enabling coaches to analyze player performance through key metrics such as speed, acceleration, and movement angles. This has allowed us to identify optimal techniques and improve athlete performance with data-driven insights. The team demonstrated strong technical expertise, clear communication, and a deep understanding of our requirements. Together, we successfully delivered a solution that is now being used by American football teams across different levels. We highly recommend Akoode Technologies for AI and computer vision projects.",
      name: "Kartik Malhotra",
      designation: "Coach",
      mediaType: "none",
    },
  ],
};

export default function Testimonials() {
  return <TestimonialsSection data={DATA} centerDotsOnMobile />;
}

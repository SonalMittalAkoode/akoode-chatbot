"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { FiSmartphone, FiMonitor, FiServer, FiDatabase, FiCloud, FiCpu, FiCode, FiLayers } from "react-icons/fi";
import { processHtmlLinks } from "@/utils/processHtmlLinks";

// Mirrors country/_components/TechStack.jsx STATIC_TECH_CATS — same icons, labels, descriptions.
const TECH_CATS = [
  {
    title: "Mobile App Development",
    icon: FiSmartphone,
    desc: "Cross-platform and native mobile foundations engineered for performance and long-term maintainability.",
    pills: [
      { label: "Flutter", img: "/tech_stacks/flutter.svg" },
      { label: "React Native", img: "/tech_stacks/react.svg" },
      { label: "Swift", img: "/tech_stacks/swift.svg" },
      { label: "Kotlin", img: "/tech_stacks/kotlin.svg" },
      { label: "Objective-C", img: "/tech_stacks/apple_objectivec.svg" },
      { label: "Xcode", img: "/tech_stacks/x_code.svg" },
      { label: "Ionic", img: "/tech_stacks/Ionic.svg" },
      { label: "Expo", img: "/tech_stacks/expo.svg" },
      { label: "Firebase", img: "/tech_stacks/firebase.svg" },
    ],
  },
  {
    title: "Frontend Development",
    icon: FiMonitor,
    desc: "Fast, accessible product interfaces built with modern component-driven architectures.",
    pills: [
      { label: "React", img: "/tech_stacks/react.svg" },
      { label: "Next.js", img: "/tech_stacks/nextjs.svg" },
      { label: "Vue.js", img: "/tech_stacks/vue-js.svg" },
      { label: "Angular", img: "/tech_stacks/angular-icon.svg" },
      { label: "TypeScript", img: "/tech_stacks/typescript.svg" },
      { label: "Tailwind CSS", img: "/tech_stacks/tailwind.svg" },
      { label: "Redux", img: "/tech_stacks/redux.svg" },
      { label: "Webpack", img: "/tech_stacks/webpack-icon.svg" },
      { label: "Storybook", img: "/tech_stacks/storybook.svg" },
    ],
  },
  {
    title: "Backend and APIs",
    icon: FiServer,
    desc: "Secure backend services, APIs, and integrations engineered for scale and reliability.",
    pills: [
      { label: "Node.js", img: "/tech_stacks/node-js.svg" },
      { label: "Python", img: "/tech_stacks/python.svg" },
      { label: "Django", img: "/tech_stacks/django.svg" },
      { label: "FastAPI", img: "/tech_stacks/FastAPI.svg" },
      { label: "Express.js", img: "/tech_stacks/express-js.svg" },
      { label: "GraphQL", img: "/tech_stacks/graphql.svg" },
      { label: "REST APIs", img: "/tech_stacks/rest-api.svg" },
      { label: "Java Spring Boot", img: "/tech_stacks/spring.svg" },
      { label: "PHP Laravel", img: "/tech_stacks/laravel.svg" },
    ],
  },
  {
    title: "AI and Machine Learning",
    icon: FiCpu,
    desc: "Production-ready AI workflows from intelligent assistants to vector search and model serving.",
    pills: [
      { label: "OpenAI API", img: "/tech_stacks/openai.svg" },
      { label: "LangChain", img: "/tech_stacks/langchain.svg" },
      { label: "HuggingFace", img: "/tech_stacks/huggingface.svg" },
      { label: "PyTorch", img: "/tech_stacks/pytorch.svg" },
      { label: "TensorFlow", img: "/tech_stacks/tensor_flow.svg" },
      { label: "scikit-learn", img: "/tech_stacks/scikit-learn.svg" },
      { label: "Pinecone", img: "/tech_stacks/Pinecone.svg" },
      { label: "Ollama", img: "/tech_stacks/ollama-icon.svg" },
    ],
  },
  {
    title: "Cloud and DevOps",
    icon: FiCloud,
    desc: "Reliable deployment infrastructure, automated pipelines, and observability built for product velocity.",
    pills: [
      { label: "AWS", img: "/tech_stacks/aws.svg" },
      { label: "Google Cloud", img: "/tech_stacks/google-cloud.svg" },
      { label: "Microsoft Azure", img: "/tech_stacks/azure.svg" },
      { label: "Docker", img: "/tech_stacks/docker.svg" },
      { label: "Kubernetes", img: "/tech_stacks/kubernetes.svg" },
      { label: "Terraform", img: "/tech_stacks/terraform.svg" },
      { label: "GitHub Actions", img: "/tech_stacks/github_actions.svg" },
      { label: "Jenkins", img: "/tech_stacks/jenkins.svg" },
    ],
  },
  {
    title: "Database",
    icon: FiDatabase,
    desc: "Data models, caches, and analytics stores chosen around product growth and query patterns.",
    pills: [
      { label: "PostgreSQL", img: "/tech_stacks/postgresql.svg" },
      { label: "MongoDB", img: "/tech_stacks/mongodb.svg" },
      { label: "MySQL", img: "/tech_stacks/mysql.svg" },
      { label: "Redis", img: "/tech_stacks/redis.svg" },
      { label: "Elasticsearch", img: "/tech_stacks/elasticsearch.svg" },
      { label: "Supabase", img: "/tech_stacks/supabase.svg" },
      { label: "Firebase Firestore", img: "/tech_stacks/firebase.svg" },
      { label: "DynamoDB", img: "/tech_stacks/aws-dynamodb.svg" },
      { label: "ClickHouse", img: "/tech_stacks/clickhouse.svg" },
    ],
  },
];

const AUTO_INTERVAL = 2800;
const CARD_DELAYS = ["delay-0", "delay-100", "delay-200", "delay-[280ms]"];

function TechIcon({ icon, iconImg, label, className = "", width = 28, height = 28 }) {
  if (iconImg) {
    return <Image src={iconImg} alt={label ? `${label} logo` : "Technology stack logo"} width={width} height={height} className={className} />;
  }
  if (icon) {
    if (typeof icon === "function" || (typeof icon === "object" && icon !== null)) {
      const Icon = icon;
      return <Icon size={width} className={className} />;
    }
    return <span className={className}>{icon}</span>;
  }
  return null;
}

export default function TechStack({ data }) {
  const heading = data?.heading;
  const subtitle = data?.subtitle || "We work across the full modern stack - choosing the right tools for each challenge, not forcing one size fits all.";
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const timerRef = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const section = document.getElementById("tech-stack");
    if (!section) return;

    const ioEnter = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setEntered(true);
          ioEnter.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    ioEnter.observe(section);

    let carouselStarted = false;
    const ioCarousel = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || carouselStarted || window.innerWidth >= 768) return;
        carouselStarted = true;
        ioCarousel.disconnect();

        timerRef.current = setInterval(() => {
          if (pausedRef.current) return;
          const el = trackRef.current;
          if (!el) return;
          const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
          if (atEnd) {
            el.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            const card = el.firstElementChild;
            const step = card ? card.offsetWidth + 16 : el.clientWidth;
            el.scrollBy({ left: step, behavior: "smooth" });
          }
        }, AUTO_INTERVAL);
      },
      { threshold: 0.3 }
    );
    ioCarousel.observe(section);

    return () => {
      ioEnter.disconnect();
      ioCarousel.disconnect();
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <section
      id="tech-stack"
      className="relative overflow-x-clip py-16 sm:py-20 lg:py-24 font-figtree"
      style={{
        background:
          "linear-gradient(160deg, #f5f3fa 0%, #ebe9f4 40%, #f2eff8 100%)",
      }}
    >
      {/* Glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[60px] -top-20 z-0 h-[380px] w-[520px] rounded-full blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(119,132,197,0.28) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-[60px] z-0 h-[340px] w-[440px] rounded-full blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(79,96,181,0.22) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-[1] mx-auto w-[min(1440px,calc(100%-4rem))]">
        {/* Header */}
        <div
          className={[
            "max-w-[920px] mx-auto mb-12 md:mb-16 text-left md:text-center",
            "transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
            entered ? "translate-y-0 opacity-100" : "translate-y-[50px] opacity-0",
          ].join(" ")}
        >
          <h2 className="ind-h2 text-[#14153d] mb-4">
            {heading ? (
              heading
            ) : (
              <>
                Built with{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #7784C5 0%, #889AF5 100%)",
                  }}
                >
                  Best-in-Class
                </span>{" "}
                Technologies
              </>
            )}
          </h2>
          <div
            className="ind-lead text-[#4A5565] [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: processHtmlLinks(subtitle) }}
          />
        </div>

        {/* Cards — mobile horizontal scroll / md grid 2-col / xl grid 6-col with span logic */}
        <div
          ref={trackRef}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
          onTouchStart={() => { pausedRef.current = true; }}
          onTouchEnd={() => { pausedRef.current = false; }}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 xl:grid-cols-6"
        >
          {TECH_CATS.map((cat, i) => (
            <div
              key={cat.title}
              className={[
                "w-[calc(100%-2rem)] flex-none snap-start md:w-auto md:flex-initial",
                "rounded-[28px] bg-white p-8",
                "border border-[rgba(119,132,197,0.1)]",
                "shadow-[0_2px_20px_rgba(119,132,197,0.07)]",
                "transition-[opacity,transform] duration-700 ease-out",
                CARD_DELAYS[i] ?? "delay-300",
                entered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                i < 3
                  ? "xl:col-span-2"
                  : TECH_CATS.length === 5
                    ? "xl:col-span-3"
                    : "xl:col-span-2",
              ].join(" ")}
            >
              {/* Card header */}
              <div className="mb-6 flex items-start gap-4">
                <div
                  className="hidden md:flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl"
                  style={{ background: "rgba(119,132,197,0.1)" }}
                >
                  <TechIcon
                    icon={cat.icon}
                    iconImg={cat.iconImg}
                    label={cat.title}
                    className="h-6 w-6 object-contain text-[#5a58a7]"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <h3 className="ind-card-title mb-1 text-[#14153d]">
                    {cat.title}
                  </h3>
                  <div
                    className="ind-body text-[#62668a] [&_p]:m-0"
                    dangerouslySetInnerHTML={{ __html: processHtmlLinks(cat.desc || "") }}
                  />
                </div>
              </div>

              {/* Pills grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cat.pills.map((p) => (
                  <div
                    key={p.label}
                    className="flex h-[86px] flex-col items-center justify-center gap-2 rounded-[14px] border border-[rgba(119,132,197,0.12)] bg-white px-1 text-center transition-all duration-200 hover:border-[#7784C5] overflow-hidden"
                  >
                    <div className="flex h-8 items-center justify-center shrink-0">
                      <TechIcon
                        icon={p.e}
                        iconImg={p.img}
                        label={p.label}
                        className="h-7 w-7 object-contain text-[24px] leading-none text-[#4f547c]"
                        width={28}
                        height={28}
                      />
                    </div>
                    <span className="w-full px-1 text-[11px] sm:text-[12px] md:text-[13px] font-medium text-[#2a2d52] leading-tight">
                      {p.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

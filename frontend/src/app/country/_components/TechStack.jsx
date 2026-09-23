"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { buildAssetUrl, resolveIcon, splitTitle } from "./shared";
import RichText from "./RichText";

// Static, non-editable tech stack. Sourced from /public/tech_stacks/*.svg.
// Admin cannot edit this — the section is hard-coded across all SBC pages.
const STATIC_TECH_CATS = [
  {
    title: "Mobile App Development",
    icon: "🖥️",
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
    icon: "🎨",
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
    icon: "🗄️",
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
    icon: "🧠",
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
    icon: "☁️",
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
    icon: "💾",
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

const ENTER_EASE = "ease-[cubic-bezier(0.2,0.8,0.2,1)]";
const CARD_DELAYS = ["delay-0", "delay-100", "delay-200", "delay-[280ms]"];

function TechIcon({ icon, iconImg, label, className = "", width = 28, height = 28 }) {
  // Local public assets (e.g. /tech_stacks/react.svg) should be served as-is by Next.js;
  // only run paths through buildAssetUrl when they point to backend-uploaded files.
  const rawImg = iconImg || "";
  const iconSrc = rawImg && (rawImg.startsWith("/") || rawImg.startsWith("http"))
    ? rawImg
    : buildAssetUrl(rawImg);
  const Icon = resolveIcon(icon, null);

  if (iconSrc) {
    return <Image src={iconSrc} alt={label ? `${label} icon` : ""} width={width} height={height} className={className} />;
  }

  if (Icon) {
    return <Icon className={className} strokeWidth={1.8} />;
  }

  if (icon) {
    return <span className={className}>{icon}</span>;
  }

  return null;
}

export function TechStack({ data }) {
  // TechStack is intentionally static — the admin form no longer manages this section.
  // Heading/subtitle remain configurable via CMS so per-page tone can still be tuned.
  const heading = data?.heading || "Built with Best-in-Class Technologies";
  const subtitle =
    data?.subtitle ||
    "We work across the full modern stack — choosing the right tools for each challenge, not forcing one size fits all.";
  const TECH_CATS = STATIC_TECH_CATS;
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
            const gap = 16;
            const step = card ? card.offsetWidth + gap : el.clientWidth;
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
      className="relative overflow-x-clip bg-[linear-gradient(160deg,#f5f3fa_0%,#ebe9f4_40%,#f2eff8_100%)] py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[60px] -top-20 z-0 h-[380px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(140,115,255,0.32)_0%,transparent_65%)] blur-[90px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-[60px] z-0 h-[340px] w-[440px] rounded-full bg-[radial-gradient(circle,rgba(100,80,240,0.26)_0%,transparent_65%)] blur-[90px]"
      />

      <div className="relative z-[1] mx-auto w-[min(1440px,calc(100%-4rem))]">
        <div
          className={[
            "sbc-section-head sbc-section-head--single-title !max-w-[920px] mx-auto mb-12 md:mb-16",
            "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
            "transition-[opacity,transform] duration-[900ms]",
            ENTER_EASE,
            entered ? "translate-y-0 opacity-100" : "translate-y-[50px] opacity-0",
          ].join(" ")}
        >
          <h2 className="sbc-h2 sbc-section-title text-[#1a1a1a] font-bold transition-colors duration-400 mb-0">
            {(() => {
              const { main, accent, suffix } = splitTitle(heading);
              return (
                <>
                  {main} {accent && <span className="sbc-heading-accent">{accent}</span>} {suffix}
                </>
              );
            })()}
          </h2>
          <RichText className="sbc-body-lg sbc-section-subtitle text-[#2a2d52]" html={subtitle} />
        </div>

        <div
          ref={trackRef}
          className={[
            "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2", "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0", "md:grid md:grid-cols-2", "xl:grid-cols-6",

            "md:gap-6 md:overflow-visible md:pb-0",
          ].join(" ")}
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
          onTouchStart={() => {
            pausedRef.current = true;
          }}
          onTouchEnd={() => {
            pausedRef.current = false;
          }}
        >
          {TECH_CATS.map((cat, i) => (
            <div
              key={cat.title}
              className={["w-[calc(100%-2rem)] flex-none snap-start", "rounded-[28px]", "border border-[rgba(100,80,200,0.08)]", "bg-white p-8", "shadow-[0_2px_20px_rgba(124,110,240,0.04)]", "transition-[opacity,transform] duration-700 ease-out",
                CARD_DELAYS[i] ?? "delay-300",
                entered
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
                "md:w-auto md:flex-initial",
                i < 3
                  ? "xl:col-span-2"
                  : TECH_CATS.length === 5 
                    ? "xl:col-span-3" 
                    : "xl:col-span-2",
              ].join(" ")}
            >
              <div className="mb-6 flex items-start gap-4">
                <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(124,110,240,0.08)] text-2xl">
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
                  <h3 className="mb-1 text-[20px] font-semibold text-[#14153d]">
                    {cat.title}
                  </h3>

                  <p className="text-[14px] leading-[1.6] text-[#62668a]">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cat.pills.map((p) => (
                  <div
                    key={p.label}
                    className="flex h-[86px] flex-col items-center justify-center gap-2 rounded-[14px] border border-[rgba(100,80,200,0.12)] bg-white px-1 text-center transition-all duration-200 hover:border-[#7c6ef0] overflow-hidden"
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

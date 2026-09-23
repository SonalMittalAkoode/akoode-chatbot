import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  FiSmartphone,
  FiMonitor,
  FiServer,
  FiDatabase,
  FiCloud,
  FiCpu,
} from "react-icons/fi";
import { Reveal, Heading } from "./shared";
import { renderIcon, RichText, pick, pickList } from "./dynamic";

/* Tech-stack categories — mirrored from industries/_components/TechStack.jsx */
const TECH_CATS = [
  {
    title: "Mobile Development",
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

const DEFAULT_INTRO =
  "A purposefully selected stack optimized for real-time video processing, high-accuracy detection and scalable data pipelines.";

export default function TechStackSection({ data }) {
  const heading = pick(data?.heading, "Built With Advanced ");
  const accent = pick(data?.headingAccent, "AI Technologies");
  const intro = pick(data?.intro, DEFAULT_INTRO);
  const cats = pickList(data?.cats, TECH_CATS);
  const ctaText = pick(data?.ctaText, "Start Your Project");
  const ctaLink = pick(data?.ctaLink, "/post-requirement");

  return (
    <section
      className="relative overflow-hidden py-[50px] font-figtree md:py-[80px]"
      style={{
        background:
          "linear-gradient(160deg, #f5f3fa 0%, #ebe9f4 40%, #f2eff8 100%)",
      }}
    >
      {/* glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[60px] -top-20 h-[380px] w-[520px] rounded-full blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(119,132,197,0.28) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-[60px] h-[340px] w-[440px] rounded-full blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(79,96,181,0.22) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[92rem] px-5 sm:px-8 lg:px-[clamp(1.5rem,3vw,3rem)]">
        <Reveal className="max-w-4xl">
          <Heading eyebrow="Case Study" lead={heading} accent={accent} />
          <RichText
            html={intro}
            className="mt-5 text-[14px] leading-[1.5] text-[#191A2E]/90 sm:text-[16px] md:mt-6 lg:text-[18px]"
          />
        </Reveal>

        {/* tech-stack cards (ported from the industries page) */}
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-14 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 xl:grid-cols-6">
          {cats.map((cat, i) => (
              <Reveal
                key={cat.title || i}
                delay={i * 0.05}
                className={`w-[calc(100%-2.5rem)] flex-none snap-start rounded-[28px] border border-[rgba(119,132,197,0.1)] bg-white p-6 shadow-[0_2px_20px_rgba(119,132,197,0.07)] sm:p-8 md:w-auto md:flex-initial ${
                  i < 3 ? "xl:col-span-2" : "xl:col-span-2"
                }`}
              >
                {/* card header */}
                <div className="mb-6 flex items-start gap-4">
                  <div
                    className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full md:flex"
                    style={{ background: "rgba(119,132,197,0.1)" }}
                  >
                    {renderIcon(cat.icon, { size: 24, className: "text-[#5a58a7]" })}
                  </div>
                  <div>
                    <h3 className="mb-1 text-[17px] font-semibold text-[#14153d] sm:text-[18px] lg:text-[20px]">
                      {cat.title}
                    </h3>
                    <RichText
                      html={cat.desc}
                      className="text-[13px] leading-[1.6] text-[#62668a] sm:text-[14px] lg:text-[15px]"
                    />
                  </div>
                </div>

                {/* pills grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {(cat.pills || []).map((p, j) => (
                    <div
                      key={p.label || j}
                      className="flex h-[86px] flex-col items-center justify-center gap-2 overflow-hidden rounded-[14px] border border-[rgba(119,132,197,0.12)] bg-white px-1 text-center transition-all duration-200 hover:border-[#7784C5]"
                    >
                      <div className="flex h-8 shrink-0 items-center justify-center">
                        {p.img && (
                          <Image
                            src={p.img}
                            alt={`${p.label} logo`}
                            width={28}
                            height={28}
                            className="h-7 w-7 object-contain"
                          />
                        )}
                      </div>
                      <span className="w-full px-1 text-[11px] font-medium leading-tight text-[#2a2d52] sm:text-[12px] md:text-[13px]">
                        {p.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
          ))}
        </div>

        {/* CTA — bottom centered */}
        <Reveal className="mt-10 flex justify-center md:mt-14">
          <Link
            href={ctaLink}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] px-8 py-3.5 text-[15px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(88,92,156,0.4)] md:text-[16px]"
          >
            {ctaText}
            <ArrowRight
              size={18}
              className="rotate-[-45deg] transition-transform duration-300 group-hover:rotate-0"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

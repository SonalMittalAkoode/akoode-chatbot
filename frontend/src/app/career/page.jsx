import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { getFrontendJobs } from "@/api/frontend/job";
import { getLifeAtAkoodeImages } from "@/api/frontend/lifeAtAkoodeImage";
import About5SectionArea from "./components/About5SectionArea";
import SubscribeForm from "../../components/SubscribeForm";
import {
  normalizedSiteUrl,
  defaultOgImage,
  buildCanonical,
  organizationId,
} from "@/utils/seo";
import JsonLdScript from "@/components/security/JsonLdScript";

const careerCanonical = buildCanonical("/career");

export const metadata = {
  title: "Career - Akoode | Latest Job Openings",
  description:
    "Explore the latest job openings at Akoode. We are always looking for talented individuals to join our team. Apply for a job at Akoode today.",
  authors: [{ name: "Akoode Technologies" }],
  alternates: { canonical: careerCanonical },
  openGraph: {
    title: "Career - Akoode | Latest Job Openings",
    description:
      "Explore the latest job openings at Akoode. We are always looking for talented individuals to join our team. Apply for a job at Akoode today.",
    url: careerCanonical,
    siteName: "Akoode Technologies",
    type: "website",
    images: [{ url: defaultOgImage }],
  },
  twitter: {
    card: "summary",
    title: "Career - Akoode | Latest Job Openings",
    description:
      "Explore the latest job openings at Akoode. We are always looking for talented individuals to join our team. Apply for a job at Akoode today.",
    images: [defaultOgImage],
  },
};

const stripHtml = (value) => {
  if (!value) return "";
  return String(value).replace(/<[^>]*>/g, "").trim();
};

export default async function CareerPage({ searchParams }) {
  const resolvedParams = await searchParams;
  if (resolvedParams?.page) {
    redirect("/career");
  }
  const currentPage = 1;
  const [jobsResponse, lifeAtAkoodeImages] = await Promise.all([
    getFrontendJobs(1, 3),
    getLifeAtAkoodeImages(),
  ]);
  // console.log('=== Career Page Debug ===');
  // console.log('lifeAtAkoodeImages:', lifeAtAkoodeImages);
  const jobs = Array.isArray(jobsResponse?.data) ? jobsResponse.data : [];
  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: normalizedSiteUrl || "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Career",
        item: careerCanonical,
      },
    ],
  };
  const jobPostingSchemas = jobs
    .map((job) => {
      const title = stripHtml(job?.title);
      const description =
        stripHtml(job?.shortDescription) || stripHtml(job?.description);
      if (!title || !description) return null;
      const schema = {
        "@type": "JobPosting",
        title,
        description,
        hiringOrganization: {
          "@type": "Organization",
          "@id": organizationId,
          name: "Akoode Technologies",
        },
      };
      if (job?.tag) {
        schema.employmentType = job.tag;
      }
      if (job?.location) {
        schema.jobLocation = {
          "@type": "Place",
          address: job.location,
        };
      }
      if (job?.createdAt) {
        schema.datePosted = job.createdAt;
      }
      return schema;
    })
    .filter(Boolean);
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [breadcrumbSchema, ...jobPostingSchemas],
  };
  return (
    <>
      <JsonLdScript id="schema-career" data={schemaJsonLd} />

      <NavBar />

      <div className="pt-[120px] pb-[60px] md:pt-32 md:pb-20 bg-center bg-no-repeat bg-cover bg-[url('/inner-bg.webp')]">
        <div className="w-full mx-auto px-[15px] min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px] min-[1400px]:max-w-[1320px]">
          <div className="flex justify-center">
            <div className="w-full max-w-lg text-center">
              <h1 className="text-2xl md:text-[42px] font-semibold mb-4 md:mb-8 font-sans text-white">
                Career <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#2A2B44_0%,#4A5175_25%,#00F6FF_50%,#4A5175_75%,#2A2B44_100%)] bg-[length:200%_auto] animate-text-shine">
                  Opportunities
                </span>
              </h1>
              <p className="text-white/90 text-sm md:text-base">
                <Link className="hometag hover:text-white transition-colors" href="/">
                  Home</Link> <ChevronRight className="mx-2 text-[10px] inline-block align-middle stroke-[5px]" size={12}  />{" "}
                <span className="text-white font-semibold">Career</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <About5SectionArea
        jobSection={{
          jobs: jobsResponse?.data || [],
          pagination: jobsResponse?.pagination || {},
          currentPage,
        }}
        lifeAtAkoodeImages={lifeAtAkoodeImages}
      />
      <SubscribeForm />
      <Footer />
    </>
  );
}

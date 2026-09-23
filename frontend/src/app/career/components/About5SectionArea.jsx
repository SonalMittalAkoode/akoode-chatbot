"use client";
import JobCardsSection from "./JobCardsSection";
import JobApplicationModal from "./JobApplicationModal";
import SubmitResumeForm from "./SubmitResumeForm";
import CultureShowcaseCarousel from "./CultureShowcaseCarousel";
import SectionBadge from "../../../components/SectionBadge";
import { m } from "framer-motion";
import Image from 'next/image';

export default function CareersSection({ jobSection = {}, lifeAtAkoodeImages = [] }) {
  const { jobs = [], pagination = {}, currentPage = 1 } = jobSection;

  return (
    <>
      <div className="py-[70px] relative z-10 overflow-hidden bg-white">
        <div className="container mx-auto bg-white px-[2rem] md:px-[70px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Content (Second on mobile, original position on desktop) */}
            <div className="lg:col-span-5 order-2 lg:order-none">
              <div className="mb-6">
                <SectionBadge text="Shaping Careers, Building Futures" />
                <div className="h-4"></div>

                <m.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="text-[24px] leading-[32px] font-semibold text-[#060606] font-sans text-[22px] md:text-[24px] leading-[30px] md:leading-[32px]"
                >
                  Join Akoode Technologies Company and Make an Impact
                </m.h2>

                <div className="h-6 md:h-6 h-4 md:h-6"></div>

                <m.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <div className="text-[16px] font-medium leading-[26px] font-sans text-[#2A2B44] text-[15px] md:text-[16px] leading-[24px] md:leading-[26px]">
                    <p>
                      At Akoode Technologies, we're constantly seeking motivated and skilled professionals who are eager
                      to create real impact. Here, it's not just about finding a job — it's about building a rewarding
                      career where you can expand your knowledge, develop your talents, and achieve long-term growth.
                    </p>

                    <div className="h-6 md:h-6 h-4 md:h-6"></div>

                    <p>
                      At Akoode Technologies, we welcome innovators, problem solvers, creative minds, and collaborative
                      team players. Here, you'll discover opportunities to push your limits, make a real difference, and
                      contribute to a vision that's larger than yourself.
                    </p>
                  </div>
                </m.div>

                <div className="h-6 md:h-6 h-4 md:h-6"></div>
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-1"></div>

            {/* Image (First on mobile, original position on desktop) */}
            <div className="lg:col-span-6 order-1 lg:order-none mb-6 lg:mb-0">
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-xl w-full group"
              >
                <Image
                  src="/akoode-culture.webp"
                  alt="Life at Akoode"
                  width={1200}
                  height={700}
                  sizes="(max-width:768px) 100vw, 1200px"
                  className="w-full h-auto object-cover transition-transform duration-700"
                />
              </m.div>
            </div>

          </div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-8 lg:mt-16"
          >
            <h2 className="text-[32px] font-semibold text-[#1e1e1e] mb-2 font-figtree text-[26px] md:text-[32px]">
              Who Thrives at Akoode
            </h2>
            <p className="text-[#6c6c6c] max-w-full mx-auto font-figtree text-[14px] md:text-base">
              We’re always excited to work with people who bring both skill and intent to the table. You’ll feel at home at Akoode if you are:
            </p>
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-figtree text-center">
            {[
              { title: "Purpose-Led Thinkers:", text: "Build technology that simplifies lives, not just systems or features." },
              { title: "Human-First Collaborators:", text: "Work at the intersection of intelligence, empathy, and shared ownership." },
              { title: "Impact-Focused Builders:", text: "Create solutions that are smart, meaningful, and built to last." }
            ].map((card, idx) => (
              <m.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                viewport={{ once: true }}
                className="h-full"
              >
                <div className="bg-[#FFFFFF] p-6 rounded-2xl h-full transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
                  <strong className="block text-[#1e1e1e] text-lg mb-2">{card.title}</strong>
                  <p className="text-[#6c6c6c] text-[15px] leading-relaxed m-0">{card.text}</p>
                </div>
              </m.div>
            ))}
          </div>

        </div>
      </div>

      <CultureShowcaseCarousel images={lifeAtAkoodeImages} />

      <div className="py-[60px] md:py-[40px] bg-white">
        <div className="container mx-auto px-4">
          <JobCardsSection
            jobs={jobs}
            pagination={pagination}
            currentPage={currentPage}
            basePath="/career"
          />

          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] my-8 text-center max-w-3xl mx-auto">
            <h5 className="text-[#1e1e1e] font-normal mb-2 font-satisfy text-3xl">
              Can't Find the Right Role?
            </h5>
            <p className="font-figtree text-[#2b2b2b] text-[15px] leading-[1.7] text-center">
              We're always open to connecting with passionate professionals. Share your resume with us at{" "}
              <a
                href="mailto:hr@akoode.in"
                className="text-[#2563eb] font-medium hover:underline"
              >
                hr@akoode.in
              </a>
              , and we'll reach out when a suitable opportunity comes up.
            </p>
          </div>

          <SubmitResumeForm />
        </div>
      </div>

      {/* <JobApplicationModal /> */}
    </>
  );
}
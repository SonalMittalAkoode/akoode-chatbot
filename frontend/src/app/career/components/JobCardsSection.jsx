"use client";

import { useState, useCallback } from "react";
import { m } from "framer-motion";
import Button from "@/components/Button";

const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_FRONTEND_API_URL ||
  "http://localhost:5000";

const formatDeadline = (deadline) => {
  if (!deadline) return "Deadline not specified";
  const date = new Date(deadline);
  if (isNaN(date.getTime())) return "Deadline not specified";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const shortTitle = (title) => {
  if (!title) return "";
  const parts = title.trim().split(/\s+/);
  if (parts.length <= 2) return title;
  return parts.slice(0, 2).join(" ");
};

export default function JobCardsSection({
  jobs = [],
  pagination = {},
}) {
  const totalPages = pagination?.totalPages ?? 1;
  const [displayedJobs, setDisplayedJobs] = useState(jobs);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(totalPages > 1);
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleShortDescription = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const apiBase = NEXT_PUBLIC_API_URL.replace(/\/$/, "");
      const res = await fetch(
        `${apiBase}/frontend/api/job/jobs?page=${nextPage}&limit=3`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      const newJobs = Array.isArray(json?.data) ? json.data : [];
      setDisplayedJobs((prev) => [...prev, ...newJobs]);
      setPage(nextPage);
      setHasMore(nextPage < (json?.pagination?.totalPages ?? 1));
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  if (!Array.isArray(displayedJobs) || displayedJobs.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-10 md:py-0 md:pb-[30px] bg-white">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4">
            <m.h3
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-[#1e1e1e] font-figtree text-2xl sm:text-3xl md:text-4xl font-normal text-center mb-6 sm:mb-8"
            >
              Current Openings
            </m.h3>
            <div className="h-4"></div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6 items-center">
          {displayedJobs.map((job, index) => {
            const jobKey = job?._id ?? job?.id ?? job?.title;
            const jobSlug = job?.slug || jobKey;
            const isExpanded = expandedItems[jobKey];
            return (
              <m.div
                key={jobKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: "easeOut" }}
                viewport={{ once: true }}
                className="w-full max-w-[900px] mx-auto"
              >
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-[30px] items-center p-4 sm:p-5 md:p-[20px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-xl sm:rounded-2xl md:rounded-[20px] mx-auto text-center md:text-left transition-all duration-300 hover:shadow-[0_12_32px_rgba(0,0,0,0.15)] border border-gray-100">
                  <div className="bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] p-2 sm:p-[8px_4px] text-white text-center rounded-[10px] sm:rounded-[12px] h-[100px] sm:h-[140px] md:h-[180px] flex justify-center items-center flex-[0.4] w-full md:w-auto min-w-0 md:min-w-[200px] shadow-md shrink-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-normal font-figtree m-0 px-2">{shortTitle(job?.title) || job?.tag || "Job"}</h3>
                  </div>
                  <div className="flex-1 w-full md:w-auto min-w-0">
                    <div className="flex flex-col md:flex-row gap-2 sm:gap-[10px] md:gap-[20px] items-center mb-0 justify-center md:justify-start">
                      <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-normal font-figtree text-[#1e1e1e] m-0">{job?.title}</h2>
                      <p className="text-[10px] bg-[#474972] text-white font-normal rounded-[6px] px-[8px] py-[2px] border border-[#E0E7FF] shrink-0">{job?.tag || "Job"}</p>
                    </div>
                    {job?.location && (
                      <p className="text-[#6c6c6c] font-figtree mb-2 sm:mb-[10px] flex items-center justify-center md:justify-start gap-1 flex-wrap">
                        <span className="font-bold text-black text-[13px] sm:text-[14px]">Location:</span>
                        <span className="font-normal text-black text-[13px] sm:text-[14px]">{job.location}</span>
                      </p>
                    )}
                    {job?.shortDescription && (
                      <p className={`max-w-[600px] mx-auto md:mx-0 text-center md:text-left text-[#6c6c6c] text-[13px] sm:text-[14px] leading-[1.4] sm:leading-[1.2] mb-2 ${isExpanded ? "" : "line-clamp-2"}`}>
                        {String(job.shortDescription).replace(/<[^>]*>/g, '')}
                      </p>
                    )}
                    <button
                      className="text-[#474972] text-[12px] sm:text-[13px] font-normal hover:opacity-80 transition-all mb-3 sm:mb-4 flex w-full justify-center md:justify-start items-center underline decoration-2 underline-offset-4"
                      type="button"
                      onClick={() => toggleShortDescription(jobKey)}
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                    <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 text-sm text-[#474972] font-medium justify-center md:justify-start">
                      {job?.experience && (
                        <span className="flex items-center gap-2">
                          <span className="font-bold text-black text-[13px] sm:text-[14px]">Experience:</span>
                          <span className="text-[13px] sm:text-[14px]">{job.experience}</span>
                        </span>
                      )}
                      {job?.salary && (
                        <span className="flex items-center gap-2">
                          <span className="font-bold text-black text-[13px] sm:text-[14px]">Salary:</span>
                          <span className="text-[13px] sm:text-[14px]">{job.salary}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-2">
                        <span className="font-bold text-black text-[13px] sm:text-[14px]">Deadline:</span>
                        <span className="text-[13px] sm:text-[14px]">{formatDeadline(job.deadline)}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex-[0.4] w-full md:w-auto flex justify-center md:justify-end shrink-0">
                    <div className="text-center md:text-left w-full flex justify-center md:justify-end">
                      <Button
                        text="Apply Now"
                        href={`/career/${jobSlug}`}
                      />
                    </div>
                  </div>
                </div>
              </m.div>
            );
          })}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8 sm:mt-10">
            <button
              onClick={loadMore}
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#474972] text-white font-figtree text-[15px] rounded-xl hover:bg-[#585c9c] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

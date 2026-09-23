"use client";

import TableData from "./TableData";
import Pagination from "@/app/thebusinesshub/(authenticated)/enquiries/_components/Pagination";
import { useState, useEffect, useCallback } from "react";
import { getJobApplications } from "@/api/jobApplication";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

export default function JobApplicationsContent() {
  const [applicationList, setApplicationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchApplications = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await getJobApplications({ limit: PAGE_SIZE, page });
      setApplicationList(res?.applications || []);
      setTotalCount(res?.total ?? 0);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      toast.error("Failed to fetch job applications");
      setApplicationList([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications(currentPage);
  }, [currentPage, fetchApplications]);

  const handlePageChange = (page) => setCurrentPage(page);

  if (loading && applicationList.length === 0) {
    return (
      <div className="text-center p-4">
        <p>Loading job applications...</p>
      </div>
    );
  }

  const handleDeleteSuccess = () => {
    setTotalCount((prev) => Math.max(0, prev - 1));
    if (applicationList.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <TableData
        applicationList={applicationList}
        setApplicationList={setApplicationList}
        onDeleteSuccess={handleDeleteSuccess}
      />
      {totalCount > PAGE_SIZE && (
        <div className="mt30">
          <Pagination
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}

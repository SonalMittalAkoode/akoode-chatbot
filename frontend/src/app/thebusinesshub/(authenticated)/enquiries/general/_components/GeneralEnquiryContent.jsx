"use client";

import TableData from "./TableData";
import Pagination from "../../_components/Pagination";
import { useState, useEffect, useCallback } from "react";
import { getJobEnquiryTableData } from "@/api/jobenquiry";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

export default function GeneralEnquiryContent() {
  const [enquiryList, setEnquiryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchEnquiries = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await getJobEnquiryTableData({ limit: PAGE_SIZE, page });
      setEnquiryList(res?.enquiries || res?.items || []);
      setTotalCount(res?.totalCount ?? 0);
    } catch (error) {
      console.error("Error fetching general enquiries:", error);
      toast.error("Failed to fetch general enquiries");
      setEnquiryList([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries(currentPage);
  }, [currentPage, fetchEnquiries]);

  const handlePageChange = (page) => setCurrentPage(page);

  if (loading && enquiryList.length === 0) {
    return (
      <div className="text-center p-4">
        <p>Loading general enquiries...</p>
      </div>
    );
  }

  const handleDeleteSuccess = () => {
    setTotalCount((prev) => Math.max(0, prev - 1));
    if (enquiryList.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <TableData
        enquiryList={enquiryList}
        setEnquiryList={setEnquiryList}
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

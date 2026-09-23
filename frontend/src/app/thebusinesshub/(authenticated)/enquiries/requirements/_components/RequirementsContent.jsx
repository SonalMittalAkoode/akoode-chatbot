"use client";

import TableData from "./TableData";
import Pagination from "../../_components/Pagination";
import { useState, useEffect, useCallback } from "react";
import { getEnquiryTableData } from "@/api/enquiry";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

export default function RequirementsContent() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchRequirements = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await getEnquiryTableData({
        limit: PAGE_SIZE,
        page,
        source: "post-requirement",
      });
      setList(res?.items || []);
      setTotalCount(res?.totalCount ?? 0);
    } catch (error) {
      console.error("Error fetching post requirement enquiries:", error);
      toast.error("Failed to fetch post requirement enquiries");
      setList([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequirements(currentPage);
  }, [currentPage, fetchRequirements]);

  const handlePageChange = (page) => setCurrentPage(page);

  if (loading && list.length === 0) {
    return (
      <div className="text-center p-4">
        <p>Loading post requirement enquiries...</p>
      </div>
    );
  }

  const handleDeleteSuccess = () => {
    setTotalCount((prev) => Math.max(0, prev - 1));
    if (list.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <TableData list={list} setList={setList} onDeleteSuccess={handleDeleteSuccess} />
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

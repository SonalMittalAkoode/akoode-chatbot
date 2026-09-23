"use client";

import TableData from "./list/TableData";
import Pagination from "@/app/thebusinesshub/(authenticated)/enquiries/_components/Pagination";
import { useState, useEffect, useCallback } from "react";
import { getSubscribersAPI } from "@/api/newsletter";

const PAGE_SIZE = 10;

export default function SubscribersContent() {
  const [subscriberList, setSubscriberList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSubscribers = useCallback(async (page = 1) => {
      try {
        setLoading(true);
        const userStr = sessionStorage.getItem("user");
        const token = userStr ? JSON.parse(userStr)?.token : null;

        if (!token) {
          setSubscriberList([]);
          setTotalCount(0);
          return;
        }

        const response = await getSubscribersAPI(token, { limit: PAGE_SIZE, page });
        if (response?.status === "success") {
          setSubscriberList(response.data || []);
          setTotalCount(response.totalCount ?? 0);
        } else {
          setSubscriberList([]);
          setTotalCount(0);
        }
      } catch (error) {
        console.error("Error fetching subscribers:", error);
        setSubscriberList([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
  }, []);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleDeleteSuccess = () => {
    setTotalCount((prev) => Math.max(0, prev - 1));
    if (subscriberList.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    fetchSubscribers(currentPage);
  }, [currentPage, fetchSubscribers]);

  if (loading) {
    return (
      <div className="text-center p-4">
        <p>Loading subscribers...</p>
      </div>
    );
  }

  return (
    <>
      <TableData
        subscribers={subscriberList}
        setSubscriberList={setSubscriberList}
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

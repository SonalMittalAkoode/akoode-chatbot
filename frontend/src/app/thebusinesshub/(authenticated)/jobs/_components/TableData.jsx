"use client";

import { getJobPostings, deleteJobPosting } from "@/api/jobPosting";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import Pagination from "./Pagination";

const PAGE_SIZE = 10;

const TableData = () => {
  const router = useRouter();
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchJobs = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await getJobPostings({ page, limit: PAGE_SIZE });
      setJobList(Array.isArray(res?.data) ? res.data : []);
      setTotalCount(res?.total ?? 0);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch job postings");
      setJobList([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage, fetchJobs]);

  const handlePageChange = (page) => setCurrentPage(page);

  const deleteJob = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this job posting?");
    if (!isConfirmed) return;

    try {
      const data = await deleteJobPosting(id);
      toast.success(data.message || "Job posting deleted successfully!");
      setJobList((prev) => prev.filter((job) => job._id !== id));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error(error.message || "Failed to delete job posting");
    }
  };

  const theadContent = [
    "Job Title",
    "Tag",
    "Location",
    "Deadline",
    "Status",
    "Date Published",
    "Action",
  ];

  if (loading) {
    return (
      <div className="text-center p-4">
        <p>Loading job postings...</p>
      </div>
    );
  }

  const tbodyContent = jobList?.map((item) => (
    <tr key={item._id}>
      <td scope="row">
        <div className="feat_property list favorite_page style2">
          <div className="details">
            <div className="tc_content">
              <h4>{item.title}</h4>
            </div>
          </div>
        </div>
      </td>
      <td>{item.tag || "-"}</td>
      <td>{item.location || "-"}</td>
      <td>
        {item.deadline
          ? new Date(item.deadline).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })
          : "-"}
      </td>
      <td>
        {(() => {
          const deadlineDate = item.deadline ? new Date(item.deadline) : null;
          const isDeadlinePassed = deadlineDate && deadlineDate < new Date();
          const isActive = !isDeadlinePassed && item.isActive;
          return (
            <span className={`status_tag ${isActive ? 'badge2' : 'badge'}`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        })()}
      </td>
      <td>
        {new Date(item.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        })}
      </td>
      <td>
        <ul className="view_edit_delete_list mb0">
          <li className="list-inline-item" data-toggle="tooltip" data-placement="top" title="View">
            <button onClick={() => router.push(`/thebusinesshub/jobs/view/${item._id}`)}>
              <span className="flaticon-view"></span>
            </button>
          </li>
          <li className="list-inline-item" data-toggle="tooltip" data-placement="top" title="Edit">
            <button onClick={() => router.push(`/thebusinesshub/jobs/edit/${item._id}`)}>
              <span className="flaticon-edit"></span>
            </button>
          </li>
          <li className="list-inline-item" data-toggle="tooltip" data-placement="top" title="Delete">
            <a href="#" onClick={(e) => { e.preventDefault(); deleteJob(item._id); }}>
              <span className="flaticon-garbage"></span>
            </a>
          </li>
        </ul>
      </td>
    </tr>
  ));

  return (
    <>
      <table className="table">
        <thead className="thead-light">
          <tr>
            {theadContent.map((value, i) => (
              <th scope="col" key={i}>{value}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobList && jobList.length > 0 ? (
            tbodyContent
          ) : (
            <tr>
              <td colSpan={7} className="text-center p-4">
                No job postings found. <a href="/thebusinesshub/jobs/add">Add your first job posting</a>
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
};

export default TableData;

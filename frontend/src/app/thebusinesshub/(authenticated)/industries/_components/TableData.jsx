"use client";
import {
  deleteIndustryAPI,
  getIndustryTableData,
} from "@/api/industry";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import Pagination from "./Pagination";
import CommonSearchBar from "@/components/CommonSearchBar";

const PAGE_SIZE = 10;

const TableData = () => {
  const router = useRouter();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async (page = 1, query = "") => {
    try {
      setLoading(true);
      const data = await getIndustryTableData({
        limit: PAGE_SIZE,
        page,
        q: query || undefined,
      });
      setList(Array.isArray(data?.items) ? data.items : []);
      setTotalCount(data?.totalCount ?? 0);
    } catch (error) {
      console.error("Error fetching industries:", error);
      toast.error("Failed to fetch entries");
      setList([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed.length > 0 && trimmed.length < 3) return;
    fetchData(currentPage, trimmed.length >= 3 ? trimmed : "");
  }, [currentPage, searchTerm, fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const deleteEntry = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this entry?");
    if (!isConfirmed) return;
    try {
      const data = await deleteIndustryAPI(id);
      toast.success(data.message);
      setList((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      toast.error(error.message || "Failed to delete entry.");
    }
  };

  const theadContent = ["Name", "Slug", "Status", "Updated", "Action"];

  const tbodyContent = list.map((item) => (
    <tr key={item._id}>
      <td>
        <div className="feat_property list favorite_page style2">
          <div className="details">
            <div className="tc_content">
              <h4>{item.name}</h4>
            </div>
          </div>
        </div>
      </td>
      <td>{item.slug || "—"}</td>
      <td>
        <span className={`status_tag ${item.status === "active" ? "badge2" : "badge"}`}>
          {item.status === "active" ? "Active" : item.status === "inactive" ? "Inactive" : "Draft"}
        </span>
      </td>
      <td>
        {item.updatedAt
          ? new Date(item.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : "—"}
      </td>
      <td>
        <ul className="view_edit_delete_list mb0">
          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Edit"
          >
            <button onClick={() => router.push(`/thebusinesshub/industries/edit/${item._id}`)}>
              <span className="flaticon-edit"></span>
            </button>
          </li>
          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Delete"
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                deleteEntry(item._id);
              }}
            >
              <span className="flaticon-garbage"></span>
            </a>
          </li>
        </ul>
      </td>
    </tr>
  ));

  return (
    <>
      <div className="mb20">
        <CommonSearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by industry name..."
        />
        {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
          <small className="text-muted d-block mt-2">Type at least 3 characters to search.</small>
        )}
      </div>
      <table className="table">
        <thead className="thead-light">
          <tr>
            {theadContent.map((value, i) => (
              <th scope="col" key={i}>
                {value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center p-4">
                Loading entries...
              </td>
            </tr>
          ) : list.length > 0 ? (
            tbodyContent
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No entries found.{" "}
                <a href="/thebusinesshub/industries/add">Add your first industry</a>
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
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </>
  );
};

export default TableData;

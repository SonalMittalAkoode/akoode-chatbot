"use client";
import { getCasestudyTableData, deleteCasestudyAPI } from "@/api/casestudy";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import Pagination from "./Pagination";
import CommonSearchBar from "@/components/CommonSearchBar";

const PAGE_SIZE = 10;

const TableData = () => {
    const [casestudyList, setCasestudyList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const fetchCasestudyData = useCallback(async (page = 1, query = "") => {
        try {
            setLoading(true);
            const data = await getCasestudyTableData({
              limit: PAGE_SIZE,
              page,
              q: query || undefined,
            });
            setCasestudyList(Array.isArray(data?.items) ? data.items : []);
            setTotalCount(data?.totalCount ?? 0);
        } catch (error) {
            console.error("Error fetching casestudies:", error);
            toast.error("Failed to fetch casestudies");
            setCasestudyList([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, []);
    const deleteCasestudy = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this Casestudy?");
        if (!isConfirmed) return;
        try {
          const data = await deleteCasestudyAPI(id);
          toast.success(data.message);
          setCasestudyList((prev) => prev.filter((c) => c._id !== id));
          setTotalCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
          toast.error("Failed to delete Casestudy.");
        }
      };

    useEffect(() => {
      const trimmedSearch = searchTerm.trim();
      if (trimmedSearch.length > 0 && trimmedSearch.length < 3) return;
      fetchCasestudyData(currentPage, trimmedSearch.length >= 3 ? trimmedSearch : "");
    }, [currentPage, searchTerm, fetchCasestudyData]);

    useEffect(() => {
      setCurrentPage(1);
    }, [searchTerm]);

    const handlePageChange = (page) => setCurrentPage(page);

  let theadConent = [
    "Listing Title",
    "Date published",
    "Status",
    "Action",
  ];
  let tbodyContent = casestudyList?.map((item) => (
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
      {/* End td */}

      <td>{new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })}</td>
      {/* End td */}

      <td>
      
        <span className={`status_tag ${item.status ? 'badge2' : 'badge'}`}>{item.status ? "Active" : "Deactive"}</span>

      </td>
      {/* End td */}

     

      <td>
        <ul className="view_edit_delete_list mb0">
          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Edit"
          >
            <button  onClick={() => router.push(`/thebusinesshub/casestudies/edit/${item._id}`)}>
              <span className="flaticon-edit"></span>
            </button>
          </li>
          {/* End li */}

          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Delete"
          >
            <a href="#" onClick={(e) => { e.preventDefault(); deleteCasestudy(item._id); }}>
              <span className="flaticon-garbage"></span>
            </a>
          </li>
        </ul>
      </td>
      {/* End td */}
    </tr>
  ));
  return (
    <>
      <div className="mb20">
        <CommonSearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search case study title..."
        />
        {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
          <small className="text-muted d-block mt-2">
            Type at least 3 characters to search.
          </small>
        )}
      </div>
      <table className="table">
        <thead className="thead-light">
          <tr>
            {theadConent.map((value, i) => (
              <th scope="col" key={i}>
                {value}
              </th>
            ))}
          </tr>
        </thead>
        {/* End theaad */}

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center p-4">
                Loading case studies...
              </td>
            </tr>
          ) : casestudyList && casestudyList.length > 0 ? (
            tbodyContent
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No casestudies found. <a href="/thebusinesshub/casestudies/add">Add your first casestudy</a>
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

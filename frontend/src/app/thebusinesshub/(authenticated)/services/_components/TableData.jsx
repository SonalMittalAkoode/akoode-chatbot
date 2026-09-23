"use client";
import { deleteServicesAPI, getServicesTableData } from "@/api/services";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { toast } from 'react-toastify';
import Pagination from "./Pagination";
import CommonSearchBar from "@/components/CommonSearchBar";

const PAGE_SIZE = 10;

const TableData = () => {
    const router = useRouter();
    const [servicesList, setServicesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchServices = useCallback(async (page = 1, query = "") => {
        try {
            setLoading(true);
            const data = await getServicesTableData({
              limit: PAGE_SIZE,
              page,
              q: query || undefined,
            });
            setServicesList(Array.isArray(data?.items) ? data.items : []);
            setTotalCount(data?.totalCount ?? 0);
        } catch (error) {
            console.error("Error fetching services:", error);
            toast.error("Failed to fetch services");
            setServicesList([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
      const trimmedSearch = searchTerm.trim();
      if (trimmedSearch.length > 0 && trimmedSearch.length < 3) return;
      fetchServices(currentPage, trimmedSearch.length >= 3 ? trimmedSearch : "");
    }, [currentPage, searchTerm, fetchServices]);

    useEffect(() => {
      setCurrentPage(1);
    }, [searchTerm]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
  
    const deleteServices = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this Services?");
        if (!isConfirmed) return;
    
        try {
          const data = await deleteServicesAPI(id);
          toast.success(data.message);
          setServicesList((prev) => prev.filter((s) => s._id !== id));
        } catch (error) {
          toast.error(error.message || "Failed to delete Services.");
        }
      };
  let theadConent = [
    "Listing Title",
    "Date published",
    "Status",
    "Featured",
    "Action",
  ];
  let tbodyContent = servicesList?.map((item) => (
    <tr key={item._id}>
      <td scope="row">
        <div className="feat_property list favorite_page style2">
          <div className="details">
            <div className="tc_content">
              <h4 dangerouslySetInnerHTML={{ __html: item.title }} />
              
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
        <span className={`status_tag ${item.featuredService ? 'badge2' : 'badge'}`}>
          {item.featuredService ? "Featured" : "Not Featured"}
        </span>
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
            <button  onClick={() => router.push(`/thebusinesshub/services/edit/${item._id}`)}>
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
            <a href="#" onClick={(e) => { e.preventDefault(); deleteServices(item._id); }}>
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
          placeholder="Search service title..."
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
              <td colSpan={5} className="text-center p-4">
                Loading services...
              </td>
            </tr>
          ) : servicesList && servicesList.length > 0 ? (
            tbodyContent
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No services found. <a href="/thebusinesshub/services/add">Add your first service</a>
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

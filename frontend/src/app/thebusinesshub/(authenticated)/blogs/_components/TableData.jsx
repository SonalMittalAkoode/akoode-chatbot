"use client"; // Add this at the top
import { getBlogTableData, deleteBlogAPI } from "@/api/blog";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Pagination from "./Pagination";
import CommonSearchBar from "@/components/CommonSearchBar";
// import moment from 'moment';

const PAGE_SIZE = 10;

const TableData = () => {
  const [blogList, setBlogList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchBlogData = async (page = 1, query = "") => {
    setLoading(true);
    const data = await getBlogTableData({
      limit: PAGE_SIZE,
      page,
      q: query || undefined,
    });
    setBlogList(Array.isArray(data?.items) ? data.items : []);
    setTotalCount(data?.totalCount ?? 0);
    setLoading(false);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const deleteBlog = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this Blog?");
    if (!isConfirmed) return;

    try {
      const data = await deleteBlogAPI(id); // 🔹 Call the API function

      toast.success(data.message);
      setBlogList((prevBlogList) => prevBlogList.filter((blog) => blog._id !== id));
      //setTitle(""); // ✅ Reset input after success
    } catch (error) {
      alert("Failed to delete Blog.");
      //setError(error.message); // ❌ Show error if request fails
    }
  };
  let theadConent = [
    "Listing Title",
    "Date published",
    "Status",
    "Action",
  ];
  let tbodyContent = blogList?.map((item) => (
    <tr key={item._id}>
      <td scope="row">
        <div className="feat_property list favorite_page style2">
          <div className="details">
            <div className="tc_content">
              <h4>
                {item?.slug ? (
                  <a
                    href={item?.status ? `/blog/${item.slug}` : `/blog`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-underline"
                    title={item?.status ? "Open live blog" : "Open blog listing"}
                  >
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </h4>
              
            </div>
          </div>
        </div>
      </td>
      {/* End td */}

      <td>
        {new Date(item.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })}
      </td>
      {/* End td */}

      <td>
        <span className={`status_tag ${item.status ? "badge2" : "badge"}`}>
          {item.status ? "Active" : "Deactive"}
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
            <button onClick={() => router.push(`/thebusinesshub/blogs/edit/${item._id}`)}>
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
            <a href="#" onClick={(e) => { e.preventDefault(); deleteBlog(item._id); }}>
              <span className="flaticon-garbage"></span>
            </a>
          </li>
        </ul>
      </td>
      {/* End td */}
    </tr>
  ));
  useEffect(() => {
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch.length > 0 && trimmedSearch.length < 3) return;
    fetchBlogData(currentPage, trimmedSearch.length >= 3 ? trimmedSearch : "");
  }, [currentPage, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <>
      <div className="mb20">
        <CommonSearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search blog title..."
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
          {tbodyContent}
          {!loading && blogList.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4">
                No matching blogs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!loading && totalCount > PAGE_SIZE && (
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

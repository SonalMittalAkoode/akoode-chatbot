"use client";
import { getFaqTableData, deleteFaqAPI } from "@/api/faq";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import Pagination from "./Pagination";
import CommonSearchBar from "@/components/CommonSearchBar";

const PAGE_SIZE = 10;

const TableData = () => {
    const router = useRouter();
    const [faqList, setFaqList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    /** Avoid replacing the table with a single loading row on every keystroke (causes layout jump). */
    const hasCompletedInitialFetch = useRef(false);

    const fetchFaqData = useCallback(async (page = 1, query = "") => {
        try {
            if (!hasCompletedInitialFetch.current) {
                setLoading(true);
            }
            const data = await getFaqTableData({
              limit: PAGE_SIZE,
              page,
              q: query || undefined,
            });
            setFaqList(Array.isArray(data?.items) ? data.items : []);
            setTotalCount(data?.totalCount ?? 0);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
            toast.error("Failed to fetch FAQs");
            setFaqList([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
            hasCompletedInitialFetch.current = true;
        }
    }, []);

    useEffect(() => {
        const trimmedSearch = searchTerm.trim();
        if (trimmedSearch.length > 0 && trimmedSearch.length < 3) return;
        fetchFaqData(currentPage, trimmedSearch.length >= 3 ? trimmedSearch : "");
    }, [currentPage, searchTerm, fetchFaqData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handlePageChange = (page) => setCurrentPage(page);

    const deleteFaq = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this Faq?");
        if (!isConfirmed) return;
        try {
          const data = await deleteFaqAPI(id);
          toast.success(data.message);
          setFaqList((prev) => prev.filter((faq) => faq._id !== id));
          setTotalCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
          toast.error("Failed to delete Faq.");
        }
    };

    const theadContent = [
        "Listing Title",
        "Services",
        "Date published",
        "Status",
        "Homepage",
        "Action",
    ];

    const tbodyContent = faqList?.map((item) => (
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
            <td>
                <span dangerouslySetInnerHTML={{ __html: item.serviceid?.title || item.serviceid || "-" }} />
            </td>
            <td>{new Date(item.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            })}</td>
            <td>
                <span className={`status_tag ${item.status ? 'badge2' : 'badge'}`}>{item.status ? "Active" : "Deactive"}</span>
            </td>
            <td>
                <span className={`status_tag ${item.homepage === 'homepage' ? 'badge2' : 'badge'}`}>
                    {item.homepage === 'homepage' ? "Homepage" : "Not Homepage"}
                </span>
            </td>
            <td>
                <ul className="view_edit_delete_list mb0">
                    <li className="list-inline-item" data-toggle="tooltip" data-placement="top" title="Edit">
                        <button onClick={() => router.push(`/thebusinesshub/faqs/edit/${item._id}`)}>
                            <span className="flaticon-edit"></span>
                        </button>
                    </li>
                    <li className="list-inline-item" data-toggle="tooltip" data-placement="top" title="Delete">
                        <a href="#" onClick={(e) => { e.preventDefault(); deleteFaq(item._id); }}>
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
                    placeholder="Search by service..."
                />
                <div className="mt-2 min-h-[1.375rem]" aria-live="polite">
                    {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 ? (
                        <small className="text-muted d-block">
                            Type at least 3 characters to search.
                        </small>
                    ) : null}
                </div>
            </div>
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        {theadContent.map((value, i) => (
                            <th scope="col" key={i}>{value}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="text-center p-4">
                                Loading FAQs...
                            </td>
                        </tr>
                    ) : faqList && faqList.length > 0 ? (
                        tbodyContent
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center p-4">
                                No FAQs found. <a href="/thebusinesshub/faqs/add">Add your first FAQ</a>
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

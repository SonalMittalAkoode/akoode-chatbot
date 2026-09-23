"use client";
import { getEnquiryTableData, deleteEnquiryAPI } from "@/api/enquiry";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { FiEye, FiX, FiUser, FiMail, FiPhone, FiBriefcase, FiMessageSquare, FiCalendar } from 'react-icons/fi';
import Pagination from "./Pagination";

const PAGE_SIZE = 10;

// ── Full-detail modal ─────────────────────────────────────────
function EnquiryDetailModal({ enquiry, onClose }) {
    if (!enquiry) return null;

    const fields = [
        { icon: FiUser,        label: 'Name',    value: enquiry.fullName },
        { icon: FiMail,        label: 'Email',   value: enquiry.email },
        { icon: FiPhone,       label: 'Phone',   value: enquiry.phone },
        { icon: FiBriefcase,   label: 'Service', value: enquiry.service || enquiry.serviceType },
        { icon: FiCalendar,    label: 'Date',    value: new Date(enquiry.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
    ];

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(10,10,30,0.55)',
                backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#fff', borderRadius: 20,
                    width: '100%', maxWidth: 520,
                    boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
                    overflow: 'hidden',
                    maxHeight: '90vh',
                    display: 'flex', flexDirection: 'column',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    background: '#474972', padding: '18px 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    shrink: 0,
                }}>
                    <div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
                            {enquiry.fullName || 'Enquiry Detail'}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>
                            Full enquiry message
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.15)',
                            border: '1px solid rgba(255,255,255,0.25)',
                            borderRadius: 8, padding: '6px 10px',
                            color: '#fff', cursor: 'pointer',
                            display: 'flex', alignItems: 'center',
                        }}
                    >
                        <FiX size={16} />
                    </button>
                </div>

                {/* Fields */}
                <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {fields.map(({ icon: Icon, label, value }) => value ? (
                            <div key={label} style={{
                                display: 'flex', alignItems: 'flex-start', gap: 12,
                                padding: '10px 14px', borderRadius: 10,
                                background: '#f4f3fb',
                            }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8, background: '#474972',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    shrink: 0, flexShrink: 0,
                                }}>
                                    <Icon size={14} color="#fff" />
                                </div>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9a9bb8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>
                                        {label}
                                    </div>
                                    <div style={{ fontSize: 14, color: '#40415D', fontWeight: 500, lineHeight: 1.4 }}>
                                        {value}
                                    </div>
                                </div>
                            </div>
                        ) : null)}
                    </div>

                    {/* Message — full, no truncation */}
                    {enquiry.message && (
                        <div style={{ marginTop: 12 }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                marginBottom: 10,
                            }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8, background: '#474972',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <FiMessageSquare size={14} color="#fff" />
                                </div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#9a9bb8', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                    Message
                                </div>
                            </div>
                            <div style={{
                                background: '#f4f3fb', borderRadius: 10,
                                padding: '14px 16px',
                                fontSize: 14, color: '#40415D',
                                lineHeight: 1.7, whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                            }}>
                                {enquiry.message}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main table ────────────────────────────────────────────────
const TableData = ({ source }) => {
    const router = useRouter();
    const [enquiryList, setEnquiryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);

    const fetchEnquiryData = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const data = await getEnquiryTableData({ limit: PAGE_SIZE, page, source });
            setEnquiryList(Array.isArray(data?.items) ? data.items : []);
            setTotalCount(data?.totalCount ?? 0);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
            toast.error("Failed to fetch enquiries");
            setEnquiryList([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [source]);

    useEffect(() => {
        fetchEnquiryData(currentPage);
    }, [currentPage, fetchEnquiryData, source]);

    const handlePageChange = (page) => setCurrentPage(page);

    const deleteEnquiry = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this Enquiry?");
        if (!isConfirmed) return;
        try {
            const data = await deleteEnquiryAPI(id);
            toast.success(data.message);
            setEnquiryList((prev) => prev.filter((enquiry) => enquiry._id !== id));
            setTotalCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            toast.error("Failed to delete Enquiry.");
        }
    };

    const truncate = (str, maxLen = 60) => {
        if (!str) return '-';
        return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
    };

    const theadContent = ["Name", "Email", "Phone", "Service", "Message", "Date", "Action"];

    if (loading) {
        return (
            <div className="text-center p-4">
                <p>Loading enquiries...</p>
            </div>
        );
    }

    const tbodyContent = enquiryList?.map((item) => (
        <tr key={item._id}>
            <td scope="row">{item.fullName || '-'}</td>
            <td>{item.email || '-'}</td>
            <td>{item.phone || '-'}</td>
            <td>{item.service || item.serviceType || '-'}</td>
            <td>
                <span style={{ color: '#505169' }}>{truncate(item.message, 60)}</span>
            </td>
            <td>{new Date(item.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            })}</td>
            <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <a
                        href="#"
                        title="View full message"
                        onClick={(e) => { e.preventDefault(); setSelectedEnquiry(item); }}
                        style={{ display: 'flex', alignItems: 'center', color: '#474972', lineHeight: 1 }}
                    >
                        <FiEye size={17} />
                    </a>
                    <a
                        href="#"
                        title="Delete"
                        onClick={(e) => { e.preventDefault(); deleteEnquiry(item._id); }}
                        style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}
                    >
                        <span className="flaticon-garbage" style={{ fontSize: 17, lineHeight: 1 }}></span>
                    </a>
                </div>
            </td>
        </tr>
    ));

    return (
        <>
            <EnquiryDetailModal
                enquiry={selectedEnquiry}
                onClose={() => setSelectedEnquiry(null)}
            />

            <table className="table">
                <thead className="thead-light">
                    <tr>
                        {theadContent.map((value, i) => (
                            <th scope="col" key={i}>{value}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {enquiryList && enquiryList.length > 0 ? (
                        tbodyContent
                    ) : (
                        <tr>
                            <td colSpan={7} className="text-center p-4">
                                No enquiries found.
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

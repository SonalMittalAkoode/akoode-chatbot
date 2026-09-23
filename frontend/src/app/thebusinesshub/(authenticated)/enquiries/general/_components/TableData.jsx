"use client";

import { deleteJobEnquiryAPI } from "@/api/jobenquiry";
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';

const TableData = ({ enquiryList, setEnquiryList, onDeleteSuccess }) => {
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ADMIN_API_BASE =
    process.env.NEXT_PUBLIC_ADMIN_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_API_URL ||
    "http://localhost:5000/";

  const buildAdminUrl = (path) => {
    const trimmedBase = ADMIN_API_BASE.replace(/\/$/, "");
    const trimmedPath = path.replace(/^\/+/, "");
    return `${trimmedBase}/${trimmedPath}`;
  };

  const downloadResume = async (id) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user") || "{}")?.token;
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      // Use same pattern as jobenquiry.ts
      const response = await fetch(buildAdminUrl(`api/jobenquiry/enquiries/${id}/resume`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download resume");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Resume downloaded successfully");
    } catch (error) {
      toast.error(error.message || "Failed to download resume");
    }
  };

  const deleteEnquiry = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this enquiry?");
    if (!isConfirmed) return;

    try {
      const token = JSON.parse(sessionStorage.getItem("user") || "{}")?.token;
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      // Use same pattern as jobenquiry.ts
      const response = await fetch(buildAdminUrl(`api/jobenquiry/enquiries/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete enquiry");
      }

      const data = await response.json();
      toast.success(data.message || "Enquiry deleted successfully!");
      setEnquiryList((prevList) => prevList.filter((enquiry) => enquiry._id !== id));
      onDeleteSuccess?.();
    } catch (error) {
      toast.error(error.message || "Failed to delete enquiry");
    }
  };

  const openViewModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

  const closeViewModal = () => {
    setIsModalOpen(false);
    setSelectedEnquiry(null);
  };

  // Handle ESC key and body scroll lock
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          closeViewModal();
        }
      };
      
      window.addEventListener("keydown", handleEscape);
      
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isModalOpen]);

  let theadContent = [
    "Name",
    "Email",
    "Phone",
    "Job Title",
    "Notice Period",
    "Current CTC",
    "Resume",
    "Date",
    "Action",
  ];

  let tbodyContent = enquiryList?.map((item) => (
    <tr key={item._id}>
      <td scope="row">
      {item.fullName || "-"}
      </td>
      <td>{item.email || "-"}</td>
      <td>{item.phone || "-"}</td>
      <td>{item.jobTitle || "-"}</td>
      <td>{item.noticePeriod || "-"}</td>
      <td>{item.currentCTC || "-"}</td>
      <td>
        {item.resume ? (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => downloadResume(item._id)}
          >
            Download
          </button>
        ) : (
          "-"
        )}
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
          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="View Details"
          >
            <a href="#" onClick={(e) => { e.preventDefault(); openViewModal(item); }}>
              <span className="flaticon-view"></span>
            </a>
          </li>
          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Delete"
          >
            <a href="#" onClick={(e) => { e.preventDefault(); deleteEnquiry(item._id); }}>
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
              <th scope="col" key={i}>
                {value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{tbodyContent}</tbody>
      </table>

      {/* View Details Modal */}
      {isModalOpen && selectedEnquiry && (
        <>
          {/* Modal Backdrop */}
          <div
            className="modal-backdrop fade show job-application-modal-backdrop"
            onClick={closeViewModal}
          ></div>
          
          {/* Modal */}
          <div
            className="modal fade show job-application-modal"
            tabIndex="-1"
            role="dialog"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeViewModal();
              }
            }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div className="modal-content job-application-modal-content">
                <div className="modal-header job-application-modal-header">
                  <h5 className="modal-title job-application-modal-title">
                    General Enquiry Details
                  </h5>
                  <button
                    type="button"
                    className="close job-application-modal-close"
                    onClick={closeViewModal}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body job-application-modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="job-application-field-wrapper">
                        <strong className="job-application-field-label">
                          Full Name
                        </strong>
                        <p className="job-application-field-value">
                          {selectedEnquiry.fullName || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="job-application-field-wrapper">
                        <strong className="job-application-field-label">
                          Email Address
                        </strong>
                        <p className="job-application-field-value">
                          {selectedEnquiry.email || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="job-application-field-wrapper">
                        <strong className="job-application-field-label">
                          Phone Number
                        </strong>
                        <p className="job-application-field-value">
                          {selectedEnquiry.phone || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="job-application-field-wrapper">
                        <strong className="job-application-field-label">
                          Job Title
                        </strong>
                        <p className="job-application-field-value">
                          {selectedEnquiry.jobTitle || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="job-application-field-wrapper">
                        <strong className="job-application-field-label">
                          Notice Period
                        </strong>
                        <p className="job-application-field-value">
                          {selectedEnquiry.noticePeriod || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="job-application-field-wrapper">
                        <strong className="job-application-field-label">
                          Current CTC
                        </strong>
                        <p className="job-application-field-value">
                          {selectedEnquiry.currentCTC || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="job-application-field-wrapper">
                        <strong className="job-application-field-label">
                          Resume
                        </strong>
                        <div className="job-application-resume-wrapper">
                          {selectedEnquiry.resume ? (
                            <button
                              className="btn btn-sm btn-primary job-application-resume-btn"
                              onClick={() => downloadResume(selectedEnquiry._id)}
                            >
                              <i className="fa fa-download mr-2"></i>Download Resume
                            </button>
                          ) : (
                            <span className="job-application-field-value-empty">-</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="job-application-field-wrapper">
                        <strong className="job-application-field-label">
                          Enquiry Date
                        </strong>
                        <p className="job-application-field-value">
                          {new Date(selectedEnquiry.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    {selectedEnquiry.message && (
                      <div className="col-12 mb-4">
                        <div className="job-application-field-wrapper">
                          <strong className="job-application-field-label">
                            Message
                          </strong>
                          <p className="job-application-message">
                            {selectedEnquiry.message || "-"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer job-application-modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary job-application-btn-close"
                    onClick={closeViewModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TableData;


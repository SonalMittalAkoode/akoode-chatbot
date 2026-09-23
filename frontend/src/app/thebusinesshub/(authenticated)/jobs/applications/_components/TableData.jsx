"use client";

import { deleteJobApplication, getJobApplicationResumeUrl } from "@/api/jobApplication";
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';

const TableData = ({ applicationList, setApplicationList, onDeleteSuccess }) => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const downloadResume = async (id) => {
    try {
      const url = getJobApplicationResumeUrl(id);
      const token = JSON.parse(sessionStorage.getItem("user") || "{}")?.token;
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download resume");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `resume-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      toast.success("Resume downloaded successfully");
    } catch (error) {
      toast.error(error.message || "Failed to download resume");
    }
  };

  const deleteApplication = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this job application?");
    if (!isConfirmed) return;

    try {
      const data = await deleteJobApplication(id);
      toast.success(data.message || "Application deleted successfully!");
      setApplicationList((prevList) => prevList.filter((app) => app._id !== id));
      onDeleteSuccess?.();
    } catch (error) {
      toast.error(error.message || "Failed to delete application");
    }
  };

  const openViewModal = (application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const closeViewModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
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
    "Full Name",
    "Email",
    "Phone",
    "Job Title",
    // "Message",
    "Resume",
    "Date",
    "Action",
  ];

  let tbodyContent = applicationList?.map((item) => (
    <tr key={item._id}>
      <td scope="row">
        {item.name || item.fullName || "-"}
      </td>
      <td>{item.email || "-"}</td>
      <td>{item.phone || "-"}</td>
      <td>{item.jobId?.title || item.jobTitle || "-"}</td>
      {/* <td>{item.message ? (item.message.length > 50 ? `${item.message.substring(0, 50)}...` : item.message) : "-"}</td> */}
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
            <a href="#" onClick={(e) => { e.preventDefault(); deleteApplication(item._id); }}>
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
      {isModalOpen && selectedApplication && (
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
                    Job Application Details
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
                          {selectedApplication.name || selectedApplication.fullName || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="job-application-field-wrapper">
                        <strong className="job-application-field-label">
                          Email Address
                        </strong>
                        <p className="job-application-field-value">
                          {selectedApplication.email || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="job-application-field-wrapper">
                        <strong className="job-application-field-label">
                          Phone Number
                        </strong>
                        <p className="job-application-field-value">
                          {selectedApplication.phone || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="job-application-field-wrapper">
                        <strong className="job-application-field-label">
                          Job Title
                        </strong>
                        <p className="job-application-field-value">
                          {selectedApplication.jobId?.title || selectedApplication.jobTitle || "-"}
                        </p>
                      </div>
                    </div>
                    {selectedApplication.linkedin && (
                      <div className="col-md-6 mb-4">
                        <div className="job-application-field-wrapper">
                          <strong className="job-application-field-label">
                            LinkedIn Profile
                          </strong>
                          <p className="job-application-field-value">
                            <a
                              href={selectedApplication.linkedin.startsWith('http') ? selectedApplication.linkedin : `https://${selectedApplication.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="job-application-link"
                            >
                              {selectedApplication.linkedin}
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedApplication.source && (
                      <div className="col-md-6 mb-4">
                        <div className="job-application-field-wrapper">
                          <strong className="job-application-field-label">
                            How did you find out about us?
                          </strong>
                          <p className="job-application-field-value">
                            {selectedApplication.source || "-"}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="col-md-6 mb-4">
                      <div className="job-application-field-wrapper">
                        <strong className="job-application-field-label">
                          Resume
                        </strong>
                        <div className="job-application-resume-wrapper">
                          {selectedApplication.resume ? (
                            <button
                              className="btn btn-sm btn-primary job-application-resume-btn"
                              onClick={() => downloadResume(selectedApplication._id)}
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
                          Consent
                        </strong>
                        <p className="job-application-field-value">
                          <span className={selectedApplication.consent ? "job-application-consent-yes" : "job-application-consent-no"}>
                            {selectedApplication.consent ? "✓ Yes" : "✗ No"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="job-application-field-wrapper">
                        <strong className="job-application-field-label">
                          Application Date
                        </strong>
                        <p className="job-application-field-value">
                          {new Date(selectedApplication.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    {selectedApplication.message && (
                      <div className="col-12 mb-4">
                        <div className="job-application-field-wrapper">
                          <strong className="job-application-field-label">
                            Message
                          </strong>
                          <p className="job-application-message">
                            {selectedApplication.message || "-"}
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


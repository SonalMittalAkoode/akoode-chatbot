"use client";

import { deleteEnquiryAPI } from "@/api/enquiry";
import { toast } from "react-toastify";

const TableData = ({ list, setList, onDeleteSuccess }) => {
  const deleteItem = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this Post Requirement enquiry?");
    if (!ok) return;
    try {
      const data = await deleteEnquiryAPI(id);
      toast.success(data.message || "Deleted successfully");
      setList((prev) => prev.filter((item) => item._id !== id));
      onDeleteSuccess?.();
    } catch (error) {
      toast.error(error?.message || "Failed to delete");
    }
  };

  const headers = [
    "Name",
    "Email",
    "Phone",
    "Service",
    "Budget",
    "Source Page",
    "UTM Source",
    "Message",
    "Date",
    "Action",
  ];

  const rows = (list || []).map((item) => (
    <tr key={item._id}>
      <td scope="row">{item.fullName || "-"}</td>
      <td>{item.email || "-"}</td>
      <td>{item.phone || "-"}</td>
      <td>{item.service || "-"}</td>
      <td>{item.budget || "-"}</td>
      <td style={{ maxWidth: 200, wordBreak: "break-all", fontSize: 12 }}>
        {item.source?.pageUrl || "-"}
      </td>
      <td>{item.source?.utmSource || "-"}</td>
      <td>{item.message ? (item.message.length > 50 ? item.message.slice(0, 50) + "…" : item.message) : "-"}</td>
      <td>
        {item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : "-"}
      </td>
      <td>
        <ul className="view_edit_delete_list mb0">
          <li className="list-inline-item" data-toggle="tooltip" data-placement="top" title="Delete">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                deleteItem(item._id);
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
    <table className="table">
      <thead className="thead-light">
        <tr>
          {headers.map((h, i) => (
            <th scope="col" key={i}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default TableData;

"use client";
import { getBlogCategoryGroupTableData, deleteBlogCategoryGroupAPI } from "@/api/blogcategorygroup";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const TableData = () => {
  const [groupList, setGroupList] = useState([]);
  const router = useRouter();

  const fetchGroupData = async () => {
    const data = await getBlogCategoryGroupTableData();
    setGroupList(Array.isArray(data) ? data : []);
  };

  const deleteGroup = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this category group?");
    if (!isConfirmed) return;

    try {
      const data = await deleteBlogCategoryGroupAPI(id);
      toast.success(data.message);
      setGroupList((prev) => prev.filter((group) => group._id !== id));
    } catch (error) {
      toast.error("Failed to delete category group.");
    }
  };

  const theadConent = ["Label", "Slug", "Order", "Categories", "Status", "Action"];
  const tbodyContent = groupList?.map((item) => (
    <tr key={item._id}>
      <td scope="row">
        <div className="feat_property list favorite_page style2">
          <div className="details">
            <div className="tc_content">
              <h4>{item.label}</h4>
            </div>
          </div>
        </div>
      </td>
      <td>{item.slug}</td>
      <td>{item.order ?? 0}</td>
      <td>{(item.categoryIds || []).length}</td>
      <td>
        <span className={`status_tag ${item.status ? "badge2" : "badge"}`}>
          {item.status ? "Active" : "Deactive"}
        </span>
      </td>
      <td>
        <ul className="view_edit_delete_list mb0">
          <li className="list-inline-item" data-toggle="tooltip" data-placement="top" title="Edit">
            <button onClick={() => router.push(`/thebusinesshub/blogs/categorygroups/edit/${item._id}`)}>
              <span className="flaticon-edit"></span>
            </button>
          </li>
          <li className="list-inline-item" data-toggle="tooltip" data-placement="top" title="Delete">
            <a href="#" onClick={() => deleteGroup(item._id)}>
              <span className="flaticon-garbage"></span>
            </a>
          </li>
        </ul>
      </td>
    </tr>
  ));

  useEffect(() => {
    fetchGroupData();
  }, []);

  return (
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
      <tbody>{tbodyContent}</tbody>
    </table>
  );
};

export default TableData;

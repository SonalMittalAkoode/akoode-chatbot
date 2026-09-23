"use client";
import { getRatingTableData, deleteRatingAPI } from "@/api/rating";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

const TableData = () => {
  const [ratingList, setRatingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchRatingData = async () => {
    try {
      setLoading(true);
      const data = await getRatingTableData();
      setRatingList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      toast.error("Failed to fetch ratings");
      setRatingList([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteRating = async (id, e) => {
    e?.preventDefault();
    const isConfirmed = window.confirm("Are you sure you want to delete this Rating?");
    if (!isConfirmed) return;

    try {
      const data = await deleteRatingAPI(id);
      if (data.status === 'success') {
        toast.success(data.message || 'Rating deleted successfully');
        setRatingList((prevRatingList) =>
          prevRatingList.filter((rating) => rating._id !== id)
        );
      } else {
        toast.error(data.message || 'Failed to delete rating');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete Rating');
      console.error("Delete error:", error);
    }
  };

  let theadConent = [
    "Title",
    "Value",
    "Suffix",
    "Order",
    "Status",
    "Action",
  ];

  useEffect(() => {
    fetchRatingData();
  }, []);

  let tbodyContent = ratingList && ratingList.length > 0 ? ratingList.map((item) => (
    <tr key={item._id}>
      <td scope="row">
        <div className="feat_property list favorite_page style2">
          <div className="details">
            <div className="tc_content">
              <h4>{item.title || 'N/A'}</h4>
            </div>
          </div>
        </div>
      </td>
      <td>{item.value || 'N/A'}</td>
      <td>{item.suffix || 'N/A'}</td>
      <td>{item.order !== undefined ? item.order : 'N/A'}</td>
      <td>
        <span className={`status_tag ${item.status ? 'badge2' : 'badge'}`}>
          {item.status ? "Active" : "Deactive"}
        </span>
      </td>
      <td>
        <ul className="view_edit_delete_list mb0">
          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Edit"
          >
            <button onClick={() => router.push(`/thebusinesshub/ratings/edit/${item._id}`)}>
              <span className="flaticon-edit"></span>
            </button>
          </li>
          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Delete"
          >
            <a href="#" onClick={(e) => deleteRating(item._id, e)}>
              <span className="flaticon-garbage"></span>
            </a>
          </li>
        </ul>
      </td>
    </tr>
  )) : null;

  if (loading) {
    return (
      <div className="text-center p-4">
        <p>Loading ratings...</p>
      </div>
    );
  }

  return (
    <>
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
        <tbody>
          {ratingList && ratingList.length > 0 ? (
            tbodyContent
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4">
                No ratings found. <a href="/thebusinesshub/ratings/add">Add your first rating</a>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default TableData;


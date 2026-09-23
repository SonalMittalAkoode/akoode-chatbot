"use client"; // Add this at the top
import Image from "next/image";
import { getTestimonialTableData,deleteTestimonialAPI } from "@/api/testimonial";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import moment from 'moment';
import { toast } from 'react-toastify';

const TableData = () => {
   const [testimonialList, setTestimonialList] = useState([]);
    const router = useRouter();
  
    const fetchTestimonialData = async () => {
      const data = await getTestimonialTableData();
      setTestimonialList(data);
    };
    const deleteTestimonial = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this testimonial?");
        if (!isConfirmed) return;
    
        try {
          const data = await deleteTestimonialAPI(id); // 🔹 Call the API function
          
         toast.success(data.message);
          setTestimonialList((prevTestimonialList) => prevTestimonialList.filter((testimonial) => testimonial._id !== id));
          //setTitle(""); // ✅ Reset input after success
        } catch (error) {
          alert("Failed to delete testimonial.");
          //setError(error.message); // ❌ Show error if request fails
        }
      };
  let theadConent = [
    "Listing Title",
    "Date published",
    "Status",
    "Action",
  ];
  let tbodyContent = testimonialList?.map((item) => (
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
            <button  onClick={() => router.push(`/thebusinesshub/testimonials/edit/${item._id}`)}>
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
            <a href="#"  onClick={() => deleteTestimonial(item._id)}>
              <span className="flaticon-garbage"></span>
            </a>
          </li>
        </ul>
      </td>
      {/* End td */}
    </tr>
  ));
useEffect(() => {
    fetchTestimonialData();
  }, []); 
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
        {/* End theaad */}

        <tbody>{tbodyContent}</tbody>
      </table>
    </>
  );
};

export default TableData;



"use client"; // Add this at the top
import Image from "next/image";
import { getBrochureEnquiryTableData } from "@/api/brochureenquiry";
import { useState, useEffect } from "react";
// import Image from "next/image";
import Link from "next/link";

const AuthorReview = () => {
  const [enquiryList, setEnquiryList] = useState([]);
  const fetchEnquiryData = async () => {
        const data = await getBrochureEnquiryTableData();
        setEnquiryList(data);
      };
  
  useEffect(() => {
    fetchEnquiryData();
  }, []); 
  return (
    <>
      {enquiryList.map((item) => (
        <div className="media mt30" key={item.id}>
          
          <div className="media-body">
            <h5 className="review_title mt-0">
              
             <div> <span className="text-thm">Name: {item.name}</span> </div>
              
               <div> <span className="text-thm">Email: {item.email}</span> </div>
              
              <span className="sspd_review float-end">
                Enquiry At: {new Date(item.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })}
                </span>
            </h5>
            <hr className="my-3" />
<div className="text-sm text-gray-600">
            <p className="mb-1">
              <span className="font-semibold text-gray-700">For Property:</span>{" "}
              {item?.propertyid?.title || "N/A"}
            </p>
                
          </div>
           
          </div>
        </div>
      ))}
    </>
  );
};

export default AuthorReview;

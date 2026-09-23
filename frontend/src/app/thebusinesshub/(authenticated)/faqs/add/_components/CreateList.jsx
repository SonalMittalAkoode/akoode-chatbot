"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { addFaqAPI } from "@/api/faq";
import { getServicesTableData } from "@/api/services";
import { toast } from 'react-toastify';
import HtmlEditor from "@/components/HtmlEditor";
const CreateList = () => {
  const router = useRouter();
  const [isSubmitting, setisSubmitting] = useState("");
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [homepage, setHomepage] = useState("");

    // upload profile
    
  useEffect(() => {
      const fetchServices = async () => {
        try {
          const filter = {
    limit: 1000,
    page: 1
  }
          const response = await getServicesTableData(filter);
         console.log(response);
  
          setServices(response?.items || []);
        } catch (err) {
          console.error("Error fetching service:", err);
        }
      };
  
      fetchServices();
    }, []);
    const handleTitleChange = (e) => {
      setTitle(e.target.value);
  
      // ✅ Clear the error when user starts typing
      if (e.target.value.trim() !== "") {
        setError("");
      }
    };
  
    const addFaq = async (e) => {
      e.preventDefault();
      setisSubmitting(true);
      setError("");
    
      if (!title.trim()) {
        setError("Title is required");
        setisSubmitting(false);
        return;
      }
    
      try {
        const formData = {
          "title": title,
          "description": description,
          "homepage": homepage || ""
        };
        
        // Only include serviceid if it's not empty
        if (selectedService && selectedService.trim() !== "") {
          formData["serviceid"] = selectedService;
        }
        
        const data = await addFaqAPI(formData); // Use FormData here
       
        toast.success(data.message);
       
        if(data.status=="success"){
          setTimeout(() => {
          router.push("/thebusinesshub/faqs");
          }, 1500); 
        }
    
        setTitle("");
        setDescription("");
        setSelectedService("");
        setHomepage("");
      } catch (error) {
        setError(error.message || "Failed to add FAQ");
        toast.error(error.message || "Failed to add FAQ");
      } finally {
        setisSubmitting(false);
      }
    };
    
    
  return (
    <>
    <form onSubmit={addFaq} className="row">
      
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="FaqTitle">Faq Title</label>
          <input type="text" className="form-control" id="FaqTitle" value={title} onChange={handleTitleChange} />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>
      {/* End .col */}
      <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input ui_kit_select_search form-group">
            <label htmlFor="serviceSelect">Select Service</label>
            <select
              id="serviceSelect"
              className="selectpicker form-select"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)} 
              data-live-search="true"
              data-width="100%"
            >
              <option value="">-- Select Service --</option>
              {services.map((service) => (
                <option key={service._id} value={service._id} dangerouslySetInnerHTML={{ __html: service.title }}></option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label htmlFor="homepage">Homepage</label>
          <select
              id="homepage"
              className="selectpicker form-select"
              name="homepage"
              value={homepage}
              onChange={(e) => setHomepage(e.target.value)}
              data-live-search="true"
              data-width="100%"
          >
            <option value="">None</option>
            <option value="homepage">Homepage</option>
          </select>
        </div>
      </div>
      <div className="col-lg-12">
          <div className="my_profile_setting_textarea form-group">
            <label htmlFor="FaqDescription">Description</label>
            <HtmlEditor value={description} onChange={setDescription} />
            {error.description && <span className="text-danger">{error.description}</span>}
          </div>
          
        </div>
        

      {/* End .col */}
      <div className="col-lg-6 col-xl-6 d-none">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Status</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
          >
            <option data-tokens="1">Active</option>
            <option data-tokens="2">Deactive</option>
          </select>
        </div>
      </div>
      {/* End .col */}

     


      <div className="col-xl-12">
        <div className="my_profile_setting_input">
          <button className="btn btn1 float-start" type="button" onClick={() => window.location.href = '/thebusinesshub/dashboard'}>Back</button>
           <button type="submit" className="btn btn2 float-end" disabled={isSubmitting} >{isSubmitting ? 'Sending...' : 'Submit'}</button>
        </div>
      </div>
      </form>
    </>
  );
};

export default CreateList;

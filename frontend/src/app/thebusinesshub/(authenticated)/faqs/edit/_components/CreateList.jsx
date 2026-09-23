"use client"; 

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getFaqById, updateFaqAPI } from "@/api/faq";
import { getServicesTableData } from "@/api/services";
import { toast } from 'react-toastify';
import HtmlEditor from "@/components/HtmlEditor";

const CreateList = () => {
  const params = useParams();  
    const id = params?.id;  
    const router = useRouter();
    const [faq, setFaq] = useState({ title: "", status: false,description: "", });
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");  
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [homepage, setHomepage] = useState("");
    useEffect(() => {
      if (!id) return;      
      const fetchFaq = async () => {
        try {
          const data = await getFaqById(id);
          
          // setFaq({ title: data.data.title, status: data.data.status, description: data.data.description });
          setTitle(data.data.title)
          setStatus(data.data.status)
          setDescription(data.data.description)
          // Handle serviceid - it might be a string or an object (if populated)
          const serviceIdValue = typeof data.data.serviceid === 'object' && data.data.serviceid !== null 
            ? data.data.serviceid._id 
            : data.data.serviceid;
          setSelectedService(serviceIdValue || '')
          setHomepage(data.data.homepage || "")
          
        } catch (error) {
          console.error("Error fetching Faq:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchFaq();
      const fetchServices = async () => {
              try {
                 const filter = {
    limit: 1000,
    page:  1
  }
                const response = await getServicesTableData(filter);
                
        
                setServices(response?.items || []);
              } catch (err) {
                console.error("Error fetching service:", err);
              }
            };
        
            fetchServices();
    }, [id]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError("");
      
      try {
        const formData = {
          "title": title,
          "description": description,
          "homepage": homepage || "",
          "status": status
        };
        
        // Include serviceid - set to null if empty to clear existing value
        if (selectedService && selectedService.trim() !== "") {
          formData["serviceid"] = selectedService;
        } else {
          formData["serviceid"] = null;
        }
        const data = await updateFaqAPI(id, formData);
        toast.success(data.message);
        if(data.status=="success"){
          setTimeout(() => {
          router.push("/thebusinesshub/faqs");
          }, 1500); 
        }
        
      } catch (error) {
        const errorMessage = error?.message || "Failed to update FAQ";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    };
  
  
  
    if (loading) return <p>Loading...</p>;
  return (
    <>
    <form onSubmit={handleSubmit} className="row">
    
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="FaqTitle">Faq Title</label>
          <input
        type="text"
        className="form-control"
        id="FaqTitle"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
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
                <option key={service._id} value={service._id}>
                  {service.title}
                </option>
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

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Status</label>
          <select
  className="selectpicker form-select"
  data-live-search="true"
  data-width="100%"
  value={status ? "active" : "deactive"}
  onChange={(e) => setStatus(e.target.value === "active")}
>
        <option value="active">Active</option>
        <option value="deactive">Deactive</option>
      </select>
        </div>
      </div>
      {/* End .col */}

     


      <div className="col-xl-12">
        <div className="my_profile_setting_input">
          <button className="btn btn1 float-start" type="button" onClick={() => window.location.href = '/thebusinesshub/faqs'}>Back</button>
          <button type="submit" className="btn btn2 float-end" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>
      </form>
    </>
  );
};

export default CreateList;

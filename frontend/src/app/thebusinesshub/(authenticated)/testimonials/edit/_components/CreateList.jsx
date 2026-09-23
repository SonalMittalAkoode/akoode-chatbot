"use client"; 

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTestimonialById, updateTestimonialAPI } from "@/api/testimonial";

import { toast } from 'react-toastify';
const CreateList = () => {
  const params = useParams();  
    const id = params?.id;  
    const router = useRouter();
    const [testimonial, setTestimonial] = useState({ title: "", status: false,description: "", });
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [description, setDescription] = useState("");
    const [designation, setDesignation] = useState("");
    const [star, setStar] = useState(5);
    const [error, setError] = useState("");  
    const [logo, setLogo] = useState(null);
    const [logoimage, setLogoImage] = useState(null);
    const uploadLogo = (e) => {
      setLogo(e.target.files[0]);
  };
    useEffect(() => {
      if (!id) return;      
      const fetchTestimonial = async () => {
        try {
          const data = await getTestimonialById(id);
          
          // setTestimonial({ title: data.data.title, status: data.data.status, description: data.data.description });
          setTitle(data.data.title)
          setStatus(data.data.status)
          setDescription(data.data.description)
          setDesignation(data.data.designation)
          setStar(data.data.star || 5)
          if(data.data.logoimage) {
          setLogoImage(process.env.NEXT_PUBLIC_API_URL+data.data.logoimage)
          }
        } catch (error) {
          console.error("Error fetching Testimonial:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchTestimonial();
    }, [id]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("designation", designation);
        formData.append("star", star.toString());
        formData.append("status", status);
        if (logo) {
          formData.append("logo", logo);
        }
        const data = await updateTestimonialAPI(id, formData);
        // alert("Testimonial updated successfully!");
        // router.push("/thebusinesshub/testimonials");
        toast.success(data.message);
        if(data.status=="success"){
          setTimeout(() => {
          router.push("/thebusinesshub/testimonials");
          }, 1500); 
        }
      } catch (error) {
        alert("Failed to update Testimonial.");
        console.error(error);
      }
    };
  
    // const handleChange = (e) => {
    //   setTestimonial((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // };
  
    // const handleStatusChange = () => {
    //   setTestimonial((prev) => ({ ...prev, status: !prev.status }));
    // };
  
    if (loading) return <p>Loading...</p>;
  return (
    <>
    <form onSubmit={handleSubmit} className="row">
    <div className="col-lg-12">
                <div className="wrap-custom-file">
                    <input
                        type="file"
                        id="image1"
                        accept="image/png, image/gif, image/jpeg"
                        onChange={uploadLogo}
                    />
                   <label
                      htmlFor="image1"
                      style={
                        logoimage                          
                        ? { backgroundImage: `url(${logoimage})` }
                          : logo
                          ? { backgroundImage: `url(${URL.createObjectURL(logo)})` }
                          : undefined
                      }
                    >
                        <span>
                            <i className="flaticon-download"></i> Upload Photo{" "}
                        </span>
                    </label>
                </div>
                <p>*minimum 260px x 260px</p>
            </div>
            {/* End .col */}
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="TestimonialTitle">Testimonial Title</label>
          <input
        type="text"
        className="form-control"
        id="TestimonialTitle"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
        </div>
      </div>
      {/* End .col */}
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="Testimonialdesignation">Testimonial designation</label>
          <input
        type="text"
        className="form-control"
        id="Testimonialdesignation"
        name="designation"
        value={designation}
        onChange={(e) => setDesignation(e.target.value)}
      />
        </div>
      </div>
      {/* End .col */}
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="TestimonialStar">Rating (Stars)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <span
                  key={rating}
                  onClick={() => setStar(rating)}
                  onMouseEnter={(e) => {
                    // Highlight stars on hover
                    const container = e.currentTarget.parentElement;
                    if (container) {
                      const stars = container.children;
                      Array.from(stars).forEach((starEl, index) => {
                        if (index < rating) {
                          starEl.style.color = '#ffc107';
                        } else {
                          starEl.style.color = '#ddd';
                        }
                      });
                    }
                  }}
                  onMouseLeave={(e) => {
                    // Reset to selected rating
                    const container = e.currentTarget.parentElement;
                    if (container) {
                      const stars = container.children;
                      Array.from(stars).forEach((starEl, index) => {
                        starEl.style.color = index < star ? '#ffc107' : '#ddd';
                      });
                    }
                  }}
                  style={{
                    fontSize: '24px',
                    color: rating <= star ? '#ffc107' : '#ddd',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    userSelect: 'none',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>
              ({star} {star === 1 ? 'Star' : 'Stars'})
            </span>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>
      {/* End .col */}
      <div className="col-lg-12">
          <div className="my_profile_setting_textarea form-group">
            <label htmlFor="TestimonialDescription">Description</label>
            <textarea id="TestimonialDescription" className="form-control" name="description" rows="7"  value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Testimonial description"></textarea>
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
          <button className="btn btn1 float-start" type="button" onClick={() => window.location.href = '/thebusinesshub/testimonials'}>Back</button>
          <button className="btn btn2 float-end">Submit</button>
        </div>
      </div>
      </form>
    </>
  );
};

export default CreateList;

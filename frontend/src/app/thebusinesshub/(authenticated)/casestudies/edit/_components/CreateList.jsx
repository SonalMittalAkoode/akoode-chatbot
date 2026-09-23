"use client"; 
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCasestudyById, updateCasestudyAPI } from "@/api/casestudy";
import { revalidatePublic } from "@/utils/revalidatePublic";
import { deleteCasestudyprocessAPI } from "@/api/casestudyprocess";
import { deleteCasestudychallengeAPI } from "@/api/casestudychallenge";
import { toast } from 'react-toastify';
import HtmlEditor from "@/components/HtmlEditor";
import SectionCard from "../../../services/_components/SectionCard";
import WhyChooseUsShowcaseForm from "../../_components/WhyChooseUsShowcaseForm";
import { emptyWhyChooseUsShowcase, mergeWhyChooseUsShowcase } from "@/utils/whyChooseUsShowcase";

const CreateList = () => {
  
  const params = useParams();  
    const id = params?.id;  
    const router = useRouter();
    const [inputs, setInputs] = useState([]);
    const [casestudy, setCasestudy] = useState({ title: "", status: false,description: "", });
    const [title, setTitle] = useState("");
    const [project, setProject] = useState("");
    const [country, setCountry] = useState("");
    const [industry, setIndustry] = useState("");
    const [servicesUsed, setServicesUsed] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [shortdescription, setShortDescription] = useState("");
     const [error, setError] = useState("");
     const [logo, setLogo] = useState(null);     
    const [logoimage, setLogoImage] = useState(null);
     const [casestudylogo, setCasestudylogo] = useState(null);     
    const [casestudylogoimage, setCasestudylogoImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(true);
  const [featuredInServices, setFeaturedInServices] = useState([]);
  const SERVICE_CATEGORIES = ['AI Intelligence', 'Software Development', 'Mobile Apps', 'Web', 'Ecommerce', 'Emerging Tech', 'Digital Marketing'];
  const toggleService = (cat) => setFeaturedInServices((prev) => prev.includes(cat) ? prev.filter((s) => s !== cat) : [...prev, cat]);
    const [aboutimage, setAboutImage] = useState(null);
  const [aboutimageget, setAboutImageGet] = useState(null);

  const [abouttitle , setAboutTitle] = useState([]);
  const [aboutdescription, setAboutDescription] = useState([]);
  const [deliveredtitle, setDeliveredTitle] = useState("");
  const [delivereddescription, setDeliveredDescription] = useState([]);
  const [resultstitle, setResultsTitle] = useState("");
  const [resultsdescription, setResultsDescription] = useState([]);
  const [resultssubdescription, setResultsSubdescription] = useState("");
  const [challengetitle, setChallengeTitle] = useState([]);
  const [challengedescription, setChallengeDescription] = useState([]);
  const [processtitle, setProcessTitle] = useState("");
  const [processdescription, setProcessDescription] = useState("");
  const [techtitle, setTechtitle] = useState("");
  const [techdescription, setTechdescription] = useState("");
  const [deliveredimage, setDeliveredImage] = useState(null);
  const [deliveredimageget, setDeliveredImageGet] = useState(null);
  const [deliveredvideo, setDeliveredVideo] = useState("");
  const [techinputs, setTechinputs] = useState([]);
  const [techimagesget, setTechimagesGet] = useState([]);

  /** UI-only accordion toggles (not sent to API). */
  const [aboutSectionOn, setAboutSectionOn] = useState(true);
  const [challengesSectionOn, setChallengesSectionOn] = useState(true);
  const [processSectionOn, setProcessSectionOn] = useState(true);
  const [deliveredSectionOn, setDeliveredSectionOn] = useState(true);
  const [resultsSectionOn, setResultsSectionOn] = useState(true);
  const [techSectionOn, setTechSectionOn] = useState(true);
  const [metaSectionOn, setMetaSectionOn] = useState(true);
  const [whyChooseUsShowcaseSectionOn, setWhyChooseUsShowcaseSectionOn] = useState(true);
  const [quoteSectionOn, setQuoteSectionOn] = useState(true);

  const [quotetitle, setQuotetitle] = useState("");
  const [quotename, setQuotename] = useState("");
  const [quotedescription, setQuotedescription] = useState("");
  const [whyChooseUsShowcase, setWhyChooseUsShowcase] = useState(() => emptyWhyChooseUsShowcase());

  const handleAddTechInput = () => {
    setTechinputs([
      ...techinputs,
      {
        id: Date.now(),
        imagestep: null
      }
    ]);
  };
  const handleRemoveTechInput = (idToRemove) => {
    setTechinputs(techinputs.filter((input) => input.id !== idToRemove));
  };
  const uploadTechImage = (index, file) => {
    const updated = [...techinputs];
    updated[index].imagestep = file;
    setTechinputs(updated);
  };
  const handleRemoveExistingTech = (indexToRem) => {
    setTechimagesGet(techimagesget.filter((_, idx) => idx !== indexToRem));
  };
  

  const [metatitle, setMetatitle] = useState([]);
  const [metadescription, setMetaDescription] = useState([]);
  const [inputsget, setInputsget] = useState([]);
  const [processInputGet, setProcessInputGet] = useState([]);
    const uploadLogo = (e) => {
      setLogoImage("")
      setLogo(e.target.files[0]);
  };
  const uploadCasestudyLogo = (e) => {
    setCasestudylogoImage("")
    setCasestudylogo(e.target.files[0]);
};
const uploadAboutImage = (e) => {
  setAboutImageGet("");
  setAboutImage(e.target.files[0]);
};
const uploadDeliveredImage = (e) => {
  setDeliveredImageGet("");
  setDeliveredImage(e.target.files[0]);
};
const handleAddInput = () => {
  setInputs([
    ...inputs,
    {
      id: Date.now(),
      titlestep: '',
      descriptionstep: '',
      imagestep: null
    }
  ]);
};
const handleInputChange = (index, field, value) => {
  const updated = [...inputs];
  updated[index][field] = value;
  setInputs(updated);
};
const handleInputChangeGet = (index, field, value) => {
  // alert("test")
  const updated = [...inputsget];
  updated[index][field] = value;
  setInputsget(updated);
};
const handleRemoveInput = (idToRemove) => {
  setInputs(inputs.filter((input) => input.id !== idToRemove));
};
const handleRemoveInputGet = async (_id) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this process?");
  if (!isConfirmed) return;
    try {
      // alert("test")
      const data = await deleteCasestudyprocessAPI(_id); // 🔹 Call the API function
      // alert("test")
      const deleted = processInputGet?.filter((file) => file._id !== _id);
      setProcessInputGet(deleted);
      //setTitle(""); // ✅ Reset input after success
    } catch (error) {
      alert("Failed to delete property Image.");
      
    }
};
const uploadProcessImage = (index, file) => {
  const updatedInputs = [...inputs];
  updatedInputs[index].imagestep = file;
  setInputs(updatedInputs);
};
const uploadProcessImageGet = (index, file) => {
  // alert("yse")
  const updatedInputs = [...inputsget];
  updatedInputs[index].imageget = file;
  updatedInputs[index].imageurl = null;
  
  setInputsget(updatedInputs);
  
};
const [inputschallengestep, setInputschallengestep] = useState([]);

const [inputschallengestepget, setInputschallengestepget] = useState([]);

const [challengeInputGet, setChallengeInputGet] = useState([]);
//   const [inputspaymentget, setPaymentInputsget] = useState([]);

const handleAddInputchallengestep = () => {
  setInputschallengestep([
    ...inputschallengestep,
    {
      id: Date.now(),
      titlestep: '',
      descriptionstep: ''
    }
  ]);
};
const handleInputChangechallengestep = (index, field, value) => {
  const updated = [...inputschallengestep];
  updated[index][field] = value;
  setInputschallengestep(updated);
};
const handleRemoveInputchallengestep = (idToRemove) => {
  setInputschallengestep(inputschallengestep.filter((input) => input.id !== idToRemove));
};
const handleInputChangechallengestepGet = (index, field, value) => {
  // alert("test")
  const updated = [...inputschallengestepget];
  updated[index][field] = value;
  setInputschallengestepget(updated);
};
// const handleInputChangechallengestepGet = (index, file) => {
//   // alert("yse")
//   const updatedInputs = [...inputschallengestepget];
//   updatedInputs[index].imagestepget = file;
//   updatedInputs[index].imagestepurl = null;
  
//   setInputschallengestepget(updatedInputs);
  
// };
const handleRemoveInputchallengestepGet = async (_id) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this challenge?");
  if (!isConfirmed) return;
    try {
      // alert("test")
      const data = await deleteCasestudychallengeAPI(_id); // 🔹 Call the API function
      // alert("test")
      const deleted = challengeInputGet?.filter((file) => file._id !== _id);
      setChallengeInputGet(deleted);
      //setTitle(""); // ✅ Reset input after success
    } catch (error) {
      alert("Failed to delete challenge.");
      
    }
};
    useEffect(() => {
      if (!id) return;      
      const fetchCasestudy = async () => {
        try {
          const data = await getCasestudyById(id);
          // setCasestudy({ title: data.data.title, status: data.data.status, description: data.data.description });
          setTitle(data.data.title)
          setProject(data.data.project)
          setCountry(data.data.country || "")
          setIndustry(data.data.industry || "")
          setServicesUsed(data.data.servicesUsed || "")
          setSlug(data.data.slug)
          setStatus(data.data.status !== false)
          setDescription(data.data.description)
          setShortDescription(data.data.shortdescription || "")
          
          setAboutTitle(data.data.abouttitle)
          setAboutDescription(data.data.aboutdescription)
          setQuotetitle(data.data.quotetitle || "")
          setQuotename(data.data.quotename || "")
          setQuotedescription(data.data.quotedescription || "")
          setWhyChooseUsShowcase(mergeWhyChooseUsShowcase(data.data.whychooseus))
          setDeliveredTitle(data.data.deliveredtitle)
          setDeliveredDescription(data.data.delivereddescription)
          setDeliveredVideo(data.data.deliveredvideo || "")
          setResultsTitle(data.data.resultstitle)
          setResultsDescription(data.data.resultsdescription)
          setResultsSubdescription(data.data.resultssubdescription || "")
          setChallengeTitle(data.data.challengetitle || "")
          setChallengeDescription(data.data.challengedescription || "")
          setProcessTitle(data.data.processtitle || "")
          setProcessDescription(data.data.processdescription || "")
          setTechtitle(data.data.techtitle || "")
          setTechdescription(data.data.techdescription || "")
          setFeaturedInServices(Array.isArray(data.data.featuredInServices) ? data.data.featuredInServices : (data.data.featuredInServices ? JSON.parse(data.data.featuredInServices) : []))
          setTechimagesGet(data.data.techimages || [])
          
          setStatus(data.data.status !== false)
          
          if(data.data.logoimage) {
            setLogoImage(process.env.NEXT_PUBLIC_API_URL+data.data.logoimage)
          }
          if(data.data.casestudyimage) {
            setCasestudylogoImage(process.env.NEXT_PUBLIC_API_URL+data.data.casestudyimage)
          }
          if(data.data.aboutimage) {
            setAboutImageGet(process.env.NEXT_PUBLIC_API_URL+data.data.aboutimage)
          }
          if(data.data.deliveredimage) {
            setDeliveredImageGet(process.env.NEXT_PUBLIC_API_URL+data.data.deliveredimage)
          }
          // console.log("data.data.processstep")
          // console.log(data.data)
          // console.log(data.data.processstep)

          setInputsget(data.data.processstep?.map(p => ({ ...p, titlestep: p.title, descriptionstep: p.description })) || []);
          setProcessInputGet(data.data.processstep);
          setInputschallengestepget(data.data.challengestep?.map(c => ({ ...c, titlestep: c.title, descriptionstep: c.description })) || []);
          setChallengeInputGet(data.data.challengestep);
          setMetatitle(data.data.metatitle)
          setMetaDescription(data.data.metadescription)          
        } catch (error) {
          console.error("Error fetching Casestudy:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCasestudy();
     
    }, [id]);
   
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          title, slug,description,shortdescription,project, country, industry, servicesUsed, challengetitle, challengedescription, aboutimage, abouttitle, aboutdescription, featuredInServices: JSON.stringify(featuredInServices),
          quotetitle, quotename, quotedescription,
          deliveredtitle, delivereddescription, resultstitle, resultsdescription, resultssubdescription,
          metatitle, metadescription, processtitle, processdescription, techtitle, techdescription, deliveredvideo,
          status: status ? "true" : "false"
        };
        
        
        const formData = new FormData();
       
        // Loop over each key-value pair in the payload
        for (const key in payload) {
          if (payload[key] !== undefined && payload[key] !== null) {
            formData.append(key, payload[key]);
          }
        }
        formData.append(
          "whychooseus",
          JSON.stringify(mergeWhyChooseUsShowcase(whyChooseUsShowcase))
        );
        inputs.forEach((input, index) => {
          formData.append(`process[${index}][titlestep]`, input.titlestep);
          formData.append(`process[${index}][descriptionstep]`, input.descriptionstep);
          if (input.imagestep) {
            formData.append(`process[${index}][imagestep]`, input.imagestep);
          }
    
        });
        inputsget.forEach((input, index) => {
          formData.append(`processget[${index}][processid]`, input._id);
          formData.append(`processget[${index}][titlestep]`, input.titlestep);
          formData.append(`processget[${index}][descriptionstep]`, input.descriptionstep);
          if (input.imageget) {
            formData.append(`processget[${index}][imagestep]`, input.imageget);
          }
    
        });
        inputschallengestep.forEach((input, index) => {
          formData.append(`challenges[${index}][titlestep]`, input.titlestep);
          formData.append(`challenges[${index}][descriptionstep]`, input.descriptionstep);
        });

        inputschallengestepget.forEach((input, index) => {
          formData.append(`challengesget[${index}][challengeid]`, input._id);
          formData.append(`challengesget[${index}][titlestep]`, input.titlestep);
          formData.append(`challengesget[${index}][descriptionstep]`, input.descriptionstep);
        });
        if (logo) {
          formData.append("logo", logo);
        }
        if (casestudylogo) {
          formData.append("casestudylogo", casestudylogo);
        }
        if (deliveredimage) {
          formData.append("deliveredimage", deliveredimage);
        }
        
        techinputs.forEach((input) => {
          if (input.imagestep) {
            formData.append(`techimages`, input.imagestep);
          }
        });

        techimagesget.forEach((existingURL) => {
          formData.append(`existingTechimages`, existingURL);
        });

        if (techinputs.length === 0 && techimagesget.length === 0) {
            formData.append(`clearTechImages`, true);
        }
       const res = await updateCasestudyAPI(id, formData);
        // alert("Casestudy updated successfully!");
        toast.success(res.message);
         
         if(res.status=="success"){
            // Refresh the live case study immediately instead of waiting out the 1h ISR window.
            if (slug) revalidatePublic(`/case-studies/${slug}`);
            setTimeout(() => {
              router.push("/thebusinesshub/casestudies");
              }, 1500);
          }
      } catch (error) {
        alert("Failed to update Casestudy.");
        console.error(error);
      }
    };
  
    // const handleChange = (e) => {
    //   setCasestudy((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // };
  
    // const handleStatusChange = () => {
    //   setCasestudy((prev) => ({ ...prev, status: !prev.status }));
    // };
  
    if (loading) return <p>Loading...</p>;
  return (
    <>
    <form onSubmit={handleSubmit} className="row">
        <SectionCard id="sec-cs-core" title="Core Information" accentColor="#4b4d7c">
    <div className="col-lg-6">
    <div >Casestudy Logo</div>
                <div className="wrap-custom-file">
                    <input
                        type="file"
                        id="image1"
                         accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif"
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
            <div className="col-lg-6">
            <div  >Casestudy Image</div>
                <div className="wrap-custom-file">
                    <input
                        type="file"
                        id="image2"
                         accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif"
                        onChange={uploadCasestudyLogo}
                    />
                    <label
                    htmlFor="image2"
                        style={
                          casestudylogoimage                          
                          ? { backgroundImage: `url(${casestudylogoimage})` }
                            : casestudylogo
                            ? { backgroundImage: `url(${URL.createObjectURL(casestudylogo)})` }
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
            
            <div className="col-lg-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="casestudyProject">Casestudy Project</label>
          <input type="text" className="form-control"  id="casestudyProject" value={project} onChange={(e) => setProject(e.target.value)}  placeholder="Enter casestudy Project"/>
          {error.project && <span className="text-danger">{error.project}</span>}

        </div>
      </div>
      <div className="col-lg-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="casestudyTitle">Casestudy Title</label>
          <input type="text" className="form-control"  id="casestudyTitle" value={title} onChange={(e) => setTitle(e.target.value)}  placeholder="Enter casestudy Title"/>
          {error.title && <span className="text-danger">{error.title}</span>}

        </div>
      </div>
        <div className="col-lg-4">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="casestudySlug">Casestudy Slug (SEO URL)</label>
            <input type="text" className="form-control"  id="casestudySlug" value={slug} onChange={(e) => setSlug(e.target.value)}  placeholder="Enter casestudy slug"/>
            {error.slug && <span className="text-danger">{error.slug}</span>}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="casestudyCountry">Country</label>
            <input type="text" className="form-control" id="casestudyCountry" value={country} onChange={(e) => setCountry(e.target.value)}  placeholder="e.g. USA"/>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="casestudyIndustry">Industry</label>
            <input type="text" className="form-control" id="casestudyIndustry" value={industry} onChange={(e) => setIndustry(e.target.value)}  placeholder="e.g. HealthTech"/>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="casestudyServicesUsed">Services Used</label>
            <input type="text" className="form-control" id="casestudyServicesUsed" value={servicesUsed} onChange={(e) => setServicesUsed(e.target.value)}  placeholder="e.g. UI/UX Design, App Development"/>
          </div>
        </div>
     
      <div className="col-lg-12">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="CasestudyDescription">Description</label>
            <HtmlEditor value={description} onChange={setDescription} />
            {error.description && <span className="text-danger">{error.description}</span>}
          </div>
          
        </div>
        <div className="col-lg-12">
          <div className="my_profile_setting_textarea form-group">
            <label htmlFor="CasestudyShortDescription">Short Description</label>
            <textarea id="CasestudyShortDescription" className="form-control" name="shortdescription" rows="4"  value={shortdescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="Enter short description"></textarea>
            {error.shortdescription && <span className="text-danger">{error.shortdescription}</span>}
          </div>
          
        </div>
        </SectionCard>

        <SectionCard
          id="sec-cs-about"
          title="About"
          accentColor="#3c3e66"
          toggleId="cs-edit-about"
          toggleName="cs_edit_about_ui"
          enabled={aboutSectionOn}
          onToggle={(e) => setAboutSectionOn(e.target.checked)}
        >
          {aboutSectionOn && (
            <>
          <div className="col-lg-6">
                     <div htmlFor="aboutimage">About Image</div>
                          <div className="wrap-custom-file">
                        
                              <input
                                  type="file"
                                  id="aboutimage"
                                  accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif"
                                  onChange={uploadAboutImage}
                              />
                              <label
                                  style={aboutimageget                          
                                    ? { backgroundImage: `url(${aboutimageget})` }
                                      : aboutimage
                                      ? { backgroundImage: `url(${URL.createObjectURL(aboutimage)})` }
                                      : undefined
                                  }
                                  htmlFor="aboutimage"
                              >
                                  <span>
                                      <i className="flaticon-download"></i> Upload About image{" "}
                                  </span>
                              </label>
                          </div>
                          <p>*minimum 260px x 260px</p>
                      </div>
        
        <div className="col-lg-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="aboutTitle">About Title</label>
            <input type="text" className="form-control"  id="aboutTitle" value={abouttitle} onChange={(e) => setAboutTitle(e.target.value)}  placeholder="Enter About Title"/>
            {error.abouttitle && <span className="text-danger">{error.abouttitle}</span>}

          </div>
          <div className="my_profile_setting_input form-group">
              <label htmlFor="aboutDescription">About Description</label>
              <HtmlEditor value={aboutdescription} onChange={setAboutDescription} />
              {error.aboutdescription && <span className="text-danger">{error.aboutdescription}</span>}
            </div>
      </div>
            </>
          )}
        </SectionCard>

        <SectionCard
          id="sec-cs-why-choose-us-showcase"
          title="Why choose us (before Results)"
          accentColor="#6d4bfb"
          toggleId="cs-edit-why-choose-us-showcase"
          toggleName="cs_edit_why_choose_us_showcase_ui"
          enabled={whyChooseUsShowcaseSectionOn}
          onToggle={(e) => setWhyChooseUsShowcaseSectionOn(e.target.checked)}
        >
          {whyChooseUsShowcaseSectionOn && (
            <WhyChooseUsShowcaseForm
              value={whyChooseUsShowcase}
              onChange={setWhyChooseUsShowcase}
            />
          )}
        </SectionCard>

        <SectionCard
          id="sec-cs-quote"
          title="Quote"
          accentColor="#6b5a8c"
          toggleId="cs-edit-quote"
          toggleName="cs_edit_quote_ui"
          enabled={quoteSectionOn}
          onToggle={(e) => setQuoteSectionOn(e.target.checked)}
        >
          {quoteSectionOn && (
            <>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="quotetitle">Section Title</label>
                  <input type="text" className="form-control" id="quotetitle" value={quotetitle} onChange={(e) => setQuotetitle(e.target.value)} placeholder="e.g. What Our Client Says" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="quotename">Reviewer Name</label>
                  <input type="text" className="form-control" id="quotename" value={quotename} onChange={(e) => setQuotename(e.target.value)} placeholder="e.g. John Smith, CEO of XYZ" />
                </div>
              </div>
              <div className="col-lg-12">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="quotedescription">Testimonial Text</label>
                  <HtmlEditor value={quotedescription} onChange={setQuotedescription} />
                </div>
              </div>
            </>
          )}
        </SectionCard>

        <SectionCard
          id="sec-cs-challenges"
          title="Challenges"
          accentColor="#5c4d7a"
          toggleId="cs-edit-challenges"
          toggleName="cs_edit_challenges_ui"
          enabled={challengesSectionOn}
          onToggle={(e) => setChallengesSectionOn(e.target.checked)}
          badge={(inputschallengestep?.length || 0) + (inputschallengestepget?.length || 0)}
        >
          {challengesSectionOn && (
            <>
      <div className="col-lg-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="challengeTitle">Challenge Title</label>
            <input type="text" className="form-control"  id="challengeTitle" value={challengetitle} onChange={(e) => setChallengeTitle(e.target.value)}  placeholder="Enter Challenge Title"/>
            {error.challengetitle && <span className="text-danger">{error.challengetitle}</span>}

          </div>
          </div>
          <div className="col-lg-6">
          <div className="my_profile_setting_input form-group">
              <label htmlFor="challengeDescription">Challenge Description</label>
              <HtmlEditor value={challengedescription} onChange={setChallengeDescription} />
              {error.challengedescription && <span className="text-danger">{error.challengedescription}</span>}
            </div>
      </div>

      <div className="col-lg-12">
        <div
          className="my_dashboard_review mt30 mb30"
          style={{
            border: "1px solid #e6e8f0",
            borderRadius: 12,
            padding: "20px 18px 24px",
            background: "#fafbff",
          }}
        >
          <div className="col-lg-12 mb20">
            <h3 className="mb10" style={{ fontWeight: 600, color: "#2f3150" }}>
              Challenge steps
            </h3>
            <p className="text-muted mb0" style={{ fontSize: 13, lineHeight: 1.5 }}>
              Each row is one challenge card shown on the case study page, directly under the challenge title and description above.
            </p>
          </div>
          <div className="col-lg-12 mb20">
            <button className="btn admore_btn mb10" type="button" onClick={handleAddInputchallengestep}>
              Add challenge step
            </button>
          </div>
          {inputschallengestep?.map((input, index) => (
            <div className="row mb20 pb20" key={input.id} style={{ borderBottom: "1px solid #eceef5" }}>
              <div className="col-xl-12">
                <div className="my_profile_setting_input">
                  <button
                    onClick={() => handleRemoveInputchallengestep(input.id)}
                    type="button"
                    className="btn btn2 float-end"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor={`challengeStepTitle-new-${index}`}>Step title</label>
                  <input
                    type="text"
                    className="form-control"
                    id={`challengeStepTitle-new-${index}`}
                    value={input.titlestep}
                    onChange={(e) => handleInputChangechallengestep(index, "titlestep", e.target.value)}
                  />
                </div>
              </div>
              <div className="col-xl-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor={`challengeStepDesc-new-${index}`}>Step description</label>
                  <input
                    type="text"
                    className="form-control"
                    id={`challengeStepDesc-new-${index}`}
                    value={input.descriptionstep}
                    onChange={(e) => handleInputChangechallengestep(index, "descriptionstep", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          {inputschallengestepget?.map((input, index) => (
            <div className="row mb20 pb20" key={input._id} style={{ borderBottom: "1px solid #eceef5" }}>
              <div className="col-xl-12">
                <div className="my_profile_setting_input">
                  <button
                    onClick={() => handleRemoveInputchallengestepGet(input._id)}
                    type="button"
                    className="btn btn2 float-end"
                  >
                    Remove
                  </button>
                  <input type="hidden" name={`challengeid-${index}`} value={input._id} />
                </div>
              </div>
              <div className="col-xl-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor={`challengeStepTitle-${index}`}>Step title</label>
                  <input
                    type="text"
                    className="form-control"
                    id={`challengeStepTitle-${index}`}
                    value={input.titlestep}
                    onChange={(e) => handleInputChangechallengestepGet(index, "titlestep", e.target.value)}
                  />
                </div>
              </div>
              <div className="col-xl-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor={`challengeStepDesc-${index}`}>Step description</label>
                  <input
                    type="text"
                    className="form-control"
                    id={`challengeStepDesc-${index}`}
                    value={input.descriptionstep}
                    onChange={(e) => handleInputChangechallengestepGet(index, "descriptionstep", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
            </>
          )}
        </SectionCard>

        <SectionCard
          id="sec-cs-process"
          title="Process"
          accentColor="#2c3e50"
          toggleId="cs-edit-process"
          toggleName="cs_edit_process_ui"
          enabled={processSectionOn}
          onToggle={(e) => setProcessSectionOn(e.target.checked)}
          badge={(inputs?.length || 0) + (inputsget?.length || 0)}
        >
          {processSectionOn && (
            <>
      <div className="col-lg-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="processTitle">Process Title</label>
            <input type="text" className="form-control"  id="processTitle" value={processtitle} onChange={(e) => setProcessTitle(e.target.value)}  placeholder="Enter Process Title"/>
            {error.processtitle && <span className="text-danger">{error.processtitle}</span>}

          </div>
          </div>
          <div className="col-lg-6">
          <div className="my_profile_setting_input form-group">
              <label htmlFor="processDescription">Process Description</label>
              <HtmlEditor value={processdescription} onChange={setProcessDescription} />
              {error.processdescription && <span className="text-danger">{error.processdescription}</span>}
            </div>
      </div>
      <div className="my_dashboard_review mt30">
        <div className="col-lg-12">
          <button className="btn admore_btn mb30" type="button" onClick={handleAddInput} >Add process step</button>
        </div>
        {inputs.map((input, index) => (
        <div className="row" key={input.id} >
           <div className="col-xl-12">
           <div className="my_profile_setting_input">
          <button onClick={() => handleRemoveInput(input.id)} className="btn btn2 float-end">Remove</button>
          
          </div>
          </div>
          <div className="col-xl-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor={`processTitle-${index}`}>Process Title </label>
              <input type="text" className="form-control" id={`processTitle-${index}`} value={input.titlestep}
              onChange={(e) =>
                handleInputChange(index, 'titlestep', e.target.value)
              }/>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor={`processDescription-${index}`}>Process Description</label>
              <input type="text" className="form-control" id={`processDescription-${index}`} value={input.descriptionstep}
              onChange={(e) =>
                handleInputChange(index, 'descriptionstep', e.target.value)
              } />
            </div>
          </div>
        </div>
        
      ))}

{inputsget?.map((input, index) => (
        <div className="row" key={input._id} >
           <div className="col-xl-12">
           <div className="my_profile_setting_input">
          <button onClick={() => handleRemoveInputGet(input._id)} className="btn btn2 float-end">Remove</button>
          <input type="hidden" name={`processid-${index}`} value={input._id} /> 
          </div>
          </div>
          <div className="col-xl-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor={`processTitle-get-${index}`}>Process Title {index + 1}</label>
              <input type="text" className="form-control" id={`processTitle-get-${index}`} value={input.titlestep}
              onChange={(e) =>
                handleInputChangeGet(index, 'titlestep', e.target.value)
              }/>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor={`processDescription-get-${index}`}>Process Description</label>
              <input type="text" className="form-control" id={`processDescription-get-${index}`} value={input.descriptionstep}
              onChange={(e) =>
                handleInputChangeGet(index, 'descriptionstep', e.target.value)
              } />
            </div>
          </div>
        </div>
        
      ))}
       </div>
            </>
          )}
        </SectionCard>

        <SectionCard
          id="sec-cs-delivered"
          title="Delivered"
          accentColor="#3d5a4f"
          toggleId="cs-edit-delivered"
          toggleName="cs_edit_delivered_ui"
          enabled={deliveredSectionOn}
          onToggle={(e) => setDeliveredSectionOn(e.target.checked)}
        >
          {deliveredSectionOn && (
            <>
      <div className="col-lg-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="deliveredTitle">Delivered Title</label>
            <input type="text" className="form-control"  id="deliveredTitle" value={deliveredtitle} onChange={(e) => setDeliveredTitle(e.target.value)}  placeholder="Enter Delivered Title"/>
            {error.deliveredtitle && <span className="text-danger">{error.deliveredtitle}</span>}

          </div>
          </div>
          <div className="col-lg-6">
          <div className="my_profile_setting_input form-group">
              <label htmlFor="deliveredDescription">Delivered Description</label>
              <HtmlEditor value={delivereddescription} onChange={setDeliveredDescription} />
              {error.delivereddescription && <span className="text-danger">{error.delivereddescription}</span>}
            </div>
      </div>
      <div className="col-lg-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="deliveredVideo">Delivered Video (Embed Code)</label>
            <input type="text" className="form-control"  id="deliveredVideo" value={deliveredvideo} onChange={(e) => setDeliveredVideo(e.target.value)}  placeholder="Enter Delivered Video Embed Code (Optional)"/>
            {error.deliveredvideo && <span className="text-danger">{error.deliveredvideo}</span>}
          </div>
      </div>
      <div className="col-lg-6">
          <div htmlFor="deliveredimage">Delivered Image</div>
               <div className="wrap-custom-file">
                   <input
                       type="file"
                       id="deliveredimage"
                       accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif"
                       onChange={uploadDeliveredImage}
                   />
                   <label
                       style={
                         deliveredimageget                          
                         ? { backgroundImage: `url(${deliveredimageget})` }
                           : deliveredimage
                           ? { backgroundImage: `url(${URL.createObjectURL(deliveredimage)})` }
                           : undefined
                       }
                       htmlFor="deliveredimage"
                   >
                       <span>
                           <i className="flaticon-download"></i> Upload Delivered image{" "}
                       </span>
                   </label>
               </div>
      </div>
            </>
          )}
        </SectionCard>

        <SectionCard
          id="sec-cs-results"
          title="Results"
          accentColor="#4a5175"
          toggleId="cs-edit-results"
          toggleName="cs_edit_results_ui"
          enabled={resultsSectionOn}
          onToggle={(e) => setResultsSectionOn(e.target.checked)}
        >
          {resultsSectionOn && (
            <>
      <div className="col-lg-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="resultsTitle">Results Title</label>
            <input type="text" className="form-control"  id="resultsTitle" value={resultstitle} onChange={(e) => setResultsTitle(e.target.value)}  placeholder="Enter Results Title"/>
            {error.resultstitle && <span className="text-danger">{error.resultstitle}</span>}

          </div>
          </div>
          <div className="col-lg-6">
          <div className="my_profile_setting_input form-group">
              <label htmlFor="resultsSubDescription">Results Subheading</label>
              <HtmlEditor value={resultssubdescription} onChange={setResultsSubdescription} />
            </div>
      </div>
          <div className="col-lg-12">
          <div className="my_profile_setting_input form-group">
              <label htmlFor="resultsDescription">Results Description (Pills Content)</label>
              <HtmlEditor value={resultsdescription} onChange={setResultsDescription} />
              {error.resultsdescription && <span className="text-danger">{error.resultsdescription}</span>}
            </div>
      </div>
            </>
          )}
        </SectionCard>

        <SectionCard
          id="sec-cs-tech"
          title="Tech stack"
          accentColor="#4b5568"
          toggleId="cs-edit-tech"
          toggleName="cs_edit_tech_ui"
          enabled={techSectionOn}
          onToggle={(e) => setTechSectionOn(e.target.checked)}
          badge={(techinputs?.length || 0) + (techimagesget?.length || 0)}
        >
          {techSectionOn && (
            <>
       <div className="col-lg-6 mt-lg-5">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="techTitle">Tech Stack Title</label>
            <input type="text" className="form-control"  id="techTitle" value={techtitle} onChange={(e) => setTechtitle(e.target.value)}  placeholder="Enter Tech Stack Title"/>
            {error.techtitle && <span className="text-danger">{error.techtitle}</span>}
          </div>
          </div>
          <div className="col-lg-6 mt-lg-5">
          <div className="my_profile_setting_input form-group">
              <label htmlFor="techDescription">Tech Stack Description</label>
              <HtmlEditor value={techdescription} onChange={setTechdescription} />
              {error.techdescription && <span className="text-danger">{error.techdescription}</span>}
            </div>
      </div>
       <div className="my_dashboard_review mt30">
        <div className="col-lg-12">
          <button className="btn admore_btn mb30" type="button" onClick={handleAddTechInput} >Add tech image</button>
        </div>
        
        {/* Existing Tech logoss */}
        {techimagesget?.map((imgUrl, index) => (
        <div className="row" key={`exist-${index}`} >
           <div className="col-xl-12">
           <div className="my_profile_setting_input">
          <button onClick={() => handleRemoveExistingTech(index)} type="button" className="btn btn2 float-end">Remove</button>
          </div>
          </div>
          <div className="col-xl-6">
               <div>Existing Tech Image {index + 1}</div>
               <div className="wrap-custom-file">
                   <label
                       style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL + imgUrl})` }}
                   >
                   </label>
               </div>
          </div>    
        </div>
      ))}

      {/* New Tech logos */}
      {techinputs.map((input, index) => (
        <div className="row" key={input.id} >
           <div className="col-xl-12">
           <div className="my_profile_setting_input">
          <button onClick={() => handleRemoveTechInput(input.id)} type="button" className="btn btn2 float-end">Remove</button>
          </div>
          </div>
          <div className="col-xl-6">
               <div htmlFor={`techimage-${index}`}>New Tech Image {index + 1}</div>
               <div className="wrap-custom-file">
                   <input
                       type="file"
                       id={`techimage-${index}`}
                       accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif"
                       onChange={(e) => uploadTechImage(index, e.target.files[0])}
                   />
                   <label
                       style={
                         input.imagestep !== null
                               ? {
                                     backgroundImage: `url(${URL.createObjectURL(
                                       input.imagestep
                                     )})`,
                                 }
                               : undefined
                       }
                       htmlFor={`techimage-${index}`}
                   >
                       <span>
                           <i className="flaticon-download"></i> Upload image{" "}
                       </span>
                   </label>
               </div>
          </div>    
        </div>
      ))}

       </div>
            </>
          )}
        </SectionCard>

        <SectionCard
          id="sec-cs-meta"
          title="Meta information"
          accentColor="#3c4058"
          toggleId="cs-edit-meta"
          toggleName="cs_edit_meta_ui"
          enabled={metaSectionOn}
          onToggle={(e) => setMetaSectionOn(e.target.checked)}
        >
          {metaSectionOn && (
            <>
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="casestudyMetatitle">Meta Title</label>
          <input type="text"
              className="form-control"
              id="casestudyMetatitle"
              value={metatitle}
              onChange={(e) => setMetatitle(e.target.value)} />
               {error.metatitle && <span className="text-danger">{error.metatitle}</span>}
        </div>
      </div>
      <div className="col-lg-12">
          <div className="my_profile_setting_textarea form-group">
            <label htmlFor="casestudyMetaDescription">Meta Description</label>
            <textarea id="casestudyMetaDescription" className="form-control" rows="7"  value={metadescription} onChange={(e) => setMetaDescription(e.target.value)}  placeholder="Enter meta description"></textarea>
            {error.metadescription && <span className="text-danger">{error.metadescription}</span>}
          </div>
      </div>
            </>
          )}
        </SectionCard>

      <div className="col-lg-12">
          <div className="my_profile_setting_input form-group">
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>
              Featured in Services Page
              <small className="text-muted ms-2" style={{ fontWeight: 400, fontSize: 12 }}>
                — select which service sections show this case study
              </small>
            </label>
            <div className="d-flex flex-wrap gap-2">
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleService(cat)}
                  style={{
                    borderRadius: 20,
                    padding: '5px 16px',
                    fontSize: 13,
                    border: '1.5px solid',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    background: featuredInServices.includes(cat) ? '#4b4d7c' : '#fff',
                    borderColor: featuredInServices.includes(cat) ? '#4b4d7c' : '#ced4da',
                    color: featuredInServices.includes(cat) ? '#fff' : '#495057',
                  }}
                >
                  {featuredInServices.includes(cat) ? '✓ ' : ''}{cat}
                </button>
              ))}
            </div>
            {featuredInServices.length > 0 && (
              <p className="text-muted mt-2 mb-0" style={{ fontSize: 12 }}>
                Selected: {featuredInServices.join(', ')}
              </p>
            )}
          </div>
        </div>

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
          <button className="btn btn1 float-start" type="button" onClick={() => window.location.href = '/thebusinesshub/casestudies'}>Back</button>
          <button className="btn btn2 float-end">Submit</button>
        </div>
      </div>
      </form>
    </>
  );
};

export default CreateList;

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { addCasestudyAPI } from "@/api/casestudy";
// import { MultiSelectInput } from 'multi-select-input';
import { getFaqTableData } from "@/api/faq";

import selectedFiles from "@/utils/selectedFiles";
import { toast } from 'react-toastify';
import Image from "next/image";
import HtmlEditor from "@/components/HtmlEditor";
import SectionCard from "../../../services/_components/SectionCard";
import WhyChooseUsShowcaseForm from "../../_components/WhyChooseUsShowcaseForm";
import { emptyWhyChooseUsShowcase, mergeWhyChooseUsShowcase } from "@/utils/whyChooseUsShowcase";

const CreateList = () => {
  const [inputs, setInputs] = useState([]);
  const [logo, setLogo] = useState(null);
    const [casestudylogo, setCasestudylogo] = useState(null);
  const [isSubmitting, setisSubmitting] = useState("");
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

  const [techinputs, setTechinputs] = useState([]);
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
  const uploadLogo = (e) => {
    setLogo(e.target.files[0]);
};
const uploadCasestudyLogo = (e) => {
  setCasestudylogo(e.target.files[0]);
};
  const handleInputChange = (index, field, value) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };
  const handleRemoveInput = (idToRemove) => {
    setInputs(inputs.filter((input) => input.id !== idToRemove));
  };
  const uploadProcessImage = (index, file) => {
    const updatedInputs = [...inputs];
    updatedInputs[index].imagestep = file;
    setInputs(updatedInputs);
  };

  const [inputschallengestep, setInputschallengestep] = useState([]);
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
 
  const [value, setValue] = useState([]);
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [deliveredtitle, setDeliveredTitle] = useState("");
  const [delivereddescription, setDeliveredDescription] = useState([]);
  const [resultstitle, setResultsTitle] = useState("");
  const [resultsdescription, setResultsDescription] = useState([]);
  const [resultssubdescription, setResultsSubdescription] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  // --- State Hooks ---
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [shortdescription, setShortDescription] = useState("");
const [project, setProject] = useState("");
const [country, setCountry] = useState("");
const [industry, setIndustry] = useState("");
const [servicesUsed, setServicesUsed] = useState("");
const [slug, setSlug] = useState("");
const [status, setStatus] = useState(true);
const [featuredInServices, setFeaturedInServices] = useState([]);
const SERVICE_CATEGORIES = ['AI Intelligence', 'Software Development', 'Mobile Apps', 'Web', 'Ecommerce', 'Emerging Tech', 'Digital Marketing'];
const toggleService = (cat) => setFeaturedInServices((prev) => prev.includes(cat) ? prev.filter((s) => s !== cat) : [...prev, cat]);
  const [challengetitle , setChallengeTitle] = useState([]);
  const [challengedescription, setChallengeDescription] = useState([]);

  const [aboutimage, setAboutImage] = useState(null);
  const [abouttitle , setAboutTitle] = useState([]);
  const [aboutdescription, setAboutDescription] = useState([]);


 

  const [metatitle, setMetatitle] = useState([]);
  const [metadescription, setMetaDescription] = useState([]);
  const [processtitle, setProcessTitle] = useState("");
  const [processdescription, setProcessDescription] = useState("");
  const [techtitle, setTechtitle] = useState("");
  const [techdescription, setTechdescription] = useState("");
  const [deliveredimage, setDeliveredImage] = useState(null);
  const [deliveredvideo, setDeliveredVideo] = useState("");

  /** UI-only: matches Services admin accordion toggles; values are not submitted to the API. */
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

  // upload profile
  const uploadAboutImage = (e) => {
    setAboutImage(e.target.files[0]);
  };
  const uploadDeliveredImage = (e) => {
    setDeliveredImage(e.target.files[0]);
  };
  
    
    
  
// --- Submit ---
const addCasestudy = async (e) => {
 
  e.preventDefault();
  setisSubmitting(true);
  const newErrors = {};
  
  const requiredFields = [
    { key: "title", value: title, name: "Title" },
    { key: "slug", value: slug, name: "Slug" },
    
    { key: "abouttitle", value: abouttitle, name: "About title" },
    { key: "aboutdescription", value: aboutdescription, name: "About Description" },
    { key: "metatitle", value: metatitle, name: "Meta Title" },
    { key: "metadescription", value: metadescription, name: "Meta Description" },
    { key: "deliveredtitle", value: deliveredtitle, name: "Delivered Title" },
    { key: "delivereddescription", value: delivereddescription, name: "Delivered Description" },
    { key: "resultstitle", value: resultstitle, name: "Results Title" },
    { key: "resultsdescription", value: resultsdescription, name: "Results Description" },
  ];

  requiredFields.forEach(field => {
    
    if (!field.value || (typeof field.value === "string" && !field.value.trim())) {
      newErrors[field.key] = `${field.name} is required`;
    }
  });

  if (Object.keys(newErrors).length > 0) {
    setisSubmitting(false);
    setError(newErrors);
    return;
  }

  try {
    
    const payload = {
      title, slug,description,shortdescription,project, country, industry, servicesUsed, challengetitle, challengedescription, aboutimage, abouttitle, aboutdescription, featuredInServices: JSON.stringify(featuredInServices),
      quotetitle, quotename, quotedescription,
      deliveredtitle, delivereddescription, resultstitle, resultsdescription, resultssubdescription,
      metatitle, metadescription, processtitle, processdescription, techtitle, techdescription, deliveredvideo, status
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
    inputschallengestep.forEach((input, index) => {
      formData.append(`challenges[${index}][titlestep]`, input.titlestep);
      formData.append(`challenges[${index}][descriptionstep]`, input.descriptionstep);
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
      

    const data = await addCasestudyAPI(formData);
    
    // Check if the response indicates success
    if (data.status === "success") {
      toast.success(data.message || "Case study added successfully");
      // Reset fields and errors
      setError({});
      // Reset form fields
      setTitle("");
      setSlug("");
      setStatus(true);
      setDescription("");
      setShortDescription("");
      setProject("");
      setCountry("");
      setIndustry("");
      setServicesUsed("");
      setAboutTitle("");
      setAboutDescription("");
      setQuotetitle("");
      setQuotename("");
      setQuotedescription("");
      setWhyChooseUsShowcase(emptyWhyChooseUsShowcase());
      setChallengeTitle("");
      setChallengeDescription("");
      setDeliveredTitle("");
      setDeliveredDescription("");
      setResultsTitle("");
      setResultsDescription("");
      setProcessTitle("");
      setProcessDescription("");
      setTechtitle("");
      setTechdescription("");
      setMetatitle("");
      setMetaDescription("");
      setLogo(null);
      setCasestudylogo(null);
      setAboutImage(null);
      setInputs([]);
      setInputschallengestep([]);
      setTechinputs([]);
      setDeliveredVideo("");
      setDeliveredImage(null);
      setFeaturedInServices([]);

      setTimeout(() => {
          router.push("/thebusinesshub/casestudies");
          }, 1500); 
    } else {
      // If API returns but status is not success
      setisSubmitting(false);
      setError({ general: data.message || "Failed to add case study" });
      toast.error(data.message || "Failed to add case study");
    }
  } catch (err) {
    // Reset submitting state on error
    setisSubmitting(false);
    const errorMessage = err.message || "Something went wrong. Please try again.";
    setError({ general: errorMessage });
    toast.error(errorMessage);
  }
};



  return (
    <>
    <form onSubmit={addCasestudy} className="row">
        <SectionCard id="sec-cs-core" title="Core Information" accentColor="#4b4d7c">
    <div className="col-lg-6">
    <div>Casestudy logo</div>
                <div className="wrap-custom-file">
                    <input
                        type="file"
                        id="image1"
                         accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif"
                        onChange={uploadLogo}
                    />
                    <label
                        style={
                            logo !== null
                                ? {
                                      backgroundImage: `url(${URL.createObjectURL(
                                          logo
                                      )})`,
                                  }
                                : undefined
                        }
                        htmlFor="image1"
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
            <div>Casestudy Image</div>
                <div className="wrap-custom-file">
                    <input
                        type="file"
                        id="image2"
                         accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif"
                        onChange={uploadCasestudyLogo}
                    />
                    <label
                        style={
                            casestudylogo !== null
                                ? {
                                      backgroundImage: `url(${URL.createObjectURL(
                                          casestudylogo
                                      )})`,
                                  }
                                : undefined
                        }
                        htmlFor="image2"
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
            <input type="text" className="form-control" id="casestudyCountry" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. USA"/>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="casestudyIndustry">Industry</label>
            <input type="text" className="form-control" id="casestudyIndustry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. HealthTech"/>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="casestudyServicesUsed">Services Used</label>
            <input type="text" className="form-control" id="casestudyServicesUsed" value={servicesUsed} onChange={(e) => setServicesUsed(e.target.value)} placeholder="e.g. UI/UX Design, App Development"/>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="casestudyDescription">Description</label>
            <HtmlEditor value={description} onChange={setDescription} />
            {error.description && <span className="text-danger">{error.description}</span>}
          </div>
          
        </div>
        <div className="col-lg-12">
          <div className="my_profile_setting_textarea form-group">
            <label htmlFor="casestudyShortDescription">Short Description</label>
            <textarea id="casestudyShortDescription" className="form-control" rows="4"  value={shortdescription} onChange={(e) => setShortDescription(e.target.value)}  placeholder="Enter short description"></textarea>
            {error.shortdescription && <span className="text-danger">{error.shortdescription}</span>}
          </div>
          
        </div>
        </SectionCard>

        <SectionCard
          id="sec-cs-about"
          title="About"
          accentColor="#3c3e66"
          toggleId="cs-add-about"
          toggleName="cs_add_about_ui"
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
                                  style={
                                    aboutimage !== null
                                          ? {
                                                backgroundImage: `url(${URL.createObjectURL(
                                                  aboutimage
                                                )})`,
                                            }
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
          toggleId="cs-add-why-choose-us-showcase"
          toggleName="cs_add_why_choose_us_showcase_ui"
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
          toggleId="cs-add-quote"
          toggleName="cs_add_quote_ui"
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
          toggleId="cs-add-challenges"
          toggleName="cs_add_challenges_ui"
          enabled={challengesSectionOn}
          onToggle={(e) => setChallengesSectionOn(e.target.checked)}
          badge={inputschallengestep.length}
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
              Each row is one challenge card on the case study page, directly under the challenge title and description above.
            </p>
          </div>
          <div className="col-lg-12 mb20">
            <button className="btn admore_btn mb10" type="button" onClick={handleAddInputchallengestep}>
              Add challenge step
            </button>
          </div>
          {inputschallengestep.map((input, index) => (
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
                  <label htmlFor={`challengeStepTitle-${index}`}>Step title</label>
                  <input
                    type="text"
                    className="form-control"
                    id={`challengeStepTitle-${index}`}
                    value={input.titlestep}
                    onChange={(e) => handleInputChangechallengestep(index, "titlestep", e.target.value)}
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
                    onChange={(e) => handleInputChangechallengestep(index, "descriptionstep", e.target.value)}
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
          toggleId="cs-add-process"
          toggleName="cs_add_process_ui"
          enabled={processSectionOn}
          onToggle={(e) => setProcessSectionOn(e.target.checked)}
          badge={inputs.length}
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
              <label htmlFor={`processTitle-${index}`}>Process Title {index + 1}</label>
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
       </div>
            </>
          )}
        </SectionCard>

        <SectionCard
          id="sec-cs-delivered"
          title="Delivered"
          accentColor="#3d5a4f"
          toggleId="cs-add-delivered"
          toggleName="cs_add_delivered_ui"
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
                         deliveredimage !== null
                               ? {
                                     backgroundImage: `url(${URL.createObjectURL(
                                       deliveredimage
                                     )})`,
                                 }
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
          toggleId="cs-add-results"
          toggleName="cs_add_results_ui"
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
          toggleId="cs-add-tech"
          toggleName="cs_add_tech_ui"
          enabled={techSectionOn}
          onToggle={(e) => setTechSectionOn(e.target.checked)}
          badge={techinputs.length}
        >
          {techSectionOn && (
            <>
      <div className="col-lg-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="techTitle">Tech Stack Title</label>
            <input type="text" className="form-control"  id="techTitle" value={techtitle} onChange={(e) => setTechtitle(e.target.value)}  placeholder="Enter Tech Stack Title"/>
            {error.techtitle && <span className="text-danger">{error.techtitle}</span>}
          </div>
          </div>
          <div className="col-lg-6">
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
        {techinputs.map((input, index) => (
        <div className="row" key={input.id} >
           <div className="col-xl-12">
           <div className="my_profile_setting_input">
          <button onClick={() => handleRemoveTechInput(input.id)} type="button" className="btn btn2 float-end">Remove</button>
          </div>
          </div>
          <div className="col-xl-6">
               <div htmlFor={`techimage-${index}`}>Tech Image {index + 1}</div>
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
          toggleId="cs-add-meta"
          toggleName="cs_add_meta_ui"
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

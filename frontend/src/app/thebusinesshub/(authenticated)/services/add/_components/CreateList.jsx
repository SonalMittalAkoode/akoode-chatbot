"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { addServicesAPI } from "@/api/services";
// import { MultiSelectInput } from 'multi-select-input';

import selectedFiles from "@/utils/selectedFiles";
import { toast } from 'react-toastify';
import Image from "next/image";
import HtmlEditor from "@/components/HtmlEditor";
import ImageAltInput from "@/components/admin/ImageAltInput";
import UploadWithAlt from "@/components/admin/UploadWithAlt";
import SectionCard from "../../_components/SectionCard";
import StepCard from "../../_components/StepCard";
import { fileNameToAlt } from "@/utils/imageAlt";

const createEmptyFaq = () => ({
  id: `faq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title: "",
  description: "",
});

const CreateList = () => {
  // Frontend Technology Section
  const [frontendTechnologyShow, setFrontendTechnologyShow] = useState(false);
  const [frontendTechnologyTitle, setFrontendTechnologyTitle] = useState("");
  const [frontendTechnologyDescription, setFrontendTechnologyDescription] = useState("");
  const [frontendTechnologyImage, setFrontendTechnologyImage] = useState(null);
  const [frontendTechnologyImagePreview, setFrontendTechnologyImagePreview] = useState("");
  const [frontendTechnologySteps, setFrontendTechnologySteps] = useState([]);

  // Backend Technology Section
  const [backendTechnologyShow, setBackendTechnologyShow] = useState(false);
  const [backendTechnologyTitle, setBackendTechnologyTitle] = useState("");
  const [backendTechnologyDescription, setBackendTechnologyDescription] = useState("");
  const [backendTechnologyImage, setBackendTechnologyImage] = useState(null);
  const [backendTechnologyImagePreview, setBackendTechnologyImagePreview] = useState("");
  const [backendTechnologySteps, setBackendTechnologySteps] = useState([]);

  // Database Technology Section
  const [databaseTechnologyShow, setDatabaseTechnologyShow] = useState(false);
  const [databaseTechnologyTitle, setDatabaseTechnologyTitle] = useState("");
  const [databaseTechnologyDescription, setDatabaseTechnologyDescription] = useState("");
  const [databaseTechnologyImage, setDatabaseTechnologyImage] = useState(null);
  const [databaseTechnologyImagePreview, setDatabaseTechnologyImagePreview] = useState("");
  const [databaseTechnologySteps, setDatabaseTechnologySteps] = useState([]);

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoimagealt, setLogoimagealt] = useState("");
  const [serviceslogo, setServiceslogo] = useState(null);
  const [servicesLogoPreview, setServicesLogoPreview] = useState("");
  const [servicesimagealt, setServicesimagealt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Frontend Technology Handlers
  const handleAddFrontendStep = () => {
    setFrontendTechnologySteps([
      ...frontendTechnologySteps,
      {
        id: Date.now(),
        titlestep: '',
        descriptionstep: '',
        section: 'frontend'
      }
    ]);
  };
  const handleInputChangeFrontend = (index, field, value) => {
    const updated = [...frontendTechnologySteps];
    updated[index][field] = value;
    setFrontendTechnologySteps(updated);
  };
  const handleRemoveFrontendStep = (idToRemove) => {
    setFrontendTechnologySteps(frontendTechnologySteps.filter((input) => input.id !== idToRemove));
  };
  const uploadFrontendTechnologySectionImage = (e) => {
    const file = e.target.files[0];
    setFrontendTechnologyImage(file);
    if (file) {
      setFrontendTechnologyImagePreview(URL.createObjectURL(file));
      if (!frontendtechnologyimagealt) setFrontendtechnologyimagealt(fileNameToAlt(file.name));
    }
  };

  // Backend Technology Handlers
  const handleAddBackendStep = () => {
    setBackendTechnologySteps([
      ...backendTechnologySteps,
      {
        id: Date.now(),
        titlestep: '',
        descriptionstep: '',
        section: 'backend'
      }
    ]);
  };
  const handleInputChangeBackend = (index, field, value) => {
    const updated = [...backendTechnologySteps];
    updated[index][field] = value;
    setBackendTechnologySteps(updated);
  };
  const handleRemoveBackendStep = (idToRemove) => {
    setBackendTechnologySteps(backendTechnologySteps.filter((input) => input.id !== idToRemove));
  };
  const uploadBackendTechnologySectionImage = (e) => {
    const file = e.target.files[0];
    setBackendTechnologyImage(file);
    if (file) {
      setBackendTechnologyImagePreview(URL.createObjectURL(file));
      if (!backendtechnologyimagealt) setBackendtechnologyimagealt(fileNameToAlt(file.name));
    }
  };

  // Database Technology Handlers
  const handleAddDatabaseStep = () => {
    setDatabaseTechnologySteps([
      ...databaseTechnologySteps,
      {
        id: Date.now(),
        titlestep: '',
        descriptionstep: '',
        section: 'database'
      }
    ]);
  };
  const handleInputChangeDatabase = (index, field, value) => {
    const updated = [...databaseTechnologySteps];
    updated[index][field] = value;
    setDatabaseTechnologySteps(updated);
  };
  const handleRemoveDatabaseStep = (idToRemove) => {
    setDatabaseTechnologySteps(databaseTechnologySteps.filter((input) => input.id !== idToRemove));
  };
  const uploadDatabaseTechnologySectionImage = (e) => {
    const file = e.target.files[0];
    setDatabaseTechnologyImage(file);
    if (file) {
      setDatabaseTechnologyImagePreview(URL.createObjectURL(file));
      if (!databasetechnologyimagealt) setDatabasetechnologyimagealt(fileNameToAlt(file.name));
    }
  };

  const uploadLogo = (e) => {
    const file = e.target.files[0];
    setLogo(file || null);
    setLogoPreview(file ? URL.createObjectURL(file) : "");
    if (file && !logoimagealt) setLogoimagealt(fileNameToAlt(file.name));
  };
  const uploadServicesLogo = (e) => {
    const file = e.target.files[0];
    setServiceslogo(file || null);
    setServicesLogoPreview(file ? URL.createObjectURL(file) : "");
    if (file && !servicesimagealt) setServicesimagealt(fileNameToAlt(file.name));
  };


  const [inputsservicestep, setInputsservicestep] = useState([]);
  const handleAddInputservicestep = () => {
    setInputsservicestep([
      ...inputsservicestep,
      {
        id: Date.now(),
        titlestep: '',
        descriptionstep: '',
        imagestep: null,
        imagepreview: '',
        imagealt: ''
      }
    ]);
  };
  const uploadServiceImage = (index, file) => {
    const updatedInputs = [...inputsservicestep];
    updatedInputs[index].imagestep = file || null;
    updatedInputs[index].imagepreview = file ? URL.createObjectURL(file) : '';
    if (file && !updatedInputs[index].imagealt) updatedInputs[index].imagealt = fileNameToAlt(file.name);
    setInputsservicestep(updatedInputs);
  };
  const removeServiceStepImage = (index) => {
    const updated = [...inputsservicestep];
    updated[index].imagestep = null;
    updated[index].imagepreview = '';
    setInputsservicestep(updated);
  };
  const handleInputChangeservicestep = (index, field, value) => {
    const updated = [...inputsservicestep];
    updated[index][field] = value;
    setInputsservicestep(updated);
  };
  const handleRemoveInputservicestep = (idToRemove) => {
    setInputsservicestep(inputsservicestep.filter((input) => input.id !== idToRemove));
  };




  const [inputsindustrystep, setInputsindustrystep] = useState([]);
  const handleAddInputindustrystep = () => {
    setInputsindustrystep([
      ...inputsindustrystep,
      {
        id: Date.now(),
        titlestep: '',
        descriptionstep: '',
        imagestep: null,
        imagepreview: '',
        imagealt: ''
      }
    ]);
  };
  const uploadIndustryImage = (index, file) => {
    const updatedInputs = [...inputsindustrystep];
    updatedInputs[index].imagestep = file || null;
    updatedInputs[index].imagepreview = file ? URL.createObjectURL(file) : '';
    if (file && !updatedInputs[index].imagealt) updatedInputs[index].imagealt = fileNameToAlt(file.name);
    setInputsindustrystep(updatedInputs);
  };
  const removeIndustryStepImage = (index) => {
    const updated = [...inputsindustrystep];
    updated[index].imagestep = null;
    updated[index].imagepreview = '';
    setInputsindustrystep(updated);
  };
  const handleInputChangeindustrystep = (index, field, value) => {
    const updated = [...inputsindustrystep];
    updated[index][field] = value;
    setInputsindustrystep(updated);
  };
  const handleRemoveInputindustrystep = (idToRemove) => {
    setInputsindustrystep(inputsindustrystep.filter((input) => input.id !== idToRemove));
  };




  const [inputswhatweofferstep, setInputswhatweofferstep] = useState([]);
  const handleAddInputwhatweofferstep = () => {
    setInputswhatweofferstep([
      ...inputswhatweofferstep,
      {
        id: Date.now(),
        titlestep: '',
        descriptionstep: '',
        linkstep: '',
        imagestep: null,
        imagepreview: '',
        imagealt: ''
      }
    ]);
  };
  const uploadWhatweofferImage = (index, file) => {
    const updatedInputs = [...inputswhatweofferstep];
    updatedInputs[index].imagestep = file || null;
    updatedInputs[index].imagepreview = file ? URL.createObjectURL(file) : '';
    if (file && !updatedInputs[index].imagealt) updatedInputs[index].imagealt = fileNameToAlt(file.name);
    setInputswhatweofferstep(updatedInputs);
  };
  const removeWhatWeOfferStepImage = (index) => {
    const updated = [...inputswhatweofferstep];
    updated[index].imagestep = null;
    updated[index].imagepreview = '';
    setInputswhatweofferstep(updated);
  };
  const handleInputChangewhatweofferstep = (index, field, value) => {
    const updated = [...inputswhatweofferstep];
    updated[index][field] = value;
    setInputswhatweofferstep(updated);
  };
  const handleRemoveInputwhatweofferstep = (idToRemove) => {
    setInputswhatweofferstep(inputswhatweofferstep.filter((input) => input.id !== idToRemove));
  };


  const [value, setValue] = useState([]);
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const router = useRouter();
  const [error, setError] = useState({});

  // Parent service
  const [parentService, setParentService] = useState("");
  const [parentOptions, setParentOptions] = useState([]);

  useEffect(() => {
    const fetchParentServices = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "";
        const res = await fetch(`${BASE_URL}api/services`);
        if (res.ok) {
          const data = await res.json();
          // Paginated response has .items; flat/hierarchical response is an array
          const list = Array.isArray(data) ? data : (data.items ?? []);
          const parents = list.filter((s) => !s.parent);
          setParentOptions(parents);
        }
      } catch (err) {
        console.error("Failed to fetch parent services:", err);
      }
    };
    fetchParentServices();
  }, []);

  // --- State Hooks ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [slug, setSlug] = useState("");
  const [serviceshow, setServiceshow] = useState(false);
  const [servicetitle, setServiceTitle] = useState("");
  const [servicedescription, setServiceDescription] = useState("");

  const [aboutimage, setAboutImage] = useState(null);
  const [aboutImagePreview, setAboutImagePreview] = useState("");
  const [abouttitle, setAboutTitle] = useState("");
  const [abouttag, setAboutTag] = useState("");
  const [aboutdescription, setAboutDescription] = useState("");
  const [featuredService, setFeaturedService] = useState(false);
  const [status, setStatus] = useState(true);




  const [metatitle, setMetatitle] = useState("");
  const [metadescription, setMetaDescription] = useState("");

  const [whatweofferhow, setWhatweofferhow] = useState(false);
  const [whatweoffertitle, setWhatweofferTitle] = useState("");
  const [whatweofferdescription, setWhatweofferDescription] = useState("");

  const [industryhow, setIndustryshow] = useState(false);
  const [industrytitle, setIndustryTitle] = useState("");
  const [industrydescription, setIndustryDescription] = useState("");
  const [peopleimage, setPeopleImage] = useState(null);
  const [peopleImagePreview, setPeopleImagePreview] = useState("");
  const [aboutimagealt, setAboutimagealt] = useState("");
  const [peoplehow, setPeoplehow] = useState(false);
  const [peopletitle, setPeopleTitle] = useState("");
  const [peopledescription, setPeopleDescription] = useState("");
  const [peopleimagealt, setPeopleimagealt] = useState("");

  const [teamServiceshow, setTeamServiceshow] = useState(false);
  const [teamServicesTitle, setTeamServicesTitle] = useState("");
  const [teamServicesSubTitle, setTeamServicesSubTitle] = useState("");
  const [teamServicesDescription, setTeamServicesDescription] = useState("");

  const [scrollSpyNavShow, setScrollSpyNavShow] = useState(false);
  const [scrollSpyNavSections, setScrollSpyNavSections] = useState([]);

  const [customSoftwareShow, setCustomSoftwareShow] = useState(false);
  const [customSoftwareTitle, setCustomSoftwareTitle] = useState("");
  const [customSoftwareDescription, setCustomSoftwareDescription] = useState("");
  const [customSoftwareImage, setCustomSoftwareImage] = useState(null);
  const [customSoftwareImagePreview, setCustomSoftwareImagePreview] = useState("");
  const [customsoftwareimagealt, setCustomsoftwareimagealt] = useState("");
  const [customSoftwareSteps, setCustomSoftwareSteps] = useState([]);
  const [frontendtechnologyimagealt, setFrontendtechnologyimagealt] = useState("");
  const [backendtechnologyimagealt, setBackendtechnologyimagealt] = useState("");
  const [databasetechnologyimagealt, setDatabasetechnologyimagealt] = useState("");

  const [serviceSectionShow, setServiceSectionShow] = useState(false);
  const [serviceSectionTitle, setServiceSectionTitle] = useState("");
  const [serviceSectionDescription, setServiceSectionDescription] = useState("");
  const [serviceFaqs, setServiceFaqs] = useState([]);
  const [draggedFaqId, setDraggedFaqId] = useState(null);

  const addFaqItem = () => setServiceFaqs((prev) => [...prev, createEmptyFaq()]);
  const updateFaqItem = (id, field, value) => {
    setServiceFaqs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };
  const removeFaqItem = (id) => {
    setServiceFaqs((prev) => prev.filter((item) => item.id !== id));
  };
  const moveFaqItem = (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return;
    setServiceFaqs((prev) => {
      const fromIndex = prev.findIndex((item) => item.id === fromId);
      const toIndex = prev.findIndex((item) => item.id === toId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };
  const handleFaqDragStart = (id) => setDraggedFaqId(id);
  const handleFaqDrop = (targetId) => {
    moveFaqItem(draggedFaqId, targetId);
    setDraggedFaqId(null);
  };

  // ScrollSpyNav Handlers
  const handleAddScrollSpySection = () => {
    setScrollSpyNavSections([
      ...scrollSpyNavSections,
      {
        id: Date.now(),
        idValue: '',
        title: ''
      }
    ]);
  };
  const handleInputChangeScrollSpy = (index, field, value) => {
    const updated = [...scrollSpyNavSections];
    updated[index][field] = value;
    setScrollSpyNavSections(updated);
  };
  const handleRemoveScrollSpySection = (idToRemove) => {
    setScrollSpyNavSections(scrollSpyNavSections.filter((input) => input.id !== idToRemove));
  };

  // Custom Software Handlers
  const handleAddCustomSoftwareStep = () => {
    setCustomSoftwareSteps([
      ...customSoftwareSteps,
      {
        id: Date.now(),
        iconFile: null,
        iconPreview: '',
        title: '',
        description: '',
        iconAlt: ''
      }
    ]);
  };
  const handleInputChangeCustomSoftwareStep = (index, field, value) => {
    const updated = [...customSoftwareSteps];
    updated[index][field] = value;
    setCustomSoftwareSteps(updated);
  };
  const handleRemoveCustomSoftwareStep = (idToRemove) => {
    setCustomSoftwareSteps(customSoftwareSteps.filter((input) => input.id !== idToRemove));
  };
  const uploadCustomSoftwareStepIcon = (index, file) => {
    const updated = [...customSoftwareSteps];
    updated[index].iconFile = file;
    updated[index].iconPreview = file ? URL.createObjectURL(file) : '';
    if (file && !updated[index].iconAlt) updated[index].iconAlt = fileNameToAlt(file.name);
    setCustomSoftwareSteps(updated);
  };
  const uploadCustomSoftwareImage = (e) => {
    const file = e.target.files[0];
    setCustomSoftwareImage(file);
    if (file) {
      setCustomSoftwareImagePreview(URL.createObjectURL(file));
      if (!customsoftwareimagealt) setCustomsoftwareimagealt(fileNameToAlt(file.name));
    }
  };

  // upload profile
  const uploadAboutImage = (e) => {
    const file = e.target.files[0];
    setAboutImage(file || null);
    setAboutImagePreview(file ? URL.createObjectURL(file) : "");
    if (file && !aboutimagealt) setAboutimagealt(fileNameToAlt(file.name));
  };
  const uploadPeopleImage = (e) => {
    const file = e.target.files[0];
    setPeopleImage(file || null);
    setPeopleImagePreview(file ? URL.createObjectURL(file) : "");
    if (file && !peopleimagealt) setPeopleimagealt(fileNameToAlt(file.name));
  };



  // --- Submit ---
  const handleDescriptionChange = (value) => {
    setDescription(value);
    setError((prev) => ({ ...(prev || {}), description: "" }));
  };

  const addServices = async (e) => {

    e.preventDefault();
    setIsSubmitting(true)
    const newErrors = {};

    const requiredFields = [
      { key: "title", value: title, name: "Title" },
      { key: "slug", value: slug, name: "Slug" },

      { key: "abouttitle", value: abouttitle, name: "About title" },
      { key: "aboutdescription", value: aboutdescription, name: "About Description" },
      { key: "metatitle", value: metatitle, name: "Meta Title" },
      { key: "metadescription", value: metadescription, name: "Meta Description" },
    ];

    requiredFields.forEach(field => {

      if (!field.value || (typeof field.value === "string" && !field.value.trim())) {
        newErrors[field.key] = `${field.name} is required`;
      }
    });
    // alert("addServicesws");
    // if (Object.keys(newErrors).length > 0) {

    //   return setError(newErrors);
    // }
    alert("addServiceswsss");
    try {

      const payload = {
        title,
        slug,
        description,
        project,
        parent: parentService || null,
        servicetitle,
        servicedescription,
        serviceshow,
        abouttitle,
        abouttag,
        aboutdescription,
        aboutimagealt,
        featuredService,
        status,
        frontendtechnologyhow: frontendTechnologyShow,
        frontendtechnologytitle: frontendTechnologyTitle,
        frontendtechnologydescription: frontendTechnologyDescription,
        frontendtechnologyimagealt,
        backendtechnologyhow: backendTechnologyShow,
        backendtechnologytitle: backendTechnologyTitle,
        backendtechnologydescription: backendTechnologyDescription,
        backendtechnologyimagealt,
        databasetechnologyhow: databaseTechnologyShow,
        databasetechnologytitle: databaseTechnologyTitle,
        databasetechnologydescription: databaseTechnologyDescription,
        databasetechnologyimagealt,
        industrytitle,
        industrydescription,
        industryhow,
        whatweoffertitle,
        whatweofferdescription,
        whatweofferhow,
        peopletitle,
        peopledescription,
        peopleimagealt,
        peoplehow,
        teamServicesTitle,
        teamServicesSubTitle,
        teamServicesDescription,
        teamServiceshow,
        scrollSpyNavShow,
        customSoftwareShow,
        customSoftwareTitle,
        customSoftwareDescription,
        customsoftwareimagealt,
        serviceSectionShow,
        serviceSectionTitle,
        serviceSectionDescription,
        logoimagealt,
        servicesimagealt,
        metatitle,
        metadescription,
      };


      const formData = new FormData();

      // Loop over each key-value pair in the payload
      for (const key in payload) {
        if (payload[key] !== undefined && payload[key] !== null) {
          try {
            // Handle arrays and objects by converting them to JSON strings
            if (Array.isArray(payload[key]) || (typeof payload[key] === 'object' && payload[key] !== null)) {
              formData.append(key, JSON.stringify(payload[key]));
            } else {
              formData.append(key, payload[key]);
            }
          } catch (error) {
            console.error(`Error appending ${key} to FormData:`, error);
            // Skip this field if there's an error
          }
        }
      }
      // Frontend Technology Steps
      frontendTechnologySteps.forEach((input, index) => {
        if (input && input.titlestep !== undefined) {
          formData.append(`frontendtechnology[${index}][titlestep]`, input.titlestep || "");
        }
        if (input && input.descriptionstep !== undefined) {
          formData.append(`frontendtechnology[${index}][descriptionstep]`, input.descriptionstep || "");
        }
        if (input && input.imagestep) {
          formData.append(`frontendtechnology[${index}][imagestep]`, input.imagestep);
        }
        if (input && input.section) {
          formData.append(`frontendtechnology[${index}][section]`, input.section || "frontend");
        }
      });

      // Backend Technology Steps
      backendTechnologySteps.forEach((input, index) => {
        if (input && input.titlestep !== undefined) {
          formData.append(`backendtechnology[${index}][titlestep]`, input.titlestep || "");
        }
        if (input && input.descriptionstep !== undefined) {
          formData.append(`backendtechnology[${index}][descriptionstep]`, input.descriptionstep || "");
        }
        if (input && input.imagestep) {
          formData.append(`backendtechnology[${index}][imagestep]`, input.imagestep);
        }
        if (input && input.section) {
          formData.append(`backendtechnology[${index}][section]`, input.section || "backend");
        }
      });

      // Database Technology Steps
      databaseTechnologySteps.forEach((input, index) => {
        if (input && input.titlestep !== undefined) {
          formData.append(`databasetechnology[${index}][titlestep]`, input.titlestep || "");
        }
        if (input && input.descriptionstep !== undefined) {
          formData.append(`databasetechnology[${index}][descriptionstep]`, input.descriptionstep || "");
        }
        if (input && input.imagestep) {
          formData.append(`databasetechnology[${index}][imagestep]`, input.imagestep);
        }
        if (input && input.section) {
          formData.append(`databasetechnology[${index}][section]`, input.section || "database");
        }
      });
      inputsservicestep.forEach((input, index) => {
        if (input && input.titlestep !== undefined) {
          formData.append(`services[${index}][titlestep]`, input.titlestep || "");
        }
        if (input && input.descriptionstep !== undefined) {
          formData.append(`services[${index}][descriptionstep]`, input.descriptionstep || "");
        }
        formData.append(`services[${index}][imagealt]`, input?.imagealt || "");
        if (input && input.imagestep) {
          formData.append(`services[${index}][imagestep]`, input.imagestep);
        }
      });
      inputsindustrystep.forEach((input, index) => {
        if (input && input.titlestep !== undefined) {
          formData.append(`industry[${index}][titlestep]`, input.titlestep || "");
        }
        if (input && input.descriptionstep !== undefined) {
          formData.append(`industry[${index}][descriptionstep]`, input.descriptionstep || "");
        }
        formData.append(`industry[${index}][imagealt]`, input?.imagealt || "");
        if (input && input.imagestep) {
          formData.append(`industry[${index}][imagestep]`, input.imagestep);
        }
      });
      inputswhatweofferstep.forEach((input, index) => {
        if (input && input.titlestep !== undefined) {
          formData.append(`whatweoffer[${index}][titlestep]`, input.titlestep || "");
        }
        if (input && input.descriptionstep !== undefined) {
          formData.append(`whatweoffer[${index}][descriptionstep]`, input.descriptionstep || "");
        }
        if (input && input.linkstep !== undefined) {
          formData.append(`whatweoffer[${index}][linkstep]`, input.linkstep || "");
        }
        formData.append(`whatweoffer[${index}][imagealt]`, input?.imagealt || "");
        if (input && input.imagestep) {
          formData.append(`whatweoffer[${index}][imagestep]`, input.imagestep);
        }
      });

      if (logo) {
        formData.append("logo", logo);
      }
      if (serviceslogo) {
        formData.append("serviceslogo", serviceslogo);
      }
      if (aboutimage) {
        formData.append("aboutimage", aboutimage);
      }
      if (peopleimage) {
        formData.append("peopleimage", peopleimage);
      }
      if (frontendTechnologyImage) {
        formData.append("frontendtechnologyimage", frontendTechnologyImage);
      }
      if (backendTechnologyImage) {
        formData.append("backendtechnologyimage", backendTechnologyImage);
      }
      if (databaseTechnologyImage) {
        formData.append("databasetechnologyimage", databaseTechnologyImage);
      }
      if (customSoftwareImage) {
        formData.append("customsoftwareimage", customSoftwareImage);
      }

      // ScrollSpyNav Sections
      scrollSpyNavSections.forEach((section, index) => {
        if (section.idValue && section.title) {
          formData.append(`scrollSpyNavSections[${index}][id]`, section.idValue);
          formData.append(`scrollSpyNavSections[${index}][title]`, section.title);
        }
      });

      // Custom Software Steps
      customSoftwareSteps.forEach((step, index) => {
        if (step.title || step.description) {
          if (step.iconFile) {
            formData.append(`customSoftwareStepIcon[${index}]`, step.iconFile);
          }
          formData.append(`customSoftwareSteps[${index}][title]`, step.title || "");
          formData.append(`customSoftwareSteps[${index}][description]`, step.description || "");
          formData.append(`customSoftwareSteps[${index}][iconAlt]`, step.iconAlt || "");
        }
      });

      const validFaqs = serviceFaqs.filter(
        (faq) => faq.title.trim() || faq.description.trim()
      );
      validFaqs.forEach((faq, index) => {
        formData.append(`faqs[${index}][title]`, faq.title.trim());
        formData.append(`faqs[${index}][description]`, faq.description.trim());
        formData.append(`faqs[${index}][order]`, String(index));
        formData.append(`faqs[${index}][status]`, "true");
      });

      const data = await addServicesAPI(formData);
      // router.push("/thebusinesshub/my-landing");
      toast.success(data.message);
      if (data.status == "success") {
        setTimeout(() => {
          router.push("/thebusinesshub/services");
        }, 1500);
      }
      // alert(res.message);

      // Reset fields and errors
      setError({});
      // (Reset other fields here if needed)
    } catch (err) {
      setError({ general: err.message || "Something went wrong" });
    } finally {
      setIsSubmitting(false);
    }
  };



  // ── Section navigation items ────────────────────────────────────────────
  const sectionNav = [
    { id: "sec-core",     label: "Core Info" },
    { id: "sec-about",    label: "About" },
    { id: "sec-service",  label: "Service" },
    { id: "sec-frontend", label: "Frontend Tech" },
    { id: "sec-backend",  label: "Backend Tech" },
    { id: "sec-database", label: "Database Tech" },
    { id: "sec-industry", label: "Industry" },
    { id: "sec-scrollspy",label: "ScrollSpy Nav" },
    { id: "sec-servicesection", label: "Service Section" },
    { id: "sec-faq",      label: "FAQs" },
    { id: "sec-custom",   label: "Custom Software" },
    { id: "sec-wwo",      label: "What We Offer" },
    { id: "sec-people",   label: "People" },
    { id: "sec-team",     label: "Team Services" },
    { id: "sec-meta",     label: "Meta" },
  ];

  return (
    <>
      {/* ── Sticky Section Navigator ───────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#2c2e50",
          padding: "8px 16px",
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginBottom: "8px",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(44,46,80,0.18)",
        }}
      >
        {sectionNav.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#e8ecf4",
              borderRadius: "4px",
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: 500,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.12)",
              transition: "background 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(163,177,138,0.35)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          >
            {s.label}
          </a>
        ))}
      </div>

      <form onSubmit={addServices} className="row">

        {/* ── Core Information ───────────────────────────────────── */}
        <SectionCard id="sec-core" title="Core Information" accentColor="#4b4d7c">
          {/* Services Icon */}
          <div className="col-lg-6">
            <div style={{ fontWeight: 600, marginBottom: 6, color: "#484848" }}>Services Icon</div>
            <UploadWithAlt
              altId="logoimagealt"
              altLabel="Services Icon Alt Text"
              altValue={logoimagealt}
              altOnChange={setLogoimagealt}
              altPlaceholder="Describe the services icon"
              hasFile={!!logoPreview}
              onRemove={() => { setLogo(null); setLogoPreview(""); }}
            >
              <div className="wrap-custom-file">
                <input type="file" id="image1" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif" onChange={uploadLogo} />
                <label style={logoPreview ? { backgroundImage: `url(${logoPreview})` } : {}} htmlFor="image1">
                  <span><i className="flaticon-download"></i> Upload Photo</span>
                </label>
              </div>
            </UploadWithAlt>
          </div>

          {/* Services Image */}
          <div className="col-lg-6">
            <div style={{ fontWeight: 600, marginBottom: 6, color: "#484848" }}>Services Image</div>
            <UploadWithAlt
              altId="servicesimagealt"
              altLabel="Services Image Alt Text"
              altValue={servicesimagealt}
              altOnChange={setServicesimagealt}
              altPlaceholder="Describe the services image"
              hasFile={!!servicesLogoPreview}
              onRemove={() => { setServiceslogo(null); setServicesLogoPreview(""); }}
            >
              <div className="wrap-custom-file">
                <input type="file" id="image2" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif" onChange={uploadServicesLogo} />
                <label style={servicesLogoPreview ? { backgroundImage: `url(${servicesLogoPreview})` } : {}} htmlFor="image2">
                  <span><i className="flaticon-download"></i> Upload Photo</span>
                </label>
              </div>
            </UploadWithAlt>
          </div>

          {/* Title / Tag / Slug / Parent */}
          <div className="col-lg-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="servicesTitle">Services Title</label>
              <input type="text" className="form-control" id="servicesTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter services Title" />
              {error.title && <span className="text-danger">{error.title}</span>}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="servicesProject">Services Tag</label>
              <input type="text" className="form-control" id="servicesProject" value={project} onChange={(e) => setProject(e.target.value)} placeholder="Enter services Project" />
              {error.project && <span className="text-danger">{error.project}</span>}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="servicesSlug">Services Slug (SEO URL)</label>
              <input type="text" className="form-control" id="servicesSlug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Enter services slug" />
              {error.slug && <span className="text-danger">{error.slug}</span>}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="parentService">Parent Service</label>
              <select className="form-control" id="parentService" value={parentService} onChange={(e) => setParentService(e.target.value)}>
                <option value="">None (Make Parent Service)</option>
                {parentOptions.map((opt) => (
                  <option key={opt._id} value={opt._id}>
                    {(opt.title ?? '').replace(/<[^>]*>/g, '').trim()}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="my_profile_setting_input ui_kit_select_search form-group">
              <label htmlFor="serviceStatus">Status</label>
              <select
                id="serviceStatus"
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
          <div className="col-lg-12">
            <div className="my_profile_setting_textarea form-group">
              <label htmlFor="servicesDescription">Description</label>
              <HtmlEditor
                id="servicesDescription"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Enter services description"
                height="300px"
              />
              {error.description && <span className="text-danger">{error.description}</span>}
            </div>
          </div>
        </SectionCard>

        {/* ── About Section ──────────────────────────────────────── */}
        <SectionCard id="sec-about" title="About Section" accentColor="#3c3e66">
          <div className="col-lg-6">
            <div style={{ fontWeight: 600, marginBottom: 6, color: "#484848" }}>About Image</div>
            <UploadWithAlt
              altId="aboutimagealt"
              altLabel="About Image Alt Text"
              altValue={aboutimagealt}
              altOnChange={setAboutimagealt}
              altPlaceholder="Describe the about section image"
              hasFile={!!aboutImagePreview}
              onRemove={() => { setAboutImage(null); setAboutImagePreview(""); }}
            >
              <div className="wrap-custom-file">
                <input type="file" id="aboutimage" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif" onChange={uploadAboutImage} />
                <label style={aboutImagePreview ? { backgroundImage: `url(${aboutImagePreview})` } : {}} htmlFor="aboutimage">
                  <span><i className="flaticon-download"></i> Upload About image</span>
                </label>
              </div>
            </UploadWithAlt>
          </div>
          <div className="col-lg-6">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="aboutTitle">About Title</label>
              <input type="text" className="form-control" id="aboutTitle" value={abouttitle} onChange={(e) => setAboutTitle(e.target.value)} placeholder="Enter About Title" />
              {error.abouttitle && <span className="text-danger">{error.abouttitle}</span>}
            </div>
            <div className="my_profile_setting_input form-group">
              <label htmlFor="aboutTag">About Tag</label>
              <input type="text" className="form-control" id="aboutTag" value={abouttag} onChange={(e) => setAboutTag(e.target.value)} placeholder="Enter About Tag (e.g., APPLICATION SOLUTIONS TO GROW BUSINESS QUICKLY)" />
              {error.abouttag && <span className="text-danger">{error.abouttag}</span>}
            </div>
            <div className="my_profile_setting_textarea form-group">
              <label htmlFor="aboutDescription">About Description</label>
              <HtmlEditor
                id="aboutdescription"
                value={aboutdescription}
                onChange={(value) => {
                  setAboutDescription(value);
                  if (error?.aboutdescription) {
                    setError((prev) => ({ ...(prev || {}), aboutdescription: "" }));
                  }
                }}
                placeholder="Enter about description"
                height="300px"
              />
              {error.aboutdescription && <span className="text-danger">{error.aboutdescription}</span>}
            </div>
            <div className="my_profile_setting_input form-group">
              <label htmlFor="featuredService">Featured Service</label>
              <input
                type="checkbox"
                className="form-check-input"
                id="featuredService"
                name="featuredService"
                checked={featuredService === true}
                onChange={(e) => setFeaturedService(e.target.checked)}
              />
            </div>
          </div>
        </SectionCard>

        {/* ── Service Section ────────────────────────────────────── */}
        <SectionCard
          id="sec-service"
          title="Service"
          accentColor="#2c2e50"
          toggleId="serviceshow"
          toggleName="serviceshow"
          enabled={serviceshow}
          onToggle={(e) => setServiceshow(e.target.checked)}
          badge={inputsservicestep.length}
        >
          {serviceshow && (
            <>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="serviceTitle">Service Title</label>
                  <input type="text" className="form-control" id="serviceTitle" value={servicetitle} onChange={(e) => setServiceTitle(e.target.value)} placeholder="Enter Service Title" />
                  {error.servicetitle && <span className="text-danger">{error.servicetitle}</span>}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_textarea form-group">
                  <label htmlFor="serviceDescription">Service Description</label>
                  <textarea id="serviceDescription" className="form-control" rows="7" value={servicedescription} onChange={(e) => setServiceDescription(e.target.value)} placeholder="Enter service description"></textarea>
                  {error.servicedescription && <span className="text-danger">{error.servicedescription}</span>}
                </div>
              </div>
              <div className="col-lg-12">
                <button className="btn admore_btn mb30" type="button" onClick={handleAddInputservicestep}>Add More</button>
              </div>
            </>
          )}
          {inputsservicestep.map((input, index) => (
            <div className="col-12" key={input.id}>
              <StepCard index={index} label="Service" onRemove={() => handleRemoveInputservicestep(input.id)}>
                <input type="hidden" name={`serviceid-${index}`} value={input._id} />
                <div className="col-xl-4">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`serviceTitle-${index}`}>Title</label>
                    <input type="text" className="form-control" id={`serviceTitle-${index}`} value={input.titlestep}
                      onChange={(e) => handleInputChangeservicestep(index, 'titlestep', e.target.value)} />
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`serviceDescription-${index}`}>Description</label>
                    <textarea className="form-control" id={`serviceDescription-${index}`} rows="4" value={input.descriptionstep}
                      onChange={(e) => handleInputChangeservicestep(index, 'descriptionstep', e.target.value)}></textarea>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="my_profile_setting_input form-group">
                    <div style={{ fontWeight: 600, marginBottom: 4, color: "#484848" }}>Service Image</div>
                    <UploadWithAlt
                      stacked
                      altId={`serviceimagealt-${index}`}
                      altLabel="Service Image Alt Text"
                      altValue={input.imagealt || ""}
                      altOnChange={(value) => handleInputChangeservicestep(index, 'imagealt', value)}
                      altPlaceholder="Describe this service image"
                      note=""
                      hasFile={!!input.imagepreview}
                      onRemove={() => removeServiceStepImage(index)}
                    >
                      <div className="wrap-custom-file height-150">
                        <input type="file" id={`serviceimage-${index}`} accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif"
                          onChange={(e) => uploadServiceImage(index, e.target.files[0])} />
                        <label style={input.imagepreview ? { backgroundImage: `url(${input.imagepreview})` } : {}} htmlFor={`serviceimage-${index}`}>
                          <span><i className="flaticon-download"></i> Upload service image</span>
                        </label>
                      </div>
                    </UploadWithAlt>
                  </div>
                </div>
              </StepCard>
            </div>
          ))}
        </SectionCard>






        {/* ── Frontend Technology ────────────────────────────────── */}
        <SectionCard
          id="sec-frontend"
          title="Frontend Technology"
          accentColor="#666894"
          toggleId="frontendTechnologyShow"
          toggleName="frontendTechnologyShow"
          enabled={frontendTechnologyShow}
          onToggle={(e) => setFrontendTechnologyShow(e.target.checked)}
          badge={frontendTechnologySteps.length}
        >
          {frontendTechnologyShow && (
            <>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="frontendTechnologyTitle">Frontend Technology Title</label>
                  <input type="text" className="form-control" id="frontendTechnologyTitle" value={frontendTechnologyTitle}
                    onChange={(e) => setFrontendTechnologyTitle(e.target.value)} placeholder="Enter Frontend Technology Title" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_textarea form-group">
                  <label htmlFor="frontendTechnologyDescription">Frontend Technology Description</label>
                  <textarea id="frontendTechnologyDescription" className="form-control" rows="7" value={frontendTechnologyDescription}
                    onChange={(e) => setFrontendTechnologyDescription(e.target.value)} placeholder="Enter frontend technology description" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="frontendTechnologySectionImage">Frontend Technology Section Image</label>
                  <UploadWithAlt
                    altId="frontendtechnologyimagealt"
                    altLabel="Frontend Technology Image Alt Text"
                    altValue={frontendtechnologyimagealt}
                    altOnChange={setFrontendtechnologyimagealt}
                    altPlaceholder="Describe the frontend technology image"
                    hasFile={!!frontendTechnologyImagePreview}
                    onRemove={() => { setFrontendTechnologyImage(null); setFrontendTechnologyImagePreview(""); }}
                  >
                    <div className="wrap-custom-file">
                      <input type="file" id="frontendTechnologySectionImage" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif" onChange={uploadFrontendTechnologySectionImage} />
                      <label style={frontendTechnologyImagePreview ? { backgroundImage: `url(${frontendTechnologyImagePreview})` } : {}} htmlFor="frontendTechnologySectionImage">
                        <span><i className="flaticon-download"></i> Upload Frontend Technology Image</span>
                      </label>
                    </div>
                  </UploadWithAlt>
                </div>
              </div>
              <div className="col-lg-12">
                <button className="btn admore_btn mb30" type="button" onClick={handleAddFrontendStep}>Add More</button>
              </div>
              {frontendTechnologySteps.map((input, index) => (
                <div className="col-12" key={input.id}>
                  <StepCard index={index} label="Tech Item" onRemove={() => handleRemoveFrontendStep(input.id)}>
                    <div className="col-xl-4">
                      <div className="my_profile_setting_input form-group">
                        <label htmlFor={`frontendTechnologyTitle-${index}`}>Title</label>
                        <input type="text" className="form-control" id={`frontendTechnologyTitle-${index}`} value={input.titlestep}
                          onChange={(e) => handleInputChangeFrontend(index, "titlestep", e.target.value)} />
                      </div>
                    </div>
                    <div className="col-xl-8">
                      <div className="my_profile_setting_input form-group">
                        <label htmlFor={`frontendTechnologyDescription-${index}`}>Description</label>
                        <textarea className="form-control" id={`frontendTechnologyDescription-${index}`} rows="4" value={input.descriptionstep}
                          onChange={(e) => handleInputChangeFrontend(index, "descriptionstep", e.target.value)} />
                      </div>
                    </div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* ── Backend Technology ─────────────────────────────────── */}
        <SectionCard
          id="sec-backend"
          title="Backend Technology"
          accentColor="#666894"
          toggleId="backendTechnologyShow"
          toggleName="backendTechnologyShow"
          enabled={backendTechnologyShow}
          onToggle={(e) => setBackendTechnologyShow(e.target.checked)}
          badge={backendTechnologySteps.length}
        >
          {backendTechnologyShow && (
            <>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="backendTechnologyTitle">Backend Technology Title</label>
                  <input type="text" className="form-control" id="backendTechnologyTitle" value={backendTechnologyTitle}
                    onChange={(e) => setBackendTechnologyTitle(e.target.value)} placeholder="Enter Backend Technology Title" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_textarea form-group">
                  <label htmlFor="backendTechnologyDescription">Backend Technology Description</label>
                  <textarea id="backendTechnologyDescription" className="form-control" rows="7" value={backendTechnologyDescription}
                    onChange={(e) => setBackendTechnologyDescription(e.target.value)} placeholder="Enter backend technology description" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="backendTechnologySectionImage">Backend Technology Section Image</label>
                  <UploadWithAlt
                    altId="backendtechnologyimagealt"
                    altLabel="Backend Technology Image Alt Text"
                    altValue={backendtechnologyimagealt}
                    altOnChange={setBackendtechnologyimagealt}
                    altPlaceholder="Describe the backend technology image"
                    hasFile={!!backendTechnologyImagePreview}
                    onRemove={() => { setBackendTechnologyImage(null); setBackendTechnologyImagePreview(""); }}
                  >
                    <div className="wrap-custom-file">
                      <input type="file" id="backendTechnologySectionImage" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif" onChange={uploadBackendTechnologySectionImage} />
                      <label style={backendTechnologyImagePreview ? { backgroundImage: `url(${backendTechnologyImagePreview})` } : {}} htmlFor="backendTechnologySectionImage">
                        <span><i className="flaticon-download"></i> Upload Backend Technology Image</span>
                      </label>
                    </div>
                  </UploadWithAlt>
                </div>
              </div>
              <div className="col-lg-12">
                <button className="btn admore_btn mb30" type="button" onClick={handleAddBackendStep}>Add More</button>
              </div>
              {backendTechnologySteps.map((input, index) => (
                <div className="col-12" key={input.id}>
                  <StepCard index={index} label="Tech Item" onRemove={() => handleRemoveBackendStep(input.id)}>
                    <div className="col-xl-4">
                      <div className="my_profile_setting_input form-group">
                        <label htmlFor={`backendTechnologyTitle-${index}`}>Title</label>
                        <input type="text" className="form-control" id={`backendTechnologyTitle-${index}`} value={input.titlestep}
                          onChange={(e) => handleInputChangeBackend(index, "titlestep", e.target.value)} />
                      </div>
                    </div>
                    <div className="col-xl-8">
                      <div className="my_profile_setting_input form-group">
                        <label htmlFor={`backendTechnologyDescription-${index}`}>Description</label>
                        <textarea className="form-control" id={`backendTechnologyDescription-${index}`} rows="4" value={input.descriptionstep}
                          onChange={(e) => handleInputChangeBackend(index, "descriptionstep", e.target.value)} />
                      </div>
                    </div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* ── Database Technology ────────────────────────────────── */}
        <SectionCard
          id="sec-database"
          title="Database Technology"
          accentColor="#666894"
          toggleId="databaseTechnologyShow"
          toggleName="databaseTechnologyShow"
          enabled={databaseTechnologyShow}
          onToggle={(e) => setDatabaseTechnologyShow(e.target.checked)}
          badge={databaseTechnologySteps.length}
        >
          {databaseTechnologyShow && (
            <>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="databaseTechnologyTitle">Database Technology Title</label>
                  <input type="text" className="form-control" id="databaseTechnologyTitle" value={databaseTechnologyTitle}
                    onChange={(e) => setDatabaseTechnologyTitle(e.target.value)} placeholder="Enter Database Technology Title" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_textarea form-group">
                  <label htmlFor="databaseTechnologyDescription">Database Technology Description</label>
                  <textarea id="databaseTechnologyDescription" className="form-control" rows="7" value={databaseTechnologyDescription}
                    onChange={(e) => setDatabaseTechnologyDescription(e.target.value)} placeholder="Enter database technology description" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="databaseTechnologySectionImage">Database Technology Section Image</label>
                  <UploadWithAlt
                    altId="databasetechnologyimagealt"
                    altLabel="Database Technology Image Alt Text"
                    altValue={databasetechnologyimagealt}
                    altOnChange={setDatabasetechnologyimagealt}
                    altPlaceholder="Describe the database technology image"
                    hasFile={!!databaseTechnologyImagePreview}
                    onRemove={() => { setDatabaseTechnologyImage(null); setDatabaseTechnologyImagePreview(""); }}
                  >
                    <div className="wrap-custom-file">
                      <input type="file" id="databaseTechnologySectionImage" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif" onChange={uploadDatabaseTechnologySectionImage} />
                      <label style={databaseTechnologyImagePreview ? { backgroundImage: `url(${databaseTechnologyImagePreview})` } : {}} htmlFor="databaseTechnologySectionImage">
                        <span><i className="flaticon-download"></i> Upload Database Technology Image</span>
                      </label>
                    </div>
                  </UploadWithAlt>
                </div>
              </div>
              <div className="col-lg-12">
                <button className="btn admore_btn mb30" type="button" onClick={handleAddDatabaseStep}>Add More</button>
              </div>
              {databaseTechnologySteps.map((input, index) => (
                <div className="col-12" key={input.id}>
                  <StepCard index={index} label="Tech Item" onRemove={() => handleRemoveDatabaseStep(input.id)}>
                    <div className="col-xl-4">
                      <div className="my_profile_setting_input form-group">
                        <label htmlFor={`databaseTechnologyTitle-${index}`}>Title</label>
                        <input type="text" className="form-control" id={`databaseTechnologyTitle-${index}`} value={input.titlestep}
                          onChange={(e) => handleInputChangeDatabase(index, "titlestep", e.target.value)} />
                      </div>
                    </div>
                    <div className="col-xl-8">
                      <div className="my_profile_setting_input form-group">
                        <label htmlFor={`databaseTechnologyDescription-${index}`}>Description</label>
                        <textarea className="form-control" id={`databaseTechnologyDescription-${index}`} rows="4" value={input.descriptionstep}
                          onChange={(e) => handleInputChangeDatabase(index, "descriptionstep", e.target.value)} />
                      </div>
                    </div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>





        {/* ── Industry ───────────────────────────────────────────── */}
        <SectionCard
          id="sec-industry"
          title="Industry"
          accentColor="#4b4d7c"
          toggleId="industryhow"
          toggleName="industryhow"
          enabled={industryhow}
          onToggle={(e) => setIndustryshow(e.target.checked)}
          badge={inputsindustrystep.length}
        >
          {industryhow && (
            <>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="industryTitle">Industry Title</label>
                  <input type="text" className="form-control" id="industryTitle" value={industrytitle} onChange={(e) => setIndustryTitle(e.target.value)} placeholder="Enter Industry Title" />
                  {error.industrytitle && <span className="text-danger">{error.industrytitle}</span>}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_textarea form-group">
                  <label htmlFor="industryDescription">Industry Description</label>
                  <textarea id="industryDescription" className="form-control" rows="7" value={industrydescription} onChange={(e) => setIndustryDescription(e.target.value)} placeholder="Enter industry description"></textarea>
                  {error.industrydescription && <span className="text-danger">{error.industrydescription}</span>}
                </div>
              </div>
              <div className="col-lg-12">
                <button className="btn admore_btn mb30" type="button" onClick={handleAddInputindustrystep}>Add More</button>
              </div>
            </>
          )}
          {inputsindustrystep.map((input, index) => (
            <div className="col-12" key={input.id}>
              <StepCard index={index} label="Industry" onRemove={() => handleRemoveInputindustrystep(input.id)}>
                <div className="col-xl-4">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`industryTitle-${index}`}>Title</label>
                    <input type="text" className="form-control" id={`industryTitle-${index}`} value={input.titlestep}
                      onChange={(e) => handleInputChangeindustrystep(index, 'titlestep', e.target.value)} />
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`industryDescription-${index}`}>Description</label>
                    <textarea className="form-control" id={`industryDescription-${index}`} rows="4" cols="40" value={input.descriptionstep}
                      onChange={(e) => handleInputChangeindustrystep(index, 'descriptionstep', e.target.value)}></textarea>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="my_profile_setting_input form-group">
                    <div style={{ fontWeight: 600, marginBottom: 4, color: "#484848" }}>Industry Image</div>
                    <UploadWithAlt
                      stacked
                      altId={`industryimagealt-${index}`}
                      altLabel="Industry Image Alt Text"
                      altValue={input.imagealt || ""}
                      altOnChange={(value) => handleInputChangeindustrystep(index, 'imagealt', value)}
                      altPlaceholder="Describe this industry image"
                      note=""
                      hasFile={!!input.imagepreview}
                      onRemove={() => removeIndustryStepImage(index)}
                    >
                      <div className="wrap-custom-file height-150">
                        <input type="file" id={`industryimage-${index}`} accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif"
                          onChange={(e) => uploadIndustryImage(index, e.target.files[0])} />
                        <label style={input.imagepreview ? { backgroundImage: `url(${input.imagepreview})` } : {}} htmlFor={`industryimage-${index}`}>
                          <span><i className="flaticon-download"></i> Upload industry image</span>
                        </label>
                      </div>
                    </UploadWithAlt>
                  </div>
                </div>
              </StepCard>
            </div>
          ))}
        </SectionCard>

        {/* ── ScrollSpy Navigation ───────────────────────────────── */}
        <SectionCard
          id="sec-scrollspy"
          title="ScrollSpy Navigation"
          accentColor="#666894"
          toggleId="scrollSpyNavShow"
          toggleName="scrollSpyNavShow"
          enabled={scrollSpyNavShow}
          onToggle={(e) => setScrollSpyNavShow(e.target.checked)}
          badge={scrollSpyNavSections.length}
        >
          {scrollSpyNavShow && (
            <>
              <div className="col-lg-12">
                <button className="btn admore_btn mb30" type="button" onClick={handleAddScrollSpySection}>Add Section</button>
              </div>
              {scrollSpyNavSections.map((section, index) => (
                <div className="col-12" key={section.id}>
                  <StepCard index={index} label="Nav Item" onRemove={() => handleRemoveScrollSpySection(section.id)}>
                    <div className="col-xl-6">
                      <div className="my_profile_setting_input form-group">
                        <label htmlFor={`scrollSpySectionId-${index}`}>Section ID</label>
                        <input type="text" className="form-control" id={`scrollSpySectionId-${index}`} value={section.idValue}
                          onChange={(e) => handleInputChangeScrollSpy(index, 'idValue', e.target.value)} placeholder="e.g., csd, es, crms" />
                      </div>
                    </div>
                    <div className="col-xl-6">
                      <div className="my_profile_setting_input form-group">
                        <label htmlFor={`scrollSpySectionTitle-${index}`}>Section Title</label>
                        <input type="text" className="form-control" id={`scrollSpySectionTitle-${index}`} value={section.title}
                          onChange={(e) => handleInputChangeScrollSpy(index, 'title', e.target.value)} placeholder="e.g., Custom Software Development" />
                      </div>
                    </div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* ── Service Section (marketing block) ─────────────────── */}
        <SectionCard
          id="sec-servicesection"
          title="Service Section"
          accentColor="#3c3e66"
          toggleId="serviceSectionShow"
          toggleName="serviceSectionShow"
          enabled={serviceSectionShow}
          onToggle={(e) => setServiceSectionShow(e.target.checked)}
        >
          {serviceSectionShow && (
            <>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="serviceSectionTitle">Title</label>
                  <input type="text" className="form-control" id="serviceSectionTitle" value={serviceSectionTitle}
                    onChange={(e) => setServiceSectionTitle(e.target.value)} placeholder="Enter section title" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_textarea form-group">
                  <label htmlFor="serviceSectionDescription">Description</label>
                  <HtmlEditor value={serviceSectionDescription} onChange={(value) => setServiceSectionDescription(value)} placeholder="Enter section description" />
                </div>
              </div>
            </>
          )}
        </SectionCard>

        <SectionCard id="sec-faq" title="FAQs" accentColor="#4b4d7c" badge={serviceFaqs.length}>
          <div className="col-lg-12">
            <button className="btn admore_btn mb30" type="button" onClick={addFaqItem}>
              Add FAQ
            </button>
          </div>
          {serviceFaqs.map((faq, index) => (
            <div
              className="col-12"
              key={faq.id}
              draggable
              onDragStart={() => handleFaqDragStart(faq.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleFaqDrop(faq.id)}
            >
              <StepCard index={index} label="FAQ" onRemove={() => removeFaqItem(faq.id)}>
                <div className="col-xl-1 d-flex align-items-center justify-content-center">
                  <span style={{ cursor: "grab", fontSize: "20px", lineHeight: 1 }}>⋮⋮</span>
                </div>
                <div className="col-xl-5">
                  <div className="my_profile_setting_input form-group">
                    <label>Question</label>
                    <input
                      type="text"
                      className="form-control"
                      value={faq.title}
                      onChange={(e) => updateFaqItem(faq.id, "title", e.target.value)}
                      placeholder="Enter FAQ question"
                    />
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="my_profile_setting_textarea form-group">
                    <label>Answer</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={faq.description}
                      onChange={(e) => updateFaqItem(faq.id, "description", e.target.value)}
                      placeholder="Enter FAQ answer"
                    />
                  </div>
                </div>
              </StepCard>
            </div>
          ))}
        </SectionCard>

        {/* ── Custom Software Section ────────────────────────────── */}
        <SectionCard
          id="sec-custom"
          title="Custom Software Section"
          accentColor="#2c2e50"
          toggleId="customSoftwareShow"
          toggleName="customSoftwareShow"
          enabled={customSoftwareShow}
          onToggle={(e) => setCustomSoftwareShow(e.target.checked)}
          badge={customSoftwareSteps.length}
        >
          {customSoftwareShow && (
            <>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="customSoftwareTitle">Title</label>
                  <input type="text" className="form-control" id="customSoftwareTitle" value={customSoftwareTitle}
                    onChange={(e) => setCustomSoftwareTitle(e.target.value)} placeholder="e.g., Custom Software Development" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_textarea form-group">
                  <label htmlFor="customSoftwareDescription">Description</label>
                  <textarea id="customSoftwareDescription" className="form-control" rows="4" value={customSoftwareDescription}
                    onChange={(e) => setCustomSoftwareDescription(e.target.value)} placeholder="Enter description" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="customSoftwareImage">Image</label>
                  <UploadWithAlt
                    altId="customsoftwareimagealt"
                    altLabel="Custom Software Image Alt Text"
                    altValue={customsoftwareimagealt}
                    altOnChange={setCustomsoftwareimagealt}
                    altPlaceholder="Describe the custom software image"
                    note=""
                    hasFile={!!customSoftwareImagePreview}
                    onRemove={() => { setCustomSoftwareImage(null); setCustomSoftwareImagePreview(""); }}
                  >
                    <div className="wrap-custom-file height-150">
                      <input type="file" id="customSoftwareImage" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif" onChange={uploadCustomSoftwareImage} />
                      <label style={customSoftwareImagePreview ? { backgroundImage: `url(${customSoftwareImagePreview})` } : {}} htmlFor="customSoftwareImage">
                        <span><i className="flaticon-download"></i> Upload Image</span>
                      </label>
                    </div>
                  </UploadWithAlt>
                </div>
              </div>
              <div className="col-lg-12">
                <button className="btn admore_btn mb30" type="button" onClick={handleAddCustomSoftwareStep}>Add Step</button>
              </div>
              {customSoftwareSteps.map((step, index) => (
                <div className="col-12" key={step.id}>
                  <StepCard index={index} label="Software Step" onRemove={() => handleRemoveCustomSoftwareStep(step.id)}>
                    <div className="col-xl-4">
                      <div className="my_profile_setting_input form-group">
                        <label htmlFor={`customSoftwareStepIcon-${index}`}>Icon Image</label>
                        <UploadWithAlt
                          stacked
                          altId={`customSoftwareStepIconAlt-${index}`}
                          altLabel="Icon Alt Text"
                          altValue={step.iconAlt || ""}
                          altOnChange={(value) => handleInputChangeCustomSoftwareStep(index, 'iconAlt', value)}
                          altPlaceholder="Describe this icon"
                          note=""
                          hasFile={!!step.iconPreview}
                          onRemove={() => uploadCustomSoftwareStepIcon(index, null)}
                        >
                          <div className="wrap-custom-file height-150">
                            <input type="file" id={`customSoftwareStepIcon-${index}`} accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif"
                              onChange={(e) => uploadCustomSoftwareStepIcon(index, e.target.files[0])} />
                            <label style={step.iconPreview ? { backgroundImage: `url(${step.iconPreview})` } : {}} htmlFor={`customSoftwareStepIcon-${index}`}>
                              <span><i className="flaticon-download"></i> Upload Icon</span>
                            </label>
                          </div>
                        </UploadWithAlt>
                      </div>
                    </div>
                    <div className="col-xl-4">
                      <div className="my_profile_setting_input form-group">
                        <label htmlFor={`customSoftwareStepTitle-${index}`}>Title</label>
                        <input type="text" className="form-control" id={`customSoftwareStepTitle-${index}`} value={step.title}
                          onChange={(e) => handleInputChangeCustomSoftwareStep(index, 'title', e.target.value)} placeholder="Step 01" />
                      </div>
                    </div>
                    <div className="col-xl-4">
                      <div className="my_profile_setting_textarea form-group">
                        <label htmlFor={`customSoftwareStepDescription-${index}`}>Description</label>
                        <textarea className="form-control" id={`customSoftwareStepDescription-${index}`} rows="3" value={step.description}
                          onChange={(e) => handleInputChangeCustomSoftwareStep(index, 'description', e.target.value)} placeholder="Enter step description" />
                      </div>
                    </div>
                  </StepCard>
                </div>
              ))}
            </>
          )}
        </SectionCard>

        {/* ── What We Offer ──────────────────────────────────────── */}
        <SectionCard
          id="sec-wwo"
          title="What We Offer"
          accentColor="#3c3e66"
          toggleId="whatweofferhow"
          toggleName="whatweofferhow"
          enabled={whatweofferhow}
          onToggle={(e) => setWhatweofferhow(e.target.checked)}
          badge={inputswhatweofferstep.length}
        >
          {whatweofferhow && (
            <>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="whatweofferTitle">What We Offer Title</label>
                  <input type="text" className="form-control" id="whatweofferTitle" value={whatweoffertitle} onChange={(e) => setWhatweofferTitle(e.target.value)} placeholder="Enter What We Offer Title" />
                  {error.whatweoffertitle && <span className="text-danger">{error.whatweoffertitle}</span>}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_textarea form-group">
                  <label htmlFor="whatweofferDescription">What We Offer Description</label>
                  <textarea id="whatweofferDescription" className="form-control" rows="7" value={whatweofferdescription} onChange={(e) => setWhatweofferDescription(e.target.value)} placeholder="Enter what we offer description"></textarea>
                  {error.whatweofferdescription && <span className="text-danger">{error.whatweofferdescription}</span>}
                </div>
              </div>
              <div className="col-lg-12">
                <button className="btn admore_btn mb30" type="button" onClick={handleAddInputwhatweofferstep}>Add More</button>
              </div>
            </>
          )}
          {inputswhatweofferstep.map((input, index) => (
            <div className="col-12" key={input.id}>
              <StepCard index={index} label="Offer" onRemove={() => handleRemoveInputwhatweofferstep(input.id)}>
                <input type="hidden" name={`serviceid-${index}`} value={input._id} />
                <div className="col-xl-3">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`whatweofferTitle-${index}`}>Title</label>
                    <input type="text" className="form-control" id={`whatweofferTitle-${index}`} value={input.titlestep}
                      onChange={(e) => handleInputChangewhatweofferstep(index, 'titlestep', e.target.value)} />
                  </div>
                </div>
                <div className="col-xl-3">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`whatweofferLink-${index}`}>Link</label>
                    <input type="text" className="form-control" id={`whatweofferLink-${index}`} value={input.linkstep}
                      onChange={(e) => handleInputChangewhatweofferstep(index, 'linkstep', e.target.value)} placeholder="Enter link" />
                  </div>
                </div>
                <div className="col-xl-3">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`whatweofferDescription-${index}`}>Description</label>
                    <textarea className="form-control" id={`whatweofferDescription-${index}`} rows="4" value={input.descriptionstep}
                      onChange={(e) => handleInputChangewhatweofferstep(index, 'descriptionstep', e.target.value)}></textarea>
                  </div>
                </div>
                <div className="col-xl-3">
                  <div className="my_profile_setting_input form-group">
                    <div style={{ fontWeight: 600, marginBottom: 4, color: "#484848" }}>Image</div>
                    <UploadWithAlt
                      stacked
                      altId={`whatweofferimagealt-${index}`}
                      altLabel="Image Alt Text"
                      altValue={input.imagealt || ""}
                      altOnChange={(value) => handleInputChangewhatweofferstep(index, 'imagealt', value)}
                      altPlaceholder="Describe this card image"
                      note=""
                      hasFile={!!input.imagepreview}
                      onRemove={() => removeWhatWeOfferStepImage(index)}
                    >
                      <div className="wrap-custom-file height-150">
                        <input type="file" id={`whatweofferimage-${index}`} accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif"
                          onChange={(e) => uploadWhatweofferImage(index, e.target.files[0])} />
                        <label style={input.imagepreview ? { backgroundImage: `url(${input.imagepreview})` } : {}} htmlFor={`whatweofferimage-${index}`}>
                          <span><i className="flaticon-download"></i> Upload image</span>
                        </label>
                      </div>
                    </UploadWithAlt>
                  </div>
                </div>
              </StepCard>
            </div>
          ))}
        </SectionCard>

        {/* ── People Section ─────────────────────────────────────── */}
        <SectionCard
          id="sec-people"
          title="People Section"
          accentColor="#2c2e50"
          toggleId="peoplehow"
          toggleName="peoplehow"
          enabled={peoplehow}
          onToggle={(e) => setPeoplehow(e.target.checked)}
        >
          {peoplehow && (
            <>
              <div className="col-lg-6">
                <div style={{ fontWeight: 600, marginBottom: 6, color: "#484848" }}>People Image</div>
                <UploadWithAlt
                  altId="peopleimagealt"
                  altLabel="People Image Alt Text"
                  altValue={peopleimagealt}
                  altOnChange={setPeopleimagealt}
                  altPlaceholder="Describe the people section image"
                  hasFile={!!peopleImagePreview}
                  onRemove={() => { setPeopleImage(null); setPeopleImagePreview(""); }}
                >
                  <div className="wrap-custom-file">
                    <input type="file" id="peopleimage" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif" onChange={uploadPeopleImage} />
                    <label style={peopleImagePreview ? { backgroundImage: `url(${peopleImagePreview})` } : {}} htmlFor="peopleimage">
                      <span><i className="flaticon-download"></i> Upload People image</span>
                    </label>
                  </div>
                </UploadWithAlt>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="peopleTitle">People Title</label>
                  <input type="text" className="form-control" id="peopleTitle" value={peopletitle} onChange={(e) => setPeopleTitle(e.target.value)} placeholder="Enter People Title" />
                  {error.abouttitle && <span className="text-danger">{error.abouttitle}</span>}
                </div>
                <div className="my_profile_setting_textarea form-group">
                  <label htmlFor="peopleDescription">People Description</label>
                  <HtmlEditor
                    id="peopleDescription"
                    value={peopledescription}
                    onChange={setPeopleDescription}
                    placeholder="Enter people description"
                    height="260px"
                  />
                  {error.peopledescription && <span className="text-danger">{error.peopledescription}</span>}
                </div>
              </div>
            </>
          )}
        </SectionCard>

        {/* ── Team Services Section ──────────────────────────────── */}
        <SectionCard
          id="sec-team"
          title="Team Services Section"
          accentColor="#4b4d7c"
          toggleId="teamServiceshow"
          toggleName="teamServiceshow"
          enabled={teamServiceshow}
          onToggle={(e) => setTeamServiceshow(e.target.checked)}
        >
          {teamServiceshow && (
            <>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="teamServicesTitle">Team Services Title</label>
                  <input type="text" className="form-control" id="teamServicesTitle" value={teamServicesTitle} onChange={(e) => setTeamServicesTitle(e.target.value)} placeholder="Enter Team Services Title" />
                  {error.teamServicesTitle && <span className="text-danger">{error.teamServicesTitle}</span>}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="teamServicesSubTitle">Team Services Sub Title</label>
                  <input type="text" className="form-control" id="teamServicesSubTitle" value={teamServicesSubTitle} onChange={(e) => setTeamServicesSubTitle(e.target.value)} placeholder="Enter Team Services Sub Title" />
                  {error.teamServicesSubTitle && <span className="text-danger">{error.teamServicesSubTitle}</span>}
                </div>
              </div>
              <div className="col-lg-12">
                <div className="my_profile_setting_textarea form-group">
                  <label htmlFor="teamServicesDescription">Team Services Description</label>
                  <textarea id="teamServicesDescription" className="form-control" rows="7" value={teamServicesDescription} onChange={(e) => setTeamServicesDescription(e.target.value)} placeholder="Enter team services description"></textarea>
                  {error.teamServicesDescription && <span className="text-danger">{error.teamServicesDescription}</span>}
                </div>
              </div>
            </>
          )}
        </SectionCard>

        {/* ── Meta Information ───────────────────────────────────── */}
        <SectionCard id="sec-meta" title="Meta Information" accentColor="#A3B18A">
          <div className="col-lg-12">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="servicesMetatitle">Meta Title</label>
              <input type="text" className="form-control" id="servicesMetatitle" value={metatitle} onChange={(e) => setMetatitle(e.target.value)} />
              {error.metatitle && <span className="text-danger">{error.metatitle}</span>}
            </div>
          </div>
          <div className="col-lg-12">
            <div className="my_profile_setting_textarea form-group">
              <label htmlFor="servicesMetaDescription">Meta Description</label>
              <textarea id="servicesMetaDescription" className="form-control" rows="7" value={metadescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Enter meta description"></textarea>
              {error.metadescription && <span className="text-danger">{error.metadescription}</span>}
            </div>
          </div>
        </SectionCard>

        {/* ── Sticky Submit Bar ──────────────────────────────────── */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 99,
            background: "#fff",
            borderTop: "1px solid #e4e4f0",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 -2px 10px rgba(75,77,124,0.1)",
            marginTop: "8px",
            width: "100%",
          }}
        >
          <button className="btn btn1" type="button" onClick={() => window.location.href = '/thebusinesshub/dashboard'}>
            ← Back
          </button>
          <button type="submit" className="btn btn2" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </div>

      </form>
    </>
  );
};

export default CreateList;

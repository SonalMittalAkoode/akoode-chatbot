"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getServicesById, updateServicesAPI } from "@/api/services";
import { deleteServiceStepAPI } from "@/api/servicesstep";
import HtmlEditor from "@/components/HtmlEditor";
import ImageAltInput from "@/components/admin/ImageAltInput";
import UploadWithAlt from "@/components/admin/UploadWithAlt";
import { toast } from "react-toastify";
import SectionCard from "../../_components/SectionCard";
import StepCard from "../../_components/StepCard";
import { fileNameToAlt } from "@/utils/imageAlt";
import { getFaqByServiceIdAdmin } from "@/api/faq";

const buildAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  return `${base}${path}`;
};

const normalizeBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  if (typeof value === "number") return value === 1;
  return fallback;
};

const createEmptyStep = (section) => ({
  id: `${section}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  existingId: null,
  titlestep: "",
  descriptionstep: "",
  tagstep: "",
  linkstep: "",
  imagealt: "",
  imageFile: null,
  preview: "",
});

const createEmptyFaq = () => ({
  id: `faq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  existingId: null,
  title: "",
  description: "",
});

const faqIdentityKey = (faq) =>
  `${String(faq?.title || "").trim().toLowerCase()}::${String(
    faq?.description || ""
  )
    .trim()
    .toLowerCase()}`;

const mapExistingSteps = (steps, section) =>
  Array.isArray(steps)
    ? steps.map((step) => {
      const rawImage = step?.imagestepurl || step?.imagestep || step?.imageurl || step?.image;
      return {
        id: `${section}-${step?._id ?? Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        existingId: step?._id ?? null,
        titlestep: step?.titlestep ?? step?.title ?? "",
        descriptionstep: step?.descriptionstep ?? step?.description ?? "",
        tagstep: step?.tagstep ?? step?.tag ?? "",
        linkstep: step?.linkstep ?? step?.link ?? "",
        imagealt: step?.imagealt ?? "",
        imageFile: null,
        preview: buildAssetUrl(rawImage),
      };
    })
    : [];

const CreateList = () => {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id;
  const serviceId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoimagealt, setLogoimagealt] = useState("");

  const [serviceslogo, setServiceslogo] = useState(null);
  const [servicesLogoPreview, setServicesLogoPreview] = useState("");
  const [servicesimagealt, setServicesimagealt] = useState("");

  const [aboutimage, setAboutImage] = useState(null);
  const [aboutImagePreview, setAboutImagePreview] = useState("");
  const [aboutImageRemoved, setAboutImageRemoved] = useState(false);
  const [existingAboutImageUrl, setExistingAboutImageUrl] = useState("");
  const [aboutimagealt, setAboutimagealt] = useState("");
  const [abouttitle, setAboutTitle] = useState("");
  const [abouttag, setAboutTag] = useState("");
  const [aboutdescription, setAboutDescription] = useState("");
  const [featuredService, setFeaturedService] = useState(false);

  const [serviceshow, setServiceshow] = useState(false);
  const [industryhow, setIndustryshow] = useState(false);
  const [whatweofferhow, setWhatweofferhow] = useState(false);
  const [peoplehow, setPeoplehow] = useState(false);
  const [teamServiceshow, setTeamServiceshow] = useState(false);

  const [scrollSpyNavShow, setScrollSpyNavShow] = useState(false);
  const [scrollSpyNavSections, setScrollSpyNavSections] = useState([]);

  const [customSoftwareShow, setCustomSoftwareShow] = useState(false);
  const [customSoftwareTitle, setCustomSoftwareTitle] = useState("");
  const [customSoftwareDescription, setCustomSoftwareDescription] = useState("");
  const [customSoftwareImage, setCustomSoftwareImage] = useState(null);
  const [customSoftwareImagePreview, setCustomSoftwareImagePreview] = useState("");
  const [customsoftwareimagealt, setCustomsoftwareimagealt] = useState("");
  const [customSoftwareSteps, setCustomSoftwareSteps] = useState([]);

  const [serviceSectionShow, setServiceSectionShow] = useState(false);
  const [serviceSectionTitle, setServiceSectionTitle] = useState("");
  const [serviceSectionDescription, setServiceSectionDescription] = useState("");
  const [serviceFaqs, setServiceFaqs] = useState([]);
  const [draggedFaqId, setDraggedFaqId] = useState(null);

  const [servicetitle, setServiceTitle] = useState("");
  const [servicedescription, setServiceDescription] = useState("");

  // Frontend Technology Section
  const [frontendTechnologyShow, setFrontendTechnologyShow] = useState(false);
  const [frontendTechnologyTitle, setFrontendTechnologyTitle] = useState("");
  const [frontendTechnologyDescription, setFrontendTechnologyDescription] = useState("");
  const [frontendTechnologyImage, setFrontendTechnologyImage] = useState(null);
  const [frontendTechnologyImagePreview, setFrontendTechnologyImagePreview] = useState("");
  const [frontendtechnologyimagealt, setFrontendtechnologyimagealt] = useState("");
  const [frontendTechnologySteps, setFrontendTechnologySteps] = useState([]);

  // Backend Technology Section
  const [backendTechnologyShow, setBackendTechnologyShow] = useState(false);
  const [backendTechnologyTitle, setBackendTechnologyTitle] = useState("");
  const [backendTechnologyDescription, setBackendTechnologyDescription] = useState("");
  const [backendTechnologyImage, setBackendTechnologyImage] = useState(null);
  const [backendTechnologyImagePreview, setBackendTechnologyImagePreview] = useState("");
  const [backendtechnologyimagealt, setBackendtechnologyimagealt] = useState("");
  const [backendTechnologySteps, setBackendTechnologySteps] = useState([]);

  // Database Technology Section
  const [databaseTechnologyShow, setDatabaseTechnologyShow] = useState(false);
  const [databaseTechnologyTitle, setDatabaseTechnologyTitle] = useState("");
  const [databaseTechnologyDescription, setDatabaseTechnologyDescription] = useState("");
  const [databaseTechnologyImage, setDatabaseTechnologyImage] = useState(null);
  const [databaseTechnologyImagePreview, setDatabaseTechnologyImagePreview] = useState("");
  const [databasetechnologyimagealt, setDatabasetechnologyimagealt] = useState("");
  const [databaseTechnologySteps, setDatabaseTechnologySteps] = useState([]);

  const [industrytitle, setIndustryTitle] = useState("");
  const [industrydescription, setIndustryDescription] = useState("");

  const [whatweoffertitle, setWhatweofferTitle] = useState("");
  const [whatweofferdescription, setWhatweofferDescription] = useState("");

  const [peopleimage, setPeopleImage] = useState(null);
  const [peopleImagePreview, setPeopleImagePreview] = useState("");
  const [peopleimagealt, setPeopleimagealt] = useState("");
  const [peopletitle, setPeopleTitle] = useState("");
  const [peopledescription, setPeopleDescription] = useState("");

  const [teamServicesTitle, setTeamServicesTitle] = useState("");
  const [teamServicesSubTitle, setTeamServicesSubTitle] = useState("");
  const [teamServicesDescription, setTeamServicesDescription] = useState("");

  const [metatitle, setMetatitle] = useState("");
  const [metadescription, setMetaDescription] = useState("");

  const [serviceSteps, setServiceSteps] = useState([]);
  const [serviceStepsGet, setServiceStepsGet] = useState([]);

  const [industrySteps, setIndustrySteps] = useState([]);
  const [whatWeOfferSteps, setWhatWeOfferSteps] = useState([]);

  // Parent service hierarchy
  const [parentService, setParentService] = useState("");
  const [parentOptions, setParentOptions] = useState([]);

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

  useEffect(() => {
    const fetchParentServices = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "";
        const res = await fetch(`${BASE_URL}api/services`);
        if (res.ok) {
          const data = await res.json();
          // Paginated response has .items; flat/hierarchical response is an array
          const list = Array.isArray(data) ? data : (data.items ?? []);
          setParentOptions(list);
        }
      } catch (err) {
        console.error("Failed to fetch parent services:", err);
      }
    };
    fetchParentServices();
  }, []);

  useEffect(() => {
    if (!serviceId) return;

    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await getServicesById(serviceId);
        const data = response?.data || {};

        setTitle(data.title || "");
        setProject(data.project || "");
        setSlug(data.slug || "");
        setDescription(data.description || "");
        setStatus(normalizeBoolean(data.status, true));

        setServiceshow(normalizeBoolean(data.serviceshow));
        setServiceTitle(data.servicetitle || "");
        setServiceDescription(data.servicedescription || "");

        // Frontend Technology
        setFrontendTechnologyShow(normalizeBoolean(data.frontendtechnologyhow));
        setFrontendTechnologyTitle(data.frontendtechnologytitle || "");
        setFrontendTechnologyDescription(data.frontendtechnologydescription || "");
        setFrontendTechnologyImagePreview(buildAssetUrl(data.frontendtechnologyimage));
        setFrontendtechnologyimagealt(data.frontendtechnologyimagealt || "");

        // Backend Technology
        setBackendTechnologyShow(normalizeBoolean(data.backendtechnologyhow));
        setBackendTechnologyTitle(data.backendtechnologytitle || "");
        setBackendTechnologyDescription(data.backendtechnologydescription || "");
        setBackendTechnologyImagePreview(buildAssetUrl(data.backendtechnologyimage));
        setBackendtechnologyimagealt(data.backendtechnologyimagealt || "");

        // Database Technology
        setDatabaseTechnologyShow(normalizeBoolean(data.databasetechnologyhow));
        setDatabaseTechnologyTitle(data.databasetechnologytitle || "");
        setDatabaseTechnologyDescription(data.databasetechnologydescription || "");
        setDatabaseTechnologyImagePreview(buildAssetUrl(data.databasetechnologyimage));
        setDatabasetechnologyimagealt(data.databasetechnologyimagealt || "");

        setIndustryshow(normalizeBoolean(data.industryhow));
        setIndustryTitle(data.industrytitle || "");
        setIndustryDescription(data.industrydescription || "");

        setWhatweofferhow(normalizeBoolean(data.whatweofferhow));
        setWhatweofferTitle(data.whatweoffertitle || "");
        setWhatweofferDescription(data.whatweofferdescription || "");

        setPeoplehow(normalizeBoolean(data.peoplehow));
        setPeopleTitle(data.peopletitle || "");
        setPeopleDescription(data.peopledescription || "");

        setTeamServiceshow(normalizeBoolean(data.teamServiceshow));
        setTeamServicesTitle(data.teamServicesTitle || "");
        setTeamServicesSubTitle(data.teamServicesSubTitle || "");
        setTeamServicesDescription(data.teamServicesDescription || "");

        setScrollSpyNavShow(normalizeBoolean(data.scrollSpyNavShow));
        setScrollSpyNavSections(
          Array.isArray(data.scrollSpyNavSections) && data.scrollSpyNavSections.length > 0
            ? data.scrollSpyNavSections.map((section, index) => ({
              id: `scroll-${section.id || index}-${Date.now()}-${index}`,
              idValue: section.id || '',
              title: section.title || ''
            }))
            : []
        );

        setCustomSoftwareShow(normalizeBoolean(data.customSoftwareShow));
        setCustomSoftwareTitle(data.customSoftwareTitle || "");
        setCustomSoftwareDescription(data.customSoftwareDescription || "");
        setCustomSoftwareImagePreview(buildAssetUrl(data.customSoftwareImage));
        setCustomsoftwareimagealt(data.customsoftwareimagealt || "");

        setServiceSectionShow(normalizeBoolean(data.serviceSectionShow));
        setServiceSectionTitle(data.serviceSectionTitle || "");
        setServiceSectionDescription(data.serviceSectionDescription || "");
        setCustomSoftwareSteps(
          Array.isArray(data.customSoftwareSteps) && data.customSoftwareSteps.length > 0
            ? data.customSoftwareSteps.map((step, index) => ({
              id: `custom-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
              iconFile: null,
              iconPreview: buildAssetUrl(step.icon || ''),
              icon: step.icon || '',
              title: step.title || '',
              description: step.description || '',
              iconAlt: step.iconAlt || ""
            }))
            : []
        );

        setMetatitle(data.metatitle || "");
        setMetaDescription(data.metadescription || "");

        setAboutTitle(data.abouttitle || "");
        setAboutTag(data.abouttag || "");
        setAboutDescription(data.aboutdescription || "");
        setFeaturedService(normalizeBoolean(data.featuredService, false));
        console.log(data.logoimage, "data.logoimage")

        setLogoPreview(buildAssetUrl(data.logoimage));
        setServicesLogoPreview(buildAssetUrl(data.servicesimage));
        setLogoimagealt(data.logoimagealt || "");
        setServicesimagealt(data.servicesimagealt || "");
        const aboutImageUrl = buildAssetUrl(data.aboutimage);
        setAboutImagePreview(aboutImageUrl);
        setExistingAboutImageUrl(data.aboutimage || "");
        setAboutimagealt(data.aboutimagealt || "");
        setPeopleImagePreview(buildAssetUrl(data.peopleimage));
        setPeopleimagealt(data.peopleimagealt || "");
        setAboutImageRemoved(false); // Reset removed flag when loading existing data

        // Map technology steps by section
        const allTechSteps = Array.isArray(data.technologystep) ? data.technologystep : [];
        setFrontendTechnologySteps(mapExistingSteps(allTechSteps.filter(s => s?.section === 'frontend'), "frontend"));
        setBackendTechnologySteps(mapExistingSteps(allTechSteps.filter(s => s?.section === 'backend'), "backend"));
        setDatabaseTechnologySteps(mapExistingSteps(allTechSteps.filter(s => s?.section === 'database'), "database"));

        setServiceStepsGet(mapExistingSteps(data.servicestep, "service"));
        console.log(data.servicestep)
        setIndustrySteps(mapExistingSteps(data.industrystep, "industry"));
        setWhatWeOfferSteps(mapExistingSteps(data.whatweofferstep, "whatweoffer"));
        const serviceFaqs = (Array.isArray(data.faqs) ? data.faqs : [])
          .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
          .map((faq) => ({
            source: "service",
            title: faq?.title ?? "",
            description: faq?.description ?? "",
          }));

        let legacyFaqs = [];
        try {
          const legacyResponse = await getFaqByServiceIdAdmin(serviceId);
          const legacyItems = Array.isArray(legacyResponse?.items)
            ? legacyResponse.items
            : Array.isArray(legacyResponse?.data)
              ? legacyResponse.data
              : Array.isArray(legacyResponse)
                ? legacyResponse
                : [];
          legacyFaqs = legacyItems
            .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
            .map((faq) => ({
              source: "legacy",
              title: faq?.title ?? "",
              description: faq?.description ?? "",
            }));
        } catch (faqErr) {
          console.error("Failed to fetch legacy service FAQs:", faqErr);
        }

        const mergedFaqs = [];
        const seenFaqKeys = new Set();
        [...serviceFaqs, ...legacyFaqs].forEach((faq) => {
          const key = faqIdentityKey(faq);
          if (!key || key === "::" || seenFaqKeys.has(key)) return;
          seenFaqKeys.add(key);
          mergedFaqs.push(faq);
        });

        setServiceFaqs(
          mergedFaqs.map((faq, index) => ({
            id: `faq-existing-${index}-${Date.now()}-${index}`,
            existingId: null,
            title: faq.title,
            description: faq.description,
          }))
        );

        // Pre-populate parent selection
        setParentService(data.parent ? data.parent.toString() : "");
      } catch (err) {
        console.error("Error fetching services:", err);
        toast.error("Unable to load service details.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [serviceId]);
  const removeServiceStepGet = async (existingId, frontendId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this service step?");
    if (!isConfirmed) return;
    try {
      if (existingId) {
        await deleteServiceStepAPI(existingId);
      }
      const filtered = serviceStepsGet?.filter((step) => step.id !== frontendId);
      setServiceStepsGet(filtered);
      toast.success("Service step removed successfully");
    } catch (error) {
      console.error("Failed to delete service step:", error);
      toast.error("Failed to delete service step.");
    }
  };
  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    setLogo(file || null);
    setLogoPreview(file ? URL.createObjectURL(file) : logoPreview);
    if (file && !logoimagealt) setLogoimagealt(fileNameToAlt(file.name));
  };

  const handleServicesLogoChange = (event) => {
    const file = event.target.files?.[0];
    setServiceslogo(file || null);
    setServicesLogoPreview(file ? URL.createObjectURL(file) : servicesLogoPreview);
    if (file && !servicesimagealt) setServicesimagealt(fileNameToAlt(file.name));
  };

  const handleAboutImageChange = (event) => {
    const file = event.target.files?.[0];
    setAboutImage(file || null);
    setAboutImagePreview(file ? URL.createObjectURL(file) : aboutImagePreview);
    setAboutImageRemoved(false);
    if (file && !aboutimagealt) setAboutimagealt(fileNameToAlt(file.name));
  };

  const handleRemoveAboutImage = () => {
    setAboutImage(null);
    setAboutImagePreview("");
    setAboutImageRemoved(true); // Mark as explicitly removed
    // Clear the file input
    const fileInput = document.getElementById("aboutimage");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handlePeopleImageChange = (event) => {
    const file = event.target.files?.[0];
    setPeopleImage(file || null);
    setPeopleImagePreview(file ? URL.createObjectURL(file) : peopleImagePreview);
    if (file && !peopleimagealt) setPeopleimagealt(fileNameToAlt(file.name));
  };

  // Frontend Technology Handlers
  const addFrontendTechnologyStep = () => {
    setFrontendTechnologySteps((prev) => [...prev, createEmptyStep("frontend")]);
  };
  const updateFrontendTechnologyStepField = (id, field, value) => {
    setFrontendTechnologySteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };
  const removeFrontendTechnologyStep = (id) => {
    setFrontendTechnologySteps((prev) => prev.filter((step) => step.id !== id));
  };
  const handleFrontendTechnologyImageChange = (event) => {
    const file = event.target.files?.[0];
    setFrontendTechnologyImage(file || null);
    setFrontendTechnologyImagePreview(file ? URL.createObjectURL(file) : frontendTechnologyImagePreview);
    if (file && !frontendtechnologyimagealt) setFrontendtechnologyimagealt(fileNameToAlt(file.name));
  };

  // Backend Technology Handlers
  const addBackendTechnologyStep = () => {
    setBackendTechnologySteps((prev) => [...prev, createEmptyStep("backend")]);
  };
  const updateBackendTechnologyStepField = (id, field, value) => {
    setBackendTechnologySteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };
  const removeBackendTechnologyStep = (id) => {
    setBackendTechnologySteps((prev) => prev.filter((step) => step.id !== id));
  };
  const handleBackendTechnologyImageChange = (event) => {
    const file = event.target.files?.[0];
    setBackendTechnologyImage(file || null);
    setBackendTechnologyImagePreview(file ? URL.createObjectURL(file) : backendTechnologyImagePreview);
    if (file && !backendtechnologyimagealt) setBackendtechnologyimagealt(fileNameToAlt(file.name));
  };

  // Database Technology Handlers
  const addDatabaseTechnologyStep = () => {
    setDatabaseTechnologySteps((prev) => [...prev, createEmptyStep("database")]);
  };
  const updateDatabaseTechnologyStepField = (id, field, value) => {
    setDatabaseTechnologySteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };
  const removeDatabaseTechnologyStep = (id) => {
    setDatabaseTechnologySteps((prev) => prev.filter((step) => step.id !== id));
  };
  const handleDatabaseTechnologyImageChange = (event) => {
    const file = event.target.files?.[0];
    setDatabaseTechnologyImage(file || null);
    setDatabaseTechnologyImagePreview(file ? URL.createObjectURL(file) : databaseTechnologyImagePreview);
    if (file && !databasetechnologyimagealt) setDatabasetechnologyimagealt(fileNameToAlt(file.name));
  };

  const addServiceStep = () => {
    setServiceSteps((prev) => [...prev, createEmptyStep("service")]);
  };

  const updateServiceStepField = (id, field, value) => {
    setServiceSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };

  const updateServiceStepFieldGet = (id, field, value) => {
    setServiceStepsGet((prev) =>
      prev.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };

  const updateServiceStepImage = (id, file) => {
    setServiceSteps((prev) =>
      prev.map((step) =>
        step.id === id
          ? {
            ...step,
            imageFile: file || null,
            preview: file ? URL.createObjectURL(file) : step.preview,
            imagealt: file && !step.imagealt ? fileNameToAlt(file.name) : step.imagealt,
          }
          : step
      )
    );
  };
  const updateServiceStepImageGet = (id, file) => {
    setServiceStepsGet((prev) =>
      prev.map((step) =>
        step.id === id
          ? {
            ...step,
            imageFile: file || null,
            preview: file ? URL.createObjectURL(file) : step.preview,
            imagealt: file && !step.imagealt ? fileNameToAlt(file.name) : step.imagealt,
          }
          : step
      )
    );
  };

  const removeServiceStep = (id) => {
    setServiceSteps((prev) => prev.filter((step) => step.id !== id));
  };
  const clearServiceStepImage = (id) => {
    setServiceSteps((prev) =>
      prev.map((step) => step.id === id ? { ...step, imageFile: null, preview: '' } : step)
    );
  };
  const clearServiceStepImageGet = (id) => {
    setServiceStepsGet((prev) =>
      prev.map((step) => step.id === id ? { ...step, imageFile: null, preview: '' } : step)
    );
  };

  const addIndustryStep = () => {
    setIndustrySteps((prev) => [...prev, createEmptyStep("industry")]);
  };

  const updateIndustryStepField = (id, field, value) => {
    setIndustrySteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };

  const updateIndustryStepImage = (id, file) => {
    setIndustrySteps((prev) =>
      prev.map((step) =>
        step.id === id
          ? {
            ...step,
            imageFile: file || null,
            preview: file ? URL.createObjectURL(file) : step.preview,
            imagealt: file && !step.imagealt ? fileNameToAlt(file.name) : step.imagealt,
          }
          : step
      )
    );
  };

  const removeIndustryStep = (id) => {
    setIndustrySteps((prev) => prev.filter((step) => step.id !== id));
  };
  const clearIndustryStepImage = (id) => {
    setIndustrySteps((prev) =>
      prev.map((step) => step.id === id ? { ...step, imageFile: null, preview: '' } : step)
    );
  };

  // ScrollSpyNav Handlers
  const handleAddScrollSpySection = () => {
    setScrollSpyNavSections([
      ...scrollSpyNavSections,
      {
        id: `scroll-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
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
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        iconFile: null,
        iconPreview: '',
        icon: '',
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
    updated[index].iconPreview = file ? URL.createObjectURL(file) : updated[index].iconPreview;
    if (file && !updated[index].iconAlt) updated[index].iconAlt = fileNameToAlt(file.name);
    setCustomSoftwareSteps(updated);
  };
  const handleCustomSoftwareImageChange = (event) => {
    const file = event.target.files?.[0];
    setCustomSoftwareImage(file || null);
    setCustomSoftwareImagePreview(file ? URL.createObjectURL(file) : customSoftwareImagePreview);
    if (file && !customsoftwareimagealt) setCustomsoftwareimagealt(fileNameToAlt(file.name));
  };

  const addWhatWeOfferStep = () => {
    setWhatWeOfferSteps((prev) => [...prev, createEmptyStep("whatweoffer")]);
  };

  const updateWhatWeOfferStepField = (id, field, value) => {
    setWhatWeOfferSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };

  const updateWhatWeOfferStepImage = (id, file) => {
    setWhatWeOfferSteps((prev) =>
      prev.map((step) =>
        step.id === id
          ? {
            ...step,
            imageFile: file || null,
            preview: file ? URL.createObjectURL(file) : step.preview,
            imagealt: file && !step.imagealt ? fileNameToAlt(file.name) : step.imagealt,
          }
          : step
      )
    );
  };

  const removeWhatWeOfferStep = (id) => {
    setWhatWeOfferSteps((prev) => prev.filter((step) => step.id !== id));
  };
  const clearWhatWeOfferStepImage = (id) => {
    setWhatWeOfferSteps((prev) =>
      prev.map((step) => step.id === id ? { ...step, imageFile: null, preview: '' } : step)
    );
  };

  const clearErrorForField = (key) => {
    setError((prev) => {
      if (!prev || !prev[key]) return prev;
      const next = { ...prev };
      next[key] = "";
      return next;
    });
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
    clearErrorForField("description");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!serviceId) return;

    setIsSubmitting(true);
    const newErrors = {};

    const requiredFields = [
      { key: "title", value: title, name: "Title" },
      { key: "slug", value: slug, name: "Slug" },
      { key: "metatitle", value: metatitle, name: "Meta Title" },
      { key: "metadescription", value: metadescription, name: "Meta Description" },
    ];

    requiredFields.forEach((field) => {
      if (!field.value || (typeof field.value === "string" && !field.value.trim())) {
        newErrors[field.key] = `${field.name} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
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

      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (typeof value === "boolean") {
          formData.append(key, value ? "true" : "false");
          return;
        }
        formData.append(key, value);
      });

      // ScrollSpyNav Sections
      scrollSpyNavSections.forEach((section, index) => {
        if (section.idValue && section.title) {
          formData.append(`scrollSpyNavSections[${index}][id]`, section.idValue);
          formData.append(`scrollSpyNavSections[${index}][title]`, section.title);
        }
      });

      // Custom Software Image
      if (customSoftwareImage) {
        formData.append("customsoftwareimage", customSoftwareImage);
      }

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

      // Frontend Technology Steps
      frontendTechnologySteps.forEach((step, index) => {
        formData.append(`frontendtechnology[${index}][titlestep]`, step.titlestep || "");
        formData.append(`frontendtechnology[${index}][descriptionstep]`, step.descriptionstep || "");
        formData.append(`frontendtechnology[${index}][section]`, "frontend");
        if (step.existingId) {
          formData.append(`frontendtechnology[${index}][_id]`, step.existingId);
        }
      });

      // Backend Technology Steps
      backendTechnologySteps.forEach((step, index) => {
        formData.append(`backendtechnology[${index}][titlestep]`, step.titlestep || "");
        formData.append(`backendtechnology[${index}][descriptionstep]`, step.descriptionstep || "");
        formData.append(`backendtechnology[${index}][section]`, "backend");
        if (step.existingId) {
          formData.append(`backendtechnology[${index}][_id]`, step.existingId);
        }
      });

      // Database Technology Steps
      databaseTechnologySteps.forEach((step, index) => {
        formData.append(`databasetechnology[${index}][titlestep]`, step.titlestep || "");
        formData.append(`databasetechnology[${index}][descriptionstep]`, step.descriptionstep || "");
        formData.append(`databasetechnology[${index}][section]`, "database");
        if (step.existingId) {
          formData.append(`databasetechnology[${index}][_id]`, step.existingId);
        }
      });

      serviceSteps.forEach((step, index) => {
        formData.append(`services[${index}][titlestep]`, step.titlestep || "");
        formData.append(`services[${index}][descriptionstep]`, step.descriptionstep || "");
        formData.append(`services[${index}][imagealt]`, step.imagealt || "");
        if (step.existingId) {
          formData.append(`services[${index}][_id]`, step.existingId);
        }
        if (step.imageFile) {
          formData.append(`services[${index}][imagestep]`, step.imageFile);
        }
      });

      serviceStepsGet.forEach((step, index) => {
        formData.append(`servicesget[${index}][titlestep]`, step.titlestep || "");
        formData.append(`servicesget[${index}][descriptionstep]`, step.descriptionstep || "");
        formData.append(`servicesget[${index}][imagealt]`, step.imagealt || "");
        if (step.existingId) {
          formData.append(`servicesget[${index}][_id]`, step.existingId);
        }
        if (step.imageFile) {
          formData.append(`servicesget[${index}][imagestep]`, step.imageFile);
        }
      });

      industrySteps.forEach((step, index) => {
        formData.append(`industry[${index}][titlestep]`, step.titlestep || "");
        formData.append(`industry[${index}][descriptionstep]`, step.descriptionstep || "");
        formData.append(`industry[${index}][imagealt]`, step.imagealt || "");
        if (step.existingId) {
          formData.append(`industry[${index}][_id]`, step.existingId);
        }
        if (step.imageFile) {
          formData.append(`industry[${index}][imagestep]`, step.imageFile);
        }
      });

      whatWeOfferSteps.forEach((step, index) => {
        formData.append(`whatweoffer[${index}][titlestep]`, step.titlestep || "");
        formData.append(`whatweoffer[${index}][descriptionstep]`, step.descriptionstep || "");
        formData.append(`whatweoffer[${index}][tagstep]`, step.tagstep || "");
        formData.append(`whatweoffer[${index}][linkstep]`, step.linkstep || "");
        formData.append(`whatweoffer[${index}][imagealt]`, step.imagealt || "");
        if (step.existingId) {
          formData.append(`whatweoffer[${index}][_id]`, step.existingId);
        }
        if (step.imageFile) {
          formData.append(`whatweoffer[${index}][imagestep]`, step.imageFile);
        }
      });

      if (logo) {
        formData.append("logo", logo);
      }
      if (serviceslogo) {
        formData.append("serviceslogo", serviceslogo);
      }
      if (aboutimage) {
        // New image selected, append it as a file
        formData.append("aboutimage", aboutimage);
      } else if (aboutImageRemoved) {
        // Image was explicitly removed by user, send empty string to delete it
        formData.append("aboutimage", "");
      } else if (existingAboutImageUrl) {
        // No new image selected and not removed, send existing image URL to preserve it
        formData.append("aboutimage", existingAboutImageUrl);
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

      const validFaqs = serviceFaqs.filter(
        (faq) => faq.title.trim() || faq.description.trim()
      );
      validFaqs.forEach((faq, index) => {
        formData.append(`faqs[${index}][title]`, faq.title.trim());
        formData.append(`faqs[${index}][description]`, faq.description.trim());
        formData.append(`faqs[${index}][order]`, String(index));
        formData.append(`faqs[${index}][status]`, "true");
      });

      const data = await updateServicesAPI(serviceId, formData);
      toast.success(data.message || "Service updated successfully");
      if (data.status === "success") {
        setTimeout(() => {
          router.push("/thebusinesshub/services");
        }, 1500);
      }
      setError({});
    } catch (err) {
      console.error("Failed to update services:", err);
      toast.error(err?.message || "Failed to update services");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // ── Section navigation items ──────────────────────────────────────────
  const sectionNav = [
    { id: "sec-core",     label: "Core Info" },
    { id: "sec-about",    label: "About" },
    { id: "sec-service",  label: "Service" },
    { id: "sec-frontend", label: "Frontend Tech" },
    { id: "sec-backend",  label: "Backend Tech" },
    { id: "sec-database", label: "Database Tech" },
    { id: "sec-industry", label: "Industry" },
    { id: "sec-wwo",      label: "What We Offer" },
    { id: "sec-people",   label: "People" },
    { id: "sec-team",     label: "Team Services" },
    { id: "sec-scrollspy",label: "ScrollSpy Nav" },
    { id: "sec-servicesection", label: "Service Section" },
    { id: "sec-faq",      label: "FAQs" },
    { id: "sec-custom",   label: "Custom Software" },
    { id: "sec-meta",     label: "Meta" },
  ];

  return (
    <>
      {/* ── Sticky Section Navigator ──────────────────────────── */}
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

      <form onSubmit={handleSubmit} className="row">

        {/* ── Core Information ──────────────────────────────────── */}
        <SectionCard id="sec-core" title="Core Information" accentColor="#4b4d7c">
          <div className="col-lg-6">
            <div style={{ fontWeight: 600, marginBottom: 6, color: "#484848" }}>Services Icon</div>
            <UploadWithAlt
              altId="logoimagealt"
              altLabel="Services Icon Alt Text"
              altValue={logoimagealt}
              altOnChange={setLogoimagealt}
              altPlaceholder="Describe the services icon"
              hasFile={!!(logoPreview || logo)}
              onRemove={() => { setLogo(null); setLogoPreview(""); const inp = document.getElementById("image1"); if (inp) inp.value = ""; }}
            >
              <div className="wrap-custom-file">
                <input type="file" id="image1" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif" onChange={handleLogoChange} />
                <label style={logoPreview ? { backgroundImage: `url(${logoPreview})` } : logo ? { backgroundImage: `url(${logo})` } : undefined} htmlFor="image1">
                  <span><i className="flaticon-download"></i> Upload Photo</span>
                </label>
              </div>
            </UploadWithAlt>
          </div>
          <div className="col-lg-6">
            <div style={{ fontWeight: 600, marginBottom: 6, color: "#484848" }}>Services Image</div>
            <UploadWithAlt
              altId="servicesimagealt"
              altLabel="Services Image Alt Text"
              altValue={servicesimagealt}
              altOnChange={setServicesimagealt}
              altPlaceholder="Describe the services image"
              hasFile={!!(servicesLogoPreview || serviceslogo)}
              onRemove={() => { setServiceslogo(null); setServicesLogoPreview(""); const inp = document.getElementById("image2"); if (inp) inp.value = ""; }}
            >
              <div className="wrap-custom-file">
                <input type="file" id="image2" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif" onChange={handleServicesLogoChange} />
                <label style={servicesLogoPreview ? { backgroundImage: `url(${servicesLogoPreview})` } : undefined} htmlFor="image2">
                  <span><i className="flaticon-download"></i> Upload Photo</span>
                </label>
              </div>
            </UploadWithAlt>
          </div>
          <div className="col-lg-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="servicesTitle">Services Title</label>
              <input type="text" className="form-control" id="servicesTitle" value={title}
                onChange={(e) => { setTitle(e.target.value); clearErrorForField("title"); }} placeholder="Enter services Title" />
              {error.title && <span className="text-danger">{error.title}</span>}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="servicesProject">Services Tag</label>
              <input type="text" className="form-control" id="servicesProject" value={project} onChange={(e) => setProject(e.target.value)} placeholder="Enter services Project" />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="servicesSlug">Services Slug (SEO URL)</label>
              <input type="text" className="form-control" id="servicesSlug" value={slug}
                onChange={(e) => { setSlug(e.target.value); clearErrorForField("slug"); }} placeholder="Enter services slug" />
              {error.slug && <span className="text-danger">{error.slug}</span>}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="parentService">Parent Service</label>
              <select className="form-control" id="parentService" value={parentService} onChange={(e) => setParentService(e.target.value)}>
                <option value="">None (Make Parent Service)</option>
                {parentOptions.filter((opt) => opt._id.toString() !== serviceId).map((opt) => (
                  <option key={opt._id} value={opt._id}>{(opt.title ?? '').replace(/<[^>]*>/g, '').trim()}</option>
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
              <HtmlEditor id="servicesDescription" value={description} onChange={handleDescriptionChange} placeholder="Enter services description" height="300px" />
              {error.description && <span className="text-danger">{error.description}</span>}
            </div>
          </div>
        </SectionCard>

        {/* ── About Section ─────────────────────────────────────── */}
        <SectionCard id="sec-about" title="About Section" accentColor="#3c3e66">
          <div className="col-lg-6">
            <div style={{ fontWeight: 600, marginBottom: 6, color: "#484848" }}>About Image</div>
            <UploadWithAlt
              altId="aboutimagealt"
              altLabel="About Image Alt Text"
              altValue={aboutimagealt}
              altOnChange={setAboutimagealt}
              altPlaceholder="Describe the about section image"
              hasFile={!!(aboutImagePreview || aboutimage)}
              onRemove={handleRemoveAboutImage}
            >
              <div className="wrap-custom-file">
                <input type="file" id="aboutimage" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif" onChange={handleAboutImageChange} />
                <label style={aboutImagePreview ? { backgroundImage: `url(${aboutImagePreview})` } : aboutimage ? { backgroundImage: `url(${aboutimage})` } : undefined} htmlFor="aboutimage">
                  <span><i className="flaticon-download"></i> Upload About image</span>
                </label>
              </div>
            </UploadWithAlt>
          </div>
          <div className="col-lg-6">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="aboutTitle">About Title</label>
              <input type="text" className="form-control" id="aboutTitle" value={abouttitle}
                onChange={(e) => { setAboutTitle(e.target.value); clearErrorForField("abouttitle"); }} placeholder="Enter About Title" />
              {error.abouttitle && <span className="text-danger">{error.abouttitle}</span>}
            </div>
            <div className="my_profile_setting_input form-group">
              <label htmlFor="aboutTag">About Tag</label>
              <input type="text" className="form-control" id="aboutTag" value={abouttag}
                onChange={(e) => { setAboutTag(e.target.value); clearErrorForField("abouttag"); }} placeholder="Enter About Tag (e.g., APPLICATION SOLUTIONS TO GROW BUSINESS QUICKLY)" />
              {error.abouttag && <span className="text-danger">{error.abouttag}</span>}
            </div>
            <div className="my_profile_setting_textarea form-group">
              <label htmlFor="aboutDescription">About Description</label>
              <HtmlEditor
                id="aboutDescription"
                value={aboutdescription}
                onChange={(value) => {
                  setAboutDescription(value);
                  clearErrorForField("aboutdescription");
                }}
                placeholder="Enter about description"
                height="300px"
              />
              {error.aboutdescription && <span className="text-danger">{error.aboutdescription}</span>}
            </div>
            <div className="my_profile_setting_input form-group">
              <label htmlFor="featuredService">Featured Service</label>
              <input type="checkbox" className="form-check-input" id="featuredService" name="featuredService"
                checked={featuredService === true} onChange={(e) => setFeaturedService(e.target.checked)} />
            </div>
          </div>
        </SectionCard>

        {/* ── Service ───────────────────────────────────────────── */}
        <SectionCard
          id="sec-service"
          title="Service"
          accentColor="#2c2e50"
          toggleId="serviceshow"
          toggleName="serviceshow"
          enabled={serviceshow}
          onToggle={(e) => setServiceshow(e.target.checked)}
          badge={serviceStepsGet.length + serviceSteps.length}
        >
          {serviceshow && (
            <>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="serviceTitle">Service Title</label>
                  <input type="text" className="form-control" id="serviceTitle" value={servicetitle}
                    onChange={(e) => { setServiceTitle(e.target.value); clearErrorForField("servicetitle"); }} placeholder="Enter Service Title" />
                  {error.servicetitle && <span className="text-danger">{error.servicetitle}</span>}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_textarea form-group">
                  <label htmlFor="serviceDescription">Service Description</label>
                  <textarea id="serviceDescription" className="form-control" rows="7" value={servicedescription}
                    onChange={(e) => { setServiceDescription(e.target.value); clearErrorForField("servicedescription"); }} placeholder="Enter service description"></textarea>
                  {error.servicedescription && <span className="text-danger">{error.servicedescription}</span>}
                </div>
              </div>
              <div className="col-lg-12">
                <button className="btn admore_btn mb30" type="button" onClick={addServiceStep}>Add More</button>
              </div>
            </>
          )}
          {serviceshow && serviceStepsGet.map((step, index) => (
            <div className="col-12" key={step.id || step.existingId || index}>
              <StepCard index={index} label="Service (saved)" onRemove={() => removeServiceStepGet(step.existingId, step.id)}>
                <div className="col-xl-4">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`serviceTitle-${index}`}>Title</label>
                    <input type="text" className="form-control" id={`serviceTitle-${index}`} value={step.titlestep}
                      onChange={(e) => updateServiceStepFieldGet(step.id, "titlestep", e.target.value)} />
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`serviceDescription-${index}`}>Description</label>
                    <textarea className="form-control" id={`serviceDescription-${index}`} rows="4" value={step.descriptionstep}
                      onChange={(e) => updateServiceStepFieldGet(step.id, "descriptionstep", e.target.value)}></textarea>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="my_profile_setting_input form-group">
                    <div style={{ fontWeight: 600, marginBottom: 4, color: "#484848" }}>Service Image</div>
                    <UploadWithAlt
                      stacked
                      altId={`serviceimagealt-existing-${index}`}
                      altLabel="Service Image Alt Text"
                      altValue={step.imagealt || ""}
                      altOnChange={(value) => updateServiceStepFieldGet(step.id, "imagealt", value)}
                      altPlaceholder="Describe this service image"
                      note=""
                      hasFile={!!step.preview}
                      onRemove={() => clearServiceStepImageGet(step.id)}
                    >
                      <div className="wrap-custom-file height-150">
                        <input type="file" id={`serviceimage-${index}`} accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif"
                          onChange={(e) => updateServiceStepImageGet(step.id, e.target.files?.[0] || null)} />
                        <label style={step.preview ? { backgroundImage: `url(${step.preview})` } : undefined} htmlFor={`serviceimage-${index}`}>
                          <span><i className="flaticon-download"></i> Upload service image</span>
                        </label>
                      </div>
                    </UploadWithAlt>
                  </div>
                </div>
              </StepCard>
            </div>
          ))}
          {serviceshow && serviceSteps.map((step, index) => (
            <div className="col-12" key={step.id || index}>
              <StepCard index={serviceStepsGet.length + index} label="Service (new)" onRemove={() => removeServiceStep(step.id)}>
                <div className="col-xl-4">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`serviceTitle-new-${index}`}>Title</label>
                    <input type="text" className="form-control" id={`serviceTitle-new-${index}`} value={step.titlestep}
                      onChange={(e) => updateServiceStepField(step.id, "titlestep", e.target.value)} />
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`serviceDescription-new-${index}`}>Description</label>
                    <textarea className="form-control" id={`serviceDescription-new-${index}`} rows="4" value={step.descriptionstep}
                      onChange={(e) => updateServiceStepField(step.id, "descriptionstep", e.target.value)}></textarea>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="my_profile_setting_input form-group">
                    <div style={{ fontWeight: 600, marginBottom: 4, color: "#484848" }}>Service Image</div>
                    <UploadWithAlt
                      stacked
                      altId={`serviceimagealt-new-${index}`}
                      altLabel="Service Image Alt Text"
                      altValue={step.imagealt || ""}
                      altOnChange={(value) => updateServiceStepField(step.id, "imagealt", value)}
                      altPlaceholder="Describe this service image"
                      note=""
                      hasFile={!!step.preview}
                      onRemove={() => clearServiceStepImage(step.id)}
                    >
                      <div className="wrap-custom-file height-150">
                        <input type="file" id={`serviceimage-new-${index}`} accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif"
                          onChange={(e) => updateServiceStepImage(step.id, e.target.files?.[0] || null)} />
                        <label style={step.preview ? { backgroundImage: `url(${step.preview})` } : undefined} htmlFor={`serviceimage-new-${index}`}>
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
                      <input type="file" id="frontendTechnologySectionImage" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif" onChange={handleFrontendTechnologyImageChange} />
                      <label style={frontendTechnologyImagePreview ? { backgroundImage: `url(${frontendTechnologyImagePreview})` } : {}} htmlFor="frontendTechnologySectionImage">
                        <span><i className="flaticon-download"></i> Upload Frontend Technology Image</span>
                      </label>
                    </div>
                  </UploadWithAlt>
                </div>
              </div>
              <div className="col-lg-12">
                <button className="btn admore_btn mb30" type="button" onClick={addFrontendTechnologyStep}>Add More</button>
              </div>
              {frontendTechnologySteps.map((step, index) => (
                <div className="col-12" key={step.id || index}>
                  <StepCard index={index} label="Tech Item" onRemove={() => removeFrontendTechnologyStep(step.id)}>
                    <div className="col-xl-4">
                      <div className="my_profile_setting_input form-group">
                        <label htmlFor={`frontendTechnologyTitle-${index}`}>Title</label>
                        <input type="text" className="form-control" id={`frontendTechnologyTitle-${index}`} value={step.titlestep}
                          onChange={(e) => updateFrontendTechnologyStepField(step.id, "titlestep", e.target.value)} />
                      </div>
                    </div>
                    <div className="col-xl-8">
                      <div className="my_profile_setting_input form-group">
                        <label htmlFor={`frontendTechnologyDescription-${index}`}>Description</label>
                        <textarea className="form-control" id={`frontendTechnologyDescription-${index}`} rows="4" value={step.descriptionstep}
                          onChange={(e) => updateFrontendTechnologyStepField(step.id, "descriptionstep", e.target.value)} />
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
                      <input type="file" id="backendTechnologySectionImage" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif" onChange={handleBackendTechnologyImageChange} />
                      <label style={backendTechnologyImagePreview ? { backgroundImage: `url(${backendTechnologyImagePreview})` } : {}} htmlFor="backendTechnologySectionImage">
                        <span><i className="flaticon-download"></i> Upload Backend Technology Image</span>
                      </label>
                    </div>
                  </UploadWithAlt>
                </div>
              </div>
              <div className="col-lg-12">
                <button className="btn admore_btn mb30" type="button" onClick={addBackendTechnologyStep}>Add More</button>
              </div>
              {backendTechnologySteps.map((step, index) => (
                <div className="col-12" key={step.id || index}>
                  <StepCard index={index} label="Tech Item" onRemove={() => removeBackendTechnologyStep(step.id)}>
                    <div className="col-xl-4">
                      <div className="my_profile_setting_input form-group">
                        <label htmlFor={`backendTechnologyTitle-${index}`}>Title</label>
                        <input type="text" className="form-control" id={`backendTechnologyTitle-${index}`} value={step.titlestep}
                          onChange={(e) => updateBackendTechnologyStepField(step.id, "titlestep", e.target.value)} />
                      </div>
                    </div>
                    <div className="col-xl-8">
                      <div className="my_profile_setting_input form-group">
                        <label htmlFor={`backendTechnologyDescription-${index}`}>Description</label>
                        <textarea className="form-control" id={`backendTechnologyDescription-${index}`} rows="4" value={step.descriptionstep}
                          onChange={(e) => updateBackendTechnologyStepField(step.id, "descriptionstep", e.target.value)} />
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
                      <input type="file" id="databaseTechnologySectionImage" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif" onChange={handleDatabaseTechnologyImageChange} />
                      <label style={databaseTechnologyImagePreview ? { backgroundImage: `url(${databaseTechnologyImagePreview})` } : {}} htmlFor="databaseTechnologySectionImage">
                        <span><i className="flaticon-download"></i> Upload Database Technology Image</span>
                      </label>
                    </div>
                  </UploadWithAlt>
                </div>
              </div>
              <div className="col-lg-12">
                <button className="btn admore_btn mb30" type="button" onClick={addDatabaseTechnologyStep}>Add More</button>
              </div>
              {databaseTechnologySteps.map((step, index) => (
                <div className="col-12" key={step.id || index}>
                  <StepCard index={index} label="Tech Item" onRemove={() => removeDatabaseTechnologyStep(step.id)}>
                    <div className="col-xl-4">
                      <div className="my_profile_setting_input form-group">
                        <label htmlFor={`databaseTechnologyTitle-${index}`}>Title</label>
                        <input type="text" className="form-control" id={`databaseTechnologyTitle-${index}`} value={step.titlestep}
                          onChange={(e) => updateDatabaseTechnologyStepField(step.id, "titlestep", e.target.value)} />
                      </div>
                    </div>
                    <div className="col-xl-8">
                      <div className="my_profile_setting_input form-group">
                        <label htmlFor={`databaseTechnologyDescription-${index}`}>Description</label>
                        <textarea className="form-control" id={`databaseTechnologyDescription-${index}`} rows="4" value={step.descriptionstep}
                          onChange={(e) => updateDatabaseTechnologyStepField(step.id, "descriptionstep", e.target.value)} />
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
          badge={industrySteps.length}
        >
          {industryhow && (
            <>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="industryTitle">Industry Title</label>
                  <input type="text" className="form-control" id="industryTitle" value={industrytitle}
                    onChange={(e) => { setIndustryTitle(e.target.value); clearErrorForField("industrytitle"); }} placeholder="Enter Industry Title" />
                  {error.industrytitle && <span className="text-danger">{error.industrytitle}</span>}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_textarea form-group">
                  <label htmlFor="industryDescription">Industry Description</label>
                  <textarea id="industryDescription" className="form-control" rows="7" value={industrydescription}
                    onChange={(e) => { setIndustryDescription(e.target.value); clearErrorForField("industrydescription"); }} placeholder="Enter industry description"></textarea>
                  {error.industrydescription && <span className="text-danger">{error.industrydescription}</span>}
                </div>
              </div>
              <div className="col-lg-12">
                <button className="btn admore_btn mb30" type="button" onClick={addIndustryStep}>Add More</button>
              </div>
            </>
          )}
          {industrySteps.map((step, index) => (
            <div className="col-12" key={step.id || index}>
              <StepCard index={index} label="Industry" onRemove={() => removeIndustryStep(step.id)}>
                <div className="col-xl-4">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`industryTitle-${index}`}>Title</label>
                    <input type="text" className="form-control" id={`industryTitle-${index}`} value={step.titlestep}
                      onChange={(e) => updateIndustryStepField(step.id, "titlestep", e.target.value)} />
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`industryDescription-${index}`}>Description</label>
                    <textarea className="form-control" id={`industryDescription-${index}`} rows="4" value={step.descriptionstep}
                      onChange={(e) => updateIndustryStepField(step.id, "descriptionstep", e.target.value)}></textarea>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="my_profile_setting_input form-group">
                    <div style={{ fontWeight: 600, marginBottom: 4, color: "#484848" }}>Industry Image</div>
                    <UploadWithAlt
                      stacked
                      altId={`industryimagealt-${index}`}
                      altLabel="Industry Image Alt Text"
                      altValue={step.imagealt || ""}
                      altOnChange={(value) => updateIndustryStepField(step.id, "imagealt", value)}
                      altPlaceholder="Describe this industry image"
                      note=""
                      hasFile={!!step.preview}
                      onRemove={() => clearIndustryStepImage(step.id)}
                    >
                      <div className="wrap-custom-file height-150">
                        <input type="file" id={`industryimage-${index}`} accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif"
                          onChange={(e) => updateIndustryStepImage(step.id, e.target.files?.[0] || null)} />
                        <label style={step.preview ? { backgroundImage: `url(${step.preview})` } : undefined} htmlFor={`industryimage-${index}`}>
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

        {/* ── What We Offer ─────────────────────────────────────── */}
        <SectionCard
          id="sec-wwo"
          title="What We Offer"
          accentColor="#3c3e66"
          toggleId="whatweofferhow"
          toggleName="whatweofferhow"
          enabled={whatweofferhow}
          onToggle={(e) => setWhatweofferhow(e.target.checked)}
          badge={whatWeOfferSteps.length}
        >
          {whatweofferhow && (
            <>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="whatweofferTitle">What We Offer Title</label>
                  <input type="text" className="form-control" id="whatweofferTitle" value={whatweoffertitle}
                    onChange={(e) => { setWhatweofferTitle(e.target.value); clearErrorForField("whatweoffertitle"); }} placeholder="Enter What We Offer Title" />
                  {error.whatweoffertitle && <span className="text-danger">{error.whatweoffertitle}</span>}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_textarea form-group">
                  <label htmlFor="whatweofferDescription">What We Offer Description</label>
                  <textarea id="whatweofferDescription" className="form-control" rows="7" value={whatweofferdescription}
                    onChange={(e) => { setWhatweofferDescription(e.target.value); clearErrorForField("whatweofferdescription"); }} placeholder="Enter what we offer description"></textarea>
                  {error.whatweofferdescription && <span className="text-danger">{error.whatweofferdescription}</span>}
                </div>
              </div>
              <div className="col-lg-12">
                <button className="btn admore_btn mb30" type="button" onClick={addWhatWeOfferStep}>Add More</button>
              </div>
            </>
          )}
          {whatWeOfferSteps.map((step, index) => (
            <div className="col-12" key={step.id || index}>
              <StepCard index={index} label="Offer" onRemove={() => removeWhatWeOfferStep(step.id)}>
                <div className="col-xl-3">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`whatweofferTitle-${index}`}>Title</label>
                    <input type="text" className="form-control" id={`whatweofferTitle-${index}`} value={step.titlestep}
                      onChange={(e) => updateWhatWeOfferStepField(step.id, "titlestep", e.target.value)} />
                  </div>
                </div>
                <div className="col-xl-2">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`whatweofferTag-${index}`}>Tag</label>
                    <input type="text" className="form-control" id={`whatweofferTag-${index}`} value={step.tagstep || ""}
                      onChange={(e) => updateWhatWeOfferStepField(step.id, "tagstep", e.target.value)} placeholder="Enter tag" />
                  </div>
                </div>
                <div className="col-xl-2">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`whatweofferLink-${index}`}>Link</label>
                    <input type="text" className="form-control" id={`whatweofferLink-${index}`} value={step.linkstep || ""}
                      onChange={(e) => updateWhatWeOfferStepField(step.id, "linkstep", e.target.value)} placeholder="Enter link" />
                  </div>
                </div>
                <div className="col-xl-2">
                  <div className="my_profile_setting_input form-group">
                    <label htmlFor={`whatweofferDescription-${index}`}>Description</label>
                    <textarea className="form-control" id={`whatweofferDescription-${index}`} rows="4" value={step.descriptionstep}
                      onChange={(e) => updateWhatWeOfferStepField(step.id, "descriptionstep", e.target.value)}></textarea>
                  </div>
                </div>
                <div className="col-xl-3">
                  <div className="my_profile_setting_input form-group">
                    <div style={{ fontWeight: 600, marginBottom: 4, color: "#484848" }}>Image</div>
                    <UploadWithAlt
                      stacked
                      altId={`whatweofferimagealt-${index}`}
                      altLabel="Image Alt Text"
                      altValue={step.imagealt || ""}
                      altOnChange={(value) => updateWhatWeOfferStepField(step.id, "imagealt", value)}
                      altPlaceholder="Describe this card image"
                      note=""
                      hasFile={!!step.preview}
                      onRemove={() => clearWhatWeOfferStepImage(step.id)}
                    >
                      <div className="wrap-custom-file height-150">
                        <input type="file" id={`whatweofferimage-${index}`} accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif"
                          onChange={(e) => updateWhatWeOfferStepImage(step.id, e.target.files?.[0] || null)} />
                        <label style={step.preview ? { backgroundImage: `url(${step.preview})` } : undefined} htmlFor={`whatweofferimage-${index}`}>
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
                  hasFile={!!(peopleImagePreview || peopleimage)}
                  onRemove={() => { setPeopleImage(null); setPeopleImagePreview(""); const inp = document.getElementById("peopleimage"); if (inp) inp.value = ""; }}
                >
                  <div className="wrap-custom-file">
                    <input type="file" id="peopleimage" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif" onChange={handlePeopleImageChange} />
                    <label style={peopleImagePreview ? { backgroundImage: `url(${peopleImagePreview})` } : undefined} htmlFor="peopleimage">
                      <span><i className="flaticon-download"></i> Upload People image</span>
                    </label>
                  </div>
                </UploadWithAlt>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="peopleTitle">People Title</label>
                  <input type="text" className="form-control" id="peopleTitle" value={peopletitle}
                    onChange={(e) => { setPeopleTitle(e.target.value); clearErrorForField("peopletitle"); }} placeholder="Enter People Title" />
                  {error.peopletitle && <span className="text-danger">{error.peopletitle}</span>}
                </div>
                <div className="my_profile_setting_textarea form-group">
                  <label htmlFor="peopleDescription">People Description</label>
                  <HtmlEditor
                    id="peopleDescription"
                    value={peopledescription}
                    onChange={(value) => {
                      setPeopleDescription(value);
                      clearErrorForField("peopledescription");
                    }}
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
                  <input type="text" className="form-control" id="teamServicesTitle" value={teamServicesTitle}
                    onChange={(e) => { setTeamServicesTitle(e.target.value); clearErrorForField("teamServicesTitle"); }} placeholder="Enter Team Services Title" />
                  {error.teamServicesTitle && <span className="text-danger">{error.teamServicesTitle}</span>}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                  <label htmlFor="teamServicesSubTitle">Team Services Sub Title</label>
                  <input type="text" className="form-control" id="teamServicesSubTitle" value={teamServicesSubTitle}
                    onChange={(e) => { setTeamServicesSubTitle(e.target.value); clearErrorForField("teamServicesSubTitle"); }} placeholder="Enter Team Services Sub Title" />
                  {error.teamServicesSubTitle && <span className="text-danger">{error.teamServicesSubTitle}</span>}
                </div>
              </div>
              <div className="col-lg-12">
                <div className="my_profile_setting_textarea form-group">
                  <label htmlFor="teamServicesDescription">Team Services Description</label>
                  <textarea id="teamServicesDescription" className="form-control" rows="7" value={teamServicesDescription}
                    onChange={(e) => { setTeamServicesDescription(e.target.value); clearErrorForField("teamServicesDescription"); }} placeholder="Enter team services description"></textarea>
                  {error.teamServicesDescription && <span className="text-danger">{error.teamServicesDescription}</span>}
                </div>
              </div>
            </>
          )}
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
                <div className="col-12" key={section.id || index}>
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
                      <input type="file" id="customSoftwareImage" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif" onChange={handleCustomSoftwareImageChange} />
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
                <div className="col-12" key={step.id || index}>
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

        {/* ── Meta Information ───────────────────────────────────── */}
        <SectionCard id="sec-meta" title="Meta Information" accentColor="#A3B18A">
          <div className="col-lg-12">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="servicesMetatitle">Meta Title</label>
              <input type="text" className="form-control" id="servicesMetatitle" value={metatitle}
                onChange={(e) => { setMetatitle(e.target.value); clearErrorForField("metatitle"); }} />
              {error.metatitle && <span className="text-danger">{error.metatitle}</span>}
            </div>
          </div>
          <div className="col-lg-12">
            <div className="my_profile_setting_textarea form-group">
              <label htmlFor="servicesMetaDescription">Meta Description</label>
              <textarea id="servicesMetaDescription" className="form-control" rows="7" value={metadescription}
                onChange={(e) => { setMetaDescription(e.target.value); clearErrorForField("metadescription"); }} placeholder="Enter meta description"></textarea>
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
          <button className="btn btn1" type="button" onClick={() => (window.location.href = "/thebusinesshub/dashboard")}>
            ← Back
          </button>
          <button type="submit" className="btn btn2" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Submit"}
          </button>
        </div>

      </form>
    </>
  );
};

export default CreateList;

const Services = require("../models/servicesModel.js");
const revalidateFrontend = require("../utils/revalidateFrontend");
const Servicesprocess = require("../models/servicesprocessModel.js");
const Servicesservice = require("../models/servicesserviceModel.js");
const Servicestechnology = require("../models/servicesttechnologyModel.js");
const Servicestindustry = require("../models/servicestindustryModel.js");
const Servicestwhatweoffer = require("../models/servicestwhatweofferModel.js");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId.js");
const { uploadPhoto, servicesImgResize, processServices, processServicesGet, servicesServices, ServicesStepGet } = require("../middlewares/uploadImage.js");
const slugify = require("slugify");

const parseFaqsFromBody = (body = {}) => {
  if (Array.isArray(body.faqs)) {
    return body.faqs
      .map((faq, index) => ({
        title: String(faq?.title || "").trim(),
        description: String(faq?.description || "").trim(),
        order: Number.isFinite(Number(faq?.order)) ? Number(faq.order) : index,
        status: faq?.status !== false,
      }))
      .filter((faq) => faq.title || faq.description);
  }

  const faqs = [];
  Object.entries(body).forEach(([key, value]) => {
    const match = key.match(/^faqs\[(\d+)]\[(title|description|order|status)]$/);
    if (!match) return;
    const [, index, field] = match;
    const idx = parseInt(index, 10);
    if (!faqs[idx]) faqs[idx] = {};
    faqs[idx][field] = value;
  });

  return faqs
    .filter(Boolean)
    .map((faq, index) => ({
      title: String(faq?.title || "").trim(),
      description: String(faq?.description || "").trim(),
      order: Number.isFinite(Number(faq?.order)) ? Number(faq.order) : index,
      status: String(faq?.status ?? "true").toLowerCase() !== "false",
    }))
    .filter((faq) => faq.title || faq.description);
};

const createServices = asyncHandler(async (req, res) => {
  try {

    if (req.files) {
      const selectedImgslogo = req.files?.filter(file => file.fieldname === "logo");
      if (Array.isArray(selectedImgslogo) && selectedImgslogo.length > 0) {
        const processedImages = await servicesImgResize(selectedImgslogo);


        if (processedImages.length > 0) {
          // ✅ Append logo filename to req.body
          req.body.logoimage = "public/images/services/" + processedImages[0];
        }
      }
      const selectedImgsserviceslogo = req.files?.filter(file => file.fieldname === "serviceslogo");
      if (Array.isArray(selectedImgsserviceslogo) && selectedImgsserviceslogo.length > 0) {
        const processedImages2 = await servicesImgResize(selectedImgsserviceslogo);
        if (processedImages2.length > 0) {
          // ✅ Append logo filename to req.body
          req.body.servicesimage = "public/images/services/" + processedImages2[0];
        }
      }
      const selectedImgsaboutimage = req.files?.filter(file => file.fieldname === "aboutimage");

      if (Array.isArray(selectedImgsaboutimage) && selectedImgsaboutimage.length > 0) {
        const processedImages3 = await servicesImgResize(selectedImgsaboutimage);


        if (processedImages3.length > 0) {
          // ✅ Append logo filename to req.body
          req.body.aboutimage = "public/images/services/" + processedImages3[0];
        }
      }
      const selectedImgspeopleimage = req.files?.filter(file => file.fieldname === "peopleimage");

      if (Array.isArray(selectedImgspeopleimage) && selectedImgspeopleimage.length > 0) {
        const processedImages4 = await servicesImgResize(selectedImgspeopleimage);


        if (processedImages4.length > 0) {
          // ✅ Append people image filename to req.body
          req.body.peopleimage = "public/images/services/" + processedImages4[0];
        }
      }
      const selectedImgsFrontendTechnology = req.files?.filter(file => file.fieldname === "frontendtechnologyimage");
      if (Array.isArray(selectedImgsFrontendTechnology) && selectedImgsFrontendTechnology.length > 0) {
        const processedImages5 = await servicesImgResize(selectedImgsFrontendTechnology);
        if (processedImages5.length > 0) {
          req.body.frontendtechnologyimage = "public/images/services/" + processedImages5[0];
        }
      }
      const selectedImgsBackendTechnology = req.files?.filter(file => file.fieldname === "backendtechnologyimage");
      if (Array.isArray(selectedImgsBackendTechnology) && selectedImgsBackendTechnology.length > 0) {
        const processedImages6 = await servicesImgResize(selectedImgsBackendTechnology);
        if (processedImages6.length > 0) {
          req.body.backendtechnologyimage = "public/images/services/" + processedImages6[0];
        }
      }
      const selectedImgsDatabaseTechnology = req.files?.filter(file => file.fieldname === "databasetechnologyimage");
      if (Array.isArray(selectedImgsDatabaseTechnology) && selectedImgsDatabaseTechnology.length > 0) {
        const processedImages7 = await servicesImgResize(selectedImgsDatabaseTechnology);
        if (processedImages7.length > 0) {
          req.body.databasetechnologyimage = "public/images/services/" + processedImages7[0];
        }
      }
      const selectedImgsCustomSoftware = req.files?.filter(file => file.fieldname === "customsoftwareimage");
      if (Array.isArray(selectedImgsCustomSoftware) && selectedImgsCustomSoftware.length > 0) {
        const processedImages8 = await servicesImgResize(selectedImgsCustomSoftware);
        if (processedImages8.length > 0) {
          req.body.customSoftwareImage = "public/images/services/" + processedImages8[0];
        }
      }
    }
    req.body.slug = slugify(req.body.slug.toLowerCase());
    req.body.faqs = parseFaqsFromBody(req.body);

    // Parse scrollSpyNavSections from FormData
    let scrollSpyNavSectionsArray = [];
    if (Array.isArray(req.body.scrollSpyNavSections)) {
      scrollSpyNavSectionsArray = req.body.scrollSpyNavSections;
    } else {
      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^scrollSpyNavSections\[(\d+)]\[(id|title)]$/);
        if (match) {
          const [, index, field] = match;
          const idx = parseInt(index);
          if (!scrollSpyNavSectionsArray[idx]) scrollSpyNavSectionsArray[idx] = {};
          scrollSpyNavSectionsArray[idx][field] = value;
        }
      });
    }
    if (scrollSpyNavSectionsArray.length > 0) {
      req.body.scrollSpyNavSections = scrollSpyNavSectionsArray.filter(section => section.id && section.title);
    }

    // Process customSoftwareStep icons from files
    const customSoftwareStepIcons = [];
    if (req.files && Object.keys(req.files).length > 0) {
      (req.files || []).forEach((file) => {
        const match = file.fieldname.match(/^customSoftwareStepIcon\[(\d+)]$/);
        if (match) {
          const index = parseInt(match[1]);
          customSoftwareStepIcons[index] = file;
        }
      });
    }

    // Parse customSoftwareSteps from FormData
    let customSoftwareStepsArray = [];
    if (Array.isArray(req.body.customSoftwareSteps)) {
      customSoftwareStepsArray = req.body.customSoftwareSteps;
    } else {
      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^customSoftwareSteps\[(\d+)]\[(title|description|iconAlt)]$/);
        if (match) {
          const [, index, field] = match;
          const idx = parseInt(index);
          if (!customSoftwareStepsArray[idx]) customSoftwareStepsArray[idx] = {};
          customSoftwareStepsArray[idx][field] = value;
        }
      });
    }

    // Process icon images and add to steps
    for (let i = 0; i < customSoftwareStepsArray.length; i++) {
      if (customSoftwareStepIcons[i]) {
        const processedIcon = await servicesImgResize([customSoftwareStepIcons[i]]);
        if (processedIcon?.length > 0) {
          customSoftwareStepsArray[i].icon = "public/images/services/" + processedIcon[0];
        }
      }
    }

    if (customSoftwareStepsArray.length > 0) {
      req.body.customSoftwareSteps = customSoftwareStepsArray.filter(step => step.title || step.description);
    }

    const newServices = await Services.create(req.body);
    const processnew = [];
    if (req.files && Object.keys(req.files).length > 0) {

      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^process\[(\d+)]\[(\w+)]$/);
        if (match) {
          const [, index, field] = match;
          if (!processnew[index]) processnew[index] = {};
          processnew[index][field] = value;
        }
      });


      (req.files || []).forEach((file) => {
        const match = file.fieldname.match(/^process\[(\d+)]\[imagestep]$/);
        if (match) {
          const index = parseInt(match[1]);
          if (!processnew[index]) processnew[index] = {};
          processnew[index].processnew = file;
        }
      });
    }
    // Now process each floor plan
    for (let i = 0; i < req.body.process?.length; i++) {
      const process = req.body.process[i];
      const processimage = processnew[i];
      if (process) {
        const processdata = {
          title: process.titlestep,
          description: process.descriptionstep,
          servicesid: newServices._id,
        };


        if (processimage) {

          const processedImages = await processServices(processimage); // assumes it returns [{url: "..."}]
          if (processedImages?.length > 0) {
            processdata.imageurl = processedImages[0].url;
          }
        }

        const newPropertyplan = await Servicesprocess.create(processdata);


      }
    }

    const servicesnew = [];
    if (req.files && Object.keys(req.files).length > 0) {

      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^services\[(\d+)]\[(\w+)]$/);
        if (match) {
          const [, index, field] = match;
          if (!servicesnew[index]) servicesnew[index] = {};
          servicesnew[index][field] = value;
        }
      });


      (req.files || []).forEach((file) => {
        const match = file.fieldname.match(/^services\[(\d+)]\[imagestep]$/);
        if (match) {
          const index = parseInt(match[1]);
          if (!servicesnew[index]) servicesnew[index] = {};
          servicesnew[index].servicesnew = file;
        }
      });
    }

    for (var i = 0; i < req.body.services?.length; i++) {


      var servicesdata = {
        "title": req.body.services[i].titlestep,
        "description": req.body.services[i].descriptionstep,
        "imagealt": req.body.services[i].imagealt || "",
        "servicesid": newServices._id
      }
      const servicesimage = servicesnew[i];
      if (servicesimage && servicesimage.servicesnew) {
        // console.log(servicesimage);
        // console.log("servicesimage");
        const reqObj = { servicesnew: servicesimage.servicesnew };
        const servicesImages = await servicesServices(reqObj);
        if (servicesImages?.length > 0) {
          servicesdata.imageurl = servicesImages[0].url;
        }
      }


      const newPropertyplan = await Servicesservice.create(servicesdata);
    }
    // Process technology steps for create
    let frontendTechnologynew = [];
    let backendTechnologynew = [];
    let databaseTechnologynew = [];

    // Check if data is already parsed as arrays (from JSON body) or needs parsing from FormData
    if (Array.isArray(req.body.frontendtechnology)) {
      frontendTechnologynew = req.body.frontendtechnology;
    } else {
      // Parse from FormData
      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^frontendtechnology\[(\d+)]\[([^\]]+)]$/);
        if (match) {
          const [, index, field] = match;
          const idx = parseInt(index);
          if (!frontendTechnologynew[idx]) frontendTechnologynew[idx] = {};
          frontendTechnologynew[idx][field] = value;
        }
      });
    }

    if (Array.isArray(req.body.backendtechnology)) {
      backendTechnologynew = req.body.backendtechnology;
    } else {
      // Parse from FormData
      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^backendtechnology\[(\d+)]\[([^\]]+)]$/);
        if (match) {
          const [, index, field] = match;
          const idx = parseInt(index);
          if (!backendTechnologynew[idx]) backendTechnologynew[idx] = {};
          backendTechnologynew[idx][field] = value;
        }
      });
    }

    if (Array.isArray(req.body.databasetechnology)) {
      databaseTechnologynew = req.body.databasetechnology;
    } else {
      // Parse from FormData
      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^databasetechnology\[(\d+)]\[([^\]]+)]$/);
        if (match) {
          const [, index, field] = match;
          const idx = parseInt(index);
          if (!databaseTechnologynew[idx]) databaseTechnologynew[idx] = {};
          databaseTechnologynew[idx][field] = value;
        }
      });
    }

    // Convert sparse arrays to dense arrays and create frontend technology steps
    const frontendStepsDense = frontendTechnologynew.filter(step => step !== undefined && step !== null);
    for (let i = 0; i < frontendStepsDense.length; i++) {
      const step = frontendStepsDense[i];
      if (step && (step.titlestep || step.descriptionstep)) {
        const technologydata = {
          title: step.titlestep || "",
          description: step.descriptionstep || "",
          section: step.section || "frontend",
          servicesid: newServices._id,
        };
        await Servicestechnology.create(technologydata);
      }
    }

    // Convert sparse arrays to dense arrays and create backend technology steps
    const backendStepsDense = backendTechnologynew.filter(step => step !== undefined && step !== null);
    for (let i = 0; i < backendStepsDense.length; i++) {
      const step = backendStepsDense[i];
      if (step && (step.titlestep || step.descriptionstep)) {
        const technologydata = {
          title: step.titlestep || "",
          description: step.descriptionstep || "",
          section: step.section || "backend",
          servicesid: newServices._id,
        };
        await Servicestechnology.create(technologydata);
      }
    }

    // Convert sparse arrays to dense arrays and create database technology steps
    const databaseStepsDense = databaseTechnologynew.filter(step => step !== undefined && step !== null);
    for (let i = 0; i < databaseStepsDense.length; i++) {
      const step = databaseStepsDense[i];
      if (step && (step.titlestep || step.descriptionstep)) {
        const technologydata = {
          title: step.titlestep || "",
          description: step.descriptionstep || "",
          section: step.section || "database",
          servicesid: newServices._id,
        };
        await Servicestechnology.create(technologydata);
      }
    }

    // Process industry steps for create
    const industrynew = [];
    if (req.files && Object.keys(req.files).length > 0) {
      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^industry\[(\d+)]\[(\w+)]$/);
        if (match) {
          const [, index, field] = match;
          if (!industrynew[index]) industrynew[index] = {};
          industrynew[index][field] = value;
        }
      });

      (req.files || []).forEach((file) => {
        const match = file.fieldname.match(/^industry\[(\d+)]\[imagestep]$/);
        if (match) {
          const index = parseInt(match[1]);
          if (!industrynew[index]) industrynew[index] = {};
          industrynew[index].industrynew = file;
        }
      });
    }

    for (var i = 0; i < req.body.industry?.length; i++) {
      var industrydata = {
        "title": req.body.industry[i].titlestep,
        "description": req.body.industry[i].descriptionstep,
        "imagealt": req.body.industry[i].imagealt || "",
        "servicesid": newServices._id
      }
      const industryimage = industrynew[i];
      if (industryimage && industryimage.industrynew) {
        const reqObj = { servicesnew: industryimage.industrynew };
        const processedImages = await servicesServices(reqObj);
        if (processedImages?.length > 0) {
          industrydata.imageurl = processedImages[0].url;
        }
      }
      await Servicestindustry.create(industrydata);
    }

    // Process whatweoffer steps for create
    const whatweoffernew = [];
    if (req.files && Object.keys(req.files).length > 0) {
      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^whatweoffer\[(\d+)]\[(\w+)]$/);
        if (match) {
          const [, index, field] = match;
          if (!whatweoffernew[index]) whatweoffernew[index] = {};
          whatweoffernew[index][field] = value;
        }
      });

      (req.files || []).forEach((file) => {
        const match = file.fieldname.match(/^whatweoffer\[(\d+)]\[imagestep]$/);
        if (match) {
          const index = parseInt(match[1]);
          if (!whatweoffernew[index]) whatweoffernew[index] = {};
          whatweoffernew[index].whatweoffernew = file;
        }
      });
    }

    for (var i = 0; i < req.body.whatweoffer?.length; i++) {
      var whatweofferdata = {
        "tag": req.body.whatweoffer[i].tagstep || "",
        "title": req.body.whatweoffer[i].titlestep,
        "description": req.body.whatweoffer[i].descriptionstep,
        "link": req.body.whatweoffer[i].linkstep || "",
        "imagealt": req.body.whatweoffer[i].imagealt || "",
        "servicesid": newServices._id
      }
      const whatweofferimage = whatweoffernew[i];
      if (whatweofferimage && whatweofferimage.whatweoffernew) {
        const reqObj = { servicesnew: whatweofferimage.whatweoffernew };
        const processedImages = await servicesServices(reqObj);
        if (processedImages?.length > 0) {
          whatweofferdata.imageurl = processedImages[0].url;
        }
      }
      await Servicestwhatweoffer.create(whatweofferdata);
    }

    revalidateFrontend({ slug: newServices.slug, type: "service" }).catch(() => {});
    const message = {
      "status": "success",
      "message": "Data Add sucessfully",
      "data": newServices
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const updateServices = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {


    if (req.files) {
      const selectedImgslogo = req.files?.filter(file => file.fieldname === "logo");
      if (Array.isArray(selectedImgslogo) && selectedImgslogo.length > 0) {
        const processedImages = await servicesImgResize(selectedImgslogo);


        if (processedImages.length > 0) {
          // ✅ Append logo filename to req.body
          req.body.logoimage = "public/images/services/" + processedImages[0];
        }
      }
      const selectedImgsserviceslogo = req.files?.filter(file => file.fieldname === "serviceslogo");
      if (Array.isArray(selectedImgsserviceslogo) && selectedImgsserviceslogo.length > 0) {
        const processedImages = await servicesImgResize(selectedImgsserviceslogo);
        if (processedImages.length > 0) {

          // ✅ Append logo filename to req.body
          req.body.servicesimage = "public/images/services/" + processedImages[0];
        }
      }

      const selectedImgsaboutimage = req.files?.filter(file => file.fieldname === "aboutimage");

      if (Array.isArray(selectedImgsaboutimage) && selectedImgsaboutimage.length > 0) {
        const processedImages3 = await servicesImgResize(selectedImgsaboutimage);


        if (processedImages3.length > 0) {
          // ✅ Append logo filename to req.body
          req.body.aboutimage = "public/images/services/" + processedImages3[0];
        }
      } else if (req.body.aboutimage === "" || req.body.aboutimage === null || req.body.aboutimage === undefined) {
        // If aboutimage is empty string, null, or undefined, delete the image
        req.body.aboutimage = "";
      }
      const selectedImgspeopleimage = req.files?.filter(file => file.fieldname === "peopleimage");

      if (Array.isArray(selectedImgspeopleimage) && selectedImgspeopleimage.length > 0) {
        const processedImages4 = await servicesImgResize(selectedImgspeopleimage);


        if (processedImages4.length > 0) {
          // ✅ Append people image filename to req.body
          req.body.peopleimage = "public/images/services/" + processedImages4[0];
        }
      }
      const selectedImgsFrontendTechnology = req.files?.filter(file => file.fieldname === "frontendtechnologyimage");
      if (Array.isArray(selectedImgsFrontendTechnology) && selectedImgsFrontendTechnology.length > 0) {
        const processedImages5 = await servicesImgResize(selectedImgsFrontendTechnology);
        if (processedImages5.length > 0) {
          req.body.frontendtechnologyimage = "public/images/services/" + processedImages5[0];
        }
      }
      const selectedImgsBackendTechnology = req.files?.filter(file => file.fieldname === "backendtechnologyimage");
      if (Array.isArray(selectedImgsBackendTechnology) && selectedImgsBackendTechnology.length > 0) {
        const processedImages6 = await servicesImgResize(selectedImgsBackendTechnology);
        if (processedImages6.length > 0) {
          req.body.backendtechnologyimage = "public/images/services/" + processedImages6[0];
        }
      }
      const selectedImgsDatabaseTechnology = req.files?.filter(file => file.fieldname === "databasetechnologyimage");
      if (Array.isArray(selectedImgsDatabaseTechnology) && selectedImgsDatabaseTechnology.length > 0) {
        const processedImages7 = await servicesImgResize(selectedImgsDatabaseTechnology);
        if (processedImages7.length > 0) {
          req.body.databasetechnologyimage = "public/images/services/" + processedImages7[0];
        }
      }
      const selectedImgsCustomSoftware = req.files?.filter(file => file.fieldname === "customsoftwareimage");
      if (Array.isArray(selectedImgsCustomSoftware) && selectedImgsCustomSoftware.length > 0) {
        const processedImages8 = await servicesImgResize(selectedImgsCustomSoftware);
        if (processedImages8.length > 0) {
          req.body.customSoftwareImage = "public/images/services/" + processedImages8[0];
        }
      }
    }
    req.body.slug = slugify(req.body.slug.toLowerCase());
    req.body.faqs = parseFaqsFromBody(req.body);

    // Parse scrollSpyNavSections from FormData
    let scrollSpyNavSectionsArray = [];
    if (Array.isArray(req.body.scrollSpyNavSections)) {
      scrollSpyNavSectionsArray = req.body.scrollSpyNavSections;
    } else {
      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^scrollSpyNavSections\[(\d+)]\[(id|title)]$/);
        if (match) {
          const [, index, field] = match;
          const idx = parseInt(index);
          if (!scrollSpyNavSectionsArray[idx]) scrollSpyNavSectionsArray[idx] = {};
          scrollSpyNavSectionsArray[idx][field] = value;
        }
      });
    }
    if (scrollSpyNavSectionsArray.length > 0) {
      req.body.scrollSpyNavSections = scrollSpyNavSectionsArray.filter(section => section.id && section.title);
    }

    // Process customSoftwareStep icons from files
    const customSoftwareStepIcons = [];
    if (req.files && Object.keys(req.files).length > 0) {
      (req.files || []).forEach((file) => {
        const match = file.fieldname.match(/^customSoftwareStepIcon\[(\d+)]$/);
        if (match) {
          const index = parseInt(match[1]);
          customSoftwareStepIcons[index] = file;
        }
      });
    }

    // Parse customSoftwareSteps from FormData
    let customSoftwareStepsArray = [];
    if (Array.isArray(req.body.customSoftwareSteps)) {
      customSoftwareStepsArray = req.body.customSoftwareSteps;
    } else {
      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^customSoftwareSteps\[(\d+)]\[(title|description|iconAlt)]$/);
        if (match) {
          const [, index, field] = match;
          const idx = parseInt(index);
          if (!customSoftwareStepsArray[idx]) customSoftwareStepsArray[idx] = {};
          customSoftwareStepsArray[idx][field] = value;
        }
      });
    }

    // Process icon images and add to steps
    for (let i = 0; i < customSoftwareStepsArray.length; i++) {
      if (customSoftwareStepIcons[i]) {
        const processedIcon = await servicesImgResize([customSoftwareStepIcons[i]]);
        if (processedIcon?.length > 0) {
          customSoftwareStepsArray[i].icon = "public/images/services/" + processedIcon[0];
        }
      } else if (customSoftwareStepsArray[i] && !customSoftwareStepsArray[i].icon) {
        // Keep existing icon if no new file uploaded
        const existingStep = await Services.findById(id).lean();
        if (existingStep?.customSoftwareSteps?.[i]?.icon) {
          customSoftwareStepsArray[i].icon = existingStep.customSoftwareSteps[i].icon;
        }
      }
    }

    if (customSoftwareStepsArray.length > 0) {
      req.body.customSoftwareSteps = customSoftwareStepsArray.filter(step => step.title || step.description);
    }

    const updatedServices = await Services.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    const processnew = [];
    if (req.files && Object.keys(req.files).length > 0) {

      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^process\[(\d+)]\[(\w+)]$/);
        if (match) {
          const [, index, field] = match;
          if (!processnew[index]) processnew[index] = {};
          processnew[index][field] = value;
        }
      });


      (req.files || []).forEach((file) => {
        const match = file.fieldname.match(/^process\[(\d+)]\[imagestep]$/);
        if (match) {
          const index = parseInt(match[1]);
          if (!processnew[index]) processnew[index] = {};
          processnew[index].processnew = file;
        }
      });
    }
    // Now process each floor plan
    for (let i = 0; i < req.body.process?.length; i++) {
      const process = req.body.process[i];
      const processimage = processnew[i];
      if (process) {
        const processdata = {
          title: process.titlestep,
          description: process.descriptionstep,
          servicesid: updatedServices._id,
        };


        if (processimage) {
          // console.log(processimage);
          // console.log("processimage");
          const processedImages = await processServices(processimage); // assumes it returns [{url: "..."}]
          if (processedImages?.length > 0) {
            processdata.imageurl = processedImages[0].url;
          }
        }

        const newPropertyplan = await Servicesprocess.create(processdata);


      }
    }


    // update get process

    const processnewget = [];
    const servicesstepnew = [];
    const servicesstepgetnew = [];
    if (req.files && Object.keys(req.files).length > 0) {

      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^processget\[(\d+)]\[(\w+)]$/);
        if (match) {
          const [, index, field] = match;
          if (!processnewget[index]) processnewget[index] = {};
          processnewget[index][field] = value;
        }
      });


      (req.files || []).forEach((file) => {
        const match = file.fieldname.match(/^processget\[(\d+)]\[imagestep]$/);
        if (match) {
          const index = parseInt(match[1]);
          if (!processnewget[index]) processnewget[index] = {};
          processnewget[index].processnewget = file;
        }
      });



      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^services\[(\d+)]\[(\w+)]$/);
        if (match) {
          const [, index, field] = match;
          if (!servicesstepnew[index]) servicesstepnew[index] = {};
          servicesstepnew[index][field] = value;
        }
      });


      (req.files || []).forEach((file) => {
        const match = file.fieldname.match(/^services\[(\d+)]\[imagestep]$/);
        if (match) {
          const index = parseInt(match[1]);
          if (!servicesstepnew[index]) servicesstepnew[index] = {};
          servicesstepnew[index].servicesstepnew = file;
        }
      });

      // services step get 

      // console.log("req.body keys:", Object.keys(req.body));
      console.log("req.body.servicesget:", req.body.servicesget);
      // console.log("Looking for servicesget pattern...");

      // First, check if servicesget is already parsed as a nested object/array
      if (req.body.servicesget && Array.isArray(req.body.servicesget)) {
        // console.log("servicesget is already an array:", req.body.servicesget);
        req.body.servicesget.forEach((step, index) => {
          if (step && typeof step === 'object') {
            servicesstepgetnew[index] = {
              titlestep: step.titlestep || '',
              descriptionstep: step.descriptionstep || '',
              _id: step._id || null
            };
          }
        });
      }

      // Try multiple patterns to match different possible key formats from flat keys
      Object.entries(req.body).forEach(([key, value]) => {
        // Skip if we already processed this as nested object
        if (key === 'servicesget' && Array.isArray(value)) {
          return;
        }

        // console.log("Checking key:", key, "value:", value);

        // Pattern 1: servicesget[0][titlestep] - escaped brackets
        let match = key.match(/^servicesget\[(\d+)\]\[(\w+)\]$/);

        // Pattern 2: Check for URL encoded brackets
        if (!match) {
          try {
            const decodedKey = decodeURIComponent(key);
            if (decodedKey !== key) {
              match = decodedKey.match(/^servicesget\[(\d+)\]\[(\w+)\]$/);
            }
          } catch (e) {
            // Ignore decode errors
          }
        }

        // console.log("match", match, "for key:", key);

        if (match) {
          const [, index, field] = match;
          const indexNum = parseInt(index, 10);
          if (!servicesstepgetnew[indexNum]) servicesstepgetnew[indexNum] = {};
          servicesstepgetnew[indexNum][field] = value;
          // console.log("Matched! index:", indexNum, "field:", field, "value:", value);
        }
      });

      // console.log("servicesstepgetnew after parsing:", JSON.stringify(servicesstepgetnew, null, 2));


      (req.files || []).forEach((file) => {
        const match = file.fieldname.match(/^servicesget\[(\d+)]\[imagestep]$/);
        if (match) {
          const index = parseInt(match[1]);
          if (!servicesstepgetnew[index]) servicesstepgetnew[index] = {};
          servicesstepgetnew[index].servicesstepgetnew = file;
        }
      });
    }
    // Now process each floor plan
    for (let i = 0; i < req.body.processget?.length; i++) {
      const process = req.body.processget[i];
      const processimage = processnewget[i];
      // console.log(processimage);
      //   console.log("processget processedImages");
      if (process) {
        const processdata = {
          title: process.titlestep,
          description: process.descriptionstep
        };


        if (processimage) {
          const processedImages = await processServicesGet(processimage); // assumes it returns [{url: "..."}]
          // console.log(processedImages);
          // console.log("processedImagesprocessedImages processedImages");
          if (processedImages?.length > 0) {
            processdata.imageurl = processedImages[0].url;
          }
        }
        const updatedPropertyplan = await Servicesprocess.findByIdAndUpdate(process.processid, processdata, {
          new: true,
        });
        // const newPropertyplan = await Servicesprocess.create(processdata);


      }
    }
    // end update get process


    for (var i = 0; i < req.body.services?.length; i++) {
      const servicesstep = req.body.services[i];
      const servicesstepimage = servicesstepnew[i];
      // console.log(servicesstepimage);
      //   console.log("servicesstepimage servicesstepimage");
      if (servicesstep) {
        const servicesdata = {
          "title": req.body.services[i].titlestep,
          "description": req.body.services[i].descriptionstep,
          "imagealt": req.body.services[i].imagealt || "",
          "servicesid": updatedServices._id
        };

        if (servicesstepimage && servicesstepimage.servicesstepnew) {
          const reqObj = { servicesnew: servicesstepimage.servicesstepnew };
          const processedImages = await servicesServices(reqObj);
          // console.log(processedImages);
          // console.log("processedImagesprocessedImages processedImages");
          if (processedImages && processedImages.length > 0) {
            servicesdata.imageurl = processedImages[0].url;
          }
        }
        // var servicesdata={
        //     "title":req.body.services[i].titlestep,
        //     "description":req.body.services[i].descriptionstep,
        //     "servicesid":updatedServices._id
        // }


        const newPropertyplan = await Servicesservice.create(servicesdata);
      }
    }

    for (var i = 0; i < req.body.servicesget?.length; i++) {

      const servicesstepget = req.body.servicesget[i];
      const servicesstepimageget = servicesstepgetnew[i];
      // console.log(servicesstepimageget);
      //   console.log("servicesstepget");
      if (servicesstepget) {
        const servicesdata = {
          "title": req.body.servicesget[i].titlestep,
          "description": req.body.servicesget[i].descriptionstep,
          "imagealt": req.body.servicesget[i].imagealt || "",
          "servicesid": updatedServices._id
        };

        if (servicesstepimageget && servicesstepimageget.servicesstepgetnew) {
          const reqObj = { servicesget: servicesstepimageget.servicesstepgetnew };
          const processedImages = await ServicesStepGet(reqObj);
          // console.log(processedImages);
          // console.log("processedImagesprocessedImagesget processedImagesget");
          if (processedImages && processedImages.length > 0) {
            servicesdata.imageurl = processedImages[0].url;
          }
        } else {
          // Preserve existing imageurl if no new image is uploaded
          const existingStep = await Servicesservice.findById(req.body.servicesget[i]._id);
          if (existingStep && existingStep.imageurl) {
            servicesdata.imageurl = existingStep.imageurl;
          }
        }
        // console.log("servicesdata",servicesdata)
        // Use _id from servicesstepgetnew or req.body.servicesget[i]._id
        const stepId = servicesstepgetnew[i]?._id || req.body.servicesget[i]?._id;
        if (stepId) {
          const updatedPropertyplan = await Servicesservice.findByIdAndUpdate(stepId, servicesdata, {
            new: true,
          });
        } else {
          console.error(`No _id found for servicesget step at index ${i}`);
        }
      }
    }

    // Process technology steps for update
    let frontendTechnologystepnew = [];
    let backendTechnologystepnew = [];
    let databaseTechnologystepnew = [];

    // Check if data is already parsed as arrays (from JSON body) or needs parsing from FormData
    if (Array.isArray(req.body.frontendtechnology)) {
      frontendTechnologystepnew = req.body.frontendtechnology;
    } else {
      // Parse from FormData
      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^frontendtechnology\[(\d+)]\[([^\]]+)]$/);
        if (match) {
          const [, index, field] = match;
          const idx = parseInt(index);
          if (!frontendTechnologystepnew[idx]) frontendTechnologystepnew[idx] = {};
          frontendTechnologystepnew[idx][field] = value;
        }
      });
    }

    if (Array.isArray(req.body.backendtechnology)) {
      backendTechnologystepnew = req.body.backendtechnology;
    } else {
      // Parse from FormData
      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^backendtechnology\[(\d+)]\[([^\]]+)]$/);
        if (match) {
          const [, index, field] = match;
          const idx = parseInt(index);
          if (!backendTechnologystepnew[idx]) backendTechnologystepnew[idx] = {};
          backendTechnologystepnew[idx][field] = value;
        }
      });
    }

    if (Array.isArray(req.body.databasetechnology)) {
      databaseTechnologystepnew = req.body.databasetechnology;
    } else {
      // Parse from FormData
      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^databasetechnology\[(\d+)]\[([^\]]+)]$/);
        if (match) {
          const [, index, field] = match;
          const idx = parseInt(index);
          if (!databaseTechnologystepnew[idx]) databaseTechnologystepnew[idx] = {};
          databaseTechnologystepnew[idx][field] = value;
        }
      });
    }

    // Get all existing technology steps for this service
    const existingTechSteps = await Servicestechnology.find({ servicesid: updatedServices._id });
    const existingFrontendIds = existingTechSteps.filter(s => s.section === 'frontend').map(s => s._id.toString());
    const existingBackendIds = existingTechSteps.filter(s => s.section === 'backend').map(s => s._id.toString());
    const existingDatabaseIds = existingTechSteps.filter(s => s.section === 'database').map(s => s._id.toString());

    // Collect IDs of steps being updated/created
    const submittedFrontendIds = [];
    const submittedBackendIds = [];
    const submittedDatabaseIds = [];

    // Process frontend technology steps (update existing or create new)
    // Convert sparse array to dense array
    const frontendStepsDense = frontendTechnologystepnew.filter(step => step !== undefined && step !== null);
    for (let i = 0; i < frontendStepsDense.length; i++) {
      const step = frontendStepsDense[i];
      if (step && (step.titlestep || step.descriptionstep)) {
        const technologydata = {
          title: step.titlestep || "",
          description: step.descriptionstep || "",
          section: step.section || "frontend",
          servicesid: updatedServices._id,
        };

        // If _id exists, update existing step; otherwise create new
        if (step._id) {
          submittedFrontendIds.push(step._id.toString());
          await Servicestechnology.findByIdAndUpdate(step._id, technologydata, { new: true });
        } else {
          const newStep = await Servicestechnology.create(technologydata);
          submittedFrontendIds.push(newStep._id.toString());
        }
      }
    }

    // Delete frontend steps that are no longer in the form
    const frontendIdsToDelete = existingFrontendIds.filter(id => !submittedFrontendIds.includes(id));
    if (frontendIdsToDelete.length > 0) {
      await Servicestechnology.deleteMany({ _id: { $in: frontendIdsToDelete } });
    }

    // Process backend technology steps (update existing or create new)
    // Convert sparse array to dense array
    const backendStepsDense = backendTechnologystepnew.filter(step => step !== undefined && step !== null);
    for (let i = 0; i < backendStepsDense.length; i++) {
      const step = backendStepsDense[i];
      if (step && (step.titlestep || step.descriptionstep)) {
        const technologydata = {
          title: step.titlestep || "",
          description: step.descriptionstep || "",
          section: step.section || "backend",
          servicesid: updatedServices._id,
        };

        // If _id exists, update existing step; otherwise create new
        if (step._id) {
          submittedBackendIds.push(step._id.toString());
          await Servicestechnology.findByIdAndUpdate(step._id, technologydata, { new: true });
        } else {
          const newStep = await Servicestechnology.create(technologydata);
          submittedBackendIds.push(newStep._id.toString());
        }
      }
    }

    // Delete backend steps that are no longer in the form
    const backendIdsToDelete = existingBackendIds.filter(id => !submittedBackendIds.includes(id));
    if (backendIdsToDelete.length > 0) {
      await Servicestechnology.deleteMany({ _id: { $in: backendIdsToDelete } });
    }

    // Process database technology steps (update existing or create new)
    // Convert sparse array to dense array
    const databaseStepsDense = databaseTechnologystepnew.filter(step => step !== undefined && step !== null);
    for (let i = 0; i < databaseStepsDense.length; i++) {
      const step = databaseStepsDense[i];
      if (step && (step.titlestep || step.descriptionstep)) {
        const technologydata = {
          title: step.titlestep || "",
          description: step.descriptionstep || "",
          section: step.section || "database",
          servicesid: updatedServices._id,
        };

        // If _id exists, update existing step; otherwise create new
        if (step._id) {
          submittedDatabaseIds.push(step._id.toString());
          await Servicestechnology.findByIdAndUpdate(step._id, technologydata, { new: true });
        } else {
          const newStep = await Servicestechnology.create(technologydata);
          submittedDatabaseIds.push(newStep._id.toString());
        }
      }
    }

    // Delete database steps that are no longer in the form
    const databaseIdsToDelete = existingDatabaseIds.filter(id => !submittedDatabaseIds.includes(id));
    if (databaseIdsToDelete.length > 0) {
      await Servicestechnology.deleteMany({ _id: { $in: databaseIdsToDelete } });
    }

    // Process industry steps
    let industrystepnew = [];

    // Check if data is already parsed as arrays (from JSON body) or needs parsing from FormData
    if (Array.isArray(req.body.industry)) {
      industrystepnew = req.body.industry;
    } else {
      // Parse from FormData
      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^industry\[(\d+)]\[([^\]]+)]$/);
        if (match) {
          const [, index, field] = match;
          const idx = parseInt(index);
          if (!industrystepnew[idx]) industrystepnew[idx] = {};
          industrystepnew[idx][field] = value;
        }
      });
    }

    // Get all existing industry steps for this service
    const existingIndustrySteps = await Servicestindustry.find({ servicesid: updatedServices._id });
    const existingIndustryIds = existingIndustrySteps.map(s => s._id.toString());
    const submittedIndustryIds = [];

    // Process industry steps (update existing or create new)
    // Convert sparse array to dense array
    const industryStepsDense = industrystepnew.filter(step => step !== undefined && step !== null);
    for (let i = 0; i < industryStepsDense.length; i++) {
      const step = industryStepsDense[i];
      if (step && (step.titlestep || step.descriptionstep)) {
        const industrydata = {
          "title": step.titlestep || "",
          "description": step.descriptionstep || "",
          "imagealt": step.imagealt || "",
          "servicesid": updatedServices._id
        };

        // Handle image upload if present
        if (req.files && Object.keys(req.files).length > 0) {
          const imageFiles = req.files.filter(file => {
            const match = file.fieldname.match(/^industry\[(\d+)]\[imagestep]$/);
            return match && parseInt(match[1]) === i;
          });

          if (imageFiles && imageFiles.length > 0) {
            const reqObj = { servicesnew: imageFiles[0] };
            const processedImages = await servicesServices(reqObj);
            if (processedImages && processedImages.length > 0) {
              industrydata.imageurl = processedImages[0].url;
            }
          }
        }

        // If _id exists, update existing step; otherwise create new
        const stepId = step._id || step.existingId;
        if (stepId) {
          submittedIndustryIds.push(stepId.toString());
          await Servicestindustry.findByIdAndUpdate(stepId, industrydata, { new: true });
        } else {
          const newStep = await Servicestindustry.create(industrydata);
          submittedIndustryIds.push(newStep._id.toString());
        }
      }
    }

    // Delete industry steps that are no longer in the form
    const industryIdsToDelete = existingIndustryIds.filter(id => !submittedIndustryIds.includes(id));
    if (industryIdsToDelete.length > 0) {
      await Servicestindustry.deleteMany({ _id: { $in: industryIdsToDelete } });
    }

    // Note: All industry steps (both new and existing) are now handled in the industry array above
    // The industryget array processing has been removed to avoid duplicates

    // Process whatweoffer steps for update
    let whatweofferstepnew = [];

    // Check if data is already parsed as arrays (from JSON body) or needs parsing from FormData
    if (Array.isArray(req.body.whatweoffer)) {
      whatweofferstepnew = req.body.whatweoffer;
    } else {
      // Parse from FormData
      Object.entries(req.body).forEach(([key, value]) => {
        const match = key.match(/^whatweoffer\[(\d+)]\[([^\]]+)]$/);
        if (match) {
          const [, index, field] = match;
          const idx = parseInt(index);
          if (!whatweofferstepnew[idx]) whatweofferstepnew[idx] = {};
          whatweofferstepnew[idx][field] = value;
        }
      });
    }

    // Handle image files
    if (req.files && Object.keys(req.files).length > 0) {
      (req.files || []).forEach((file) => {
        const match = file.fieldname.match(/^whatweoffer\[(\d+)]\[imagestep]$/);
        if (match) {
          const index = parseInt(match[1]);
          if (!whatweofferstepnew[index]) whatweofferstepnew[index] = {};
          whatweofferstepnew[index].whatweofferstepnew = file;
        }
      });
    }

    // Get all existing whatweoffer steps for this service
    const existingWhatWeOfferSteps = await Servicestwhatweoffer.find({ servicesid: updatedServices._id });
    const existingWhatWeOfferIds = existingWhatWeOfferSteps.map(s => s._id.toString());
    const submittedWhatWeOfferIds = [];

    // Process whatweoffer steps (update existing or create new)
    // Convert sparse array to dense array
    const whatweofferStepsDense = whatweofferstepnew.filter(step => step !== undefined && step !== null);
    for (let i = 0; i < whatweofferStepsDense.length; i++) {
      const step = whatweofferStepsDense[i];
      if (step && (step.titlestep || step.descriptionstep)) {
        const whatweofferdata = {
          "tag": step.tagstep || "",
          "title": step.titlestep || "",
          "description": step.descriptionstep || "",
          "link": step.linkstep || "",
          "imagealt": step.imagealt || "",
          "servicesid": updatedServices._id
        };

        // Handle image upload if present
        const imageFile = step.whatweofferstepnew || (req.files && req.files.find(file => {
          const match = file.fieldname.match(/^whatweoffer\[(\d+)]\[imagestep]$/);
          return match && parseInt(match[1]) === i;
        }));

        if (imageFile) {
          const reqObj = { servicesnew: imageFile };
          const processedImages = await servicesServices(reqObj);
          if (processedImages && processedImages.length > 0) {
            whatweofferdata.imageurl = processedImages[0].url;
          }
        } else if (step._id || step.existingId) {
          // Preserve existing image URL if no new image uploaded
          const existingStep = existingWhatWeOfferSteps.find(s =>
            s._id.toString() === (step._id || step.existingId).toString()
          );
          if (existingStep && existingStep.imageurl) {
            whatweofferdata.imageurl = existingStep.imageurl;
          }
        }

        // If _id exists, update existing step; otherwise create new
        const stepId = step._id || step.existingId;
        if (stepId) {
          submittedWhatWeOfferIds.push(stepId.toString());
          await Servicestwhatweoffer.findByIdAndUpdate(stepId, whatweofferdata, { new: true });
        } else {
          const newStep = await Servicestwhatweoffer.create(whatweofferdata);
          submittedWhatWeOfferIds.push(newStep._id.toString());
        }
      }
    }

    // Delete whatweoffer steps that are no longer in the form
    const whatweofferIdsToDelete = existingWhatWeOfferIds.filter(id => !submittedWhatWeOfferIds.includes(id));
    if (whatweofferIdsToDelete.length > 0) {
      await Servicestwhatweoffer.deleteMany({ _id: { $in: whatweofferIdsToDelete } });
    }

    // Note: All whatweoffer steps (both new and existing) are now handled in the whatweoffer array above
    // The whatweofferget array processing has been removed to avoid duplicates

    revalidateFrontend({ slug: updatedServices.slug, type: "service" }).catch(() => {});
    const message = {
      "status": "success",
      "message": "Data updated sucessfully",
      "data": updatedServices
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteServices = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedServices = await Services.findByIdAndDelete(id);

    if (deletedServices?.slug) {
      revalidateFrontend({ slug: deletedServices.slug, type: "service" }).catch(() => {});
    }

    const message = {
      "status": "success",
      "message": "Data deleted sucessfully",
      "data": deletedServices
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getServices = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaServices = await Services.findById(id).populate('processstep').populate("servicestep").populate("technologystep").populate("industrystep").populate("whatweofferstep");
    const message = {
      "status": "success",
      "message": "Data deleted sucessfully",
      "data": getaServices
    }
    res.json(message);
    //res.json(getaServices);
  } catch (error) {
    throw new Error(error);
  }
});
const getallServices = asyncHandler(async (req, res) => {
  try {
    // If pagination params present, return admin-style paginated response
    if (req.query.limit || req.query.page || req.query.skip) {
      let limit = parseInt(req.query.limit) || 10;
      let page = parseInt(req.query.skip || req.query.page) || 1;
      const skip = (page - 1) * limit;
      const query = String(req.query.q || "").trim();
      const match = query ? { title: { $regex: query, $options: "i" } } : {};

      const [servicesList, totalCount] = await Promise.all([
        Services.find(match)
          .sort({ _id: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Services.countDocuments(match),
      ]);

      return res.status(200).json({
        items: servicesList,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      });
    }

    // Frontend call — single query, build hierarchy in memory
    const services = await Services.find({ status: true }).lean();
    const parents = services.filter((s) => !s.parent);
    const structured = parents.map((parent) => ({
      ...parent,
      children: services.filter(
        (s) => s.parent?.toString() === parent._id.toString()
      ),
    }));

    res.status(200).json(structured);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createServices,
  updateServices,
  deleteServices,
  getServices,
  getallServices,
};

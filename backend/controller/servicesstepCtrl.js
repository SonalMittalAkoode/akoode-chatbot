const Servicesservice = require("../models/servicesserviceModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const mongoose = require("mongoose");
const slugify = require("slugify");
const { processServicesStepImages,processServicesStepImagesGet } = require("../middlewares/uploadImage");


const createServicesStep = asyncHandler(async (req, res) => {
  try {

    for(var i=0;i<req.body.services?.length;i++){
        var servicesdata={
            "title":req.body.services[i].titlestep,
            "description":req.body.services[i].descriptionstep,
            "servicesid":req.body.servicesId
        }
      
        const services = [];

    // Parse text fields like floorPlans[0][title], etc.
    Object.entries(req.body).forEach(([key, value]) => {
      const match = key.match(/^services\[(\d+)]\[(\w+)]$/);
      if (match) {
        const [ , index, field ] = match;
        if (!services[index]) services[index] = {};
        services[index][field] = value;
      }
    });

    // Parse uploaded files with fieldnames like floorPlans[0][planimage]
    (req.files || []).forEach((file) => {
    const match = file.fieldname.match(/^services\[(\d+)]\[imagestep]$/);
      if (match) {
        const index = parseInt(match[1]);
        if (!services[index]) services[index] = {};
        services[index].imagestep = file;
      }
    });
   
    // Now process each floor plan image
    for (let i = 0; i < services.length; i++) {
      const servicestep = services[i];

      if (servicestep) {
        console.log("Resizing image for services", i);

        const processedImages = await processServicesStepImages(servicestep); // assuming this accepts a single file
        if (processedImages.length > 0) {
            servicesdata.imagestepurl = `${processedImages[0].url}`;
        }
      }
    }
        console.log("servicesdata servicesdata")
        console.log(servicesdata)
        const newServicesStep = await Servicesservice.create(servicesdata);
      }
    
      for(var i=0;i<req.body.servicesget?.length;i++){   
        var servicesdata={
            "title":req.body.servicesget[i].titlestep,
            "description":req.body.servicesget[i].descriptionstep,
            "servicesid":req.body.servicesId
        }
       

        const servicesget = [];

        // Parse text fields like floorPlans[0][title], etc.
        Object.entries(req.body).forEach(([key, value]) => {
          const match = key.match(/^servicesget\[(\d+)]\[(\w+)]$/);
          if (match) {
            const [ , index, field ] = match;
            if (!servicesget[index]) servicesget[index] = {};
            servicesget[index][field] = value;
          }
        });
    
        // Parse uploaded files with fieldnames like floorPlans[0][planimage]
        (req.files || []).forEach((file) => {
          const match = file.fieldname.match(/^servicesget\[(\d+)]\[imagestepget]$/);
          if (match) {
            const index = parseInt(match[1]);
            if (!servicesget[index]) servicesget[index] = {};
            servicesget[index].imagestepget = file;
          }
        });
        // console.log("floorPlans floorPlans")
        // console.log(floorPlans)
        // Now process each floor plan image
        for (let i = 0; i < servicesget.length; i++) {
          const servicestep = servicesget[i];
    
          if (servicestep) {
            console.log("Resizing image for services", i);
    
            const processedImages = await processServicesStepImagesGet(servicestep); // assuming this accepts a single file
            if (processedImages.length > 0) {
                servicesdata.imagestepurl = `${processedImages[0].url}`;
            }
          }
        }

        const updatedServicesStep = await Servicesservice.findByIdAndUpdate(req.body.servicesget[i].serviceid, servicesdata, {
            new: true,
          });
    }
    //res.json(newLanding);
    const message={
      "status":"success",
      "message":"Data Add sucessfully",
    //   "data":newServicesprocess
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const updateServicesStep = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    req.body.slug  = slugify(req.body.slug.toLowerCase());
    const updatedServicesStep = await Servicesservice.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const message={
      "status":"success",
      "message":"Data updated sucessfully",
      "data":updatedServicesStep
    }
    res.json(message);
    // res.json(updatedLandingpage);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteServicesStep = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedServicesStep = await Servicesservice.findByIdAndDelete(id);
    const message={
      "status":"success",
      "message":"Data deleted sucessfully",
      "data":deletedServicesStep
    }
    res.json(message);
    // res.json(deletedLandingpage);
  } catch (error) {
    throw new Error(error);
  }
});
const getServicesStep = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getServicesStep = await Servicesservice.findById(id);
    const message={
      "status":"success",
      "message":"Data deleted sucessfully",
      "data":getServicesStep
    }
    res.json(message);
    // res.json(getaLandingpage);
  } catch (error) {
    throw new Error(error);
  }
});
const getallServicesStep = asyncHandler(async (req, res) => {
  try {
    const getallServicesStep = await Servicesservice.find().populate("servicesid");
    res.json(getallServicesStep);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
createServicesStep,
  updateServicesStep,
  deleteServicesStep,
  getServicesStep,
  getallServicesStep,
};

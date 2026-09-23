const Servicesprocess = require("../models/servicesprocessModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const mongoose = require("mongoose");
const slugify = require("slugify");
const { processFloorPlanImages,processFloorPlanImagesGet } = require("../middlewares/uploadImage");


const createServicesprocess = asyncHandler(async (req, res) => {
  try {

    for(var i=0;i<req.body.floorPlans?.length;i++){
        var plandata={
            "title":req.body.floorPlans[i].title,
            "bedroom":req.body.floorPlans[i].bedroom,
            "price":req.body.floorPlans[i].price,
            "areasize":req.body.floorPlans[i].areasize,
            "description":req.body.floorPlans[i].description,
            "landingid":req.body.landingId
        }
      
        const floorPlans = [];

    // Parse text fields like floorPlans[0][title], etc.
    Object.entries(req.body).forEach(([key, value]) => {
      const match = key.match(/^floorPlans\[(\d+)]\[(\w+)]$/);
      if (match) {
        const [ , index, field ] = match;
        if (!floorPlans[index]) floorPlans[index] = {};
        floorPlans[index][field] = value;
      }
    });

    // Parse uploaded files with fieldnames like floorPlans[0][planimage]
    (req.files || []).forEach((file) => {
      const match = file.fieldname.match(/^floorPlans\[(\d+)]\[planimage]$/);
      if (match) {
        const index = parseInt(match[1]);
        if (!floorPlans[index]) floorPlans[index] = {};
        floorPlans[index].planimage = file;
      }
    });
   
    // Now process each floor plan image
    for (let i = 0; i < floorPlans.length; i++) {
      const plan = floorPlans[i];

      if (plan) {
        console.log("Resizing image for floorPlan", i);

        const processedImages = await processFloorPlanImages(plan); // assuming this accepts a single file
        if (processedImages.length > 0) {
            plandata.planimageurl = `${processedImages[0].url}`;
        }
      }
    }
        console.log("plandata plandata")
        console.log(plandata)
        const newServicesprocess = await Servicesprocess.create(plandata);
      }
    
      for(var i=0;i<req.body.floorPlansget?.length;i++){
        var plandata={
            "title":req.body.floorPlansget[i].title,
            "bedroom":req.body.floorPlansget[i].bedroom,
            "price":req.body.floorPlansget[i].price,
            "areasize":req.body.floorPlansget[i].areasize,
            "description":req.body.floorPlansget[i].description,
            "landingid":req.body.landingId
        }
       

        const floorPlansget = [];

        // Parse text fields like floorPlans[0][title], etc.
        Object.entries(req.body).forEach(([key, value]) => {
          const match = key.match(/^floorPlansget\[(\d+)]\[(\w+)]$/);
          if (match) {
            const [ , index, field ] = match;
            if (!floorPlansget[index]) floorPlansget[index] = {};
            floorPlansget[index][field] = value;
          }
        });
    
        // Parse uploaded files with fieldnames like floorPlans[0][planimage]
        (req.files || []).forEach((file) => {
          const match = file.fieldname.match(/^floorPlansget\[(\d+)]\[planimageget]$/);
          if (match) {
            const index = parseInt(match[1]);
            if (!floorPlansget[index]) floorPlansget[index] = {};
            floorPlansget[index].planimageget = file;
          }
        });
        // console.log("floorPlans floorPlans")
        // console.log(floorPlans)
        // Now process each floor plan image
        for (let i = 0; i < floorPlansget.length; i++) {
          const plan = floorPlansget[i];
    
          if (plan) {
            console.log("Resizing image for floorPlan", i);
    
            const processedImages = await processFloorPlanImagesGet(plan); // assuming this accepts a single file
            if (processedImages.length > 0) {
                plandata.planimageurl = `${processedImages[0].url}`;
            }
          }
        }

        const updatedServicesprocess = await Servicesprocess.findByIdAndUpdate(req.body.floorPlansget[i].planid, plandata, {
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
const updateServicesprocess = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    req.body.slug  = slugify(req.body.slug.toLowerCase());
    const updatedServicesprocess = await Servicesprocess.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const message={
      "status":"success",
      "message":"Data updated sucessfully",
      "data":updatedServicesprocess
    }
    res.json(message);
    // res.json(updatedLandingpage);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteServicesprocess = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedServicesprocess = await Servicesprocess.findByIdAndDelete(id);
    const message={
      "status":"success",
      "message":"Data deleted sucessfully",
      "data":deletedServicesprocess
    }
    res.json(message);
    // res.json(deletedLandingpage);
  } catch (error) {
    throw new Error(error);
  }
});
const getServicesprocess = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getServicesprocess = await Servicesprocess.findById(id);
    const message={
      "status":"success",
      "message":"Data deleted sucessfully",
      "data":getServicesprocess
    }
    res.json(message);
    // res.json(getaLandingpage);
  } catch (error) {
    throw new Error(error);
  }
});
const getallServicesprocess = asyncHandler(async (req, res) => {
  try {
    const getallServicesprocess = await Servicesprocess.find().populate("cityid").populate("categoryid");
    res.json(getallServicesprocess);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
createServicesprocess,
  updateServicesprocess,
  deleteServicesprocess,
  getServicesprocess,
  getallServicesprocess,
};

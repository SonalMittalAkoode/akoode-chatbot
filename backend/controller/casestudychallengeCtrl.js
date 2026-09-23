const Casestudychallenge = require("../models/casestudychallengeModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const mongoose = require("mongoose");
const slugify = require("slugify");
const { challengeFloorPlanImages,challengeFloorPlanImagesGet } = require("../middlewares/uploadImage");


const createCasestudychallenge = asyncHandler(async (req, res) => {
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
   
    // Now challenge each floor plan image
    for (let i = 0; i < floorPlans.length; i++) {
      const plan = floorPlans[i];

      if (plan) {
        console.log("Resizing image for floorPlan", i);

        const challengeedImages = await challengeFloorPlanImages(plan); // assuming this accepts a single file
        if (challengeedImages.length > 0) {
            plandata.planimageurl = `${challengeedImages[0].url}`;
        }
      }
    }
        console.log("plandata plandata")
        console.log(plandata)
        const newCasestudychallenge = await Casestudychallenge.create(plandata);
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
        // Now challenge each floor plan image
        for (let i = 0; i < floorPlansget.length; i++) {
          const plan = floorPlansget[i];
    
          if (plan) {
            console.log("Resizing image for floorPlan", i);
    
            const challengeedImages = await challengeFloorPlanImagesGet(plan); // assuming this accepts a single file
            if (challengeedImages.length > 0) {
                plandata.planimageurl = `${challengeedImages[0].url}`;
            }
          }
        }

        const updatedCasestudychallenge = await Casestudychallenge.findByIdAndUpdate(req.body.floorPlansget[i].planid, plandata, {
            new: true,
          });
    }
    //res.json(newLanding);
    const message={
      "status":"success",
      "message":"Data Add sucessfully",
    //   "data":newCasestudychallenge
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const updateCasestudychallenge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    req.body.slug  = slugify(req.body.slug.toLowerCase());
    const updatedCasestudychallenge = await Casestudychallenge.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const message={
      "status":"success",
      "message":"Data updated sucessfully",
      "data":updatedCasestudychallenge
    }
    res.json(message);
    // res.json(updatedLandingpage);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteCasestudychallenge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedCasestudychallenge = await Casestudychallenge.findByIdAndDelete(id);
    if (!deletedCasestudychallenge) {
      return res.status(404).json({ status: "error", message: "Case study challenge not found", data: null });
    }
    const message={
      "status":"success",
      "message":"Data deleted successfully",
      "data":deletedCasestudychallenge
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getCasestudychallenge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getCasestudychallenge = await Casestudychallenge.findById(id);
    if (!getCasestudychallenge) {
      return res.status(404).json({ status: "error", message: "Case study challenge not found", data: null });
    }
    const message={
      "status":"success",
      "message":"Data fetched successfully",
      "data":getCasestudychallenge
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getallCasestudychallenge = asyncHandler(async (req, res) => {
  try {
    const getallCasestudychallenge = await Casestudychallenge.find().populate("cityid").populate("categoryid");
    res.json(getallCasestudychallenge);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
createCasestudychallenge,
  updateCasestudychallenge,
  deleteCasestudychallenge,
  getCasestudychallenge,
  getallCasestudychallenge,
};

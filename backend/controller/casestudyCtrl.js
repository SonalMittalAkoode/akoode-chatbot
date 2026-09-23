const Casestudy = require("../models/casestudyModel.js");
const Casestudyprocess = require("../models/casestudyprocessModel.js");
const Casestudychallenge = require("../models/casestudychallengeModel.js");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { uploadPhoto, casestudyImgResize, processCasestudy,processCasestudyGet } = require("../middlewares/uploadImage");
const slugify = require("slugify");
const revalidateFrontend = require("../utils/revalidateFrontend");

function parseFeaturedInServicesFromBody(body) {
  if (!body || !body.featuredInServices) return;
  if (Array.isArray(body.featuredInServices)) return;
  try { body.featuredInServices = JSON.parse(body.featuredInServices); } catch { body.featuredInServices = []; }
}

function parseWhyChooseUsFromBody(body) {
  if (!body || typeof body.whychooseus !== "string") return;
  const raw = body.whychooseus.trim();
  if (!raw || raw[0] !== "{") return;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      body.whychooseus = parsed;
    }
  } catch (e) {
    delete body.whychooseus;
  }
}

const createCasestudy = asyncHandler(async (req, res) => {
  try {
   
    if(req.files){
      const selectedImgslogo = req.files?.filter(file => file.fieldname === "logo");
      if (Array.isArray(selectedImgslogo) && selectedImgslogo.length > 0) {
        const processedImages  =await casestudyImgResize(selectedImgslogo);
        

        if (processedImages.length > 0) {
          // ✅ Append logo filename to req.body
          req.body.logoimage = "public/images/casestudys/"+processedImages[0];
        }
      }
      const selectedImgscasestudylogo = req.files?.filter(file => file.fieldname === "casestudylogo");
      if (Array.isArray(selectedImgscasestudylogo) && selectedImgscasestudylogo.length > 0) {
        const processedImages2  =await casestudyImgResize(selectedImgscasestudylogo);
        if (processedImages2.length > 0) {
          // ✅ Append logo filename to req.body
          req.body.casestudyimage = "public/images/casestudys/"+processedImages2[0];
        }
      }
      const selectedImgsaboutimage = req.files?.filter(file => file.fieldname === "aboutimage");

      if (Array.isArray(selectedImgsaboutimage) && selectedImgsaboutimage.length > 0) {
        const processedImages3  =await casestudyImgResize(selectedImgsaboutimage);
        

        if (processedImages3.length > 0) {
          // ✅ Append logo filename to req.body
          req.body.aboutimage = "public/images/casestudys/"+processedImages3[0];
        }
      }
      const selectedImgsdeliveredimage = req.files?.filter(file => file.fieldname === "deliveredimage");
      if (Array.isArray(selectedImgsdeliveredimage) && selectedImgsdeliveredimage.length > 0) {
        const processedImages4 = await casestudyImgResize(selectedImgsdeliveredimage);
        if (processedImages4.length > 0) {
          req.body.deliveredimage = "public/images/casestudys/" + processedImages4[0];
        }
      }
      const selectedImgsTech = req.files?.filter(file => file.fieldname === "techimages");
      if (Array.isArray(selectedImgsTech) && selectedImgsTech.length > 0) {
        const processedTech = await casestudyImgResize(selectedImgsTech);
        if (processedTech.length > 0) {
          req.body.techimages = processedTech.map(img => "public/images/casestudys/" + img);
        }
      }
    }
    parseWhyChooseUsFromBody(req.body);
    parseFeaturedInServicesFromBody(req.body);
    req.body.slug  = slugify(req.body.slug.toLowerCase());
    const newCasestudy = await Casestudy.create(req.body);
    revalidateFrontend({ slug: newCasestudy.slug, type: "casestudy" }).catch(() => {});
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
      casestudyid: newCasestudy._id,
    };

   
if(processimage){
  console.log(processimage);
  console.log("processimage");
  try {
    const processedImages = await processCasestudy(processimage); // assumes it returns [{url: "..."}]
    if (processedImages?.length > 0) {
      processdata.imageurl = processedImages[0].url;
    }
  } catch (imageError) {
    console.error("Error processing case study process image:", imageError);
    // Continue without image if processing fails
  }
}
    
const newPropertyplan = await Casestudyprocess.create(processdata);

    
  }
}


for(var i=0;i<req.body.challenges?.length;i++){

     
  var challengesdata={
      "title":req.body.challenges[i].titlestep,
      "description":req.body.challenges[i].descriptionstep,
      "casestudyid":newCasestudy._id
  }

  
  const newPropertyplan = await Casestudychallenge.create(challengesdata);
}
    const message={
      "status":"success",
      "message":"Data Add sucessfully",
      "data":newCasestudy
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const updateCasestudy = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    
    
    if(req.files){
      const selectedImgslogo = req.files?.filter(file => file.fieldname === "logo");
      if (Array.isArray(selectedImgslogo) && selectedImgslogo.length > 0) {
        const processedImages  =await casestudyImgResize(selectedImgslogo);
        

        if (processedImages.length > 0) {
          // ✅ Append logo filename to req.body
          req.body.logoimage = "public/images/casestudys/"+processedImages[0];
        }
      }
      const selectedImgscasestudylogo = req.files?.filter(file => file.fieldname === "casestudylogo");
      if (Array.isArray(selectedImgscasestudylogo) && selectedImgscasestudylogo.length > 0) {
         console.log("casestudylogo")
        console.log(selectedImgscasestudylogo)
        const processedImages  =await casestudyImgResize(selectedImgscasestudylogo);
        if (processedImages.length > 0) {
          
          // ✅ Append logo filename to req.body
          req.body.casestudyimage = "public/images/casestudys/"+processedImages[0];
        }
      }

      const selectedImgsaboutimage = req.files?.filter(file => file.fieldname === "aboutimage");

      if (Array.isArray(selectedImgsaboutimage) && selectedImgsaboutimage.length > 0) {
        console.log("selectedImgsaboutimage")
        console.log(selectedImgsaboutimage)
        const processedImages3  =await casestudyImgResize(selectedImgsaboutimage);
        

        if (processedImages3.length > 0) {
          // ✅ Append logo filename to req.body
          req.body.aboutimage = "public/images/casestudys/"+processedImages3[0];
        }
      }

      const selectedImgsdeliveredimage = req.files?.filter(file => file.fieldname === "deliveredimage");
      if (Array.isArray(selectedImgsdeliveredimage) && selectedImgsdeliveredimage.length > 0) {
        const processedImages4 = await casestudyImgResize(selectedImgsdeliveredimage);
        if (processedImages4.length > 0) {
          req.body.deliveredimage = "public/images/casestudys/" + processedImages4[0];
        }
      }

      const selectedImgsTech = req.files?.filter(file => file.fieldname === "techimages");
      let techArray = [];
      if (req.body.existingTechimages) {
        techArray = Array.isArray(req.body.existingTechimages) ? req.body.existingTechimages : [req.body.existingTechimages];
      }
      if (Array.isArray(selectedImgsTech) && selectedImgsTech.length > 0) {
        const processedTech = await casestudyImgResize(selectedImgsTech);
        if (processedTech.length > 0) {
          techArray = techArray.concat(processedTech.map(img => "public/images/casestudys/" + img));
        }
      }
      if (req.body.existingTechimages || (selectedImgsTech && selectedImgsTech.length > 0) || req.body.clearTechImages) {
        req.body.techimages = techArray;
      }
    }
    parseWhyChooseUsFromBody(req.body);
    parseFeaturedInServicesFromBody(req.body);
    req.body.slug  = slugify(req.body.slug.toLowerCase());
    // Read the previous slug before the write so a rename can purge the old URL.
    const beforeCasestudy = await Casestudy.findById(id).select("slug").lean();
    const updatedCasestudy = await Casestudy.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    revalidateFrontend({
      slug: updatedCasestudy?.slug,
      oldSlug: beforeCasestudy?.slug,
      type: "casestudy",
    }).catch(() => {});

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
      casestudyid: updatedCasestudy._id,
    };

   
if(processimage){
  console.log(processimage);
  console.log("processimage");
  try {
    const processedImages = await processCasestudy(processimage); // assumes it returns [{url: "..."}]
    if (processedImages?.length > 0) {
      processdata.imageurl = processedImages[0].url;
    }
  } catch (imageError) {
    console.error("Error processing case study process image:", imageError);
    // Continue without image if processing fails
  }
}
    
const newPropertyplan = await Casestudyprocess.create(processdata);

    
  }
}


// update get process

const processnewget = [];
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
}
// Now process each floor plan
for (let i = 0; i < req.body.processget?.length; i++) {
  const process = req.body.processget[i];
  const processimage = processnewget[i];
  console.log(processimage);
    console.log("processget processedImages");
  if (process) {
    const processdata = {
      title: process.titlestep,
      description: process.descriptionstep
    };

   
if(processimage){
  try {
    const processedImages = await processCasestudyGet(processimage); // assumes it returns [{url: "..."}]
    console.log(processedImages);
    console.log("processedImagesprocessedImages processedImages");
    if (processedImages?.length > 0) {
      processdata.imageurl = processedImages[0].url;
    }
  } catch (imageError) {
    console.error("Error processing case study process image (get):", imageError);
    // Continue without image if processing fails
  }
}
  const updatedPropertyplan = await Casestudyprocess.findByIdAndUpdate(process.processid, processdata, {
    new: true,
  });
  // const newPropertyplan = await Casestudyprocess.create(processdata);

    
  }
}
// end update get process


for(var i=0;i<req.body.challenges?.length;i++){

     
  var challengesdata={
      "title":req.body.challenges[i].titlestep,
      "description":req.body.challenges[i].descriptionstep,
      "casestudyid":updatedCasestudy._id
  }

  
  const newPropertyplan = await Casestudychallenge.create(challengesdata);
}

for(var i=0;i<req.body.challengesget?.length;i++){

     
  var challengesdata={
      "title":req.body.challengesget[i].titlestep,
      "description":req.body.challengesget[i].descriptionstep,
      "casestudyid":updatedCasestudy._id
  }
  const updatedPropertyplan = await Casestudychallenge.findByIdAndUpdate(req.body.challengesget[i].challengeid, challengesdata, {
    new: true,
  });
}
    
    const message={
      "status":"success",
      "message":"Data updated sucessfully",
      "data":updatedCasestudy
    }
    res.json(message);
    // res.json(updatedCasestudy);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteCasestudy = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedCasestudy = await Casestudy.findByIdAndDelete(id);
    if (!deletedCasestudy) {
      return res.status(404).json({ status: "error", message: "Case study not found", data: null });
    }

    revalidateFrontend({ slug: deletedCasestudy.slug, type: "casestudy" }).catch(() => {});

    const message={
      "status":"success",
      "message":"Data deleted successfully",
      "data":deletedCasestudy
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getCasestudy = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaCasestudy = await Casestudy.findById(id).populate('processstep').populate("challengestep");
    if (!getaCasestudy) {
      return res.status(404).json({ status: "error", message: "Case study not found", data: null });
    }
    const message={
      "status":"success",
      "message":"Data fetched successfully",
      "data":getaCasestudy
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getallCasestudy = asyncHandler(async (req, res) => {
  try {
    let limit = 100;
    let skip = 1;
    const query = String(req.query.q || "").trim();
    const match = query ? { title: { $regex: query, $options: "i" } } : {};
    

    if (req.query.limit ) {
      limit=req.query.limit;
      skip=req.query.skip;     
  }
    // const getallServices = await Services.find();

    const [casestudyList, totalCount] = await Promise.all([
      Casestudy.find(match)
        // .populate("cityid")
        // .populate("categoryid")
        .sort({ _id: -1 })
        .skip((skip - 1) * limit)
        .limit(limit)
        .lean(),
    
      Casestudy.countDocuments(match) // total matching without skip/limit
    ]);
    // propertyList.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    // console.log(propertyList)
    res.status(200).json({
      items: casestudyList,
      totalCount: totalCount,
      currentPage: skip,
      totalPages: Math.ceil(totalCount / limit)
    });
    // const getallCasestudy = await Casestudy.find();
    // res.json(getallCasestudy);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createCasestudy,
  updateCasestudy,
  deleteCasestudy,
  getCasestudy,
  getallCasestudy,
};

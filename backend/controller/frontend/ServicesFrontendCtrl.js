const Services = require("../../models/serviceModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const slugify = require("slugify");
// const ServicePage = require("../../models/ServicepageModel");
// const Builder=require("../../models/builderModel")
const { featuredImageResize,sitePlanResize,ServiceSelectedImgsResize } = require("../../middlewares/uploadImage");

const getService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getService = await Services.findOne({ _id: id, status: true }).populate("cityid").populate("categoryid").populate("Servicetypeid").populate("locationid").populate("constructionstatus").populate("furnishingstatus").populate("amenityid").lean();
    const message={
      "status":"success",
      "message":"Data deleted sucessfully",
      "data":getService
    }
    res.json(message);
    // res.json(getaService);
  } catch (error) {
    throw new Error(error);
  }
});
const getallServiceList = asyncHandler(async (req, res) => {
  try {
    let query = { status: true };
    
    if(req.query.featured){
      query["featuredService"] = req.query.featured;      
    }
    if(req.query.hot){
      query["hotService"] = req.query.hot;      
    }
    let limit = 100;
    let skip = 1;

    if (req.query.limit) {
      limit = parseInt(req.query.limit, 10);
      skip = parseInt(req.query.skip, 10) || 1;
    }

    if (req.query.limit) {
      const [serviceList, totalCount] = await Promise.all([
        Services.find(query)
          .populate("cityid")
          .populate("categoryid")
          .populate("Servicetypeid")
          .populate("locationid")
          .populate("sellerid")
          .sort({ createdAt: -1 })
          .skip((skip - 1) * limit)
          .limit(limit)
          .lean(),
        Services.countDocuments(query),
      ]);

      res.status(200).json({
        items: serviceList,
        totalCount,
        currentPage: skip,
        totalPages: Math.ceil(totalCount / limit),
      });
      return;
    }

    const getallService = await Services.find(query)
      .populate("cityid")
      .populate("categoryid")
      .populate("Servicetypeid")
      .populate("locationid")
      .populate("sellerid")
      .sort({ createdAt: -1 })
      .lean();
    res.json(getallService);
  } catch (error) {
    throw new Error(error);
  }
});
const getallServiceIdList = asyncHandler(async (req, res) => {
  try {
  
    const prolist = req.query.prolist;
    const idArray = prolist.split(",");

    const objectIds = idArray.map(id => new ObjectId(id)); // FIXED here

    const getallService = await Services.find({
      _id: { $in: objectIds }
    }).populate("cityid").populate("Servicetypeid").populate("furnishingstatus").populate("amenityid").lean();
    res.json(getallService);
  } catch (error) {
    throw new Error(error);
  }
});
const getallServiceFilterList = asyncHandler(async (req, res) => {
  try {
    let query = { status: true };
    if(req.query.featured){
      query["featuredService"] = req.query.featured;      
    }
    if(req.query.hot){
      query["hotService"] = req.query.hot;      
    }
    if(req.query.category){
      query["categoryid"] = req.query.category;      
    }
    if(req.query.city){
      query["cityid"] = req.query.city;      
    }
    if(req.query.Servicetype){
      query["Servicetypeid"] = req.query.Servicetype;      
    }
    if (req.query.keyword) {
      query["$or"] = [
        { title: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } },
      ];
    }  
    if(req.query.location){
      query["locationid"] = req.query.location;      
    }
    
    let limit=100;
    let skip=1;

    if (req.query.limit ) {
      limit=req.query.limit;
      skip=req.query.skip;     
  }
    // const getallService = await Services.find(query).populate("cityid").populate("categoryid").populate("Servicetypeid").populate("locationid").sort({updated_at: -1}).skip((skip - 1) * limit).limit(parseInt(limit)).lean();
    const [ServiceList, totalCount] = await Promise.all([
      Services.find(query)
        .populate("cityid")
        .populate("categoryid")
        .populate("Servicetypeid")
        .populate("locationid")
        .populate("sellerid")
        .sort({ _id: -1})
        .skip((skip - 1) * limit)
        .limit(limit)
        .lean(),
    
      Services.countDocuments(query) // total matching without skip/limit
    ]);
    // ServiceList.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    res.status(200).json({
      items: ServiceList,
      totalCount: totalCount,
      currentPage: skip,
      totalPages: Math.ceil(totalCount / limit)
    });
    // res.json(getallService);
  } catch (error) {
    throw new Error(error);
  }
});
const getServiceSlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  // validateMongoDbId(slug);
  try {
    const getService = await Services.findOne({ slug: slug, status: true }).populate('servicestep').populate('technologystep').populate('industrystep').populate('whatweofferstep').lean();
    const message={
      "status":"success",
      "message":"Data deleted sucessfully",
      "data":getService
    }
    res.json(message);
    // res.json(getaService);
  } catch (error) {
    throw new Error(error);
  }
});
const createService = asyncHandler(async (req, res) => {
  try {
    if (req.files && Object.keys(req.files).length > 0) {
      
      if (req.files && req.files.ServiceSelectedImgs && req.files.ServiceSelectedImgs.length > 0  && Object.keys(req.files.ServiceSelectedImgs).length > 0 && Array.isArray(req.files.ServiceSelectedImgs)) {
        console.log("no ServiceSelectedImgs")
        const ServiceSelectedImgs  = await ServiceSelectedImgsResize(req);
        if (ServiceSelectedImgs.length > 0) {
          // ✅ Append logo filename to req.body
          // console.log("Service Images:", ServiceSelectedImgs);
          req.body.Serviceimageurl = ServiceSelectedImgs;
        }
      }
     
      if (req.files && req.files.featuredimage && Array.isArray(req.files.featuredimage) && req.files.featuredimage.length > 0 ) { 
        console.log(req.files.featuredimage)
        console.log("no featuredImageResize")
        const processedImages  =await featuredImageResize(req);
        if (processedImages.length > 0) {
          // ✅ Append logo filename to req.body
          req.body.featuredimageurl = "public/images/Service/"+processedImages[0];
        }
      }
      if (req.files && req.files.siteplan && Array.isArray(req.files.siteplan) && req.files.siteplan.length > 0 ) { 
        
        console.log(req.files.siteplan)
        console.log("no siteplan")
        const processedImagesplan  =await sitePlanResize(req);

        if (processedImagesplan.length > 0) {
          // ✅ Append logo filename to req.body
          req.body.siteplanurl = "public/images/Serviceplan/"+processedImagesplan[0];
        }
      }
    }

    if (req.body.amenityid && typeof req.body.amenityid === "string") {
      req.body.amenityid = req.body.amenityid
        .split(",")
        .map((id) => new mongoose.Types.ObjectId(id.trim()));
    }
    req.body.slug  = slugify(req.body.slug.toLowerCase());
    req.body.admin_approve = false;

    const newService = await Services.create(req.body);
    //res.json(newService);
    const message={
      "status":"success",
      "message":"Data Add sucessfully",
      "data":newService
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const ServiceListByPage = asyncHandler(async (req, res) => {
  try {
    const { slug } = req.params;
     const getaServicePage = await Services.findOne({ slug: slug }).lean();
    let query = { status: true };
    // if(req.query.featured=="yes"){
    //   query["featuredService"] = req.query.featured;      
    // }
    // if(req.query.hot=="yes"){
    //   query["hotService"] = req.query.hot;      
    // }
    if(getaServicePage.categoryid){
      query["categoryid"] = getaServicePage.categoryid;      
    }
    if(getaServicePage.cityid){
      query["cityid"] = getaServicePage.cityid;      
    }
    if(getaServicePage.Servicetypeid){
      query["Servicetypeid"] = getaServicePage.Servicetypeid;      
    }
    if(getaServicePage.locationid){
      query["locationid"] = getaServicePage.locationid;      
    }
    
    let limit=100;
    let skip=1;

    if (req.query.limit ) {
      limit=req.query.limit;
      skip=req.query.skip;     
  }
    // const getallService = await Services.find(query).populate("cityid").populate("categoryid").populate("Servicetypeid").populate("locationid").sort({updated_at: -1}).skip((skip - 1) * limit).limit(parseInt(limit)).lean();
    const [ServiceList, totalCount] = await Promise.all([
      Services.find(query)
        .populate("cityid")
        .populate("categoryid")
        .populate("Servicetypeid")
        .populate("locationid")
        .populate("sellerid")
        .sort({createdAt: -1})
        .skip((skip - 1) * limit)
        .limit(limit)
        .lean(),
    
      Services.countDocuments(query) // total matching without skip/limit
    ]);
    res.status(200).json({
      items: ServiceList,
      totalCount: totalCount,
      currentPage: skip,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    throw new Error(error);
  }
});
const ServiceListTrends = asyncHandler(async (req, res) => {
  try {
    let query = { status: true };
    
    if (req.query.Servicetypeid) {
      query.Servicetypeid =new mongoose.Types.ObjectId(req.query.Servicetypeid);
    }
    
    if (req.query.categoriesid) {
      query.categoryid = new mongoose.Types.ObjectId(req.query.categoriesid);
    }
    console.log(query)
    const result = await Services.aggregate([
      {
        $match: query,
      },
      {
        $addFields: {
          priceNumeric: { $toDouble: "$pricesqft" }, // convert price string to number
        },
      },
      {
        $group: {
          _id: "$locationid",
          ServiceCount: { $sum: 1 },
          avgPrice: { $avg: "$priceNumeric" },
          minPrice: { $min: "$priceNumeric" },
          maxPrice: { $max: "$priceNumeric" },
        },
      },
      {
        $lookup: {
          from: "locations", // collection name in lowercase and plural
          localField: "_id",
          foreignField: "_id",
          as: "locationDetails",
        },
      },
      {
        $unwind: "$locationDetails",
      },
      {
        $project: {
          locationId: "$_id",
          locationTitle: "$locationDetails.title",
          ServiceCount: 1,
          avgPrice: 1,
          minPrice: 1,
          maxPrice: 1,
        },
      },
    ]);
    const message={
      "status":"success",
      "message":"Data Add sucessfully",
      "data":result
    }
    res.json(message);
    // return result;
    
  } catch (error) {
    throw new Error(error);
  }
});
const ServiceListByBuilder = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    //  const getaServicePage = await Builder.findOne({ slug: slug }).lean();
    let query = { status: true };
    
    
    if(id){
      query["builderid"] = id;      
    }
    
    let limit=100;
    let skip=1;

    if (req.query.limit ) {
      limit=req.query.limit;
      skip=req.query.skip;     
  }
    // const getallService = await Services.find(query).populate("cityid").populate("categoryid").populate("Servicetypeid").populate("locationid").sort({updated_at: -1}).skip((skip - 1) * limit).limit(parseInt(limit)).lean();
    const [ServiceList, totalCount] = await Promise.all([
      Services.find(query)
        .populate("cityid")
        .populate("categoryid")
        .populate("Servicetypeid")
        .populate("locationid")
        .populate("sellerid")
        .sort({createdAt: -1})
        .skip((skip - 1) * limit)
        .limit(limit)
        .lean(),
    
      Services.countDocuments(query) // total matching without skip/limit
    ]);
    res.status(200).json({
      items: ServiceList,
      totalCount: totalCount,
      currentPage: skip,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  getService,
  getallServiceList,
  getallServiceIdList,
  getallServiceFilterList,
  getServiceSlug,
  createService,
  ServiceListByPage,
  ServiceListTrends,
  ServiceListByBuilder
};

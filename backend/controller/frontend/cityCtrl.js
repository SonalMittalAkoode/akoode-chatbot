const City = require("../../models/cityModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId");
const Property = require("../../models/propertyModel");


const getCity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaCity = await City.findById(id).lean();
    const message = {
      "status": "success",
      "message": "Data city sucessfully",
      "data": getaCity
    }
    res.json(message);
    //res.json(getaCity);
  } catch (error) {
    throw new Error(error);
  }
});
const getallCity = asyncHandler(async (req, res) => {
  try {
    const getallCity = await City.find({ "status": true }).populate("countryid").populate("stateid").lean();
    const message = {
      "status": "success",
      "message": "Data Add sucessfully",
      "data": getallCity
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getCityStateId = asyncHandler(async (req, res) => {
  const { stateid } = req.params;
  validateMongoDbId(stateid);
  try {
    const getallState = await City.find({ stateid: stateid }).lean();
    const message = {
      "status": "success",
      "message": "Data City sucessfully",
      "data": getallState
    }
    res.json(message);

  } catch (error) {
    throw new Error(error);
  }
});

const countPropertiesByCity = asyncHandler(async (req, res) => {
  try {
    // const result = await City.aggregate([
    //   {
    //     $lookup: {
    //       from: "properties", // the collection name in MongoDB
    //       localField: "_id",
    //       foreignField: "cityid",
    //       as: "properties"
    //     }
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       cityId: "$_id",
    //       cityName: "$title",
    //       citylogoimage:"$citylogoimage",
    //       propertyCount: { $size: "$properties" }
    //     }
    //   },
    //   {
    //   $sort: { createdAt: -1 }
    // }
    // ]);
    const result = await City.aggregate([
      {
        $lookup: {
          from: "properties", // collection name
          localField: "_id",
          foreignField: "cityid",
          as: "properties"
        }
      },
      {
        $project: {
          _id: 0,
          cityId: "$_id",
          cityName: "$title",
          citylogoimage: "$citylogoimage",
          createdAt: 1, // include it so you can sort
          propertyCount: { $size: "$properties" }
        }
      },
      {
        $sort: { createdAt: 1 }
      }
    ]);

    // const getallState = await City.find({ stateid: stateid });
    const message = {
      "status": "success",
      "message": "Data City sucessfully",
      "data": result
    }
    res.json(message);
    // console.log(result);
  } catch (error) {
    console.error("Error counting properties by city:", error);
  }

});


const getCityWithLocation = asyncHandler(async (req, res) => {
  try {
    const result = await City.aggregate([
      {
        $match: { status: true }, // Optional: only active cities
      },
      {
        $lookup: {
          from: "locations",           // collection name in MongoDB (pluralized lowercase)
          localField: "_id",
          foreignField: "cityid",
          as: "locations",
        },
      },
      {
        $project: {
          title: 1,
          status: 1,
          locations: 1,
        },
      },
    ]);
    // const getallState = await City.find({ stateid: stateid });
    const message = {
      "status": "success",
      "message": "Data City with location sucessfully",
      "data": result
    }
    res.json(message);
    // console.log(result);
  } catch (error) {
    console.error("Error counting properties by city:", error);
  }

});


const getCityWithPropertypage = asyncHandler(async (req, res) => {
  try {
    const result = await City.aggregate([
      {
        $match: { status: true }, // Optional: only active cities
      },
      {
        $lookup: {
          from: "propertypages",           // collection name in MongoDB (pluralized lowercase)
          localField: "_id",
          foreignField: "cityid",
          as: "propertypages",
        },
      },
      {
        $project: {
          title: 1,
          status: 1,
          propertypages: 1,
        },
      },
    ]);
    // const getallState = await City.find({ stateid: stateid });
    const message = {
      "status": "success",
      "message": "Data City with propertypage sucessfully",
      "data": result
    }
    res.json(message);
    // console.log(result);
  } catch (error) {
    console.error("Error counting properties by city:", error);
  }

});
const getByidGlimpse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaCity = await City.findById(id).populate("cityglimpse");
    const message = {
      "status": "success",
      "message": "Data city sucessfully",
      "data": getaCity
    }
    res.json(message);
    //res.json(getaCity);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  getCity,
  getallCity,
  getCityStateId,
  countPropertiesByCity,
  getCityWithLocation,
  getCityWithPropertypage,
  getByidGlimpse
};

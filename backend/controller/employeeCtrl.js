const Employee = require("../models/employeeModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { employeeImgResize } = require("../middlewares/uploadImage");

const createEmployee = asyncHandler(async (req, res) => {
  try {
    if(req.files){
      const processedImages = await employeeImgResize(req);
      if (processedImages.length > 0) {
        req.body.image = "public/images/employee/"+processedImages[0];
      }
    }
    const newEmployee = await Employee.create(req.body);
    const message={
      "status":"success",
      "message":"Data Added successfully",
      "data":newEmployee
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    if(req.files){
      const processedImages = await employeeImgResize(req);
      if (processedImages.length > 0) {
        req.body.image = "public/images/employee/"+processedImages[0];
      }
    }
    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const message = {
      "status": "success",
      "message": "Data updated successfully",
      "data": updatedEmployee
    };
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    const message={
      "status":"success",
      "message":"Data Deleted successfully",
      "data":deletedEmployee
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaEmployee = await Employee.findById(id);
    const message={
      "status":"success",
      "message":"Data fetched successfully",
      "data":getaEmployee
    }
    res.json(message);
   //res.json(getaEmployee);
  } catch (error) {
    throw new Error(error);
  }
});
const getallEmployee = asyncHandler(async (req, res) => {
  try {
    if (req.query.limit || req.query.page || req.query.skip) {
      const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
      const page = Math.max(parseInt(req.query.page || req.query.skip, 10) || 1, 1);
      const skip = (page - 1) * limit;

      const [items, totalCount] = await Promise.all([
        Employee.find()
          .sort({ priority: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Employee.countDocuments(),
      ]);

      return res.status(200).json({
        items,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit) || 1,
      });
    }

    const getallEmployee = await Employee.find().sort({ priority: 1, createdAt: -1 });
    res.json(getallEmployee);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
  getallEmployee,
};

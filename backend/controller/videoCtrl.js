const Video = require('../models/videoModel');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const fs = require('fs');
const path = require('path');

const createVideo = asyncHandler(async (req, res) => {
    try {
        if(req.file){
            const outputDir = path.join("public", "images", "video");
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            
            const filename = req.file.filename;
            const outputPath = path.join(outputDir, filename);
            fs.renameSync(req.file.path, outputPath);
            
            req.body.image = "public/images/video/" + filename;
        }
        const video = await Video.create(req.body);
        const message = {
            status: 'success',
            message: 'Video created successfully',
            data: video
        };
        res.json(message);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllVideos = asyncHandler(async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    throw new Error(error);
  }
});

const getVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const video = await Video.findById(id);
    const message = {
      status: 'success',
      message: 'Video retrieved successfully',
      data: video
    };
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    if(req.file){
      const outputDir = path.join("public", "images", "video");
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const filename = req.file.filename;
      const outputPath = path.join(outputDir, filename);
      fs.renameSync(req.file.path, outputPath);
      
      req.body.image = "public/images/video/" + filename;
    }
    const video = await Video.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const message = {
      status: 'success',
      message: 'Video updated successfully',
      data: video
    };
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const video = await Video.findByIdAndDelete(id);
    const message = {
      status: 'success',
      message: "Video deleted successfully",
      data: video
    };
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});



module.exports = {
  createVideo,
  getAllVideos,
  getVideo,
  updateVideo,
  deleteVideo
};
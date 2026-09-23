const LifeAtAkoodeImage = require("../models/lifeAtAkoodeImageModel");
const asyncHandler = require("express-async-handler");
const fs = require('fs');
const path = require('path');

// Create new image
const createImage = asyncHandler(async (req, res) => {
    try {
        if (req.file) {
            const outputDir = path.join("public", "images", "lifeatakoode");
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            const filename = req.file.filename;
            const outputPath = path.join(outputDir, filename);
            fs.renameSync(req.file.path, outputPath);

            req.body.image = "public/images/lifeatakoode/" + filename;
        }

        if (!req.body.image) {
            return res.status(400).json({
                status: 'error',
                message: 'Image is required'
            });
        }

        const newImage = await LifeAtAkoodeImage.create(req.body);
        const message = {
            status: 'success',
            message: 'Image created successfully',
            data: newImage
        };
        res.json(message);
    } catch (error) {
        throw new Error(error);
    }
});

// Get all images (admin - includes inactive)
const getAllImages = asyncHandler(async (req, res) => {
    try {
        const images = await LifeAtAkoodeImage.find().sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        throw new Error(error);
    }
});

// Get active images (frontend - active only)
const getActiveImages = asyncHandler(async (req, res) => {
    try {
        const images = await LifeAtAkoodeImage.find({ status: true })
            .sort({ createdAt: -1 })
            .select('image title');
        res.json(images);
    } catch (error) {
        throw new Error(error);
    }
});

// Get single image
const getImage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const image = await LifeAtAkoodeImage.findById(id);
        res.json(image);
    } catch (error) {
        throw new Error(error);
    }
});

// Update image
const updateImage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (req.file) {
            const outputDir = path.join("public", "images", "lifeatakoode");
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            const filename = req.file.filename;
            const outputPath = path.join(outputDir, filename);
            fs.renameSync(req.file.path, outputPath);

            req.body.image = "public/images/lifeatakoode/" + filename;
        }

        const updatedImage = await LifeAtAkoodeImage.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        const message = {
            status: 'success',
            message: 'Image updated successfully',
            data: updatedImage
        };
        res.json(message);
    } catch (error) {
        throw new Error(error);
    }
});

// Delete image
const deleteImage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedImage = await LifeAtAkoodeImage.findByIdAndDelete(id);
        if (!deletedImage) {
            return res.status(404).json({ status: "error", message: "Image not found", data: null });
        }
        const message={
      "status":"success",
      "message":"Data deleted successfully",
      "data":deletedImage
    }
    res.json(message);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createImage,
    getAllImages,
    getActiveImages,
    getImage,
    updateImage,
    deleteImage,
};

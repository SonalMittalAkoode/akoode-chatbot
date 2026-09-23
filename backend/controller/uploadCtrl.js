const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");

const uploadImages = asyncHandler(async (req, res) => {
  console.log("Uploaded Files:", req.files);
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const urls = [];
    const files = req.files;
    
    // Ensure images directory exists
    const outputDir = path.join("public", "images", "uploads");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const file of files) {
      const filename = file.filename;
      const sourcePath = file.path;
      const outputPath = path.join(outputDir, filename);

      // Copy file to uploads directory
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, outputPath);
        // Delete temp file
        fs.unlinkSync(sourcePath);
    }

      // Return the URL path that can be used in the frontend
      const imageUrl = `/public/images/uploads/${filename}`;
      urls.push(imageUrl);
    }

    res.json(urls);
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(error);
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // Extract filename from id (assuming id is the file path)
    const filePath = path.join("public", "images", "uploads", path.basename(id));
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error(error);
  }
});

module.exports = {
  uploadImages,
  deleteImages,
};

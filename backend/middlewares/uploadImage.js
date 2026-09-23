const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/"));
  },
  // filename: function (req, file, cb) {
  //   const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  //   cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
  // },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `upload-${uniquesuffix}${ext}`;
    cb(null, filename);
  },
});

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb({ message: "Unsupported file format" }, false);
//   }
// };
const multerFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "image/avif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.warn(`Unsupported file: ${file.originalname}, Type: ${file.mimetype}`);
    cb(new Error("Unsupported file format"), false);
  }
};

/**
 * Converts an uploaded file to WebP using Sharp and saves it to outputDir.
 * SVG and GIF are copied as-is (vector / animation — WebP conversion makes no sense).
 * Returns the final filename (with .webp extension for raster images).
 */
const toWebp = async (sourcePath, outputDir, originalFilename, multerFilename) => {
  const ext = path.extname(originalFilename).toLowerCase();
  const keepAsIs = ext === '.svg' || ext === '.gif';
  const outputFilename = multerFilename.replace(/\.[^.]+$/, keepAsIs ? ext : '.webp');
  const outputPath = path.join(outputDir, outputFilename);
  if (keepAsIs) {
    fs.copyFileSync(sourcePath, outputPath);
  } else {
    await sharp(sourcePath).toFormat('webp').webp({ quality: 85 }).toFile(outputPath);
  }
  // On Windows, Sharp may still hold the source file handle briefly after toFile() resolves.
  // Wrap unlink in its own try/catch so an EBUSY error never prevents the converted
  // filename from being returned — the output image is already saved at this point.
  try {
    if (fs.existsSync(sourcePath)) fs.unlinkSync(sourcePath);
  } catch (unlinkErr) {
    console.warn(`[toWebp] Could not delete temp file (will be cleaned up later): ${unlinkErr.message}`);
  }
  return outputFilename;
};


const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  // limits: { fileSize: 1000000 },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB

});
const dynamicFields = Array.from({ length: 20 }, (_, i) => ({
  name: `floorPlans[${i}][planimage]`, maxCount: 1
}));
const photoUploadMiddleware = uploadPhoto.fields([
  { name: 'featuredimage', maxCount: 1 },
  { name: 'siteplan', maxCount: 1 },
  { name: 'pdffile', maxCount: 1 },
  { name: 'propertySelectedImgs', maxCount: 10 },
  // ...dynamicFields
  

  // { name: 'planimage', maxCount: 80 }
  // { name: 'citylogo', maxCount: 1 },
  
]);
// const photoUploadMiddleware = uploadPhoto.any(); 
// const uploadPhoto1 = multer({
//   storage: storage,
//   fileFilter: multerFilter,
//   limits: { fileSize: 1000000 },
// });
const photoUploadMiddleware1 = uploadPhoto.any(); // accept any form field name
const processCasestudy = async (req, res, next) => {
  const processedFilenames = [];
  
  if (!req.processnew) return [];

  var file = req.processnew;
  
  // Ensure output directory exists
  const outputDir = path.join(__dirname, "../public/images/casestudyprocess");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  
  try {
        const ext = path.extname(file.originalname).toLowerCase();
        const filename = file.filename;
    
    // Get the correct source file path
    const sourcePath = file.path || path.join(__dirname, "../public/images", filename);
    
    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      console.error(`Source file not found: ${sourcePath}`);
      throw new Error(`Source file not found: ${filename}`);
    }
    
    const outputPath = path.join(outputDir, filename);
  
    // Copy file to destination
    fs.copyFileSync(sourcePath, outputPath);
    
    // Delete source file only if it exists and is in the temp location
    if (fs.existsSync(sourcePath) && sourcePath.includes("public/images")) {
      try {
        fs.unlinkSync(sourcePath);
      } catch (unlinkError) {
        console.warn(`Could not delete source file: ${sourcePath}`, unlinkError);
      }
    }
  
        processedFilenames.push({
      index: parseInt(file.fieldname.match(/\[(\d+)]/)?.[1] || 0), // extract index from fieldname
          filename,
          url: `public/images/casestudyprocess/${filename}`,
        });
  } catch (error) {
    console.error("Error processing case study image:", error);
    throw new Error(`Failed to process case study image: ${error.message}`);
  }
 
  return processedFilenames;
};
const processCasestudyGet = async (req, res, next) => {
  const processedFilenames = [];
  
  if (!req.processnewget) return [];

  var file = req.processnewget;
  
  // Ensure output directory exists
  const outputDir = path.join(__dirname, "../public/images/casestudyprocess");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  
  try {
        const ext = path.extname(file.originalname).toLowerCase();
        const filename = file.filename;
    
    // Get the correct source file path
    const sourcePath = file.path || path.join(__dirname, "../public/images", filename);
    
    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      console.error(`Source file not found: ${sourcePath}`);
      throw new Error(`Source file not found: ${filename}`);
    }
    
    const outputPath = path.join(outputDir, filename);
  
    // Copy file to destination
    fs.copyFileSync(sourcePath, outputPath);
    
    // Delete source file only if it exists and is in the temp location
    if (fs.existsSync(sourcePath) && sourcePath.includes("public/images")) {
      try {
        fs.unlinkSync(sourcePath);
      } catch (unlinkError) {
        console.warn(`Could not delete source file: ${sourcePath}`, unlinkError);
      }
    }
  
        processedFilenames.push({
      index: parseInt(file.fieldname.match(/\[(\d+)]/)?.[1] || 0), // extract index from fieldname
          filename,
          url: `public/images/casestudyprocess/${filename}`,
        });
  } catch (error) {
    console.error("Error processing case study image (get):", error);
    throw new Error(`Failed to process case study image: ${error.message}`);
  }
 
  return processedFilenames;
};


const servicesServices = async (req, res, next) => {
  const processedFilenames = [];
  
  if (!req.servicesnew ) return [];

  var file=req.servicesnew
    const outputDir = path.join(__dirname, "..", "public", "images", "services");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
        const ext = path.extname(file.originalname).toLowerCase();
        const isSvg = ext === '.svg';
  
        const filename = file.filename;
        const outputPath = path.join(outputDir, filename);
  
        // Use absolute path for source file
        const sourcePath = path.isAbsolute(file.path) ? file.path : path.join(__dirname, "..", file.path);
        
        // Check if source file exists before copying
        if (!fs.existsSync(sourcePath)) {
          console.error(`Source file not found: ${sourcePath}`);
          return processedFilenames;
        }
        
        fs.copyFileSync(sourcePath, outputPath);
          
        // Only delete source file if it exists and is in temp location
        if (fs.existsSync(sourcePath) && sourcePath.includes("public/images")) {
          fs.unlinkSync(sourcePath);
        }
  
        processedFilenames.push({
          index: parseInt(file.fieldname.match(/\[(\d+)]/)[1]), // extract index from fieldname
          filename,
          url: `public/images/services/${filename}`,
        });
  return processedFilenames;
};
const casestudyImgResize = async (req, res, next) => {
  const processedFilenames = [];
  const outputDir = path.join(__dirname, "../public/images/casestudys");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  await Promise.all(
    req.map(async (file) => {
      try {
        const webpFilename = await toWebp(file.path, outputDir, file.originalname, file.filename);
        processedFilenames.push(webpFilename);
      } catch (error) {
        console.error(`Error processing file ${file.filename}:`, error.message);
      }
    })
  );

  return processedFilenames;
};

const servicesImgResize = async (req, res, next) => {
  const processedFilenames = [];
  
    const outputDir = path.join(__dirname, "..", "public", "images", "services");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  
    await Promise.all(
      req.map(async (file) => {
        try {
          const ext = path.extname(file.originalname).toLowerCase();
          const isSvg = ext === '.svg';
    
          const filename = file.filename;
          const outputPath = path.join(outputDir, filename);
    
          // Use absolute path for source file
          const sourcePath = path.isAbsolute(file.path) ? file.path : path.join(__dirname, "..", file.path);
          
          // Check if source file exists before copying
          if (!fs.existsSync(sourcePath)) {
            console.error(`Source file not found: ${sourcePath}`);
            console.error(`File object:`, { path: file.path, filename: file.filename, originalname: file.originalname });
            return; // Skip this file instead of throwing error
          }
          
          fs.copyFileSync(sourcePath, outputPath);
            
          // Only delete source file if it exists and is in temp location
          if (fs.existsSync(sourcePath) && sourcePath.includes("public/images")) {
            fs.unlinkSync(sourcePath);
          }
    
          processedFilenames.push(filename);
        } catch (error) {
          console.error(`Error processing file ${file.filename}:`, error.message);
          // Continue processing other files instead of failing completely
        }
      })
    );
  
    return processedFilenames;
};
const processServices = async (req, res, next) => {
  const processedFilenames = [];
  
  if (!req.processnew ) return [];

  var file=req.processnew
      // const filename = `process-${Date.now()}-${file.originalname}.jpeg`;
      // const filename = file.filename;
      
      // const outputPath = path.join("public", "images", "casestudyprocess", filename);
      // await sharp(file.path)
      //   .resize(750, 450)
      //   .toFormat("jpeg")
      //   .jpeg({ quality: 90 })
      //   .toFile(outputPath);

      // // Optional: delete original file after processing
      // fs.unlinkSync(file.path);
  
    const outputDir = path.join("public", "images", "servicesprocess");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  
    // await Promise.all(
      // files.map(async (file) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const isSvg = ext === '.svg';
  
        const filename = file.filename;
        const outputPath = path.join(outputDir, filename);
  
        
          fs.copyFileSync(file.path, outputPath);
          
        fs.unlinkSync(file.path);
  
        processedFilenames.push({
          index: parseInt(file.fieldname.match(/\[(\d+)]/)[1]), // extract index from fieldname
          filename,
          url: `public/images/servicesprocess/${filename}`,
        });
      // })
    // );

      
 
  return processedFilenames;
};
const processServicesGet= async (req, res, next) => {
  const processedFilenames = [];
  
  if (!req.processnewget ) return [];

  var file=req.processnewget
      // const filename = `process-${Date.now()}-${file.originalname}.jpeg`;
      // const filename = file.filename;
      
      // const outputPath = path.join("public", "images", "casestudyprocess", filename);
      // await sharp(file.path)
      //   .resize(750, 450)
      //   .toFormat("jpeg")
      //   .jpeg({ quality: 90 })
      //   .toFile(outputPath);

      // // Optional: delete original file after processing
      // fs.unlinkSync(file.path);
  
    const outputDir = path.join("public", "images", "servicesprocess");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  
    // await Promise.all(
      // files.map(async (file) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const isSvg = ext === '.svg';
  
        const filename = file.filename;
        const outputPath = path.join(outputDir, filename);
  
        
          fs.copyFileSync(file.path, outputPath);
          
        fs.unlinkSync(file.path);
  
        processedFilenames.push({
          index: parseInt(file.fieldname.match(/\[(\d+)]/)[1]), // extract index from fieldname
          filename,
          url: `public/images/servicesprocess/${filename}`,
        });
      // })
    // );

      
 
  return processedFilenames;
};
const blogImgResize = async (req) => {
  const processedFilenames = [];
  const outputDir = path.join("public", "images", "blogs");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  await Promise.all(
    req.files.map(async (file) => {
      const webpFilename = await toWebp(file.path, outputDir, file.originalname, file.filename);
      processedFilenames.push(webpFilename);
    })
  );

  return processedFilenames;
};

// const blogImgResize = async (req) => {
//   if (!req.files || !Array.isArray(req.files)) return;

//   const processedFilenames = [];

//   await Promise.all(
//     req.files.map(async (file) => {
//       // const filename = `builder-${Date.now()}-${file.originalname}.jpeg`;
//       const filename =file.filename
//       const outputPath = path.join("public", "images", "blogs", filename);

//       await sharp(file.path)
//         .resize(650, 400)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(outputPath);

//       fs.unlinkSync(file.path); // delete original uploaded file

//       processedFilenames.push(filename);
//     })
//   );

//   return processedFilenames;
// };

const builderImgResize = async (req) => {
  if (!req.files || !Array.isArray(req.files)) return;

  const processedFilenames = [];

  await Promise.all(
    req.files.map(async (file) => {
      // const filename = `builder-${Date.now()}-${file.originalname}.jpeg`;
      const filename =file.filename
      const outputPath = path.join("public", "images", "builder", filename);

      await sharp(file.path)
        .resize(750, 450)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(outputPath);

      fs.unlinkSync(file.path); // delete original uploaded file

      processedFilenames.push(filename);
    })
  );

  return processedFilenames;
};
// const categoryImgResize = async (req) => {
//   if (!req.files || !Array.isArray(req.files)) return;

//   const processedFilenames = [];

//   await Promise.all(
//     req.files.map(async (file) => {
//       // const filename = `builder-${Date.now()}-${file.originalname}.jpeg`;
//       const filename =file.filename
//       const outputPath = path.join("public", "images", "category", filename);

//       await sharp(file.path)
//         .resize(750, 450)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(outputPath);

//       fs.unlinkSync(file.path); // delete original uploaded file

//       processedFilenames.push(filename);
//     })
//   );

//   return processedFilenames;
// };


const categoryImgResize = async (req) => {
  if (!req.files || !Array.isArray(req.files)) return;

  const processedFilenames = [];

  await Promise.all(
    req.files.map(async (file) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const filename = file.filename;
      const outputPath = path.join("public", "images", "category", filename);

      // Create folder if it doesn't exist
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      if (ext === ".webp") {
        // Copy .webp without converting
        fs.copyFileSync(file.path, outputPath);
      } else {
        // Convert other image formats to .jpeg using sharp
        await sharp(file.path)
          .resize(1920, 500)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(outputPath);
      }

      fs.unlinkSync(file.path); // delete original uploaded file
      processedFilenames.push(filename);
    })
  );

  return processedFilenames;
};


const featuredImageResize = async (req) => {
  // if (!req.files.featuredimage || !Array.isArray(req.files.featuredimage)) return;

  // const processedFilenames = [];

  // await Promise.all(
  //   req.files.featuredimage.map(async (file) => {
  //     // const filename = `builder-${Date.now()}-${file.originalname}.jpeg`;
  //     const filename =file.filename
  //     const outputPath = path.join("public", "images", "property", filename);

  //     await sharp(file.path)
  //       .resize(750, 450)
  //       .toFormat("jpeg")
  //       .jpeg({ quality: 90 })
  //       .toFile(outputPath);

  //     fs.unlinkSync(file.path); // delete original uploaded file

  //     processedFilenames.push(filename);
  //   })
  // );

  // return processedFilenames;
  if (!req.files.featuredimage || !Array.isArray(req.files.featuredimage)) return;
  
    const processedFilenames = [];
  
    const outputDir = path.join("public", "images", "property");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  
    await Promise.all(
      req.files.featuredimage.map(async (file) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const isSvg = ext === '.svg';
  
        const filename = file.filename;
        const outputPath = path.join(outputDir, filename);
  
        // if (isSvg) {
          // Copy SVG file
          fs.copyFileSync(file.path, outputPath);
          // await fs.promises.writeFile(outputPath, file.data);
        // } else {
        //   // Resize non-SVG file
        //   await sharp(file.path)
        //     .resize(650, 400)
        //     .toFormat('jpeg')
        //     .jpeg({ quality: 90 })
        //     .toFile(outputPath);
        // }
  
        // Optional cleanup
        fs.unlinkSync(file.path);
  
        processedFilenames.push(filename);
      })
    );
  
    return processedFilenames;
};
const sitePlanResize = async (req) => {
  

  // if (!req.files.siteplan || !Array.isArray(req.files.siteplan)) return;

  // const processedFilenames = [];
 
  // await Promise.all(
  //   req.files.siteplan.map(async (file) => {
  //     // const filename = `builder-${Date.now()}-${file.originalname}.jpeg`;
  //     const filename =file.filename
  //     const outputPath = path.join("public", "images", "siteplan", filename);

  //     await sharp(file.path)
  //       .resize(800, 420)
  //       .toFormat("jpeg")
  //       .jpeg({ quality: 90 })
  //       .toFile(outputPath);

  //     fs.unlinkSync(file.path); // delete original uploaded file

  //     processedFilenames.push(filename);
  //   })
  // );

  // return processedFilenames;
  if (!req.files.siteplan || !Array.isArray(req.files.siteplan)) return;
  
    const processedFilenames = [];
  
    const outputDir = path.join("public", "images", "siteplan");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  
    await Promise.all(
      req.files.map(async (file) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const isSvg = ext === '.svg';
  
        const filename = file.filename;
        const outputPath = path.join(outputDir, filename);
  
        // if (isSvg) {
          // Copy SVG file
          fs.copyFileSync(file.path, outputPath);
          // await fs.promises.writeFile(outputPath, file.data);
        // } else {
        //   // Resize non-SVG file
        //   await sharp(file.path)
        //     .resize(650, 400)
        //     .toFormat('jpeg')
        //     .jpeg({ quality: 90 })
        //     .toFile(outputPath);
        // }
  
        // Optional cleanup
        fs.unlinkSync(file.path);
  
        processedFilenames.push(filename);
      })
    );
  
    return processedFilenames;
};
const masterPlanResize = async (req) => {
  

  // if (!req.files.masterplan || !Array.isArray(req.files.masterplan)) return;

  // const processedFilenames = [];
 
  // await Promise.all(
  //   req.files.masterplan.map(async (file) => {
  //     // const filename = `builder-${Date.now()}-${file.originalname}.jpeg`;
  //     const filename =file.filename
  //     const outputPath = path.join("public", "images", "masterplan", filename);

  //     await sharp(file.path)
  //       .resize(800, 420)
  //       .toFormat("jpeg")
  //       .jpeg({ quality: 90 })
  //       .toFile(outputPath);

  //     fs.unlinkSync(file.path); // delete original uploaded file

  //     processedFilenames.push(filename);
  //   })
  // );

  // return processedFilenames;
  if (!req.files.masterplan || !Array.isArray(req.files.masterplan)) return;
  
    const processedFilenames = [];
  
    const outputDir = path.join("public", "images", "masterplan");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  
    await Promise.all(
      req.files.masterplan.map(async (file) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const isSvg = ext === '.svg';
  
        const filename = file.filename;
        const outputPath = path.join(outputDir, filename);
  
        // if (isSvg) {
          // Copy SVG file
          fs.copyFileSync(file.path, outputPath);
          // await fs.promises.writeFile(outputPath, file.data);
        // } else {
        //   // Resize non-SVG file
        //   await sharp(file.path)
        //     .resize(650, 400)
        //     .toFormat('jpeg')
        //     .jpeg({ quality: 90 })
        //     .toFile(outputPath);
        // }
  
        // Optional cleanup
        fs.unlinkSync(file.path);
  
        processedFilenames.push(filename);
      })
    );
  
    return processedFilenames;
};
const testimonialImgResize = async (req) => {
  if (!req.files || !Array.isArray(req.files)) return [];

  const processedFilenames = [];
  const outputDir = path.join("public", "images", "testimonial");
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await Promise.all(
    req.files.map(async (file) => {
      const filename = file.filename;
      const ext = path.extname(file.originalname).toLowerCase();
      const isSvg = ext === '.svg';
      const outputPath = path.join(outputDir, filename);

      try {
        const ext = path.extname(file.originalname).toLowerCase();
        const keepAsIs = ext === '.svg' || ext === '.gif';
        const webpFilename = file.filename.replace(/\.[^.]+$/, keepAsIs ? ext : '.webp');
        const webpOutputPath = path.join(outputDir, webpFilename);

        if (keepAsIs) {
          fs.copyFileSync(file.path, webpOutputPath);
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        } else {
          await sharp(file.path)
            .resize(260, 260)
            .toFormat('webp')
            .webp({ quality: 85 })
            .toFile(webpOutputPath);
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        }

        processedFilenames.push(webpFilename);
      } catch (error) {
        console.error(`Error processing testimonial image [${filename}]:`, error.message);
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }
    })
  );

  return processedFilenames;
};

const employeeImgResize = async (req) => {
  if (!req.files || !Array.isArray(req.files)) return [];

  const processedFilenames = [];
  const outputDir = path.join("public", "images", "employee");
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Helper function to safely delete file with retry
  const safeUnlink = async (filePath, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        // Add small delay to ensure file handle is released
        await new Promise(resolve => setTimeout(resolve, 100));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return;
      } catch (error) {
        if (i === retries - 1) {
          // Last retry failed, log but don't throw
          console.warn(`Could not delete temp file ${filePath}:`, error.message);
        } else {
          // Wait longer before retry
          await new Promise(resolve => setTimeout(resolve, 200 * (i + 1)));
        }
      }
    }
  };

  await Promise.all(
    req.files.map(async (file) => {
      const filename = file.filename;
      const ext = path.extname(file.originalname).toLowerCase();
      const isSvg = ext === '.svg';
      const outputPath = path.join(outputDir, filename);

      try {
        const ext = path.extname(file.originalname).toLowerCase();
        const keepAsIs = ext === '.svg' || ext === '.gif';
        const webpFilename = filename.replace(/\.[^.]+$/, keepAsIs ? ext : '.webp');
        const webpOutputPath = path.join(outputDir, webpFilename);

        if (keepAsIs) {
          fs.copyFileSync(file.path, webpOutputPath);
        } else {
          // .rotate() with no args applies EXIF orientation so uploads from phones display correctly.
          await sharp(file.path)
            .rotate()
            .resize(400, 400)
            .toFormat('webp')
            .webp({ quality: 85 })
            .toFile(webpOutputPath);
        }

        await safeUnlink(file.path);
        processedFilenames.push(webpFilename);
      } catch (error) {
        console.error(`Error processing employee image [${filename}]:`, error.message);
        await safeUnlink(file.path);
      }
    })
  );

  return processedFilenames;
};

const videoImgResize = async (req) => {
  if (!req.file) return [];

  const outputDir = path.join("public", "images", "video");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = req.file.filename;
  const ext = path.extname(req.file.originalname).toLowerCase();
  const isSvg = ext === ".svg";
  const outputPath = path.join(outputDir, filename);

  try {
    if (isSvg) {
      fs.copyFileSync(req.file.path, outputPath);
    } else {
      await sharp(req.file.path)
        .resize(1280, 720)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(outputPath);
    }

    fs.unlinkSync(req.file.path); // delete original uploaded file
    return [filename];
  } catch (err) {
    console.error(`❌ Error processing video image [${filename}]: ${err.message}`);
    return [];
  }
};

// const propertySelectedImgsResize = async (req) => {

//   // if (!req.files.propertySelectedImgs || !Array.isArray(req.files.propertySelectedImgs)) return;

//   // const processedFilenames = [];
//   // await Promise.all(
//   //   req.files.propertySelectedImgs.map(async (file) => {
      
//   //     // const filename = `builder-${Date.now()}-${file.originalname}.jpeg`;
//   //     const filename =file.filename
//   //     const outputPath = path.join("public", "images", "propertyimage", filename);

//   //     await sharp(file.path)
//   //       .resize(750, 450)
//   //       .toFormat("jpeg")
//   //       .jpeg({ quality: 90 })
//   //       .toFile(outputPath);

//   //     // fs.unlinkSync(file.path); // delete original uploaded file

//   //     processedFilenames.push("public/images/propertyimage/"+filename);
//   //   })
//   // );

//   // return processedFilenames;
//   console.log("req.files.propertySelectedImgs")
//   console.log(req.files.propertySelectedImgs)
//   if (!req.files.propertySelectedImgs || !Array.isArray(req.files.propertySelectedImgs)) return;
  
//     const processedFilenames = [];
  
//     const outputDir = path.join("public", "propertyimage", "amenity");
//     if (!fs.existsSync(outputDir)) {
//       fs.mkdirSync(outputDir, { recursive: true });
//     }
  
//     await Promise.all(
//       req.files.propertySelectedImgs.map(async (file) => {
//         const ext = path.extname(file.originalname).toLowerCase();
//         const isSvg = ext === '.svg';
  
//         const filename = file.filename;
//         const outputPath = path.join(outputDir, filename);
  
//         // if (isSvg) {
//           // Copy SVG file
//           fs.copyFileSync(file.path, outputPath);
//           // await fs.promises.writeFile(outputPath, file.data);
//         // } else {
//         //   // Resize non-SVG file
//         //   await sharp(file.path)
//         //     .resize(650, 400)
//         //     .toFormat('jpeg')
//         //     .jpeg({ quality: 90 })
//         //     .toFile(outputPath);
//         // }
  
//         // Optional cleanup
//         fs.unlinkSync(file.path);
  
//         processedFilenames.push(filename);
//       })
//     );
  
//     return processedFilenames;
// };


const propertySelectedImgsResize = async (filesArray) => {
  const processedFilenames = [];
  const outputDir = path.join("public", "images", "propertyimage");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await Promise.all(
    filesArray.map(async (file) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const filename = file.filename;
      const outputPath = path.join(outputDir, filename);

      fs.copyFileSync(file.path, outputPath);
      fs.unlinkSync(file.path);

      // processedFilenames.push(filename);
      processedFilenames.push("public/images/propertyimage/"+filename);
    })
  );

  return processedFilenames;
};

const cityImgResize = async (req) => {

  if (!req.files || !Array.isArray(req.files)) return;

  const processedFilenames = [];

  await Promise.all(
    req.files.map(async (file) => {
      // const filename = `builder-${Date.now()}-${file.originalname}.jpeg`;
      const filename =file.filename
      const outputPath = path.join("public", "images", "city", filename);

      await sharp(file.path)
        .resize(755, 355)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(outputPath);

      fs.unlinkSync(file.path); // delete original uploaded file


      processedFilenames.push(filename);
    })
  );

  return processedFilenames;
};

const processFloorPlanImagesAdd = async (req) => {
  // const processedFilenames = [];

  // if (!req.floorPlansnew) return [];

  // const file = req.floorPlansnew;

  // // Remove original extension before adding .jpeg
  // const originalNameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
  // const filename = `floorplan-${Date.now()}-${originalNameWithoutExt}.jpeg`;
  // const outputPath = path.join("public", "images", "propertyplan", filename);

  // try {
  //   await sharp(file.path)
  //     .resize(750, 450)
  //     .toFormat("jpeg")
  //     .jpeg({ quality: 90 })
  //     .toFile(outputPath);

  //   fs.unlinkSync(file.path); // clean up original

  //   processedFilenames.push({
  //     index: parseInt(file.fieldname.match(/\[(\d+)]/)[1]),
  //     filename,
  //     url: `public/images/propertyplan/${filename}`,
  //   });
  // } catch (err) {
  //   console.error("Error processing floor plan image:", err.message);
  //   fs.unlinkSync(file.path);
  // }

  // return processedFilenames;
   const processedFilenames = [];
  
    if (!req.planimage) return [];
  
    const file = req.planimage;
    console.log("test")
    console.log(file)
  
    const ext = path.extname(file.originalname).toLowerCase();
    const isSvgOrWebp = ext === '.svg' || ext === '.webp';
  
    const filename = `floorplan-${Date.now()}-${file.originalname}`;
    const outputDir = path.join("public", "images", "propertyplan");
    const outputPath = path.join(outputDir, filename);
  
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  
    if (isSvgOrWebp) {
      // just copy the file (no resizing)
      fs.copyFileSync(file.path, outputPath);
    } else {
      // use sharp to convert to jpeg
      await sharp(file.path)
        .resize(750, 450)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(outputPath);
    }
  
    // remove temp file after processing
    fs.unlinkSync(file.path);
  
    processedFilenames.push({
      index: parseInt(file.fieldname.match(/\[(\d+)]/)?.[1] || 0), // fallback to 0 if no index found
      filename,
      url: `public/images/propertyplan/${filename}`,
    });
  
    return processedFilenames;
};


const processFloorPlanImages = async (req) => {
  const processedFilenames = [];

  if (!req.planimage) return [];

  const file = req.planimage;
  console.log(file)
  console.log("file")


  const ext = path.extname(file.originalname).toLowerCase();
  const isSvgOrWebp = ext === '.svg' || ext === '.webp';

  const filename = `floorplan-${Date.now()}${ext}`;
  const outputDir = path.join("public", "images", "propertyplan");
  const outputPath = path.join(outputDir, filename);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (isSvgOrWebp) {
    // just copy the file (no resizing)
    fs.copyFileSync(file.path, outputPath);
  } else {
    // use sharp to convert to jpeg
    await sharp(file.path)
      .resize(750, 450)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(outputPath);
  }

  // remove temp file after processing
  fs.unlinkSync(file.path);

  processedFilenames.push({
    index: parseInt(file.fieldname.match(/\[(\d+)]/)?.[1] || 0), // fallback to 0 if no index found
    filename,
    url: `public/images/propertyplan/${filename}`,
  });

  return processedFilenames;
};

const processFloorPlanImagesGet = async (req) => {
  // const processedFilenames = [];
 
  // if (!req.planimageget ) return [];

  // var file=req.planimageget
  //     const filename = `floorplan-${Date.now()}-${file.originalname}.jpeg`;
  //     const outputPath = path.join("public", "images", "propertyplan", filename);
  //     await sharp(file.path)
  //       .resize(750, 450)
  //       .toFormat("jpeg")
  //       .jpeg({ quality: 90 })
  //       .toFile(outputPath);

  //     // Optional: delete original file after processing
  //     fs.unlinkSync(file.path);

  //     processedFilenames.push({
  //       index: parseInt(file.fieldname.match(/\[(\d+)]/)[1]), // extract index from fieldname
  //       filename,
  //       url: `public/images/propertyplan/${filename}`,
  //     });
  
  // return processedFilenames;
   const processedFilenames = [];

  if (!req.planimageget) return [];

  const file = req.planimageget;

  const ext = path.extname(file.originalname).toLowerCase();
  const isSvgOrWebp = ext === '.svg' || ext === '.webp';

  const filename = `floorplan-${Date.now()}${ext}`;
  const outputDir = path.join("public", "images", "propertyplan");
  const outputPath = path.join(outputDir, filename);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (isSvgOrWebp) {
    // just copy the file (no resizing)
    fs.copyFileSync(file.path, outputPath);
  } else {
    // use sharp to convert to jpeg
    await sharp(file.path)
      .resize(750, 450)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(outputPath);
  }

  // remove temp file after processing
  fs.unlinkSync(file.path);

  processedFilenames.push({
    index: parseInt(file.fieldname.match(/\[(\d+)]/)?.[1] || 0), // fallback to 0 if no index found
    filename,
    url: `public/images/propertyplan/${filename}`,
  });

  return processedFilenames;
};
const processLandingPlanGet = async (req) => {
  const processedFilenames = [];
  if (!req ) return [];

  var file=req.floorPlansgetnew
  
      const filename = `floorplan-${Date.now()}-${file.originalname}.jpeg`;
      const outputPath = path.join("public", "images", "landing", filename);
      await sharp(file.path)
        .resize(750, 450)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(outputPath);

      // Optional: delete original file after processing
      fs.unlinkSync(file.path);

      processedFilenames.push({
        index: parseInt(file.fieldname.match(/\[(\d+)]/)[1]), // extract index from fieldname
        filename,
        url: `public/images/landing/${filename}`,
      });
  
  return processedFilenames;
};
const processLandingPlan = async (req) => {
  const processedFilenames = [];
  
  if (!req.floorPlansnew ) return [];

  var file=req.floorPlansnew
      const filename = `floorplan-${Date.now()}-${file.originalname}.jpeg`;
      const outputPath = path.join("public", "images", "propertyplan", filename);
      await sharp(file.path)
        .resize(750, 450)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(outputPath);

      // Optional: delete original file after processing
      fs.unlinkSync(file.path);

      processedFilenames.push({
        index: parseInt(file.fieldname.match(/\[(\d+)]/)[1]), // extract index from fieldname
        filename,
        url: `public/images/propertyplan/${filename}`,
      });
 
  return processedFilenames;
};

const amenityImgResize = async (req) => {
  if (!req.files || !Array.isArray(req.files)) return;

  const processedFilenames = [];

  const outputDir = path.join("public", "images", "amenity");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await Promise.all(
    req.files.map(async (file) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const isSvg = ext === '.svg';

      const filename = file.filename;
      const outputPath = path.join(outputDir, filename);

      if (isSvg) {
        // Copy SVG file
        fs.copyFileSync(file.path, outputPath);
        // await fs.promises.writeFile(outputPath, file.data);
      } else {
        // Resize non-SVG file
        await sharp(file.path)
          .resize(650, 400)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(outputPath);
      }

      // Optional cleanup
      fs.unlinkSync(file.path);

      processedFilenames.push(filename);
    })
  );

  return processedFilenames;
};
const bannerImageResize = async (req) => {
 
  const processedFilenames = [];
  await Promise.all(
    req.map(async (file) => {
      // const filename = `builder-${Date.now()}-${file.originalname}.jpeg`;
      const filename =file.filename
      const outputPath = path.join("public", "images", "landing", filename);
      const ext = path.extname(file.originalname).toLowerCase();
      const isSvg = ext === '.svg';

      const outputDir = path.join("public", "images", "landing");
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

      if (isSvg) {
      const outputPath1 = path.join(outputDir, filename);
        
        // Copy SVG file
        fs.copyFileSync(file.path, outputPath1);
        // await fs.promises.writeFile(outputPath, file.data);
      } else {
      await sharp(file.path)
        .resize(1920, 1080)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(outputPath);
      }

      // fs.unlinkSync(file.path); // delete original uploaded file

      processedFilenames.push(filename);
    })
  );

  return processedFilenames;
};
// const featuredImageResizeAdd = async (req) => {
//  console.log("featuredImageResizeAdd")
// console.log(req)
//   const processedFilenames = [];
//   await Promise.all(
//     req.map(async (file) => {
//       // const filename = `builder-${Date.now()}-${file.originalname}.jpeg`;
//       const filename =file.filename
//       const outputPath = path.join("public", "images", "property", filename);
//       const ext = path.extname(file.originalname).toLowerCase();
//       const isSvg = ext === '.svg';

//       const outputDir = path.join("public", "images", "property");
//         if (!fs.existsSync(outputDir)) {
//           fs.mkdirSync(outputDir, { recursive: true });
//         }

//       if (isSvg) {
//       const outputPath1 = path.join(outputDir, filename);
        
//         // Copy SVG file
//         fs.copyFileSync(file.path, outputPath1);
//         // await fs.promises.writeFile(outputPath, file.data);
//       } else {
//       await sharp(file.path)
//         .resize(1920, 1080)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(outputPath);
//       }

//       // fs.unlinkSync(file.path); // delete original uploaded file

//       processedFilenames.push(filename);
//     })
//   );

//   return processedFilenames;
// };
const featuredImageResizeAdd = async (req) => {
  const processedFilenames = [];
  const outputDir = path.join("public", "images", "property");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await Promise.all(
    req.map(async (file) => {
      const filename = file.filename;
      const ext = path.extname(file.originalname).toLowerCase();
      const isSvg = ext === ".svg";
      const outputPath = path.join(outputDir, filename);

      try {
        // if (isSvg) {
          fs.copyFileSync(file.path, outputPath);
        // } else {
        //   await sharp(file.path, { failOnError: false }) // 👈 suppress decoding failure
        //     .resize(1920, 1080)
        //     .toFormat("jpeg")
        //     .jpeg({ quality: 90 })
        //     .toFile(outputPath);
        // }

        processedFilenames.push(filename);
      } catch (err) {
        console.error(`❌ Skipping file [${filename}]: ${err.message}`);
        // Optionally: notify frontend or log
      }
    })
  );

  return processedFilenames;

  
};
// const featuredImageResizeAddSite = async (req) => {
//  console.log("featuredImageResizeAddSite")
// console.log(req)
//   const processedFilenames = [];
//   await Promise.all(
//     req.map(async (file) => {
//       // const filename = `builder-${Date.now()}-${file.originalname}.jpeg`;
//       const filename =file.filename
//       const outputPath = path.join("public", "images", "siteplan", filename);
//       const ext = path.extname(file.originalname).toLowerCase();
//       const isSvg = ext === '.svg';

//       const outputDir = path.join("public", "images", "siteplan");
//         if (!fs.existsSync(outputDir)) {
//           fs.mkdirSync(outputDir, { recursive: true });
//         }

//       if (isSvg) {
//       const outputPath1 = path.join(outputDir, filename);
        
//         // Copy SVG file
//         // fs.copyFileSync(file.path, outputPath1);
//         // await fs.promises.writeFile(outputPath, file.data);
//       } else {
//       await sharp(file.path)
//         .resize(1920, 1080)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(outputPath);
//       }

//       // fs.unlinkSync(file.path); // delete original uploaded file

//       processedFilenames.push(filename);
//     })
//   );

//   return processedFilenames;
// };

const featuredImageResizeAddSite = async (req) => {
  const processedFilenames = [];
  const outputDir = path.join("public", "images", "siteplan");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await Promise.all(
    req.map(async (file) => {
      const filename = file.filename;
      const ext = path.extname(file.originalname).toLowerCase();
      const isSvg = ext === ".svg";
      const outputPath = path.join(outputDir, filename);

      try {
        // if (isSvg) {
          fs.copyFileSync(file.path, outputPath); // ✅ SVG copy restored
        // } else {
        //   await sharp(file.path, { failOnError: false }) // ✅ added
        //     .resize(1920, 1080)
        //     .toFormat("jpeg")
        //     .jpeg({ quality: 90 })
        //     .toFile(outputPath);
        // }

        processedFilenames.push(filename);
      } catch (err) {
        console.error(`⚠️ Skipped file ${filename}: ${err.message}`);
        // You can optionally collect skipped files
      }
    })
  );

  return processedFilenames;
};
const featuredImageResizeAddMaster = async (req) => {
  const processedFilenames = [];
  const outputDir = path.join("public", "images", "masterplan");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await Promise.all(
    req.map(async (file) => {
      const filename = file.filename;
      const ext = path.extname(file.originalname).toLowerCase();
      const isSvg = ext === ".svg";
      const outputPath = path.join(outputDir, filename);

      try {
        // if (isSvg) {
          fs.copyFileSync(file.path, outputPath); // ✅ SVG copy restored
        // } else {
        //   await sharp(file.path, { failOnError: false }) // ✅ added
        //     .resize(1920, 1080)
        //     .toFormat("jpeg")
        //     .jpeg({ quality: 90 })
        //     .toFile(outputPath);
        // }

        processedFilenames.push(filename);
      } catch (err) {
        console.error(`⚠️ Skipped file ${filename}: ${err.message}`);
        // You can optionally collect skipped files
      }
    })
  );

  return processedFilenames;
};
const aboutImageResize = async (req) => {
 
  if (!req.files.aboutimage || !Array.isArray(req.files.aboutimage)) return;

  const processedFilenames = [];

  await Promise.all(
    req.files.aboutimage.map(async (file) => {
      // const filename = `builder-${Date.now()}-${file.originalname}.jpeg`;
      const filename =file.filename
      const outputPath = path.join("public", "images", "landing", filename);

      await sharp(file.path)
        .resize(750, 450)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(outputPath);

      fs.unlinkSync(file.path); // delete original uploaded file

      processedFilenames.push(filename);
    })
  );

  return processedFilenames;
};
const gallerySelectedImgsResize = async (req) => {

  // if (!req.files.gallerySelectedImgs || !Array.isArray(req.files.gallerySelectedImgs)) return;

  const processedFilenames = [];
  await Promise.all(
    req.map(async (file) => {
      
      // const filename = `builder-${Date.now()}-${file.originalname}.jpeg`;
      const filename =file.filename
      const outputPath = path.join("public", "images", "landing", filename);

      await sharp(file.path)
        .resize(750, 450)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(outputPath);

      // fs.unlinkSync(file.path); // delete original uploaded file

      processedFilenames.push("public/images/landing/"+filename);
    })
  );

  return processedFilenames;
};
const propertySelectedImgsResizeadd = async (req) => {

  // if (!req.files.gallerySelectedImgs || !Array.isArray(req.files.gallerySelectedImgs)) return;


  // const processedFilenames = [];
  // await Promise.all(
  //   req.map(async (file) => {
      
  //     // const filename = `builder-${Date.now()}-${file.originalname}.jpeg`;
  //     const filename =file.filename
  //     const outputPath = path.join("public", "images", "propertyimage", filename);

  //     await sharp(file.path)
  //       .resize(750, 450)
  //       .toFormat("jpeg")
  //       .jpeg({ quality: 90 })
  //       .toFile(outputPath);

  //     fs.unlinkSync(file.path); // delete original uploaded file

  //     processedFilenames.push("public/images/propertyimage/"+filename);
  //   })
  // );

  // return processedFilenames;
  if (!req.files || !Array.isArray(req.files)) return;
  
    const processedFilenames = [];
  
    const outputDir = path.join("public", "propertyimage", "amenity");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  
    await Promise.all(
      req.map(async (file) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const isSvg = ext === '.svg';
  
        const filename = file.filename;
        const outputPath = path.join(outputDir, filename);
  
        // if (isSvg) {
          // Copy SVG file
          fs.copyFileSync(file.path, outputPath);
          // await fs.promises.writeFile(outputPath, file.data);
        // } else {
        //   // Resize non-SVG file
        //   await sharp(file.path)
        //     .resize(650, 400)
        //     .toFormat('jpeg')
        //     .jpeg({ quality: 90 })
        //     .toFile(outputPath);
        // }
  
        // Optional cleanup
        fs.unlinkSync(file.path);
  
        processedFilenames.push(filename);
      })
    );
  
    return processedFilenames;
};
const groupFilesByFieldname = (files) => {
  const fileMap = {};
  files.forEach(file => {
    if (!fileMap[file.fieldname]) {
      fileMap[file.fieldname] = [];
    }
    fileMap[file.fieldname].push(file);
  });
  return fileMap;
};
const groupFilesByFieldname2 = (files) => {
  const fileMap = {};
  files.forEach(file => {
    // Normalize fieldname like gallerySelectedImgs[0] → gallerySelectedImgs
    const baseField = file.fieldname.replace(/\[\d+\]/, '');
    
    if (!fileMap[baseField]) {
      fileMap[baseField] = [];
    }
    fileMap[baseField].push(file);
  });
  return fileMap;
};
const processUploadedPDFs = async (req) => {
 
  if (!req.files.pdffile || !Array.isArray(req.files.pdffile)) return;

  const processedFilenames = [];

  await Promise.all(
    req.files.pdffile.map(async (file) => {
     
      const filename = file.filename;
      const outputPath = path.join("public", "images", "pdffile", filename);

      // Ensure destination directory exists
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });

      // Move file from temp location to target
      fs.renameSync(file.path, outputPath);

      processedFilenames.push(filename);
    })
  );

  return processedFilenames;
};
const processUploadedPDFsadd = async (req) => {
 
  // if (!req.files.pdffile || !Array.isArray(req.files.pdffile)) return;

  const processedFilenames = [];

  await Promise.all(
    req.map(async (file) => {
     
      const filename = file.filename;
      const outputPath = path.join("public", "images", "pdffile", filename);

      // Ensure destination directory exists
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });

      // Move file from temp location to target
      fs.renameSync(file.path, outputPath);

      processedFilenames.push(filename);
    })
  );

  return processedFilenames;
};


const ServicesStepGet = async (req, res, next) => {
  const processedFilenames = [];
  
  if (!req.servicesget ) return [];

  var file=req.servicesget
    const outputDir = path.join(__dirname, "..", "public", "images", "servicesstep");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  
    // await Promise.all(
      // files.map(async (file) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const isSvg = ext === '.svg';

        const filename = file.filename;
        const outputPath = path.join(outputDir, filename);

        // Use absolute path for source file
        const sourcePath = path.isAbsolute(file.path) ? file.path : path.join(__dirname, "..", file.path);
        
        // Check if source file exists before copying
        if (!fs.existsSync(sourcePath)) {
          console.error(`Source file not found: ${sourcePath}`);
          return processedFilenames;
        }
        
        fs.copyFileSync(sourcePath, outputPath);
          
        // Only delete source file if it exists and is in temp location
        if (fs.existsSync(sourcePath) && sourcePath.includes("public/images")) {
          fs.unlinkSync(sourcePath);
        }

        processedFilenames.push({
          index: parseInt(file.fieldname.match(/\[(\d+)]/)[1]), // extract index from fieldname
          filename,
          url: `public/images/servicesstep/${filename}`,
        });
      // })
    // );

      
  
  return processedFilenames;
};
const sbcImgResize = async (filesArray) => {
  const processedFilenames = [];
  const outputDir = path.join(__dirname, "../public/images/sbc");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  await Promise.all(
    filesArray.map(async (file) => {
      try {
        const webpFilename = await toWebp(file.path, outputDir, file.originalname, file.filename);
        processedFilenames.push(webpFilename);
      } catch (error) {
        console.error(`Error processing SBC file ${file.filename}:`, error.message);
      }
    })
  );

  return processedFilenames;
};

const sbcCityImgResize = async (filesArray) => {
  const processedFilenames = [];
  const outputDir = path.join(__dirname, "../public/images/sbc-city");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  await Promise.all(
    filesArray.map(async (file) => {
      try {
        const webpFilename = await toWebp(file.path, outputDir, file.originalname, file.filename);
        processedFilenames.push(webpFilename);
      } catch (error) {
        console.error(`Error processing SBC-City file ${file.filename}:`, error.message);
      }
    })
  );

  return processedFilenames;
};

const caseStudyLatestImgResize = async (filesArray) => {
  const processedFilenames = [];
  const outputDir = path.join(__dirname, "../public/images/case-study-latest");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  await Promise.all(
    filesArray.map(async (file) => {
      try {
        const webpFilename = await toWebp(file.path, outputDir, file.originalname, file.filename);
        processedFilenames.push(webpFilename);
      } catch (error) {
        console.error(`Error processing CaseStudyLatest file ${file.filename}:`, error.message);
      }
    })
  );

  return processedFilenames;
};

// Move a raw (non-image, e.g. video) upload into the case-study-latest folder
// untouched (no webp conversion) and return its stored filename.
const caseStudyLatestMoveRaw = (file) => {
  const outputDir = path.join(__dirname, "../public/images/case-study-latest");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const outName = file.filename;
  const outPath = path.join(outputDir, outName);
  try {
    fs.renameSync(file.path, outPath);
  } catch (err) {
    // cross-device fallback
    fs.copyFileSync(file.path, outPath);
    try { fs.unlinkSync(file.path); } catch (_) {}
  }
  return outName;
};

// Image + video capable upload for the Case Study Latest module (100MB cap).
const caseStudyLatestMediaFilter = (req, file, cb) => {
  const t = file.mimetype || "";
  if (t.startsWith("image") || t.startsWith("video")) cb(null, true);
  else cb(new Error("Unsupported file format — only image or video allowed"), false);
};
const caseStudyLatestUpload = multer({
  storage,
  fileFilter: caseStudyLatestMediaFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});
const caseStudyLatestUploadMiddleware = caseStudyLatestUpload.any();

module.exports = { uploadPhoto, blogImgResize,builderImgResize,featuredImageResize,sitePlanResize,masterPlanResize,photoUploadMiddleware,testimonialImgResize,employeeImgResize,propertySelectedImgsResize ,cityImgResize,processFloorPlanImages,photoUploadMiddleware1,processFloorPlanImagesGet,amenityImgResize,bannerImageResize,aboutImageResize,gallerySelectedImgsResize,groupFilesByFieldname,groupFilesByFieldname2,processLandingPlanGet,processLandingPlan,processUploadedPDFs,processFloorPlanImagesAdd,featuredImageResizeAdd,featuredImageResizeAddSite,propertySelectedImgsResizeadd,processUploadedPDFsadd,featuredImageResizeAddMaster,categoryImgResize,casestudyImgResize,processCasestudy,processCasestudyGet,servicesImgResize,processServices,processServicesGet,servicesServices,ServicesStepGet,sbcImgResize,sbcCityImgResize,caseStudyLatestImgResize,caseStudyLatestMoveRaw,caseStudyLatestUploadMiddleware};

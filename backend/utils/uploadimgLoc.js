// const cloudinary = require("cloudinary");

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.SECRET_KEY,
// });

// const fs = require("fs").promises;
// const slugify = require("slugify");

// const cloudinaryUploadImg = async (fileToUploads) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       console.log("test")
//       console.log(fileToUploads)
//       console.log(fileToUploads[0].filename)
//       // let file_extension = fileToUploads.filename.split(".").pop();
//       // let testname = slugify(fileToUploads.filename.split(".")[0], {
//       //   replacement: "-",
//       //   remove: undefined,
//       //   lower: false,
//       // });
//       let filename = fileToUploads[0].filename;
//       let filePath = `public/images/products/${filename}`;

//       // Save file using fs.promises.writeFile
//       // await fs.writeFile(filePath, fileToUploads.data);
//       resolve(
//         {
//           url:`/static/images/products/${filename}`,
//           asset_id: `/static/images/products/${filename}`,
//           public_id: `/static/images/products/${filename}`,
//         },
//         {
//           resource_type: "auto",
//         }
//       );

//       // Resolve the promise with the download link
//       // resolve({ download_link: `/static/images/products/${filename}` });
//     } catch (error) {
//       reject(error); // Properly reject the promise in case of errors
//     }
//   });
// };

// const cloudinaryDeleteImg = async (fileToDelete) => {
//   return new Promise((resolve) => {
//     cloudinary.uploader.destroy(fileToDelete, (result) => {
//       resolve(
//         {
//           url: result.secure_url,
//           asset_id: result.asset_id,
//           public_id: result.public_id,
//         },
//         {
//           resource_type: "auto",
//         }
//       );
//     });
//   });
// };

// module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };

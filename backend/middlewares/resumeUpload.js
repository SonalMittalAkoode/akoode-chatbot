// middleware/resumeUpload.js
const multer = require("multer");

// Storage config — save in /uploads/resumes (customize if needed)
const storage = multer.diskStorage({
  destination: "uploads/resumes/",
  filename: (req, file, cb) => {
    cb(null, `resume-${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`);
  }
});

// File filter: allow only pdf
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"));
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

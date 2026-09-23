const express = require("express");
const multer = require("multer");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  importServiceByCityDocx,
  importServiceByCountryDocx,
  importCaseStudyLatestDocx,
} = require("../controller/docxImportCtrl");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const isDocx =
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      /\.docx$/i.test(file.originalname || "");
    cb(isDocx ? null : new Error("Unsupported file type. Please upload a .docx file."), isDocx);
  },
});

const uploadDocx = (req, res, next) => {
  upload.single("docx")(req, res, (err) => {
    if (err) return res.status(400).json({ status: "fail", message: err.message });
    next();
  });
};

router.post("/service-by-city", authMiddleware, isAdmin, uploadDocx, importServiceByCityDocx);
router.post("/service-by-country", authMiddleware, isAdmin, uploadDocx, importServiceByCountryDocx);
router.post("/case-study-latest", authMiddleware, isAdmin, uploadDocx, importCaseStudyLatestDocx);

module.exports = router;

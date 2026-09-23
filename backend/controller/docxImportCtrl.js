const asyncHandler = require("express-async-handler");
const {
  importCityDocx,
  importCountryDocx,
  importCaseStudyDocx,
} = require("../services/docxImporter");

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function assertValidUpload(req) {
  if (!req.file) {
    const err = new Error("No file uploaded. Please upload a .docx file.");
    err.statusCode = 400;
    throw err;
  }
  const nameOk = /\.docx$/i.test(req.file.originalname || "");
  if (req.file.mimetype !== DOCX_MIME || !nameOk) {
    const err = new Error("Unsupported file type. Please upload a .docx file.");
    err.statusCode = 400;
    throw err;
  }
}

function logImportResult(kind, filename, result) {
  console.log(
    `[DOCX IMPORT] kind=${kind} file="${filename}" ` +
      `sectionsFound=${result.sectionsFound.length} sectionsMissing=${result.sectionsMissing.length} ` +
      `warnings=${result.warnings.length} errors=${result.errors.length}`
  );
}

const importServiceByCityDocx = asyncHandler(async (req, res) => {
  assertValidUpload(req);

  let result;
  try {
    result = await importCityDocx(req.file.buffer);
  } catch (err) {
    return res.status(422).json({
      status: "fail",
      message: "Unable to read this document. Please verify that the DOCX file is valid.",
    });
  }

  logImportResult("service-by-city", req.file.originalname, result);
  return res.status(200).json({
    status: result.errors.length ? "needs-review" : "success",
    fileName: req.file.originalname,
    data: result.data,
    errors: result.errors,
    warnings: result.warnings,
    sectionsFound: result.sectionsFound,
    sectionsMissing: result.sectionsMissing,
  });
});

const importServiceByCountryDocx = asyncHandler(async (req, res) => {
  assertValidUpload(req);

  let result;
  try {
    result = await importCountryDocx(req.file.buffer);
  } catch (err) {
    return res.status(422).json({
      status: "fail",
      message: "Unable to read this document. Please verify that the DOCX file is valid.",
    });
  }

  logImportResult("service-by-country", req.file.originalname, result);
  return res.status(200).json({
    status: result.errors.length ? "needs-review" : "success",
    fileName: req.file.originalname,
    data: result.data,
    errors: result.errors,
    warnings: result.warnings,
    sectionsFound: result.sectionsFound,
    sectionsMissing: result.sectionsMissing,
  });
});

const importCaseStudyLatestDocx = asyncHandler(async (req, res) => {
  assertValidUpload(req);

  let result;
  try {
    result = await importCaseStudyDocx(req.file.buffer);
  } catch (err) {
    return res.status(422).json({
      status: "fail",
      message: "Unable to read this document. Please verify that the DOCX file is valid.",
    });
  }

  logImportResult("case-study-latest", req.file.originalname, result);
  return res.status(200).json({
    status: result.errors.length ? "needs-review" : "success",
    fileName: req.file.originalname,
    data: result.data,
    errors: result.errors,
    warnings: result.warnings,
    sectionsFound: result.sectionsFound,
    sectionsMissing: result.sectionsMissing,
  });
});

module.exports = {
  importServiceByCityDocx,
  importServiceByCountryDocx,
  importCaseStudyLatestDocx,
};

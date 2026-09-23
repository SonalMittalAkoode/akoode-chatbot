const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { caseStudyLatestUploadMiddleware } = require("../middlewares/uploadImage");
const {
  createCaseStudyLatest,
  updateCaseStudyLatest,
  deleteCaseStudyLatest,
  getCaseStudyLatest,
  getAllCaseStudyLatest,
} = require("../controller/caseStudyLatestCtrl");

router.post("/", authMiddleware, isAdmin, caseStudyLatestUploadMiddleware, createCaseStudyLatest);
router.put("/:id", authMiddleware, isAdmin, caseStudyLatestUploadMiddleware, updateCaseStudyLatest);
router.delete("/:id", authMiddleware, isAdmin, deleteCaseStudyLatest);
router.get("/:id", getCaseStudyLatest);
router.get("/", getAllCaseStudyLatest);

module.exports = router;

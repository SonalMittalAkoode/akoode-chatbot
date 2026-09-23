const express = require("express");
const router = express.Router();
const {
  getAllCaseStudyLatest,
  getCaseStudyLatestBySlug,
} = require("../../controller/frontend/caseStudyLatestCtrl");

router.get("/list", getAllCaseStudyLatest);
router.get("/slug/:slug", getCaseStudyLatestBySlug);

module.exports = router;

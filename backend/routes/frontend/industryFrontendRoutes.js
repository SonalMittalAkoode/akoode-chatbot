const express = require("express");
const router = express.Router();
const { getPublishedBySlug, listPublished } = require("../../controller/frontend/industryFrontendCtrl");

router.get("/list", listPublished);
router.get("/slug/:slug", getPublishedBySlug);

module.exports = router;

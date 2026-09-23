const express = require("express");

const {
  getBuilder,
  getallBuilder,
  getBuilderSlug,
  getBuilderWithProperty
} = require("../../controller/frontend/builderCtrl");
const router = express.Router();
router.get("/byid/:id", getBuilder);
router.get("/byidwithproperty/slug/:slug", getBuilderWithProperty);
router.get("/list", getallBuilder);
router.get("/slug/:slug", getBuilderSlug);
// router.get("/builderlistwithpoperty", getallBuilder);

module.exports = router;

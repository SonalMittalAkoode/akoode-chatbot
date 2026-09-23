const express = require("express");
const {
  getService,
  getallServiceList,
  getallServiceIdList,
  getallServiceFilterList,
  getServiceSlug,
  createService,
  ServiceListByPage,
  ServiceListTrends,
  ServiceListByBuilder
} = require("../../controller/frontend/ServicesFrontendCtrl");
const { uploadPhoto ,photoUploadMiddleware} = require("../../middlewares/uploadImage");
const router = express.Router();

router.get("/detail/:id", getService);
router.get("/list", getallServiceList);
router.get("/Serviceidlist", getallServiceIdList);
router.get("/filterlist", getallServiceFilterList);
router.get("/slug/:slug", getServiceSlug);
// router.post("/detail/:id", getService);
router.post("/sell",  photoUploadMiddleware,createService);
router.get("/Servicelistpage/:slug",  ServiceListByPage);
router.get("/Servicelisttrends",  ServiceListTrends);
router.get("/Servicelistbuilder/:id",  ServiceListByBuilder);
module.exports = router;

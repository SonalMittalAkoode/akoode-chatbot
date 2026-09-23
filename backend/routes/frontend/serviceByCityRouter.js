const express = require("express");
const router = express.Router();
const { getServiceByCity, getAllServiceByCity, getServiceByCitySlug } = require("../../controller/frontend/serviceByCityCtrl");

router.get("/list", getAllServiceByCity);
router.get("/slug/:slug", getServiceByCitySlug);
router.get("/byid/:id", getServiceByCity);

module.exports = router;

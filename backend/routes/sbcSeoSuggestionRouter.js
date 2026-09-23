const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  generateServiceByCountrySeoSuggestion,
  generateServiceByCountryFieldSuggestion,
  generateServiceByCitySeoSuggestion,
  generateServiceByCityFieldSuggestion,
} = require("../controller/sbcSeoSuggestionCtrl");

const router = express.Router();
const allowLocalSuggestionTest = process.env.LOCAL_AI_SUGGESTION_TEST === "true";

if (allowLocalSuggestionTest) {
  router.post("/service-by-country", generateServiceByCountrySeoSuggestion);
  router.post("/service-by-country/field", generateServiceByCountryFieldSuggestion);
  router.post("/service-by-city", generateServiceByCitySeoSuggestion);
  router.post("/service-by-city/field", generateServiceByCityFieldSuggestion);
} else {
  router.post("/service-by-country", authMiddleware, isAdmin, generateServiceByCountrySeoSuggestion);
  router.post("/service-by-country/field", authMiddleware, isAdmin, generateServiceByCountryFieldSuggestion);
  router.post("/service-by-city", authMiddleware, isAdmin, generateServiceByCitySeoSuggestion);
  router.post("/service-by-city/field", authMiddleware, isAdmin, generateServiceByCityFieldSuggestion);
}

module.exports = router;

const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createIndustry,
  updateIndustry,
  deleteIndustry,
  togglePublishIndustry,
  getIndustry,
  getIndustryBySlug,
  getAllIndustries,
} = require("../controller/industryCtrl");

router.post("/", authMiddleware, isAdmin, createIndustry);
router.put("/:id", authMiddleware, isAdmin, updateIndustry);
router.delete("/:id", authMiddleware, isAdmin, deleteIndustry);
router.patch("/:id/toggle-publish", authMiddleware, isAdmin, togglePublishIndustry);
router.get("/slug/:slug", getIndustryBySlug);
router.get("/:id", getIndustry);
router.get("/", getAllIndustries);

module.exports = router;

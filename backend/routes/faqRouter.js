const express = require("express");
const {
  createFaq,
  updateFaq,
  deleteFaq,
  getFaq,
  getallFaq,
} = require("../controller/faqCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const revalidateOnWrite = require("../utils/revalidateOnWrite");
const router = express.Router();

// Purge the frontend cache tag for this content type after any successful write.
router.use(revalidateOnWrite("faq"));

router.post("/", authMiddleware, isAdmin,
 createFaq);
router.put("/:id", authMiddleware, isAdmin, updateFaq);
router.delete("/:id", authMiddleware, isAdmin, deleteFaq);
router.get("/:id", getFaq);
router.get("/", getallFaq);

module.exports = router;

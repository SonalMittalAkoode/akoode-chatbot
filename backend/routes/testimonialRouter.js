const express = require("express");

// const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });
const { uploadPhoto } = require("../middlewares/uploadImage");

const {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonial,
  getallTestimonial,
} = require("../controller/testimonialCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const revalidateOnWrite = require("../utils/revalidateOnWrite");
const router = express.Router();

// Purge the frontend cache tag for this content type after any successful write.
router.use(revalidateOnWrite("testimonial"));

router.post("/", authMiddleware, isAdmin, uploadPhoto.array("logo", 10),
 createTestimonial);
router.put("/:id", authMiddleware, isAdmin,uploadPhoto.array("logo", 10), updateTestimonial);
router.delete("/:id", authMiddleware, isAdmin, deleteTestimonial);
router.get("/:id", getTestimonial);
router.get("/", getallTestimonial);

module.exports = router;

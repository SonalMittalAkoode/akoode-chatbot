const express = require("express");
const revalidateOnWrite = require("../utils/revalidateOnWrite");
const router = express.Router();

// Purge the frontend cache tag for this content type after any successful write.
router.use(revalidateOnWrite("video"));
const {
    createVideo,
    getAllVideos,
    getVideo,
    updateVideo,
    deleteVideo
} = require("../controller/videoCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadPhoto } = require("../middlewares/uploadImage");

router.post("/", authMiddleware, isAdmin, uploadPhoto.single("image"), createVideo);
router.get("/", authMiddleware, isAdmin, getAllVideos);
router.get("/:id", authMiddleware, isAdmin, getVideo);
router.put("/:id", authMiddleware, isAdmin, uploadPhoto.single("image"), updateVideo);
router.delete("/:id", authMiddleware, isAdmin, deleteVideo);

module.exports = router;

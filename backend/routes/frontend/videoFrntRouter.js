const express = require("express");

const {
  getVideo,
  getallVideo,
} = require("../../controller/frontend/videoFrntCtrl");
const router = express.Router();

router.get("/byid/:id", getVideo);
router.get("/", getallVideo);
module.exports = router;

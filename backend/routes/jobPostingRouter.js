// routes/jobPosting.routes.js
const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  toggleJobActive,
} = require('../controller/jobPostingCtrl');
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post('/', authMiddleware, isAdmin, createJob);
router.get('/', getJobs);
router.get('/:id', getJob);
router.put('/:id', authMiddleware, isAdmin, updateJob);
router.delete('/:id', authMiddleware, isAdmin, deleteJob);

// Toggle isActive (PATCH is clean for partial update)
router.patch('/:id/toggle-active', authMiddleware, isAdmin, toggleJobActive);

module.exports = router;

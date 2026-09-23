
const express = require('express');
const router = express.Router();
const { getFrontendJobs, getJobBySlug } = require('../../controller/frontend/jobFrntCtrl');

router.get('/jobs', getFrontendJobs);
router.get('/:slug', getJobBySlug);

module.exports = router;

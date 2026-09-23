// routes/careerPage.routes.js

const express = require('express');
const router = express.Router();
const {
  createCareerPage,
  getAllCareerPages,
  getCareerPageById,
  updateCareerPage,
  deleteCareerPage,
} = require('../controller/careerCtrl');


router.post('/', createCareerPage);
router.get('/', getAllCareerPages);
router.get('/:id', getCareerPageById);
router.put('/:id', updateCareerPage);
router.delete('/:id', deleteCareerPage);

module.exports = router;

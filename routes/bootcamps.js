const express = require('express');
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

const courseRouter = require('./courses');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

  router.use('/:bootcampId/courses', courseRouter);
  router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
  router.route('/:id/photo').put(protect, bootcampPhotoUpload);

module.exports = router;

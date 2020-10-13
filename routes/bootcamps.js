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
const router = express.Router();

router.route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

  router.use('/:bootcampId/courses', courseRouter);
  router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
  router.route('/:id/photo').put(bootcampPhotoUpload);

module.exports = router;

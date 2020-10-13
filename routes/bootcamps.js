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
const courseRouter = require('./courses');
const router = express.Router();

router.route('/').get(getBootcamps).post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

  router.use('/:bootcampId/courses', courseRouter);
  router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
  router.route('/:id/photo').put(bootcampPhotoUpload);

module.exports = router;

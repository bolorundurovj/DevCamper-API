const Bootcamp = require('../models/Bootcamp');
const colors = require('colors');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geocode = require('../utils/geocoder');
const path = require('path');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  //Copy req query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //Loop over removeFields and remove them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //Create query string
  let query;
  let queryStr = JSON.stringify(reqQuery);

  //Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //Finding resource
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

  //Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    console.log(fields);
    query = query.select(fields);
    console.log(query);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    console.log(sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const startIndex = skip;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(skip).limit(limit);

  //Executing query
  const bootcamps = await query;

  //Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// @desc    Get a single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Resource not found with ID of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Create a new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Unable to update resource with ID of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Unable to delete resource with ID of ${req.params.id}`,
        404
      )
    );
  }
  bootcamp.remove();
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Get bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get Lat&Lng from geocoder
  const loc = await geocode.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //Calc radius using radians
  //Divide distance by earth's radius
  //Earth radius = 6378.1km
  const radius = distance / 6378;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc    Upload photo for bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with ID: ${req.params.id}`, 404)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  //Make sure file is an image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`File is not an image`, 400));
  }

  //Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} in size.`,
        400
      )
    );
  }

  //Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(
        new ErrorResponse(`AN error occurred uploading the image`, 500)
      );
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({ success: true, data: file.name });
  });
});

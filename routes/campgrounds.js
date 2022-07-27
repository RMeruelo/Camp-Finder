const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync")
const {isLoggedin, isAuthor, validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const{ storage } = require('../cloudinary')
const upload = multer({ storage })




router.route('/')
  .get(catchAsync(campgrounds.index))
  .post(isLoggedin ,upload.array('image'),validateCampground ,catchAsync(campgrounds.createNewCampground))


router.get('/new', isLoggedin , campgrounds.renderNewPage)

router.get('/:id/edit', isLoggedin, isAuthor , catchAsync(campgrounds.renderEditCamproundsPage))

router.route('/:id')
  .put(isLoggedin ,  isAuthor, upload.array('image'),validateCampground , catchAsync(campgrounds.editCampground))
  .get(catchAsync(campgrounds.renderCampgroundDetailsPage))
  .delete(isLoggedin, isAuthor ,catchAsync(campgrounds.deleteCampground))
  
  module.exports = router;
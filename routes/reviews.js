const express = require('express');
const router = express.Router( {mergeParams: true});
const catchAsync = require("../utils/catchAsync")
const {isLoggedin, isReviewAuthor, validateReview} = require('../middleware');
const reviews = require('../controllers/reviews')

//posts a new review
router.post('/', isLoggedin,validateReview, catchAsync(reviews.createNewReview))

// deletes review
router.delete('/:reviewId',isLoggedin, isReviewAuthor ,catchAsync(reviews.deleteReview))

module.exports = router;
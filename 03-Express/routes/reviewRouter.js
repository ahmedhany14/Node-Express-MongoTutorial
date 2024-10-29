const express = require('express')
const { writeReview, getReviews } = require('./../controller/reviewsContorl')
const { protect } = require('./../controller/authContoller')
const router = express.Router();


router.route('/:id')
    .post(protect, writeReview)
    .get(protect, getReviews)

module.exports = router
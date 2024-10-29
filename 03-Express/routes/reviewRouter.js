const express = require('express')
const { writeReview, getReviews } = require('./../controller/reviewsContorl')
const { protect, Permission } = require('./../controller/authContoller')
const router = express.Router();


router.route('/:id')
    .post(protect, writeReview)
    .get(protect, Permission('user'), getReviews)

module.exports = router
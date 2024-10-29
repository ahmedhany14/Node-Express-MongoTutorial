const express = require('express')
const { writeReview } = require('./../controller/reviewsContorl')
const { protect } = require('./../controller/authContoller')
const router = express.Router();


router.route('/:id')
    .post(protect, writeReview)

module.exports = router
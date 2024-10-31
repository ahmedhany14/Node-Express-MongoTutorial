const express = require('express')
const { writeReview, getReviews, deleteReview, updateReview } = require('./../controller/reviewsContorl')
const { protect, Permission } = require('./../controller/authContoller')
const router = express.Router({ mergeParams: true });


router.route('/')
    .post(protect, writeReview)
    .get(protect, Permission('user'), getReviews)

router.route('/:id')
    .delete(protect, deleteReview)
    .patch(protect, updateReview)

module.exports = router